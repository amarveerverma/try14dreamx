"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const { logout } = useAuth();

  // If in the onboarding wizard, render standalone
  if (pathname === "/mentor/onboarding") {
    return <>{children}</>;
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
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-16rem)] w-full">
      {/* Persistent Mentor Sidebar */}
      <aside className="w-full lg:w-64 bg-white border-r border-[#e7e7eb] shrink-0 flex flex-col justify-between">
        <div className="p-4 sm:p-5 space-y-6">
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
                VS
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-bold text-xs text-[#171717] block truncate">
                  Vikram Singh
                </span>
                <span className="text-[11px] text-[#5145cd] font-semibold block truncate">
                  Senior L5 @ Google
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
      <div className="flex-1 min-w-0 bg-[#fafafc]">
        {children}
      </div>
    </div>
  );
}
