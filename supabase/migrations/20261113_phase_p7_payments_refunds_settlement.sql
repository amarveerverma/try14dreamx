-- ====================================================================
-- DreamX Phase P7: Payments, Refunds, Webhooks, and Mentor Settlement
-- Target: India (CM-IN) • Supabase PostgreSQL 17.11
-- Specifications: PRD V3.0 §13, §16.1, Implementation Plan §P7, Exit Criteria 1-4
-- ====================================================================

-- 1. Create Enums for Payment, Refund, and Settlement Lifecycles
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'refund_status') THEN
        CREATE TYPE refund_status AS ENUM ('initiated', 'processing', 'completed', 'failed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'settlement_status') THEN
        CREATE TYPE settlement_status AS ENUM ('accrued', 'in_escrow', 'eligible_for_payout', 'processing', 'settled', 'on_hold', 'forfeited');
    END IF;
END $$;

-- 2. Payment Transactions Table (Idempotent Webhook & Payment Logs)
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    provider TEXT NOT NULL, -- 'cashfree', 'razorpay', 'test_mode'
    provider_order_id TEXT NOT NULL,
    provider_payment_id TEXT,
    idempotency_key TEXT NOT NULL UNIQUE,
    amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'created', -- 'created', 'authorized', 'captured', 'failed', 'refunded'
    webhook_signature TEXT,
    raw_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_booking ON public.payment_transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_provider_order ON public.payment_transactions(provider_order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_idempotency ON public.payment_transactions(idempotency_key);

-- 3. Refunds Table (PRD §13 & §16.1)
CREATE TABLE IF NOT EXISTS public.refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    payment_transaction_id UUID REFERENCES public.payment_transactions(id) ON DELETE SET NULL,
    amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
    reason TEXT NOT NULL,
    status refund_status NOT NULL DEFAULT 'initiated',
    provider_refund_id TEXT,
    refund_arn TEXT, -- Bank Acquirer Reference Number
    idempotency_key TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_refunds_booking ON public.refunds(booking_id);
CREATE INDEX IF NOT EXISTS idx_refunds_idempotency ON public.refunds(idempotency_key);

-- 4. Mentor Settlements Ledger (Escrow & 80/20 Commercial Split)
-- PRD §13: DreamX operates on an escrow model. Funds are accrued upon booking confirmation,
-- held in escrow during session delivery, and settled to the mentor after deliverable sign-off.
CREATE TABLE IF NOT EXISTS public.mentor_settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE,
    gross_amount_paise BIGINT NOT NULL CHECK (gross_amount_paise > 0),
    platform_fee_paise BIGINT NOT NULL DEFAULT 0 CHECK (platform_fee_paise >= 0),
    tds_deduction_paise BIGINT NOT NULL DEFAULT 0 CHECK (tds_deduction_paise >= 0),
    net_payout_paise BIGINT NOT NULL CHECK (net_payout_paise >= 0),
    payout_status settlement_status NOT NULL DEFAULT 'in_escrow',
    payout_batch_id TEXT,
    payout_utr TEXT, -- Unique Transaction Reference from Bank
    settled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_mentor_settlements_mentor ON public.mentor_settlements(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_settlements_status ON public.mentor_settlements(payout_status);

-- 5. Row-Level Security (RLS)
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_settlements ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT SELECT ON public.payment_transactions TO authenticated;
GRANT SELECT ON public.refunds TO authenticated;
GRANT SELECT ON public.mentor_settlements TO authenticated;

-- Policies: Payment Transactions
CREATE POLICY "Users view own payment transactions"
    ON public.payment_transactions
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = payment_transactions.booking_id
              AND (b.student_id = auth.uid() OR b.mentor_id = auth.uid())
        )
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Policies: Refunds
CREATE POLICY "Users view own refunds"
    ON public.refunds
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = refunds.booking_id
              AND (b.student_id = auth.uid() OR b.mentor_id = auth.uid())
        )
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Policies: Mentor Settlements
CREATE POLICY "Mentors view own settlements"
    ON public.mentor_settlements
    FOR SELECT
    TO authenticated
    USING (
        mentor_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 6. P7 Stored Procedure: Idempotent Webhook Payment Processing
-- (P7 Exit Criteria 1: Replayed or invalid webhooks create no duplicate payment or booking)
CREATE OR REPLACE FUNCTION public.process_payment_webhook(
    p_idempotency_key TEXT,
    p_booking_id UUID,
    p_provider TEXT,
    p_provider_order_id TEXT,
    p_provider_payment_id TEXT,
    p_amount_paise BIGINT,
    p_status TEXT,
    p_signature TEXT,
    p_raw_payload JSONB
)
RETURNS JSONB AS $$
DECLARE
    v_existing_tx RECORD;
    v_booking RECORD;
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

        -- Calculate Commercial Split (80% Mentor, 20% Platform Fee per PRD §13)
        v_platform_cut_paise := ROUND(p_amount_paise * 0.20);
        v_mentor_net_paise := p_amount_paise - v_platform_cut_paise;

        -- Record Escrow Accrual in mentor_settlements
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
            p_amount_paise,
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

-- 7. P7 Stored Procedure: Initiate Refund
CREATE OR REPLACE FUNCTION public.initiate_booking_refund(
    p_booking_id UUID,
    p_amount_paise BIGINT,
    p_reason TEXT,
    p_idempotency_key TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_booking RECORD;
    v_new_refund_id UUID;
BEGIN
    SELECT * INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id
    FOR UPDATE;

    IF v_booking IS NULL THEN
        RAISE EXCEPTION 'Booking not found.';
    END IF;

    -- Insert refund record
    INSERT INTO public.refunds (
        booking_id,
        amount_paise,
        reason,
        status,
        idempotency_key
    ) VALUES (
        p_booking_id,
        p_amount_paise,
        p_reason,
        'initiated',
        p_idempotency_key
    ) RETURNING id INTO v_new_refund_id;

    -- Update booking status
    UPDATE public.bookings
    SET status = 'refunded',
        payment_status = 'refunded',
        updated_at = timezone('utc'::text, now())
    WHERE id = p_booking_id;

    -- Update mentor settlement status to forfeited
    UPDATE public.mentor_settlements
    SET payout_status = 'forfeited',
        updated_at = timezone('utc'::text, now())
    WHERE booking_id = p_booking_id;

    -- Audit Log
    INSERT INTO public.audit_logs (
        actor_id,
        action,
        target_type,
        target_id,
        reason_code,
        metadata
    ) VALUES (
        v_booking.student_id,
        'REFUND_INITIATED',
        'booking',
        p_booking_id::text,
        p_reason,
        jsonb_build_object(
            'refund_id', v_new_refund_id,
            'amount_paise', p_amount_paise
        )
    );

    RETURN jsonb_build_object(
        'success', true,
        'refund_id', v_new_refund_id,
        'status', 'initiated'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. P7 Reconciliation Stored Procedure for Finance
-- (P7 Exit Criteria 4: Finance can reconcile a day's payments against the provider)
CREATE OR REPLACE FUNCTION public.reconcile_daily_payments(p_date DATE)
RETURNS TABLE (
    total_transactions BIGINT,
    total_gross_paise BIGINT,
    total_platform_fees_paise BIGINT,
    total_mentor_net_paise BIGINT,
    total_refunds_count BIGINT,
    total_refunded_paise BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(pt.id)::BIGINT AS total_transactions,
        COALESCE(SUM(pt.amount_paise), 0)::BIGINT AS total_gross_paise,
        COALESCE(SUM(ms.platform_fee_paise), 0)::BIGINT AS total_platform_fees_paise,
        COALESCE(SUM(ms.net_payout_paise), 0)::BIGINT AS total_mentor_net_paise,
        (SELECT COUNT(*)::BIGINT FROM public.refunds r WHERE DATE(r.created_at) = p_date) AS total_refunds_count,
        (SELECT COALESCE(SUM(r.amount_paise), 0)::BIGINT FROM public.refunds r WHERE DATE(r.created_at) = p_date) AS total_refunded_paise
    FROM public.payment_transactions pt
    LEFT JOIN public.mentor_settlements ms ON ms.booking_id = pt.booking_id
    WHERE DATE(pt.created_at) = p_date
      AND pt.status = 'captured';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
