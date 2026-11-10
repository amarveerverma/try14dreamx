"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Target,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function CareerReadinessPage() {
  const dimensions = [
    {
      id: "dim-1",
      name: "1. Resume & Storytelling",
      score: 4.2,
      max: 5,
      weight: "15%",
      status: "Evaluated (S01 Review)",
      coverage: "High",
      summary: "Line-by-line metrics and STAR impact quantified. Ready for Tier-1 screening.",
      color: "text-[#16834a]",
    },
    {
      id: "dim-2",
      name: "2. Technical Depth & Stack",
      score: 3.5,
      max: 5,
      weight: "20%",
      status: "Evaluated (S06 Mock)",
      coverage: "Medium",
      summary: "Strong algorithms; needs deeper coverage in low-latency concurrency.",
      color: "text-[#5145cd]",
    },
    {
      id: "dim-3",
      name: "3. System Design & Scalability",
      score: 2.8,
      max: 5,
      weight: "15%",
      status: "Intervention Recommended",
      coverage: "Low",
      summary: "Microservices basics clear; needs practice in cache invalidation and partition tolerance.",
      color: "text-[#a7670b]",
    },
    {
      id: "dim-4",
      name: "4. Proof of Work (GitHub & OSS)",
      score: 4.0,
      max: 5,
      weight: "15%",
      status: "Evaluated",
      coverage: "High",
      summary: "2 production systems deployed on AWS with CI/CD actions.",
      color: "text-[#16834a]",
    },
    {
      id: "dim-5",
      name: "5. Behavioral & Leadership (STAR)",
      score: 3.8,
      max: 5,
      weight: "10%",
      status: "Evaluated",
      coverage: "Medium",
      summary: "Good structure; needs tighter retrospective and ownership framing.",
      color: "text-[#5145cd]",
    },
    {
      id: "dim-6",
      name: "6. Interview Execution (Live Mock)",
      score: 0.0,
      max: 5,
      weight: "10%",
      status: "Unassessed",
      coverage: "None",
      summary: "No live technical mock completed yet. Book S06 to unlock this dimension.",
      color: "text-[#8b8b95]",
    },
    {
      id: "dim-7",
      name: "7. Career Strategy & Market Timing",
      score: 4.5,
      max: 5,
      weight: "10%",
      status: "Evaluated",
      coverage: "High",
      summary: "Targeting SDE-2 and APM GCC tracks with optimal timing.",
      color: "text-[#16834a]",
    },
    {
      id: "dim-8",
      name: "8. Executive Confidence & Presence",
      score: 0.0,
      max: 5,
      weight: "5%",
      status: "Unassessed",
      coverage: "None",
      summary: "Evaluated in-call by senior staff mentors during live simulation.",
      color: "text-[#8b8b95]",
    },
  ];

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5145cd]">
            <Target className="w-3.5 h-3.5" />
            <span>Deterministic Career Diagnostic</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
            8-Dimension Readiness Model
          </h1>
          <p className="text-xs sm:text-sm text-[#66666f]">
            Evidence-informed evaluation calibrated for Tier-1 Indian tech unicorns and GCC hubs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/services/s07-career-consultation">
            <Button size="sm">
              <span>Book System Design Mock (S07)</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Composite Score Card */}
      <Card className="p-6 sm:p-8 bg-white border-[#e7e7eb] shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8b8b95]">
            Composite Readiness Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-[#171717] tnum">68</span>
            <span className="text-sm font-semibold text-[#8b8b95]">/ 100</span>
          </div>
          <p className="text-xs text-[#16834a] font-semibold">
            +14 points above Tier-2 college baseline
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8b8b95]">
            Evidence Coverage
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#171717]">6 of 8</span>
            <span className="text-xs text-[#66666f]">Dimensions Evaluated</span>
          </div>
          <div className="w-full bg-[#f0eded] rounded-full h-2">
            <div className="bg-[#5145cd] h-2 rounded-full w-[75%]" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#fafafc] border border-[#e7e7eb] space-y-1.5 text-xs text-[#66666f]">
          <span className="font-bold text-[#171717] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#16834a]" />
            Private by Default
          </span>
          <p>
            Your scores are visible only to you and mentors you explicitly book. DreamX never publishes student diagnostic data.
          </p>
        </div>
      </Card>

      {/* 8-Dimension Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dimensions.map((dim) => (
          <Card key={dim.id} className="p-5 bg-white border-[#e7e7eb] shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-[#171717]">{dim.name}</h3>
                <span className="text-[11px] text-[#8b8b95]">
                  Weight in Composite: {dim.weight} • Coverage: {dim.coverage}
                </span>
              </div>
              <Badge variant={dim.score > 0 ? "verified" : "neutral"}>
                {dim.score > 0 ? `${dim.score} / 5.0` : "Unassessed"}
              </Badge>
            </div>

            <p className="text-xs text-[#66666f] leading-relaxed">
              {dim.summary}
            </p>

            <div className="pt-2 border-t border-[#f7f7f8] flex items-center justify-between text-[11px]">
              <span className={`font-semibold ${dim.color}`}>{dim.status}</span>
              {dim.score === 0 && (
                <Link href="/services" className="text-[#5145cd] font-bold hover:underline flex items-center gap-1">
                  Book Diagnostic <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
