"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

interface ServiceOption {
  code: string;
  name: string;
  tagline: string;
  price: number;
  duration: string;
  isTopPick?: boolean;
}

const AI_SERVICES: ServiceOption[] = [
  {
    code: "S06",
    name: "S06: AI/ML System Mock",
    tagline: "60 min technical grill + rubric scorecard",
    price: 999,
    duration: "60 min",
    isTopPick: true,
  },
  {
    code: "S04",
    name: "S04: Codebase & Architecture",
    tagline: "45 min GitHub & pipeline code audit",
    price: 599,
    duration: "45 min",
  },
  {
    code: "S09",
    name: "S09: AI Transition Roadmap",
    tagline: "60 min structured college-to-unicorn plan",
    price: 799,
    duration: "60 min",
  },
  {
    code: "S01",
    name: "S01: AI/ML Resume Calibration",
    tagline: "45 min ATS & Tier-1 hiring manager review",
    price: 599,
    duration: "45 min",
  },
];

const DATES = [
  { label: "Today", date: "24 Oct" },
  { label: "Tomorrow", date: "25 Oct" },
  { label: "Fri", date: "26 Oct" },
  { label: "Sat", date: "27 Oct" },
];

const TIME_SLOTS = [
  { id: "ts1", time: "07:30 PM - 08:30 PM", status: "available", isDefault: true },
  { id: "ts2", time: "09:00 PM - 10:00 PM", status: "available" },
  { id: "ts3", time: "06:00 PM (Held)", status: "held" },
  { id: "ts4", time: "10:15 PM - 11:15 PM", status: "available" },
];

export function VikramadityaProfileView() {
  const [selectedService, setSelectedService] = React.useState<ServiceOption>(AI_SERVICES[0]);
  const [selectedDateIdx, setSelectedDateIdx] = React.useState(0);
  const [selectedSlotId, setSelectedSlotId] = React.useState("ts1");
  const [applyProDiscount, setApplyProDiscount] = React.useState(false);
  const [bookingLocked, setBookingLocked] = React.useState(false);

  const basePrice = selectedService.price;
  const discountAmount = applyProDiscount ? Math.round(basePrice * 0.05) : 0;
  const netPayable = basePrice - discountAmount;

  return (
    <div className="flex flex-col w-full bg-surface">
      {/* Top Context Navigation & Trust Header */}
      <div className="w-full bg-surface-container-low/70 py-4 shadow-xs border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-on-surface-variant flex-wrap">
            <Link href="/mentors" className="hover:text-primary transition-colors flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[16px]">school</span>
              Mentors Directory
            </Link>
            <span className="text-outline">/</span>
            <span className="text-on-surface-variant font-medium">Data Science &amp; AI Engineering</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface font-bold">Vikramaditya Rao</span>
          </nav>

          {/* Trust Badges Strip */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest text-secondary shadow-xs border border-outline-variant/20 text-xs font-semibold">
              <span
                className="material-symbols-outlined text-[15px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
              <span>Tier-1 Unicorn Lead</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest text-on-surface-variant shadow-xs border border-outline-variant/20 text-xs font-semibold">
              <span className="material-symbols-outlined text-[15px] text-primary">fingerprint</span>
              <span>Aadhaar &amp; Biometric Vetted</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest text-secondary shadow-xs border border-outline-variant/20 text-xs font-semibold">
              <span className="material-symbols-outlined text-[15px]">timer</span>
              <span>100% 48h Deliverable SLA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Layout Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT COLUMN: MENTOR CORE DOSSIER ================= */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
            {/* Mentor Bio Profile Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-xs border border-outline-variant/40">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Avatar with Active Indicator */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-sm relative ring-4 ring-surface-container">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLwQDMBRuG8xbLJxYU8LK0807XhiaEzR-2wKW7hUzAOzo8wcVuWupv2xCDsrwyCr7nbekkJ2wttvLcu0JVVpR24tLgx6lnVYC3dVty-Vy2XAYd1qTNVSit78gjeta2PrGmEbqK7HV_Se0LcxtacSvW84YhKt9gfVu7aQ7V18JiRNcjUjxlmg8be-5IH99W-Y6Dgv_6Sn_oRsCp6XNew9nq3E985HLLAdiiE0tA37sT"
                      alt="Vikramaditya Rao"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 bg-surface-container-lowest p-1 rounded-full shadow-xs">
                    <div className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-secondary text-[12px] font-bold">check</span>
                    </div>
                  </div>
                </div>

                {/* Header Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight font-heading">
                      Vikramaditya Rao
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold">
                      <span
                        className="material-symbols-outlined text-[13px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        stars
                      </span>
                      Staff Mentor
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-on-surface font-semibold mb-2">
                    Lead Machine Learning Engineer &amp; AI Systems Architect
                  </p>
                  <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-on-surface-variant font-medium">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-outline">domain</span>
                      Ex-Swiggy Core AI Platform • Ex-Microsoft IDC
                    </span>
                    <span className="hidden sm:inline text-outline">•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                      Hyderabad, India (IST)
                    </span>
                    <span className="hidden sm:inline text-outline">•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-outline">work_history</span>
                      8+ Years Production Experience
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Quantitative Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 bg-surface-container-low rounded-xl p-4 border border-outline-variant/20">
                <div className="flex flex-col">
                  <span className="text-[11px] text-outline uppercase tracking-wider font-semibold">Completed</span>
                  <span className="text-xl sm:text-2xl font-bold text-on-surface font-heading mt-0.5">186</span>
                  <span className="text-[11px] text-secondary flex items-center gap-0.5 mt-0.5 font-bold">
                    <span className="material-symbols-outlined text-[12px]">verified</span> 100% Tracked
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-outline uppercase tracking-wider font-semibold">Avg Rating</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl sm:text-2xl font-bold text-on-surface font-heading">4.98</span>
                    <span className="text-xs text-on-surface-variant">/5.0</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant mt-0.5">142 reviews</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-outline uppercase tracking-wider font-semibold">Attendance</span>
                  <span className="text-xl sm:text-2xl font-bold text-on-surface font-heading mt-0.5">99.6%</span>
                  <span className="text-[11px] text-outline mt-0.5 font-medium">On-Time Start</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-outline uppercase tracking-wider font-semibold">48h SLA</span>
                  <span className="text-xl sm:text-2xl font-bold text-secondary font-heading mt-0.5">100%</span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5 font-medium">Audited Rubrics</span>
                </div>
              </div>

              {/* 3-Tier Verification Shield (PRD §9.1) */}
              <div className="mt-6 p-4 rounded-xl bg-surface-container/60 flex flex-col gap-3 border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-on-surface flex items-center gap-2 font-heading">
                    <span className="material-symbols-outlined text-secondary text-[20px]">shield_person</span>
                    DreamX 3-Tier Verification Checklist
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-bold">
                    Fully Accredited
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <div className="flex items-start gap-2.5 bg-surface-container-lowest p-3 rounded-lg shadow-xs border border-outline-variant/30">
                    <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <div className="flex flex-col">
                      <span className="text-xs text-on-surface font-bold">Tier 1: Identity</span>
                      <span className="text-[11px] text-on-surface-variant leading-tight">Govt Aadhaar &amp; Biometric face-hash verified</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 bg-surface-container-lowest p-3 rounded-lg shadow-xs border border-outline-variant/30">
                    <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <div className="flex flex-col">
                      <span className="text-xs text-on-surface font-bold">Tier 2: Track Record</span>
                      <span className="text-[11px] text-on-surface-variant leading-tight">Ex-Swiggy AI &amp; Microsoft payroll vetted</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 bg-surface-container-lowest p-3 rounded-lg shadow-xs border border-outline-variant/30">
                    <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <div className="flex flex-col">
                      <span className="text-xs text-on-surface font-bold">Tier 3: S0-Certified</span>
                      <span className="text-[11px] text-on-surface-variant leading-tight">Approved evaluator for S06, S04, S09 &amp; S01</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mentorship Philosophy & Background */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-xs border border-outline-variant/40 space-y-5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">psychology</span>
                <h2 className="text-lg sm:text-xl font-bold text-on-surface font-heading">
                  Architectural Philosophy &amp; Focus
                </h2>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Most machine learning interview preparation focuses overwhelmingly on Kaggle leaderboard mechanics or toy LeetCode algorithms, completely ignoring production bottlenecks. In real-world enterprise stacks, <strong className="text-on-surface font-semibold">production reliability, low inference latencies (&lt;35ms), vector index recall, and distributed batching pipelines</strong> define whether an ML project succeeds.
              </p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Having built large-scale real-time recommendation infra handling 40,000 requests/sec at Swiggy and enterprise retrieval engines at Microsoft IDC, my mission is bridging the gap for Indian engineers from Tier-2 and Tier-3 institutions. We deconstruct real ML systems design: Triton inference servers, RAG evals, embedding drift detection, and Kubeflow orchestration so you can command senior packages with authentic proof of work.
              </p>

              {/* Core Competencies Tags */}
              <div className="space-y-3 pt-2">
                <span className="text-xs text-outline uppercase tracking-wider font-bold block">
                  Specialized Production Domains
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "LLM Fine-Tuning & RAG Architecture",
                    "Triton / vLLM Low-Latency Serving",
                    "Vector Search (Milvus, Qdrant, FAISS)",
                    "MLOps & Feature Stores (Feast/Kubeflow)",
                    "Real-Time Recommendation Engines",
                    "High-Throughput Model Quantization (AWQ/GGUF)",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface text-xs font-semibold flex items-center gap-1.5 border border-outline-variant/20"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Verified Placement Outcomes Track Record */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-xs border border-outline-variant/40 space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[22px]">workspace_premium</span>
                  <h2 className="text-lg sm:text-xl font-bold text-on-surface font-heading">
                    Verified Mentee Outcomes (Recent)
                  </h2>
                </div>
                <span className="text-xs text-secondary bg-secondary-container/50 px-2.5 py-1 rounded-full font-bold">
                  Form 16 / Offer Letter Verified
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Outcome 1 */}
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between gap-3 border border-outline-variant/20">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-sm font-bold text-on-surface block font-heading">Senior ML Engineer</span>
                      <span className="text-xs text-on-surface-variant font-medium">Razorpay • Merchant Fraud Detection</span>
                    </div>
                    <div className="px-2 py-1 bg-surface-container-lowest rounded text-secondary text-xs font-bold shadow-xs">
                      42 LPA
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant text-xs pt-2 bg-surface-container-lowest/70 px-3 py-1.5 rounded-lg">
                    <span>Tier-3 College Alum (2021 batch)</span>
                    <span className="text-secondary font-bold">9.2 LPA → 42 LPA</span>
                  </div>
                </div>
                {/* Outcome 2 */}
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between gap-3 border border-outline-variant/20">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-sm font-bold text-on-surface block font-heading">Lead Data Scientist</span>
                      <span className="text-xs text-on-surface-variant font-medium">Swiggy AI • ETA Dispatch Optimization</span>
                    </div>
                    <div className="px-2 py-1 bg-surface-container-lowest rounded text-secondary text-xs font-bold shadow-xs">
                      45 LPA
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant text-xs pt-2 bg-surface-container-lowest/70 px-3 py-1.5 rounded-lg">
                    <span>Backend Dev Transition</span>
                    <span className="text-secondary font-bold">18 LPA → 45 LPA</span>
                  </div>
                </div>
                {/* Outcome 3 */}
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between gap-3 border border-outline-variant/20">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-sm font-bold text-on-surface block font-heading">Machine Learning Eng 2</span>
                      <span className="text-xs text-on-surface-variant font-medium">Zepto • Quick Commerce Search/Relevance</span>
                    </div>
                    <div className="px-2 py-1 bg-surface-container-lowest rounded text-secondary text-xs font-bold shadow-xs">
                      36 LPA
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant text-xs pt-2 bg-surface-container-lowest/70 px-3 py-1.5 rounded-lg">
                    <span>4-month Mock Roadmap</span>
                    <span className="text-secondary font-bold">14 LPA → 36 LPA</span>
                  </div>
                </div>
                {/* Outcome 4 */}
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between gap-3 border border-outline-variant/20">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-sm font-bold text-on-surface block font-heading">Data Scientist 2</span>
                      <span className="text-xs text-on-surface-variant font-medium">Walmart Global Tech • Demand Forecast</span>
                    </div>
                    <div className="px-2 py-1 bg-surface-container-lowest rounded text-secondary text-xs font-bold shadow-xs">
                      32 LPA
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant text-xs pt-2 bg-surface-container-lowest/70 px-3 py-1.5 rounded-lg">
                    <span>Service Tech Firm Switch</span>
                    <span className="text-secondary font-bold">8 LPA → 32 LPA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample 48h Deliverable Scorecard Preview (PRD §11.2) */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-xs border border-outline-variant/40 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">assignment_turned_in</span>
                    <h2 className="text-lg sm:text-xl font-bold text-on-surface font-heading">
                      Sample 48h Deliverable Scorecard Preview
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                    Every technical mock includes this comprehensive written architectural debrief within 48 hours.
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded bg-surface-container text-on-surface font-mono font-bold">
                  DOC: DX-AI-8831
                </span>
              </div>

              {/* Scorecard Module Container */}
              <div className="bg-surface-container-low rounded-xl p-4 sm:p-6 space-y-5 border border-outline-variant/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 bg-surface-container-lowest p-4 rounded-lg shadow-xs gap-3 border border-outline-variant/20">
                  <div>
                    <span className="text-[11px] text-primary font-bold uppercase tracking-wider block">Session Audit Mock</span>
                    <h3 className="text-sm sm:text-base text-on-surface font-bold font-heading">
                      S06: Real-time Recommendation &amp; Vector Retrieval
                    </h3>
                    <span className="text-xs text-on-surface-variant font-medium">
                      Candidate: Anonymous ML Mentee • Target: Tier-1 Staff Engineer Mock
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[11px] text-outline block font-medium">Overall Score</span>
                      <span className="text-lg sm:text-xl font-extrabold text-primary font-heading">8.1 / 10.0</span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant">
                      <span className="material-symbols-outlined text-[22px]">grade</span>
                    </div>
                  </div>
                </div>

                {/* Rubric Dimension Breakdown Bars */}
                <div className="space-y-3.5">
                  <span className="text-xs text-outline uppercase tracking-wider block font-bold">
                    Evaluation Rubric Matrix
                  </span>
                  <div className="space-y-3">
                    {/* Dim 1 */}
                    <div>
                      <div className="flex justify-between text-xs text-on-surface mb-1 font-medium">
                        <span>Problem Formulation &amp; Offline/Online Metrics</span>
                        <span className="font-bold text-secondary">9.0 / 10 (Target-Ready)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                        <div className="h-full bg-secondary rounded-full" style={{ width: "90%" }} />
                      </div>
                    </div>
                    {/* Dim 2 */}
                    <div>
                      <div className="flex justify-between text-xs text-on-surface mb-1 font-medium">
                        <span>Two-Tower Model Architecture &amp; ANN Retrieval</span>
                        <span className="font-bold text-primary">8.5 / 10 (Strong)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                        <div className="h-full bg-primary-container rounded-full" style={{ width: "85%" }} />
                      </div>
                    </div>
                    {/* Dim 3 */}
                    <div>
                      <div className="flex justify-between text-xs text-on-surface mb-1 font-medium">
                        <span>Serving Infrastructure &amp; P99 Latency Budget (&lt;45ms)</span>
                        <span className="font-bold text-error">7.0 / 10 (Remediation Needed)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                        <div className="h-full bg-error rounded-full" style={{ width: "70%" }} />
                      </div>
                    </div>
                    {/* Dim 4 */}
                    <div>
                      <div className="flex justify-between text-xs text-on-surface mb-1 font-medium">
                        <span>Feature Store, Drift Monitoring &amp; Graceful Fallbacks</span>
                        <span className="font-bold text-primary">8.0 / 10 (Competent)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                        <div className="h-full bg-primary-container rounded-full" style={{ width: "80%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Architectural Critique Snippet Extract */}
                <div className="bg-surface-container-lowest p-4 rounded-lg shadow-xs space-y-2 border border-outline-variant/20">
                  <div className="flex items-center gap-2 text-on-surface text-xs sm:text-sm font-bold font-heading">
                    <span className="material-symbols-outlined text-primary text-[18px]">terminal</span>
                    <span>Vikramaditya&apos;s Direct Architectural Critique</span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-mono leading-relaxed bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
                    &ldquo;Your FAISS HNSW graph indexing is theoretically sound, but in production, updating graph edges in real time with continuous user writes will cause index lockups. Suggest a tiered architecture: ScaNN for approximate in-memory retrieval on hot candidates (&lt;15m) combined with a Redis-backed pre-computed embedding cache for cold tier users. Reduce your ranking re-ranker from 500 candidates down to top-80 to preserve your 30ms SLA.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Verified Reviews & Testimonials */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-xs border border-outline-variant/40 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">reviews</span>
                  <h2 className="text-lg sm:text-xl font-bold text-on-surface font-heading">
                    Verified Candidate Reviews (142)
                  </h2>
                </div>
                <span className="text-xs text-on-surface-variant font-medium">All sessions post-audit verified</span>
              </div>
              <div className="space-y-4">
                {/* Review 1 */}
                <div className="p-4 sm:p-5 rounded-xl bg-surface-container-low space-y-2.5 border border-outline-variant/20">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-xs text-on-primary-fixed-variant font-bold">
                        AK
                      </div>
                      <div>
                        <span className="text-sm font-bold text-on-surface block font-heading">Aniket Kulkarni</span>
                        <span className="text-xs text-on-surface-variant">Transitioned from Tier-3 IT Services to Zepto MLE</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-secondary">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined text-[16px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      ))}
                      <span className="text-xs font-bold ml-1">5.0</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    &ldquo;Vikramaditya did not sugarcoat anything. In 15 minutes he pinpointed why my resume was being filtered out by automated ATS filters for AI roles. The mock on distributed model training gave me the exact vocabulary and depth needed for Zepto&apos;s bar raiser round. Worth 10x the price.&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-outline text-xs pt-1">
                    <span className="inline-flex items-center gap-1 text-secondary font-medium">
                      <span className="material-symbols-outlined text-[14px]">verified</span> Service: S06 Technical Mock
                    </span>
                    <span>Reviewed Oct 14, 2024</span>
                  </div>
                </div>

                {/* Review 2 */}
                <div className="p-4 sm:p-5 rounded-xl bg-surface-container-low space-y-2.5 border border-outline-variant/20">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-xs text-on-primary-fixed-variant font-bold">
                        PM
                      </div>
                      <div>
                        <span className="text-sm font-bold text-on-surface block font-heading">Pooja Mehra</span>
                        <span className="text-xs text-on-surface-variant">Placed at Swiggy as Lead Data Scientist</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-secondary">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined text-[16px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      ))}
                      <span className="text-xs font-bold ml-1">5.0</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    &ldquo;The 48-hour deliverable document was 6 pages long. He literally provided custom code snippet architectures demonstrating how Triton inference workers should be batched under peak surges. I went into my final technical interviews completely relaxed.&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-outline text-xs pt-1">
                    <span className="inline-flex items-center gap-1 text-secondary font-medium">
                      <span className="material-symbols-outlined text-[14px]">verified</span> Service: S04 Codebase &amp; Architecture Audit
                    </span>
                    <span>Reviewed Sep 28, 2024</span>
                  </div>
                </div>

                {/* Review 3 */}
                <div className="p-4 sm:p-5 rounded-xl bg-surface-container-low space-y-2.5 border border-outline-variant/20">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-xs text-on-primary-fixed-variant font-bold">
                        DS
                      </div>
                      <div>
                        <span className="text-sm font-bold text-on-surface block font-heading">Divyanshu Sharma</span>
                        <span className="text-xs text-on-surface-variant">Backend Engineer pivoting into Production LLMs</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-secondary">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined text-[16px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      ))}
                      <span className="text-xs font-bold ml-1">5.0</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    &ldquo;Clear, pragmatic roadmap tailored to someone with strong Java/Go foundations but zero PyTorch experience. Guided me directly to build high-impact projects that recruiters notice, without wasting 6 months on useless certifications.&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-outline text-xs pt-1">
                    <span className="inline-flex items-center gap-1 text-secondary font-medium">
                      <span className="material-symbols-outlined text-[14px]">verified</span> Service: S09 Career Transition Roadmap
                    </span>
                    <span>Reviewed Sep 04, 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: STICKY BOOKING PANEL ================= */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-5">
            {/* Main Booking Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xl border border-outline-variant/40 space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                <div>
                  <span className="text-[11px] text-outline uppercase tracking-wider block font-bold">
                    Direct Mentor Booking
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-on-surface font-heading">
                    Book Vikramaditya
                  </h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-secondary bg-secondary-container/50 px-2.5 py-0.5 rounded-full font-bold">
                    Live Calendar
                  </span>
                </div>
              </div>

              {/* Step 1: Select Service Track */}
              <div className="space-y-3">
                <span className="text-xs sm:text-sm text-on-surface font-bold flex items-center justify-between">
                  <span>1. Choose Service Audit Module</span>
                  <span className="text-outline font-normal text-xs">All include 48h SLA</span>
                </span>
                <div className="space-y-2">
                  {AI_SERVICES.map((svc) => {
                    const isSelected = selectedService.code === svc.code;
                    return (
                      <label
                        key={svc.code}
                        onClick={() => setSelectedService(svc)}
                        className={`flex items-start justify-between p-3.5 rounded-xl cursor-pointer transition-all border ${
                          isSelected
                            ? "bg-primary-fixed/30 border-2 border-primary shadow-xs"
                            : "bg-surface-container-low hover:bg-surface-container border-outline-variant/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="ai_service_choice"
                            checked={isSelected}
                            onChange={() => setSelectedService(svc)}
                            className="mt-1 accent-primary w-4 h-4 cursor-pointer"
                          />
                          <div className="flex flex-col">
                            <span className="text-xs sm:text-sm text-on-surface font-bold flex items-center gap-1.5">
                              {svc.name}
                              {svc.isTopPick && (
                                <span className="px-1.5 py-0.5 bg-primary text-on-primary text-[10px] rounded uppercase font-bold tracking-wider">
                                  Top Pick
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-on-surface-variant mt-0.5">{svc.tagline}</span>
                          </div>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-primary font-heading">₹{svc.price}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Choose Slot (Asia/Kolkata IST) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-on-surface font-bold">2. Select Slot (Asia/Kolkata IST)</span>
                  <span className="text-xs text-secondary flex items-center gap-1 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" /> Instant Lock
                  </span>
                </div>

                {/* Date pills */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  {DATES.map((d, idx) => {
                    const isDateSelected = selectedDateIdx === idx;
                    return (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => setSelectedDateIdx(idx)}
                        className={`py-2 px-1 rounded-lg text-center flex flex-col items-center transition-all cursor-pointer border ${
                          isDateSelected
                            ? "bg-primary text-on-primary font-bold shadow-xs border-primary"
                            : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container border-outline-variant/30"
                        }`}
                      >
                        <span className="block text-[10px] sm:text-[11px] font-normal uppercase">{d.label}</span>
                        <span className="text-xs sm:text-sm font-bold font-heading">{d.date}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Time Slots */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] text-outline block font-medium">Evening Slots (Peak Focus)</span>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const isSlotSelected = selectedSlotId === slot.id;
                      if (slot.status === "held") {
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            disabled
                            className="py-2.5 px-3 rounded-lg bg-surface-container-highest/60 text-outline text-xs text-center line-through cursor-not-allowed border border-outline-variant/20"
                          >
                            {slot.time}
                          </button>
                        );
                      }

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={`py-2.5 px-3 rounded-lg text-xs text-center font-bold transition-all cursor-pointer border ${
                            isSlotSelected
                              ? "bg-primary text-on-primary shadow-xs border-primary"
                              : "bg-surface-container-low text-on-surface hover:bg-surface-container border-outline-variant/30"
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary-fixed/20 text-on-primary-fixed-variant text-xs font-semibold">
                  <span className="material-symbols-outlined text-[16px]">lock_clock</span>
                  <span>15-minute checkout lock applied upon proceeding</span>
                </div>
              </div>

              {/* Step 3: Transparent Pricing & Policy (PRD §7.3) */}
              <div className="space-y-3 pt-2 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>Base Fee ({selectedService.name.split(":")[0]})</span>
                  <span className="font-bold text-on-surface">₹{basePrice}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>Platform &amp; Verification Fee</span>
                  <span className="font-bold text-secondary">₹0 (Waived)</span>
                </div>
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>GST (Applicable)</span>
                  <span className="font-medium text-on-surface">Included</span>
                </div>

                {/* DreamX Pro Checkbox */}
                <div className="pt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer bg-surface-container-lowest p-2.5 rounded-lg shadow-xs border border-outline-variant/30">
                    <input
                      type="checkbox"
                      checked={applyProDiscount}
                      onChange={(e) => setApplyProDiscount(e.target.checked)}
                      className="accent-primary w-4 h-4 cursor-pointer"
                    />
                    <div className="flex-1 flex items-center justify-between text-xs">
                      <span className="font-bold text-on-surface">Apply DreamX Pro (5% off)</span>
                      <span className="font-bold text-secondary">- ₹{Math.round(basePrice * 0.05)}</span>
                    </div>
                  </label>
                  <span className="text-[11px] text-outline block mt-1 px-1 leading-tight">
                    *Pro discount funded entirely by DreamX platform. Mentor receives 100% of list payout.
                  </span>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30 text-on-surface">
                  <div>
                    <span className="text-sm font-bold block leading-none font-heading">Net Payable</span>
                    <span className="text-[11px] text-outline">Razorpay / UPI / NetBanking</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-extrabold text-primary font-heading">₹{netPayable}</span>
                </div>
              </div>

              {/* Refund SLA Commitment Badge (PRD §11.3) */}
              <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-xs flex items-start gap-2.5 border border-outline-variant/30">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">verified_user</span>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-on-surface block">
                    Enforceable 48h Audit SLA &amp; Refund Guarantee
                  </span>
                  <p className="text-xs text-on-surface-variant leading-snug">
                    100% full refund if cancelled ≥1h prior. 80% automated escrow refund if the verified deliverable scorecard is not logged within 48h.
                  </p>
                </div>
              </div>

              {/* Primary CTA Button */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setBookingLocked(true)}
                  className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                  <span>Proceed to Secure Booking (₹{netPayable})</span>
                </button>
                <div className="flex items-center justify-center gap-2 text-outline text-[11px] pt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">lock</span> Encrypted Checkout
                  </span>
                  <span>•</span>
                  <span>Instant Confirmation</span>
                  <span>•</span>
                  <span>Google Calendar Sync</span>
                </div>
              </div>
            </div>

            {/* Alternative Urgency Routing: Smart Match Dispatch */}
            <div className="bg-surface-container-low rounded-2xl p-5 shadow-xs border border-outline-variant/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">swap_calls</span>
                <span className="text-sm font-bold text-on-surface font-heading">
                  Need an urgent mock within 6 hours?
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                If Vikramaditya&apos;s evening slots don&apos;t match your interview timeline, our Smart Match engine routes you to another verified Tier-1 ML Lead instantly.
              </p>
              <Link
                href="/mentor/dispatch"
                className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
              >
                <span>Dispatch via Smart Match AI Track</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Locked Dialog */}
      {bookingLocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/40 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2 text-secondary font-bold text-sm">
                <span className="material-symbols-outlined text-[20px]">lock_clock</span>
                <span>Atomic Slot Hold Confirmed</span>
              </div>
              <button
                type="button"
                onClick={() => setBookingLocked(false)}
                className="text-outline hover:text-on-surface text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs uppercase text-outline font-bold">15-Minute Escrow Lock Window</div>
              <p className="text-sm text-on-surface">
                You have locked <strong>{selectedService.name}</strong> with <strong>Vikramaditya Rao</strong> for <strong>{DATES[selectedDateIdx].label} {DATES[selectedDateIdx].date} ({TIME_SLOTS.find(s => s.id === selectedSlotId)?.time || "07:30 PM - 08:30 PM"})</strong>.
              </p>
              <div className="p-3 rounded-xl bg-surface-container-low text-xs space-y-1">
                <div className="flex justify-between font-medium">
                  <span>Payable Amount:</span>
                  <span className="font-bold text-primary text-sm font-heading">₹{netPayable} (INR)</span>
                </div>
                <div className="text-[11px] text-secondary font-semibold">
                  ✓ Protected under 48h Deliverable SLA and 1h Cancellation Policy
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBookingLocked(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-outline-variant text-on-surface text-xs font-semibold hover:bg-surface-container-low"
              >
                Cancel
              </button>
              <Link
                href={`/dashboard/bookings?mentor=vikramaditya-rao&service=${selectedService.code}&price=${netPayable}`}
                className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-on-primary text-xs font-bold text-center hover:bg-primary-container shadow-md"
              >
                Confirm &amp; Proceed to Escrow
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
