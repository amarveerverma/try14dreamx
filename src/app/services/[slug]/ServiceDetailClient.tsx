"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { type Service } from "@/data/services";
import { MENTORS } from "@/data/mentors";

export function ServiceDetailClient({ service }: { service: Service }) {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedMentor, setSelectedMentor] = React.useState<string>("smart-match");
  const [selectedDateIdx, setSelectedDateIdx] = React.useState(1); // Fri 25 Oct by default
  const [selectedSlot, setSelectedSlot] = React.useState("08:30 PM");
  const [secondsRemaining, setSecondsRemaining] = React.useState(14 * 60 + 32);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = React.useState(false);
  const [isAuthorizing, setIsAuthorizing] = React.useState(false);

  const handleAuthorizeSingleBooking = () => {
    let activeUser = user;
    if (!activeUser && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("dreamx_user");
        if (stored) activeUser = JSON.parse(stored);
      } catch {
        // ignore
      }
    }

    if (!activeUser) {
      router.push(`/login?redirect=${encodeURIComponent(`/services/${service.slug}`)}`);
      return;
    }

    setIsAuthorizing(true);
    router.push(
      `/dashboard/bookings?service=${service.code}&mentor=${selectedMentor}&price=${service.price}&slot=${encodeURIComponent(selectedSlot)}&booking=confirmed`
    );
  };

  const approvedMentors = React.useMemo(() => {
    const matched = MENTORS.filter((m) =>
      m.approvedServices.some((s) => s.startsWith(service.code))
    );
    return matched.length > 0 ? matched : MENTORS.slice(0, 2);
  }, [service.code]);

  // 15-Minute Atomic Escrow Lock Countdown Timer
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const dates = [
    { day: "Thu", date: "24 Oct" },
    { day: "Fri", date: "25 Oct" },
    { day: "Sat", date: "26 Oct" },
    { day: "Sun", date: "27 Oct" },
  ];

  const slots = [
    { time: "07:00 PM", status: "available" },
    { time: "08:30 PM", status: "active" },
    { time: "10:00 PM", status: "held" },
  ];

  return (
    <div className="flex flex-col w-full bg-surface">
      {/* Subtle Top Ambient Glow */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6 pb-20">
        <div className="absolute -top-16 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-96 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* 1. Breadcrumb & Operational SLA Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-on-surface-variant overflow-x-auto whitespace-nowrap py-1">
            <Link href="/" className="hover:text-primary transition-colors font-medium">Home</Link>
            <span className="text-outline-variant text-[12px]">/</span>
            <Link href="/services" className="hover:text-primary transition-colors font-medium">Services Directory (S01–S10)</Link>
            <span className="text-outline-variant text-[12px]">/</span>
            <span className="text-on-surface font-semibold">{service.code}: {service.title}</span>
            <span className="text-outline-variant text-[12px]">/</span>
            <span className="text-primary font-bold">Direct Booking &amp; Escrow</span>
          </nav>
          <div className="inline-flex items-center gap-2 self-start md:self-auto bg-surface-container-low px-3.5 py-1.5 rounded-full shadow-xs border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-xs text-on-surface font-bold tracking-wide uppercase">Razorpay Escrow Protected</span>
            <span className="text-outline-variant">•</span>
            <span className="text-xs text-secondary font-bold">48h Rubric SLA Guaranteed</span>
          </div>
        </div>

        {/* 2. Two-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Detailed Service Specification & Deliverables (7 cols) */}
          <section className="lg:col-span-7 flex flex-col gap-6 sm:gap-8">
            {/* Header Zone */}
            <div className="bg-surface-container-lowest p-6 sm:p-7 lg:p-8 rounded-2xl shadow-xs border border-outline-variant/40 flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  Service {service.code}
                </span>
                <span className="bg-surface-container text-on-surface-variant text-xs px-3 py-1 rounded-full font-semibold">
                  {service.duration}
                </span>
                <span className="bg-secondary-container text-on-secondary-container text-xs px-3 py-1 rounded-full font-bold">
                  Most Popular
                </span>
                <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs px-3 py-1 rounded-full font-semibold">
                  SDE-2 &amp; SDE-3 Bar
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface leading-tight tracking-tight font-heading">
                {service.title} &amp; Distributed Architecture Drill
              </h1>

              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                {service.fullDescription || "Live 60-minute stress-simulation modeled on Tier-1 tech bar-raiser interviews. Rigorously tests distributed systems, microservice failure modes, low-latency queues, and whiteboard trade-off defense. Includes an actionable 8-dimension rubric deliverable filed within 48 hours."}
              </p>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 pt-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-amber-600" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-base sm:text-lg font-bold font-heading">4.97</span>
                    <span className="text-xs text-outline font-normal">/ 5.0</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant mt-0.5">240+ completed drills</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-secondary">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span className="text-base sm:text-lg font-bold font-heading">100%</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant mt-0.5">On-Time 48h SLA</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-primary">
                    <span className="material-symbols-outlined text-[18px]">groups</span>
                    <span className="text-base sm:text-lg font-bold font-heading">320+</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant mt-0.5">GCC &amp; Unicorn Mentors</span>
                </div>
              </div>
            </div>

            {/* Structured 60-Minute Agenda */}
            <div className="bg-surface-container-lowest p-6 sm:p-7 lg:p-8 rounded-2xl shadow-xs border border-outline-variant/40 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-primary uppercase font-bold tracking-wider">Strict Execution Protocol</span>
                  <h2 className="text-lg sm:text-xl font-bold text-on-surface mt-1 font-heading">What the {service.duration} Session Covers</h2>
                </div>
                <span className="material-symbols-outlined text-outline text-[24px]">timer</span>
              </div>

              <div className="flex flex-col gap-3.5">
                {/* Timeline Item 1 */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-low transition-all hover:bg-surface-container border border-outline-variant/20">
                  <div className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg bg-surface-container-highest text-primary">
                    00–10 m
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="text-sm font-bold text-on-surface font-heading">Candidate Formulation &amp; Boundary Scoping</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">Functional &amp; Non-Functional requirement isolation. DAU/QPS throughput math, storage sizing calculations, and latency constraints (p95 / p99).</p>
                  </div>
                </div>

                {/* Timeline Item 2 */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-low transition-all hover:bg-surface-container border border-outline-variant/20">
                  <div className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg bg-surface-container-highest text-primary">
                    10–35 m
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="text-sm font-bold text-on-surface font-heading">Core Architecture, Data Ingestion &amp; Storage Topology</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">Live whiteboard layout: SQL vs NoSQL sharding keys, cache invalidation protocols (Write-Through vs Cache-Aside), and asynchronous event streaming (Kafka/RabbitMQ).</p>
                  </div>
                </div>

                {/* Timeline Item 3 */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-low transition-all hover:bg-surface-container border border-outline-variant/20">
                  <div className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg bg-surface-container-highest text-primary">
                    35–50 m
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="text-sm font-bold text-on-surface font-heading">Stress-Testing, Concurrency &amp; High Availability Bottlenecks</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">Simulated network partitions, distributed lock races (Redis/Redlock), distributed transactions (Saga/2PC), and cascading outage back-pressure protection.</p>
                  </div>
                </div>

                {/* Timeline Item 4 */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-low transition-all hover:bg-surface-container border border-outline-variant/20">
                  <div className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg bg-surface-container-highest text-secondary">
                    50–60 m
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="text-sm font-bold text-on-surface font-heading">Verbal Bar-Raiser Debrief &amp; Action Plan</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">Direct feedback on communication crispness, missing failure boundaries, architectural maturity, and specific homework areas ahead of the written 48h rubric.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 48-Hour Written Deliverable Preview (8-Dimension Scorecard) */}
            <div className="bg-surface-container-lowest p-6 sm:p-7 lg:p-8 rounded-2xl shadow-xs border border-outline-variant/40 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-secondary uppercase font-bold tracking-wider">The 48-Hour Enforceable Output</span>
                  <h2 className="text-lg sm:text-xl font-bold text-on-surface mt-1 font-heading">8-Dimension Technical Scorecard</h2>
                </div>
                <div className="inline-flex items-center gap-2 bg-secondary/10 px-3 py-1.5 rounded-full text-secondary text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span>Machine-Audit Ready (PDF + JSON)</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Every session mandates an exhaustive rubric file audited by DreamX&apos;s QA layer. If your mentor submits an incomplete debrief or fails the 48-hour delivery window, our automated escrow refund policy triggers instantly.
              </p>

              {/* Visual Scorecard Dimension Matrix */}
              <div className="bg-surface-container-low p-4 sm:p-5 rounded-xl flex flex-col gap-4 border border-outline-variant/20">
                <div className="flex items-center justify-between text-on-surface-variant text-xs uppercase tracking-wider font-bold pb-1">
                  <span>Evaluation Dimension</span>
                  <span>Target Standard (Out of 10)</span>
                </div>

                <div className="space-y-3.5">
                  {[
                    { label: "1. Requirements Discovery & QPS Sizing", score: "8.5 / 10", pct: "85%", color: "bg-primary", text: "text-primary" },
                    { label: "2. Data Architecture, Normalization & Sharding", score: "9.0 / 10", pct: "90%", color: "bg-primary", text: "text-primary" },
                    { label: "3. Concurrency, Race Handling & Locks", score: "7.0 / 10", pct: "70%", color: "bg-amber-600", text: "text-amber-700" },
                    { label: "4. Trade-off Defense (CAP, Latency vs Cost)", score: "8.0 / 10", pct: "80%", color: "bg-primary", text: "text-primary" },
                    { label: "5. Latency, Resiliency & Circuit Breakers", score: "8.5 / 10", pct: "85%", color: "bg-primary", text: "text-primary" },
                    { label: "6. REST/gRPC API Contract Hygiene", score: "9.5 / 10", pct: "95%", color: "bg-primary", text: "text-primary" },
                    { label: "7. Structured STAR Communication Flow", score: "9.0 / 10", pct: "90%", color: "bg-secondary", text: "text-secondary" },
                    { label: "8. System Maturity (Telemetry, Observability)", score: "7.5 / 10", pct: "75%", color: "bg-primary", text: "text-primary" },
                  ].map((dim) => (
                    <div key={dim.label} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs text-on-surface font-medium">
                        <span>{dim.label}</span>
                        <span className={`font-bold ${dim.text}`}>{dim.score}</span>
                      </div>
                      <div className="w-full bg-surface-container-highest rounded-full h-2">
                        <div className={`${dim.color} h-2 rounded-full`} style={{ width: dim.pct }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exact Timeline Deliverable */}
              <div className="p-4 rounded-xl bg-surface-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[28px]">schedule_send</span>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-on-surface font-heading">Target Delivery SLA: Within 48 Hours</span>
                    <span className="text-xs text-on-surface-variant">Direct sync to your candidate profile + encrypted download link via email.</span>
                  </div>
                </div>
                <span className="text-xs bg-surface-container-lowest px-2.5 py-1 rounded text-outline font-mono font-bold shrink-0">
                  T+48:00:00 MAX
                </span>
              </div>
            </div>

            {/* Candidate Prerequisites & Required Prep */}
            <div className="bg-surface-container-lowest p-6 sm:p-7 lg:p-8 rounded-2xl shadow-xs border border-outline-variant/40 flex flex-col gap-4">
              <h3 className="text-base sm:text-lg font-bold text-on-surface font-heading">Session Prerequisites &amp; Workspace</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant">To maximize the calibration rigor, you will be prompted to attach the following upon booking confirmation:</p>
              <ul className="space-y-3 text-xs sm:text-sm text-on-surface">
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">check_circle</span>
                  <span><strong>Target Role or Target Company JD:</strong> Tailors the architecture problem specifically to SDE-2/3 GCC, Unicorn, or Big Tech standards.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">check_circle</span>
                  <span><strong>Integrated Excalidraw Whiteboard:</strong> No setup needed. The video call automatically launches with a live interactive canvas.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">check_circle</span>
                  <span><strong>Audio/Video Readiness:</strong> High-bandwidth connectivity required. Mock is conducted under strict interview simulation constraints.</span>
                </li>
              </ul>
            </div>

            {/* Statutory ASCI & PRD §2.5 Disclaimers */}
            <div className="bg-surface-container-low p-5 sm:p-6 rounded-2xl flex items-start gap-3.5 border border-outline-variant/20">
              <span className="material-symbols-outlined text-outline text-[22px] shrink-0 mt-0.5">shield</span>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-outline uppercase font-bold tracking-wider">Statutory Transparency Disclaimer (ASCI &amp; PRD §2.5)</span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  DreamX operates purely as an objective career readiness &amp; talent verification infrastructure. {service.code} provides rigorous capability calibration, architectural drilling, and rubric gap analysis. <strong>DreamX does NOT promise, sell, or guarantee job placements, interviews, internal referrals, or specific hiring outcomes.</strong> All mock evaluations represent independent mentor assessments based on current engineering standards.
                </p>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: Secure Booking Console & Razorpay Escrow (5 cols) */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-6">
            <div className="bg-surface-container-lowest p-6 lg:p-7 rounded-2xl shadow-xl border border-outline-variant/40 flex flex-col gap-6">
              {/* Pricing Header Card */}
              <div className="flex flex-col gap-3 pb-5 border-b border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Service Fee</span>
                  <span className="text-xs bg-secondary/10 text-secondary px-2.5 py-0.5 rounded-full font-bold">100% Escrow Protected</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight font-heading">
                    ₹{service.price}
                  </span>
                  <span className="text-xs text-outline font-medium">all-inclusive (GST included)</span>
                </div>

                {/* Price Line items */}
                <div className="flex flex-col gap-1.5 pt-2 text-on-surface-variant text-xs">
                  <div className="flex justify-between">
                    <span>Standard Live Drill ({service.duration})</span>
                    <span className="text-on-surface font-bold">₹{service.price}.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DreamX Escrow &amp; Rubric Audit</span>
                    <span className="text-secondary font-bold">₹0 (Waived)</span>
                  </div>
                  <div className="flex justify-between text-outline">
                    <span>Mentor Payout Protection</span>
                    <span className="text-on-surface font-medium">Included</span>
                  </div>
                </div>

                {/* Zero Discount Stacking Disclosure */}
                <div className="bg-surface-container p-3 rounded-xl flex items-center gap-2.5 text-on-surface-variant mt-1 border border-outline-variant/20">
                  <span className="material-symbols-outlined text-[18px] text-primary shrink-0">info</span>
                  <p className="text-[11px] leading-tight">
                    <strong>PRD §7.3 Protection:</strong> Subsidies or coupons are absorbed 100% by DreamX. Mentors are unconditionally guaranteed their full compensation.
                  </p>
                </div>
              </div>

              {/* Step 1: Select Verified Mentor or Smart Match */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface uppercase font-bold tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px] font-bold">1</span>
                    Select Mentor or Dispatch
                  </span>
                  <Link href="/mentors" className="text-xs text-primary hover:underline font-bold">
                    Filter Tech Stack
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {approvedMentors.map((m) => (
                    <label
                      key={m.slug}
                      onClick={() => setSelectedMentor(m.slug)}
                      className={`relative flex items-center gap-3.5 p-3 rounded-xl cursor-pointer transition-all border ${
                        selectedMentor === m.slug
                          ? "bg-primary/5 border-2 border-primary shadow-xs"
                          : "bg-surface-container-low hover:bg-surface-container border-outline-variant/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="selected_mentor_choice"
                        checked={selectedMentor === m.slug}
                        onChange={() => setSelectedMentor(m.slug)}
                        className="w-4 h-4 text-primary accent-primary cursor-pointer"
                      />
                      <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden shrink-0 relative">
                        <Image
                          src={m.avatar}
                          alt={m.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm text-on-surface truncate font-bold font-heading">{m.name}</span>
                          <span className="material-symbols-outlined text-[16px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        </div>
                        <span className="text-xs text-on-surface-variant truncate">{m.role} • {m.company}</span>
                      </div>
                      <span className="text-xs text-secondary font-bold shrink-0">{m.rating} ★</span>
                    </label>
                  ))}

                  {/* Option B: Smart Match Dispatch */}
                  <label
                    onClick={() => setSelectedMentor("smart-match")}
                    className={`relative flex items-start gap-3.5 p-3 rounded-xl cursor-pointer transition-all border ${
                      selectedMentor === "smart-match"
                        ? "bg-primary/5 border-2 border-primary shadow-xs"
                        : "bg-surface-container-low hover:bg-surface-container border-outline-variant/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="selected_mentor_choice"
                      checked={selectedMentor === "smart-match"}
                      onChange={() => setSelectedMentor("smart-match")}
                      className="w-4 h-4 text-primary accent-primary mt-1 cursor-pointer"
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm text-on-surface font-bold font-heading">Automated Smart Match Dispatch</span>
                        <span className="bg-primary/10 text-primary text-[11px] font-bold px-2 py-0.5 rounded">Fastest</span>
                      </div>
                      <span className="text-xs text-on-surface-variant mt-0.5">Wave-1 immediate ping to vetted mentors matching your stack. 2h fallback guarantee.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Step 2: Date & Slot Selector with 15m Lock Timer */}
              <div className="flex flex-col gap-3">
                <span className="text-xs text-on-surface uppercase font-bold tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px] font-bold">2</span>
                  Select Date &amp; Slot (IST Asia/Kolkata)
                </span>

                {/* Date Selector Chips */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  {dates.map((d, idx) => (
                    <button
                      key={d.date}
                      type="button"
                      onClick={() => setSelectedDateIdx(idx)}
                      className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all cursor-pointer border ${
                        selectedDateIdx === idx
                          ? "bg-primary text-on-primary font-bold shadow-xs border-primary"
                          : "bg-surface-container text-on-surface-variant hover:bg-surface-container-highest border-outline-variant/20"
                      }`}
                    >
                      <span className="text-[11px] uppercase font-normal">{d.day}</span>
                      <span className="text-xs sm:text-sm font-bold font-heading">{d.date}</span>
                    </button>
                  ))}
                </div>

                {/* Slots */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {slots.map((s) => {
                    const isSelected = selectedSlot === s.time;
                    if (s.status === "held") {
                      return (
                        <button
                          key={s.time}
                          type="button"
                          disabled
                          className="p-2.5 rounded-xl bg-surface-container-highest text-center text-xs font-semibold text-outline cursor-not-allowed opacity-60 border border-outline-variant/20 line-through"
                        >
                          {s.time}
                        </button>
                      );
                    }
                    return (
                      <button
                        key={s.time}
                        type="button"
                        onClick={() => setSelectedSlot(s.time)}
                        className={`p-2.5 rounded-xl text-center text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-primary/10 text-primary border-2 border-primary shadow-xs"
                            : "bg-surface-container text-on-surface hover:bg-surface-container-highest border-outline-variant/30"
                        }`}
                      >
                        <span>{s.time}</span>
                        {isSelected && <span className="block text-[10px] text-primary/80 font-mono font-normal">Active Slot</span>}
                      </button>
                    );
                  })}
                </div>

                {/* 15m Lock Timer Warning */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 text-amber-900 border border-amber-500/20">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-amber-700 animate-spin">history</span>
                    <span className="text-xs font-medium">Slot held for you:</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-800">
                    {formatTimer(secondsRemaining)}
                  </span>
                </div>
              </div>

              {/* Step 3: Razorpay Escrow Protection Architecture */}
              <div className="flex flex-col gap-3 pt-2">
                <span className="text-xs text-on-surface uppercase font-bold tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px] font-bold">3</span>
                  How Razorpay Escrow Protects You
                </span>

                <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-3.5 border border-outline-variant/20">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">lock</span>
                    </div>
                    <div className="flex flex-col text-xs">
                      <span className="font-bold text-on-surface">1. Payment In Escrow</span>
                      <span className="text-on-surface-variant leading-snug">₹{service.price} captured via Razorpay and isolated in DreamX Nodal Escrow. Mentor does not receive payment yet.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">videocam</span>
                    </div>
                    <div className="flex flex-col text-xs">
                      <span className="font-bold text-on-surface">2. Live Drill Conducted</span>
                      <span className="text-on-surface-variant leading-snug">Google Meet telemetry records session attendance and duration verification.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">task_alt</span>
                    </div>
                    <div className="flex flex-col text-xs">
                      <span className="font-bold text-on-surface">3. 48h Deliverable Audited</span>
                      <span className="text-on-surface-variant leading-snug">Mentor submits 8-dimension rubric. Once QA confirms adherence, funds are settled.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Refund & SLA Rules */}
              <div className="space-y-2 text-on-surface-variant text-xs">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check</span>
                  <span><strong>100% Full Refund:</strong> Cancel anytime ≥1 hour before start time with instant 1-click reversal.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">check</span>
                  <span><strong>80% Rubric SLA Guarantee:</strong> Automatic compensation if scorecard is delayed beyond 48 hours.</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full bg-primary hover:bg-primary-container text-on-primary py-3.5 px-6 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Proceed to Razorpay Escrow Checkout</span>
                  <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                </button>
                <div className="flex items-center justify-center gap-3 text-outline text-[11px] pt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">lock</span> 256-Bit SSL
                  </span>
                  <span>•</span>
                  <span>UPI / Cards / NetBanking</span>
                  <span>•</span>
                  <span className="text-secondary font-bold">RBI Compliant Escrow</span>
                </div>
              </div>
            </div>

            {/* Help & Verification Contact Box */}
            <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl flex items-center justify-between text-on-surface-variant border border-outline-variant/30">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[24px]">support_agent</span>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm text-on-surface font-bold">Need custom timing or company-specific drill?</span>
                  <span className="text-xs text-outline">Priority concierge available for engineering cohorts.</span>
                </div>
              </div>
              <Link href="/dashboard/settings" className="text-xs text-primary font-bold hover:underline shrink-0">
                Talk to Support
              </Link>
            </div>
          </aside>
        </div>

        {/* 3. Verified Candidate Proof & Outcome Testimonials */}
        <section className="mt-16 sm:mt-20 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs text-secondary uppercase font-bold tracking-wider">Independent Proof of Rigor</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1 font-heading">Verified Candidate Outcomes from {service.code}</h2>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md">
              Recent engineering transitions to Tier-1 product organizations and GCC hubs following {service.code} architectural drills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/40 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-600">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <span className="text-xs bg-secondary/10 text-secondary px-2.5 py-0.5 rounded-full font-bold">Placed @ Swiggy SDE-2</span>
                </div>
                <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
                  &ldquo;The drill on Redis sentinel failure modes and distributed idempotency was almost identical to my actual round at Swiggy. The 8-dimension scorecard arrived in 36 hours and showed me my trade-off defense was lacking.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-surface-container">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden shrink-0 relative">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdqI1Ysq-FmYaK-pf37FqOxgsKW5YSEMh7Dzyau06rHg-uEjzwBabOo4DCbWUH2683Jue1s23hg1vnytzNEMpAGJ7RfHCdDmSYdFNA7LxJH6aoMuNIQ37H5_CClQCs3IxHhcaXbXIu90teYeXKmcT3yMUIFH74Oj7oy4wxqkDNWbMMOgueh8QMIM0mRkTMMbKX4-mzQ2JZsNkKYlUj6XCIQ2BkqFrbOlqJ6AxUBc5y"
                    alt="Nikhil Nair"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col text-xs">
                  <span className="font-bold text-on-surface">Nikhil Nair</span>
                  <span className="text-outline">Ex-Accenture • Transitioned to Backend SDE-2</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/40 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-600">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <span className="text-xs bg-secondary/10 text-secondary px-2.5 py-0.5 rounded-full font-bold">Placed @ PhonePe</span>
                </div>
                <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
                  &ldquo;I previously failed two system design rounds because I gave generic textbook answers. My DreamX mentor grilled me on high-concurrency wallet transactions and forced me to justify Postgres vs Cassandra with numbers.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-surface-container">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden shrink-0 relative">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFrJtRLT8p_JtRXNVQJ4aXZQv03dgVnkIgnwLmJqOp-ArfdVFNXaXSXmWwDAo-WrQKifXX8IzUfi5UZ5qJX7aS0GdhcE4IDxYHd2QXH0mjMYLLVws--CNtuJapHRukkPVZ73TDMqnotjYpsGk-m4nvarCQJAjXDOFmFySwaYubfYnmgZaMBFG-vvKF5kE3MCuz36F8ZoYXh3o59i_6t9ZUzEv2K9_cEiFcZvHJOYan"
                    alt="Divya Chandrasekaran"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col text-xs">
                  <span className="font-bold text-on-surface">Divya Chandrasekaran</span>
                  <span className="text-outline">Tier-3 College Alum • SDE-2 Platform Tech</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/40 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-600">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <span className="text-xs bg-secondary/10 text-secondary px-2.5 py-0.5 rounded-full font-bold">Placed @ Microsoft IDC</span>
                </div>
                <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
                  &ldquo;The escrow structure gave me complete peace of mind. Knowing the mentor had a contractual 48-hour SLA to submit line-item feedback on my distributed caching architecture made the whole experience institutional-grade.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-surface-container">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden shrink-0 relative">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeWgo7RF8il7zMjIrAbpxFJPCIGDx6a5phK6RpD9euYfoCZpe8WzNwJ1g0SeEiTnTGtRqgZr9QbKUw3K8HllHpNxV-DCY-VRFGV9u-Czg5DHzAlLfgAo0EPy2qGdv7N15gp9jZRjqEHtkT5amhDCeIRRio211BVwlQTa2v1YevKm72IIgbl6OG7xSAxlUWfeK0jxXMHG1pAD20fREW8-7X0VVEMbTK24tU9lT8vQ_c"
                    alt="Rohan Joshi"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col text-xs">
                  <span className="font-bold text-on-surface">Rohan Joshi</span>
                  <span className="text-outline">Promoted to SDE-2 (Distributed Cloud)</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-outline-variant/40 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2 text-secondary font-bold text-sm">
                <span className="material-symbols-outlined text-[20px]">lock</span>
                <span>Razorpay Escrow Gateway</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(false)}
                className="text-outline hover:text-on-surface text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-on-surface">
              <div className="p-3.5 bg-surface-container-low rounded-xl space-y-2 border border-outline-variant/20">
                <div className="flex justify-between font-bold text-sm font-heading">
                  <span>{service.code}: {service.title}</span>
                  <span className="text-primary">₹{service.price}</span>
                </div>
                <div className="flex justify-between text-outline">
                  <span>Mentor:</span>
                  <span className="font-medium text-on-surface">
                    {(() => {
                      if (selectedMentor === "smart-match") return "Automated Smart Match";
                      const chosen = MENTORS.find((m) => m.slug === selectedMentor);
                      return chosen ? chosen.name : "Automated Smart Match";
                    })()}
                  </span>
                </div>
                <div className="flex justify-between text-outline">
                  <span>Slot:</span>
                  <span className="font-medium text-on-surface">{dates[selectedDateIdx].date} ({selectedSlot})</span>
                </div>
                <div className="flex justify-between text-outline">
                  <span>Escrow Protection:</span>
                  <span className="text-secondary font-bold">Active (100% / 80% SLA)</span>
                </div>
              </div>

              <p className="text-outline leading-tight">
                Funds are held in an RBI-compliant nodal escrow account and will not be transferred to the mentor until your 8-dimension scorecard deliverable is verified within 48 hours.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-outline-variant text-on-surface text-xs font-semibold hover:bg-surface-container-low"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isAuthorizing}
                onClick={handleAuthorizeSingleBooking}
                className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-on-primary text-xs font-bold text-center hover:bg-primary-container shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>{isAuthorizing ? "Securing Escrow..." : `Authorize Escrow (₹${service.price})`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
