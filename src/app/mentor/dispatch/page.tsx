"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function MentorDispatchPage() {
  const [offers, setOffers] = React.useState([
    {
      id: "REQ-8902",
      service: "Technical Mock Interview (S06)",
      student: "Candidate #DX-9124",
      targetGoal: "Targeting Google L4 / Swiggy L5 Track",
      payout: "₹799",
      slot: "Tomorrow at 7:30 PM IST",
      remainingSeconds: 1420,
      wave: "Wave 1 (Direct Fit)",
    },
    {
      id: "REQ-8905",
      service: "Resume Line-by-Line Teardown (S01)",
      student: "Candidate #DX-8411",
      targetGoal: "FinTech GCC Senior Backend Switch",
      payout: "₹479",
      slot: "Async 48h SLA Delivery",
      remainingSeconds: 890,
      wave: "Wave 1 (High Seniority Fit)",
    },
  ]);

  const handleAccept = (id: string) => {
    setOffers(offers.filter((o) => o.id !== id));
  };

  const handleDecline = (id: string) => {
    setOffers(offers.filter((o) => o.id !== id));
  };

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5145cd]">
          <Zap className="w-3.5 h-3.5" />
          <span>Smart Match Dispatch Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
          Active Smart Match Booking Offers
        </h1>
        <p className="text-xs sm:text-sm text-[#66666f]">
          Review and accept matched student session requests. Wave 1 dispatch requests must be accepted within the 30-minute SLA window before escalating to Wave 2.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {offers.length === 0 ? (
          <Card className="p-8 bg-white border-[#e7e7eb] text-center text-xs text-[#8b8b95]">
            No pending dispatch offers right now. New Smart Match requests will appear here in real-time.
          </Card>
        ) : (
          offers.map((o) => (
            <Card key={o.id} className="p-6 bg-white border-[#e7e7eb] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-[#171717]">{o.service}</span>
                    <Badge variant="verified">{o.wave}</Badge>
                  </div>
                  <span className="text-xs text-[#66666f]">{o.targetGoal}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#8b8b95] block">Cleared Payout</span>
                  <span className="text-xl font-extrabold text-[#16834a] tnum">{o.payout}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#fafafc] border border-[#e7e7eb] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#171717]">
                  <Clock className="w-4 h-4 text-[#5145cd]" />
                  <span><strong>Schedule:</strong> {o.slot}</span>
                </div>
                <div className="flex items-center gap-2 text-[#a7670b] font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>Acceptance Window: ~{Math.floor(o.remainingSeconds / 60)} mins remaining</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-[#8b8b95]">Request ID: {o.id}</span>
                <div className="flex items-center gap-3">
                  <Button size="sm" variant="outline" onClick={() => handleDecline(o.id)}>
                    <XCircle className="w-3.5 h-3.5 mr-1" />
                    <span>Decline</span>
                  </Button>
                  <Button size="sm" onClick={() => handleAccept(o.id)} className="shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    <span>Accept Booking ({o.payout})</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
