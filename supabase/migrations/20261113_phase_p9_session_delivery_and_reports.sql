-- ====================================================================
-- DreamX Phase P9: Session Delivery and Reports Migration
-- Target: India (CM-IN) • Supabase PostgreSQL 17.11
-- Specifications: PRD V3.0 §11, Implementation Plan §P9, Exit Criteria 1-4
-- ====================================================================

-- 1. Create Enums for Attendance
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attendance_status') THEN
        CREATE TYPE attendance_status AS ENUM ('joined', 'completed', 'no_show', 'dropped_early');
    END IF;
END $$;

-- 2. Session Attendance Events Table
CREATE TABLE IF NOT EXISTS public.session_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    left_at TIMESTAMPTZ,
    duration_seconds INTEGER DEFAULT 0,
    status attendance_status NOT NULL DEFAULT 'joined',
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_session_attendance_booking ON public.session_attendance(booking_id);
CREATE INDEX IF NOT EXISTS idx_session_attendance_user ON public.session_attendance(user_id);

-- 3. Session Reports Table (Immutable Versioning, 8-D Rubric Scorecards)
-- P9 Exit Criteria 3: "Report revisions keep earlier versions"
CREATE TABLE IF NOT EXISTS public.session_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_code service_code NOT NULL,
    version INTEGER NOT NULL DEFAULT 1 CHECK (version >= 1),
    is_latest BOOLEAN NOT NULL DEFAULT true,
    rubric_scores JSONB NOT NULL DEFAULT '{}'::JSONB,
    summary_notes TEXT NOT NULL,
    strengths TEXT[] DEFAULT '{}'::TEXT[],
    growth_areas TEXT[] DEFAULT '{}'::TEXT[],
    action_items JSONB DEFAULT '[]'::JSONB,
    deliverable_pdf_url TEXT,
    deliverable_sha256 TEXT,
    sla_deadline_at TIMESTAMPTZ NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    is_late BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_session_reports_booking ON public.session_reports(booking_id);
CREATE INDEX IF NOT EXISTS idx_session_reports_student ON public.session_reports(student_id);
CREATE INDEX IF NOT EXISTS idx_session_reports_mentor ON public.session_reports(mentor_id);
CREATE INDEX IF NOT EXISTS idx_session_reports_latest ON public.session_reports(booking_id, is_latest) WHERE (is_latest = true);

-- 4. Session Feedback Table
-- P9 Exit Criteria 4: "Feedback collection completes without leaking mentor ratings to other students"
CREATE TABLE IF NOT EXISTS public.session_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating NUMERIC(3, 2) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    feedback_text TEXT,
    recommend_to_peers BOOLEAN NOT NULL DEFAULT true,
    is_self_reported BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_session_feedback_booking ON public.session_feedback(booking_id);
CREATE INDEX IF NOT EXISTS idx_session_feedback_mentor ON public.session_feedback(mentor_id);

-- 5. Row-Level Security (RLS)
ALTER TABLE public.session_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_feedback ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON public.session_attendance TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.session_reports TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.session_feedback TO authenticated;

-- Policies: session_reports (P9 Exit Criteria 2: "A student can open only their own reports")
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Students view only own reports' AND tablename = 'session_reports') THEN
        CREATE POLICY "Students view only own reports"
            ON public.session_reports
            FOR SELECT
            TO authenticated
            USING (
                student_id = auth.uid()
                OR mentor_id = auth.uid()
                OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
            );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Mentors submit reports for their sessions' AND tablename = 'session_reports') THEN
        CREATE POLICY "Mentors submit reports for their sessions"
            ON public.session_reports
            FOR INSERT
            TO authenticated
            WITH CHECK (
                mentor_id = auth.uid()
                OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
            );
    END IF;

    -- Policies: session_feedback (P9 Exit Criteria 4: Feedback isolation)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Students view and insert own feedback' AND tablename = 'session_feedback') THEN
        CREATE POLICY "Students view and insert own feedback"
            ON public.session_feedback
            FOR ALL
            TO authenticated
            USING (
                student_id = auth.uid()
                OR mentor_id = auth.uid()
                OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
            )
            WITH CHECK (student_id = auth.uid());
    END IF;

    -- Policies: session_attendance
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view attendance for their sessions' AND tablename = 'session_attendance') THEN
        CREATE POLICY "Users view attendance for their sessions"
            ON public.session_attendance
            FOR SELECT
            TO authenticated
            USING (
                user_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM public.bookings b
                    WHERE b.id = session_attendance.booking_id
                      AND (b.student_id = auth.uid() OR b.mentor_id = auth.uid())
                )
                OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
            );
    END IF;
END $$;

-- 6. Stored Procedure: Submit Session Report (P9 Exit Criteria 1 & 3)
-- "A report uploaded within 48 hours unlocks the mentor settlement on schedule"
-- "Report revisions keep earlier versions"
CREATE OR REPLACE FUNCTION public.submit_session_report(
    p_booking_id UUID,
    p_mentor_id UUID,
    p_rubric_scores JSONB,
    p_summary_notes TEXT,
    p_strengths TEXT[] DEFAULT '{}'::TEXT[],
    p_growth_areas TEXT[] DEFAULT '{}'::TEXT[],
    p_action_items JSONB DEFAULT '[]'::JSONB,
    p_deliverable_pdf_url TEXT DEFAULT NULL,
    p_deliverable_sha256 TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_booking RECORD;
    v_prev_version INTEGER := 0;
    v_new_version INTEGER := 1;
    v_sla_deadline TIMESTAMPTZ;
    v_is_late BOOLEAN := FALSE;
    v_new_report_id UUID;
    v_sha256 TEXT;
BEGIN
    -- 1. Lock and validate booking
    SELECT * INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id
    FOR UPDATE;

    IF v_booking IS NULL THEN
        RAISE EXCEPTION 'Booking not found.';
    END IF;

    IF v_booking.mentor_id != p_mentor_id THEN
        RAISE EXCEPTION 'Unauthorized: Only the assigned mentor can submit reports for this session.';
    END IF;

    -- 2. Compute 48-Hour SLA Deadline from session_end
    v_sla_deadline := v_booking.session_end + INTERVAL '48 hours';
    IF timezone('utc'::text, now()) > v_sla_deadline THEN
        v_is_late := TRUE;
    END IF;

    -- 3. Versioning Check (P9 Exit Criteria 3: Keep earlier versions)
    SELECT MAX(version) INTO v_prev_version
    FROM public.session_reports
    WHERE booking_id = p_booking_id;

    IF v_prev_version IS NOT NULL AND v_prev_version > 0 THEN
        v_new_version := v_prev_version + 1;
        -- Demote earlier versions from being latest
        UPDATE public.session_reports
        SET is_latest = FALSE,
            updated_at = timezone('utc'::text, now())
        WHERE booking_id = p_booking_id;
    END IF;

    -- Generate synthetic SHA-256 integrity hash if not provided
    v_sha256 := COALESCE(
        p_deliverable_sha256,
        '0x' || ENCODE(DIGEST(p_booking_id::TEXT || v_new_version::TEXT || timezone('utc'::text, now())::TEXT, 'sha256'), 'hex')
    );

    -- 4. Insert new report version
    INSERT INTO public.session_reports (
        booking_id,
        mentor_id,
        student_id,
        service_code,
        version,
        is_latest,
        rubric_scores,
        summary_notes,
        strengths,
        growth_areas,
        action_items,
        deliverable_pdf_url,
        deliverable_sha256,
        sla_deadline_at,
        submitted_at,
        is_late
    ) VALUES (
        p_booking_id,
        p_mentor_id,
        v_booking.student_id,
        v_booking.service_code,
        v_new_version,
        TRUE,
        p_rubric_scores,
        p_summary_notes,
        p_strengths,
        p_growth_areas,
        p_action_items,
        p_deliverable_pdf_url,
        v_sha256,
        v_sla_deadline,
        timezone('utc'::text, now()),
        v_is_late
    ) RETURNING id INTO v_new_report_id;

    -- 5. Mark booking as completed
    UPDATE public.bookings
    SET status = 'completed',
        updated_at = timezone('utc'::text, now())
    WHERE id = p_booking_id;

    -- 6. Escrow Unlock (P9 Exit Criteria 1)
    -- On-time delivery unlocks mentor settlement payout from in_escrow -> eligible_for_payout
    IF NOT v_is_late THEN
        UPDATE public.mentor_settlements
        SET payout_status = 'eligible_for_payout',
            updated_at = timezone('utc'::text, now())
        WHERE booking_id = p_booking_id AND payout_status = 'in_escrow';
    ELSE
        -- Late report alerts operations queue
        INSERT INTO public.audit_logs (
            actor_id,
            action,
            target_type,
            target_id,
            reason_code,
            metadata
        ) VALUES (
            p_mentor_id,
            'SLA_BREACH_LATE_REPORT',
            'session_report',
            v_new_report_id::TEXT,
            'REPORT_SUBMITTED_AFTER_48H',
            jsonb_build_object(
                'booking_id', p_booking_id,
                'sla_deadline', v_sla_deadline,
                'submitted_at', timezone('utc'::text, now())
            )
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'report_id', v_new_report_id,
        'booking_id', p_booking_id,
        'version', v_new_version,
        'is_late', v_is_late,
        'sha256', v_sha256,
        'escrow_unlocked', NOT v_is_late
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Stored Procedure: Operations Queue for Late Reports (P9 Exit Criteria 1)
-- "A late report triggers a reminder and appears in the operations queue"
CREATE OR REPLACE FUNCTION public.get_late_reports_operations_queue()
RETURNS TABLE (
    booking_id UUID,
    booking_ref TEXT,
    service_code service_code,
    mentor_id UUID,
    mentor_name TEXT,
    student_id UUID,
    student_name TEXT,
    session_end TIMESTAMPTZ,
    sla_deadline TIMESTAMPTZ,
    hours_overdue NUMERIC,
    report_status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        b.id AS booking_id,
        b.booking_ref,
        b.service_code,
        b.mentor_id,
        mp.full_name AS mentor_name,
        b.student_id,
        sp.full_name AS student_name,
        b.session_end,
        (b.session_end + INTERVAL '48 hours') AS sla_deadline,
        ROUND(EXTRACT(EPOCH FROM (timezone('utc'::text, now()) - (b.session_end + INTERVAL '48 hours'))) / 3600, 1) AS hours_overdue,
        CASE
            WHEN sr.id IS NOT NULL THEN 'submitted_late'
            ELSE 'missing_report'
        END AS report_status
    FROM public.bookings b
    JOIN public.profiles mp ON mp.id = b.mentor_id
    JOIN public.profiles sp ON sp.id = b.student_id
    LEFT JOIN public.session_reports sr ON sr.booking_id = b.id AND sr.is_latest = TRUE
    WHERE b.status IN ('confirmed', 'in_progress', 'completed')
      AND timezone('utc'::text, now()) > (b.session_end + INTERVAL '48 hours')
      AND (sr.id IS NULL OR sr.is_late = TRUE)
    ORDER BY (b.session_end + INTERVAL '48 hours') ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Stored Procedure: Submit Session Feedback
CREATE OR REPLACE FUNCTION public.submit_session_feedback(
    p_booking_id UUID,
    p_student_id UUID,
    p_rating NUMERIC,
    p_feedback_text TEXT DEFAULT NULL,
    p_recommend_to_peers BOOLEAN DEFAULT TRUE
)
RETURNS JSONB AS $$
DECLARE
    v_booking RECORD;
    v_feedback_id UUID;
    v_avg_rating NUMERIC(3, 2);
    v_count INTEGER;
BEGIN
    SELECT * INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id AND student_id = p_student_id;

    IF v_booking IS NULL THEN
        RAISE EXCEPTION 'Booking not found or student unauthorized.';
    END IF;

    -- Insert feedback
    INSERT INTO public.session_feedback (
        booking_id,
        student_id,
        mentor_id,
        rating,
        feedback_text,
        recommend_to_peers,
        is_self_reported
    ) VALUES (
        p_booking_id,
        p_student_id,
        v_booking.mentor_id,
        p_rating,
        p_feedback_text,
        p_recommend_to_peers,
        TRUE
    ) RETURNING id INTO v_feedback_id;

    -- Recalculate mentor rating in mentor_profiles
    SELECT AVG(rating), COUNT(*) INTO v_avg_rating, v_count
    FROM public.session_feedback
    WHERE mentor_id = v_booking.mentor_id;

    UPDATE public.mentor_profiles
    SET rating = ROUND(v_avg_rating, 2),
        reviews_count = v_count,
        updated_at = timezone('utc'::text, now())
    WHERE id = v_booking.mentor_id;

    RETURN jsonb_build_object(
        'success', true,
        'feedback_id', v_feedback_id,
        'mentor_rating_updated', ROUND(v_avg_rating, 2)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Record migration in schema tracking table
INSERT INTO supabase_migrations.schema_migrations (version, name)
VALUES ('20261113_04', 'phase_p9_session_delivery_and_reports')
ON CONFLICT (version) DO NOTHING;
