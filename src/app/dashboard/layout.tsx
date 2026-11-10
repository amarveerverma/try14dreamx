"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Target,
  Calendar,
  FileCheck,
  Compass,
  CreditCard,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";

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
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "8-Axis Readiness", href: "/dashboard/readiness", icon: Target },
    { name: "My Bookings & SLAs", href: "/dashboard/bookings", icon: Calendar, badge: "Active" },
    { name: "Diagnostic Reports", href: "/dashboard/reports", icon: FileCheck },
    { name: "Explore Services (S01–S10)", href: "/services", icon: Compass },
    { name: "Membership & Discounts", href: "/membership", icon: CreditCard },
    { name: "Settings & DPDP", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-16rem)] w-full">
      {/* Persistent Student Sidebar */}
      <aside className="w-full lg:w-64 bg-white border-r border-[#e7e7eb] shrink-0 flex flex-col justify-between">
        <div className="p-4 sm:p-5 space-y-6">
          {/* User Identity Pill */}
          <div className="p-3.5 rounded-xl bg-[#fafafc] border border-[#e7e7eb] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b8b95]">
                Candidate Console
              </span>
              <Badge variant={membership.tier === "free" ? "neutral" : "verified"}>
                {membership.tier.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#5145cd] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "DX"}
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-bold text-xs text-[#171717] block truncate">
                  {user?.name || "Candidate"}
                </span>
                <span className="text-[11px] text-[#8b8b95] block truncate">
                  {user?.id || "DX-8421"}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1" aria-label="Student Workspace">
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
            <ShieldCheck className="w-3.5 h-3.5 text-[#16834a]" />
            <span>Escrow Protected • CM-IN</span>
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
      <div className="flex-1 min-w-0 bg-[#fafafc]">
        {children}
      </div>
    </div>
  );
}
