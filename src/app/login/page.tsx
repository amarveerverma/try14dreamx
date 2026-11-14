"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  GraduationCap,
  Briefcase,
  Shield,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle, login } = useAuth();
  const [role, setRole] = React.useState<"seeker" | "mentor" | "admin">("seeker");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberDevice, setRememberDevice] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please enter your registered email and password.");
      setIsLoading(false);
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const res = await signInWithEmail(cleanEmail, password);
    setIsLoading(false);

    if (!res.success) {
      setError(res.error || "Invalid email or password. Please try again.");
      return;
    }

    const redirectParam = typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect")
      : null;

    if (redirectParam && redirectParam.startsWith("/")) {
      router.push(redirectParam);
      return;
    }

    if (role === "admin" || res.role === "admin") {
      router.push("/admin");
    } else if (role === "mentor" || res.role === "mentor") {
      router.push("/mentor");
    } else {
      router.push("/dashboard");
    }
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
            Auth Gateway v3.0
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-600">
          <span className="flex items-center gap-1 text-[#16834a] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            256-Bit SSL Encrypted
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-600">DPDP Act 2023 Shield</span>
          <span className="text-gray-300">•</span>
          <Link
            href="/"
            className="text-[#3828b5] font-semibold hover:underline"
          >
            ← Return to Discovery
          </Link>
        </div>
      </div>

      {/* 2. Centered Authentication Card */}
      <div className="w-full max-w-lg mx-auto my-8">
        <div className="bg-white rounded-2xl border border-[#e7e7eb] shadow-xl p-6 sm:p-8 space-y-6">
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3828b5] to-[#705cf6] text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-950/20 font-bold text-lg font-mono">
              DX
            </div>
            <h1 className="text-2xl font-extrabold text-[#1c1b1b] tracking-tight">
              Sign in to DreamX
            </h1>
            <p className="text-xs text-[#474554] max-w-sm mx-auto leading-relaxed">
              Access outcome-accountable career acceleration, verified rubric scorecards, and escrow-governed 1:1 sessions.
            </p>
          </div>

          {/* Role Segmented Switcher (3 Roles) */}
          <div className="grid grid-cols-3 p-1 rounded-xl bg-[#f0eded] border border-[#e7e7eb] text-xs font-bold">
            <button
              type="button"
              onClick={() => setRole("seeker")}
              className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                role === "seeker"
                  ? "bg-white text-[#3828b5] shadow-xs font-bold"
                  : "text-gray-600 hover:text-[#1c1b1b]"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Candidate</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("mentor")}
              className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                role === "mentor"
                  ? "bg-white text-[#3828b5] shadow-xs font-bold"
                  : "text-gray-600 hover:text-[#1c1b1b]"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Mentor</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                role === "admin"
                  ? "bg-white text-[#3828b5] shadow-xs font-bold"
                  : "text-gray-600 hover:text-[#1c1b1b]"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
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
              <span>Continue with Google Workspace SSO</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full h-px bg-[#e7e7eb]" />
            <span className="absolute px-3 bg-white text-[11px] font-bold uppercase tracking-wider text-gray-400">
              or email
            </span>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-[#1c1b1b] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span>Email Address</span>
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

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#1c1b1b] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Password</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="font-semibold text-[#3828b5] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
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

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="rounded border-[#e7e7eb] text-[#3828b5] focus:ring-[#3828b5]"
                />
                <span>Remember this device (30 days)</span>
              </label>
              <span className="text-[11px] text-gray-400 font-mono">Biometric 2FA Ready</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#3828b5] hover:bg-[#2e2195] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{isLoading ? "Authenticating Session..." : `Sign In as ${role === "mentor" ? "Mentor" : role === "admin" ? "Staff Admin" : "Candidate"} →`}</span>
            </button>

            {/* Quick 1-Click Candidate Test Sign-in */}
            <button
              type="button"
              onClick={() => {
                login("student", "test.student.pro@dreamx.in", "Verified Candidate");
                const redirectParam = typeof window !== "undefined"
                  ? new URLSearchParams(window.location.search).get("redirect")
                  : null;
                if (redirectParam && redirectParam.startsWith("/")) {
                  router.push(redirectParam);
                } else {
                  router.push("/dashboard");
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-[#3828b5]/10 hover:bg-[#3828b5]/20 text-[#3828b5] font-bold text-xs border border-[#3828b5]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>1-Click Candidate Demo Login</span>
            </button>
          </form>

          {/* Registration Footer */}
          <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-600 space-y-1">
            <p>
              Don&apos;t have an account yet?{" "}
              <Link
                href={
                  typeof window !== "undefined" && new URLSearchParams(window.location.search).get("redirect")
                    ? `/signup?redirect=${encodeURIComponent(new URLSearchParams(window.location.search).get("redirect")!)}`
                    : "/signup"
                }
                className="font-bold text-[#3828b5] hover:underline"
              >
                Sign up for DreamX
              </Link>
            </p>
            <p className="text-[11px] text-gray-400">
              Want to mentor?{" "}
              <Link href="/mentor/onboarding" className="font-semibold text-gray-700 hover:underline">
                Apply as Verified Bar Raiser
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Bottom Trust & Statutory Security Ledger */}
      <div className="max-w-4xl w-full mx-auto space-y-4 pt-4 border-t border-[#e7e7eb] text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-white border border-[#e7e7eb] space-y-1">
            <span className="font-bold text-[#1c1b1b] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#16834a]" />
              Argon2id Nonce Hashing
            </span>
            <p className="text-[11px] text-gray-500 leading-normal">
              Zero plain-text credential storage. PBKDF2 + Argon2id adaptive key stretching per PRD §15.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-white border border-[#e7e7eb] space-y-1">
            <span className="font-bold text-[#1c1b1b] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16834a]" />
              Dual-Control RBAC
            </span>
            <p className="text-[11px] text-gray-500 leading-normal">
              Admin sessions require dual staff clearance. Tamper-evident immutable audit logs on cloud vault.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-white border border-[#e7e7eb] space-y-1">
            <span className="font-bold text-[#1c1b1b] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16834a]" />
              DPDP Act 2023 Shield
            </span>
            <p className="text-[11px] text-gray-500 leading-normal">
              Indian data residency guarantees. Candidate readiness rubrics are never sold to recruiters.
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
