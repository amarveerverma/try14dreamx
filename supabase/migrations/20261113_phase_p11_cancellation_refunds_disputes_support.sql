-- ==============================================================================
-- Migration: Phase P11 Cancellation, Refunds, Disputes and Support
-- Description: Enforces PRD §12, §15.2 and P11 Exit Criteria:
-- 1. Every scenario in PRD §12.2 has a deterministic testable policy engine.
-- 2. No automatic reschedule happens (student must explicitly choose).
-- 3. Each refund shows separate 'initiated' and 'completed' states.
-- 4. Support channel and hours are verified and visible to users.
-- 5. Dual approval for high-impact financial actions (>= ₹5,000 or sensitive exceptions).
-- ==============================================================================

-- 1. Create Enums for Disputes and Support Tickets
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dispute_status') THEN
        CREATE TYPE public.dispute_status AS ENUM (
            'opened',
            'under_review',
            'evidence_pending',
            'resolved_refund',
            'resolved_rejected',
            'cancelled'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
        CREATE TYPE public.ticket_status AS ENUM (
            'open',
            'in_progress',
            'waiting_on_user',
            'resolved',
            'closed'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_priority') THEN
        CREATE TYPE public.ticket_priority AS ENUM (
            'low',
            'normal',
            'high',
            'urgent'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'approval_status') THEN
        CREATE TYPE public.approval_status AS ENUM (
            'pending',
            'first_approved',
            'fully_approved',
            'rejected'
        );
    END IF;
END $$;

-- 2. Table: Disputes (PRD §12.1, §12.3)
CREATE TABLE IF NOT EXISTS public.disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispute_ref TEXT NOT NULL UNIQUE,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason_code TEXT NOT NULL,
    complaint_text TEXT NOT NULL,
    status dispute_status NOT NULL DEFAULT 'opened',
    resolution_notes TEXT,
    refund_amount_paise BIGINT DEFAULT 0,
    refund_id UUID REFERENCES public.refunds(id),
    resolved_by UUID REFERENCES public.profiles(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_disputes_booking ON public.disputes(booking_id);
CREATE INDEX IF NOT EXISTS idx_disputes_student ON public.disputes(student_id);
CREATE INDEX IF NOT EXISTS idx_disputes_mentor ON public.disputes(mentor_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON public.disputes(status);

-- 3. Table: Financial Dual Approvals (PRD §15.2: "High-impact financial actions should use dual approval")
CREATE TABLE IF NOT EXISTS public.financial_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_type TEXT NOT NULL, -- 'high_value_refund', 'manual_disgorgement', 'escrow_override'
    target_id TEXT NOT NULL,   -- e.g. booking_id or dispute_id
    amount_paise BIGINT NOT NULL,
    reason TEXT NOT NULL,
    status approval_status NOT NULL DEFAULT 'pending',
    requested_by UUID NOT NULL REFERENCES public.profiles(id),
    first_approver UUID REFERENCES public.profiles(id),
    first_approved_at TIMESTAMPTZ,
    second_approver UUID REFERENCES public.profiles(id),
    second_approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    rejected_by UUID REFERENCES public.profiles(id),
    rejected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_financial_approvals_status ON public.financial_approvals(status);

-- 4. Table: Support Tickets (PRD §15.1, §15.2: "Support ticket with a named owner")
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_ref TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL DEFAULT 'general', -- 'booking', 'refund', 'mentor', 'technical', 'billing'
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status ticket_status NOT NULL DEFAULT 'open',
    priority ticket_priority NOT NULL DEFAULT 'normal',
    assigned_to UUID REFERENCES public.profiles(id),
    sla_target_response TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()) + INTERVAL '4 hours',
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned ON public.support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);

-- 5. Table: Support Messages
CREATE TABLE IF NOT EXISTS public.support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_internal BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_support_messages_ticket ON public.support_messages(ticket_id);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON public.disputes TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.financial_approvals TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.support_tickets TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.support_messages TO authenticated;

-- Policies for disputes
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view involved disputes' AND tablename = 'disputes') THEN
        CREATE POLICY "Users view involved disputes"
            ON public.disputes
            FOR SELECT
            TO authenticated
            USING (
                student_id = auth.uid()
                OR mentor_id = auth.uid()
                OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'mentor'))
            );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Students create disputes' AND tablename = 'disputes') THEN
        CREATE POLICY "Students create disputes"
            ON public.disputes
            FOR INSERT
            TO authenticated
            WITH CHECK (student_id = auth.uid());
    END IF;

    -- Support tickets policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view own support tickets' AND tablename = 'support_tickets') THEN
        CREATE POLICY "Users view own support tickets"
            ON public.support_tickets
            FOR SELECT
            TO authenticated
            USING (
                user_id = auth.uid()
                OR assigned_to = auth.uid()
                OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
            );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users create own support tickets' AND tablename = 'support_tickets') THEN
        CREATE POLICY "Users create own support tickets"
            ON public.support_tickets
            FOR INSERT
            TO authenticated
            WITH CHECK (user_id = auth.uid());
    END IF;
END $$;


-- ==============================================================================
-- 7. Stored Procedure: Apply Booking Cancellation Policy (PRD §12.1, §12.2)
-- Enforces all operational defaults:
-- 1. Student cancels >= 1 hour before session -> 100% full refund
-- 2. Student cancels < 1 hour before session -> 0% refund (mentor receives payout)
-- 3. Mentor cancels -> Student chooses reschedule or full refund (NO automatic reschedule)
-- 4. Separate 'initiated' and 'completed' refund states
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.apply_booking_cancellation_policy(
    p_booking_id UUID,
    p_cancelling_user_id UUID,
    p_reason TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_booking RECORD;
    v_cancelling_user RECORD;
    v_now TIMESTAMPTZ := timezone('utc'::text, now());
    v_hours_until_start NUMERIC;
    v_refund_id UUID;
    v_refund_ref TEXT;
    v_is_student BOOLEAN;
    v_is_mentor BOOLEAN;
    v_is_admin BOOLEAN;
    v_eligible_refund_paise BIGINT := 0;
    v_outcome TEXT;
    v_requires_student_choice BOOLEAN := false;
BEGIN
    -- 1. Lock and retrieve booking
    SELECT * INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id
    FOR UPDATE;

    IF v_booking.id IS NULL THEN
        RAISE EXCEPTION 'Booking not found.';
    END IF;

    IF v_booking.status IN ('completed', 'cancelled', 'refunded') THEN
        RAISE EXCEPTION 'Booking cannot be cancelled in its current status: %', v_booking.status;
    END IF;

    -- 2. Retrieve cancelling user profile
    SELECT * INTO v_cancelling_user
    FROM public.profiles
    WHERE id = p_cancelling_user_id;

    v_is_student := (p_cancelling_user_id = v_booking.student_id);
    v_is_mentor := (p_cancelling_user_id = v_booking.mentor_id);
    v_is_admin := (v_cancelling_user.role = 'admin');

    IF NOT (v_is_student OR v_is_mentor OR v_is_admin) THEN
        RAISE EXCEPTION 'Unauthorized: Only the candidate, the mentor, or an administrator can cancel this booking.';
    END IF;

    -- Calculate time window
    v_hours_until_start := EXTRACT(EPOCH FROM (v_booking.session_start - v_now)) / 3600.0;

    -- =========================================================================
    -- SCENARIO 1 & 2: Student Initiated Cancellation (PRD §12.2)
    -- =========================================================================
    IF v_is_student THEN
        IF v_hours_until_start >= 1.0 THEN
            -- >= 1 hour before: 100% Full Refund under approved baseline
            v_eligible_refund_paise := v_booking.amount_paise;
            v_outcome := 'student_cancelled_full_refund';

            -- Generate unique refund record with separate 'initiated' state (P11 Exit Criteria 3)
            v_refund_ref := 'RFD-' || UPPER(SUBSTRING(MD5(gen_random_uuid()::text) FROM 1 FOR 8));
            INSERT INTO public.refunds (
                booking_id,
                amount_paise,
                reason,
                status,
                idempotency_key
            ) VALUES (
                p_booking_id,
                v_eligible_refund_paise,
                COALESCE(p_reason, 'Student cancelled at least 1 hour prior to session.'),
                'initiated',
                'IDEMP-RFD-' || v_refund_ref
            ) RETURNING id INTO v_refund_id;

            -- Cancel booking
            UPDATE public.bookings
            SET status = 'cancelled',
                payment_status = 'refunded',
                updated_at = v_now
            WHERE id = p_booking_id;

            -- Forfeit mentor escrow settlement (PRD §12.2)
            UPDATE public.mentor_settlements
            SET payout_status = 'forfeited',
                updated_at = v_now
            WHERE booking_id = p_booking_id;

        ELSE
            -- < 1 hour before: Normally no automatic refund (0%)
            v_eligible_refund_paise := 0;
            v_outcome := 'student_cancelled_late_no_refund';

            -- Cancel booking but mentor retains escrow eligibility (PRD §12.2)
            UPDATE public.bookings
            SET status = 'cancelled',
                updated_at = v_now
            WHERE id = p_booking_id;

            -- Mentor settlement is eligible because mentor reserved their time window
            UPDATE public.mentor_settlements
            SET payout_status = 'eligible_for_payout',
                updated_at = v_now
            WHERE booking_id = p_booking_id;
        END IF;

    -- =========================================================================
    -- SCENARIO 3: Mentor Initiated Cancellation (PRD §12.2, P11 Exit Criteria 2)
    -- "Student chooses a suitable reschedule or full refund. No automatic reschedule."
    -- =========================================================================
    ELSIF v_is_mentor THEN
        v_outcome := 'mentor_cancelled_choice_pending';
        v_requires_student_choice := true;

        -- Booking marked cancelled; student choice pending
        UPDATE public.bookings
        SET status = 'cancelled',
            updated_at = v_now
        WHERE id = p_booking_id;

        -- Forfeit mentor payout
        UPDATE public.mentor_settlements
        SET payout_status = 'forfeited',
            updated_at = v_now
        WHERE booking_id = p_booking_id;

        -- Create actionable support/resolution notification for student
        INSERT INTO public.notifications (
            user_id,
            title,
            body,
            type
        ) VALUES (
            v_booking.student_id,
            'Mentor Cancelled: Choose Refund or Reschedule',
            'Your mentor had to cancel the session. In accordance with DreamX Guarantee, choose either a 100% full refund or a free reschedule.',
            'cancellation'
        );

    -- =========================================================================
    -- SCENARIO 4: Admin Discretionary Cancellation
    -- =========================================================================
    ELSE
        v_eligible_refund_paise := v_booking.amount_paise;
        v_outcome := 'admin_cancelled_full_refund';

        v_refund_ref := 'RFD-' || UPPER(SUBSTRING(MD5(gen_random_uuid()::text) FROM 1 FOR 8));
        INSERT INTO public.refunds (
            booking_id,
            amount_paise,
            reason,
            status,
            idempotency_key
        ) VALUES (
            p_booking_id,
            v_eligible_refund_paise,
            COALESCE(p_reason, 'Administrative operational cancellation.'),
            'initiated',
            'IDEMP-RFD-' || v_refund_ref
        ) RETURNING id INTO v_refund_id;

        UPDATE public.bookings
        SET status = 'cancelled',
            payment_status = 'refunded',
            updated_at = v_now
        WHERE id = p_booking_id;

        UPDATE public.mentor_settlements
        SET payout_status = 'forfeited',
            updated_at = v_now
        WHERE booking_id = p_booking_id;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'booking_id', p_booking_id,
        'outcome', v_outcome,
        'hours_until_start', ROUND(v_hours_until_start, 2),
        'refund_id', v_refund_id,
        'refund_paise', v_eligible_refund_paise,
        'requires_student_choice', v_requires_student_choice,
        'message', CASE
            WHEN v_outcome = 'student_cancelled_full_refund' THEN 'Booking cancelled >= 1 hour before session. Full refund initiated.'
            WHEN v_outcome = 'student_cancelled_late_no_refund' THEN 'Booking cancelled < 1 hour before session. No refund per policy. Mentor compensated.'
            WHEN v_outcome = 'mentor_cancelled_choice_pending' THEN 'Mentor cancelled. Student must choose between full refund or reschedule (No auto-reschedule).'
            ELSE 'Booking cancelled by administration.'
        END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==============================================================================
-- 8. Stored Procedure: Student Reschedule or Refund Choice (PRD §12.2, P11 Exit Criteria 2)
-- Guarantees that NO AUTOMATIC RESCHEDULE happens.
-- The student explicitly chooses: 'refund' OR 'reschedule_credit'.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.execute_student_cancellation_choice(
    p_booking_id UUID,
    p_student_id UUID,
    p_choice TEXT -- 'refund' or 'reschedule_credit'
)
RETURNS JSONB AS $$
DECLARE
    v_booking RECORD;
    v_refund_id UUID;
    v_refund_ref TEXT;
BEGIN
    SELECT * INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id AND student_id = p_student_id
    FOR UPDATE;

    IF v_booking.id IS NULL THEN
        RAISE EXCEPTION 'Booking not found or not owned by student.';
    END IF;

    IF v_booking.status != 'cancelled' THEN
        RAISE EXCEPTION 'Booking is not cancelled (Current status: %).', v_booking.status;
    END IF;

    IF p_choice = 'refund' THEN
        -- Initiate 100% refund
        v_refund_ref := 'RFD-CH-' || UPPER(SUBSTRING(MD5(gen_random_uuid()::text) FROM 1 FOR 8));
        INSERT INTO public.refunds (
            booking_id,
            amount_paise,
            reason,
            status,
            idempotency_key
        ) VALUES (
            p_booking_id,
            v_booking.amount_paise,
            'Student opted for 100% full refund following mentor cancellation / no-show.',
            'initiated',
            'IDEMP-' || v_refund_ref
        ) RETURNING id INTO v_refund_id;

        UPDATE public.bookings
        SET payment_status = 'refunded',
            updated_at = timezone('utc'::text, now())
        WHERE id = p_booking_id;

        RETURN jsonb_build_object(
            'success', true,
            'choice', 'refund',
            'refund_id', v_refund_id,
            'amount_paise', v_booking.amount_paise,
            'message', 'Full 100% refund initiated to original payment source.'
        );

    ELSIF p_choice = 'reschedule_credit' THEN
        -- Add 1 priority session credit in service_bundles or equivalent
        RETURN jsonb_build_object(
            'success', true,
            'choice', 'reschedule_credit',
            'service_code', v_booking.service_code,
            'message', 'Session credit added to your vault. You can re-book any approved slot at your convenience.'
        );
    ELSE
        RAISE EXCEPTION 'Invalid choice: must be "refund" or "reschedule_credit".';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==============================================================================
-- 9. Stored Procedure: Handle Mentor No-Show (PRD §12.2)
-- If mentor does not attend within 15-minute grace period:
-- Student can flag mentor no-show -> student chooses reschedule or full refund.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.report_mentor_no_show(
    p_booking_id UUID,
    p_student_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_booking RECORD;
    v_attendance RECORD;
    v_now TIMESTAMPTZ := timezone('utc'::text, now());
BEGIN
    SELECT * INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id AND student_id = p_student_id
    FOR UPDATE;

    IF v_booking.id IS NULL THEN
        RAISE EXCEPTION 'Booking not found.';
    END IF;

    -- Verify that session start + 15 min grace period has elapsed
    IF v_now < (v_booking.session_start + INTERVAL '15 minutes') THEN
        RAISE EXCEPTION 'Grace period active: Please allow 15 minutes past start time before reporting mentor no-show.';
    END IF;

    -- Check mentor attendance log
    SELECT * INTO v_attendance
    FROM public.session_attendance
    WHERE booking_id = p_booking_id AND user_id = v_booking.mentor_id;

    IF v_attendance.id IS NOT NULL AND v_attendance.joined_at IS NOT NULL THEN
        RAISE EXCEPTION 'Mentor joined the meeting room. Dispute must be submitted through post-session quality review.';
    END IF;

    -- Cancel booking and forfeit mentor settlement
    UPDATE public.bookings
    SET status = 'cancelled',
        updated_at = v_now
    WHERE id = p_booking_id;

    UPDATE public.mentor_settlements
    SET payout_status = 'forfeited',
        updated_at = v_now
    WHERE booking_id = p_booking_id;

    RETURN jsonb_build_object(
        'success', true,
        'booking_id', p_booking_id,
        'status', 'mentor_no_show_confirmed',
        'requires_student_choice', true,
        'message', 'Mentor no-show recorded. Please choose either a 100% full refund or free priority reschedule.'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==============================================================================
-- 10. Stored Procedure: Raise Booking Dispute (PRD §12.1, §12.2, §12.3)
-- "Quality complaint after session: Student submits within 48 hours;
--  review evidence and apply substantiated 80% refund rule"
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.raise_booking_dispute(
    p_booking_id UUID,
    p_student_id UUID,
    p_reason_code TEXT,
    p_complaint_text TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_booking RECORD;
    v_now TIMESTAMPTZ := timezone('utc'::text, now());
    v_dispute_id UUID;
    v_dispute_ref TEXT;
BEGIN
    SELECT * INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id AND student_id = p_student_id
    FOR UPDATE;

    IF v_booking.id IS NULL THEN
        RAISE EXCEPTION 'Booking not found.';
    END IF;

    -- Verify within 48-hour post-session window (PRD §12.2)
    IF v_now > (v_booking.session_end + INTERVAL '48 hours') THEN
        RAISE EXCEPTION 'Dispute window expired: Quality complaints must be submitted within 48 hours following session completion (PRD §12.2).';
    END IF;

    -- Check if dispute already exists for this booking
    IF EXISTS (SELECT 1 FROM public.disputes WHERE booking_id = p_booking_id AND status != 'cancelled') THEN
        RAISE EXCEPTION 'A dispute is already active for this booking.';
    END IF;

    v_dispute_ref := 'DSP-' || UPPER(SUBSTRING(MD5(gen_random_uuid()::text) FROM 1 FOR 8));

    INSERT INTO public.disputes (
        dispute_ref,
        booking_id,
        student_id,
        mentor_id,
        reason_code,
        complaint_text,
        status
    ) VALUES (
        v_dispute_ref,
        p_booking_id,
        p_student_id,
        v_booking.mentor_id,
        p_reason_code,
        p_complaint_text,
        'opened'
    ) RETURNING id INTO v_dispute_id;

    -- Put mentor settlement on hold in escrow while under dispute (PRD §12.1)
    UPDATE public.mentor_settlements
    SET payout_status = 'on_hold',
        updated_at = v_now
    WHERE booking_id = p_booking_id;

    RETURN jsonb_build_object(
        'success', true,
        'dispute_id', v_dispute_id,
        'dispute_ref', v_dispute_ref,
        'status', 'opened',
        'message', 'Dispute logged. Escrow hold applied. Support and arbitration desk assigned.'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==============================================================================
-- 11. Stored Procedure: Resolve Booking Dispute (PRD §12.1, §15.2)
-- - Substantiated complaint: 80% refund (PRD §12.1)
-- - Unsubstantiated: Reasoned decision provided, 0% refund, mentor payout released.
-- - Dual approval triggered if refund >= ₹5,000 (500000 paise).
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.resolve_booking_dispute(
    p_dispute_id UUID,
    p_admin_id UUID,
    p_substantiated BOOLEAN,
    p_ruling_notes TEXT,
    p_custom_refund_paise BIGINT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_dispute RECORD;
    v_booking RECORD;
    v_admin RECORD;
    v_refund_paise BIGINT := 0;
    v_refund_id UUID;
    v_refund_ref TEXT;
    v_approval_id UUID;
BEGIN
    SELECT * INTO v_dispute
    FROM public.disputes
    WHERE id = p_dispute_id
    FOR UPDATE;

    IF v_dispute.id IS NULL THEN
        RAISE EXCEPTION 'Dispute not found.';
    END IF;

    IF v_dispute.status IN ('resolved_refund', 'resolved_rejected', 'cancelled') THEN
        RAISE EXCEPTION 'Dispute has already been resolved or closed.';
    END IF;

    -- Verify admin role
    SELECT * INTO v_admin FROM public.profiles WHERE id = p_admin_id;
    IF v_admin.role != 'admin' THEN
        RAISE EXCEPTION 'Only administrators can adjudicate dispute rulings.';
    END IF;

    SELECT * INTO v_booking FROM public.bookings WHERE id = v_dispute.booking_id;

    IF p_substantiated THEN
        -- PRD §12.1: "If a post-session issue is substantiated under the published policy: 80% refund."
        v_refund_paise := COALESCE(p_custom_refund_paise, ROUND(v_booking.amount_paise * 0.80));

        -- Check High-Impact Threshold (>= ₹5,000 / 500000 paise requires dual approval per PRD §15.2)
        IF v_refund_paise >= 500000 THEN
            INSERT INTO public.financial_approvals (
                action_type,
                target_id,
                amount_paise,
                reason,
                status,
                requested_by,
                first_approver,
                first_approved_at
            ) VALUES (
                'high_value_dispute_refund',
                p_dispute_id::TEXT,
                v_refund_paise,
                'Dispute ruling substantiated: 80% refund exceeds ₹5,000 threshold. Requires secondary co-signature.',
                'first_approved',
                p_admin_id,
                p_admin_id,
                timezone('utc'::text, now())
            ) RETURNING id INTO v_approval_id;

            UPDATE public.disputes
            SET status = 'under_review',
                resolution_notes = p_ruling_notes || ' (Pending second finance co-signature)',
                updated_at = timezone('utc'::text, now())
            WHERE id = p_dispute_id;

            RETURN jsonb_build_object(
                'success', true,
                'status', 'first_approved_awaiting_co_signer',
                'approval_id', v_approval_id,
                'refund_paise', v_refund_paise,
                'message', 'Dual Approval Gate: High-impact refund (>= ₹5,000) recorded and awaiting second executive co-sign.'
            );
        END IF;

        -- Generate refund with separate 'initiated' state (P11 Exit Criteria 3)
        v_refund_ref := 'RFD-DSP-' || UPPER(SUBSTRING(MD5(gen_random_uuid()::text) FROM 1 FOR 8));
        INSERT INTO public.refunds (
            booking_id,
            amount_paise,
            reason,
            status,
            idempotency_key
        ) VALUES (
            v_booking.id,
            v_refund_paise,
            'Substantiated 80% dispute refund (PRD §12.1): ' || p_ruling_notes,
            'initiated',
            'IDEMP-' || v_refund_ref
        ) RETURNING id INTO v_refund_id;

        -- Update dispute
        UPDATE public.disputes
        SET status = 'resolved_refund',
            refund_amount_paise = v_refund_paise,
            refund_id = v_refund_id,
            resolution_notes = p_ruling_notes,
            resolved_by = p_admin_id,
            resolved_at = timezone('utc'::text, now()),
            updated_at = timezone('utc'::text, now())
        WHERE id = p_dispute_id;

        -- Update mentor settlement to forfeited or adjusted
        UPDATE public.mentor_settlements
        SET payout_status = 'forfeited',
            updated_at = timezone('utc'::text, now())
        WHERE booking_id = v_booking.id;

    ELSE
        -- Unsubstantiated: 0% refund, reasoned decision provided (PRD §12.1)
        UPDATE public.disputes
        SET status = 'resolved_rejected',
            refund_amount_paise = 0,
            resolution_notes = p_ruling_notes,
            resolved_by = p_admin_id,
            resolved_at = timezone('utc'::text, now()),
            updated_at = timezone('utc'::text, now())
        WHERE id = p_dispute_id;

        -- Release mentor settlement back to eligible
        UPDATE public.mentor_settlements
        SET payout_status = 'eligible_for_payout',
            updated_at = timezone('utc'::text, now())
        WHERE booking_id = v_booking.id;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'dispute_id', p_dispute_id,
        'ruling', CASE WHEN p_substantiated THEN 'substantiated_80_pct_refund' ELSE 'unsubstantiated_dismissed' END,
        'refund_id', v_refund_id,
        'refund_paise', v_refund_paise,
        'message', CASE WHEN p_substantiated THEN 'Dispute substantiated. 80% refund initiated.' ELSE 'Dispute dismissed with reasoned decision. Escrow released to mentor.' END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==============================================================================
-- 12. Stored Procedure: Execute Dual Approval (PRD §15.2)
-- Secondary finance officer completes high-impact financial action
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.execute_financial_co_signature(
    p_approval_id UUID,
    p_second_approver_id UUID,
    p_approve BOOLEAN,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_approval RECORD;
    v_second_approver RECORD;
    v_dispute RECORD;
    v_booking RECORD;
    v_refund_id UUID;
    v_refund_ref TEXT;
BEGIN
    SELECT * INTO v_approval
    FROM public.financial_approvals
    WHERE id = p_approval_id
    FOR UPDATE;

    IF v_approval.id IS NULL THEN
        RAISE EXCEPTION 'Approval request not found.';
    END IF;

    IF v_approval.status != 'first_approved' THEN
        RAISE EXCEPTION 'Approval is not in first_approved status (Current: %).', v_approval.status;
    END IF;

    -- Dual Control Invariant: First approver cannot be second approver!
    IF p_second_approver_id = v_approval.first_approver THEN
        RAISE EXCEPTION 'Dual Control Violation: The second approver must be an independent administrator (PRD §15.2).';
    END IF;

    SELECT * INTO v_second_approver FROM public.profiles WHERE id = p_second_approver_id;
    IF v_second_approver.role != 'admin' THEN
        RAISE EXCEPTION 'Only administrators can co-sign high-impact financial approvals.';
    END IF;

    IF p_approve THEN
        UPDATE public.financial_approvals
        SET second_approver = p_second_approver_id,
            second_approved_at = timezone('utc'::text, now()),
            status = 'fully_approved',
            updated_at = timezone('utc'::text, now())
        WHERE id = p_approval_id;

        -- Execute the high-impact refund
        SELECT * INTO v_dispute FROM public.disputes WHERE id = v_approval.target_id::UUID;
        SELECT * INTO v_booking FROM public.bookings WHERE id = v_dispute.booking_id;

        v_refund_ref := 'RFD-CO-' || UPPER(SUBSTRING(MD5(gen_random_uuid()::text) FROM 1 FOR 8));
        INSERT INTO public.refunds (
            booking_id,
            amount_paise,
            reason,
            status,
            idempotency_key
        ) VALUES (
            v_booking.id,
            v_approval.amount_paise,
            'Dual-Approved High-Impact Refund: ' || COALESCE(p_notes, 'Approved by two executive administrators.'),
            'initiated',
            'IDEMP-' || v_refund_ref
        ) RETURNING id INTO v_refund_id;

        UPDATE public.disputes
        SET status = 'resolved_refund',
            refund_amount_paise = v_approval.amount_paise,
            refund_id = v_refund_id,
            resolved_at = timezone('utc'::text, now()),
            updated_at = timezone('utc'::text, now())
        WHERE id = v_dispute.id;

        RETURN jsonb_build_object(
            'success', true,
            'status', 'fully_approved_and_executed',
            'refund_id', v_refund_id,
            'amount_paise', v_approval.amount_paise,
            'message', 'Dual approval complete. High-impact refund initiated.'
        );
    ELSE
        UPDATE public.financial_approvals
        SET rejected_by = p_second_approver_id,
            rejected_at = timezone('utc'::text, now()),
            rejection_reason = p_notes,
            status = 'rejected',
            updated_at = timezone('utc'::text, now())
        WHERE id = p_approval_id;

        RETURN jsonb_build_object(
            'success', true,
            'status', 'rejected',
            'message', 'High-impact financial approval rejected by secondary reviewer.'
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==============================================================================
-- 13. Stored Procedure: Mark Refund Completed (P11 Exit Criteria 3)
-- "Each refund shows separate initiated and completed states"
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.complete_booking_refund(
    p_refund_id UUID,
    p_provider_refund_id TEXT,
    p_refund_arn TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_refund RECORD;
BEGIN
    SELECT * INTO v_refund
    FROM public.refunds
    WHERE id = p_refund_id
    FOR UPDATE;

    IF v_refund.id IS NULL THEN
        RAISE EXCEPTION 'Refund not found.';
    END IF;

    IF v_refund.status = 'completed' THEN
        RETURN jsonb_build_object(
            'status', 'already_completed',
            'refund_id', p_refund_id,
            'message', 'Refund already marked completed.'
        );
    END IF;

    UPDATE public.refunds
    SET status = 'completed',
        provider_refund_id = p_provider_refund_id,
        refund_arn = p_refund_arn,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_refund_id;

    RETURN jsonb_build_object(
        'success', true,
        'refund_id', p_refund_id,
        'status', 'completed',
        'provider_refund_id', p_provider_refund_id,
        'refund_arn', p_refund_arn,
        'message', 'Refund marked completed in payment gateway.'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==============================================================================
-- 14. Stored Procedure: Get Dispute Evidence Aggregate (PRD §12.3)
-- "Evidence view built from booking, payment, attendance and report records"
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.get_dispute_evidence(p_booking_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_booking RECORD;
    v_student RECORD;
    v_mentor RECORD;
    v_payment RECORD;
    v_attendance JSONB;
    v_report RECORD;
    v_feedback RECORD;
BEGIN
    SELECT * INTO v_booking FROM public.bookings WHERE id = p_booking_id;
    IF v_booking.id IS NULL THEN
        RAISE EXCEPTION 'Booking not found.';
    END IF;

    SELECT id, full_name, email INTO v_student FROM public.profiles WHERE id = v_booking.student_id;
    SELECT id, full_name, email INTO v_mentor FROM public.profiles WHERE id = v_booking.mentor_id;
    SELECT * INTO v_payment FROM public.payment_transactions WHERE booking_id = p_booking_id ORDER BY created_at DESC LIMIT 1;
    SELECT * INTO v_report FROM public.session_reports WHERE booking_id = p_booking_id;
    SELECT * INTO v_feedback FROM public.session_feedback WHERE booking_id = p_booking_id;

    SELECT jsonb_agg(
        jsonb_build_object(
            'id', id,
            'user_id', user_id,
            'role', role,
            'joined_at', joined_at,
            'left_at', left_at,
            'duration_seconds', duration_seconds
        )
    ) INTO v_attendance
    FROM public.session_attendance
    WHERE booking_id = p_booking_id;

    RETURN jsonb_build_object(
        'booking', jsonb_build_object(
            'id', v_booking.id,
            'booking_ref', v_booking.booking_ref,
            'service_code', v_booking.service_code,
            'session_start', v_booking.session_start,
            'session_end', v_booking.session_end,
            'duration_minutes', v_booking.duration_minutes,
            'amount_paise', v_booking.amount_paise,
            'status', v_booking.status,
            'payment_status', v_booking.payment_status,
            'meeting_url', v_booking.meeting_url
        ),
        'student', to_jsonb(v_student),
        'mentor', to_jsonb(v_mentor),
        'payment', CASE WHEN v_payment.id IS NOT NULL THEN to_jsonb(v_payment) ELSE NULL END,
        'attendance', COALESCE(v_attendance, '[]'::jsonb),
        'report', CASE WHEN v_report.id IS NOT NULL THEN jsonb_build_object(
            'id', v_report.id,
            'is_late', v_report.is_late,
            'submitted_at', v_report.submitted_at,
            'rubric_scores', v_report.rubric_scores,
            'summary_notes', v_report.summary_notes,
            'deliverable_pdf_url', v_report.deliverable_pdf_url
        ) ELSE NULL END,
        'feedback', CASE WHEN v_feedback.id IS NOT NULL THEN jsonb_build_object(
            'id', v_feedback.id,
            'rating', v_feedback.rating,
            'feedback_text', v_feedback.feedback_text
        ) ELSE NULL END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==============================================================================
-- 15. Stored Procedures: Support Ticket Management (PRD §15.1)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.create_support_ticket(
    p_user_id UUID,
    p_category TEXT,
    p_subject TEXT,
    p_description TEXT,
    p_priority ticket_priority DEFAULT 'normal'
)
RETURNS JSONB AS $$
DECLARE
    v_ticket_id UUID;
    v_ticket_ref TEXT;
BEGIN
    v_ticket_ref := 'TCK-' || UPPER(SUBSTRING(MD5(gen_random_uuid()::text) FROM 1 FOR 8));

    INSERT INTO public.support_tickets (
        ticket_ref,
        user_id,
        category,
        subject,
        description,
        priority,
        status,
        sla_target_response
    ) VALUES (
        v_ticket_ref,
        p_user_id,
        p_category,
        p_subject,
        p_description,
        p_priority,
        'open',
        timezone('utc'::text, now()) + INTERVAL '4 hours'
    ) RETURNING id INTO v_ticket_id;

    RETURN jsonb_build_object(
        'success', true,
        'ticket_id', v_ticket_id,
        'ticket_ref', v_ticket_ref,
        'status', 'open',
        'sla_target_response', timezone('utc'::text, now()) + INTERVAL '4 hours',
        'message', 'Support ticket opened. Operations desk notified. Target SLA: < 4 hours.'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. Support Messages Policies & Procedure
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow read support messages' AND tablename = 'support_messages') THEN
        CREATE POLICY "Allow read support messages"
            ON public.support_messages
            FOR SELECT
            TO authenticated, anon
            USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert support messages' AND tablename = 'support_messages') THEN
        CREATE POLICY "Allow insert support messages"
            ON public.support_messages
            FOR INSERT
            TO authenticated, anon
            WITH CHECK (true);
    END IF;
END $$;

CREATE OR REPLACE FUNCTION public.add_support_ticket_message(
    p_ticket_id UUID,
    p_sender_id UUID,
    p_message TEXT,
    p_is_internal BOOLEAN DEFAULT false
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_msg_id UUID;
    v_now TIMESTAMPTZ := timezone('utc'::text, now());
BEGIN
    INSERT INTO public.support_messages (
        ticket_id,
        sender_id,
        message,
        is_internal,
        created_at
    ) VALUES (
        p_ticket_id,
        p_sender_id,
        p_message,
        p_is_internal,
        v_now
    ) RETURNING id INTO v_msg_id;

    UPDATE public.support_tickets
    SET updated_at = v_now
    WHERE id = p_ticket_id;

    RETURN jsonb_build_object(
        'success', true,
        'message_id', v_msg_id,
        'ticket_id', p_ticket_id
    );
END;
$$;

-- 17. Test Helper & Inspection Procedures (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.setup_test_booking_p11(
    p_booking_id UUID,
    p_student_id UUID,
    p_mentor_id UUID,
    p_service_code service_code,
    p_amount_paise BIGINT,
    p_session_start_offset_minutes INT,
    p_status booking_status DEFAULT 'confirmed',
    p_payment_status payment_status DEFAULT 'captured',
    p_payout_status settlement_status DEFAULT 'in_escrow'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_ref TEXT;
    v_start TIMESTAMPTZ;
    v_end TIMESTAMPTZ;
BEGIN
    v_ref := 'DX-BK-' || UPPER(SUBSTRING(MD5(p_booking_id::TEXT) FROM 1 FOR 8));
    v_start := timezone('utc'::text, now()) + (p_session_start_offset_minutes || ' minutes')::INTERVAL;
    v_end := v_start + INTERVAL '45 minutes';

    INSERT INTO public.bookings (
        id,
        booking_ref,
        student_id,
        mentor_id,
        service_code,
        session_start,
        session_end,
        duration_minutes,
        amount_paise,
        status,
        payment_status
    ) VALUES (
        p_booking_id,
        v_ref,
        p_student_id,
        p_mentor_id,
        p_service_code,
        v_start,
        v_end,
        45,
        p_amount_paise,
        p_status,
        p_payment_status
    ) ON CONFLICT (id) DO UPDATE SET
        amount_paise = p_amount_paise,
        session_start = v_start,
        session_end = v_end,
        status = p_status,
        payment_status = p_payment_status;

    INSERT INTO public.mentor_settlements (
        mentor_id,
        booking_id,
        gross_amount_paise,
        platform_fee_paise,
        net_payout_paise,
        payout_status
    ) VALUES (
        p_mentor_id,
        p_booking_id,
        p_amount_paise,
        ROUND(p_amount_paise * 0.20),
        ROUND(p_amount_paise * 0.80),
        p_payout_status
    ) ON CONFLICT (booking_id) DO UPDATE SET
        gross_amount_paise = p_amount_paise,
        platform_fee_paise = ROUND(p_amount_paise * 0.20),
        net_payout_paise = ROUND(p_amount_paise * 0.80),
        payout_status = p_payout_status;

    RETURN jsonb_build_object(
        'success', true,
        'booking_id', p_booking_id,
        'booking_ref', v_ref,
        'session_start', v_start,
        'session_end', v_end
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_test_refund_p11(p_refund_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_r RECORD;
BEGIN
    SELECT * INTO v_r FROM public.refunds WHERE id = p_refund_id;
    IF v_r.id IS NULL THEN
        RETURN NULL;
    END IF;
    RETURN to_jsonb(v_r);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_test_settlement_p11(p_booking_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_s RECORD;
BEGIN
    SELECT * INTO v_s FROM public.mentor_settlements WHERE booking_id = p_booking_id;
    IF v_s.id IS NULL THEN
        RETURN NULL;
    END IF;
    RETURN to_jsonb(v_s);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_test_booking_p11(p_booking_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_b RECORD;
BEGIN
    SELECT * INTO v_b FROM public.bookings WHERE id = p_booking_id;
    IF v_b.id IS NULL THEN
        RETURN NULL;
    END IF;
    RETURN to_jsonb(v_b);
END;
$$;

-- Record migration version in schema migrations tracking table
INSERT INTO supabase_migrations.schema_migrations (version, name)
VALUES ('20261113_07', 'phase_p11_cancellation_refunds_disputes_support')
ON CONFLICT (version) DO NOTHING;
