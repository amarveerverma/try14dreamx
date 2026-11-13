-- ==============================================================================
-- Migration: Phase P10 Mentor Payout Protection & List Price Guarantee
-- Description: Enforces PRD §7.3 and P10 Exit Criteria 3:
-- "Mentor payout uses the original list price as approved. Platform absorbs the
--  discount; mentors always receive 80% of the original gross list price."
-- ==============================================================================

-- 1. Update process_payment_webhook to calculate mentor net payout based on approved list price
CREATE OR REPLACE FUNCTION public.process_payment_webhook(
    p_booking_id UUID,
    p_provider TEXT,
    p_provider_order_id TEXT,
    p_provider_payment_id TEXT,
    p_idempotency_key TEXT,
    p_amount_paise BIGINT,
    p_status payment_status,
    p_signature TEXT,
    p_raw_payload JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB AS $$
DECLARE
    v_existing_tx RECORD;
    v_booking RECORD;
    v_service_list_paise BIGINT;
    v_platform_cut_paise BIGINT;
    v_mentor_net_paise BIGINT;
    v_new_tx_id UUID;
BEGIN
    -- 1. Idempotency Check: if this webhook has already been processed, return cleanly without duplicating
    SELECT * INTO v_existing_tx
    FROM public.payment_transactions
    WHERE idempotency_key = p_idempotency_key;

    IF v_existing_tx IS NOT NULL THEN
        RETURN jsonb_build_object(
            'status', 'already_processed',
            'transaction_id', v_existing_tx.id,
            'message', 'Duplicate webhook event ignored safely (Idempotent).'
        );
    END IF;

    -- 2. Lock and retrieve booking
    SELECT * INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id
    FOR UPDATE;

    IF v_booking IS NULL THEN
        RAISE EXCEPTION 'Booking not found for payment processing.';
    END IF;

    -- 3. Record transaction row
    INSERT INTO public.payment_transactions (
        booking_id,
        provider,
        provider_order_id,
        provider_payment_id,
        idempotency_key,
        amount_paise,
        status,
        webhook_signature,
        raw_payload
    ) VALUES (
        p_booking_id,
        p_provider,
        p_provider_order_id,
        p_provider_payment_id,
        p_idempotency_key,
        p_amount_paise,
        p_status,
        p_signature,
        p_raw_payload
    ) RETURNING id INTO v_new_tx_id;

    -- 4. If payment was captured, confirm booking and accrue mentor settlement escrow
    IF p_status = 'captured' THEN
        -- Confirm booking using the established P6 confirmation routine
        PERFORM public.confirm_booking_payment(
            p_booking_id,
            p_provider_payment_id,
            'https://meet.google.com/dxm-' || SUBSTRING(MD5(p_booking_id::text) FROM 1 FOR 7)
        );

        -- Retrieve original approved list price for this service (PRD §7.3, P10 Exit Criteria 3)
        -- Mentor payout is ALWAYS 80% of original list price; DreamX margins absorb candidate discount
        SELECT list_paise INTO v_service_list_paise
        FROM public.services
        WHERE code = v_booking.service_code;

        IF v_service_list_paise IS NULL OR v_service_list_paise <= 0 THEN
            v_service_list_paise := p_amount_paise;
        END IF;

        v_mentor_net_paise := ROUND(v_service_list_paise * 0.80);
        v_platform_cut_paise := p_amount_paise - v_mentor_net_paise;

        -- Record Escrow Accrual in mentor_settlements based on approved list price
        INSERT INTO public.mentor_settlements (
            mentor_id,
            booking_id,
            gross_amount_paise,
            platform_fee_paise,
            tds_deduction_paise,
            net_payout_paise,
            payout_status
        ) VALUES (
            v_booking.mentor_id,
            p_booking_id,
            v_service_list_paise,
            v_platform_cut_paise,
            0, -- TDS calculated during quarterly PAN aggregation
            v_mentor_net_paise,
            'in_escrow'
        ) ON CONFLICT (booking_id) DO NOTHING;

    ELSIF p_status = 'failed' THEN
        UPDATE public.bookings
        SET payment_status = 'failed',
            updated_at = timezone('utc'::text, now())
        WHERE id = p_booking_id;
    END IF;

    RETURN jsonb_build_object(
        'status', 'success',
        'transaction_id', v_new_tx_id,
        'booking_id', p_booking_id,
        'payment_status', p_status
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Update accept_smart_match_dispatch to calculate mentor net payout based on approved list price
CREATE OR REPLACE FUNCTION public.accept_smart_match_dispatch(
    p_dispatch_id UUID,
    p_mentor_id UUID,
    p_proposed_slot TIMESTAMPTZ DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_dispatch RECORD;
    v_req RECORD;
    v_booking_id UUID;
    v_booking_ref TEXT;
    v_session_start TIMESTAMPTZ;
    v_session_end TIMESTAMPTZ;
    v_service_list_paise BIGINT;
    v_mentor_net_paise BIGINT;
    v_platform_fee_paise BIGINT;
BEGIN
    -- 1. Lock and validate dispatch
    SELECT * INTO v_dispatch
    FROM public.smart_match_dispatches
    WHERE id = p_dispatch_id AND mentor_id = p_mentor_id
    FOR UPDATE;

    IF v_dispatch IS NULL THEN
        RAISE EXCEPTION 'Dispatch assignment not found for this mentor.';
    END IF;

    IF v_dispatch.status != 'offered' THEN
        RAISE EXCEPTION 'This dispatch offer is no longer valid (Current status: %).', v_dispatch.status;
    END IF;

    IF timezone('utc'::text, now()) > v_dispatch.expires_at THEN
        UPDATE public.smart_match_dispatches
        SET status = 'expired', updated_at = timezone('utc'::text, now())
        WHERE id = p_dispatch_id;
        RAISE EXCEPTION 'Dispatch offer has expired (10-minute SLA window passed).';
    END IF;

    -- 2. Lock and validate request
    SELECT * INTO v_req
    FROM public.smart_match_requests
    WHERE id = v_dispatch.request_id
    FOR UPDATE;

    IF v_req IS NULL THEN
        RAISE EXCEPTION 'Smart Match request not found.';
    END IF;

    IF v_req.status != 'broadcasting' THEN
        RAISE EXCEPTION 'Smart match request is no longer accepting mentors (Current status: %).', v_req.status;
    END IF;

    -- 3. Determine session start & end times
    v_session_start := COALESCE(p_proposed_slot, v_req.window_start);
    v_session_end := v_session_start + INTERVAL '45 minutes';

    -- 4. Mark this dispatch as accepted
    UPDATE public.smart_match_dispatches
    SET status = 'accepted', updated_at = timezone('utc'::text, now())
    WHERE id = p_dispatch_id;

    -- 5. Mark other dispatches for this request as retracted (First-to-accept wins)
    UPDATE public.smart_match_dispatches
    SET status = 'retracted', updated_at = timezone('utc'::text, now())
    WHERE request_id = v_dispatch.request_id AND id != p_dispatch_id AND status = 'offered';

    -- 6. Generate booking reference and convert to confirmed booking
    v_booking_ref := 'DX-SM-' || UPPER(SUBSTRING(MD5(gen_random_uuid()::text) FROM 1 FOR 8));

    INSERT INTO public.bookings (
        booking_ref,
        student_id,
        mentor_id,
        service_code,
        session_start,
        session_end,
        duration_minutes,
        amount_paise,
        status,
        payment_status,
        payment_reference,
        meeting_url,
        pre_session_notes,
        candidate_resume_url
    ) VALUES (
        v_booking_ref,
        v_req.student_id,
        p_mentor_id,
        v_req.service_code,
        v_session_start,
        v_session_end,
        45,
        v_req.amount_paise,
        'confirmed',
        'captured',
        'SMART_MATCH_ESCROW_' || v_req.request_ref,
        'https://meet.google.com/dxm-' || SUBSTRING(MD5(v_req.id::text) FROM 1 FOR 7),
        v_req.pre_session_notes,
        v_req.resume_url
    ) RETURNING id INTO v_booking_id;

    -- 7. Retrieve service original list price (PRD §7.3, P10 Exit Criteria 3)
    SELECT list_paise INTO v_service_list_paise
    FROM public.services
    WHERE code = v_req.service_code;

    IF v_service_list_paise IS NULL OR v_service_list_paise <= 0 THEN
        v_service_list_paise := v_req.amount_paise;
    END IF;

    v_mentor_net_paise := ROUND(v_service_list_paise * 0.80);
    v_platform_fee_paise := v_req.amount_paise - v_mentor_net_paise;

    -- Accrue Mentor Settlement in Escrow based on approved list price
    INSERT INTO public.mentor_settlements (
        mentor_id,
        booking_id,
        gross_amount_paise,
        platform_fee_paise,
        tds_deduction_paise,
        net_payout_paise,
        payout_status
    ) VALUES (
        p_mentor_id,
        v_booking_id,
        v_service_list_paise,
        v_platform_fee_paise,
        0,
        v_mentor_net_paise,
        'in_escrow'
    ) ON CONFLICT (booking_id) DO NOTHING;

    -- Update Smart Match request status to matched
    UPDATE public.smart_match_requests
    SET status = 'matched',
        matched_mentor_id = p_mentor_id,
        matched_booking_id = v_booking_id,
        updated_at = timezone('utc'::text, now())
    WHERE id = v_dispatch.request_id;

    RETURN jsonb_build_object(
        'success', true,
        'request_id', v_dispatch.request_id,
        'dispatch_id', p_dispatch_id,
        'booking_id', v_booking_id,
        'booking_ref', v_booking_ref,
        'mentor_id', p_mentor_id,
        'gross_list_paise', v_service_list_paise,
        'mentor_payout_paise', v_mentor_net_paise,
        'status', 'confirmed'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Record migration version in schema migrations tracking table
INSERT INTO supabase_migrations.schema_migrations (version, name)
VALUES ('20261113_06', 'phase_p10_mentor_payout_protection')
ON CONFLICT (version) DO NOTHING;
