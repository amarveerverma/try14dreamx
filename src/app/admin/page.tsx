"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const pendingVerifications = [
    {
      id: "MTR-1042",
      name: "Siddharth Rao",
      company: "Atlassian",
      role: "Senior SDE (Concurrency & Core)",
      experience: "8 yrs",
      submitted: "2 hours ago",
    },
    {
      id: "MTR-1045",
      name: "Meera Krishnan",
      company: "Flipkart",
      role: "Staff Software Engineer",
      experience: "10 yrs",
      submitted: "5 hours ago",
    },
  ];

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Admin Safety Ribbon */}
      <section className="bg-[#1e1b4b] text-white py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16834a]" />
            <span className="font-bold">DreamX Operations & Trust Console</span>
            <span className="text-[#8b8b95]">•</span>
            <span className="text-[#94f7b2]">Role: Staff Administrator</span>
          </div>
          <span className="text-xs text-[#e0e7ff]/80">
            Audit logging strictly enabled per PRD §21
          </span>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
            Marketplace Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#66666f]">
            Monitor mentor verification audits, Smart Match dispatch waves, and escrow settlements.
          </p>
        </div>

        {/* Operational Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-5 bg-white border-[#e7e7eb] shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8b8b95]">
              Active Bookings in Escrow
            </span>
            <div className="text-3xl font-extrabold text-[#171717]">48</div>
            <p className="text-[11px] text-[#16834a] font-semibold">100% SLA compliant</p>
          </Card>

          <Card className="p-5 bg-white border-[#e7e7eb] shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8b8b95]">
              Smart Match Wave 1 Rate
            </span>
            <div className="text-3xl font-extrabold text-[#5145cd]">92.4%</div>
            <p className="text-[11px] text-[#66666f]">Accepted within 30 min</p>
          </Card>

          <Card className="p-5 bg-white border-[#e7e7eb] shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8b8b95]">
              Pending Mentor Audits
            </span>
            <div className="text-3xl font-extrabold text-[#a7670b]">2</div>
            <p className="text-[11px] text-[#66666f]">Work history verification</p>
          </Card>

          <Card className="p-5 bg-white border-[#e7e7eb] shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8b8b95]">
              Active Disputes
            </span>
            <div className="text-3xl font-extrabold text-[#16834a]">0</div>
            <p className="text-[11px] text-[#16834a] font-semibold">Clean marketplace record</p>
          </Card>
        </div>

        {/* Verification Queue Table */}
        <Card className="p-6 sm:p-8 bg-white border-[#e7e7eb] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#e7e7eb]">
            <h2 className="text-lg font-bold text-[#171717]">
              Mentor Verification Queue (Work History & Corporate Email Audit)
            </h2>
            <Badge variant="warning">2 Pending Review</Badge>
          </div>

          <div className="space-y-3">
            {pendingVerifications.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-xl bg-[#fafafc] border border-[#e7e7eb] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#5145cd]">{v.id}</span>
                    <span className="font-bold text-sm text-[#171717]">{v.name}</span>
                  </div>
                  <p className="text-xs text-[#66666f]">
                    {v.role} @ <strong className="text-[#171717]">{v.company}</strong> • Experience: {v.experience}
                  </p>
                  <span className="text-[11px] text-[#8b8b95]">Submitted: {v.submitted}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Inspect Proof
                  </Button>
                  <Button size="sm">
                    Approve Mentor
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
