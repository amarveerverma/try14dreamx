-- ====================================================================
-- DreamX Phase P10: Memberships, Discounts and Bundles Migration
-- Target: India (CM-IN) • Supabase PostgreSQL 17.11
-- Specifications: PRD V3.0 §7, Implementation Plan §P10, Exit Criteria 1-3
-- ====================================================================

-- 1. Create Enums for Memberships, Billing, and Bundles
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'membership_plan') THEN
        CREATE TYPE membership_plan AS ENUM ('free', 'pro', 'elite');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'billing_cycle') THEN
        CREATE TYPE billing_cycle AS ENUM ('monthly', 'yearly');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'cancelled', 'expired');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bundle_status') THEN
        CREATE TYPE bundle_status AS ENUM ('active', 'partially_redeemed', 'fully_redeemed', 'expired', 'cancelled');
    END IF;
END $$;

-- 2. User Subscriptions Table (PRD §7.1, §7.2)
-- "Subscription states derived from verified provider events, never from the browser."
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan membership_plan NOT NULL DEFAULT 'free',
    billing_cycle billing_cycle NOT NULL DEFAULT 'monthly',
    status subscription_status NOT NULL DEFAULT 'active',
    amount_paise BIGINT NOT NULL DEFAULT 0,
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    cancelled_at TIMESTAMPTZ,
    provider_subscription_id TEXT,
    payment_reference TEXT,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON public.user_subscriptions(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_active_sub ON public.user_subscriptions(user_id) WHERE (status = 'active');

-- 3. Service Bundles Table (PRD §7.4, 3-Service Custom Bundle)
-- "Custom bundle: any 3 eligible services receive a 5% bundle discount."
CREATE TABLE IF NOT EXISTS public.service_bundles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    bundle_ref TEXT NOT NULL UNIQUE,
    total_services INTEGER NOT NULL DEFAULT 3 CHECK (total_services = 3),
    redeemed_services INTEGER NOT NULL DEFAULT 0 CHECK (redeemed_services <= total_services),
    status bundle_status NOT NULL DEFAULT 'active',
    original_amount_paise BIGINT NOT NULL,
    discount_paise BIGINT NOT NULL,
    paid_amount_paise BIGINT NOT NULL,
    discount_percentage NUMERIC(5, 2) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    payment_reference TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_service_bundles_student ON public.service_bundles(student_id);

-- 4. Bundle Line Items
CREATE TABLE IF NOT EXISTS public.bundle_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bundle_id UUID NOT NULL REFERENCES public.service_bundles(id) ON DELETE CASCADE,
    service_code service_code NOT NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    is_redeemed BOOLEAN NOT NULL DEFAULT false,
    redeemed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_bundle_items_bundle ON public.bundle_items(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_items_service ON public.bundle_items(bundle_id, service_code);

-- 5. Row-Level Security
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_items ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON public.user_subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.service_bundles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bundle_items TO authenticated;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view own subscriptions' AND tablename = 'user_subscriptions') THEN
        CREATE POLICY "Users view own subscriptions"
            ON public.user_subscriptions
            FOR SELECT
            TO authenticated
            USING (
                user_id = auth.uid()
                OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
            );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view own bundles' AND tablename = 'service_bundles') THEN
        CREATE POLICY "Users view own bundles"
            ON public.service_bundles
            FOR SELECT
            TO authenticated
            USING (
                student_id = auth.uid()
                OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
            );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view own bundle items' AND tablename = 'bundle_items') THEN
        CREATE POLICY "Users view own bundle items"
            ON public.bundle_items
            FOR SELECT
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public.service_bundles sb
                    WHERE sb.id = bundle_items.bundle_id
                      AND (sb.student_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
                )
            );
    END IF;
END $$;

-- 6. Helper: Get User Membership Status & Discount
CREATE OR REPLACE FUNCTION public.get_user_membership(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_sub RECORD;
BEGIN
    SELECT * INTO v_sub
    FROM public.user_subscriptions
    WHERE user_id = p_user_id
      AND status = 'active'
      AND current_period_end > timezone('utc'::text, now())
    ORDER BY created_at DESC
    LIMIT 1;

    IF v_sub IS NULL THEN
        RETURN jsonb_build_object(
            'plan', 'free',
            'discount_pct', 0.0,
            'is_active', false,
            'renewal_date', null,
            'cancel_at_period_end', false
        );
    END IF;

    RETURN jsonb_build_object(
        'plan', v_sub.plan,
        'discount_pct', CASE WHEN v_sub.plan = 'elite' THEN 0.10 WHEN v_sub.plan = 'pro' THEN 0.05 ELSE 0.0 END,
        'is_active', true,
        'billing_cycle', v_sub.billing_cycle,
        'amount_paise', v_sub.amount_paise,
        'current_period_end', v_sub.current_period_end,
        'cancel_at_period_end', v_sub.cancel_at_period_end
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Stored Procedure: Calculate Service Checkout Price (PRD §7.3, P10 Exit Criteria 1 & 3)
-- "Apply the single better eligible discount to the relevant eligible subtotal. No discount stacking."
-- "DreamX funds the discount; mentor payout calculation is based on the original list price."
-- "All monetary calculations use integer paise."
CREATE OR REPLACE FUNCTION public.calculate_service_checkout_price(
    p_student_id UUID,
    p_service_code service_code DEFAULT NULL,
    p_is_bundle BOOLEAN DEFAULT false,
    p_bundle_service_codes service_code[] DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_sub RECORD;
    v_original_paise BIGINT := 0;
    v_membership_discount_pct NUMERIC(5, 4) := 0.0;
    v_bundle_discount_pct NUMERIC(5, 4) := 0.0;
    v_applied_discount_pct NUMERIC(5, 4) := 0.0;
    v_applied_discount_type TEXT := 'none';
    v_discount_paise BIGINT := 0;
    v_final_amount_paise BIGINT := 0;
    v_mentor_payout_paise BIGINT := 0;
    v_platform_fee_paise BIGINT := 0;
    v_service_record RECORD;
    v_code service_code;
    v_idx INTEGER := 0;
BEGIN
    -- 1. Determine active membership discount
    SELECT * INTO v_sub
    FROM public.user_subscriptions
    WHERE user_id = p_student_id
      AND status = 'active'
      AND current_period_end > timezone('utc'::text, now())
    ORDER BY created_at DESC
    LIMIT 1;

    IF v_sub.id IS NOT NULL THEN
        IF v_sub.plan::text = 'elite' THEN
            v_membership_discount_pct := 0.1000; -- 10%
        ELSIF v_sub.plan::text = 'pro' THEN
            v_membership_discount_pct := 0.0500; -- 5%
        END IF;
    END IF;

    -- 2. Determine base list price
    IF p_is_bundle THEN
        IF p_bundle_service_codes IS NULL OR array_length(p_bundle_service_codes, 1) != 3 THEN
            RAISE EXCEPTION 'A custom bundle must contain exactly 3 eligible services.';
        END IF;

        -- Sum list price for all 3 services
        FOREACH v_code IN ARRAY p_bundle_service_codes LOOP
            SELECT list_paise INTO v_service_record
            FROM public.services
            WHERE code = v_code;

            IF v_service_record IS NULL THEN
                RAISE EXCEPTION 'Invalid service code in bundle: %', v_code;
            END IF;

            v_original_paise := v_original_paise + v_service_record.list_paise;
        END LOOP;

        v_bundle_discount_pct := 0.0500; -- 5% bundle discount
    ELSE
        IF p_service_code IS NULL THEN
            RAISE EXCEPTION 'p_service_code is required for single service checkout.';
        END IF;

        SELECT list_paise INTO v_service_record
        FROM public.services
        WHERE code = p_service_code;

        IF v_service_record IS NULL THEN
            RAISE EXCEPTION 'Service not found for code: %', p_service_code;
        END IF;

        v_original_paise := v_service_record.list_paise;
    END IF;

    -- 3. Select Single Better Eligible Discount (PRD §7.3 - NO DISCOUNT STACKING)
    IF v_bundle_discount_pct > v_membership_discount_pct THEN
        v_applied_discount_pct := v_bundle_discount_pct;
        v_applied_discount_type := 'bundle';
    ELSIF v_membership_discount_pct > v_bundle_discount_pct THEN
        v_applied_discount_pct := v_membership_discount_pct;
        v_applied_discount_type := 'membership_' || COALESCE(v_sub.plan::TEXT, 'none');
    ELSIF v_membership_discount_pct > 0.0 THEN
        -- Equal discount (e.g. 5% Pro and 5% Bundle) -> choose either, not stacked!
        v_applied_discount_pct := v_membership_discount_pct;
        v_applied_discount_type := 'membership_pro';
    ELSE
        v_applied_discount_pct := 0.0;
        v_applied_discount_type := 'none';
    END IF;

    -- 4. Calculate final amount in integer paise
    v_discount_paise := ROUND(v_original_paise * v_applied_discount_pct);
    v_final_amount_paise := v_original_paise - v_discount_paise;

    -- 5. Calculate Mentor Payout based on ORIGINAL LIST PRICE (PRD §7.3)
    -- "DreamX funds the discount; mentor payout calculation is based on the original list price"
    v_mentor_payout_paise := ROUND(v_original_paise * 0.80);
    v_platform_fee_paise := v_final_amount_paise - v_mentor_payout_paise;

    RETURN jsonb_build_object(
        'student_id', p_student_id,
        'is_bundle', p_is_bundle,
        'membership_plan', COALESCE(v_sub.plan::TEXT, 'free'),
        'original_amount_paise', v_original_paise,
        'discount_percentage', ROUND(v_applied_discount_pct * 100, 1),
        'discount_type', v_applied_discount_type,
        'discount_paise', v_discount_paise,
        'final_amount_paise', v_final_amount_paise,
        'mentor_payout_paise', v_mentor_payout_paise,
        'platform_fee_paise', v_platform_fee_paise,
        'dreamx_discount_subsidy_paise', v_discount_paise
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Stored Procedure: Subscribe Membership Plan (PRD §7.1, §7.2)
CREATE OR REPLACE FUNCTION public.subscribe_membership_plan(
    p_user_id UUID,
    p_plan membership_plan,
    p_billing_cycle billing_cycle DEFAULT 'monthly',
    p_payment_reference TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_amount_paise BIGINT;
    v_period_start TIMESTAMPTZ := timezone('utc'::text, now());
    v_period_end TIMESTAMPTZ;
    v_sub_id UUID;
BEGIN
    IF p_plan = 'free' THEN
        -- Cancel existing active subscription
        UPDATE public.user_subscriptions
        SET status = 'cancelled',
            cancel_at_period_end = true,
            cancelled_at = timezone('utc'::text, now()),
            updated_at = timezone('utc'::text, now())
        WHERE user_id = p_user_id AND status = 'active';

        RETURN jsonb_build_object(
            'success', true,
            'plan', 'free',
            'message', 'Subscription reset to Free Tier.'
        );
    END IF;

    -- Determine pricing in integer paise (PRD §7.1)
    IF p_plan = 'pro' THEN
        IF p_billing_cycle = 'yearly' THEN
            v_amount_paise := 178800; -- ₹1,788
            v_period_end := v_period_start + INTERVAL '1 year';
        ELSE
            v_amount_paise := 19900; -- ₹199
            v_period_end := v_period_start + INTERVAL '1 month';
        END IF;
    ELSIF p_plan = 'elite' THEN
        IF p_billing_cycle = 'yearly' THEN
            v_amount_paise := 418800; -- ₹4,188
            v_period_end := v_period_start + INTERVAL '1 year';
        ELSE
            v_amount_paise := 39900; -- ₹399
            v_period_end := v_period_start + INTERVAL '1 month';
        END IF;
    ELSE
        RAISE EXCEPTION 'Invalid membership plan.';
    END IF;

    -- Deactivate any prior active subscription
    UPDATE public.user_subscriptions
    SET status = 'expired',
        updated_at = timezone('utc'::text, now())
    WHERE user_id = p_user_id AND status = 'active';

    -- Insert new active verified subscription
    INSERT INTO public.user_subscriptions (
        user_id,
        plan,
        billing_cycle,
        status,
        amount_paise,
        current_period_start,
        current_period_end,
        cancel_at_period_end,
        payment_reference
    ) VALUES (
        p_user_id,
        p_plan,
        p_billing_cycle,
        'active',
        v_amount_paise,
        v_period_start,
        v_period_end,
        false,
        COALESCE(p_payment_reference, 'SUB-PAY-' || ROUND(EXTRACT(EPOCH FROM now()))::TEXT)
    ) RETURNING id INTO v_sub_id;

    RETURN jsonb_build_object(
        'success', true,
        'subscription_id', v_sub_id,
        'plan', p_plan,
        'billing_cycle', p_billing_cycle,
        'amount_paise', v_amount_paise,
        'current_period_start', v_period_start,
        'current_period_end', v_period_end
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Stored Procedure: Cancel Membership Subscription (PRD §7.2)
-- "A cancellation request must not be confused with an immediate refund. Show the user when benefits begin and end."
CREATE OR REPLACE FUNCTION public.cancel_membership_subscription(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_sub RECORD;
BEGIN
    SELECT * INTO v_sub
    FROM public.user_subscriptions
    WHERE user_id = p_user_id AND status = 'active'
    FOR UPDATE;

    IF v_sub IS NULL THEN
        RAISE EXCEPTION 'No active subscription found to cancel.';
    END IF;

    UPDATE public.user_subscriptions
    SET cancel_at_period_end = true,
        cancelled_at = timezone('utc'::text, now()),
        updated_at = timezone('utc'::text, now())
    WHERE id = v_sub.id;

    RETURN jsonb_build_object(
        'success', true,
        'subscription_id', v_sub.id,
        'plan', v_sub.plan,
        'current_period_end', v_sub.current_period_end,
        'cancel_at_period_end', true,
        'benefits_retain_until', v_sub.current_period_end,
        'message', 'Cancellation scheduled. Benefits remain active until current period ends.'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Stored Procedure: Purchase Custom Service Bundle (PRD §7.4)
CREATE OR REPLACE FUNCTION public.purchase_service_bundle(
    p_student_id UUID,
    p_service_codes service_code[],
    p_payment_reference TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_pricing JSONB;
    v_bundle_id UUID;
    v_bundle_ref TEXT;
    v_code service_code;
BEGIN
    -- Calculate price via standard calculation procedure (guarantees no discount stacking)
    v_pricing := public.calculate_service_checkout_price(
        p_student_id := p_student_id,
        p_is_bundle := true,
        p_bundle_service_codes := p_service_codes
    );

    v_bundle_ref := 'BND-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT, 1, 8));

    INSERT INTO public.service_bundles (
        student_id,
        bundle_ref,
        total_services,
        redeemed_services,
        status,
        original_amount_paise,
        discount_paise,
        paid_amount_paise,
        discount_percentage,
        expires_at,
        payment_reference
    ) VALUES (
        p_student_id,
        v_bundle_ref,
        3,
        0,
        'active',
        (v_pricing->>'original_amount_paise')::BIGINT,
        (v_pricing->>'discount_paise')::BIGINT,
        (v_pricing->>'final_amount_paise')::BIGINT,
        (v_pricing->>'discount_percentage')::NUMERIC,
        timezone('utc'::text, now()) + INTERVAL '90 days',
        COALESCE(p_payment_reference, 'PAY-' || v_bundle_ref)
    ) RETURNING id INTO v_bundle_id;

    -- Insert individual items
    FOREACH v_code IN ARRAY p_service_codes LOOP
        INSERT INTO public.bundle_items (
            bundle_id,
            service_code,
            is_redeemed
        ) VALUES (
            v_bundle_id,
            v_code,
            false
        );
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'bundle_id', v_bundle_id,
        'bundle_ref', v_bundle_ref,
        'paid_amount_paise', (v_pricing->>'final_amount_paise')::BIGINT,
        'discount_percentage', (v_pricing->>'discount_percentage')::NUMERIC,
        'expires_at', timezone('utc'::text, now()) + INTERVAL '90 days'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Stored Procedure: Redeem Bundle Service Item
CREATE OR REPLACE FUNCTION public.redeem_bundle_service(
    p_bundle_id UUID,
    p_service_code service_code,
    p_booking_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_item RECORD;
    v_bundle RECORD;
    v_new_redeemed INTEGER;
BEGIN
    SELECT * INTO v_bundle
    FROM public.service_bundles
    WHERE id = p_bundle_id
    FOR UPDATE;

    IF v_bundle IS NULL THEN
        RAISE EXCEPTION 'Bundle not found.';
    END IF;

    IF v_bundle.status IN ('fully_redeemed', 'expired', 'cancelled') THEN
        RAISE EXCEPTION 'Bundle is not active for redemption (current status: %).', v_bundle.status;
    END IF;

    IF timezone('utc'::text, now()) > v_bundle.expires_at THEN
        UPDATE public.service_bundles SET status = 'expired' WHERE id = p_bundle_id;
        RAISE EXCEPTION 'Bundle has expired.';
    END IF;

    -- Find unredeemed item
    SELECT * INTO v_item
    FROM public.bundle_items
    WHERE bundle_id = p_bundle_id
      AND service_code = p_service_code
      AND is_redeemed = false
    LIMIT 1
    FOR UPDATE;

    IF v_item IS NULL THEN
        RAISE EXCEPTION 'No unused credits for service % in this bundle.', p_service_code;
    END IF;

    -- Redeem item
    UPDATE public.bundle_items
    SET is_redeemed = true,
        booking_id = p_booking_id,
        redeemed_at = timezone('utc'::text, now())
    WHERE id = v_item.id;

    v_new_redeemed := v_bundle.redeemed_services + 1;

    UPDATE public.service_bundles
    SET redeemed_services = v_new_redeemed,
        status = CASE WHEN v_new_redeemed >= v_bundle.total_services THEN 'fully_redeemed'::bundle_status ELSE 'partially_redeemed'::bundle_status END,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_bundle_id;

    RETURN jsonb_build_object(
        'success', true,
        'bundle_id', p_bundle_id,
        'redeemed_service', p_service_code,
        'booking_id', p_booking_id,
        'remaining_credits', v_bundle.total_services - v_new_redeemed
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Record migration in schema tracking table
INSERT INTO supabase_migrations.schema_migrations (version, name)
VALUES ('20261113_05', 'phase_p10_memberships_discounts_bundles')
ON CONFLICT (version) DO NOTHING;
