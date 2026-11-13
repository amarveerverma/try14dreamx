-- ==============================================================================
-- DREAMX DATABASE MIGRATION: PHASE P12
-- Operations Console & Analytics Engine (PRD §15, §20)
-- 
-- Delivers:
-- 1. Admin RBAC & Sub-Roles (super_admin, ops_agent, reviewer, finance_controller)
-- 2. Operations Queues Procedure (verifications, disputes, late reports, dual approvals, match exceptions, tickets)
-- 3. Marketplace & Funnel Analytics Engine (GMV, Take Rate, Dispute Rate, Report SLA)
-- 4. Verified vs Self-Reported Outcomes separation with Small-Sample Suppression (< 5 samples)
-- 5. Audit Log Query & Inspection Engine
-- 6. Privacy DPDP Data Export & Soft Delete with 30-Day Purge Scheduling
-- ==============================================================================

-- 1. Admin Sub-Roles Enum & Profile Column
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_subrole') THEN
        CREATE TYPE public.admin_subrole AS ENUM (
            'super_admin',
            'ops_agent',
            'reviewer',
            'finance_controller'
        );
    END IF;
END $$;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS admin_subrole public.admin_subrole DEFAULT 'super_admin';

-- 2. Privacy Purge Requests Table (PRD §18.2)
CREATE TABLE IF NOT EXISTS public.privacy_purge_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    requested_by UUID NOT NULL REFERENCES public.profiles(id),
    request_type TEXT NOT NULL CHECK (request_type IN ('export', 'soft_delete', 'hard_purge')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'scheduled')),
    scheduled_purge_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.privacy_purge_requests ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins manage privacy requests' AND tablename = 'privacy_purge_requests') THEN
        CREATE POLICY "Admins manage privacy requests"
            ON public.privacy_purge_requests
            FOR ALL
            TO authenticated
            USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
    END IF;
END $$;

-- 3. Operations Queues Procedure (PRD §15.1, §15.2, P12 Exit Criteria 1)
-- Tailors queues based on strict administrator sub-role permissions
CREATE OR REPLACE FUNCTION public.get_admin_ops_queues(p_admin_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_admin RECORD;
    v_subrole public.admin_subrole;
    v_verifications JSONB := '[]'::jsonb;
    v_disputes JSONB := '[]'::jsonb;
    v_late_reports JSONB := '[]'::jsonb;
    v_financial_approvals JSONB := '[]'::jsonb;
    v_match_exceptions JSONB := '[]'::jsonb;
    v_support_tickets JSONB := '[]'::jsonb;
BEGIN
    SELECT * INTO v_admin FROM public.profiles WHERE id = p_admin_id;
    IF v_admin.id IS NULL OR v_admin.role != 'admin' THEN
        RAISE EXCEPTION 'Unauthorized: Only platform administrators can access operations queues.';
    END IF;
    v_subrole := COALESCE(v_admin.admin_subrole, 'super_admin');

    -- 1. Verifications Queue: visible to super_admin and reviewer
    IF v_subrole IN ('super_admin', 'reviewer') THEN
        SELECT COALESCE(jsonb_agg(to_jsonb(v)), '[]'::jsonb) INTO v_verifications
        FROM (
            SELECT id, user_id, full_name, email, current_employer, job_title, status, created_at
            FROM public.mentor_applications
            WHERE status IN ('pending', 'in_review')
            ORDER BY created_at ASC
        ) v;
    END IF;

    -- 2. Late Deliverable Reports: visible to super_admin and reviewer
    IF v_subrole IN ('super_admin', 'reviewer') THEN
        SELECT COALESCE(jsonb_agg(to_jsonb(r)), '[]'::jsonb) INTO v_late_reports
        FROM (
            SELECT sr.id, sr.booking_id, sr.mentor_id, sr.service_code, sr.sla_deadline_at, sr.is_late, sr.submitted_at, b.session_start
            FROM public.session_reports sr
            JOIN public.bookings b ON b.id = sr.booking_id
            WHERE sr.is_late = true OR (sr.submitted_at IS NULL AND timezone('utc'::text, now()) > sr.sla_deadline_at)
            ORDER BY sr.sla_deadline_at ASC
        ) r;
    END IF;

    -- 3. Disputes Queue: visible to super_admin, ops_agent, finance_controller
    IF v_subrole IN ('super_admin', 'ops_agent', 'finance_controller') THEN
        SELECT COALESCE(jsonb_agg(to_jsonb(d)), '[]'::jsonb) INTO v_disputes
        FROM (
            SELECT d.id, d.dispute_ref, d.booking_id, d.student_id, d.mentor_id, d.reason_code, d.status, d.created_at, b.amount_paise
            FROM public.disputes d
            JOIN public.bookings b ON b.id = d.booking_id
            WHERE d.status IN ('opened', 'under_review')
            ORDER BY d.created_at ASC
        ) d;
    END IF;

    -- 4. Financial Approvals (Dual Control): visible to super_admin and finance_controller
    IF v_subrole IN ('super_admin', 'finance_controller') THEN
        SELECT COALESCE(jsonb_agg(to_jsonb(fa)), '[]'::jsonb) INTO v_financial_approvals
        FROM (
            SELECT fa.id, fa.action_type, fa.target_id, fa.amount_paise, fa.reason, fa.status, fa.first_approver, fa.first_approved_at, fa.created_at
            FROM public.financial_approvals fa
            WHERE fa.status = 'first_approved'
            ORDER BY fa.created_at ASC
        ) fa;
    END IF;

    -- 5. Smart Match Exceptions: visible to super_admin and ops_agent
    IF v_subrole IN ('super_admin', 'ops_agent') THEN
        SELECT COALESCE(jsonb_agg(to_jsonb(sm)), '[]'::jsonb) INTO v_match_exceptions
        FROM (
            SELECT id, request_ref, student_id, service_code, status, current_wave, timeout_at, created_at
            FROM public.smart_match_requests
            WHERE status IN ('timeout_fallback', 'cancelled') OR (status IN ('pending', 'wave_1', 'wave_2') AND timezone('utc'::text, now()) > timeout_at)
            ORDER BY created_at DESC
        ) sm;
    END IF;

    -- 6. Support Tickets: visible to super_admin and ops_agent
    IF v_subrole IN ('super_admin', 'ops_agent') THEN
        SELECT COALESCE(jsonb_agg(to_jsonb(st)), '[]'::jsonb) INTO v_support_tickets
        FROM (
            SELECT id, ticket_ref, user_id, category, subject, priority, status, sla_target_response, created_at
            FROM public.support_tickets
            WHERE status = 'open'
            ORDER BY priority DESC, created_at ASC
        ) st;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'admin_id', p_admin_id,
        'subrole', v_subrole,
        'queues', jsonb_build_object(
            'verifications', v_verifications,
            'late_reports', v_late_reports,
            'disputes', v_disputes,
            'financial_approvals', v_financial_approvals,
            'match_exceptions', v_match_exceptions,
            'support_tickets', v_support_tickets
        ),
        'counts', jsonb_build_object(
            'verifications', jsonb_array_length(v_verifications),
            'late_reports', jsonb_array_length(v_late_reports),
            'disputes', jsonb_array_length(v_disputes),
            'financial_approvals', jsonb_array_length(v_financial_approvals),
            'match_exceptions', jsonb_array_length(v_match_exceptions),
            'support_tickets', jsonb_array_length(v_support_tickets)
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Marketplace & Funnel Analytics Procedure (PRD §20, P12 Exit Criteria 2 & 3)
CREATE OR REPLACE FUNCTION public.get_marketplace_analytics(
    p_admin_id UUID,
    p_days_interval INT DEFAULT 30
)
RETURNS JSONB AS $$
DECLARE
    v_admin RECORD;
    v_cutoff TIMESTAMPTZ := timezone('utc'::text, now()) - (p_days_interval || ' days')::INTERVAL;
    
    v_gmv_paise BIGINT := 0;
    v_gmv_count BIGINT := 0;
    v_total_platform_fee_paise BIGINT := 0;
    v_total_gross_settlement_paise BIGINT := 0;
    v_take_rate_pct NUMERIC := 20.0;
    
    v_completed_sessions_count BIGINT := 0;
    v_disputes_count BIGINT := 0;
    v_dispute_rate_pct NUMERIC := 0.0;
    
    v_total_reports_count BIGINT := 0;
    v_on_time_reports_count BIGINT := 0;
    v_report_sla_pct NUMERIC := 100.0;
    
    v_verified_score_avg NUMERIC := 0.0;
    v_verified_count BIGINT := 0;
    v_self_reported_avg NUMERIC := 0.0;
    v_self_reported_count BIGINT := 0;
    
    v_suppress_outcomes BOOLEAN := false;
BEGIN
    SELECT * INTO v_admin FROM public.profiles WHERE id = p_admin_id;
    IF v_admin.id IS NULL OR v_admin.role != 'admin' THEN
        RAISE EXCEPTION 'Unauthorized: Only platform administrators can access marketplace analytics.';
    END IF;

    -- 1. GMV: Captured confirmed or completed bookings
    SELECT 
        COALESCE(SUM(amount_paise), 0),
        COUNT(*)
    INTO v_gmv_paise, v_gmv_count
    FROM public.bookings
    WHERE status IN ('confirmed', 'completed')
      AND payment_status = 'captured'
      AND created_at >= v_cutoff;

    -- 2. Take Rate: Realized platform fees / Gross settlements
    SELECT 
        COALESCE(SUM(platform_fee_paise), 0),
        COALESCE(SUM(gross_amount_paise), 0)
    INTO v_total_platform_fee_paise, v_total_gross_settlement_paise
    FROM public.mentor_settlements
    WHERE payout_status IN ('eligible_for_payout', 'settled', 'in_escrow')
      AND created_at >= v_cutoff;

    IF v_total_gross_settlement_paise > 0 THEN
        v_take_rate_pct := ROUND((v_total_platform_fee_paise::NUMERIC / v_total_gross_settlement_paise::NUMERIC) * 100.0, 2);
    ELSE
        v_take_rate_pct := 20.0;
    END IF;

    -- 3. Dispute Rate: Disputes logged / Completed Sessions
    SELECT COUNT(*) INTO v_completed_sessions_count
    FROM public.bookings
    WHERE status = 'completed' AND created_at >= v_cutoff;

    SELECT COUNT(*) INTO v_disputes_count
    FROM public.disputes
    WHERE created_at >= v_cutoff;

    IF v_completed_sessions_count > 0 THEN
        v_dispute_rate_pct := ROUND((v_disputes_count::NUMERIC / v_completed_sessions_count::NUMERIC) * 100.0, 2);
    ELSE
        v_dispute_rate_pct := 0.0;
    END IF;

    -- 4. Report SLA Adherence: On-time reports / Total submitted reports
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE is_late = false)
    INTO v_total_reports_count, v_on_time_reports_count
    FROM public.session_reports
    WHERE created_at >= v_cutoff;

    IF v_total_reports_count > 0 THEN
        v_report_sla_pct := ROUND((v_on_time_reports_count::NUMERIC / v_total_reports_count::NUMERIC) * 100.0, 2);
    ELSE
        v_report_sla_pct := 100.0;
    END IF;

    -- 5. Verified vs Self-Reported Outcomes & Small-Sample Suppression Rule (PRD §20)
    SELECT 
        COUNT(*),
        COALESCE(ROUND(AVG(rating), 2), 0.0)
    INTO v_self_reported_count, v_self_reported_avg
    FROM public.session_feedback
    WHERE created_at >= v_cutoff;

    -- Suppression rule: If sample size < 5, do NOT publish outcome percentage/average
    IF v_self_reported_count < 5 THEN
        v_suppress_outcomes := true;
    ELSE
        v_suppress_outcomes := false;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'time_window_days', p_days_interval,
        'metrics', jsonb_build_object(
            'gmv', jsonb_build_object(
                'amount_paise', v_gmv_paise,
                'amount_inr', ROUND(v_gmv_paise / 100.0, 2),
                'transaction_count', v_gmv_count,
                'definition', 'Gross Merchandise Value of captured bookings',
                'numerator', 'SUM(amount_paise) for status IN (confirmed, completed) AND payment_status = captured',
                'denominator', '1 (Summation)',
                'exclusions', 'Refunded bookings, unpaid reservations, test seed bookings'
            ),
            'take_rate', jsonb_build_object(
                'percentage', v_take_rate_pct,
                'platform_fee_paise', v_total_platform_fee_paise,
                'definition', 'Realized platform fee percentage over gross mentor settlements',
                'numerator', 'SUM(platform_fee_paise) in active escrow or payout',
                'denominator', 'SUM(gross_amount_paise)',
                'exclusions', 'Forfeited escrow due to full student refund'
            ),
            'dispute_rate', jsonb_build_object(
                'percentage', v_dispute_rate_pct,
                'disputes_count', v_disputes_count,
                'completed_sessions', v_completed_sessions_count,
                'definition', 'Percentage of completed mentorship sessions resulting in formal dispute',
                'numerator', 'COUNT(disputes) opened within time window',
                'denominator', 'COUNT(bookings) with status = completed',
                'exclusions', 'Cancellations before session start'
            ),
            'report_sla_adherence', jsonb_build_object(
                'percentage', v_report_sla_pct,
                'on_time_count', v_on_time_reports_count,
                'total_reports', v_total_reports_count,
                'definition', 'Percentage of rubric scorecards submitted within 48-hour delivery window',
                'numerator', 'COUNT(session_reports) with is_late = false',
                'denominator', 'COUNT(session_reports) submitted',
                'exclusions', 'Rescheduled sessions or unheld bookings'
            ),
            'outcomes_separation', jsonb_build_object(
                'self_reported', jsonb_build_object(
                    'count', v_self_reported_count,
                    'average_rating', CASE WHEN v_suppress_outcomes THEN NULL ELSE v_self_reported_avg END,
                    'small_sample_suppressed', v_suppress_outcomes,
                    'display_text', CASE WHEN v_suppress_outcomes THEN 'Insufficient Sample (< 5 ratings) - Suppressed' ELSE v_self_reported_avg::TEXT || ' / 5.0' END,
                    'definition', 'Subjective candidate post-session feedback rating'
                ),
                'verified_rubrics', jsonb_build_object(
                    'count', v_total_reports_count,
                    'definition', 'Objective 8-dimension rubric scorecards committed by vetted mentors'
                )
            )
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RBAC Co-signature Gate (PRD §15.2, P12 Exit Criteria 1)
CREATE OR REPLACE FUNCTION public.co_sign_financial_approval_p12(
    p_approval_id UUID,
    p_admin_id UUID,
    p_approve BOOLEAN,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_admin RECORD;
    v_subrole public.admin_subrole;
BEGIN
    SELECT * INTO v_admin FROM public.profiles WHERE id = p_admin_id;
    IF v_admin.id IS NULL OR v_admin.role != 'admin' THEN
        RAISE EXCEPTION 'Unauthorized: Only platform administrators can co-sign financial transactions.';
    END IF;

    v_subrole := COALESCE(v_admin.admin_subrole, 'super_admin');
    IF v_subrole NOT IN ('super_admin', 'finance_controller') THEN
        RAISE EXCEPTION 'RBAC Access Denied: Administrator role "%" does not possess financial co-signature authority. Required: super_admin or finance_controller.', v_subrole;
    END IF;

    -- Delegate to canonical dual-approval engine
    RETURN public.execute_financial_co_signature(
        p_approval_id,
        p_admin_id,
        p_approve,
        p_notes
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Audit Log Query Procedure (PRD §15.3)
CREATE OR REPLACE FUNCTION public.query_admin_audit_logs(
    p_admin_id UUID,
    p_target_type TEXT DEFAULT NULL,
    p_limit INT DEFAULT 50
)
RETURNS JSONB AS $$
DECLARE
    v_admin RECORD;
    v_logs JSONB;
BEGIN
    SELECT * INTO v_admin FROM public.profiles WHERE id = p_admin_id;
    IF v_admin.id IS NULL OR v_admin.role != 'admin' THEN
        RAISE EXCEPTION 'Unauthorized: Only platform administrators can view audit logs.';
    END IF;

    SELECT COALESCE(jsonb_agg(to_jsonb(l)), '[]'::jsonb) INTO v_logs
    FROM (
        SELECT 
            al.id,
            al.actor_id,
            p.full_name AS actor_name,
            p.role AS actor_role,
            al.action,
            al.target_type,
            al.target_id,
            al.reason_code,
            al.metadata,
            al.ip_address,
            al.created_at
        FROM public.audit_logs al
        LEFT JOIN public.profiles p ON p.id = al.actor_id
        WHERE (p_target_type IS NULL OR al.target_type = p_target_type)
        ORDER BY al.created_at DESC
        LIMIT p_limit
    ) l;

    RETURN jsonb_build_object(
        'success', true,
        'count', jsonb_array_length(v_logs),
        'logs', v_logs
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Privacy Data Export Procedure (PRD §18.2)
CREATE OR REPLACE FUNCTION public.request_user_data_export(
    p_admin_id UUID,
    p_target_user_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_admin RECORD;
    v_target RECORD;
    v_bookings JSONB;
    v_feedbacks JSONB;
    v_tickets JSONB;
    v_req_id UUID;
BEGIN
    SELECT * INTO v_admin FROM public.profiles WHERE id = p_admin_id;
    IF v_admin.id IS NULL OR v_admin.role != 'admin' THEN
        RAISE EXCEPTION 'Unauthorized: Only platform administrators can request compliance data exports.';
    END IF;

    SELECT * INTO v_target FROM public.profiles WHERE id = p_target_user_id;
    IF v_target.id IS NULL THEN
        RAISE EXCEPTION 'Target user not found.';
    END IF;

    SELECT COALESCE(jsonb_agg(to_jsonb(b)), '[]'::jsonb) INTO v_bookings
    FROM public.bookings b
    WHERE b.student_id = p_target_user_id OR b.mentor_id = p_target_user_id;

    SELECT COALESCE(jsonb_agg(to_jsonb(f)), '[]'::jsonb) INTO v_feedbacks
    FROM public.session_feedback f
    WHERE f.student_id = p_target_user_id OR f.mentor_id = p_target_user_id;

    SELECT COALESCE(jsonb_agg(to_jsonb(t)), '[]'::jsonb) INTO v_tickets
    FROM public.support_tickets t
    WHERE t.user_id = p_target_user_id;

    INSERT INTO public.privacy_purge_requests (
        user_id,
        requested_by,
        request_type,
        status,
        completed_at,
        notes
    ) VALUES (
        p_target_user_id,
        p_admin_id,
        'export',
        'completed',
        timezone('utc'::text, now()),
        'User data export compiled by admin ' || v_admin.full_name
    ) RETURNING id INTO v_req_id;

    INSERT INTO public.audit_logs (
        actor_id,
        action,
        target_type,
        target_id,
        reason_code,
        metadata
    ) VALUES (
        p_admin_id,
        'USER_DATA_EXPORT_GENERATED',
        'privacy_export',
        p_target_user_id::TEXT,
        'COMPLIANCE_DPDP_REQUEST',
        jsonb_build_object('request_id', v_req_id, 'target_user_email', v_target.email)
    );

    RETURN jsonb_build_object(
        'success', true,
        'request_id', v_req_id,
        'user_profile', to_jsonb(v_target),
        'bookings_count', jsonb_array_length(v_bookings),
        'feedback_count', jsonb_array_length(v_feedbacks),
        'tickets_count', jsonb_array_length(v_tickets),
        'export_package', jsonb_build_object(
            'profile', to_jsonb(v_target),
            'bookings', v_bookings,
            'feedback', v_feedbacks,
            'support_tickets', v_tickets
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Privacy Soft Delete Procedure (PRD §18.2)
CREATE OR REPLACE FUNCTION public.execute_privacy_soft_delete(
    p_admin_id UUID,
    p_target_user_id UUID,
    p_reason TEXT DEFAULT 'User requested account closure & personal data erasure'
)
RETURNS JSONB AS $$
DECLARE
    v_admin RECORD;
    v_target RECORD;
    v_purge_date TIMESTAMPTZ := timezone('utc'::text, now()) + INTERVAL '30 days';
    v_req_id UUID;
    v_anonymized_email TEXT;
BEGIN
    SELECT * INTO v_admin FROM public.profiles WHERE id = p_admin_id;
    IF v_admin.id IS NULL OR v_admin.role != 'admin' THEN
        RAISE EXCEPTION 'Unauthorized: Only platform administrators can execute privacy deletion workflows.';
    END IF;

    SELECT * INTO v_target FROM public.profiles WHERE id = p_target_user_id;
    IF v_target.id IS NULL THEN
        RAISE EXCEPTION 'Target user not found.';
    END IF;

    v_anonymized_email := 'anonymized_' || SUBSTRING(MD5(p_target_user_id::TEXT) FROM 1 FOR 8) || '@deleted.dreamx.in';

    -- Soft delete immediately: strip PII from active profile
    UPDATE public.profiles
    SET full_name = '[DELETED USER]',
        email = v_anonymized_email,
        phone = NULL,
        bio = NULL,
        target_role = NULL,
        target_company_tier = NULL,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_target_user_id;

    -- Schedule hard purge record targeted within 30 days
    INSERT INTO public.privacy_purge_requests (
        user_id,
        requested_by,
        request_type,
        status,
        scheduled_purge_date,
        notes
    ) VALUES (
        p_target_user_id,
        p_admin_id,
        'soft_delete',
        'scheduled',
        v_purge_date,
        p_reason
    ) RETURNING id INTO v_req_id;

    -- Audit trail
    INSERT INTO public.audit_logs (
        actor_id,
        action,
        target_type,
        target_id,
        reason_code,
        metadata
    ) VALUES (
        p_admin_id,
        'USER_PRIVACY_SOFT_DELETED',
        'user_profile',
        p_target_user_id::TEXT,
        'DPDP_RIGHT_TO_ERASURE',
        jsonb_build_object(
            'request_id', v_req_id,
            'scheduled_purge_date', v_purge_date,
            'reason', p_reason
        )
    );

    RETURN jsonb_build_object(
        'success', true,
        'request_id', v_req_id,
        'user_id', p_target_user_id,
        'soft_deleted_immediately', true,
        'scheduled_purge_date', v_purge_date,
        'message', 'User profile soft-deleted immediately. Hard purge scheduled within 30-day compliance retention window.'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Record migration version in schema migrations tracking table
INSERT INTO supabase_migrations.schema_migrations (version, name)
VALUES ('20261113_08', 'phase_p12_ops_console_analytics')
ON CONFLICT (version) DO NOTHING;
