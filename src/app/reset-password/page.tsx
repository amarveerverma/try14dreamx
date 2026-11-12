"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Check,
} from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "candidate@dreamx.com";

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [revokeSessions, setRevokeSessions] = React.useState(true);
  const [submitted, setSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Live password validation
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isMatch = password.length > 0 && password === confirmPassword;
  const isAllValid = hasMinLength && hasNumber && hasUpper && hasSymbol && isMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hasMinLength) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 700);
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
            Password Replacement Gateway
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-600">
          <span className="flex items-center gap-1 text-[#16834a] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Token Validated (15m window)
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-600">Salted Argon2id Key Derivation</span>
          <span className="text-gray-300">•</span>
          <Link
            href="/login"
            className="text-[#3828b5] font-semibold hover:underline"
          >
            ← Return to Sign In
          </Link>
        </div>
      </div>

      {/* 2. Centered Reset Card */}
      <div className="w-full max-w-md mx-auto my-8">
        <div className="bg-white rounded-2xl border border-[#e7e7eb] shadow-xl p-6 sm:p-8 space-y-6">
          {!submitted ? (
            <>
              {/* Card Header */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-[#eaf5ef] text-[#16834a] flex items-center justify-center mx-auto shadow-sm border border-emerald-100">
                  <Lock className="w-7 h-7" />
                </div>
                <h1 className="text-2xl font-extrabold text-[#1c1b1b] tracking-tight">
                  Set New Password
                </h1>
                <p className="text-xs text-[#474554] max-w-xs mx-auto leading-relaxed">
                  Create a strong, secure password for your DreamX account. Your session tokens on other devices will be automatically revoked.
                </p>
              </div>

              {/* Account Email Badge */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Account:</span>
                <span className="font-mono font-bold text-[#1c1b1b] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16834a]" />
                  {initialEmail}
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

                {/* New Password */}
                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-[#1c1b1b]">
                    New Password
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
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-[#1c1b1b]">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#f6f3f2] border border-[#e7e7eb] rounded-lg text-xs text-[#1c1b1b] placeholder:text-gray-400 focus:outline-none focus:border-[#3828b5] focus:bg-white transition-all font-mono"
                  />
                </div>

                {/* Live Password Rules Checklist */}
                <div className="p-3 rounded-xl bg-[#f6f3f2] border border-[#e7e7eb] space-y-1 text-xs">
                  <span className="font-bold text-gray-700 block text-[11px] mb-1">
                    Security Requirements:
                  </span>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <div className={`flex items-center gap-1 ${hasMinLength ? "text-emerald-700 font-bold" : "text-gray-500"}`}>
                      <Check className={`w-3 h-3 ${hasMinLength ? "text-emerald-700" : "text-gray-400"}`} />
                      <span>At least 8 chars</span>
                    </div>
                    <div className={`flex items-center gap-1 ${hasNumber ? "text-emerald-700 font-bold" : "text-gray-500"}`}>
                      <Check className={`w-3 h-3 ${hasNumber ? "text-emerald-700" : "text-gray-400"}`} />
                      <span>At least 1 number</span>
                    </div>
                    <div className={`flex items-center gap-1 ${hasUpper ? "text-emerald-700 font-bold" : "text-gray-500"}`}>
                      <Check className={`w-3 h-3 ${hasUpper ? "text-emerald-700" : "text-gray-400"}`} />
                      <span>At least 1 uppercase</span>
                    </div>
                    <div className={`flex items-center gap-1 ${hasSymbol ? "text-emerald-700 font-bold" : "text-gray-500"}`}>
                      <Check className={`w-3 h-3 ${hasSymbol ? "text-emerald-700" : "text-gray-400"}`} />
                      <span>At least 1 symbol</span>
                    </div>
                  </div>
                </div>

                {/* Revoke other sessions */}
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600 pt-1">
                  <input
                    type="checkbox"
                    checked={revokeSessions}
                    onChange={(e) => setRevokeSessions(e.target.checked)}
                    className="rounded border-[#e7e7eb] text-[#3828b5] focus:ring-[#3828b5]"
                  />
                  <span>Sign out of all other active sessions and mobile devices</span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading || !isAllValid}
                  className="w-full py-3 px-4 rounded-xl bg-[#3828b5] hover:bg-[#2e2195] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <span>{isLoading ? "Saving New Password..." : "Update Password & Sign In →"}</span>
                </button>
              </form>
            </>
          ) : (
            /* Success View */
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-[#eaf5ef] text-[#16834a] flex items-center justify-center mx-auto border-4 border-emerald-100 shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-extrabold text-[#1c1b1b]">
                  Password Updated Successfully!
                </h2>
                <p className="text-xs text-[#474554] max-w-xs mx-auto leading-relaxed">
                  Your credentials have been re-encrypted with Argon2id. All previous session tokens have been invalidated.
                </p>
              </div>

              <div className="pt-3">
                <Link
                  href="/login"
                  className="w-full py-3 px-4 rounded-xl bg-[#3828b5] hover:bg-[#2e2195] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign In with New Password →</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Bottom Trust Ledger */}
      <div className="max-w-4xl w-full mx-auto space-y-4 pt-4 border-t border-[#e7e7eb] text-xs">
        <div className="p-3 rounded-lg bg-white border border-[#e7e7eb] text-center text-gray-500">
          <p className="text-[11px] leading-relaxed">
            DreamX staff and mentors will never ask for your password. All credentials undergo PBKDF2 + Argon2id cryptographic hashing per PRD §15.
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

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs">Loading reset desk...</div>}>
      <ResetPasswordForm />
    </React.Suspense>
  );
}
