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


export const DEFAULT_WEEKLY_SLOTS: WeeklySlot[] = [
  { id: "w1", dayOfWeek: "Monday", startTime: "19:30", endTime: "21:30", enabled: true },
  { id: "w2", dayOfWeek: "Tuesday", startTime: "20:00", endTime: "22:00", enabled: true },
  { id: "w3", dayOfWeek: "Wednesday", startTime: "19:30", endTime: "21:30", enabled: false },
  { id: "w4", dayOfWeek: "Thursday", startTime: "20:00", endTime: "22:00", enabled: true },
  { id: "w5", dayOfWeek: "Friday", startTime: "19:00", endTime: "21:00", enabled: false },
  { id: "w6", dayOfWeek: "Saturday", startTime: "10:00", endTime: "13:00", enabled: true },
  { id: "w7", dayOfWeek: "Saturday", startTime: "16:00", endTime: "18:30", enabled: true },
  { id: "w8", dayOfWeek: "Sunday", startTime: "11:00", endTime: "14:00", enabled: true },
];

export const DEFAULT_DATE_EXCEPTIONS: DateException[] = [
  { id: "ex1", date: "2026-11-12", type: "Unavailable", reason: "Diwali family travel — unavailable all day" },
  { id: "ex2", date: "2026-11-15", type: "Custom Hours", customHours: "14:00 – 17:00 IST", reason: "Extended Sunday afternoon slot window for mock interviews" },
];

export const SEED_DISPATCH_OFFERS: DispatchOffer[] = [
  {
    id: "DO-401",
    requestCode: "SM-2026-8841",
    serviceId: "S06",
    studentAlias: "Rohan K. (Verified Student)",
    studentSegment: "Fresh graduate",
    targetDomain: "Software Engineering",
    goalSummary: "Preparing for SDE-1 backend technical interviews in 3 weeks; wants realistic API & database design + debugging assessment.",
    sessionContextNote: "Technical Skills (2/5) and Interview Skills (unassessed) are highest-weighted gaps for Fresh graduate segment.",
    preferredWindows: [
      { id: "pw-1", label: "Sat, 08 Nov 2026 · 10:30 – 11:30 IST", dateIso: "2026-11-08T10:30:00+05:30" },
      { id: "pw-2", label: "Sat, 08 Nov 2026 · 16:30 – 17:30 IST", dateIso: "2026-11-08T16:30:00+05:30" },
      { id: "pw-3", label: "Sun, 09 Nov 2026 · 11:30 – 12:30 IST", dateIso: "2026-11-09T11:30:00+05:30" }
    ],
    wave: "Wave 1",
    minutesSinceRequest: 14,
    expiresInMinutes: 16,
    matchReasons: [
      "Approved for S06 Technical Mock Interview",
      "Domain match: Software Engineering",
      "Open availability in all 3 requested IST windows",
      "100% 48-hour report SLA compliance over last 10 sessions"
    ],
    matchingRuleVersion: "det-match-v1.3",
    status: "Pending"
  },
  {
    id: "DO-402",
    requestCode: "SM-2026-8836",
    serviceId: "S01",
    studentAlias: "Ananya S. (Verified Student)",
    studentSegment: "Student",
    targetDomain: "Software Engineering",
    goalSummary: "Final-year B.Tech student preparing campus & off-campus SWE applications; needs project bullet sharpening.",
    sessionContextNote: "Wave 2 escalated after 30 minutes without Wave 1 claim. At 120 minutes without claim, student chooses open slot or 100% refund.",
    preferredWindows: [
      { id: "pw-4", label: "Sat, 08 Nov 2026 · 11:45 – 12:30 IST", dateIso: "2026-11-08T11:45:00+05:30" },
      { id: "pw-5", label: "Sun, 09 Nov 2026 · 12:45 – 13:30 IST", dateIso: "2026-11-09T12:45:00+05:30" }
    ],
    wave: "Wave 2",
    minutesSinceRequest: 47,
    expiresInMinutes: 73,
    matchReasons: [
      "Approved for S01 Resume Review",
      "Wave 2 broadcast (>30 min elapsed without Wave 1 acceptance)",
      "Domain match: Software Engineering"
    ],
    matchingRuleVersion: "det-match-v1.3",
    status: "Pending"
  },
  {
    id: "DO-403",
    requestCode: "SM-2026-8839",
    serviceId: "S10",
    studentAlias: "Karthik V. (Verified Student)",
    studentSegment: "Early-career professional",
    targetDomain: "Software Engineering",
    goalSummary: "Transitioning from service-based QA/automation to SDE-1/SDE-2; practicing graph/tree problem verbalization in Python.",
    sessionContextNote: "High-demand slot — dispatched to eligible S10 mentors. Atomic lock ensures only one mentor claim succeeds (PRD 10.4).",
    preferredWindows: [
      { id: "pw-6", label: "Thu, 06 Nov 2026 · 20:30 – 21:30 IST", dateIso: "2026-11-06T20:30:00+05:30" }
    ],
    wave: "Wave 1",
    minutesSinceRequest: 22,
    expiresInMinutes: 8,
    matchReasons: [
      "Approved for S10 Coding Interview Preparation",
      "Python & TypeScript interview language coverage",
      "Open Thursday 20:30 IST slot"
    ],
    matchingRuleVersion: "det-match-v1.3",
    status: "Pending",
    simulateContendedClaim: true
  }
];

export const SEED_BOOKINGS: MentorBooking[] = [
  {
    id: "BK-901",
    bookingRef: "DX-BK-2026-1094",
    serviceId: "S06",
    bookingMode: "Direct",
    studentName: "Priya Nair (Sample Dev Student)",
    studentSegment: "Early-career professional",
    targetRole: "Backend Engineer (SDE-2)",
    targetDomain: "Software Engineering",
    sessionGoal: "Evaluate readiness for distributed systems & API reliability interview rounds; identify top 2 weak spots before next week’s loop.",
    scheduledDate: "Today, 06 Nov 2026",
    scheduledTime: "20:00 – 21:00 IST",
    durationMinutes: 60,
    status: "Ready to Join",
    paymentStatus: "Verified",
    joinPermittedByServer: true,
    meetingProviderLabel: "Authorized Session Room (Server-Verified Access)",
    meetingUrl: "https://meet.dreamx.in/dx-bk-1094-vault",
    attendance: { studentJoinedAt: "19:58 IST" },
    authorizedDocuments: [
      {
        id: "doc-1",
        title: "Priya_Nair_Backend_Resume_Oct2026.pdf",
        type: "Resume PDF",
        signedUrlExpiresIn: "14 min (Short-lived signed URL)",
        summaryPreview: "2.8 yrs Node.js/PostgreSQL experience at fintech startup; payment webhook service, Redis rate limiter, order ledger."
      },
      {
        id: "doc-2",
        title: "Target_SDE2_Role_Expectations.txt",
        type: "Role JD Notes",
        signedUrlExpiresIn: "14 min (Short-lived signed URL)",
        summaryPreview: "Focus areas: idempotent APIs, database locking/isolation levels, observability, incident postmortems."
      }
    ],
    readinessContext: {
      overallScore: 64,
      rubricVersion: "rubric-v3.0",
      lastAssessedDate: "29 Oct 2026",
      coverageLabel: "6 of 7 applicable dimensions assessed (Portfolio marked N/A — weight redistributed)",
      portfolioNotApplicable: true,
      dimensions: [
        { dimension: "Resume", score: 4, lastUpdated: "29 Oct 2026", note: "Clear impact metrics after S01 session." },
        { dimension: "LinkedIn", score: 3, lastUpdated: "25 Oct 2026", note: "Solid baseline." },
        { dimension: "Portfolio", score: "N/A", lastUpdated: "25 Oct 2026", note: "N/A for backend enterprise track; 5% weight proportionally redistributed." },
        { dimension: "Communication", score: 3, lastUpdated: "29 Oct 2026", note: "Structured written context; live technical probing pending." },
        { dimension: "Technical Skills", score: 3, lastUpdated: "25 Oct 2026", note: "Self-baseline + resume review; live interview evidence needed." },
        { dimension: "Interview Skills", score: null, lastUpdated: "Not assessed", note: "Unassessed — primary focus of today’s S06 session." },
        { dimension: "Career Planning", score: 4, lastUpdated: "25 Oct 2026", note: "Focused target company tier." },
        { dimension: "Confidence", score: 3, lastUpdated: "25 Oct 2026", note: "Moderate confidence." }
      ]
    },
    reportStatus: "Awaiting session",
    timeline: [
      { timestamp: "04 Nov 2026, 18:12 IST", event: "Slot held atomically for checkout", actor: "System" },
      { timestamp: "04 Nov 2026, 18:14 IST", event: "Payment verified via signed webhook; booking confirmed", actor: "Payment Webhook" },
      { timestamp: "06 Nov 2026, 19:00 IST", event: "1-hour pre-session reminder sent (Email + In-App)", actor: "System" },
      { timestamp: "06 Nov 2026, 19:58 IST", event: "Student entered waiting room", actor: "Student" }
    ]
  },
  {
    id: "BK-902",
    bookingRef: "DX-BK-2026-1099",
    serviceId: "S02",
    bookingMode: "Smart Match",
    studentName: "Devansh Kulkarni (Sample Dev Student)",
    studentSegment: "Career switcher",
    targetRole: "Junior Data / ML Platform Engineer",
    targetDomain: "Data Science / AI",
    sessionGoal: "Align software/ETL experience with Data Platform JDs without overstating ML modeling credentials.",
    scheduledDate: "Sat, 08 Nov 2026",
    scheduledTime: "17:00 – 17:45 IST",
    durationMinutes: 45,
    status: "Confirmed",
    paymentStatus: "Verified",
    joinPermittedByServer: false,
    meetingProviderLabel: "Join link unlocks 10 min before scheduled start",
    attendance: {},
    authorizedDocuments: [
      {
        id: "doc-3",
        title: "Devansh_Switcher_Resume_Draft.pdf",
        type: "Resume PDF",
        signedUrlExpiresIn: "Generated at session window",
        summaryPreview: "3 yrs Python data pipelines & SQL; transitioning into ML data engineering."
      }
    ],
    readinessContext: {
      overallScore: 52,
      rubricVersion: "rubric-v3.0",
      lastAssessedDate: "02 Nov 2026",
      coverageLabel: "5 of 8 dimensions assessed",
      dimensions: [
        { dimension: "Resume", score: 2, lastUpdated: "02 Nov 2026", note: "Reads like generalist support role; needs ETL impact framing." },
        { dimension: "Portfolio", score: 3, lastUpdated: "02 Nov 2026", note: "2 clean GitHub Airflow/dbt repos." },
        { dimension: "Career Planning", score: 3, lastUpdated: "02 Nov 2026", note: "Target track narrowed to Data Engineering." }
      ]
    },
    reportStatus: "Awaiting session",
    timeline: [
      { timestamp: "05 Nov 2026, 10:05 IST", event: "Smart Match Wave 1 request created", actor: "Student" },
      { timestamp: "05 Nov 2026, 10:19 IST", event: "Atomic claim accepted by Mentor Partner", actor: "Mentor" },
      { timestamp: "05 Nov 2026, 10:19 IST", event: "Booking confirmed & calendar invite queued", actor: "System" }
    ]
  },
  {
    id: "BK-898",
    bookingRef: "DX-BK-2026-1081",
    serviceId: "S10",
    bookingMode: "Direct",
    studentName: "Meera Iyer (Sample Dev Student)",
    studentSegment: "Fresh graduate",
    targetRole: "Software Engineer (New Grad)",
    targetDomain: "Software Engineering",
    sessionGoal: "Assess live dynamic programming & graph traversal problem solving under a 45-minute clock.",
    scheduledDate: "05 Nov 2026",
    scheduledTime: "20:00 – 21:00 IST",
    durationMinutes: 60,
    status: "Completed",
    paymentStatus: "Verified",
    joinPermittedByServer: false,
    meetingProviderLabel: "Session concluded",
    attendance: {
      studentJoinedAt: "19:59 IST",
      mentorJoinedAt: "20:00 IST",
      completedAt: "21:02 IST"
    },
    authorizedDocuments: [
      {
        id: "doc-4",
        title: "Meera_Iyer_NewGrad_Resume.pdf",
        type: "Resume PDF",
        signedUrlExpiresIn: "Active for report completion (19h remaining)",
        summaryPreview: "2026 CSE graduate; strong fundamentals, nervous during timed live coding."
      }
    ],
    readinessContext: {
      overallScore: 58,
      rubricVersion: "rubric-v3.0",
      lastAssessedDate: "28 Oct 2026",
      coverageLabel: "6 of 8 dimensions assessed",
      dimensions: [
        { dimension: "Technical Skills", score: 3, lastUpdated: "28 Oct 2026", note: "Good array/hashing speed; graph traversal needs structure." },
        { dimension: "Interview Skills", score: 2, lastUpdated: "28 Oct 2026", note: "Jumps into coding before confirming constraints." },
        { dimension: "Confidence", score: 2, lastUpdated: "28 Oct 2026", note: "Freezes briefly when hitting an edge-case bug." }
      ]
    },
    reportStatus: "Report pending",
    reportDueInHours: 19,
    reportId: "RPT-501",
    timeline: [
      { timestamp: "03 Nov 2026, 15:40 IST", event: "Direct booking confirmed after verified payment", actor: "Payment Webhook" },
      { timestamp: "05 Nov 2026, 20:00 IST", event: "Both participants joined on time", actor: "System" },
      { timestamp: "05 Nov 2026, 21:02 IST", event: "Session completed — 48h report SLA timer started", actor: "System" }
    ]
  },
  {
    id: "BK-894",
    bookingRef: "DX-BK-2026-1068",
    serviceId: "S01",
    bookingMode: "Smart Match",
    studentName: "Siddharth Rao (Sample Dev Student)",
    studentSegment: "Student",
    targetRole: "SDE Intern / Full-Stack",
    targetDomain: "Software Engineering",
    sessionGoal: "Review internship resume before December placement drive.",
    scheduledDate: "02 Nov 2026",
    scheduledTime: "11:00 – 11:45 IST",
    durationMinutes: 45,
    status: "Completed",
    paymentStatus: "Verified",
    joinPermittedByServer: false,
    meetingProviderLabel: "Session concluded",
    attendance: {
      studentJoinedAt: "11:00 IST",
      mentorJoinedAt: "11:00 IST",
      completedAt: "11:46 IST"
    },
    authorizedDocuments: [],
    readinessContext: {
      overallScore: 66,
      rubricVersion: "rubric-v3.0",
      lastAssessedDate: "03 Nov 2026",
      coverageLabel: "7 of 8 dimensions assessed",
      dimensions: [
        { dimension: "Resume", score: 4, lastUpdated: "03 Nov 2026", note: "Updated following S01 report v1.0." }
      ]
    },
    reportStatus: "Report delivered",
    reportId: "RPT-500",
    timeline: [
      { timestamp: "02 Nov 2026, 11:46 IST", event: "Session completed", actor: "System" },
      { timestamp: "03 Nov 2026, 09:30 IST", event: "Structured S01 Report v1.0 delivered (21.7h post-session)", actor: "Mentor" }
    ]
  },
  {
    id: "BK-890",
    bookingRef: "DX-BK-2026-1052",
    serviceId: "S06",
    bookingMode: "Direct",
    studentName: "Nikhil Bansal (Sample Dev Student)",
    studentSegment: "Early-career professional",
    targetRole: "Backend Engineer",
    targetDomain: "Software Engineering",
    sessionGoal: "System design mock session.",
    scheduledDate: "31 Oct 2026",
    scheduledTime: "20:00 – 21:00 IST",
    durationMinutes: 60,
    status: "Cancelled",
    paymentStatus: "Refund Completed",
    joinPermittedByServer: false,
    meetingProviderLabel: "Cancelled prior to session",
    attendance: {},
    authorizedDocuments: [],
    readinessContext: {
      overallScore: null,
      rubricVersion: "rubric-v3.0",
      lastAssessedDate: "Not assessed",
      coverageLabel: "Insufficient evidence for composite score",
      dimensions: []
    },
    reportStatus: "Not applicable",
    cancellationNote: "Cancelled by student 4 hours before start (>= 1 hour threshold): 100% full refund processed per PRD 12.1.",
    timeline: [
      { timestamp: "29 Oct 2026, 21:10 IST", event: "Direct booking confirmed", actor: "Payment Webhook" },
      { timestamp: "31 Oct 2026, 15:52 IST", event: "Student cancelled 4h 08m before session (>=1h full refund rule)", actor: "Student" },
      { timestamp: "01 Nov 2026, 11:05 IST", event: "Provider refund completed (100%)", actor: "Payment Webhook" }
    ]
  }
];

export const SEED_REPORTS: SessionReport[] = [
  {
    id: "RPT-501",
    bookingId: "BK-898",
    bookingRef: "DX-BK-2026-1081",
    serviceId: "S10",
    studentName: "Meera Iyer (Sample Dev Student)",
    studentSegment: "Fresh graduate",
    targetRole: "Software Engineer (New Grad)",
    sessionDate: "05 Nov 2026, 20:00 IST",
    status: "Report pending",
    slaRemainingLabel: "19h 15m left (48h SLA)",
    assessmentPurpose: "Evaluate timed algorithmic problem decomposition, Python implementation accuracy, and complexity communication.",
    summary: "Meera solved the medium BFS graph problem accurately once constraints were clarified, and reached a working O(N*W) DP state definition on problem 2. Primary bottleneck is rushing into code before confirming edge cases.",
    rubricScores: [
      { criterionId: "cp1", label: "Problem Decomposition & Pattern Recognition", rating: 4, observation: "Recognized shortest-path unweighted BFS vs weighted Dijkstra trade-off quickly." },
      { criterionId: "cp2", label: "Code Correctness & Edge-Case Dry Run", rating: 3, observation: "Missed disconnected-component check until prompted during dry run." },
      { criterionId: "cp3", label: "Complexity Analysis & Verbalization", rating: 3, observation: "Correct Big-O time, initially understated recursion stack space." }
    ],
    dimensionObservations: [
      { dimension: "Technical Skills", score: 4, observation: "Solid data-structure selection and clean Python idioms." },
      { dimension: "Interview Skills", score: 3, observation: "Improved from baseline 2 → 3 when following a 3-minute upfront constraint checklist." },
      { dimension: "Confidence", score: 3, observation: "Recovered calmly after spotting off-by-one boundary condition." }
    ],
    strengths: [
      "Clean modular helper functions in Python without syntax hesitation",
      "Receptive to interviewer hints and immediately tests with small trace inputs"
    ],
    improvementAreas: [
      "Spend the first 3 minutes writing input bounds, empty/single-node edge cases, and target complexity before coding",
      "Explicitly state auxiliary space (visited set + queue/recursion stack) without waiting for prompt"
    ],
    actionPlan: [
      { id: "ap-1", action: "Practice 8 graph/tree problems enforcing a strict 3-minute written constraint + dry-run protocol before typing code.", priority: "High", timeframe: "Next 7 days" },
      { id: "ap-2", action: "Complete 4 timed 45-minute 2-problem mock sets speaking aloud throughout.", priority: "Medium", timeframe: "Days 8–14" }
    ],
    suggestedNextSteps: [
      { recommendedServiceId: "S06", reason: "Coding fundamentals are at 4/5; next unverified gap for New Grad loops is API/low-level Technical Mock Interview (S06)." }
    ],
    assessmentLimitations: "Reflects single 60-minute Python DSA simulation (rubric-v3.0). Does not assess distributed systems or behavioral competencies and does not guarantee employer shortlisting or hiring outcomes.",
    versions: []
  },
  {
    id: "RPT-499",
    bookingId: "BK-887",
    bookingRef: "DX-BK-2026-1044",
    serviceId: "S02",
    studentName: "Aarav Menon (Sample Dev Student)",
    studentSegment: "Early-career professional",
    targetRole: "SDE-2 Full-Stack",
    sessionDate: "01 Nov 2026, 17:00 IST",
    status: "Revision requested",
    slaRemainingLabel: "Action needed — Operations requested clarification",
    revisionRequestReason: "Please expand Action Item #2 with specific parsing layout fixes for the two-column PDF table noted during the session (prior v1.0 preserved in audit history).",
    assessmentPurpose: "Audit ATS parsing fidelity and keyword alignment against two Bengaluru product-company SDE-2 job descriptions.",
    summary: "Experience quality is strong, but multi-column Figma-exported PDF caused scrambled work-history dates in standard text extractors.",
    rubricScores: [
      { criterionId: "a1", label: "Parsing & Semantic Structure", rating: 2, observation: "Two-column floating text boxes merged company names with skill sidebar." },
      { criterionId: "a2", label: "Taxonomy & Skill Coverage", rating: 4, observation: "Strong TypeScript, React, PostgreSQL, and CI/CD evidence." },
      { criterionId: "a3", label: "Evidence Credibility", rating: 4, observation: "Metrics are specific and defensible." }
    ],
    dimensionObservations: [
      { dimension: "Resume", score: 3, observation: "Content is strong (4/5), held back by parser-hostile layout (2/5)." }
    ],
    strengths: [
      "Quantified latency and bundle-size improvements with credible engineering detail",
      "Authentic match for full-stack TypeScript/Node roles"
    ],
    improvementAreas: [
      "Migrate from floating-box design tool export to single-column semantic document template",
      "Standardize MMM YYYY – MMM YYYY role dates on right margin"
    ],
    actionPlan: [
      { id: "ap-3", action: "Rebuild resume in single-column LaTeX/DOCX-to-PDF layout and verify plain-text copy/paste order.", priority: "High", timeframe: "Within 48 hours" },
      { id: "ap-4", action: "Surface PostgreSQL indexing and API observability bullets in top two roles to match target JDs.", priority: "High", timeframe: "Within 4 days" }
    ],
    suggestedNextSteps: [
      { recommendedServiceId: "S06", reason: "Once single-column resume is finalized, Technical Mock Interview addresses unassessed live system-design dimension." }
    ],
    assessmentLimitations: "Evaluated against standard text-extraction rules and 2 supplied SDE-2 JDs. Employer-specific ATS ranking configurations vary and shortlist outcomes cannot be guaranteed.",
    versions: [
      { version: "v1.0", createdAt: "02 Nov 2026, 14:10 IST", authorName: "Arjun Mehta", changeNote: "Initial post-session report submitted within 48h SLA." }
    ]
  },
  {
    id: "RPT-500",
    bookingId: "BK-894",
    bookingRef: "DX-BK-2026-1068",
    serviceId: "S01",
    studentName: "Siddharth Rao (Sample Dev Student)",
    studentSegment: "Student",
    targetRole: "SDE Intern / Full-Stack",
    sessionDate: "02 Nov 2026, 11:00 IST",
    status: "Report delivered",
    slaRemainingLabel: "Delivered in 21.7h (Within 48h SLA)",
    assessmentPurpose: "Evaluate 1-page campus internship resume clarity, project depth framing, and technical skill organization.",
    summary: "Siddharth has genuine full-stack build experience (campus shuttle tracker used by 400+ students), which was buried beneath generic coursework bullets. Reordering sections immediately elevated signal.",
    rubricScores: [
      { criterionId: "r1", label: "Role & Domain Alignment", rating: 4, observation: "Projects directly demonstrate React, Express, and SQL fundamentals." },
      { criterionId: "r2", label: "Impact & Quantification", rating: 4, observation: "Rewrote 5 bullets during review to highlight active users, query speedups, and uptime." },
      { criterionId: "r3", label: "Structure & Visual Clarity", rating: 4, observation: "Clean 1-page hierarchy after removing high-school trivia." }
    ],
    dimensionObservations: [
      { dimension: "Resume", score: 4, observation: "Progressed from 2/5 → 4/5 with concrete user adoption and architecture specifics." },
      { dimension: "Communication", score: 4, observation: "Explained project trade-offs clearly and concisely." }
    ],
    strengths: [
      "Real deployed campus project with live user telemetry",
      "Clear ownership of database schema and authentication flow"
    ],
    improvementAreas: [
      "Add direct GitHub README architecture diagram link next to flagship project",
      "Remove unverified elementary tool keywords that dilute core stack"
    ],
    actionPlan: [
      { id: "ap-5", action: "Promote Campus Shuttle Tracker to Project #1 with 3 quantified engineering bullets.", priority: "High", timeframe: "Completed / Verify final PDF" },
      { id: "ap-6", action: "Add concise README setup + system diagram for portfolio verification.", priority: "Medium", timeframe: "Within 5 days" }
    ],
    suggestedNextSteps: [
      { recommendedServiceId: "S10", reason: "Resume is now strong (4/5); Technical Skills / DSA coding rounds carry the highest 20% weight for the Student segment." }
    ],
    assessmentLimitations: "Based on 45-minute S01 Resume Review (rubric-v3.0). Does not verify live coding speed and does not guarantee internship shortlists.",
    versions: [
      { version: "v1.0", createdAt: "03 Nov 2026, 09:30 IST", authorName: "Arjun Mehta", changeNote: "Delivered to student portal (21.7 hours post-session)." }
    ]
  }
];

export const SEED_FINANCIAL_LEDGER: FinancialLedgerRecord[] = [
  {
    id: "FIN-301",
    bookingRef: "DX-BK-2026-1081",
    serviceId: "S10",
    studentName: "Meera Iyer",
    completedDate: "05 Nov 2026",
    grossListedPricePaise: 99900,
    studentAppliedDiscountLabel: "Elite Membership 10% (DreamX-funded)",
    studentPaidPaise: 89910,
    mentorCalculationBasisPaise: 99900,
    adjustmentPaise: 0,
    verificationStatus: "Provider Webhook Verified",
    settlementStatus: "Recorded — Awaiting V-01/V-04 Settlement Gate"
  },
  {
    id: "FIN-300",
    bookingRef: "DX-BK-2026-1068",
    serviceId: "S01",
    studentName: "Siddharth Rao",
    completedDate: "02 Nov 2026",
    grossListedPricePaise: 59900,
    studentAppliedDiscountLabel: "Custom 3-Service Bundle 5% (DreamX-funded)",
    studentPaidPaise: 56905,
    mentorCalculationBasisPaise: 59900,
    adjustmentPaise: 0,
    verificationStatus: "Provider Webhook Verified",
    settlementStatus: "Recorded — Awaiting V-01/V-04 Settlement Gate"
  },
  {
    id: "FIN-299",
    bookingRef: "DX-BK-2026-1044",
    serviceId: "S02",
    studentName: "Aarav Menon",
    completedDate: "01 Nov 2026",
    grossListedPricePaise: 79900,
    studentAppliedDiscountLabel: "Pro Membership 5% (DreamX-funded)",
    studentPaidPaise: 75905,
    mentorCalculationBasisPaise: 79900,
    adjustmentPaise: 0,
    verificationStatus: "Provider Webhook Verified",
    settlementStatus: "Recorded — Awaiting V-01/V-04 Settlement Gate"
  },
  {
    id: "FIN-297",
    bookingRef: "DX-BK-2026-1019",
    serviceId: "S06",
    studentName: "Vikram Chawla",
    completedDate: "26 Oct 2026",
    grossListedPricePaise: 99900,
    studentAppliedDiscountLabel: "None (List Price)",
    studentPaidPaise: 99900,
    mentorCalculationBasisPaise: 99900,
    adjustmentPaise: -79920,
    adjustmentReason: "Substantiated post-session connectivity disruption claim within 48h window (80% student refund per PRD 12.1).",
    verificationStatus: "Refund Completed",
    settlementStatus: "Adjusted — Substantiated Claim"
  },
  {
    id: "FIN-295",
    bookingRef: "DX-BK-2026-1052",
    serviceId: "S06",
    studentName: "Nikhil Bansal",
    completedDate: "31 Oct 2026 (Cancelled)",
    grossListedPricePaise: 99900,
    studentAppliedDiscountLabel: "None (List Price)",
    studentPaidPaise: 99900,
    mentorCalculationBasisPaise: 0,
    adjustmentPaise: 0,
    adjustmentReason: "Student cancelled 4h before session (>= 1h rule: 100% student refund).",
    verificationStatus: "Refund Completed",
    settlementStatus: "Cancelled >=1h (100% Student Refund)"
  }
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "N-1",
    title: "Student waiting in session room (BK-901)",
    description: "Priya Nair joined S06 Technical Mock Interview (20:00 IST). Server join authorization is active.",
    timestamp: "2 min ago",
    unread: true,
    category: "booking",
    targetRoute: "sessions",
    targetRecordId: "BK-901"
  },
  {
    id: "N-2",
    title: "Wave 2 Smart Match offer (SM-2026-8836)",
    description: "S01 Resume Review escalated to Wave 2 after 30 minutes. Review preferred IST windows.",
    timestamp: "17 min ago",
    unread: true,
    category: "dispatch",
    targetRoute: "dispatch",
    targetRecordId: "DO-402"
  },
  {
    id: "N-3",
    title: "Report due in 19 hours (DX-BK-2026-1081)",
    description: "Submit S10 Coding Interview report for Meera Iyer within the 48-hour post-session SLA.",
    timestamp: "3 hours ago",
    unread: true,
    category: "report",
    targetRoute: "reports",
    targetRecordId: "RPT-501"
  },
  {
    id: "N-4",
    title: "Additional evidence requested for S09",
    description: "Service reviewer added feedback on your S09 Career Roadmap Session approval request.",
    timestamp: "2 days ago",
    unread: false,
    category: "verification",
    targetRoute: "verification"
  }
];

export const SEED_PROFILE: MentorProfileData = {
  displayName: "Amarveer Verma",
  slug: "amarveer-verma",
  headline: "Staff Software Engineer • Ex-Google & Uber • Distributed Systems",
  bio: "10+ years designing distributed systems, leading hiring bars, and mentoring high-potential candidates across 250+ technical loops.",
  currentRoleLabel: "Staff Software Engineer (Fintech & Cloud Systems)",
  experienceVerificationLabel: "Identity & Professional Experience Verified by DreamX",
  yearsOfExperience: 10,
  domains: ["Software Engineering", "System Design", "Cloud Infrastructure"],
  skills: ["Distributed Systems", "Go", "Java", "PostgreSQL", "Kafka", "System Design"],
  languages: ["English", "Hindi"],
  educationSummary: "B.Tech Computer Science (Gold Medalist)",
  timezone: "Asia/Kolkata (IST)",
  employmentType: "employed",
  verifiedCompany: "Google",
  notifications: {
    inAppDispatch: true,
    emailDigest: true,
    whatsappAlerts: false,
  },
};


export const SEED_TRUST_PILLARS: TrustPillar[] = [
  {
    id: "identity",
    title: "1. Identity Verification",
    status: "Approved",
    requiredEvidence: [
      "Government-issued photo ID check via approved verification flow",
      "Live selfie / liveness match matching applicant legal name"
    ],
    submittedEvidence: [
      "PAN / Aadhaar KYC reference #IDV-9042 (Private — restricted to Verification Reviewer)"
    ],
    submittedAt: "14 Oct 2026, 11:20 IST",
    reviewedAt: "15 Oct 2026, 16:05 IST",
    reviewerFeedback: "Identity match confirmed by Trust & Verification Reviewer (#VR-12).",
    nextAction: "No action required. Identity documents remain private and are never shown on public profiles.",
    policyNote: "Separate from professional experience and service-specific approvals (PRD 9.1)."
  },
  {
    id: "experience",
    title: "2. Professional & Experience Verification",
    status: "Approved",
    requiredEvidence: [
      "Verifiable employment history & role progression in Software Engineering (7+ years)",
      "Supporting artifact (experience letter / redacted compensation or LinkedIn + work-domain signal)"
    ],
    submittedEvidence: [
      "Employment tenure record (Staff Backend Engineer — Bengaluru)",
      "Work-email domain OTP signal (supporting signal only)"
    ],
    submittedAt: "14 Oct 2026, 11:45 IST",
    reviewedAt: "16 Oct 2026, 14:30 IST",
    reviewerFeedback: "Verified 7.5 years of backend systems and technical interviewing experience. Approved public label: \"Experience Verified by DreamX (Software Engineering)\".",
    nextAction: "Maintain accurate role details; update if primary domain changes.",
    policyNote: "Work-email OTP is one supporting signal and never independently approves identity, current employment, or service competence. Public labels never imply employer endorsement."
  }
];

export const SEED_SERVICE_APPROVALS: ServiceApproval[] = [
  {
    serviceId: "S01",
    status: "Approved",
    activeForBookings: true,
    directBookingEnabled: true,
    smartMatchEnabled: true,
    submittedAt: "16 Oct 2026",
    reviewedAt: "17 Oct 2026",
    reviewerNote: "Sample resume critique passed rubric calibration.",
    evidenceSummary: "Submitted 2 redacted engineering resume critiques."
  },
  {
    serviceId: "S02",
    status: "Approved",
    activeForBookings: true,
    directBookingEnabled: true,
    smartMatchEnabled: true,
    submittedAt: "16 Oct 2026",
    reviewedAt: "18 Oct 2026",
    reviewerNote: "Approved for SWE & Data/AI ATS alignment.",
    evidenceSummary: "Hiring rubric experience + JD mapping sample."
  },
  {
    serviceId: "S06",
    status: "Approved",
    activeForBookings: true,
    directBookingEnabled: true,
    smartMatchEnabled: true,
    submittedAt: "16 Oct 2026",
    reviewedAt: "17 Oct 2026",
    reviewerNote: "Strong technical interview calibration (120+ engineering loops conducted).",
    evidenceSummary: "System design & backend interview rubric walkthrough."
  },
  {
    serviceId: "S10",
    status: "Approved",
    activeForBookings: true,
    directBookingEnabled: true,
    smartMatchEnabled: true,
    submittedAt: "16 Oct 2026",
    reviewedAt: "17 Oct 2026",
    reviewerNote: "Approved for DSA & coding execution sessions (Java, Python, TypeScript, Go).",
    evidenceSummary: "Algorithmic evaluation sample."
  },
  {
    serviceId: "S05",
    status: "Under review",
    activeForBookings: false,
    directBookingEnabled: false,
    smartMatchEnabled: false,
    submittedAt: "03 Nov 2026",
    reviewerNote: "Queued with Service Approval Reviewer. Target SLA: 2–3 business days.",
    evidenceSummary: "Submitted hiring-manager behavioral debrief sample."
  },
  {
    serviceId: "S09",
    status: "More information required",
    activeForBookings: false,
    directBookingEnabled: false,
    smartMatchEnabled: false,
    submittedAt: "01 Nov 2026",
    reviewedAt: "04 Nov 2026",
    reviewerNote: "Please upload one sample 60–90 day structured career transition plan showing how readiness dimension weights guide milestone sequencing.",
    evidenceSummary: "Initial mentorship summary note."
  },
  {
    serviceId: "S08",
    status: "Rejected",
    activeForBookings: false,
    directBookingEnabled: false,
    smartMatchEnabled: false,
    submittedAt: "18 Oct 2026",
    reviewedAt: "21 Oct 2026",
    reviewerNote: "Insufficient evidence of multi-band compensation structuring across Product/Data tracks. Eligible to re-apply after 30 days with supporting case examples.",
    evidenceSummary: "Self-reported peer negotiation notes."
  }
];
