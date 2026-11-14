"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, membership, logout } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

  // Auth and onboarding gate
  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (user.role === "mentor" && pathname === "/dashboard") {
        router.replace("/mentor");
      } else if (!user.onboarding_completed && pathname !== "/dashboard/onboarding") {
        router.replace("/dashboard/onboarding");
      }
    }
  }, [user, isLoading, pathname, router]);

  // If inside the onboarding wizard, render standalone full-screen
  if (pathname === "/dashboard/onboarding") {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] w-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-on-surface-variant font-mono">
            Loading candidate workspace...
          </span>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: "dashboard" },
    { name: "My Bookings", href: "/dashboard/bookings", icon: "calendar_today", badge: "Active" },
    { name: "Career Readiness", href: "/dashboard/readiness", icon: "verified_user" },
    { name: "Career Journey", href: "/dashboard/journey", icon: "trending_up" },
    { name: "1:1 Services", href: "/services", icon: "hub" },
    { name: "Reports & Audits", href: "/dashboard/reports", icon: "bar_chart" },
    { name: "Membership", href: "/membership", icon: "military_tech" },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-14rem)] w-full bg-surface">
      {/* 1. Mobile & Tablet Sticky Top Sub-Bar (Hidden on Desktop lg:hidden) */}
      <div className="lg:hidden sticky top-16 sm:top-20 z-30 bg-surface/95 backdrop-blur-md border-b border-outline-variant/30 shadow-xs">
        {/* Top Mini Header Strip */}
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-outline-variant/20">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[11px] shadow-xs shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "DX"}
            </div>
            <div className="min-w-0">
              <span className="font-bold text-xs text-on-surface block truncate">
                {user?.name || "Candidate"}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container text-[10px] font-bold uppercase shrink-0">
              {membership.tier === "free" ? "Free" : `${membership.tier.toUpperCase()} • 5% off`}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg hover:bg-primary/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">menu_open</span>
            <span>All Sections</span>
          </button>
        </div>

        {/* Horizontal Swipeable Nav Strip */}
        <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? "bg-primary text-on-primary font-bold shadow-xs"
                    : "bg-surface-container text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {item.icon}
                </span>
                <span>{item.name}</span>
                {item.badge && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
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
          <div className="relative ml-auto w-full max-w-xs bg-surface h-full shadow-2xl p-5 flex flex-col justify-between z-50 overflow-y-auto">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                <span className="font-bold text-sm text-on-surface font-heading">
                  Student Portal Navigation
                </span>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              {/* Identity Widget inside drawer */}
              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-outline font-mono">
                    Candidate Profile
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase">
                    {membership.tier === "free" ? "Free Tier" : `${membership.tier.toUpperCase()}`}
                  </span>
                </div>
                <div className="font-bold text-xs text-on-surface truncate">
                  {user?.name || "Candidate"}
                </div>
                <div className="text-[11px] text-on-surface-variant truncate font-mono">
                  {user?.email || "candidate@dreamx.in"}
                </div>
              </div>

              {/* Navigation list */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-primary text-on-primary font-bold shadow-xs"
                          : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[18px]">
                          {item.icon}
                        </span>
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-outline-variant/30 space-y-2">
              <Link
                href="/dashboard/settings"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">settings</span>
                <span>Account Settings</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-error bg-error-container/20 hover:bg-error-container/40 transition-colors cursor-pointer text-left"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Sign Out Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Desktop Persistent Student Sidebar (Hidden on mobile < lg) */}
      <aside className="hidden lg:flex w-64 bg-surface-container-lowest border-r border-outline-variant/30 shrink-0 flex-col justify-between shadow-xs sticky top-20 h-[calc(100vh-5rem)]">
        <div className="p-4 sm:p-5 space-y-6 overflow-y-auto">
          {/* Identity Widget */}
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-outline font-mono">
                Student Portal
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container text-[10px] font-bold uppercase">
                {membership.tier === "free" ? "Free Tier" : `${membership.tier.toUpperCase()} • 5% off`}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "DX"}
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-bold text-xs text-on-surface block truncate">
                  {user?.name || "Candidate"}
                </span>
                <span className="text-[11px] text-on-surface-variant block truncate font-mono">
                  {user?.email || "candidate@dreamx.in"}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Platform Navigation
            </div>
            <nav className="space-y-1" aria-label="Student Workspace">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-primary-container text-on-primary font-bold shadow-xs"
                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`material-symbols-outlined text-[18px] ${isActive ? "text-on-primary" : "text-outline"}`}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer Settings & Logout */}
        <div className="p-4 bg-surface-container-low border-t border-outline-variant/20 space-y-1.5">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span>Settings</span>
          </Link>
          <Link
            href="/how-it-works"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">support_agent</span>
            <span>Support</span>
          </Link>
          <button
            type="button"
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-error hover:bg-error-container/20 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Sub-Router Content */}
      <div className="flex-1 min-w-0 bg-background overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
