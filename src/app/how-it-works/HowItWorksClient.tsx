"use client";

import * as React from "react";
import Link from "next/link";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: string;
}

const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "What happens if a mentor does not show up to a scheduled drill?",
    icon: "help_outline",
    answer:
      "DreamX automated telemetry verifies participant attendance via Google Meet APIs. If a mentor fails to join within 10 minutes of scheduled start time, the session is flagged as a No-Show. You receive an immediate 100% refund or priority rematching, and the mentor receives an accountability strike on their platform profile.",
  },
  {
    id: "faq-2",
    question: "How does the Smart Match 2-hour timeout work?",
    icon: "schedule",
    answer:
      "When you select Smart Match, Wave 1 pings top-tier matching mentors instantly. If unconfirmed after 30 minutes, Wave 2 expands to accredited backup mentors. If no mentor accepts within 2 hours, you are prompted to either pick an open slot from available verified mentors or receive an instant 100% refund.",
  },
  {
    id: "faq-3",
    question: "Why are bundle discounts funded by DreamX instead of cutting mentor pay?",
    icon: "account_balance_wallet",
    answer:
      "Per PRD §12, top engineering and product mentors require guaranteed market compensation to maintain high diligence. To incentivize structured 3-service pathways, DreamX absorbs the 5% discount entirely from platform margins without touching the mentor’s net payout.",
  },
  {
    id: "faq-4",
    question: "Can I book a custom bundle of 3 services from the catalog?",
    icon: "view_timeline",
    answer:
      "Yes. Candidates can curate any 3 services across S01 through S10 (for example: S01 Resume Audit + S06 System Design Drill + S08 Behavioral Bar-Raiser). A non-stacking 5% multi-service discount is applied at checkout with individual 48h SLAs per milestone.",
  },
];

export function HowItWorksClient() {
  const [openFaq, setOpenFaq] = React.useState<string | null>("faq-1");
  const [copiedLedger, setCopiedLedger] = React.useState(false);

  const toggleFaq = (id: string) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  const copyLedgerSnippet = () => {
    const text = `> RZP_ESCROW_HOLD: ₹2,999.00 captured\n> TELEMETRY_PING: Both peers joined Google Meet [62m 14s]\n> STATUS: Awaiting S06 Rubric Artifact (Time remaining: 34h 12m)`;
    navigator.clipboard.writeText(text);
    setCopiedLedger(true);
    setTimeout(() => setCopiedLedger(false), 2000);
  };

  return (
    <div className="flex flex-col w-full bg-surface">
      {/* Subtle Grid Background Overlay */}
      <div className="relative w-full overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-[radial-gradient(#c8c4d6_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-secondary-fixed/20 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Hero Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-8 sm:pt-12 pb-16 sm:pb-20">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high shadow-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                ENGINEERED CAREER ACCOUNTABILITY • PRD V3.0 STANDARD
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-on-surface tracking-tight leading-[1.15] font-heading">
              How DreamX Works: A <span className="text-primary">Deterministic</span> Career Improvement Loop
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
              No unstructured calls. No unverified claims. DreamX replaces ambiguous mentorship with an evidence-informed 8-dimension readiness model, milestone-locked escrow, and enforceable 48-hour deliverable SLAs.
            </p>

            {/* CTA Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/services"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-bold text-sm px-7 py-3.5 rounded-xl shadow-xs hover:bg-primary-container hover:text-on-primary-container transition-all cursor-pointer"
              >
                <span>Explore Career Services (S01–S10)</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link
                href="/dashboard/readiness"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface-container-lowest text-on-surface font-bold text-sm px-6 py-3.5 rounded-xl shadow-xs hover:bg-surface-container-high transition-all border border-outline-variant/30 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">analytics</span>
                <span>Take 8-Dimension Assessment</span>
              </Link>
            </div>

            {/* Metric Chips Strip */}
            <div className="pt-8 sm:pt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
              <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs border border-outline-variant/20 flex items-center justify-center gap-2 text-center">
                <span className="material-symbols-outlined text-secondary text-[20px]">cancel</span>
                <span className="text-xs sm:text-sm font-bold text-on-surface">0% Unstructured Chats</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs border border-outline-variant/20 flex items-center justify-center gap-2 text-center">
                <span className="material-symbols-outlined text-primary text-[20px]">lock</span>
                <span className="text-xs sm:text-sm font-bold text-on-surface">100% Milestone Escrow</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs border border-outline-variant/20 flex items-center justify-center gap-2 text-center">
                <span className="material-symbols-outlined text-secondary text-[20px]">schedule</span>
                <span className="text-xs sm:text-sm font-bold text-on-surface">48h SLA Deliverables</span>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs border border-outline-variant/20 flex items-center justify-center gap-2 text-center">
                <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
                <span className="text-xs sm:text-sm font-bold text-on-surface">3-Tier Vetted Mentors</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. The 6-Stage Core Product Loop */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
          <div className="mb-10 sm:mb-14">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Architected Execution Framework</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface tracking-tight font-heading">
                The 6-Stage Closed Progression Loop
              </h2>
              <p className="text-sm text-on-surface-variant max-w-md">
                Governed by PRD V3.0 §1 and Appendix B. Every interaction translates into measurable baseline deltas.
              </p>
            </div>
          </div>

          {/* Bento-style Asymmetric Process Flow */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stage 01 */}
            <div className="bg-surface-container-lowest p-6 sm:p-7 rounded-2xl shadow-xs border border-outline-variant/30 flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-fixed/20 rounded-bl-full pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-2.5 py-1 rounded bg-surface-container font-bold text-primary font-mono">
                    STAGE 01
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant text-[24px]">flag</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2.5 font-heading">
                  Set Career Goal &amp; Baseline Diagnostic
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
                  Define your target role (e.g. SDE-2 Backend, Lead ML Architect, Senior PM at Tier-1 GCCs / Unicorns). Take the initial diagnostic calibrated across 8 career readiness dimensions.
                </p>
              </div>
              <div className="pt-4 mt-auto bg-surface-container-low -mx-6 -mb-6 sm:-mx-7 sm:-mb-7 px-6 sm:px-7 py-4 rounded-b-2xl border-t border-outline-variant/20">
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">
                  Deliverable / Outcome
                </span>
                <div className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[18px]">data_thresholding</span>
                  <span className="text-xs font-semibold">Normalized 0-100 Score &amp; Baseline Gap Vector</span>
                </div>
              </div>
            </div>

            {/* Stage 02 */}
            <div className="bg-surface-container-lowest p-6 sm:p-7 rounded-2xl shadow-xs border border-outline-variant/30 flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-fixed/20 rounded-bl-full pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-2.5 py-1 rounded bg-surface-container font-bold text-secondary font-mono">
                    STAGE 02
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant text-[24px]">tune</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2.5 font-heading">
                  Deterministic Gap Discovery
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
                  Our rule-based recommendation engine maps your lowest-weighted competency dimensions directly to high-impact career modules (S01–S10). Zero black-box AI claims.
                </p>
              </div>
              <div className="pt-4 mt-auto bg-surface-container-low -mx-6 -mb-6 sm:-mx-7 sm:-mb-7 px-6 sm:px-7 py-4 rounded-b-2xl border-t border-outline-variant/20">
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">
                  Engine Output Reason
                </span>
                <div className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                  <span className="text-xs font-semibold italic text-primary">
                    &quot;Recommended S06: Concurrency gap at 42%&quot;
                  </span>
                </div>
              </div>
            </div>

            {/* Stage 03 */}
            <div className="bg-surface-container-lowest p-6 sm:p-7 rounded-2xl shadow-xs border border-outline-variant/30 flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-fixed/20 rounded-bl-full pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-2.5 py-1 rounded bg-surface-container font-bold text-primary font-mono">
                    STAGE 03
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant text-[24px]">calendar_month</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2.5 font-heading">
                  Slot Booking or Smart Dispatch
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
                  Book a verified mentor directly with live IST slot holding, or activate Smart Match Dispatch (Wave 1 immediate ping, Wave 2 at 30 min, 2-hour fallback with guaranteed student choice).
                </p>
              </div>
              <div className="pt-4 mt-auto bg-surface-container-low -mx-6 -mb-6 sm:-mx-7 sm:-mb-7 px-6 sm:px-7 py-4 rounded-b-2xl border-t border-outline-variant/20">
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">
                  Execution Guarantee
                </span>
                <div className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[18px]">lock_clock</span>
                  <span className="text-xs font-semibold">Atomic slot lock; fee secured in Razorpay Escrow</span>
                </div>
              </div>
            </div>

            {/* Stage 04 */}
            <div className="bg-surface-container-lowest p-6 sm:p-7 rounded-2xl shadow-xs border border-outline-variant/30 flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary-fixed/20 rounded-bl-full pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-2.5 py-1 rounded bg-surface-container font-bold text-tertiary font-mono">
                    STAGE 04
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant text-[24px]">developer_board</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2.5 font-heading">
                  1:1 Live Drill &amp; Whiteboard Simulation
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
                  High-intensity structured session over Google Meet with integrated live telemetry and real-world whiteboard environments (Excalidraw/Code sandbox).
                </p>
              </div>
              <div className="pt-4 mt-auto bg-surface-container-low -mx-6 -mb-6 sm:-mx-7 sm:-mb-7 px-6 sm:px-7 py-4 rounded-b-2xl border-t border-outline-variant/20">
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">
                  Standardized Protocol
                </span>
                <div className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-primary text-[18px]">timer</span>
                  <span className="text-xs font-semibold">S06 Protocol: Scope • Topology • Failure • Debrief</span>
                </div>
              </div>
            </div>

            {/* Stage 05 */}
            <div className="bg-surface-container-lowest p-6 sm:p-7 rounded-2xl shadow-xs border border-outline-variant/30 flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-fixed/20 rounded-bl-full pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-2.5 py-1 rounded bg-surface-container font-bold text-secondary font-mono">
                    STAGE 05
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant text-[24px]">assignment_turned_in</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2.5 font-heading">
                  48-Hour Scorecard &amp; Rubric SLA
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
                  Within 48 hours post-session, the mentor submits a detailed service-specific report and rubric debrief (PDF + machine-readable JSON) directly to your candidate portal.
                </p>
              </div>
              <div className="pt-4 mt-auto bg-surface-container-low -mx-6 -mb-6 sm:-mx-7 sm:-mb-7 px-6 sm:px-7 py-4 rounded-b-2xl border-t border-outline-variant/20">
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">
                  Contractual Enforceability
                </span>
                <div className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-error text-[18px]">shield</span>
                  <span className="text-xs font-semibold text-error">80% Escrow refund if SLA timeline is breached</span>
                </div>
              </div>
            </div>

            {/* Stage 06 */}
            <div className="bg-surface-container-lowest p-6 sm:p-7 rounded-2xl shadow-xs border border-outline-variant/30 flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-fixed/20 rounded-bl-full pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-2.5 py-1 rounded bg-surface-container font-bold text-primary font-mono">
                    STAGE 06
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant text-[24px]">upgrade</span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-2.5 font-heading">
                  Audited Evidence &amp; Next Action
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
                  Your readiness score updates based on verified drill evidence. Receive clear homework, recommended follow-ups, or optional custom 3-service bundle pathways with a 5% platform discount.
                </p>
              </div>
              <div className="pt-4 mt-auto bg-surface-container-low -mx-6 -mb-6 sm:-mx-7 sm:-mb-7 px-6 sm:px-7 py-4 rounded-b-2xl border-t border-outline-variant/20">
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">
                  Closed-Loop Progression
                </span>
                <div className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[18px]">trending_up</span>
                  <span className="text-xs font-semibold">Evidence Ledger updated; target roles unlocked</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Trust & Verification Architecture (PRD §9.1) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xs border border-outline-variant/30">
            <div className="max-w-3xl mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 text-primary font-bold text-xs mb-3">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>PRD §9.1 PROTOCOL STANDARD</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface mb-3 font-heading">
                The Three-Tier Verification Shield
              </h2>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                Why DreamX is fundamentally different from open-directory freelance marketplaces. We reject 88% of mentor applicants through non-negotiable multi-stage compliance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Check 1 */}
              <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-xs">
                    <span className="material-symbols-outlined text-[24px]">badge</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-primary tracking-wider uppercase">Check 01</span>
                    <h3 className="text-base sm:text-lg font-bold text-on-surface font-heading">
                      Identity &amp; Biometric Audit
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    Indian Government ID (Aadhaar / PAN) matching with Live Biometric Facial Hash check. Corporate domain emails alone are formally rejected as proof of identity.
                  </p>
                </div>
                <div className="mt-6 pt-4 flex items-center gap-2 text-secondary text-xs font-bold">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>100% Biometrically Authenticated</span>
                </div>
              </div>

              {/* Check 2 */}
              <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-xs">
                    <span className="material-symbols-outlined text-[24px]">domain_verification</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-secondary tracking-wider uppercase">Check 02</span>
                    <h3 className="text-base sm:text-lg font-bold text-on-surface font-heading">
                      Seniority &amp; Employer Check
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    Independent employment background verification validating current senior engineering/product title at Tier-1 GCCs, Top Indian Unicorns, or Big Tech.
                  </p>
                </div>
                <div className="mt-6 pt-4 flex items-center gap-2 text-secondary text-xs font-bold">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Senior / Staff Tier-1 Only</span>
                </div>
              </div>

              {/* Check 3 */}
              <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed shadow-xs">
                    <span className="material-symbols-outlined text-[24px]">fact_check</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-tertiary tracking-wider uppercase">Check 03</span>
                    <h3 className="text-base sm:text-lg font-bold text-on-surface font-heading">
                      Module-Specific Rubric Certification
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    Mentors are individually certified per service catalog module. An approved S01 Resume mentor is strictly blocked from conducting S06 System Design drills without accredited S06 auditing.
                  </p>
                </div>
                <div className="mt-6 pt-4 flex items-center gap-2 text-secondary text-xs font-bold">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Granular S01–S10 Rubric Accreditations</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Razorpay Escrow & Statutory Refund Shield */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left: Visual Workflow of Escrow */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <span>PRD §12 • Razorpay Nodal Protection</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface tracking-tight font-heading">
                Zero-Risk Financial Escrow &amp; Enforceable SLAs
              </h2>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                In typical EdTech, your money is taken upfront with zero recourse. At DreamX, fees sit in Razorpay Nodal Escrow until the mentor delivers verified, audited proof of work within 48 hours.
              </p>

              {/* Process Steps */}
              <div className="space-y-3.5 pt-2">
                <div className="p-4 sm:p-5 rounded-2xl bg-surface-container flex items-start gap-4 border border-outline-variant/20">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-on-surface font-heading">
                      Step 1: Booking Capture into Escrow
                    </h4>
                    <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                      Candidate payment is routed to Razorpay Nodal Escrow. The mentor does not receive disbursement.
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-surface-container flex items-start gap-4 border border-outline-variant/20">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-on-surface font-heading">
                      Step 2: Meeting Telemetry Verification
                    </h4>
                    <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                      Automated telemetry validates that the candidate and mentor were present for the full scheduled duration.
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-surface-container flex items-start gap-4 border border-outline-variant/20">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-on-surface font-heading">
                      Step 3: 48h Rubric QA &amp; Automated Release
                    </h4>
                    <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                      Written scorecard and JSON rubric are uploaded and QA-inspected. Funds release automatically upon compliance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Refund Policy & Statutory Card */}
            <div className="lg:col-span-6 bg-surface-container-high rounded-3xl p-6 sm:p-8 space-y-6 border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="text-lg sm:text-xl font-bold text-on-surface font-heading">
                  Statutory Refund Shield
                </span>
                <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                  Legally Bound
                </span>
              </div>

              <div className="space-y-3.5">
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary text-[24px]">history</span>
                    <div>
                      <div className="text-sm font-bold text-on-surface font-heading">
                        Cancellation ≥ 1 Hour Prior
                      </div>
                      <div className="text-xs sm:text-sm text-secondary font-semibold mt-0.5">
                        100% Instant Full Refund to Source
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[24px]">gavel</span>
                    <div>
                      <div className="text-sm font-bold text-on-surface font-heading">
                        Missed 48h Deliverable SLA
                      </div>
                      <div className="text-xs sm:text-sm text-primary font-semibold mt-0.5">
                        80% Escrow Clawback + Automatic Audit Case
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-[24px]">policy</span>
                    <div>
                      <div className="text-sm font-bold text-on-surface font-heading">
                        ASCI Compliance Directives
                      </div>
                      <div className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                        Zero deceptive placement guarantees. We accelerate audited capability and proof-of-work.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Micro Telemetry Mock Component */}
              <div className="p-4 rounded-xl bg-on-surface text-surface space-y-2 font-mono">
                <div className="flex items-center justify-between text-[11px] text-outline-variant">
                  <span>ESCROW TRANSACTION LEDGER</span>
                  <div className="flex items-center gap-2">
                    <span className="text-secondary-fixed">LIVE DEMO PROTOCOL</span>
                    <button
                      type="button"
                      onClick={copyLedgerSnippet}
                      className="text-xs text-primary-fixed hover:text-white transition-colors cursor-pointer"
                      title="Copy ledger snippet"
                    >
                      {copiedLedger ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
                <div className="text-xs text-surface-variant leading-relaxed">
                  &gt; RZP_ESCROW_HOLD: ₹2,999.00 captured<br />
                  &gt; TELEMETRY_PING: Both peers joined Google Meet [62m 14s]<br />
                  &gt; STATUS: Awaiting S06 Rubric Artifact (Time remaining: 34h 12m)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Direct Comparison Matrix */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface mb-3 font-heading">
              Market Comparison: Measurable Standard vs. Status Quo
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Why serious Indian engineers and leaders reject unstructured 30-minute directory calls and predatory multi-lakh bootcamps.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto rounded-2xl shadow-xs border border-outline-variant/30">
            <table className="w-full text-left bg-surface-container-lowest border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-surface-container text-on-surface text-xs sm:text-sm font-bold font-heading">
                  <th className="p-4 sm:p-5">Evaluation Vector</th>
                  <th className="p-4 sm:p-5 text-primary bg-primary-fixed/30 border-x border-primary/20">
                    DreamX (PRD V3.0)
                  </th>
                  <th className="p-4 sm:p-5 text-on-surface-variant">Mentor Directories (Topmate/ADP)</th>
                  <th className="p-4 sm:p-5 text-on-surface-variant">EdTech Bootcamps (Scaler/Upgrad)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-xs sm:text-sm">
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-on-surface">Structure of Sessions</td>
                  <td className="p-4 sm:p-5 bg-primary-fixed/10 font-semibold text-primary border-x border-primary/10">
                    Strict minute-by-minute protocol with live code/system whiteboard drills
                  </td>
                  <td className="p-4 sm:p-5 text-on-surface-variant">
                    Unstructured coffee chats with no required agenda
                  </td>
                  <td className="p-4 sm:p-5 text-on-surface-variant">
                    One-to-many recorded lectures with mass cohort Q&amp;As
                  </td>
                </tr>

                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-on-surface">Mentor Quality Checks</td>
                  <td className="p-4 sm:p-5 bg-primary-fixed/10 font-semibold text-primary border-x border-primary/10">
                    Biometric ID + Employer audit + S01–S10 specific rubric certification
                  </td>
                  <td className="p-4 sm:p-5 text-on-surface-variant">
                    Self-serve registration with zero rigorous employer verification
                  </td>
                  <td className="p-4 sm:p-5 text-on-surface-variant">
                    Recent junior alumni or contract teaching assistants
                  </td>
                </tr>

                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-on-surface">Deliverable &amp; Proof of Work</td>
                  <td className="p-4 sm:p-5 bg-primary-fixed/10 font-semibold text-primary border-x border-primary/10">
                    Mandatory 48h rubric scorecard, JSON schema, and actionable roadmap
                  </td>
                  <td className="p-4 sm:p-5 text-on-surface-variant">
                    Zero deliverable requirements; session ends when time expires
                  </td>
                  <td className="p-4 sm:p-5 text-on-surface-variant">
                    Generic certificates without individual capability validation
                  </td>
                </tr>

                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-on-surface">Payment Protection</td>
                  <td className="p-4 sm:p-5 bg-primary-fixed/10 font-semibold text-primary border-x border-primary/10">
                    Razorpay Nodal Escrow with enforceable 80% SLA refund trigger
                  </td>
                  <td className="p-4 sm:p-5 text-on-surface-variant">
                    Upfront direct charge; subjective or no refund mechanisms
                  </td>
                  <td className="p-4 sm:p-5 text-on-surface-variant">
                    Non-refundable upfront ₹2L–₹4L NBFC loan contracts
                  </td>
                </tr>

                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-on-surface">Pricing Transparency</td>
                  <td className="p-4 sm:p-5 bg-primary-fixed/10 font-semibold text-primary border-x border-primary/10">
                    Modular fixed INR catalog rates; platform-funded bundle discounts
                  </td>
                  <td className="p-4 sm:p-5 text-on-surface-variant">
                    Arbitrary rates set by mentors ranging from free to exorbitant
                  </td>
                  <td className="p-4 sm:p-5 text-on-surface-variant">
                    High-pressure sales calls with hidden interest fees
                  </td>
                </tr>

                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-on-surface">Job Outcome Claims</td>
                  <td className="p-4 sm:p-5 bg-primary-fixed/10 font-semibold text-primary border-x border-primary/10">
                    ASCI compliant: 100% focused on verifiable capability assessment
                  </td>
                  <td className="p-4 sm:p-5 text-on-surface-variant">
                    Unregulated informal promises with zero platform backing
                  </td>
                  <td className="p-4 sm:p-5 text-on-surface-variant">
                    Aggressive &quot;100% Placement Guarantee&quot; marketing traps
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. Comprehensive FAQ Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface mb-3 font-heading">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant">
              Direct answers based on DreamX PRD governance, SLAs, and commercial rules.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-surface-container-lowest shadow-xs border border-outline-variant/30 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-surface-container-low/50 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-on-surface font-heading flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[20px] shrink-0">
                        {faq.icon}
                      </span>
                      {faq.question}
                    </span>
                    <span
                      className={`material-symbols-outlined text-on-surface-variant text-[20px] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    >
                      expand_more
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/10">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. Final High-Impact CTA Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6 pb-20">
          <div className="bg-primary text-on-primary rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-lg">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary-container rounded-full blur-3xl pointer-events-none opacity-50" />
            <div className="relative z-10 max-w-3xl space-y-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary-fixed px-3 py-1 rounded bg-white/10">
                Deterministic Career Progression
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-on-primary tracking-tight font-heading leading-tight">
                Ready to measure and close your career readiness gaps?
              </h2>
              <p className="text-sm sm:text-base text-primary-fixed-dim/90 max-w-2xl leading-relaxed">
                Join hundreds of Indian engineers, engineering managers, and product professionals who traded ambiguity for verified proof of work.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link
                  href="/services"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface-container-lowest text-primary font-bold text-sm px-7 py-3.5 rounded-xl shadow-xs hover:bg-surface-container-low transition-all cursor-pointer"
                >
                  <span>Explore Services Catalog</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
                <Link
                  href="/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-container text-on-primary font-bold text-sm px-7 py-3.5 rounded-xl hover:bg-white/20 transition-all border border-white/20 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">event_available</span>
                  <span>Book a Diagnostic Mock</span>
                </Link>
              </div>
              <div className="pt-6 border-t border-white/10 flex items-center gap-2 text-primary-fixed-dim text-xs">
                <span className="material-symbols-outlined text-[16px] shrink-0">info</span>
                <span>
                  All sessions conducted in Asia/Kolkata (IST) timezone. Transparent INR billing via Razorpay with automated GST invoice generation.
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
