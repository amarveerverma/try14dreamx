/**
 * DreamX Phase P2 Verification Test Suite
 * Validates all deliverables and exit criteria for Platform Foundations.
 */

import {
  rupeesToPaise,
  paiseToRupees,
  formatINR,
  calculatePricingBreakdown,
  calculateMentorPayout,
} from '../src/lib/money';
import { formatIST, calculateSLADeadline, calculateHoldExpiration } from '../src/lib/datetime';
import { scrubSensitiveData, scrubString } from '../src/lib/sanitizer';
import { executeIdempotentTask, clearIdempotencyRegistry } from '../src/lib/idempotency';

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

async function runTests() {
  console.log('\n======================================================');
  console.log('--- RUNNING PHASE P2: PLATFORM FOUNDATIONS TESTS ---');
  console.log('======================================================\n');

  // 1. Money Math & Integer Paise Tests (PRD §19.1)
  console.log('Group 1: Money Arithmetic & Integer Paise');
  assert(rupeesToPaise(1499) === 149900, 'Rupees to paise converts exactly');
  assert(paiseToRupees(149900) === 1499, 'Paise to rupees converts exactly');
  assert(formatINR(149900) === '₹1,499', 'formatINR formats standard INR without decimals');
  assert(formatINR(149950, { showPaise: true }) === '₹1,499.50', 'formatINR formats paise with 2 decimals');

  const freePricing = calculatePricingBreakdown(149900, 'free');
  assert(freePricing.finalPaise === 149900, 'Free tier has 0% discount');
  assert(freePricing.gstPaise === 22866, '18% inclusive GST matches 149900 - round(149900*100/118)');
  assert(freePricing.netPaise === 127034, 'Net paise plus GST equals final paise (127034 + 22866 = 149900)');

  const proPricing = calculatePricingBreakdown(149900, 'pro');
  assert(proPricing.discountPercent === 5, 'Pro tier applies 5% discount');
  assert(proPricing.discountPaise === 7495, '5% discount on 149900 is 7495 paise');
  assert(proPricing.finalPaise === 142405, 'Final price reflects exactly 5% discount (142405 paise)');

  const elitePricing = calculatePricingBreakdown(149900, 'elite');
  assert(elitePricing.discountPercent === 10, 'Elite tier applies 10% discount');
  assert(elitePricing.finalPaise === 134910, 'Final price reflects exactly 10% discount');

  const payout = calculateMentorPayout(100000);
  assert(payout.mentorPaise === 80000, 'Mentor receives 80% of list price');
  assert(payout.platformFeePaise === 20000, 'Platform retains 20% commission');

  // 2. DateTime & SLA Deadline Tests (PRD §19.2)
  console.log('\nGroup 2: Asia/Kolkata DateTime & 48h SLA Calculations');
  const testDate = new Date('2026-11-10T10:00:00Z');
  const istString = formatIST(testDate, 'full');
  assert(istString.includes('2026'), 'formatIST formats with 2026 year');

  const now = new Date();
  const futureSession = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
  const slaResult = calculateSLADeadline(futureSession, 48);
  assert(!slaResult.isBreached, 'SLA is not breached within 48 hours');
  assert(slaResult.remainingHours === 45 || slaResult.remainingHours === 46, 'Remaining SLA hours computed correctly');

  const expiredSession = new Date(now.getTime() - 50 * 60 * 60 * 1000); // 50 hours ago
  const breachedSla = calculateSLADeadline(expiredSession, 48);
  assert(breachedSla.isBreached, 'SLA reports breached after 48 hours');
  assert(breachedSla.remainingHours === 0, 'Remaining hours is 0 on SLA breach');

  const holdResult = calculateHoldExpiration(now, 15);
  assert(!holdResult.isExpired, '15-minute slot hold is active immediately after hold');
  assert(holdResult.remainingSeconds > 800, 'Slot hold has over 800 seconds remaining');

  // 3. Telemetry & Data Sanitization Tests (PRD §18.3, V-18)
  console.log('\nGroup 3: Sensitive Data Scrubbing & PII Protection');
  const dirtyString = 'Contact user at +919876543210 or user@example.com for session support';
  const cleanString = scrubString(dirtyString);
  assert(!cleanString.includes('9876543210'), 'Indian phone numbers are scrubbed');
  assert(!cleanString.includes('user@example.com'), 'Email addresses are scrubbed');
  assert(cleanString.includes('[REDACTED_PHONE]'), 'Phone replacement tag is placed');
  assert(cleanString.includes('[REDACTED_EMAIL]'), 'Email replacement tag is placed');

  const dirtyPayload = {
    userId: 'usr_123',
    password: 'supersecretpassword123',
    bank_account_number: '123456789012',
    upi_id: 'user@okhdfcbank',
    nested: {
      api_key: 'sb_secret_token_12345',
      note: 'Reach out to 9876543210',
    },
  };
  const scrubbedPayload = scrubSensitiveData(dirtyPayload);
  assert(scrubbedPayload.password === '[REDACTED_SECRET]', 'Password field scrubbed');
  assert(scrubbedPayload.bank_account_number === '[REDACTED_SECRET]', 'Bank account number scrubbed');
  assert(scrubbedPayload.upi_id === '[REDACTED_SECRET]', 'UPI ID field scrubbed');
  assert(scrubbedPayload.nested.api_key === '[REDACTED_SECRET]', 'Nested API key scrubbed');
  assert(scrubbedPayload.nested.note.includes('[REDACTED_PHONE]'), 'Nested phone number scrubbed');

  // 4. Idempotency & Retries Tests (PRD §16, V-16, V-19)
  console.log('\nGroup 4: Idempotent Retries & Duplicate Suppression');
  clearIdempotencyRegistry();
  let taskExecutionCount = 0;

  const sampleTask = async () => {
    taskExecutionCount++;
    return { status: 'processed' };
  };

  // First run
  const res1 = await executeIdempotentTask('job_tx_001', sampleTask);
  assert(res1.success && res1.executed, 'Task executes successfully on first attempt');
  assert(taskExecutionCount === 1, 'Task function was invoked exactly once');

  // Duplicate retry with same key
  const res2 = await executeIdempotentTask('job_tx_001', sampleTask);
  assert(res2.success && !res2.executed, 'Duplicate call is suppressed and recognized as already executed');
  assert(taskExecutionCount === 1, 'Task was NOT re-executed on duplicate invocation');

  // Retry on transient failure test
  let attemptCount = 0;
  const transientTask = async () => {
    attemptCount++;
    if (attemptCount < 2) {
      throw new Error('Transient network glitch');
    }
    return { status: 'recovered' };
  };

  const resRetry = await executeIdempotentTask('job_tx_002', transientTask, { maxRetries: 3, retryDelayMs: 10 });
  assert(resRetry.success && resRetry.executed, 'Task retries and succeeds after transient error');
  assert(attemptCount === 2, 'Task executed 2 attempts before succeeding');

  // Summary
  console.log('\n======================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
