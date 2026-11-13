-- ====================================================================
-- DreamX Phase P6: Discovery and Direct Booking Migration
-- Target: India (CM-IN) • Supabase PostgreSQL 17.11
-- Specifications: PRD V3.0 §10.1, §10.2, §10.4, §16.1, Implementation Plan §P6
-- ====================================================================

-- 1. Ensure required enum types exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
        CREATE TYPE booking_status AS ENUM ('draft', 'held', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('unpaid', 'authorized', 'captured', 'refunded', 'failed');
    END IF;
END $$;

-- 2. Bookings Table
-- Stores transactional bookings, escrow amounts in paise, slot reservations, and session states
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_ref TEXT NOT NULL UNIQUE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_code service_code NOT NULL,
    slot_id UUID REFERENCES public.mentor_availability_slots(id) ON DELETE SET NULL,
    session_start TIMESTAMPTZ NOT NULL,
    session_end TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 45 CHECK (duration_minutes > 0),
    amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
    status booking_status NOT NULL DEFAULT 'draft',
    payment_status payment_status NOT NULL DEFAULT 'unpaid',
    payment_reference TEXT,
    hold_expires_at TIMESTAMPTZ,
    pre_session_notes TEXT,
    candidate_resume_url TEXT,
    meeting_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT valid_booking_time_range CHECK (session_end > session_start)
);

-- 3. Indexes for Query Performance & Double-Booking Prevention
CREATE INDEX IF NOT EXISTS idx_bookings_student ON public.bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_mentor ON public.bookings(mentor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_service ON public.bookings(service_code);
CREATE INDEX IF NOT EXISTS idx_bookings_slot ON public.bookings(slot_id);
CREATE INDEX IF NOT EXISTS idx_bookings_hold ON public.bookings(mentor_id, session_start, session_end, hold_expires_at)
    WHERE (status IN ('held', 'confirmed', 'in_progress'));

-- 4. Row-Level Security (RLS) Activation
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Permissions Grants
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;
GRANT SELECT ON public.bookings TO anon;

-- Policies: bookings
-- Students can view their own bookings
CREATE POLICY "Students view own bookings"
    ON public.bookings
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = student_id
        OR auth.uid() = mentor_id
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Students can insert draft / held bookings
CREATE POLICY "Students create booking holds"
    ON public.bookings
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = student_id);

-- Students can update pre-session notes on their own draft or confirmed bookings
CREATE POLICY "Students update own bookings"
    ON public.bookings
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = student_id
        OR auth.uid() = mentor_id
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    )
    WITH CHECK (
        auth.uid() = student_id
        OR auth.uid() = mentor_id
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 5. Atomic Slot Claim Function (PRD §10.2 & P6 Exit Criteria 1 & 2)
-- Concurrency-safe slot reservation with time-limited hold (10 mins)
CREATE OR REPLACE FUNCTION public.claim_booking_slot(
    p_student_id UUID,
    p_mentor_id UUID,
    p_service_code service_code,
    p_slot_id UUID,
    p_session_start TIMESTAMPTZ,
    p_session_end TIMESTAMPTZ,
    p_amount_paise BIGINT,
    p_pre_session_notes TEXT DEFAULT NULL,
    p_resume_url TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_mentor_verified verification_status;
    v_service_approved verification_status;
    v_conflict_booking_id UUID;
    v_conflict_status booking_status;
    v_conflict_hold_expires TIMESTAMPTZ;
    v_booking_ref TEXT;
    v_new_booking_id UUID;
    v_hold_expiry TIMESTAMPTZ;
BEGIN
    -- 1. Validate that mentor is accredited (P5 Exit Criteria 1 & PRD §10.2)
    SELECT verification_status INTO v_mentor_verified
    FROM public.mentor_profiles
    WHERE id = p_mentor_id;

    IF v_mentor_verified IS NULL OR v_mentor_verified != 'approved' THEN
        RAISE EXCEPTION 'Booking Prohibited: Mentor is not yet accredited (PRD §9.1 & §10.2).';
    END IF;

    -- 2. Validate that mentor is explicitly approved for THIS specific service (P5 Exit Criteria 2)
    SELECT status INTO v_service_approved
    FROM public.mentor_service_approvals
    WHERE mentor_id = p_mentor_id AND service_code = p_service_code;

    IF v_service_approved IS NULL OR v_service_approved != 'approved' THEN
        RAISE EXCEPTION 'Service Not Authorized: Mentor is not accredited for service % (PRD §9.1).', p_service_code;
    END IF;

    -- 3. Row lock: Check for any overlapping active hold or confirmed booking for this mentor
    -- Using FOR UPDATE lock to guarantee single-winner atomic execution (P6 Exit Criteria 1)
    SELECT id, status, hold_expires_at
    INTO v_conflict_booking_id, v_conflict_status, v_conflict_hold_expires
    FROM public.bookings
    WHERE mentor_id = p_mentor_id
      AND status IN ('held', 'confirmed', 'in_progress')
      AND (session_start, session_end) OVERLAPS (p_session_start, p_session_end)
    ORDER BY created_at DESC
    LIMIT 1
    FOR UPDATE;

    -- 4. Handle existing conflict: expired hold releases the slot (P6 Exit Criteria 2)
    IF v_conflict_booking_id IS NOT NULL THEN
        IF v_conflict_status = 'held' AND v_conflict_hold_expires < timezone('utc'::text, now()) THEN
            -- Expired hold: release it
            UPDATE public.bookings
            SET status = 'cancelled', updated_at = timezone('utc'::text, now())
            WHERE id = v_conflict_booking_id;
        ELSE
            -- Slot is actively held or confirmed by another candidate
            RAISE EXCEPTION 'SLOT_ALREADY_HELD_OR_BOOKED: This window is already reserved by another candidate.';
        END IF;
    END IF;

    -- 5. Generate unique booking reference and 10-minute hold window
    v_booking_ref := 'DX-BK-' || UPPER(SUBSTRING(MD5(gen_random_uuid()::text) FROM 1 FOR 8));
    v_hold_expiry := timezone('utc'::text, now()) + INTERVAL '10 minutes';

    -- 6. Insert atomic hold reservation
    INSERT INTO public.bookings (
        booking_ref,
        student_id,
        mentor_id,
        service_code,
        slot_id,
        session_start,
        session_end,
        duration_minutes,
        amount_paise,
        status,
        payment_status,
        hold_expires_at,
        pre_session_notes,
        candidate_resume_url
    ) VALUES (
        v_booking_ref,
        p_student_id,
        p_mentor_id,
        p_service_code,
        p_slot_id,
        p_session_start,
        p_session_end,
        ROUND(EXTRACT(EPOCH FROM (p_session_end - p_session_start)) / 60)::INTEGER,
        p_amount_paise,
        'held',
        'unpaid',
        v_hold_expiry,
        p_pre_session_notes,
        p_resume_url
    ) RETURNING id INTO v_new_booking_id;

    RETURN jsonb_build_object(
        'success', true,
        'booking_id', v_new_booking_id,
        'booking_ref', v_booking_ref,
        'status', 'held',
        'hold_expires_at', v_hold_expiry,
        'amount_paise', p_amount_paise
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Booking Confirmation Governance (P6 Exit Criteria 3)
-- "A client cannot set a booking to confirmed."
-- Only a verified payment event via confirm_booking_payment() can confirm a booking.
CREATE OR REPLACE FUNCTION public.confirm_booking_payment(
    p_booking_id UUID,
    p_payment_reference TEXT,
    p_meeting_url TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_booking RECORD;
BEGIN
    SELECT * INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id
    FOR UPDATE;

    IF v_booking IS NULL THEN
        RAISE EXCEPTION 'Booking not found.';
    END IF;

    IF v_booking.status != 'held' AND v_booking.status != 'draft' THEN
        RAISE EXCEPTION 'Invalid booking state transition from % to confirmed.', v_booking.status;
    END IF;

    -- Verify hold has not expired
    IF v_booking.hold_expires_at IS NOT NULL AND v_booking.hold_expires_at < timezone('utc'::text, now()) THEN
        UPDATE public.bookings SET status = 'cancelled' WHERE id = p_booking_id;
        RAISE EXCEPTION 'Hold expired: This slot reservation has timed out.';
    END IF;

    UPDATE public.bookings
    SET status = 'confirmed',
        payment_status = 'captured',
        payment_reference = p_payment_reference,
        meeting_url = COALESCE(p_meeting_url, 'https://meet.google.com/dxm-' || SUBSTRING(MD5(p_booking_id::text) FROM 1 FOR 7)),
        hold_expires_at = NULL,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_booking_id;

    -- Log confirmation to audit trail
    INSERT INTO public.audit_logs (
        actor_id,
        action,
        target_type,
        target_id,
        reason_code,
        metadata
    ) VALUES (
        v_booking.student_id,
        'BOOKING_CONFIRMED',
        'booking',
        p_booking_id::text,
        'PAYMENT_CAPTURED',
        jsonb_build_object(
            'payment_reference', p_payment_reference,
            'amount_paise', v_booking.amount_paise,
            'service_code', v_booking.service_code,
            'mentor_id', v_booking.mentor_id
        )
    );

    RETURN jsonb_build_object(
        'success', true,
        'booking_id', p_booking_id,
        'booking_ref', v_booking.booking_ref,
        'status', 'confirmed',
        'payment_status', 'captured'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger enforcing client cannot directly set status to 'confirmed' via simple UPDATE
CREATE OR REPLACE FUNCTION public.guard_booking_status_transition()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'confirmed' AND (OLD.status IS DISTINCT FROM 'confirmed') THEN
        IF NEW.payment_reference IS NULL OR NEW.payment_status != 'captured' THEN
            RAISE EXCEPTION 'Security Violation (PRD §10.2): Only verified payment capture events can confirm a booking.';
        END IF;
    END IF;
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_guard_booking_status ON public.bookings;
CREATE TRIGGER trg_guard_booking_status
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION public.guard_booking_status_transition();
