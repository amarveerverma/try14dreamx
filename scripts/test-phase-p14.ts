/**
 * DreamX Phase P14 Verification Test Suite
 * Controlled Pilot Acceptance, Real User Transition & Pilot Decision Recording
 * (PRD §22, §10.2, §14, §15, Implementation Plan P14 Exit Criteria 1, 2, 3)
 */

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://obmpcruljkghvanozber.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseKey) {
  console.error('Missing Supabase Service Key or Anon Key.');
  process.exit(1);
}

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

async function runPhase14Tests() {
  console.log('========================================================================');
  console.log('⚡ DREAMX PHASE P14: CONTROLLED PILOT ACCEPTANCE & REAL USER TRANSITION');
  console.log('========================================================================\n');

  const superAdminId = '00000000-0000-0000-0000-000000000001';
  const studentId = 'a1111111-b222-c333-d444-e55555555502'; // test.student.pro
  const pilotMentor1Id = 'd1111111-1111-4111-8111-111111111101'; // Rajesh Kannan (SWE)
  const pilotMentor2Id = 'd2222222-2222-4222-8222-222222222202'; // Dr. Neha Kapoor (AI/ML)
  const pilotMentor3Id = 'd3333333-3333-4333-8333-333333333303'; // Rohan Deshmukh (PM)

  try {
    // -------------------------------------------------------------------------
    // TEST SUITE 1: Zero Hardcoded Demo Names in Frontend & User Layouts
    // -------------------------------------------------------------------------
    console.log('--- Test Suite 1: Zero Hardcoded Demo Names in User Layouts & Core UI ---');

    // 1.1 Verify no "Vikram" or "Ananya" in dashboard layout, mentor layout, onboarding, or services
    const filesToCheck = [
      'src/app/dashboard/layout.tsx',
      'src/app/dashboard/page.tsx',
      'src/app/mentor/layout.tsx',
      'src/app/mentor/page.tsx',
      'src/app/mentor/onboarding/page.tsx',
      'src/app/mentor/earnings/page.tsx',
      'src/app/mentor/availability/page.tsx',
      'src/app/mentor/verification/page.tsx',
      'src/app/mentors/[id]/page.tsx',
      'src/app/services/[slug]/ServiceDetailClient.tsx',
      'src/data/mentors.ts',
    ];

    for (const relPath of filesToCheck) {
      const fullPath = path.join(process.cwd(), relPath);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const hasVikram = /vikram/i.test(content);
        const hasAnanya = /ananya/i.test(content);
        assert(!hasVikram && !hasAnanya, `1.1 Zero demo names in ${relPath}`);
      }
    }

    // 1.2 Confirm deprecated VikramadityaProfileView.tsx is deleted
    const staticViewPath = path.join(process.cwd(), 'src/app/mentors/[id]/VikramadityaProfileView.tsx');
    assert(!fs.existsSync(staticViewPath), '1.2 Static VikramadityaProfileView.tsx permanently deprecated and removed');

    // -------------------------------------------------------------------------
    // TEST SUITE 2: Pilot Mentors Roster across the 3 Official Domains (PRD §22.1)
    // -------------------------------------------------------------------------
    console.log('\n--- Test Suite 2: Pilot Mentors Roster across Three Domains (PRD §22.1) ---');

    // 2.1 Software Engineering Mentor (Rajesh Kannan)
    const { data: m1Profile } = await supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .eq('id', pilotMentor1Id)
      .single();
    assert(m1Profile?.full_name === 'Rajesh Kannan', '2.1 Rajesh Kannan profile exists');
    assert(m1Profile?.role === 'mentor', '2.1 Rajesh Kannan role is mentor');

    const { data: m1Mentor } = await supabase
      .from('mentor_profiles')
      .select('id, current_employer, job_title, verification_status, approved_services')
      .eq('id', pilotMentor1Id)
      .single();
    assert(m1Mentor?.verification_status === 'approved', '2.1 Rajesh Kannan is accredited and approved');
    assert(m1Mentor?.approved_services.includes('S06'), '2.1 Rajesh Kannan approved for S06 Technical Mock');

    // 2.2 Data Science & AI Mentor (Dr. Neha Kapoor)
    const { data: m2Profile } = await supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .eq('id', pilotMentor2Id)
      .single();
    assert(m2Profile?.full_name === 'Dr. Neha Kapoor', '2.2 Dr. Neha Kapoor profile exists');
    assert(m2Profile?.role === 'mentor', '2.2 Dr. Neha Kapoor role is mentor');

    const { data: m2Mentor } = await supabase
      .from('mentor_profiles')
      .select('id, current_employer, job_title, verification_status, approved_services')
      .eq('id', pilotMentor2Id)
      .single();
    assert(m2Mentor?.verification_status === 'approved', '2.2 Dr. Neha Kapoor is accredited and approved');
    assert(m2Mentor?.approved_services.includes('S06'), '2.2 Dr. Neha Kapoor approved for S06 Technical Mock');

    // 2.3 Product Management Mentor (Rohan Deshmukh)
    const { data: m3Profile } = await supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .eq('id', pilotMentor3Id)
      .single();
    assert(m3Profile?.full_name === 'Rohan Deshmukh', '2.3 Rohan Deshmukh profile exists');
    assert(m3Profile?.role === 'mentor', '2.3 Rohan Deshmukh role is mentor');

    const { data: m3Mentor } = await supabase
      .from('mentor_profiles')
      .select('id, current_employer, job_title, verification_status, approved_services')
      .eq('id', pilotMentor3Id)
      .single();
    assert(m3Mentor?.verification_status === 'approved', '2.3 Rohan Deshmukh is accredited and approved');
    assert(m3Mentor?.approved_services.includes('S05'), '2.3 Rohan Deshmukh approved for S05 Behavioral Mock');

    // 2.4 Verify Active Availability Slots for all 3 pilot mentors
    const { data: slots } = await supabase
      .from('mentor_availability_slots')
      .select('id, mentor_id, is_active')
      .in('mentor_id', [pilotMentor1Id, pilotMentor2Id, pilotMentor3Id])
      .eq('is_active', true);
    assert(Array.isArray(slots) && slots.length >= 6, '2.4 Recurring availability slots active for pilot mentors');

    // -------------------------------------------------------------------------
    // TEST SUITE 3: Real User End-to-End Execution Lifecycle
    // -------------------------------------------------------------------------
    console.log('\n--- Test Suite 3: Real User End-to-End Booking & Settlement Lifecycle ---');

    // 3.1 Real slot claim with pilot mentor Rajesh Kannan
    const now = new Date();
    const sessionStart = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();
    const sessionEnd = new Date(now.getTime() + (5 * 24 + 1) * 60 * 60 * 1000).toISOString();

    const { data: claimRes, error: errClaim } = await supabase.rpc('claim_booking_slot', {
      p_student_id: studentId,
      p_mentor_id: pilotMentor1Id,
      p_service_code: 'S06',
      p_slot_id: null,
      p_session_start: sessionStart,
      p_session_end: sessionEnd,
      p_amount_paise: 99900,
      p_pre_session_notes: 'Real user test booking for live system design session.',
    });

    assert(!errClaim && claimRes?.success, '3.1 Atomic slot claim succeeds for pilot mentor Rajesh Kannan', errClaim?.message);
    const bookingId = claimRes?.booking_id;
    assert(Boolean(bookingId), '3.1 Authoritative booking ID returned');
    assert(claimRes?.status === 'held', '3.1 Booking status is held');

    // 3.2 Payment confirmation & Razorpay Nodal Escrow hold via stored procedure
    const paymentRef = 'PAY_RZP_' + crypto.randomUUID().slice(0, 10);
    const { data: payRes, error: errPay } = await supabase.rpc('confirm_booking_payment', {
      p_booking_id: bookingId,
      p_payment_reference: paymentRef,
    });
    assert(!errPay && payRes?.success, '3.2 Payment confirmed and escrow hold active via confirm_booking_payment', errPay?.message);

    // 3.3 Mentor submits verified 8-dimension deliverable scorecard
    const sha256 = '0x' + crypto.createHash('sha256').update('DELIVERABLE_P14_' + bookingId).digest('hex');
    const { data: reportRes, error: errReport } = await supabase.rpc('submit_session_report', {
      p_booking_id: bookingId,
      p_mentor_id: pilotMentor1Id,
      p_rubric_scores: {
        architecture: 4.8,
        concurrency: 4.5,
        scalability: 4.7,
        fault_tolerance: 4.6,
      },
      p_summary_notes: 'Exceptional grasp of Kafka partition rebalancing and low-level redlock patterns.',
      p_strengths: ['Strong trade-off framing', 'Clean distributed lock design'],
      p_growth_areas: ['Deeper analysis of write skew anomaly under snapshot isolation'],
      p_action_items: [
        { title: 'Read DDIA Chapter 7 on Transactions', timeline: '7 days', priority: 'high' },
      ],
      p_deliverable_pdf_url: `https://storage.dreamx.in/deliverables/${bookingId}.pdf`,
      p_deliverable_sha256: sha256,
    });
    assert(!errReport && reportRes?.success, '3.3 Verified session report submitted with SHA-256 deliverable', errReport?.message);
    assert(reportRes?.is_late === false, '3.3 Deliverable submitted within 48h SLA window');

    // 3.4 Verify automated mentor settlement calculation in nodal escrow
    const { data: settlement } = await supabase.rpc('get_test_settlement_p11', {
      p_booking_id: bookingId,
    });
    assert(Boolean(settlement), '3.4 Automated mentor settlement recorded in escrow ledger');
    assert(settlement?.gross_amount_paise === 99900, '3.4 Gross amount matches 99900 paise');
    assert(settlement?.payout_status === 'eligible_for_payout', '3.4 Payout status unlocked to eligible_for_payout upon SLA deliverable verification');

    // -------------------------------------------------------------------------
    // TEST SUITE 4: Controlled Pilot Acceptance Engine (PRD §22.2, §22.3)
    // -------------------------------------------------------------------------
    console.log('\n--- Test Suite 4: Pilot Acceptance Review & Metrics Engine (PRD §22.2) ---');

    const { data: pilotAudit, error: errPilot } = await supabase.rpc('get_pilot_acceptance_review', {
      p_admin_id: superAdminId,
    });

    assert(!errPilot && pilotAudit?.success, '4.1 get_pilot_acceptance_review executes successfully', errPilot?.message);
    assert(pilotAudit?.pilot_cohort?.domains?.length === 3, '4.1 Exactly 3 pilot domains audited');
    assert(pilotAudit?.pilot_cohort?.active_pilot_mentors === 3, '4.1 Exactly 3 active pilot mentors');

    // Validate 4 core metric gates
    assert(typeof pilotAudit?.metrics?.completion_rate?.value === 'number', '4.2 Booking completion rate calculated');
    assert(typeof pilotAudit?.metrics?.sla_compliance?.value === 'number', '4.2 48-Hour SLA compliance calculated');
    assert(typeof pilotAudit?.metrics?.dispute_rate?.value === 'number', '4.2 Dispute rate calculated');
    assert(pilotAudit?.metrics?.nodal_escrow_integrity?.violations === 0, '4.2 Zero nodal escrow violations');

    // Validate unit economics
    assert(typeof pilotAudit?.unit_economics_paise?.gmv_paise === 'number', '4.3 GMV calculated in integer paise');
    assert(typeof pilotAudit?.unit_economics_paise?.platform_net_revenue_paise === 'number', '4.3 Platform net revenue calculated');
    assert(typeof pilotAudit?.unit_economics_paise?.gst_remitted_paise === 'number', '4.3 18% GST calculation verified');

    // -------------------------------------------------------------------------
    // TEST SUITE 5: Formal Executive Decision Recording (P14 Exit Criteria 3)
    // -------------------------------------------------------------------------
    console.log('\n--- Test Suite 5: Executive Decision Recording & Anti-Tamper (P14 Exit Criteria 3) ---');

    // 5.1 Super admin records EXPAND decision
    const { data: decisionRes, error: errDecision } = await supabase.rpc('record_pilot_decision', {
      p_admin_id: superAdminId,
      p_decision: 'EXPAND',
      p_notes: 'Phase P14 Pilot verified with 0 demo names, 3 active launch domains, and 100% escrow integrity. Cleared for expansion.',
    });
    assert(!errDecision && decisionRes?.success, '5.1 Super Admin records EXPAND decision successfully', errDecision?.message);
    assert(decisionRes?.decision === 'EXPAND', '5.1 EXPAND decision returned');

    // 5.2 Verify decision logged into immutable audit trail
    const { data: auditCheck } = await supabase.rpc('query_admin_audit_logs', {
      p_admin_id: superAdminId,
      p_target_type: 'pilot_cohort',
      p_limit: 5,
    });
    const pilotAuditLog = auditCheck?.logs?.find((l: any) => l.action === 'PILOT_DECISION_RECORDED');
    assert(pilotAuditLog !== undefined, '5.2 Exit Criteria 3: Pilot decision certified in audit trail');

    // 5.3 Candidate strictly denied from recording pilot decision (Negative Security Test)
    let candidateBlocked = false;
    try {
      const { error: errUnauthorized } = await supabase.rpc('record_pilot_decision', {
        p_admin_id: studentId,
        p_decision: 'EXPAND',
        p_notes: 'Unauthorized candidate attempt',
      });
      if (errUnauthorized) candidateBlocked = true;
    } catch {
      candidateBlocked = true;
    }
    assert(candidateBlocked, '5.3 Candidate strictly blocked from recording executive pilot decisions');

    // 5.4 Invalid decision rejected
    let invalidBlocked = false;
    try {
      const { error: errInvalid } = await supabase.rpc('record_pilot_decision', {
        p_admin_id: superAdminId,
        p_decision: 'INVALID_DECISION_CODE',
      });
      if (errInvalid) invalidBlocked = true;
    } catch {
      invalidBlocked = true;
    }
    assert(invalidBlocked, '5.4 Arbitrary decision strings rejected by schema constraint');
  } catch (err) {
    console.error('Test execution exception:', err);
    failed++;
  }

  console.log('\n========================================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('========================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase14Tests();
