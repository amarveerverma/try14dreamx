"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";

export default function AdminVerificationQueuePage() {
  const [queue, setQueue] = React.useState([
    {
      id: "MTR-APP-1029",
      name: "Siddharth Verma",
      employer: "Google India (Bengaluru)",
      role: "Staff SDE (L6 • 9 yrs exp)",
      appliedServices: ["S06 Technical Mock", "S07 System Design Mock"],
      workEmailVerified: true,
      documentUploaded: "Corporate Badge & Redacted ID.pdf",
      linkedin: "linkedin.com/in/siddharth-v",
      reviewSlaHours: 14,
    },
    {
      id: "MTR-APP-1033",
      name: "Neha Kulkarni",
      employer: "Razorpay (FinTech Core)",
      role: "Lead Product Manager (7 yrs exp)",
      appliedServices: ["S01 Resume Review", "S03 LinkedIn Optimization"],
      workEmailVerified: true,
      documentUploaded: "Employment_Offer_Redacted.pdf",
      linkedin: "linkedin.com/in/neha-k-pm",
      reviewSlaHours: 19,
    },
  ]);

  const handleAction = (id: string) => {
    setQueue(queue.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-8">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5145cd]">
          <Users className="w-3.5 h-3.5" />
          <span>Dual-Control Audit Queue</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
          Mentor Credential &amp; Verification Queue
        </h1>
        <p className="text-xs sm:text-sm text-[#66666f]">
          Review pending industry mentor applications against corporate domain verification, professional seniority, and service-specific criteria.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {queue.length === 0 ? (
          <Card className="p-8 bg-white border-[#e7e7eb] text-center text-xs text-[#8b8b95]">
            All mentor applications processed. Queue is clear!
          </Card>
        ) : (
          queue.map((app) => (
            <Card key={app.id} className="p-6 bg-white border-[#e7e7eb] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-[#171717]">{app.name}</h3>
                    <Badge variant="verified">Work Email Confirmed</Badge>
                  </div>
                  <span className="text-xs text-[#5145cd] font-semibold">{app.role} @ {app.employer}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#8b8b95] block">Review SLA</span>
                  <span className="text-xs font-bold text-[#a7670b]">{app.reviewSlaHours}h remaining</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#fafafc] border border-[#e7e7eb] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#8b8b95] block mb-1 font-semibold">Applied Service Tracks:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {app.appliedServices.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-[#eef2ff] text-[#5145cd] font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[#8b8b95] block mb-1 font-semibold">Evidence Documentation:</span>
                  <span className="text-[#171717] font-medium flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-[#5145cd]" />
                    {app.documentUploaded}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-[#8b8b95]">Ref: {app.id}</span>
                <div className="flex items-center gap-3">
                  <Button size="sm" variant="danger" onClick={() => handleAction(app.id)}>
                    <XCircle className="w-3.5 h-3.5 mr-1" />
                    <span>Reject Application</span>
                  </Button>
                  <Button size="sm" onClick={() => handleAction(app.id)} className="shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    <span>Approve &amp; Activate Mentor</span>
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
