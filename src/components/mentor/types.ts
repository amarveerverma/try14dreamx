// DreamX Mentor Portal Types & Services Catalogue (PRD V3.0)

export type Tone = "success" | "warning" | "danger" | "info" | "primary" | "neutral";

export interface StatusBadgeProps {
  label: string;
  tone: Tone;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export interface RubricCriterion {
  id: string;
  label: string;
  guidance: string;
}

export interface ServiceDefinition {
  id: string;
  slug: string;
  name: string;
  category: string;
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
  mappedDimensions: string[];
  rubricCriteria: RubricCriterion[];
}

export interface TrustPillar {
  id: string;
  title: string;
  status: string;
  requiredEvidence: string[];
  submittedEvidence: string[];
  submittedAt: string;
  reviewedAt?: string;
  reviewerFeedback?: string;
  nextAction?: string;
  policyNote?: string;
}

export interface ServiceApproval {
  serviceId: string;
  status: "Approved" | "Under review" | "More information required" | "Rejected" | "Submitted";
  activeForBookings: boolean;
  directBookingEnabled: boolean;
  smartMatchEnabled: boolean;
  submittedAt: string;
  reviewedAt?: string;
  reviewerNote?: string;
  evidenceSummary?: string;
}

export interface WeeklySlot {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  enabled: boolean;
}

export interface DateException {
  id: string;
  date: string;
  type: "Unavailable" | "Custom Hours";
  customHours?: string;
  reason: string;
}

export interface PreferredWindow {
  id: string;
  label: string;
  dateIso: string;
}

export interface DispatchOffer {
  id: string;
  requestCode: string;
  serviceId: string;
  studentAlias: string;
  studentSegment: string;
  targetDomain: string;
  goalSummary: string;
  sessionContextNote: string;
  preferredWindows: PreferredWindow[];
  wave: "Wave 1" | "Wave 2";
  minutesSinceRequest: number;
  expiresInMinutes: number;
  matchReasons: string[];
  matchingRuleVersion: string;
  status: "Pending" | "Accepted" | "Declined" | "Already Claimed";
  simulateContendedClaim?: boolean;
}

export interface AuthorizedDocument {
  id: string;
  title: string;
  type: string;
  signedUrlExpiresIn: string;
  summaryPreview: string;
}

export interface ReadinessDimensionScore {
  dimension: string;
  score: number | string | null;
  lastUpdated: string;
  note: string;
}

export interface BookingTimelineEvent {
  timestamp: string;
  event: string;
  actor: string;
}

export interface MentorBooking {
  id: string;
  bookingRef: string;
  serviceId: string;
  bookingMode: "Direct" | "Smart Match";
  studentName: string;
  studentSegment: string;
  targetRole: string;
  targetDomain: string;
  sessionGoal: string;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  status: "Ready to Join" | "Confirmed" | "Completed" | "Cancelled";
  paymentStatus: "Verified" | "Refund Completed" | "Pending";
  joinPermittedByServer: boolean;
  meetingProviderLabel: string;
  meetingUrl?: string | null;
  attendance: {
    studentJoinedAt?: string;
    mentorJoinedAt?: string;
    completedAt?: string;
  };
  authorizedDocuments: AuthorizedDocument[];
  readinessContext: {
    overallScore: number | null;
    rubricVersion: string;
    lastAssessedDate: string;
    coverageLabel: string;
    portfolioNotApplicable?: boolean;
    dimensions: ReadinessDimensionScore[];
  };
  reportStatus: "Awaiting session" | "Report pending" | "Report delivered" | "Not applicable" | "Revision requested";
  reportDueInHours?: number;
  reportId?: string;
  cancellationNote?: string;
  timeline: BookingTimelineEvent[];
}

export interface RubricScoreItem {
  criterionId: string;
  label: string;
  rating: number;
  observation: string;
}

export interface DimensionObservation {
  dimension: string;
  score: number;
  observation: string;
}

export interface ActionPlanItem {
  id: string;
  action: string;
  priority: "High" | "Medium" | "Low";
  timeframe: string;
}

export interface SuggestedNextStep {
  recommendedServiceId: string;
  reason: string;
}

export interface ReportVersion {
  version: string;
  createdAt: string;
  authorName: string;
  changeNote: string;
}

export interface SessionReport {
  id: string;
  bookingId: string;
  bookingRef: string;
  serviceId: string;
  studentName: string;
  studentSegment: string;
  targetRole: string;
  sessionDate: string;
  status: "Report pending" | "Report delivered" | "Revision requested" | "Report delayed";
  slaRemainingLabel: string;
  revisionRequestReason?: string;
  assessmentPurpose: string;
  summary: string;
  rubricScores: RubricScoreItem[];
  dimensionObservations: DimensionObservation[];
  strengths: string[];
  improvementAreas: string[];
  actionPlan: ActionPlanItem[];
  suggestedNextSteps: SuggestedNextStep[];
  assessmentLimitations: string;
  versions: ReportVersion[];
}

export interface FinancialLedgerRecord {
  id: string;
  bookingRef: string;
  serviceId: string;
  studentName: string;
  completedDate: string;
  grossListedPricePaise: number;
  studentAppliedDiscountLabel: string;
  studentPaidPaise: number;
  mentorCalculationBasisPaise: number;
  adjustmentPaise: number;
  adjustmentReason?: string;
  verificationStatus: "Provider Webhook Verified" | "Refund Completed" | "Under Audit";
  settlementStatus: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  category: "booking" | "dispatch" | "report" | "verification";
  targetRoute: string;
  targetRecordId?: string;
}

export interface MentorProfileData {
  displayName: string;
  slug: string;
  headline: string;
  bio: string;
  currentRoleLabel: string;
  experienceVerificationLabel: string;
  yearsOfExperience: number;
  domains: string[];
  skills: string[];
  languages: string[];
  educationSummary: string;
  timezone: string;
  employmentType?: "employed" | "alumni";
  pastEmployer?: string;
  pastJobTitle?: string;
  workEmail?: string;
  verifiedCompany?: string;
  notifications: {
    inAppDispatch: boolean;
    emailDigest: boolean;
    whatsappAlerts: boolean;
  };
}

// Full S01–S10 Services Catalogue
export const SERVICES_CATALOGUE: ServiceDefinition[] = [
  {
    id: "S01",
    slug: "resume-review",
    name: "Resume Review",
    category: "Profile & Assets",
    durationMinutes: 45,
    listPricePaise: 59900,
    shortOutcome: "Line-by-line human critique of structure, impact framing, and role alignment.",
    intendedFor: "Students and early-career seekers preparing applications for SWE, Data/AI, or PM roles.",
    scopeIncluded: [
      "Section hierarchy, readability, and 1-page density review",
      "Evidence-backed bullet rewrite recommendations (problem, action, measurable result)",
      "Alignment check against 1–2 target role descriptions"
    ],
    exclusions: [
      "Does not guarantee interview shortlisting or hiring outcomes",
      "Mentor provides structured rewrite guidance rather than fabricating experience"
    ],
    requiredStudentInputs: ["Current Resume PDF (private upload)", "Target role / domain"],
    deliverableName: "Structured Resume Diagnostic & Bullet Rewrite Action Plan",
    reportSlaHours: 48,
    bookingModes: ["Direct", "Smart Match"],
    mappedDimensions: ["Resume", "Communication"],
    rubricCriteria: [
      { id: "r1", label: "Role & Domain Alignment", guidance: "Relevance of projects/experience to target role." },
      { id: "r2", label: "Impact & Quantification", guidance: "Clarity of scope, technical decisions, and outcomes." },
      { id: "r3", label: "Structure & Visual Clarity", guidance: "Scannability, hierarchy, and zero clutter." }
    ]
  },
  {
    id: "S02",
    slug: "ats-resume-optimization",
    name: "ATS Resume Optimization",
    category: "Profile & Assets",
    durationMinutes: 45,
    listPricePaise: 79900,
    shortOutcome: "Optimize parsing structure, skill taxonomy, and JD keyword mapping with a verified mentor.",
    intendedFor: "Candidates applying through structured enterprise portals with low callback rates.",
    scopeIncluded: [
      "Parser-safe layout and heading audit",
      "Domain keyword gap mapping across 2 sample job descriptions",
      "Honest competency framing without keyword stuffing"
    ],
    exclusions: ["No guaranteed ATS pass score or automated recruiter shortlist promise"],
    requiredStudentInputs: ["Current Resume PDF", "Two target job descriptions"],
    deliverableName: "ATS Parsing & Keyword Gap Action Report",
    reportSlaHours: 48,
    bookingModes: ["Direct", "Smart Match"],
    mappedDimensions: ["Resume", "Career Planning"],
    rubricCriteria: [
      { id: "a1", label: "Parsing & Semantic Structure", guidance: "Standard section headers, date formats, clean layout." },
      { id: "a2", label: "Taxonomy & Skill Coverage", guidance: "Authentic alignment with target JD terminology." },
      { id: "a3", label: "Evidence Credibility", guidance: "Skills backed by concrete project/work bullets." }
    ]
  },
  {
    id: "S03",
    slug: "linkedin-profile-review",
    name: "LinkedIn Profile Review",
    category: "Profile & Assets",
    durationMinutes: 30,
    listPricePaise: 49900,
    shortOutcome: "Strengthen headline, About narrative, featured proof, and recruiter discoverability.",
    intendedFor: "Candidates building inbound credibility and referral readiness.",
    scopeIncluded: ["Headline & About positioning", "Experience & Featured section audit", "Outreach readiness tips"],
    exclusions: ["Does not include managing the student’s social account or guaranteed recruiter messages"],
    requiredStudentInputs: ["LinkedIn profile URL", "Target role"],
    deliverableName: "LinkedIn Positioning & Discoverability Checklist",
    reportSlaHours: 48,
    bookingModes: ["Direct", "Smart Match"],
    mappedDimensions: ["LinkedIn", "Communication"],
    rubricCriteria: [
      { id: "l1", label: "Headline & Value Proposition", guidance: "Immediate clarity on target domain and strengths." },
      { id: "l2", label: "Experience & Proof Artifacts", guidance: "Consistency with resume and featured work." }
    ]
  },
  {
    id: "S04",
    slug: "portfolio-review",
    name: "Portfolio Review",
    category: "Profile & Assets",
    durationMinutes: 45,
    listPricePaise: 59900,
    shortOutcome: "Evaluate GitHub repositories, case studies, or live builds for engineering/product depth.",
    intendedFor: "Candidates showcasing engineering projects, data notebooks, or PM case studies.",
    scopeIncluded: ["2–3 flagship project deep dives", "README / architecture / case-study narrative critique"],
    exclusions: ["Does not write project code on behalf of the student"],
    requiredStudentInputs: ["Portfolio / GitHub URLs", "Target domain"],
    deliverableName: "Project Depth & Case-Study Evaluation Report",
    reportSlaHours: 48,
    bookingModes: ["Direct", "Smart Match"],
    mappedDimensions: ["Portfolio", "Technical Skills"],
    rubricCriteria: [
      { id: "p1", label: "Problem Selection & Originality", guidance: "Beyond tutorial clones; clear real-world problem." },
      { id: "p2", label: "Execution & Documentation", guidance: "Code hygiene, trade-offs, README clarity, live demo." }
    ]
  },
  {
    id: "S05",
    slug: "behavioral-mock-interview",
    name: "Behavioral Mock Interview",
    category: "Interviews",
    durationMinutes: 60,
    listPricePaise: 79900,
    shortOutcome: "Realistic behavioral interview simulation with structured story and communication feedback.",
    intendedFor: "Candidates preparing for hiring-manager, ownership, and collaboration rounds.",
    scopeIncluded: ["35–40 min live behavioral interview", "15–20 min targeted debrief", "Story bank restructuring"],
    exclusions: ["No guarantee of passing a specific employer’s interview loop"],
    requiredStudentInputs: ["Resume PDF", "Target role level"],
    deliverableName: "Behavioral Competency & STAR Story Evaluation Report",
    reportSlaHours: 48,
    bookingModes: ["Direct", "Smart Match"],
    mappedDimensions: ["Interview Skills", "Communication", "Confidence"],
    rubricCriteria: [
      { id: "b1", label: "Structured Storytelling (Context → Action → Outcome)", guidance: "Concise setup and clear personal ownership." },
      { id: "b2", label: "Reflection & Conflict Handling", guidance: "Self-awareness, trade-offs, and learning depth." },
      { id: "b3", label: "Executive Presence & Pacing", guidance: "Clarity under follow-up probing." }
    ]
  },
  {
    id: "S06",
    slug: "technical-mock-interview",
    name: "Technical Mock Interview",
    category: "Interviews",
    durationMinutes: 60,
    listPricePaise: 99900,
    shortOutcome: "Domain-specific technical interview simulation covering architecture, debugging, or core concepts.",
    intendedFor: "SWE, Data Science/AI, and PM candidates with upcoming technical loops.",
    scopeIncluded: [
      "40–45 min realistic technical problem/system walkthrough",
      "15 min rubric-anchored diagnostic debrief",
      "Prioritized study and practice action plan"
    ],
    exclusions: ["Does not leak proprietary employer question banks or guarantee hiring outcomes"],
    requiredStudentInputs: ["Resume PDF", "Target stack / domain focus", "Upcoming timeline"],
    deliverableName: "Technical Interview Rubric & Gap Remediation Report",
    reportSlaHours: 48,
    bookingModes: ["Direct", "Smart Match"],
    mappedDimensions: ["Technical Skills", "Interview Skills", "Communication", "Confidence"],
    rubricCriteria: [
      { id: "t1", label: "Requirement Clarification & Scoping", guidance: "Identifies constraints, edge cases, and assumptions early." },
      { id: "t2", label: "Core Technical Depth & Trade-offs", guidance: "Soundness of design, data structures, or modeling choices." },
      { id: "t3", label: "Technical Communication", guidance: "Thinks aloud clearly and responds constructively to hints." }
    ]
  },
  {
    id: "S07",
    slug: "career-consultation",
    name: "Career Consultation",
    category: "Career Direction",
    durationMinutes: 30,
    listPricePaise: 49900,
    shortOutcome: "Focused 1:1 clarity session on role targeting, market positioning, or immediate blockers.",
    intendedFor: "Students and switchers deciding between tracks or diagnosing stalled job searches.",
    scopeIncluded: ["Focused diagnosis of 1–2 career questions", "Concrete 2-week priority actions"],
    exclusions: ["Not a multi-month coaching retainer or placement guarantee"],
    requiredStudentInputs: ["Primary question / blocker summary"],
    deliverableName: "Decision Summary & Immediate Next-Step Brief",
    reportSlaHours: 48,
    bookingModes: ["Direct"],
    mappedDimensions: ["Career Planning", "Confidence"],
    rubricCriteria: [
      { id: "c1", label: "Goal Realism & Market Alignment", guidance: "Clarity on target roles vs current skill baseline." },
      { id: "c2", label: "Immediate Execution Focus", guidance: "Eliminating low-leverage activities." }
    ]
  },
  {
    id: "S08",
    slug: "salary-negotiation",
    name: "Salary Negotiation",
    category: "Career Direction",
    durationMinutes: 30,
    listPricePaise: 69900,
    shortOutcome: "Structure offer evaluation, compensation components, and professional negotiation scripts.",
    intendedFor: "Candidates with active interviews or written offers in India tech markets.",
    scopeIncluded: ["Total comp breakdown (fixed, variable, ESOPs)", "Counter-offer framing & call rehearsal"],
    exclusions: ["Not legal/tax advice; does not guarantee compensation increases"],
    requiredStudentInputs: ["Offer context / role band (redacted if confidential)"],
    deliverableName: "Offer Evaluation & Negotiation Conversation Playbook",
    reportSlaHours: 48,
    bookingModes: ["Direct"],
    mappedDimensions: ["Communication", "Confidence"],
    rubricCriteria: [
      { id: "n1", label: "Leverage & Comp Understanding", guidance: "Grasp of fixed/variable/equity components." },
      { id: "n2", label: "Communication Poise", guidance: "Collaborative, non-adversarial framing." }
    ]
  },
  {
    id: "S09",
    slug: "career-roadmap-session",
    name: "Career Roadmap Session",
    category: "Career Direction",
    durationMinutes: 60,
    listPricePaise: 79900,
    shortOutcome: "Build a milestone-based 60–90 day preparation plan tailored to readiness gaps.",
    intendedFor: "Placement seekers, early-career engineers, and career switchers needing structured sequencing.",
    scopeIncluded: ["Gap prioritization across readiness dimensions", "Sequenced 30/60/90-day milestones"],
    exclusions: ["Does not promise fixed placement timelines"],
    requiredStudentInputs: ["Current readiness summary", "Weekly study hours available"],
    deliverableName: "90-Day Sequenced Career Milestone Plan",
    reportSlaHours: 48,
    bookingModes: ["Direct", "Smart Match"],
    mappedDimensions: ["Career Planning", "Technical Skills"],
    rubricCriteria: [
      { id: "rm1", label: "Gap Prioritization", guidance: "Focuses on highest-weight unaddressed dimensions." },
      { id: "rm2", label: "Milestone Feasibility", guidance: "Realistic weekly commitment and verifiable outputs." }
    ]
  },
  {
    id: "S10",
    slug: "coding-interview-preparation",
    name: "Coding Interview Preparation",
    category: "Interviews",
    durationMinutes: 60,
    listPricePaise: 99900,
    shortOutcome: "Live algorithmic problem-solving, complexity analysis, and clean code implementation session.",
    intendedFor: "Candidates preparing for DSA / coding rounds in product companies.",
    scopeIncluded: [
      "Live coding problem(s) in candidate’s preferred language",
      "Time/space complexity & dry-run critique",
      "Pattern gap diagnosis & practice set recommendation"
    ],
    exclusions: ["No guaranteed company shortlist or memorized leak sheets"],
    requiredStudentInputs: ["Preferred programming language", "Target company tier / timeline"],
    deliverableName: "Coding Execution, Complexity & Pattern Diagnostic Report",
    reportSlaHours: 48,
    bookingModes: ["Direct", "Smart Match"],
    mappedDimensions: ["Technical Skills", "Interview Skills", "Confidence"],
    rubricCriteria: [
      { id: "cp1", label: "Problem Decomposition & Pattern Recognition", guidance: "Brute-force to optimal progression." },
      { id: "cp2", label: "Code Correctness & Edge-Case Dry Run", guidance: "Clean syntax, boundary handling, bug testing." },
      { id: "cp3", label: "Complexity Analysis & Verbalization", guidance: "Accurate Big-O reasoning explained clearly." }
    ]
  }
];

export function getServiceById(id: string): ServiceDefinition {
  return SERVICES_CATALOGUE.find((s) => s.id === id) || SERVICES_CATALOGUE[0];
}

export function formatINR(amountPaise: number): string {
  const isNeg = amountPaise < 0;
  const absRupees = Math.abs(amountPaise) / 100;
  const hasDec = Math.abs(amountPaise) % 100 !== 0;
  return `${isNeg ? "-" : ""}${new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: hasDec ? 2 : 0,
    maximumFractionDigits: hasDec ? 2 : 0,
  }).format(absRupees)}`;
}

export function getToneForStatus(status: string): Tone {
  switch (status) {
    case "Approved":
    case "Report delivered":
    case "Verified":
    case "Provider Webhook Verified":
      return "success";
    case "More information required":
    case "Revision requested":
    case "Report pending":
    case "Wave 2":
      return "warning";
    case "Rejected":
    case "Report delayed":
    case "Cancelled":
    case "Already Claimed":
      return "danger";
    case "Under review":
    case "Submitted":
    case "Ready to Join":
    case "Confirmed":
    case "Wave 1":
      return "info";
    default:
      return "neutral";
  }
}


export const DEFAULT_WEEKLY_SLOTS: WeeklySlot[] = [];
export const DEFAULT_DATE_EXCEPTIONS: DateException[] = [];

export const SEED_DISPATCH_OFFERS: DispatchOffer[] = [];
export const SEED_BOOKINGS: MentorBooking[] = [];
export const SEED_REPORTS: SessionReport[] = [];
export const SEED_FINANCIAL_LEDGER: FinancialLedgerRecord[] = [];
export const SEED_NOTIFICATIONS: NotificationItem[] = [];

export const DEFAULT_MENTOR_PROFILE: MentorProfileData = {
  displayName: "Mentor Applicant",
  slug: "mentor",
  headline: "Verified Tech Practitioner",
  bio: "Pending profile onboarding.",
  currentRoleLabel: "Tech Practitioner",
  experienceVerificationLabel: "Pending Verification",
  yearsOfExperience: 0,
  domains: [],
  skills: [],
  languages: ["English"],
  educationSummary: "B.Tech / Equivalent",
  timezone: "Asia/Kolkata (IST)",
  verifiedCompany: "",
  employmentType: "employed",
  notifications: {
    inAppDispatch: true,
    emailDigest: true,
    whatsappAlerts: false,
  },
};
export const SEED_PROFILE: MentorProfileData = DEFAULT_MENTOR_PROFILE;

export const DEFAULT_TRUST_PILLARS: TrustPillar[] = [
  {
    id: "identity",
    title: "1. Identity Verification",
    status: "Pending",
    requiredEvidence: [
      "Government photo identity record",
      "Masked ID hash stored in audit vault",
    ],
    submittedEvidence: [],
    submittedAt: "",
  },
  {
    id: "employment",
    title: "2. Current / Past Tech Employment",
    status: "Pending",
    requiredEvidence: [
      "Corporate email verification or relieving letter / Form 16",
      "Confirmed employer domain",
    ],
    submittedEvidence: [],
    submittedAt: "",
  },
  {
    id: "rubric",
    title: "3. Rubric & SLA Agreement",
    status: "Pending",
    requiredEvidence: [
      "48-hour report delivery commitment",
      "Adherence to objective 8-dimension rubric criteria",
    ],
    submittedEvidence: [],
    submittedAt: "",
  },
  {
    id: "escrow",
    title: "4. Escrow & Payout Setup",
    status: "Pending",
    requiredEvidence: [
      "UPI ID or verified bank account",
      "TDS acknowledgement",
    ],
    submittedEvidence: [],
    submittedAt: "",
  },
];
export const SEED_TRUST_PILLARS: TrustPillar[] = DEFAULT_TRUST_PILLARS;

export const SEED_SERVICE_APPROVALS: ServiceApproval[] = [];
