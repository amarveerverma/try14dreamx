"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  experience: string;
  rating: number;
  reviewsCount: number;
  initials: string;
  avatarBg: string;
  badges: string[];
  approvedServices: string;
  bio: string;
  nextSlot: string;
  startingPrice: number;
  domain: "engineering" | "product" | "data";
}

const MENTORS_LIST: Mentor[] = [
  {
    id: "mentor-rahul",
    name: "Rahul Verma",
    role: "Staff Engineer",
    company: "Swiggy",
    experience: "7 Years Exp • Ex-Flipkart",
    rating: 4.95,
    reviewsCount: 42,
    initials: "RV",
    avatarBg: "bg-primary-fixed text-primary",
    badges: ["Verified Identity", "Tech Lead Verified"],
    approvedServices: "Approved for: S01, S06, S10",
    bio: "Specializes in high-throughput distributed systems, algorithmic concurrency, and backend architecture round calibration.",
    nextSlot: "Tomorrow, 4:00 PM IST",
    startingPrice: 599,
    domain: "engineering",
  },
  {
    id: "mentor-sneha",
    name: "Sneha Rao",
    role: "Principal PM",
    company: "Razorpay",
    experience: "9 Years Exp • Ex-Paytm, IIT-B",
    rating: 4.98,
    reviewsCount: 68,
    initials: "SR",
    avatarBg: "bg-secondary-fixed text-secondary",
    badges: ["Verified Identity", "Executive Verified"],
    approvedServices: "Approved for: S07, S08, S09",
    bio: "APM/PM hiring panelist with focus on product sense, estimation metrics, go-to-market strategies, and STAR narrative construction.",
    nextSlot: "Friday, 6:30 PM IST",
    startingPrice: 499,
    domain: "product",
  },
  {
    id: "mentor-tanmay",
    name: "Tanmay Bhattacharya",
    role: "Senior Software Engineer",
    company: "Google",
    experience: "5 Years Exp • Core Infrastructure",
    rating: 4.92,
    reviewsCount: 35,
    initials: "TB",
    avatarBg: "bg-tertiary-fixed text-tertiary",
    badges: ["Verified Identity", "Algorithms Specialist"],
    approvedServices: "Approved for: S06, S10",
    bio: "Rigorous DSA and System Design mock rounds. Specializes in graph algorithms, dynamic programming edge-cases, and Google rubric standards.",
    nextSlot: "Saturday, 11:00 AM IST",
    startingPrice: 999,
    domain: "engineering",
  },
  {
    id: "mentor-pooja",
    name: "Pooja Sundaram",
    role: "Engineering Manager",
    company: "Intuit",
    experience: "11 Years Exp • Hiring Committee Lead",
    rating: 5.0,
    reviewsCount: 54,
    initials: "PS",
    avatarBg: "bg-primary-container text-on-primary-container",
    badges: ["Verified Identity", "Hiring Committee Veteran"],
    approvedServices: "Approved for: S04, S05, S06",
    bio: "Chaired 150+ software engineering debriefs. Guides early talent on cross-functional alignment, code cleanliness, and behavioral mastery.",
    nextSlot: "Sunday, 2:00 PM IST",
    startingPrice: 799,
    domain: "engineering",
  },
];

export default function ServicesDiscoverPage() {
  const { membership } = useAuth();
  const isPro = membership?.tier === "pro" || membership?.tier === "elite";

  const [activeGoal, setActiveGoal] = React.useState<string>("all");
  const [activeDomain, setActiveDomain] = React.useState<"engineering" | "product" | "data">("engineering");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [experienceFilter, setExperienceFilter] = React.useState<string>("");

  const filteredMentors = React.useMemo(() => {
    return MENTORS_LIST.filter((mentor) => {
      const matchDomain = mentor.domain === activeDomain;
      const matchSearch =
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.bio.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDomain && matchSearch;
    });
  }, [activeDomain, searchQuery]);

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12 bg-background min-h-screen">
      {/* Discovery Sub-header with Readiness Pill */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary text-xs font-bold">
                Diagnostic-Driven
              </span>
              <span className="text-on-surface-variant text-xs">Updated 14h ago</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight font-heading mt-1">
              Discover &amp; Goal-First Recommendations
            </h1>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Pinpoint your current readiness gaps or explore verified services and mentors tailored to your target role.
            </p>
          </div>

          {/* Target Role Context Badge Card */}
          <div className="bg-surface-container-low rounded-2xl p-5 shadow-xs max-w-md w-full border border-surface-container">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                  Current Career Target
                </span>
                <span className="text-base font-bold text-on-surface mt-0.5">
                  Associate Product Manager / SDE-1
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-extrabold text-primary font-heading">
                  68<span className="text-xs font-normal text-on-surface-variant">/100</span>
                </span>
                <span className="text-[11px] text-error font-bold">Needs Improvement</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-surface-container flex items-center gap-2 text-on-surface-variant text-xs">
              <span className="material-symbols-outlined text-sm text-error">priority_high</span>
              <span>Critical deficits in Technical Coding &amp; Interview Execution</span>
            </div>
          </div>
        </div>

        {/* Interactive Goal Selector Chips */}
        <div className="flex flex-col gap-2 pt-2">
          <span className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">
            What are you trying to improve right now?
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveGoal("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                activeGoal === "all"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface"
              }`}
            >
              <span>All Objectives</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveGoal("tech")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeGoal === "tech"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface"
              }`}
            >
              <span>Prepare for technical &amp; coding interviews</span>
              <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[10px] font-bold">
                Top Gap
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveGoal("behavioral")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeGoal === "behavioral"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface"
              }`}
            >
              <span>Master behavioral &amp; STAR rounds</span>
              <span className="px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant text-[10px] font-bold">
                Needs Attention
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveGoal("resume")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeGoal === "resume"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface"
              }`}
            >
              <span>Improve my resume &amp; ATS score</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveGoal("portfolio")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeGoal === "portfolio"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface"
              }`}
            >
              <span>Review portfolio &amp; capstones</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveGoal("linkedin")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeGoal === "linkedin"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface"
              }`}
            >
              <span>Optimize LinkedIn profile</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveGoal("salary")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeGoal === "salary"
                  ? "bg-primary text-on-primary shadow-xs"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface"
              }`}
            >
              <span>Salary negotiation &amp; offer strategy</span>
            </button>
          </div>
        </div>
      </section>

      {/* Dual-Booking Pathways Explainer Banner */}
      <section className="bg-surface-container-lowest rounded-2xl p-6 lg:p-8 shadow-xs border border-surface-container">
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          <div className="lg:w-1/3 flex flex-col justify-between pr-4">
            <div>
              <span className="text-xs text-primary uppercase font-bold tracking-wider">DreamX Dispatch System</span>
              <h2 className="text-xl font-bold text-on-surface mt-1 font-heading">Two Transparent Paths to Schedule</h2>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                No auto-reschedules or phantom availability. Choose between vetted direct mentor selection or algorithmic fast dispatch.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-on-secondary-container text-xs font-bold bg-secondary-container/40 px-3 py-1.5 rounded-lg w-fit">
              <span className="material-symbols-outlined text-base text-secondary">verified_user</span>
              <span>100% Escrow Protection on All Bookings</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:w-2/3">
            {/* Direct Booking Card */}
            <div className="bg-surface-container-low rounded-xl p-5 flex flex-col justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-primary">calendar_clock</span>
                  <span className="text-sm font-bold">Direct Mentor Hold</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Select specific verified mentors from top Tier-1 GCCs and unicorn startups with an instant calendar hold locked directly into their Google Calendar.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
                <span>Guaranteed slot confirmation</span>
                <span className="font-bold text-primary">Instant Confirmation</span>
              </div>
            </div>

            {/* Smart Match Dispatch Card */}
            <div className="bg-surface-container-low rounded-xl p-5 flex flex-col justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-tertiary">bolt</span>
                  <span className="text-sm font-bold">Smart Match Dispatch</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Algorithmic match with guaranteed 30-min Wave 2 fallback, atomic claims, and a 2-Hour 100% refund guarantee if unfulfilled.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
                <span>Refund Guarantee</span>
                <span className="font-bold text-secondary">100% Auto-Refund (2h)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deterministic Recommendation Engine (Rubric Driven) */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight font-heading">
              Personalized Gap Recommendations
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold">
              Grounded in Diagnostic Rubric
            </span>
          </div>
          <span className="text-xs text-on-surface-variant">Priority ordered by target impact weight</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recommendation Card 1 (Top Priority: S06) */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-xs flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 border border-surface-container">
            <div className="p-6 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2 py-0.5 rounded bg-error text-on-error text-[11px] font-bold uppercase">
                  Top Priority Gap
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-on-surface font-heading">
                    {isPro ? "₹949" : "₹999"}
                  </span>
                  {isPro && (
                    <span className="line-through text-on-surface-variant text-xs">₹999</span>
                  )}
                  <span className="text-[11px] text-secondary font-bold pl-1">Pro -5%</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                  <span>Code: S06</span>
                  <span>•</span>
                  <span>60 Minutes</span>
                  <span>•</span>
                  <span>1:1 Live Coding</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mt-1 font-heading">Technical Mock Interview</h3>
              </div>
              {/* Rationale Callout */}
              <div className="bg-error-container/40 rounded-xl p-3 flex flex-col gap-1">
                <span className="text-xs text-on-error-container font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">troubleshoot</span>
                  Why recommended
                </span>
                <p className="text-xs text-on-error-container leading-relaxed">
                  Technical Skills is weighted 20% with current score 2/5 (Below Benchmark) for SDE-1 targets.
                </p>
              </div>
              {/* Deliverables Box */}
              <div className="flex flex-col gap-1 text-on-surface-variant text-xs">
                <span className="font-bold text-on-surface">Standard Deliverables:</span>
                <p className="text-xs leading-normal">
                  Detailed 48h rubric scorecard, code complexity audit, and actionable revision checklist.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="material-symbols-outlined text-sm text-secondary">check_circle</span>
                <span className="font-medium text-on-surface">Top Match: Rohan Iyer (Senior SDE @ Swiggy)</span>
              </div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-b-2xl flex items-center gap-2 border-t border-surface-container">
              <Link
                href="/services/s06-technical-mock"
                className="flex-1 py-2 px-3 rounded-lg bg-primary text-on-primary text-xs hover:bg-primary-container transition-colors text-center font-bold"
              >
                Direct Book ({isPro ? "₹949" : "₹999"})
              </Link>
              <Link
                href="/services/s06-technical-mock"
                className="flex-1 py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs transition-colors text-center font-semibold"
              >
                Smart Match
              </Link>
            </div>
          </div>

          {/* Recommendation Card 2: S05 */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-xs flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 border border-surface-container">
            <div className="p-6 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2 py-0.5 rounded bg-surface-variant text-on-surface-variant text-[11px] font-bold uppercase">
                  Core Interview Rubric
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-on-surface font-heading">
                    {isPro ? "₹759" : "₹799"}
                  </span>
                  {isPro && (
                    <span className="line-through text-on-surface-variant text-xs">₹799</span>
                  )}
                  <span className="text-[11px] text-secondary font-bold pl-1">Pro -5%</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                  <span>Code: S05</span>
                  <span>•</span>
                  <span>60 Minutes</span>
                  <span>•</span>
                  <span>Role-play &amp; Feedback</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mt-1 font-heading">Behavioral Mock Interview</h3>
              </div>
              {/* Rationale Callout */}
              <div className="bg-surface-container rounded-xl p-3 flex flex-col gap-1">
                <span className="text-xs text-on-surface-variant font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">psychology</span>
                  Why recommended
                </span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  STAR framework delivery flagged as inconsistent during initial diagnostic. Leadership attributes need structure.
                </p>
              </div>
              {/* Deliverables Box */}
              <div className="flex flex-col gap-1 text-on-surface-variant text-xs">
                <span className="font-bold text-on-surface">Standard Deliverables:</span>
                <p className="text-xs leading-normal">
                  Recorded communication clarity metrics, leadership rubric evaluation, and question bank.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="material-symbols-outlined text-sm text-secondary">check_circle</span>
                <span className="font-medium text-on-surface">Top Match: Sneha Rao (Principal PM @ Razorpay)</span>
              </div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-b-2xl flex items-center gap-2 border-t border-surface-container">
              <Link
                href="/services/s05-behavioral-mock"
                className="flex-1 py-2 px-3 rounded-lg bg-primary text-on-primary text-xs hover:bg-primary-container transition-colors text-center font-bold"
              >
                Direct Book ({isPro ? "₹759" : "₹799"})
              </Link>
              <Link
                href="/services/s05-behavioral-mock"
                className="flex-1 py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs transition-colors text-center font-semibold"
              >
                Smart Match
              </Link>
            </div>
          </div>

          {/* Recommendation Card 3: S02 */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-xs flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 border border-surface-container">
            <div className="p-6 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2 py-0.5 rounded bg-surface-variant text-on-surface-variant text-[11px] font-bold uppercase">
                  Keyword &amp; Filter Gap
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-on-surface font-heading">
                    {isPro ? "₹759" : "₹799"}
                  </span>
                  {isPro && (
                    <span className="line-through text-on-surface-variant text-xs">₹799</span>
                  )}
                  <span className="text-[11px] text-secondary font-bold pl-1">Pro -5%</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                  <span>Code: S02</span>
                  <span>•</span>
                  <span>45 Minutes</span>
                  <span>•</span>
                  <span>Async + 1:1 Review</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mt-1 font-heading">ATS Resume Optimization</h3>
              </div>
              {/* Rationale Callout */}
              <div className="bg-surface-container rounded-xl p-3 flex flex-col gap-1">
                <span className="text-xs text-on-surface-variant font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">description</span>
                  Why recommended
                </span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Resume score 84/100; missing key enterprise distributed systems keywords required by Tier-1 job filters.
                </p>
              </div>
              {/* Deliverables Box */}
              <div className="flex flex-col gap-1 text-on-surface-variant text-xs">
                <span className="font-bold text-on-surface">Standard Deliverables:</span>
                <p className="text-xs leading-normal">
                  Line-by-line rewrite suggestions, keyword gap matrix, and 48-hour delivery commitment.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="material-symbols-outlined text-sm text-secondary">check_circle</span>
                <span className="font-medium text-on-surface">Top Match: Tanmay B. (Senior SWE @ Google)</span>
              </div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-b-2xl flex items-center gap-2 border-t border-surface-container">
              <Link
                href="/services/s02-ats-optimization"
                className="flex-1 py-2 px-3 rounded-lg bg-primary text-on-primary text-xs hover:bg-primary-container transition-colors text-center font-bold"
              >
                Direct Book ({isPro ? "₹759" : "₹799"})
              </Link>
              <Link
                href="/services/s02-ats-optimization"
                className="flex-1 py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs transition-colors text-center font-semibold"
              >
                Smart Match
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Custom 3-Service Bundle Promo Banner */}
      <section className="bg-primary text-on-primary rounded-2xl p-6 lg:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-[180px]">auto_fix_high</span>
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-on-secondary text-xs font-bold w-fit">
              <span className="material-symbols-outlined text-sm">savings</span>
              <span>Save an extra 5% with Custom 3-Service Bundle</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading">
              Bundle Any 3 Services for Target Readiness
            </h3>
            <p className="text-xs text-on-primary/80 leading-relaxed">
              Pick any 3 distinct services. DreamX absorbs the bundle discount—mentors are always paid 100% of their standard payout. Zero discount stacking, pure acceleration.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/services"
              className="px-5 py-3 rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container text-xs font-extrabold shadow-sm transition-all whitespace-nowrap"
            >
              Build Your 3-Service Bundle
            </Link>
          </div>
        </div>
      </section>

      {/* Vetted Mentor Directory with Filters & Domain Tabs */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight font-heading">
              Explore Verified Mentors
            </h2>
            <p className="text-xs text-on-surface-variant">
              Top practitioners who have completed identity verification and mentor calibration.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant font-medium">
              Showing {filteredMentors.length} Verified Mentors
            </span>
          </div>
        </div>

        {/* Filter & Search Controls Header */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs flex flex-col gap-4 border border-surface-container">
          {/* Domain Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveDomain("engineering")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeDomain === "engineering"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface"
              }`}
            >
              Software Engineering
            </button>
            <button
              type="button"
              onClick={() => setActiveDomain("product")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeDomain === "product"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface"
              }`}
            >
              Product Management
            </button>
            <button
              type="button"
              onClick={() => setActiveDomain("data")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeDomain === "data"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface"
              }`}
            >
              Data Science &amp; AI
            </button>
          </div>

          {/* Filter Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
            {/* Search Input */}
            <div className="md:col-span-2 relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-base select-none pointer-events-none">
                search
              </span>
              <input
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-low text-on-surface text-xs placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container transition-colors"
                placeholder="Search mentor, skill (e.g. Distributed Systems), or company..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Experience Select */}
            <div>
              <select
                className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface text-xs focus:outline-none focus:bg-surface-container cursor-pointer"
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
              >
                <option value="">Any Experience Level</option>
                <option value="3-5">3 - 5 Years (Mid-level)</option>
                <option value="5-8">5 - 8 Years (Senior / Staff)</option>
                <option value="8+">8+ Years (Principal / Exec)</option>
              </select>
            </div>
            {/* Availability Filter */}
            <div>
              <select className="w-full h-10 px-3 rounded-lg bg-surface-container-low text-on-surface text-xs focus:outline-none focus:bg-surface-container cursor-pointer">
                <option value="">Next Slot: Any Time</option>
                <option value="today">Available Today</option>
                <option value="tomorrow">Available Tomorrow</option>
                <option value="weekend">This Weekend</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mentor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-surface-container-lowest rounded-2xl shadow-xs p-6 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 border border-surface-container"
            >
              <div className="flex flex-col gap-4">
                {/* Profile Top Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-full ${mentor.avatarBg} flex items-center justify-center font-bold text-lg shadow-xs`}>
                      {mentor.initials}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-base font-bold text-on-surface font-heading">{mentor.name}</h4>
                        <span className="material-symbols-outlined text-primary text-base" title="Verified Identity">
                          verified
                        </span>
                      </div>
                      <span className="text-xs text-on-surface font-semibold">{mentor.role} @ {mentor.company}</span>
                      <span className="text-[11px] text-on-surface-variant">{mentor.experience}</span>
                    </div>
                  </div>
                  {/* Rating badge */}
                  <div className="flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-full text-on-surface text-xs">
                    <span
                      className="material-symbols-outlined text-sm text-amber-500"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="font-bold">{mentor.rating}</span>
                    <span className="text-[10px] text-on-surface-variant">({mentor.reviewsCount})</span>
                  </div>
                </div>

                {/* Badges & Verification tags */}
                <div className="flex flex-wrap gap-1.5">
                  {mentor.badges.map((badge) => (
                    <span
                      key={badge}
                      className="px-2.5 py-0.5 rounded-full bg-secondary-container/40 text-on-secondary-container text-[11px] font-bold flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">done</span>
                      <span>{badge}</span>
                    </span>
                  ))}
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold">
                    {mentor.approvedServices}
                  </span>
                </div>

                {/* Bio / Specialties */}
                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                  {mentor.bio}
                </p>

                {/* Slot Indicator */}
                <div className="flex items-center justify-between text-on-surface-variant text-xs bg-surface-container-low px-3 py-2 rounded-xl">
                  <div className="flex items-center gap-1.5 text-on-surface">
                    <span className="material-symbols-outlined text-sm text-secondary">schedule</span>
                    <span>Next available: <strong className="font-bold text-on-surface">{mentor.nextSlot}</strong></span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-semibold">Slots available</span>
                </div>
              </div>

              {/* Footer Pricing and Direct CTA */}
              <div className="mt-4 pt-3 flex items-center justify-between border-t border-surface-container">
                <div>
                  <span className="text-[11px] text-on-surface-variant block">Sessions starting at</span>
                  <span className="text-base font-bold text-on-surface font-heading">₹{mentor.startingPrice}</span>
                </div>
                <Link
                  href="/mentors"
                  className="py-2 px-4 rounded-lg bg-primary text-on-primary hover:bg-primary-container text-xs font-bold transition-colors"
                >
                  View Profile &amp; Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
