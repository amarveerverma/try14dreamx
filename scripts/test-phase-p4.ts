/**
 * DreamX Phase P4 Verification Test Suite
 * Validates:
 * 1. Each segment's weights total exactly 100% (1.00).
 * 2. Deterministic scoring (same inputs always produce identical scores).
 * 3. Proportional redistribution when Portfolio does not apply.
 * 4. Missing scores are never silently treated as zero.
 * 5. Evidence coverage percentage and unassessed tracking.
 * 6. Explicit reason-linked recommendations for highest-weighted gap.
 * 7. Non-hiring probability disclaimer presence and statutory compliance.
 * 8. Supabase schema, types, and RLS tables for readiness & journey.
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

import {
  SEGMENT_WEIGHTS,
  calculateReadinessScore,
  READINESS_DISCLAIMER,
  type CandidateSegment,
  type DimensionKey,
} from '../src/lib/readiness';
import { createClient } from '@supabase/supabase-js';

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
  console.log('--- RUNNING PHASE P4: READINESS & JOURNEY TESTS ---');
  console.log('======================================================\n');

  // -----------------------------------------------------------------
  // Group 1: Segment Weights Validation (PRD §8.2, Exit Criteria #1)
  // -----------------------------------------------------------------
  console.log('Group 1: 4 Candidate Segment Weight Tables Total 100% (PRD §8.2)');
  const segments: CandidateSegment[] = ['student', 'fresh_graduate', 'early_career', 'career_switcher'];
  const expectedDimensions: DimensionKey[] = [
    'resume',
    'linkedin',
    'portfolio',
    'communication',
    'technical_skills',
    'interview_skills',
    'career_planning',
    'confidence',
  ];

  for (const seg of segments) {
    const weights = SEGMENT_WEIGHTS[seg];
    assert(!!weights, `Segment weight table exists for segment "${seg}"`);

    // Check all 8 dimensions are present
    const hasAllDims = expectedDimensions.every((d) => typeof weights[d] === 'number');
    assert(hasAllDims, `Segment "${seg}" contains all 8 required assessment dimensions`);

    // Sum weights with floating-point tolerance
    const sum = Object.values(weights).reduce((acc, w) => acc + w, 0);
    const roundedSum = Math.round(sum * 1000) / 1000;
    assert(
      roundedSum === 1.0,
      `Segment "${seg}" weights sum to exactly 1.00 (100%) [Computed: ${roundedSum}]`
    );
  }

  // -----------------------------------------------------------------
  // Group 2: Deterministic Scoring (PRD §8.1, Exit Criteria #2)
  // -----------------------------------------------------------------
  console.log('\nGroup 2: Deterministic Scoring Consistency (PRD §8.1)');
  const fixedScores: Record<DimensionKey, number> = {
    resume: 4.5,
    linkedin: 3.5,
    portfolio: 4.0,
    communication: 3.0,
    technical_skills: 2.5,
    interview_skills: 3.5,
    career_planning: 4.0,
    confidence: 3.0,
  };

  const initialResult = calculateReadinessScore('student', fixedScores);

  // Run 100 iterations with the exact same inputs
  let allIdentical = true;
  for (let i = 0; i < 100; i++) {
    const trial = calculateReadinessScore('student', fixedScores);
    if (trial.overallScore !== initialResult.overallScore) {
      allIdentical = false;
      break;
    }
  }
  assert(allIdentical, 'The exact same inputs produce identical scores across 100 repeated trials (Deterministic)');

  // Manual calculation check for student segment
  // Weights: resume 0.15, linkedin 0.08, portfolio 0.12, comm 0.10, tech 0.20, interview 0.15, plan 0.10, conf 0.10
  // Values / 5:
  // resume: 4.5/5 = 0.90 -> 0.15 * 0.90 = 0.135
  // linkedin: 3.5/5 = 0.70 -> 0.08 * 0.70 = 0.056
  // portfolio: 4.0/5 = 0.80 -> 0.12 * 0.80 = 0.096
  // comm: 3.0/5 = 0.60 -> 0.10 * 0.60 = 0.060
  // tech: 2.5/5 = 0.50 -> 0.20 * 0.50 = 0.100
  // interview: 3.5/5 = 0.70 -> 0.15 * 0.70 = 0.105
  // plan: 4.0/5 = 0.80 -> 0.10 * 0.80 = 0.080
  // conf: 3.0/5 = 0.60 -> 0.10 * 0.60 = 0.060
  // Sum = 0.135 + 0.056 + 0.096 + 0.060 + 0.100 + 0.105 + 0.080 + 0.060 = 0.692
  // 0.692 * 100 = 69.2
  assert(
    initialResult.overallScore === 69.2,
    `Calculated student composite score matches manual mathematical formula (Expected: 69.2, Got: ${initialResult.overallScore})`
  );

  // -----------------------------------------------------------------
  // Group 3: Proportional Redistribution When Portfolio Non-Applicable
  // -----------------------------------------------------------------
  console.log('\nGroup 3: Proportional Weight Redistribution (Portfolio Non-Applicable)');
  const exemptResult = calculateReadinessScore('student', fixedScores, {
    isPortfolioApplicable: false,
  });

  assert(
    exemptResult.effectiveWeights.portfolio === 0,
    'Portfolio weight is reduced to 0 when marked non-applicable'
  );

  // Sum of remaining 7 dimensions
  const redistributedSum = Object.values(exemptResult.effectiveWeights).reduce((a, b) => a + b, 0);
  const roundedRedistributedSum = Math.round(redistributedSum * 100) / 100;
  assert(
    roundedRedistributedSum === 1.0,
    `Redistributed weights total 100% (1.00) after excluding portfolio [Sum: ${roundedRedistributedSum}]`
  );

  assert(
    exemptResult.effectiveWeights.technical_skills > SEGMENT_WEIGHTS.student.technical_skills,
    'Technical skills weight proportionally increased to absorb exempt portfolio weight'
  );

  // -----------------------------------------------------------------
  // Group 4: Missing Scores Never Silently Zeroed (PRD §8.3, Exit Criteria #3)
  // -----------------------------------------------------------------
  console.log('\nGroup 4: Missing Score Handling & Evidence Coverage Tracking');
  // Evaluate only 4 dimensions out of 8 with perfect 5.0
  const partialScores: Partial<Record<DimensionKey, number>> = {
    resume: 5.0,
    technical_skills: 5.0,
    interview_skills: 5.0,
    career_planning: 5.0,
  };

  const partialResult = calculateReadinessScore('student', partialScores);

  assert(
    partialResult.overallScore === 100,
    'Assessed dimensions with 5.0 evaluate to 100 without being silently zero-dragged by unassessed dimensions'
  );

  assert(
    partialResult.evidenceCoverage === 50,
    `Evidence coverage tracks accurately (4 of 8 assessed = 50%, Got: ${partialResult.evidenceCoverage}%)`
  );

  assert(
    partialResult.unassessedKeys.length === 4,
    `Unassessed dimensions are explicitly surfaced in metadata (Expected: 4, Got: ${partialResult.unassessedKeys.length})`
  );

  assert(
    partialResult.unassessedKeys.includes('portfolio') &&
      partialResult.unassessedKeys.includes('linkedin') &&
      partialResult.unassessedKeys.includes('communication') &&
      partialResult.unassessedKeys.includes('confidence'),
    'Unassessed dimensions accurately listed without silent truncation'
  );

  // -----------------------------------------------------------------
  // Group 5: Deterministic Recommendations with Explicit Reasons
  // -----------------------------------------------------------------
  console.log('\nGroup 5: Highest-Weighted Gap & Reason-Linked Recommendation');
  // In initialResult:
  // tech is 2.5/5 with 20% weight -> gap = 0.20 * (5 - 2.5) = 0.50 (highest gap)
  assert(
    initialResult.highestGapDimension === 'technical_skills',
    'Deterministic recommendation identifies highest-weighted opportunity gap (technical_skills)'
  );

  assert(
    initialResult.recommendedServiceCode === 'S06',
    'Identified gap maps to correct service intervention S06 (System Design & DSA Technical Mock)'
  );

  assert(
    initialResult.recommendationReason.includes('highest-weighted opportunity gap') &&
      initialResult.recommendationReason.includes('S06') &&
      initialResult.recommendationReason.includes('20%'),
    `Recommendation provides explicit deterministic justification text: "${initialResult.recommendationReason.slice(0, 70)}..."`
  );

  // -----------------------------------------------------------------
  // Group 6: Statutory Non-Hiring Guarantee Notice (PRD §8.4, Exit Criteria #4)
  // -----------------------------------------------------------------
  console.log('\nGroup 6: Statutory Non-Hiring Guarantee Disclaimer');
  assert(
    !!READINESS_DISCLAIMER && READINESS_DISCLAIMER.length > 20,
    'READINESS_DISCLAIMER constant is declared and non-empty'
  );

  assert(
    READINESS_DISCLAIMER.includes('not a hiring guarantee or probability'),
    'Disclaimer explicitly states score is not a hiring guarantee or probability'
  );

  assert(
    initialResult.disclaimer === READINESS_DISCLAIMER,
    'Every readiness score calculation returns statutory non-hiring disclaimer'
  );

  // -----------------------------------------------------------------
  // Group 7: Supabase Schema & Tables Verification
  // -----------------------------------------------------------------
  console.log('\nGroup 7: Supabase Readiness & Journey Tables');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify readiness_assessments table is accessible
    const { data: assessData, error: assessErr } = await supabase
      .from('readiness_assessments')
      .select('id, user_id, overall_score, is_private')
      .limit(1);

    assert(
      !assessErr && Array.isArray(assessData),
      'Supabase table "public.readiness_assessments" exists and is queryable via PostgREST',
      assessErr?.message
    );

    // Verify career_journey_events table is accessible
    const { data: journeyData, error: journeyErr } = await supabase
      .from('career_journey_events')
      .select('id, user_id, title, category')
      .limit(1);

    assert(
      !journeyErr && Array.isArray(journeyData),
      'Supabase table "public.career_journey_events" exists and is queryable via PostgREST',
      journeyErr?.message
    );
  } else {
    console.log('  ⚠ Supabase env variables not detected; skipping direct network queries.');
  }

  // -----------------------------------------------------------------
  // Summary
  // -----------------------------------------------------------------
  console.log('\n======================================================');
  console.log(`PHASE P4 VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test run error:', err);
  process.exit(1);
});
