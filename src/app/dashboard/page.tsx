"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";

interface ActiveBooking {
  id: string;
  service_code: string;
  status: string;
  session_start: string;
  session_end: string;
  meeting_url?: string | null;
  amount: number;
  mentor_name?: string;
  mentor_headline?: string;
  mentor_avatar?: string;
}

const SERVICE_NAMES: Record<string, string> = {
  S01: "S01 Resume Review & ATS Audit",
  S02: "S02 LinkedIn Optimization Drill",
  S03: "S03 Portfolio & Code Review",
  S04: "S04 Technical Mock Interview",
  S05: "S05 Behavioral STAR Drill",
  S06: "S06 Distributed Systems & Concurrency",
  S07: "S07 System Design Architecture Drill",
  S08: "S08 Offer & Salary Negotiation",
  S09: "S09 Career Transition Strategy",
  S10: "S10 Algorithmic Coding Sprint",
};

function formatSessionDate(dateStr?: string | null) {
  if (!dateStr) return "Scheduled (Time TBD)";
  try {
    const d = new Date(dateStr);
    return (
      d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      }) + " IST"
    );
  } catch {
    return dateStr;
  }
}

export default function StudentDashboardPage() {
  const { user, membership } = useAuth();
  const supabase = React.useMemo(() => createClient(), []);

  const [upcomingBooking, setUpcomingBooking] = React.useState<ActiveBooking | null>(null);
  const [completedDeliverables, setCompletedDeliverables] = React.useState<any[]>([]);
  const [baselineScore, setBaselineScore] = React.useState<number>(68);
  const [isCalibrated, setIsCalibrated] = React.useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (!user?.id) return;

    // Load calibrated baseline score from local storage or profile
    const storedScore = localStorage.getItem(`dreamx_baseline_score_${user.id}`);
    if (storedScore) {
      setBaselineScore(Number(storedScore));
      setIsCalibrated(true);
    } else if (user.onboarding_completed) {
      setIsCalibrated(true);
      setBaselineScore(user.segment === "early_career" ? 68 : user.segment === "fresh_graduate" ? 54 : 48);
    }

    async function loadDashboardData() {
      try {
        setIsLoadingData(true);
        // Fetch next confirmed/held booking for this candidate
        const { data: bData } = await supabase
          .from("bookings")
          .select(`
            id,
            service_code,
            status,
            session_start,
            session_end,
            meeting_url,
            amount_paise,
            mentor_id,
            mentor:profiles!mentor_id(full_name, avatar_url)
          `)
          .eq("student_id", user?.id || "")
          .in("status", ["confirmed", "held", "in_progress"])
          .order("session_start", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (bData) {
          const mentorProfile = bData.mentor as { full_name?: string; avatar_url?: string } | null;
          setUpcomingBooking({
            id: bData.id,
            service_code: bData.service_code,
            status: bData.status,
            session_start: bData.session_start,
            session_end: bData.session_end,
            meeting_url: bData.meeting_url,
            amount: bData.amount_paise ? Math.round(bData.amount_paise / 100) : 999,
            mentor_name: mentorProfile?.full_name || "Verified Mentor",
            mentor_headline: "Staff Software Engineer • Tier-1 Tech",
          });
        } else {
          setUpcomingBooking(null);
        }

        // Fetch completed bookings for deliverables
        const { data: compData } = await supabase
          .from("bookings")
          .select(`
            id,
            service_code,
            status,
            session_start,
            mentor_id,
            mentor:profiles!mentor_id(full_name)
          `)
          .eq("student_id", user?.id || "")
          .eq("status", "completed")
          .order("session_start", { ascending: false })
          .limit(5);

        if (compData && compData.length > 0) {
          setCompletedDeliverables(compData);
        } else {
          setCompletedDeliverables([]);
        }
      } catch (err) {
        console.warn("Could not load candidate dashboard data:", err);
      } finally {
        setIsLoadingData(false);
      }
    }

    loadDashboardData();
  }, [user, supabase]);

  const candidateName = user?.name ? user.name.split(" ")[0] : "Candidate";
  const candidateId = user?.id ? user.id.slice(0, 8).toUpperCase() : "DX-NEW";
  const isPro = membership?.tier === "pro" || membership?.tier === "elite";

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 lg:p-8 gap-6 bg-background min-h-screen">
      {/* Pending Baseline Assessment Notice */}
      {user && user.onboarding_completed === false && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-xs animate-in fade-in">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">assignment_late</span>
            </div>
            <div>
              <h3 className="font-bold text-amber-900 text-sm">Baseline Career Calibration Pending</h3>
              <p className="text-amber-800 text-xs mt-0.5">
                You haven&apos;t calibrated your 8-dimension readiness starting point yet. Completing the 2-minute diagnostic unlocks personalized rubrics and tailored mentor match recommendations.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/onboarding"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 text-center transition-colors shadow-xs"
          >
            Complete Onboarding Wizard →
          </Link>
        </div>
      )}

      {/* 1. Student Dashboard Header & Contextual Greeting */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/30">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight font-heading">
              Good morning, {candidateName}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span>Asia/Kolkata (IST) • 10:42 AM</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-0.5 text-on-surface-variant text-xs">
            <span className="flex items-center gap-1 text-on-surface font-semibold">
              <span className="material-symbols-outlined text-[16px] text-primary">target</span>
              <span>Target: SDE-2 Backend (GCC &amp; Indian Unicorns)</span>
            </span>
            <span className="text-outline-variant hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">timeline</span>
              <span>Cohort: Active Job Search (0-2 YoE Track)</span>
            </span>
            <span className="text-outline-variant hidden sm:inline">•</span>
            <span>
              Candidate ID: <code className="bg-surface-container-low px-1.5 py-0.5 rounded font-mono text-[11px] font-bold">#{candidateId}</code>
            </span>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 pt-2 lg:pt-0 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-secondary-container/30 border border-secondary/20 px-3 py-1.5 rounded-xl text-on-secondary-container w-full sm:w-auto">
            <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              workspace_premium
            </span>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold leading-tight">
                {isPro ? `${membership.tier.toUpperCase()} Member (5% Off)` : "Free Tier Candidate"}
              </span>
              <Link href="/membership" className="text-[11px] text-primary font-bold hover:underline leading-tight">
                {membership.tier === "elite" ? "Elite Benefits Active" : "Upgrade to Elite"}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href="/dashboard/readiness"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-surface-container text-on-surface hover:bg-surface-container-high rounded-xl text-xs font-bold transition-colors border border-outline-variant/30 text-center"
            >
              <span className="material-symbols-outlined text-[18px]">assignment</span>
              <span>Baseline Test</span>
            </Link>

            <Link
              href="/services"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container rounded-xl text-xs font-bold transition-all shadow-sm text-center"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
              <span>Book 1:1 Service</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Top Critical Overview Grid (3 High-Impact Cards) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 1: 8-Dimension Career Readiness Score */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/30 relative overflow-hidden">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold font-mono">
                Career Readiness Score
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container text-xs font-bold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                <span>+{Math.max(0, baselineScore - 50)} pts vs baseline</span>
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold text-on-surface font-heading">{baselineScore}</span>
              <span className="text-lg text-on-surface-variant font-semibold">/ 100</span>
              <span className="ml-auto px-2.5 py-1 rounded-lg bg-surface-container text-on-surface text-xs font-bold">
                {baselineScore >= 75 ? "Target Ready" : baselineScore >= 50 ? "Developing Foundation" : "Calibration Phase"}
              </span>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-full bg-surface-container rounded-full h-2 mt-1 overflow-hidden flex">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(baselineScore, 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 p-3 bg-surface-container-low rounded-xl text-on-surface-variant text-xs border border-outline-variant/20">
              <div>
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Active Vectors</span>
                <span className="text-xs font-bold text-on-surface mt-0.5 block">
                  {isCalibrated ? "8 of 8 Calibrated" : "Calibration Needed"}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Audit Quality</span>
                <span className="text-xs font-bold text-secondary mt-0.5 block">
                  {isCalibrated ? "100% Verified" : "Pending Diagnostic"}
                </span>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              {isCalibrated
                ? "Your 8-dimension readiness matrix is locked and active. All mock drills and written deliverables dynamically update your vector baseline."
                : "Calibrate your baseline diagnostic to unlock tailored mentor recommendations and vector deltas."}
            </p>
          </div>

          <div className="pt-4 mt-2 border-t border-surface-container">
            <Link
              href="/dashboard/readiness"
              className="inline-flex items-center gap-1.5 text-primary hover:text-primary-container text-xs font-bold cursor-pointer"
            >
              <span>View 8-Dimension Rubric Breakdown</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Card 2: Deterministic Next Step (PRD §8.5 Engine) */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/30 relative">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold font-mono">
                Deterministic Next Step
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-bold">
                <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                <span>PRD §8.5 Engine</span>
              </span>
            </div>

            <div className="mt-1">
              <span className="text-[11px] font-bold text-primary uppercase font-mono tracking-wider">
                Code S08 • 30 Min Drill
              </span>
              <h3 className="text-base sm:text-lg font-bold text-on-surface font-heading mt-0.5 leading-snug">
                Salary Negotiation &amp; ESOP Valuation
              </h3>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl text-xs text-on-surface-variant leading-relaxed border border-outline-variant/20">
              <p>
                <strong className="text-on-surface">Trigger Rule:</strong> Selected because{" "}
                <span className="text-error font-bold">Career Planning &amp; Negotiation</span> is your lowest rated vector (2.0/5.0) with imminent offer stages approaching.
              </p>
            </div>

            <div className="flex items-center justify-between mt-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-on-surface font-mono">₹664</span>
                <span className="text-xs text-outline line-through font-mono">₹699</span>
                <span className="text-[11px] text-on-secondary-container bg-secondary-container/50 px-1.5 py-0.5 rounded font-bold">
                  Pro: 5% off
                </span>
              </div>
              <span className="text-[11px] text-outline font-semibold">100% DreamX funded</span>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-surface-container">
            <Link
              href="/services/s08-salary-negotiation"
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <span>Book Recommended Slot</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Card 3: Next Confirmed Session & Escrow Protection */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/30">
          {isLoadingData ? (
            <div className="flex flex-col justify-between h-48 animate-pulse p-2 space-y-3">
              <div className="h-4 bg-surface-container rounded w-1/3" />
              <div className="h-6 bg-surface-container rounded w-3/4" />
              <div className="h-16 bg-surface-container-low rounded-xl w-full" />
              <div className="h-9 bg-surface-container rounded-xl w-full" />
            </div>
          ) : upcomingBooking ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold font-mono">
                  Next Confirmed Session
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  <span>{upcomingBooking.status.toUpperCase()}</span>
                </span>
              </div>

              <div className="mt-1">
                <span className="text-[11px] font-bold text-primary font-mono uppercase tracking-wider">
                  Code {upcomingBooking.service_code} • Live Drill
                </span>
                <h3 className="text-base sm:text-lg font-bold text-on-surface font-heading mt-0.5 leading-snug">
                  {SERVICE_NAMES[upcomingBooking.service_code] || `Service ${upcomingBooking.service_code}`}
                </h3>
              </div>

              {/* Mentor Metadata */}
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant/20">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  {upcomingBooking.mentor_name ? upcomingBooking.mentor_name.slice(0, 2).toUpperCase() : "M"}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-on-surface truncate">
                      {upcomingBooking.mentor_name}
                    </span>
                    <span
                      className="material-symbols-outlined text-primary text-[14px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                      title="Tier-1 Verified Mentor"
                    >
                      verified
                    </span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant truncate">
                    {upcomingBooking.mentor_headline}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-xs">
                <div className="flex items-center gap-2 text-on-surface font-medium">
                  <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                  <span>{formatSessionDate(upcomingBooking.session_start)}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-outline">
                  <span className="material-symbols-outlined text-[16px] text-secondary">shield</span>
                  <span>₹{upcomingBooking.amount} held in Escrow Guarantee</span>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-surface-container space-y-2">
                <a
                  href={upcomingBooking.meeting_url || "/dashboard/bookings"}
                  target={upcomingBooking.meeting_url ? "_blank" : "_self"}
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">video_call</span>
                  <span>Join Google Meet</span>
                </a>
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant px-1">
                  <Link href="/dashboard/bookings" className="text-primary hover:underline font-semibold">
                    Manage / Reschedule
                  </Link>
                  <span>100% refund eligible ≥1h before slot</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-between h-full gap-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold font-mono">
                    Next Confirmed Session
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-bold">
                    Ready to Book
                  </span>
                </div>

                <div className="mt-1">
                  <span className="text-[11px] font-bold text-secondary font-mono uppercase tracking-wider">
                    Tier-1 Mentorship Drill
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-on-surface font-heading mt-0.5 leading-snug">
                    Schedule Your First Session
                  </h3>
                </div>

                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 text-xs text-on-surface-variant leading-relaxed">
                  Book a targeted 1:1 session or build a 3-service bundle to accelerate your placement with verified tech mentors.
                </div>

                <div className="flex items-center gap-2 text-[11px] text-outline">
                  <span className="material-symbols-outlined text-[16px] text-secondary">shield</span>
                  <span>100% Refund Escrow Protection if SLA is not met</span>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-container">
                <Link
                  href="/services"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <span>Browse Services &amp; Mentors</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Guided Career Journey Progression Timeline (PRD §8.5) */}
      <section className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/30 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-on-surface font-heading">
              Career Acceleration Roadmap
            </h2>
            <p className="text-xs text-on-surface-variant">
              Deterministic progression based on continuous 8-dimension rubric feedback
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs bg-surface-container px-3 py-1 rounded-full text-on-surface-variant font-bold">
            Stage 3 of 5 In Progress
          </span>
        </div>

        {/* Progression Track */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {/* Stage 1 */}
          <div className="flex flex-col p-4 bg-surface-container-low rounded-xl gap-2 relative border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-secondary font-mono">Stage 01</span>
              <span className="material-symbols-outlined text-secondary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-on-surface font-heading">Diagnostic Baseline</h4>
              <span className="text-[11px] text-on-surface-variant block mt-0.5">Completed • 12 Oct</span>
            </div>
            <span className="text-[11px] text-outline mt-auto font-mono">Initial Score: 54/100</span>
          </div>

          {/* Stage 2 */}
          <div className="flex flex-col p-4 bg-surface-container-low rounded-xl gap-2 relative border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-secondary font-mono">Stage 02</span>
              <span className="material-symbols-outlined text-secondary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-on-surface font-heading">Resume &amp; ATS Optimization</h4>
              <span className="text-[11px] text-on-surface-variant block mt-0.5">Completed • 18 Oct</span>
            </div>
            <span className="text-[11px] text-secondary font-bold mt-auto">Score: 85% Verified</span>
          </div>

          {/* Stage 3 (Active) */}
          <div className="flex flex-col p-4 bg-primary-fixed/20 rounded-xl gap-2 relative ring-2 ring-primary border border-primary/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary font-mono">Stage 03 (Current)</span>
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-on-surface font-heading">Technical Simulation</h4>
              <span className="text-[11px] text-primary font-bold block mt-0.5">Session Scheduled Tomorrow</span>
            </div>
            <span className="text-[11px] text-on-surface-variant mt-auto">Concurrency &amp; Design Drill</span>
          </div>

          {/* Stage 4 */}
          <div className="flex flex-col p-4 bg-surface-container-low/60 rounded-xl gap-2 relative opacity-75 border border-outline-variant/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant font-mono">Stage 04</span>
              <span className="material-symbols-outlined text-outline text-[18px]">radio_button_unchecked</span>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-on-surface font-heading">Negotiation &amp; Offer</h4>
              <span className="text-[11px] text-on-surface-variant block mt-0.5">Next Target • S08</span>
            </div>
            <span className="text-[11px] text-outline mt-auto">Unlocks post S06 Audit</span>
          </div>

          {/* Stage 5 */}
          <div className="flex flex-col p-4 bg-surface-container-low/40 rounded-xl gap-2 relative opacity-60 border border-outline-variant/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-outline font-mono">Stage 05</span>
              <span className="material-symbols-outlined text-outline text-[18px]">lock</span>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-on-surface-variant font-heading">Placement Escrow Release</h4>
              <span className="text-[11px] text-outline block mt-0.5">Final Milestone</span>
            </div>
            <span className="text-[11px] text-outline mt-auto">Offer Letter Validation</span>
          </div>
        </div>
      </section>

      {/* 4. 8-Dimension Career Readiness Vector Matrix (PRD §8.1 & §8.2) */}
      <section className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/30 flex flex-col gap-4" id="vector-matrix">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-on-surface font-heading">
                8-Dimension Career Readiness Vector Matrix
              </h2>
              <span className="material-symbols-outlined text-on-surface-variant text-[16px] cursor-help" title="Evaluated on 0.0 - 5.0 scale strictly based on accredited mentor audits.">
                info
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Readiness scores are 100% private by default and strictly derived from accredited mentor scorecards (PRD §8.1).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-lg font-mono font-bold">
              Scale: 0.0 – 5.0
            </span>
            <Link
              href="/dashboard/reports"
              className="inline-flex items-center gap-1 text-primary hover:text-primary-container text-xs font-bold p-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">history</span>
              <span>Rubric Log</span>
            </Link>
          </div>
        </div>

        {/* Vector Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* 1. Resume */}
          <div className="p-4 bg-surface-container-low rounded-xl flex flex-col justify-between gap-3 border border-outline-variant/20">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface font-heading">1. Resume / CV</span>
                <span className="px-1.5 py-0.5 rounded bg-secondary-container/50 text-on-secondary-container text-[11px] font-bold">
                  Strong
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-extrabold text-on-surface font-mono">4.0</span>
                <span className="text-xs text-on-surface-variant font-mono">/ 5.0</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 mt-2">
                <div className="bg-secondary h-1.5 rounded-full" style={{ width: "80%" }} />
              </div>
            </div>
            <div className="text-[11px] text-secondary font-medium pt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>Verified in S01 Audit</span>
            </div>
          </div>

          {/* 2. LinkedIn Presence */}
          <div className="p-4 bg-surface-container-low rounded-xl flex flex-col justify-between gap-3 border border-outline-variant/20">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface font-heading">2. LinkedIn Profile</span>
                <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface text-[11px] font-bold">
                  Acceptable
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-extrabold text-on-surface font-mono">3.5</span>
                <span className="text-xs text-on-surface-variant font-mono">/ 5.0</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 mt-2">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: "70%" }} />
              </div>
            </div>
            <div className="text-[11px] text-secondary font-medium pt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>Verified in S03 Audit</span>
            </div>
          </div>

          {/* 3. Portfolio & Code */}
          <div className="p-4 bg-surface-container-low/60 rounded-xl flex flex-col justify-between gap-3 border border-dashed border-outline-variant/40">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface-variant font-heading">3. Portfolio Artifacts</span>
                <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px]">
                  N/A (Exempt)
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-extrabold text-outline font-mono">—</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 mt-2">
                <div className="bg-outline-variant h-1.5 rounded-full" style={{ width: "0%" }} />
              </div>
            </div>
            <div className="text-[11px] text-outline pt-1">
              <span>Weight redistributed (PRD §8.3)</span>
            </div>
          </div>

          {/* 4. Communication & Soft Skills */}
          <div className="p-4 bg-surface-container-low rounded-xl flex flex-col justify-between gap-3 border border-outline-variant/20">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface font-heading">4. Communication</span>
                <span className="px-1.5 py-0.5 rounded bg-secondary-container/50 text-on-secondary-container text-[11px] font-bold">
                  Strong
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-extrabold text-on-surface font-mono">4.0</span>
                <span className="text-xs text-on-surface-variant font-mono">/ 5.0</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 mt-2">
                <div className="bg-secondary h-1.5 rounded-full" style={{ width: "80%" }} />
              </div>
            </div>
            <div className="text-[11px] text-secondary font-medium pt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>STAR Method Logged (S05)</span>
            </div>
          </div>

          {/* 5. Technical Competence */}
          <div className="p-4 bg-surface-container-low rounded-xl flex flex-col justify-between gap-3 border border-outline-variant/20">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface font-heading">5. Technical Competence</span>
                <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface text-[11px] font-bold">
                  Developing
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-extrabold text-on-surface font-mono">3.8</span>
                <span className="text-xs text-on-surface-variant font-mono">/ 5.0</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 mt-2">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: "76%" }} />
              </div>
            </div>
            <div className="text-[11px] text-on-surface font-medium pt-1">
              <span>Testing in S06 session tomorrow</span>
            </div>
          </div>

          {/* 6. Interview Mechanics */}
          <div className="p-4 bg-surface-container-low rounded-xl flex flex-col justify-between gap-3 border border-outline-variant/20">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface font-heading">6. Interview Acumen</span>
                <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface text-[11px] font-bold">
                  Acceptable
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-extrabold text-on-surface font-mono">3.5</span>
                <span className="text-xs text-on-surface-variant font-mono">/ 5.0</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 mt-2">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: "70%" }} />
              </div>
            </div>
            <div className="text-[11px] text-secondary font-medium pt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>S05 Mock Debrief Logged</span>
            </div>
          </div>

          {/* 7. Career Planning & Negotiation (Lowest) */}
          <div className="p-4 bg-error-container/20 rounded-xl flex flex-col justify-between gap-3 border border-error/30">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface font-heading">7. Career &amp; Negotiation</span>
                <span className="px-1.5 py-0.5 rounded bg-error text-on-error text-[11px] font-bold">
                  Attention Needed
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-extrabold text-error font-mono">2.0</span>
                <span className="text-xs text-on-surface-variant font-mono">/ 5.0</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 mt-2">
                <div className="bg-error h-1.5 rounded-full" style={{ width: "40%" }} />
              </div>
            </div>
            <div className="text-[11px] text-error font-bold pt-1">
              <span>Action Required: Book S08/S09</span>
            </div>
          </div>

          {/* 8. Confidence & Executive Presence */}
          <div className="p-4 bg-surface-container-low rounded-xl flex flex-col justify-between gap-3 border border-outline-variant/20">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface font-heading">8. Professional Confidence</span>
                <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface text-[11px] font-bold">
                  Developing
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-extrabold text-on-surface font-mono">3.5</span>
                <span className="text-xs text-on-surface-variant font-mono">/ 5.0</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 mt-2">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: "70%" }} />
              </div>
            </div>
            <div className="text-[11px] text-on-surface-variant pt-1">
              <span>Audited across all sessions</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Pending & Delivered Post-Session Reports (PRD §11.2, 48h SLA Guarantee) */}
      <section className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-outline-variant/30 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-on-surface font-heading">
              Post-Session Written Rubrics &amp; Deliverables
            </h2>
            <p className="text-xs text-on-surface-variant">
              Mentors are bound to a strict 48-hour delivery SLA backed by DreamX Razorpay Escrow
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low text-on-surface text-xs font-bold border border-outline-variant/20">
            <span className="material-symbols-outlined text-secondary text-[16px]">verified_user</span>
            <span>Escrow SLA Active: 80% Auto-Refund Protection</span>
          </div>
        </div>

        {/* Deliverables Table / Cards */}
        {completedDeliverables.length > 0 ? (
          <div className="flex flex-col gap-3">
            {completedDeliverables.map((del) => {
              const mentorProfile = del.mentor as { full_name?: string } | null;
              return (
                <div
                  key={del.id}
                  className="py-3 px-4 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-surface-container-low/40 rounded-xl transition-colors border border-outline-variant/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary-container/40 text-secondary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">description</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-on-surface truncate">
                        {SERVICE_NAMES[del.service_code] || `Service ${del.service_code}`}
                      </span>
                      <span className="text-[11px] text-on-surface-variant truncate">
                        Mentor: {mentorProfile?.full_name || "Verified Mentor"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container text-xs font-bold">
                      <span className="material-symbols-outlined text-[13px]">check</span>
                      <span>Delivered • SLA Met</span>
                    </span>

                    <Link
                      href="/dashboard/reports"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container rounded-lg text-xs font-bold transition-all shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[15px]">visibility</span>
                      <span>View Rubric Report</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-surface-container-low/40 border border-outline-variant/30 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary-container/40 text-secondary flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-on-surface">No Audited Deliverables Yet</h3>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                Once you complete your first 1:1 mentorship drill, your mentor&apos;s cryptographically signed rubric scorecard, action plan PDF, and SHA-256 tamper-proof ledger record will be published here within 48 hours.
              </p>
            </div>
            <div className="pt-1">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container hover:text-on-primary-container transition-all shadow-xs"
              >
                <span>Browse Eligible Services</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 6. Custom 3-Service Bundle Savings Banner (PRD §7.3 & §7.4) */}
      <section className="bg-gradient-to-r from-primary-container to-primary text-on-primary p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="flex flex-col gap-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-on-primary/10 text-on-primary text-xs font-bold">
              <span className="material-symbols-outlined text-[14px]">loyalty</span>
              <span>PRD §7.3 Transparent Model</span>
            </span>
            <span className="text-xs text-primary-fixed-dim font-medium">Mentors Get 100% Compensation</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-on-primary font-heading mt-1">
            Curate a Custom 3-Service Sprint &amp; Save 5%
          </h3>
          <p className="text-xs sm:text-sm text-primary-fixed-dim/90 leading-relaxed">
            Bundle any 3 individual diagnostic drills (e.g., S06 Architecture + S08 Negotiation + S09 Career Plan) into a structured package. Discount is 100% funded by DreamX. Non-stacking with seasonal codes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <Link
            href="/membership"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-surface-container-lowest text-primary hover:bg-surface-bright rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <span>Build Custom Bundle</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
