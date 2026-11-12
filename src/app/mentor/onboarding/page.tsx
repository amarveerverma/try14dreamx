"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MentorOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(3);
  const [workEmail, setWorkEmail] = React.useState("vikram.singh@google.com");
  const [emailOtpVerified, setEmailOtpVerified] = React.useState(true);
  const [idType, setIdType] = React.useState("aadhaar");
  const [idNumber, setIdNumber] = React.useState("•••• •••• 8912");
  const [showId, setShowId] = React.useState(false);
  const [uploadedBadge, setUploadedBadge] = React.useState<string | null>(null);
  const [showSampleGuide, setShowSampleGuide] = React.useState(false);
  const [weeklyHours, setWeeklyHours] = React.useState("6");
  const [saving, setSaving] = React.useState(false);
  const [successNotice, setSuccessNotice] = React.useState(false);

  const calculateProjectedYield = (hours: number) => {
    // approx ₹4000/hr gross across blended S01/S05/S06
    return hours * 4000;
  };

  const handleNext = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccessNotice(true);
      setTimeout(() => {
        router.push("/mentor");
      }, 1200);
    }, 1000);
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
            Step {currentStep} of 4: Identity &amp; Credential Audit
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf5ef] text-[#006d3a] font-bold text-[11px] border border-[#94f7b2]">
            <span className="material-symbols-outlined text-[14px]">shield</span>
            Dual-Control Verification Desk
          </span>
          <div className="flex items-center gap-2 pl-2 border-l border-[#e7e7eb]">
            <div className="w-7 h-7 rounded-full bg-[#5145cd] text-white flex items-center justify-center text-xs font-bold">
              VS
            </div>
            <span className="font-bold text-xs text-[#1c1b1b] hidden sm:inline">Vikram Singh</span>
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
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#f6f3f2] text-left transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#eaf5ef] text-[#006d3a] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#777585] uppercase font-bold tracking-wider block">
                  Step 01 • Completed
                </span>
                <span className="text-xs font-bold text-[#1c1b1b] block truncate">
                  Professional Track &amp; Role
                </span>
                <span className="text-[11px] text-[#006d3a] font-semibold">
                  Staff AI/ML @ Google (L5/L6)
                </span>
              </div>
            </button>

            {/* Step 2 */}
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#f6f3f2] text-left transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#eaf5ef] text-[#006d3a] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#777585] uppercase font-bold tracking-wider block">
                  Step 02 • Completed
                </span>
                <span className="text-xs font-bold text-[#1c1b1b] block truncate">
                  Service Module Approvals
                </span>
                <span className="text-[11px] text-[#006d3a] font-semibold">
                  3 Selected (S06, S01, S05)
                </span>
              </div>
            </button>

            {/* Step 3 (Active) */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#e3dfff]/40 border-2 border-[#5145cd] text-left shadow-xs">
              <div className="w-7 h-7 rounded-full bg-[#5145cd] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#5145cd] uppercase font-bold tracking-wider block">
                  Step 03 • In Progress
                </span>
                <span className="text-xs font-bold text-[#1c1b1b] block truncate">
                  Identity &amp; Employer Proof
                </span>
                <span className="text-[11px] text-[#5145cd] font-semibold">
                  Dual-Control Audit
                </span>
              </div>
            </div>

            {/* Step 4 */}
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#f6f3f2] text-left transition-colors opacity-75"
            >
              <div className="w-7 h-7 rounded-full bg-[#f0eded] text-[#777585] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                4
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#777585] uppercase font-bold tracking-wider block">
                  Step 04 • Upcoming
                </span>
                <span className="text-xs font-bold text-[#777585] block truncate">
                  Availability &amp; Settlement
                </span>
                <span className="text-[11px] text-[#777585]">
                  Bank &amp; Escrow Rails
                </span>
              </div>
            </button>
          </div>
        </section>

        {successNotice ? (
          <div className="bg-white border border-[#94f7b2] rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#eaf5ef] text-[#006d3a] flex items-center justify-center mx-auto shadow-xs">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#eaf5ef] text-[#006d3a]">
                Accreditation Dossier Updated
              </span>
              <h2 className="text-2xl font-extrabold text-[#1c1b1b] font-heading">
                Verification Proof Staged
              </h2>
              <p className="text-xs text-[#474554] max-w-md mx-auto leading-relaxed">
                Your corporate domain credentials and employment proof have been submitted to the DreamX Trust &amp; Verification Desk. Dual-control review SLA turnaround is within 24 hours.
              </p>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/mentor/verification"
                className="w-full sm:w-auto px-5 py-2.5 bg-[#5145cd] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#3828b5] transition-all"
              >
                Go to Trust Verification Desk
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
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#5145cd] uppercase tracking-wider font-mono">
                    STAGE 03 / 04
                  </span>
                </div>
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
                    <span className="text-sm font-bold text-[#1c1b1b]">Corporate Work Email (Domain Provenance)</span>
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
                    <button
                      type="button"
                      onClick={() => setEmailOtpVerified(true)}
                      className="px-4 py-2.5 rounded-xl bg-white border border-[#e7e7eb] hover:bg-[#f6f3f2] text-xs font-bold text-[#1c1b1b] shrink-0"
                    >
                      Re-verify OTP
                    </button>
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
                      {/* Visual Mock Badge Representation */}
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

                      {/* Redaction Rules Checklist */}
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
                          <span><strong>Senior Role (5+ YoE)</strong> to confirm accreditation bar.</span>
                        </div>
                        <div className="flex items-start gap-1.5 text-amber-800">
                          <span className="text-amber-600 font-bold">🛡️</span>
                          <span><strong>Allowed Redactions:</strong> Compensation, salary figures, and personal residential address may be blacked out.</span>
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
                      Document Number
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

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#777585] hidden sm:inline">
                  Autosaved 2 mins ago • Application ID #MTR-APP-8842
                </span>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2.5 rounded-xl border border-[#e7e7eb] bg-white text-xs font-bold text-[#1c1b1b] hover:bg-[#f6f3f2]"
                  >
                    ← Back to Step 2: Services
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-[#5145cd] hover:bg-[#3828b5] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 focus:ring-2 focus:ring-offset-2 focus:ring-[#5145cd] disabled:opacity-75"
                  >
                    <span>{saving ? "Submitting Audit..." : "Save & Continue to Step 4 →"}</span>
                  </button>
                </div>
              </div>
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
                    At {weeklyHours} hours committed per week
                  </span>
                </div>

                {/* Hours Selector */}
                <div className="space-y-1.5">
                  <label htmlFor="weekly-hours-select" className="block text-xs font-bold text-[#1c1b1b]">
                    Weekly Capacity
                  </label>
                  <div id="weekly-hours-select" className="grid grid-cols-3 gap-2">
                    {["4", "6", "10"].map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setWeeklyHours(h)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          weeklyHours === h
                            ? "border-[#5145cd] bg-[#e3dfff] text-[#130068] shadow-xs"
                            : "border-[#e7e7eb] bg-white text-[#474554] hover:bg-[#f6f3f2]"
                        }`}
                      >
                        {h} hrs/wk
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#e7e7eb] text-xs text-[#474554]">
                  <div className="flex justify-between">
                    <span>S06 Technical Mock (4 × ₹999)</span>
                    <span className="font-bold text-[#1c1b1b]">₹3,996</span>
                  </div>
                  <div className="flex justify-between">
                    <span>S01 Resume Audit (6 × ₹599)</span>
                    <span className="font-bold text-[#1c1b1b]">₹3,594</span>
                  </div>
                  <div className="flex justify-between">
                    <span>S05 Behavioral STAR (4 × ₹799)</span>
                    <span className="font-bold text-[#1c1b1b]">₹3,196</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#e7e7eb] font-bold text-[#006d3a]">
                    <span>Platform Commission</span>
                    <span>₹0 (0% Cut)</span>
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
