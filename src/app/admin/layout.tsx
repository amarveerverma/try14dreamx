"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Scale,
  ShieldCheck,
  CheckCircle2,
  FileCode2,
  Sliders,
  LogOut,
  Lock,
  Bell,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function AdminWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout, refreshProfile } = useAuth();
  const [currentTime, setCurrentTime] = React.useState<string>("");
  const [counts, setCounts] = React.useState<{ verifications?: number; disputes?: number }>({});
  const [isPromotingSelf, setIsPromotingSelf] = React.useState(false);

  const isPlatformOwner =
    user?.email?.toLowerCase().includes("amarveer") ||
    user?.email?.toLowerCase() === "vermaamarveer0@gmail.com" ||
    user?.email?.toLowerCase() === "admin@dreamx.in";

  const isAuthorizedAdmin = user?.role === "admin" || isPlatformOwner;

  React.useEffect(() => {
    if (isAuthorizedAdmin) {
      fetch("/api/admin/overview")
        .then((r) => r.json())
        .then((d) => {
          if (d?.metrics?.queues) {
            setCounts({
              verifications: d.metrics.queues.pendingVerifications,
              disputes: d.metrics.queues.activeDisputes,
            });
          }
        })
        .catch(() => {});
    }
  }, [pathname, isAuthorizedAdmin]);

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istString = now.toLocaleTimeString("en-GB", {
        timeZone: "Asia/Kolkata",
        hour12: false,
      });
      setCurrentTime(istString);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Dedicated Admin Gateway renders standalone without authenticated shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleClaimAdmin = async () => {
    if (!user) return;
    setIsPromotingSelf(true);
    try {
      await fetch("/api/admin/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: user.id, newRole: "admin" }),
      });
      await refreshProfile();
      router.refresh();
    } catch (e) {
      console.warn("Failed to claim admin role:", e);
    } finally {
      setIsPromotingSelf(false);
    }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#11131c] text-white">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mb-4 animate-pulse">
          <Lock className="w-6 h-6 text-indigo-400" />
        </div>
        <p className="text-sm font-bold tracking-tight">Verifying Administrator Credentials...</p>
        <span className="text-xs text-gray-400 mt-1">DreamX PRD §15 Statutory RBAC Guard</span>
      </div>
    );
  }

  // 2. Unauthenticated State
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#11131c] p-6 text-white">
        <div className="max-w-md w-full bg-[#181a26] border border-[#262a3d] p-8 rounded-3xl shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-extrabold tracking-tight font-heading">
              Admin Console Is Private
            </h1>
            <p className="text-xs text-gray-400 leading-relaxed">
              This operations workspace is restricted to accredited platform administrators. Please sign in with your administrative account to access escrow reserves and verification queues.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/admin/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
            >
              <Lock className="w-4 h-4" />
              <span>Sign In with Admin Account →</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Unauthorized User State (Candidate without admin role and not owner)
  if (!isAuthorizedAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#11131c] p-6 text-white">
        <div className="max-w-md w-full bg-[#181a26] border border-[#262a3d] p-8 rounded-3xl shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-extrabold tracking-tight font-heading">
              Restricted: Administrator Access Only
            </h1>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your account (<span className="text-white font-mono">{user.email}</span>) is registered under the <strong className="text-indigo-400 uppercase">{user.role}</strong> role. Only super administrators can access operational ledgers and disputes.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/dashboard"
              className="w-full py-3 px-4 rounded-xl bg-[#232738] hover:bg-[#2c3247] text-white text-xs font-semibold transition-all"
            >
              ← Return to Candidate Dashboard
            </Link>

            {/* Platform owner emergency override button if logged in with owner account */}
            {isPlatformOwner && (
              <button
                type="button"
                onClick={handleClaimAdmin}
                disabled={isPromotingSelf}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
              >
                {isPromotingSelf ? "Promoting Account..." : "Authorize as Platform Super Admin"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      name: "Operations Overview",
      href: "/admin",
      icon: LayoutDashboard,
      badge: null,
      badgeColor: "",
    },
    {
      name: "Mentor Verification",
      href: "/admin/verification",
      icon: Users,
      badge: counts.verifications !== undefined ? `${counts.verifications} Pending` : "Queue",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
    {
      name: "Disputes & Escrow",
      href: "/admin/disputes",
      icon: Scale,
      badge: counts.disputes !== undefined ? `${counts.disputes} Active` : "Arbitration",
      badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
    },
    {
      name: "Launch Gates Matrix",
      href: "/admin/launch-gates",
      icon: ShieldCheck,
      badge: "PRD §22.3",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
    },
    {
      name: "Pilot Acceptance (P14)",
      href: "/admin/pilot",
      icon: CheckCircle2,
      badge: "PRD §22",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-400/30",
    },
    {
      name: "Smart Match Dispatch",
      href: "/mentor/dispatch",
      icon: ShieldCheck,
      badge: "Live Dispatch",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30",
      external: true,
    },
  ];

  const adminInitials = user.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AV";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-[#fcf9f8] text-[#1c1b1b]">
      {/* 1. PERSISTENT LEFT ADMIN SIDEBAR (#171923 deep slate) */}
      <aside className="w-full lg:w-72 bg-[#171923] text-gray-200 shrink-0 flex flex-col justify-between border-r border-[#262a38] z-40 select-none">
        <div>
          {/* Brand & Statutory Dual-Control Indicator */}
          <div className="p-5 border-b border-[#252839]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3828b5] to-[#705cf6] flex items-center justify-center shadow-md shadow-indigo-950/40">
                <span className="font-extrabold text-white text-base tracking-tight font-mono">
                  DX
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white tracking-tight text-base">
                    DreamX
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 uppercase tracking-wider font-mono">
                    ADMIN
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-medium">
                  Operations &amp; Trust Desk
                </p>
              </div>
            </div>

            {/* Dual Control Protocol Active Chip */}
            <div className="mt-4 px-3 py-2 rounded-lg bg-[#1f2334] border border-[#2d334d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="text-[11px] font-semibold text-gray-200">
                  Private Admin Vault
                </span>
              </div>
              <span className="text-[10px] text-indigo-300 font-mono bg-indigo-900/40 px-1.5 py-0.5 rounded border border-indigo-500/30">
                STAFF-SUPER
              </span>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="p-3 space-y-1" aria-label="Admin Navigation">
            <div className="px-3 pt-2 pb-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Operational Ledgers
              </span>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#27264a] text-white border-l-4 border-[#705cf6] shadow-sm shadow-indigo-950/30 font-bold"
                      : "text-gray-300 hover:text-white hover:bg-[#202436]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? "text-[#a5b4fc]"
                          : "text-gray-400 group-hover:text-indigo-300"
                      }`}
                    />
                    <span>{item.name}</span>
                    {item.external && (
                      <ExternalLink className="w-3 h-3 text-gray-500 opacity-60" />
                    )}
                  </div>
                  {item.badge ? (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  ) : isActive ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400"></span>
                  ) : null}
                </Link>
              );
            })}

            <div className="px-3 pt-4 pb-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Governance &amp; Trust
              </span>
            </div>

            <Link
              href="/admin#audit-ledger"
              className="group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white hover:bg-[#202436] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FileCode2 className="w-4 h-4 text-gray-500 group-hover:text-emerald-400" />
                <span>Live Audit Ledger</span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">SHA-256</span>
            </Link>

            <Link
              href="/terms"
              className="group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white hover:bg-[#202436] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-gray-500 group-hover:text-indigo-300" />
                <span>Statutory Compliance</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                DPDP-23
              </span>
            </Link>
          </nav>
        </div>

        {/* Bottom Real Admin Identity */}
        <div className="p-4 border-t border-[#252839] bg-[#13151f] space-y-3">
          <div className="p-2.5 rounded-lg bg-[#1a1e2f] border border-[#2c334b] text-[11px] text-gray-300 leading-tight flex items-start gap-2">
            <Lock className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-gray-200 block text-xs">
                Statutory Custody Guard
              </span>
              <p className="text-[10px] text-gray-400 mt-0.5">
                DPDP Act 2023 §8 &amp; RBI Nodal Direction compliant. Audit trail tamper-locked.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-indigo-900 border border-indigo-500/50 flex items-center justify-center font-bold text-xs text-indigo-200">
                  {adminInitials}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#13151f]"></span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white leading-none truncate">
                  {user.name || "Amarveer Verma"}
                </p>
                <p className="text-[10px] text-gray-400 mt-1 font-mono truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              className="p-1.5 rounded-md hover:bg-[#24293e] text-gray-400 hover:text-red-400 transition-colors"
              title="Sign Out Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Canvas */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#e7e7eb] px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-xs">
          {/* Breadcrumb Hierarchy */}
          <div className="flex items-center gap-2 text-xs text-[#66666f] font-medium">
            <span className="font-semibold text-[#3828b5]">Admin Console</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="hidden sm:inline">Trust Governance</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 hidden sm:inline" />
            <span className="font-bold text-[#1c1b1b]">
              {pathname === "/admin"
                ? "Operations Overview"
                : pathname === "/admin/verification"
                ? "Mentor Verification Queue"
                : pathname === "/admin/disputes"
                ? "Disputes & Escrow Arbitration"
                : "Admin Workspace"}
            </span>
          </div>

          {/* Right Header Chips & Actions */}
          <div className="flex items-center gap-3">
            {/* Live IST Clock */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#f0eded] border border-[#e7e7eb] font-mono text-xs text-[#1c1b1b]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className="font-semibold">
                Asia/Kolkata: {currentTime || "Live"}
              </span>
              <span className="text-[10px] px-1 bg-white rounded text-[#474554]">
                UTC+05:30
              </span>
            </div>

            {/* Private Mode Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">
              <Lock className="w-3 h-3 text-indigo-600" />
              <span>Private Owner Session</span>
            </div>

            {/* Escrow Status Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf3fc] text-[#2864c5] border border-[#2864c5]/30 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2864c5]" />
              <span>Nodal Escrow Active</span>
            </div>

            {/* Notifications */}
            <button
              className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        {/* Workspace Children */}
        <div className="flex-1 min-w-0 bg-[#fafafc]">
          {children}
        </div>
      </div>
    </div>
  );
}
