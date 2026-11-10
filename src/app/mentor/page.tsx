"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Clock,
  Calendar,
  Bell,
} from "lucide-react";

export default function MentorDashboardPage() {
  const pendingOffers = [
    {
      id: "REQ-8902",
      service: "Technical Mock Interview (S06)",
      student: "Candidate #DX-9124",
      targetCompany: "Google L4 / Swiggy L5 Track",
      payout: "₹799",
      slot: "Tomorrow at 7:30 PM IST",
      timerMinutes: 24,
    },
    {
      id: "REQ-8905",
      service: "Resume Line-by-Line Teardown (S01)",
      student: "Candidate #DX-8411",
      targetCompany: "FinTech GCC Senior Backend",
      payout: "₹479",
      slot: "Async 48h SLA",
      timerMinutes: 18,
    },
  ];

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Mentor Verification Header Ribbon */}
      <section className="bg-white border-b border-[#e7e7eb] py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16834a]" />
            <span className="font-semibold text-[#171717]">Vikram Singh</span>
            <span className="text-[#8b8b95]">•</span>
            <span className="text-[#5145cd] font-semibold">Senior L5 AI/ML Mentor @ Google</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="verified">Employment Audit Verified</Badge>
            <span className="text-[#66666f]">Timezone: Asia/Kolkata</span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 w-full">
        {/* Welcome Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
              Mentor Delivery Console
            </h1>
            <p className="text-xs sm:text-sm text-[#66666f]">
              Review live Smart Match dispatch offers, upcoming sessions, and deliverable SLAs.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              <span>Update Availability</span>
            </Button>
          </div>
        </div>

        {/* 3 Top Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white border-[#e7e7eb] shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8b8b95]">
              Accrued Earnings (Escrow & Cleared)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#171717] tnum">
                ₹18,450
              </span>
              <span className="text-xs font-semibold text-[#16834a]">
                Weekly Payout Cleared
              </span>
            </div>
            <p className="text-[11px] text-[#66666f]">
              Auto-settlement via UPI/NEFT to HDFC Bank (**** 4812)
            </p>
          </Card>

          <Card className="p-6 bg-white border-[#e7e7eb] shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8b8b95]">
              Delivery SLA Compliance
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#16834a] tnum">
                100%
              </span>
              <span className="text-xs text-[#66666f]">on-time turnaround</span>
            </div>
            <p className="text-[11px] text-[#66666f]">
              All 48-hour rubric reports delivered within contractual window
            </p>
          </Card>

          <Card className="p-6 bg-white border-[#e7e7eb] shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8b8b95]">
              Active Sessions & Teardowns
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#5145cd] tnum">
                3
              </span>
              <span className="text-xs text-[#66666f]">in progress</span>
            </div>
            <p className="text-[11px] text-[#66666f]">
              2 live video mock sessions, 1 async code teardown
            </p>
          </Card>
        </div>

        {/* Live Dispatch Offers */}
        <Card className="p-6 sm:p-8 bg-white border-[#e7e7eb] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#e7e7eb]">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#5145cd]" />
              <h2 className="text-lg font-bold text-[#171717]">
                Smart Match Dispatch Wave 1 Offers
              </h2>
            </div>
            <Badge variant="warning">Action Required</Badge>
          </div>

          <div className="space-y-4">
            {pendingOffers.map((offer) => (
              <div
                key={offer.id}
                className="p-5 rounded-2xl bg-[#fafafc] border border-[#e7e7eb] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#5145cd]">
                      {offer.id}
                    </span>
                    <span className="text-sm font-bold text-[#171717]">
                      {offer.service}
                    </span>
                  </div>
                  <p className="text-xs text-[#66666f]">
                    Candidate: <strong className="text-[#171717]">{offer.student}</strong> ({offer.targetCompany})
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[#8b8b95] pt-1">
                    <span className="flex items-center gap-1 text-[#16834a] font-semibold">
                      <Clock className="w-3.5 h-3.5" /> Slot: {offer.slot}
                    </span>
                    <span>•</span>
                    <span className="text-[#c43b3b] font-medium">
                      Expires in {offer.timerMinutes} mins (Wave 2 re-dispatch)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-0 border-[#e7e7eb]">
                  <span className="text-lg font-extrabold text-[#171717] tnum mr-2">
                    {offer.payout}
                  </span>
                  <Button variant="outline" size="sm">
                    Decline
                  </Button>
                  <Button size="sm">
                    Accept Offer
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
