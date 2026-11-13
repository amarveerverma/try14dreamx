"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DimensionItem {
  id: number;
  name: string;
  weight: number; // percentage
  subtitle: string;
  currentLevel: string;
  levelBadge: string;
  tag: string;
  icon: string;
  attachedFile?: string;
  attachedFileSize?: string;
  isGap?: boolean;
}

const INITIAL_DIMENSIONS: DimensionItem[] = [
  {
    id: 1,
    name: "1. Resume & ATS Readiness",
    weight: 15,
    subtitle: "Parsing fidelity, quantified XYZ impact, and ATS score threshold",
    currentLevel: "Standard 2-page tech resume with clear project history, but lacks rigorous Google XYZ formula quantification and keyword optimization for Tier-1 GCC ATS parsers.",
    levelBadge: "3 - Developing",
    tag: "",
    icon: "description",
    attachedFile: "Resume_Candidate_Draft.pdf",
    attachedFileSize: "1.4 MB",
  },
  {
    id: 2,
    name: "2. LinkedIn Profile Optimization",
    weight: 10,
    subtitle: "Recruiter search appearance, featured project artifacts & Boolean discoverability",
    currentLevel: "Complete work and educational timeline, but missing recruiter Boolean keywords (e.g., Spring Boot, Redis, Kafka architecture) and featured media proofs.",
    levelBadge: "3 - Developing",
    tag: "Verified URL Added",
    icon: "share",
  },
  {
    id: 3,
    name: "3. Portfolio & Code Artifacts",
    weight: 5,
    subtitle: "Public repositories, modular microservices, CI/CD and deployment documentation",
    currentLevel: "GitHub repos exist but lack clean modularization, architecture sequence diagrams, containerized Dockerfiles, and deployment READMEs.",
    levelBadge: "2 - Below Expected",
    tag: "",
    icon: "terminal",
  },
  {
    id: 4,
    name: "4. STAR Communication & Behavioral",
    weight: 10,
    subtitle: "Situation-Task-Action-Result structural precision under cross-functional pressure",
    currentLevel: "Comfortable articulating past engineering trade-offs using structured STAR framework. Able to convey conflict resolution and ownership with clarity.",
    levelBadge: "4 - Strong",
    tag: "Solid Strength",
    icon: "record_voice_over",
  },
  {
    id: 5,
    name: "5. Technical Competence & System Design",
    weight: 15,
    subtitle: "Target Scope: SDE-2 Backend (Distributed Systems, Concurrency, Sharding)",
    currentLevel: "Solid mastery in Core Java & Microservices; however, lacks production experience with Redis distributed locks, high-throughput message streaming (Kafka), and Saga distributed transactions.",
    levelBadge: "3 - Developing",
    tag: "Domain Calibrated",
    icon: "developer_board",
  },
  {
    id: 6,
    name: "6. Interview Acumen & Whiteboard Execution",
    weight: 15,
    subtitle: "Algorithmic live coding, edge case defense, and architectural whiteboarding",
    currentLevel: "Fluent with classic LeetCode medium algorithms, but experiences performance anxiety when clarifying ambiguous requirements and scoping system boundaries under timed evaluation.",
    levelBadge: "3 - Developing",
    tag: "Standard Tier",
    icon: "laptop_mac",
  },
  {
    id: 7,
    name: "7. Career Planning & Salary Negotiation",
    weight: 20,
    subtitle: "Offer restructuring, ESOP valuation models, counter-offer protocol",
    currentLevel: "Candidate has never negotiated total compensation (base vs. performance bonuses), lacks understanding of vesting schedules/strike prices, and accepts first offers.",
    levelBadge: "2 - Below Expected / Attention Needed",
    tag: "Primary Competency Gap",
    icon: "payments",
    isGap: true,
  },
  {
    id: 8,
    name: "8. Professional Confidence & Presence",
    weight: 10,
    subtitle: "Imposter syndrome attenuation, senior panel presence, technical conviction",
    currentLevel: "Solid fundamental engineering competence, but routinely doubts eligibility for Tier-1 Unicorns without prior brand name credentials.",
    levelBadge: "3 - Developing",
    tag: "Foundation",
    icon: "psychology",
  },
];

export default function OnboardingWizardPage() {
  const router = useRouter();

  // Dynamic Ratings State (1–5)
  const [ratings, setRatings] = React.useState<Record<number, number>>({
    1: 3,
    2: 3,
    3: 2,
    4: 4,
    5: 3,
    6: 3,
    7: 2,
    8: 3,
  });

  const [isArtifactExempt, setIsArtifactExempt] = React.useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = React.useState(false);

  // Score Calculation
  const calculatedScore = React.useMemo(() => {
    let effectiveWeights: Record<number, number> = {
      1: 15,
      2: 10,
      3: isArtifactExempt ? 0 : 5,
      4: 10,
      5: 15,
      6: 15,
      7: 20,
      8: 10,
    };

    if (isArtifactExempt) {
      // Redistribute the 5% weight proportionally across remaining 7 dimensions
      const totalRemainingWeight = 95;
      const factor = 100 / totalRemainingWeight;
      effectiveWeights = {
        1: 15 * factor,
        2: 10 * factor,
        3: 0,
        4: 10 * factor,
        5: 15 * factor,
        6: 15 * factor,
        7: 20 * factor,
        8: 10 * factor,
      };
    }

    let total = 0;
    Object.keys(effectiveWeights).forEach((idKey) => {
      const id = Number(idKey);
      const score = ratings[id] || 0;
      const weight = effectiveWeights[id];
      total += (weight * score) / 5;
    });

    return Math.min(100, Math.round(total));
  }, [ratings, isArtifactExempt]);

  const setRatingFor = (id: number, val: number) => {
    setRatings((prev) => ({ ...prev, [id]: val }));
  };

  const handleSkip = () => {
    setRatings({
      1: 1,
      2: 1,
      3: 1,
      4: 1,
      5: 1,
      6: 1,
      7: 1,
      8: 1,
    });
  };

  const handleSaveAndLock = () => {
    setIsSavedModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      {/* Top Standalone Header Bar */}
      <header className="sticky top-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-xs">
        <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-on-primary font-bold text-base shadow-xs">
                D
              </span>
              <span className="text-lg font-bold text-on-surface tracking-tight font-heading">
                Dream<span className="text-primary">X</span>
              </span>
            </Link>
            <div className="h-4 w-px bg-outline-variant hidden sm:block" />
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px]">cloud_done</span>
              <span>Auto-Saved</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold" aria-label="Wizard Steps">
            <span className="text-on-surface-variant cursor-default">1. Academics</span>
            <span className="text-on-surface-variant cursor-default">2. Skills</span>
            <span className="text-on-surface-variant cursor-default">3. Preferences</span>
            <span className="text-primary font-bold border-b-2 border-primary pb-1">4. Assessment</span>
            <span className="text-on-surface-variant cursor-default">5. Review</span>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-on-surface-variant hover:text-on-surface text-xs font-bold transition-colors flex items-center gap-1"
            >
              <span>Save &amp; Exit to Dashboard</span>
            </Link>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold shadow-xs">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stepper Progress Header Container */}
      <section className="w-full bg-surface-container-lowest border-b border-outline-variant/30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-5 sm:py-6">
          {/* Top Metatag & Context Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Candidate Profile Provisioning</span>
              </span>
              <span className="text-on-surface-variant text-xs font-medium">
                Pipeline ID: <span className="font-bold text-on-surface font-mono">DX-2025-IND-8941</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant text-xs">
              <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
              <span>Deterministic Audit Mode • Active PRD v3.0 Rule Engine</span>
            </div>
          </div>

          {/* 5-Step Visual Stepper Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Step 1: Completed */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div className="min-w-0">
                <span className="text-secondary text-[10px] uppercase tracking-wider font-bold block">
                  Stage 1 • Completed
                </span>
                <p className="text-xs font-bold text-on-surface truncate font-heading">Career Stage &amp; Segment</p>
                <span className="text-on-surface-variant text-[11px] block truncate">Early Career (0–2 YoE)</span>
              </div>
            </div>

            {/* Step 2: Completed */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div className="min-w-0">
                <span className="text-secondary text-[10px] uppercase tracking-wider font-bold block">
                  Stage 2 • Completed
                </span>
                <p className="text-xs font-bold text-on-surface truncate font-heading">Target Role &amp; Domain</p>
                <span className="text-on-surface-variant text-[11px] block truncate">Backend SDE-2 • GCC</span>
              </div>
            </div>

            {/* Step 3: Completed */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div className="min-w-0">
                <span className="text-secondary text-[10px] uppercase tracking-wider font-bold block">
                  Stage 3 • Completed
                </span>
                <p className="text-xs font-bold text-on-surface truncate font-heading">Situation &amp; Artifacts</p>
                <span className="text-on-surface-variant text-[11px] block truncate">Resume + GitHub synced</span>
              </div>
            </div>

            {/* Step 4: Active Stage */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-primary-container text-on-primary shadow-sm border border-primary">
              <div className="w-7 h-7 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                4
              </div>
              <div className="min-w-0">
                <span className="text-on-primary-container text-[10px] uppercase tracking-wider font-bold block">
                  Stage 4 • Active Step
                </span>
                <p className="text-xs font-bold text-on-primary truncate font-heading">8-Dimension Baseline</p>
                <span className="text-on-primary-container text-[11px] block truncate">In Progress (8 of 8)</span>
              </div>
            </div>

            {/* Step 5: Upcoming Stage */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low/60 opacity-80 border border-outline-variant/10">
              <div className="w-7 h-7 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center shrink-0 font-bold text-xs">
                5
              </div>
              <div className="min-w-0">
                <span className="text-on-surface-variant text-[10px] uppercase tracking-wider block font-semibold">
                  Stage 5 • Upcoming
                </span>
                <p className="text-xs font-bold text-on-surface truncate font-heading">Deterministic Roadmap</p>
                <span className="text-on-surface-variant text-[11px] block truncate">Gap Discovery &amp; S01-S10</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dual-Column Assessment Workspace */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: The 8 Diagnostic Dimensions (8 Cols) */}
          <section className="lg:col-span-8 flex flex-col gap-6">
            {/* Header & Segment Weight Banner */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-xs border border-outline-variant/30">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide">
                  Step 4 of 5 • Diagnostic Rubric Assessment
                </span>
                <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  <span className="font-semibold">Track: Early Career (0–2 YoE)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight font-heading mb-2">
                8-Dimension Career Readiness Baseline
              </h1>
              <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-4">
                Establish your verifiable starting point across eight industry-defined competencies. Your self-evaluation maps deterministically to targeted sprint modules (S01–S10) without speculative black-box scoring. Private by default.
              </p>

              {/* Calibrated Weight Table Strip */}
              <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-on-surface font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">scale</span>
                    <span>Segment Weight Calibration Matrix (PRD §8.2)</span>
                  </span>
                  <span className="text-xs text-secondary font-bold">Normalized to 100%</span>
                </div>
                <p className="text-on-surface-variant text-xs leading-relaxed">
                  Technical Competence (15%) • Resume/ATS (15%) • Interview Acumen (15%) • Career Planning (20%) • Communication (10%) • LinkedIn (10%) • Confidence (10%) • Artifacts (5%).
                </p>
              </div>
            </div>

            {/* Rubric Explanation Legend */}
            <div className="p-4 rounded-xl bg-surface-container-low/70 flex flex-wrap items-center justify-between gap-3 border border-outline-variant/20">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider font-mono">
                Evaluation Anchors:
              </span>
              <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-error" /> 1: Major Deficit
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-outline" /> 2: Below Expected
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary" /> 3: Foundation / Developing
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-secondary" /> 4: Strong
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-secondary" /> 5: Exemplary
                </span>
              </div>
            </div>

            {/* 8 DIMENSION CARDS */}
            <div className="flex flex-col gap-5">
              {INITIAL_DIMENSIONS.map((dim) => {
                const currentRating = ratings[dim.id] || 3;
                const isExempt = dim.id === 3 && isArtifactExempt;

                return (
                  <article
                    key={dim.id}
                    id={`card-dim-${dim.id}`}
                    className={`p-6 rounded-2xl bg-surface-container-lowest shadow-xs border transition-all hover:shadow-md relative overflow-hidden ${
                      dim.isGap
                        ? "border-error/40 ring-1 ring-error/20"
                        : "border-outline-variant/30"
                    } ${isExempt ? "opacity-60" : ""}`}
                  >
                    {dim.isGap && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-error" />}

                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
                            dim.isGap ? "bg-error/10 text-error" : "bg-primary/10 text-primary"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[22px]">{dim.icon}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-base sm:text-lg font-bold text-on-surface font-heading">
                              {dim.name}
                            </h2>
                            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface text-[11px] font-bold">
                              Weight: {dim.weight}% {dim.isGap ? "(Highest)" : ""}
                            </span>
                          </div>
                          <span className="text-on-surface-variant text-xs">{dim.subtitle}</span>
                        </div>
                      </div>

                      {/* Right Tag / Attached file / Exemption toggle */}
                      <div className="flex items-center gap-2">
                        {dim.attachedFile && (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface text-xs font-semibold border border-outline-variant/20">
                            <span className="material-symbols-outlined text-[16px] text-primary">attach_file</span>
                            <span className="truncate max-w-[150px]">{dim.attachedFile}</span>
                            <span className="text-on-surface-variant text-[11px]">({dim.attachedFileSize})</span>
                          </div>
                        )}

                        {dim.id === 3 && (
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-lg select-none hover:bg-surface-container-high transition-colors">
                            <input
                              type="checkbox"
                              checked={isArtifactExempt}
                              onChange={(e) => setIsArtifactExempt(e.target.checked)}
                              className="w-4 h-4 rounded text-primary focus:ring-0"
                            />
                            <span>Mark as Exempt (Redistribute 5%)</span>
                          </label>
                        )}

                        {dim.tag && (
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                              dim.isGap
                                ? "bg-error/10 text-error"
                                : dim.tag === "Solid Strength"
                                ? "bg-secondary/15 text-secondary"
                                : "bg-surface-container text-on-surface"
                            }`}
                          >
                            {dim.isGap && (
                              <span className="material-symbols-outlined text-[14px]">priority_high</span>
                            )}
                            {dim.tag === "Solid Strength" && (
                              <span className="material-symbols-outlined text-[14px]">trending_up</span>
                            )}
                            <span>{dim.tag}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Descriptive Anchor Context */}
                    <div className="p-3.5 rounded-xl bg-surface-container mb-4 text-xs leading-relaxed">
                      <p className="text-on-surface">
                        <span
                          className={`font-bold mr-1 ${
                            dim.isGap
                              ? "text-error"
                              : currentRating >= 4
                              ? "text-secondary"
                              : "text-primary"
                          }`}
                        >
                          Current Level ({currentRating} - {dim.levelBadge}):
                        </span>
                        {dim.currentLevel}
                      </p>
                      {dim.isGap && (
                        <div className="mt-2 text-xs font-bold text-primary flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px]">arrow_circle_right</span>
                          <span>Maps directly to deterministic module S08 (Offer Negotiation Playbook).</span>
                        </div>
                      )}
                      {dim.id === 3 && isArtifactExempt && (
                        <span className="text-on-surface-variant text-[11px] mt-1 block">
                          Exemption rule active: 5% weight redistributed proportionally across applicable dimensions per PRD §8.3.
                        </span>
                      )}
                    </div>

                    {/* Score Button Radios (1-5) */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider font-mono">
                        Self Assessment:
                      </span>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((scoreVal) => {
                          const isSelected = currentRating === scoreVal;
                          return (
                            <button
                              key={scoreVal}
                              type="button"
                              onClick={() => setRatingFor(dim.id, scoreVal)}
                              className={`w-10 h-10 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer border ${
                                isSelected
                                  ? "bg-primary text-on-primary border-primary shadow-sm ring-2 ring-primary/20 scale-105"
                                  : "bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant/20"
                              }`}
                            >
                              {scoreVal}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Right Column: Real-Time Dynamic Baseline Computation & Deterministic Next Action (4 Cols Sticky) */}
          <aside className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-20">
            {/* Score Overview Card */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-md border border-outline-variant/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold font-mono">
                  Readiness Metric
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {calculatedScore >= 75 ? "Proficient Band" : "Foundation Band"}
                </span>
              </div>

              {/* Large Score Figure & Ring */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <div className="text-4xl sm:text-5xl font-extrabold text-on-surface leading-none tracking-tight font-heading font-mono">
                    {calculatedScore}
                    <span className="text-lg text-on-surface-variant font-normal">/100</span>
                  </div>
                  <p className="text-on-surface-variant text-xs mt-1 font-semibold">Weighted baseline index</p>
                </div>

                {/* Compact Radial Progress Chart */}
                <div className="w-16 h-16 relative flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle
                      className="text-surface-container stroke-current"
                      cx="18"
                      cy="18"
                      fill="none"
                      r="15.5"
                      strokeWidth="3"
                    />
                    <circle
                      className="text-primary stroke-current transition-all duration-300"
                      cx="18"
                      cy="18"
                      fill="none"
                      r="15.5"
                      strokeDasharray="97.38"
                      strokeDashoffset={97.38 - (97.38 * calculatedScore) / 100}
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-on-surface font-mono">
                    {calculatedScore}%
                  </span>
                </div>
              </div>

              {/* Formula Box */}
              <div className="p-3 rounded-xl bg-surface-container-low text-on-surface-variant text-xs mb-6 border border-outline-variant/20">
                <div className="flex items-center gap-1.5 font-bold text-on-surface mb-0.5">
                  <span className="material-symbols-outlined text-[15px] text-primary">function</span>
                  <span>Deterministic Algorithm:</span>
                </div>
                <code className="text-[11px] font-mono text-primary font-bold">
                  Baseline = Σ(Weight × Score / 5) × 100
                </code>
              </div>

              {/* 8-Vector Mini Horizon Sparkline Breakdown */}
              <div className="flex flex-col gap-2.5 mb-6">
                <span className="text-xs font-bold text-on-surface uppercase tracking-wider font-mono">
                  Dimension Breakdown
                </span>

                {[
                  { name: "1. Resume & ATS", id: 1 },
                  { name: "2. LinkedIn Profile", id: 2 },
                  { name: "3. Artifacts / Code", id: 3 },
                  { name: "4. STAR Behavioral", id: 4 },
                  { name: "5. Tech / Sys Design", id: 5 },
                  { name: "6. Whiteboard Acumen", id: 6 },
                  { name: "7. Salary & Planning", id: 7, isGap: true },
                  { name: "8. Confidence", id: 8 },
                ].map((vec) => {
                  const rating = ratings[vec.id] || 3;
                  const pct = (rating / 5) * 100;
                  return (
                    <div key={vec.id} className="flex items-center justify-between text-xs">
                      <span
                        className={`truncate max-w-[170px] ${
                          vec.isGap ? "text-error font-bold" : "text-on-surface-variant"
                        }`}
                      >
                        {vec.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-surface-container rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              vec.isGap ? "bg-error" : rating >= 4 ? "bg-secondary" : "bg-primary"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span
                          className={`font-mono text-[11px] w-6 text-right font-bold ${
                            vec.isGap ? "text-error" : "text-on-surface"
                          }`}
                        >
                          {rating}/5
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Deterministic Gap Callout Box */}
              <div className="p-4 rounded-xl bg-error-container/40 border border-error/20 flex flex-col gap-2 mb-6">
                <div className="flex items-center gap-2 text-on-error-container font-bold text-xs sm:text-sm">
                  <span className="material-symbols-outlined text-[18px]">emergency</span>
                  <span>Identified Growth Vector</span>
                </div>
                <p className="text-xs text-on-surface leading-relaxed">
                  Dimension 7 (Career Planning &amp; Negotiation) represents your highest weighted deficit (20% weight, score {ratings[7] || 2}.0).
                </p>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-on-error-container">
                  <span className="material-symbols-outlined text-[13px]">bolt</span>
                  <span>Zero Speculative Hype: Algorithmic mapping is 100% deterministic per PRD §8.5.</span>
                </div>
              </div>

              {/* Suggested Stage 5 Sprints */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-on-surface uppercase tracking-wider font-mono">
                  Suggested Stage 5 Sprints
                </span>

                <Link
                  href="/services/s08-salary-negotiation"
                  className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-between gap-3 border border-outline-variant/20 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-primary text-on-primary font-mono text-[10px] font-bold">
                        S08
                      </span>
                      <p className="text-xs font-bold text-on-surface truncate">Offer &amp; Salary Negotiation</p>
                    </div>
                    <span className="text-on-surface-variant text-[11px] block mt-0.5 truncate">
                      Tier-1 GCC Compensation Benchmarks
                    </span>
                  </div>
                  <span className="text-xs text-primary font-bold font-mono shrink-0">₹699</span>
                </Link>

                <Link
                  href="/services/s06-technical-mock"
                  className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-between gap-3 border border-outline-variant/20 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface font-mono text-[10px] font-bold">
                        S06
                      </span>
                      <p className="text-xs font-bold text-on-surface truncate">Backend System Mock</p>
                    </div>
                    <span className="text-on-surface-variant text-[11px] block mt-0.5 truncate">
                      Distributed Locks &amp; Sharding Scenarios
                    </span>
                  </div>
                  <span className="text-xs text-primary font-bold font-mono shrink-0">₹999</span>
                </Link>
              </div>
            </div>

            {/* Tier-1 GCC Alignment Context */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-xs border border-outline-variant/30 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-secondary-container/40 text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-on-surface font-heading">
                  Tier-1 Calibration Target
                </h3>
                <p className="text-on-surface-variant text-xs mt-1 leading-relaxed">
                  Rubrics match actual SDE-2 bar benchmarks observed at Walmart Global Tech, Goldman Sachs Hyderabad, and Swiggy backend teams.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom Fixed Actions & Privacy Strip */}
        <div className="mt-12 pt-6">
          <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-md border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left: Back Action */}
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to Step 3 (Situation &amp; Artifacts)</span>
            </button>

            {/* Right: Primary Action CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSkip}
                className="px-4 py-2.5 rounded-xl bg-transparent hover:bg-surface-container text-on-surface-variant hover:text-on-surface text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Skip Baseline (Set to 0 / Unassessed)
              </button>
              <button
                type="button"
                onClick={handleSaveAndLock}
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Save &amp; Lock Baseline Assessment</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Explicit Privacy / Zero-Exploitation Guarantee Footnote */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-center text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-[16px] text-secondary">lock</span>
            <span>
              Readiness vectors are 100% private by default under DreamX Candidate Trust Shield. Baseline self-assessments are never shared with prospective employers or recruiters without explicit opt-in verification.
            </span>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {isSavedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-outline-variant/30 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-container/40 text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">verified</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface font-heading">Baseline Assessment Locked!</h3>
                <span className="text-xs text-on-surface-variant font-mono">Score: {calculatedScore}/100 Calculated</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Your 8-dimension readiness starting point has been calibrated and recorded to your candidate ledger under Pipeline ID <code className="font-mono text-xs font-bold text-primary">DX-2025-IND-8941</code>.
            </p>

            <div className="p-3.5 bg-surface-container-low rounded-xl text-xs space-y-1.5 border border-outline-variant/20">
              <div className="font-bold text-on-surface">Recommended Next Action:</div>
              <div className="text-on-surface-variant">
                Address Dimension 7 with <strong>S08: Offer &amp; Salary Negotiation</strong> or book a technical simulation drill.
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex-1 py-3 rounded-xl bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Return to Dashboard</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Strip */}
      <footer className="w-full bg-surface-container-low py-6 border-t border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-[16px] text-secondary">lock</span>
            <span>256-bit Encrypted Candidate Onboarding • Verified Evaluation Pipeline</span>
          </div>
          <div className="text-on-surface-variant text-xs">
            © 2025 DreamX Career Acceleration Ecosystem. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
