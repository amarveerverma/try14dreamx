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
  Briefcase,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function MentorLoginPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, signInWithEmail, signInWithGoogle, logout } = useAuth();

  const [email, setEmail] = React.useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("email") || "";
    }
    return "";
  });
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberDevice, setRememberDevice] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [roleRedirectUrl, setRoleRedirectUrl] = React.useState<{ url: string; label: string } | null>(null);

  // Surface cross-portal error if bounced from OAuth verification
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const pErr = new URLSearchParams(window.location.search).get("portal_error");
    if (pErr === "student_on_mentor_portal") {
      setError("Student/Candidate accounts cannot login with the Mentor Login Portal. Because your account was registered as a Candidate / Seeker, please sign in through the Student Login Portal.");
      setRoleRedirectUrl({ url: "/login", label: "Go to Student Login Portal →" });
    }
  }, []);

  // Auto-redirect only if authenticated strictly as mentor (never bounce completed mentors back to onboarding)
  React.useEffect(() => {
    if (!authLoading && user) {
      if (user.role === "student") {
        setError("Student/Candidate accounts cannot login with the Mentor Login Portal. You are currently signed in as a Candidate — please use the Student Login Portal.");
        setRoleRedirectUrl({ url: "/login", label: "Go to Student Login Portal →" });
        return;
      }
      if (user.role === "mentor") {
        if (!user.onboarding_completed) {
          router.replace("/mentor/onboarding");
          return;
        }
        const redirectParam = typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("redirect")
          : null;
        if (
          redirectParam &&
          redirectParam.startsWith("/") &&
          redirectParam !== "/mentor/login" &&
          redirectParam !== "/mentor/onboarding"
        ) {
          router.replace(redirectParam);
          return;
        }
        router.replace("/mentor");
      }
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRoleRedirectUrl(null);

    if (!email || !password) {
      setError("Please enter your registered mentor email and password.");
      setIsLoading(false);
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const res = await signInWithEmail(cleanEmail, password, "mentor");
    setIsLoading(false);

    if (!res.success) {
      if (res.role === "student") {
        setError("Student/Candidate accounts cannot login with the Mentor Login Portal. Because your account was registered as a Candidate / Seeker, please sign in through the Student Login Portal.");
        setRoleRedirectUrl({ url: "/login", label: "Go to Student Login Portal →" });
      } else if (res.role === "admin") {
        setError("Access Restricted: Administrator accounts must sign in via the Admin Console.");
        setRoleRedirectUrl({ url: "/admin/login", label: "Go to Admin Console →" });
      } else {
        setError(res.error || "Invalid mentor credentials. Please verify your email and password.");
      }
      return;
    }

    // STRICT MENTOR ROLE ENFORCEMENT
    if (res.role === "student") {
      await logout();
      setError("Student/Candidate accounts cannot login with the Mentor Login Portal. Because your account was registered as a Candidate / Seeker, please sign in through the Student Login Portal.");
      setRoleRedirectUrl({ url: "/login", label: "Go to Student Login Portal →" });
      return;
    }

    if (res.role === "admin") {
      router.push("/admin");
      return;
    }

    const isOnboarded = res.onboarding_completed ?? false;
    if (!isOnboarded) {
      if (typeof window !== "undefined") {
        window.location.replace("/mentor/onboarding");
      } else {
        router.push("/mentor/onboarding");
      }
      return;
    }

    // Check redirect param if already onboarded (never send completed mentor back to onboarding)
    const redirectParam = typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect")
      : null;

    const targetUrl = (
      redirectParam &&
      redirectParam.startsWith("/") &&
      redirectParam !== "/login" &&
      redirectParam !== "/mentor/login" &&
      redirectParam !== "/mentor/onboarding"
    ) ? redirectParam : "/mentor";

    if (typeof window !== "undefined") {
      window.location.replace(targetUrl);
    } else {
      router.push(targetUrl);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e15] text-white flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 selection:bg-[#5145cd] selection:text-white">
      {/* 1. Header Ribbon */}
      <div className="max-w-4xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 pb-6 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#3828b5] to-[#705cf6] flex items-center justify-center text-white font-extrabold text-xs shadow-md">
              DX
            </div>
            <span className="font-extrabold text-base text-white tracking-tight">
              Dream<span className="text-[#5145cd]">X</span>
            </span>
          </Link>
          <span className="text-gray-600">|</span>
          <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-500/20 px-2.5 py-0.5 rounded font-mono">
            Mentor Console Gateway
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            DPDP Act &amp; Escrow Governance
          </span>
          <span className="text-gray-600">•</span>
          <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
            Candidate Sign In
          </Link>
          <span className="text-gray-600">•</span>
          <Link href="/" className="text-indigo-400 hover:underline">
            ← Platform Home
          </Link>
        </div>
      </div>

      {/* 2. Centered Authentication Card */}
      <div className="w-full max-w-lg mx-auto my-8">
        <div className="bg-[#141624] rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3828b5] to-[#5145cd] text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-950/50 font-bold text-lg font-mono">
              <Briefcase className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Mentor Portal Sign In
            </h1>
            <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
              Sign in to manage your 1:1 sessions, calendar availability, diagnostic scorecards, and RBI-compliant escrow settlements.
            </p>
          </div>

          {/* Error Banner with Role Redirection Button */}
          {error && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 space-y-2.5 animate-in fade-in">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
              {roleRedirectUrl && (
                <div className="pt-2 border-t border-red-500/20">
                  <Link
                    href={roleRedirectUrl.url}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 font-bold text-xs transition-colors"
                  >
                    <span>{roleRedirectUrl.label}</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Social Google OAuth Button for Mentors */}
          <div>
            <button
              type="button"
              onClick={() => signInWithGoogle("mentor", "login")}
              className="w-full h-11 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-bold text-white flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4" />
                <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" fill="#34A853" />
                <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z" fill="#FBBC05" />
                <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335" />
              </svg>
              <span>Continue with Google (Personal Account)</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full h-px bg-white/10" />
            <span className="absolute px-3 bg-[#141624] text-[10px] font-bold uppercase tracking-wider text-gray-500">
              or email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-300" htmlFor="email">
                Mentor Registered Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com, personal, or work email"
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#5145cd] focus:ring-1 focus:ring-[#5145cd] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-300" htmlFor="password">
                  Security Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-indigo-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#5145cd] focus:ring-1 focus:ring-[#5145cd] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-gray-300">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-[#5145cd] focus:ring-[#5145cd]"
                />
                <span className="text-[11px]">Remember authorized mentor console session</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#3828b5] to-[#5145cd] hover:from-[#2e2099] hover:to-[#4338ca] text-white text-xs font-bold transition-all shadow-md shadow-indigo-950/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Mentor Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Mentor Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="pt-4 border-t border-white/10 space-y-2 text-center text-xs">
            <div className="text-gray-400">
              New mentor?{" "}
              <Link
                href="/signup?role=mentor"
                className="font-bold text-indigo-400 hover:underline"
              >
                Create Mentor Account / Apply →
              </Link>
            </div>
            <div className="text-gray-500 text-[11px]">
              Candidate or student?{" "}
              <Link
                href="/login"
                className="text-gray-300 hover:underline font-semibold"
              >
                Candidate Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Footer Strip */}
      <div className="max-w-4xl w-full mx-auto text-center text-[11px] text-gray-500 pt-6 border-t border-white/10 space-y-1">
        <p>
          Protected by DreamX Mentor Bar Standards • Enforcing 48-hour diagnostic SLA and transparent escrow ledger.
        </p>
        <p>© 2025 DreamX Ecosystem. All rights reserved.</p>
      </div>
    </div>
  );
}
