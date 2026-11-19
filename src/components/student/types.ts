// DreamX Student Portal Types & Data Models (PRD V3.0)

export type CandidateSegment =
  | "Student"
  | "Fresh graduate"
  | "Early-career professional"
  | "Career switcher";

export type ReadinessDimensionName =
  | "Resume"
  | "LinkedIn"
  | "Portfolio"
  | "Communication"
  | "Technical Skills"
  | "Interview Skills"
  | "Career Planning"
  | "Confidence";

export interface ReadinessDimension {
  dimension: ReadinessDimensionName;
  score: number | null; // 1-5 scale, or null if unassessed
  notApplicable?: boolean;
  status: "Mentor Verified" | "Baseline Self-Report" | "Not Assessed" | "Not Applicable";
  assessorLabel: string;
  lastUpdated: string;
  evidenceSummary: string;
  suggestedAction: string;
  relatedServiceId: string;
}

export interface ReadinessHistoryEntry {
  id: string;
  date: string;
  score: number;
  assessedCount: number;
  applicableCount: number;
  triggerNote: string;
  rubricVersion: string;
}

export interface StudentProfileData {
  firstName: string;
  lastName: string;
  email: string;
  segment: CandidateSegment;
  targetRole: string;
  targetDomain: string;
  collegeOrCompany?: string;
  interviewTimeline: string;
  primaryChallenge: string;
  resumeFileName?: string | null;
  resumeUploadedAt?: string | null;
  linkedinUrl?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  portfolioNotApplicable: boolean;
  onboardingCompleted: boolean;
  notifications?: {
    inAppBookings: boolean;
    emailBookings: boolean;
    inAppReports: boolean;
    emailReports: boolean;
    inAppMembership: boolean;
    emailMembership: boolean;
  };
  notificationPreferences?: {
    email: boolean;
    whatsapp: boolean;
    sms: boolean;
  };
}

export interface BookingTimelineEntry {
  timestamp: string;
  label: string;
}

export interface StudentBooking {
  id: string;
  bookingRef: string;
  serviceId: string;
  mode: "Direct" | "Smart Match";
  mentorName: string;
  mentorSlug?: string;
  mentorVerificationLabel?: string;
  dateLabel: string;
  timeLabel: string;
  durationMinutes: number;
  status:
    | "Ready to Join"
    | "Needs Decision"
    | "Upcoming"
    | "Completed"
    | "Cancelled"
    | "Smart Match In Progress";
  smartMatchStage?: string;
  preferredWindows?: string[];
  fallbackAlternativeSlot?: {
    mentorName: string;
    mentorVerificationLabel: string;
    dateLabel: string;
    timeLabel: string;
  };
  listedPricePaise: number;
  appliedDiscountLabel: string;
  discountPaise: number;
  finalPaidPaise: number;
  paymentStatus:
    | "Payment Verified"
    | "Refund Initiated"
    | "Refund Completed"
    | "Dispute Under Review";
  hoursUntilSession?: number;
  joinPermittedByServer: boolean;
  meetingUrl?: string;
  reportStatus:
    | "Awaiting session"
    | "Report pending"
    | "Report pending (48h SLA)"
    | "Report delivered"
    | "Report delayed"
    | "Not applicable";
  reportId?: string;
  complaintSubmitted?: {
    submittedAt: string;
    reason: string;
    status: string;
  };
  timeline: BookingTimelineEntry[];
}

export interface StudentRubricScore {
  criterionId: string;
  label: string;
  rating: number; // 1-5
  observation: string;
}

export interface StudentDimensionObservation {
  dimension: ReadinessDimensionName;
  score: number;
  observation: string;
}

export interface StudentActionPlanItem {
  id: string;
  action: string;
  priority: "High" | "Medium" | "Low";
  timeframe: string;
}

export interface StudentSuggestedNextStep {
  recommendedServiceId: string;
  reason: string;
}

export interface StudentReportVersion {
  version: string;
  createdAt: string;
  authorName: string;
  changeNote: string;
}

export interface StudentReport {
  id: string;
  bookingId: string;
  bookingRef: string;
  serviceId: string;
  studentName: string;
  studentSegment: CandidateSegment;
  targetRole: string;
  sessionDate: string;
  status: "Report delivered" | "Report pending" | "Revision requested";
  slaRemainingLabel: string;
  assessmentPurpose: string;
  summary: string;
  rubricScores: StudentRubricScore[];
  dimensionObservations: StudentDimensionObservation[];
  strengths: string[];
  improvementAreas: string[];
  actionPlan: StudentActionPlanItem[];
  suggestedNextSteps: StudentSuggestedNextStep[];
  assessmentLimitations: string;
  versions: StudentReportVersion[];
}

export interface JourneyRequirement {
  id: string;
  label: string;
  met: boolean;
  evidenceNote: string;
}

export interface JourneyStage {
  id: string;
  order: number;
  stageNumber?: number;
  title: string;
  description: string;
  focusSummary?: string;
  status: "Completed" | "Current Stage" | "Upcoming";
  completedDate?: string;
  requirements: JourneyRequirement[];
  recommendedServiceIds: string[];
  recommendedServices?: string[];
  targetDimensions?: ReadinessDimensionName[];
}

export interface VoluntaryOutcome {
  id: string;
  category:
    | "Placement Offer"
    | "Interview Shortlist"
    | "Application Sent"
    | "Salary Increase"
    | "Resume Ready"
    | "Offer Received";
  title: string;
  recordedDate: string;
  verificationState: string;
}

export interface MembershipInvoice {
  id: string;
  date: string;
  description: string;
  amountPaise: number;
  status: "Verified";
}

export interface MembershipPlan {
  tier: "Free" | "Pro" | "Elite";
  monthlyPaise: number;
  annualUpfrontPaise: number;
  effectiveAnnualMonthlyPaise: number;
  discountPercent: number;
  tagline: string;
  confirmedBenefits: string[];
}

export interface MembershipData {
  tier: "Free" | "Pro" | "Elite";
  billingInterval: "monthly" | "annual";
  status: "Active" | "Cancellation Scheduled" | "Cancelled (Active Until Period End)";
  startedDate: string;
  renewalDate: string;
  discountPercent: number;
  invoices: MembershipInvoice[];
}

export interface MentorSlot {
  id: string;
  dateLabel: string;
  timeLabel: string;
  status: "Available" | "Unavailable" | "Temporarily held";
}

export interface MentorPreview {
  id: string;
  slug: string;
  displayName: string;
  headline: string;
  bio: string;
  experienceSummary: string;
  verificationLabel: string;
  yearsOfExperience: number;
  domains: string[];
  approvedServiceIds: string[];
  languages: string[];
  nextAvailableLabel: string;
  availableSlots: MentorSlot[];
}

export interface DiscoverFollowUpChoice {
  id: string;
  label: string;
  recommendedServiceIds: string[];
  ruleExplanation: string;
}

export interface DiscoverPath {
  id: string;
  label: string;
  description: string;
  followUpQuestion: string;
  followUpChoices: DiscoverFollowUpChoice[];
}

// PRD §8.2: Base Segment Weights
export const SEGMENT_WEIGHTS: Record<CandidateSegment, Record<ReadinessDimensionName, number>> = {
  Student: {
    Resume: 15,
    LinkedIn: 8,
    Portfolio: 12,
    Communication: 10,
    "Technical Skills": 20,
    "Interview Skills": 15,
    "Career Planning": 10,
    Confidence: 10,
  },
  "Fresh graduate": {
    Resume: 15,
    LinkedIn: 10,
    Portfolio: 10,
    Communication: 10,
    "Technical Skills": 20,
    "Interview Skills": 15,
    "Career Planning": 10,
    Confidence: 10,
  },
  "Early-career professional": {
    Resume: 15,
    LinkedIn: 10,
    Portfolio: 5,
    Communication: 10,
    "Technical Skills": 15,
    "Interview Skills": 15,
    "Career Planning": 20,
    Confidence: 10,
  },
  "Career switcher": {
    Resume: 15,
    LinkedIn: 10,
    Portfolio: 15,
    Communication: 10,
    "Technical Skills": 15,
    "Interview Skills": 10,
    "Career Planning": 20,
    Confidence: 5,
  },
};

// Deterministic Composite Readiness Score Algorithm
export function calculateReadinessScore(
  dimensions: ReadinessDimension[],
  segment: CandidateSegment,
  portfolioNotApplicable: boolean
) {
  const baseWeights = SEGMENT_WEIGHTS[segment] || SEGMENT_WEIGHTS["Early-career professional"];
  const effectiveWeights: Record<string, number> = { ...baseWeights };

  if (portfolioNotApplicable) {
    const nonPortfolioSum = 100 - baseWeights.Portfolio;
    effectiveWeights.Portfolio = 0;
    Object.keys(effectiveWeights).forEach((k) => {
      if (k !== "Portfolio") {
        effectiveWeights[k] = Number(((baseWeights[k as ReadinessDimensionName] / nonPortfolioSum) * 100).toFixed(2));
      }
    });
  }

  const applicable = dimensions.filter((d) =>
    d.dimension === "Portfolio" ? !portfolioNotApplicable : !d.notApplicable
  );
  const assessed = applicable.filter((d) => d.score !== null && d.score > 0);

  let overallScore: number | null = null;
  if (assessed.length >= 3) {
    const sum = applicable.reduce(
      (acc, d) => acc + (effectiveWeights[d.dimension] / 100) * ((d.score ?? 0) / 5),
      0
    );
    overallScore = Math.round(sum * 100);
  }

  const gaps = [...applicable]
    .filter((d) => d.score === null || d.score < 4)
    .sort((a, b) => {
      const penaltyA = ((5 - (a.score ?? 0)) / 5) * (effectiveWeights[a.dimension] || 0);
      const penaltyB = ((5 - (b.score ?? 0)) / 5) * (effectiveWeights[b.dimension] || 0);
      return penaltyB - penaltyA;
    });

  return {
    overallScore,
    assessedCount: assessed.length,
    applicableCount: applicable.length,
    effectiveWeights,
    highestPriorityGap: gaps[0] ?? null,
    adjustedForPortfolioNA: portfolioNotApplicable,
  };
}

export const MEMBERSHIP_TIERS: MembershipPlan[] = [
  {
    tier: "Free",
    monthlyPaise: 0,
    annualUpfrontPaise: 0,
    effectiveAnnualMonthlyPaise: 0,
    discountPercent: 0,
    tagline: "Pay per 1:1 career service as needed with full readiness tracking.",
    confirmedBenefits: [
      "Goal-first career service discovery & mentor profiles",
      "Eight-dimension Career Readiness baseline & evidence history",
      "Direct Booking & Smart Match access at standard listed prices",
      "Structured post-session reports within 48-hour target SLA",
    ],
  },
  {
    tier: "Pro",
    monthlyPaise: 19900,
    annualUpfrontPaise: 178800,
    effectiveAnnualMonthlyPaise: 14900,
    discountPercent: 5,
    tagline: "Consistent 5% discount across eligible 1:1 mentor career services.",
    confirmedBenefits: [
      "Confirmed 5% service discount on eligible 1:1 career bookings",
      "Full Career Readiness history & guided journey milestone tracking",
      "Transparent non-stacking best-discount guarantee at checkout",
      "Cancel scheduled renewal anytime before next billing date",
    ],
  },
  {
    tier: "Elite",
    monthlyPaise: 39900,
    annualUpfrontPaise: 418800,
    effectiveAnnualMonthlyPaise: 34900,
    discountPercent: 10,
    tagline: "Maximum 10% discount on 1:1 sessions for active job hunting loops.",
    confirmedBenefits: [
      "Confirmed 10% service discount on all eligible 1:1 career bookings",
      "Priority Smart Match Wave 1 dispatch escalation",
      "Comprehensive diagnostic report vault & PDF archiving",
      "Direct access to top calibrated Tier 1 & Tier 2 mentors",
    ],
  },
];

// Default Candidate Profile
export const DEFAULT_STUDENT_PROFILE: StudentProfileData = {
  firstName: "Candidate",
  lastName: "",
  email: "",
  segment: "Early-career professional",
  targetRole: "Software Engineer",
  targetDomain: "Software Engineering",
  interviewTimeline: "Planning interviews in 1-3 months",
  primaryChallenge: "Calibrating readiness and targeting top product ecosystems",
  resumeFileName: "",
  resumeUploadedAt: "",
  linkedinUrl: "",
  portfolioUrl: "",
  portfolioNotApplicable: false,
  onboardingCompleted: false,
  notifications: {
    inAppBookings: true,
    emailBookings: true,
    inAppReports: true,
    emailReports: true,
    inAppMembership: true,
    emailMembership: true,
  },
};
export const SEED_STUDENT_PROFILE = DEFAULT_STUDENT_PROFILE;

// 8 PRD Readiness Dimensions (Blank Unassessed Baseline)
export const BLANK_DIMENSIONS: ReadinessDimension[] = [
  {
    dimension: "Resume",
    score: null,
    status: "Not Assessed",
    assessorLabel: "Unassessed",
    lastUpdated: "Not assessed yet",
    evidenceSummary: "No assessment completed yet.",
    suggestedAction: "Complete an assessment or book an S01 Resume Review.",
    relatedServiceId: "S01",
  },
  {
    dimension: "LinkedIn",
    score: null,
    status: "Not Assessed",
    assessorLabel: "Unassessed",
    lastUpdated: "Not assessed yet",
    evidenceSummary: "No assessment completed yet.",
    suggestedAction: "Book an S03 LinkedIn Review or complete onboarding baseline.",
    relatedServiceId: "S03",
  },
  {
    dimension: "Portfolio",
    score: null,
    status: "Not Assessed",
    assessorLabel: "Unassessed",
    lastUpdated: "Not assessed yet",
    evidenceSummary: "No assessment completed yet.",
    suggestedAction: "Upload GitHub projects or mark N/A for non-design tracks.",
    relatedServiceId: "S04",
  },
  {
    dimension: "Communication",
    score: null,
    status: "Not Assessed",
    assessorLabel: "Unassessed",
    lastUpdated: "Not assessed yet",
    evidenceSummary: "No assessment completed yet.",
    suggestedAction: "Practice STAR framing in an S05 Behavioral Mock.",
    relatedServiceId: "S05",
  },
  {
    dimension: "Technical Skills",
    score: null,
    status: "Not Assessed",
    assessorLabel: "Unassessed",
    lastUpdated: "Not assessed yet",
    evidenceSummary: "No assessment completed yet.",
    suggestedAction: "Complete an S06 Technical Mock to record verified evidence.",
    relatedServiceId: "S06",
  },
  {
    dimension: "Interview Skills",
    score: null,
    status: "Not Assessed",
    assessorLabel: "Unassessed",
    lastUpdated: "Not assessed yet",
    evidenceSummary: "No assessment completed yet.",
    suggestedAction: "Attend a live mock interview simulation.",
    relatedServiceId: "S06",
  },
  {
    dimension: "Career Planning",
    score: null,
    status: "Not Assessed",
    assessorLabel: "Unassessed",
    lastUpdated: "Not assessed yet",
    evidenceSummary: "No assessment completed yet.",
    suggestedAction: "Book an S09 Career Pivot Strategy session.",
    relatedServiceId: "S09",
  },
  {
    dimension: "Confidence",
    score: null,
    status: "Not Assessed",
    assessorLabel: "Unassessed",
    lastUpdated: "Not assessed yet",
    evidenceSummary: "No assessment completed yet.",
    suggestedAction: "Build confidence with structured mentor debriefs.",
    relatedServiceId: "S05",
  },
];
export const SEED_DIMENSIONS: ReadinessDimension[] = BLANK_DIMENSIONS;

export const SEED_READINESS_HISTORY: ReadinessHistoryEntry[] = [];
export const SEED_STUDENT_BOOKINGS: StudentBooking[] = [];
export const SEED_STUDENT_REPORTS: StudentReport[] = [];

export const INITIAL_JOURNEY_STAGES: JourneyStage[] = [
  {
    id: "stg-1",
    order: 1,
    stageNumber: 1,
    title: "Stage 1 — Career Goal & Baseline Clarity",
    description:
      "Establish a realistic target role, record initial readiness baseline, and identify highest-weighted gaps.",
    focusSummary:
      "Establish a realistic target role, record initial readiness baseline, and identify highest-weighted gaps.",
    status: "Current Stage",
    requirements: [
      {
        id: "jr-1",
        label: "Complete career segment & baseline readiness intake",
        met: false,
        evidenceNote: "Pending baseline diagnostic assessment",
      },
      {
        id: "jr-2",
        label: "Reach ≥ 3/5 evidence in Career Planning",
        met: false,
        evidenceNote: "Awaiting mentor consultation or diagnostic session",
      },
    ],
    recommendedServiceIds: ["S07", "S09"],
    recommendedServices: ["S07", "S09"],
    targetDimensions: ["Career Planning"],
  },
  {
    id: "stg-2",
    order: 2,
    stageNumber: 2,
    title: "Stage 2 — Profile & Application Signal",
    description:
      "Ensure resume and discoverability assets communicate clear, evidence-backed impact for your target role.",
    focusSummary:
      "Ensure resume and discoverability assets communicate clear, evidence-backed impact for your target role.",
    status: "Upcoming",
    requirements: [
      {
        id: "jr-3",
        label: "Reach ≥ 4/5 mentor-verified Resume readiness",
        met: false,
        evidenceNote: "Unlocks after Stage 1 baseline assessment",
      },
      {
        id: "jr-4",
        label: "Upload updated single-column PDF artifact & align LinkedIn baseline",
        met: false,
        evidenceNote: "Unlocks after resume review",
      },
    ],
    recommendedServiceIds: ["S01", "S02", "S03"],
    recommendedServices: ["S01", "S02", "S03"],
    targetDimensions: ["Resume", "LinkedIn"],
  },
  {
    id: "stg-3",
    order: 3,
    stageNumber: 3,
    title: "Stage 3 — Technical & Interview Execution",
    description:
      "Close unassessed Interview Skills and Technical Skills gaps through realistic, rubric-scored mock evaluations.",
    focusSummary:
      "Close unassessed Interview Skills and Technical Skills gaps through realistic, rubric-scored mock evaluations.",
    status: "Upcoming",
    requirements: [
      {
        id: "jr-5",
        label: "Record mentor-verified Technical Skills & Interview Skills evidence",
        met: false,
        evidenceNote: "Unlocks after mock technical interview",
      },
      {
        id: "jr-6",
        label: "Validate behavioral ownership & communication under probing (S05)",
        met: false,
        evidenceNote: "Unlocks after behavioral mock",
      },
      {
        id: "jr-7",
        label: "Complete post-mock remediation action items before final loops",
        met: false,
        evidenceNote: "Unlocks after delivered rubric reports",
      },
    ],
    recommendedServiceIds: ["S06", "S05", "S10"],
    recommendedServices: ["S06", "S10"],
    targetDimensions: ["Technical Skills", "Interview Skills"],
  },
  {
    id: "stg-4",
    order: 4,
    stageNumber: 4,
    title: "Stage 4 — Final Loops & Negotiation Execution",
    description:
      "Prepare offer evaluation, compensation benchmarking, and voluntary milestone tracking.",
    focusSummary:
      "Prepare offer evaluation, compensation benchmarking, and voluntary milestone tracking.",
    status: "Upcoming",
    requirements: [
      {
        id: "jr-8",
        label: "Complete Offer & Compensation Strategy calibration (S08)",
        met: false,
        evidenceNote: "Awaiting final interview shortlist",
      },
    ],
    recommendedServiceIds: ["S08", "S02"],
    recommendedServices: ["S08", "S02"],
    targetDimensions: ["Career Planning", "Confidence"],
  },
];
export const SEED_JOURNEY_STAGES: JourneyStage[] = INITIAL_JOURNEY_STAGES;

export const SEED_VOLUNTARY_OUTCOMES: VoluntaryOutcome[] = [];

export const SEED_MEMBERSHIP: MembershipData = {
  tier: "Free",
  billingInterval: "monthly",
  status: "Active",
  startedDate: "Active",
  renewalDate: "N/A",
  discountPercent: 0,
  invoices: [],
};

export const SEED_AVAILABLE_MENTORS: MentorPreview[] = [];
export const SEED_DISCOVER_PATHS: DiscoverPath[] = [
  {
    id: "technical-interviews",
    label: "Prepare for technical interviews",
    description: "Practice architecture, debugging, domain depth, or live DSA problem solving.",
    followUpQuestion: "Which technical round format is closest on your calendar?",
    followUpChoices: [
      {
        id: "sys-backend",
        label: "System design, APIs, databases, or domain technical round",
        recommendedServiceIds: ["S06", "S10"],
        ruleExplanation: "Mapped by deterministic rule: Technical Mock Interview (S06) evaluates scoping, trade-offs, and technical communication; Coding Interview Prep (S10) addresses live algorithmic execution.",
      },
      {
        id: "live-dsa",
        label: "Timed DSA / live coding interview with edge-case dry running",
        recommendedServiceIds: ["S10"],
        ruleExplanation: "Mapped by deterministic rule: Coding Interview Preparation (S10) conducts timed algorithmic problem-solving with complexity verbalization under rubric-v3.0.",
      },
    ],
  },
  {
    id: "resume-ats",
    label: "Sharpen resume or ATS alignment",
    description: "Structure high-impact engineering bullets and fix ATS parser truncation.",
    followUpQuestion: "What is your primary resume goal right now?",
    followUpChoices: [
      {
        id: "first-draft-review",
        label: "Comprehensive review of bullet impact, hierarchy, and projects",
        recommendedServiceIds: ["S01"],
        ruleExplanation: "Mapped by deterministic rule: Resume Review (S01) delivers line-by-line critique and 1-page layout optimization.",
      },
      {
        id: "ats-jd-match",
        label: "ATS alignment & keyword mapping for specific target job descriptions",
        recommendedServiceIds: ["S02"],
        ruleExplanation: "Mapped by deterministic rule: ATS Optimization (S02) tests parser fidelity and taxonomy matching against target JDs.",
      },
    ],
  },
  {
    id: "behavioral-hr",
    label: "Master behavioral & leadership loops",
    description: "Refine STAR ownership stories, conflict resolution, and leadership principles.",
    followUpQuestion: "Which seniority loop are you preparing for?",
    followUpChoices: [
      {
        id: "sde2-lead-behavioral",
        label: "Senior engineering or tech lead hiring-manager round",
        recommendedServiceIds: ["S05"],
        ruleExplanation: "Mapped by deterministic rule: Behavioral Mock Interview (S05) probes ownership, trade-off communication, and failure debriefs.",
      },
    ],
  },
  {
    id: "career-roadmap",
    label: "Create a career roadmap",
    description: "Sequence a 60–90 day preparation plan grounded in your readiness gaps.",
    followUpQuestion: "What horizon are you planning across?",
    followUpChoices: [
      {
        id: "ninety-day-plan",
        label: "Structured 60–90 day placement or role-transition plan",
        recommendedServiceIds: ["S09", "S01"],
        ruleExplanation: "Mapped by deterministic rule: Career Roadmap Session (S09) translates weighted readiness gaps into verifiable 30/60/90-day milestones.",
      },
    ],
  },
  {
    id: "salary-negotiation",
    label: "Improve salary negotiation",
    description: "Break down fixed, variable, and ESOP components and rehearse counter-offers.",
    followUpQuestion: "Where are you in the offer cycle?",
    followUpChoices: [
      {
        id: "active-offer",
        label: "Final HR compensation discussion or written offer in hand",
        recommendedServiceIds: ["S08"],
        ruleExplanation: "Mapped by deterministic rule: Salary Negotiation (S08) builds an India tech comp breakdown and collaborative conversation script.",
      },
    ],
  },
];


// ==========================================
// Service Catalogue & Pricing System (PRD V3.0)
// ==========================================

export interface ServiceRubricCriterion {
  id: string;
  label: string;
  guidance: string;
}

export interface ServiceDefinition {
  id: string;
  slug: string;
  name: string;
  category: "Profile & Assets" | "Interviews" | "Career Direction";
  durationMinutes: number;
  listPricePaise: number;
  shortOutcome: string;
  intendedFor: string;
  scopeIncluded: string[];
  exclusions: string[];
  requiredStudentInputs: string[];
  deliverableName: string;
  reportSlaHours: number;
  bookingModes: ("Direct" | "Smart Match")[];
  mappedDimensions: ReadinessDimensionName[];
  rubricCriteria: ServiceRubricCriterion[];
}

export const SERVICES_CATALOGUE: ServiceDefinition[] = [
  {
    "id": "S01",
    "slug": "resume-review",
    "name": "Resume Review",
    "category": "Profile & Assets",
    "durationMinutes": 45,
    "listPricePaise": 59900,
    "shortOutcome": "Line-by-line human critique of structure, impact framing, and role alignment.",
    "intendedFor": "Students and early-career seekers preparing applications for SWE, Data/AI, or PM roles.",
    "scopeIncluded": [
      "Section hierarchy, readability, and 1-page density review",
      "Evidence-backed bullet rewrite recommendations (problem, action, measurable result)",
      "Alignment check against 1–2 target role descriptions"
    ],
    "exclusions": [
      "Does not guarantee interview shortlisting or hiring outcomes",
      "Mentor provides structured rewrite guidance rather than fabricating experience"
    ],
    "requiredStudentInputs": [
      "Current Resume PDF (private upload)",
      "Target role / domain"
    ],
    "deliverableName": "Structured Resume Diagnostic & Bullet Rewrite Action Plan",
    "reportSlaHours": 48,
    "bookingModes": [
      "Direct",
      "Smart Match"
    ],
    "mappedDimensions": [
      "Resume",
      "Communication"
    ],
    "rubricCriteria": [
      {
        "id": "r1",
        "label": "Role & Domain Alignment",
        "guidance": "Relevance of projects/experience to target role."
      },
      {
        "id": "r2",
        "label": "Impact & Quantification",
        "guidance": "Clarity of scope, technical decisions, and outcomes."
      },
      {
        "id": "r3",
        "label": "Structure & Visual Clarity",
        "guidance": "Scannability, hierarchy, and zero clutter."
      }
    ]
  },
  {
    "id": "S02",
    "slug": "ats-resume-optimization",
    "name": "ATS Resume Optimization",
    "category": "Profile & Assets",
    "durationMinutes": 45,
    "listPricePaise": 79900,
    "shortOutcome": "Optimize parsing structure, skill taxonomy, and JD keyword mapping with a verified mentor.",
    "intendedFor": "Candidates applying through structured enterprise portals with low callback rates.",
    "scopeIncluded": [
      "Parser-safe layout and heading audit",
      "Domain keyword gap mapping across 2 sample job descriptions",
      "Honest competency framing without keyword stuffing"
    ],
    "exclusions": [
      "No guaranteed ATS pass score or automated recruiter shortlist promise"
    ],
    "requiredStudentInputs": [
      "Current Resume PDF",
      "Two target job descriptions"
    ],
    "deliverableName": "ATS Parsing & Keyword Gap Action Report",
    "reportSlaHours": 48,
    "bookingModes": [
      "Direct",
      "Smart Match"
    ],
    "mappedDimensions": [
      "Resume",
      "Career Planning"
    ],
    "rubricCriteria": [
      {
        "id": "a1",
        "label": "Parsing & Semantic Structure",
        "guidance": "Standard section headers, date formats, clean layout."
      },
      {
        "id": "a2",
        "label": "Taxonomy & Skill Coverage",
        "guidance": "Authentic alignment with target JD terminology."
      },
      {
        "id": "a3",
        "label": "Evidence Credibility",
        "guidance": "Skills backed by concrete project/work bullets."
      }
    ]
  },
  {
    "id": "S03",
    "slug": "linkedin-profile-review",
    "name": "LinkedIn Profile Review",
    "category": "Profile & Assets",
    "durationMinutes": 30,
    "listPricePaise": 49900,
    "shortOutcome": "Strengthen headline, About narrative, featured proof, and recruiter discoverability.",
    "intendedFor": "Candidates building inbound credibility and referral readiness.",
    "scopeIncluded": [
      "Headline & About positioning",
      "Experience & Featured section audit",
      "Outreach readiness tips"
    ],
    "exclusions": [
      "Does not include managing the student’s social account or guaranteed recruiter messages"
    ],
    "requiredStudentInputs": [
      "LinkedIn profile URL",
      "Target role"
    ],
    "deliverableName": "LinkedIn Positioning & Discoverability Checklist",
    "reportSlaHours": 48,
    "bookingModes": [
      "Direct",
      "Smart Match"
    ],
    "mappedDimensions": [
      "LinkedIn",
      "Communication"
    ],
    "rubricCriteria": [
      {
        "id": "l1",
        "label": "Headline & Value Proposition",
        "guidance": "Immediate clarity on target domain and strengths."
      },
      {
        "id": "l2",
        "label": "Experience & Proof Artifacts",
        "guidance": "Consistency with resume and featured work."
      }
    ]
  },
  {
    "id": "S04",
    "slug": "portfolio-review",
    "name": "Portfolio Review",
    "category": "Profile & Assets",
    "durationMinutes": 45,
    "listPricePaise": 59900,
    "shortOutcome": "Evaluate GitHub repositories, case studies, or live builds for engineering/product depth.",
    "intendedFor": "Candidates showcasing engineering projects, data notebooks, or PM case studies.",
    "scopeIncluded": [
      "2–3 flagship project deep dives",
      "README / architecture / case-study narrative critique"
    ],
    "exclusions": [
      "Does not write project code on behalf of the student"
    ],
    "requiredStudentInputs": [
      "Portfolio / GitHub URLs",
      "Target domain"
    ],
    "deliverableName": "Project Depth & Case-Study Evaluation Report",
    "reportSlaHours": 48,
    "bookingModes": [
      "Direct",
      "Smart Match"
    ],
    "mappedDimensions": [
      "Portfolio",
      "Technical Skills"
    ],
    "rubricCriteria": [
      {
        "id": "p1",
        "label": "Problem Selection & Originality",
        "guidance": "Beyond tutorial clones; clear real-world problem."
      },
      {
        "id": "p2",
        "label": "Execution & Documentation",
        "guidance": "Code hygiene, trade-offs, README clarity, live demo."
      }
    ]
  },
  {
    "id": "S05",
    "slug": "behavioral-mock-interview",
    "name": "Behavioral Mock Interview",
    "category": "Interviews",
    "durationMinutes": 60,
    "listPricePaise": 79900,
    "shortOutcome": "Realistic behavioral interview simulation with structured story and communication feedback.",
    "intendedFor": "Candidates preparing for hiring-manager, ownership, and collaboration rounds.",
    "scopeIncluded": [
      "35–40 min live behavioral interview",
      "15–20 min targeted debrief",
      "Story bank restructuring"
    ],
    "exclusions": [
      "No guarantee of passing a specific employer’s interview loop"
    ],
    "requiredStudentInputs": [
      "Resume PDF",
      "Target role level"
    ],
    "deliverableName": "Behavioral Competency & STAR Story Evaluation Report",
    "reportSlaHours": 48,
    "bookingModes": [
      "Direct",
      "Smart Match"
    ],
    "mappedDimensions": [
      "Interview Skills",
      "Communication",
      "Confidence"
    ],
    "rubricCriteria": [
      {
        "id": "b1",
        "label": "Structured Storytelling (Context → Action → Outcome)",
        "guidance": "Concise setup and clear personal ownership."
      },
      {
        "id": "b2",
        "label": "Reflection & Conflict Handling",
        "guidance": "Self-awareness, trade-offs, and learning depth."
      },
      {
        "id": "b3",
        "label": "Executive Presence & Pacing",
        "guidance": "Clarity under follow-up probing."
      }
    ]
  },
  {
    "id": "S06",
    "slug": "technical-mock-interview",
    "name": "Technical Mock Interview",
    "category": "Interviews",
    "durationMinutes": 60,
    "listPricePaise": 99900,
    "shortOutcome": "Domain-specific technical interview simulation covering architecture, debugging, or core concepts.",
    "intendedFor": "SWE, Data Science/AI, and PM candidates with upcoming technical loops.",
    "scopeIncluded": [
      "40–45 min realistic technical problem/system walkthrough",
      "15 min rubric-anchored diagnostic debrief",
      "Prioritized study and practice action plan"
    ],
    "exclusions": [
      "Does not leak proprietary employer question banks or guarantee hiring outcomes"
    ],
    "requiredStudentInputs": [
      "Resume PDF",
      "Target stack / domain focus",
      "Upcoming timeline"
    ],
    "deliverableName": "Technical Interview Rubric & Gap Remediation Report",
    "reportSlaHours": 48,
    "bookingModes": [
      "Direct",
      "Smart Match"
    ],
    "mappedDimensions": [
      "Technical Skills",
      "Interview Skills",
      "Communication",
      "Confidence"
    ],
    "rubricCriteria": [
      {
        "id": "t1",
        "label": "Requirement Clarification & Scoping",
        "guidance": "Identifies constraints, edge cases, and assumptions early."
      },
      {
        "id": "t2",
        "label": "Core Technical Depth & Trade-offs",
        "guidance": "Soundness of design, data structures, or modeling choices."
      },
      {
        "id": "t3",
        "label": "Technical Communication",
        "guidance": "Thinks aloud clearly and responds constructively to hints."
      }
    ]
  },
  {
    "id": "S07",
    "slug": "career-consultation",
    "name": "Career Consultation",
    "category": "Career Direction",
    "durationMinutes": 30,
    "listPricePaise": 49900,
    "shortOutcome": "Focused 1:1 clarity session on role targeting, market positioning, or immediate blockers.",
    "intendedFor": "Students and switchers deciding between tracks or diagnosing stalled job searches.",
    "scopeIncluded": [
      "Focused diagnosis of 1–2 career questions",
      "Concrete 2-week priority actions"
    ],
    "exclusions": [
      "Not a multi-month coaching retainer or placement guarantee"
    ],
    "requiredStudentInputs": [
      "Primary question / blocker summary"
    ],
    "deliverableName": "Decision Summary & Immediate Next-Step Brief",
    "reportSlaHours": 48,
    "bookingModes": [
      "Direct",
      "Smart Match"
    ],
    "mappedDimensions": [
      "Career Planning",
      "Confidence"
    ],
    "rubricCriteria": [
      {
        "id": "c1",
        "label": "Goal Realism & Market Alignment",
        "guidance": "Clarity on target roles vs current skill baseline."
      },
      {
        "id": "c2",
        "label": "Immediate Execution Focus",
        "guidance": "Eliminating low-leverage activities."
      }
    ]
  },
  {
    "id": "S08",
    "slug": "salary-negotiation",
    "name": "Salary Negotiation",
    "category": "Career Direction",
    "durationMinutes": 30,
    "listPricePaise": 69900,
    "shortOutcome": "Structure offer evaluation, compensation components, and professional negotiation scripts.",
    "intendedFor": "Candidates with active interviews or written offers in India tech markets.",
    "scopeIncluded": [
      "Total comp breakdown (fixed, variable, ESOPs)",
      "Counter-offer framing & call rehearsal"
    ],
    "exclusions": [
      "Not legal/tax advice; does not guarantee compensation increases"
    ],
    "requiredStudentInputs": [
      "Offer context / role band (redacted if confidential)"
    ],
    "deliverableName": "Offer Evaluation & Negotiation Conversation Playbook",
    "reportSlaHours": 48,
    "bookingModes": [
      "Direct"
    ],
    "mappedDimensions": [
      "Communication",
      "Confidence"
    ],
    "rubricCriteria": [
      {
        "id": "n1",
        "label": "Leverage & Comp Understanding",
        "guidance": "Grasp of fixed/variable/equity components."
      },
      {
        "id": "n2",
        "label": "Communication Poise",
        "guidance": "Collaborative, non-adversarial framing."
      }
    ]
  },
  {
    "id": "S09",
    "slug": "career-roadmap-session",
    "name": "Career Roadmap Session",
    "category": "Career Direction",
    "durationMinutes": 60,
    "listPricePaise": 79900,
    "shortOutcome": "Build a milestone-based 60–90 day preparation plan tailored to readiness gaps.",
    "intendedFor": "Placement seekers, early-career engineers, and career switchers needing structured sequencing.",
    "scopeIncluded": [
      "Gap prioritization across readiness dimensions",
      "Sequenced 30/60/90-day milestones"
    ],
    "exclusions": [
      "Does not promise fixed placement timelines"
    ],
    "requiredStudentInputs": [
      "Current readiness summary",
      "Weekly study hours available"
    ],
    "deliverableName": "90-Day Sequenced Career Milestone Plan",
    "reportSlaHours": 48,
    "bookingModes": [
      "Direct",
      "Smart Match"
    ],
    "mappedDimensions": [
      "Career Planning",
      "Technical Skills"
    ],
    "rubricCriteria": [
      {
        "id": "rm1",
        "label": "Gap Prioritization",
        "guidance": "Focuses on highest-weight unaddressed dimensions."
      },
      {
        "id": "rm2",
        "label": "Milestone Feasibility",
        "guidance": "Realistic weekly commitment and verifiable outputs."
      }
    ]
  },
  {
    "id": "S10",
    "slug": "coding-interview-preparation",
    "name": "Coding Interview Preparation",
    "category": "Interviews",
    "durationMinutes": 60,
    "listPricePaise": 99900,
    "shortOutcome": "Live algorithmic problem-solving, complexity analysis, and clean code implementation session.",
    "intendedFor": "Candidates preparing for DSA / coding rounds in product companies.",
    "scopeIncluded": [
      "Live coding problem(s) in candidate’s preferred language",
      "Time/space complexity & dry-run critique",
      "Pattern gap diagnosis & practice set recommendation"
    ],
    "exclusions": [
      "No guaranteed company shortlist or memorized leak sheets"
    ],
    "requiredStudentInputs": [
      "Preferred programming language",
      "Target company tier / timeline"
    ],
    "deliverableName": "Coding Execution, Complexity & Pattern Diagnostic Report",
    "reportSlaHours": 48,
    "bookingModes": [
      "Direct",
      "Smart Match"
    ],
    "mappedDimensions": [
      "Technical Skills",
      "Interview Skills",
      "Confidence"
    ],
    "rubricCriteria": [
      {
        "id": "cp1",
        "label": "Problem Decomposition & Pattern Recognition",
        "guidance": "Brute-force to optimal progression."
      },
      {
        "id": "cp2",
        "label": "Code Correctness & Edge-Case Dry Run",
        "guidance": "Clean syntax, boundary handling, bug testing."
      },
      {
        "id": "cp3",
        "label": "Complexity Analysis & Verbalization",
        "guidance": "Accurate Big-O reasoning explained clearly."
      }
    ]
  }
];

export function getServiceById(id: string): ServiceDefinition {
  return SERVICES_CATALOGUE.find((s) => s.id === id) ?? SERVICES_CATALOGUE[0];
}

export function formatPaise(paise: number): string {
  const sign = paise < 0 ? "-" : "";
  const rupees = Math.abs(paise) / 100;
  const hasDecimals = Math.abs(paise) % 100 !== 0;
  return `${sign}${new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(rupees)}`;
}

export interface BundlePricingResult {
  subtotalPaise: number;
  appliedPercent: number;
  appliedLabel: string;
  discountPaise: number;
  payablePaise: number;
  nonStackingExplanation: string;
}

export function calculateBundlePricing(
  subtotalPaise: number,
  membershipTier: string,
  isThreeServiceBundle: boolean
): BundlePricingResult {
  const tierConfig = MEMBERSHIP_TIERS.find((t) => t.tier === membershipTier) ?? MEMBERSHIP_TIERS[0];
  const membershipDiscount = tierConfig.discountPercent;
  const bundleDiscount = isThreeServiceBundle ? 5 : 0;
  let appliedPercent = 0;
  let appliedLabel = "None (0%)";
  let nonStackingExplanation = "Standard listed price applied.";

  if (membershipDiscount === 0 && bundleDiscount === 0) {
    appliedPercent = 0;
  } else if (membershipDiscount >= bundleDiscount && membershipDiscount > 0) {
    appliedPercent = membershipDiscount;
    appliedLabel = `${membershipTier} Membership (${membershipDiscount}%)`;
    nonStackingExplanation = isThreeServiceBundle
      ? `${membershipTier} Membership (${membershipDiscount}%) applied instead of 5% Bundle discount — discounts do not stack; single better rate selected.`
      : `${membershipTier} Membership ${membershipDiscount}% service discount applied (funded by DreamX).`;
  } else {
    appliedPercent = bundleDiscount;
    appliedLabel = "Custom 3-Service Bundle (5%)";
    nonStackingExplanation = membershipDiscount > 0
      ? "Custom 3-Service Bundle (5%) applied — membership and bundle discounts do not stack."
      : "Custom 3-Service Bundle 5% discount applied across 3 eligible services.";
  }

  const discountPaise = Math.round((subtotalPaise * appliedPercent) / 100);
  const payablePaise = subtotalPaise - discountPaise;

  return {
    subtotalPaise,
    appliedPercent,
    appliedLabel,
    discountPaise,
    payablePaise,
    nonStackingExplanation,
  };
}

export const RUBRIC_SCALE: Record<number, { label: string; description: string }> = {
  0: {
    label: "0 — No evidence / not assessed",
    description: "Dimension has not yet been assessed; never treated as confirmed zero competence.",
  },
  1: {
    label: "1 — Major improvement required",
    description: "Foundational gaps block progress toward the selected target role.",
  },
  2: {
    label: "2 — Below expected level",
    description: "Partial signals exist, but clarity, structure, or depth does not meet the rubric standard.",
  },
  3: {
    label: "3 — At expected level",
    description: "Meets market standard for the selected candidate segment and target role.",
  },
  4: {
    label: "4 — Strong signal",
    description: "Clear evidence of strong execution and autonomous problem solving.",
  },
  5: {
    label: "5 — Excellent & evidence-supported",
    description: "Consistently high signal backed by verified artifacts or demonstrated execution.",
  },
};

export interface StudentNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  targetRoute: "bookings" | "reports" | "services" | "readiness";
  targetRecordId?: string;
}

export const SEED_NOTIFICATIONS: StudentNotification[] = [];
