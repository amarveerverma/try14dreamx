"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
} from "lucide-react";

export default function StudentReportsPage() {
  const reports = [
    {
      id: "RPT-4401",
      title: "ATS Keyword & Format Optimization Rubric (S02)",
      mentor: "Rohit Deshmukh (Founder & Ex-Razorpay)",
      deliveredDate: "Oct 28, 2026",
      fileSize: "1.4 MB PDF",
      score: "91% ATS Compatibility",
      summary: "Evaluated against Workday and Greenhouse parsers. 14 critical keyword gaps patched.",
    },
    {
      id: "RPT-3912",
      title: "Baseline Career Diagnostic Composite",
      mentor: "DreamX Deterministic Engine",
      deliveredDate: "Oct 15, 2026",
      fileSize: "840 KB PDF",
      score: "68 / 100 Baseline",
      summary: "Initial intake diagnostic across 6 evaluated dimensions.",
    },
  ];

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-8">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5145cd]">
          <FileText className="w-3.5 h-3.5" />
          <span>Verified Deliverables</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
          Diagnostic Scorecards &amp; Action Reports
        </h1>
        <p className="text-xs sm:text-sm text-[#66666f]">
          Structured feedback delivered by mentors within the mandatory 48-hour SLA. Download official PDF documentation anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reports.map((r) => (
          <Card key={r.id} className="p-6 bg-white border-[#e7e7eb] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-[#171717]">{r.title}</h3>
                  <Badge variant="verified">Official Audit</Badge>
                </div>
                <span className="text-xs text-[#5145cd] font-semibold">{r.mentor} • Delivered {r.deliveredDate}</span>
              </div>
              <Badge variant="success">{r.score}</Badge>
            </div>

            <p className="text-xs text-[#66666f] leading-relaxed">
              {r.summary}
            </p>

            <div className="pt-3 border-t border-[#f7f7f8] flex items-center justify-between text-xs">
              <span className="text-[#8b8b95]">{r.fileSize} • AES-256 Encrypted</span>
              <Button size="sm" variant="outline" className="shadow-xs">
                <Download className="w-3.5 h-3.5 mr-1" />
                <span>Download Scorecard PDF</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
