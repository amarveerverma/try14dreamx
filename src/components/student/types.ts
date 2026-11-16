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

// Seed Candidate Profile (Priya Nair)
export const SEED_STUDENT_PROFILE: StudentProfileData = {
  firstName: "Priya",
  lastName: "Nair",
  email: "priya.nair.dev@sample.dreamx.in",
  segment: "Early-career professional",
  targetRole: "Backend Engineer (SDE-2)",
  targetDomain: "Software Engineering",
  interviewTimeline: "Active interview loops within 2–4 weeks",
  primaryChallenge: "System design trade-off depth and live behavioral ownership probing",
  resumeFileName: "Priya_Nair_Backend_Resume_Oct2026.pdf",
  resumeUploadedAt: "29 Oct 2026 (Private Storage · 12-month retention)",
  linkedinUrl: "https://linkedin.com/in/priya-nair-sample-dev",
  portfolioUrl: "",
  portfolioNotApplicable: true,
  onboardingCompleted: true,
  notifications: {
    inAppBookings: true,
    emailBookings: true,
    inAppReports: true,
    emailReports: true,
    inAppMembership: true,
    emailMembership: true,
  },
};

// Seed 8 Dimensions
export const SEED_DIMENSIONS: ReadinessDimension[] = [
  {
    dimension: "Resume",
    score: 4,
    status: "Mentor Verified",
    assessorLabel: "Arjun Mehta · S01 Report v1.0",
    lastUpdated: "29 Oct 2026",
    evidenceSummary: "Quantified fintech payment webhook throughput, Redis rate-limiting impact, and single-column scannability.",
    suggestedAction: "Tailor top 3 summary keywords per target SDE-2 JD before submitting.",
    relatedServiceId: "S02",
  },
  {
    dimension: "LinkedIn",
    score: 3,
    status: "Baseline Self-Report",
    assessorLabel: "Onboarding Baseline (rubric-v3.0)",
    lastUpdated: "25 Oct 2026",
    evidenceSummary: "Role dates match resume; Featured proof and About positioning not yet mentor-reviewed.",
    suggestedAction: "Add architecture write-up to Featured section or book LinkedIn Profile Review.",
    relatedServiceId: "S03",
  },
  {
    dimension: "Portfolio",
    score: null,
    notApplicable: true,
    status: "Not Applicable",
    assessorLabel: "Segment Rule (PRD 8.3)",
    lastUpdated: "25 Oct 2026",
    evidenceSummary: "Marked N/A for enterprise backend track; 5% segment weight is redistributed proportionally across the other 7 dimensions.",
    suggestedAction: "Toggle applicable in Readiness or Settings if showcasing public GitHub builds.",
    relatedServiceId: "S04",
  },
  {
    dimension: "Communication",
    score: 3,
    status: "Mentor Verified",
    assessorLabel: "Arjun Mehta · S01 Session",
    lastUpdated: "29 Oct 2026",
    evidenceSummary: "Clear written structure and concise answers on past project ownership; live interview pressure untested.",
    suggestedAction: "Practice 2-minute STAR framing under follow-up probing.",
    relatedServiceId: "S05",
  },
  {
    dimension: "Technical Skills",
    score: 3,
    status: "Baseline Self-Report",
    assessorLabel: "Onboarding Baseline (rubric-v3.0)",
    lastUpdated: "25 Oct 2026",
    evidenceSummary: "2.8 yrs production Node.js/PostgreSQL experience; distributed locking & API scale not yet live-assessed.",
    suggestedAction: "Complete today’s S06 Technical Mock Interview to record verified technical evidence.",
    relatedServiceId: "S06",
  },
  {
    dimension: "Interview Skills",
    score: null,
    status: "Not Assessed",
    assessorLabel: "No live mock assessment recorded yet",
    lastUpdated: "Not assessed",
    evidenceSummary: "Unassessed — never treated as confirmed zero competence, but represents your largest unverified readiness gap (15% base weight).",
    suggestedAction: "Attend upcoming S06 Technical Mock Interview and schedule S05 Behavioral Mock Interview.",
    relatedServiceId: "S06",
  },
  {
    dimension: "Career Planning",
    score: 4,
    status: "Mentor Verified",
    assessorLabel: "Kavya Subramanian · S07 Report v1.0",
    lastUpdated: "27 Oct 2026",
    evidenceSummary: "Target role band narrowed to product-company Backend SDE-2 in Bengaluru/Remote with realistic 6-week sequence.",
    suggestedAction: "Execute weekly interview prep blocks before expanding application volume.",
    relatedServiceId: "S09",
  },
  {
    dimension: "Confidence",
    score: 3,
    status: "Baseline Self-Report",
    assessorLabel: "Onboarding Baseline (rubric-v3.0)",
    lastUpdated: "25 Oct 2026",
    evidenceSummary: "Separate self-efficacy indicator (never used as proxy for technical competence per PRD 8.4).",
    suggestedAction: "Build evidence-backed confidence via timed mock debriefs.",
    relatedServiceId: "S05",
  },
];

export const SEED_READINESS_HISTORY: ReadinessHistoryEntry[] = [
  {
    id: "rh-1",
    date: "25 Oct 2026",
    score: 49,
    assessedCount: 5,
    applicableCount: 7,
    triggerNote: "Initial Onboarding Baseline (Portfolio marked N/A)",
    rubricVersion: "rubric-v3.0",
  },
  {
    id: "rh-2",
    date: "27 Oct 2026",
    score: 54,
    assessedCount: 6,
    applicableCount: 7,
    triggerNote: "Updated Career Planning (2 → 4) after S07 Career Consultation Report",
    rubricVersion: "rubric-v3.0",
  },
  {
    id: "rh-3",
    date: "29 Oct 2026",
    score: 60,
    assessedCount: 6,
    applicableCount: 7,
    triggerNote: "Updated Resume (2 → 4) & Communication (3) after S01 Resume Review Report",
    rubricVersion: "rubric-v3.0",
  },
];

export const SEED_STUDENT_BOOKINGS: StudentBooking[] = [
  {
    id: "SBK-101",
    bookingRef: "DX-BK-2026-1094",
    serviceId: "S06",
    mode: "Direct",
    mentorName: "Arjun Mehta",
    mentorSlug: "arjun-mehta-swe",
    mentorVerificationLabel: "Identity & Experience Verified by DreamX",
    dateLabel: "Today, 06 Nov 2026",
    timeLabel: "20:00 – 21:00 IST",
    durationMinutes: 60,
    status: "Ready to Join",
    listedPricePaise: 99900,
    appliedDiscountLabel: "Pro Membership (5%)",
    discountPaise: 4995,
    finalPaidPaise: 94905,
    paymentStatus: "Payment Verified",
    hoursUntilSession: 0.2,
    joinPermittedByServer: true,
    meetingUrl: "https://meet.dreamx.in/dx-bk-1094-vault",
    reportStatus: "Awaiting session",
    timeline: [
      { timestamp: "04 Nov 2026, 18:12 IST", label: "Slot locked atomically during checkout" },
      { timestamp: "04 Nov 2026, 18:14 IST", label: "Payment verified by server webhook (₹949.05)" },
      { timestamp: "06 Nov 2026, 19:55 IST", label: "Server authorized session room entry" },
    ],
  },
  {
    id: "SBK-102",
    bookingRef: "DX-SM-2026-8812",
    serviceId: "S05",
    mode: "Smart Match",
    mentorName: "No mentor claimed within 2 hours — Your choice required",
    dateLabel: "Preferred Fri, 07 Nov 2026",
    timeLabel: "21:30 – 22:30 IST (Unclaimed)",
    durationMinutes: 60,
    status: "Needs Decision",
    smartMatchStage: "Awaiting student decision (2h timeout)",
    preferredWindows: ["Fri, 07 Nov 2026 · 21:30 – 22:30 IST"],
    fallbackAlternativeSlot: {
      mentorName: "Kavya Subramanian",
      mentorVerificationLabel: "Identity & Experience Verified by DreamX",
      dateLabel: "Sat, 08 Nov 2026",
      timeLabel: "11:00 – 12:00 IST",
    },
    listedPricePaise: 79900,
    appliedDiscountLabel: "Pro Membership (5%)",
    discountPaise: 3995,
    finalPaidPaise: 75905,
    paymentStatus: "Payment Verified",
    hoursUntilSession: 25,
    joinPermittedByServer: false,
    reportStatus: "Awaiting session",
    timeline: [
      { timestamp: "06 Nov 2026, 17:10 IST", label: "Smart Match Wave 1 dispatched to S05 mentors" },
      { timestamp: "06 Nov 2026, 17:40 IST", label: "Wave 2 broadcast started after 30 minutes without acceptance" },
      { timestamp: "06 Nov 2026, 19:10 IST", label: "2-hour window elapsed: Open slot alternative or 100% full refund presented (Never auto-rescheduled)" },
    ],
  },
  {
    id: "SBK-103",
    bookingRef: "DX-BK-2026-1102",
    serviceId: "S10",
    mode: "Direct",
    mentorName: "Neha Sharma",
    mentorSlug: "neha-sharma-eng",
    mentorVerificationLabel: "Identity & Experience Verified by DreamX",
    dateLabel: "Sun, 09 Nov 2026",
    timeLabel: "17:00 – 18:00 IST",
    durationMinutes: 60,
    status: "Upcoming",
    listedPricePaise: 99900,
    appliedDiscountLabel: "Pro Membership (5%)",
    discountPaise: 4995,
    finalPaidPaise: 94905,
    paymentStatus: "Payment Verified",
    hoursUntilSession: 69,
    joinPermittedByServer: false,
    reportStatus: "Awaiting session",
    timeline: [
      { timestamp: "05 Nov 2026, 21:04 IST", label: "Direct booking confirmed after verified payment" },
    ],
  },
  {
    id: "SBK-098",
    bookingRef: "DX-BK-2026-1031",
    serviceId: "S01",
    mode: "Direct",
    mentorName: "Arjun Mehta",
    mentorSlug: "arjun-mehta-swe",
    mentorVerificationLabel: "Identity & Experience Verified by DreamX",
    dateLabel: "28 Oct 2026",
    timeLabel: "20:00 – 20:45 IST",
    durationMinutes: 45,
    status: "Completed",
    listedPricePaise: 59900,
    appliedDiscountLabel: "Pro Membership (5%)",
    discountPaise: 2995,
    finalPaidPaise: 56905,
    paymentStatus: "Payment Verified",
    joinPermittedByServer: false,
    reportStatus: "Report delivered",
    reportId: "SRPT-201",
    timeline: [
      { timestamp: "28 Oct 2026, 20:46 IST", label: "Session completed with attendance verified" },
      { timestamp: "29 Oct 2026, 11:15 IST", label: "Structured S01 Report v1.0 delivered (14.5h post-session)" },
    ],
  },
  {
    id: "SBK-095",
    bookingRef: "DX-BK-2026-1018",
    serviceId: "S07",
    mode: "Smart Match",
    mentorName: "Kavya Subramanian",
    mentorSlug: "kavya-subramanian-pm",
    mentorVerificationLabel: "Identity & Experience Verified by DreamX",
    dateLabel: "26 Oct 2026",
    timeLabel: "19:30 – 20:00 IST",
    durationMinutes: 30,
    status: "Completed",
    listedPricePaise: 49900,
    appliedDiscountLabel: "None (Before Pro upgrade)",
    discountPaise: 0,
    finalPaidPaise: 49900,
    paymentStatus: "Payment Verified",
    joinPermittedByServer: false,
    reportStatus: "Report delivered",
    reportId: "SRPT-200",
    timeline: [
      { timestamp: "26 Oct 2026, 20:01 IST", label: "Session completed" },
      { timestamp: "27 Oct 2026, 10:20 IST", label: "Structured S07 Report v1.0 delivered" },
    ],
  },
];

export const SEED_STUDENT_REPORTS: StudentReport[] = [
  {
    id: "SRPT-201",
    bookingId: "SBK-098",
    bookingRef: "DX-BK-2026-1031",
    serviceId: "S01",
    studentName: "Priya Nair (Sample Dev Student)",
    studentSegment: "Early-career professional",
    targetRole: "Backend Engineer (SDE-2)",
    sessionDate: "28 Oct 2026, 20:00 IST",
    status: "Report delivered",
    slaRemainingLabel: "Delivered 14.5h post-session (Within 48h SLA)",
    assessmentPurpose: "Evaluate SDE-2 backend resume hierarchy, production impact metrics, and alignment with distributed-systems job descriptions.",
    summary: "Priya’s underlying backend ownership (idempotent webhook pipeline handling 180k daily events, Redis cache eviction tuning) was strong but masked by passive bullet phrases. Restructured resume to emphasize technical complexity and latency metrics.",
    rubricScores: [
      { criterionId: "r1", label: "Role & Domain Alignment", rating: 4, observation: "Projects directly reflect distributed systems requirements." },
      { criterionId: "r2", label: "Impact & Quantification", rating: 4, observation: "Rewrote 4 bullets highlighting throughput and p99 latency." },
      { criterionId: "r3", label: "Structure & Visual Clarity", rating: 4, observation: "Clean single-column structure verified across standard ATS parsers." },
    ],
    dimensionObservations: [
      { dimension: "Resume", score: 4, observation: "Elevated from 2/5 to 4/5 with verified architecture specifics." },
      { dimension: "Communication", score: 3, observation: "Concise written articulation; live technical depth to be verified." },
    ],
    strengths: [
      "Real production metrics (180k req/day webhook pipeline)",
      "Clear understanding of database indexing and Redis cache invalidation",
    ],
    improvementAreas: [
      "Add explicit mention of distributed transaction boundaries",
      "Remove legacy intern bullets to keep resume strictly 1 page",
    ],
    actionPlan: [
      { id: "ap-s1", action: "Deploy updated single-column resume to target SDE-2 job boards.", priority: "High", timeframe: "Immediate" },
      { id: "ap-s2", action: "Prepare 2-minute STAR summary of Redis cache stampede incident.", priority: "High", timeframe: "Next 3 days" },
    ],
    suggestedNextSteps: [
      { recommendedServiceId: "S06", reason: "Resume is calibrated; live system design & API reliability round (S06) addresses largest unassessed gap." },
    ],
    assessmentLimitations: "Evaluated under rubric-v3.0 standards. Does not guarantee employer interview shortlists.",
    versions: [
      { version: "v1.0", createdAt: "29 Oct 2026, 11:15 IST", authorName: "Arjun Mehta", changeNote: "Delivered to student portal (14.5h post-session)." },
    ],
  },
  {
    id: "SRPT-200",
    bookingId: "SBK-095",
    bookingRef: "DX-BK-2026-1018",
    serviceId: "S07",
    studentName: "Priya Nair (Sample Dev Student)",
    studentSegment: "Early-career professional",
    targetRole: "Backend Engineer (SDE-2)",
    sessionDate: "26 Oct 2026, 19:30 IST",
    status: "Report delivered",
    slaRemainingLabel: "Delivered 15.0h post-session (Within 48h SLA)",
    assessmentPurpose: "Align 6-week preparation sequence for target Bengaluru/Remote backend product companies.",
    summary: "Narrowed focus from generic full-stack to core Backend SDE-2 loops. Identified highest-leverage sequencing: Resume polish → Technical mock → System design deep-dive.",
    rubricScores: [
      { criterionId: "cp1", label: "Market Calibration", rating: 4, observation: "Realistic target company tier selection." },
      { criterionId: "cp2", label: "Milestone Sequencing", rating: 4, observation: "Sequenced 4 prep blocks matching available 12 study hrs/week." },
    ],
    dimensionObservations: [
      { dimension: "Career Planning", score: 4, observation: "Elevated from 2/5 to 4/5 after structured timeline alignment." },
    ],
    strengths: ["Dedicated weekly study commitment", "Clear target company criteria"],
    improvementAreas: ["Avoid splitting focus across front-end frameworks"],
    actionPlan: [
      { id: "ap-s3", action: "Complete S01 Resume Review to fix impact bullet phrasing.", priority: "High", timeframe: "Within 48 hours" },
    ],
    suggestedNextSteps: [
      { recommendedServiceId: "S01", reason: "Sharpen resume bullets before submitting applications." },
    ],
    assessmentLimitations: "Reflects 30-minute career consultation. Placement outcomes depend on candidate interview performance.",
    versions: [
      { version: "v1.0", createdAt: "27 Oct 2026, 10:20 IST", authorName: "Kavya Subramanian", changeNote: "Delivered to student portal." },
    ],
  },
];

export const SEED_JOURNEY_STAGES: JourneyStage[] = [
  {
    id: "stg-1",
    order: 1,
    stageNumber: 1,
    title: "Stage 1 — Career Goal & Baseline Clarity",
    description:
      "Establish a realistic target role, record initial readiness baseline, and identify highest-weighted gaps.",
    focusSummary:
      "Establish a realistic target role, record initial readiness baseline, and identify highest-weighted gaps.",
    status: "Completed",
    completedDate: "27 Oct 2026",
    requirements: [
      {
        id: "jr-1",
        label: "Complete career segment & baseline readiness intake",
        met: true,
        evidenceNote: "Completed 25 Oct 2026 (Early-career professional · Backend SDE-2)",
      },
      {
        id: "jr-2",
        label: "Reach ≥ 3/5 evidence in Career Planning",
        met: true,
        evidenceNote: "Verified 4/5 via S07 Career Consultation Report (SRPT-200)",
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
    status: "Completed",
    completedDate: "29 Oct 2026",
    requirements: [
      {
        id: "jr-3",
        label: "Reach ≥ 4/5 mentor-verified Resume readiness",
        met: true,
        evidenceNote: "Verified 4/5 via S01 Resume Review Report (SRPT-201)",
      },
      {
        id: "jr-4",
        label: "Upload updated single-column PDF artifact & align LinkedIn baseline",
        met: true,
        evidenceNote: "Uploaded Priya_Nair_Backend_Resume_Oct2026.pdf on 29 Oct 2026",
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
    status: "Current Stage",
    requirements: [
      {
        id: "jr-5",
        label: "Record mentor-verified Technical Skills & Interview Skills evidence",
        met: false,
        evidenceNote: "S06 Technical Mock Interview scheduled Today at 20:00 IST (DX-BK-2026-1094)",
      },
      {
        id: "jr-6",
        label: "Validate behavioral ownership & communication under probing (S05)",
        met: false,
        evidenceNote: "Smart Match request DX-SM-2026-8812 awaiting your slot/refund decision",
      },
      {
        id: "jr-7",
        label: "Complete post-mock remediation action items before final loops",
        met: false,
        evidenceNote: "Unlocks after S06 & S05 structured reports are delivered",
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
    title: "Stage 4 — Active Loop & Offer Evaluation Readiness",
    description:
      "Convert readiness into targeted applications, track interview loops, and evaluate compensation structure calmly.",
    focusSummary:
      "Convert readiness into targeted applications, track interview loops, and evaluate compensation structure calmly.",
    status: "Upcoming",
    requirements: [
      {
        id: "jr-8",
        label: "All applicable readiness dimensions assessed at ≥ 3/5",
        met: false,
        evidenceNote: "6 of 7 applicable dimensions currently assessed",
      },
      {
        id: "jr-9",
        label: "Optional: Complete Salary Negotiation (S08) when in final HR / offer stage",
        met: false,
        evidenceNote: "Book when active compensation discussion begins",
      },
    ],
    recommendedServiceIds: ["S08", "S02"],
    recommendedServices: ["S08", "S02"],
    targetDimensions: ["Career Planning", "Confidence"],
  },
];

export const SEED_VOLUNTARY_OUTCOMES: VoluntaryOutcome[] = [
  {
    id: "vo-1",
    category: "Interview Shortlist",
    title: "Shortlisted for SDE-2 Backend Technical Loop (Fintech Unicorn)",
    recordedDate: "02 Nov 2026",
    verificationState: "Self-Reported",
  },
];

export const SEED_MEMBERSHIP: MembershipData = {
  tier: "Pro",
  billingInterval: "monthly",
  status: "Active",
  startedDate: "27 Oct 2026",
  renewalDate: "27 Nov 2026",
  discountPercent: 5,
  invoices: [
    {
      id: "INV-2026-4501",
      date: "27 Oct 2026",
      description: "DreamX Pro Membership — Monthly (5% Service Discount)",
      amountPaise: 19900,
      status: "Verified",
    },
  ],
};

export const SEED_AVAILABLE_MENTORS: MentorPreview[] = [
  {
    id: "M-101",
    slug: "arjun-mehta-swe",
    displayName: "Arjun Mehta",
    headline: "Staff Backend Engineer · Distributed Systems, API Design & Technical Interview Calibration",
    bio: "7.5+ years building high-throughput payment and order systems in Bengaluru. Delivers rubric-anchored technical mock interviews, DSA diagnostics, and engineering resume reviews.",
    experienceSummary: "Staff Software Engineer (Fintech Infrastructure — Bengaluru)",
    verificationLabel: "Identity & Experience Verified by DreamX (No Employer Endorsement Implied)",
    yearsOfExperience: 8,
    domains: ["Software Engineering", "Data Science / AI"],
    approvedServiceIds: ["S01", "S02", "S06", "S10"],
    languages: ["English", "Hindi", "Kannada"],
    nextAvailableLabel: "Sat, 08 Nov · 10:30 IST",
    availableSlots: [
      { id: "sl-101-1", dateLabel: "Sat, 08 Nov 2026", timeLabel: "10:30 – 11:30 IST", status: "Available" },
      { id: "sl-101-2", dateLabel: "Sat, 08 Nov 2026", timeLabel: "16:30 – 17:30 IST", status: "Available" },
      { id: "sl-101-3", dateLabel: "Sat, 08 Nov 2026", timeLabel: "17:00 – 17:45 IST", status: "Unavailable" },
      { id: "sl-101-4", dateLabel: "Sun, 09 Nov 2026", timeLabel: "11:30 – 12:30 IST", status: "Available" },
    ],
  },
  {
    id: "M-102",
    slug: "kavya-subramanian-pm",
    displayName: "Kavya Subramanian",
    headline: "Principal Product Manager · B2B SaaS, Product Strategy, Case Portfolios & Behavioral Loops",
    bio: "9 years across product management and hiring loops in Chennai & Bengaluru. Helps PM and SWE candidates sharpen STAR ownership stories, product portfolios, and 90-day transition plans.",
    experienceSummary: "Principal Product Manager (Enterprise SaaS — Bengaluru)",
    verificationLabel: "Identity & Experience Verified by DreamX (No Employer Endorsement Implied)",
    yearsOfExperience: 9,
    domains: ["Product Management", "Software Engineering"],
    approvedServiceIds: ["S01", "S03", "S04", "S05", "S07", "S08", "S09"],
    languages: ["English", "Tamil", "Hindi"],
    nextAvailableLabel: "Fri, 07 Nov · 19:30 IST",
    availableSlots: [
      { id: "sl-102-1", dateLabel: "Fri, 07 Nov 2026", timeLabel: "19:30 – 20:30 IST", status: "Available" },
      { id: "sl-102-2", dateLabel: "Sat, 08 Nov 2026", timeLabel: "11:00 – 12:00 IST", status: "Available" },
      { id: "sl-102-3", dateLabel: "Sun, 09 Nov 2026", timeLabel: "15:00 – 16:00 IST", status: "Temporarily held" },
    ],
  },
  {
    id: "M-103",
    slug: "rishi-deshmukh-ai",
    displayName: "Rishi Deshmukh",
    headline: "Senior Applied Scientist · ML Systems, Data Pipelines, Portfolio & Technical Reviews",
    bio: "6.5 years building recommendation and NLP pipelines in Pune & Hyderabad. Specializes in Data Science / AI technical interviews, notebook portfolio audits, and ATS alignment for career switchers.",
    experienceSummary: "Senior Applied Data Scientist (Marketplace ML — Hyderabad)",
    verificationLabel: "Identity & Experience Verified by DreamX (No Employer Endorsement Implied)",
    yearsOfExperience: 7,
    domains: ["Data Science / AI", "Software Engineering"],
    approvedServiceIds: ["S02", "S04", "S06", "S07", "S09"],
    languages: ["English", "Marathi", "Hindi"],
    nextAvailableLabel: "Sat, 08 Nov · 14:00 IST",
    availableSlots: [
      { id: "sl-103-1", dateLabel: "Sat, 08 Nov 2026", timeLabel: "14:00 – 15:00 IST", status: "Available" },
      { id: "sl-103-2", dateLabel: "Sun, 09 Nov 2026", timeLabel: "10:30 – 11:30 IST", status: "Available" },
    ],
  },
  {
    id: "M-104",
    slug: "neha-sharma-eng",
    displayName: "Neha Sharma",
    headline: "Engineering Manager · Hiring Debriefs, Behavioral Interviews, LinkedIn & Compensation",
    bio: "10+ years in full-stack engineering and 4 years leading campus and lateral SDE-1/SDE-2 hiring panels in Gurugram.",
    experienceSummary: "Engineering Manager (Consumer Platform — Gurugram)",
    verificationLabel: "Identity & Experience Verified by DreamX (No Employer Endorsement Implied)",
    yearsOfExperience: 10,
    domains: ["Software Engineering", "Product Management"],
    approvedServiceIds: ["S01", "S03", "S05", "S07", "S08", "S10"],
    languages: ["English", "Hindi"],
    nextAvailableLabel: "Sun, 09 Nov · 17:00 IST",
    availableSlots: [
      { id: "sl-104-1", dateLabel: "Sun, 09 Nov 2026", timeLabel: "17:00 – 18:00 IST", status: "Available" },
      { id: "sl-104-2", dateLabel: "Mon, 10 Nov 2026", timeLabel: "20:00 – 21:00 IST", status: "Available" },
    ],
  },
];

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

export const SEED_NOTIFICATIONS: StudentNotification[] = [
  {
    id: "SN-1",
    title: "Decision needed on Smart Match (DX-SM-2026-8812)",
    description: "2 hours elapsed without a Friday 21:30 IST mentor claim. Choose the open Saturday 11:00 IST slot or a 100% full refund.",
    timestamp: "12 min ago",
    unread: true,
    targetRoute: "bookings",
    targetRecordId: "SBK-102",
  },
  {
    id: "SN-2",
    title: "Session room open now (DX-BK-2026-1094)",
    description: "Server join authorization is active for your S06 Technical Mock Interview with Arjun Mehta.",
    timestamp: "Just now",
    unread: true,
    targetRoute: "bookings",
    targetRecordId: "SBK-101",
  },
  {
    id: "SN-3",
    title: "S01 Resume Review Report delivered (SRPT-201)",
    description: "Arjun Mehta delivered your structured Resume Review report and action plan.",
    timestamp: "29 Oct 2026",
    unread: false,
    targetRoute: "reports",
    targetRecordId: "SRPT-201",
  },
];
