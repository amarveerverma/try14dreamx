"use client";

import * as React from "react";
import Link from "next/link";
import {
  KeyRound,
  ShieldCheck,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Clock,
  RotateCcw,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [countdown, setCountdown] = React.useState(59);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (submitted && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [submitted, countdown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      setCountdown(59);
    }, 600);
  };

  const handleResend = () => {
    setCountdown(59);
    alert(`Encrypted recovery link re-dispatched to ${email}`);
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8">
      {/* 1. Top Security Ribbon */}
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
            Account Security Desk
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-600">
          <span className="flex items-center gap-1 text-[#16834a] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            256-Bit SSL Encrypted Recovery
          </span>
          <span className="text-gray-300">•</span>
          <Link
            href="/login"
            className="text-[#3828b5] font-semibold hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sign In</span>
          </Link>
        </div>
      </div>

      {/* 2. Centered Recovery Card */}
      <div className="w-full max-w-md mx-auto my-8">
        <div className="bg-white rounded-2xl border border-[#e7e7eb] shadow-xl p-6 sm:p-8 space-y-6">
          {!submitted ? (
            <>
              {/* Icon & Heading */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-[#eef2ff] text-[#3828b5] flex items-center justify-center mx-auto shadow-sm">
                  <KeyRound className="w-7 h-7" />
                </div>
                <h1 className="text-2xl font-extrabold text-[#1c1b1b] tracking-tight">
                  Reset Your Password
                </h1>
                <p className="text-xs text-[#474554] max-w-xs mx-auto leading-relaxed">
                  Enter your registered DreamX email address. We will dispatch an encrypted recovery token valid for 15 minutes.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-[#1c1b1b] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span>Registered Email Address</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#f6f3f2] border border-[#e7e7eb] rounded-lg text-xs text-[#1c1b1b] placeholder:text-gray-400 focus:outline-none focus:border-[#3828b5] focus:bg-white transition-all font-medium"
                  />
                </div>

                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-500 leading-normal">
                  <p>
                    <strong>Security Rule:</strong> Password reset tokens are single-use and expire in 15 minutes. All active login sessions on other devices will be revoked upon password change.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-[#3828b5] hover:bg-[#2e2195] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <span>{isLoading ? "Dispatching Token..." : "Send Encrypted Recovery Link →"}</span>
                </button>
              </form>

              <div className="text-center pt-1 border-t border-gray-100 text-xs">
                <Link
                  href="/login"
                  className="font-bold text-[#3828b5] hover:underline flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-full bg-[#eaf5ef] text-[#16834a] flex items-center justify-center mx-auto border-4 border-emerald-100 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-[#1c1b1b]">
                  Recovery Link Dispatched!
                </h2>
                <p className="text-xs text-[#474554] max-w-xs mx-auto leading-relaxed">
                  We have sent a secure password reset link to:
                </p>
                <p className="text-xs font-mono font-bold text-[#3828b5] bg-indigo-50 py-1 px-3 rounded-full inline-block mt-1">
                  {email}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f6f3f2] border border-[#e7e7eb] text-xs text-gray-600 space-y-1">
                <div className="flex items-center justify-center gap-1.5 font-bold text-amber-800">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Token expires in 15 minutes</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Click the link in your email to choose a new password. Check your spam folder if it doesn&apos;t arrive within 2 minutes.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href={`/reset-password?email=${encodeURIComponent(email)}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#3828b5] hover:bg-[#2e2195] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Simulate Clicking Email Link →</span>
                </Link>

                <button
                  type="button"
                  disabled={countdown > 0}
                  onClick={handleResend}
                  className="w-full py-2 text-xs font-semibold text-gray-600 hover:text-[#1c1b1b] disabled:opacity-40 flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{countdown > 0 ? `Resend email in ${countdown}s` : "Resend recovery email now"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Trust Ledger */}
      <div className="max-w-4xl w-full mx-auto space-y-4 pt-4 border-t border-[#e7e7eb] text-xs">
        <div className="p-3 rounded-lg bg-white border border-[#e7e7eb] text-center text-gray-500">
          <p className="text-[11px] leading-relaxed">
            DreamX accounts are governed under the Indian Digital Personal Data Protection (DPDP) Act 2023. We enforce zero plain-text credential storage using Argon2id key derivation functions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400 pt-1 font-medium">
          <p>© 2025 DreamX Technologies Pvt. Ltd. • Bengaluru • Hyderabad • NCR</p>
          <div className="flex items-center gap-3">
            <Link href="/terms" className="hover:underline">Terms</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <span>•</span>
            <Link href="/refunds" className="hover:underline">Refunds</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
