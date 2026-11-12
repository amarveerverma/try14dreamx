"use client";

import * as React from "react";
import Link from "next/link";

type DeliverableFilter = "all" | "delivered" | "pending" | "archived";

interface ClarificationForm {
  reference: string;
  category: string;
  query: string;
}

export default function CandidateReportsPage() {
  const [filter, setFilter] = React.useState<DeliverableFilter>("all");
  const [search, setSearch] = React.useState("");
  const [clarificationModal, setClarificationModal] = React.useState(false);
  const [clarificationForm, setClarificationForm] = React.useState<ClarificationForm>({
    reference: "S05 - Behavioral STAR & Leadership Drill (Ref: DX-BK-88402)",
    category: "Rubric Score Discrepancy",
    query: "",
  });
  const [submittingClarification, setSubmittingClarification] = React.useState(false);
  const [clarificationSuccess, setClarificationSuccess] = React.useState(false);

  // Checkbox states for S05 action items
  const [actionItem3, setActionItem3] = React.useState(false);

  const handleClarificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingClarification(true);
    setTimeout(() => {
      setSubmittingClarification(false);
      setClarificationSuccess(true);
      setTimeout(() => {
        setClarificationSuccess(false);
        setClarificationModal(false);
        setClarificationForm({ ...clarificationForm, query: "" });
      }, 1500);
    }, 1000);
  };

  const handleDownloadZip = () => {
    alert("Compiling signed PDF deliverables and cryptographic SHA-256 verification ledger into ZIP bundle...");
  };

  return (
    <div className="flex flex-col w-full bg-surface min-h-screen">
      {/* Top Breadcrumb & Metadata Header */}
      <div className="w-full bg-surface-container-low border-b border-outline-variant/20 px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 text-on-surface-variant font-medium">
          <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-semibold">Deliverables &amp; Reports</span>
          <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold tracking-wide uppercase">
            PRD V3.0 Audited
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-secondary font-bold">
          <span className="w-2 h-2 rounded-full bg-secondary" />
          <span>Verified Artifact Ledger Active</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-8">
        {/* Title & Primary Action Controls */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div className="flex flex-col gap-1 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
              <span className="text-xs text-secondary font-bold uppercase tracking-wider">
                Verified Artifact Ledger
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight font-heading">
              Career Deliverables &amp; Post-Session Scorecards
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Verifiable mentor scorecards, actionable career roadmaps, and cryptographic audit reports delivered within the strict 48-hour SLA under institutional nodal account escrow.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setClarificationModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors text-xs font-semibold flex items-center gap-2 border border-outline-variant/30 shadow-xs"
            >
              <span className="material-symbols-outlined text-outline text-[18px]">help_outline</span>
              <span>Request Correction / Clarification</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadZip}
              className="px-4 py-2.5 rounded-xl bg-primary-container text-on-primary hover:bg-primary transition-colors text-xs font-bold flex items-center gap-2 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">archive</span>
              <span>Download Audit Bundle (ZIP)</span>
            </button>
          </div>
        </div>

        {/* 1. SLA & Telemetry Metrics Grid (4 Bento Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 flex flex-col justify-between shadow-xs">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Total Delivered Reports
              </span>
              <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  task_alt
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-on-surface font-heading tracking-tight">
                  2 Delivered
                </span>
                <span className="text-xs font-bold text-secondary">100%</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
                <span>100% Verified Rubrics (PRD §11.2)</span>
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 flex flex-col justify-between shadow-xs">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                In-Flight Deliverable
              </span>
              <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px] animate-pulse">hourglass_top</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-on-surface font-heading tracking-tight">
                  1 Active
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary text-[10px] font-bold">
                  S06 Live
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">timer</span>
                <span>SLA Countdown: 38h 15m left</span>
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 flex flex-col justify-between shadow-xs">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Average Turnaround
              </span>
              <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[18px]">speed</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-on-surface font-heading tracking-tight">
                  37.5 hrs
                </span>
                <span className="text-xs font-bold text-secondary">-10.5h SLA margin</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
                <span>Target &lt;48h • 100% SLA Adherence</span>
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 flex flex-col justify-between shadow-xs">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Escrow Protection
              </span>
              <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined text-[18px]">lock_clock</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-on-surface font-heading tracking-tight">
                80% Protection
              </div>
              <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">account_balance</span>
                <span>Auto Nodal refund if &gt;48h elapsed</span>
              </p>
            </div>
          </div>
        </div>

        {/* 2. Controls & Filter Bar */}
        <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                filter === "all"
                  ? "bg-primary-container text-on-primary font-bold shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              All Deliverables (3)
            </button>
            <button
              type="button"
              onClick={() => setFilter("delivered")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                filter === "delivered"
                  ? "bg-primary-container text-on-primary font-bold shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              Delivered &amp; Signed (2)
            </button>
            <button
              type="button"
              onClick={() => setFilter("pending")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                filter === "pending"
                  ? "bg-primary-container text-on-primary font-bold shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              Pending Delivery (1)
            </button>
            <button
              type="button"
              onClick={() => setFilter("archived")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap opacity-60 ${
                filter === "archived"
                  ? "bg-primary-container text-on-primary font-bold shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              Archived / Prior (0)
            </button>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="relative w-full md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-2 text-outline text-[18px]">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hash, mentor, service..."
                className="w-full h-8 pl-9 pr-3 rounded-xl bg-surface-container-low text-xs text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary border border-outline-variant/20"
              />
            </div>
          </div>
        </div>

        {/* 3. Deliverables List */}
        <div className="flex flex-col gap-6">
          {/* ITEM 1: S05 BEHAVIORAL DRILL REPORT (DELIVERED) */}
          {(filter === "all" || filter === "delivered") && (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              {/* Card Top Bar */}
              <div className="px-6 py-3.5 bg-surface-container-low border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                    <span>DELIVERED • VERIFIED</span>
                  </span>
                  <div className="h-3 w-px bg-surface-container-high hidden sm:block" />
                  <span className="text-on-surface font-bold">SERVICE S05</span>
                  <span className="text-on-surface-variant font-mono">Ref: DX-BK-88402</span>
                  <span className="text-on-surface-variant font-mono hidden md:inline">ID: DEL-SCR-3108</span>
                </div>
                <div className="flex items-center gap-1.5 text-secondary font-bold">
                  <span className="material-symbols-outlined text-[16px]">schedule_send</span>
                  <span>Delivered in 41 hrs (Within 48h SLA)</span>
                </div>
              </div>

              {/* Card Core Body */}
              <div className="p-6 flex flex-col gap-5">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  <div className="flex items-start gap-3.5">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-container-high">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFwT_lWCj3MY1fUvQwCt60GOsyZcmQ7bycUkStrpOErk_JjcPIVsDfuaHxupzI2B44holByg2iQgSMz0p2w-Xq2Pze_3zFuMmEwZOcFKuwW0iezSgfGxBSaFhczEjZjxpHBuuFmwbnUHS9spLSEMYuai-oEUN1flfAzdWfLoskAs3XUqYHJBUW_sISzVJ4IqP9PDK3clyNrf5m3VnwLRs5F_c1qITHetQa9__2EE9R"
                        alt="Siddharth Iyer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-base sm:text-lg font-bold text-on-surface font-heading">
                        Behavioral STAR Framework &amp; Leadership Drill Report
                      </h2>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-xs">
                        <span className="font-bold text-on-surface">Siddharth Iyer</span>
                        <span className="text-outline">•</span>
                        <span className="text-on-surface-variant">Director of Engineering, Gojek • Tier-1 Behavioral Bar Raiser</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-on-surface-variant">
                        <span>Session: 23 Oct 2024</span>
                        <span>•</span>
                        <span className="text-secondary font-semibold">Delivered: 25 Oct 2024 at 11:20 AM IST</span>
                      </div>
                    </div>
                  </div>

                  {/* Score Module */}
                  <div className="flex items-center gap-3.5 bg-surface-container-low border border-outline-variant/20 p-3.5 rounded-xl shrink-0 self-start">
                    <div className="flex flex-col items-center px-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-primary font-heading">7.8</span>
                        <span className="text-xs text-on-surface-variant font-bold">/ 10</span>
                      </div>
                      <span className="px-2 py-0.2 rounded-full bg-primary-fixed text-primary text-[10px] font-bold uppercase mt-0.5">
                        Strong Band
                      </span>
                    </div>
                    <div className="h-8 w-px bg-outline-variant/30" />
                    <div className="flex flex-col text-xs">
                      <span className="text-secondary font-bold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[15px]">trending_up</span>
                        <span>+8 pts</span>
                      </span>
                      <span className="text-on-surface-variant text-[11px]">8-D Readiness Gain</span>
                    </div>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-on-surface font-bold uppercase tracking-wider text-[11px]">
                    <span className="material-symbols-outlined text-primary text-[17px]">rate_review</span>
                    <span>Evaluator Executive Summary</span>
                  </div>
                  <p className="text-on-surface leading-relaxed italic">
                    &ldquo;Strong situational grounding in cross-functional conflict resolution during high-throughput outages. Candidate exhibited high emotional intelligence when challenged on ownership boundaries. Prime opportunity to elevate quantitative trade-off metrics (specifically latency vs consistency trade-offs) inside the STAR &lsquo;Result&rsquo; articulation to match Amazon L6 / Google L5 expectations.&rdquo;
                  </p>
                </div>

                {/* 2 Column: Dimension Impacts & Action Items */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
                  {/* Left: Rubric Impacts */}
                  <div className="lg:col-span-5 flex flex-col gap-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                      Calibrated Rubric Impacts
                    </span>
                    <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-on-surface">STAR Behavioral Articulation</span>
                        <span className="text-primary">4.0 / 5.0</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                        <div className="h-full bg-primary-container rounded-full" style={{ width: "80%" }} />
                      </div>
                      <span className="text-[11px] text-secondary font-semibold flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[13px]">add_circle</span>
                        <span>Contributed +1.5 pts to Readiness Index</span>
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-on-surface">Executive Communication &amp; Cadence</span>
                        <span className="text-primary">4.0 / 5.0</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                        <div className="h-full bg-primary-container rounded-full" style={{ width: "80%" }} />
                      </div>
                      <span className="text-[11px] text-secondary font-semibold flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[13px]">add_circle</span>
                        <span>Contributed +1.0 pts to Readiness Index</span>
                      </span>
                    </div>
                  </div>

                  {/* Right: Concrete Action Items */}
                  <div className="lg:col-span-7 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                        Post-Session Mentor Action Items
                      </span>
                      <span className="text-[11px] text-secondary font-bold">
                        {actionItem3 ? "3 of 3 Completed" : "2 of 3 Completed"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                        <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                          check_box
                        </span>
                        <div className="flex flex-col">
                          <span className="text-on-surface-variant line-through">
                            Restructure &lsquo;Order Service Migration&rsquo; story using 60% result emphasis and explicit P99 latency gains.
                          </span>
                          <span className="text-[10px] text-secondary font-semibold mt-0.5">Verified on resume v2.4</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                        <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                          check_box
                        </span>
                        <div className="flex flex-col">
                          <span className="text-on-surface-variant line-through">
                            Remove redundant background context on company org chart in 2-minute introductory elevator pitch.
                          </span>
                          <span className="text-[10px] text-secondary font-semibold mt-0.5">Pitch duration trimmed to 1m 45s</span>
                        </div>
                      </div>

                      <label className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:bg-surface-container cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={actionItem3}
                          onChange={(e) => setActionItem3(e.target.checked)}
                          className="mt-0.5 rounded accent-primary shrink-0"
                        />
                        <div className="flex flex-col">
                          <span className={`font-medium ${actionItem3 ? "line-through text-on-surface-variant" : "text-on-surface"}`}>
                            Prepare Amazon LP &lsquo;Dive Deep&rsquo; counter-example demonstrating database index optimization &amp; lock contention resolution.
                          </span>
                          <span className={`text-[10px] mt-0.5 font-bold ${actionItem3 ? "text-secondary" : "text-error"}`}>
                            {actionItem3 ? "Candidate draft verified!" : "Pending candidate draft submission"}
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-3.5 bg-surface-container-low border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 font-mono text-on-surface-variant">
                  <span className="material-symbols-outlined text-[15px] text-outline">verified_user</span>
                  <span>SHA-256: 0x9a8f2c37e1b...d94</span>
                  <span className="text-secondary font-sans font-bold">• Audit Intact</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link href="/dashboard/readiness">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container text-xs font-semibold flex items-center gap-1.5 border border-outline-variant/20 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">data_object</span>
                      <span>Machine JSON</span>
                    </button>
                  </Link>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container text-xs font-semibold flex items-center gap-1.5 border border-outline-variant/20 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-secondary text-[16px]">download</span>
                    <span>Signed PDF (v2.1)</span>
                  </button>

                  <Link href="/dashboard/readiness">
                    <button
                      type="button"
                      className="px-4 py-1.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>View Web Scorecard</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ITEM 2: S01 RESUME REVIEW & ATS AUDIT (DELIVERED) */}
          {(filter === "all" || filter === "delivered") && (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              {/* Card Top Bar */}
              <div className="px-6 py-3.5 bg-surface-container-low border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                    <span>DELIVERED • VERIFIED</span>
                  </span>
                  <div className="h-3 w-px bg-surface-container-high hidden sm:block" />
                  <span className="text-on-surface font-bold">SERVICE S01</span>
                  <span className="text-on-surface-variant font-mono">Ref: DX-BK-86119</span>
                  <span className="text-on-surface-variant font-mono hidden md:inline">ID: DEL-8941</span>
                </div>
                <div className="flex items-center gap-1.5 text-secondary font-bold">
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  <span>Delivered in 34 hrs (Fast Turnaround)</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col gap-5">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  <div className="flex items-start gap-3.5">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-container-high">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0d8qdVD_QD9aBZg4cqr_5iQdgM0XAihtc5bmjbHvwjtoPjI56RuXeIbZHlEvmjGwSADA9fzudTZitv_fI8SVSJMVkOnL5XNGWAaBa9gQhGOhTFxZtDfNVvkdGO1NxvUP54btJ7oDXOWTKkK47TYONCn2U9jZa_mJ-l1gf7AaBwyAy1Cmy19DEapddQ5yb_HRC7HUc5-OprTXpmABGW6JE6pnW2_dPm99X-UoSn_oH"
                        alt="Priya Nair"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-base sm:text-lg font-bold text-on-surface font-heading">
                        Resume Review &amp; ATS Bar-Raiser Audit
                      </h2>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-xs">
                        <span className="font-bold text-on-surface">Priya Nair</span>
                        <span className="text-outline">•</span>
                        <span className="text-on-surface-variant">Ex-Amazon Bar Raiser • Senior Technical Recruiter</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-on-surface-variant">
                        <span>Session: 18 Oct 2024</span>
                        <span>•</span>
                        <span className="text-secondary font-semibold">Delivered: 19 Oct 2024 at 08:45 PM IST</span>
                      </div>
                    </div>
                  </div>

                  {/* Score Module */}
                  <div className="flex items-center gap-3.5 bg-surface-container-low border border-outline-variant/20 p-3.5 rounded-xl shrink-0 self-start">
                    <div className="flex flex-col items-center px-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-primary font-heading">8.4</span>
                        <span className="text-xs text-on-surface-variant font-bold">/ 10</span>
                      </div>
                      <span className="px-2 py-0.2 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase mt-0.5">
                        Tier-1 Ready
                      </span>
                    </div>
                    <div className="h-8 w-px bg-outline-variant/30" />
                    <div className="flex flex-col text-xs">
                      <span className="text-secondary font-bold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[15px]">trending_up</span>
                        <span>+6 pts</span>
                      </span>
                      <span className="text-on-surface-variant text-[11px]">Resume &amp; ATS Readiness</span>
                    </div>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-on-surface font-bold uppercase tracking-wider text-[11px]">
                    <span className="material-symbols-outlined text-primary text-[17px]">verified</span>
                    <span>Evaluator Executive Summary</span>
                  </div>
                  <p className="text-on-surface leading-relaxed italic">
                    &ldquo;ATS keyword parsing achieved 91% match threshold for SDE-2 Backend profiles. Bullet points successfully re-anchored into XYZ formula (Accomplished [X] as measured by [Y], by doing [Z]). Verified inclusion of distributed systems paradigms (Kafka, gRPC, Redis pub/sub) without keyword stuffing.&rdquo;
                  </p>
                </div>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col">
                    <span className="text-on-surface-variant text-[11px]">ATS Compatibility Score</span>
                    <span className="text-base font-bold text-on-surface mt-0.5">91% Compatible</span>
                    <span className="text-[11px] text-secondary font-semibold mt-0.5">Parses cleanly on Greenhouse &amp; Lever</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col">
                    <span className="text-on-surface-variant text-[11px]">Quantified Metric Ratio</span>
                    <span className="text-base font-bold text-on-surface mt-0.5">85% of Bullets</span>
                    <span className="text-[11px] text-secondary font-semibold mt-0.5">Exceeds 70% institutional target</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col">
                    <span className="text-on-surface-variant text-[11px]">Formatting &amp; Length</span>
                    <span className="text-base font-bold text-on-surface mt-0.5">1-Page Single Column</span>
                    <span className="text-[11px] text-secondary font-semibold mt-0.5">Standardized US/IN Tech format</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-3.5 bg-surface-container-low border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 font-mono text-on-surface-variant">
                  <span className="material-symbols-outlined text-[15px] text-outline">verified_user</span>
                  <span>SHA-256: 0x4f19bc892a0...e81</span>
                  <span className="text-secondary font-sans font-bold">• Signed Token Active</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => alert("Displaying side-by-side ATS keyword diff...")}
                    className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container text-xs font-semibold flex items-center gap-1.5 border border-outline-variant/20 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                    <span>ATS Keywords Diff</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container text-xs font-semibold flex items-center gap-1.5 border border-outline-variant/20 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-secondary text-[16px]">picture_as_pdf</span>
                    <span>Annotated PDF (v3)</span>
                  </button>

                  <Link href="/dashboard/readiness">
                    <button
                      type="button"
                      className="px-4 py-1.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>View Web Scorecard</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ITEM 3: S06 TECHNICAL MOCK INTERVIEW (IN PROGRESS / SLA TIMER ACTIVE) */}
          {(filter === "all" || filter === "pending") && (
            <div className="bg-surface-container-lowest rounded-2xl border-2 border-primary/30 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              {/* Card Top Bar */}
              <div className="px-6 py-3.5 bg-primary-fixed/20 border-b border-primary/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <span>PENDING MENTOR SUBMISSION • SLA ACTIVE</span>
                  </span>
                  <div className="h-3 w-px bg-outline-variant/30 hidden sm:block" />
                  <span className="text-on-surface font-bold">SERVICE S06</span>
                  <span className="text-on-surface-variant font-mono">Ref: DX-BK-90241</span>
                  <span className="text-on-surface-variant font-mono hidden md:inline">ID: DEL-PENDING-90241</span>
                </div>
                <div className="flex items-center gap-1.5 text-primary font-bold">
                  <span className="material-symbols-outlined text-[17px]">timer</span>
                  <span>SLA Deadline: 27 Oct 2024 at 08:30 PM IST</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col gap-5">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  <div className="flex items-start gap-3.5">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-container-high">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAcqeQyZiFDoNwmOQOqCOY-4jt00ZH9BeI7uDNFDD01EDkG3Fr9rHCqAdPIz4gblrgy5akq9MD7S5t-KEn1x7vMzUNHIKSrbejyQ1Mx3cpdwC8CzzZEtWo1h0mgYeSyQuqRtSMEQOcMBZyyMklU4i3Nx_2cf5gzY0Blf7xevV2CG3tngljn_6rMGAfTreC-hg5gRLwQ7E2-dUYmtqVFgwM0hD8oARSDeDirRJGyoZX"
                        alt="Vikramaditya Rao"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-base sm:text-lg font-bold text-on-surface font-heading">
                        Technical Mock Interview: Distributed Architecture &amp; Concurrency
                      </h2>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-xs">
                        <span className="font-bold text-on-surface">Vikramaditya Rao</span>
                        <span className="text-outline">•</span>
                        <span className="text-on-surface-variant">Lead AI/ML Architect, Ex-Swiggy • Principal Bar Raiser</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-on-surface-variant">
                        <span>Session Completed: 25 Oct 2024 (07:30 PM - 08:30 PM IST)</span>
                        <span>•</span>
                        <span className="text-secondary font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">videocam</span>
                          <span>Google Meet Attendance Verified</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Escrow Guarantee Pill */}
                  <div className="bg-surface-container-low border border-outline-variant/20 px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 shrink-0">
                    <span className="material-symbols-outlined text-secondary text-[22px]">verified_user</span>
                    <div className="flex flex-col text-xs">
                      <span className="font-bold text-on-surface">Escrow Hold Active</span>
                      <span className="text-[11px] text-on-surface-variant">₹999 held in Nodal Account</span>
                    </div>
                  </div>
                </div>

                {/* SLA Progress Bar Panel */}
                <div className="bg-surface-container-low border border-outline-variant/20 p-4 rounded-xl flex flex-col gap-2.5 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-on-surface">48-Hour Deliverable Countdown</span>
                      <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary text-[10px] font-bold">
                        38h 15m remaining
                      </span>
                    </div>
                    <span className="text-on-surface-variant">Session finished 9h 45m ago</span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden">
                    <div className="h-full bg-primary-container rounded-full" style={{ width: "20.3%" }} />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-on-surface-variant gap-2 pt-0.5">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-primary">shield</span>
                      <span>Automated Refund Trigger: If deliverable is unsubmitted by 27 Oct 20:30 IST, PRD §12 initiates 80% automated escrow refund.</span>
                    </span>
                    <span className="font-mono text-on-surface font-semibold shrink-0">Policy PRD §12.1</span>
                  </div>
                </div>

                {/* Scope Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 font-bold text-on-surface">
                      <span className="material-symbols-outlined text-outline text-[16px]">checklist</span>
                      <span>Technical Scope Under Evaluation</span>
                    </div>
                    <p className="text-on-surface-variant leading-relaxed">
                      Distributed Locking algorithms (Redlock semantics), Kafka partition rebalancing patterns, PostgreSQL horizontal sharding vs read replica latency mitigation.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 font-bold text-on-surface">
                      <span className="material-symbols-outlined text-outline text-[16px]">inventory_2</span>
                      <span>Pending Artifact Assets</span>
                    </div>
                    <p className="text-on-surface-variant leading-relaxed">
                      Architecture scorecard with numeric rubric, Annotated architecture whiteboard diagram, and tailored concurrency code review notes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-3.5 bg-surface-container-low border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-outline">pending</span>
                  <span>Drafting in progress by mentor • Last autosave sync 42 mins ago</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Notification enabled: You will receive an instant email and push alert upon deliverable submission.")}
                  className="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container text-xs font-semibold flex items-center gap-1.5 border border-outline-variant/20 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                  <span>Notify Me on Submission</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. PRD Standards & Escrow Guarantee Section */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                Accredited Architecture
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-on-surface font-heading mt-0.5">
                DreamX Career Deliverable Standards &amp; Escrow Guarantee
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Every deliverable is an immutable legal artifact calibrated to actual Tier-1 company bar-raising benchmarks.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold flex items-center gap-1.5 shrink-0">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Razorpay Escrow Audited</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">grading</span>
              </div>
              <h4 className="font-bold text-sm text-on-surface font-heading">Service-Specific Rubrics</h4>
              <p className="text-on-surface-variant leading-relaxed">
                No generic advice. Every S01-S10 service employs an institutional rubric mapped to Google L5, Amazon L6, and Tier-1 Indian unicorns, assessing technical depth, systems design, and behavioral STAR impact.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
              <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined text-[20px]">enhanced_encryption</span>
              </div>
              <h4 className="font-bold text-sm text-on-surface font-heading">Cryptographic Ledger</h4>
              <p className="text-on-surface-variant leading-relaxed">
                All reports carry a SHA-256 hash stamp upon mentor signature. PDF deliverables are cryptographically bound to prevent unauthorized retroactive alterations and preserve candidate audit integrity.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
              <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
              </div>
              <h4 className="font-bold text-sm text-on-surface font-heading">Strict 48h SLA or Refund</h4>
              <p className="text-on-surface-variant leading-relaxed">
                Under PRD §12.1, mentors are contractually bound to upload scorecards within 48h. If a breach occurs, our backend orchestrates an automated 80% escrow refund directly via Razorpay Nodal rails.
              </p>
            </div>
          </div>

          {/* Dispute Banner */}
          <div className="p-4 rounded-xl bg-surface-container-high/60 border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[20px]">contact_support</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-on-surface">Need clarification on a delivered scorecard?</span>
                <span className="text-on-surface-variant">
                  Candidates may raise one structured follow-up inquiry per verified report within 48 hours of publication.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setClarificationModal(true)}
              className="px-4 py-2 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors font-bold text-xs shrink-0 shadow-xs flex items-center gap-2 border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-outline text-[18px]">support_agent</span>
              <span>Contact Escrow Concierge</span>
            </button>
          </div>
        </div>
      </div>

      {/* CLARIFICATION MODAL */}
      {clarificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl border border-outline-variant/30 shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">edit_note</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface font-heading">
                    Report Clarification Request
                  </h3>
                  <span className="text-[11px] text-on-surface-variant">PRD §11.2 Quality Safeguard Desk</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setClarificationModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {clarificationSuccess ? (
              <div className="p-6 rounded-xl bg-secondary-container/30 border border-secondary/30 text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[36px]">check_circle</span>
                <span className="font-bold text-sm text-on-surface">Clarification Dispatched</span>
                <p className="text-xs text-on-surface-variant">
                  Your inquiry has been logged on the ledger and routed to the mentor and Escrow Concierge Lead. Turnaround is &lt;24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleClarificationSubmit} className="flex flex-col gap-3.5 text-xs">
                <div>
                  <label className="font-bold text-on-surface block mb-1">
                    Select Deliverable Reference
                  </label>
                  <select
                    value={clarificationForm.reference}
                    onChange={(e) => setClarificationForm({ ...clarificationForm, reference: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl bg-surface-container-low text-xs text-on-surface border border-outline-variant/20 focus:outline-none"
                  >
                    <option>S05 - Behavioral STAR &amp; Leadership Drill (Ref: DX-BK-88402)</option>
                    <option>S01 - Resume Review &amp; ATS Audit (Ref: DX-BK-86119)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-on-surface block mb-1">
                    Category of Clarification
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Rubric Score Discrepancy",
                      "Artifact Access / Link Broken",
                      "Unclear Action Plan Item",
                      "Mentor Response Inquiry",
                    ].map((cat) => (
                      <label
                        key={cat}
                        className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer border transition-colors ${
                          clarificationForm.category === cat
                            ? "bg-primary-container text-on-primary font-bold border-primary"
                            : "bg-surface-container-low text-on-surface border-outline-variant/20 hover:bg-surface-container"
                        }`}
                      >
                        <input
                          type="radio"
                          name="clarificationCat"
                          checked={clarificationForm.category === cat}
                          onChange={() => setClarificationForm({ ...clarificationForm, category: cat })}
                          className="hidden"
                        />
                        <span className="text-[11px] leading-tight">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-on-surface block mb-1">Detailed Query</label>
                  <textarea
                    rows={3}
                    required
                    value={clarificationForm.query}
                    onChange={(e) => setClarificationForm({ ...clarificationForm, query: e.target.value })}
                    placeholder="Provide specific feedback or section references within the delivered scorecard..."
                    className="w-full p-2.5 rounded-xl bg-surface-container-low text-xs text-on-surface placeholder:text-outline border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-secondary-container/30 border border-secondary/20 flex items-center gap-2 text-[11px] text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">shield</span>
                  <span>
                    Your inquiry is routed directly to both the verified Mentor and the Institutional Concierge Escrow Lead. Typical turnaround is &lt;24 hours.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setClarificationModal(false)}
                    className="px-4 py-2 rounded-xl border border-outline-variant/30 text-xs font-semibold hover:bg-surface-container"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingClarification}
                    className="px-4 py-2 rounded-xl bg-primary-container text-on-primary text-xs font-bold hover:bg-primary transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{submittingClarification ? "Submitting..." : "Submit to Concierge"}</span>
                    <span className="material-symbols-outlined text-[15px]">send</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
