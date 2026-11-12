"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [role, setRole] = React.useState<"student" | "mentor">("student");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const [whatsAppOptIn, setWhatsAppOptIn] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Live password validation
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const strengthScore = [hasMinLength, hasNumber, hasUpper, hasSymbol].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!acceptedTerms) {
      setError("Please accept the Terms of Service and Privacy Policy under DPDP Act 2023.");
      return;
    }

    if (!name.trim()) {
      setError("Please enter your legal full name.");
      return;
    }

    if (!hasMinLength) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    const res = await signUpWithEmail(email, password, name, role, phone);
    setIsLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to create account. Please check your credentials.");
      return;
    }

    // Route to email verification step
    router.push(`/verify-email?email=${encodeURIComponent(email)}&role=${role}`);
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8">
      {/* 1. Top Security & Compliance Ribbon */}
      <div className="max-w-4xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 pb-6 border-b border-[#e7e7eb] text-xs">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#3828b5] flex items-center justify-center text-white font-bold text-xs shadow-xs">
              DX
            </div>
            <span className="font-extrabold text-base text-[#1c1b1b] tracking-tight">
              DreamX
            </span>
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-[11px] font-bold text-[#3828b5] bg-[#3828b5]/10 px-2 py-0.5 rounded font-mono">
            Registration Gateway v3.0
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-600">
          <span className="flex items-center gap-1 text-[#16834a] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            256-Bit SSL Encrypted
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-600">DPDP Act 2023 Consent Manager</span>
          <span className="text-gray-300">•</span>
          <Link
            href="/login"
            className="text-[#3828b5] font-semibold hover:underline"
          >
            ← Already have an account? Sign In
          </Link>
        </div>
      </div>

      {/* 2. Centered Registration Card */}
      <div className="w-full max-w-xl mx-auto my-8">
        <div className="bg-white rounded-2xl border border-[#e7e7eb] shadow-xl p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3828b5] to-[#705cf6] text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-950/20 font-bold text-lg font-mono">
              DX
            </div>
            <h1 className="text-2xl font-extrabold text-[#1c1b1b] tracking-tight">
              Create your DreamX Account
            </h1>
            <p className="text-xs text-[#474554] max-w-md mx-auto leading-relaxed">
              Join India&apos;s outcome-accountable career acceleration ecosystem. Transparent pricing, nodal escrow protection, zero deceptive placement hype.
            </p>
          </div>

          {/* Role Segmented Selector Cards */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                role === "student"
                  ? "border-[#3828b5] bg-indigo-50/40 shadow-xs"
                  : "border-[#e7e7eb] hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#1c1b1b] flex items-center gap-1.5">
                  <GraduationCap className={`w-4 h-4 ${role === "student" ? "text-[#3828b5]" : "text-gray-400"}`} />
                  Candidate / Seeker
                </span>
                <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${role === "student" ? "border-[#3828b5]" : "border-gray-300"}`}>
                  {role === "student" && <span className="w-1.5 h-1.5 rounded-full bg-[#3828b5]" />}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 leading-normal">
                8-D readiness matrix, diagnostic baseline, verified mocks &amp; escrow refunds.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRole("mentor")}
              className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                role === "mentor"
                  ? "border-[#3828b5] bg-indigo-50/40 shadow-xs"
                  : "border-[#e7e7eb] hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#1c1b1b] flex items-center gap-1.5">
                  <Briefcase className={`w-4 h-4 ${role === "mentor" ? "text-[#3828b5]" : "text-gray-400"}`} />
                  Accredited Mentor
                </span>
                <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${role === "mentor" ? "border-[#3828b5]" : "border-gray-300"}`}>
                  {role === "mentor" && <span className="w-1.5 h-1.5 rounded-full bg-[#3828b5]" />}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 leading-normal">
                Strict 5+ YoE bar, corporate verification, 100% transparent nodal payouts.
              </p>
            </button>
          </div>

          {/* Social Google OAuth Button */}
          <div>
            <button
              type="button"
              onClick={() => signInWithGoogle()}
              className="w-full h-11 px-4 rounded-xl border border-[#e7e7eb] bg-white hover:bg-gray-50 text-xs font-bold text-[#1c1b1b] flex items-center justify-center gap-2.5 transition-colors shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4" />
                <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" fill="#34A853" />
                <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z" fill="#FBBC05" />
                <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335" />
              </svg>
              <span>Sign up with Google Workspace</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full h-px bg-[#e7e7eb]" />
            <span className="absolute px-3 bg-white text-[11px] font-bold uppercase tracking-wider text-gray-400">
              or register with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Legal Full Name */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-[#1c1b1b] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span>Full Legal Name</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Aarav Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[#f6f3f2] border border-[#e7e7eb] rounded-lg text-xs text-[#1c1b1b] placeholder:text-gray-400 focus:outline-none focus:border-[#3828b5] focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-[#1c1b1b] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span>{role === "mentor" ? "Corporate Work Email" : "Email Address"}</span>
              </label>
              <input
                type="email"
                placeholder={role === "mentor" ? "name@company.com (For employer audit)" : "name@college.edu or name@gmail.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-[#f6f3f2] border border-[#e7e7eb] rounded-lg text-xs text-[#1c1b1b] placeholder:text-gray-400 focus:outline-none focus:border-[#3828b5] focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Mobile Phone */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-[#1c1b1b] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>Mobile Number (For Session &amp; Escrow SMS Alerts)</span>
              </label>
              <div className="flex gap-2">
                <span className="px-3 py-2.5 bg-gray-100 border border-[#e7e7eb] rounded-lg font-mono text-xs text-gray-700 font-bold shrink-0">
                  +91 (IN)
                </span>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-[#f6f3f2] border border-[#e7e7eb] rounded-lg text-xs text-[#1c1b1b] placeholder:text-gray-400 focus:outline-none focus:border-[#3828b5] focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            {/* Password with Strength Meter */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-[#1c1b1b] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                <span>Create Strong Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-3.5 pr-10 py-2.5 bg-[#f6f3f2] border border-[#e7e7eb] rounded-lg text-xs text-[#1c1b1b] placeholder:text-gray-400 focus:outline-none focus:border-[#3828b5] focus:bg-white transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Meter Bar */}
              {password.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="flex gap-1 h-1.5">
                    <div className={`flex-1 rounded-full ${strengthScore >= 1 ? (strengthScore <= 2 ? "bg-amber-500" : "bg-emerald-500") : "bg-gray-200"}`} />
                    <div className={`flex-1 rounded-full ${strengthScore >= 2 ? (strengthScore === 2 ? "bg-amber-500" : "bg-emerald-500") : "bg-gray-200"}`} />
                    <div className={`flex-1 rounded-full ${strengthScore >= 3 ? "bg-emerald-500" : "bg-gray-200"}`} />
                    <div className={`flex-1 rounded-full ${strengthScore >= 4 ? "bg-emerald-600" : "bg-gray-200"}`} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-500 pt-0.5">
                    <span className={hasMinLength ? "text-emerald-700 font-bold" : ""}>✓ 8+ chars</span>
                    <span className={hasNumber ? "text-emerald-700 font-bold" : ""}>✓ Number</span>
                    <span className={hasUpper ? "text-emerald-700 font-bold" : ""}>✓ Uppercase</span>
                    <span className={hasSymbol ? "text-emerald-700 font-bold" : ""}>✓ Symbol</span>
                  </div>
                </div>
              )}
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 pt-2 text-xs text-gray-600">
              <label className="flex items-start gap-2.5 cursor-pointer leading-relaxed">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  required
                  className="mt-0.5 rounded border-[#e7e7eb] text-[#3828b5] focus:ring-[#3828b5]"
                />
                <span>
                  I agree to the <Link href="/terms" className="text-[#3828b5] font-semibold hover:underline">Terms of Service</Link> and{" "}
                  <Link href="/privacy" className="text-[#3828b5] font-semibold hover:underline">Privacy Policy</Link>. I consent to encrypted data handling under the Indian DPDP Act 2023.
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsAppOptIn}
                  onChange={(e) => setWhatsAppOptIn(e.target.checked)}
                  className="rounded border-[#e7e7eb] text-[#3828b5] focus:ring-[#3828b5]"
                />
                <span className="text-[11px] text-gray-500">
                  Receive session scheduling reminders &amp; deliverable links on WhatsApp
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#3828b5] hover:bg-[#2e2195] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{isLoading ? "Creating Account..." : `Create Free ${role === "mentor" ? "Mentor" : "Candidate"} Account & Continue →`}</span>
            </button>
          </form>

          {/* Footer note */}
          <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#3828b5] hover:underline">
              Sign In to DreamX
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Bottom Trust & Statutory Security Ledger */}
      <div className="max-w-4xl w-full mx-auto space-y-4 pt-4 border-t border-[#e7e7eb] text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-white border border-[#e7e7eb] space-y-1">
            <span className="font-bold text-[#1c1b1b] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16834a]" />
              100% Escrow Protection
            </span>
            <p className="text-[11px] text-gray-500 leading-normal">
              Session payments held in RBI-monitored nodal escrow until deliverable is verified.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-white border border-[#e7e7eb] space-y-1">
            <span className="font-bold text-[#1c1b1b] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16834a]" />
              Non-Public Readiness Privacy
            </span>
            <p className="text-[11px] text-gray-500 leading-normal">
              8-dimension rubric scores are never shared with employers or recruiters without explicit consent.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-white border border-[#e7e7eb] space-y-1">
            <span className="font-bold text-[#1c1b1b] flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-[#16834a]" />
              1-Hour Free Cancellation
            </span>
            <p className="text-[11px] text-gray-500 leading-normal">
              No questions asked full nodal refund policy up to 60 minutes before scheduled call time.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400 pt-2 font-medium">
          <p>© 2025 DreamX Technologies Pvt. Ltd. • Bengaluru • Hyderabad • NCR</p>
          <div className="flex items-center gap-3">
            <Link href="/terms" className="hover:underline">Terms</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <span>•</span>
            <Link href="/refunds" className="hover:underline">Refunds</Link>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">● 99.98% System Uptime</span>
          </div>
        </div>
      </div>
    </div>
  );
}
