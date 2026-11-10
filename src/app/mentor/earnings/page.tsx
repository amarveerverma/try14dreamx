"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  ShieldCheck,
} from "lucide-react";

export default function MentorEarningsPage() {
  const payouts = [
    {
      id: "PAY-1082",
      date: "Nov 5, 2026",
      amount: "₹6,392",
      sessionsCount: 8,
      status: "Settled via NEFT",
      reference: "HDFC-NEFT-9921418",
    },
    {
      id: "PAY-1044",
      date: "Oct 29, 2026",
      amount: "₹12,058",
      sessionsCount: 15,
      status: "Settled via NEFT",
      reference: "HDFC-NEFT-8812903",
    },
  ];

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5145cd]">
          <DollarSign className="w-3.5 h-3.5" />
          <span>Escrow Accounting &amp; Weekly Settlement</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
          Earnings &amp; Payout Settlements
        </h1>
        <p className="text-xs sm:text-sm text-[#66666f]">
          Weekly automated settlement directly to your Indian bank account or UPI ID. 100% list price payout baseline.
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border-[#e7e7eb] shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8b8b95]">
            Cleared for Next Settlement
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#16834a] tnum">₹18,450</span>
            <span className="text-xs text-[#8b8b95]">Auto-release Friday</span>
          </div>
          <p className="text-[11px] text-[#66666f]">
            Settling to HDFC Bank (**** 4812)
          </p>
        </Card>

        <Card className="p-6 bg-white border-[#e7e7eb] shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8b8b95]">
            Currently Held in Escrow
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#5145cd] tnum">₹3,296</span>
            <span className="text-xs text-[#8b8b95]">3 Active Bookings</span>
          </div>
          <p className="text-[11px] text-[#66666f]">
            Disburses upon deliverable scorecard upload
          </p>
        </Card>

        <Card className="p-6 bg-white border-[#e7e7eb] shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8b8b95]">
            Lifetime Settled Revenue
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#171717] tnum">₹1,42,800</span>
          </div>
          <p className="text-[11px] text-[#16834a] font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% on-time delivery record
          </p>
        </Card>
      </div>

      {/* Payout History */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[#171717]">Past Weekly Settlements</h2>
        <div className="grid grid-cols-1 gap-3">
          {payouts.map((p) => (
            <Card key={p.id} className="p-4 bg-white border-[#e7e7eb] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-sm text-[#171717] block">{p.amount} • {p.status}</span>
                <span className="text-[#66666f]">{p.sessionsCount} sessions cleared • UTR: {p.reference}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#8b8b95]">{p.date}</span>
                <Badge variant="verified">Settled</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
