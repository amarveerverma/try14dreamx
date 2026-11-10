"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SERVICES } from "@/data/services";
import {
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  UploadCloud,
  FileText,
  Lock,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Building2,
  Mail,
} from "lucide-react";

export default function MentorOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const totalSteps = 4;

  // Form State
  // Step 1: Professional Details
  const [company, setCompany] = React.useState("");
  const [designation, setDesignation] = React.useState("");
  const [yearsExp, setYearsExp] = React.useState("");
  const [linkedin, setLinkedin] = React.useState("");
  const [workEmail, setWorkEmail] = React.useState("");

  // Step 2: Service Approvals Applied For
  const [selectedServices, setSelectedServices] = React.useState<string[]>([
    "S01",
    "S06",
  ]);

  // Step 3: Identity & Proof Upload
  const [idType, setIdType] = React.useState("aadhaar");
  const [uploadedProof, setUploadedProof] = React.useState<string | null>(null);

  // Step 4: Availability & Settlement
  const [weeklyHours, setWeeklyHours] = React.useState("5-10");
  const [payoutMethod, setPayoutMethod] = React.useState<"upi" | "bank">("upi");
  const [upiId, setUpiId] = React.useState("");
  const [accountNumber, setAccountNumber] = React.useState("");
  const [ifsc, setIfsc] = React.useState("");

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== id));
      }
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-xl w-full p-8 sm:p-10 bg-white border-[#e7e7eb] shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#ebf7ee] text-[#16834a] flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="verified">Verification Application Submitted</Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
              Application Under Dual-Control Audit
            </h1>
            <p className="text-xs sm:text-sm text-[#66666f] leading-relaxed">
              Our operations compliance team is verifying your employment credentials at <strong className="text-[#171717]">{company || "your employer"}</strong>. Review SLA turnaround is <strong>within 24 hours</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#fafafc] border border-[#e7e7eb] text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#8b8b95]">Applied Services:</span>
              <strong className="text-[#171717]">{selectedServices.length} Approved Tracks</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8b8b95]">Settlement Channel:</span>
              <strong className="text-[#171717]">{payoutMethod.toUpperCase()} (Weekly Escrow Release)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8b8b95]">Auditing Framework:</span>
              <strong className="text-[#16834a]">ISO/IEC 27001 &amp; DPDP Act 2023</strong>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full shadow-md"
            onClick={() => router.push("/mentor")}
          >
            <span>Proceed to Mentor Console</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-16rem)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      {/* Header Banner */}
      <div className="space-y-2 text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef2ff] text-[#5145cd] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Industry Mentor Onboarding • 3-Stage Trust Audit</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#171717] tracking-tight">
          Apply to Become an Approved Mentor
        </h1>
        <p className="text-xs sm:text-sm text-[#66666f]">
          DreamX enforces strict employment audits to protect candidates and preserve our No Job Guarantee Hype Pledge.
        </p>
      </div>

      {/* Progress Track */}
      <div className="bg-white rounded-xl shadow-xs border border-[#e7e7eb] p-5 mb-8">
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
          {[
            { s: 1, label: "Work Credentials" },
            { s: 2, label: "Service Approvals" },
            { s: 3, label: "Proof of Employment" },
            { s: 4, label: "Settlement & Slots" },
          ].map((item) => (
            <div
              key={item.s}
              onClick={() => step > item.s && setStep(item.s)}
              className={`flex flex-col items-center gap-1.5 ${
                step === item.s ? "text-[#5145cd]" : step > item.s ? "text-[#16834a] cursor-pointer" : "text-[#8b8b95]"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === item.s
                    ? "bg-[#5145cd] text-white shadow-xs"
                    : step > item.s
                    ? "bg-[#ebf7ee] text-[#16834a] border border-[#16834a]"
                    : "bg-[#f2f3ff] text-[#8b8b95]"
                }`}
              >
                {step > item.s ? <CheckCircle2 className="w-4 h-4" /> : item.s}
              </div>
              <span className="hidden sm:inline">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-[#f0eded] rounded-full h-1.5 mt-4">
          <div
            className="bg-[#5145cd] h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <Card className="p-6 sm:p-10 bg-white border-[#e7e7eb] shadow-sm">
        {/* ================= STEP 1: PROFESSIONAL CREDENTIALS ================= */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <Badge variant="default">Stage 1 of 3: Professional Verification</Badge>
              <h2 className="text-xl font-bold text-[#171717]">
                Current Industry Role &amp; Background
              </h2>
              <p className="text-xs text-[#66666f]">
                Only engineers and leaders with verified top-tier tech experience qualify to mentor on DreamX.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#171717]">Current Tech Company / Employer</label>
                <div className="relative">
                  <Input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google, Microsoft, Swiggy, Razorpay"
                    className="h-10 text-sm pl-9"
                    required
                  />
                  <Building2 className="w-4 h-4 text-[#8b8b95] absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#171717]">Designation / Level</label>
                <div className="relative">
                  <Input
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Senior Software Engineer (L5), Staff PM"
                    className="h-10 text-sm pl-9"
                    required
                  />
                  <Briefcase className="w-4 h-4 text-[#8b8b95] absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#171717]">Total Years of Experience</label>
                <select
                  value={yearsExp}
                  onChange={(e) => setYearsExp(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#e7e7eb] rounded-lg text-sm text-[#171717] focus:border-[#5145cd] focus:outline-none"
                >
                  <option value="" disabled>Select experience</option>
                  <option value="2-4">2–4 Years (Peer Track)</option>
                  <option value="5-8">5–8 Years (Senior Track)</option>
                  <option value="8+">8+ Years (Principal / Staff Track)</option>
                  <option value="12+">12+ Years (Director / VP Track)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#171717]">Corporate Work Email</label>
                <div className="relative">
                  <Input
                    type="email"
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    placeholder="e.g. yourname@google.com"
                    className="h-10 text-sm pl-9"
                    required
                  />
                  <Mail className="w-4 h-4 text-[#8b8b95] absolute left-3 top-3 pointer-events-none" />
                </div>
                <span className="text-[11px] text-[#8b8b95] block">
                  Used exclusively for automated corporate domain verification.
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#171717]">LinkedIn Profile URL</label>
              <Input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/your-profile"
                className="h-10 text-sm"
                required
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                size="md"
                disabled={!company || !designation || !yearsExp}
                onClick={() => setStep(2)}
                className="shadow-sm"
              >
                <span>Continue to Service Qualifications</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: SERVICE QUALIFICATION ================= */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <Badge variant="default">Stage 2 of 3: Service-Specific Approvals</Badge>
              <h2 className="text-xl font-bold text-[#171717]">
                Select Services You Are Qualified to Deliver
              </h2>
              <p className="text-xs text-[#66666f]">
                Mentors are approved service-by-service based on technical domain alignment. Select at least one service.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICES.map((srv) => {
                const isSelected = selectedServices.includes(srv.id);
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => toggleService(srv.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      isSelected
                        ? "bg-[#eef2ff] border-[#5145cd] ring-1 ring-[#5145cd]"
                        : "bg-white border-[#e7e7eb] hover:bg-[#fafafc]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? "bg-[#5145cd] text-white"
                          : "border border-[#c8c4d6]"
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-[#171717]">
                          {srv.code} • {srv.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#66666f] block mt-0.5">
                        {srv.duration} • ₹{srv.price} standard base
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button size="md" onClick={() => setStep(3)} className="shadow-sm">
                <span>Continue to Proof Upload</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: PROOF OF EMPLOYMENT ================= */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <Badge variant="default">Stage 3 of 3: Identity &amp; Employer Proof</Badge>
              <h2 className="text-xl font-bold text-[#171717]">
                Government ID &amp; Employment Documentation
              </h2>
              <p className="text-xs text-[#66666f]">
                Upload documents to prove identity and employment. All files are encrypted using AES-256 and stored in private zero-trust buckets.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#171717]">Verification Document Type</label>
              <div className="grid grid-cols-3 gap-3 text-xs">
                {[
                  { id: "aadhaar", label: "Aadhaar Card (Redacted)" },
                  { id: "passport", label: "Indian Passport" },
                  { id: "id_card", label: "Corporate Employee Badge" },
                ].map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setIdType(doc.id)}
                    className={`p-3 rounded-lg border text-center font-semibold transition-all ${
                      idType === doc.id
                        ? "bg-[#eef2ff] border-[#5145cd] text-[#5145cd]"
                        : "bg-white border-[#e7e7eb] text-[#171717] hover:bg-[#fafafc]"
                    }`}
                  >
                    {doc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Upload Zone */}
            <div
              onClick={() => setUploadedProof("employment_verification_document.pdf")}
              className="p-8 border-2 border-dashed border-[#e7e7eb] hover:border-[#5145cd] rounded-2xl bg-[#fafafc] hover:bg-[#f2f3ff]/50 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-[#eef2ff] text-[#5145cd] flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-sm text-[#171717] block">
                  Click to upload proof document (PDF, PNG, JPG)
                </span>
                <span className="text-xs text-[#8b8b95] mt-1 block">
                  Upload corporate badge, offer letter, or work verification letter (Max 5MB)
                </span>
              </div>
            </div>

            {uploadedProof && (
              <div className="p-3.5 rounded-xl bg-[#ebf7ee] border border-[#94f7b2] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#006d3a] font-bold">
                  <FileText className="w-4 h-4" />
                  <span>{uploadedProof} (Uploaded • Ready for reviewer)</span>
                </div>
                <Badge variant="verified">Secured</Badge>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-[#fafafc] border border-[#e7e7eb] flex items-start gap-2.5 text-xs text-[#66666f]">
              <Lock className="w-4 h-4 text-[#5145cd] shrink-0 mt-0.5" />
              <span>
                <strong>Zero-Trust Privacy Guarantee:</strong> Uploaded ID files are accessible strictly by dual-control verification reviewers and automatically purged according to DPDP retention rules.
              </span>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button variant="ghost" onClick={() => setStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button size="md" onClick={() => setStep(4)} className="shadow-sm">
                <span>Continue to Payout &amp; Availability</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: SETTLEMENT & SLOTS ================= */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <Badge variant="success">Final Step: Payout Escrow &amp; Weekly Slots</Badge>
              <h2 className="text-xl font-bold text-[#171717]">
                Availability &amp; Automated Payout Account
              </h2>
              <p className="text-xs text-[#66666f]">
                Escrow funds are disbursed automatically upon delivery of session reports within contractual 48-hour SLA.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#171717]">Expected Weekly Mentoring Capacity</label>
              <div className="grid grid-cols-3 gap-3 text-xs">
                {[
                  { id: "2-5", label: "2–5 Hours / Week" },
                  { id: "5-10", label: "5–10 Hours / Week" },
                  { id: "10+", label: "10+ Hours / Week" },
                ].map((cap) => (
                  <button
                    key={cap.id}
                    type="button"
                    onClick={() => setWeeklyHours(cap.id)}
                    className={`p-3 rounded-lg border text-center font-semibold transition-all ${
                      weeklyHours === cap.id
                        ? "bg-[#eef2ff] border-[#5145cd] text-[#5145cd]"
                        : "bg-white border-[#e7e7eb] text-[#171717] hover:bg-[#fafafc]"
                    }`}
                  >
                    {cap.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Payout Channel Selector */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-[#171717]">Indian Settlement Channel</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setPayoutMethod("upi")}
                  className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    payoutMethod === "upi"
                      ? "bg-[#eef2ff] border-[#5145cd] text-[#5145cd]"
                      : "bg-white border-[#e7e7eb] text-[#171717]"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Instant UPI ID</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPayoutMethod("bank")}
                  className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    payoutMethod === "bank"
                      ? "bg-[#eef2ff] border-[#5145cd] text-[#5145cd]"
                      : "bg-white border-[#e7e7eb] text-[#171717]"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Direct Bank Account (NEFT/IMPS)</span>
                </button>
              </div>

              {payoutMethod === "upi" ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#171717]">UPI VPA (Virtual Payment Address)</label>
                  <Input
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. yourname@oksbi, yourname@okhdfcbank"
                    className="h-10 text-sm"
                    required
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#171717]">Account Number</label>
                    <Input
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="e.g. 501002391283"
                      className="h-10 text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#171717]">Bank IFSC Code</label>
                    <Input
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value)}
                      placeholder="e.g. HDFC0000240"
                      className="h-10 text-sm"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button variant="ghost" onClick={() => setStep(3)}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                className="shadow-md"
              >
                <span>Submit Mentor Application</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
