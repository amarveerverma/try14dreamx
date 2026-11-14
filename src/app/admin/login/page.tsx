"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ShieldCheck, Lock, Eye, EyeOff, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, signInWithEmail, logout } = useAuth();

  const [email, setEmail] = React.useState("admin@dreamx.in");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // If already logged in as authorized admin, route straight to console
  React.useEffect(() => {
    if (!authLoading && user) {
      const isOwner =
        user.email?.toLowerCase().includes("amarveer") ||
        user.email?.toLowerCase() === "vermaamarveer0@gmail.com";
      if (user.role === "admin" || isOwner) {
        router.replace("/admin");
      }
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError("Please provide administrator email and security key.");
      setIsLoading(false);
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const res = await signInWithEmail(cleanEmail, password);
    setIsLoading(false);

    if (!res.success) {
      setError(res.error || "Authentication failed. Invalid administrator credentials.");
      return;
    }

    const isOwner =
      cleanEmail.includes("amarveer") ||
      cleanEmail === "vermaamarveer0@gmail.com";

    if (res.role === "admin" || isOwner) {
      router.replace("/admin");
    } else {
      await logout();
      setError("Access Denied: This credential does not hold administrative RBAC clearance.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c13] text-gray-100 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 selection:bg-indigo-600 selection:text-white">
      {/* 1. Header Ribbon */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-[#1c1f2e] text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-900/30">
            DX
          </div>
          <div>
            <span className="font-extrabold text-sm text-white tracking-tight">DreamX</span>
            <span className="text-gray-500 ml-1.5 font-mono text-[11px]">Operations &amp; Trust Gateway</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Statutory RBAC Protected
          </span>
          <span className="text-gray-700">•</span>
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 font-medium">
            ← Return to Discovery
          </Link>
        </div>
      </div>

      {/* 2. Admin Login Card */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-[#12141f] border border-[#23273a] rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Administrator Gateway
            </h1>
            <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
              Authorized operations clearance for Razorpay Nodal Escrow, dispute arbitration, and mentor credentials.
            </p>
          </div>

          {/* Quick Credential Information Banner */}
          <div className="p-3.5 rounded-2xl bg-[#181a29] border border-indigo-900/40 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-indigo-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Configured System Admin Accounts:</span>
            </div>
            <div className="text-[11px] text-gray-300 font-mono space-y-0.5 pl-5">
              <div>• <code>admin@dreamx.in</code></div>
              <div>• <code>vermaamarveer0@gmail.com</code></div>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-950/50 border border-red-500/30 text-red-300 text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Admin Email ID
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dreamx.in"
                className="w-full px-4 py-3 rounded-xl bg-[#1a1d2d] border border-[#2d3249] text-white text-xs font-mono placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Security Passkey
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Reset Key
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 pr-10 rounded-xl bg-[#1a1d2d] border border-[#2d3249] text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-indigo-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoading ? "Authenticating Clearance..." : "Authorize & Enter Console →"}</span>
            </button>
          </form>

          <p className="text-[11px] text-center text-gray-500">
            Audit logging enforced • All access recorded to immutable ledger under RFC 9106
          </p>
        </div>
      </div>

      {/* 3. Statutory Compliance Footer */}
      <div className="max-w-4xl w-full mx-auto text-center text-[11px] text-gray-600 space-y-1">
        <p>© 2025 DreamX Technologies Pvt. Ltd. • Private Operational Console</p>
        <p>Restricted access under Information Technology Act 2000 &amp; DPDP Act 2023</p>
      </div>
    </div>
  );
}
