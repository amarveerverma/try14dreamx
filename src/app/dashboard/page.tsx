"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function StudentDashboardPage() {
  const { user, membership } = useAuth();
  const [taskDone, setTaskDone] = React.useState(false);

  const candidateName = user?.name || "Ananya Sharma";
  const candidateId = user?.id || "DX-8421";
  const isPro = membership?.tier === "pro" || membership?.tier === "elite";

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 bg-background min-h-screen">
      {/* Header Notification Bar / Context Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-surface-container-low px-4 py-2.5 rounded-xl shadow-xs">
        <div className="flex items-center gap-2 text-on-surface">
          <span
            className="material-symbols-outlined text-secondary text-base"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
          <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
            Active Cycle:
          </span>
          <span className="text-xs font-semibold">
            Campus Placement Drive 2026-27 • Milestone Check 3 of 6
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-on-surface-variant">
            Timezone: <span className="font-bold text-on-surface">Asia/Kolkata (IST)</span>
          </span>
          <span className="h-3.5 w-px bg-surface-container-highest" />
          <Link
            href="/dashboard/readiness"
            className="text-primary hover:underline flex items-center gap-1 font-bold"
          >
            <span>Audit Log</span>
            <span className="material-symbols-outlined text-xs">open_in_new</span>
          </Link>
        </div>
      </div>

      {/* 1. Welcome Header Region */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-3xl space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface text-xs font-bold">
              Candidate #{candidateId}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">target</span>
              Target: Associate Product Manager / SDE-1
            </span>
            {isPro && (
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                {membership.tier.toUpperCase()} Member • 5% off
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight font-heading">
            Good morning, {candidateName.split(" ")[0]}
          </h1>
          <p className="text-sm text-on-surface-variant">
            Track your career readiness, complete recommended gap interventions, and access verified mentor guidance.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/dashboard/readiness"
            className="px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors shadow-xs text-xs font-bold flex items-center gap-2 border border-surface-container"
          >
            <span className="material-symbols-outlined text-base">assessment</span>
            <span>Take Readiness Assessment</span>
          </Link>
          <Link
            href="/services"
            className="px-4 py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-xs text-xs font-bold flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">explore</span>
            <span>Explore Matched Services</span>
          </Link>
        </div>
      </header>

      {/* 2. Core Metric & Status Cards (Top 3-column Grid) */}
      <section aria-label="Core Status &amp; Metrics">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Career Readiness Score */}
          <article className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                  Current Diagnostic
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface text-xs font-semibold">
                  Developing foundation
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold text-on-surface font-heading">68</span>
                <span className="text-sm text-on-surface-variant font-normal">/ 100</span>
              </div>
              <p className="mt-1 text-xs text-on-surface-variant">
                Based on 6 of 8 assessed dimensions • Updated 2 days ago
              </p>
              {/* Linear progress visual */}
              <div className="mt-4 space-y-1.5">
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-500 w-[68%]" />
                </div>
                <div className="flex justify-between items-center text-[11px] text-on-surface-variant">
                  <span>0 (Entry Baseline)</span>
                  <span className="text-on-surface font-bold">68% Composite Score</span>
                  <span>100 (Offer Ready)</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-3 bg-surface-container-low -mx-6 -mb-6 px-6 pb-4 rounded-b-2xl flex items-center justify-between">
              <span className="text-xs text-on-surface-variant font-medium">Coverage: 75% complete</span>
              <Link
                href="/dashboard/readiness"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>View 8-Dimension Breakdown</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>
          </article>

          {/* Card 2: Primary Next Recommended Action */}
          <article className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
                  <span className="text-[11px] uppercase tracking-wider text-error font-bold">
                    Highest Weighted Gap
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container text-xs font-bold">
                  Pro: 5% off
                </span>
              </div>
              <h2 className="text-base font-bold text-on-surface mt-1 font-heading">
                Technical Mock Interview (S06)
              </h2>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-base font-bold text-on-surface">₹949</span>
                <span className="text-xs text-on-surface-variant line-through">₹999</span>
                <span className="text-xs text-on-surface-variant">• 60 min 1:1 Live</span>
              </div>
              {/* Rationale Callout */}
              <div className="mt-3 p-3 rounded-xl bg-surface-container-low text-xs text-on-surface leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">info</span>
                  <div>
                    <span className="font-bold text-on-surface">Why recommended: </span>
                    <span className="text-on-surface-variant">
                      &quot;Technical Interview Skills&quot; is your highest-weighted gap (weight 20%, score 2/5 - Below expected level) for your target goal.
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-3 bg-surface-container-low -mx-6 -mb-6 px-6 pb-4 rounded-b-2xl flex items-center justify-between">
              <span className="text-xs text-on-surface-variant font-medium">48h SLA Report Guaranteed</span>
              <Link
                href="/services/s06-technical-mock"
                className="px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors text-xs font-bold"
              >
                Book with Vetted Mentor
              </Link>
            </div>
          </article>

          {/* Card 3: Upcoming Confirmed Booking */}
          <article className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">event_available</span>
                  Confirmed • Tomorrow, 4:00 PM IST
                </span>
                <span className="text-[11px] text-on-surface-variant font-semibold">Session #BK-9182</span>
              </div>
              <h2 className="text-base font-bold text-on-surface mt-1 font-heading">
                Resume Review (S01)
              </h2>
              {/* Mentor details */}
              <div className="mt-3 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  RV
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-on-surface truncate">Mentor Rahul Verma</p>
                  <p className="text-xs text-on-surface-variant truncate">Staff Engineer @ Swiggy</p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-secondary font-bold">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    Verified Identity &amp; Tech Lead
                  </span>
                </div>
              </div>
              {/* Video access status */}
              <div className="mt-3 px-3 py-2 rounded-xl bg-surface-container flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant text-base">videocam</span>
                  <span className="font-bold text-on-surface">Google Meet</span>
                </div>
                <span className="text-on-surface-variant">Join link unlocks 15m prior</span>
              </div>
            </div>
            <div className="mt-6 pt-3 bg-surface-container-low -mx-6 -mb-6 px-6 pb-4 rounded-b-2xl flex items-center justify-between">
              <span className="text-xs text-on-surface-variant font-medium">Resume v2.4 attached</span>
              <Link
                href="/dashboard/bookings"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>View Booking &amp; Prep Details</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* 3. Career Journey Stage Banner */}
      <section aria-label="Career Journey Stepper" className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-surface-container">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-surface-container">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-primary font-bold">Structured Path</span>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold">
                Stage 2 of 4 Active
              </span>
            </div>
            <h2 className="text-xl font-bold text-on-surface font-heading mt-1">
              Placement Acceleration Journey
            </h2>
          </div>
          <div className="bg-surface-container-low px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs">
            <span className="material-symbols-outlined text-primary text-lg">flag</span>
            <div>
              <span className="uppercase tracking-wider text-on-surface-variant font-bold">Current Milestone: </span>
              <span className="text-on-surface font-semibold ml-1">
                Close Resume &amp; Tech Interview gaps before campus placements start.
              </span>
            </div>
          </div>
        </div>

        {/* 4-Stage Horizontal Stepper Track */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stage 1 */}
          <div className="flex flex-col p-3.5 rounded-xl bg-surface-container-low">
            <div className="flex items-center justify-between mb-2">
              <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <span className="text-xs text-secondary font-bold">Completed</span>
            </div>
            <p className="text-xs font-bold text-on-surface">1. Onboarding &amp; Baseline</p>
            <p className="text-xs text-on-surface-variant mt-1">Diagnostic assessment taken, target role benchmark mapped.</p>
          </div>

          {/* Stage 2 (Active) */}
          <div className="flex flex-col p-3.5 rounded-xl bg-primary-fixed text-on-primary-fixed">
            <div className="flex items-center justify-between mb-2">
              <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span className="text-xs bg-primary text-on-primary px-2 py-0.5 rounded-full font-bold">
                Active
              </span>
            </div>
            <p className="text-xs font-bold text-on-primary-fixed">2. Core Readiness &amp; Gap Closure</p>
            <p className="text-xs text-on-primary-fixed-variant mt-1">Remediating 2 low-scoring dimensions via targeted 1:1 sessions.</p>
          </div>

          {/* Stage 3 */}
          <div className="flex flex-col p-3.5 rounded-xl bg-surface-container-low opacity-80">
            <div className="flex items-center justify-between mb-2">
              <span className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span className="text-xs text-on-surface-variant font-medium">Upcoming</span>
            </div>
            <p className="text-xs font-bold text-on-surface">3. Interview Readiness</p>
            <p className="text-xs text-on-surface-variant mt-1">DSA round drills, behavioral STAR rehearsal &amp; portfolio defenses.</p>
          </div>

          {/* Stage 4 */}
          <div className="flex flex-col p-3.5 rounded-xl bg-surface-container-low opacity-80">
            <div className="flex items-center justify-between mb-2">
              <span className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center text-xs font-bold">
                4
              </span>
              <span className="text-xs text-on-surface-variant font-medium">Upcoming</span>
            </div>
            <p className="text-xs font-bold text-on-surface">4. Job Applications &amp; Negotiation</p>
            <p className="text-xs text-on-surface-variant mt-1">Referral submission pipelines, live compensation assessment.</p>
          </div>
        </div>
      </section>

      {/* 4. Readiness 8-Dimension Snapshot Matrix */}
      <section aria-label="Readiness 8-Dimension Snapshot" id="matrix">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                Rubric Breakdown
              </span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface text-xs font-semibold">
                Scale 0 to 5
              </span>
            </div>
            <h2 className="text-xl font-bold text-on-surface font-heading mt-1">
              8-Dimension Readiness Matrix
            </h2>
          </div>
          <p className="text-xs text-on-surface-variant max-w-md">
            Calculated from diagnostic benchmark criteria tailored specifically to early-career tech candidates in the Indian market.
          </p>
        </div>

        {/* 8 Dimension Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Dim 1: Technical Skills */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] text-on-surface-variant uppercase font-bold">Weight 20%</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface text-[11px] font-semibold">
                  Developing
                </span>
              </div>
              <h3 className="text-sm font-bold text-on-surface">Technical Skills</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-on-surface font-heading">3</span>
                <span className="text-xs text-on-surface-variant">/ 5</span>
              </div>
              <div className="flex gap-1 mt-2">
                <div className="h-1.5 flex-1 bg-primary rounded-full" />
                <div className="h-1.5 flex-1 bg-primary rounded-full" />
                <div className="h-1.5 flex-1 bg-primary rounded-full" />
                <div className="h-1.5 flex-1 bg-surface-container-high rounded-full" />
                <div className="h-1.5 flex-1 bg-surface-container-high rounded-full" />
              </div>
              <p className="mt-3 text-xs text-on-surface-variant leading-relaxed">
                Assessed via online test on 4 Nov 2026. Data structures strong; OOP system design baseline needed.
              </p>
            </div>
            <div className="mt-4 pt-2">
              <Link
                href="/services/s06-technical-mock"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Improve technical score</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Dim 2: Resume */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] text-on-surface-variant uppercase font-bold">Weight 15%</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container text-[11px] font-bold">
                  Strong
                </span>
              </div>
              <h3 className="text-sm font-bold text-on-surface">Resume &amp; ATS Fit</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-on-surface font-heading">4</span>
                <span className="text-xs text-on-surface-variant">/ 5</span>
              </div>
              <div className="flex gap-1 mt-2">
                <div className="h-1.5 flex-1 bg-secondary rounded-full" />
                <div className="h-1.5 flex-1 bg-secondary rounded-full" />
                <div className="h-1.5 flex-1 bg-secondary rounded-full" />
                <div className="h-1.5 flex-1 bg-secondary rounded-full" />
                <div className="h-1.5 flex-1 bg-surface-container-high rounded-full" />
              </div>
              <p className="mt-3 text-xs text-on-surface-variant leading-relaxed">
                Parser score 84/100. Formatting clean; metric impact statements need fine-tuning.
              </p>
            </div>
            <div className="mt-4 pt-2">
              <Link
                href="/services/s01-resume-review"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Review bullet points</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Dim 3: Interview Skills (Needs Attention) */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] text-on-surface-variant uppercase font-bold">Weight 15%</span>
                <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-bold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-xs">priority_high</span> Needs Attention
                </span>
              </div>
              <h3 className="text-sm font-bold text-on-surface">Interview Skills</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-error font-heading">2</span>
                <span className="text-xs text-on-surface-variant">/ 5</span>
              </div>
              <div className="flex gap-1 mt-2">
                <div className="h-1.5 flex-1 bg-error rounded-full" />
                <div className="h-1.5 flex-1 bg-error rounded-full" />
                <div className="h-1.5 flex-1 bg-surface-container-high rounded-full" />
                <div className="h-1.5 flex-1 bg-surface-container-high rounded-full" />
                <div className="h-1.5 flex-1 bg-surface-container-high rounded-full" />
              </div>
              <p className="mt-3 text-xs text-on-surface-variant leading-relaxed">
                Live algorithmic communication stutter recorded under time pressure.
              </p>
            </div>
            <div className="mt-4 pt-2">
              <Link
                href="/services/s06-technical-mock"
                className="text-xs font-bold text-error hover:underline flex items-center gap-1"
              >
                <span>Book mock session (S06)</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Dim 4: Communication */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] text-on-surface-variant uppercase font-bold">Weight 10%</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container text-[11px] font-bold">
                  Strong
                </span>
              </div>
              <h3 className="text-sm font-bold text-on-surface">Communication</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-on-surface font-heading">4</span>
                <span className="text-xs text-on-surface-variant">/ 5</span>
              </div>
              <div className="flex gap-1 mt-2">
                <div className="h-1.5 flex-1 bg-secondary rounded-full" />
                <div className="h-1.5 flex-1 bg-secondary rounded-full" />
                <div className="h-1.5 flex-1 bg-secondary rounded-full" />
                <div className="h-1.5 flex-1 bg-secondary rounded-full" />
                <div className="h-1.5 flex-1 bg-surface-container-high rounded-full" />
              </div>
              <p className="mt-3 text-xs text-on-surface-variant leading-relaxed">
                High clarity during scenario explanations and structured thought articulation.
              </p>
            </div>
            <div className="mt-4 pt-2">
              <Link
                href="/dashboard/readiness"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>View feedback notes</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Dim 5: Problem Solving */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] text-on-surface-variant uppercase font-bold">Weight 12%</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface text-[11px] font-semibold">
                  Developing
                </span>
              </div>
              <h3 className="text-sm font-bold text-on-surface">Problem Solving &amp; Portfolio</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-on-surface font-heading">3</span>
                <span className="text-xs text-on-surface-variant">/ 5</span>
              </div>
              <div className="flex gap-1 mt-2">
                <div className="h-1.5 flex-1 bg-primary rounded-full" />
                <div className="h-1.5 flex-1 bg-primary rounded-full" />
                <div className="h-1.5 flex-1 bg-primary rounded-full" />
                <div className="h-1.5 flex-1 bg-surface-container-high rounded-full" />
                <div className="h-1.5 flex-1 bg-surface-container-high rounded-full" />
              </div>
              <p className="mt-3 text-xs text-on-surface-variant leading-relaxed">
                Github repo active. Needs 1 full-stack deployment with measurable production throughput.
              </p>
            </div>
            <div className="mt-4 pt-2">
              <Link
                href="/services/s04-portfolio-review"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Review portfolio repo</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Dim 6: LinkedIn */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] text-on-surface-variant uppercase font-bold">Weight 8%</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface text-[11px] font-semibold">
                  Developing
                </span>
              </div>
              <h3 className="text-sm font-bold text-on-surface">LinkedIn &amp; Brand</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-on-surface font-heading">3</span>
                <span className="text-xs text-on-surface-variant">/ 5</span>
              </div>
              <div className="flex gap-1 mt-2">
                <div className="h-1.5 flex-1 bg-primary rounded-full" />
                <div className="h-1.5 flex-1 bg-primary rounded-full" />
                <div className="h-1.5 flex-1 bg-primary rounded-full" />
                <div className="h-1.5 flex-1 bg-surface-container-high rounded-full" />
                <div className="h-1.5 flex-1 bg-surface-container-high rounded-full" />
              </div>
              <p className="mt-3 text-xs text-on-surface-variant leading-relaxed">
                Headline and summary in place. Inbound recruiter alignment can improve via keyword density.
              </p>
            </div>
            <div className="mt-4 pt-2">
              <Link
                href="/services/s03-linkedin-review"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Optimize profile</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Dim 7: Career Planning */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] text-on-surface-variant uppercase font-bold">Weight 10%</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface text-[11px] font-semibold">
                  Developing
                </span>
              </div>
              <h3 className="text-sm font-bold text-on-surface">Career Planning</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-on-surface font-heading">3</span>
                <span className="text-xs text-on-surface-variant">/ 5</span>
              </div>
              <div className="flex gap-1 mt-2">
                <div className="h-1.5 flex-1 bg-primary rounded-full" />
                <div className="h-1.5 flex-1 bg-primary rounded-full" />
                <div className="h-1.5 flex-1 bg-primary rounded-full" />
                <div className="h-1.5 flex-1 bg-surface-container-high rounded-full" />
                <div className="h-1.5 flex-1 bg-surface-container-high rounded-full" />
              </div>
              <p className="mt-3 text-xs text-on-surface-variant leading-relaxed">
                Target company tier-list defined. Needs tier-2 backup strategy mapped before campus dates.
              </p>
            </div>
            <div className="mt-4 pt-2">
              <Link
                href="/services/s07-career-consultation"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Review tier strategy</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Dim 8: Confidence */}
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] text-on-surface-variant uppercase font-bold">Weight 10%</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container text-[11px] font-bold">
                  Strong
                </span>
              </div>
              <h3 className="text-sm font-bold text-on-surface">Confidence &amp; Poise</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-on-surface font-heading">4</span>
                <span className="text-xs text-on-surface-variant">/ 5</span>
              </div>
              <div className="flex gap-1 mt-2">
                <div className="h-1.5 flex-1 bg-secondary rounded-full" />
                <div className="h-1.5 flex-1 bg-secondary rounded-full" />
                <div className="h-1.5 flex-1 bg-secondary rounded-full" />
                <div className="h-1.5 flex-1 bg-secondary rounded-full" />
                <div className="h-1.5 flex-1 bg-surface-container-high rounded-full" />
              </div>
              <p className="mt-3 text-xs text-on-surface-variant leading-relaxed">
                High professional presence observed during Diagnostic intake. Steady pacing under stress.
              </p>
            </div>
            <div className="mt-4 pt-2">
              <Link
                href="/services/s08-salary-negotiation"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>View mentor rubric</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Recommended Next Steps & Bundles (Bottom Split Section) */}
      <section aria-label="Interventions and Deliverables" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-primary font-bold">Curated Interventions</span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface text-xs font-semibold">
                Matched to Score Gaps
              </span>
            </div>
            <h2 className="text-xl font-bold text-on-surface font-heading mt-1">Recommended Gap-Closure Services</h2>
          </div>

          {/* Service 1: S06 */}
          <article className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border border-surface-container">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">terminal</span>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-primary font-extrabold">SERVICE S06</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container text-[11px] font-bold">
                    DSA &amp; System Basics
                  </span>
                </div>
                <h3 className="text-sm font-bold text-on-surface mt-1 font-heading">Technical Mock Interview</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Includes detailed 48h rubric report, code optimization feedback, and recorded playback link.
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs text-on-surface-variant">
                  <span>Duration: 60 mins</span>
                  <span>•</span>
                  <span>Available slots: Tomorrow</span>
                </div>
              </div>
            </div>
            <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0">
              <div>
                <div className="flex items-baseline sm:justify-end gap-1.5">
                  <span className="text-base font-bold text-on-surface">₹949</span>
                  <span className="text-xs text-on-surface-variant line-through">₹999</span>
                </div>
                <span className="text-[11px] text-secondary font-bold">Pro 5% applied</span>
              </div>
              <Link
                href="/services/s06-technical-mock"
                className="mt-2 px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors text-xs font-bold"
              >
                Book S06
              </Link>
            </div>
          </article>

          {/* Service 2: S02 */}
          <article className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border border-surface-container">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl bg-surface-container text-on-surface flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">description</span>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-on-surface-variant font-extrabold">SERVICE S02</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface text-[11px] font-bold">
                    High ATS Impact
                  </span>
                </div>
                <h3 className="text-sm font-bold text-on-surface mt-1 font-heading">ATS Resume Optimization</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Direct 1:1 line-by-line review. Target role keyword synchronization and recruiter scanning validation.
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs text-on-surface-variant">
                  <span>Duration: 45 mins</span>
                  <span>•</span>
                  <span>Available slots: Friday</span>
                </div>
              </div>
            </div>
            <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0">
              <div>
                <div className="flex items-baseline sm:justify-end gap-1.5">
                  <span className="text-base font-bold text-on-surface">₹759</span>
                  <span className="text-xs text-on-surface-variant line-through">₹799</span>
                </div>
                <span className="text-[11px] text-secondary font-bold">Pro 5% applied</span>
              </div>
              <Link
                href="/services/s02-ats-optimization"
                className="mt-2 px-4 py-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors text-xs font-bold border border-surface-container"
              >
                Book S02
              </Link>
            </div>
          </article>

          {/* Custom 3-Service Bundle Promo Banner */}
          <aside className="p-6 rounded-2xl bg-surface-container-high text-on-surface flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-2xl shrink-0 mt-1">savings</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-primary font-bold">Institutional Guarantee</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container/60 text-on-secondary-container text-[11px] font-bold">
                    +5% Extra Discount
                  </span>
                </div>
                <p className="text-sm text-on-surface font-bold mt-1">
                  Build your custom 3-service bundle and save 5% extra.
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Absorbed fully by DreamX. Standard mentor payout is guaranteed with no fee deduction.
                </p>
              </div>
            </div>
            <Link
              href="/services"
              className="shrink-0 px-4 py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors text-xs font-bold"
            >
              Configure Bundle
            </Link>
          </aside>
        </div>

        {/* Right Column (1/3 width) - Recent Deliverables & Action Plans */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">Accountability Trail</span>
            </div>
            <h2 className="text-xl font-bold text-on-surface font-heading mt-1">Deliverables &amp; Tasks</h2>
          </div>

          {/* Report Card */}
          <article className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container text-[11px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  Delivered within 48h SLA
                </span>
                <span className="text-[11px] text-on-surface-variant font-semibold">2 Nov 2026</span>
              </div>
              <h3 className="text-sm font-bold text-on-surface font-heading">
                Career Consultation Diagnostic Report
              </h3>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-xs">
                  SR
                </span>
                <span className="text-on-surface-variant">
                  Lead Mentor: <strong className="text-on-surface font-bold">Sneha Rao</strong>
                </span>
              </div>
              <p className="mt-3 text-xs text-on-surface-variant leading-relaxed">
                Covers comprehensive 8-dimension rubric calibration, industry salary benchmarks, and 6-week intervention priority.
              </p>
            </div>
            <div className="mt-4 pt-3 flex items-center justify-between border-t border-surface-container">
              <Link
                href="/dashboard/readiness"
                className="text-xs text-primary hover:underline font-bold flex items-center gap-1"
              >
                <span>View Structured Report</span>
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </Link>
              <button
                aria-label="Download PDF"
                className="p-1 rounded text-on-surface-variant hover:text-on-surface cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-base">download</span>
              </button>
            </div>
          </article>

          {/* In-Progress Action Item Task Box */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs flex flex-col justify-between border border-surface-container">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] uppercase tracking-wider text-error font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">schedule</span>
                  Due in 3 days
                </span>
                <span className="text-[11px] text-on-surface-variant font-semibold">Action Item #1</span>
              </div>
              <h3 className="text-sm font-bold text-on-surface font-heading">
                Revise project bullet points using STAR format
              </h3>
              <p className="mt-2 text-xs text-on-surface-variant leading-relaxed">
                Assigned from Diagnostic Intake. Quantify latency reduction and user volume on the &quot;Campus Exchange&quot; repository.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <input
                  className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer"
                  id="task1"
                  type="checkbox"
                  checked={taskDone}
                  onChange={(e) => setTaskDone(e.target.checked)}
                />
                <label
                  className={`text-xs font-semibold cursor-pointer ${
                    taskDone ? "line-through text-outline" : "text-on-surface"
                  }`}
                  htmlFor="task1"
                >
                  Mark complete and notify Mentor Rahul
                </label>
              </div>
            </div>
            <div className="mt-4 pt-3 flex items-center justify-between border-t border-surface-container">
              <span className="text-[11px] text-on-surface-variant font-medium">Prerequisite for #BK-9182</span>
              <Link
                href="/dashboard/bookings"
                className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-bold transition-colors"
              >
                Upload Draft
              </Link>
            </div>
          </div>

          {/* Quick Trust Proof Stamp */}
          <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-xl">shield_with_heart</span>
            <div>
              <p className="text-xs font-bold text-on-surface">DreamX 48h SLA Guarantee</p>
              <p className="text-[11px] text-on-surface-variant leading-tight">
                Every booking includes structured rubric notes delivered strictly within 48 hours.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
