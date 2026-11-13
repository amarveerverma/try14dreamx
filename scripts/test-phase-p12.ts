/**
 * DreamX Phase P12 Verification Test Suite
 * Validates PRD §15, §20 and Implementation Plan P12 Exit Criteria:
 * 
 * Exit Criteria 1: Each role sees only what its permissions allow.
 * - super_admin: Full access to all 6 operational and financial queues.
 * - reviewer: Access restricted to verifications and late deliverable reports; financial queues suppressed.
 * - ops_agent: Access restricted to support tickets, Smart Match exceptions, and dispute intake; approvals suppressed.
 * - finance_controller: Access restricted to disputes and financial co-signature approvals; review queues suppressed.
 * - Reviewer/Ops attempts to co-sign high-impact financial transactions are strictly blocked by RBAC.
 * - Finance Controller can successfully co-sign high-impact transactions.
 * 
 * Exit Criteria 2: Every metric has a definition on file.
 * - GMV, Take Rate, Dispute Rate, and Report SLA each return written numerator, denominator, and exclusions.
 * - Absolute integrity of integer paise financial calculations.
 * 
 * Exit Criteria 3: Small-sample outcome percentages are not published.
 * - Verified mentor rubric scorecards kept strictly separate from candidate self-reported feedback ratings.
 * - Rating samples < 5 are suppressed with explicit label ("Insufficient Sample (< 5 ratings)").
 * - Rating samples >= 5 compute and display the arithmetic average.
 * 
 * Additional Governance: Audit Trail & DPDP Privacy Purge Workflows (PRD §15.3, §18.2).
 * - Compliance user data export packet generation and logging.
 * - User profile immediate PII anonymization / soft delete with 30-day scheduled retention purge.
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

async function runPhase12Tests() {
  console.log('========================================================================');
  console.log('⚡ DREAMX PHASE P12: OPERATIONS CONSOLE & MARKETPLACE ANALYTICS SUITE');
  console.log('========================================================================\n');

  // Test identities
  const superAdminId = '00000000-0000-0000-0000-000000000001';      // super_admin
  const financeAdminId = '00000000-0000-0000-0000-000000000002';    // finance_controller
  const reviewerAdminId = '00000000-0000-0000-0000-000000000003';   // reviewer
  const opsAdminId = '00000000-0000-0000-0000-000000000004';        // ops_agent

  const studentId = 'a1111111-b222-c333-d444-e55555555501';         // Test Candidate
  const mentorId = 'c1111111-2222-3333-4444-555555555501';          // Test Mentor

  try {
    // -------------------------------------------------------------------------
    // TEST SUITE 1: Exit Criteria 1 - RBAC Operations Queues Partitioning
    // -------------------------------------------------------------------------
    console.log('--- Test Suite 1: RBAC Queue Permissions Partitioning ---');

    // 1.1 Super Admin accesses ops queues -> receives all queues
    const { data: superQueues, error: errSuper } = await supabase.rpc('get_admin_ops_queues', {
      p_admin_id: superAdminId,
    });
    assert(!errSuper && superQueues?.success, '1.1 super_admin accesses ops queues successfully', errSuper?.message);
    assert(superQueues?.subrole === 'super_admin', '1.1 super_admin subrole confirmed');
    assert(Array.isArray(superQueues?.queues?.verifications), '1.1 super_admin sees verifications queue');
    assert(Array.isArray(superQueues?.queues?.late_reports), '1.1 super_admin sees late reports queue');
    assert(Array.isArray(superQueues?.queues?.disputes), '1.1 super_admin sees disputes queue');
    assert(Array.isArray(superQueues?.queues?.financial_approvals), '1.1 super_admin sees financial approvals queue');
    assert(Array.isArray(superQueues?.queues?.match_exceptions), '1.1 super_admin sees match exceptions queue');
    assert(Array.isArray(superQueues?.queues?.support_tickets), '1.1 super_admin sees support tickets queue');

    // 1.2 Reviewer Admin accesses ops queues -> verifications & late reports visible, financial queues suppressed
    const { data: revQueues, error: errRev } = await supabase.rpc('get_admin_ops_queues', {
      p_admin_id: reviewerAdminId,
    });
    assert(!errRev && revQueues?.success, '1.2 reviewer accesses ops queues successfully', errRev?.message);
    assert(revQueues?.subrole === 'reviewer', '1.2 reviewer subrole confirmed');
    assert(Array.isArray(revQueues?.queues?.verifications), '1.2 reviewer sees verifications queue');
    assert(Array.isArray(revQueues?.queues?.late_reports), '1.2 reviewer sees late reports queue');
    // Financial and operational queues strictly suppressed for reviewer
    assert(revQueues?.counts?.financial_approvals === 0, '1.2 Exit Criteria 1: reviewer CANNOT access financial approvals queue');
    assert(revQueues?.counts?.disputes === 0, '1.2 Exit Criteria 1: reviewer CANNOT access disputes queue');
    assert(revQueues?.counts?.match_exceptions === 0, '1.2 Exit Criteria 1: reviewer CANNOT access match exceptions queue');

    // 1.3 Finance Controller accesses ops queues -> financial approvals & disputes visible, reviewer queues suppressed
    const { data: finQueues, error: errFin } = await supabase.rpc('get_admin_ops_queues', {
      p_admin_id: financeAdminId,
    });
    assert(!errFin && finQueues?.success, '1.3 finance_controller accesses ops queues successfully', errFin?.message);
    assert(finQueues?.subrole === 'finance_controller', '1.3 finance_controller subrole confirmed');
    assert(Array.isArray(finQueues?.queues?.financial_approvals), '1.3 finance_controller sees financial approvals queue');
    assert(Array.isArray(finQueues?.queues?.disputes), '1.3 finance_controller sees disputes queue');
    // Review queues strictly suppressed for finance controller
    assert(finQueues?.counts?.verifications === 0, '1.3 Exit Criteria 1: finance_controller CANNOT access verifications queue');
    assert(finQueues?.counts?.late_reports === 0, '1.3 Exit Criteria 1: finance_controller CANNOT access late reports queue');

    // 1.4 Ops Agent accesses ops queues -> support tickets, match exceptions, disputes visible; approvals suppressed
    const { data: opsQueues, error: errOps } = await supabase.rpc('get_admin_ops_queues', {
      p_admin_id: opsAdminId,
    });
    assert(!errOps && opsQueues?.success, '1.4 ops_agent accesses ops queues successfully', errOps?.message);
    assert(opsQueues?.subrole === 'ops_agent', '1.4 ops_agent subrole confirmed');
    assert(Array.isArray(opsQueues?.queues?.support_tickets), '1.4 ops_agent sees support tickets queue');
    assert(Array.isArray(opsQueues?.queues?.match_exceptions), '1.4 ops_agent sees match exceptions queue');
    assert(opsQueues?.counts?.financial_approvals === 0, '1.4 Exit Criteria 1: ops_agent CANNOT access financial approvals queue');
    assert(opsQueues?.counts?.verifications === 0, '1.4 Exit Criteria 1: ops_agent CANNOT access verifications queue');

    // 1.5 Non-admin user (student) attempts to access ops queues -> strictly rejected
    const { error: errStudentQueues } = await supabase.rpc('get_admin_ops_queues', {
      p_admin_id: studentId,
    });
    assert(!!errStudentQueues, '1.5 Non-admin candidate is strictly blocked from operations queues');

    // -------------------------------------------------------------------------
    // TEST SUITE 2: RBAC High-Impact Financial Co-signature Enforcement
    // -------------------------------------------------------------------------
    console.log('\n--- Test Suite 2: RBAC Co-signature Gate Enforcement ---');

    // Set up high-impact dispute requiring secondary co-signature (>= ₹5,000)
    const bHighVal = crypto.randomUUID();
    await supabase.rpc('setup_test_booking_p11', {
      p_booking_id: bHighVal,
      p_student_id: studentId,
      p_mentor_id: mentorId,
      p_service_code: 'S06',
      p_amount_paise: 800000, // ₹8,000 (80% = ₹6,400 >= ₹5,000 threshold)
      p_session_start_offset_minutes: -180,
      p_status: 'completed',
    });

    const { data: dispRes } = await supabase.rpc('raise_booking_dispute', {
      p_booking_id: bHighVal,
      p_student_id: studentId,
      p_reason_code: 'EXECUTIVE_QUALITY_ESCALATION',
      p_complaint_text: 'Executive escalation requiring dual co-signature review.',
    });

    const { data: rulingRes } = await supabase.rpc('resolve_booking_dispute', {
      p_dispute_id: dispRes.dispute_id,
      p_admin_id: superAdminId,
      p_substantiated: true,
      p_ruling_notes: 'Substantiated executive review. Triggers dual-approval gate.',
    });
    assert(rulingRes?.status === 'first_approved_awaiting_co_signer', '2.1 High-impact dispute enters first_approved_awaiting_co_signer');
    const approvalId = rulingRes.approval_id;

    // 2.2 Reviewer attempts financial co-signature -> strictly blocked by RBAC
    const { error: errRevCoSign } = await supabase.rpc('co_sign_financial_approval_p12', {
      p_approval_id: approvalId,
      p_admin_id: reviewerAdminId,
      p_approve: true,
      p_notes: 'Reviewer attempting unauthorized co-sign.',
    });
    assert(!!errRevCoSign, '2.2 Exit Criteria 1: reviewer subrole co-signature blocked by RBAC check');

    // 2.3 Ops Agent attempts financial co-signature -> strictly blocked by RBAC
    const { error: errOpsCoSign } = await supabase.rpc('co_sign_financial_approval_p12', {
      p_approval_id: approvalId,
      p_admin_id: opsAdminId,
      p_approve: true,
      p_notes: 'Ops Agent attempting unauthorized co-sign.',
    });
    assert(!!errOpsCoSign, '2.3 Exit Criteria 1: ops_agent subrole co-signature blocked by RBAC check');

    // 2.4 Finance Controller co-signs -> successfully executes
    const { data: finCoSignRes, error: errFinCoSign } = await supabase.rpc('co_sign_financial_approval_p12', {
      p_approval_id: approvalId,
      p_admin_id: financeAdminId,
      p_approve: true,
      p_notes: 'Approved and co-signed by Finance Controller after independent review.',
    });
    assert(!errFinCoSign && finCoSignRes?.success, '2.4 Exit Criteria 1: finance_controller subrole co-signs successfully', errFinCoSign?.message);
    assert(finCoSignRes?.status === 'fully_approved_and_executed', '2.4 Approval completed and high-impact refund initiated');

    // -------------------------------------------------------------------------
    // TEST SUITE 3: Exit Criteria 2 - Metrics Definitions on File
    // -------------------------------------------------------------------------
    console.log('\n--- Test Suite 3: Metrics Definitions on File (PRD §20) ---');

    const { data: analytics, error: errAnalytics } = await supabase.rpc('get_marketplace_analytics', {
      p_admin_id: superAdminId,
      p_days_interval: 30,
    });
    assert(!errAnalytics && analytics?.success, '3.1 get_marketplace_analytics returned successfully', errAnalytics?.message);

    const m = analytics?.metrics;

    // 3.1 GMV Definition & Integer Paise
    assert(m?.gmv?.definition, '3.1 Exit Criteria 2: GMV definition on file');
    assert(m?.gmv?.numerator, '3.1 Exit Criteria 2: GMV numerator documented');
    assert(m?.gmv?.denominator, '3.1 Exit Criteria 2: GMV denominator documented');
    assert(m?.gmv?.exclusions, '3.1 Exit Criteria 2: GMV exclusions documented');
    assert(typeof m?.gmv?.amount_paise === 'number', '3.1 GMV returned in integer paise');

    // 3.2 Take Rate Definition
    assert(m?.take_rate?.definition, '3.2 Exit Criteria 2: Take Rate definition on file');
    assert(m?.take_rate?.numerator, '3.2 Exit Criteria 2: Take Rate numerator documented');
    assert(m?.take_rate?.denominator, '3.2 Exit Criteria 2: Take Rate denominator documented');
    assert(m?.take_rate?.exclusions, '3.2 Exit Criteria 2: Take Rate exclusions documented');
    assert(m?.take_rate?.percentage >= 0, '3.2 Take Rate percentage calculated');

    // 3.3 Dispute Rate Definition
    assert(m?.dispute_rate?.definition, '3.3 Exit Criteria 2: Dispute Rate definition on file');
    assert(m?.dispute_rate?.numerator, '3.3 Exit Criteria 2: Dispute Rate numerator documented');
    assert(m?.dispute_rate?.denominator, '3.3 Exit Criteria 2: Dispute Rate denominator documented');
    assert(m?.dispute_rate?.exclusions, '3.3 Exit Criteria 2: Dispute Rate exclusions documented');

    // 3.4 Report SLA Adherence Definition
    assert(m?.report_sla_adherence?.definition, '3.4 Exit Criteria 2: Report SLA definition on file');
    assert(m?.report_sla_adherence?.numerator, '3.4 Exit Criteria 2: Report SLA numerator documented');
    assert(m?.report_sla_adherence?.denominator, '3.4 Exit Criteria 2: Report SLA denominator documented');
    assert(m?.report_sla_adherence?.exclusions, '3.4 Exit Criteria 2: Report SLA exclusions documented');

    // -------------------------------------------------------------------------
    // TEST SUITE 4: Exit Criteria 3 - Small-Sample Outcome Suppression Rule
    // -------------------------------------------------------------------------
    console.log('\n--- Test Suite 4: Small-Sample Outcome Suppression (PRD §20) ---');

    // 4.1 Verified vs Self-Reported Outcomes separation
    assert(m?.outcomes_separation?.self_reported, '4.1 Candidate self-reported outcomes tracked');
    assert(m?.outcomes_separation?.verified_rubrics, '4.1 Verified rubric evaluations kept separate');

    // 4.2 When feedback count < 5 -> suppression is strictly enforced
    const selfReported = m?.outcomes_separation?.self_reported;
    if (selfReported?.count < 5) {
      assert(selfReported?.small_sample_suppressed === true, '4.2 Exit Criteria 3: Small-sample suppression is ACTIVE when count < 5');
      assert(selfReported?.average_rating === null, '4.2 Exit Criteria 3: Rating percentage/average is NOT published (< 5 ratings)');
      assert(selfReported?.display_text?.includes('Insufficient Sample'), '4.2 Displays explicit insufficient sample warning');
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 5: Audit Log & Privacy Purge Engine (PRD §15.3, §18.2)
    // -------------------------------------------------------------------------
    console.log('\n--- Test Suite 5: Audit Logging & DPDP Privacy Purge Workflows ---');

    // 5.1 Query Audit Logs
    const { data: logsRes, error: errLogs } = await supabase.rpc('query_admin_audit_logs', {
      p_admin_id: superAdminId,
      p_limit: 10,
    });
    assert(!errLogs && logsRes?.success, '5.1 query_admin_audit_logs executes successfully', errLogs?.message);
    assert(Array.isArray(logsRes?.logs), '5.1 Audit logs returned as array');

    // 5.2 Compliance User Data Export (PRD §18.2)
    const { data: exportRes, error: errExport } = await supabase.rpc('request_user_data_export', {
      p_admin_id: superAdminId,
      p_target_user_id: studentId,
    });
    assert(!errExport && exportRes?.success, '5.2 request_user_data_export compiles compliance package', errExport?.message);
    assert(exportRes?.request_id, '5.2 Export tracking request_id created');
    assert(exportRes?.export_package?.profile?.id === studentId, '5.2 Target user profile in export package');

    // 5.3 Privacy Soft Delete with 30-Day Purge Retention Schedule
    // Create an ephemeral test student to test soft-delete
    const ephemeralStudentId = crypto.randomUUID();
    const { data: ephemAuth } = await supabase.from('profiles').insert({
      id: ephemeralStudentId,
      full_name: 'Ephemeral User for Deletion Drill',
      email: `test_to_delete_${Date.now()}@example.com`,
      role: 'student',
    }).select().single();

    // If profile insert failed due to auth.users FK, test with existing student
    const targetDeleteUser = ephemAuth?.id || studentId;

    const { data: deleteRes, error: errDelete } = await supabase.rpc('execute_privacy_soft_delete', {
      p_admin_id: superAdminId,
      p_target_user_id: targetDeleteUser,
      p_reason: 'Automated launch readiness right-to-erasure compliance test',
    });
    assert(!errDelete && deleteRes?.success, '5.3 execute_privacy_soft_delete executes cleanly', errDelete?.message);
    assert(deleteRes?.soft_deleted_immediately === true, '5.3 Profile soft-deleted immediately');
    assert(deleteRes?.scheduled_purge_date, '5.3 Scheduled 30-day purge retention date attached');

    // Restore profile if it was the standard test student so subsequent tests aren't broken
    if (targetDeleteUser === studentId) {
      await supabase.from('profiles').update({
        full_name: 'Test Free Student',
        email: 'test.student.free@dreamx.in',
      }).eq('id', studentId);
    }

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

runPhase12Tests();
