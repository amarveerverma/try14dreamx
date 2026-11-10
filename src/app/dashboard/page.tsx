"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Clock,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

export default function StudentDashboardPage() {
  const { user, membership } = useAuth();

  const readinessMetrics = [
    { dimension: "Resume Quality", score: 4.2, status: "Evaluated", color: "text-[#16834a]" },
    { dimension: "Technical Depth", score: 3.5, status: "Evaluated", color: "text-[#5145cd]" },
    { dimension: "System Design", score: 2.8, status: "Improvement Needed", color: "text-[#a7670b]" },
    { dimension: "Interview Execution", score: 0, status: "Unassessed", color: "text-[#8b8b95]" },
    { dimension: "Proof of Work (GitHub)", score: 4.0, status: "Evaluated", color: "text-[#16834a]" },
    { dimension: "Behavioral & STAR", score: 3.8, status: "Evaluated", color: "text-[#5145cd]" },
    { dimension: "Career Strategy", score: 4.5, status: "Evaluated", color: "text-[#16834a]" },
    { dimension: "Executive Confidence", score: 0, status: "Unassessed", color: "text-[#8b8b95]" },
  ];

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Active Cycle Ribbon */}
      <section className="bg-white border-b border-[#e7e7eb] py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16834a]" />
            <span className="font-semibold text-[#171717]">{user?.name || "Candidate"} ({user?.id || "DX-8421"})</span>
            <span className="text-[#8b8b95]">•</span>
            <span className="text-[#66666f]">Target: SDE-2 & APM Tier-1 Track</span>
          </div>
          <div className="flex items-center gap-4 text-[#8b8b95]">
            <span>Timezone: <strong className="text-[#171717]">Asia/Kolkata (IST)</strong></span>
            <span>•</span>
            <Badge variant={membership.tier === "free" ? "neutral" : "verified"}>
              {membership.tier === "free" ? "Free Member" : `${membership.tier.toUpperCase()} Member Active`}
            </Badge>
            {membership.tier === "free" && (
              <Link href="/membership" className="text-xs font-semibold text-[#5145cd] hover:underline">
                Upgrade for 5% off
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 w-full">
        {/* Welcome Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
              Welcome back, Candidate
            </h1>
            <p className="text-xs sm:text-sm text-[#66666f]">
              Here is your current career readiness diagnostic and recommended next intervention.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/services">
              <Button size="sm">
                <span>Explore Services (S01–S10)</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 3 Top Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Readiness Score */}
          <Card className="p-6 bg-white border-[#e7e7eb] flex flex-col justify-between shadow-sm space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8b8b95]">
                  Diagnostic Benchmark
                </span>
                <Badge variant="default">6 of 8 Assessed</Badge>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-[#171717] tnum">
                  68
                </span>
                <span className="text-sm font-semibold text-[#8b8b95]">/ 100</span>
                <span className="text-xs font-semibold text-[#16834a] ml-auto">
                  +14 vs Tier-2 Baseline
                </span>
              </div>

              <div className="w-full bg-[#f0eded] rounded-full h-2">
                <div className="bg-[#5145cd] h-2 rounded-full w-[68%]" />
              </div>
            </div>

            <div className="pt-3 border-t border-[#f7f7f8] flex items-center justify-between text-xs">
              <span className="text-[#66666f]">Offer Readiness Target: 85+</span>
              <span className="text-[#5145cd] font-semibold">View Rubric</span>
            </div>
          </Card>

          {/* Card 2: Highest Weighted Gap Recommendation */}
          <Card className="p-6 bg-white border-[#e7e7eb] flex flex-col justify-between shadow-sm space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#c43b3b] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Recommended Action
                </span>
                <Badge variant="warning">Highest Gap</Badge>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#171717]">
                  Technical Mock Interview (S06)
                </h3>
                <p className="text-xs text-[#66666f] mt-1">
                  Recommended because your live technical interview execution has not yet been benchmarked.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#f7f7f8] flex items-center justify-between">
              <span className="text-xs font-bold text-[#171717]">₹999 (5% Pro Discount applied)</span>
              <Link href="/services/s06-technical-mock">
                <Button size="sm">
                  <span>Book Mock</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </Card>

          {/* Card 3: Upcoming Session / 48h Deliverable SLA */}
          <Card className="p-6 bg-white border-[#e7e7eb] flex flex-col justify-between shadow-sm space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8b8b95]">
                  Active Deliverable SLA
                </span>
                <Badge variant="success">100% on SLA</Badge>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#171717] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#16834a]" />
                  <span>Resume Teardown (S01)</span>
                </h3>
                <p className="text-xs text-[#66666f]">
                  Mentor Vikram Singh (Google) is auditing your resume. Annotated rubric will be delivered within 26 hours.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#f7f7f8] flex items-center justify-between text-xs text-[#66666f]">
              <span>Deliverable SLA: Tomorrow, 6:00 PM IST</span>
              <span className="text-[#16834a] font-semibold">In Escrow</span>
            </div>
          </Card>
        </div>

        {/* 8-Dimension Diagnostic Scorecard Table */}
        <Card className="p-6 sm:p-8 bg-white border-[#e7e7eb] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#e7e7eb]">
            <div>
              <h2 className="text-lg font-bold text-[#171717]">
                8-Dimension Diagnostic Scorecard
              </h2>
              <p className="text-xs text-[#66666f]">
                Objective 0 to 5 observable rubric scores mapped from verified mentor sessions.
              </p>
            </div>
            <Link href="/services">
              <Button variant="outline" size="sm">
                Take Diagnostic Intervention
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {readinessMetrics.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#fafafc] border border-[#e7e7eb] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b8b95]">
                    Axis 0{idx + 1}
                  </span>
                  <span className={`text-xs font-bold ${m.color}`}>
                    {m.status}
                  </span>
                </div>

                <div className="font-bold text-sm text-[#171717] line-clamp-1">
                  {m.dimension}
                </div>

                <div className="flex items-baseline gap-1 pt-1">
                  <span className="text-2xl font-extrabold text-[#171717] tnum">
                    {m.score > 0 ? m.score.toFixed(1) : "—"}
                  </span>
                  <span className="text-xs text-[#8b8b95]">/ 5.0</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
