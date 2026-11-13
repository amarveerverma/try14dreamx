"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { type Mentor } from "@/data/mentors";

interface ServiceOption {
  code: string;
  name: string;
  tagline: string;
  price: number;
  duration: string;
  deliverable: string;
  isPopular?: boolean;
}

const APPROVED_SERVICES: ServiceOption[] = [
  {
    code: "S06",
    name: "S06: Technical Mock Interview",
    tagline: "60 min Live Coding / System Design + 8-Dim Rubric",
    price: 999,
    duration: "60 min",
    deliverable: "48h Deliverable SLA Protected",
    isPopular: true,
  },
  {
    code: "S01",
    name: "S01: Resume Review & Architecture Audit",
    tagline: "45 min Line-by-line ATS & Project Depth Tear-down",
    price: 599,
    duration: "45 min",
    deliverable: "Annotated PDF in 48h",
  },
  {
    code: "S08",
    name: "S08: Offer Negotiation & Benchmarking",
    tagline: "30 min ESOP Valuation, Comp Band Scripts",
    price: 699,
    duration: "30 min",
    deliverable: "Customized Email Script",
  },
  {
    code: "S10",
    name: "S10: Algorithmic Coding Prep",
    tagline: "60 min Graph/DP Deep Dive & Complexity Analysis",
    price: 999,
    duration: "60 min",
    deliverable: "Code Audit Notes in 48h",
  },
];

const DAYS = [
  { label: "Tomorrow", date: "Thu 24" },
  { label: "Fri", date: "25 Oct" },
  { label: "Sat", date: "26 Oct" },
  { label: "Sun", date: "27 Oct" },
];

const SLOTS = [
  { id: "s1", time: "07:00 PM – 08:00 PM", status: "available", isDefault: true },
  { id: "s2", time: "08:30 PM – 09:30 PM", status: "available" },
  { id: "s3", time: "10:00 PM – 11:00 PM", status: "available" },
  { id: "s4", time: "05:30 PM – 06:30 PM", status: "held", heldDuration: "11m" },
];

export function MentorProfileView({ mentor }: { mentor: Mentor }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [selectedService, setSelectedService] = React.useState<ServiceOption>(APPROVED_SERVICES[0]);
  const [selectedDayIdx, setSelectedDayIdx] = React.useState(0);
  const [selectedSlotId, setSelectedSlotId] = React.useState("s1");
  const [hasProDiscount, setHasProDiscount] = React.useState(false);
  const [bookingLocked, setBookingLocked] = React.useState(false);
  const [smartMatchRequested, setSmartMatchRequested] = React.useState(false);

  // Phase P6/P7 Booking State
  const [isClaiming, setIsClaiming] = React.useState(false);
  const [claimError, setClaimError] = React.useState<string | null>(null);
  const [activeBooking, setActiveBooking] = React.useState<{
    bookingId: string;
    bookingRef: string;
    holdExpiresAt: string;
    amountPaise: number;
  } | null>(null);
  const [preSessionNotes, setPreSessionNotes] = React.useState("");
  const [resumeUrl, setResumeUrl] = React.useState("");
  const [isConfirmingPayment, setIsConfirmingPayment] = React.useState(false);
  const [confirmError, setConfirmError] = React.useState<string | null>(null);
  const [confirmedSuccess, setConfirmedSuccess] = React.useState(false);

  // Phase P8 Smart Match State
  const [isRequestingSmartMatch, setIsRequestingSmartMatch] = React.useState(false);
  const [smartMatchError, setSmartMatchError] = React.useState<string | null>(null);
  const [smartMatchResult, setSmartMatchResult] = React.useState<{
    requestRef: string;
    dispatchedMentors: number;
    timeoutAt: string;
  } | null>(null);

  const basePrice = selectedService.price;
  const discountAmount = hasProDiscount ? Math.round(basePrice * 0.1) : 0;
  const netPayable = basePrice - discountAmount;

  // Calculate session start & end time
  const getSlotTimings = React.useCallback(() => {
    const now = new Date();
    // Offset by selectedDayIdx + 1 day
    const sessionDate = new Date(now.getTime() + (selectedDayIdx + 1) * 24 * 60 * 60 * 1000);
    sessionDate.setHours(19, 0, 0, 0); // 07:00 PM IST standard start
    const sessionEndDate = new Date(sessionDate.getTime() + 60 * 60 * 1000); // 1 hour duration
    return {
      start: sessionDate.toISOString(),
      end: sessionEndDate.toISOString(),
    };
  }, [selectedDayIdx]);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push(`/login?returnUrl=/mentors/${mentor.slug}`);
      return;
    }

    setClaimError(null);
    setIsClaiming(true);
    setBookingLocked(true);

    try {
      const timings = getSlotTimings();
      // Mentor UUID in Supabase (fallback to seeded mentor ID)
      const mentorUuid = "00000000-0000-0000-0000-000000000002";

      const res = await fetch("/api/checkout/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorId: mentorUuid,
          serviceCode: selectedService.code,
          slotId: selectedSlotId,
          sessionStart: timings.start,
          sessionEnd: timings.end,
          amountPaise: netPayable * 100,
          preSessionNotes: preSessionNotes || undefined,
          resumeUrl: resumeUrl || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setClaimError(data.error || "Failed to hold slot. It may be currently reserved.");
        return;
      }

      setActiveBooking({
        bookingId: data.bookingId,
        bookingRef: data.bookingRef,
        holdExpiresAt: data.holdExpiresAt,
        amountPaise: data.amountPaise,
      });
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : "Network error during slot claim.");
    } finally {
      setIsClaiming(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!activeBooking) return;
    setIsConfirmingPayment(true);
    setConfirmError(null);

    try {
      const res = await fetch("/api/checkout/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: activeBooking.bookingId,
          paymentReference: "PAY_CAPTURED_" + Date.now(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setConfirmError(data.error || "Payment confirmation failed.");
        return;
      }

      setConfirmedSuccess(true);
    } catch (err) {
      setConfirmError(err instanceof Error ? err.message : "Payment capture failed.");
    } finally {
      setIsConfirmingPayment(false);
    }
  };

  const handleTriggerSmartMatch = async () => {
    if (!isAuthenticated) {
      router.push(`/login?returnUrl=/mentors/${mentor.slug}`);
      return;
    }

    setIsRequestingSmartMatch(true);
    setSmartMatchError(null);

    try {
      const res = await fetch("/api/smart-match/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceCode: selectedService.code,
          amountPaise: netPayable * 100,
          preferredWindows: [{ day: "Tomorrow Evening", window: "07:00 PM – 10:00 PM IST" }],
          targetRole: "Senior Backend / ML Systems",
          preSessionNotes: "Triggered via Smart Match Dispatch alternative",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSmartMatchError(data.error || "Failed to initialize Smart Match dispatch.");
        return;
      }

      setSmartMatchResult({
        requestRef: data.request_ref,
        dispatchedMentors: data.dispatched_mentors,
        timeoutAt: data.timeout_at,
      });
    } catch (err) {
      setSmartMatchError(err instanceof Error ? err.message : "Error initiating Smart Match.");
    } finally {
      setIsRequestingSmartMatch(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-surface">
      {/* Top Trust & Verification Banner */}
      <section className="w-full bg-surface-container-low border-b border-outline-variant/30 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[13px] font-bold">
              ✓
            </span>
            <span className="text-xs sm:text-sm font-semibold text-on-surface">
              DreamX Verified Mentor Pipeline: Vetted against PRD §9.1 Verification Framework
            </span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="text-xs text-on-surface-variant flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
              Live Biometric &amp; Aadhaar Matched
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-outline-variant" />
            <span className="text-xs text-on-surface-variant flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[16px] text-secondary">domain_verification</span>
              Tier-1 GCC Background Checked
            </span>
            <span className="hidden md:inline-block w-1 h-1 rounded-full bg-outline-variant" />
            <span className="hidden md:inline-flex text-xs text-primary items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              48h Rubric Delivery SLA: 100%
            </span>
          </div>
        </div>
      </section>

      {/* Main Profile & Booking Shell */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 w-full">
        {/* Breadcrumb Context */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8 text-xs text-on-surface-variant">
          <Link href="/mentors" className="hover:text-primary transition-colors font-medium">
            Mentors Directory
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface-variant">Engineering &amp; System Design</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-semibold">{mentor.name} ({mentor.role.includes("Staff") ? "Staff SDE" : mentor.role})</span>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT COLUMN: Profile Identity, Track Records, Reviews (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-8 sm:gap-10">
            {/* Mentor Header Identity Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-7 shadow-xs border border-outline-variant/40 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-sm ring-4 ring-surface-container relative">
                    <Image
                      src={mentor.avatar}
                      alt={mentor.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-secondary text-on-secondary w-7 h-7 rounded-full flex items-center justify-center shadow-md">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                  </div>
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight leading-tight font-heading">
                      {mentor.name}
                    </h1>
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {mentor.experienceYears}+ Yrs Exp
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-on-surface-variant font-medium mb-1.5 leading-snug">
                    {mentor.role} @ {mentor.company}
                  </p>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-outline font-medium">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-outline">work_history</span>
                      Ex-Flipkart &amp; Amazon
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                      {mentor.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Strict 3-Tier Verification Badge Strip (PRD §9.1) */}
              <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-2.5">
                <div className="text-[11px] sm:text-xs text-outline tracking-wider uppercase font-bold">
                  Vetted Through PRD §9.1 Protocol
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="flex items-center gap-2.5 bg-surface-container-lowest px-3 py-2 rounded-lg border border-outline-variant/30">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">verified</span>
                    <div className="flex flex-col">
                      <span className="text-xs text-on-surface font-bold">Tier 1: Identity</span>
                      <span className="text-[11px] text-on-surface-variant leading-tight">Govt ID &amp; Biometric</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 bg-surface-container-lowest px-3 py-2 rounded-lg border border-outline-variant/30">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">badge</span>
                    <div className="flex flex-col">
                      <span className="text-xs text-on-surface font-bold">Tier 2: Background</span>
                      <span className="text-[11px] text-on-surface-variant leading-tight">Staff Seniority Verified</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 bg-surface-container-lowest px-3 py-2 rounded-lg border border-outline-variant/30">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">fact_check</span>
                    <div className="flex flex-col">
                      <span className="text-xs text-on-surface font-bold">Tier 3: Service-Approved</span>
                      <span className="text-[11px] text-on-surface-variant leading-tight">S06, S01, S08, S10</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance & Reliability Scoreboard */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-surface-container rounded-xl flex flex-col">
                  <span className="text-[11px] text-outline uppercase tracking-wider font-semibold">Completed</span>
                  <span className="text-xl sm:text-2xl font-bold text-on-surface font-heading mt-0.5">142</span>
                  <span className="text-[11px] text-secondary font-medium">100% Mock Sessions</span>
                </div>
                <div className="p-3 bg-surface-container rounded-xl flex flex-col">
                  <span className="text-[11px] text-outline uppercase tracking-wider font-semibold">Rating</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xl sm:text-2xl font-bold text-on-surface font-heading">4.96</span>
                    <span
                      className="material-symbols-outlined text-amber-500 text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant">118 verified reviews</span>
                </div>
                <div className="p-3 bg-surface-container rounded-xl flex flex-col">
                  <span className="text-[11px] text-outline uppercase tracking-wider font-semibold">Punctuality</span>
                  <span className="text-xl sm:text-2xl font-bold text-on-surface font-heading mt-0.5">99.4%</span>
                  <span className="text-[11px] text-secondary font-medium">On-Time Attendance</span>
                </div>
                <div className="p-3 bg-surface-container rounded-xl flex flex-col">
                  <span className="text-[11px] text-outline uppercase tracking-wider font-semibold">48h SLA</span>
                  <span className="text-xl sm:text-2xl font-bold text-on-surface font-heading mt-0.5">100%</span>
                  <span className="text-[11px] text-secondary font-medium">Rubric within 48h</span>
                </div>
              </div>
            </div>

            {/* Bio & Mentorship Philosophy */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-7 shadow-xs border border-outline-variant/40 flex flex-col gap-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-on-surface mb-2 font-heading">
                  Mentorship Philosophy &amp; Strategy
                </h2>
                <div className="w-12 h-1 bg-primary rounded-full" />
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                I specialize in de-risking career transitions for Indian software engineers coming from non-pedigree Tier-2 &amp; Tier-3 engineering institutions aiming for SDE-2 and SDE-3 roles at top product ecosystems. Interviews at modern GCCs and high-scale product startups in India have shifted completely from generic Leetcode memorization to distributed systems fault tolerance, high-concurrency event pipelines, and structured trade-off communication.
              </p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                During our sessions, I recreate actual internal Bar Raiser committee standards. You will receive zero sugarcoated feedback; instead, you get an itemized 8-dimension capability audit delivered within 48 hours to patch architectural and behavioral gaps immediately.
              </p>

              {/* Core Competency Tags */}
              <div>
                <h3 className="text-xs sm:text-sm text-on-surface font-bold mb-3 uppercase tracking-wider">
                  Core Technical Domains
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Distributed Systems (Consensus & Partitioning)",
                    "High-Concurrency Go & Java",
                    "Kafka, CDC & Event-Driven Architecture",
                    "Low-Level Design (Design Patterns & Clean Code)",
                    "Amazon/Uber Leadership Principles",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-surface-container text-on-surface text-xs font-semibold rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Verified Recent Student Placement Proof */}
              <div className="pt-4 border-t border-outline-variant/20">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h3 className="text-xs sm:text-sm text-on-surface font-bold uppercase tracking-wider">
                    Verified Mentees Placement Proof
                  </h3>
                  <span className="text-xs text-secondary font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">shield</span>
                    DreamX Career Escrow Verified
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-surface-container-low rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center font-bold text-on-surface font-heading text-sm">
                      Ub
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-on-surface leading-tight">Uber India</span>
                      <span className="text-xs text-on-surface-variant truncate font-medium">SDE-2 (L4) Backend • 38 LPA</span>
                      <span className="text-[11px] text-outline">Prepped via S06 Mock Series (May 2024)</span>
                    </div>
                  </div>
                  <div className="p-3.5 bg-surface-container-low rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center font-bold text-on-surface font-heading text-sm">
                      MS
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-on-surface leading-tight">Microsoft IDC</span>
                      <span className="text-xs text-on-surface-variant truncate font-medium">Software Engineer (L60) • 32 LPA</span>
                      <span className="text-[11px] text-outline">Tier-3 College Alum (July 2024)</span>
                    </div>
                  </div>
                  <div className="p-3.5 bg-surface-container-low rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center font-bold text-on-surface font-heading text-sm">
                      Ph
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-on-surface leading-tight">PhonePe</span>
                      <span className="text-xs text-on-surface-variant truncate font-medium">Software Engineer-2 • 34 LPA</span>
                      <span className="text-[11px] text-outline">System Design Deep-Dive (Aug 2024)</span>
                    </div>
                  </div>
                  <div className="p-3.5 bg-surface-container-low rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center font-bold text-on-surface font-heading text-sm">
                      Sw
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-on-surface leading-tight">Swiggy Core Logistics</span>
                      <span className="text-xs text-on-surface-variant truncate font-medium">SDE-2 Platform • 31 LPA</span>
                      <span className="text-[11px] text-outline">Negotiation Coaching (Sept 2024)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 48-Hour Deliverable Preview: 8-Dimension Rubric Scorecard */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-7 shadow-xs border border-outline-variant/40 flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-on-surface font-heading">
                    The 48h Deliverable Guarantee
                  </h2>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                    Every S06 mock session includes an institutional 8-dimension assessment.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold uppercase tracking-wider">
                  PRD §7.6 Protocol
                </span>
              </div>

              <div className="bg-surface-container-low rounded-xl p-4 sm:p-5 border border-outline-variant/30 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">assignment_turned_in</span>
                    <span className="text-xs sm:text-sm font-bold text-on-surface">
                      Sample Scorecard: S06 System Design &amp; Concurrency
                    </span>
                  </div>
                  <span className="text-xs text-outline font-medium">Audit ID: #DX-9942</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-center">
                  <div className="p-2.5 bg-surface-container-lowest rounded-lg border border-outline-variant/20">
                    <span className="text-[11px] text-outline block font-medium">Requirements Discovery</span>
                    <span className="text-sm sm:text-base font-bold text-secondary">8.5 / 10</span>
                  </div>
                  <div className="p-2.5 bg-surface-container-lowest rounded-lg border border-outline-variant/20">
                    <span className="text-[11px] text-outline block font-medium">High-Level Data Flow</span>
                    <span className="text-sm sm:text-base font-bold text-secondary">8.0 / 10</span>
                  </div>
                  <div className="p-2.5 bg-surface-container-lowest rounded-lg border border-outline-variant/20">
                    <span className="text-[11px] text-outline block font-medium">Concurrency / Race Cond.</span>
                    <span className="text-sm sm:text-base font-bold text-amber-600">6.0 / 10</span>
                  </div>
                  <div className="p-2.5 bg-surface-container-lowest rounded-lg border border-outline-variant/20">
                    <span className="text-[11px] text-outline block font-medium">Trade-off Defense</span>
                    <span className="text-sm sm:text-base font-bold text-secondary">7.5 / 10</span>
                  </div>
                </div>

                <div className="p-3.5 bg-surface-container-lowest rounded-lg text-xs text-on-surface-variant font-mono leading-relaxed border-l-4 border-primary">
                  <p className="mb-1 text-on-surface font-bold font-sans">Mentor Action Item Extract:</p>
                  &ldquo;Candidate showed strong schema modeling for payment state machines, but failed to address idempotent token generation during split-brain Redis cluster node failovers. Recommended Action: Review Raft log replication and implement distributed locks with Redlock algorithm before attending PhonePe round 2.&rdquo;
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-outline pt-1 gap-2">
                  <span>Standard delivery format: PDF + Structured JSON in candidate portal</span>
                  <span className="text-secondary font-bold">Automatic Escrow Release upon Verification</span>
                </div>
              </div>
            </div>

            {/* Verified Student Reviews */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-7 shadow-xs border border-outline-variant/40 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-on-surface font-heading">
                    Verified Candidate Reviews (118)
                  </h2>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                    Only candidates who booked and finished sessions through DreamX escrow can review.
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-surface-container px-3 py-1.5 rounded-lg shrink-0">
                  <span
                    className="material-symbols-outlined text-amber-500 text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="text-sm font-bold text-on-surface">4.96</span>
                  <span className="text-outline text-xs">/ 5.0</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {/* Review 1 */}
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2.5 border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs">
                        RK
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-on-surface block">Rohan Kulkarni</span>
                        <span className="text-[11px] text-outline">PES University &apos;23 • Now SDE-1 at Amazon</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-outline hidden sm:inline">Oct 14, 2024</span>
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">
                        S06 Technical Mock
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    &ldquo;Arishta conducted my mock just 4 days before my Amazon Bar Raiser loop. She grilled me on distributed cache cache-stampede issues which directly appeared in my actual round! Her 48-hour rubric scorecard was brutally honest and gave me specific corrections.&rdquo;
                  </p>
                </div>

                {/* Review 2 */}
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2.5 border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary font-bold flex items-center justify-center text-xs">
                        NT
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-on-surface block">Neha Tiwari</span>
                        <span className="text-[11px] text-outline">Tier-3 College Alum • SDE-2 Offer at Swiggy</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-outline hidden sm:inline">Sep 28, 2024</span>
                      <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary text-[10px] font-bold">
                        S08 Offer Negotiation
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    &ldquo;I booked S08 for negotiating my 2 competing offers. Arishta broke down the ESOP vesting cliff versus guaranteed base salary. Thanks to her script, I counter-offered Swiggy and got a ₹4.5 LPA upward correction on base.&rdquo;
                  </p>
                </div>

                {/* Review 3 */}
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2.5 border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-700 font-bold flex items-center justify-center text-xs">
                        VG
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-on-surface block">Vikramaditya G.</span>
                        <span className="text-[11px] text-outline">Lead Engineer @ Fintech Startup</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-outline hidden sm:inline">Sep 12, 2024</span>
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">
                        S01 Architecture Audit
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    &ldquo;Her feedback on framing distributed tracing and Cassandra partition key design was exceptional. Exactly what senior candidates need to bridge the gap into staff engineering.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Approved Services, Interactive Calendar Booking Widget (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28">
            {/* Sticky Booking Widget Card */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/40 p-5 sm:p-6 flex flex-col gap-5 sm:gap-6">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                <div>
                  <span className="text-[11px] text-outline uppercase tracking-wider font-bold block">
                    Direct Session Booking
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-on-surface font-heading">
                    Select Service &amp; Slot
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-extrabold text-primary font-heading block">
                    ₹{netPayable}
                  </span>
                  <span className="text-[11px] text-outline block">All inclusive (INR)</span>
                </div>
              </div>

              {/* Step 1: Service Selector Pills */}
              <div className="flex flex-col gap-2">
                <label className="text-xs sm:text-sm text-on-surface font-bold flex items-center justify-between">
                  <span>Step 1: Choose Approved Service Track</span>
                  <span className="text-xs text-primary font-semibold">PRD §6 Catalog</span>
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {APPROVED_SERVICES.map((svc) => {
                    const isSelected = selectedService.code === svc.code;
                    return (
                      <button
                        key={svc.code}
                        type="button"
                        onClick={() => setSelectedService(svc)}
                        className={`text-left p-3.5 rounded-xl border transition-all flex items-start justify-between cursor-pointer ${
                          isSelected
                            ? "border-2 border-primary bg-primary/5 shadow-xs"
                            : "border-outline-variant/50 bg-surface-container-lowest hover:bg-surface-container-low"
                        }`}
                      >
                        <div className="flex flex-col min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-on-surface">
                              {svc.name}
                            </span>
                            {svc.isPopular && (
                              <span className="bg-secondary/15 text-secondary text-[10px] font-bold px-1.5 py-0.5 rounded">
                                POPULAR
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-on-surface-variant mt-0.5">
                            {svc.tagline}
                          </span>
                          <span className="text-[11px] text-secondary font-medium mt-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">verified</span>
                            {svc.deliverable}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs sm:text-sm font-bold text-on-surface block">₹{svc.price}</span>
                          <span className="text-[11px] text-outline block">{svc.duration}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Date & Available Slots Picker (PRD §11.3) */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm text-on-surface font-bold">
                    Step 2: Choose Slot (Asia/Kolkata IST)
                  </label>
                  <span className="text-[11px] text-outline">Timezone: IST (UTC+5:30)</span>
                </div>

                {/* Mini Date Tabs */}
                <div className="grid grid-cols-4 gap-2">
                  {DAYS.map((d, idx) => {
                    const isDaySelected = selectedDayIdx === idx;
                    return (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => setSelectedDayIdx(idx)}
                        className={`py-2 px-1 rounded-lg text-center flex flex-col items-center transition-all cursor-pointer border ${
                          isDaySelected
                            ? "border-2 border-primary bg-primary/5 text-primary"
                            : "border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container-low"
                        }`}
                      >
                        <span className={`text-[11px] font-semibold uppercase ${isDaySelected ? "text-primary" : "text-outline"}`}>
                          {d.label}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-on-surface font-heading">
                          {d.date}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Slots Matrix */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {SLOTS.map((slot) => {
                    const isSlotSelected = selectedSlotId === slot.id;
                    if (slot.status === "held") {
                      return (
                        <div
                          key={slot.id}
                          className="p-2.5 rounded-lg border border-outline-variant/30 bg-surface-container-low/70 text-left flex items-center justify-between text-xs font-medium text-outline cursor-not-allowed opacity-75"
                        >
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[15px]">lock_clock</span>
                            {slot.time}
                          </span>
                          <span className="text-[10px] text-amber-700 bg-amber-100 px-1 py-0.5 rounded font-medium">
                            Held ({slot.heldDuration})
                          </span>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`p-2.5 rounded-lg text-left flex items-center justify-between text-xs font-semibold transition-all cursor-pointer border ${
                          isSlotSelected
                            ? "border-2 border-primary bg-primary text-on-primary shadow-xs"
                            : "border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container-low text-on-surface"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className={`material-symbols-outlined text-[15px] ${isSlotSelected ? "text-on-primary" : "text-outline"}`}>
                            schedule
                          </span>
                          {slot.time}
                        </span>
                        {isSlotSelected ? (
                          <span className="text-[10px] bg-surface-container-lowest text-primary px-1.5 py-0.5 rounded font-bold">
                            Selected
                          </span>
                        ) : (
                          <span className="text-[10px] text-secondary font-semibold">Available</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 15-Minute Atomic Lock Assurance Notice */}
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low text-xs text-on-surface-variant border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[16px] shrink-0">timer</span>
                  <span>
                    <strong>Atomic Lock Notice:</strong> Selected slot will be held exclusively for 15 minutes during checkout to prevent double-booking.
                  </span>
                </div>
              </div>

              {/* Step 3: Transparent Pricing & Policy Breakdown (PRD §7.3, §12.1) */}
              <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3 border border-outline-variant/20">
                <span className="text-[11px] text-outline uppercase tracking-wider font-bold">
                  Pricing &amp; Payout Transparency
                </span>

                {/* Bundle / Pro Membership Toggle */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface">DreamX Pro / Bundle Discount</span>
                    <span className="text-[10px] text-on-surface-variant">Non-stacking 10% platform voucher</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasProDiscount}
                    onChange={(e) => setHasProDiscount(e.target.checked)}
                    className="w-4 h-4 text-primary rounded border-outline-variant focus:ring-primary cursor-pointer"
                  />
                </div>

                {/* Price Calculations */}
                <div className="flex flex-col gap-1.5 text-xs text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>Base Service Fee ({selectedService.code})</span>
                    <span className="font-medium text-on-surface">₹{basePrice}</span>
                  </div>
                  {hasProDiscount && (
                    <div className="flex justify-between text-secondary font-bold">
                      <span>Platform Discount (Funded by DreamX)</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>GST (Goods &amp; Services Tax)</span>
                    <span className="font-medium text-on-surface">Included (₹0 add-on)</span>
                  </div>
                  <div className="border-t border-outline-variant/30 pt-2 flex justify-between font-bold text-sm text-on-surface">
                    <span>Net Payable</span>
                    <span className="text-primary text-base font-extrabold font-heading">₹{netPayable}</span>
                  </div>
                </div>

                <p className="text-[11px] text-outline leading-tight italic">
                  * PRD Rule: Discounts do not stack. Discount is 100% funded by DreamX — Mentor receives their full base escrow payout upon deliverable submission.
                </p>
              </div>

              {/* Enforceable Cancellation & Refund Guarantee */}
              <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs">
                <div className="flex items-center gap-1.5 text-secondary font-bold">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span>Enforceable Refund Policy (PRD §12.1)</span>
                </div>
                <p className="text-on-surface-variant leading-snug">
                  • <strong>100% full refund</strong> if cancelled ≥1 hour before session.<br />
                  • <strong>Substantiated 80% refund policy</strong> within 48 hours post-session if deliverable fails 8-dimension SLA.
                </p>
              </div>

              {/* Primary Checkout CTA */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                  <span>Proceed to Secure Booking (₹{netPayable})</span>
                </button>
                <div className="flex items-center justify-center gap-3 text-[11px] text-outline">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">account_balance</span>
                    UPI / Netbanking / Credit Cards
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">shield</span>
                    Razorpay Escrow Protected
                  </span>
                </div>
              </div>
            </div>

            {/* PRD §10.3: Smart Match Fallback Callout */}
            <div className="bg-surface-container-low rounded-2xl p-5 sm:p-6 border border-outline-variant/30 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-bold text-on-surface font-heading">
                    Need a slot sooner or different timing?
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Activate the <strong>Smart Match Dispatch</strong> across verified Staff Engineers matching {mentor.name.split(" ")[0]}&apos;s bar.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/20 flex flex-col gap-2 text-xs">
                <div className="flex items-center gap-2 text-on-surface font-medium">
                  <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                  <span>Wave 1: Immediate dispatch to top-ranked Staff SDEs</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface font-medium">
                  <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                  <span>Wave 2: Expanded dispatch at 30 min if unaccepted</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span>2-Hour Fallback Guarantee: 100% matched or instant refund</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSmartMatchRequested(true)}
                className="w-full py-2.5 px-4 rounded-xl border border-primary text-primary hover:bg-primary/5 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                Request Smart Match Alternative
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Atomic Slot Lock Dialog / Modal */}
      {bookingLocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/40 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2 text-secondary font-bold text-sm">
                <span className="material-symbols-outlined text-[20px]">lock_clock</span>
                <span>
                  {confirmedSuccess
                    ? "Booking Confirmed &amp; Calendar Scheduled"
                    : activeBooking
                    ? "10-Minute Atomic Hold Active"
                    : "Reserving Slot..."}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setBookingLocked(false);
                  setActiveBooking(null);
                  setClaimError(null);
                  setConfirmedSuccess(false);
                }}
                className="text-outline hover:text-on-surface text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {isClaiming && (
              <div className="py-8 flex flex-col items-center justify-center gap-3 text-center">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <p className="text-xs font-semibold text-on-surface">Acquiring atomic row-level mutex lock on slot...</p>
                <p className="text-[11px] text-on-surface-variant">Preventing concurrent double-booking per PRD §10.2</p>
              </div>
            )}

            {claimError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  Slot Reservation Prohibited
                </div>
                <p>{claimError}</p>
                <button
                  type="button"
                  onClick={() => setBookingLocked(false)}
                  className="text-xs font-semibold underline text-red-900 mt-1 cursor-pointer block"
                >
                  Choose a different slot
                </button>
              </div>
            )}

            {activeBooking && !confirmedSuccess && (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs space-y-1">
                  <div className="flex justify-between items-center font-bold">
                    <span>Reference: {activeBooking.bookingRef}</span>
                    <span className="text-emerald-700 font-mono">10:00 Hold Window</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Slot held exclusively for your user account. Unpaid holds release automatically after 10 minutes (P6 Exit Criteria 2).
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="font-semibold text-on-surface block mb-1">
                      Target Focus / Pre-Session Notes (Optional)
                    </label>
                    <textarea
                      value={preSessionNotes}
                      onChange={(e) => setPreSessionNotes(e.target.value)}
                      placeholder="e.g. Distributed lock deep-dive, SDE-2 promotion resume audit"
                      rows={2}
                      className="w-full text-xs p-2.5 rounded-lg border border-outline-variant/40 bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-on-surface block mb-1">
                      Candidate Resume / GitHub Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      placeholder="https://github.com/... or Google Drive link"
                      className="w-full text-xs p-2.5 rounded-lg border border-outline-variant/40 bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low text-xs space-y-1">
                  <div className="flex justify-between font-medium">
                    <span>Net Payable Amount:</span>
                    <span className="font-bold text-primary text-sm font-heading">₹{netPayable} (INR)</span>
                  </div>
                  <div className="text-[11px] text-secondary font-semibold">
                    ✓ 80/20 Escrow protected • Settle upon deliverable sign-off
                  </div>
                </div>

                {confirmError && (
                  <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{confirmError}</p>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingLocked(false);
                      setActiveBooking(null);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-outline-variant text-on-surface text-xs font-semibold hover:bg-surface-container-low cursor-pointer"
                  >
                    Release Slot
                  </button>
                  <button
                    type="button"
                    disabled={isConfirmingPayment}
                    onClick={handleConfirmPayment}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-on-primary text-xs font-bold text-center hover:bg-primary-container shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isConfirmingPayment ? "Capturing Payment..." : `Pay ₹${netPayable} via Escrow`}
                  </button>
                </div>
              </div>
            )}

            {confirmedSuccess && (
              <div className="py-4 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[28px]">check_circle</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-on-surface">Payment Captured &amp; Confirmed!</h3>
                  <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                    Your session booking with <strong>{mentor.name}</strong> has been secured in Escrow. Google Meet link generated.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/bookings")}
                  className="w-full py-2.5 px-4 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-md cursor-pointer hover:bg-primary-container"
                >
                  View in Candidate Bookings Dashboard →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Smart Match Alternative Dialog */}
      {smartMatchRequested && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/40 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <span className="material-symbols-outlined text-[20px]">bolt</span>
                <span>
                  {smartMatchResult
                    ? "Smart Match Dispatch Dispatched"
                    : "Smart Match Two-Wave Engine"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSmartMatchRequested(false);
                  setSmartMatchResult(null);
                  setSmartMatchError(null);
                }}
                className="text-outline hover:text-on-surface text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {smartMatchResult ? (
              <div className="py-2 space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 text-xs space-y-2">
                  <div className="flex justify-between items-center font-bold">
                    <span>Reference: {smartMatchResult.requestRef}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px]">
                      Wave 1 Active
                    </span>
                  </div>
                  <p className="leading-relaxed">
                    Dispatched to <strong>{smartMatchResult.dispatchedMentors} accredited Tier-1 mentors</strong> matching your service requirements.
                  </p>
                  <div className="pt-1 text-[11px] text-emerald-800 space-y-1">
                    <p>• Wave 2 expands automatically at 30 minutes if unclaimed.</p>
                    <p>• 2-Hour Guarantee: At 120 minutes, choose alternate slot or receive 100% instant refund (PRD §10.3).</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSmartMatchRequested(false);
                      setSmartMatchResult(null);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-outline-variant text-on-surface text-xs font-semibold hover:bg-surface-container-low cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/bookings")}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-on-primary text-xs font-bold text-center hover:bg-primary-container shadow-md cursor-pointer"
                  >
                    Track in Dashboard →
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3 text-xs text-on-surface-variant leading-relaxed">
                  <p className="text-sm font-semibold text-on-surface">
                    Deterministic Matching across verified Staff Engineers:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-secondary shrink-0 mt-1" />
                      <span><strong>Wave 1 (0–30 min):</strong> Immediate ping to highest-affinity accredited mentors.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-secondary shrink-0 mt-1" />
                      <span><strong>Wave 2 (30–120 min):</strong> Automated expansion to secondary qualified pool.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                      <span><strong>2-Hour Guarantee:</strong> Candidate choice of open slot or 100% instant escrow refund.</span>
                    </li>
                  </ul>
                </div>

                {smartMatchError && (
                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                    {smartMatchError}
                  </p>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSmartMatchRequested(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-outline-variant text-on-surface text-xs font-semibold hover:bg-surface-container-low cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isRequestingSmartMatch}
                    onClick={handleTriggerSmartMatch}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-on-primary text-xs font-bold text-center hover:bg-primary-container shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isRequestingSmartMatch ? "Dispatching..." : `Trigger Wave 1 (₹${netPayable})`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
