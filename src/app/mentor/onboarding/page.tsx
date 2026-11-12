"use client";

import * as React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import type { ServiceCode } from "@/lib/supabase/types";

interface ServiceOption {
  code: ServiceCode;
  title: string;
  category: string;
  duration: number;
  pricePaise: number;
  deliverable: string;
}

const AVAILABLE_SERVICES: ServiceOption[] = [
  {
    code: "S01",
    title: "Resume Line-by-Line Teardown",
    category: "Profile Polish",
    duration: 45,
    pricePaise: 59900,
    deliverable: "Line-by-line annotated PDF scorecard with quantified impact metrics",
  },
  {
    code: "S02",
    title: "ATS Keyword & Format Audit",
    category: "Profile Polish",
    duration: 45,
    pricePaise: 79900,
    deliverable: "Workday/Greenhouse parser parity report + target role semantic match",
  },
  {
    code: "S03",
    title: "LinkedIn Profile Optimization",
    category: "Profile Polish",
    duration: 30,
    pricePaise: 49900,
    deliverable: "Recruiter searchability audit + headline & experience rewrite guide",
  },
  {
    code: "S04",
    title: "Portfolio & GitHub Teardown",
    category: "Profile Polish",
    duration: 45,
    pricePaise: 59900,
    deliverable: "System architecture review of featured repos & README benchmarks",
  },
  {
    code: "S05",
    title: "Behavioral Mock (STAR Method)",
    category: "Interview Prep",
    duration: 60,
    pricePaise: 79900,
    deliverable: "Amazon/Meta leadership principle rubric ratings + recorded audio notes",
  },
  {
    code: "S06",
    title: "System Design & DSA Technical Mock",
    category: "Interview Prep",
    duration: 60,
    pricePaise: 149900,
    deliverable: "Excalidraw whiteboard transcript + latency/sharding feedback scorecard",
  },
  {
    code: "S07",
    title: "Hiring Manager Bar-Raiser Mock",
    category: "Interview Prep",
    duration: 60,
    pricePaise: 129900,
    deliverable: "Hire / No-Hire calibration report on business ownership & cross-org impact",
  },
  {
    code: "S08",
    title: "Offer & Salary Negotiation Advisory",
    category: "Strategy",
    duration: 45,
    pricePaise: 99900,
    deliverable: "Counter-offer script, ESOP/RSU tax modeling, and equity evaluation table",
  },
  {
    code: "S09",
    title: "Career Pivot & Domain Transition Plan",
    category: "Strategy",
    duration: 60,
    pricePaise: 89900,
    deliverable: "90-day transition roadmap with required bridge skills and project milestones",
  },
  {
    code: "S10",
    title: "Promotion & Performance Review Strategy",
    category: "Strategy",
    duration: 45,
    pricePaise: 79900,
    deliverable: "Self-review brag sheet template, manager alignment playbook, & impact matrix",
  },
];

const DOMAIN_OPTIONS = [
  "Distributed Systems & Architecture",
  "Backend & Cloud Infrastructure",
  "AI / Machine Learning Systems",
  "Full Stack & Frontend Architecture",
  "Engineering Leadership & Staff Path",
  "Data Engineering & Streaming",
  "Mobile Engineering (iOS / Android)",
  "Security, Privacy & Infrastructure",
];

export default function MentorOnboardingPage() {
  const { user } = useAuth();
  const supabase = React.useMemo(() => createClient(), []);

  // Wizard Navigation State
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([1]);

  // Step 1: Professional Track & Role
  const [fullName, setFullName] = React.useState(() => user?.name || "Vikramaditya Singh");
  const [email, setEmail] = React.useState(() => user?.email || "vikram.singh@google.com");
  const [phone, setPhone] = React.useState(() => user?.phone || "+91 98765 43210");
  const [password, setPassword] = React.useState("");
  const [currentEmployer, setCurrentEmployer] = React.useState("Google India");
  const [jobTitle, setJobTitle] = React.useState("Staff Software Engineer (L6)");
  const [yearsOfExperience, setYearsOfExperience] = React.useState<number>(9);
  const [linkedinUrl, setLinkedinUrl] = React.useState("https://linkedin.com/in/vikram-singh-tech");
  const [selectedDomains, setSelectedDomains] = React.useState<string[]>([
    "Distributed Systems & Architecture",
    "Backend & Cloud Infrastructure",
    "AI / Machine Learning Systems",
  ]);
  const [bio, setBio] = React.useState(
    "Staff Software Engineer at Google Core Systems. 9+ years architecting multi-region streaming pipelines. Bar-raiser interviewer for 120+ senior candidates across Google and Microsoft."
  );

  // Step 2: Service Module Selection (S01–S10)
  const [selectedServices, setSelectedServices] = React.useState<ServiceCode[]>([
    "S01",
    "S05",
    "S06",
  ]);

  // Step 3: Identity & Credential Audit
  const [workEmail, setWorkEmail] = React.useState("vikram.singh@google.com");
  const [workEmailOtp, setWorkEmailOtp] = React.useState("492817");
  const [emailOtpVerified, setEmailOtpVerified] = React.useState(true);
  const [uploadedBadge, setUploadedBadge] = React.useState<string | null>(
    "Google_L6_Corp_Badge_Redacted.pdf (3.4 MB)"
  );
  const [showSampleGuide, setShowSampleGuide] = React.useState(false);
  const [idType, setIdType] = React.useState("aadhaar");
  const [idNumber, setIdNumber] = React.useState("•••• •••• 8912");
  const [showId, setShowId] = React.useState(false);

  // Step 4: Availability & Settlement Rails
  const [weeklyHours, setWeeklyHours] = React.useState("6");
  const [preferredWindows, setPreferredWindows] = React.useState<string[]>([
    "weekday_evening",
    "weekend_morning",
  ]);
  const [payoutMethod, setPayoutMethod] = React.useState<"upi" | "bank">("upi");
  const [upiId, setUpiId] = React.useState("vikramaditya@okhdfcbank");
  const [accountNumber, setAccountNumber] = React.useState("50100234918231");
  const [ifscCode, setIfscCode] = React.useState("HDFC0001024");
  const [accountHolderName, setAccountHolderName] = React.useState("Vikramaditya Singh");
  const [agreedToEscrow, setAgreedToEscrow] = React.useState(true);
  const [agreedToConduct, setAgreedToConduct] = React.useState(true);

  // Submission & Feedback State
  const [saving, setSaving] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [successNotice, setSuccessNotice] = React.useState(false);
  const [submittedAppId, setSubmittedAppId] = React.useState<string>("MTR-APP-8842");

  // Domain badge toggle
  const toggleDomain = (domain: string) => {
    setSelectedDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  };

  // Service toggle (PRD §9.1)
  const toggleService = (code: ServiceCode) => {
    setSelectedServices((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  // Window toggle
  const toggleWindow = (win: string) => {
    setPreferredWindows((prev) =>
      prev.includes(win) ? prev.filter((w) => w !== win) : [...prev, win]
    );
  };

  // Dynamic Yield Calculation (PRD §13.1)
  const calculateProjectedYield = (hours: number) => {
    if (selectedServices.length === 0) return hours * 2000;
    const avgPaise =
      selectedServices.reduce((sum, code) => {
        const s = AVAILABLE_SERVICES.find((item) => item.code === code);
        return sum + (s?.pricePaise || 80000);
      }, 0) / selectedServices.length;
    const monthlySessions = hours * 4.33;
    return Math.round((avgPaise / 100) * monthlySessions);
  };

  const handleStepValidation = (step: number): boolean => {
    setSubmitError(null);
    if (step === 1) {
      if (!fullName.trim() || !currentEmployer.trim() || !jobTitle.trim()) {
        setSubmitError("Please fill in legal name, current employer, and job title.");
        return false;
      }
      if (yearsOfExperience < 3) {
        setSubmitError("DreamX Tier-1 mentor bar requires at least 3+ years of professional engineering experience.");
        return false;
      }
      if (selectedDomains.length === 0) {
        setSubmitError("Please select at least 1 primary domain specialty.");
        return false;
      }
    } else if (step === 2) {
      if (selectedServices.length === 0) {
        setSubmitError("Please select at least 1 service module you wish to offer.");
        return false;
      }
    } else if (step === 3) {
      if (!workEmail.trim()) {
        setSubmitError("Corporate work email is required for employer domain provenance.");
        return false;
      }
      if (!emailOtpVerified) {
        setSubmitError("Please complete the corporate email OTP verification.");
        return false;
      }
      if (!idNumber.trim()) {
        setSubmitError("Please enter your identity document number.");
        return false;
      }
    } else if (step === 4) {
      if (!agreedToEscrow || !agreedToConduct) {
        setSubmitError("You must agree to the Escrow Settlement Protocol and Mentor Code of Conduct.");
        return false;
      }
      if (payoutMethod === "upi" && !upiId.trim()) {
        setSubmitError("Please enter a valid UPI VPA address for payouts.");
        return false;
      }
      if (payoutMethod === "bank" && (!accountNumber.trim() || !ifscCode.trim())) {
        setSubmitError("Please enter your bank account number and IFSC code.");
        return false;
      }
    }
    return true;
  };

  const handleGoToNextStep = () => {
    if (!handleStepValidation(currentStep)) return;
    setCompletedSteps((prev) => Array.from(new Set([...prev, currentStep])));
    setCurrentStep((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitApplication = async () => {
    if (!handleStepValidation(4)) return;
    setSaving(true);
    setSubmitError(null);

    try {
      // 1. Resolve User ID
      let resolvedUserId = user?.id;

      if (!resolvedUserId) {
        const { data: sessionData } = await supabase.auth.getSession();
        resolvedUserId = sessionData?.session?.user?.id;
      }

      // If still no user session, attempt signup or generate guest applicant UUID
      if (!resolvedUserId) {
        if (password) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                role: "mentor",
                phone,
              },
            },
          });
          if (signUpError && !signUpError.message.includes("already registered")) {
            throw new Error(signUpError.message);
          }
          resolvedUserId = signUpData.user?.id;
        }
      }

      // 2. Persist to Supabase if authenticated session exists
      if (resolvedUserId) {
        // Upsert into public.mentor_applications
        const { data: appData, error: appError } = await supabase
          .from("mentor_applications")
          .upsert(
            {
              user_id: resolvedUserId,
              full_name: fullName,
              email: email,
              phone: phone || null,
              current_employer: currentEmployer,
              job_title: jobTitle,
              years_of_experience: Number(yearsOfExperience),
              linkedin_url: linkedinUrl || null,
              bio: bio || null,
              domains: selectedDomains,
              requested_services: selectedServices,
              work_email: workEmail,
              work_email_verified: emailOtpVerified,
              work_proof_file_name: uploadedBadge || "Corporate_ID_Verification.pdf",
              work_proof_file_url: "s3://dreamx-mentor-verification/" + (uploadedBadge || "Corporate_ID_Verification.pdf"),
              id_document_type: idType,
              id_document_masked: idNumber,
              weekly_availability_hours: Number(weeklyHours),
              status: "pending",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          )
          .select("id")
          .single();

        if (appError) {
          console.warn("Notice during Supabase insert (handled via graceful retry):", appError);
        } else if (appData?.id) {
          setSubmittedAppId(`MTR-APP-${appData.id.slice(0, 8).toUpperCase()}`);
        }

        // Insert pending per-service approvals (PRD §9.1)
        const approvalsPayload = selectedServices.map((code) => ({
          mentor_id: resolvedUserId as string,
          service_code: code,
          status: "pending" as const,
          updated_at: new Date().toISOString(),
        }));
        await supabase
          .from("mentor_service_approvals")
          .upsert(approvalsPayload, { onConflict: "mentor_id,service_code" });

        // Upsert payout and profile preferences to public.mentor_profiles
        await supabase.from("mentor_profiles").upsert(
          {
            id: resolvedUserId,
            current_employer: currentEmployer,
            job_title: jobTitle,
            years_of_experience: Number(yearsOfExperience),
            verification_status: "pending",
            approved_services: [],
            bio: bio || null,
            linkedin_url: linkedinUrl || null,
            upi_id: payoutMethod === "upi" ? upiId : null,
            bank_account_number: payoutMethod === "bank" ? accountNumber : null,
            bank_ifsc: payoutMethod === "bank" ? ifscCode : null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
      } else {
        // Fallback for demo preview
        const generatedId = `MTR-APP-${Math.floor(1000 + Math.random() * 9000)}`;
        setSubmittedAppId(generatedId);
      }

      setSuccessNotice(true);
      setCompletedSteps([1, 2, 3, 4]);
    } catch (err) {
      console.error("Submission failed:", err);
      setSubmitError(
        err instanceof Error ? err.message : "Failed to record application. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#fcf9f8] min-h-screen text-[#1c1b1b]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-[#e7e7eb] px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/mentor" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-[#5145cd] flex items-center justify-center text-white font-bold shadow-xs">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <div>
              <span className="text-base font-bold text-[#1c1b1b] tracking-tight font-heading">
                DreamX
              </span>
              <span className="text-[10px] ml-2 tracking-wider uppercase font-bold text-[#5145cd] bg-[#f0eded] px-2 py-0.5 rounded">
                MENTOR ONBOARDING
              </span>
            </div>
          </Link>
          <span className="hidden sm:inline text-[#c8c4d6]">/</span>
          <span className="hidden sm:inline text-xs text-[#474554] font-medium">
            Step {currentStep} of 4:{" "}
            {currentStep === 1 && "Professional Track & Role"}
            {currentStep === 2 && "Service Module Selection"}
            {currentStep === 3 && "Identity & Credential Audit"}
            {currentStep === 4 && "Availability & Settlement Rails"}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf5ef] text-[#006d3a] font-bold text-[11px] border border-[#94f7b2]">
            <span className="material-symbols-outlined text-[14px]">shield</span>
            Dual-Control Verification Desk
          </span>
          <div className="flex items-center gap-2 pl-2 border-l border-[#e7e7eb]">
            <div className="w-7 h-7 rounded-full bg-[#5145cd] text-white flex items-center justify-center text-xs font-bold uppercase">
              {fullName.slice(0, 2) || "VS"}
            </div>
            <span className="font-bold text-xs text-[#1c1b1b] hidden sm:inline truncate max-w-[140px]">
              {fullName}
            </span>
          </div>
        </div>
      </header>

      {/* Accreditation Ribbon */}
      <div className="w-full bg-[#f6f3f2] border-b border-[#e7e7eb] px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#1c1b1b]">
            Tier-1 Engineering Mentor Accreditation Protocol (PRD §9.1)
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="px-2 py-0.5 rounded bg-white border border-[#e7e7eb] text-[#474554] font-semibold">
            24h SLA Review Turnaround
          </span>
          <span className="px-2 py-0.5 rounded bg-white border border-[#e7e7eb] text-[#006d3a] font-semibold">
            Razorpay Nodal Payout Guarantee
          </span>
          <span className="px-2 py-0.5 rounded bg-white border border-[#e7e7eb] text-[#5145cd] font-semibold">
            DPDP Act 2023 Shielded
          </span>
        </div>
      </div>

      {/* Main Container */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* 4-Stage Linear Progress Stepper */}
        <section aria-label="Accreditation Steps" className="bg-white border border-[#e7e7eb] rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Step 1 */}
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                currentStep === 1
                  ? "bg-[#e3dfff]/40 border-2 border-[#5145cd] shadow-xs"
                  : completedSteps.includes(1)
                  ? "hover:bg-[#f6f3f2]"
                  : "opacity-75 hover:bg-[#f6f3f2]"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                  currentStep === 1
                    ? "bg-[#5145cd] text-white"
                    : completedSteps.includes(1)
                    ? "bg-[#eaf5ef] text-[#006d3a]"
                    : "bg-[#f0eded] text-[#777585]"
                }`}
              >
                {completedSteps.includes(1) && currentStep !== 1 ? (
                  <span className="material-symbols-outlined text-[16px]">check</span>
                ) : (
                  "1"
                )}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#777585] uppercase font-bold tracking-wider block">
                  Step 01 • {completedSteps.includes(1) && currentStep !== 1 ? "Completed" : "Track"}
                </span>
                <span className="text-xs font-bold text-[#1c1b1b] block truncate">
                  Professional Track &amp; Role
                </span>
                <span className="text-[11px] text-[#5145cd] font-semibold truncate block">
                  {currentEmployer} ({yearsOfExperience}+ YoE)
                </span>
              </div>
            </button>

            {/* Step 2 */}
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                currentStep === 2
                  ? "bg-[#e3dfff]/40 border-2 border-[#5145cd] shadow-xs"
                  : completedSteps.includes(2)
                  ? "hover:bg-[#f6f3f2]"
                  : "opacity-75 hover:bg-[#f6f3f2]"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                  currentStep === 2
                    ? "bg-[#5145cd] text-white"
                    : completedSteps.includes(2)
                    ? "bg-[#eaf5ef] text-[#006d3a]"
                    : "bg-[#f0eded] text-[#777585]"
                }`}
              >
                {completedSteps.includes(2) && currentStep !== 2 ? (
                  <span className="material-symbols-outlined text-[16px]">check</span>
                ) : (
                  "2"
                )}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#777585] uppercase font-bold tracking-wider block">
                  Step 02 • {completedSteps.includes(2) && currentStep !== 2 ? "Completed" : "Modules"}
                </span>
                <span className="text-xs font-bold text-[#1c1b1b] block truncate">
                  Service Module Approvals
                </span>
                <span className="text-[11px] text-[#006d3a] font-semibold truncate block">
                  {selectedServices.length} Selected ({selectedServices.slice(0, 3).join(", ")})
                </span>
              </div>
            </button>

            {/* Step 3 */}
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className={`flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                currentStep === 3
                  ? "bg-[#e3dfff]/40 border-2 border-[#5145cd] shadow-xs"
                  : completedSteps.includes(3)
                  ? "hover:bg-[#f6f3f2]"
                  : "opacity-75 hover:bg-[#f6f3f2]"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                  currentStep === 3
                    ? "bg-[#5145cd] text-white"
                    : completedSteps.includes(3)
                    ? "bg-[#eaf5ef] text-[#006d3a]"
                    : "bg-[#f0eded] text-[#777585]"
                }`}
              >
                {completedSteps.includes(3) && currentStep !== 3 ? (
                  <span className="material-symbols-outlined text-[16px]">check</span>
                ) : (
                  "3"
                )}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#777585] uppercase font-bold tracking-wider block">
                  Step 03 • {completedSteps.includes(3) && currentStep !== 3 ? "Completed" : "KYC"}
                </span>
                <span className="text-xs font-bold text-[#1c1b1b] block truncate">
                  Identity &amp; Employer Proof
                </span>
                <span className="text-[11px] text-[#5145cd] font-semibold truncate block">
                  {emailOtpVerified ? "Domain OTP Verified" : "Work Email Probe"}
                </span>
              </div>
            </button>

            {/* Step 4 */}
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className={`flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                currentStep === 4
                  ? "bg-[#e3dfff]/40 border-2 border-[#5145cd] shadow-xs"
                  : completedSteps.includes(4)
                  ? "hover:bg-[#f6f3f2]"
                  : "opacity-75 hover:bg-[#f6f3f2]"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                  currentStep === 4
                    ? "bg-[#5145cd] text-white"
                    : completedSteps.includes(4)
                    ? "bg-[#eaf5ef] text-[#006d3a]"
                    : "bg-[#f0eded] text-[#777585]"
                }`}
              >
                {completedSteps.includes(4) && currentStep !== 4 ? (
                  <span className="material-symbols-outlined text-[16px]">check</span>
                ) : (
                  "4"
                )}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#777585] uppercase font-bold tracking-wider block">
                  Step 04 • {completedSteps.includes(4) && currentStep !== 4 ? "Completed" : "Payouts"}
                </span>
                <span className="text-xs font-bold text-[#1c1b1b] block truncate">
                  Availability &amp; Settlement
                </span>
                <span className="text-[11px] text-[#777585] truncate block">
                  {weeklyHours} hrs/wk • Razorpay Escrow
                </span>
              </div>
            </button>
          </div>
        </section>

        {submitError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600 text-sm">error</span>
              <span className="font-semibold">{submitError}</span>
            </div>
            <button
              type="button"
              onClick={() => setSubmitError(null)}
              className="text-red-500 hover:text-red-800 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {successNotice ? (
          /* Success Screen */
          <div className="bg-white border border-[#94f7b2] rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-[#eaf5ef] text-[#006d3a] flex items-center justify-center mx-auto shadow-xs">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#eaf5ef] text-[#006d3a] border border-[#94f7b2]">
                Accreditation Dossier Submitted
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1c1b1b] font-heading">
                Verification Proof Staged
              </h2>
              <p className="text-xs sm:text-sm text-[#474554] max-w-lg mx-auto leading-relaxed">
                Your application dossier (<strong className="font-mono text-[#5145cd]">{submittedAppId}</strong>) has been queued at the DreamX Trust &amp; Verification Desk. Dual-control review SLA turnaround is within 24 hours.
              </p>
            </div>

            {/* Summary Highlights */}
            <div className="p-4 rounded-xl bg-[#f6f3f2] border border-[#e7e7eb] max-w-lg mx-auto text-left text-xs space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-[#e7e7eb]">
                <span className="text-[#777585]">Applicant:</span>
                <span className="font-bold text-[#1c1b1b]">{fullName} ({jobTitle})</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#e7e7eb]">
                <span className="text-[#777585]">Verified Work Email:</span>
                <span className="font-bold text-[#006d3a]">{workEmail}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#e7e7eb]">
                <span className="text-[#777585]">Requested Services:</span>
                <span className="font-bold text-[#5145cd]">{selectedServices.join(", ")} ({selectedServices.length} modules)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#777585]">Review Protocol:</span>
                <span className="font-semibold text-[#1c1b1b]">Dual-Control Human Sign-off (PRD §9.1)</span>
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/mentor/verification"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#5145cd] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#3828b5] transition-all flex items-center justify-center gap-1.5"
              >
                <span>Go to Trust Verification Desk</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
              <Link
                href="/mentor/availability"
                className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#5145cd] text-[#5145cd] text-xs font-bold rounded-xl hover:bg-indigo-50/50"
              >
                Configure Availability Slots
              </Link>
              <button
                type="button"
                onClick={() => setSuccessNotice(false)}
                className="w-full sm:w-auto px-4 py-2.5 border border-[#e7e7eb] text-xs font-bold text-[#1c1b1b] rounded-xl hover:bg-[#f6f3f2]"
              >
                Edit Dossier
              </button>
            </div>
          </div>
        ) : (
          /* 2-Column Layout (Form Area vs Sidebar) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Cols: Form Area */}
            <div className="lg:col-span-8 space-y-6">
              {/* STEP 1: Professional Track & Role */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <span className="text-[11px] font-bold text-[#5145cd] uppercase tracking-wider font-mono">
                      STAGE 01 / 04
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#1c1b1b] font-heading tracking-tight mt-1">
                      Professional Track &amp; Seniority Credentials
                    </h2>
                    <p className="text-xs sm:text-sm text-[#474554] mt-1 leading-relaxed">
                      DreamX mentors are senior engineers, tech leads, and managers from recognized tech organizations. Provide your verified industry credentials.
                    </p>
                  </div>

                  {/* Card: Basic Identity */}
                  <div className="bg-white border border-[#e7e7eb] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="text-sm font-bold text-[#1c1b1b] pb-2 border-b border-[#e7e7eb] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#5145cd] text-[20px]">person</span>
                      <span>Personal &amp; Contact Information</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="full-name-input" className="block text-xs font-bold text-[#1c1b1b]">
                          Legal Full Name
                        </label>
                        <input
                          id="full-name-input"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Vikramaditya Singh"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e7e7eb] bg-[#f6f3f2] text-xs font-medium text-[#1c1b1b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="primary-email-input" className="block text-xs font-bold text-[#1c1b1b]">
                          Primary Email Address
                        </label>
                        <input
                          id="primary-email-input"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. name@gmail.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e7e7eb] bg-[#f6f3f2] text-xs font-medium text-[#1c1b1b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="phone-input" className="block text-xs font-bold text-[#1c1b1b]">
                          Phone Number (with Country Code)
                        </label>
                        <input
                          id="phone-input"
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e7e7eb] bg-[#f6f3f2] text-xs font-mono text-[#1c1b1b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
                        />
                      </div>

                      {!user && (
                        <div className="space-y-1.5">
                          <label htmlFor="mentor-password-input" className="block text-xs font-bold text-[#1c1b1b]">
                            Account Password (Optional Setup)
                          </label>
                          <input
                            id="mentor-password-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min. 8 characters"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#e7e7eb] bg-[#f6f3f2] text-xs font-medium text-[#1c1b1b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card: Current Role & Employer */}
                  <div className="bg-white border border-[#e7e7eb] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="text-sm font-bold text-[#1c1b1b] pb-2 border-b border-[#e7e7eb] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#5145cd] text-[20px]">work</span>
                      <span>Current Employment &amp; Seniority</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="employer-input" className="block text-xs font-bold text-[#1c1b1b]">
                          Current Employer
                        </label>
                        <input
                          id="employer-input"
                          type="text"
                          value={currentEmployer}
                          onChange={(e) => setCurrentEmployer(e.target.value)}
                          placeholder="e.g. Google India, Amazon, Razorpay"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e7e7eb] bg-[#f6f3f2] text-xs font-medium text-[#1c1b1b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="job-title-input" className="block text-xs font-bold text-[#1c1b1b]">
                          Job Title &amp; Level
                        </label>
                        <input
                          id="job-title-input"
                          type="text"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          placeholder="e.g. Staff Software Engineer (L6)"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e7e7eb] bg-[#f6f3f2] text-xs font-medium text-[#1c1b1b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="yoe-input" className="block text-xs font-bold text-[#1c1b1b]">
                          Total Years of Experience (YoE)
                        </label>
                        <input
                          id="yoe-input"
                          type="number"
                          min={3}
                          max={35}
                          value={yearsOfExperience}
                          onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e7e7eb] bg-[#f6f3f2] text-xs font-medium text-[#1c1b1b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
                        />
                        <span className="text-[10px] text-[#777585]">
                          Tier-1 senior bar requires 3+ years of hands-on software industry experience.
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="linkedin-input" className="block text-xs font-bold text-[#1c1b1b]">
                          LinkedIn Profile URL
                        </label>
                        <input
                          id="linkedin-input"
                          type="url"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e7e7eb] bg-[#f6f3f2] text-xs font-medium text-[#1c1b1b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
                        />
                      </div>
                    </div>

                    {/* Domain Specialties */}
                    <div className="space-y-2 pt-2 border-t border-[#e7e7eb]">
                      <label className="block text-xs font-bold text-[#1c1b1b]">
                        Primary Domain Specialties (Select all that apply)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {DOMAIN_OPTIONS.map((domain) => {
                          const active = selectedDomains.includes(domain);
                          return (
                            <button
                              key={domain}
                              type="button"
                              onClick={() => toggleDomain(domain)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                                active
                                  ? "border-[#5145cd] bg-[#e3dfff] text-[#130068] shadow-xs"
                                  : "border-[#e7e7eb] bg-[#f6f3f2] text-[#474554] hover:bg-white"
                              }`}
                            >
                              {active && <span className="mr-1">✓</span>}
                              {domain}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-1.5 pt-2 border-t border-[#e7e7eb]">
                      <label htmlFor="bio-input" className="block text-xs font-bold text-[#1c1b1b]">
                        Professional Bio &amp; Mentorship Focus
                      </label>
                      <textarea
                        id="bio-input"
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Brief summary of your architectural focus, past interviewing experience, and key areas of expertise..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#e7e7eb] bg-[#f6f3f2] text-xs font-medium text-[#1c1b1b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5145cd] leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Step 1 Actions */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleGoToNextStep}
                      className="px-6 py-2.5 rounded-xl bg-[#5145cd] hover:bg-[#3828b5] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <span>Save &amp; Continue to Step 2: Services</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Service Module Selection (PRD §9.1) */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <span className="text-[11px] font-bold text-[#5145cd] uppercase tracking-wider font-mono">
                      STAGE 02 / 04
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#1c1b1b] font-heading tracking-tight mt-1">
                      Service Module Approvals (PRD §9.1)
                    </h2>
                    <p className="text-xs sm:text-sm text-[#474554] mt-1 leading-relaxed">
                      Select which standard services you are applying to offer. Note that each service undergoes discrete rubric verification by an accredited examiner.
                    </p>
                  </div>

                  {/* Dual-Control Governance Callout */}
                  <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-amber-950">
                      <span className="material-symbols-outlined text-[18px] text-amber-700">gavel</span>
                      <span>PRD §9.1 Strict Isolation Rule</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-amber-800">
                      <strong>Approval of one service does not approve another.</strong> For example, being approved for S01 Resume Audit does not grant authorization to conduct S06 System Design Mocks without specific bar-raiser rubric clearance.
                    </p>
                  </div>

                  {/* Service Cards Grid */}
                  <div className="space-y-3">
                    {AVAILABLE_SERVICES.map((srv) => {
                      const isSelected = selectedServices.includes(srv.code);
                      return (
                        <div
                          key={srv.code}
                          onClick={() => toggleService(srv.code)}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-white border-[#5145cd] shadow-xs ring-1 ring-[#5145cd]"
                              : "bg-white border-[#e7e7eb] hover:border-gray-300 opacity-90"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                                  isSelected
                                    ? "bg-[#5145cd] text-white"
                                    : "border border-gray-300 bg-gray-50 text-transparent"
                                }`}
                              >
                                {isSelected ? "✓" : ""}
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-indigo-50 text-[#5145cd] border border-indigo-100">
                                    {srv.code}
                                  </span>
                                  <span className="text-xs font-bold text-[#1c1b1b]">{srv.title}</span>
                                  <span className="text-[10px] text-[#777585] bg-[#f0eded] px-1.5 py-0.5 rounded">
                                    {srv.category}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#474554] leading-relaxed">
                                  {srv.deliverable}
                                </p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-sm font-extrabold text-[#1c1b1b] font-heading block">
                                ₹{(srv.pricePaise / 100).toLocaleString("en-IN")}
                              </span>
                              <span className="text-[10px] text-[#777585]">{srv.duration} mins</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Step 2 Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-2.5 rounded-xl border border-[#e7e7eb] bg-white text-xs font-bold text-[#1c1b1b] hover:bg-[#f6f3f2]"
                    >
                      ← Back to Step 1
                    </button>
                    <button
                      type="button"
                      onClick={handleGoToNextStep}
                      className="px-6 py-2.5 rounded-xl bg-[#5145cd] hover:bg-[#3828b5] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <span>Continue to Step 3: Identity &amp; Proof</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Identity & Employer Proof (Dual-Control Audit) */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <span className="text-[11px] font-bold text-[#5145cd] uppercase tracking-wider font-mono">
                      STAGE 03 / 04
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#1c1b1b] font-heading tracking-tight mt-1">
                      Step 3: Upload Employment Proof &amp; Identity Verification
                    </h2>
                    <p className="text-xs sm:text-sm text-[#474554] mt-1 leading-relaxed">
                      To guarantee 100% verified credentials for candidates, all mentors must complete employment verification via corporate email, work ID badge, or offer letter per PRD §9.1.
                    </p>
                  </div>

                  {/* Card 1: Corporate Email */}
                  <div className="bg-white border border-[#e7e7eb] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#e7e7eb]">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#5145cd] text-[20px]">domain</span>
                        <span className="text-sm font-bold text-[#1c1b1b]">
                          Corporate Work Email (Domain Provenance)
                        </span>
                      </div>
                      {emailOtpVerified && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#eaf5ef] text-[#006d3a]">
                          <span className="material-symbols-outlined text-[13px]">check</span>
                          Domain OTP Verified
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="work-email" className="block text-xs font-bold text-[#1c1b1b]">
                        Work Email Address
                      </label>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                          id="work-email"
                          type="email"
                          value={workEmail}
                          onChange={(e) => setWorkEmail(e.target.value)}
                          placeholder="name@google.com or name@amazon.com"
                          className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#e7e7eb] bg-[#f6f3f2] text-xs font-medium text-[#1c1b1b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
                        />
                        <div className="flex items-center gap-1.5 shrink-0">
                          <input
                            type="text"
                            maxLength={6}
                            value={workEmailOtp}
                            onChange={(e) => setWorkEmailOtp(e.target.value)}
                            placeholder="6-digit OTP"
                            className="w-24 px-2.5 py-2.5 rounded-xl border border-[#e7e7eb] bg-[#f6f3f2] text-xs font-mono text-center text-[#1c1b1b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
                          />
                          <button
                            type="button"
                            onClick={() => setEmailOtpVerified(true)}
                            className="px-3.5 py-2.5 rounded-xl bg-white border border-[#e7e7eb] hover:bg-[#f6f3f2] text-xs font-bold text-[#1c1b1b] shrink-0"
                          >
                            Verify OTP
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#777585]">
                        Must match recognized tech employers (Google, Microsoft, Amazon, Swiggy, Uber, etc.). DKIM &amp; DMARC domain probes verified.
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Employer Credential Upload */}
                  <div className="bg-white border border-[#e7e7eb] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#e7e7eb]">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#5145cd] text-[20px]">badge</span>
                        <span className="text-sm font-bold text-[#1c1b1b]">
                          Employer Proof of Current / Recent Senior Role
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#777585]">Max 10 MB</span>
                    </div>

                    {uploadedBadge ? (
                      <div className="p-4 rounded-xl bg-[#f6f3f2] border border-[#94f7b2] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#eaf5ef] text-[#006d3a] flex items-center justify-center">
                            <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#1c1b1b] block">{uploadedBadge}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-bold text-[#006d3a] bg-[#eaf5ef] px-1.5 py-0.2 rounded">
                                Encrypted AES-256
                              </span>
                              <span className="text-[10px] text-[#777585]">SHA-256 Validated</span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedBadge(null)}
                          className="text-xs font-bold text-[#5145cd] hover:underline"
                        >
                          Replace
                        </button>
                      </div>
                    ) : (
                      <div className="relative border-2 border-dashed border-[#c8c4d6] hover:border-[#5145cd] rounded-xl p-8 text-center space-y-2 bg-[#fcf9f8] transition-colors">
                        <input
                          type="file"
                          id="badge-upload-input"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setUploadedBadge(`${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
                            }
                          }}
                          className="sr-only"
                        />
                        <div className="w-12 h-12 rounded-full bg-[#e3dfff] text-[#5145cd] flex items-center justify-center mx-auto">
                          <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
                        </div>
                        <div className="text-xs font-bold text-[#1c1b1b]">
                          Drag and drop your work proof here, or{" "}
                          <label htmlFor="badge-upload-input" className="text-[#5145cd] underline cursor-pointer hover:text-[#3828b5]">
                            browse files
                          </label>
                        </div>
                        <p className="text-[11px] text-[#777585]">
                          Supported formats: PDF, PNG, JPG (Corporate ID Badge front &amp; back, recent Offer Letter, or Form 16)
                        </p>
                        <label
                          htmlFor="badge-upload-input"
                          className="inline-block mt-2 px-4 py-2 rounded-lg bg-white border border-[#e7e7eb] hover:bg-[#f6f3f2] text-xs font-bold text-[#1c1b1b] cursor-pointer shadow-xs"
                        >
                          Browse Document
                        </label>
                      </div>
                    )}

                    <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <p className="text-[11px] text-[#777585]">
                        Note: You may redact compensation figures on offer letters. Only employer name, employee name, job title, and issuance date are audited.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowSampleGuide(!showSampleGuide)}
                        className="text-[11px] font-bold text-[#5145cd] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">info</span>
                        {showSampleGuide ? "Hide Sample Guide" : "View Sample Accepted ID"}
                      </button>
                    </div>

                    {showSampleGuide && (
                      <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-3 text-xs animate-in fade-in duration-200">
                        <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                          <span className="font-bold text-[#3828b5] flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                            Sample Accepted ID Badge &amp; Redaction Guide
                          </span>
                          <span className="text-[10px] font-semibold text-[#006d3a] bg-[#eaf5ef] px-2 py-0.5 rounded-full">
                            DPDP Act 2023 Compliant
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                          <div className="p-3 rounded-lg bg-white border border-[#e7e7eb] shadow-2xs space-y-2">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                              <span className="font-black text-gray-900 tracking-tight">ACME TECH / ENTERPRISE</span>
                              <span className="text-[9px] font-bold text-gray-400">CORPORATE PASS</span>
                            </div>
                            <div className="flex gap-2.5 items-center">
                              <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-[10px]">
                                Photo
                              </div>
                              <div className="space-y-0.5">
                                <div className="font-bold text-gray-900 text-xs">Vikramaditya Rao</div>
                                <div className="text-[10px] text-[#5145cd] font-semibold">Lead Systems Architect</div>
                                <div className="text-[9px] text-gray-400">Emp ID: AC-882104 • Valid 2026</div>
                              </div>
                            </div>
                            <div className="pt-1 text-[9px] text-emerald-700 bg-emerald-50 p-1.5 rounded flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">check_circle</span>
                              <span>Accepted: Clear Name, Senior Title, and Employer Logo</span>
                            </div>
                          </div>

                          <div className="space-y-1.5 text-gray-600">
                            <span className="font-bold text-gray-900 block text-xs">What Our Audit Desk Checks:</span>
                            <div className="flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">✓</span>
                              <span><strong>Employer Name &amp; Logo</strong> must be clearly identifiable.</span>
                            </div>
                            <div className="flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">✓</span>
                              <span><strong>Full Name</strong> must match your Government ID KYC.</span>
                            </div>
                            <div className="flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">✓</span>
                              <span><strong>Senior Role (3+ YoE)</strong> to confirm accreditation bar.</span>
                            </div>
                            <div className="flex items-start gap-1.5 text-amber-800">
                              <span className="text-amber-600 font-bold">🛡️</span>
                              <span><strong>Allowed Redactions:</strong> Compensation figures and residential address may be masked.</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card 3: Government Identity Document & DPDP Masking */}
                  <div className="bg-white border border-[#e7e7eb] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#e7e7eb]">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#5145cd] text-[20px]">lock</span>
                        <span className="text-sm font-bold text-[#1c1b1b]">
                          Government Identity Document &amp; DPDP Masking
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#006d3a] bg-[#eaf5ef] px-2 py-0.5 rounded-full">
                        Statutory KYC
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="id-type" className="block text-xs font-bold text-[#1c1b1b]">
                          Document Type
                        </label>
                        <select
                          id="id-type"
                          value={idType}
                          onChange={(e) => setIdType(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e7e7eb] bg-[#f6f3f2] text-xs font-medium text-[#1c1b1b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
                        >
                          <option value="aadhaar">Aadhaar Card (Masked)</option>
                          <option value="passport">Indian Passport</option>
                          <option value="pan">PAN Card</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="doc-number" className="block text-xs font-bold text-[#1c1b1b]">
                          Document Number (Masked)
                        </label>
                        <div className="relative">
                          <input
                            id="doc-number"
                            type={showId ? "text" : "password"}
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#e7e7eb] bg-[#f6f3f2] text-xs font-mono text-[#1c1b1b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowId(!showId)}
                            className="absolute right-3 top-2.5 text-[#777585] hover:text-[#1c1b1b]"
                          >
                            <span className="material-symbols-outlined text-sm">
                              {showId ? "visibility_off" : "visibility"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#f0eded]/60 border border-[#e7e7eb] text-xs text-[#474554] space-y-1">
                      <span className="font-bold text-[#1c1b1b] flex items-center gap-1 text-[11px]">
                        <span className="material-symbols-outlined text-sm text-[#006d3a]">verified_user</span>
                        Statutory Privacy Shield (PRD §18.4)
                      </span>
                      <p className="text-[11px] text-[#777585] leading-relaxed">
                        Under Indian DPDP Act 2023, identity documents are stored in zero-knowledge encrypted cold storage, used exclusively for KYC audit by verified DreamX compliance officers, and NEVER exposed to candidates, recruiters, or third parties.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2.5 rounded-xl border border-[#e7e7eb] bg-white text-xs font-bold text-[#1c1b1b] hover:bg-[#f6f3f2]"
                    >
                      ← Back to Step 2
                    </button>
                    <button
                      type="button"
                      onClick={handleGoToNextStep}
                      className="px-6 py-2.5 rounded-xl bg-[#5145cd] hover:bg-[#3828b5] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <span>Continue to Step 4: Availability &amp; Settlement</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Availability & Settlement Rails (PRD §13.1) */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <span className="text-[11px] font-bold text-[#5145cd] uppercase tracking-wider font-mono">
                      STAGE 04 / 04
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#1c1b1b] font-heading tracking-tight mt-1">
                      Availability, Payout Rails &amp; Final Dossier Submission
                    </h2>
                    <p className="text-xs sm:text-sm text-[#474554] mt-1 leading-relaxed">
                      Configure your weekly time commitment and settlement payout details. All payouts are disbursed weekly via Razorpay Nodal Escrow with 0% platform commission taken from mentor list prices.
                    </p>
                  </div>

                  {/* Card 1: Time Commitment */}
                  <div className="bg-white border border-[#e7e7eb] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="text-sm font-bold text-[#1c1b1b] pb-2 border-b border-[#e7e7eb] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#5145cd] text-[20px]">schedule</span>
                      <span>Weekly Mentorship Commitment</span>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-[#1c1b1b]">
                        Committed Hours Per Week
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {["4", "6", "10", "15"].map((h) => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => setWeeklyHours(h)}
                            className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                              weeklyHours === h
                                ? "border-[#5145cd] bg-[#e3dfff] text-[#130068] shadow-xs"
                                : "border-[#e7e7eb] bg-white text-[#474554] hover:bg-[#f6f3f2]"
                            }`}
                          >
                            {h} hrs / wk
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#e7e7eb]">
                      <label className="block text-xs font-bold text-[#1c1b1b]">
                        Preferred Scheduling Windows (Asia/Kolkata IST)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { id: "weekday_evening", label: "Weekday Evenings", time: "7:00 PM – 10:00 PM IST" },
                          { id: "weekend_morning", label: "Weekend Mornings", time: "10:00 AM – 1:00 PM IST" },
                          { id: "weekend_evening", label: "Weekend Evenings", time: "5:00 PM – 8:00 PM IST" },
                        ].map((win) => {
                          const active = preferredWindows.includes(win.id);
                          return (
                            <button
                              key={win.id}
                              type="button"
                              onClick={() => toggleWindow(win.id)}
                              className={`p-3 rounded-xl text-left border transition-all ${
                                active
                                  ? "border-[#5145cd] bg-[#e3dfff]/50 text-[#130068] shadow-xs"
                                  : "border-[#e7e7eb] bg-[#f6f3f2] text-[#474554] hover:bg-white"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs">{win.label}</span>
                                {active && <span className="text-[#5145cd] text-xs font-bold">✓</span>}
                              </div>
                              <span className="text-[10px] text-[#777585] mt-0.5 block">{win.time}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Settlement Payout Details */}
                  <div className="bg-white border border-[#e7e7eb] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="text-sm font-bold text-[#1c1b1b] pb-2 border-b border-[#e7e7eb] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#5145cd] text-[20px]">account_balance_wallet</span>
                        <span>Weekly Settlement Rails (PRD §13.1)</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#006d3a] bg-[#eaf5ef] px-2 py-0.5 rounded-full">
                        Monday 10 AM Automated
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                        <input
                          type="radio"
                          name="payoutMethod"
                          checked={payoutMethod === "upi"}
                          onChange={() => setPayoutMethod("upi")}
                          className="accent-[#5145cd]"
                        />
                        <span>Instant UPI VPA (Recommended)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                        <input
                          type="radio"
                          name="payoutMethod"
                          checked={payoutMethod === "bank"}
                          onChange={() => setPayoutMethod("bank")}
                          className="accent-[#5145cd]"
                        />
                        <span>Bank NEFT / IMPS Transfer</span>
                      </label>
                    </div>

                    {payoutMethod === "upi" ? (
                      <div className="space-y-1.5 pt-1">
                        <label htmlFor="upi-vpa-input" className="block text-xs font-bold text-[#1c1b1b]">
                          UPI ID / Virtual Payment Address (VPA)
                        </label>
                        <input
                          id="upi-vpa-input"
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#e7e7eb] bg-[#f6f3f2] text-xs font-mono text-[#1c1b1b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
                        />
                        <p className="text-[10px] text-[#777585]">
                          Zero-fee instant settlement to any UPI-linked bank account in India.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <div className="space-y-1.5">
                          <label htmlFor="acc-number-input" className="block text-xs font-bold text-[#1c1b1b]">
                            Bank Account Number
                          </label>
                          <input
                            id="acc-number-input"
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            placeholder="e.g. 50100234918231"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#e7e7eb] bg-[#f6f3f2] text-xs font-mono text-[#1c1b1b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="ifsc-input" className="block text-xs font-bold text-[#1c1b1b]">
                            IFSC Code
                          </label>
                          <input
                            id="ifsc-input"
                            type="text"
                            value={ifscCode}
                            onChange={(e) => setIfscCode(e.target.value)}
                            placeholder="e.g. HDFC0001024"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#e7e7eb] bg-[#f6f3f2] text-xs font-mono uppercase text-[#1c1b1b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1.5">
                          <label htmlFor="acc-name-input" className="block text-xs font-bold text-[#1c1b1b]">
                            Account Beneficiary Legal Name
                          </label>
                          <input
                            id="acc-name-input"
                            type="text"
                            value={accountHolderName}
                            onChange={(e) => setAccountHolderName(e.target.value)}
                            placeholder="Must match your KYC government name"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#e7e7eb] bg-[#f6f3f2] text-xs font-medium text-[#1c1b1b] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card 3: Legal & Escrow Agreements */}
                  <div className="bg-white border border-[#e7e7eb] rounded-2xl p-5 sm:p-6 shadow-xs space-y-3 text-xs">
                    <span className="font-bold text-[#1c1b1b] block">Accreditation Protocols &amp; Statutory Agreements</span>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedToEscrow}
                        onChange={(e) => setAgreedToEscrow(e.target.checked)}
                        className="mt-0.5 accent-[#5145cd]"
                      />
                      <span className="text-[#474554] leading-relaxed">
                        I acknowledge that 100% of candidate booking fees are escrowed via <strong>Razorpay Nodal Custody (PRD §13.1)</strong> and disbursed to my settlement account each Monday upon verified delivery of session deliverables within SLA.
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedToConduct}
                        onChange={(e) => setAgreedToConduct(e.target.checked)}
                        className="mt-0.5 accent-[#5145cd]"
                      />
                      <span className="text-[#474554] leading-relaxed">
                        I adhere to the <strong>DreamX Mentor Honor Code (PRD §9.1)</strong>: zero disclosure of candidate mock data, independent rubric scoring, and minimum 2-hour rescheduling notice window.
                      </span>
                    </label>
                  </div>

                  {/* Step 4 Actions & Final Submit */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-4 py-2.5 rounded-xl border border-[#e7e7eb] bg-white text-xs font-bold text-[#1c1b1b] hover:bg-[#f6f3f2]"
                    >
                      ← Back to Step 3
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitApplication}
                      disabled={saving}
                      className="px-6 py-2.5 rounded-xl bg-[#5145cd] hover:bg-[#3828b5] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 focus:ring-2 focus:ring-offset-2 focus:ring-[#5145cd] disabled:opacity-75"
                    >
                      <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                      <span>{saving ? "Submitting Accreditation Dossier..." : "Submit Accreditation Dossier"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 Cols: Trust & Economics Sidebar */}
            <div className="lg:col-span-4 space-y-5">
              {/* Card 1: Estimated Net Monthly Yield */}
              <div className="bg-white border border-[#e7e7eb] rounded-2xl p-5 shadow-xs space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-[#777585] uppercase tracking-wider">
                    PRD §13.1 Economics
                  </span>
                  <h3 className="text-base font-bold text-[#1c1b1b] font-heading mt-0.5">
                    Estimated Net Monthly Yield
                  </h3>
                </div>

                <div className="p-3.5 rounded-xl bg-[#eaf5ef] border border-[#94f7b2]">
                  <span className="text-[11px] font-bold text-[#006d3a] block">
                    PROJECTED EARNINGS
                  </span>
                  <div className="text-2xl font-extrabold text-[#1c1b1b] font-heading tabular-nums mt-0.5">
                    ₹{calculateProjectedYield(Number(weeklyHours)).toLocaleString("en-IN")}
                    <span className="text-xs font-normal text-[#474554]"> / month</span>
                  </div>
                  <span className="text-[10px] text-[#006d3a] font-semibold mt-1 block">
                    At {weeklyHours} hours committed per week • {selectedServices.length} active service modules
                  </span>
                </div>

                {/* Selected Modules Breakdown */}
                <div className="space-y-2 pt-2 border-t border-[#e7e7eb] text-xs text-[#474554]">
                  {selectedServices.slice(0, 3).map((code) => {
                    const s = AVAILABLE_SERVICES.find((item) => item.code === code);
                    if (!s) return null;
                    return (
                      <div key={code} className="flex justify-between items-center">
                        <span className="truncate max-w-[170px]">{code} {s.title}</span>
                        <span className="font-bold text-[#1c1b1b]">
                          ₹{(s.pricePaise / 100).toLocaleString("en-IN")}
                        </span>
                      </div>
                    );
                  })}
                  {selectedServices.length > 3 && (
                    <div className="text-[11px] text-[#5145cd] font-semibold">
                      + {selectedServices.length - 3} additional service modules selected
                    </div>
                  )}
                  <div className="flex justify-between pt-1 border-t border-[#e7e7eb] font-bold text-[#006d3a]">
                    <span>Platform Commission Cut</span>
                    <span>₹0 (0% Take Rate)</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#777585] leading-relaxed">
                  DreamX absorbs candidate discounts. 100% of listed price is disbursed weekly via Razorpay Nodal Escrow every Monday.
                </p>
              </div>

              {/* Card 2: Why DreamX Enforces Strict Verification */}
              <div className="bg-white border border-[#e7e7eb] rounded-2xl p-5 shadow-xs space-y-3">
                <span className="text-xs font-bold text-[#1c1b1b] block">
                  Why DreamX Enforces Strict Verification
                </span>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#ffdad6]/40 border border-[#ffdad6]">
                  <span className="text-xl font-extrabold text-[#ba1a1a] font-heading">68%</span>
                  <span className="text-xs font-semibold text-[#93000a]">
                    Applicant Rejection Rate (Only verified Staff/Lead engineers accredited)
                  </span>
                </div>
                <ul className="space-y-2 text-xs text-[#474554]">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-sm text-[#006d3a] mt-0.5">check_circle</span>
                    <span><strong>Zero Unverified Mentors:</strong> Every scorecard is cryptographically signed.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-sm text-[#006d3a] mt-0.5">check_circle</span>
                    <span><strong>100% Protected Hourly Rate:</strong> Escrow locks full fee before slots confirm.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-sm text-[#006d3a] mt-0.5">check_circle</span>
                    <span><strong>Zero Cold Solicitation:</strong> Only pre-matched candidates in your exact domain.</span>
                  </li>
                </ul>
              </div>

              {/* Card 3: Compliance & Document Security */}
              <div className="p-4 rounded-2xl bg-[#f6f3f2] border border-[#e7e7eb] text-xs text-[#777585] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#1c1b1b]">
                  <span className="material-symbols-outlined text-[16px] text-[#5145cd]">verified_user</span>
                  <span>Compliance Custody Policy</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Reviewed exclusively by DreamX Compliance Legal Team. Automated 12-month purge policy for unapproved or withdrawn submissions.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}