"use client";

import * as React from "react";
import Link from "next/link";

interface DimensionAnchor {
  scale: string;
  title: string;
  desc: string;
}

interface DimensionData {
  axis: string;
  name: string;
  subtitle: string;
  title: string;
  anchors: DimensionAnchor[];
}

const DIMENSIONS_DATA: DimensionData[] = [
  {
    axis: "Axis 01",
    name: "Resume Quality",
    subtitle: "ATS formatting & impact metrics",
    title: "Resume Quality Rubric",
    anchors: [
      {
        scale: "0-1",
        title: "Needs Fundamental Rebuild",
        desc: "Generic descriptions, heavy visual formatting breaking ATS parsers, no measurable impact numbers or verified GitHub repository links.",
      },
      {
        scale: "2-3",
        title: "Moderate Industry Standard",
        desc: "Single-column format, basic action verbs present, but lacks clear context-action-result (CAR) framing; vague team size or business impact metrics.",
      },
      {
        scale: "4-5",
        title: "Top 5% Unicorn & Tier-1 Ready",
        desc: "X-Y-Z formula in every bullet point, verified production links with active load metrics, tailored keywords passing tier-1 ATS suites with 90%+ confidence.",
      },
    ],
  },
  {
    axis: "Axis 02",
    name: "LinkedIn Profile",
    subtitle: "Signal clarity & discoverability",
    title: "LinkedIn Profile Signal Rubric",
    anchors: [
      {
        scale: "0-1",
        title: "Unsearchable / Dormant",
        desc: "Missing headline keywords, generic 'Aspiring Developer' tagline, incomplete experience records, and zero public technical posts.",
      },
      {
        scale: "2-3",
        title: "Standard Profile",
        desc: "Accurate work dates, standard technical skills listed, but lacks detailed project links, social proof, or recruiter search keyword density.",
      },
      {
        scale: "4-5",
        title: "Recruiter Inbound Magnet",
        desc: "Optimized for Top 1% search filters, comprehensive featured section displaying live capstones, consistent technical commentary and verified peer recommendations.",
      },
    ],
  },
  {
    axis: "Axis 03",
    name: "Proof of Work",
    subtitle: "Github commits & production apps",
    title: "Proof of Work & Project Depth",
    anchors: [
      {
        scale: "0-1",
        title: "Tutorial Clones",
        desc: "Simple Todo lists, Netflix clones without authentic backend architectures or custom database schemas, sparse GitHub commit history.",
      },
      {
        scale: "2-3",
        title: "Functional Full-Stack Apps",
        desc: "Working backend with authentication and CRUD endpoints, deployed on Vercel/Render, but lacks tests, load management, or clean API contracts.",
      },
      {
        scale: "4-5",
        title: "Production Systems",
        desc: "Monitored microservices or solid modular monolith, comprehensive unit/integration test coverage, CI/CD pipelines, live users and architectural decision logs (ADRs).",
      },
    ],
  },
  {
    axis: "Axis 04",
    name: "Communication",
    subtitle: "STAR framework & concise articulation",
    title: "Technical & Behavioral Communication",
    anchors: [
      {
        scale: "0-1",
        title: "Vague & Disorganized",
        desc: "Difficulty synthesizing past experiences, struggling to explain architectural tradeoffs, failure to structure answers under pressure.",
      },
      {
        scale: "2-3",
        title: "Coherent but Verbose",
        desc: "Understands STAR framework but tends to ramble; explains technical details clearly when prompted, but lacks proactive synthesis.",
      },
      {
        scale: "4-5",
        title: "Crisp Executive Presence",
        desc: "High-precision STAR storytelling, proactive clarification of constraints before answering, confident articulation of past system outages and learnings.",
      },
    ],
  },
  {
    axis: "Axis 05",
    name: "Technical Depth",
    subtitle: "Data structures, system design, core logic",
    title: "Engineering Depth & Core Logic",
    anchors: [
      {
        scale: "0-1",
        title: "Surface Syntax Only",
        desc: "Can write basic syntax but struggles with memory complexity, Big-O trade-offs, and basic data structure traversals.",
      },
      {
        scale: "2-3",
        title: "Intermediate SDE Standards",
        desc: "Solves standard LeetCode Mediums comfortably; understands relational databases and HTTP status cycles, but lacks caching or distributed knowledge.",
      },
      {
        scale: "4-5",
        title: "Senior Engineering Competence",
        desc: "Effortlessly navigates algorithmic bottlenecks, designs scalable systems with rate limiters, message brokers, and transactional data consistency.",
      },
    ],
  },
  {
    axis: "Axis 06",
    name: "Interview Readiness",
    subtitle: "Stress handling & live problem breakdown",
    title: "Live Interview Stress Handling",
    anchors: [
      {
        scale: "0-1",
        title: "High Friction / Panic",
        desc: "Freezes on unfamiliar problem variations, defensive when receiving corrective hints from the interviewer.",
      },
      {
        scale: "2-3",
        title: "Solid Under Guidance",
        desc: "Capable of problem solving with occasional prompting; communicates thoughts out loud effectively, though time management requires discipline.",
      },
      {
        scale: "4-5",
        title: "Collaborative Driver",
        desc: "Treats interview as a pair programming session, immediately validates edge cases, welcomes mentor hints with immediate code adaptations.",
      },
    ],
  },
  {
    axis: "Axis 07",
    name: "Career Strategy",
    subtitle: "Target firm tiering & outreach loops",
    title: "Targeting & Pipeline Architecture",
    anchors: [
      {
        scale: "0-1",
        title: "Random Mass-Applying",
        desc: "Sending 500+ identical applications on LinkedIn Easy Apply without targeting, referral strategy, or role alignment.",
      },
      {
        scale: "2-3",
        title: "Structured Tier Targeting",
        desc: "Target list of 30 companies grouped by tier, occasional alumni referrals, but lacks a disciplined follow-up protocol.",
      },
      {
        scale: "4-5",
        title: "Strategic Pipeline Machine",
        desc: "Direct warm outreach to engineering managers, verified warm referrals for 70%+ applications, multi-offer negotiation strategy prepared.",
      },
    ],
  },
  {
    axis: "Axis 08",
    name: "Executive Confidence",
    subtitle: "Salary negotiation & career ownership",
    title: "Compensation & Offer Negotiation",
    anchors: [
      {
        scale: "0-1",
        title: "Passively Accepting",
        desc: "Accepts the first number quoted without market benchmarking, fearful that asking questions will result in an offer revocation.",
      },
      {
        scale: "2-3",
        title: "Informed but Hesitant",
        desc: "Aware of market percentiles on Levels.fyi, willing to ask for higher base, but lacks counter-offer leverage frameworks.",
      },
      {
        scale: "4-5",
        title: "Equitable Value Negotiator",
        desc: "Understands CTC breakdowns (ESOPs, RSUs, vesting cliffs, retention bonuses), negotiates calmly with documented peer benchmarks.",
      },
    ],
  },
];

export default function Home() {
  const [activeDimension, setActiveDimension] = React.useState(0);
  const [openFaq, setOpenFaq] = React.useState<number | null>(1);

  const currentDim = DIMENSIONS_DATA[activeDimension] || DIMENSIONS_DATA[0];

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="flex flex-col w-full bg-surface">
      {/* HERO SECTION WITH INTERACTIVE 3D COMPONENT */}
      <section className="relative overflow-hidden min-h-[680px] lg:min-h-[760px] bg-gradient-to-b from-surface via-surface-container-low to-surface flex items-center">
        {/* Ambient Atmospheric Gradients */}
        <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 -right-28 w-[30rem] h-[30rem] rounded-full bg-tertiary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Narrative Column */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            {/* Trust Tagline */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface-container-high/80 backdrop-blur-md shadow-xs">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-xs uppercase tracking-wider text-on-surface font-semibold">
                India&apos;s Outcome-Accountable Career Network
              </span>
              <span className="text-outline">•</span>
              <span className="text-xs text-secondary font-bold">Tier-1 to Tier-3 Verified</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-on-surface tracking-tight max-w-2xl font-heading leading-tight">
              Build career readiness with guidance that{" "}
              <span className="text-primary">moves you forward</span>.
            </h1>

            <p className="text-lg text-on-surface-variant max-w-xl leading-relaxed">
              Discover what needs improvement, work with verified career mentors, and receive structured feedback with practical next steps. India’s outcome-accountable career success marketplace.
            </p>

            {/* CTA Cluster */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-primary text-on-primary font-semibold text-sm shadow-md hover:bg-primary-container hover:text-on-primary-container transition-all group"
              >
                <span>Get Started — Take Readiness Check</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-surface-container-highest text-on-surface font-semibold text-sm hover:bg-surface-container transition-all"
              >
                <span className="material-symbols-outlined text-[20px] text-primary">play_circle</span>
                <span>Explore Services &amp; Mentors</span>
              </Link>
            </div>

            {/* Trust Chip (No Job Guarantee Hype) */}
            <div className="mt-4 p-3.5 rounded-xl bg-surface-container-low/95 backdrop-blur-xs shadow-xs flex items-start gap-3 max-w-lg">
              <span
                className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
              <div>
                <div className="text-xs text-on-surface font-bold tracking-wider uppercase">
                  NO JOB GUARANTEE HYPE PLEDGE
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5 leading-normal">
                  DreamX promises verified engineering &amp; product mentorship, rubric-backed diagnostics, and automatic 1-hour cancellation refunds. No false placement guarantees.
                </p>
              </div>
            </div>
          </div>

          {/* Right Telemetry & Glassmorphic Data Cards Overlay */}
          <div className="lg:col-span-5 flex flex-col gap-5 select-none">
            {/* Floating Telemetry Card 1: 8-Dimension Composite Score */}
            <div className="w-full max-w-md ml-auto rounded-2xl bg-surface-container-lowest/90 backdrop-blur-xl shadow-xl p-5 transform lg:translate-x-2 hover:translate-x-0 transition-all">
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                    <span className="material-symbols-outlined text-[18px]">radar</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-outline uppercase tracking-wider block font-semibold">
                      Candidate Benchmark
                    </span>
                    <span className="text-sm font-bold text-on-surface">8-Dimension Composite</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
                  Active Cohort
                </span>
              </div>
              <div className="flex items-baseline gap-2 my-2">
                <span className="text-4xl font-extrabold text-on-surface font-heading">68</span>
                <span className="text-base text-outline">/ 100</span>
                <span className="text-xs text-secondary font-bold ml-auto">+14 pts vs Tier-2 Baseline</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2 mb-3">
                <div className="bg-primary h-2 rounded-full w-[68%] transition-all duration-500" />
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-surface-container-low">
                  <span className="text-outline block">Evaluated</span>
                  <span className="text-sm font-bold text-on-surface">6 / 8</span>
                </div>
                <div className="p-2 rounded-lg bg-surface-container-low">
                  <span className="text-outline block">Tech Proof</span>
                  <span className="text-sm font-bold text-primary">Level 4</span>
                </div>
                <div className="p-2 rounded-lg bg-surface-container-low">
                  <span className="text-outline block">ATS Fit</span>
                  <span className="text-sm font-bold text-secondary">91%</span>
                </div>
              </div>
            </div>

            {/* Floating Telemetry Card 2: 48h SLA Report Guarantee */}
            <div className="w-full max-w-sm ml-auto rounded-2xl bg-surface-container-lowest/90 backdrop-blur-xl shadow-xl p-4 transform lg:-translate-x-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[24px]">timer</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-on-surface">48h SLA Audit Guarantee</span>
                    <span className="text-xs text-secondary font-extrabold">100% on-time</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    In-depth feedback report delivered within 48h or 100% credit refunded.
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 flex items-center justify-between border-t border-surface-container text-xs">
                <span className="text-[11px] text-outline uppercase font-semibold">Active Mentor Roster</span>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-[11px] font-semibold">Swiggy L5</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-[11px] font-semibold">Google L4</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-[11px] font-semibold">Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PILLARS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs text-primary uppercase tracking-widest font-bold">Accountability Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-on-surface mt-2 tracking-tight font-heading">
            Four pillars of deliberate career progression
          </h2>
          <p className="text-base text-on-surface-variant mt-3">
            Replacing unstructured friendly advice with an institutional diagnostic engine, rigorous SLAs, and industry veterans.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary mb-5">
                <span className="material-symbols-outlined text-[26px]">hub</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2 font-heading">Dual Booking Marketplace</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Choose your mentor manually or use Smart Match algorithm with automated 30-min Wave 2 re-dispatch.
              </p>
            </div>
            <div className="mt-6 pt-4 flex items-center gap-1.5 text-primary text-xs font-bold">
              <span>99.2% match fulfillment</span>
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary mb-5">
                <span className="material-symbols-outlined text-[26px]">analytics</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2 font-heading">8-Dimension Readiness Model</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Standardized 0-5 behavioral and technical anchors eliminate subjective opinions with concrete evidence.
              </p>
            </div>
            <div className="mt-6 pt-4 flex items-center gap-1.5 text-secondary text-xs font-bold">
              <span>Standardized rubric</span>
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary mb-5">
                <span className="material-symbols-outlined text-[26px]">verified</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2 font-heading">3-Tier Verified Mentors</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Peer (1-3 yrs), Senior (3-7 yrs), and Executive (8+ yrs) professionals from top tier tech hubs and GCCs.
              </p>
            </div>
            <div className="mt-6 pt-4 flex items-center gap-1.5 text-tertiary text-xs font-bold">
              <span>Strict work history audit</span>
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary-fixed-dim flex items-center justify-center text-primary-container mb-5">
                <span className="material-symbols-outlined text-[26px]">schedule</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2 font-heading">Contractual 48h Deliverable SLA</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Every async code audit, resume teardown, or mock synthesis is delivered on schedule or refunded.
              </p>
            </div>
            <div className="mt-6 pt-4 flex items-center gap-1.5 text-primary-container text-xs font-bold">
              <span>Legally tracked escrow</span>
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE 8-DIMENSION READINESS PREVIEW */}
      <section className="bg-surface-container-low py-20 w-full" id="readiness-matrix">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <span className="text-xs text-primary uppercase tracking-widest font-bold">Diagnostic Framework</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-on-surface mt-2 tracking-tight font-heading">
                The 8-Dimension Readiness Model
              </h2>
              <p className="text-base text-on-surface-variant mt-2">
                Every DreamX session maps feedback to tangible, observable criteria across eight critical axes on an objective 0 to 5 scale.
              </p>
            </div>
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-container-lowest shadow-xs self-start lg:self-auto">
              <span className="text-xs text-outline font-semibold">Selected Dimension:</span>
              <span className="text-sm text-primary font-bold">{currentDim.name}</span>
            </div>
          </div>

          {/* Rubric Selection Matrix & Dynamic Viewer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 8 Dimension Selectors */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              {DIMENSIONS_DATA.map((dim, idx) => {
                const isActive = activeDimension === idx;
                return (
                  <button
                    key={dim.axis}
                    type="button"
                    onClick={() => setActiveDimension(idx)}
                    className={`text-left p-4 rounded-xl transition-all flex flex-col gap-1 cursor-pointer ${
                      isActive
                        ? "bg-primary text-on-primary shadow-sm"
                        : "bg-surface-container-lowest text-on-surface hover:bg-surface-container"
                    }`}
                  >
                    <span className={`text-[11px] font-bold ${isActive ? "opacity-80" : "text-outline"}`}>
                      {dim.axis}
                    </span>
                    <span className="text-sm font-bold font-heading">{dim.name}</span>
                    <span className={`text-xs ${isActive ? "opacity-90" : "text-on-surface-variant"}`}>
                      {dim.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Rubric Detail Display Panel */}
            <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-6 lg:p-8 shadow-xs flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-surface-container">
                <div>
                  <span className="text-xs text-secondary font-bold uppercase tracking-wider">Observable Rubric Anchors</span>
                  <h3 className="text-xl font-bold text-on-surface mt-1 font-heading">{currentDim.title}</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  Standard 0-5 Anchors
                </span>
              </div>

              {/* Scale Anchors Breakdown */}
              <div className="space-y-3">
                {currentDim.anchors.map((anchor, aIdx) => {
                  const badgeColor =
                    aIdx === 0
                      ? "bg-error-container text-on-error-container"
                      : aIdx === 1
                      ? "bg-surface-container-highest text-on-surface"
                      : "bg-secondary-container text-on-secondary-container";
                  const containerBg = aIdx === 2 ? "bg-secondary-container/20" : "bg-surface-container-low";
                  return (
                    <div key={anchor.scale} className={`p-4 rounded-xl ${containerBg} flex items-start gap-4`}>
                      <span className={`w-8 h-8 rounded-full ${badgeColor} flex items-center justify-center font-bold text-xs shrink-0`}>
                        {anchor.scale}
                      </span>
                      <div>
                        <span className="text-sm text-on-surface block font-bold">{anchor.title}</span>
                        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{anchor.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Action Prompt */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container/40 p-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">assignment_turned_in</span>
                  <span className="text-xs text-on-surface font-medium">Every session generates an official PDF diagnostic scorecard.</span>
                </div>
                <Link href="/dashboard/readiness" className="text-xs text-primary font-bold hover:underline shrink-0">
                  Take 5-min Diagnostic →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR VERIFIED SERVICES MATRIX */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 w-full" id="services-matrix">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs text-primary uppercase tracking-widest font-bold">Standardized Catalog</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-on-surface mt-2 tracking-tight font-heading">
              Popular Verified Services
            </h2>
            <p className="text-base text-on-surface-variant mt-1">
              Direct upfront pricing in INR. No hidden subscriptions, no inflated placement cuts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-outline font-semibold">Filter Track:</span>
            <span className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface text-xs font-bold">
              Engineering &amp; SDE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Service S01 */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-outline uppercase font-bold">CODE: S01</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[11px] font-bold">
                  Async SLA
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-on-surface font-heading">Resume Line-by-Line Teardown</h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Deep line-by-line rewrite, bullet structure transformation, and impact quantification.
                </p>
              </div>
              <div className="space-y-2 pt-2 text-xs text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary">schedule</span>
                  <span>48h Delivery Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary">description</span>
                  <span>Annotated PDF + Loom Video</span>
                </div>
              </div>
            </div>
            <div className="pt-6 mt-6 bg-surface-container-low -mx-6 -mb-6 p-6 rounded-b-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-outline block font-semibold">Price</span>
                <span className="text-xl font-bold text-on-surface font-heading">₹599</span>
              </div>
              <Link
                href="/services/s01-resume-review"
                className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all"
              >
                Book S01
              </Link>
            </div>
          </div>

          {/* Service S02 */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-outline uppercase font-bold">CODE: S02</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[11px] font-bold">
                  ATS Audit
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-on-surface font-heading">ATS Keyword &amp; Format Audit</h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Simulation against 4 enterprise ATS algorithms targeting Google, Swiggy, and FinTechs.
                </p>
              </div>
              <div className="space-y-2 pt-2 text-xs text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary">schedule</span>
                  <span>48h Delivery Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary">checklist</span>
                  <span>Keyword Gap &amp; Match Matrix</span>
                </div>
              </div>
            </div>
            <div className="pt-6 mt-6 bg-surface-container-low -mx-6 -mb-6 p-6 rounded-b-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-outline block font-semibold">Price</span>
                <span className="text-xl font-bold text-on-surface font-heading">₹799</span>
              </div>
              <Link
                href="/services/s02-ats-optimization"
                className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all"
              >
                Book S02
              </Link>
            </div>
          </div>

          {/* Service S06 */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative ring-2 ring-primary/20">
            <div className="absolute -top-3 right-6 bg-primary text-on-primary px-2.5 py-0.5 rounded-full text-[11px] font-bold">
              High Demand
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-outline uppercase font-bold">CODE: S06</span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                  1:1 Live
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-on-surface font-heading">Technical Mock (DSA/SysDesign)</h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  60-min live coding simulation with Senior L5/SDE-3 engineering mentor followed by rubric critique.
                </p>
              </div>
              <div className="space-y-2 pt-2 text-xs text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary">videocam</span>
                  <span>60-min Live Simulation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary">grade</span>
                  <span>8-Dimension Scorecard</span>
                </div>
              </div>
            </div>
            <div className="pt-6 mt-6 bg-surface-container-low -mx-6 -mb-6 p-6 rounded-b-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-outline block font-semibold">Price</span>
                <span className="text-xl font-bold text-on-surface font-heading">₹999</span>
              </div>
              <Link
                href="/services/s06-technical-mock"
                className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all"
              >
                Book S06
              </Link>
            </div>
          </div>

          {/* Service S05 */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-outline uppercase font-bold">CODE: S05</span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                  1:1 Live
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-on-surface font-heading">Behavioral &amp; Culture Fit Mock</h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Leadership principles, situation handling, conflict resolution, and executive presence evaluation.
                </p>
              </div>
              <div className="space-y-2 pt-2 text-xs text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary">videocam</span>
                  <span>45-min Live Simulation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary">campaign</span>
                  <span>Communication STAR Score</span>
                </div>
              </div>
            </div>
            <div className="pt-6 mt-6 bg-surface-container-low -mx-6 -mb-6 p-6 rounded-b-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-outline block font-semibold">Price</span>
                <span className="text-xl font-bold text-on-surface font-heading">₹799</span>
              </div>
              <Link
                href="/services/s05-behavioral-mock"
                className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all"
              >
                Book S05
              </Link>
            </div>
          </div>
        </div>

        {/* Bundle Offer Notice */}
        <div className="mt-10 p-5 rounded-2xl bg-surface-container-high/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            </span>
            <div>
              <span className="text-sm font-bold text-on-surface">Custom 3-Service Bundle Available</span>
              <p className="text-xs text-on-surface-variant">
                Combine any 3 services for an automatic 5% bundle discount sponsored by DreamX platform funds.
              </p>
            </div>
          </div>
          <Link
            href="/services"
            className="px-5 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface text-xs font-bold hover:bg-surface-container transition-all shrink-0 shadow-xs"
          >
            Build Custom Bundle
          </Link>
        </div>
      </section>

      {/* SMART MATCH VS DIRECT BOOKING COMPARISON */}
      <section className="bg-surface-container py-20 w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs text-primary uppercase tracking-widest font-bold">Frictionless Allocation</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-on-surface mt-2 tracking-tight font-heading">
              Smart Match vs Direct Booking
            </h2>
            <p className="text-base text-on-surface-variant mt-2">
              Whether you want immediate automated matching or hand-picked senior mentors, our marketplace guarantee protects your calendar.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Direct Booking Card */}
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-surface-container">
                  <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface text-xs font-bold">
                    User Selection
                  </span>
                  <span className="text-xs text-outline font-semibold">Self-Guided</span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface mt-4 font-heading">Direct Booking Model</h3>
                <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                  Browse vetted mentor profiles, inspect their career journey, verified employers, reviews, and reserve their exact calendar slots.
                </p>
                <div className="space-y-4 mt-6">
                  <div className="flex items-start gap-3 text-sm text-on-surface">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">done</span>
                    <span>Inspect verified current company, years of experience, and past mentee reviews.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-on-surface">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">done</span>
                    <span>Choose the exact weekend or weekday evening slot matching your schedule.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-on-surface">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">done</span>
                    <span>Direct messaging with your assigned mentor after booking confirmation.</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 bg-surface-container-low rounded-xl p-4">
                <span className="text-xs text-outline uppercase block mb-1 font-bold">Ideal For</span>
                <span className="text-sm text-on-surface font-semibold">
                  Candidates targeting specific companies (e.g. Swiggy, Google, Amazon, Razorpay).
                </span>
              </div>
            </div>

            {/* Smart Match with Wave 2 Guarantee Card */}
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-xs flex flex-col justify-between ring-2 ring-primary">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-surface-container">
                  <span className="px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-bold">
                    Automated &amp; Guaranteed
                  </span>
                  <span className="text-xs text-secondary font-bold">Fastest Dispatch</span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface mt-4 font-heading">Smart Match Protocol</h3>
                <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                  Specify your target role and requirements. Our algorithmic router matches the optimal tier mentor with a guaranteed safety net.
                </p>
                {/* SLA Protocol Visualization */}
                <div className="space-y-3 mt-6">
                  <div className="p-3.5 rounded-xl bg-surface-container-low flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[22px] shrink-0">speed</span>
                    <div>
                      <span className="text-sm text-on-surface font-bold block">0 - 30 Min: Wave 1 Dispatch</span>
                      <span className="text-xs text-on-surface-variant">
                        Top-ranked primary matching mentors are notified for immediate session acceptance.
                      </span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-container-low flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[22px] shrink-0">autorenew</span>
                    <div>
                      <span className="text-sm text-on-surface font-bold block">30 Min: Automatic Wave 2 Fallback</span>
                      <span className="text-xs text-on-surface-variant">
                        If unaccepted, request automatically fans out to certified secondary backup mentors.
                      </span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-secondary/10 flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary text-[22px] shrink-0">currency_exchange</span>
                    <div>
                      <span className="text-sm text-secondary font-bold block">2-Hour Guarantee: 100% Refund or Direct Slot</span>
                      <span className="text-xs text-on-surface">
                        If no match in 120 mins, get 100% instant refund or priority direct reservation with ₹200 wallet credit.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 bg-surface-container-low rounded-xl p-4">
                <span className="text-xs text-outline uppercase block mb-1 font-bold">Ideal For</span>
                <span className="text-sm text-on-surface font-semibold">
                  Candidates in active interview pipelines requiring fast, guaranteed turnarounds.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEMBERSHIP & CUSTOM 3-SERVICE BUNDLE */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 w-full" id="bundle-section">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs text-primary uppercase tracking-widest font-bold">Predictable Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-on-surface mt-2 tracking-tight font-heading">
            Flexible Membership &amp; Custom Bundles
          </h2>
          <p className="text-base text-on-surface-variant mt-2">
            Zero paywalled basics. Join for free or accelerate through Pro &amp; Elite tiers with transparent discounts.
          </p>
        </div>

        {/* Membership Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
          {/* Free Tier */}
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs text-outline uppercase font-bold">Standard Access</span>
              <h3 className="text-2xl font-bold text-on-surface mt-1 font-heading">DreamX Free</h3>
              <div className="flex items-baseline gap-1 my-4">
                <span className="text-4xl font-extrabold text-on-surface font-heading">₹0</span>
                <span className="text-xs text-outline">/ lifetime</span>
              </div>
              <p className="text-xs text-on-surface-variant">Ideal for self-directed graduates auditing their resume fundamentals.</p>
              <ul className="space-y-3 mt-6 pt-6 border-t border-surface-container">
                <li className="flex items-center gap-2.5 text-xs text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[18px]">check</span>
                  <span>Full 8-Dimension Self-Assessment</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[18px]">check</span>
                  <span>Access to standard verified mentor list</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[18px]">check</span>
                  <span>Pay-per-session marketplace rates</span>
                </li>
              </ul>
            </div>
            <Link
              href="/signup"
              className="mt-8 w-full py-3 rounded-lg bg-surface-container-high text-on-surface text-center text-xs font-bold hover:bg-surface-container transition-all"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-xs flex flex-col justify-between ring-2 ring-primary relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-3 py-0.5 rounded-full text-xs font-bold">
              Recommended
            </div>
            <div>
              <span className="text-xs text-primary uppercase font-bold">Accelerated Prep</span>
              <h3 className="text-2xl font-bold text-on-surface mt-1 font-heading">DreamX Pro</h3>
              <div className="flex items-baseline gap-1 my-4">
                <span className="text-4xl font-extrabold text-on-surface font-heading">₹199</span>
                <span className="text-xs text-outline">/ month</span>
              </div>
              <p className="text-xs text-on-surface-variant">For active job hunters targeting top Indian unicorns and product firms.</p>
              <ul className="space-y-3 mt-6 pt-6 border-t border-surface-container">
                <li className="flex items-center gap-2.5 text-xs text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[18px]">check</span>
                  <span className="font-bold text-primary">5% Discount on all bookings</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[18px]">check</span>
                  <span>Priority Smart Match routing (Wave 1)</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[18px]">check</span>
                  <span>1 Free Monthly ATS Audit report</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[18px]">check</span>
                  <span>Private community async Q&amp;A board</span>
                </li>
              </ul>
            </div>
            <Link
              href="/membership"
              className="mt-8 w-full py-3 rounded-lg bg-primary text-on-primary text-center text-xs font-bold hover:bg-primary-container transition-all"
            >
              Subscribe to Pro
            </Link>
          </div>

          {/* Elite Tier */}
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs text-outline uppercase font-bold">Intensive Cohort</span>
              <h3 className="text-2xl font-bold text-on-surface mt-1 font-heading">DreamX Elite</h3>
              <div className="flex items-baseline gap-1 my-4">
                <span className="text-4xl font-extrabold text-on-surface font-heading">₹399</span>
                <span className="text-xs text-outline">/ month</span>
              </div>
              <p className="text-xs text-on-surface-variant">Dedicated supervision for high-stakes FAANG/GCC career transitions.</p>
              <ul className="space-y-3 mt-6 pt-6 border-t border-surface-container">
                <li className="flex items-center gap-2.5 text-xs text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[18px]">check</span>
                  <span className="font-bold text-primary">10% Discount on all bookings</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[18px]">check</span>
                  <span>Direct calendar priority access to Tier-3 Mentors</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[18px]">check</span>
                  <span>Unlimited ATS scans &amp; rubric track history</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-[18px]">check</span>
                  <span>Monthly live group strategy roundtables</span>
                </li>
              </ul>
            </div>
            <Link
              href="/membership"
              className="mt-8 w-full py-3 rounded-lg bg-surface-container-high text-on-surface text-center text-xs font-bold hover:bg-surface-container transition-all"
            >
              Subscribe to Elite
            </Link>
          </div>
        </div>

        {/* Custom 3-Service Bundle Builder Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold mb-3">
                <span className="material-symbols-outlined text-[16px]">redeem</span>
                <span>Platform Funded Discount</span>
              </div>
              <h3 className="text-2xl font-bold text-on-surface font-heading">Custom 3-Service Bundle</h3>
              <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                Build your tailored readiness pathway. Pick any three distinct services (e.g. S01 Resume Review + S02 ATS Check + S06 Technical Mock) to unlock a <strong>5% bundle credit directly funded by DreamX</strong>.
              </p>
              <div className="mt-4 p-3.5 rounded-xl bg-surface-container-low text-on-surface-variant text-xs leading-relaxed">
                <strong className="text-on-surface">No Discount Stacking Policy:</strong> To keep mentor compensation strictly protected, bundle credits cannot be stacked on top of Pro/Elite membership discounts. The higher discount always applies automatically at checkout.
              </div>
            </div>
            <div className="lg:col-span-5 bg-surface-container-low p-6 rounded-xl flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <span className="text-sm font-bold text-on-surface">Sample 3-Track Bundle</span>
                <span className="text-xs text-secondary font-bold">5% Off</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-on-surface-variant">
                  <span>S01: Resume Line-by-Line</span>
                  <span className="font-semibold text-on-surface">₹599</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>S02: ATS Keyword Optimization</span>
                  <span className="font-semibold text-on-surface">₹799</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>S06: Technical SDE Mock (60 min)</span>
                  <span className="font-semibold text-on-surface">₹999</span>
                </div>
                <div className="pt-2 flex justify-between font-bold text-on-surface border-t border-surface-container">
                  <span>Subtotal</span>
                  <span>₹2,397</span>
                </div>
                <div className="flex justify-between text-secondary font-bold">
                  <span>DreamX 5% Platform Subsidy</span>
                  <span>- ₹120</span>
                </div>
                <div className="pt-2 flex justify-between text-lg font-bold text-on-surface border-t border-surface-container">
                  <span>Bundle Total</span>
                  <span className="text-primary font-heading">₹2,277</span>
                </div>
              </div>
              <Link
                href="/services"
                className="mt-2 w-full py-3 rounded-lg bg-primary text-on-primary text-center text-xs font-bold hover:bg-primary-container transition-all"
              >
                Build Your 3-Service Bundle
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDER PLEDGE & INDIA-SPECIFIC TRUST FAQ */}
      <section className="bg-surface-container-low py-20 w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Founder Trust Pledge Statement */}
          <div className="bg-surface-container-lowest p-8 lg:p-12 rounded-2xl shadow-xs mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px]">handshake</span>
                  <span>Our Foundational Contract with Candidates</span>
                </div>
                <h2 className="text-3xl font-bold text-on-surface tracking-tight font-heading">
                  The DreamX Transparency Guarantee
                </h2>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  &ldquo;Indian graduates deserve honest assessments, not predatory placement promises. Most programs trap candidates in aggressive Income Share Agreements or make unbacked claims of 100% job guarantees. At DreamX, we provide strictly verified mentors, a diagnostic rubric, and high-fidelity actionable reports. If your report isn&apos;t delivered within 48 hours, or if you cancel an unfilled session with at least 1 hour notice, your refund is credited automatically.&rdquo;
                </p>
                <div className="pt-2">
                  <span className="text-sm font-bold text-on-surface block">Founding Team</span>
                  <span className="text-xs text-outline">DreamX Technologies India</span>
                </div>
              </div>
              <div className="lg:col-span-4 bg-surface-container-low p-6 rounded-xl flex flex-col gap-4 text-center">
                <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[28px]">verified</span>
                </div>
                <h4 className="text-sm font-bold text-on-surface">Audit Guarantee Snapshot</h4>
                <div className="text-left space-y-2 text-xs text-on-surface-variant">
                  <p>• <strong>48h Async Delivery:</strong> Full rubric or instant refund.</p>
                  <p>• <strong>1-Hour Cancellation:</strong> 100% money back before session commencement.</p>
                  <p>• <strong>Zero ISA Penalties:</strong> You own your salary.</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section Accordions */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs text-primary uppercase tracking-widest font-bold">Clear Answers</span>
              <h2 className="text-2xl font-bold text-on-surface mt-2 font-heading">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {/* FAQ 1 */}
              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs">
                <button
                  type="button"
                  className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
                  onClick={() => toggleFaq(1)}
                >
                  <span className="text-sm font-bold text-on-surface">
                    How does DreamX differ from coding bootcamps with 100% placement guarantees?
                  </span>
                  <span
                    className={`material-symbols-outlined text-outline transition-transform duration-200 ${
                      openFaq === 1 ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {openFaq === 1 && (
                  <div className="mt-3 text-on-surface-variant text-xs leading-relaxed border-t border-surface-container pt-3">
                    We do not sell inflated placement promises or binding multi-year Income Share Agreements (ISAs). DreamX is an on-demand, outcome-accountable marketplace where you pay modular, upfront fees for verified 1:1 mentorship and comprehensive diagnostic evaluations. You receive structured proof of work and direct feedback from working tech leads.
                  </div>
                )}
              </div>

              {/* FAQ 2 */}
              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs">
                <button
                  type="button"
                  className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
                  onClick={() => toggleFaq(2)}
                >
                  <span className="text-sm font-bold text-on-surface">
                    What is the 48-Hour SLA and how does the guarantee work?
                  </span>
                  <span
                    className={`material-symbols-outlined text-outline transition-transform duration-200 ${
                      openFaq === 2 ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {openFaq === 2 && (
                  <div className="mt-3 text-on-surface-variant text-xs leading-relaxed border-t border-surface-container pt-3">
                    For all asynchronous deliverables (such as S01 Resume Line-by-Line and S02 ATS Audits), the mentor has exactly 48 hours from submission to deliver the rubric scorecard and annotations. If the mentor exceeds the deadline by even one minute, your fee is automatically refunded or credited to your DreamX wallet.
                  </div>
                )}
              </div>

              {/* FAQ 3 */}
              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs">
                <button
                  type="button"
                  className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
                  onClick={() => toggleFaq(3)}
                >
                  <span className="text-sm font-bold text-on-surface">
                    How does Smart Match Wave 2 fallback operate?
                  </span>
                  <span
                    className={`material-symbols-outlined text-outline transition-transform duration-200 ${
                      openFaq === 3 ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {openFaq === 3 && (
                  <div className="mt-3 text-on-surface-variant text-xs leading-relaxed border-t border-surface-container pt-3">
                    When you select Smart Match, our matching engine reaches out to your top-rated mentor tier. If no mentor accepts the request within 30 minutes, the dispatch automatically escalates to verified Wave 2 backup mentors. If no match is secured within 2 hours, you receive a 100% refund plus ₹200 platform credit toward a direct booking.
                  </div>
                )}
              </div>

              {/* FAQ 4 */}
              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs">
                <button
                  type="button"
                  className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
                  onClick={() => toggleFaq(4)}
                >
                  <span className="text-sm font-bold text-on-surface">
                    Can Tier-2 and Tier-3 engineering college students benefit?
                  </span>
                  <span
                    className={`material-symbols-outlined text-outline transition-transform duration-200 ${
                      openFaq === 4 ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {openFaq === 4 && (
                  <div className="mt-3 text-on-surface-variant text-xs leading-relaxed border-t border-surface-container pt-3">
                    Over 72% of our active mentees hail from non-IIT/NIT institutions. Our 8-Dimension model is engineered specifically to help graduates overcome on-campus placement limitations, craft industry-grade project proof of work, optimize ATS visibility, and excel in off-campus hiring drives.
                  </div>
                )}
              </div>

              {/* FAQ 5 */}
              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs">
                <button
                  type="button"
                  className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
                  onClick={() => toggleFaq(5)}
                >
                  <span className="text-sm font-bold text-on-surface">
                    What is the cancellation policy for scheduled 1:1 sessions?
                  </span>
                  <span
                    className={`material-symbols-outlined text-outline transition-transform duration-200 ${
                      openFaq === 5 ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {openFaq === 5 && (
                  <div className="mt-3 text-on-surface-variant text-xs leading-relaxed border-t border-surface-container pt-3">
                    You can cancel or reschedule any 1:1 live interview up to 1 hour before the scheduled start time directly from your candidate dashboard for a 100% instant refund or reschedule credit. No hassle, no penalties.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 w-full">
        <div className="bg-primary rounded-3xl p-8 lg:p-14 text-on-primary text-center relative overflow-hidden shadow-xl">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6">
            <span className="px-3.5 py-1.5 rounded-full bg-white/15 text-xs uppercase tracking-wider backdrop-blur-md font-bold">
              Start With Real Proof
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading">
              Know exactly where you stand today.
            </h2>
            <p className="text-base sm:text-lg opacity-90 leading-relaxed">
              Take the 5-minute self-diagnostic test and benchmark your career readiness across all 8 dimensions with zero commitment.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/dashboard/readiness"
                className="px-8 py-4 rounded-xl bg-surface-container-lowest text-primary text-sm font-bold shadow-md hover:bg-surface-container-low transition-all"
              >
                Take Free Readiness Check
              </Link>
              <Link
                href="/services"
                className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-on-primary text-sm font-bold transition-all"
              >
                Explore All 10 Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
