-- ====================================================================
-- DreamX Phase P5: Mentor Onboarding & Trust Verification Migration
-- Target: India (CM-IN) • Supabase PostgreSQL 17.11
-- Specifications: PRD V3.0 §9.1–§9.4, Implementation Plan §P5
-- ====================================================================

-- 1. Ensure required enum types exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('student', 'mentor', 'admin');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_status') THEN
        CREATE TYPE verification_status AS ENUM ('pending', 'in_review', 'approved', 'rejected');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_code') THEN
        CREATE TYPE service_code AS ENUM ('S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09', 'S10');
    END IF;
END $$;

-- 2. Mentor Applications Table
-- Stores complete applicant intake dossiers from /mentor/onboarding
CREATE TABLE IF NOT EXISTS public.mentor_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    current_employer TEXT NOT NULL,
    job_title TEXT NOT NULL,
    years_of_experience INTEGER NOT NULL CHECK (years_of_experience >= 0),
    linkedin_url TEXT,
    bio TEXT,
    domains TEXT[] NOT NULL DEFAULT '{}',
    requested_services service_code[] NOT NULL DEFAULT '{}',
    work_email TEXT,
    work_email_verified BOOLEAN NOT NULL DEFAULT false,
    work_proof_file_name TEXT,
    work_proof_file_url TEXT,
    id_document_type TEXT,
    id_document_masked TEXT,
    weekly_availability_hours INTEGER NOT NULL DEFAULT 4,
    status verification_status NOT NULL DEFAULT 'pending',
    rejection_reason TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_application UNIQUE (user_id)
);

-- 3. Per-Service Granular Approvals Table
-- Enforces PRD §9.1 & P5 Exit Criteria: "Approval of one service does not approve another."
CREATE TABLE IF NOT EXISTS public.mentor_service_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_code service_code NOT NULL,
    status verification_status NOT NULL DEFAULT 'pending',
    rejection_reason TEXT,
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_mentor_service UNIQUE (mentor_id, service_code)
);

-- 4. Mentor Availability Slots Table
-- Manages weekly slot availability, Asia/Kolkata timezone rules & buffer margins
CREATE TABLE IF NOT EXISTS public.mentor_availability_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 1=Mon... 6=Sat
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    is_active BOOLEAN NOT NULL DEFAULT true,
    buffer_minutes INTEGER NOT NULL DEFAULT 15,
    min_notice_hours INTEGER NOT NULL DEFAULT 2,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT valid_slot_time_range CHECK (end_time > start_time)
);

-- 5. Indexes for Query Performance
CREATE INDEX IF NOT EXISTS idx_mentor_apps_user ON public.mentor_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_apps_status ON public.mentor_applications(status);
CREATE INDEX IF NOT EXISTS idx_mentor_apps_employer ON public.mentor_applications(current_employer);
CREATE INDEX IF NOT EXISTS idx_service_approvals_mentor ON public.mentor_service_approvals(mentor_id);
CREATE INDEX IF NOT EXISTS idx_service_approvals_status ON public.mentor_service_approvals(service_code, status);
CREATE INDEX IF NOT EXISTS idx_availability_mentor ON public.mentor_availability_slots(mentor_id, is_active);
CREATE INDEX IF NOT EXISTS idx_availability_day ON public.mentor_availability_slots(day_of_week);

-- 6. Row-Level Security (RLS) Activation
ALTER TABLE public.mentor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_service_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_availability_slots ENABLE ROW LEVEL SECURITY;

-- Permissions Grants
GRANT SELECT, INSERT, UPDATE ON public.mentor_applications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentor_service_approvals TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentor_availability_slots TO authenticated;
GRANT SELECT ON public.mentor_service_approvals TO anon;
GRANT SELECT ON public.mentor_availability_slots TO anon;

-- Policies: mentor_applications
-- Applicants can read their own application
CREATE POLICY "Applicants can view own application"
    ON public.mentor_applications
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Applicants can submit their initial application
CREATE POLICY "Applicants can submit application"
    ON public.mentor_applications
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Applicants can update their application while it is still pending/draft
CREATE POLICY "Applicants can edit pending application"
    ON public.mentor_applications
    FOR UPDATE
    TO authenticated
    USING (
        (auth.uid() = user_id AND status = 'pending')
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    )
    WITH CHECK (
        (auth.uid() = user_id AND status = 'pending')
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Policies: mentor_service_approvals
-- Mentors see their own service approvals; admins see all; candidates see approved services
CREATE POLICY "Anyone can view approved mentor services"
    ON public.mentor_service_approvals
    FOR SELECT
    TO public
    USING (
        status = 'approved'
        OR auth.uid() = mentor_id
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Admins manage service approvals
CREATE POLICY "Admins manage service approvals"
    ON public.mentor_service_approvals
    FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policies: mentor_availability_slots
-- Mentors can manage their own calendar slots
CREATE POLICY "Mentors manage own slots"
    ON public.mentor_availability_slots
    FOR ALL
    TO authenticated
    USING (
        auth.uid() = mentor_id
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    )
    WITH CHECK (auth.uid() = mentor_id);

-- Candidates can view active slots of approved mentors (P5 Exit Criteria 1)
CREATE POLICY "Public view active slots of approved mentors"
    ON public.mentor_availability_slots
    FOR SELECT
    TO public
    USING (
        is_active = true AND EXISTS (
            SELECT 1 FROM public.mentor_profiles
            WHERE id = mentor_availability_slots.mentor_id
            AND verification_status = 'approved'
        )
    );

-- 7. Functions & Triggers for Exit Criteria Enforcement

-- P5 Exit Criteria 4: "Work-email OTP alone never grants approval."
-- Enforce that status = 'approved' requires an authentic human admin reviewer ID.
CREATE OR REPLACE FUNCTION public.enforce_mentor_approval_governance()
RETURNS TRIGGER AS $$
DECLARE
    reviewer_role user_role;
BEGIN
    IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
        IF NEW.reviewed_by IS NULL THEN
            RAISE EXCEPTION 'Governance Breach (PRD §9.1): Mentor approval requires an accredited admin reviewer ID.';
        END IF;

        SELECT role INTO reviewer_role FROM public.profiles WHERE id = NEW.reviewed_by;
        IF reviewer_role IS NULL OR reviewer_role != 'admin' THEN
            RAISE EXCEPTION 'Security Violation: Only a designated platform admin can approve mentor applications.';
        END IF;

        NEW.reviewed_at = timezone('utc'::text, now());

        -- When application is approved, also sync public.mentor_profiles and public.profiles role
        UPDATE public.profiles
        SET role = 'mentor', updated_at = timezone('utc'::text, now())
        WHERE id = NEW.user_id;

        INSERT INTO public.mentor_profiles (
            id,
            current_employer,
            job_title,
            years_of_experience,
            verification_status,
            bio,
            linkedin_url
        ) VALUES (
            NEW.user_id,
            NEW.current_employer,
            NEW.job_title,
            NEW.years_of_experience,
            'approved',
            NEW.bio,
            NEW.linkedin_url
        ) ON CONFLICT (id) DO UPDATE SET
            current_employer = EXCLUDED.current_employer,
            job_title = EXCLUDED.job_title,
            years_of_experience = EXCLUDED.years_of_experience,
            verification_status = 'approved',
            updated_at = timezone('utc'::text, now());
    END IF;

    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_mentor_app_governance ON public.mentor_applications;
CREATE TRIGGER trg_mentor_app_governance
    BEFORE UPDATE ON public.mentor_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_mentor_approval_governance();

-- P5 Exit Criteria 3: "Every admin view of identity evidence is logged."
-- RPC function called by /admin/verification whenever an admin accesses a mentor's identity evidence
CREATE OR REPLACE FUNCTION public.log_identity_evidence_access(
    p_target_id TEXT,
    p_evidence_type TEXT,
    p_reason_code TEXT DEFAULT 'KYC_AUDIT_REVIEW'
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
    caller_role user_role;
BEGIN
    SELECT role INTO caller_role FROM public.profiles WHERE id = auth.uid();
    IF caller_role IS NULL OR caller_role != 'admin' THEN
        RAISE EXCEPTION 'Access Denied: Only administrators are authorized to audit identity evidence.';
    END IF;

    INSERT INTO public.audit_logs (
        actor_id,
        action,
        target_type,
        target_id,
        reason_code,
        metadata
    ) VALUES (
        auth.uid(),
        'VIEW_IDENTITY_EVIDENCE',
        'mentor_evidence',
        p_target_id,
        p_reason_code,
        jsonb_build_object(
            'evidence_type', p_evidence_type,
            'timestamp', timezone('utc'::text, now()),
            'compliance', 'DPDP_ACT_2023_ARTICLE_8'
        )
    ) RETURNING id INTO log_id;

    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
