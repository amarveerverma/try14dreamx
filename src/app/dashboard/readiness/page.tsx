"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

interface RubricModalData {
  dimensionId: string;
  title: string;
  score: string;
  status: string;
  weight: string;
  assessor: string;
  assessorRole: string;
  deliverableId: string;
  auditDate: string;
  subMetrics: { name: string; score: number; target: number }[];
  mentorNotes: string;
  recommendations: string[];
  sha256: string;
}

const RUBRIC_DETAILS: Record<string, RubricModalData> = {
  "dim-1": {
    dimensionId: "dim-1",
    title: "1. Resume & ATS Readiness",
    score: "4.0 / 5.0",
    status: "Strong",
    weight: "15.8%",
    assessor: "Priya Nair",
    assessorRole: "Ex-Amazon Bar Raiser • Staff Engineer",
    deliverableId: "S01-DEL-8941",
    auditDate: "18 Oct 2024",
    subMetrics: [
      { name: "Keyword Match (Tier-1 SDE-2)", score: 91, target: 85 },
      { name: "Google XYZ Bullet Framing", score: 88, target: 80 },
      { name: "Format & Parser Hygiene", score: 95, target: 90 },
      { name: "Quantified Metrics Density", score: 82, target: 75 },
    ],
    mentorNotes:
      "Candidate reworked all 8 experience bullets to follow strict Google XYZ formula: 'Accomplished [X] as measured by [Y] by doing [Z]'. Identified and removed non-standard table tags that broke Greenhouse parser. Resume is certified for Tier-1 GCC automated ATS gates.",
    recommendations: [
      "Keep technical keyword density aligned with Distributed Systems & Kafka.",
      "Re-audit when moving from 2 YoE to 3 YoE milestone.",
    ],
    sha256: "8f4c919d7e3a09b5a17e089d84c67f892a0149e320f9175402bd1a73bc928410",
  },
  "dim-2": {
    dimensionId: "dim-2",
    title: "2. LinkedIn Optimization",
    score: "3.5 / 5.0",
    status: "Acceptable",
    weight: "10.5%",
    assessor: "Priya Nair",
    assessorRole: "Ex-Amazon Bar Raiser • S03 Audit",
    deliverableId: "S03-DEL-7712",
    auditDate: "20 Oct 2024",
    subMetrics: [
      { name: "Boolean Search Discoverability", score: 78, target: 85 },
      { name: "Featured Code Artifacts & Media", score: 82, target: 80 },
      { name: "Headline CTR Optimization", score: 72, target: 80 },
      { name: "Keyword Association (Recruiter InMail)", score: 75, target: 85 },
    ],
    mentorNotes:
      "Headline updated from generic 'Software Engineer' to 'Backend Engineer @ GCC | High-Concurrency Java, Kafka, Distributed Systems'. InMail inbound index improved by +24% over 14 days. Still missing high-signal deep dive post on Kafka event ordering.",
    recommendations: [
      "Publish 1 technical breakdown post on Kafka partition rebalancing.",
      "Add verified DreamX rubric credentials badge to featured section.",
    ],
    sha256: "3d29ab7814e5f9024c0892be43810a9c805a61d8ef1284a1e941198f16790b21",
  },
  "dim-4": {
    dimensionId: "dim-4",
    title: "4. STAR Behavioral & Leadership",
    score: "4.0 / 5.0",
    status: "Strong",
    weight: "10.5%",
    assessor: "Siddharth Iyer",
    assessorRole: "Director of Engineering, Gojek",
    deliverableId: "S05-SCR-3108",
    auditDate: "23 Oct 2024",
    subMetrics: [
      { name: "Situation / Task Framing Rigor", score: 90, target: 85 },
      { name: "Conflict Resolution Depth", score: 88, target: 80 },
      { name: "Trade-off & Post-Mortem Articulation", score: 85, target: 80 },
      { name: "Ownership & Bias for Action", score: 92, target: 85 },
    ],
    mentorNotes:
      "Outstanding progress in STAR structure. Candidate previously spent 60% of time in 'Situation' backstory. Now cleanly scopes context in 45 seconds, devotes 70% to personal technical agency and conflict mitigation, and closes with quantified production metrics.",
    recommendations: [
      "Practice 1 additional story addressing 'disagree and commit' with product managers.",
      "Prepare a story demonstrating long-term architectural debt remediation.",
    ],
    sha256: "7b401e92d830fca1849102b37ec892015fa76829103847acba20194857183049",
  },
  "dim-5": {
    dimensionId: "dim-5",
    title: "5. Technical Competence & System Design",
    score: "3.8 / 5.0",
    status: "Developing",
    weight: "15.8%",
    assessor: "Rajesh Kannan",
    assessorRole: "Staff Software Engineer • Tier-1 Product Tech",
    deliverableId: "S06-DRILL-PRE",
    auditDate: "Pending Live Drill (25 Oct, 17:30 IST)",
    subMetrics: [
      { name: "Data Ingestion & Event Topology", score: 82, target: 90 },
      { name: "Concurrency & Race Locking (Redlock)", score: 72, target: 85 },
      { name: "Sharding & Split-Brain Mitigation", score: 75, target: 85 },
      { name: "Latency vs Cost Trade-off Framing", score: 78, target: 85 },
    ],
    mentorNotes:
      "Candidate demonstrates solid understanding of core microservices, but hesitated when probed on split-brain Redis cluster edge cases and idempotent payment state machines. Upcoming S06 session will stress-test 100k RPS write-heavy architectures.",
    recommendations: [
      "Review Raft consensus log replication mechanisms.",
      "Attend confirmed live S06 drill on 25 Oct at 17:30 IST.",
    ],
    sha256: "19482039a8c7b6d5e4f3a2b1c0e9d8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1",
  },
  "dim-6": {
    dimensionId: "dim-6",
    title: "6. Interview Acumen & Whiteboard Rigor",
    score: "3.5 / 5.0",
    status: "Acceptable",
    weight: "15.8%",
    assessor: "Siddharth Iyer",
    assessorRole: "Director of Engineering • S05 Assessor",
    deliverableId: "S05-EV-9902",
    auditDate: "23 Oct 2024",
    subMetrics: [
      { name: "Time/Space Complexity Analysis", score: 80, target: 85 },
      { name: "Edge Case Boundary Probing", score: 65, target: 80 },
      { name: "Verbalizing Code Strategy First", score: 75, target: 80 },
      { name: "Testing Under Ambiguity", score: 70, target: 80 },
    ],
    mentorNotes:
      "Solid at standard graph traversals and DP patterns, but tends to dive directly into syntax before articulating edge conditions (integer overflow, empty streams, network timeouts). Recommended module: S10 Algorithmic Coding Sprint.",
    recommendations: [
      "Write edge case test cases BEFORE writing implementation code.",
      "Complete 3 whiteboard mock simulations under tight 35-min constraints.",
    ],
    sha256: "94817a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0e9d8f",
  },
  "dim-7": {
    dimensionId: "dim-7",
    title: "7. Career Planning & Compensation Strategy",
    score: "2.0 / 5.0",
    status: "Critical Gap",
    weight: "21.1%",
    assessor: "DreamX Diagnostic Core Engine v3.0",
    assessorRole: "Automated Provenance & Benchmark Engine",
    deliverableId: "S08-REC-GAP-01",
    auditDate: "12 Oct 2024 (Needs Immediate Sprint)",
    subMetrics: [
      { name: "Market Banding Awareness (Tier-1 SDE-2)", score: 42, target: 85 },
      { name: "ESOP Vesting & Tax Leveling", score: 30, target: 80 },
      { name: "Competing Offer Leverage Scripting", score: 35, target: 85 },
      { name: "Post-Offer Counter Protocol", score: 32, target: 85 },
    ],
    mentorNotes:
      "CRITICAL GAP DETECTED: Candidate has never negotiated total compensation and was unaware of the 1-year cliff vs quarterly vesting schedules at Indian unicorns. High probability of accepting low-ball CTC (₹18-22 LPA) instead of median market band (₹28-34 LPA).",
    recommendations: [
      "Immediately schedule S08 Offer Negotiation & Benchmarking module.",
      "Review DreamX verified SDE-2 compensation ledger for GCCs.",
    ],
    sha256: "5e4f3a2b1c0e9d8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f",
  },
  "dim-8": {
    dimensionId: "dim-8",
    title: "8. Professional Executive Presence",
    score: "3.5 / 5.0",
    status: "Developing",
    weight: "10.5%",
    assessor: "Session Cross-Evaluation",
    assessorRole: "Composite Bar-Raiser Feedback Panel",
    deliverableId: "CMP-PRES-401",
    auditDate: "23 Oct 2024",
    subMetrics: [
      { name: "Conviction in Decisions", score: 74, target: 80 },
      { name: "Stress Resistance & Pushback", score: 76, target: 80 },
      { name: "Active Technical Inquiry", score: 78, target: 80 },
      { name: "Senior Panel Rapport", score: 72, target: 80 },
    ],
    mentorNotes:
      "Candidate displays genuine humility and strong work ethic. Shows mild hesitation when bar-raiser pushes back on architectural trade-offs; needs to defend design choices with concrete latency benchmarks rather than conceding too quickly.",
    recommendations: [
      "Practice phraseology: 'Here is why I chose X over Y based on our p99 SLA constraint...'",
      "Maintain steady vocal tempo under stress-testing questions.",
    ],
    sha256: "c0e9d8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0e9",
  },
};

type TrackKey = "early_career" | "student" | "career_switcher";

interface TrackConfig {
  title: string;
  badge: string;
  weights: {
    career_planning: number;
    technical_design: number;
    resume_ats: number;
    interview_skills: number;
    star_behavioral: number;
    linkedin_brand: number;
    confidence: number;
    portfolio: number;
  };
}

const TRACKS: Record<TrackKey, TrackConfig> = {
  early_career: {
    title: "Early Career (0–2 YoE) • ACTIVE",
    badge: "Active Job Search Track",
    weights: {
      career_planning: 21.1,
      technical_design: 15.8,
      resume_ats: 15.8,
      interview_skills: 15.8,
      star_behavioral: 10.5,
      linkedin_brand: 10.5,
      confidence: 10.5,
      portfolio: 0.0,
    },
  },
  student: {
    title: "Student / Campus",
    badge: "College Placement Track",
    weights: {
      technical_design: 20.0,
      portfolio: 15.0,
      resume_ats: 15.0,
      interview_skills: 15.0,
      star_behavioral: 10.0,
      confidence: 10.0,
      career_planning: 10.0,
      linkedin_brand: 5.0,
    },
  },
  career_switcher: {
    title: "Career Switcher",
    badge: "Domain Transition Track",
    weights: {
      portfolio: 20.0,
      career_planning: 20.0,
      technical_design: 15.0,
      resume_ats: 15.0,
      interview_skills: 10.0,
      star_behavioral: 10.0,
      confidence: 5.0,
      linkedin_brand: 5.0,
    },
  },
};

export default function CareerReadinessVectorPage() {
  const { user } = useAuth();
  const [selectedTrack, setSelectedTrack] = React.useState<TrackKey>("early_career");
  const [isPortfolioExempt, setIsPortfolioExempt] = React.useState(true);
  const [activeRubricModal, setActiveRubricModal] = React.useState<RubricModalData | null>(null);
  const [showJsonModal, setShowJsonModal] = React.useState(false);
  const [copiedJson, setCopiedJson] = React.useState(false);

  // Raw dimension scores (0-5 scale) for Rohan / Candidate
  const candidateScores = React.useMemo(
    () => ({
      resume: 4.0,
      linkedin: 3.5,
      portfolio: isPortfolioExempt ? 0 : 3.5,
      star_behavioral: 4.0,
      technical: 3.8,
      interview: 3.5,
      career_planning: 2.0,
      confidence: 3.5,
    }),
    [isPortfolioExempt]
  );

  // Calculate dynamic overall score based on current track & portfolio exemption
  const compositeScore = React.useMemo(() => {
    const track = TRACKS[selectedTrack];
    let totalScore = 0;
    if (selectedTrack === "early_career" && isPortfolioExempt) {
      // 68 / 100 benchmark
      totalScore =
        (track.weights.career_planning * (candidateScores.career_planning / 5)) +
        (track.weights.technical_design * (candidateScores.technical / 5)) +
        (track.weights.resume_ats * (candidateScores.resume / 5)) +
        (track.weights.interview_skills * (candidateScores.interview / 5)) +
        (track.weights.star_behavioral * (candidateScores.star_behavioral / 5)) +
        (track.weights.linkedin_brand * (candidateScores.linkedin / 5)) +
        (track.weights.confidence * (candidateScores.confidence / 5));
      return Math.round(totalScore);
    } else if (selectedTrack === "student") {
      return 62;
    } else if (selectedTrack === "career_switcher") {
      return 58;
    }
    return 65;
  }, [selectedTrack, isPortfolioExempt, candidateScores]);

  // Construct raw verifiable JSON ledger
  const auditDeckJson = React.useMemo(() => {
    return JSON.stringify(
      {
        engine: "DreamX Vector Core v3.0-PROD",
        schemaVersion: "2024.11-PROD",
        candidateId: user?.id || "DX-CANDIDATE",
        candidateName: user?.name || "Verified Candidate",
        targetRole: "SDE-2 Backend (GCC & Indian Unicorns)",
        evaluationTimestamp: "2024-10-24T14:45:00+05:30",
        compositeIndex: compositeScore,
        diagnosticRoot: 54,
        deltaGained: compositeScore - 54,
        auditIntegrity: "75% (6 of 8 Verified, 1 Pending, 1 Exempt)",
        portfolioExemptionRule: {
          active: isPortfolioExempt,
          prdReference: "PRD §8.3",
          justification: "GCC 1.5 YoE production code verified. 5% reallocated.",
        },
        calibrationTrack: selectedTrack,
        vectorScores: [
          { dimension: "Resume & ATS", score: 4.0, max: 5.0, weight: "15.8%", deliverable: "S01-DEL-8941" },
          { dimension: "LinkedIn Optimization", score: 3.5, max: 5.0, weight: "10.5%", deliverable: "S03-DEL-7712" },
          { dimension: "Portfolio Artifacts", score: isPortfolioExempt ? "EXEMPT" : 3.5, max: 5.0, weight: isPortfolioExempt ? "0.0%" : "5.0%" },
          { dimension: "STAR Behavioral", score: 4.0, max: 5.0, weight: "10.5%", deliverable: "S05-SCR-3108" },
          { dimension: "Technical Competence", score: 3.8, max: 5.0, weight: "15.8%", pending: "S06-DRILL-PRE" },
          { dimension: "Interview Acumen", score: 3.5, max: 5.0, weight: "15.8%", deliverable: "S05-EV-9902" },
          { dimension: "Career & Compensation", score: 2.0, max: 5.0, weight: "21.1%", flag: "CRITICAL_DEFICIT" },
          { dimension: "Executive Presence", score: 3.5, max: 5.0, weight: "10.5%", deliverable: "CMP-PRES-401" },
        ],
        cryptographicProof: {
          rootHash: "sha256:8f4c919d7e3a09b5a17e089d84c67f892a0149e320f9175402bd1a73bc928410",
          privacyPolicy: "Zero-3rd-Party-Access • AES-256 Encrypted",
        },
      },
      null,
      2
    );
  }, [compositeScore, isPortfolioExempt, selectedTrack, user]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(auditDeckJson);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([auditDeckJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DreamX_Readiness_Audit_${user?.id || "DX-8419"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="flex flex-col w-full bg-surface min-h-screen">
      {/* Top Command Context Bar */}
      <div className="w-full bg-surface-container-lowest border-b border-outline-variant/20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-4">
          {/* Breadcrumb & Privacy Shield */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
              <Link href="/dashboard" className="hover:text-primary transition-colors">
                Dashboard
              </Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface font-semibold">Career Readiness Vector Matrix</span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px] tracking-wider font-mono">
                v3.0-PROD
              </span>
            </nav>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/30 text-secondary text-xs font-semibold">
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                lock
              </span>
              <span>100% Private to Candidate • Zero Employer Visibility</span>
            </div>
          </div>

          {/* Title & High-Tier Action Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col max-w-3xl">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight font-heading">
                8-Dimension Career Readiness Vector Matrix &amp; Rubric Audit
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                Deterministic, evidence-informed competency scores derived strictly from accredited 1:1 mentor scorecards and baseline diagnostics (PRD §8). Private by default.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link href="/dashboard/onboarding">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface font-semibold text-xs hover:bg-surface-container transition-all border border-outline-variant/30 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[17px] text-primary">verified</span>
                  <span>Request Re-Assessment</span>
                </button>
              </Link>

              <button
                type="button"
                onClick={() => setShowJsonModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-low text-on-surface font-semibold text-xs hover:bg-surface-container transition-all border border-outline-variant/30 shadow-xs"
              >
                <span className="material-symbols-outlined text-[17px]">download</span>
                <span>Machine Audit Deck (JSON)</span>
              </button>

              <button
                type="button"
                onClick={handleExportPdf}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container text-on-primary font-bold text-xs hover:opacity-95 shadow-xs transition-all"
              >
                <span className="material-symbols-outlined text-[17px]">picture_as_pdf</span>
                <span>Export Verification PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* 1. Hero Index Banner (Bento Matrix) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/30 relative overflow-hidden">
          {/* Ambient decorative aura */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          {/* Module 1: Main Score Module */}
          <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-xl bg-surface-container-low border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                Composite Index (PRD §8)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container text-xs font-bold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                <span>+14 pts gained</span>
              </span>
            </div>

            <div className="flex items-baseline gap-2 my-4">
              <span className="text-5xl font-black text-on-surface tracking-tight font-heading">
                {compositeScore}
              </span>
              <span className="text-xl font-bold text-on-surface-variant font-mono">/ 100</span>
              <span className="ml-2 px-2.5 py-0.5 rounded-lg bg-surface-container text-on-surface text-xs font-semibold">
                {compositeScore >= 80 ? "Exemplary Level" : compositeScore >= 65 ? "Developing Foundation" : "Foundation Stage"}
              </span>
            </div>

            <div>
              <div className="w-full bg-surface-container-highest rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-700"
                  style={{ width: `${compositeScore}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2.5 text-xs text-on-surface-variant font-medium">
                <span>Diagnostic Base: 54</span>
                <span className="text-primary font-bold">Current: {compositeScore}</span>
                <span>Target Benchmark: 85+</span>
              </div>
            </div>
          </div>

          {/* Module 2: Formula & Weight Redistribution Mechanics */}
          <div className="lg:col-span-5 flex flex-col justify-between py-1">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">calculate</span>
                <span>Active Mathematical Formulation</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-on-surface tracking-tight font-heading">
                Readiness Index = ∑(Weight<sub>i</sub> × Score<sub>i</sub> / 5) × 100
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Calibrated strictly for{" "}
                <span className="text-on-surface font-semibold">
                  {TRACKS[selectedTrack].title.replace(" • ACTIVE", "")}
                </span>
                . Weights redistribute dynamically when candidates have documented exemptions.
              </p>
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
              <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">info</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface">PRD §8.3 Redistribution Rule Active</span>
                <p className="text-xs text-on-surface-variant leading-snug mt-0.5">
                  Portfolio dimension marked{" "}
                  <span className="font-semibold text-on-surface">
                    {isPortfolioExempt ? "Exempt" : "Active"}
                  </span>{" "}
                  {isPortfolioExempt
                    ? "(GCC production code verified). Its 5% base allocation has been proportionally scaled over the remaining 7 live vectors."
                    : "(Standard 8-dimension evaluation active with 5% weight allocated to Portfolio Artifacts)."}
                </p>
              </div>
            </div>
          </div>

          {/* Module 3: Verification Audit Coverage Gauge */}
          <div className="lg:col-span-3 flex flex-col justify-between p-5 rounded-xl bg-surface-container-low border border-outline-variant/20">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Audit Integrity
            </span>

            <div className="flex items-center gap-4 my-2">
              {/* Mini SVG Progress Arc */}
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-container-highest"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-secondary"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="75, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <span className="absolute font-bold text-sm text-on-surface font-heading">75%</span>
              </div>

              <div className="flex flex-col">
                <span className="font-bold text-sm text-on-surface leading-tight">6 of 8 Verified</span>
                <span className="text-xs text-on-surface-variant">1 Pending, 1 Exempt</span>
              </div>
            </div>

            <div className="pt-2 border-t border-outline-variant/20 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Last Mentor Audit:</span>
                <span className="text-on-surface font-semibold font-mono">23 Oct 2024</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant">Upcoming Drill:</span>
                <span className="text-primary font-bold">Tomorrow, 17:30 IST</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Segment Calibration Track & Weight Distribution Engine (PRD §8.2) */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-on-surface font-heading">
                Rubric Calibration Track
              </h2>
              <p className="text-xs text-on-surface-variant">
                Dynamic evaluation model calibrated against specific career archetypes.
              </p>
            </div>

            {/* Track Switcher Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-surface-container border border-outline-variant/20">
              {(
                [
                  ["early_career", "Early Career (0–2 YoE) • ACTIVE"],
                  ["student", "Student / Campus"],
                  ["career_switcher", "Career Switcher"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedTrack(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedTrack === key
                      ? "bg-surface-container-lowest text-on-surface shadow-xs"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Weight Matrix Chips Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between text-xs text-on-surface-variant">
              <span className="uppercase tracking-wider font-bold text-on-surface">
                Segment Weight Distribution ({TRACKS[selectedTrack].title.replace(" • ACTIVE", "")} — Total: 100%)
              </span>
              <span className="text-secondary font-semibold">
                {isPortfolioExempt
                  ? "Portfolio (5%) absorbed into active dimensions"
                  : "All 8 dimensions active"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-1">
              <div className="flex flex-col p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <span className="text-[11px] text-on-surface-variant truncate font-medium">Career Planning</span>
                <span className="text-lg font-black text-on-surface font-heading mt-0.5">
                  {TRACKS[selectedTrack].weights.career_planning}%
                </span>
                <span className="text-[10px] text-tertiary font-semibold">Base 20.0%</span>
              </div>

              <div className="flex flex-col p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <span className="text-[11px] text-on-surface-variant truncate font-medium">Technical Design</span>
                <span className="text-lg font-black text-on-surface font-heading mt-0.5">
                  {TRACKS[selectedTrack].weights.technical_design}%
                </span>
                <span className="text-[10px] text-tertiary font-semibold">Base 15.0%</span>
              </div>

              <div className="flex flex-col p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <span className="text-[11px] text-on-surface-variant truncate font-medium">Resume &amp; ATS</span>
                <span className="text-lg font-black text-on-surface font-heading mt-0.5">
                  {TRACKS[selectedTrack].weights.resume_ats}%
                </span>
                <span className="text-[10px] text-tertiary font-semibold">Base 15.0%</span>
              </div>

              <div className="flex flex-col p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <span className="text-[11px] text-on-surface-variant truncate font-medium">Interview Skills</span>
                <span className="text-lg font-black text-on-surface font-heading mt-0.5">
                  {TRACKS[selectedTrack].weights.interview_skills}%
                </span>
                <span className="text-[10px] text-tertiary font-semibold">Base 15.0%</span>
              </div>

              <div className="flex flex-col p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <span className="text-[11px] text-on-surface-variant truncate font-medium">STAR Framing</span>
                <span className="text-lg font-black text-on-surface font-heading mt-0.5">
                  {TRACKS[selectedTrack].weights.star_behavioral}%
                </span>
                <span className="text-[10px] text-tertiary font-semibold">Base 10.0%</span>
              </div>

              <div className="flex flex-col p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <span className="text-[11px] text-on-surface-variant truncate font-medium">LinkedIn Brand</span>
                <span className="text-lg font-black text-on-surface font-heading mt-0.5">
                  {TRACKS[selectedTrack].weights.linkedin_brand}%
                </span>
                <span className="text-[10px] text-tertiary font-semibold">Base 10.0%</span>
              </div>

              <div className="flex flex-col p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <span className="text-[11px] text-on-surface-variant truncate font-medium">Confidence</span>
                <span className="text-lg font-black text-on-surface font-heading mt-0.5">
                  {TRACKS[selectedTrack].weights.confidence}%
                </span>
                <span className="text-[10px] text-tertiary font-semibold">Base 10.0%</span>
              </div>

              <div className={`flex flex-col p-3 rounded-xl border ${isPortfolioExempt ? "bg-surface-container-highest/50 opacity-70 border-dashed border-outline-variant" : "bg-surface-container-low border-outline-variant/20"}`}>
                <span className="text-[11px] text-on-surface-variant truncate font-medium">Portfolio Artifacts</span>
                <span className={`text-lg font-black font-heading mt-0.5 ${isPortfolioExempt ? "line-through text-on-surface-variant" : "text-on-surface"}`}>
                  {isPortfolioExempt ? "0.0%" : "5.0%"}
                </span>
                <span className={`text-[10px] font-bold ${isPortfolioExempt ? "text-error" : "text-secondary"}`}>
                  {isPortfolioExempt ? "Exempt" : "Active"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Highest Weighted Competency Gap Box (Deterministic Recommendation PRD §8.5) */}
        <div className="p-6 rounded-2xl bg-error-container/20 border border-error/20 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-error-container text-error flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[26px]">priority_high</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-error">
                  Highest Weighted Competency Gap
                </span>
                <span className="px-2 py-0.5 rounded-full bg-error-container text-error text-[10px] font-bold">
                  Priority #1
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-on-surface font-heading mt-1">
                Dimension 7: Career Planning &amp; Compensation Strategy (2.0 / 5.0)
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-1 leading-relaxed">
                Carries the single highest segment weight (21.1%). Candidate has not evaluated equity cliff schedules, tax leveling, or counter-offering leverage. Closing this deficit directly increases readiness score by{" "}
                <strong className="text-on-surface font-bold">+12.6 points</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-on-surface-variant block">Target Solution</span>
              <span className="text-xs font-bold text-on-surface">Module S08 Sprint</span>
            </div>
            <Link href="/services/s08-salary-negotiation" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary-container text-on-primary font-bold text-xs hover:bg-primary transition-all shadow-xs"
              >
                Book S08 Sprint (₹664)
              </button>
            </Link>
          </div>
        </div>

        {/* 4. Comprehensive Vector Decomposition (8-Card Grid) */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-on-surface font-heading">
                Comprehensive Vector Decomposition
              </h2>
              <p className="text-xs text-on-surface-variant">
                Fine-grained competency breakdown verified by accredited bar-raisers.
              </p>
            </div>
            <span className="text-xs text-on-surface-variant font-medium">Scale: 1.0 (Deficient) to 5.0 (Exemplary)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* CARD 1: Resume & ATS */}
            <div className="flex flex-col justify-between p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/40 text-secondary text-xs font-bold">
                    4.0 / 5.0 Strong
                  </span>
                  <span className="text-xs text-on-surface-variant font-mono">Wt: 15.8%</span>
                </div>
                <h4 className="text-base font-bold text-on-surface font-heading mt-3">1. Resume &amp; ATS Readiness</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">SDE-2 Distributed Systems profile</p>

                <div className="mt-4 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
                  <div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-on-surface-variant">Keyword Match (SDE-2)</span>
                      <span className="font-bold text-on-surface">91%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-secondary h-1.5 rounded-full" style={{ width: "91%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-on-surface-variant">XYZ Bullet Framing</span>
                      <span className="font-bold text-on-surface">88%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-secondary h-1.5 rounded-full" style={{ width: "88%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-on-surface-variant">Format &amp; Parse Hygiene</span>
                      <span className="font-bold text-on-surface">95%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-secondary h-1.5 rounded-full" style={{ width: "95%" }} />
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-1">
                  <span className="text-[11px] text-on-surface-variant block">Audited By:</span>
                  <span className="text-xs font-bold text-on-surface">Priya Nair (Ex-Amazon Bar Raiser)</span>
                  <span className="text-[11px] text-secondary font-bold block mt-0.5">+1.0 gained in S01 Audit</span>
                </div>
              </div>

              <div className="mt-5 pt-3 -mx-5 -mb-5 p-3 px-5 bg-surface-container-low border-t border-outline-variant/20 rounded-b-2xl flex items-center justify-between">
                <span className="text-xs text-on-surface-variant font-mono">ID: S01-DEL-8941</span>
                <button
                  type="button"
                  onClick={() => setActiveRubricModal(RUBRIC_DETAILS["dim-1"])}
                  className="text-primary hover:underline text-xs font-bold"
                >
                  View Rubric
                </button>
              </div>
            </div>

            {/* CARD 2: LinkedIn Profile */}
            <div className="flex flex-col justify-between p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface text-xs font-bold">
                    3.5 / 5.0 Acceptable
                  </span>
                  <span className="text-xs text-on-surface-variant font-mono">Wt: 10.5%</span>
                </div>
                <h4 className="text-base font-bold text-on-surface font-heading mt-3">2. LinkedIn Optimization</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">Recruiter discovery &amp; indexing</p>

                <div className="mt-4 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
                  <div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-on-surface-variant">Boolean Search Discoverability</span>
                      <span className="font-bold text-on-surface">78%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: "78%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-on-surface-variant">Featured Code Artifacts</span>
                      <span className="font-bold text-on-surface">82%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: "82%" }} />
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-1">
                  <span className="text-[11px] text-on-surface-variant block">Audited By:</span>
                  <span className="text-xs font-bold text-on-surface">Priya Nair (S03 Audit)</span>
                  <span className="text-[11px] text-on-surface-variant block mt-0.5">Needs Kafka system post</span>
                </div>
              </div>

              <div className="mt-5 pt-3 -mx-5 -mb-5 p-3 px-5 bg-surface-container-low border-t border-outline-variant/20 rounded-b-2xl flex items-center justify-between">
                <span className="text-xs text-on-surface-variant font-mono">ID: S03-DEL-7712</span>
                <button
                  type="button"
                  onClick={() => setActiveRubricModal(RUBRIC_DETAILS["dim-2"])}
                  className="text-primary hover:underline text-xs font-bold"
                >
                  View Rubric
                </button>
              </div>
            </div>

            {/* CARD 3: Portfolio & Code Artifacts (EXEMPT) */}
            <div className="flex flex-col justify-between p-5 rounded-2xl bg-surface-container-low/80 border border-outline-variant/30 shadow-xs relative overflow-hidden">
              <div className={isPortfolioExempt ? "opacity-80" : ""}>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-xs font-bold">
                    {isPortfolioExempt ? "N/A Exempt" : "3.5 / 5.0 Active"}
                  </span>
                  <span className="text-xs text-on-surface-variant font-mono">
                    {isPortfolioExempt ? "Wt: 0.0% (5% → ∑)" : "Wt: 5.0%"}
                  </span>
                </div>
                <h4 className="text-base font-bold text-on-surface font-heading mt-3">3. Portfolio Artifacts</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">Public repo &amp; UI showcase</p>

                <div className="mt-4 p-3 rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col gap-1 text-xs text-on-surface-variant">
                  <span className="font-bold text-on-surface">Exemption Justification:</span>
                  <p className="leading-relaxed">
                    Candidate verified 1.5 yrs production codebase at GCC. Separate public portfolio not required for Backend SDE-2 track per PRD §8.3.
                  </p>
                </div>

                <div className="mt-3.5">
                  <span className="text-xs text-secondary font-bold">
                    {isPortfolioExempt ? "Weight redistributed proportionally" : "Standard weight applied"}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 -mx-5 -mb-5 p-3 px-5 bg-surface-container border-t border-outline-variant/20 rounded-b-2xl flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsPortfolioExempt(!isPortfolioExempt)}
                  className="text-primary hover:underline text-xs font-bold"
                >
                  {isPortfolioExempt ? "Re-enable Evaluation" : "Mark as Exempt"}
                </button>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">lock_reset</span>
              </div>
            </div>

            {/* CARD 4: STAR Communication & Behavioral */}
            <div className="flex flex-col justify-between p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/40 text-secondary text-xs font-bold">
                    4.0 / 5.0 Strong
                  </span>
                  <span className="text-xs text-on-surface-variant font-mono">Wt: 10.5%</span>
                </div>
                <h4 className="text-base font-bold text-on-surface font-heading mt-3">4. STAR Behavioral</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">Conflict &amp; leadership principles</p>

                <div className="mt-4 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
                  <div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-on-surface-variant">Situation / Task Framing</span>
                      <span className="font-bold text-on-surface">90%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-secondary h-1.5 rounded-full" style={{ width: "90%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-on-surface-variant">Conflict Resolution Depth</span>
                      <span className="font-bold text-on-surface">88%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-secondary h-1.5 rounded-full" style={{ width: "88%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-on-surface-variant">Trade-off Articulation</span>
                      <span className="font-bold text-on-surface">85%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-secondary h-1.5 rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-1">
                  <span className="text-[11px] text-on-surface-variant block">Audited By:</span>
                  <span className="text-xs font-bold text-on-surface">Siddharth Iyer (Director Eng, Gojek)</span>
                  <span className="text-[11px] text-secondary font-bold block mt-0.5">+1.5 gained in S05 Mock</span>
                </div>
              </div>

              <div className="mt-5 pt-3 -mx-5 -mb-5 p-3 px-5 bg-surface-container-low border-t border-outline-variant/20 rounded-b-2xl flex items-center justify-between">
                <span className="text-xs text-on-surface-variant font-mono">ID: S05-SCR-3108</span>
                <button
                  type="button"
                  onClick={() => setActiveRubricModal(RUBRIC_DETAILS["dim-4"])}
                  className="text-primary hover:underline text-xs font-bold"
                >
                  View Rubric
                </button>
              </div>
            </div>

            {/* CARD 5: Technical Competence (Highlighted) */}
            <div className="flex flex-col justify-between p-5 rounded-2xl bg-surface-container-lowest border-2 border-primary/30 shadow-xs hover:shadow-md transition-shadow ring-2 ring-primary/10">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-tertiary text-xs font-bold">
                    3.8 / 5.0 Developing
                  </span>
                  <span className="text-xs text-on-surface-variant font-mono">Wt: 15.8%</span>
                </div>
                <h4 className="text-base font-bold text-on-surface font-heading mt-3">5. Technical Competence</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">Distributed architectures &amp; databases</p>

                <div className="mt-4 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-on-surface font-bold">Audited Vectors (Pending S06):</span>
                    <span className="text-primary font-bold">Tomorrow</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface text-[11px] font-mono">
                      Kafka Partitioning
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface text-[11px] font-mono">
                      Redlock Locking
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface text-[11px] font-mono">
                      Sharded PostgreSQL
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1.5 leading-snug">
                    Target: Elevate to 4.5+ for Tier-1 GCC threshold.
                  </p>
                </div>

                <div className="mt-3.5 pt-1">
                  <span className="text-[11px] text-on-surface-variant block">Upcoming Assessor:</span>
                  <span className="text-xs font-bold text-on-surface">Rajesh Kannan (Staff SWE)</span>
                  <span className="text-[11px] text-tertiary font-bold block mt-0.5">Session S06 Scheduled</span>
                </div>
              </div>

              <div className="mt-5 pt-3 -mx-5 -mb-5 p-3 px-5 bg-surface-container-low border-t border-outline-variant/20 rounded-b-2xl flex items-center justify-between">
                <span className="text-xs text-primary font-bold">Audit Ready</span>
                <Link href="/dashboard/bookings" className="text-primary hover:underline text-xs font-bold">
                  Join Live Room
                </Link>
              </div>
            </div>

            {/* CARD 6: Interview Acumen */}
            <div className="flex flex-col justify-between p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface text-xs font-bold">
                    3.5 / 5.0 Acceptable
                  </span>
                  <span className="text-xs text-on-surface-variant font-mono">Wt: 15.8%</span>
                </div>
                <h4 className="text-base font-bold text-on-surface font-heading mt-3">6. Interview Acumen</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">Live problem solving &amp; edge cases</p>

                <div className="mt-4 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
                  <div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-on-surface-variant">Complexity Analysis</span>
                      <span className="font-bold text-on-surface">80%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: "80%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-on-surface-variant">Edge Case Boundary Rigor</span>
                      <span className="font-bold text-on-surface">65%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-1">
                  <span className="text-[11px] text-on-surface-variant block">Audited By:</span>
                  <span className="text-xs font-bold text-on-surface">Siddharth Iyer (S05 Mock)</span>
                  <span className="text-[11px] text-on-surface-variant block mt-0.5">Requires S10 Algorithmic drill</span>
                </div>
              </div>

              <div className="mt-5 pt-3 -mx-5 -mb-5 p-3 px-5 bg-surface-container-low border-t border-outline-variant/20 rounded-b-2xl flex items-center justify-between">
                <span className="text-xs text-on-surface-variant font-mono">ID: S05-EV-9902</span>
                <button
                  type="button"
                  onClick={() => setActiveRubricModal(RUBRIC_DETAILS["dim-6"])}
                  className="text-primary hover:underline text-xs font-bold"
                >
                  View Rubric
                </button>
              </div>
            </div>

            {/* CARD 7: Career Planning & Salary Negotiation (GAP) */}
            <div className="flex flex-col justify-between p-5 rounded-2xl bg-error-container/15 border border-error/30 shadow-xs hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-error-container text-error text-xs font-extrabold">
                    2.0 / 5.0 Critical Gap
                  </span>
                  <span className="text-xs text-error font-bold font-mono">Wt: 21.1%</span>
                </div>
                <h4 className="text-base font-bold text-on-surface font-heading mt-3">7. Career Planning &amp; Pay</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">ESOP, banding &amp; counter-offers</p>

                <div className="mt-4 p-3 rounded-xl bg-surface-container-lowest border border-error/20 flex flex-col gap-2">
                  <div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-on-surface-variant">Market Banding Awareness</span>
                      <span className="font-bold text-error">42%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-error h-1.5 rounded-full" style={{ width: "42%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-on-surface-variant">ESOP Vesting &amp; Tax Leveling</span>
                      <span className="font-bold text-error">30%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-error h-1.5 rounded-full" style={{ width: "30%" }} />
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-1">
                  <span className="text-[11px] text-on-surface-variant block">Status:</span>
                  <span className="text-xs font-bold text-error">Never Negotiated CTC</span>
                  <span className="text-[11px] text-on-surface-variant block mt-0.5">High risk of under-leveling at SDE-2</span>
                </div>
              </div>

              <div className="mt-5 pt-3 -mx-5 -mb-5 p-3 px-5 bg-surface-container-lowest border-t border-error/20 rounded-b-2xl flex items-center justify-between">
                <span className="text-xs text-error font-black">Deficit: -3.0 pts</span>
                <Link href="/services/s08-salary-negotiation" className="text-primary hover:underline text-xs font-bold">
                  Start S08
                </Link>
              </div>
            </div>

            {/* CARD 8: Professional Executive Presence */}
            <div className="flex flex-col justify-between p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface text-xs font-bold">
                    3.5 / 5.0 Developing
                  </span>
                  <span className="text-xs text-on-surface-variant font-mono">Wt: 10.5%</span>
                </div>
                <h4 className="text-base font-bold text-on-surface font-heading mt-3">8. Executive Presence</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">Poise under pressure &amp; authority</p>

                <div className="mt-4 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
                  <div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-on-surface-variant">Conviction in Decisions</span>
                      <span className="font-bold text-on-surface">74%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: "74%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-on-surface-variant">Stress Resistance</span>
                      <span className="font-bold text-on-surface">76%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: "76%" }} />
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-1">
                  <span className="text-[11px] text-on-surface-variant block">Composite Assessor:</span>
                  <span className="text-xs font-bold text-on-surface">Session Cross-Evaluation</span>
                  <span className="text-[11px] text-on-surface-variant block mt-0.5">Mild hesitation against bar-raisers</span>
                </div>
              </div>

              <div className="mt-5 pt-3 -mx-5 -mb-5 p-3 px-5 bg-surface-container-low border-t border-outline-variant/20 rounded-b-2xl flex items-center justify-between">
                <span className="text-xs text-on-surface-variant font-mono">ID: CMP-PRES-401</span>
                <button
                  type="button"
                  onClick={() => setActiveRubricModal(RUBRIC_DETAILS["dim-8"])}
                  className="text-primary hover:underline text-xs font-bold"
                >
                  View Rubric
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Cryptographically Verified Assessment Log (PRD §8.4) */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-on-surface font-heading">
                Cryptographically Verified Assessment Log
              </h2>
              <p className="text-xs text-on-surface-variant">
                Full provenance log of diagnostic baselines, mentor rubric inputs, and live delta calculations.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 text-primary hover:underline text-xs font-bold"
            >
              <span className="material-symbols-outlined text-[16px]">history</span>
              <span>Download Raw Audit Ledger</span>
            </button>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low text-on-surface-variant uppercase tracking-wider font-bold border-b border-outline-variant/20">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Audit Timestamp</th>
                  <th className="py-3.5 px-4 sm:px-6">Evaluation Milestone / Service</th>
                  <th className="py-3.5 px-4 sm:px-6">Accredited Assessor</th>
                  <th className="py-3.5 px-4 sm:px-6">Dimensions Impacted</th>
                  <th className="py-3.5 px-4 sm:px-6">Score Movement</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Verification Record</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {/* Row 1 */}
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-4 px-4 sm:px-6 font-mono text-on-surface font-medium">12 Oct 2024</td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="font-bold text-on-surface block">Initial Diagnostic Baseline</span>
                    <span className="text-[11px] text-on-surface-variant">Profile Parser + Diagnostic Test</span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="font-semibold text-on-surface block">DreamX Core Engine v3.0</span>
                    <span className="text-[11px] text-on-surface-variant">Automated Parser Baseline</span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[11px] font-medium">
                      All 8 Dimensions
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="font-bold text-on-surface block text-sm">54 / 100</span>
                    <span className="text-[11px] text-on-surface-variant font-mono">Baseline Root</span>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <Link
                      href="/dashboard/onboarding"
                      className="inline-flex items-center gap-1 text-primary hover:underline font-bold"
                    >
                      <span>Scorecard</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </Link>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-surface-container-low/50 transition-colors bg-surface-container-low/20">
                  <td className="py-4 px-4 sm:px-6 font-mono text-on-surface font-medium">18 Oct 2024</td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="font-bold text-on-surface block">S01: Resume &amp; ATS Bar-Raiser Audit</span>
                    <span className="text-[11px] text-on-surface-variant font-mono">Deliverable: S01-DEL-8941</span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="font-semibold text-on-surface block">Priya Nair</span>
                    <span className="text-[11px] text-on-surface-variant">Ex-Amazon Bar Raiser</span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="px-2 py-0.5 rounded-md bg-secondary-container/40 text-secondary text-[11px] font-bold">
                      Dim 1 (+1.0)
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="font-bold text-secondary block text-sm">60 / 100</span>
                    <span className="text-[11px] text-secondary font-mono">+6 pts</span>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <button
                      type="button"
                      onClick={() => setActiveRubricModal(RUBRIC_DETAILS["dim-1"])}
                      className="inline-flex items-center gap-1 text-primary hover:underline font-bold"
                    >
                      <span>Signed PDF</span>
                      <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
                    </button>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-4 px-4 sm:px-6 font-mono text-on-surface font-medium">23 Oct 2024</td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="font-bold text-on-surface block">S05: Behavioral STAR Framework Drill</span>
                    <span className="text-[11px] text-on-surface-variant font-mono">Deliverable: S05-SCR-3108</span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="font-semibold text-on-surface block">Siddharth Iyer</span>
                    <span className="text-[11px] text-on-surface-variant">Director Eng, Gojek</span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="px-2 py-0.5 rounded-md bg-secondary-container/40 text-secondary text-[11px] font-bold">
                      Dim 4 &amp; 6 (+1.5, +0.5)
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="font-bold text-secondary block text-sm">68 / 100</span>
                    <span className="text-[11px] text-secondary font-mono">+8 pts</span>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <button
                      type="button"
                      onClick={() => setActiveRubricModal(RUBRIC_DETAILS["dim-4"])}
                      className="inline-flex items-center gap-1 text-primary hover:underline font-bold"
                    >
                      <span>Signed PDF</span>
                      <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
                    </button>
                  </td>
                </tr>

                {/* Row 4 (Upcoming) */}
                <tr className="hover:bg-surface-container-low/50 transition-colors bg-primary/5">
                  <td className="py-4 px-4 sm:px-6 font-mono text-primary font-bold">25 Oct (Tomorrow)</td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="font-bold text-on-surface block">S06: Technical Mock Interview &amp; Architecture</span>
                    <span className="text-[11px] text-primary font-semibold">Pending Evaluation Session</span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="font-semibold text-on-surface block">Rajesh Kannan</span>
                    <span className="text-[11px] text-on-surface-variant">Staff Software Engineer</span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-bold">
                      Dim 5 &amp; 6 Live Target
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="font-bold text-primary block text-sm">74 / 100</span>
                    <span className="text-[11px] text-primary font-mono">Target Projection (+6)</span>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <span className="px-2.5 py-1 rounded-lg bg-primary text-on-primary text-[11px] font-bold">
                      Confirmed (17:30)
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. Targeted Sprint Recommendation Bar (PRD §7.3 & §8.5) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>Targeted Readiness Sprint Bundle</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight font-heading mt-1">
              Accelerate to 80+ Readiness with Curated 3-Service Sprint
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 leading-relaxed">
              System-recommended sequence addressing your two lowest scoring vectors simultaneously:{" "}
              <strong className="text-on-surface font-semibold">S06 System Design</strong> +{" "}
              <strong className="text-on-surface font-semibold">S08 Compensation Strategy</strong> +{" "}
              <strong className="text-on-surface font-semibold">S09 Career Roadmap</strong>.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-secondary">check_circle</span>
                <span>5% Platform-Funded Discount</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-secondary">check_circle</span>
                <span>No Discount Stacking Rule Maintained</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-secondary">check_circle</span>
                <span>Projected Delta: +18 pts</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="text-left sm:text-right">
              <span className="text-xs text-on-surface-variant block">
                Standard Price: <span className="line-through font-mono">₹2,297</span>
              </span>
              <span className="text-2xl font-black text-on-surface font-heading">
                ₹2,182{" "}
                <span className="text-xs font-normal text-on-surface-variant">(all-inclusive)</span>
              </span>
            </div>
            <Link href="/membership#bundle" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary-container text-on-primary font-bold text-xs sm:text-sm hover:opacity-95 shadow-xs transition-all whitespace-nowrap"
              >
                Build 3-Service Bundle
              </button>
            </Link>
          </div>
        </div>

        {/* 7. Regulatory Compliance, Methodology & Legal Disclaimers (PRD §2.5, §8.4) */}
        <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col md:flex-row items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[20px]">gavel</span>
          </div>
          <div className="flex flex-col gap-1 text-on-surface-variant text-xs leading-relaxed">
            <span className="font-bold text-on-surface">ASCI &amp; Educational Compliance Disclaimer</span>
            <p>
              Career Readiness scores are deterministic, evidence-backed capability evaluations generated from mentor rubrics and structured assessment diagnostics. Scores reflect demonstrated skills across standard engineering bar-raising dimensions and{" "}
              <strong className="text-on-surface">do not constitute speculative placement or hiring guarantees</strong>{" "}
              under PRD §2.5 guidelines.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-on-surface-variant font-mono text-[11px]">
              <span>Engine: DreamX Vector Core v3.0-PROD</span>
              <span>•</span>
              <span>Hash: sha256:8f4c919d7e3a09b...</span>
              <span>•</span>
              <span>Privacy Policy: Zero-3rd-Party-Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Rubric Inspection Modal */}
      {activeRubricModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-surface-container-lowest max-w-xl w-full rounded-2xl border border-outline-variant/30 shadow-2xl p-6 sm:p-7 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/50 text-secondary text-xs font-bold">
                  {activeRubricModal.status} • Weight: {activeRubricModal.weight}
                </span>
                <h3 className="text-xl font-black text-on-surface font-heading mt-2">
                  {activeRubricModal.title}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {activeRubricModal.deliverableId} • Audited: {activeRubricModal.auditDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveRubricModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Assessor Details */}
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                {activeRubricModal.assessor.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <span className="text-xs font-bold text-on-surface block">
                  {activeRubricModal.assessor}
                </span>
                <span className="text-[11px] text-on-surface-variant block">
                  {activeRubricModal.assessorRole}
                </span>
              </div>
            </div>

            {/* Sub-metrics */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Audited Sub-Metrics
              </span>
              <div className="space-y-2">
                {activeRubricModal.subMetrics.map((sm) => (
                  <div key={sm.name} className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/10">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-on-surface">{sm.name}</span>
                      <span className="text-primary">{sm.score}% / Target: {sm.target}%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-1.5 overflow-hidden">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${sm.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Qualitative Notes */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Bar-Raiser Executive Notes
              </span>
              <p className="text-xs text-on-surface-variant bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/20 leading-relaxed">
                {activeRubricModal.mentorNotes}
              </p>
            </div>

            {/* Recommendations */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Action Items &amp; Next Sprints
              </span>
              <ul className="space-y-1 text-xs text-on-surface-variant">
                {activeRubricModal.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Verifiable Hash Footer */}
            <div className="pt-3 border-t border-outline-variant/20 flex flex-col gap-2">
              <span className="text-[10px] text-on-surface-variant font-mono break-all">
                SHA-256: {activeRubricModal.sha256}
              </span>
              <button
                type="button"
                onClick={() => setActiveRubricModal(null)}
                className="w-full py-2.5 rounded-xl bg-surface-container text-on-surface text-xs font-bold hover:bg-surface-container-high transition-colors"
              >
                Close Rubric Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Machine Audit Deck (JSON) Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-surface-container-lowest max-w-2xl w-full rounded-2xl border border-outline-variant/30 shadow-2xl p-6 sm:p-7 flex flex-col gap-4 max-h-[90vh]">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary text-[10px] font-bold uppercase tracking-wider">
                  Verifiable Cryptographic Proof
                </span>
                <h3 className="text-lg sm:text-xl font-black text-on-surface font-heading mt-1">
                  Candidate Assessment Audit Deck (JSON)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowJsonModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-y-auto max-h-96 font-mono text-xs text-on-surface select-all leading-relaxed">
              <pre className="whitespace-pre">{auditDeckJson}</pre>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyJson}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container text-on-surface text-xs font-bold hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copiedJson ? "check" : "content_copy"}
                </span>
                <span>{copiedJson ? "Copied to Clipboard!" : "Copy Raw JSON"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container text-on-primary text-xs font-bold hover:opacity-95 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Download File (.json)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowJsonModal(false)}
                  className="px-4 py-2 rounded-xl border border-outline-variant/30 text-on-surface text-xs font-bold hover:bg-surface-container"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
