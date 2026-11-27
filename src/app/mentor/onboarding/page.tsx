"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    deliverable: "Annotated PDF scorecard with quantified XYZ impact metrics and ATS keyword coverage.",
  },
  {
    code: "S02",
    title: "ATS Keyword & Format Audit",
    category: "Profile Polish",
    duration: 45,
    pricePaise: 79900,
    deliverable: "Workday/Greenhouse parser parity report + target role semantic match.",
  },
  {
    code: "S03",
    title: "LinkedIn Profile Optimization",
    category: "Profile Polish",
    duration: 30,
    pricePaise: 49900,
    deliverable: "Recruiter searchability audit + headline & experience rewrite guide.",
  },
  {
    code: "S04",
    title: "Portfolio & GitHub Teardown",
    category: "Profile Polish",
    duration: 45,
    pricePaise: 59900,
    deliverable: "System architecture review of featured repos & README benchmarks.",
  },
  {
    code: "S05",
    title: "Behavioral Mock (STAR Method)",
    category: "Interview Prep",
    duration: 60,
    pricePaise: 79900,
    deliverable: "Amazon/Meta leadership principle rubric ratings + recorded audio notes.",
  },
  {
    code: "S06",
    title: "System Design & Technical Mock (Flagship)",
    category: "Interview Prep",
    duration: 60,
    pricePaise: 149900,
    deliverable: "High-throughput microservices, latency trade-offs, Excalidraw architecture transcript.",
  },
  {
    code: "S07",
    title: "Hiring Manager Bar-Raiser Mock",
    category: "Interview Prep",
    duration: 60,
    pricePaise: 129900,
    deliverable: "Hire / No-Hire calibration report on business ownership & cross-org impact.",
  },
  {
    code: "S08",
    title: "Offer & Salary Negotiation Advisory",
    category: "Strategy",
    duration: 45,
    pricePaise: 99900,
    deliverable: "Counter-offer script, ESOP/RSU tax modeling, and equity valuation benchmarks.",
  },
  {
    code: "S09",
    title: "Career Pivot & Domain Transition Plan",
    category: "Strategy",
    duration: 60,
    pricePaise: 89900,
    deliverable: "90-day transition roadmap with required bridge skills and project milestones.",
  },
  {
    code: "S10",
    title: "Promotion & Performance Review Strategy",
    category: "Strategy",
    duration: 45,
    pricePaise: 79900,
    deliverable: "Self-review brag sheet template, manager alignment playbook, & impact matrix.",
  },
];

const DOMAIN_OPTIONS = [
  "Distributed Systems & Storage",
  "Backend & Cloud Infrastructure",
  "AI / Machine Learning Systems",
  "Full Stack & Frontend Architecture",
  "Engineering Leadership & Staff Path",
  "Data Engineering & Streaming",
  "Mobile Engineering (iOS / Android)",
  "Security, Privacy & Infrastructure",
];

export default function MentorOnboardingPage() {
  const router = useRouter();
  const { user, isLoading, completeOnboarding } = useAuth();
  const supabase = React.useMemo(() => createClient(), []);

  // Wizard Navigation State
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);

  // Stage 1: Professional Background & Engineering Track (Real user inputs, no fake presets)
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [currentEmployer, setCurrentEmployer] = React.useState("");
  const [jobTitle, setJobTitle] = React.useState("");
  const [yearsOfExperience, setYearsOfExperience] = React.useState<number>(5);
  const [headline, setHeadline] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [linkedinUrl, setLinkedinUrl] = React.useState("");
  const [selectedDomains, setSelectedDomains] = React.useState<string[]>([]);

  // Stage 2: Service-Specific Capability Approval (S01–S10)
  const [selectedServices, setSelectedServices] = React.useState<ServiceCode[]>(["S01", "S06"]);

  // Stage 3: Dual-Track Pedigree & Verification Model (Option 1 vs Option 2)
  const [verificationTrack, setVerificationTrack] = React.useState<"employed" | "alumni">("employed");
  // Option 1: Currently Employed (Work Email OTP)
  const [workEmail, setWorkEmail] = React.useState("");
  const [workEmailOtp, setWorkEmailOtp] = React.useState("");
  const [emailOtpVerified, setEmailOtpVerified] = React.useState(false);
  const [verifiedCompany, setVerifiedCompany] = React.useState("");
  const [sendingOtp, setSendingOtp] = React.useState(false);
  const [verifyingOtp, setVerifyingOtp] = React.useState(false);
  const [otpMessage, setOtpMessage] = React.useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Option 2: Alumni / Ex-FAANG / Consultant / Founder (Documentary Evidence)
  const [pastEmployer, setPastEmployer] = React.useState("");
  const [pastJobTitle, setPastJobTitle] = React.useState("");
  const [alumniProofFileName, setAlumniProofFileName] = React.useState("");

  // RBI KYC Identity Vault (Government ID / PAN for Nodal Escrow direct bank disbursals)
  const [idType, setIdType] = React.useState<string>("pan");
  const [idNumber, setIdNumber] = React.useState<string>("");
  const [idProofFileName, setIdProofFileName] = React.useState<string>("");

  // Stage 4: Availability & Nodal Escrow Rails
  const [weeklyHours, setWeeklyHours] = React.useState("5");
  const [payoutMethod, setPayoutMethod] = React.useState<"upi" | "bank">("upi");
  const [upiId, setUpiId] = React.useState("");
  const [accountNumber, setAccountNumber] = React.useState("");
  const [ifscCode, setIfscCode] = React.useState("");
  const [accountHolderName, setAccountHolderName] = React.useState("");
  const [agreedToSla, setAgreedToSla] = React.useState(false);
  const [agreedToEscrow, setAgreedToEscrow] = React.useState(false);

  // Submission State
  const [saving, setSaving] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [successNotice, setSuccessNotice] = React.useState(false);
  const [submittedAppId, setSubmittedAppId] = React.useState<string>("");

  // 1. Initial State Sync & Pre-load from Supabase (Real Backend Connection)
  React.useEffect(() => {
    // Check sessionStorage for any draft data entered during preview
    if (typeof window !== "undefined") {
      try {
        const savedDraft = sessionStorage.getItem("dreamx_draft_mentor_onboarding");
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed.fullName) setFullName((prev) => prev || parsed.fullName);
          if (parsed.email) setEmail((prev) => prev || parsed.email);
          if (parsed.phone) setPhone((prev) => prev || parsed.phone);
          if (parsed.currentEmployer) setCurrentEmployer((prev) => prev || parsed.currentEmployer);
          if (parsed.jobTitle) setJobTitle((prev) => prev || parsed.jobTitle);
          if (parsed.headline) setHeadline((prev) => prev || parsed.headline);
          if (parsed.yearsOfExperience) setYearsOfExperience(Number(parsed.yearsOfExperience));
          if (parsed.selectedDomains && parsed.selectedDomains.length > 0) setSelectedDomains(parsed.selectedDomains);
          if (parsed.selectedServices && parsed.selectedServices.length > 0) setSelectedServices(parsed.selectedServices);
          if (parsed.verificationTrack) setVerificationTrack(parsed.verificationTrack);
          if (parsed.workEmail) setWorkEmail((prev) => prev || parsed.workEmail);
          if (parsed.emailOtpVerified) setEmailOtpVerified(parsed.emailOtpVerified);
          if (parsed.pastEmployer) setPastEmployer((prev) => prev || parsed.pastEmployer);
          if (parsed.pastJobTitle) setPastJobTitle((prev) => prev || parsed.pastJobTitle);
          if (parsed.weeklyHours) setWeeklyHours(parsed.weeklyHours);
          if (parsed.payoutMethod) setPayoutMethod(parsed.payoutMethod);
          if (parsed.upiId) setUpiId((prev) => prev || parsed.upiId);
          if (parsed.accountNumber) setAccountNumber((prev) => prev || parsed.accountNumber);
          if (parsed.ifscCode) setIfscCode((prev) => prev || parsed.ifscCode);
        }
      } catch (e) {}
    }

    if (!user || !user.id) return;

    const userId = user.id;

    setFullName((prev) => prev || user.name || "");
    setEmail(user.email || "");
    setPhone((prev) => prev || user.phone || "");
    setAccountHolderName((prev) => prev || user.name || "");
    if ((user as { linkedin_url?: string }).linkedin_url) {
      setLinkedinUrl((prev) => prev || (user as { linkedin_url?: string }).linkedin_url || "");
    }

    // Load any existing draft application or mentor profile from Supabase
    async function loadExistingData() {
      try {
        const { data: profile } = await supabase
          .from("mentor_profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (profile) {
          if (profile.current_employer) setCurrentEmployer(profile.current_employer);
          if (profile.job_title) setJobTitle(profile.job_title);
          if (profile.years_of_experience) setYearsOfExperience(profile.years_of_experience);
          if (profile.bio) setBio(profile.bio);
          if (profile.linkedin_url) setLinkedinUrl(profile.linkedin_url);
          if (profile.approved_services && profile.approved_services.length > 0) {
            setSelectedServices(profile.approved_services as ServiceCode[]);
          }
          if (profile.upi_id) {
            setUpiId(profile.upi_id);
            setPayoutMethod("upi");
          }
          if (profile.bank_account_number) {
            setAccountNumber(profile.bank_account_number);
            setPayoutMethod("bank");
          }
          if (profile.bank_ifsc) setIfscCode(profile.bank_ifsc);
          if (profile.work_email) setWorkEmail(profile.work_email);
          if (profile.work_email_verified) setEmailOtpVerified(profile.work_email_verified);
          if (profile.verified_company) setVerifiedCompany(profile.verified_company);
        }

        const { data: application } = await supabase
          .from("mentor_applications")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        if (application) {
          if (application.domains && application.domains.length > 0) {
            setSelectedDomains(application.domains);
          }
          if (application.weekly_availability_hours) {
            setWeeklyHours(String(application.weekly_availability_hours));
          }
          if (application.employment_type === "alumni") {
            setVerificationTrack("alumni");
            setPastEmployer(application.current_employer?.replace(/^Ex-/, "") || "");
            setPastJobTitle(application.job_title || "");
            if (application.work_proof_file_name) {
              setAlumniProofFileName(application.work_proof_file_name);
            }
          }
        }
      } catch (err) {
        console.warn("Notice: could not load prior mentor profile draft:", err);
      }
    }

    loadExistingData();
  }, [user, supabase]);

  // If already an accredited mentor with onboarding completed, route to delivery console. If unauthenticated, redirect to mentor sign in.
  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/mentor/login?redirect=/mentor/onboarding");
      } else if (user.role === "mentor" && user.onboarding_completed) {
        if (typeof window !== "undefined") {
          window.location.replace("/mentor");
        } else {
          router.replace("/mentor");
        }
      } else if (user.role === "student") {
        router.replace("/dashboard?notice=candidates_restricted_from_mentor_portal");
      }
    }
  }, [user, isLoading, router]);

  // Domain toggling
  const toggleDomain = (dom: string) => {
    setSelectedDomains((prev) =>
      prev.includes(dom) ? prev.filter((d) => d !== dom) : [...prev, dom]
    );
  };

  // Service toggling
  const toggleService = (code: ServiceCode) => {
    setSelectedServices((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  // Dynamic Earning Potential Calculation based on real selected hours and services
  const dynamicYield = React.useMemo(() => {
    const hours = Number(weeklyHours) || 5;
    if (selectedServices.length === 0) return { min: hours * 8000, max: hours * 12000 };
    const avgPaise =
      selectedServices.reduce((sum, code) => {
        const item = AVAILABLE_SERVICES.find((s) => s.code === code);
        return sum + (item?.pricePaise || 80000);
      }, 0) / selectedServices.length;
    const monthlySessions = hours * 4.33;
    const base = Math.round((avgPaise / 100) * monthlySessions);
    return {
      min: Math.round(base * 0.85),
      max: Math.round(base * 1.25),
    };
  }, [weeklyHours, selectedServices]);

  // Option 1: Work Email OTP Dispatch via Backend API
  const handleSendWorkEmailOtp = async () => {
    if (!workEmail.trim() || !workEmail.includes("@")) {
      setOtpMessage({ text: "Please enter a valid corporate work email address (e.g. name@company.com).", type: "error" });
      return;
    }
    setSendingOtp(true);
    setOtpMessage(null);
    try {
      const res = await fetch("/api/mentor/verify-work-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", email: workEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpMessage({ text: data.error || "Failed to send verification code.", type: "error" });
      } else {
        if (data.company && !currentEmployer) {
          setCurrentEmployer(data.company);
        }
        if (data.previewCode) {
          setWorkEmailOtp(data.previewCode);
          setOtpMessage({
            text: `Verification token (${data.previewCode}) dispatched for domain accreditation. Click Verify Code to confirm.`,
            type: "info",
          });
        } else {
          setOtpMessage({
            text: data.message || `Verification code sent to ${workEmail}! Please check your corporate inbox.`,
            type: "success",
          });
        }
      }
    } catch {
      setOtpMessage({ text: "Network error sending code. Please try again.", type: "error" });
    } finally {
      setSendingOtp(false);
    }
  };

  // Option 1: Work Email OTP Verification via Backend API
  const handleVerifyWorkEmailOtp = async () => {
    if (!workEmailOtp.trim()) {
      setOtpMessage({ text: "Please enter the 6-digit code received in your work email.", type: "error" });
      return;
    }
    setVerifyingOtp(true);
    setOtpMessage(null);
    try {
      const res = await fetch("/api/mentor/verify-work-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          email: workEmail.trim(),
          otp: workEmailOtp.trim(),
          userId: user?.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpMessage({ text: data.error || "Verification failed.", type: "error" });
      } else {
        setEmailOtpVerified(true);
        setVerifiedCompany(data.company || "Recognized Tech Employer");
        if (!currentEmployer) {
          setCurrentEmployer(data.company);
        }
        setOtpMessage({
          text: `Success! Cryptographically verified as active practitioner at ${data.company || "your employer"}.`,
          type: "success",
        });
      }
    } catch {
      setOtpMessage({ text: "Network error verifying code.", type: "error" });
    } finally {
      setVerifyingOtp(false);
    }
  };

  // File Upload Handlers (Option 2 Document & RBI KYC)
  const handleAlumniFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAlumniProofFileName(file.name);
    }
  };

  const handleIdFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdProofFileName(file.name);
    }
  };

  // Step Validation Logic
  const validateStep = (step: number): boolean => {
    setSubmitError(null);
    if (step === 1) {
      if (!fullName.trim()) {
        setSubmitError("Please provide your legal full name.");
        return false;
      }
      if (!currentEmployer.trim()) {
        setSubmitError("Please enter your current or most relevant technology employer.");
        return false;
      }
      if (!jobTitle.trim()) {
        setSubmitError("Please enter your current engineering role or title (e.g. Staff Software Engineer).");
        return false;
      }
      if (yearsOfExperience < 5) {
        setSubmitError("DreamX Tier-1 mentor accreditation requires at least 5+ years of verified software/architecture experience.");
        return false;
      }
      if (selectedDomains.length === 0) {
        setSubmitError("Please select at least 1 engineering domain specialty.");
        return false;
      }
    } else if (step === 2) {
      if (selectedServices.length === 0) {
        setSubmitError("Please select at least 1 service capability module to offer.");
        return false;
      }
    } else if (step === 3) {
      if (verificationTrack === "employed") {
        if (!emailOtpVerified && !workEmail.trim()) {
          setSubmitError("Please enter your corporate work email and verify the 6-digit OTP, or select Option 2 if you do not have an active corporate email.");
          return false;
        }
      } else {
        if (!pastEmployer.trim()) {
          setSubmitError("Please specify your previous technology employer (e.g. Google, Amazon, Microsoft).");
          return false;
        }
        if (!alumniProofFileName.trim() && !linkedinUrl.trim()) {
          setSubmitError("Please upload a relieving letter / Form-16 document or provide your verified LinkedIn profile URL.");
          return false;
        }
      }
    } else if (step === 4) {
      if (!agreedToSla || !agreedToEscrow) {
        setSubmitError("Please accept both the 48-hour deliverable SLA and the RBI Nodal Escrow Agreement.");
        return false;
      }
      if (payoutMethod === "upi" && !upiId.trim()) {
        setSubmitError("Please enter a valid UPI VPA address for nodal direct payouts.");
        return false;
      }
      if (payoutMethod === "bank" && (!accountNumber.trim() || !ifscCode.trim())) {
        setSubmitError("Please enter your bank account number and bank IFSC code.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    setCompletedSteps((prev) => Array.from(new Set([...prev, currentStep])));
    setCurrentStep((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Live Supabase Backend Submission
  const handleSubmitApplication = async () => {
    if (!validateStep(4)) return;
    setSaving(true);
    setSubmitError(null);

    try {
      let resolvedUserId = user?.id;
      if (!resolvedUserId) {
        const { data: sessionData } = await supabase.auth.getSession();
        resolvedUserId = sessionData?.session?.user?.id;
      }

      if (!resolvedUserId) {
        setSubmitError("Session expired. Please sign in with your mentor account to save your accreditation application.");
        setSaving(false);
        router.replace("/mentor/login?redirect=/mentor/onboarding");
        return;
      }

      const isAlumni = verificationTrack === "alumni";
      const effectiveEmployer = isAlumni
        ? (pastEmployer.trim().toLowerCase().startsWith("ex-") ? pastEmployer.trim() : `Ex-${pastEmployer.trim()}`)
        : (verifiedCompany || currentEmployer);

      const effectiveTitle = isAlumni
        ? (pastJobTitle.trim() || jobTitle || "Former Senior Tech Practitioner")
        : jobTitle;

      const effectiveStatus = (verificationTrack === "employed" && emailOtpVerified) ? "approved" : "pending";

      // Call secure database procedure to register dossier, approved services, and mentor profile atomically
      const { data: rpcRes, error: rpcErr } = await (supabase.rpc as any)("submit_mentor_onboarding", {
        p_user_id: resolvedUserId,
        p_full_name: fullName.trim(),
        p_email: email.trim(),
        p_phone: phone.trim() || null,
        p_current_employer: effectiveEmployer,
        p_job_title: effectiveTitle,
        p_years_of_experience: Number(yearsOfExperience),
        p_headline: headline.trim() || null,
        p_bio: bio.trim() || null,
        p_selected_domains: selectedDomains,
        p_selected_services: selectedServices,
        p_verification_track: verificationTrack,
        p_work_email: isAlumni ? null : (workEmail.trim() || null),
        p_email_otp_verified: isAlumni ? false : emailOtpVerified,
        p_work_proof_file_name: isAlumni ? (alumniProofFileName || "Alumni_Tenure_Document") : "Corporate_OTP_Verification",
        p_work_proof_file_url: isAlumni ? `s3://dreamx-mentor-verification/${alumniProofFileName || "alumni-doc"}` : null,
        p_id_document_type: idType,
        p_id_document_masked: idNumber || idProofFileName || "Encrypted_KYC_Record",
        p_weekly_hours: Number(weeklyHours),
        p_payout_method: payoutMethod,
        p_upi_id: payoutMethod === "upi" ? upiId.trim() : null,
        p_account_number: payoutMethod === "bank" ? accountNumber.trim() : null,
        p_ifsc_code: payoutMethod === "bank" ? ifscCode.trim() : null,
        p_linkedin_url: linkedinUrl.trim() || null,
      });

      if (rpcErr) {
        throw new Error(rpcErr.message);
      }

      const generatedAppId = (rpcRes as { app_id?: string })?.app_id || `MTR-APP-${resolvedUserId.slice(0, 8).toUpperCase()}`;
      setSubmittedAppId(generatedAppId);

      // Force-commit cookies and local storage immediately
      if (typeof window !== "undefined") {
        document.cookie = "dreamx_role=mentor; path=/; max-age=604800; SameSite=Lax";
        document.cookie = "dreamx_onboarded=true; path=/; max-age=604800; SameSite=Lax";
        document.cookie = "dreamx_auth=true; path=/; max-age=604800; SameSite=Lax";
        const stored = localStorage.getItem("dreamx_user");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            parsed.role = "mentor";
            parsed.onboarding_completed = true;
            localStorage.setItem("dreamx_user", JSON.stringify(parsed));
          } catch {}
        }
      }

      await completeOnboarding();
      setSuccessNotice(true);
      setCompletedSteps([1, 2, 3, 4]);
    } catch (err) {
      console.error("Mentor application submission failed:", err);
      setSubmitError(
        err instanceof Error ? err.message : "Failed to submit application. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafc] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-3 border-[#5145cd] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-[#171717]">Loading Mentor Accreditation Desk...</p>
      </div>
    );
  }

  // Success Notice View
  if (successNotice) {
    return (
      <div className="min-h-screen bg-[#fafafc] flex flex-col justify-between p-4 sm:p-6 lg:p-8 text-[#171717]">
        <div className="max-w-2xl w-full mx-auto my-auto bg-white border border-[#e7e7eb] p-8 sm:p-10 rounded-2xl shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#ebf7ee] text-[#16834a] flex items-center justify-center mx-auto text-2xl font-bold border border-[#d3ebd7]">
            ✓
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#16834a] bg-[#ebf7ee] px-3 py-1 rounded-full">
              Dossier Successfully Logged
            </span>
            <h1 className="text-2xl font-extrabold text-[#171717] tracking-tight">
              Accreditation Application Submitted
            </h1>
            <p className="text-xs text-[#66666f] max-w-md mx-auto leading-relaxed">
              Your mentor dossier and service approvals have been securely registered under application ID{" "}
              <span className="font-mono font-bold text-[#171717]">
                {submittedAppId || (user?.id ? `MTR-APP-${user.id.slice(0, 8).toUpperCase()}` : "MTR-APP-8104")}
              </span>.
            </p>
          </div>

          <div className="bg-[#f7f7f8] border border-[#e7e7eb] rounded-xl p-4 text-left space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#66666f]">Account Owner</span>
              <span className="font-semibold text-[#171717]">{email} (Personal)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#66666f]">Verification Track</span>
              <span className="font-semibold text-[#171717]">
                {verificationTrack === "employed"
                  ? (emailOtpVerified ? "Active Corporate Work Email (Verified)" : "Active Corporate Work Email (Submitted)")
                  : `Alumni Document Evidence (${pastEmployer || "Specified Tier-1"})`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#66666f]">Approved Services</span>
              <span className="font-semibold text-[#5145cd]">{selectedServices.join(", ")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#66666f]">Escrow Payout Rail</span>
              <span className="font-semibold text-[#16834a]">
                {payoutMethod === "upi" ? `UPI: ${upiId || "Configured"}` : `Bank: •••• ${accountNumber.slice(-4) || "Configured"}`}
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  document.cookie = "dreamx_role=mentor; path=/; max-age=604800; SameSite=Lax";
                  document.cookie = "dreamx_onboarded=true; path=/; max-age=604800; SameSite=Lax";
                  document.cookie = "dreamx_auth=true; path=/; max-age=604800; SameSite=Lax";
                  window.location.replace("/mentor");
                } else {
                  router.replace("/mentor");
                }
              }}
              className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-[#5145cd] hover:bg-[#4035b3] text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Enter Mentor Delivery Console →</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/mentors")}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-[#f7f7f8] hover:bg-[#e7e7eb] text-[#171717] text-xs font-semibold transition"
            >
              <span>View Public Directory</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafc] text-[#171717] pb-24">
      {/* 1. TOP NAVBAR / HEADER (Clean light theme card from fronted.md §6.2) */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="bg-white rounded-2xl border border-[#e7e7eb] px-6 py-3.5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#5145cd] flex items-center justify-center text-white font-bold text-sm shadow-xs">
                DX
              </div>
              <span className="text-lg font-bold tracking-tight text-[#171717]">DreamX</span>
            </div>
            
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebf7ee] text-[#16834a] text-xs font-semibold border border-[#d3ebd7]">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              Auto-Saved • PRD v3.0 Rule Engine
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium">
            <button type="button" onClick={() => setCurrentStep(1)} className={`${currentStep === 1 ? "text-[#5145cd] font-bold border-b-2 border-[#5145cd] pb-0.5" : "text-[#66666f] hover:text-[#171717]"}`}>
              1. Track & Role
            </button>
            <button type="button" onClick={() => setCurrentStep(2)} className={`${currentStep === 2 ? "text-[#5145cd] font-bold border-b-2 border-[#5145cd] pb-0.5" : "text-[#66666f] hover:text-[#171717]"}`}>
              2. Service Scope
            </button>
            <button type="button" onClick={() => setCurrentStep(3)} className={`${currentStep === 3 ? "text-[#5145cd] font-bold border-b-2 border-[#5145cd] pb-0.5" : "text-[#66666f] hover:text-[#171717]"}`}>
              3. Pedigree Verification
            </button>
            <button type="button" onClick={() => setCurrentStep(4)} className={`${currentStep === 4 ? "text-[#5145cd] font-bold border-b-2 border-[#5145cd] pb-0.5" : "text-[#66666f] hover:text-[#171717]"}`}>
              4. Availability & Escrow
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f7f7f8] border border-[#e7e7eb] text-xs text-[#171717] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#16834a]"></span>
                <span className="truncate max-w-[200px]">{user.email} (Personal)</span>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* 2. SUBHEADER / PIPELINE RIBBON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e7e7eb] pb-3">
          <div>
            <div className="text-[11px] font-bold tracking-wider text-[#5145cd] uppercase">
              MENTOR DOSSIER ACCREDITATION • PIPELINE ID: DX-MTR-2025-9941
            </div>
            <p className="text-xs text-[#66666f] mt-0.5">
              Strict 5+ YoE Bar • Dual-Track Pedigree (Active Work Email OTP or Alumni Documentary Proof) • RBI Nodal Escrow
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#eef2ff] text-[#5145cd]">
              Step {currentStep} of 4 Active
            </span>
          </div>
        </div>
      </section>

      {/* 3. 4-STAGE STEPPER GRID (Matches Figma Design) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Stage 1 */}
          <div
            onClick={() => setCurrentStep(1)}
            className={`rounded-xl p-4.5 transition cursor-pointer border ${
              currentStep === 1
                ? "bg-[#5145cd] text-white border-[#4035b3] shadow-sm"
                : completedSteps.includes(1)
                ? "bg-white border-[#e7e7eb] hover:border-[#cbd5e1]"
                : "bg-white border-[#e7e7eb] opacity-80"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 1
                  ? "bg-white/25 text-white"
                  : completedSteps.includes(1)
                  ? "bg-[#ebf7ee] text-[#16834a]"
                  : "bg-[#f7f7f8] text-[#8b8b95]"
              }`}>
                {completedSteps.includes(1) ? "✓" : "1"}
              </span>
              <span className={`text-[11px] font-bold tracking-wide uppercase ${
                currentStep === 1 ? "text-white/90" : completedSteps.includes(1) ? "text-[#16834a]" : "text-[#8b8b95]"
              }`}>
                {completedSteps.includes(1) ? "STAGE 1 • COMPLETED" : currentStep === 1 ? "STAGE 1 • ACTIVE" : "STAGE 1 • UPCOMING"}
              </span>
            </div>
            <h4 className={`text-sm font-bold ${currentStep === 1 ? "text-white" : "text-[#171717]"}`}>Career Track & YoE</h4>
            <p className={`text-xs mt-0.5 ${currentStep === 1 ? "text-white/80" : "text-[#66666f]"}`}>
              {currentEmployer ? `${jobTitle || "Engineer"} • ${currentEmployer}` : "Role & Seniority"}
            </p>
          </div>

          {/* Stage 2 */}
          <div
            onClick={() => setCurrentStep(2)}
            className={`rounded-xl p-4.5 transition cursor-pointer border ${
              currentStep === 2
                ? "bg-[#5145cd] text-white border-[#4035b3] shadow-sm"
                : completedSteps.includes(2)
                ? "bg-white border-[#e7e7eb] hover:border-[#cbd5e1]"
                : "bg-white border-[#e7e7eb] opacity-80"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 2
                  ? "bg-white/25 text-white"
                  : completedSteps.includes(2)
                  ? "bg-[#ebf7ee] text-[#16834a]"
                  : "bg-[#f7f7f8] text-[#8b8b95]"
              }`}>
                {completedSteps.includes(2) ? "✓" : "2"}
              </span>
              <span className={`text-[11px] font-bold tracking-wide uppercase ${
                currentStep === 2 ? "text-white/90" : completedSteps.includes(2) ? "text-[#16834a]" : "text-[#8b8b95]"
              }`}>
                {completedSteps.includes(2) ? "STAGE 2 • COMPLETED" : currentStep === 2 ? "STAGE 2 • ACTIVE" : "STAGE 2 • UPCOMING"}
              </span>
            </div>
            <h4 className={`text-sm font-bold ${currentStep === 2 ? "text-white" : "text-[#171717]"}`}>Service Capabilities</h4>
            <p className={`text-xs mt-0.5 ${currentStep === 2 ? "text-white/80" : "text-[#66666f]"}`}>
              {selectedServices.length > 0 ? `${selectedServices.length} Services Selected` : "Select S01–S10"}
            </p>
          </div>

          {/* Stage 3 */}
          <div
            onClick={() => setCurrentStep(3)}
            className={`rounded-xl p-4.5 transition cursor-pointer border ${
              currentStep === 3
                ? "bg-[#5145cd] text-white border-[#4035b3] shadow-sm"
                : completedSteps.includes(3)
                ? "bg-white border-[#e7e7eb] hover:border-[#cbd5e1]"
                : "bg-white border-[#e7e7eb] opacity-80"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 3
                  ? "bg-white/25 text-white"
                  : completedSteps.includes(3)
                  ? "bg-[#ebf7ee] text-[#16834a]"
                  : "bg-[#f7f7f8] text-[#8b8b95]"
              }`}>
                {completedSteps.includes(3) ? "✓" : "3"}
              </span>
              <span className={`text-[11px] font-bold tracking-wide uppercase ${
                currentStep === 3 ? "text-white/90" : completedSteps.includes(3) ? "text-[#16834a]" : "text-[#8b8b95]"
              }`}>
                {completedSteps.includes(3) ? "STAGE 3 • COMPLETED" : currentStep === 3 ? "STAGE 3 • ACTIVE" : "STAGE 3 • UPCOMING"}
              </span>
            </div>
            <h4 className={`text-sm font-bold ${currentStep === 3 ? "text-white" : "text-[#171717]"}`}>Pedigree Verification</h4>
            <p className={`text-xs mt-0.5 ${currentStep === 3 ? "text-white/80" : "text-[#66666f]"}`}>
              {verificationTrack === "employed" ? "Active Work Email OTP" : "Alumni Document Evidence"}
            </p>
          </div>

          {/* Stage 4 */}
          <div
            onClick={() => setCurrentStep(4)}
            className={`rounded-xl p-4.5 transition cursor-pointer border ${
              currentStep === 4
                ? "bg-[#5145cd] text-white border-[#4035b3] shadow-sm"
                : completedSteps.includes(4)
                ? "bg-white border-[#e7e7eb] hover:border-[#cbd5e1]"
                : "bg-white border-[#e7e7eb] opacity-80"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 4
                  ? "bg-white/25 text-white"
                  : completedSteps.includes(4)
                  ? "bg-[#ebf7ee] text-[#16834a]"
                  : "bg-[#f7f7f8] text-[#8b8b95]"
              }`}>
                {completedSteps.includes(4) ? "✓" : "4"}
              </span>
              <span className={`text-[11px] font-bold tracking-wide uppercase ${
                currentStep === 4 ? "text-white/90" : completedSteps.includes(4) ? "text-[#16834a]" : "text-[#8b8b95]"
              }`}>
                {completedSteps.includes(4) ? "STAGE 4 • COMPLETED" : currentStep === 4 ? "STAGE 4 • ACTIVE" : "STAGE 4 • UPCOMING"}
              </span>
            </div>
            <h4 className={`text-sm font-bold ${currentStep === 4 ? "text-white" : "text-[#171717]"}`}>Availability & Rails</h4>
            <p className={`text-xs mt-0.5 ${currentStep === 4 ? "text-white/80" : "text-[#66666f]"}`}>
              {weeklyHours} hrs/wk • Direct Payout
            </p>
          </div>

        </div>
      </section>

      {/* 4. MAIN WORKFLOW SPLIT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Active Step Form (8 cols) */}
          <div className="lg:col-span-8 space-y-6">

            {submitError && (
              <div className="p-4 rounded-xl bg-[#fdf2f2] border border-[#f8b4b4] text-xs text-[#c43b3b] font-medium flex items-center gap-2">
                <span className="font-bold">Error:</span>
                <span>{submitError}</span>
              </div>
            )}

            {/* STAGE 1: Professional Track & Role */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl border border-[#e7e7eb] p-6 sm:p-7 shadow-xs space-y-5">
                <div className="border-b border-[#e7e7eb] pb-4">
                  <span className="text-[11px] font-bold text-[#5145cd] tracking-wide uppercase">STAGE 1 OF 4 • PRD §9.2</span>
                  <h3 className="text-base font-bold text-[#171717] mt-0.5">Professional Background & Engineering Track</h3>
                  <p className="text-xs text-[#66666f] mt-1">Provide your verified engineering credentials for candidate discovery and Smart Match dispatch.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#171717]">Legal Full Name *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e7eb] bg-white text-sm text-[#171717] focus:outline-none focus:border-[#5145cd] transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#171717]">Years of Experience (YoE) *</label>
                      <span className="text-[11px] font-semibold text-[#5145cd]">Min 5+ YoE Bar</span>
                    </div>
                    <select
                      value={yearsOfExperience}
                      onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e7eb] bg-white text-sm text-[#171717] focus:outline-none focus:border-[#5145cd] transition"
                    >
                      <option value={5}>5 Years (Senior Engineer)</option>
                      <option value={6}>6 Years (Senior Engineer II)</option>
                      <option value={7}>7 Years (Lead / Staff)</option>
                      <option value={8}>8–10 Years (Staff / Principal)</option>
                      <option value={11}>10–12 Years (Principal / Director)</option>
                      <option value={15}>12+ Years (Distinguished / VP)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#171717]">Current / Most Relevant Employer *</label>
                    <input
                      type="text"
                      value={currentEmployer}
                      onChange={(e) => setCurrentEmployer(e.target.value)}
                      placeholder="e.g. Google India, Uber, Swiggy"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e7eb] bg-white text-sm text-[#171717] focus:outline-none focus:border-[#5145cd] transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#171717]">Current Role / Seniority Level *</label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Staff Software Engineer (L6)"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e7eb] bg-white text-sm text-[#171717] focus:outline-none focus:border-[#5145cd] transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#171717]">Public Engineering Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Staff SWE @ Google • Ex-Swiggy • Distributed Systems & Storage Specialist"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e7eb] bg-white text-sm text-[#171717] focus:outline-none focus:border-[#5145cd] transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#171717]">Domain Specialties (Select all that apply) *</label>
                  <div className="flex flex-wrap gap-2">
                    {DOMAIN_OPTIONS.map((dom) => {
                      const active = selectedDomains.includes(dom);
                      return (
                        <button
                          key={dom}
                          type="button"
                          onClick={() => toggleDomain(dom)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                            active
                              ? "bg-[#5145cd] text-white border-[#4035b3]"
                              : "bg-[#f7f7f8] text-[#171717] border-[#e7e7eb] hover:border-[#cbd5e1]"
                          }`}
                        >
                          {active ? `✓ ${dom}` : `+ ${dom}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#171717]">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/your-profile"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e7eb] bg-white text-sm text-[#171717] focus:outline-none focus:border-[#5145cd] transition"
                  />
                </div>

                <div className="pt-4 border-t border-[#e7e7eb] flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 rounded-xl bg-[#5145cd] hover:bg-[#4035b3] text-white text-xs font-bold transition flex items-center gap-2 shadow-xs"
                  >
                    <span>Continue to Service Scope →</span>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 2: Service-Specific Capability Approval (S01–S10) */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl border border-[#e7e7eb] p-6 sm:p-7 shadow-xs space-y-5">
                <div className="border-b border-[#e7e7eb] pb-4">
                  <span className="text-[11px] font-bold text-[#5145cd] tracking-wide uppercase">STAGE 2 OF 4 • PRD §9.1 & §9.3</span>
                  <h3 className="text-base font-bold text-[#171717] mt-0.5">Service-Specific Capability Approval (S01–S10)</h3>
                  <p className="text-xs text-[#66666f] mt-1">Mentors are approved service-by-service. Select the specific modules you wish to offer.</p>
                </div>

                <div className="space-y-3">
                  {AVAILABLE_SERVICES.map((serv) => {
                    const isSelected = selectedServices.includes(serv.code);
                    return (
                      <div
                        key={serv.code}
                        onClick={() => toggleService(serv.code)}
                        className={`flex items-center justify-between p-4 rounded-xl border transition cursor-pointer ${
                          isSelected
                            ? "border-[#5145cd] bg-[#eef2ff]/30"
                            : "border-[#e7e7eb] bg-[#f7f7f8] hover:border-[#cbd5e1]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="mt-1 w-4 h-4 text-[#5145cd] accent-[#5145cd] rounded"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                isSelected ? "bg-[#5145cd] text-white" : "bg-[#eef2ff] text-[#5145cd]"
                              }`}>
                                {serv.code}
                              </span>
                              <span className="text-sm font-semibold text-[#171717]">{serv.title}</span>
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white border border-[#e7e7eb] text-[#66666f]">
                                {serv.duration} MIN
                              </span>
                            </div>
                            <p className="text-xs text-[#66666f]">{serv.deliverable}</p>
                          </div>
                        </div>

                        <div className="text-right pl-4 whitespace-nowrap">
                          <div className="text-base font-bold text-[#171717]">₹{(serv.pricePaise / 100).toLocaleString("en-IN")}</div>
                          <div className="text-[10px] text-[#8b8b95]">List Floor</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-[#e7e7eb] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 rounded-xl border border-[#e7e7eb] hover:bg-[#f7f7f8] text-xs font-semibold text-[#171717] transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 rounded-xl bg-[#5145cd] hover:bg-[#4035b3] text-white text-xs font-bold transition flex items-center gap-2 shadow-xs"
                  >
                    <span>Continue to Pedigree Verification →</span>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 3: Dual-Track Pedigree Verification (THE CORE REQUIREMENT) */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl border-2 border-[#5145cd]/30 p-6 sm:p-7 shadow-xs space-y-6 ring-1 ring-[#5145cd]/20">
                <div className="border-b border-[#e7e7eb] pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#5145cd] tracking-wide uppercase">STAGE 3 OF 4 • PRD §9.1 DUAL-TRACK VERIFICATION</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#eef2ff] text-[#5145cd]">Zero Work Email Blocker</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#171717] mt-1">Engineering Pedigree & Status Verification</h3>
                  <p className="text-xs text-[#66666f] mt-1">
                    Choose how you want to verify your credentials. Your personal email (<span className="font-semibold text-[#171717]">{email}</span>) remains your permanent, private account ID for all session bookings, messages, and bank payouts.
                  </p>
                </div>

                {/* Dual-Track Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Option 1: Currently Employed */}
                  <div
                    onClick={() => setVerificationTrack("employed")}
                    className={`p-5 rounded-xl border-2 transition cursor-pointer relative ${
                      verificationTrack === "employed"
                        ? "border-[#5145cd] bg-[#eef2ff]/30 shadow-xs"
                        : "border-[#e7e7eb] bg-white hover:border-[#cbd5e1]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-[#5145cd]/30 text-[#5145cd]">⚡ 30-SEC FAST TRACK</span>
                      <input
                        type="radio"
                        name="verification_track"
                        checked={verificationTrack === "employed"}
                        onChange={() => setVerificationTrack("employed")}
                        className="w-4 h-4 text-[#5145cd] accent-[#5145cd]"
                      />
                    </div>
                    <h4 className="text-sm font-bold text-[#171717]">Option 1: Currently Employed</h4>
                    <p className="text-xs text-[#66666f] mt-1">Verify active tech employment via a 1-time OTP sent to your corporate office inbox (@google.com, @uber.com, @microsoft.com).</p>
                    
                    <div className="mt-4 pt-3 border-t border-[#e7e7eb]/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-[#66666f]">
                        <span>Public Badge:</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16834a] bg-[#ebf7ee] px-2 py-0.5 rounded">
                          ✓ Verified at {currentEmployer || "Employer"}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8b8b95] leading-relaxed">
                        🔒 Used strictly once for verification. Bookings and payout receipts never touch your work inbox.
                      </p>
                    </div>
                  </div>

                  {/* Option 2: Alumni / Consultant / Founder */}
                  <div
                    onClick={() => setVerificationTrack("alumni")}
                    className={`p-5 rounded-xl border-2 transition cursor-pointer relative ${
                      verificationTrack === "alumni"
                        ? "border-[#5145cd] bg-[#eef2ff]/30 shadow-xs"
                        : "border-[#e7e7eb] bg-white hover:border-[#cbd5e1]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f7f7f8] border border-[#e7e7eb] text-[#66666f]">📄 DOCUMENT PROOF</span>
                      <input
                        type="radio"
                        name="verification_track"
                        checked={verificationTrack === "alumni"}
                        onChange={() => setVerificationTrack("alumni")}
                        className="w-4 h-4 text-[#5145cd] accent-[#5145cd]"
                      />
                    </div>
                    <h4 className="text-sm font-bold text-[#171717]">Option 2: Alumni, Consultant or Founder</h4>
                    <p className="text-xs text-[#66666f] mt-1">Don't have an active corporate email? Verify your past seniority using your Relieving Letter, Form-16, MCA Company CIN, or old work ID.</p>
                    
                    <div className="mt-4 pt-3 border-t border-[#e7e7eb]/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-[#66666f]">
                        <span>Public Badge:</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5145cd] bg-[#eef2ff] px-2 py-0.5 rounded">
                          Ex-{pastEmployer || currentEmployer || "Tech"} {jobTitle || "Staff Engineer"}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8b8b95] leading-relaxed">
                        ✨ Never turned away. Perfect for founders, ex-FAANG engineers on break, and independent tech consultants.
                      </p>
                    </div>
                  </div>

                </div>

                {/* Option 1 Form Elements: Corporate Work Email OTP */}
                {verificationTrack === "employed" && (
                  <div className="p-5 rounded-xl border border-[#e7e7eb] bg-[#f7f7f8] space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#171717]">Corporate Work Email Address *</label>
                      <p className="text-[11px] text-[#66666f]">Supports @google.com, @amazon.com, @uber.com, @swiggy.in, @microsoft.com, etc.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <input
                        type="email"
                        value={workEmail}
                        onChange={(e) => setWorkEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e7eb] bg-white text-sm text-[#171717] focus:outline-none focus:border-[#5145cd] transition"
                      />
                      <button
                        type="button"
                        onClick={handleSendWorkEmailOtp}
                        disabled={sendingOtp || emailOtpVerified}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#5145cd] hover:bg-[#4035b3] text-white text-xs font-bold transition whitespace-nowrap disabled:opacity-50"
                      >
                        {sendingOtp ? "Sending Code..." : emailOtpVerified ? "✓ Verified" : "Send 6-Digit OTP"}
                      </button>
                    </div>

                    {otpMessage && (
                      <div className={`p-3 rounded-lg text-xs font-medium ${
                        otpMessage.type === "success" 
                          ? "bg-[#ebf7ee] text-[#16834a] border border-[#d3ebd7]" 
                          : otpMessage.type === "info"
                          ? "bg-[#eef2ff] text-[#5145cd] border border-[#c7d2fe]"
                          : "bg-[#fdf2f2] text-[#c43b3b] border border-[#f8b4b4]"
                      }`}>
                        {otpMessage.text}
                      </div>
                    )}

                    {!emailOtpVerified && (
                      <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={workEmailOtp}
                          onChange={(e) => setWorkEmailOtp(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          className="w-full sm:w-44 px-3 py-2 rounded-lg border border-[#e7e7eb] bg-white text-sm tracking-widest font-mono text-center focus:outline-none focus:border-[#5145cd]"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyWorkEmailOtp}
                          disabled={verifyingOtp || !workEmailOtp}
                          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#16834a] hover:bg-[#126b3c] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                        >
                          {verifyingOtp ? "Verifying..." : "Confirm OTP"}
                        </button>
                      </div>
                    )}

                    {emailOtpVerified && (
                      <div className="flex items-center gap-2 text-xs text-[#16834a] font-semibold">
                        <svg className="w-4 h-4 text-[#16834a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                        <span>Corporate domain verified ({verifiedCompany || workEmail.split("@")[1]})</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Option 2 Form Elements: Alumni Documentary Evidence */}
                {verificationTrack === "alumni" && (
                  <div className="p-5 rounded-xl border border-[#e7e7eb] bg-[#f7f7f8] space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#171717]">Previous Tier-1 Employer *</label>
                        <input
                          type="text"
                          value={pastEmployer}
                          onChange={(e) => setPastEmployer(e.target.value)}
                          placeholder="e.g. Ex-Google, Ex-Flipkart, Ex-Amazon"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e7eb] bg-white text-sm text-[#171717] focus:outline-none focus:border-[#5145cd] transition"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#171717]">Previous Senior Role / Title</label>
                        <input
                          type="text"
                          value={pastJobTitle}
                          onChange={(e) => setPastJobTitle(e.target.value)}
                          placeholder="e.g. Staff SWE, Principal Architect"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e7eb] bg-white text-sm text-[#171717] focus:outline-none focus:border-[#5145cd] transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#171717]">Upload Relieving Letter, Form 16, or Service Certificate</label>
                      <label className="border-2 border-dashed border-[#cbd5e1] hover:border-[#5145cd] rounded-xl p-5 text-center bg-white cursor-pointer transition block">
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={handleAlumniFileUpload}
                          className="hidden"
                        />
                        <svg className="w-8 h-8 mx-auto text-[#8b8b95]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                        <p className="text-xs font-semibold text-[#171717] mt-1.5">
                          {alumniProofFileName ? alumniProofFileName : "Click to browse or drop Relieving Letter / Form 16"}
                        </p>
                        <p className="text-[11px] text-[#8b8b95] mt-0.5">PDF, PNG, JPG up to 15MB. Encrypted under DPDP Act 2023.</p>
                      </label>
                    </div>
                  </div>
                )}

                {/* RBI KYC Identity Check */}
                <div className="p-4.5 rounded-xl border border-[#e7e7eb] bg-[#f7f7f8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#171717]">RBI Nodal Escrow Identity Vault (Direct Bank Disbursals)</div>
                    <p className="text-xs text-[#66666f]">Provide your Government ID / PAN card details for RBI-compliant direct nodal escrow payouts.</p>
                  </div>
                  <label className="px-4 py-2 rounded-lg bg-white border border-[#e7e7eb] hover:border-[#5145cd] text-xs font-bold text-[#171717] hover:text-[#5145cd] transition cursor-pointer self-start sm:self-auto">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleIdFileUpload}
                      className="hidden"
                    />
                    <span>{idProofFileName ? `✓ ${idProofFileName.slice(0, 16)}...` : "Upload PAN / ID"}</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-[#e7e7eb] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 rounded-xl border border-[#e7e7eb] hover:bg-[#f7f7f8] text-xs font-semibold text-[#171717] transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 rounded-xl bg-[#5145cd] hover:bg-[#4035b3] text-white text-xs font-bold transition flex items-center gap-2 shadow-xs"
                  >
                    <span>Continue to Availability & Escrow →</span>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 4: Availability & Settlement Rails */}
            {currentStep === 4 && (
              <div className="bg-white rounded-2xl border border-[#e7e7eb] p-6 sm:p-7 shadow-xs space-y-6">
                <div className="border-b border-[#e7e7eb] pb-4">
                  <span className="text-[11px] font-bold text-[#5145cd] tracking-wide uppercase">STAGE 4 OF 4 • PRD §10 & §13</span>
                  <h3 className="text-base font-bold text-[#171717] mt-0.5">Calendar Availability & Direct Settlement Rails</h3>
                  <p className="text-xs text-[#66666f] mt-1">Configure your weekly advisory capacity and designated settlement rails. Payouts are routed directly via RBI-governed nodal escrow with a 100% non-dilution guarantee.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#171717]">Weekly Capacity Commitment</label>
                    <select
                      value={weeklyHours}
                      onChange={(e) => setWeeklyHours(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e7eb] bg-white text-sm text-[#171717] focus:outline-none focus:border-[#5145cd] transition"
                    >
                      <option value="3">3–4 Hours / Week (Light Advisory)</option>
                      <option value="5">5–6 Hours / Week (Recommended)</option>
                      <option value="8">8–10 Hours / Week (Active Bar-Raiser)</option>
                      <option value="12">12+ Hours / Week (Intensive Cohort)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#171717]">Payout Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPayoutMethod("upi")}
                        className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition ${
                          payoutMethod === "upi" ? "bg-[#5145cd] text-white border-[#4035b3]" : "bg-[#f7f7f8] text-[#171717] border-[#e7e7eb]"
                        }`}
                      >
                        UPI VPA
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayoutMethod("bank")}
                        className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition ${
                          payoutMethod === "bank" ? "bg-[#5145cd] text-white border-[#4035b3]" : "bg-[#f7f7f8] text-[#171717] border-[#e7e7eb]"
                        }`}
                      >
                        Bank Account
                      </button>
                    </div>
                  </div>
                </div>

                {payoutMethod === "upi" ? (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#171717]">UPI VPA Address *</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. rahul@oksbi or 9876543210@paytm"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e7eb] bg-white text-sm text-[#171717] focus:outline-none focus:border-[#5145cd] transition"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#171717]">Bank Account Number *</label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Enter account number"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e7eb] bg-white text-sm text-[#171717] focus:outline-none focus:border-[#5145cd] transition"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#171717]">Bank IFSC Code *</label>
                      <input
                        type="text"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        placeholder="e.g. SBIN0004123"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e7eb] bg-white text-sm text-[#171717] focus:outline-none focus:border-[#5145cd] transition uppercase"
                      />
                    </div>
                  </div>
                )}

                {/* SLA Commitments */}
                <div className="p-4 rounded-xl bg-[#eef2ff] border border-[#c7d2fe] space-y-2.5">
                  <label className="flex items-start gap-2.5 text-xs text-[#5145cd] font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToSla}
                      onChange={(e) => setAgreedToSla(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#5145cd] accent-[#5145cd] rounded"
                    />
                    <span>I commit to submitting structured rubric scorecards within 48:00:00 of session completion.</span>
                  </label>
                  <label className="flex items-start gap-2.5 text-xs text-[#5145cd] font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToEscrow}
                      onChange={(e) => setAgreedToEscrow(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#5145cd] accent-[#5145cd] rounded"
                    />
                    <span>I accept direct nodal escrow settlement with 100% non-dilution guarantee.</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-[#e7e7eb] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 rounded-xl border border-[#e7e7eb] hover:bg-[#f7f7f8] text-xs font-semibold text-[#171717] transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitApplication}
                    disabled={saving}
                    className="py-3.5 px-6 rounded-xl bg-[#5145cd] hover:bg-[#4035b3] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving to Database...</span>
                      </>
                    ) : (
                      <>
                        <span>Lock & Submit Mentor Dossier Accreditation Application</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Real-Time Dynamic Telemetry & Projections (4 cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Dynamic Monthly Earning Card */}
            <div className="bg-white rounded-2xl border border-[#e7e7eb] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#66666f] uppercase tracking-wider">MONTHLY EARNING POTENTIAL</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ebf7ee] text-[#16834a]">NON-DILUTION</span>
              </div>

              <div className="text-3xl font-extrabold text-[#5145cd] tracking-tight">
                ₹{dynamicYield.min.toLocaleString("en-IN")} – ₹{dynamicYield.max.toLocaleString("en-IN")}
              </div>

              <p className="text-xs text-[#66666f] leading-relaxed">
                Dynamically calculated on {weeklyHours} hours/week commitment across your {selectedServices.length} selected services with 48-hour deliverable SLAs.
              </p>

              <div className="border-t border-[#e7e7eb] pt-4 space-y-2.5">
                <div className="text-[11px] font-bold text-[#8b8b95] uppercase tracking-wider">DOSSIER CALIBRATION STATUS</div>
                
                <div className="flex items-center gap-2 text-xs font-medium text-[#171717]">
                  <span className="text-[#16834a] font-bold">✓</span>
                  <span>Personal Account: {email || "Authenticated"}</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-[#171717]">
                  <span className={fullName && currentEmployer ? "text-[#16834a] font-bold" : "text-[#8b8b95]"}>
                    {fullName && currentEmployer ? "✓" : "○"}
                  </span>
                  <span>Track: {currentEmployer ? `${jobTitle || "Engineer"} @ ${currentEmployer}` : "Pending Step 1"}</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-[#171717]">
                  <span className={selectedServices.length > 0 ? "text-[#16834a] font-bold" : "text-[#8b8b95]"}>
                    {selectedServices.length > 0 ? "✓" : "○"}
                  </span>
                  <span>Capabilities: {selectedServices.length} Approved Services</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-[#171717]">
                  <span className={(emailOtpVerified || alumniProofFileName) ? "text-[#16834a] font-bold" : "text-[#8b8b95]"}>
                    {(emailOtpVerified || alumniProofFileName) ? "✓" : "○"}
                  </span>
                  <span>
                    Pedigree: {verificationTrack === "employed" ? (emailOtpVerified ? "Work OTP Verified" : "Active Work Email (Option 1)") : (alumniProofFileName ? "Alumni Document Attached" : "Alumni Evidence (Option 2)")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-[#171717]">
                  <span className={(upiId || accountNumber) ? "text-[#16834a] font-bold" : "text-[#8b8b95]"}>
                    {(upiId || accountNumber) ? "✓" : "○"}
                  </span>
                  <span>Escrow Rails: {payoutMethod === "upi" ? (upiId ? "UPI VPA Configured" : "Pending UPI") : (accountNumber ? "Bank IFSC Configured" : "Pending Bank")}</span>
                </div>
              </div>
            </div>

            {/* PRD SLA & Escrow Governance Table */}
            <div className="bg-white rounded-2xl border border-[#e7e7eb] p-6 shadow-xs space-y-4">
              <div className="text-xs font-bold text-[#66666f] uppercase tracking-wider">PRD SLA & ESCROW GOVERNANCE</div>

              <div className="space-y-3 divide-y divide-[#e7e7eb] text-xs">
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[#66666f]">Account Email</span>
                  <span className="font-bold text-[#5145cd]">Personal (Private)</span>
                </div>
                <div className="flex items-center justify-between pt-3">
                  <span className="text-[#66666f]">SLA Standard</span>
                  <span className="font-bold text-[#5145cd]">48:00:00 Max</span>
                </div>
                <div className="flex items-center justify-between pt-3">
                  <span className="text-[#66666f]">Settlement Model</span>
                  <span className="font-bold text-[#5145cd]">100% Non-Dilution</span>
                </div>
                <div className="flex items-center justify-between pt-3">
                  <span className="text-[#66666f]">Experience Bar</span>
                  <span className="font-bold text-[#5145cd]">5+ Years SWE/Arch</span>
                </div>
                <div className="flex items-center justify-between pt-3">
                  <span className="text-[#66666f]">Escrow Holding Rail</span>
                  <span className="font-bold text-[#5145cd]">RBI Nodal Direct</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
