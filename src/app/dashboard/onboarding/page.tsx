"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import {
  GraduationCap,
  Briefcase,
  Terminal,
  RefreshCw,
  CheckCircle2,
  Check,
  Building2,
  Rocket,
  Store,
  FileText,
  UploadCloud,
  Link as LinkIcon,
  GitBranch,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sliders,
  Star,
  Award,
  AlertTriangle,
  Lock,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";

// ==========================================
// 8-Dimension Competency Model
// ==========================================
interface DimensionItem {
  id: number;
  name: string;
  weight: number;
  subtitle: string;
  defaultRating: number;
  sprintModule: string;
}

const DIMENSIONS: DimensionItem[] = [
  {
    id: 1,
    name: "1. Resume & ATS Parsing",
    weight: 15,
    subtitle: "Keyword alignment, quantified impact (XYZ formula), and parser pass-rate",
    defaultRating: 4,
    sprintModule: "S01: ATS Diagnostic & Resume Rewrite",
  },
  {
    id: 2,
    name: "2. Data Structures & Algorithms",
    weight: 15,
    subtitle: "Core algorithmic patterns, time/space complexity, and live whiteboard defense",
    defaultRating: 3,
    sprintModule: "S04: DSA & Algorithmic Problem Solving Drill",
  },
  {
    id: 3,
    name: "3. System Design & Scalability",
    weight: 15,
    subtitle: "Distributed caching, event streaming (Kafka), sharding, and fault tolerance",
    defaultRating: 2,
    sprintModule: "S06: Distributed High-Throughput Architectures",
  },
  {
    id: 4,
    name: "4. Behavioral STAR & Leadership",
    weight: 10,
    subtitle: "Situation-Task-Action-Result structural precision under executive pressure",
    defaultRating: 4,
    sprintModule: "S03: STAR Behavioral & Leadership Framing",
  },
  {
    id: 5,
    name: "5. Mock Interview Pressure Handling",
    weight: 15,
    subtitle: "Clarifying ambiguous requirements, pacing under evaluation, and composure",
    defaultRating: 3,
    sprintModule: "S05: Full-Loop Technical Simulation",
  },
  {
    id: 6,
    name: "6. Production Portfolio Proof",
    weight: 10,
    subtitle: "Public microservices, Docker containerization, CI/CD, and architecture diagrams",
    defaultRating: 3,
    sprintModule: "S02: Artifact & GitHub Architecture Audit",
  },
  {
    id: 7,
    name: "7. Salary & Equity Negotiation",
    weight: 10,
    subtitle: "Compensation restructuring, ESOP valuation models, and counter-offer protocol",
    defaultRating: 2,
    sprintModule: "S08: Offer & Salary Negotiation Benchmarks",
  },
  {
    id: 8,
    name: "8. Architectural Code Cleanliness",
    weight: 10,
    subtitle: "SOLID design principles, modularity, unit test coverage, and documentation",
    defaultRating: 4,
    sprintModule: "S07: Clean Code & Refactoring Clinic",
  },
];

// Career stages
const CAREER_STAGES = [
  {
    id: "student",
    title: "Final Year Undergraduate",
    description: "Preparing for Tier-1 campus placement drives and first off-campus product SDE roles.",
    icon: GraduationCap,
    badge: "Campus Track",
  },
  {
    id: "fresh_graduate",
    title: "Fresh Graduate (<1 YoE)",
    description: "Recently graduated engineer striving to secure a high-growth tech product role.",
    icon: Award,
    badge: "Entry Track",
  },
  {
    id: "early_career",
    title: "Early Career (1–3 YoE)",
    description: "Targeting SDE-2 promotion, distributed systems depth, and Tier-1 product jump.",
    icon: Terminal,
    badge: "Active SDE-2 Track",
  },
  {
    id: "career_switcher",
    title: "Domain Switcher",
    description: "Moving from QA, maintenance IT, or analytics into high-scale Backend/Platform Engineering.",
    icon: RefreshCw,
    badge: "Transition Track",
  },
];

// Technical Domains
const DOMAINS = [
  "Backend & Distributed Systems",
  "Fullstack Architecture",
  "AI & ML Infrastructure",
  "Cloud & DevOps Engineering",
  "High-Scale Frontend",
  "Data Science & Platform",
];

// Target Company Tiers
const COMPANY_TIERS = [
  {
    id: "tier1_gcc",
    title: "Tier-1 GCCs & MNCs",
    examples: "Microsoft, Adobe, Intuit, Walmart",
    icon: Building2,
  },
  {
    id: "unicorns",
    title: "High-Growth Unicorns",
    examples: "Swiggy, Razorpay, Zepto, CRED",
    icon: Rocket,
  },
  {
    id: "startups",
    title: "Funded Seed / Series-A",
    examples: "Y Combinator, Matrix, Peak XV backed",
    icon: Store,
  },
];

function CandidateOnboardingContent() {
  const router = useRouter();
  const { user, completeOnboarding } = useAuth();
  const supabase = React.useMemo(() => createClient(), []);

  const [isMounted, setIsMounted] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState<number>(1);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  // Form states
  const [selectedStage, setSelectedStage] = React.useState<string>("early_career");
  const [selectedDomain, setSelectedDomain] = React.useState<string>("Backend & Distributed Systems");
  const [selectedTiers, setSelectedTiers] = React.useState<string[]>(["tier1_gcc", "unicorns"]);
  const [targetCtc, setTargetCtc] = React.useState<number>(36); // in Lakhs
  const [linkedinUrl, setLinkedinUrl] = React.useState<string>("");
  const [githubUrl, setGithubUrl] = React.useState<string>("");
  const [resumeFileName, setResumeFileName] = React.useState<string>("");
  const [resumeFileSize, setResumeFileSize] = React.useState<string>("");
  const [resumeUploaded, setResumeUploaded] = React.useState<boolean>(false);

  // Ratings 1-5 for each of the 8 dimensions
  const [ratings, setRatings] = React.useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    DIMENSIONS.forEach((d) => {
      initial[d.id] = d.defaultRating;
    });
    return initial;
  });

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Strict Role & Onboarding Status Guards
  React.useEffect(() => {
    if (!user) {
      const isCookieOnboarded = typeof document !== "undefined" && document.cookie.includes("dreamx_onboarded=true");
      const isCookieStudent = typeof document !== "undefined" && document.cookie.includes("dreamx_role=student");
      if (isCookieOnboarded && isCookieStudent) {
        if (typeof window !== "undefined") {
          window.location.replace("/dashboard");
        } else {
          router.replace("/dashboard");
        }
        return;
      }
      router.replace("/login?redirect=/dashboard/onboarding");
      return;
    }
    if (user.role === "mentor") {
      const target = user.onboarding_completed ? "/mentor" : "/mentor/onboarding";
      if (typeof window !== "undefined") {
        window.location.replace(target);
      } else {
        router.replace(target);
      }
    } else if (user.role === "admin") {
      router.replace("/admin");
    } else if (user.role === "student" && user.onboarding_completed) {
      if (typeof window !== "undefined") {
        window.location.replace("/dashboard");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [user, router]);

  // Rehydrate existing candidate draft or profile data so session expiration never loses progress
  React.useEffect(() => {
    if (!user?.id) return;
    const userId = user.id;

    async function loadCandidateDraft() {
      try {
        // 1. Try local draft
        if (typeof window !== "undefined") {
          const localDraft = localStorage.getItem(`dreamx_candidate_draft_${userId}`);
          if (localDraft) {
            const parsed = JSON.parse(localDraft);
            if (parsed.selectedStage) setSelectedStage(parsed.selectedStage);
            if (parsed.selectedDomain) setSelectedDomain(parsed.selectedDomain);
            if (parsed.selectedTiers && parsed.selectedTiers.length > 0) setSelectedTiers(parsed.selectedTiers);
            if (parsed.targetCtc) setTargetCtc(parsed.targetCtc);
            if (parsed.linkedinUrl) setLinkedinUrl(parsed.linkedinUrl);
            if (parsed.githubUrl) setGithubUrl(parsed.githubUrl);
            if (parsed.ratings) setRatings(parsed.ratings);
            if (parsed.activeStep) setActiveStep(parsed.activeStep);
          }
        }

        // 2. Supplement from remote profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("segment, target_role, target_company_tier, linkedin_url, github_url")
          .eq("id", userId)
          .maybeSingle();

        if (profile) {
          if (profile.segment) setSelectedStage(profile.segment);
          if (profile.target_role) setSelectedDomain(profile.target_role);
          if (profile.target_company_tier) {
            const tiers = profile.target_company_tier.split(", ").map((t: string) => t.trim()).filter(Boolean);
            if (tiers.length > 0) setSelectedTiers(tiers);
          }
          if (profile.linkedin_url) setLinkedinUrl((prev) => prev || profile.linkedin_url || "");
          if (profile.github_url) setGithubUrl((prev) => prev || profile.github_url || "");
        }
      } catch (err) {
        console.warn("Could not load candidate draft:", err);
      }
    }

    loadCandidateDraft();
  }, [user?.id, supabase]);

  // Auto-save candidate onboarding draft on field changes
  React.useEffect(() => {
    if (typeof window !== "undefined" && user?.id) {
      localStorage.setItem(
        `dreamx_candidate_draft_${user.id}`,
        JSON.stringify({
          activeStep,
          selectedStage,
          selectedDomain,
          selectedTiers,
          targetCtc,
          linkedinUrl,
          githubUrl,
          ratings,
        })
      );
    }
  }, [user?.id, activeStep, selectedStage, selectedDomain, selectedTiers, targetCtc, linkedinUrl, githubUrl, ratings]);

  // Real-time calculated overall readiness score out of 100
  const calculatedScore = React.useMemo(() => {
    let total = 0;
    DIMENSIONS.forEach((dim) => {
      const score = ratings[dim.id] || 3;
      total += (dim.weight * score) / 5;
    });
    return Math.min(100, Math.round(total));
  }, [ratings]);

  // Find lowest rated dimension to dynamically recommend sprint priority
  const lowestDimension = React.useMemo(() => {
    let minDim = DIMENSIONS[0];
    let minScore = ratings[minDim.id] || 5;

    DIMENSIONS.forEach((dim) => {
      const score = ratings[dim.id] || 3;
      if (score < minScore) {
        minScore = score;
        minDim = dim;
      }
    });

    return { dim: minDim, score: minScore };
  }, [ratings]);

  // Highest rated dimension
  const highestDimension = React.useMemo(() => {
    let maxDim = DIMENSIONS[0];
    let maxScore = ratings[maxDim.id] || 1;

    DIMENSIONS.forEach((dim) => {
      const score = ratings[dim.id] || 3;
      if (score > maxScore) {
        maxScore = score;
        maxDim = dim;
      }
    });

    return { dim: maxDim, score: maxScore };
  }, [ratings]);

  const toggleTier = (id: string) => {
    setSelectedTiers((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((t) => t !== id) : prev) : [...prev, id]
    );
  };

  const setRating = (dimId: number, val: number) => {
    setRatings((prev) => ({ ...prev, [dimId]: val }));
  };

  // Complete onboarding action
  const handleCompleteOnboarding = async () => {
    setIsSaving(true);
    try {
      // 1. Resolve user ID robustly (from auth state or current session)
      let resolvedUserId = user?.id;
      if (!resolvedUserId) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          resolvedUserId = session.user.id;
        }
      }

      const mappedSegment =
        selectedStage === "student"
          ? "student"
          : selectedStage === "fresh_graduate"
          ? "fresh_graduate"
          : selectedStage === "career_switcher"
          ? "career_switcher"
          : "early_career";

      // 2. Persist to Supabase atomically via stored procedure
      if (resolvedUserId) {
        try {
          const { error: rpcErr } = await (supabase.rpc as any)("submit_student_onboarding", {
            p_user_id: resolvedUserId,
            p_segment: mappedSegment,
            p_target_role: selectedDomain,
            p_target_company_tier: selectedTiers.join(", "),
            p_target_ctc: Number(targetCtc) || 36,
            p_linkedin_url: linkedinUrl.trim() || null,
            p_github_url: githubUrl.trim() || null,
            p_overall_score: calculatedScore,
            p_dimension_scores: ratings,
          });

          if (rpcErr) {
            console.warn("Notice during submit_student_onboarding RPC:", rpcErr);
            await supabase
              .from("profiles")
              .update({
                role: "student",
                onboarding_completed: true,
                segment: mappedSegment,
                target_role: selectedDomain,
                target_company_tier: selectedTiers.join(", "),
                linkedin_url: linkedinUrl.trim() || null,
                github_url: githubUrl.trim() || null,
                updated_at: new Date().toISOString(),
              })
              .eq("id", resolvedUserId);
          }
        } catch (dbErr) {
          console.warn("DB update fallback attempt:", dbErr);
        }
      }

      // 3. Set cookies & localStorage for instant client & middleware synchronization
      if (typeof window !== "undefined") {
        document.cookie = "dreamx_role=student; path=/; max-age=2592000; SameSite=Lax";
        document.cookie = "dreamx_onboarded=true; path=/; max-age=2592000; SameSite=Lax";
        document.cookie = "dreamx_auth=true; path=/; max-age=2592000; SameSite=Lax";

        if (resolvedUserId) {
          localStorage.setItem(`dreamx_baseline_score_${resolvedUserId}`, String(calculatedScore));
          localStorage.setItem(`dreamx_baseline_ratings_${resolvedUserId}`, JSON.stringify(ratings));
          localStorage.setItem(`dreamx_target_role_${resolvedUserId}`, selectedDomain);
          localStorage.removeItem(`dreamx_candidate_draft_${resolvedUserId}`);
        }
        localStorage.setItem("dreamx_onboarding_just_completed", "true");

        const storedUser = localStorage.getItem("dreamx_user");
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            parsed.onboarding_completed = true;
            parsed.role = "student";
            localStorage.setItem("dreamx_user", JSON.stringify(parsed));
          } catch {}
        }
      }

      // 4. Update auth context state
      await completeOnboarding();
      setSaveSuccess(true);

      // 5. Clean redirect to student dashboard
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.replace("/dashboard");
        } else {
          router.replace("/dashboard");
        }
      }, 700);
    } catch (err) {
      console.error("Failed to save onboarding calibration:", err);
      // Fallback: still navigate so user is not blocked
      if (typeof window !== "undefined") {
        document.cookie = "dreamx_role=student; path=/; max-age=2592000; SameSite=Lax";
        document.cookie = "dreamx_onboarded=true; path=/; max-age=2592000; SameSite=Lax";
        window.location.replace("/dashboard");
      } else {
        router.replace("/dashboard");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#faf9f8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#5145cd] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-gray-500 font-mono">
            Loading DreamX Calibration Engine...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f8] text-[#1c1b1b] flex flex-col font-sans antialiased selection:bg-[#5145cd]/15">
      {/* ========================================================= */}
      {/* 1. TOP STICKY APPLICATION BAR                             */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#e7e7eb] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left Brand Badge */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#3828b5] to-[#5145cd] text-white flex items-center justify-center font-extrabold text-sm shadow-xs font-mono group-hover:scale-105 transition-transform">
                DX
              </div>
              <span className="text-lg font-extrabold text-[#1c1b1b] tracking-tight">
                Dream<span className="text-[#5145cd]">X</span>
              </span>
            </Link>

            <div className="h-4 w-px bg-gray-200 hidden sm:block" />

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Diagnostic Setup</span>
            </div>
          </div>

          {/* Stepper Progress Badges (Desktop) */}
          <div className="hidden md:flex items-center gap-5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className={`flex items-center gap-1.5 transition-colors ${
                activeStep >= 1 ? "text-[#5145cd] font-bold" : "text-gray-400"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-[#5145cd]/10 text-[#5145cd] flex items-center justify-center text-[11px] font-bold">
                1
              </span>
              <span>Stage</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className={`flex items-center gap-1.5 transition-colors ${
                activeStep >= 2 ? "text-[#5145cd] font-bold" : "text-gray-400"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-[#5145cd]/10 text-[#5145cd] flex items-center justify-center text-[11px] font-bold">
                2
              </span>
              <span>Domain</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className={`flex items-center gap-1.5 transition-colors ${
                activeStep >= 3 ? "text-[#5145cd] font-bold" : "text-gray-400"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-[#5145cd] text-white flex items-center justify-center text-[11px] font-bold shadow-xs">
                3
              </span>
              <span>8-D Rubric</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <button
              type="button"
              onClick={() => setActiveStep(4)}
              className={`flex items-center gap-1.5 transition-colors ${
                activeStep >= 4 ? "text-[#5145cd] font-bold" : "text-gray-400"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[11px]">
                4
              </span>
              <span>Profile</span>
            </button>
          </div>

          {/* Right Action Helpers */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/919999999999?text=Hi%20DreamX%20Concierge,%20I%20need%20help%20with%20onboarding"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>1:1 Concierge</span>
            </a>

            <Link
              href="/dashboard"
              className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors px-2 py-1"
            >
              Save &amp; Exit
            </Link>
          </div>
        </div>

        {/* Dynamic Micro Progress Indicator */}
        <div className="w-full bg-[#e7e7eb] h-1 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#3828b5] to-[#5145cd] transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(25, (activeStep / 4) * 100))}%` }}
          />
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. HERO WELCOME SECTION                                   */}
      {/* ========================================================= */}
      <section className="pt-8 pb-6 px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-[#3828b5] text-xs font-bold mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#5145cd]" />
          <span>Calibrated for Tier-1 GCCs &amp; Unicorn Trajectories</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1c1b1b] tracking-tight leading-tight">
          Personalize Your Career Acceleration Path
        </h1>
        <p className="mt-2.5 text-xs sm:text-sm text-[#474554] max-w-2xl mx-auto leading-relaxed">
          Tailor your diagnostic baseline, verified 1:1 Tier-1 mentor allocation, and compensation parameters to your exact transition goals.
        </p>
      </section>

      {/* ========================================================= */}
      {/* 3. MAIN INTERACTIVE ONBOARDING CANVAS                     */}
      {/* ========================================================= */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
        {/* ===================================================== */}
        {/* SECTION 1: CAREER STAGE SELECTION                     */}
        {/* ===================================================== */}
        <div className="bg-white rounded-2xl border border-[#e7e7eb] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#f0eded]">
            <div>
              <span className="text-[11px] font-bold text-[#5145cd] uppercase tracking-wider block">
                Step 1 — Baseline Status
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#1c1b1b] tracking-tight">
                Select Your Current Career Phase
              </h2>
            </div>
            <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Auto-Detected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {CAREER_STAGES.map((stage) => {
              const Icon = stage.icon;
              const isSelected = selectedStage === stage.id;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => {
                    setSelectedStage(stage.id);
                    if (activeStep < 2) setActiveStep(2);
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? "border-[#5145cd] bg-indigo-50/40 shadow-xs"
                      : "border-[#e7e7eb] hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? "bg-[#5145cd] text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-[#5145cd] bg-[#5145cd]" : "border-gray-300"
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-[#1c1b1b]">{stage.title}</h3>
                      {isSelected && (
                        <span className="px-1.5 py-0.5 rounded bg-[#5145cd] text-white text-[10px] font-bold">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#66666f] mt-1 leading-normal">
                      {stage.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================================================== */}
        {/* SECTION 2: TARGET ROLE & COMPENSATION                 */}
        {/* ===================================================== */}
        <div className="bg-white rounded-2xl border border-[#e7e7eb] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-2 border-b border-[#f0eded]">
            <span className="text-[11px] font-bold text-[#5145cd] uppercase tracking-wider block">
              Step 2 — Trajectory &amp; Compensation
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#1c1b1b] tracking-tight">
              Target Specialization &amp; Organization Tier
            </h2>
          </div>

          {/* Domain Pills */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-[#1c1b1b]">
              Target Technical Domain
            </label>
            <div className="flex flex-wrap gap-2">
              {DOMAINS.map((domain) => {
                const isSelected = selectedDomain === domain;
                return (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => {
                      setSelectedDomain(domain);
                      if (activeStep < 3) setActiveStep(3);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-[#5145cd] text-white shadow-xs"
                        : "bg-[#f0eded] hover:bg-gray-200 text-[#474554]"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{domain}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Company Archetype Multi-Select */}
          <div className="space-y-2.5 pt-2">
            <label className="block text-xs font-bold text-[#1c1b1b]">
              Target Employer Archetypes (Multi-select)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {COMPANY_TIERS.map((tier) => {
                const Icon = tier.icon;
                const isSelected = selectedTiers.includes(tier.id);
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => toggleTier(tier.id)}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "border-[#5145cd] bg-indigo-50/30"
                        : "border-[#e7e7eb] hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-[#5145cd]" : "text-gray-400"}`} />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#1c1b1b] truncate">{tier.title}</div>
                        <div className="text-[11px] text-gray-500 truncate">{tier.examples}</div>
                      </div>
                    </div>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                        isSelected ? "border-[#5145cd] bg-[#5145cd] text-white" : "border-gray-300"
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calibrated Target CTC Slider */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#f6f3f2] border border-[#e7e7eb] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-[#1c1b1b]">
                  Calibrated Target CTC Compensation Band
                </span>
                <p className="text-[11px] text-gray-500">
                  Aligned with current Bangalore/Hyderabad verified offer benchmarks
                </p>
              </div>
              <div className="px-3 py-1 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900 font-extrabold text-xs self-start sm:self-auto font-mono">
                ₹{targetCtc}L – ₹{targetCtc + 10}L CTC
              </div>
            </div>

            <input
              type="range"
              min={14}
              max={65}
              step={2}
              value={targetCtc}
              onChange={(e) => setTargetCtc(Number(e.target.value))}
              className="w-full accent-[#5145cd] cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-gray-500 font-mono font-medium">
              <span>Campus Entry (₹14L)</span>
              <span>Median Tier-1 SDE-2 (₹36L)</span>
              <span>Principal / Unicorn (₹65L+)</span>
            </div>
          </div>
        </div>

        {/* ===================================================== */}
        {/* SECTION 3: 8-DIMENSION BASELINE ASSESSMENT            */}
        {/* ===================================================== */}
        <div className="bg-white rounded-2xl border border-[#e7e7eb] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#f0eded]">
            <div>
              <span className="text-[11px] font-bold text-[#5145cd] uppercase tracking-wider block">
                Step 3 — 8-Dimension Evaluation Model
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#1c1b1b] tracking-tight">
                Rate Your Current Competency Baseline
              </h2>
              <p className="text-xs text-[#66666f] mt-0.5">
                Self-evaluation calibrates your roadmap and pairs with mentor diagnostic interviews.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-[#3828b5] text-xs font-bold self-start sm:self-auto">
              Linear 1 → 5 Scale
            </span>
          </div>

          {/* 8 Competency Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {DIMENSIONS.map((dim) => {
              const currentRating = ratings[dim.id] || 3;
              const isPriorityGap = currentRating <= 2;
              const isStrong = currentRating >= 4;

              return (
                <div
                  key={dim.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isPriorityGap
                      ? "border-amber-300 bg-amber-50/30"
                      : "border-[#e7e7eb] bg-[#fdfdfd]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#1c1b1b] truncate">
                      {dim.name}
                    </span>
                    <span
                      className={`text-[11px] font-bold shrink-0 ${
                        isPriorityGap
                          ? "text-amber-700"
                          : isStrong
                          ? "text-emerald-700"
                          : "text-gray-600"
                      }`}
                    >
                      {currentRating === 1
                        ? "1 (Needs Work)"
                        : currentRating === 2
                        ? "2 (Developing)"
                        : currentRating === 3
                        ? "3 (Competent)"
                        : currentRating === 4
                        ? "4 (Strong)"
                        : "5 (Tier-1 Ready)"}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-500 leading-tight mb-2.5 line-clamp-1">
                    {dim.subtitle}
                  </p>

                  {/* 1-5 Segmented Buttons */}
                  <div className="grid grid-cols-5 gap-1 text-xs font-bold">
                    {[1, 2, 3, 4, 5].map((lvl) => {
                      const isActive = currentRating === lvl;
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setRating(dim.id, lvl)}
                          className={`h-8 rounded-lg transition-all cursor-pointer flex items-center justify-center font-mono ${
                            isActive
                              ? lvl <= 2
                                ? "bg-amber-600 text-white shadow-xs"
                                : "bg-[#5145cd] text-white shadow-xs"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          {lvl}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Priority Gap Banner */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="font-bold text-amber-950">
                Identified Priority Sprint Vector:
              </strong>{" "}
              {lowestDimension.dim.name} (Rated {lowestDimension.score}/5). We will prioritize{" "}
              <span className="font-bold underline decoration-amber-400">
                {lowestDimension.dim.sprintModule}
              </span>{" "}
              and assign an accredited Principal Engineer mentor for your 1:1 drill.
            </div>
          </div>
        </div>

        {/* ===================================================== */}
        {/* SECTION 4: RESUME & VERIFIED CREDENTIALS              */}
        {/* ===================================================== */}
        <div className="bg-white rounded-2xl border border-[#e7e7eb] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-2 border-b border-[#f0eded]">
            <span className="text-[11px] font-bold text-[#5145cd] uppercase tracking-wider block">
              Step 4 — Verification Credentials
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#1c1b1b] tracking-tight">
              Verified Profile Data &amp; PDF Resume
            </h2>
            <p className="text-xs text-[#66666f] mt-0.5">
              Used strictly for automated ATS score parsing and mentor pre-read materials under DPDP Act 2023.
            </p>
          </div>

          {/* Resume Upload Box */}
          {resumeUploaded && resumeFileName ? (
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#1c1b1b] truncate max-w-xs">
                      {resumeFileName}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Attached
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {resumeFileSize || "PDF Document"} • Verified for mentor pre-read &amp; ATS evaluation
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <label className="px-3 py-1.5 rounded-lg bg-white border border-[#e7e7eb] hover:bg-gray-50 text-xs font-bold text-[#1c1b1b] cursor-pointer shadow-xs transition-colors">
                  <span>Change File</span>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setResumeFileName(file.name);
                        setResumeFileSize((file.size / (1024 * 1024)).toFixed(1) + " MB");
                        setResumeUploaded(true);
                      }
                    }}
                  />
                </label>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-xl bg-[#f6f3f2] border-2 border-dashed border-[#e7e7eb] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#e7e7eb] text-gray-500 flex items-center justify-center shrink-0">
                  <UploadCloud className="w-5 h-5 text-[#5145cd]" />
                </div>
                <div>
                  <div className="font-bold text-xs text-[#1c1b1b]">
                    Attach Engineering Resume (PDF)
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Required for 1:1 mentor diagnostic evaluation and ATS keyword matching
                  </p>
                </div>
              </div>

              <label className="px-4 py-2 rounded-lg bg-[#5145cd] hover:bg-[#4035b3] text-xs font-bold text-white cursor-pointer shadow-xs transition-colors shrink-0">
                <span>Upload PDF</span>
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setResumeFileName(file.name);
                      setResumeFileSize((file.size / (1024 * 1024)).toFixed(1) + " MB");
                      setResumeUploaded(true);
                    }
                  }}
                />
              </label>
            </div>
          )}

          {/* Inputs: LinkedIn & GitHub */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1c1b1b] flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 fill-[#0a66c2]" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
                <span>LinkedIn Profile URL</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full h-10 px-3 pr-24 rounded-xl border border-[#e7e7eb] bg-white text-xs font-medium text-[#1c1b1b] focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
                />
                {linkedinUrl.trim().length > 10 && linkedinUrl.includes("linkedin.com") && (
                  <span className="absolute right-2 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Valid Link
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1c1b1b] flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 fill-[#1c1b1b]" viewBox="0 0 24 24">
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                </svg>
                <span>GitHub Engineering Profile</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full h-10 px-3 pr-24 rounded-xl border border-[#e7e7eb] bg-white text-xs font-medium text-[#1c1b1b] focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
                />
                {githubUrl.trim().length > 10 && githubUrl.includes("github.com") && (
                  <span className="absolute right-2 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Valid Link
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================== */}
        {/* SECTION 5: REAL-TIME CALIBRATED PREVIEW & UNLOCK      */}
        {/* ===================================================== */}
        <div className="bg-white rounded-2xl border border-[#e7e7eb] p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#f0eded]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#5145cd] flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#1c1b1b] tracking-tight">
                Calibrated Diagnostic Baseline
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-gray-500">
              Readiness Index v4.1
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Circular Gauge Card */}
            <div className="p-6 rounded-xl bg-[#f6f3f2] border border-[#e7e7eb] flex flex-col items-center justify-center text-center space-y-2">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <path
                    className="text-gray-200"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  {/* Foreground Animated Value */}
                  <path
                    className="text-[#5145cd] transition-all duration-700 ease-out"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray={`${calculatedScore}, 100`}
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-[#1c1b1b] font-mono tracking-tight">
                    {calculatedScore}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-gray-500 font-mono">
                    out of 100
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-[#3828b5] font-bold text-xs">
                {calculatedScore >= 80
                  ? "Tier-1 Ready"
                  : calculatedScore >= 65
                  ? "Solid Foundation"
                  : "Developing"}
              </span>
              <p className="text-[11px] text-gray-500 leading-snug">
                Estimated 6–8 weeks to achieve 90+ readiness benchmark.
              </p>
            </div>

            {/* Diagnostic Details (2 Cols) */}
            <div className="md:col-span-2 space-y-3">
              <div className="p-3.5 rounded-xl bg-[#f6f3f2] border border-[#e7e7eb] flex items-start gap-3">
                <Star className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#1c1b1b]">Top Calibrated Strength</div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    {highestDimension?.dim?.name || "Core Engineering Fundamentals"} (Rated {highestDimension?.score || 4}/5). High initial pass likelihood.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f6f3f2] border border-[#e7e7eb] flex items-start gap-3">
                <Terminal className="w-5 h-5 text-[#5145cd] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#1c1b1b]">Automated Roadmap Assignment</div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    Assigned to Primary Track:{" "}
                    <strong className="text-[#1c1b1b]">{lowestDimension?.dim?.sprintModule || "S01: ATS Diagnostic & Resume Rewrite"}</strong>.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f6f3f2] border border-[#e7e7eb] flex items-start gap-3">
                <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#1c1b1b]">Mentor Pool Availability</div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    <strong className="text-emerald-700">14 Tier-1 Verified Mentors</strong> (Google, Microsoft, Swiggy) available for immediate onboarding session dispatch.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#f0eded]">
            <button
              type="button"
              disabled={isSaving}
              onClick={handleCompleteOnboarding}
              className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer disabled:opacity-50"
            >
              ← Skip to Dashboard (Use Defaults)
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleCompleteOnboarding}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#3828b5] to-[#5145cd] hover:from-[#2e2096] hover:to-[#4337b9] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Calibrating &amp; Provisioning Dashboard...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Baseline Locked! Entering Portal...</span>
                </>
              ) : (
                <>
                  <span>Complete Setup &amp; Unlock Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="text-center pt-1">
            <p className="text-[11px] text-gray-400 font-medium flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3" />
              <span>
                Auto-saved securely • 100% compliant with Indian DPDP Act 2023 • Guaranteed zero resume broker distribution
              </span>
            </p>
          </div>
        </div>

        {/* ===================================================== */}
        {/* TRUST & SECURITY FOOTER CARDS                         */}
        {/* ===================================================== */}
        <div className="rounded-2xl bg-white border border-[#e7e7eb] p-6 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto" />
              <div className="text-xs font-bold text-[#1c1b1b]">256-Bit SSL Shield</div>
              <div className="text-[10px] text-gray-500">End-to-end encrypted telemetry</div>
            </div>
            <div className="space-y-1">
              <Lock className="w-5 h-5 text-[#5145cd] mx-auto" />
              <div className="text-xs font-bold text-[#1c1b1b]">RBI Escrow Safeguard</div>
              <div className="text-[10px] text-gray-500">Nodal account protected</div>
            </div>
            <div className="space-y-1">
              <BadgeCheck className="w-5 h-5 text-emerald-600 mx-auto" />
              <div className="text-xs font-bold text-[#1c1b1b]">DPDP Act 2023</div>
              <div className="text-[10px] text-gray-500">Zero data selling guarantee</div>
            </div>
            <div className="space-y-1">
              <RefreshCw className="w-5 h-5 text-indigo-600 mx-auto" />
              <div className="text-xs font-bold text-[#1c1b1b]">1-Hour Free Cancel</div>
              <div className="text-[10px] text-gray-500">100% instant refund SLA</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CandidateOnboardingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#faf9f8] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-[#5145cd] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold text-gray-500 font-mono">
              Loading DreamX Calibration Engine...
            </span>
          </div>
        </div>
      }
    >
      <CandidateOnboardingContent />
    </React.Suspense>
  );
}
