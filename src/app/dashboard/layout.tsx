"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, membership, logout } = useAuth();

  // If inside the onboarding wizard, render standalone full-screen
  if (pathname === "/dashboard/onboarding") {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: "dashboard" },
    { name: "Discover", href: "/dashboard/journey", icon: "explore" },
    { name: "Services", href: "/services", icon: "hub" },
    { name: "My Bookings", href: "/dashboard/bookings", icon: "calendar_today", badge: "Active" },
    { name: "Career Readiness", href: "/dashboard/readiness", icon: "verified_user" },
    { name: "Career Journey", href: "/dashboard/journey", icon: "trending_up" },
    { name: "Reports", href: "/dashboard/reports", icon: "bar_chart" },
    { name: "Membership", href: "/membership", icon: "military_tech" },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-16rem)] w-full bg-surface">
      {/* Persistent Student Sidebar */}
      <aside className="w-full lg:w-64 bg-surface-container-lowest border-r border-outline-variant/30 shrink-0 flex flex-col justify-between shadow-xs">
        <div className="p-4 sm:p-5 space-y-6">
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
              <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "AS"}
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-bold text-xs text-on-surface block truncate">
                  {user?.name || "Ananya Sharma"}
                </span>
                <span className="text-[11px] text-on-surface-variant block truncate font-mono">
                  {user?.id || "Candidate #DX-8421"}
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
        <div className="p-4 bg-surface-container-low border-t border-outline-variant/20 space-y-2">
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
      <div className="flex-1 min-w-0 bg-background">
        {children}
      </div>
    </div>
  );
}
