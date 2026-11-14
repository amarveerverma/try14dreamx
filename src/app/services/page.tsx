"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface ServiceCardData {
  id: string;
  code: string;
  slug: string;
  name: string;
  duration: string;
  durationMins: number;
  category: "resume-profile" | "tech-drills" | "behavioral" | "career-strategy";
  badge: string;
  badgeStyle?: string;
  isPopular?: boolean;
  tagline: string;
  deliverableTitle: string;
  deliverableDesc: string;
  deliverableIcon: string;
  linkedWeight: string;
  deliverableBg?: string;
  deliverableTextColor?: string;
  deliverableIconColor?: string;
  receives: string[];
  price: number;
  mentorTag: string;
}

const SERVICES_DATA: ServiceCardData[] = [
  {
    id: "s01",
    code: "S01",
    slug: "s01-resume-review",
    name: "Resume Review",
    duration: "45 min",
    durationMins: 45,
    category: "resume-profile",
    badge: "Core Baseline",
    tagline: "Comprehensive line-by-line critique to transform duty-focused resumes into verified quantitative impact statements.",
    deliverableTitle: "Deliverable SLA (48 Hours)",
    deliverableDesc: "48h PDF + Action Checklist & ATS Benchmark",
    deliverableIcon: "description",
    linkedWeight: "Linked: Resume Readiness (15% Weight)",
    receives: [
      "Line-by-line annotation of work experience and project bullets",
      "XYZ impact formula conversion (Accomplished [X] measured by [Y] by doing [Z])",
      "ATS parsing check across standard enterprise scanners",
    ],
    price: 599,
    mentorTag: "Tier-1 GCC Mentors",
  },
  {
    id: "s02",
    code: "S02",
    slug: "s02-ats-optimization",
    name: "ATS Resume Optimization",
    duration: "45 min",
    durationMins: 45,
    category: "resume-profile",
    badge: "High Conversion",
    badgeStyle: "bg-secondary/10 text-secondary",
    tagline: "Algorithm-level tailoring aligning target job descriptions with keyword taxonomy and parseable schema.",
    deliverableTitle: "Deliverable SLA (48 Hours)",
    deliverableDesc: "48h Annotated ATS Audit & Keyword Map Report",
    deliverableIcon: "analytics",
    linkedWeight: "Linked: Resume & Technical Skills",
    receives: [
      "Keyword density & frequency alignment against 3 target job descriptions",
      "JD semantic match score benchmark (Target >85% match)",
      "Layout & typography restructuring eliminating unparseable tables/columns",
    ],
    price: 799,
    mentorTag: "ATS Benchmark Certified",
  },
  {
    id: "s03",
    code: "S03",
    slug: "s03-linkedin-review",
    name: "LinkedIn Profile Review",
    duration: "30 min",
    durationMins: 30,
    category: "resume-profile",
    badge: "Quick Impact",
    badgeStyle: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    tagline: "Transform your profile into an inbound recruiter magnet with search indexing and high-converting bio architecture.",
    deliverableTitle: "Deliverable SLA (48 Hours)",
    deliverableDesc: "48h Profile Optimization Blueprint (PDF)",
    deliverableIcon: "feed",
    linkedWeight: "Linked: LinkedIn Readiness (8–10% Weight)",
    receives: [
      "Recruiter search Boolean visibility audit and SEO indexing score",
      "Custom Headline, About Section, and Featured Carousel copy templates",
      "Experience section reorganization highlighting ownership",
    ],
    price: 499,
    mentorTag: "Talent Acquisition Leads",
  },
  {
    id: "s04",
    code: "S04",
    slug: "s04-portfolio-review",
    name: "Portfolio Review",
    duration: "45 min",
    durationMins: 45,
    category: "resume-profile",
    badge: "Proof of Work",
    tagline: "Rigorous inspection of personal projects, code repositories, architecture diagrams, and deployment artifacts.",
    deliverableTitle: "Deliverable SLA (48 Hours)",
    deliverableDesc: "48h Project Teardown Report & GitHub Rubric",
    deliverableIcon: "terminal",
    linkedWeight: "Linked: Portfolio Readiness (5–15% Weight)",
    receives: [
      "GitHub repo code audit (modularization, commit discipline, testing coverage)",
      "System README revision with architecture diagrams & trade-off logs",
      "Live deployment validation (monitoring, CI/CD pipeline, performance audit)",
    ],
    price: 599,
    mentorTag: "Principal Engineers",
  },
  {
    id: "s05",
    code: "S05",
    slug: "s05-behavioral-mock",
    name: "Behavioral Mock Interview",
    duration: "60 min",
    durationMins: 60,
    category: "behavioral",
    badge: "Amazon/GCC Bar",
    badgeStyle: "bg-secondary-fixed text-on-secondary-fixed",
    tagline: "High-intensity scenario grilling benchmarked against Amazon Leadership Principles and GCC cultural bars.",
    deliverableTitle: "Deliverable SLA (48 Hours)",
    deliverableDesc: "48h Behavioral Scorecard (6 Rubric Dimensions)",
    deliverableIcon: "psychology",
    linkedWeight: "Linked: Communication & Confidence",
    receives: [
      "STAR (Situation-Task-Action-Result) response structuring drill",
      "Red-flag elimination (rambling, lack of ownership, defensive posture)",
      "6-point executive presence & articulation benchmark score",
    ],
    price: 799,
    mentorTag: "Engineering Managers",
  },
  {
    id: "s06",
    code: "S06",
    slug: "s06-technical-mock",
    name: "Technical Mock Interview",
    duration: "60 min",
    durationMins: 60,
    category: "tech-drills",
    badge: "Tier-1 Standard",
    badgeStyle: "bg-primary-fixed text-on-primary-fixed",
    isPopular: true,
    tagline: "Live simulation of System Design, API architecture, concurrency scenarios, and real-time trade-off drills.",
    deliverableTitle: "Deliverable SLA (48 Hours)",
    deliverableDesc: "Comprehensive 8-Dimension Technical Scorecard",
    deliverableIcon: "assessment",
    deliverableBg: "bg-primary-fixed/20",
    deliverableTextColor: "text-primary",
    deliverableIconColor: "text-primary",
    linkedWeight: "Linked: Technical & Interview Skills (35% Combined)",
    receives: [
      "Whiteboard architecture breakdown with horizontal scaling constraints",
      "Tier-1 hire / no-hire rubric calibration from FAANG/Unicorn tech leads",
      "Actionable 14-day technical remediation syllabus with resources",
    ],
    price: 999,
    mentorTag: "Staff & Principal SDEs Only",
  },
  {
    id: "s07",
    code: "S07",
    slug: "s07-career-consultation",
    name: "Career Consultation",
    duration: "30 min",
    durationMins: 30,
    category: "career-strategy",
    badge: "Clarity Session",
    tagline: "High-focus diagnostic triage to untangle role transitions, toxic work environments, and career stalls.",
    deliverableTitle: "Deliverable SLA (48 Hours)",
    deliverableDesc: "48h 30-Day Focus Action Plan (PDF)",
    deliverableIcon: "explore",
    linkedWeight: "Linked: Career Planning Readiness",
    receives: [
      "Role viability assessment across Startups vs. GCCs vs. Service giants",
      "Immediate resume & portfolio prioritization triage",
      "Target company whitelist based on candidate's current capability index",
    ],
    price: 499,
    mentorTag: "Veteran Engineering Leads",
  },
  {
    id: "s08",
    code: "S08",
    slug: "s08-salary-negotiation",
    name: "Salary Negotiation",
    duration: "30 min",
    durationMins: 30,
    category: "career-strategy",
    badge: "High ROI",
    badgeStyle: "bg-secondary/10 text-secondary",
    tagline: "Tactical counter-offer framing, base vs. variable analysis, and ESOP valuation calculations for Indian tech offers.",
    deliverableTitle: "Deliverable SLA (48 Hours)",
    deliverableDesc: "48h Counter-Offer Strategy Document & Scripts",
    deliverableIcon: "payments",
    linkedWeight: "Linked: Career Planning & Confidence",
    receives: [
      "Band benchmarking across Bangalore/NCR/Hyderabad tech markets",
      "Word-for-word counter-offer emails and HR negotiation call scripts",
      "ESOP cliff and strike price liquidation sensitivity breakdown",
    ],
    price: 699,
    mentorTag: "Avg. +28% Delta Achieved",
  },
  {
    id: "s09",
    code: "S09",
    slug: "s09-career-roadmap",
    name: "Career Roadmap Session",
    duration: "60 min",
    durationMins: 60,
    category: "career-strategy",
    badge: "Long-term Growth",
    tagline: "Architecting your next 6-12 months of skill acquisition, capstone projects, and promotion readiness.",
    deliverableTitle: "Deliverable SLA (48 Hours)",
    deliverableDesc: "48h Milestone Matrix & Learning Syllabus (PDF)",
    deliverableIcon: "alt_route",
    linkedWeight: "Linked: Career Planning & Tech Skills",
    receives: [
      "6-month structured engineering milestone roadmap with weekly sprint gates",
      "Recommended production capstone specifications (architecture & load expectations)",
      "Promotion ladder criteria (SDE-1 to SDE-2 expectation matrix)",
    ],
    price: 799,
    mentorTag: "Directors & Lead Architects",
  },
  {
    id: "s10",
    code: "S10",
    slug: "s10-coding-interview",
    name: "Coding Interview Preparation",
    duration: "60 min",
    durationMins: 60,
    category: "tech-drills",
    badge: "DSA & Algorithms",
    badgeStyle: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    tagline: "Live algorithmic problem-solving with rigorous focus on time-space complexity and edge-case handling.",
    deliverableTitle: "Deliverable SLA (48 Hours)",
    deliverableDesc: "48h Code Review Notes & Pattern Reference Sheet",
    deliverableIcon: "code",
    linkedWeight: "Linked: Technical Skills (20% Weight)",
    receives: [
      "Two medium-to-hard LeetCode style problems solved under live time pressure",
      "Algorithmic pattern recognition cheat sheet tailored to your gaps",
      "Clean-code audit: idiomatic syntax, modularity, and defensive assertions",
    ],
    price: 999,
    mentorTag: "Competitive Programmers & SDEs",
  },
];

export default function ServicesCatalogPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedDuration, setSelectedDuration] = React.useState<string>("all");
  const [selectedTargetStage, setSelectedTargetStage] = React.useState<string>("all");
  const [selectedServices, setSelectedServices] = React.useState<ServiceCardData[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [bundleNotice, setBundleNotice] = React.useState<string | null>(null);

  const { user } = useAuth();
  const router = useRouter();
  const [isPurchasing, setIsPurchasing] = React.useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = React.useState<string | null>(null);
  const [purchaseError, setPurchaseError] = React.useState<string | null>(null);

  const handleProceedCheckout = async () => {
    // 1. Detect active user from context or local storage
    let activeUser = user;
    if (!activeUser && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("dreamx_user");
        if (stored) activeUser = JSON.parse(stored);
      } catch {
        // ignore
      }
    }

    // 2. If not signed in, persist bundle selection and redirect to login
    if (!activeUser) {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "dreamx_pending_bundle",
          JSON.stringify(selectedServices.map((s) => s.code))
        );
      }
      router.push(`/login?redirect=${encodeURIComponent("/services?auto_open=bundle")}`);
      return;
    }

    if (selectedServices.length !== 3) {
      setPurchaseError("Please select exactly 3 services to lock in your custom bundle.");
      return;
    }

    setIsPurchasing(true);
    setPurchaseError(null);

    try {
      const res = await fetch("/api/bundle/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceCodes: selectedServices.map((s) => s.code),
          studentId: activeUser.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "dreamx_pending_bundle",
              JSON.stringify(selectedServices.map((s) => s.code))
            );
          }
          router.push(`/login?redirect=${encodeURIComponent("/services?auto_open=bundle")}`);
          return;
        }
        setPurchaseError(data.error || "Failed to initiate escrow checkout.");
      } else {
        if (typeof window !== "undefined") {
          localStorage.removeItem("dreamx_pending_bundle");
        }
        setPurchaseSuccess(
          data.message ||
            `Bundle ${data.bundle?.bundle_ref || ""} confirmed! 3 session credits added to your vault under 80% Escrow Guarantee.`
        );
        setTimeout(() => {
          setIsModalOpen(false);
          router.push("/dashboard/bookings?bundle=confirmed");
        }, 1800);
      }
    } catch (err: unknown) {
      setPurchaseError(err instanceof Error ? err.message : "Network error during checkout.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Restore pending bundle selection after login redirect
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("dreamx_pending_bundle");
        if (saved) {
          const codes = JSON.parse(saved) as string[];
          if (Array.isArray(codes) && codes.length > 0) {
            const matched = SERVICES_DATA.filter((s) => codes.includes(s.code));
            if (matched.length > 0) {
              setSelectedServices(matched);
              if (window.location.search.includes("auto_open=bundle") || matched.length === 3) {
                setIsModalOpen(true);
              }
            }
          }
        }
      } catch {
        // ignore
      }
    }
  }, []);

  // Keyboard shortcut Ctrl/Cmd + K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter Services
  const filteredServices = React.useMemo(() => {
    return SERVICES_DATA.filter((svc) => {
      const matchesCategory = selectedCategory === "all" || svc.category === selectedCategory;
      const matchesDuration =
        selectedDuration === "all" ||
        (selectedDuration === "30" && svc.durationMins === 30) ||
        (selectedDuration === "45" && svc.durationMins === 45) ||
        (selectedDuration === "60" && svc.durationMins === 60);

      const matchesStage =
        selectedTargetStage === "all" ||
        (selectedTargetStage === "Students & Fresh Grads" && (svc.code === "S01" || svc.code === "S03" || svc.code === "S09")) ||
        (selectedTargetStage === "0-2 YOE (Early Career)" && (svc.code === "S02" || svc.code === "S05" || svc.code === "S06" || svc.code === "S10")) ||
        (selectedTargetStage === "Non-Tech to Tech Switchers" && (svc.code === "S04" || svc.code === "S07" || svc.code === "S08"));

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        svc.name.toLowerCase().includes(q) ||
        svc.code.toLowerCase().includes(q) ||
        svc.tagline.toLowerCase().includes(q) ||
        svc.deliverableDesc.toLowerCase().includes(q) ||
        svc.mentorTag.toLowerCase().includes(q);

      return matchesCategory && matchesDuration && matchesStage && matchesSearch;
    });
  }, [searchQuery, selectedCategory, selectedDuration, selectedTargetStage]);

  // Bundle Handling
  const handleToggleBundle = (svc: ServiceCardData) => {
    const isAlreadySelected = selectedServices.some((s) => s.code === svc.code);
    if (isAlreadySelected) {
      setSelectedServices(selectedServices.filter((s) => s.code !== svc.code));
      setBundleNotice(null);
    } else {
      if (selectedServices.length >= 3) {
        setBundleNotice("Custom Track limit reached (3/3). Uncheck a service to pick another.");
        setTimeout(() => setBundleNotice(null), 4000);
        return;
      }
      setSelectedServices([...selectedServices, svc]);
      setBundleNotice(null);
    }
  };

  const bundleCount = selectedServices.length;
  const bundleGrossPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const bundleDiscount = bundleCount === 3 ? Math.round(bundleGrossPrice * 0.05) : 0;
  const bundleFinalPrice = bundleGrossPrice - bundleDiscount;

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDuration("all");
    setSelectedTargetStage("all");
  };

  return (
    <div className="flex flex-col w-full bg-surface">
      {/* Toast Notice */}
      {bundleNotice && (
        <div className="fixed top-24 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[18px] text-amber-300">info</span>
          <span>{bundleNotice}</span>
        </div>
      )}

      {/* Top Hero & Assurance Section */}
      <section className="w-full bg-surface-container-low/70 py-10 sm:py-12 lg:py-16 relative overflow-hidden border-b border-outline-variant/30">
        <div className="absolute -top-32 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          {/* Eyebrow & Live Protocol Status */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              PRD V3.0 Standardized Catalog
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold">
              <span className="material-symbols-outlined text-[15px] text-secondary">verified_user</span>
              Strict Deliverable SLA Protocol Active
            </div>
          </div>

          {/* Main Headline & Value Subtitle */}
          <div className="max-w-4xl space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-on-surface tracking-tight leading-tight font-heading">
              Outcome-Accountable <span className="text-primary">Career Services</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-on-surface-variant leading-relaxed max-w-3xl">
              Ten standardized 1:1 mentorship modules with fixed pricing in INR, verified Tier-1 mentors, enforceable 48-hour deliverable SLAs, and 100% refund guarantee if cancelled ≥1 hour before session.
            </p>
          </div>

          {/* Trust & Reassurance Badges Pill Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-8 pt-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0 mt-0.5 text-primary">
                <span className="material-symbols-outlined text-[20px]">format_list_numbered</span>
              </div>
              <div>
                <div className="text-sm font-bold text-on-surface leading-snug font-heading">
                  No Fluff / No Calls Without Rubric
                </div>
                <div className="text-xs text-on-surface-variant mt-0.5">Structured checklists only</div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5 text-secondary">
                <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
              </div>
              <div>
                <div className="text-sm font-bold text-on-surface leading-snug font-heading">
                  48-Hour Scorecard SLA
                </div>
                <div className="text-xs text-on-surface-variant mt-0.5">Timestamped PDF report</div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0 mt-0.5 text-primary">
                <span className="material-symbols-outlined text-[20px]">currency_rupee</span>
              </div>
              <div>
                <div className="text-sm font-bold text-on-surface leading-snug font-heading">
                  100% &amp; 80% Refund Guarantee
                </div>
                <div className="text-xs text-on-surface-variant mt-0.5">≥1h cancel or deliverable default</div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center shrink-0 mt-0.5 text-tertiary">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </div>
              <div>
                <div className="text-sm font-bold text-on-surface leading-snug font-heading">
                  Razorpay Escrow Protected
                </div>
                <div className="text-xs text-on-surface-variant mt-0.5">Mentor paid upon sign-off</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bundle Selection Bar (PRD §7.3 & §7.4 Bundle Builder Floating Bar) */}
      <div className="w-full bg-surface-container-high py-3.5 sm:py-4 px-4 sm:px-6 lg:px-12 sticky top-20 z-40 shadow-xs transition-all duration-300 border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shrink-0">
              <span className="material-symbols-outlined text-[20px] sm:text-[22px]">auto_awesome</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-on-surface font-heading">
                  Custom 3-Service Career Track
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                  Automatic 5% Discount
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5 leading-snug">
                Select any 3 modules. 100% funded by DreamX platform escrow — mentor fee is never reduced.
              </p>
            </div>
          </div>

          {/* Tracker & Action Button */}
          <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-5 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span
                  className={`w-3 h-3 rounded-full transition-colors ${
                    bundleCount >= 1 ? "bg-primary" : "bg-surface-container-highest"
                  }`}
                />
                <span
                  className={`w-3 h-3 rounded-full transition-colors ${
                    bundleCount >= 2 ? "bg-primary" : "bg-surface-container-highest"
                  }`}
                />
                <span
                  className={`w-3 h-3 rounded-full transition-colors ${
                    bundleCount >= 3 ? "bg-primary" : "bg-surface-container-highest"
                  }`}
                />
              </div>
              <span className="text-xs text-on-surface-variant font-bold whitespace-nowrap">
                {bundleCount}/3 selected
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-on-surface font-heading">
                  {bundleCount === 3 ? (
                    <>
                      <span className="line-through text-outline text-xs mr-1 font-normal">
                        ₹{bundleGrossPrice}
                      </span>
                      <span>₹{bundleFinalPrice}</span>
                    </>
                  ) : (
                    `₹${bundleGrossPrice}`
                  )}
                </div>
                <div
                  className={`text-[11px] font-medium ${
                    bundleCount === 3 ? "text-secondary font-bold" : "text-outline"
                  }`}
                >
                  {bundleCount === 3
                    ? `You save ₹${bundleDiscount} (5% Platform Discount)`
                    : `Pick ${3 - bundleCount} to unlock 5%`}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                disabled={bundleCount !== 3}
                className={`text-xs font-bold px-4 sm:px-5 py-2.5 rounded-lg transition-all inline-flex items-center gap-2 cursor-pointer ${
                  bundleCount === 3
                    ? "bg-primary text-on-primary shadow-md hover:bg-primary-container"
                    : "bg-primary text-on-primary opacity-40 cursor-not-allowed"
                }`}
              >
                <span>Review Bundle Track</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Discovery & Services Section */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10">
        {/* Controls Header: Search + Dimension Filter Tabs */}
        <div className="space-y-5 sm:space-y-6 mb-8 sm:mb-10">
          {/* Search and Duration Filter */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="relative flex-1 max-w-2xl">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                search
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by service name, career challenge, or keyword (e.g. System Design, Resume ATS, Salary Negotiation)..."
                className="w-full bg-surface-container-lowest text-on-surface placeholder:text-outline pl-11 pr-24 py-3 rounded-xl shadow-xs text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/30"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-surface-container text-outline text-[11px] font-bold">
                <span>⌘</span>
                <span>K</span>
              </div>
            </div>

            {/* Quick Duration Filter Group */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              <span className="text-[11px] text-outline uppercase tracking-wider font-bold whitespace-nowrap mr-1">
                Duration:
              </span>
              {["all", "30", "45", "60"].map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setSelectedDuration(dur)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                    selectedDuration === dur
                      ? "bg-surface-container-highest text-on-surface border-outline-variant/40"
                      : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border-outline-variant/20"
                  }`}
                >
                  {dur === "all" ? "All" : `${dur} min`}
                </button>
              ))}
            </div>
          </div>

          {/* Goal-First Category Tab Navigation */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Services", count: "10" },
              { id: "resume-profile", label: "Resume & Profile", count: "S01–S04" },
              { id: "tech-drills", label: "Technical & Coding Drills", count: "S06, S10" },
              { id: "behavioral", label: "Behavioral & Leadership", count: "S05" },
              { id: "career-strategy", label: "Career Strategy & Compensation", count: "S07–S09" },
            ].map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                    isActive
                      ? "bg-primary text-on-primary shadow-xs border-primary"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high border-outline-variant/20"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      isActive ? "bg-on-primary/20 text-on-primary" : "bg-surface-variant text-on-surface"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Secondary Stage Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/20">
            <div className="flex flex-wrap items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">filter_alt</span>
              <span className="text-xs text-on-surface font-bold">Target Candidate Stage:</span>
              <div className="flex flex-wrap items-center gap-1.5 ml-1">
                {["all", "Students & Fresh Grads", "0-2 YOE (Early Career)", "Non-Tech to Tech Switchers"].map(
                  (stage) => (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => setSelectedTargetStage(stage)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                        selectedTargetStage === stage
                          ? "bg-primary text-on-primary border-primary font-semibold"
                          : "bg-surface-container-lowest text-on-surface hover:bg-surface-container border-outline-variant/30"
                      }`}
                    >
                      {stage === "all" ? "All Stages" : stage}
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="text-xs text-outline font-semibold">
              Showing {filteredServices.length} of 10 Audited Modules
            </div>
          </div>
        </div>

        {/* The Canonical 10 Services Grid (PRD §6 Full Detail) */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((svc) => {
              const isChecked = selectedServices.some((s) => s.code === svc.code);
              return (
                <article
                  key={svc.code}
                  className={`bg-surface-container-lowest rounded-2xl shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative border ${
                    svc.isPopular
                      ? "ring-2 ring-primary/30 border-primary/40"
                      : "border-outline-variant/40"
                  }`}
                >
                  {svc.isPopular && (
                    <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-primary text-on-primary text-[11px] font-bold shadow-xs flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">stars</span>
                      Most Popular
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-primary-fixed text-on-primary-fixed text-xs font-bold font-mono">
                          {svc.code}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold">
                          {svc.duration}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          svc.badgeStyle || "bg-surface-container-highest text-on-surface"
                        }`}
                      >
                        {svc.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-on-surface font-heading">
                        {svc.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 leading-relaxed">
                        {svc.tagline}
                      </p>
                    </div>

                    {/* SLA Deliverable Box */}
                    <div
                      className={`p-3 rounded-xl space-y-1.5 border border-outline-variant/30 ${
                        svc.deliverableBg || "bg-surface-container-low"
                      }`}
                    >
                      <div className="text-[11px] text-outline uppercase tracking-wider font-bold">
                        {svc.deliverableTitle}
                      </div>
                      <div
                        className={`text-xs font-bold flex items-center gap-1.5 ${
                          svc.deliverableTextColor || "text-on-surface"
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-[16px] ${
                            svc.deliverableIconColor || "text-secondary"
                          }`}
                        >
                          {svc.deliverableIcon}
                        </span>
                        {svc.deliverableDesc}
                      </div>
                      <div className="text-[11px] text-outline font-medium">{svc.linkedWeight}</div>
                    </div>

                    {/* What You Will Receive */}
                    <div className="space-y-2">
                      <div className="text-xs text-on-surface font-bold uppercase tracking-wider">
                        What You Will Receive:
                      </div>
                      <ul className="space-y-1.5">
                        {svc.receives.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs text-on-surface-variant leading-relaxed"
                          >
                            <span className="material-symbols-outlined text-[15px] text-secondary shrink-0 mt-0.5">
                              check_circle
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Bottom Pricing & Actions */}
                  <div className="mt-6 pt-4 border-t border-outline-variant/20 space-y-4">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xl sm:text-2xl font-extrabold text-on-surface font-heading">
                          ₹{svc.price}
                        </span>
                        <span className="text-xs text-outline ml-1 font-medium">all-inclusive</span>
                      </div>
                      <div className="inline-flex items-center gap-1 text-[11px] text-outline font-bold">
                        <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
                        {svc.mentorTag}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-on-surface font-semibold">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleBundle(svc)}
                          className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                        />
                        <span>Add to Bundle</span>
                      </label>
                      <Link
                        href={`/services/${svc.slug}`}
                        className="bg-primary text-on-primary text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-xs"
                      >
                        Book Module
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty Search State */
          <div className="py-16 text-center space-y-3 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20">
            <div className="w-12 h-12 rounded-full bg-surface-container mx-auto flex items-center justify-center text-outline">
              <span className="material-symbols-outlined text-[24px]">search_off</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-on-surface font-heading">
              No matching career modules found
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto">
              Try broadening your search query or reset your filters to see all 10 standardized modules.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-2 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* Accountability, SLAs & Consumer Rights Section (PRD §12 & Frontend §10) */}
      <section className="w-full bg-surface-container-low py-12 sm:py-16 border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="space-y-3 text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              PRD V3.0 §12 Statutory Compliance
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface font-heading">
              Enforceable Consumer Guarantees
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              We eliminate the ambiguity of traditional online edtech. Every single mentorship interaction is strictly monitored by automated SLAs, escrow locks, and transparent refund mechanisms.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* SLA 1 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs space-y-3 border border-outline-variant/30">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">timer</span>
              </div>
              <h4 className="text-base font-bold text-on-surface font-heading">
                100% Pre-Session Refund
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Cancel up to <strong>≥1 hour</strong> before the scheduled session start time for an instant, no-questions-asked 100% refund credited back to your original source via Razorpay.
              </p>
            </div>

            {/* SLA 2 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs space-y-3 border border-outline-variant/30">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[22px]">verified_user</span>
              </div>
              <h4 className="text-base font-bold text-on-surface font-heading">
                80% Rubric SLA Guarantee
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                If the mentor fails to upload your standardized PDF scorecard and action checklist within <strong>48 hours</strong> of session completion, you receive an automated 80% refund.
              </p>
            </div>

            {/* SLA 3 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs space-y-3 border border-outline-variant/30">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">badge</span>
              </div>
              <h4 className="text-base font-bold text-on-surface font-heading">
                3-Tier Verified Mentors
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Every mentor has passed Aadhaar &amp; biometric identity verification, corporate employment verification at Tier-1 GCC/Unicorns, and module-specific rubric training.
              </p>
            </div>

            {/* SLA 4 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs space-y-3 border border-outline-variant/30">
              <div className="w-10 h-10 rounded-xl bg-error-container/40 flex items-center justify-center text-error">
                <span className="material-symbols-outlined text-[22px]">gavel</span>
              </div>
              <h4 className="text-base font-bold text-on-surface font-heading">
                Zero False Job Guarantees
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                In compliance with Indian ASCI guidelines: DreamX guarantees verified capability improvement, rubrics, and tangible proof-of-work, never fraudulent &ldquo;100% placement guarantees.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Modal: Bundle Details & Summary */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-outline-variant/40 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container">
                  <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-on-surface font-heading">
                  Your 3-Service Career Track
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs uppercase text-outline font-bold tracking-wider">
                Included Modules
              </div>
              <div className="space-y-2">
                {selectedServices.map((s) => (
                  <div
                    key={s.code}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface-container text-xs border border-outline-variant/20"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-bold font-mono">
                        {s.code}
                      </span>
                      <span className="font-semibold text-on-surface">{s.name}</span>
                    </div>
                    <span className="font-bold text-on-surface">₹{s.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-surface-container-low rounded-xl space-y-2 text-xs border border-outline-variant/30">
              <div className="flex justify-between text-on-surface-variant font-medium">
                <span>Catalog Total:</span>
                <span className="font-bold text-on-surface">₹{bundleGrossPrice}</span>
              </div>
              <div className="flex justify-between text-secondary font-bold">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">high_res</span>
                  DreamX 5% Custom Bundle Discount:
                </span>
                <span>-₹{bundleDiscount}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-on-surface pt-2 border-t border-outline-variant/20">
                <span>Final Payable (INR):</span>
                <span className="text-base text-primary font-heading font-extrabold">
                  ₹{bundleFinalPrice}
                </span>
              </div>
              <div className="text-[11px] text-outline text-right mt-1">
                Escrow held until 48-hour delivery sign-off
              </div>
            </div>

            {purchaseSuccess ? (
              <div className="p-5 bg-secondary/10 border border-secondary/20 rounded-xl text-center space-y-2">
                <span className="material-symbols-outlined text-secondary text-3xl">verified</span>
                <h4 className="text-sm font-bold text-on-surface">Escrow Payment Confirmed!</h4>
                <p className="text-xs text-on-surface-variant">{purchaseSuccess}</p>
                <p className="text-[11px] text-outline">Redirecting to your candidate vault...</p>
              </div>
            ) : (
              <>
                {purchaseError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    <span>{purchaseError}</span>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isPurchasing}
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-outline-variant text-on-surface text-xs font-semibold hover:bg-surface-container-low transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Modify Selection
                  </button>
                  <button
                    type="button"
                    disabled={isPurchasing}
                    onClick={handleProceedCheckout}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-on-primary text-xs font-bold text-center hover:bg-primary-container transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isPurchasing ? (
                      <>
                        <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                        <span>Locking in Escrow...</span>
                      </>
                    ) : (
                      <>
                        <span>Proceed to Escrow Payment (₹{bundleFinalPrice})</span>
                        <span className="material-symbols-outlined text-[16px]">lock</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
