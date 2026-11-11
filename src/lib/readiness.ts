/**
 * DreamX 8-Dimension Career Readiness Assessment Engine
 * Adheres strictly to PRD §8 & Implementation Plan §P4:
 * - 8 dimensions on 0-5 scale.
 * - 4 segment weight tables (each totals exactly 100%).
 * - Deterministic formula: Readiness = Σ(weight × score / 5) × 100.
 * - Proportional redistribution when Portfolio does not apply.
 * - Missing scores are never silently treated as zero.
 * - Explicit reason-linked recommendations for highest weighted gap.
 * - Non-hiring probability disclaimer.
 */

export type DimensionKey =
  | 'resume'
  | 'linkedin'
  | 'portfolio'
  | 'communication'
  | 'technical_skills'
  | 'interview_skills'
  | 'career_planning'
  | 'confidence';

export type CandidateSegment = 'student' | 'fresh_graduate' | 'early_career' | 'career_switcher';

export interface DimensionMeta {
  key: DimensionKey;
  label: string;
  description: string;
  rubricCriteria: string[];
}

export const DIMENSIONS: Record<DimensionKey, DimensionMeta> = {
  resume: {
    key: 'resume',
    label: 'Resume & ATS Scan',
    description: 'ATS parseability, quantifiable impact metrics (CAR framework), and layout scanability.',
    rubricCriteria: ['ATS pass rate (>95%)', 'CAR bullet structure', 'Quantified business impact', 'Keyword density'],
  },
  linkedin: {
    key: 'linkedin',
    label: 'LinkedIn & Discoverability',
    description: 'Inbound recruiter search visibility, headline CTR, and proof-of-work featured section.',
    rubricCriteria: ['Recruiter keyword match', 'Headline CTR optimization', 'Featured project links', 'Social proof'],
  },
  portfolio: {
    key: 'portfolio',
    label: 'Portfolio & Public Proof-of-Work',
    description: 'Clean code architecture, deployed URLs, open-source commits, and live product demos.',
    rubricCriteria: ['Clean code architecture', 'Live production deployment', 'README polish', 'Git commit hygiene'],
  },
  communication: {
    key: 'communication',
    label: 'Communication & Articulation',
    description: 'Verbal brevity, structuring complex thoughts, and concise problem breakdown.',
    rubricCriteria: ['Brevity and conciseness', 'Technical concept articulation', 'Active listening', 'Structure'],
  },
  technical_skills: {
    key: 'technical_skills',
    label: 'Technical Depth & Core CS',
    description: 'Data structures, algorithmic efficiency, system design trade-offs, and debugging rigor.',
    rubricCriteria: ['Algorithm time/space complexity', 'Edge case resilience', 'System bottleneck identification', 'Clean syntax'],
  },
  interview_skills: {
    key: 'interview_skills',
    label: 'Interview Acumen & STAR Method',
    description: 'Behavioral storytelling, answering ambiguity, leadership traits, and executive composure.',
    rubricCriteria: ['STAR framework mastery', 'Ownership in ambiguity', 'Executive presence', 'Question asking'],
  },
  career_planning: {
    key: 'career_planning',
    label: 'Career Strategy & Targeting',
    description: 'Tier-1 company list alignment, compensation benchmarks, and structured progression roadmaps.',
    rubricCriteria: ['Target company tier fit', 'Salary band literacy', '90-day execution focus', 'Networking leverage'],
  },
  confidence: {
    key: 'confidence',
    label: 'Professional Composure & Presence',
    description: 'Authentic confidence, handling difficult questions, and interview composure under pressure.',
    rubricCriteria: ['Composure under challenge', 'Intellectual humility', 'Assertive delivery', 'Positive rapport'],
  },
};

/**
 * Segment weight tables (PRD §8.2).
 * Each segment totals exactly 100% (1.00).
 */
export const SEGMENT_WEIGHTS: Record<CandidateSegment, Record<DimensionKey, number>> = {
  student: {
    resume: 0.15,
    linkedin: 0.08,
    portfolio: 0.12,
    communication: 0.10,
    technical_skills: 0.20,
    interview_skills: 0.15,
    career_planning: 0.10,
    confidence: 0.10,
  },
  fresh_graduate: {
    resume: 0.15,
    linkedin: 0.10,
    portfolio: 0.10,
    communication: 0.10,
    technical_skills: 0.20,
    interview_skills: 0.15,
    career_planning: 0.10,
    confidence: 0.10,
  },
  early_career: {
    resume: 0.15,
    linkedin: 0.10,
    portfolio: 0.05,
    communication: 0.10,
    technical_skills: 0.15,
    interview_skills: 0.15,
    career_planning: 0.20,
    confidence: 0.10,
  },
  career_switcher: {
    resume: 0.15,
    linkedin: 0.10,
    portfolio: 0.15,
    communication: 0.10,
    technical_skills: 0.15,
    interview_skills: 0.10,
    career_planning: 0.20,
    confidence: 0.05,
  },
};

export const READINESS_DISCLAIMER =
  'This readiness score reflects rubric alignment against industry benchmarks and is not a hiring guarantee or probability.';

export interface DimensionAssessmentRecord {
  score: number; // 0 to 5 scale
  evidenceRef?: string;
  assessedAt?: string;
  assessorId?: string;
  assessorName?: string;
}

export interface ReadinessCalculationResult {
  overallScore: number; // 0 to 100 scale
  segment: CandidateSegment;
  rubricVersion: string;
  evidenceCoverage: number; // 0 to 100 percentage
  effectiveWeights: Record<DimensionKey, number>;
  dimensionScores: Partial<Record<DimensionKey, DimensionAssessmentRecord>>;
  assessedCount: number;
  unassessedKeys: DimensionKey[];
  highestGapDimension: DimensionKey;
  recommendedServiceCode: string;
  recommendationReason: string;
  disclaimer: string;
}

/**
 * Service recommendations mapped by gap dimension
 */
const DIMENSION_TO_SERVICE_MAP: Record<DimensionKey, { code: string; title: string }> = {
  resume: { code: 'S01', title: 'Resume Line-by-Line Teardown' },
  linkedin: { code: 'S03', title: 'LinkedIn Profile Optimization' },
  portfolio: { code: 'S04', title: 'Portfolio & GitHub Teardown' },
  communication: { code: 'S05', title: 'Behavioral Mock (STAR Method)' },
  technical_skills: { code: 'S06', title: 'System Design & DSA Technical Mock' },
  interview_skills: { code: 'S07', title: 'Hiring Manager Bar-Raiser Mock' },
  career_planning: { code: 'S09', title: 'Career Pivot & Domain Transition Plan' },
  confidence: { code: 'S05', title: 'Behavioral Mock (STAR Method)' },
};

/**
 * Deterministic Readiness Score Calculation Engine
 */
export function calculateReadinessScore(
  segment: CandidateSegment,
  scores: Partial<Record<DimensionKey, number | DimensionAssessmentRecord>>,
  options: { isPortfolioApplicable?: boolean; rubricVersion?: string; assessedAt?: string } = {}
): ReadinessCalculationResult {
  const isPortfolioApplicable = options.isPortfolioApplicable ?? true;
  const baseWeights = { ...SEGMENT_WEIGHTS[segment] };

  // Calculate effective weights with proportional redistribution if portfolio is not applicable
  const effectiveWeights: Record<DimensionKey, number> = { ...baseWeights };
  if (!isPortfolioApplicable) {
    const portfolioWeight = baseWeights.portfolio;
    effectiveWeights.portfolio = 0;
    const remainingWeightSum = 1 - portfolioWeight;
    for (const key of Object.keys(effectiveWeights) as DimensionKey[]) {
      if (key !== 'portfolio') {
        effectiveWeights[key] = Number((baseWeights[key] / remainingWeightSum).toFixed(4));
      }
    }
  }

  // Normalise assessed scores
  const parsedScores: Partial<Record<DimensionKey, DimensionAssessmentRecord>> = {};
  const assessedKeys: DimensionKey[] = [];
  const unassessedKeys: DimensionKey[] = [];

  for (const key of Object.keys(DIMENSIONS) as DimensionKey[]) {
    const raw = scores[key];
    if (raw !== undefined && raw !== null) {
      const val = typeof raw === 'number' ? raw : raw.score;
      // Clamp to 0-5 scale
      const clamped = Math.max(0, Math.min(5, val));
      parsedScores[key] = {
        score: clamped,
        evidenceRef: typeof raw === 'object' ? raw.evidenceRef : undefined,
        assessedAt: typeof raw === 'object' ? raw.assessedAt : options.assessedAt,
      };
      assessedKeys.push(key);
    } else {
      unassessedKeys.push(key);
    }
  }

  // Compute weighted readiness sum
  let weightedScoreSum = 0;
  let activeWeightSum = 0;

  for (const key of assessedKeys) {
    const weight = effectiveWeights[key];
    const scoreVal = parsedScores[key]!.score;
    weightedScoreSum += weight * (scoreVal / 5);
    activeWeightSum += weight;
  }

  // If partial evidence exists, scale relative to assessed dimensions
  // Missing scores are NEVER silently treated as zero (PRD §8.3)
  const normalizedOverall =
    activeWeightSum > 0 ? (weightedScoreSum / activeWeightSum) * 100 : 0;
  const overallScore = Math.round(normalizedOverall * 10) / 10;

  // Evidence coverage percentage
  const totalApplicableCount = isPortfolioApplicable ? 8 : 7;
  const evidenceCoverage = Math.round((assessedKeys.length / totalApplicableCount) * 100);

  // Determine highest weighted gap: gap = weight * (5 - score)
  let highestGapScore = -1;
  let highestGapDimension: DimensionKey = 'technical_skills';

  for (const key of Object.keys(effectiveWeights) as DimensionKey[]) {
    if (!isPortfolioApplicable && key === 'portfolio') continue;

    const currentScore = parsedScores[key]?.score ?? 0;
    const gap = effectiveWeights[key] * (5 - currentScore);

    if (gap > highestGapScore) {
      highestGapScore = gap;
      highestGapDimension = key;
    }
  }

  const rec = DIMENSION_TO_SERVICE_MAP[highestGapDimension];
  const dimensionMeta = DIMENSIONS[highestGapDimension];
  const currentGapScore = parsedScores[highestGapDimension]?.score ?? 'unassessed';

  const recommendationReason = `${dimensionMeta.label} is currently your highest-weighted opportunity gap (${currentGapScore}/5 rating with ${Math.round(
    effectiveWeights[highestGapDimension] * 100
  )}% weighting). Completing ${rec.title} (${rec.code}) is recommended to advance your benchmark.`;

  return {
    overallScore,
    segment,
    rubricVersion: options.rubricVersion || 'v1.0',
    evidenceCoverage,
    effectiveWeights,
    dimensionScores: parsedScores,
    assessedCount: assessedKeys.length,
    unassessedKeys,
    highestGapDimension,
    recommendedServiceCode: rec.code,
    recommendationReason,
    disclaimer: READINESS_DISCLAIMER,
  };
}
