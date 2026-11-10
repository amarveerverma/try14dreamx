"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Lock,
} from "lucide-react";

export default function AdminWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Operations Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Mentor Verification Queue", href: "/admin/verification", icon: Users, badge: "4 Pending" },
    { name: "Disputes & Escrow Refunds", href: "/admin/disputes", icon: AlertTriangle },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-16rem)] w-full">
      {/* Persistent Admin Sidebar */}
      <aside className="w-full lg:w-64 bg-[#1e2029] text-white shrink-0 flex flex-col justify-between">
        <div className="p-4 sm:p-5 space-y-6">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                Staff Operations
              </span>
              <Badge variant="danger">Dual-Control</Badge>
            </div>
            <span className="font-bold text-xs text-white block">
              Super Admin Console
            </span>
            <span className="text-[11px] text-white/60 block">
              Audited Session • Zero Secrets
            </span>
          </div>

          <nav className="space-y-1" aria-label="Admin Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#5145cd] text-white font-bold shadow-xs"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-white/60"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 space-y-2 text-xs text-white/50">
          <div className="flex items-center gap-2 text-[11px]">
            <Lock className="w-3.5 h-3.5 text-[#16834a]" />
            <span>DPDP &amp; IT Rules Compliant</span>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 min-w-0 bg-[#fafafc]">
        {children}
      </div>
    </div>
  );
}
