/**
 * DreamX Phase P10 Verification Test Suite
 * Validates PRD §7, V-19, V-20 & Implementation Plan P10 Exit Criteria:
 * 
 * Exit Criteria 1: Tests cover discount selection with every combination, in integer paise.
 * - Free + single service (0% discount, ₹599 list)
 * - Pro + single service (5% discount, ₹569.05 -> 56905 paise)
 * - Elite + single service (10% discount, ₹539.10 -> 53910 paise)
 * - Free + 3-service bundle (5% bundle discount)
 * - Pro + 3-service bundle (GREATEST(5%, 5%) = 5% discount, NO stacking)
 * - Elite + 3-service bundle (GREATEST(10%, 5%) = 10% discount, NO stacking)
 * 
 * Exit Criteria 2: Entitlements follow verified subscription state.
 * - Active subscriptions yield verified tier discount.
 * - Cancel-at-period-end retains benefits until period_end.
 * - State derives from verified database events, never client/browser state.
 * 
 * Exit Criteria 3: Mentor payout uses the original list price as approved.
 * - Mentor payout is ALWAYS 80% of original list price in integer paise.
 * - Platform margins absorb candidate discount.
 * 
 * Integer Paise Precision:
 * - All monetary values are integer paise (BIGINT / Math.round).
 */

import fs from 'fs';
import path from 'path';

// Load .env.local for standalone test execution
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...v] = trimmed.split('=');
      process.env[k.trim()] = v.join('=').trim();
    }
  }
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail = '') {
  if (condition) {
    console.log(`  ✓ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${testName} - ${detail}`);
    failed++;
  }
}

async function runPhase10Tests() {
  console.log('================================================================');
  console.log('⚡ DREAMX PHASE P10: MEMBERSHIPS, DISCOUNTS & BUNDLES TEST SUITE');
  console.log('================================================================\n');

  // Dedicated test user IDs (already linked to auth.users and public.profiles)
  const testStudentId = 'a1111111-b222-c333-d444-e55555555501';
  const testProStudentId = 'a1111111-b222-c333-d444-e55555555502';
  const testEliteStudentId = 'a1111111-b222-c333-d444-e55555555503';
  const testMentorId = 'c1111111-2222-3333-4444-555555555501';

  try {
    // -------------------------------------------------------------------------
    // TEST SUITE 1: Exit Criteria 1 - Discount Selection with Every Combination
    // -------------------------------------------------------------------------
    console.log('--- Test Suite 1: Discount Selection Combinations (Integer Paise) ---');

    // 1.1 Free User + Single Service (S01: List 59900 paise = ₹599)
    const { data: p1, error: e1 } = await supabase.rpc('calculate_service_checkout_price', {
      p_student_id: testStudentId,
      p_service_code: 'S01',
      p_is_bundle: false,
    });
    assert(!e1 && p1, '1.1 Free user + single service S01 calculates successfully', e1?.message);
    assert(p1?.original_amount_paise === 59900, '1.1 Original list price is 59900 paise (₹599)');
    assert(p1?.discount_percentage === 0, '1.1 Free user discount percentage is 0%');
    assert(p1?.discount_paise === 0, '1.1 Free user discount paise is 0');
    assert(p1?.final_amount_paise === 59900, '1.1 Final amount payable is 59900 paise');
    assert(p1?.mentor_payout_paise === 47920, '1.1 Mentor payout is 47920 paise (80% of ₹599)');
    assert(p1?.platform_fee_paise === 11980, '1.1 Platform fee is 11980 paise (20% of ₹599)');

    // Subscribe Pro user using canonical stored procedure
    const { error: subProErr } = await supabase.rpc('subscribe_membership_plan', {
      p_user_id: testProStudentId,
      p_plan: 'pro',
      p_billing_cycle: 'monthly',
      p_payment_reference: 'TEST_PRO_SUB_' + Date.now(),
    });
    assert(!subProErr, '1.2 Subscribed testProStudentId to Pro plan', subProErr?.message);

    // 1.2 Pro User + Single Service (S01: 5% discount)
    const { data: p2, error: e2 } = await supabase.rpc('calculate_service_checkout_price', {
      p_student_id: testProStudentId,
      p_service_code: 'S01',
      p_is_bundle: false,
    });
    assert(!e2 && p2, '1.2 Pro user + single service S01 calculates successfully', e2?.message);
    assert(p2?.original_amount_paise === 59900, '1.2 Original list price is 59900 paise');
    assert(p2?.discount_percentage === 5, '1.2 Pro user receives 5.0% discount');
    assert(p2?.discount_paise === 2995, '1.2 5% discount on 59900 is exactly 2995 paise (₹29.95)');
    assert(p2?.final_amount_paise === 56905, '1.2 Final amount payable is exactly 56905 paise (₹569.05)');
    assert(p2?.mentor_payout_paise === 47920, '1.2 Mentor payout remains 47920 paise (80% of original list price)');
    assert(p2?.dreamx_discount_subsidy_paise === 2995, '1.2 Platform absorbs 2995 paise discount');

    // Subscribe Elite user using canonical stored procedure
    const { error: subEliteErr } = await supabase.rpc('subscribe_membership_plan', {
      p_user_id: testEliteStudentId,
      p_plan: 'elite',
      p_billing_cycle: 'yearly',
      p_payment_reference: 'TEST_ELITE_SUB_' + Date.now(),
    });
    assert(!subEliteErr, '1.3 Subscribed testEliteStudentId to Elite plan', subEliteErr?.message);

    // 1.3 Elite User + Single Service (S01: 10% discount)
    const { data: p3, error: e3 } = await supabase.rpc('calculate_service_checkout_price', {
      p_student_id: testEliteStudentId,
      p_service_code: 'S01',
      p_is_bundle: false,
    });
    assert(!e3 && p3, '1.3 Elite user + single service S01 calculates successfully', e3?.message);
    assert(p3?.original_amount_paise === 59900, '1.3 Original list price is 59900 paise');
    assert(p3?.discount_percentage === 10, '1.3 Elite user receives 10.0% discount');
    assert(p3?.discount_paise === 5990, '1.3 10% discount on 59900 is exactly 5990 paise (₹59.90)');
    assert(p3?.final_amount_paise === 53910, '1.3 Final amount payable is exactly 53910 paise (₹539.10)');
    assert(p3?.mentor_payout_paise === 47920, '1.3 Mentor payout remains 47920 paise (80% of original list price)');

    // 1.4 Free User + 3-Service Bundle (S01 59900 + S02 79900 + S03 49900 = 189700 paise)
    const { data: p4, error: e4 } = await supabase.rpc('calculate_service_checkout_price', {
      p_student_id: testStudentId,
      p_is_bundle: true,
      p_bundle_service_codes: ['S01', 'S02', 'S03'],
    });
    assert(!e4 && p4, '1.4 Free user + 3-service bundle calculates successfully', e4?.message);
    assert(p4?.original_amount_paise === 189700, '1.4 Gross bundle sum is 189700 paise (₹1,897)');
    assert(p4?.discount_percentage === 5, '1.4 3-service bundle grants 5.0% discount');
    assert(p4?.discount_paise === 9485, '1.4 5% discount on 189700 is exactly 9485 paise (₹94.85)');
    assert(p4?.final_amount_paise === 180215, '1.4 Final amount is exactly 180215 paise (₹1,802.15)');
    assert(p4?.discount_type === 'bundle', '1.4 Applied discount type is bundle');

    // 1.5 Pro User + 3-Service Bundle (NO DISCOUNT STACKING: GREATEST(5%, 5%) = 5%)
    const { data: p5, error: e5 } = await supabase.rpc('calculate_service_checkout_price', {
      p_student_id: testProStudentId,
      p_is_bundle: true,
      p_bundle_service_codes: ['S01', 'S02', 'S03'],
    });
    assert(!e5 && p5, '1.5 Pro user + 3-service bundle calculates successfully', e5?.message);
    assert(p5?.original_amount_paise === 189700, '1.5 Gross sum is 189700 paise');
    assert(p5?.discount_percentage === 5, '1.5 Pro + Bundle applies single better discount of 5% (NO stacking)');
    assert(p5?.discount_paise === 9485, '1.5 Discount is 9485 paise, not 10% (18970 paise)');
    assert(p5?.final_amount_paise === 180215, '1.5 Final amount payable is 180215 paise');

    // 1.6 Elite User + 3-Service Bundle (NO STACKING: GREATEST(10%, 5%) = 10%)
    const { data: p6, error: e6 } = await supabase.rpc('calculate_service_checkout_price', {
      p_student_id: testEliteStudentId,
      p_is_bundle: true,
      p_bundle_service_codes: ['S01', 'S02', 'S03'],
    });
    assert(!e6 && p6, '1.6 Elite user + 3-service bundle calculates successfully', e6?.message);
    assert(p6?.original_amount_paise === 189700, '1.6 Gross sum is 189700 paise');
    assert(p6?.discount_percentage === 10, '1.6 Elite + Bundle applies superior 10% Elite discount');
    assert(p6?.discount_paise === 18970, '1.6 10% discount on 189700 is exactly 18970 paise');
    assert(p6?.final_amount_paise === 170730, '1.6 Final amount payable is 170730 paise (₹1,707.30)');
    assert(p6?.discount_type === 'membership_elite', '1.6 Applied discount type is membership_elite');

    // 1.7 Integer Paise Validation
    const allPaiseNumbers = [
      p1.original_amount_paise, p1.discount_paise, p1.final_amount_paise, p1.mentor_payout_paise,
      p2.original_amount_paise, p2.discount_paise, p2.final_amount_paise, p2.mentor_payout_paise,
      p3.original_amount_paise, p3.discount_paise, p3.final_amount_paise, p3.mentor_payout_paise,
      p4.original_amount_paise, p4.discount_paise, p4.final_amount_paise, p4.mentor_payout_paise,
      p5.original_amount_paise, p5.discount_paise, p5.final_amount_paise, p5.mentor_payout_paise,
      p6.original_amount_paise, p6.discount_paise, p6.final_amount_paise, p6.mentor_payout_paise,
    ];
    const allIntegers = allPaiseNumbers.every(n => Number.isInteger(n) && n >= 0);
    assert(allIntegers, '1.7 All calculated monetary amounts are strict non-negative integer paise');

    // -------------------------------------------------------------------------
    // TEST SUITE 2: Exit Criteria 2 - Entitlements Follow Verified DB State
    // -------------------------------------------------------------------------
    console.log('\n--- Test Suite 2: Entitlements Follow Verified Subscription State ---');

    // 2.1 Verified state for Free User
    const { data: memFree, error: errMemFree } = await supabase.rpc('get_user_membership', {
      p_user_id: testStudentId,
    });
    assert(!errMemFree && memFree, '2.1 get_user_membership returns verified state for free user', errMemFree?.message);
    assert(memFree?.plan === 'free', '2.1 Free user plan is "free"');
    assert(memFree?.discount_percentage === 0, '2.1 Free user discount percentage is 0');
    assert(memFree?.is_active === false, '2.1 Free tier has is_active = false');

    // 2.2 Verified state for Pro User
    const { data: memPro, error: errMemPro } = await supabase.rpc('get_user_membership', {
      p_user_id: testProStudentId,
    });
    assert(!errMemPro && memPro, '2.2 get_user_membership returns verified state for pro user', errMemPro?.message);
    assert(memPro?.plan === 'pro', '2.2 Pro user plan is "pro"');
    assert(memPro?.discount_percentage === 5, '2.2 Pro user discount percentage is 5%');
    assert(memPro?.is_active === true, '2.2 Pro subscription is active');

    // 2.3 Verified state for Elite User
    const { data: memElite, error: errMemElite } = await supabase.rpc('get_user_membership', {
      p_user_id: testEliteStudentId,
    });
    assert(!errMemElite && memElite, '2.3 get_user_membership returns verified state for elite user', errMemElite?.message);
    assert(memElite?.plan === 'elite', '2.3 Elite user plan is "elite"');
    assert(memElite?.discount_percentage === 10, '2.3 Elite user discount percentage is 10%');
    assert(memElite?.is_active === true, '2.3 Elite subscription is active');

    // 2.4 Cancellation Schedules At Period End (Retains Benefits)
    const { data: cancelResult, error: cancelError } = await supabase.rpc('cancel_membership_subscription', {
      p_user_id: testProStudentId,
    });
    assert(!cancelError && cancelResult, '2.4 cancel_membership_subscription executes cleanly', cancelError?.message);
    assert(cancelResult?.cancel_at_period_end === true, '2.4 cancel_at_period_end is set to true');

    const { data: memProAfterCancel } = await supabase.rpc('get_user_membership', {
      p_user_id: testProStudentId,
    });
    assert(memProAfterCancel?.plan === 'pro', '2.4 Benefits retained: Plan is still pro until period end');
    assert(memProAfterCancel?.discount_percentage === 5, '2.4 Benefits retained: 5% discount remains active');
    assert(memProAfterCancel?.cancel_at_period_end === true, '2.4 cancel_at_period_end is confirmed');

    // -------------------------------------------------------------------------
    // TEST SUITE 3: Exit Criteria 3 - Mentor Payout Uses Original List Price
    // -------------------------------------------------------------------------
    console.log('\n--- Test Suite 3: Mentor Payout Uses Original List Price as Approved ---');

    // 3.1 Verify with Stored Procedure calculation
    // S06 System Design: List 149900 paise (₹1,499)
    // Elite User books S06: 10% discount -> pays 134910 paise (₹1,349.10)
    const { data: s06Pricing, error: s06Error } = await supabase.rpc('calculate_service_checkout_price', {
      p_student_id: testEliteStudentId,
      p_service_code: 'S06',
      p_is_bundle: false,
    });
    assert(!s06Error && s06Pricing, '3.1 S06 System Design pricing calculated', s06Error?.message);
    assert(s06Pricing?.original_amount_paise === 149900, '3.1 S06 Original list price is 149900 paise');
    assert(s06Pricing?.final_amount_paise === 134910, '3.1 Candidate pays discounted 134910 paise');
    assert(s06Pricing?.mentor_payout_paise === 119920, '3.1 Mentor payout is exactly 119920 paise (80% of original ₹1,499)');
    assert(s06Pricing?.mentor_payout_paise === Math.round(149900 * 0.80), '3.1 Mentor payout equals 80% of approved list price, NOT discounted price');

    // 3.2 End-to-End Escrow Accrual via Payment Webhook
    const testBookingId = 'b1111111-2222-3333-4444-555555555501';

    // Insert booking for S06 with Elite discounted payment of 134910 paise using test helper RPC
    const { data: bookCreateRes, error: bookingErr } = await supabase.rpc('create_test_booking_p10', {
      p_booking_id: testBookingId,
      p_student_id: testEliteStudentId,
      p_mentor_id: testMentorId,
      p_service_code: 'S06',
      p_amount_paise: 134910,
    });
    assert(!bookingErr && bookCreateRes?.success, '3.2 Test booking inserted cleanly', bookingErr?.message);

    // Execute payment webhook for captured payment
    const webhookRes = await supabase.rpc('process_payment_webhook', {
      p_booking_id: testBookingId,
      p_provider: 'razorpay',
      p_provider_order_id: 'order_test_p10_webhook',
      p_provider_payment_id: 'pay_test_p10_webhook',
      p_idempotency_key: 'idemp_test_p10_' + Date.now(),
      p_amount_paise: 134910,
      p_status: 'captured',
      p_signature: 'sig_test_p10',
    });
    assert(webhookRes.data?.status === 'success', '3.2 Payment webhook processed successfully', webhookRes.error?.message);

    // Verify mentor_settlements record via get_test_settlement_p10 RPC
    const { data: settlement, error: errSettlement } = await supabase.rpc('get_test_settlement_p10', {
      p_booking_id: testBookingId,
    });

    assert(!errSettlement && settlement, '3.2 Mentor settlement row found in escrow', errSettlement?.message);
    assert(settlement?.gross_amount_paise === 149900, `3.2 Gross amount is original list price 149900 paise (got ${settlement?.gross_amount_paise})`);
    assert(settlement?.net_payout_paise === 119920, `3.2 Net payout is exactly 80% of list price = 119920 paise (got ${settlement?.net_payout_paise})`);
    assert(settlement?.payout_status === 'in_escrow', '3.2 Payout status is in_escrow');

    // -------------------------------------------------------------------------
    // TEST SUITE 4: Custom 3-Service Bundle Purchase & Redemption Lifecycle
    // -------------------------------------------------------------------------
    console.log('\n--- Test Suite 4: Custom 3-Service Bundle Purchase & Redemption ---');

    // 4.1 Purchase 3-service bundle for Pro user (S01, S05, S08)
    const { data: bundleRes, error: errBundle } = await supabase.rpc('purchase_service_bundle', {
      p_student_id: testProStudentId,
      p_service_codes: ['S01', 'S05', 'S08'],
      p_payment_reference: 'TEST_BUNDLE_REF_' + Date.now(),
    });
    assert(!errBundle && bundleRes?.success, '4.1 3-Service bundle purchased successfully', errBundle?.message);
    assert(bundleRes?.bundle_id, '4.1 Bundle ID returned');
    assert(bundleRes?.discount_percentage === 5, '4.1 Bundle applied 5% discount');

    // Verify 3 items exist via get_user_bundles RPC
    const { data: userBundles, error: errBundles } = await supabase.rpc('get_user_bundles', {
      p_student_id: testProStudentId,
    });
    assert(!errBundles && userBundles?.length > 0, '4.1 get_user_bundles returned bundle records');
    const activeBundle = userBundles?.find((b: { id: string }) => b.id === bundleRes.bundle_id);
    assert(activeBundle?.items?.length === 3, '4.1 Exactly 3 distinct bundle item records created');
    const allUnredeemed = activeBundle?.items?.every((item: { is_redeemed: boolean }) => item.is_redeemed === false);
    assert(allUnredeemed, '4.1 All bundle items initially marked unredeemed');

    // 4.2 Redeem 1 item from bundle
    const { data: redeemRes, error: errRedeem } = await supabase.rpc('redeem_bundle_service', {
      p_bundle_id: bundleRes.bundle_id,
      p_service_code: 'S01',
      p_booking_id: testBookingId,
    });
    assert(!errRedeem && redeemRes?.success, '4.2 Bundle item S01 redeemed successfully', errRedeem?.message);
    assert(redeemRes?.remaining_credits === 2, '4.2 Remaining credits count updated to 2');

    // Check bundle status updated to partially_redeemed
    const { data: updatedUserBundles } = await supabase.rpc('get_user_bundles', {
      p_student_id: testProStudentId,
    });
    const updatedBundle = updatedUserBundles?.find((b: { id: string }) => b.id === bundleRes.bundle_id);
    assert(updatedBundle?.status === 'partially_redeemed', '4.2 Bundle status updated to partially_redeemed');
    assert(updatedBundle?.redeemed_services === 1, '4.2 Redeemed count is 1');

  } catch (err: unknown) {
    console.error('Unexpected test execution failure:', err);
    failed++;
  }

  console.log('\n================================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase10Tests();
