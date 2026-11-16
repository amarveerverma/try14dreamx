"use client";

import * as React from "react";
import {
  Calendar,
  Zap,
  FileCheck,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  MentorProfileData,
  TrustPillar,
  ServiceApproval,
  DispatchOffer,
  MentorBooking,
  SessionReport,
  FinancialLedgerRecord,
  formatINR,
  getServiceById,
} from "../types";
import { StatusBadge } from "../StatusBadge";

interface OverviewViewProps {
  profile: MentorProfileData;
  isApplicantMode: boolean;
  trustPillars: TrustPillar[];
  serviceApprovals: ServiceApproval[];
  dispatchOffers: DispatchOffer[];
  bookings: MentorBooking[];
  reports: SessionReport[];
  ledger: FinancialLedgerRecord[];
  onNavigate: (route: string, recordId?: string) => void;
}

export function OverviewView({
  profile,
  isApplicantMode,
  serviceApprovals,
  dispatchOffers,
  bookings,
  reports,
  ledger,
  onNavigate,
}: OverviewViewProps) {
  // 1. Pending offers count
  const pendingOffers = dispatchOffers.filter((o) => o.status === "Pending");

  // 2. Upcoming confirmed/ready sessions
  const upcomingBookings = bookings.filter(
    (b) => b.status === "Ready to Join" || b.status === "Confirmed"
  );

  // 3. Urgent session ready to join
  const urgentBooking = bookings.find((b) => b.status === "Ready to Join");

  // 4. Reports pending or revision requested
  const dueReports = reports.filter(
    (r) =>
      r.status === "Report pending" ||
      r.status === "Report delayed" ||
      r.status === "Revision requested"
  );

  // 5. Total verified earnings basis in INR
  const totalVerifiedPaise = ledger
    .filter((l) => l.verificationStatus === "Provider Webhook Verified")
    .reduce((acc, l) => acc + l.mentorCalculationBasisPaise, 0);

  // Approved services count
  const approvedServicesCount = serviceApprovals.filter(
    (s) => s.status === "Approved"
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                Good evening, {profile.displayName}
              </h1>
              {isApplicantMode ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Applicant Mode (Paid Locked)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {profile.employmentType === "alumni"
                    ? `✓ Ex-${profile.pastEmployer || "Google"} Mentor`
                    : `✓ Verified at ${profile.verifiedCompany || "Tier-1 Tech"}`}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl leading-relaxed">
              {profile.headline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate("availability")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors shadow-2xs"
            >
              <Calendar className="w-4 h-4 text-zinc-500" />
              <span>Manage IST Availability</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate("dispatch")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#5145cd] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#4035b3] transition-colors shadow-2xs"
            >
              <Zap className="w-4 h-4" />
              <span>Dispatch Queue ({pendingOffers.length})</span>
            </button>
          </div>
        </div>

        {/* Applicant Warning Notice */}
        {isApplicantMode && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Mentor Applicant Mode Active (PRD §21.1)</span>
              <p className="text-amber-900">
                Paid booking claims and nodal escrow dispatches are locked until your identity, employment credentials, and service rubric qualifications are fully approved.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Immediate Session Attention Banner */}
      {urgentBooking && (
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-purple-50/60 to-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#5145cd] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5145cd]">
                  Immediate Session Attention
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                  ● Server Join Authorized
                </span>
              </div>
              <h2 className="text-base font-bold text-zinc-900 mt-0.5">
                {urgentBooking.studentName} is in the session room for {getServiceById(urgentBooking.serviceId).name}
              </h2>
              <p className="text-xs text-zinc-600 mt-0.5">
                Scheduled for {urgentBooking.scheduledDate} · {urgentBooking.scheduledTime}. Candidate uploaded artifacts are unlocked.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("sessions", urgentBooking.id)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5145cd] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#4035b3] transition-all shadow-md shrink-0"
          >
            <span>Open Session Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pending Dispatch */}
        <div
          onClick={() => onNavigate("dispatch")}
          className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 shadow-xs hover:border-[#5145cd]/40 hover:shadow-md transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Pending Offers
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#5145cd]">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-zinc-900 tracking-tight">
              {pendingOffers.length}
            </div>
            <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
              <span className="font-semibold text-indigo-600">
                {pendingOffers.filter((o) => o.wave === "Wave 1").length} in Wave 1
              </span>
              <span>· Atomic claim</span>
            </p>
          </div>
        </div>

        {/* Card 2: Upcoming Sessions */}
        <div
          onClick={() => onNavigate("bookings")}
          className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 shadow-xs hover:border-[#5145cd]/40 hover:shadow-md transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Upcoming Sessions
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-zinc-900 tracking-tight">
              {upcomingBookings.length}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Next: {upcomingBookings[0]?.scheduledDate || "None scheduled"}
            </p>
          </div>
        </div>

        {/* Card 3: Reports Due */}
        <div
          onClick={() => onNavigate("reports")}
          className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 shadow-xs hover:border-[#5145cd]/40 hover:shadow-md transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Reports Due (48h SLA)
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-zinc-900 tracking-tight">
              {dueReports.length}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {dueReports.length > 0 ? (
                <span className="font-semibold text-amber-700">Action needed within SLA</span>
              ) : (
                <span className="text-emerald-700 font-semibold">100% SLA compliant</span>
              )}
            </p>
          </div>
        </div>

        {/* Card 4: Verified Gross Basis */}
        <div
          onClick={() => onNavigate("earnings")}
          className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 shadow-xs hover:border-[#5145cd]/40 hover:shadow-md transition-all cursor-pointer space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Verified Gross Basis
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-zinc-900 tracking-tight">
              {formatINR(totalVerifiedPaise)}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Unreduced by student discounts (PRD §7.3)
            </p>
          </div>
        </div>
      </div>

      {/* Split Section: Bookings & Dispatch */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upcoming Sessions */}
        <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h2 className="text-base font-bold text-zinc-900">Upcoming Confirmed Sessions</h2>
              <p className="text-xs text-zinc-500">Confirmed bookings with verified payment state (IST)</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("bookings")}
              className="text-xs font-bold text-[#5145cd] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingBookings.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500 bg-zinc-50 rounded-xl">
                No upcoming sessions scheduled right now.
              </div>
            ) : (
              upcomingBookings.slice(0, 3).map((b) => {
                const service = getServiceById(b.serviceId);
                return (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl border border-zinc-200/80 bg-zinc-50/60 hover:bg-zinc-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {service.id}
                        </span>
                        <span className="text-xs font-bold text-zinc-900">{b.studentName}</span>
                        <StatusBadge label={b.status} tone="info" size="sm" />
                      </div>
                      <p className="text-xs text-zinc-600">
                        {service.name} · {b.durationMinutes} min
                      </p>
                      <p className="text-[11px] font-mono text-zinc-400">
                        {b.scheduledDate} · {b.scheduledTime}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate("sessions", b.id)}
                      className="px-3.5 py-2 rounded-lg bg-white border border-zinc-300 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors shrink-0 self-start sm:self-center"
                    >
                      Prep Console →
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Smart Match Dispatch Queue */}
        <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h2 className="text-base font-bold text-zinc-900">Smart Match Dispatch Queue</h2>
              <p className="text-xs text-zinc-500">Deterministic match offers for your approved services</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("dispatch")}
              className="text-xs font-bold text-[#5145cd] hover:underline flex items-center gap-1"
            >
              <span>Open Queue ({pendingOffers.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {pendingOffers.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500 bg-zinc-50 rounded-xl">
                No pending Smart Match offers at this moment.
              </div>
            ) : (
              pendingOffers.slice(0, 3).map((o) => {
                const service = getServiceById(o.serviceId);
                return (
                  <div
                    key={o.id}
                    className="p-4 rounded-xl border border-zinc-200/80 bg-zinc-50/60 hover:bg-zinc-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          {o.requestCode}
                        </span>
                        <span className="text-xs font-bold text-zinc-900">{service.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-[#4035b3]">
                          {o.wave} ({o.expiresInMinutes}m left)
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 line-clamp-1">{o.goalSummary}</p>
                      <p className="text-[11px] text-zinc-400">
                        Candidate: {o.studentAlias} ({o.studentSegment})
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate("dispatch", o.id)}
                      className="px-3.5 py-2 rounded-lg bg-[#5145cd] text-white text-xs font-semibold hover:bg-[#4035b3] transition-colors shrink-0 self-start sm:self-center"
                    >
                      Review Offer →
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
