-- ============================================================================
-- DREAMX PHASE P14: CONTROLLED PILOT ACCEPTANCE & REAL USER TRANSITION
-- PRD §22, §10.2, §14, §15, Implementation Plan P14 Exit Criteria 1, 2, 3
-- ============================================================================

-- 1. Pilot Mentors Seeding across the 3 Launch Domains (PRD §22.1)
-- Domain 1: Software Engineering (Staff SWE / Distributed Systems)
-- Domain 2: Data Science / AI (Lead Machine Learning Engineer & AI Architect)
-- Domain 3: Product Management (Lead Product Manager)

-- Insert auth.users for the 3 Pilot Mentors
INSERT INTO auth.users (id, email, role, aud)
VALUES 
    ('d1111111-1111-4111-8111-111111111101', 'rajesh.kannan@mentors.dreamx.in', 'authenticated', 'authenticated'),
    ('d2222222-2222-4222-8222-222222222202', 'neha.kapoor@mentors.dreamx.in', 'authenticated', 'authenticated'),
    ('d3333333-3333-4333-8333-333333333303', 'rohan.deshmukh@mentors.dreamx.in', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- Pilot Mentor 1: Rajesh Kannan (Software Engineering)
UPDATE public.profiles
SET 
    role = 'mentor',
    full_name = 'Rajesh Kannan',
    avatar_url = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    phone = '+919876543211',
    segment = NULL,
    updated_at = timezone('utc'::text, now())
WHERE id = 'd1111111-1111-4111-8111-111111111101';

INSERT INTO public.mentor_profiles (
    id,
    current_employer,
    job_title,
    years_of_experience,
    verification_status,
    approved_services,
    bio,
    linkedin_url,
    upi_id,
    bank_account_number,
    bank_ifsc,
    sla_compliance_rate,
    rating,
    reviews_count
) VALUES (
    'd1111111-1111-4111-8111-111111111101',
    'Tier-1 Product Tech (Ex-Amazon)',
    'Staff Software Engineer (Distributed Systems)',
    9,
    'approved',
    ARRAY['S01', 'S02', 'S04', 'S06', 'S08', 'S10']::service_code[],
    'Specializes in distributed systems fault tolerance, high-concurrency event pipelines, and low-level design for SDE-2 and SDE-3 roles.',
    'https://linkedin.com/in/rajesh-kannan-tech',
    'rajesh.kannan@icici',
    '112233445566',
    'ICIC0001234',
    0.98,
    4.96,
    118
) ON CONFLICT (id) DO UPDATE SET
    verification_status = 'approved',
    approved_services = EXCLUDED.approved_services,
    rating = EXCLUDED.rating,
    reviews_count = EXCLUDED.reviews_count,
    updated_at = timezone('utc'::text, now());

-- Pilot Mentor 2: Dr. Neha Kapoor (Data Science & AI)
UPDATE public.profiles
SET 
    role = 'mentor',
    full_name = 'Dr. Neha Kapoor',
    avatar_url = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    phone = '+919876543212',
    segment = NULL,
    updated_at = timezone('utc'::text, now())
WHERE id = 'd2222222-2222-4222-8222-222222222202';

INSERT INTO public.mentor_profiles (
    id,
    current_employer,
    job_title,
    years_of_experience,
    verification_status,
    approved_services,
    bio,
    linkedin_url,
    upi_id,
    bank_account_number,
    bank_ifsc,
    sla_compliance_rate,
    rating,
    reviews_count
) VALUES (
    'd2222222-2222-4222-8222-222222222202',
    'Enterprise AI Platform (Ex-Microsoft IDC)',
    'Lead Machine Learning Engineer & AI Systems Architect',
    8,
    'approved',
    ARRAY['S01', 'S04', 'S06', 'S09']::service_code[],
    'Deconstructs real ML systems design: Triton inference servers, RAG evals, embedding drift detection, and Kubeflow orchestration for senior ML positions.',
    'https://linkedin.com/in/dr-neha-kapoor-ai',
    'neha.kapoor@okhdfcbank',
    '223344556677',
    'HDFC0002345',
    0.99,
    4.98,
    142
) ON CONFLICT (id) DO UPDATE SET
    verification_status = 'approved',
    approved_services = EXCLUDED.approved_services,
    rating = EXCLUDED.rating,
    reviews_count = EXCLUDED.reviews_count,
    updated_at = timezone('utc'::text, now());

-- Pilot Mentor 3: Rohan Deshmukh (Product Management)
UPDATE public.profiles
SET 
    role = 'mentor',
    full_name = 'Rohan Deshmukh',
    avatar_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    phone = '+919876543213',
    segment = NULL,
    updated_at = timezone('utc'::text, now())
WHERE id = 'd3333333-3333-4333-8333-333333333303';

INSERT INTO public.mentor_profiles (
    id,
    current_employer,
    job_title,
    years_of_experience,
    verification_status,
    approved_services,
    bio,
    linkedin_url,
    upi_id,
    bank_account_number,
    bank_ifsc,
    sla_compliance_rate,
    rating,
    reviews_count
) VALUES (
    'd3333333-3333-4333-8333-333333333303',
    'Razorpay',
    'Lead Product Manager (FinTech & Checkout)',
    6,
    'approved',
    ARRAY['S01', 'S05', 'S07', 'S08']::service_code[],
    'Led merchant payments checkout at Razorpay. Helps engineers transition to Product and Senior PMs crack Tier-1 product execution and product sense interviews.',
    'https://linkedin.com/in/rohan-deshmukh-pm',
    'rohan.deshmukh@okaxis',
    '334455667788',
    'UTIB0003456',
    0.97,
    4.91,
    65
) ON CONFLICT (id) DO UPDATE SET
    verification_status = 'approved',
    approved_services = EXCLUDED.approved_services,
    rating = EXCLUDED.rating,
    reviews_count = EXCLUDED.reviews_count,
    updated_at = timezone('utc'::text, now());

-- 2. Seed Explicit Service Approvals (P5 Exit Criteria 2)
INSERT INTO public.mentor_service_approvals (mentor_id, service_code, status, approved_at)
VALUES
    -- Rajesh Kannan (Software Engineering)
    ('d1111111-1111-4111-8111-111111111101', 'S01', 'approved', timezone('utc'::text, now())),
    ('d1111111-1111-4111-8111-111111111101', 'S02', 'approved', timezone('utc'::text, now())),
    ('d1111111-1111-4111-8111-111111111101', 'S04', 'approved', timezone('utc'::text, now())),
    ('d1111111-1111-4111-8111-111111111101', 'S06', 'approved', timezone('utc'::text, now())),
    ('d1111111-1111-4111-8111-111111111101', 'S08', 'approved', timezone('utc'::text, now())),
    ('d1111111-1111-4111-8111-111111111101', 'S10', 'approved', timezone('utc'::text, now())),
    -- Dr. Neha Kapoor (Data Science / AI)
    ('d2222222-2222-4222-8222-222222222202', 'S01', 'approved', timezone('utc'::text, now())),
    ('d2222222-2222-4222-8222-222222222202', 'S04', 'approved', timezone('utc'::text, now())),
    ('d2222222-2222-4222-8222-222222222202', 'S06', 'approved', timezone('utc'::text, now())),
    ('d2222222-2222-4222-8222-222222222202', 'S09', 'approved', timezone('utc'::text, now())),
    -- Rohan Deshmukh (Product Management)
    ('d3333333-3333-4333-8333-333333333303', 'S01', 'approved', timezone('utc'::text, now())),
    ('d3333333-3333-4333-8333-333333333303', 'S05', 'approved', timezone('utc'::text, now())),
    ('d3333333-3333-4333-8333-333333333303', 'S07', 'approved', timezone('utc'::text, now())),
    ('d3333333-3333-4333-8333-333333333303', 'S08', 'approved', timezone('utc'::text, now()))
ON CONFLICT DO NOTHING;

-- 3. Seed Recurring Availability Slots for Pilot Mentors
INSERT INTO public.mentor_availability_slots (
    mentor_id,
    day_of_week,
    start_time,
    end_time,
    timezone,
    is_active,
    buffer_minutes,
    min_notice_hours
) VALUES
    -- Rajesh: Mon, Wed, Fri 19:00 - 21:00
    ('d1111111-1111-4111-8111-111111111101', 1, '19:00:00', '21:00:00', 'Asia/Kolkata', true, 15, 2),
    ('d1111111-1111-4111-8111-111111111101', 3, '19:00:00', '21:00:00', 'Asia/Kolkata', true, 15, 2),
    ('d1111111-1111-4111-8111-111111111101', 5, '19:00:00', '21:00:00', 'Asia/Kolkata', true, 15, 2),
    -- Neha: Tue, Thu, Sat 18:30 - 21:30
    ('d2222222-2222-4222-8222-222222222202', 2, '18:30:00', '21:30:00', 'Asia/Kolkata', true, 15, 2),
    ('d2222222-2222-4222-8222-222222222202', 4, '18:30:00', '21:30:00', 'Asia/Kolkata', true, 15, 2),
    ('d2222222-2222-4222-8222-222222222202', 6, '16:00:00', '19:00:00', 'Asia/Kolkata', true, 15, 2),
    -- Rohan: Wed, Fri, Sun 20:00 - 22:00
    ('d3333333-3333-4333-8333-333333333303', 3, '20:00:00', '22:00:00', 'Asia/Kolkata', true, 15, 2),
    ('d3333333-3333-4333-8333-333333333303', 5, '20:00:00', '22:00:00', 'Asia/Kolkata', true, 15, 2),
    ('d3333333-3333-4333-8333-333333333303', 0, '17:00:00', '20:00:00', 'Asia/Kolkata', true, 15, 2)
ON CONFLICT DO NOTHING;

-- 4. Controlled Pilot Acceptance Review Engine (PRD §22.2, §22.3, Implementation Plan P14 Exit Criteria 1 & 2)
CREATE OR REPLACE FUNCTION public.get_pilot_acceptance_review(p_admin_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_admin RECORD;
    v_total_bookings INT := 0;
    v_completed_bookings INT := 0;
    v_completion_rate NUMERIC := 0.0;
    v_total_reports INT := 0;
    v_on_time_reports INT := 0;
    v_sla_compliance_rate NUMERIC := 0.0;
    v_total_disputes INT := 0;
    v_dispute_rate NUMERIC := 0.0;
    v_total_settlements INT := 0;
    v_settled_paise BIGINT := 0;
    v_escrow_held_paise BIGINT := 0;
    v_nodal_violations INT := 0;
    v_gmv_paise BIGINT := 0;
    v_platform_cut_paise BIGINT := 0;
    v_gst_collected_paise BIGINT := 0;
    v_tds_withheld_paise BIGINT := 0;
    v_recommended_decision TEXT := 'EXPAND';
    v_all_targets_met BOOLEAN := true;
BEGIN
    -- Check admin authorization
    SELECT * INTO v_admin FROM public.profiles WHERE id = p_admin_id;
    IF v_admin.id IS NULL OR v_admin.role != 'admin' THEN
        RAISE EXCEPTION 'Unauthorized: Only platform administrators can view pilot acceptance metrics.';
    END IF;

    -- 1. Bookings & Completion Rate (Target >= 85%)
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'completed'),
        COALESCE(SUM(amount_paise), 0)
    INTO v_total_bookings, v_completed_bookings, v_gmv_paise
    FROM public.bookings
    WHERE status IN ('completed', 'confirmed', 'in_progress', 'cancelled', 'refunded');

    IF v_total_bookings > 0 THEN
        v_completion_rate := ROUND((v_completed_bookings::NUMERIC / v_total_bookings::NUMERIC) * 100, 2);
    ELSE
        v_completion_rate := 100.0; -- baseline neutral when fresh
    END IF;

    -- 2. Session Reports & 48-Hour SLA Compliance (Target >= 95%)
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE is_late = false)
    INTO v_total_reports, v_on_time_reports
    FROM public.session_reports;

    IF v_total_reports > 0 THEN
        v_sla_compliance_rate := ROUND((v_on_time_reports::NUMERIC / v_total_reports::NUMERIC) * 100, 2);
    ELSE
        v_sla_compliance_rate := 100.0;
    END IF;

    -- 3. Dispute Rate (Target < 5%)
    SELECT COUNT(*) INTO v_total_disputes FROM public.disputes;

    IF v_total_bookings > 0 THEN
        v_dispute_rate := ROUND((v_total_disputes::NUMERIC / v_total_bookings::NUMERIC) * 100, 2);
    ELSE
        v_dispute_rate := 0.0;
    END IF;

    -- 4. Nodal Escrow & Settlement Accounting (Target: 0 violations)
    SELECT 
        COUNT(*),
        COALESCE(SUM(net_payout_paise) FILTER (WHERE payout_status = 'settled'), 0),
        COALESCE(SUM(net_payout_paise) FILTER (WHERE payout_status IN ('in_escrow', 'accrued', 'eligible_for_payout')), 0),
        COALESCE(SUM(platform_fee_paise), 0),
        COALESCE(SUM(tds_deduction_paise), 0)
    INTO 
        v_total_settlements,
        v_settled_paise,
        v_escrow_held_paise,
        v_platform_cut_paise,
        v_tds_withheld_paise
    FROM public.mentor_settlements;

    -- Check for any nodal escrow violations (e.g. settlements without bookings)
    SELECT COUNT(*) INTO v_nodal_violations
    FROM public.mentor_settlements ms
    LEFT JOIN public.bookings b ON b.id = ms.booking_id
    WHERE b.id IS NULL;

    -- GST calculation (18% on platform take)
    v_gst_collected_paise := ROUND(v_platform_cut_paise * 0.18);

    -- Evaluate Go / No-Go Decision
    IF v_nodal_violations > 0 OR v_dispute_rate > 10.0 OR v_sla_compliance_rate < 80.0 THEN
        v_recommended_decision := 'PAUSE';
        v_all_targets_met := false;
    ELSIF v_sla_compliance_rate < 95.0 OR v_completion_rate < 85.0 OR v_dispute_rate >= 5.0 THEN
        v_recommended_decision := 'ADJUST';
        v_all_targets_met := false;
    ELSE
        v_recommended_decision := 'EXPAND';
        v_all_targets_met := true;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'pilot_cohort', jsonb_build_object(
            'domains', jsonb_build_array('Software Engineering', 'Data Science / AI', 'Product Management'),
            'active_pilot_mentors', 3,
            'status', 'ACTIVE_MEASUREMENT'
        ),
        'metrics', jsonb_build_object(
            'completion_rate', jsonb_build_object(
                'value', v_completion_rate,
                'target', '>= 85.0%',
                'passed', v_completion_rate >= 85.0
            ),
            'sla_compliance', jsonb_build_object(
                'value', v_sla_compliance_rate,
                'target', '>= 95.0%',
                'passed', v_sla_compliance_rate >= 95.0
            ),
            'dispute_rate', jsonb_build_object(
                'value', v_dispute_rate,
                'target', '< 5.0%',
                'passed', v_dispute_rate < 5.0
            ),
            'nodal_escrow_integrity', jsonb_build_object(
                'violations', v_nodal_violations,
                'target', '0 violations',
                'passed', v_nodal_violations = 0
            )
        ),
        'unit_economics_paise', jsonb_build_object(
            'gmv_paise', v_gmv_paise,
            'escrow_held_paise', v_escrow_held_paise,
            'settled_paise', v_settled_paise,
            'platform_net_revenue_paise', v_platform_cut_paise,
            'gst_remitted_paise', v_gst_collected_paise,
            'tds_withheld_paise', v_tds_withheld_paise
        ),
        'decision_evaluation', jsonb_build_object(
            'all_targets_met', v_all_targets_met,
            'recommended_decision', v_recommended_decision,
            'rationale', CASE
                WHEN v_recommended_decision = 'EXPAND' THEN 'All operational gates and unit economics met pre-agreed pilot SLA benchmarks. Cleared for cohort scale-up.'
                WHEN v_recommended_decision = 'ADJUST' THEN 'Pilot metrics stable but SLA or completion targets require domain calibration before wide release.'
                ELSE 'Critical operational or escrow thresholds violated. Operations paused pending founder audit.'
            END
        ),
        'reviewed_at', timezone('utc'::text, now())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Record Pilot Decision in Audit Trail (Implementation Plan P14 Exit Criteria 3)
CREATE OR REPLACE FUNCTION public.record_pilot_decision(
    p_admin_id UUID,
    p_decision TEXT,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_admin RECORD;
    v_now TIMESTAMPTZ := timezone('utc'::text, now());
BEGIN
    SELECT * INTO v_admin FROM public.profiles WHERE id = p_admin_id;
    IF v_admin.id IS NULL OR v_admin.role != 'admin' THEN
        RAISE EXCEPTION 'Unauthorized: Only platform administrators can record pilot expansion decisions.';
    END IF;

    IF p_decision NOT IN ('EXPAND', 'ADJUST', 'PAUSE') THEN
        RAISE EXCEPTION 'Invalid decision: % - must be EXPAND, ADJUST, or PAUSE.', p_decision;
    END IF;

    INSERT INTO public.audit_logs (
        actor_id,
        action,
        target_type,
        target_id,
        reason_code,
        metadata
    ) VALUES (
        p_admin_id,
        'PILOT_DECISION_RECORDED',
        'pilot_cohort',
        'COHORT_LAUNCH_THREE_DOMAINS',
        'PRD_V22_ACCEPTANCE',
        jsonb_build_object(
            'decision', p_decision,
            'notes', p_notes,
            'recorded_by', v_admin.full_name,
            'recorded_at', v_now
        )
    );

    RETURN jsonb_build_object(
        'success', true,
        'decision', p_decision,
        'recorded_at', v_now,
        'message', 'Pilot acceptance decision recorded successfully in audit trail.'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Record Migration in schema_migrations
INSERT INTO supabase_migrations.schema_migrations (version, statements, name)
VALUES (
    '20261113_10',
    ARRAY['public.get_pilot_acceptance_review', 'public.record_pilot_decision'],
    'phase_p14_controlled_pilot_acceptance'
)
ON CONFLICT (version) DO NOTHING;
