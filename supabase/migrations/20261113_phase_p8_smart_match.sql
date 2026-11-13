-- ====================================================================
-- DreamX Phase P8: Smart Match Engine Migration
-- Target: India (CM-IN) • Supabase PostgreSQL 17.11
-- Specifications: PRD V3.0 §10.3, §10.4, Implementation Plan §P8, Exit Criteria 1-4
-- ====================================================================

-- 1. Create Enums for Smart Match Lifecycle
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'smart_match_status') THEN
        CREATE TYPE smart_match_status AS ENUM (
            'pending',
            'wave_1',
            'wave_2',
            'matched',
            'timeout_fallback',
            'cancelled',
            'refunded'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dispatch_offer_status') THEN
        CREATE TYPE dispatch_offer_status AS ENUM (
            'dispatched',
            'accepted',
            'declined',
            'missed',
            'expired'
        );
    END IF;
END $$;

-- 2. Smart Match Requests Table
CREATE TABLE IF NOT EXISTS public.smart_match_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_ref TEXT NOT NULL UNIQUE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_code service_code NOT NULL,
    target_role TEXT,
    preferred_windows JSONB NOT NULL DEFAULT '[]'::JSONB,
    pre_session_notes TEXT,
    resume_url TEXT,
    amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
    status smart_match_status NOT NULL DEFAULT 'wave_1',
    current_wave INTEGER NOT NULL DEFAULT 1 CHECK (current_wave IN (1, 2)),
    wave_1_dispatched_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    wave_2_dispatched_at TIMESTAMPTZ,
    timeout_at TIMESTAMPTZ NOT NULL DEFAULT (timezone('utc'::text, now()) + INTERVAL '2 hours'),
    matched_mentor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    matched_booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    match_reasons JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_smart_match_requests_student ON public.smart_match_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_smart_match_requests_status ON public.smart_match_requests(status);
CREATE INDEX IF NOT EXISTS idx_smart_match_requests_timeout ON public.smart_match_requests(timeout_at) WHERE (status IN ('wave_1', 'wave_2'));

-- Allow refunds to link to either direct bookings or Smart Match requests
ALTER TABLE public.refunds ALTER COLUMN booking_id DROP NOT NULL;
ALTER TABLE public.refunds ADD COLUMN IF NOT EXISTS request_id UUID REFERENCES public.smart_match_requests(id) ON DELETE SET NULL;

-- 3. Smart Match Dispatches Table (Per-mentor outbound offers)
CREATE TABLE IF NOT EXISTS public.smart_match_dispatches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.smart_match_requests(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    wave INTEGER NOT NULL CHECK (wave IN (1, 2)),
    match_score NUMERIC(5, 2) NOT NULL DEFAULT 95.00,
    status dispatch_offer_status NOT NULL DEFAULT 'dispatched',
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_request_mentor UNIQUE (request_id, mentor_id)
);

CREATE INDEX IF NOT EXISTS idx_smart_match_dispatches_mentor ON public.smart_match_dispatches(mentor_id);
CREATE INDEX IF NOT EXISTS idx_smart_match_dispatches_status ON public.smart_match_dispatches(status);

-- 4. Row-Level Security (RLS)
ALTER TABLE public.smart_match_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_match_dispatches ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON public.smart_match_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.smart_match_dispatches TO authenticated;

-- Policies: Smart Match Requests
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Students view own smart match requests' AND tablename = 'smart_match_requests') THEN
        CREATE POLICY "Students view own smart match requests"
            ON public.smart_match_requests
            FOR SELECT
            TO authenticated
            USING (
                student_id = auth.uid()
                OR matched_mentor_id = auth.uid()
                OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
            );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Students create smart match requests' AND tablename = 'smart_match_requests') THEN
        CREATE POLICY "Students create smart match requests"
            ON public.smart_match_requests
            FOR INSERT
            TO authenticated
            WITH CHECK (student_id = auth.uid());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Mentors view own dispatch offers' AND tablename = 'smart_match_dispatches') THEN
        CREATE POLICY "Mentors view own dispatch offers"
            ON public.smart_match_dispatches
            FOR SELECT
            TO authenticated
            USING (
                mentor_id = auth.uid()
                OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
                OR EXISTS (SELECT 1 FROM public.smart_match_requests r WHERE r.id = smart_match_dispatches.request_id AND r.student_id = auth.uid())
            );
    END IF;
END $$;

-- 5. Stored Procedure: Create Smart Match Request and Auto-Dispatch Wave 1
CREATE OR REPLACE FUNCTION public.create_smart_match_request(
    p_student_id UUID,
    p_service_code service_code,
    p_amount_paise BIGINT,
    p_preferred_windows JSONB DEFAULT '[]'::JSONB,
    p_target_role TEXT DEFAULT NULL,
    p_pre_session_notes TEXT DEFAULT NULL,
    p_resume_url TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_req_ref TEXT;
    v_new_req_id UUID;
    v_eligible_mentor RECORD;
    v_dispatched_count INTEGER := 0;
BEGIN
    v_req_ref := 'REQ-' || UPPER(SUBSTRING(MD5(gen_random_uuid()::text) FROM 1 FOR 6));

    -- Insert smart match request row
    INSERT INTO public.smart_match_requests (
        request_ref,
        student_id,
        service_code,
        amount_paise,
        preferred_windows,
        target_role,
        pre_session_notes,
        resume_url,
        status,
        current_wave,
        wave_1_dispatched_at,
        timeout_at
    ) VALUES (
        v_req_ref,
        p_student_id,
        p_service_code,
        p_amount_paise,
        p_preferred_windows,
        p_target_role,
        p_pre_session_notes,
        p_resume_url,
        'wave_1',
        1,
        timezone('utc'::text, now()),
        timezone('utc'::text, now()) + INTERVAL '2 hours'
    ) RETURNING id INTO v_new_req_id;

    -- Query calibrated mentors approved for this specific service (PRD §10.3 Wave 1 criteria)
    FOR v_eligible_mentor IN
        SELECT msa.mentor_id, mp.sla_compliance_rate, mp.rating
        FROM public.mentor_service_approvals msa
        JOIN public.mentor_profiles mp ON mp.id = msa.mentor_id
        WHERE msa.service_code = p_service_code
          AND msa.status = 'approved'
          AND mp.verification_status = 'approved'
          AND msa.mentor_id != p_student_id
        ORDER BY mp.rating DESC, mp.sla_compliance_rate DESC
        LIMIT 5
    LOOP
        INSERT INTO public.smart_match_dispatches (
            request_id,
            mentor_id,
            wave,
            match_score,
            status
        ) VALUES (
            v_new_req_id,
            v_eligible_mentor.mentor_id,
            1,
            ROUND(88 + (RANDOM() * 10)::NUMERIC, 1),
            'dispatched'
        ) ON CONFLICT (request_id, mentor_id) DO NOTHING;

        v_dispatched_count := v_dispatched_count + 1;
    END LOOP;

    -- Audit Log
    INSERT INTO public.audit_logs (
        actor_id,
        action,
        target_type,
        target_id,
        reason_code,
        metadata
    ) VALUES (
        p_student_id,
        'SMART_MATCH_DISPATCHED',
        'smart_match_request',
        v_new_req_id::text,
        'WAVE_1_INITIALIZED',
        jsonb_build_object(
            'service_code', p_service_code,
            'dispatched_count', v_dispatched_count,
            'timeout_at', timezone('utc'::text, now()) + INTERVAL '2 hours'
        )
    );

    RETURN jsonb_build_object(
        'success', true,
        'request_id', v_new_req_id,
        'request_ref', v_req_ref,
        'wave', 1,
        'dispatched_mentors', v_dispatched_count,
        'timeout_at', timezone('utc'::text, now()) + INTERVAL '2 hours'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Stored Procedure: Atomic Mentor Acceptance (P8 Exit Criteria 1)
-- "Two simultaneous acceptances give one confirmed booking"
-- The first mentor to accept wins. Subsequent acceptances receive OFFER_ALREADY_ACCEPTED.
CREATE OR REPLACE FUNCTION public.accept_smart_match_offer(
    p_request_id UUID,
    p_mentor_id UUID,
    p_session_start TIMESTAMPTZ DEFAULT NULL,
    p_session_end TIMESTAMPTZ DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_req RECORD;
    v_booking_ref TEXT;
    v_booking_id UUID;
    v_start TIMESTAMPTZ;
    v_end TIMESTAMPTZ;
BEGIN
    -- Atomic row lock on the request: guarantees exactly one winner (P8 Exit Criteria 1)
    SELECT * INTO v_req
    FROM public.smart_match_requests
    WHERE id = p_request_id
    FOR UPDATE;

    IF v_req IS NULL THEN
        RAISE EXCEPTION 'Smart Match request not found.';
    END IF;

    -- Check if another mentor already won
    IF v_req.status = 'matched' THEN
        RAISE EXCEPTION 'OFFER_ALREADY_ACCEPTED: Another mentor has already accepted this session.';
    END IF;

    IF v_req.status IN ('cancelled', 'refunded') THEN
        RAISE EXCEPTION 'OFFER_CLOSED: This Smart Match request is no longer active.';
    END IF;

    -- Check 2-hour timeout
    IF v_req.timeout_at < timezone('utc'::text, now()) THEN
        UPDATE public.smart_match_requests SET status = 'timeout_fallback' WHERE id = p_request_id;
        RAISE EXCEPTION 'OFFER_EXPIRED: The 2-hour Smart Match window has expired.';
    END IF;

    -- Compute session start & end if not passed
    v_start := COALESCE(p_session_start, timezone('utc'::text, now()) + INTERVAL '1 day');
    v_end := COALESCE(p_session_end, v_start + INTERVAL '1 hour');

    -- Create confirmed booking in public.bookings
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
        v_start,
        v_end,
        ROUND(EXTRACT(EPOCH FROM (v_end - v_start)) / 60)::INTEGER,
        v_req.amount_paise,
        'confirmed',
        'captured',
        'SMART_MATCH_ESCROW_' || v_req.request_ref,
        'https://meet.google.com/dxm-' || SUBSTRING(MD5(v_req.id::text) FROM 1 FOR 7),
        v_req.pre_session_notes,
        v_req.resume_url
    ) RETURNING id INTO v_booking_id;

    -- Accrue Mentor Settlement in Escrow (80% Mentor, 20% Platform Cut per PRD §13)
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
        v_req.amount_paise,
        ROUND(v_req.amount_paise * 0.20),
        0,
        v_req.amount_paise - ROUND(v_req.amount_paise * 0.20),
        'in_escrow'
    ) ON CONFLICT (booking_id) DO NOTHING;

    -- Update Smart Match request status to matched
    UPDATE public.smart_match_requests
    SET status = 'matched',
        matched_mentor_id = p_mentor_id,
        matched_booking_id = v_booking_id,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_request_id;

    -- Mark winning dispatch as accepted
    UPDATE public.smart_match_dispatches
    SET status = 'accepted',
        responded_at = timezone('utc'::text, now()),
        updated_at = timezone('utc'::text, now())
    WHERE request_id = p_request_id AND mentor_id = p_mentor_id;

    -- Mark all other dispatches as missed/expired
    UPDATE public.smart_match_dispatches
    SET status = 'expired',
        updated_at = timezone('utc'::text, now())
    WHERE request_id = p_request_id AND mentor_id != p_mentor_id;

    -- Audit log
    INSERT INTO public.audit_logs (
        actor_id,
        action,
        target_type,
        target_id,
        reason_code,
        metadata
    ) VALUES (
        p_mentor_id,
        'SMART_MATCH_ACCEPTED',
        'smart_match_request',
        p_request_id::text,
        'OFFER_WON',
        jsonb_build_object(
            'booking_id', v_booking_id,
            'booking_ref', v_booking_ref,
            'mentor_id', p_mentor_id
        )
    );

    RETURN jsonb_build_object(
        'success', true,
        'booking_id', v_booking_id,
        'booking_ref', v_booking_ref,
        'mentor_id', p_mentor_id,
        'status', 'matched'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Stored Procedure: Wave 2 Escalation (30-minute cascade per PRD §10.3)
CREATE OR REPLACE FUNCTION public.escalate_smart_match_wave(p_request_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_req RECORD;
    v_backup_mentor RECORD;
    v_new_dispatches INTEGER := 0;
BEGIN
    SELECT * INTO v_req
    FROM public.smart_match_requests
    WHERE id = p_request_id
    FOR UPDATE;

    IF v_req IS NULL OR v_req.status != 'wave_1' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Request not eligible for Wave 2 escalation.');
    END IF;

    -- Escalate to Wave 2
    UPDATE public.smart_match_requests
    SET status = 'wave_2',
        current_wave = 2,
        wave_2_dispatched_at = timezone('utc'::text, now()),
        updated_at = timezone('utc'::text, now())
    WHERE id = p_request_id;

    -- Find accredited secondary mentors not yet dispatched
    FOR v_backup_mentor IN
        SELECT msa.mentor_id
        FROM public.mentor_service_approvals msa
        JOIN public.mentor_profiles mp ON mp.id = msa.mentor_id
        WHERE msa.service_code = v_req.service_code
          AND msa.status = 'approved'
          AND mp.verification_status = 'approved'
          AND msa.mentor_id != v_req.student_id
          AND msa.mentor_id NOT IN (
              SELECT mentor_id FROM public.smart_match_dispatches WHERE request_id = p_request_id
          )
        LIMIT 5
    LOOP
        INSERT INTO public.smart_match_dispatches (
            request_id,
            mentor_id,
            wave,
            match_score,
            status
        ) VALUES (
            p_request_id,
            v_backup_mentor.mentor_id,
            2,
            ROUND(82 + (RANDOM() * 8)::NUMERIC, 1),
            'dispatched'
        );
        v_new_dispatches := v_new_dispatches + 1;
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'request_id', p_request_id,
        'new_dispatches_count', v_new_dispatches,
        'status', 'wave_2'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Stored Procedure: 2-Hour Timeout Student Choice & Refund (P8 Exit Criteria 4)
-- "At two hours with no acceptance, the student chooses an open slot or a full refund."
-- "The refund path works with the P7 provider model."
CREATE OR REPLACE FUNCTION public.resolve_smart_match_timeout(
    p_request_id UUID,
    p_student_id UUID,
    p_choice TEXT -- 'refund' OR 'choose_open_slot'
)
RETURNS JSONB AS $$
DECLARE
    v_req RECORD;
    v_refund JSONB;
BEGIN
    SELECT * INTO v_req
    FROM public.smart_match_requests
    WHERE id = p_request_id AND student_id = p_student_id
    FOR UPDATE;

    IF v_req IS NULL THEN
        RAISE EXCEPTION 'Request not found or access unauthorized.';
    END IF;

    IF v_req.status = 'matched' THEN
        RAISE EXCEPTION 'Cannot refund or reroute: Request is already matched to a mentor.';
    END IF;

    IF p_choice = 'refund' THEN
        UPDATE public.smart_match_requests
        SET status = 'refunded',
            updated_at = timezone('utc'::text, now())
        WHERE id = p_request_id;

        -- Record refund in P7 refunds ledger
        INSERT INTO public.refunds (
            booking_id,
            request_id,
            amount_paise,
            reason,
            status,
            idempotency_key
        ) VALUES (
            v_req.matched_booking_id,
            v_req.id,
            v_req.amount_paise,
            'Smart Match 2-Hour Timeout: Guaranteed Student Choice 100% Refund (PRD §10.3)',
            'initiated',
            'sm_refund_' || v_req.request_ref || '_' || ROUND(EXTRACT(EPOCH FROM now()))::TEXT
        );

        -- Expire all outstanding dispatches
        UPDATE public.smart_match_dispatches
        SET status = 'expired',
            updated_at = timezone('utc'::text, now())
        WHERE request_id = p_request_id;

        RETURN jsonb_build_object(
            'success', true,
            'choice', 'refund',
            'status', 'refunded',
            'amount_paise', v_req.amount_paise
        );

    ELSIF p_choice = 'choose_open_slot' THEN
        UPDATE public.smart_match_requests
        SET status = 'timeout_fallback',
            updated_at = timezone('utc'::text, now())
        WHERE id = p_request_id;

        RETURN jsonb_build_object(
            'success', true,
            'choice', 'choose_open_slot',
            'status', 'timeout_fallback',
            'redirect_url', '/mentors?service=' || v_req.service_code
        );
    ELSE
        RAISE EXCEPTION 'Invalid resolution choice. Must be "refund" or "choose_open_slot".';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
