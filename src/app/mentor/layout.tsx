"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  ShieldCheck,
  Zap,
  Calendar,
  FileCheck,
  DollarSign,
  LogOut,
  Clock,
} from "lucide-react";

export default function MentorWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, isLoading } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

  // If in the onboarding wizard, render standalone
  if (pathname === "/mentor/onboarding") {
    return <>{children}</>;
  }

  // Auth and Mentor Role Gate
  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace(`/login?role=mentor&redirect=${encodeURIComponent(pathname)}`);
      } else if (user.role !== "mentor" && user.role !== "admin") {
        router.replace("/mentor/onboarding?notice=apply_as_mentor");
      }
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-[#fafafc]">
        <div className="w-10 h-10 border-3 border-[#5145cd] border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs font-semibold text-[#474554] font-mono">
          Verifying Mentor Credentials...
        </span>
      </div>
    );
  }

  if (!user || (user.role !== "mentor" && user.role !== "admin")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-[#fafafc]">
        <div className="w-10 h-10 border-3 border-[#5145cd] border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs font-semibold text-[#474554] font-mono">
          Redirecting to authentication...
        </span>
      </div>
    );
  }

  const navItems = [
    { name: "Delivery Console", href: "/mentor", icon: LayoutDashboard },
    { name: "Verification Status", href: "/mentor/verification", icon: ShieldCheck, badge: "Verified" },
    { name: "Live Dispatch Offers", href: "/mentor/dispatch", icon: Zap, badge: "2 Live" },
    { name: "Sessions & SLA Reports", href: "/mentor/sessions", icon: FileCheck },
    { name: "Availability Calendar", href: "/mentor/availability", icon: Calendar },
    { name: "Earnings & Payouts", href: "/mentor/earnings", icon: DollarSign },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-14rem)] w-full">
      {/* 1. Mobile & Tablet Sticky Top Sub-Bar (Hidden on Desktop lg:hidden) */}
      <div className="lg:hidden sticky top-16 sm:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-[#e7e7eb] shadow-xs">
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-[#e7e7eb]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#16834a] text-white flex items-center justify-center font-bold text-[11px] shadow-xs shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "MP"}
            </div>
            <span className="font-bold text-xs text-[#171717] block truncate">
              {user?.name || "Mentor Partner"}
            </span>
            <Badge variant="verified" className="text-[9px] px-1.5 py-0 shrink-0">
              Verified
            </Badge>
          </div>

          <button
            type="button"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="flex items-center gap-1 text-[11px] font-bold text-[#5145cd] bg-[#5145cd]/10 px-2.5 py-1 rounded-lg hover:bg-[#5145cd]/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">menu_open</span>
            <span>Console Menu</span>
          </button>
        </div>

        {/* Horizontal Swipeable Nav Strip */}
        <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? "bg-[#5145cd] text-white font-bold shadow-xs"
                    : "bg-[#fafafc] text-[#66666f] hover:text-[#171717] border border-[#e7e7eb]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#8b8b95]"}`} />
                <span>{item.name}</span>
                {item.badge && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16834a]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* 2. Full Mobile Slide-Over Drawer for Tablet/Mobile */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-5 flex flex-col justify-between z-50 overflow-y-auto">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#e7e7eb]">
                <span className="font-bold text-sm text-[#171717] font-heading">
                  Mentor Workspace
                </span>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              {/* Identity Widget inside drawer */}
              <div className="p-3 rounded-xl bg-[#fafafc] border border-[#e7e7eb] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8b8b95] font-mono">
                    Accredited Mentor
                  </span>
                  <Badge variant="verified" className="text-[9px]">Verified</Badge>
                </div>
                <div className="font-bold text-xs text-[#171717] truncate">
                  {user?.name || "Mentor Partner"}
                </div>
                <div className="text-[11px] text-[#5145cd] truncate font-mono">
                  {user?.email || "mentor@dreamx.in"}
                </div>
              </div>

              {/* Navigation list */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-[#eef2ff] text-[#5145cd] font-bold shadow-xs"
                          : "text-[#66666f] hover:bg-[#fafafc] hover:text-[#171717]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? "text-[#5145cd]" : "text-[#8b8b95]"}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded-full bg-[#ebf7ee] text-[#16834a] text-[10px] font-bold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#e7e7eb] space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Desktop Persistent Mentor Sidebar (Hidden on mobile < lg) */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-[#e7e7eb] shrink-0 flex-col justify-between sticky top-20 h-[calc(100vh-5rem)]">
        <div className="p-4 sm:p-5 space-y-6 overflow-y-auto">
          {/* Mentor Profile Pill */}
          <div className="p-3.5 rounded-xl bg-[#fafafc] border border-[#e7e7eb] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b8b95]">
                Mentor Console
              </span>
              <Badge variant="verified">Audit Passed</Badge>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#16834a] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "MP"}
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-bold text-xs text-[#171717] block truncate">
                  {user?.name || "Mentor Partner"}
                </span>
                <span className="text-[11px] text-[#5145cd] font-semibold block truncate">
                  {user?.email || "mentor@dreamx.in"}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1" aria-label="Mentor Workspace">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#eef2ff] text-[#5145cd] font-bold shadow-xs"
                      : "text-[#66666f] hover:bg-[#fafafc] hover:text-[#171717]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#5145cd]" : "text-[#8b8b95]"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#ebf7ee] text-[#16834a] text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-[#e7e7eb] space-y-3 text-xs">
          <div className="flex items-center gap-2 text-[11px] text-[#8b8b95]">
            <Clock className="w-3.5 h-3.5 text-[#5145cd]" />
            <span>Timezone: Asia/Kolkata (IST)</span>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#8b8b95] hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Sub-Router Content */}
      <div className="flex-1 min-w-0 bg-[#fafafc] overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
