"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Video,
  Clock,
  Calendar,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  TrendingUp,
  Shield,
  Zap,
  Target,
  ExternalLink,
  Lock,
} from "lucide-react";
import {
  StudentProfileData,
  ReadinessDimension,
  StudentBooking,
  StudentReport,
  JourneyStage,
  MembershipData,
  calculateReadinessScore,
} from "../types";
import { StatusBadge } from "@/components/mentor/StatusBadge";
import { SERVICES_CATALOGUE, formatINR } from "@/components/mentor/types";

interface StudentOverviewViewProps {
  profile: StudentProfileData;
  dimensions: ReadinessDimension[];
  bookings: StudentBooking[];
  reports: StudentReport[];
  journeyStages: JourneyStage[];
  membership: MembershipData;
  onNavigate: (tab: string, recordId?: string) => void;
  onStartBooking: (serviceId: string) => void;
  onOpenOnboarding?: () => void;
  onJoinSessionToast: (bookingRef: string) => void;
}

export function StudentOverviewView({
  profile,
  dimensions,
  bookings,
  reports,
  journeyStages,
  membership,
  onNavigate,
  onStartBooking,
  onJoinSessionToast,
}: StudentOverviewViewProps) {
  const readiness = calculateReadinessScore(
    dimensions,
    profile.segment,
    profile.portfolioNotApplicable
  );

  const needsDecisionBooking = bookings.find((b) => b.status === "Needs Decision");
  const urgentBooking =
    bookings.find((b) => b.status === "Ready to Join") ||
    bookings.find((b) => b.status === "Upcoming");

  const currentStage =
    journeyStages.find((s) => s.status === "Current Stage") || journeyStages[0];

  const deliveredReportsCount = reports.filter((r) => r.status === "Report delivered").length;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* 1. Decision Alert Banner (PRD §10.4: Smart Match 2h Timeout Fallback) */}
      {needsDecisionBooking && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-sm text-amber-300">
                Action Required: Smart Match 2-Hour Window Elapsed ({needsDecisionBooking.bookingRef})
              </div>
              <p className="text-xs text-amber-200/80 leading-relaxed">
                No mentor claimed within the 2-hour window. DreamX never auto-reschedules your slot without explicit consent. Choose an open alternative slot or take an instant 100% full refund.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("bookings", needsDecisionBooking.id)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs tracking-wide shadow-md transition-all shrink-0 cursor-pointer"
          >
            Choose Slot or 100% Refund →
          </button>
        </div>
      )}

      {/* 2. Welcome & Hero Header */}
      <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md font-mono">
              {profile.segment}
            </span>
            <span className="text-xs text-zinc-500 font-mono">• Target: {profile.targetRole}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Welcome back, {profile.firstName}!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl leading-relaxed">
            Your readiness score is calculated across 8 PRD dimensions from verified mentor diagnostic reports.
          </p>
        </div>

        {/* Readiness Score Big Pill */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 shrink-0">
          <div className="text-right">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Readiness Score
            </div>
            <div className="text-[11px] text-zinc-500">
              {readiness.assessedCount} of {readiness.applicableCount} Assessed
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[#5145cd] text-white flex flex-col items-center justify-center font-extrabold shadow-lg shadow-indigo-950/20">
            <span className="text-2xl leading-none">
              {readiness.overallScore !== null ? readiness.overallScore : "--"}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-indigo-200 mt-0.5">/ 100</span>
          </div>
        </div>
      </div>

      {/* 3. Next Session Attention Card */}
      {urgentBooking && (
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 to-violet-50/90 backdrop-blur-md p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#5145cd] text-white flex items-center justify-center shrink-0 shadow-md">
              <Video className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5145cd]">
                  {urgentBooking.status === "Ready to Join" ? "Session Ready to Enter" : "Next Scheduled Session"}
                </span>
                <span className="text-xs text-zinc-500 font-mono">• {urgentBooking.bookingRef}</span>
              </div>
              <h3 className="text-base font-bold text-zinc-900">
                {SERVICES_CATALOGUE.find((s) => s.id === urgentBooking.serviceId)?.name || "Technical Session"}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600">
                <span className="flex items-center gap-1 font-semibold text-zinc-800">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  {urgentBooking.dateLabel} · {urgentBooking.timeLabel}
                </span>
                <span>•</span>
                <span>Mentor: <strong>{urgentBooking.mentorName}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {urgentBooking.joinPermittedByServer ? (
              <button
                type="button"
                onClick={() => onJoinSessionToast(urgentBooking.bookingRef)}
                className="px-5 py-2.5 rounded-xl bg-[#5145cd] hover:bg-[#4338ca] text-white font-bold text-xs shadow-lg shadow-indigo-900/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>Enter Session Vault</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-600">
                <Lock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Unlocks 10m Prior</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => onNavigate("bookings", urgentBooking.id)}
              className="px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-all cursor-pointer"
            >
              Details
            </button>
          </div>
        </div>
      )}

      {/* 4. Quick KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white/90 border border-white/80 shadow-xs backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Readiness Baseline</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-zinc-900">
            {readiness.overallScore !== null ? `${readiness.overallScore}%` : "Baseline"}
          </div>
          <p className="text-[11px] text-zinc-500">
            {readiness.assessedCount >= 3 ? "Calibrated from mentor loops" : "Minimum 3 dimensions required"}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/90 border border-white/80 shadow-xs backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Active Bookings</span>
            <Calendar className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-bold text-zinc-900">
            {bookings.filter((b) => b.status === "Ready to Join" || b.status === "Upcoming" || b.status === "Needs Decision").length}
          </div>
          <p className="text-[11px] text-zinc-500">Protected by Nodal Escrow</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/90 border border-white/80 shadow-xs backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Delivered Reports</span>
            <FileCheck2 className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-xl font-bold text-zinc-900">{deliveredReportsCount}</div>
          <p className="text-[11px] text-zinc-500">11-section structured rubrics</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/90 border border-white/80 shadow-xs backdrop-blur-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Membership Benefit</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-zinc-900">{membership.tier} Tier</div>
          <p className="text-[11px] text-zinc-500">{membership.discountPercent}% off on eligible services</p>
        </div>
      </div>

      {/* 5. Split Section: Top Priority Readiness Gap & Journey Milestone */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Highest Leverage Gap */}
        <div className="p-6 rounded-2xl bg-white/94 border border-white/80 shadow-xs backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#5145cd]" />
              <h3 className="font-bold text-sm text-zinc-900">Highest Leverage Readiness Gap</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("readiness")}
              className="text-xs font-semibold text-[#5145cd] hover:underline"
            >
              View All 8 Dimensions →
            </button>
          </div>

          {readiness.highestPriorityGap ? (
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    Priority Dimension
                  </span>
                  <h4 className="text-base font-extrabold text-zinc-900">
                    {readiness.highestPriorityGap.dimension}
                  </h4>
                </div>
                <StatusBadge
                  label={readiness.highestPriorityGap.status}
                  tone={
                    readiness.highestPriorityGap.status === "Mentor Verified"
                      ? "success"
                      : readiness.highestPriorityGap.status === "Not Assessed"
                      ? "warning"
                      : "primary"
                  }
                  size="sm"
                />
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">
                {readiness.highestPriorityGap.evidenceSummary}
              </p>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-zinc-500">
                  Recommended Service:{" "}
                  <strong>{readiness.highestPriorityGap.relatedServiceId}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => onStartBooking(readiness.highestPriorityGap.relatedServiceId)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#5145cd] hover:bg-[#4338ca] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Book {readiness.highestPriorityGap.relatedServiceId} Session</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-xs text-zinc-500 text-center">
              All applicable readiness dimensions are calibrated above threshold.
            </div>
          )}
        </div>

        {/* Right: Current Journey Milestone */}
        <div className="p-6 rounded-2xl bg-white/94 border border-white/80 shadow-xs backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-zinc-900">Career Milestone Roadmap</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("journey")}
              className="text-xs font-semibold text-[#5145cd] hover:underline"
            >
              Full Journey Plan →
            </button>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-indigo-600 font-bold uppercase tracking-wider">
                  Stage {currentStage.stageNumber} of 4
                </span>
                <h4 className="text-base font-extrabold text-zinc-900">{currentStage.title}</h4>
              </div>
              <StatusBadge label={currentStage.status} tone="primary" size="sm" />
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">{currentStage.focusSummary}</p>

            <div className="pt-2 flex items-center justify-between border-t border-zinc-200/60">
              <span className="text-xs text-zinc-500">
                Target Dimensions: {(currentStage.targetDimensions || []).join(", ")}
              </span>
              <button
                type="button"
                onClick={() => onNavigate("journey")}
                className="text-xs font-bold text-[#5145cd] hover:underline flex items-center gap-1"
              >
                <span>Track Progress</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
