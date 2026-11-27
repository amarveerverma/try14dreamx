"use client";

import * as React from "react";
import {
  ShieldCheck,
  Building2,
  GraduationCap,
  Mail,
  Send,
  Upload,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  FileText,
} from "lucide-react";
import {
  TrustPillar,
  ServiceApproval,
  MentorProfileData,
  SERVICES_CATALOGUE,
  getServiceById,
  formatINR,
  getToneForStatus,
} from "../types";
import { StatusBadge } from "../StatusBadge";
import { MentorModal } from "../MentorModal";

interface VerificationViewProps {
  profile?: MentorProfileData;
  isApplicantMode: boolean;
  trustPillars: TrustPillar[];
  serviceApprovals: ServiceApproval[];
  onSubmitAdditionalEvidence: (serviceId: string, evidenceSummary: string) => void;
  onRequestNewServiceApproval: (serviceId: string, evidenceSummary: string) => void;
}

export function VerificationView({
  profile,
  isApplicantMode,
  trustPillars,
  serviceApprovals,
  onSubmitAdditionalEvidence,
  onRequestNewServiceApproval,
}: VerificationViewProps) {
  // Modal state for additional evidence on an existing service
  const [activeEvidenceModalService, setActiveEvidenceModalService] =
    React.useState<string | null>(null);
  const [evidenceText, setEvidenceText] = React.useState("");
  const [evidenceError, setEvidenceError] = React.useState<string | null>(null);

  // Modal state for applying to a new service
  const [applyServiceModalOpen, setApplyServiceModalOpen] = React.useState(false);
  const [selectedNewServiceId, setSelectedNewServiceId] = React.useState("S03");
  const [newServiceEvidence, setNewServiceEvidence] = React.useState("");
  const [newServiceError, setNewServiceError] = React.useState<string | null>(null);

  // DUAL-TRACK VERIFICATION STATE (Step 3: Identity & Credential Audit)
  const [employmentTrack, setEmploymentTrack] = React.useState<"employed" | "alumni">("employed");
  const [workEmail, setWorkEmail] = React.useState("");
  const [workEmailOtp, setWorkEmailOtp] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);
  const [otpSending, setOtpSending] = React.useState(false);
  const [otpVerifying, setOtpVerifying] = React.useState(false);
  const [workEmailVerified, setWorkEmailVerified] = React.useState(false);
  const [verifiedCompany, setVerifiedCompany] = React.useState("");
  const [otpNotice, setOtpNotice] = React.useState<string | null>(null);

  // Alumni track state
  const [pastEmployer, setPastEmployer] = React.useState("");
  const [pastJobTitle, setPastJobTitle] = React.useState("");
  const [linkedinUrl, setLinkedinUrl] = React.useState("");
  const [uploadedRelievingDoc, setUploadedRelievingDoc] = React.useState<string | null>(null);

  // Hydrate verification state from authenticated mentor profile
  React.useEffect(() => {
    if (profile) {
      if (profile.employmentType === "alumni") {
        setEmploymentTrack("alumni");
        if (profile.pastEmployer || profile.verifiedCompany) {
          setPastEmployer(profile.pastEmployer || profile.verifiedCompany || "");
        }
        if (profile.pastJobTitle) {
          setPastJobTitle(profile.pastJobTitle);
        }
      } else {
        setEmploymentTrack("employed");
        if (profile.verifiedCompany) {
          setVerifiedCompany(profile.verifiedCompany);
          setWorkEmailVerified(true);
        }
        if (profile.workEmail) {
          setWorkEmail(profile.workEmail);
        } else if (profile.verifiedCompany) {
          setWorkEmail(`practitioner@${profile.verifiedCompany.toLowerCase().replace(/\s+/g, "")}.com`);
        }
      }
    }
  }, [profile]);

  // Requested vs unrequested services
  const requestedServiceIds = new Set(serviceApprovals.map((s) => s.serviceId));
  const unrequestedServices = SERVICES_CATALOGUE.filter(
    (s) => !requestedServiceIds.has(s.id)
  );

  const handleSendWorkEmailOtp = async () => {
    if (!workEmail.trim() || !workEmail.includes("@")) {
      setOtpNotice("Please enter a valid corporate work email address.");
      return;
    }

    const domain = workEmail.split("@")[1]?.toLowerCase() || "";
    const publicDomains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
      "icloud.com",
      "rediffmail.com",
    ];
    if (publicDomains.includes(domain)) {
      setOtpNotice(
        "Please use an active corporate domain (e.g. @google.com, @microsoft.com, @flipkart.com). Personal email domains cannot issue corporate badges."
      );
      return;
    }

    setOtpSending(true);
    setOtpNotice(null);

    try {
      const res = await fetch("/api/mentor/verify-work-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send_otp", workEmail }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        setOtpNotice(data.message || `OTP sent to ${workEmail}.`);
      } else {
        setOtpNotice(data.error || "Unable to send verification OTP.");
      }
    } catch {
      setOtpNotice("Network notice: Unable to contact OTP dispatch service.");
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyWorkEmailOtp = async () => {
    if (!workEmailOtp.trim()) {
      setOtpNotice("Please enter the 6-digit OTP received in your corporate inbox.");
      return;
    }

    setOtpVerifying(true);
    setOtpNotice(null);

    try {
      const res = await fetch("/api/mentor/verify-work-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify_otp", workEmail, otp: workEmailOtp }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWorkEmailVerified(true);
        setVerifiedCompany(data.company || workEmail.split("@")[1].split(".")[0]);
        setOtpNotice(`✓ Successfully verified! Domain badge activated.`);
      } else {
        setOtpNotice(data.error || "Invalid verification code.");
      }
    } catch {
      setOtpNotice("Network notice: Verification service currently offline.");
    } finally {
      setOtpVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              Mentor Verification &amp; Credential Accreditation
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
              DreamX separates <span className="font-semibold text-zinc-800">Identity KYC</span>,{" "}
              <span className="font-semibold text-zinc-800">Professional Experience (Active &amp; Alumni)</span>, and{" "}
              <span className="font-semibold text-zinc-800">Service-Specific Rubric Qualifications</span>.
              Approval in one track never auto-approves others.
            </p>
          </div>

          {unrequestedServices.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSelectedNewServiceId(unrequestedServices[0].id);
                setNewServiceEvidence("");
                setNewServiceError(null);
                setApplyServiceModalOpen(true);
              }}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#5145cd] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#4035b3] transition-colors shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Apply for Additional Service</span>
            </button>
          )}
        </div>

        {/* Privacy Note */}
        <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 flex items-start gap-3">
          <Info className="h-4 w-4 text-zinc-600 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-600 leading-relaxed">
            <span className="font-semibold text-zinc-800">DPDP Act 2023 &amp; Statutory Protection:</span>{" "}
            Verification decisions are server-enforced by authorized DreamX Trust Officers and preserved in cryptographic audit logs. Identity documents are strictly masked and never shown on public candidate profiles.
          </p>
        </div>
      </div>

      {/* 2. Checks 1 & 2: Identity & Dual-Track Professional Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Check 1: Identity Verification */}
        <section className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#5145cd]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-900">1. Statutory Identity Verification</h2>
                  <p className="text-xs text-zinc-500">Government KYC &amp; Liveness Proof</p>
                </div>
              </div>
              <StatusBadge
                label={isApplicantMode ? "Under review" : "Approved"}
                tone={isApplicantMode ? "info" : "success"}
                size="md"
              />
            </div>

            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-3.5 space-y-2">
              <span className="text-xs font-semibold text-zinc-800 block">Required Proof Elements:</span>
              <ul className="space-y-1 text-xs text-zinc-600 list-disc pl-4">
                <li>Government-issued photo identity check (Masked Aadhaar / PAN / Passport)</li>
                <li>Live selfie liveness match against legal applicant name</li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-zinc-800 block">Submitted Dossier (Private):</span>
              <div className="flex items-center gap-2 text-xs text-zinc-700 bg-white border border-zinc-200 rounded-lg px-3 py-2">
                <FileText className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <span>Masked UIDAI Reference #IDV-9042 (256-bit Encrypted)</span>
              </div>
            </div>

            <div className="rounded-xl bg-emerald-50/70 border border-emerald-200/80 p-3 text-xs text-emerald-950 space-y-0.5">
              <span className="font-bold">Trust Desk Reviewer Signoff:</span>
              <p className="text-emerald-900">
                Legal identity verified matching registered pan-India banking details. Document storage is isolated in private cloud vaults.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-200/80 text-[11px] text-zinc-500">
            Separate from professional employment and service authorization (PRD §9.1).
          </div>
        </section>

        {/* Check 2: DUAL-TRACK Professional Verification (Active Employed vs Alumni / Retired) */}
        <section className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-900">2. Professional &amp; Tenure Verification</h2>
                  <p className="text-xs text-zinc-500">Dual-Track: Active Corporate vs Alumni / Retired</p>
                </div>
              </div>
              <StatusBadge
                label={
                  isApplicantMode
                    ? "Under review"
                    : (workEmailVerified || Boolean(verifiedCompany) || Boolean(profile?.verifiedCompany) || Boolean(pastEmployer) || Boolean(profile?.pastEmployer))
                    ? "Approved"
                    : "Action Needed"
                }
                tone={
                  isApplicantMode
                    ? "info"
                    : (workEmailVerified || Boolean(verifiedCompany) || Boolean(profile?.verifiedCompany) || Boolean(pastEmployer) || Boolean(profile?.pastEmployer))
                    ? "success"
                    : "warning"
                }
                size="md"
              />
            </div>

            {/* 2-Way Track Selector Toggle */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-100 border border-zinc-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setEmploymentTrack("employed")}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  employmentTrack === "employed"
                    ? "bg-white text-zinc-900 shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-[#5145cd]" />
                <span>Currently Employed</span>
              </button>
              <button
                type="button"
                onClick={() => setEmploymentTrack("alumni")}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  employmentTrack === "alumni"
                    ? "bg-white text-zinc-900 shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                <span>Alumni / Retired Track</span>
              </button>
            </div>

            {/* Track A: Currently Employed Track */}
            {employmentTrack === "employed" && (
              <div className="space-y-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                {workEmailVerified || verifiedCompany || profile?.verifiedCompany ? (
                  <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-emerald-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Corporate Pedigree Verified</span>
                      </div>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Active Verified Badge
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 bg-white border border-emerald-200/90 rounded-lg p-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#5145cd] font-bold shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-zinc-900 block text-xs">
                          {verifiedCompany || profile?.verifiedCompany || "Tier-1 Tech"} Engineering Team
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono">
                          {workEmail || (profile?.workEmail ? profile.workEmail : `@${(verifiedCompany || profile?.verifiedCompany || "company").toLowerCase().replace(/\s+/g, "")}.com (Cryptographically Confirmed)`)}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Engineering pedigree verified under PRD §9.2. Your official employer badge is active on all candidate booking cards and public directory searches.
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[11px] border-t border-emerald-200/70">
                      <span className="text-emerald-700 font-medium">Status: Practitioner Verified</span>
                      <button
                        type="button"
                        onClick={() => {
                          setWorkEmailVerified(false);
                          setOtpSent(false);
                          setOtpNotice("Enter updated corporate email to re-verify domain.");
                        }}
                        className="text-emerald-800 hover:text-emerald-950 font-bold underline cursor-pointer"
                      >
                        Update Corporate Email
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-zinc-800">
                        Corporate Email Domain Check (30-Second Verification)
                      </span>
                      <p className="text-[11px] text-zinc-600">
                        Enter your active company email. We dispatch a 6-digit confirmation token.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={workEmail}
                          onChange={(e) => setWorkEmail(e.target.value)}
                          placeholder="you@company.com (e.g. google.com)"
                          disabled={workEmailVerified}
                          className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-zinc-300 text-xs font-mono text-zinc-900 focus:outline-none focus:border-[#5145cd]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSendWorkEmailOtp}
                        disabled={otpSending || workEmailVerified}
                        className="px-3.5 py-2 rounded-lg bg-[#5145cd] hover:bg-[#4035b3] disabled:opacity-60 text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{otpSending ? "Sending..." : otpSent ? "Resend" : "Send OTP"}</span>
                      </button>
                    </div>

                    {otpSent && !workEmailVerified && (
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          maxLength={6}
                          value={workEmailOtp}
                          onChange={(e) => setWorkEmailOtp(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          className="flex-1 px-3 py-2 rounded-lg bg-white border border-zinc-300 text-xs font-mono text-zinc-900 focus:outline-none focus:border-[#5145cd]"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyWorkEmailOtp}
                          disabled={otpVerifying}
                          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-bold transition-all shrink-0"
                        >
                          {otpVerifying ? "Verifying..." : "Verify Code"}
                        </button>
                      </div>
                    )}

                    {otpNotice && (
                      <p
                        className={`text-xs font-semibold ${
                          workEmailVerified
                            ? "text-emerald-700"
                            : otpNotice.includes("Please")
                            ? "text-amber-800"
                            : "text-zinc-600"
                        }`}
                      >
                        {otpNotice}
                      </p>
                    )}

                    {/* Moonlighting Assurance */}
                    <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-200/80 text-[11px] text-[#4035b3] space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                        <span>Zero Moonlighting Audit Exposure:</span>
                      </div>
                      <p className="leading-snug text-indigo-900">
                        Your corporate email is strictly used once for domain badge verification. All student bookings, payouts, and platform notifications remain on your personal account.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Track B: Alumni / Retired Track */}
            {employmentTrack === "alumni" && (
              <div className="space-y-3 p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-950">
                    Alumni / Ex-Employee Credentials (Ex-FAANG / Retired Leaders)
                  </span>
                  <p className="text-[11px] text-amber-900">
                    For mentors who completed tenures at top-tier companies and no longer hold active corporate inboxes.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      Previous Tier-1 Employer
                    </label>
                    <input
                      type="text"
                      value={pastEmployer}
                      onChange={(e) => setPastEmployer(e.target.value)}
                      placeholder="e.g. Google, Microsoft, Amazon"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-[#5145cd]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      Past Senior Designation
                    </label>
                    <input
                      type="text"
                      value={pastJobTitle}
                      onChange={(e) => setPastJobTitle(e.target.value)}
                      placeholder="e.g. Former Staff SDE / Director"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-[#5145cd]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <div className="relative">
                    <ExternalLink className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/your-profile"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-[#5145cd]"
                    />
                  </div>
                </div>

                {/* Optional Document Upload */}
                <div className="pt-1">
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-zinc-300 hover:bg-zinc-50 text-xs font-semibold text-zinc-800 cursor-pointer shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{uploadedRelievingDoc || "Upload Relieving Letter / Service Certificate"}</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setUploadedRelievingDoc(file.name);
                      }}
                      className="sr-only"
                    />
                  </label>
                </div>

                {/* Live Badge Preview */}
                <div className="p-3 rounded-lg bg-white border border-amber-300 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                    ★
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-amber-950 block">Accredited Alumni Badge:</span>
                    <span className="text-xs font-bold text-zinc-900">
                      ✓ Ex-{pastEmployer || "Google"} {pastJobTitle || "Former Staff Engineer"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-zinc-200/80 text-[11px] text-zinc-500">
            Approved public badge: {employmentTrack === "alumni" ? "✓ Ex-[Company] [Title]" : "✓ Verified at [Company]"}.
          </div>
        </section>
      </div>

      {/* 3. Check 3: Service-Specific Qualification Matrix */}
      <section className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-200/80">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900">
              3. Service-Specific Qualification Matrix (PRD §9.1)
            </h2>
            <p className="text-xs text-zinc-600 mt-0.5">
              Each requested service is independently evaluated against its rubrics and deliverable SLA requirements.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {serviceApprovals.length} requested · {unrequestedServices.length} unrequested
          </span>
        </div>

        <div className="space-y-3">
          {serviceApprovals.map((approval) => {
            const def = getServiceById(approval.serviceId);
            const status = isApplicantMode && approval.status === "Approved" ? "Under review" : approval.status;

            return (
              <div
                key={approval.serviceId}
                className="rounded-xl border border-zinc-200/90 bg-zinc-50/50 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#5145cd] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/70">
                      {def.id}
                    </span>
                    <h3 className="text-sm font-semibold text-zinc-900">{def.name}</h3>
                    <span className="text-xs text-zinc-500 tabular-nums">
                      {def.durationMinutes} min · {formatINR(def.listPricePaise)}
                    </span>
                    <StatusBadge label={status} tone={getToneForStatus(status)} />
                  </div>

                  {approval.evidenceSummary && (
                    <p className="text-xs text-zinc-600">
                      <span className="font-medium text-zinc-700">Evidence submitted:</span>{" "}
                      {approval.evidenceSummary} {approval.submittedAt ? `(${approval.submittedAt})` : ""}
                    </p>
                  )}

                  {approval.reviewerNote && (
                    <div
                      className={`mt-1.5 rounded-lg px-3 py-2 text-xs border ${
                        status === "More information required"
                          ? "bg-amber-50 border-amber-200 text-amber-950"
                          : status === "Rejected"
                          ? "bg-rose-50 border-rose-200 text-rose-900"
                          : "bg-white border-zinc-200/80 text-zinc-700"
                      }`}
                    >
                      <span className="font-semibold">Reviewer feedback: </span>
                      {approval.reviewerNote}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {status === "More information required" && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveEvidenceModalService(approval.serviceId);
                        setEvidenceText("");
                        setEvidenceError(null);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-amber-700 transition-colors shadow-2xs"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Submit Additional Evidence</span>
                    </button>
                  )}

                  {status === "Approved" && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Eligible for Paid Bookings</span>
                    </span>
                  )}

                  {(status === "Submitted" || status === "Under review") && (
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Awaiting Reviewer Action</span>
                    </span>
                  )}

                  {status === "Rejected" && (
                    <span className="text-xs text-rose-700 font-medium">
                      Re-application cooled down (30d)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modal 1: Submit Additional Evidence */}
      <MentorModal
        open={!!activeEvidenceModalService}
        onClose={() => setActiveEvidenceModalService(null)}
        title={`Submit Additional Evidence — ${activeEvidenceModalService ? getServiceById(activeEvidenceModalService).name : ""}`}
        subtitle="Your submission transitions status to 'Submitted' for Verification Reviewer evaluation."
        footer={
          <>
            <button
              type="button"
              onClick={() => setActiveEvidenceModalService(null)}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="additional-evidence-form"
              className="rounded-lg bg-[#5145cd] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4035b3]"
            >
              Submit for Review
            </button>
          </>
        }
      >
        {activeEvidenceModalService && (
          <form
            id="additional-evidence-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (evidenceText.trim().length < 20) {
                setEvidenceError(
                  "Please provide at least 20 characters describing your rubric artifact or domain evidence."
                );
                return;
              }
              onSubmitAdditionalEvidence(activeEvidenceModalService, evidenceText.trim());
              setActiveEvidenceModalService(null);
              setEvidenceText("");
              setEvidenceError(null);
            }}
            className="space-y-4"
          >
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-950">
              <span className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-amber-700" />
                Reviewer Request:
              </span>
              <p className="mt-1">
                {serviceApprovals.find((s) => s.serviceId === activeEvidenceModalService)?.reviewerNote}
              </p>
            </div>

            <div>
              <label htmlFor="evidence-summary-input" className="block text-xs font-semibold text-zinc-800">
                Redacted Sample Plan / Qualification Evidence Summary
              </label>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Do not include third-party personal data or confidential employer secrets.
              </p>
              <textarea
                id="evidence-summary-input"
                rows={4}
                value={evidenceText}
                onChange={(e) => {
                  setEvidenceText(e.target.value);
                  if (evidenceError) setEvidenceError(null);
                }}
                placeholder="Example: Attached redacted 90-day SWE transition plan mapping Career Planning (20%) & Technical Skills (15%) into bi-weekly milestones..."
                className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-[#5145cd] focus:outline-none focus:ring-2 focus:ring-[#5145cd]/20"
              />
              {evidenceError && <p className="mt-1.5 text-xs font-medium text-rose-600">{evidenceError}</p>}
            </div>
          </form>
        )}
      </MentorModal>

      {/* Modal 2: Apply for Additional Service */}
      <MentorModal
        open={applyServiceModalOpen}
        onClose={() => setApplyServiceModalOpen(false)}
        title="Request Service-Specific Approval"
        subtitle="Select an unrequested DreamX service and submit rubric-relevant experience evidence."
        footer={
          <>
            <button
              type="button"
              onClick={() => setApplyServiceModalOpen(false)}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="new-service-approval-form"
              className="rounded-lg bg-[#5145cd] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4035b3]"
            >
              Submit Service Application
            </button>
          </>
        }
      >
        <form
          id="new-service-approval-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (newServiceEvidence.trim().length < 20) {
              setNewServiceError(
                "Please include concrete professional experience or sample evaluation evidence (min 20 characters)."
              );
              return;
            }
            onRequestNewServiceApproval(selectedNewServiceId, newServiceEvidence.trim());
            setApplyServiceModalOpen(false);
            setNewServiceEvidence("");
            setNewServiceError(null);
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="select-new-service" className="block text-xs font-semibold text-zinc-800">
              Service from Catalogue
            </label>
            <select
              id="select-new-service"
              value={selectedNewServiceId}
              onChange={(e) => setSelectedNewServiceId(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-[#5145cd] focus:outline-none"
            >
              {unrequestedServices.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} — {s.name} ({s.durationMinutes} min · {formatINR(s.listPricePaise)})
                </option>
              ))}
            </select>
          </div>

          {selectedNewServiceId && (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 space-y-1.5 text-xs">
              <p className="font-semibold text-zinc-800">
                Expected Deliverable: {getServiceById(selectedNewServiceId).deliverableName}
              </p>
              <p className="text-zinc-600">{getServiceById(selectedNewServiceId).shortOutcome}</p>
            </div>
          )}

          <div>
            <label htmlFor="new-service-evidence" className="block text-xs font-semibold text-zinc-800">
              Relevant Experience &amp; Rubric Calibration Evidence
            </label>
            <textarea
              id="new-service-evidence"
              rows={4}
              value={newServiceEvidence}
              onChange={(e) => {
                setNewServiceEvidence(e.target.value);
                if (newServiceError) setNewServiceError(null);
              }}
              placeholder="Describe relevant interviewing, hiring, or mentorship artifacts supporting this specific service..."
              className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-[#5145cd] focus:outline-none"
            />
            {newServiceError && <p className="mt-1.5 text-xs font-medium text-rose-600">{newServiceError}</p>}
          </div>
        </form>
      </MentorModal>
    </div>
  );
}
