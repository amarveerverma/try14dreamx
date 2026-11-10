"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = React.useState([
    {
      id: "DSP-104",
      bookingId: "BK-7891",
      student: "Candidate #DX-3312",
      mentor: "Mentor #MTR-402",
      issue: "48-Hour SLA Exceeded — Mentor deliverable report was 5 hours overdue",
      amount: "₹799",
      suggestedAction: "Automated 100% Escrow Disgorgement Refund",
    },
  ]);

  const handleRefund = (id: string) => {
    setDisputes(disputes.filter((d) => d.id !== id));
  };

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-8">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c43b3b]">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Consumer Protection &amp; Escrow Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
          SLA Exceptions &amp; Escrow Disputes
        </h1>
        <p className="text-xs sm:text-sm text-[#66666f]">
          Enforce the 48-Hour SLA Guarantee. Failed sessions trigger automated 100% disgorgement of held escrow funds to the candidate.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {disputes.length === 0 ? (
          <Card className="p-8 bg-white border-[#e7e7eb] text-center text-xs text-[#16834a] font-semibold">
            Zero active disputes. All 48-hour delivery SLAs are in compliance.
          </Card>
        ) : (
          disputes.map((d) => (
            <Card key={d.id} className="p-6 bg-white border-[#ffdad6] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-[#171717]">{d.bookingId}</span>
                    <Badge variant="danger">SLA Breach</Badge>
                  </div>
                  <span className="text-xs text-[#66666f]">{d.student} vs {d.mentor}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#8b8b95] block">Held in Escrow</span>
                  <span className="text-xl font-extrabold text-[#c43b3b] tnum">{d.amount}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#fdf2f2] border border-[#ffdad6] text-xs text-[#66666f] leading-relaxed">
                <span className="font-bold text-[#c43b3b] block mb-0.5">Dispute Reason:</span>
                {d.issue}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-[#8b8b95]">Incident Ref: {d.id}</span>
                <Button size="sm" variant="danger" onClick={() => handleRefund(d.id)} className="shadow-xs">
                  <RefreshCw className="w-3.5 h-3.5 mr-1" />
                  <span>Execute 100% Escrow Refund to Candidate</span>
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
