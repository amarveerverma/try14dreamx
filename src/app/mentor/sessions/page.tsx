"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileCheck,
  Clock,
  UploadCloud,
  Video,
} from "lucide-react";

export default function MentorSessionsPage() {
  const sessions = [
    {
      id: "SES-7712",
      student: "Candidate #DX-8421",
      service: "Technical Mock Interview (S06)",
      scheduledTime: "Nov 11, 2026 at 7:00 PM IST",
      status: "Upcoming Live Call",
      deliverableStatus: "Rubric Report Pending Call",
      payout: "₹799 (Escrow Funded)",
      sla: "48h SLA after call",
    },
    {
      id: "SES-7690",
      student: "Candidate #DX-7104",
      service: "Resume Line-by-Line Teardown (S01)",
      scheduledTime: "Async Review (Assigned Nov 9)",
      status: "In Review",
      deliverableStatus: "Ready for Annotated PDF Upload",
      payout: "₹479 (Escrow Funded)",
      sla: "22 hours remaining",
    },
  ];

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5145cd]">
          <FileCheck className="w-3.5 h-3.5" />
          <span>Deliverable Fulfillment</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
          Active Sessions &amp; Deliverables
        </h1>
        <p className="text-xs sm:text-sm text-[#66666f]">
          Submit standardized rubric scorecards within 48 hours of call completion to trigger automated escrow payout settlement.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sessions.map((s) => (
          <Card key={s.id} className="p-6 bg-white border-[#e7e7eb] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-[#171717]">{s.service}</h3>
                  <Badge variant="verified">{s.status}</Badge>
                </div>
                <span className="text-xs text-[#5145cd] font-semibold">{s.student} • {s.scheduledTime}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#8b8b95] block">Contract Payout</span>
                <span className="text-lg font-extrabold text-[#16834a] tnum">{s.payout}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fafafc] border border-[#e7e7eb] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#171717]">
                <Clock className="w-4 h-4 text-[#a7670b]" />
                <span><strong>Contractual SLA:</strong> {s.sla}</span>
              </div>
              <span className="text-[#66666f]">{s.deliverableStatus}</span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-[#8b8b95]">Session ID: {s.id}</span>
              <div className="flex items-center gap-3">
                <Button size="sm" variant="outline">
                  <Video className="w-3.5 h-3.5 mr-1" />
                  <span>Join Session</span>
                </Button>
                <Button size="sm" className="shadow-xs">
                  <UploadCloud className="w-3.5 h-3.5 mr-1" />
                  <span>Submit Scorecard</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
