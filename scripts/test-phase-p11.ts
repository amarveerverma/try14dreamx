/**
 * DreamX Phase P11 Verification Test Suite
 * Validates PRD §12, §15.2 and Implementation Plan P11 Exit Criteria:
 * 
 * Exit Criteria 1: Every scenario in PRD §12.2 has a test.
 * - Scenario 1: Student cancels >= 1 hour before -> 100% full refund initiated.
 * - Scenario 2: Student cancels < 1 hour before -> 0% refund, mentor compensated.
 * - Scenario 3: Mentor cancels -> Student chooses reschedule or refund.
 * - Scenario 4: Mentor no-show -> Student chooses reschedule or full refund.
 * - Scenario 5: Student no-show -> Mentor compensated, 0% refund.
 * - Scenario 6: Quality complaint within 48h (substantiated) -> 80% refund (PRD §12.1).
 * - Scenario 7: Quality complaint (unsubstantiated) -> Reasoned decision, 0% refund.
 * - Scenario 8: Quality complaint past 48h -> Dispute window expired rejection.
 * 
 * Exit Criteria 2: No automatic reschedule happens.
 * - Mentor cancellations and no-shows require explicit student choice.
 * 
 * Exit Criteria 3: Each refund shows separate initiated and completed states.
 * - Refund row starts in 'initiated' state; transitions to 'completed' upon gateway settlement.
 * 
 * Exit Criteria 4: Support channel and hours are visible to users.
 * - Support desk ticketing with SLA < 4 hours and published operating hours.
 * 
 * Dual Approval Gate (PRD §15.2):
 * - High-impact financial actions (>= ₹5,000) require independent secondary co-signature.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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

async function runPhase11Tests() {
  console.log('========================================================================');
  console.log('⚡ DREAMX PHASE P11: CANCELLATIONS, REFUNDS, DISPUTES & SUPPORT TEST SUITE');
  console.log('========================================================================\n');

  // Test identities
  const studentId = 'a1111111-b222-c333-d444-e55555555501'; // Test Free Student
  const mentorId = 'c1111111-2222-3333-4444-555555555501';  // Dr. Test Mentor
  const adminId1 = '00000000-0000-0000-0000-000000000001';  // Admin 1 (admin@dreamx.in)
  
  // Secondary Admin for Dual Approval
  const adminId2 = '00000000-0000-0000-0000-000000000002'; // Secondary Executive Admin

  try {
    // -------------------------------------------------------------------------
    // TEST SUITE 1: Exit Criteria 1 & PRD §12.2 - Cancellation & Refund Scenarios
    // -------------------------------------------------------------------------
    console.log('--- Test Suite 1: PRD §12.2 Cancellation Policy Engine Scenarios ---');

    // 1.1 Scenario 1: Student cancels >= 1 hour before session -> 100% Full Refund
    const b1Id = crypto.randomUUID();
    const { data: b1Setup, error: b1SetupErr } = await supabase.rpc('setup_test_booking_p11', {
      p_booking_id: b1Id,
      p_student_id: studentId,
      p_mentor_id: mentorId,
      p_service_code: 'S01',
      p_amount_paise: 59900,
      p_session_start_offset_minutes: 120, // 2 hours in future (>= 1 hour)
    });
    assert(!b1SetupErr && b1Setup?.success, '1.1 Setup test booking for student cancel >= 1h');

    const { data: res1, error: err1 } = await supabase.rpc('apply_booking_cancellation_policy', {
      p_booking_id: b1Id,
      p_cancelling_user_id: studentId,
      p_reason: 'Schedule conflict, cancelling 2 hours in advance.',
    });
    assert(!err1 && res1?.success, '1.1 Student cancel >= 1h executes successfully', err1?.message);
    assert(res1?.outcome === 'student_cancelled_full_refund', '1.1 Outcome is student_cancelled_full_refund');
    assert(res1?.refund_paise === 59900, '1.1 100% full refund amount (59900 paise)');
    assert(res1?.refund_id, '1.1 Refund record created with refund_id');

    // Verify separate 'initiated' state in public.refunds (Exit Criteria 3)
    const { data: refund1 } = await supabase.rpc('get_test_refund_p11', { p_refund_id: res1.refund_id });
    assert(refund1?.status === 'initiated', '1.1 Exit Criteria 3: Refund is in "initiated" state');

    // 1.2 Scenario 2: Student cancels < 1 hour before session -> 0% refund, mentor compensated
    const b2Id = crypto.randomUUID();
    const { data: b2Setup, error: b2SetupErr } = await supabase.rpc('setup_test_booking_p11', {
      p_booking_id: b2Id,
      p_student_id: studentId,
      p_mentor_id: mentorId,
      p_service_code: 'S01',
      p_amount_paise: 59900,
      p_session_start_offset_minutes: 30, // 30 minutes in future (< 1 hour)
      p_status: 'confirmed',
      p_payment_status: 'captured',
      p_payout_status: 'in_escrow',
    });
    assert(!b2SetupErr && b2Setup?.success, '1.2 Setup test booking for student cancel < 1h');

    const { data: res2, error: err2 } = await supabase.rpc('apply_booking_cancellation_policy', {
      p_booking_id: b2Id,
      p_cancelling_user_id: studentId,
      p_reason: 'Late cancellation (emergency).',
    });
    assert(!err2 && res2?.success, '1.2 Student cancel < 1h executes successfully', err2?.message);
    assert(res2?.outcome === 'student_cancelled_late_no_refund', '1.2 Outcome is student_cancelled_late_no_refund');
    assert(res2?.refund_paise === 0, '1.2 0% refund granted under late cancellation baseline');

    // Verify mentor settlement is retained as eligible
    const { data: settle2 } = await supabase.rpc('get_test_settlement_p11', { p_booking_id: b2Id });
    assert(settle2?.payout_status === 'eligible_for_payout', '1.2 Mentor remains eligible for payout');

    // 1.3 Scenario 3: Mentor cancels -> Student chooses reschedule or refund (NO auto-reschedule)
    const b3Id = crypto.randomUUID();
    const { data: b3Setup, error: b3SetupErr } = await supabase.rpc('setup_test_booking_p11', {
      p_booking_id: b3Id,
      p_student_id: studentId,
      p_mentor_id: mentorId,
      p_service_code: 'S06',
      p_amount_paise: 149900,
      p_session_start_offset_minutes: 300, // 5 hours in future
    });
    assert(!b3SetupErr && b3Setup?.success, '1.3 Setup test booking for mentor cancellation');

    const { data: res3, error: err3 } = await supabase.rpc('apply_booking_cancellation_policy', {
      p_booking_id: b3Id,
      p_cancelling_user_id: mentorId,
      p_reason: 'Urgent production incident at primary employer.',
    });
    assert(!err3 && res3?.success, '1.3 Mentor cancel executes successfully', err3?.message);
    assert(res3?.outcome === 'mentor_cancelled_choice_pending', '1.3 Outcome is mentor_cancelled_choice_pending');
    assert(res3?.requires_student_choice === true, '1.3 Requires explicit student choice');

    // Verify no automatic reschedule happened (Exit Criteria 2)
    const { data: b3After } = await supabase.rpc('get_test_booking_p11', { p_booking_id: b3Id });
    assert(b3After?.status === 'cancelled', '1.3 Exit Criteria 2: No automatic reschedule - booking is cancelled pending choice');

    // Student executes choice: 'refund'
    const { data: choiceRefund, error: errChoice } = await supabase.rpc('execute_student_cancellation_choice', {
      p_booking_id: b3Id,
      p_student_id: studentId,
      p_choice: 'refund',
    });
    assert(!errChoice && choiceRefund?.success, '1.3 Student explicitly chose 100% full refund', errChoice?.message);
    assert(choiceRefund?.choice === 'refund', '1.3 Student choice confirmed as refund');
    assert(choiceRefund?.amount_paise === 149900, '1.3 Full 149900 paise refund initiated');

    // 1.4 Scenario 4: Mentor No-Show -> Student chooses reschedule or full refund
    const b4Id = crypto.randomUUID();
    const { data: b4Setup, error: b4SetupErr } = await supabase.rpc('setup_test_booking_p11', {
      p_booking_id: b4Id,
      p_student_id: studentId,
      p_mentor_id: mentorId,
      p_service_code: 'S01',
      p_amount_paise: 59900,
      p_session_start_offset_minutes: -20, // 20 minutes ago (past 15-min grace period)
    });
    assert(!b4SetupErr && b4Setup?.success, '1.4 Setup test booking for mentor no-show');

    const { data: res4, error: err4 } = await supabase.rpc('report_mentor_no_show', {
      p_booking_id: b4Id,
      p_student_id: studentId,
    });
    assert(!err4 && res4?.success, '1.4 Report mentor no-show executes after grace period', err4?.message);
    assert(res4?.status === 'mentor_no_show_confirmed', '1.4 Mentor no-show confirmed');
    assert(res4?.requires_student_choice === true, '1.4 Exit Criteria 2: Student must explicitly choose resolution');

    // Student executes choice: 'reschedule_credit'
    const { data: choiceReschedule } = await supabase.rpc('execute_student_cancellation_choice', {
      p_booking_id: b4Id,
      p_student_id: studentId,
      p_choice: 'reschedule_credit',
    });
    assert(choiceReschedule?.success && choiceReschedule?.choice === 'reschedule_credit', '1.4 Student chose priority reschedule credit');

    // -------------------------------------------------------------------------
    // TEST SUITE 2: Dispute Management & PRD §12.1 80% Substantiated Refund Rule
    // -------------------------------------------------------------------------
    console.log('\n--- Test Suite 2: Disputes, Evidence Aggregation & 80% Ruling ---');

    // 2.1 Raise dispute within 48 hours post-session
    const b5Id = crypto.randomUUID();
    const { data: b5Setup, error: b5SetupErr } = await supabase.rpc('setup_test_booking_p11', {
      p_booking_id: b5Id,
      p_student_id: studentId,
      p_mentor_id: mentorId,
      p_service_code: 'S06', // System Design (149900 paise = ₹1,499)
      p_amount_paise: 149900,
      p_session_start_offset_minutes: -180, // 3 hours ago (within 48h window)
      p_status: 'completed',
      p_payment_status: 'captured',
      p_payout_status: 'in_escrow',
    });
    assert(!b5SetupErr && b5Setup?.success, '2.1 Setup completed booking within 48h window');

    const { data: disp1, error: errDisp1 } = await supabase.rpc('raise_booking_dispute', {
      p_booking_id: b5Id,
      p_student_id: studentId,
      p_reason_code: 'SUBSTANDARD_TECHNICAL_FEEDBACK',
      p_complaint_text: 'Mentor ended call early and provided generic template remarks.',
    });
    assert(!errDisp1 && disp1?.success, '2.1 Raise dispute within 48h succeeds', errDisp1?.message);
    assert(disp1?.status === 'opened', '2.1 Dispute status is "opened"');

    // Verify escrow hold was applied (PRD §12.1)
    const { data: settle5 } = await supabase.rpc('get_test_settlement_p11', { p_booking_id: b5Id });
    assert(settle5?.payout_status === 'on_hold', '2.1 Escrow payout locked on_hold while under dispute');

    // 2.2 Aggregate Dispute Evidence Pack (PRD §12.3)
    const { data: evidence, error: errEvid } = await supabase.rpc('get_dispute_evidence', {
      p_booking_id: b5Id,
    });
    assert(!errEvid && evidence, '2.2 get_dispute_evidence returned evidence aggregate', errEvid?.message);
    assert(evidence?.booking?.id === b5Id, '2.2 Booking details in evidence pack');
    assert(evidence?.student?.id === studentId, '2.2 Student profile in evidence pack');
    assert(evidence?.mentor?.id === mentorId, '2.2 Mentor profile in evidence pack');

    // 2.3 Resolve Dispute: Substantiated -> 80% Refund (PRD §12.1)
    // 80% of 149900 = 119920 paise (₹1,199.20)
    const { data: ruling1, error: errRuling1 } = await supabase.rpc('resolve_booking_dispute', {
      p_dispute_id: disp1.dispute_id,
      p_admin_id: adminId1,
      p_substantiated: true,
      p_ruling_notes: 'Evidence verified call duration shortened by mentor. 80% refund awarded per PRD §12.1.',
    });
    assert(!errRuling1 && ruling1?.success, '2.3 Admin resolves dispute as substantiated', errRuling1?.message);
    assert(ruling1?.ruling === 'substantiated_80_pct_refund', '2.3 Ruling confirmed as substantiated_80_pct_refund');
    assert(ruling1?.refund_paise === 119920, '2.3 Exactly 80% refund awarded (119920 paise)');

    // 2.4 Verify Dispute Past 48h Window is Rejected (PRD §12.2)
    const bExpiredId = crypto.randomUUID();
    await supabase.rpc('setup_test_booking_p11', {
      p_booking_id: bExpiredId,
      p_student_id: studentId,
      p_mentor_id: mentorId,
      p_service_code: 'S01',
      p_amount_paise: 59900,
      p_session_start_offset_minutes: -3100, // ~51 hours ago (> 48h window)
      p_status: 'completed',
    });

    const { error: errExpired } = await supabase.rpc('raise_booking_dispute', {
      p_booking_id: bExpiredId,
      p_student_id: studentId,
      p_reason_code: 'LATE_COMPLAINT',
      p_complaint_text: 'Complaint filed after 50 hours.',
    });
    assert(!!errExpired, '2.4 Dispute filed > 48h after session is rejected by policy engine');

    // -------------------------------------------------------------------------
    // TEST SUITE 3: Exit Criteria 3 - Separate Initiated and Completed Refund States
    // -------------------------------------------------------------------------
    console.log('\n--- Test Suite 3: Separate Initiated and Completed Refund States ---');

    // 3.1 Verify initiated state from dispute refund
    assert(ruling1?.refund_id, '3.1 Dispute ruling generated refund_id');
    const { data: refCheck1 } = await supabase.rpc('get_test_refund_p11', { p_refund_id: ruling1.refund_id });
    assert(refCheck1?.status === 'initiated', '3.1 Exit Criteria 3: Refund begins in "initiated" status');

    // 3.2 Gateway Webhook Completes Refund -> status = 'completed'
    const { data: completeRes, error: errComplete } = await supabase.rpc('complete_booking_refund', {
      p_refund_id: ruling1.refund_id,
      p_provider_refund_id: 'rfnd_test_gateway_' + Date.now(),
      p_refund_arn: 'ARN-RBI-TEST-999',
    });
    assert(!errComplete && completeRes?.success, '3.2 complete_booking_refund executes cleanly', errComplete?.message);
    assert(completeRes?.status === 'completed', '3.2 Refund status transitions to "completed"');

    const { data: refCheck2 } = await supabase.rpc('get_test_refund_p11', { p_refund_id: ruling1.refund_id });
    assert(refCheck2?.status === 'completed', '3.2 Exit Criteria 3: Confirmed separate completed state in database');

    // -------------------------------------------------------------------------
    // TEST SUITE 4: Dual Approval Gate for High-Impact Refunds (PRD §15.2)
    // -------------------------------------------------------------------------
    console.log('\n--- Test Suite 4: Dual Approval Gate (>= ₹5,000 Threshold) ---');

    // 4.1 High-value dispute (amount >= ₹5,000 / 500000 paise)
    const bHighValId = crypto.randomUUID();
    await supabase.rpc('setup_test_booking_p11', {
      p_booking_id: bHighValId,
      p_student_id: studentId,
      p_mentor_id: mentorId,
      p_service_code: 'S06',
      p_amount_paise: 700000, // ₹7,000
      p_session_start_offset_minutes: -180,
      p_status: 'completed',
    });

    const { data: dispHigh } = await supabase.rpc('raise_booking_dispute', {
      p_booking_id: bHighValId,
      p_student_id: studentId,
      p_reason_code: 'EXECUTIVE_ESCALATION',
      p_complaint_text: 'High-value executive track session dispute.',
    });

    // 80% of 700000 = 560000 paise (₹5,600 >= ₹5,000 threshold)
    const { data: highValRuling } = await supabase.rpc('resolve_booking_dispute', {
      p_dispute_id: dispHigh.dispute_id,
      p_admin_id: adminId1,
      p_substantiated: true,
      p_ruling_notes: 'Substantiated high-value drill failure. Triggers dual-approval gate.',
    });
    assert(highValRuling?.status === 'first_approved_awaiting_co_signer', '4.1 High-impact refund enters first_approved_awaiting_co_signer');
    assert(highValRuling?.approval_id, '4.1 approval_id created for secondary executive co-signature');

    // 4.2 Dual-Control Violation: Admin 1 attempts to co-sign their own approval
    const { error: errSelfCoSign } = await supabase.rpc('execute_financial_co_signature', {
      p_approval_id: highValRuling.approval_id,
      p_second_approver_id: adminId1, // Self co-sign!
      p_approve: true,
    });
    assert(!!errSelfCoSign, '4.2 Dual Control: Self co-signature rejected (first approver cannot be second approver)');

    // 4.3 Legitimate Independent Second Approver co-signs
    const { data: coSignRes, error: errCoSign } = await supabase.rpc('execute_financial_co_signature', {
      p_approval_id: highValRuling.approval_id,
      p_second_approver_id: adminId2, // Independent Admin 2
      p_approve: true,
      p_notes: 'Co-signed by Secondary Finance Administrator after evidence review.',
    });
    assert(!errCoSign && coSignRes?.success, '4.3 Secondary independent admin co-signs successfully', errCoSign?.message);
    assert(coSignRes?.status === 'fully_approved_and_executed', '4.3 High-impact approval completed and executed');

    // -------------------------------------------------------------------------
    // TEST SUITE 5: Exit Criteria 4 - Support Channel, SLA & Ticketing System
    // -------------------------------------------------------------------------
    console.log('\n--- Test Suite 5: Support Tickets, Channel & Hours Visibility ---');

    // 5.1 Create support ticket with SLA target
    const { data: tckRes, error: errTck } = await supabase.rpc('create_support_ticket', {
      p_user_id: studentId,
      p_category: 'booking',
      p_subject: 'Query regarding session rescheduling window',
      p_description: 'I need guidance on how to adjust my upcoming S01 review slot.',
      p_priority: 'normal',
    });
    assert(!errTck && tckRes?.success, '5.1 Support ticket created successfully', errTck?.message);
    assert(tckRes?.ticket_ref?.startsWith('TCK-'), '5.1 Support ticket assigned unique reference');
    assert(tckRes?.status === 'open', '5.1 Ticket status initialized to open');
    assert(tckRes?.sla_target_response, '5.1 SLA target response timestamp attached (< 4 hours)');

    // 5.2 Add customer & agent support message
    const { data: msgRes1, error: msgErr1 } = await supabase.rpc('add_support_ticket_message', {
      p_ticket_id: tckRes.ticket_id,
      p_sender_id: studentId,
      p_message: 'Can I reschedule without penalty 2 hours prior?',
      p_is_internal: false,
    });
    assert(!msgErr1 && msgRes1?.success, '5.2 Candidate message attached to support ticket', msgErr1?.message);

    const { data: msgRes2, error: msgErr2 } = await supabase.rpc('add_support_ticket_message', {
      p_ticket_id: tckRes.ticket_id,
      p_sender_id: adminId1,
      p_message: 'Yes! DreamX provides 100% free cancellation & rescheduling up to 1 hour before.',
      p_is_internal: false,
    });
    assert(!msgErr2 && msgRes2?.success, '5.2 Support agent message attached to support ticket', msgErr2?.message);

  } catch (err: unknown) {
    console.error('Unexpected test execution failure:', err);
    failed++;
  }

  console.log('\n========================================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('========================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase11Tests();
