"use client";

import * as React from "react";
import Link from "next/link";

export default function CareerJourneyPage() {
  const [scopeModal, setScopeModal] = React.useState(false);

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="flex flex-col w-full bg-surface min-h-screen">
      {/* Top Breadcrumb & Metadata */}
      <div className="w-full bg-surface-container-low border-b border-outline-variant/20 px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 text-on-surface-variant font-medium">
          <Link href="/dashboard" className="hover:text-primary transition-colors">
            Dashboard
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-semibold">Career Journey &amp; Milestones</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[10px] font-bold tracking-wide">
            <span className="material-symbols-outlined text-[12px]">verified</span>
            <span>PRD §8.5 DETERMINISTIC PROGRESSION</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-medium">
            Target: SDE-2 Backend • 0-2 YoE Track
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/onboarding">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container text-xs font-semibold border border-outline-variant/30 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-outline">edit_note</span>
              <span>Update Career Target</span>
            </button>
          </Link>

          <button
            type="button"
            onClick={handleExportPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-xs font-bold shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">download_for_offline</span>
            <span>Export Journey PDF</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-8">
        {/* Header Title */}
        <div className="flex flex-col gap-1 max-w-4xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight font-heading">
            Career Progression Journey &amp; Milestone Ledger
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            An evidence-grounded, sequential progression from diagnostic baseline to offer negotiation. Milestones unlock strictly through verified mentor deliverables and accredited rubrics — never through purchases or vanity completion.
          </p>
        </div>

        {/* 1. Metric Summary Bento Cards (4-Column) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Overall Journey */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Overall Journey
              </span>
              <span className="inline-flex items-center gap-1 text-on-secondary-container bg-secondary-container px-2 py-0.5 rounded-full text-[10px] font-bold">
                Stage 3 of 5
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-extrabold text-on-surface font-heading">60%</span>
                <span className="text-xs text-on-surface-variant font-medium">Complete</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 h-2 w-full">
                <div className="bg-secondary rounded-full" />
                <div className="bg-secondary rounded-full" />
                <div className="bg-primary rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary-container w-2/3" />
                </div>
                <div className="bg-surface-container-high rounded-full" />
                <div className="bg-surface-container-high rounded-full" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant pt-1 border-t border-outline-variant/10">
              <span className="material-symbols-outlined text-[15px] text-primary">pending_actions</span>
              <span className="truncate">Next audit: S06 Technical Mock</span>
            </div>
          </div>

          {/* Card 2: Readiness Movement */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Readiness Movement
              </span>
              <span className="inline-flex items-center gap-0.5 text-secondary text-xs font-bold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                <span>+14 pts</span>
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-on-surface font-heading">68</span>
                <span className="text-sm font-semibold text-on-surface-variant font-mono">/ 100</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Band: <strong className="text-on-surface">Developing Foundation</strong>
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant pt-1 border-t border-outline-variant/10">
              <span className="material-symbols-outlined text-[15px]">history</span>
              <span>Baseline 54/100 (Oct 12)</span>
            </div>
          </div>

          {/* Card 3: Verified Proofs */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Verified Proofs
              </span>
              <span className="material-symbols-outlined text-[18px] text-secondary">verified</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-on-surface font-heading">8</span>
                <span className="text-sm font-semibold text-on-surface-variant font-mono">/ 14 Cleared</span>
              </div>
              <p className="text-xs text-secondary font-bold mt-0.5">100% Evidence-Backed</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant pt-1 border-t border-outline-variant/10">
              <span className="material-symbols-outlined text-[15px]">lock_open</span>
              <span>0 speculative unlocks permitted</span>
            </div>
          </div>

          {/* Card 4: Estimated Completion */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-xs flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Estimated Completion
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
                On Schedule
              </span>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-on-surface font-heading">
                Dec 15, 2024
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">+12 days pacing buffer</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant pt-1 border-t border-outline-variant/10">
              <span className="material-symbols-outlined text-[15px] text-tertiary">speed</span>
              <span>2.1 verified sprints / week</span>
            </div>
          </div>
        </div>

        {/* 2. Split Layout: Roadmap & Active Stage Console */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Column: 5-Stage Guided Acceleration Roadmap (7 cols) */}
          <div className="xl:col-span-7 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-on-surface font-heading">
                  Guided Acceleration Roadmap
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Strict chronological dependency pipeline per PRD §8.5
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-primary font-bold">
                <span className="material-symbols-outlined text-[16px]">shield</span>
                <span>Audit Track Active</span>
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {/* Stage 01: Diagnostic Baseline */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant/30 shadow-xs flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold">
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-outline uppercase">STAGE 01</span>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                          Completed • Oct 12, 2024
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-on-surface font-heading mt-0.5">
                        Diagnostic Baseline &amp; Rubric Setup
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-outline font-semibold">DX-BASE-8941</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Establish 8-dimension starting rubric across 0-2 YoE Backend competencies. Calibrated initial starting baseline at 54/100 across 20% Career Planning, 15% System Design, and 15% Distributed Concurrency.
                </p>
                <div className="bg-surface-container-low rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs border border-outline-variant/10">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-secondary">assignment_turned_in</span>
                    <span className="font-medium text-on-surface">Baseline Scorecard generated (Automated ATS Ingestion + Algorithmic Benchmark)</span>
                  </div>
                  <Link href="/dashboard/readiness" className="text-primary hover:underline font-bold flex items-center gap-1">
                    <span>View Audit</span>
                    <span className="material-symbols-outlined text-[14px]">launch</span>
                  </Link>
                </div>
              </div>

              {/* Stage 02: Narrative & Profile Alignment */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant/30 shadow-xs flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold">
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-outline uppercase">STAGE 02</span>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                          Completed • Oct 18, 2024
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-on-surface font-heading mt-0.5">
                        Narrative &amp; Profile Alignment
                      </h3>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-secondary text-xs font-bold">
                    +6 pts delta
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Surpassed Tier-1 recruiter ATS benchmarks (91% keyword coverage). Restructured Go/Java asynchronous messaging projects to highlight throughput gains and distributed lock safety.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-surface-container-low rounded-xl p-3 flex items-center justify-between border border-outline-variant/10">
                    <div className="flex items-center gap-2 truncate">
                      <span className="material-symbols-outlined text-[18px] text-secondary">description</span>
                      <span className="font-semibold text-on-surface truncate">Resume v2.4 (Signed PDF)</span>
                    </div>
                    <span className="font-bold text-on-surface shrink-0 ml-2">8.4/10</span>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-3 flex items-center justify-between border border-outline-variant/10">
                    <div className="flex items-center gap-2 truncate">
                      <span className="material-symbols-outlined text-[18px] text-secondary">link</span>
                      <span className="font-semibold text-on-surface truncate">LinkedIn Inbound Audit</span>
                    </div>
                    <span className="text-secondary font-bold shrink-0 ml-2">Verified</span>
                  </div>
                </div>
              </div>

              {/* Stage 03: Technical & Architectural Simulation (ACTIVE STAGE) */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border-2 border-primary/30 shadow-md flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold shadow-xs">
                      03
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-primary uppercase">CURRENT ACTIVE STAGE</span>
                        <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[10px] font-bold">
                          Sprint Target: Oct 27
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold text-on-surface font-heading mt-0.5">
                        Technical &amp; Architectural Simulation
                      </h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-surface-container text-xs font-bold text-on-surface shrink-0">
                    2 of 3 Cleared (66%)
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Validating distributed systems execution, concurrency limits, and behavioral ownership. Must clear bar-raising evaluations from Senior/Staff GCC panelists before offer negotiation unlocks.
                </p>

                {/* Sub-items */}
                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/10 text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
                      <div className="flex flex-col truncate">
                        <span className="font-bold text-on-surface truncate">S05 Behavioral STAR Drill</span>
                        <span className="text-[11px] text-on-surface-variant">Siddharth Iyer • Deliverable #DEL-SCR-3108</span>
                      </div>
                    </div>
                    <span className="font-bold text-secondary shrink-0 ml-2">+8 pts</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-primary-fixed/25 border border-primary/20 text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="material-symbols-outlined text-[18px] text-primary animate-pulse">radio_button_checked</span>
                      <div className="flex flex-col truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-on-surface truncate">S06 Technical Mock: Distributed Systems</span>
                          <span className="px-1.5 py-0.2 rounded bg-primary text-on-primary text-[9px] font-bold">TOMORROW</span>
                        </div>
                        <span className="text-[11px] text-on-surface-variant truncate">
                          Rajesh Kannan (Staff SDE) • Tomorrow 07:30 PM IST
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-primary shrink-0 ml-2">Threshold: ≥ 4.0</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low opacity-75 border border-outline-variant/10 text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="material-symbols-outlined text-[18px] text-outline">hourglass_empty</span>
                      <div className="flex flex-col truncate">
                        <span className="font-medium text-on-surface truncate">Whiteboard Edge-Case Defense Scorecard</span>
                        <span className="text-[11px] text-outline">Unlocks following S06 deliverable attestation</span>
                      </div>
                    </div>
                    <span className="text-outline font-semibold shrink-0 ml-2">Required: ≥ 4.2</span>
                  </div>
                </div>
              </div>

              {/* Stage 04: Compensation Modeling & Offer Negotiation (LOCKED) */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant/20 shadow-xs flex flex-col gap-3 opacity-90">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container text-outline flex items-center justify-center text-xs font-bold">
                      <span className="material-symbols-outlined text-[16px]">lock</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-outline uppercase">STAGE 04</span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-medium">
                          Unlocks Post Stage 03 Verification
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-on-surface font-heading mt-0.5">
                        Compensation Modeling &amp; Offer Negotiation
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-outline">Sprint Target: Nov 10</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Prerequisite: Technical mock competence score ≥ 3.8/5.0. Will cover Bangalore SDE-2 banding (₹32L–₹44L CTC), equity cliff &amp; strike price analysis, and dual counter-offer timing.
                </p>
                <div className="bg-surface-container-low rounded-xl p-3 flex items-center justify-between border border-outline-variant/10 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-[18px] text-outline">event_available</span>
                    <span className="text-on-surface-variant truncate">
                      Reserved Sprint: S08 Salary Negotiation Strategy (Smart Match: Arishta Sengupta)
                    </span>
                  </div>
                  <span className="text-primary font-bold shrink-0 ml-2">Scheduled</span>
                </div>
              </div>

              {/* Stage 05: Placement Verification & Final Milestone (LOCKED) */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant/20 shadow-xs flex flex-col gap-3 opacity-80">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container text-outline flex items-center justify-center text-xs font-bold">
                      <span className="material-symbols-outlined text-[16px]">lock</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-outline uppercase">STAGE 05</span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-medium">
                          Final Attestation
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-on-surface font-heading mt-0.5">
                        Placement Verification &amp; Credential Ledger
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-outline">Target: Dec 15</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Cryptographically signed Career Readiness Attestation with SHA-256 verification hash and mentor sign-offs, deposited into institutional portal for candidate lifetime verification.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Active Stage Console & Focus Card (5 cols) */}
          <div className="xl:col-span-5 flex flex-col gap-6">
            {/* Active Execution Console Card */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm p-5 sm:p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 bg-surface-container-low -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 p-5 sm:p-6 rounded-t-2xl border-b border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping" />
                  <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                    Stage 03 Active Console
                  </span>
                </div>
                <span className="text-[11px] font-bold bg-primary-container text-on-primary px-2.5 py-0.5 rounded-full">
                  S06 In Progress
                </span>
              </div>

              {/* Next Session Countdown Panel */}
              <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3 border border-outline-variant/20">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-on-surface-variant uppercase text-[10px]">
                    Immediate Scheduled Hurdle
                  </span>
                  <span className="text-primary font-bold">18h 45m remaining</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-surface-container-highest flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px] text-primary">terminal</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h4 className="text-sm font-bold text-on-surface font-heading leading-tight">
                      Distributed Architecture &amp; Concurrency Mock
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Assessor: Rajesh Kannan (Staff Software Engineer)
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">calendar_today</span> Oct 25
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">schedule</span> 19:30 - 20:30 IST
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled
                    className="flex-1 py-2 px-3 rounded-xl bg-surface-container text-on-surface-variant cursor-not-allowed text-xs font-semibold text-center"
                  >
                    Join Room (Unlocks 15m prior)
                  </button>
                  <button
                    type="button"
                    onClick={() => setScopeModal(true)}
                    className="py-2 px-3 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors text-xs font-bold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">schema</span>
                    <span>Scope</span>
                  </button>
                </div>
              </div>

              {/* Rubric Targets for S06 */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Evaluation Rubric Targets
                </span>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-on-surface">Distributed Lock Sharding &amp; Deadlocks</span>
                      <span className="text-primary font-bold">Target: ≥ 4.0 / 5.0</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "80%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-on-surface">Message Queue Idempotency &amp; Backoff</span>
                      <span className="text-primary font-bold">Target: ≥ 4.0 / 5.0</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "75%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-on-surface">Database Partitioning &amp; Query Optimization</span>
                      <span className="text-primary font-bold">Target: ≥ 3.8 / 5.0</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "70%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Previous Observation Note */}
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-on-surface">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">comment</span>
                  <span>Feedback from S05 STAR Drill (Oct 22)</span>
                </div>
                <p className="text-on-surface-variant italic leading-relaxed">
                  &ldquo;Candidate exhibits sound technical ownership under pushback. Strengthen metrics on cross-service tail latency (p99) reductions when answering system failure prompts.&rdquo; — Siddharth Iyer
                </p>
              </div>
            </div>

            {/* Deterministic Recommendation Box (PRD §7.3 & §8.5) */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  <span>Deterministic Recommendation</span>
                </span>
                <span className="text-on-surface-variant font-medium">Lowest: Career (2.0/5.0)</span>
              </div>
              <h4 className="text-base font-bold text-on-surface font-heading">
                S08 Negotiation &amp; Equity Valuation Sprint
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Your rubric pinpoints offer valuation as your primary leverage gap. Pre-locking S08 with an active GCC Compensation Director will activate post-S06 clearance.
              </p>
              <div className="p-3 rounded-xl bg-primary-fixed/20 border border-primary/20 flex items-center justify-between gap-3 mt-1">
                <div className="flex flex-col text-xs">
                  <span className="font-bold text-on-primary-fixed">Custom Bundle Benefit</span>
                  <span className="text-on-surface-variant text-[11px]">5% platform subsidy active • Zero coupons</span>
                </div>
                <Link href="/services/s08-salary-negotiation">
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-colors shrink-0 shadow-xs"
                  >
                    Confirm S08 Slot
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Verifiable Evidence & Milestone Log Ledger (PRD §8.4, §16) */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-on-surface font-heading">
                Verifiable Evidence Ledger
              </h2>
              <p className="text-xs text-on-surface-variant">
                All milestone unlocks are cryptographically tied to verified mentor deliverable scorecards
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-surface-container text-xs font-semibold text-on-surface border border-outline-variant/20">
              <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
              <span>SHA-256 Ledger Verified</span>
            </span>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant uppercase tracking-wider font-bold border-b border-outline-variant/20">
                    <th className="py-3 px-4">Milestone ID</th>
                    <th className="py-3 px-4">Stage</th>
                    <th className="py-3 px-4">Competency Vector</th>
                    <th className="py-3 px-4">Deliverable Ref</th>
                    <th className="py-3 px-4">Accredited Assessor</th>
                    <th className="py-3 px-4">Evidence Hash</th>
                    <th className="py-3 px-4 text-right">Ledger Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold">MS-03-01</td>
                    <td className="py-3.5 px-4 font-semibold">Stage 03</td>
                    <td className="py-3.5 px-4">Behavioral Conviction (STAR)</td>
                    <td className="py-3.5 px-4 font-mono text-primary font-semibold">DEL-SCR-3108</td>
                    <td className="py-3.5 px-4">Siddharth Iyer (VP Eng)</td>
                    <td className="py-3.5 px-4 font-mono text-outline text-[11px]">8f3b...99c4</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                        <span className="material-symbols-outlined text-[13px]">check</span> Verified
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold">MS-02-02</td>
                    <td className="py-3.5 px-4 font-semibold">Stage 02</td>
                    <td className="py-3.5 px-4">ATS Ingestion &amp; Profile Alignment</td>
                    <td className="py-3.5 px-4 font-mono text-primary font-semibold">DEL-8941</td>
                    <td className="py-3.5 px-4">Priya Nair (Principal Recruiter)</td>
                    <td className="py-3.5 px-4 font-mono text-outline text-[11px]">4e12...bb71</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                        <span className="material-symbols-outlined text-[13px]">check</span> Verified
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold">MS-01-01</td>
                    <td className="py-3.5 px-4 font-semibold">Stage 01</td>
                    <td className="py-3.5 px-4">Diagnostic Baseline Benchmark</td>
                    <td className="py-3.5 px-4 font-mono text-primary font-semibold">BASE-DX-8941</td>
                    <td className="py-3.5 px-4">DreamX Platform Ingestion Engine</td>
                    <td className="py-3.5 px-4 font-mono text-outline text-[11px]">9a70...6201</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                        <span className="material-symbols-outlined text-[13px]">check</span> Ingested
                      </span>
                    </td>
                  </tr>

                  <tr className="bg-primary-fixed/15 hover:bg-primary-fixed/25 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">MS-03-02</td>
                    <td className="py-3.5 px-4 font-bold text-primary">Stage 03</td>
                    <td className="py-3.5 px-4 font-medium">Distributed Concurrency &amp; Sharding</td>
                    <td className="py-3.5 px-4 font-mono text-on-surface font-semibold">DEL-BK-90241</td>
                    <td className="py-3.5 px-4">Rajesh Kannan (Staff SDE)</td>
                    <td className="py-3.5 px-4 font-mono text-outline text-[11px]">Audit Pending</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary text-on-primary text-[11px] font-bold">
                        <span className="material-symbols-outlined text-[13px] animate-spin">refresh</span> Evaluation Active
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 4. Statutory & ASCI Compliance Notice Footer (PRD §2.5) */}
        <div className="p-4 rounded-xl bg-surface-container-low text-on-surface-variant flex items-start gap-3 border border-outline-variant/20">
          <span className="material-symbols-outlined text-[20px] text-outline shrink-0 mt-0.5">policy</span>
          <div className="flex flex-col gap-1 text-xs">
            <span className="font-bold text-on-surface uppercase tracking-wide">
              DreamX Institutional Governance &amp; Regulatory Safeguard (PRD §2.5 / ASCI Guidelines)
            </span>
            <p className="leading-relaxed">
              Progression markers, readiness movements, and stage unlocks reflect documented candidate skill demonstrations evaluated against standardized industry rubrics by accredited mentors. DreamX does not offer speculative guarantees, guaranteed placement timelines, or artificial score inflation. Milestone verification hashes are maintained on an immutable ledger to protect student integrity and placement credibility.
            </p>
          </div>
        </div>
      </div>

      {/* S06 Scope Modal */}
      {scopeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl border border-outline-variant/30 shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Pre-Session Scope</span>
                <h3 className="text-lg font-bold text-on-surface font-heading mt-0.5">
                  S06 Architecture &amp; Concurrency Drill
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setScopeModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs text-on-surface-variant">
              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <span className="font-bold text-on-surface block mb-1">Target Scenario</span>
                <p>High-throughput payment gateway event streaming with idempotency key generation, Redis cluster split-brain edge cases, and Raft consensus replication.</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                <span className="font-bold text-on-surface block mb-1">Key Evaluation Rubrics</span>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Requirements discovery &amp; non-functional bounds (p99 latency vs cost)</li>
                  <li>Data modeling: Sharded PostgreSQL vs distributed document stores</li>
                  <li>Failure scenarios &amp; circuit breaker mechanics</li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setScopeModal(false)}
              className="w-full py-2.5 rounded-xl bg-primary-container text-on-primary font-bold text-xs hover:bg-primary transition-colors"
            >
              Close Scope
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
