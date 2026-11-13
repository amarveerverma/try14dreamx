"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";

interface InboundClaim {
  id: string;
  serviceCode: string;
  serviceTitle: string;
  duration: string;
  remainingMinutes: number;
  candidateId: string;
  candidateLevel: string;
  targetTrack: string;
  dossierName?: string;
  slotText: string;
  slotSubtext: string;
  payout: number;
  mode: "live" | "async";
}

interface RemoteBooking {
  id: string;
  booking_ref: string;
  service_code: string;
  session_start: string;
  session_end: string;
  amount_paise: number;
  status: string;
  payment_status: string;
  meeting_url: string | null;
  pre_session_notes: string | null;
  created_at: string;
  student: {
    id: string;
    full_name: string | null;
    email: string | null;
    target_role: string | null;
  } | null;
  session_reports?: Array<{
    id: string;
    version: number;
    is_latest: boolean;
    sla_deadline_at: string;
    submitted_at: string;
    is_late: boolean;
    deliverable_sha256: string | null;
  }>;
  mentor_settlements?: Array<{
    id: string;
    gross_amount_paise: number;
    net_payout_paise: number;
    payout_status: string;
  }>;
}

export default function MentorDashboardPage() {
  const { user } = useAuth();
  const supabase = React.useMemo(() => createClient(), []);

  const [claims, setClaims] = React.useState<InboundClaim[]>([]);
  const [bookings, setBookings] = React.useState<RemoteBooking[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionNotice, setActionNotice] = React.useState<string | null>(null);

  // Load real bookings and metrics from Supabase
  React.useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select(`
            id,
            booking_ref,
            service_code,
            session_start,
            session_end,
            amount_paise,
            status,
            payment_status,
            meeting_url,
            pre_session_notes,
            created_at,
            student:profiles!bookings_student_id_fkey(id, full_name, email, target_role),
            session_reports(id, version, is_latest, sla_deadline_at, submitted_at, is_late, deliverable_sha256),
            mentor_settlements(id, gross_amount_paise, net_payout_paise, payout_status)
          `)
          .eq("mentor_id", user.id)
          .order("session_start", { ascending: false });

        if (!error && data && isMounted) {
          setBookings(data as unknown as RemoteBooking[]);
        }
      } catch (err) {
        console.warn("Failed to load mentor bookings:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [user, supabase]);

  // Derived financial metrics
  const financialMetrics = React.useMemo(() => {
    let accruedNetPaise = 0;
    let inEscrowNetPaise = 0;
    let completedCount = 0;
    let lateCount = 0;

    bookings.forEach((b) => {
      b.mentor_settlements?.forEach((s) => {
        if (s.payout_status === "eligible_for_payout" || s.payout_status === "disbursed") {
          accruedNetPaise += s.net_payout_paise;
        } else if (s.payout_status === "in_escrow") {
          inEscrowNetPaise += s.net_payout_paise;
        }
      });

      b.session_reports?.forEach((r) => {
        if (r.is_latest) {
          completedCount += 1;
          if (r.is_late) lateCount += 1;
        }
      });
    });

    const slaCompliance = completedCount > 0 ? Math.round(((completedCount - lateCount) / completedCount) * 100) : 100;

    return {
      accruedRupees: Math.round(accruedNetPaise / 100),
      escrowRupees: Math.round(inEscrowNetPaise / 100),
      completedCount,
      slaCompliance,
      activeEngagements: bookings.filter((b) => b.status === "confirmed" || b.status === "in_progress").length,
    };
  }, [bookings]);

  const handleAccept = (id: string, title: string) => {
    setClaims((prev) => prev.filter((c) => c.id !== id));
    setActionNotice(`Claim accepted for ${id} (${title}). Slot locked & Razorpay escrow hold active.`);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleDecline = (id: string) => {
    setClaims((prev) => prev.filter((c) => c.id !== id));
    setActionNotice(`Claim ${id} declined. Cascaded to Wave 2 mentor pool.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="flex flex-col w-full bg-[#fcf9f8] min-h-screen text-[#1c1b1b]">
      {/* Top Header Ribbon */}
      <div className="w-full bg-white border-b border-[#e7e7eb] px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1c1b1b]">Mentor Hub</span>
          <span className="text-[#c8c4d6]">/</span>
          <span className="font-bold text-[#5145cd]">Overview &amp; Delivery Console</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf5ef] border border-[#94f7b2] text-[#006d3a] font-semibold text-[11px]">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            <span>Employment &amp; Identity Audit Verified (PRD §9.1)</span>
          </div>
          <span className="text-[#474554] text-[11px]">Asia/Kolkata (IST • UTC+05:30)</span>
        </div>
      </div>

      {actionNotice && (
        <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 p-3.5 rounded-xl bg-[#eaf5ef] border border-[#94f7b2] text-[#006d3a] text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>{actionNotice}</span>
          </div>
          <button type="button" onClick={() => setActionNotice(null)} className="text-[#006d3a] hover:opacity-75">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c1b1b] tracking-tight font-heading">
                Mentor Delivery Console
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#e3dfff] text-[#130068]">
                L5 AI Lead
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#474554] mt-1">
              Review live Smart Match dispatch offers, upcoming sessions, and deliverable SLAs.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/mentor/earnings"
              className="px-4 py-2.5 bg-white border border-[#e7e7eb] hover:bg-[#f6f3f2] text-[#1c1b1b] text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              <span>View Past Payouts</span>
            </Link>
            <Link
              href="/mentor/availability"
              className="px-4 py-2.5 bg-[#5145cd] hover:bg-[#3828b5] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-[#5145cd]"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span>Update Weekly Availability</span>
            </Link>
          </div>
        </div>

        {/* Bento Metric Stats (3 Cards) */}
        <section aria-label="Key Performance Metrics" className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Metric 1 */}
          <div className="bg-white border border-[#e7e7eb] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#c8c4d6] transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#777585] uppercase tracking-wider">
                  Accrued Earnings
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#eaf5ef] text-[#006d3a]">
                  <span className="material-symbols-outlined text-[13px]">check</span>
                  {financialMetrics.accruedRupees > 0 ? "Weekly Payout Accruing" : "Direct Escrow Protected"}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-[#1c1b1b] tracking-tight tabular-nums font-heading">
                  ₹{financialMetrics.accruedRupees.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-[#006d3a] font-bold">80% Net Rate Basis</span>
              </div>
              <p className="text-xs text-[#474554] mt-2 leading-relaxed">
                Direct weekly disbursement via Razorpay UPI/NEFT • 20% platform cut &amp; 10% Section 194J TDS computed per session
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#e7e7eb] flex items-center justify-between text-xs">
              <span className="text-[#474554] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#777585]">lock_clock</span>
                Pending in 48h Escrow Lock:
              </span>
              <span className="font-bold text-[#1c1b1b] tabular-nums">
                ₹{financialMetrics.escrowRupees.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white border border-[#e7e7eb] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#c8c4d6] transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#777585] uppercase tracking-wider">
                  Delivery SLA Compliance
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#eaf5ef] text-[#006d3a]">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  PRD §10.5 Guaranteed
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-[#1c1b1b] tracking-tight tabular-nums font-heading">
                  {financialMetrics.slaCompliance}%
                </span>
                <span className="text-xs text-[#006d3a] font-bold">
                  {financialMetrics.completedCount} Reports Audited
                </span>
              </div>
              <p className="text-xs text-[#474554] mt-2 leading-relaxed">
                48-hour diagnostic turnaround SLA required to unlock escrow settlements and maintain calibrated rank
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#e7e7eb] flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#474554]">SLA Margin Buffer</span>
                <span className="font-bold text-[#006d3a]">48h max turnaround</span>
              </div>
              <div className="w-full bg-[#f0eded] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#006d3a] h-full rounded-full transition-all duration-500"
                  style={{ width: `${financialMetrics.slaCompliance}%` }}
                />
              </div>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white border border-[#e7e7eb] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#777585] uppercase tracking-wider">
                  Live Smart Match Queue
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Wave 1 Priority
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-[#1c1b1b] tracking-tight tabular-nums font-heading">
                  {claims.length} Active Offers
                </span>
              </div>
              <p className="text-xs text-[#474554] mt-2 leading-relaxed">
                Candidate requests dynamically routed by the PRD §10 affinity matcher based on your calibration
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#e7e7eb] flex items-center justify-between text-xs">
              <span className="text-amber-800 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-amber-600">hourglass_top</span>
                Auto-expires to Wave 2 in:
              </span>
              <span className="font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-mono">
                {claims.length > 0 ? "<25 mins" : "Idle"}
              </span>
            </div>
          </div>
        </section>

        {/* Section 1: Smart Match Dispatch Claims */}
        <section aria-labelledby="dispatch-section-title" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-1 rounded-full bg-[#5145cd]" />
              <h2 className="text-lg font-bold text-[#1c1b1b] font-heading" id="dispatch-section-title">
                Smart Match Dispatch Inbound Claims
              </h2>
              <span className="text-[11px] text-[#474554] bg-[#f0eded] px-2 py-0.5 rounded font-mono">
                PRD §10.3 Inbound Router
              </span>
            </div>
            <span className="text-xs text-[#777585] font-medium hidden sm:inline">
              First-Accept-Locks-Slot Protocol
            </span>
          </div>

          {claims.length === 0 ? (
            <div className="p-8 bg-white border border-[#e7e7eb] rounded-2xl text-center text-xs text-[#777585] flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-3xl text-gray-400">inbox</span>
              <p className="font-semibold text-gray-700">No pending inbound claims right now</p>
              <p className="max-w-md text-gray-500">
                When candidates initiate Smart Match requests matching your calibrated tier and approved services, dispatch alerts will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {claims.map((claim) => (
                <div
                  key={claim.id}
                  className="bg-white border border-[#e7e7eb] rounded-2xl p-5 shadow-xs hover:border-[#5145cd]/40 transition-all flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#5145cd]" />
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3 pt-1">
                      <div>
                        <span className="text-[11px] font-bold text-[#5145cd] tracking-wider uppercase font-mono">
                          REQUEST {claim.id}
                        </span>
                        <h3 className="text-base font-bold text-[#1c1b1b] mt-0.5">
                          {claim.serviceCode}: {claim.serviceTitle}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-xs text-[#474554] mt-0.5">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          {claim.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold shrink-0">
                        <span className="material-symbols-outlined text-sm text-amber-600 animate-spin">timer</span>
                        <span>{claim.remainingMinutes}m remaining</span>
                      </div>
                    </div>

                    {/* Dossier */}
                    <div className="bg-[#f6f3f2] rounded-xl p-3.5 space-y-2 border border-[#e7e7eb] mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#1c1b1b] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-[#777585]">person</span>
                          Candidate {claim.candidateId}
                        </span>
                        <span className="text-[#777585] text-[11px]">{claim.candidateLevel}</span>
                      </div>
                      <div className="text-xs text-[#474554] space-y-1">
                        <p>
                          <strong className="text-[#1c1b1b]">Target Track:</strong> {claim.targetTrack}
                        </p>
                        {claim.dossierName && (
                          <p className="flex items-center gap-1 text-[#5145cd]">
                            <span className="material-symbols-outlined text-xs">attach_file</span>
                            <span className="underline cursor-pointer">{claim.dossierName}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Slot */}
                    <div className="flex items-center gap-2 text-xs text-[#1c1b1b] mb-3 px-1">
                      <span className="material-symbols-outlined text-base text-[#006d3a]">event</span>
                      <span className="font-bold">{claim.slotText}</span>
                      <span className="text-[#474554] text-[11px]">{claim.slotSubtext}</span>
                    </div>
                  </div>

                  {/* Actions & Payout */}
                  <div className="pt-3 border-t border-[#e7e7eb] flex items-center justify-between mt-2">
                    <div>
                      <span className="text-[10px] text-[#777585] uppercase font-bold block">
                        Net Mentor Payout
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-extrabold text-[#1c1b1b] tabular-nums font-heading">
                          ₹{claim.payout}
                        </span>
                        <span className="text-[10px] text-[#006d3a] font-bold">Protected Escrow</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDecline(claim.id)}
                        className="px-3 py-2 text-xs text-[#474554] hover:text-[#ba1a1a] hover:bg-red-50 rounded-xl transition-colors font-bold"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAccept(claim.id, claim.serviceTitle)}
                        className="px-4 py-2 text-xs bg-[#5145cd] hover:bg-[#3828b5] text-white rounded-xl font-bold transition-all shadow-xs flex items-center gap-1.5 focus:ring-2 focus:ring-offset-1 focus:ring-[#5145cd]"
                      >
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        Accept Offer &amp; Lock Calendar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 2: Confirmed Sessions & Pipeline Table */}
        <section aria-labelledby="pipeline-section-title" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-1 rounded-full bg-[#006d3a]" />
              <h2 className="text-lg font-bold text-[#1c1b1b] font-heading" id="pipeline-section-title">
                Confirmed Sessions &amp; Deliverable Pipeline
              </h2>
              <span className="text-[11px] text-[#474554] bg-[#f0eded] px-2 py-0.5 rounded font-mono">
                PRD §11.1 &amp; §11.2 Tracking
              </span>
            </div>
            <span className="text-xs text-[#474554]">
              {financialMetrics.activeEngagements} Active Engagement{financialMetrics.activeEngagements === 1 ? "" : "s"}
            </span>
          </div>

          <div className="bg-white border border-[#e7e7eb] rounded-2xl overflow-hidden shadow-xs">
            {bookings.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#f6f3f2] flex items-center justify-center text-[#777585]">
                  <span className="material-symbols-outlined text-2xl">event_available</span>
                </div>
                <div className="max-w-md">
                  <h3 className="font-bold text-[#1c1b1b] text-sm">No Active Engagements</h3>
                  <p className="text-xs text-[#777585] mt-1">
                    You do not have any sessions booked yet. Open weekly slots in Availability so matching candidates can schedule 1:1 sessions with you.
                  </p>
                </div>
                <Link
                  href="/mentor/availability"
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#5145cd] text-white text-xs font-bold rounded-xl hover:bg-[#3828b5] transition-all shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  <span>Configure Weekly Availability</span>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#f6f3f2] border-b border-[#e7e7eb] text-[11px] font-bold text-[#777585] uppercase tracking-wider">
                      <th className="py-3 px-4">Candidate &amp; Goal</th>
                      <th className="py-3 px-4">Service Module</th>
                      <th className="py-3 px-4">Scheduled Date &amp; Time</th>
                      <th className="py-3 px-4">Meet Telemetry Link</th>
                      <th className="py-3 px-4">48h Deliverable SLA Countdown</th>
                      <th className="py-3 px-4 text-right">Status &amp; Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e7e7eb]">
                    {bookings.map((booking) => {
                      const start = new Date(booking.session_start);
                      const latestReport = booking.session_reports?.find((r) => r.is_latest);
                      const isCompleted = booking.status === "completed" || !!latestReport;
                      const candidateName = booking.student?.full_name || "Verified Candidate";
                      const candidateId = booking.student?.id ? booking.student.id.slice(0, 8).toUpperCase() : "DX-CAND";
                      const candidateGoal = booking.student?.target_role || "Target: Software Engineering";

                      return (
                        <tr key={booking.id} className="hover:bg-[#f6f3f2]/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#1c1b1b]">{candidateName}</div>
                            <div className="text-[11px] text-[#474554]">#{candidateId} • {candidateGoal}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-[#1c1b1b]">{booking.service_code} Session</span>
                            <span className="block text-[11px] text-[#777585]">Ref: {booking.booking_ref}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#1c1b1b]">
                              {start.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                            </div>
                            <div className="text-[11px] text-[#474554]">
                              {start.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} IST
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            {booking.meeting_url ? (
                              <div>
                                <a
                                  href={booking.meeting_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#eaf5ef] text-[#006d3a] font-mono text-[11px] font-bold hover:underline"
                                >
                                  <span className="material-symbols-outlined text-[14px]">videocam</span>
                                  {booking.meeting_url.replace(/^https?:\/\//, "").slice(0, 24)}...
                                </a>
                                <span className="block text-[10px] text-[#777585] mt-0.5">Google Meet Live</span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-[#777585]">Link generated 15m prior</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {latestReport ? (
                              <div>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006d3a]">
                                  <span className="material-symbols-outlined text-xs">verified</span>
                                  Delivered &amp; Signed
                                </span>
                                {latestReport.deliverable_sha256 && (
                                  <span className="block text-[10px] text-[#777585] font-mono">
                                    SHA-256: {latestReport.deliverable_sha256.slice(0, 10)}...
                                  </span>
                                )}
                              </div>
                            ) : isCompleted ? (
                              <div>
                                <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                                  <span className="material-symbols-outlined text-xs text-amber-600">alarm</span>
                                  Report Due
                                </div>
                                <span className="text-[10px] text-amber-700">48h SLA Active</span>
                              </div>
                            ) : (
                              <div>
                                <span className="text-[11px] text-[#5145cd] font-bold">Session Upcoming</span>
                                <span className="block text-[10px] text-[#777585]">SLA begins post-call</span>
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href="/mentor/sessions"
                                className="px-2.5 py-1.5 border border-[#e7e7eb] hover:bg-[#f6f3f2] text-[#1c1b1b] rounded-lg text-xs font-bold transition-colors"
                              >
                                {latestReport ? "View Scorecard" : "Open Dossier"}
                              </Link>
                              {booking.meeting_url && !latestReport && (
                                <a
                                  href={booking.meeting_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-1.5 bg-[#006d3a] text-white rounded-lg text-xs font-bold hover:bg-[#00522b] transition-all flex items-center gap-1 shadow-xs"
                                >
                                  <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                                  Join Call
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Section 3: Tiered Mentor Compensation & Growth Framework */}
        <section aria-labelledby="tiers-section-title" className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-1 rounded-full bg-[#3c2cb8]" />
            <h2 className="text-lg font-bold text-[#1c1b1b] font-heading" id="tiers-section-title">
              Tiered Mentor Compensation &amp; Growth Framework
            </h2>
            <span className="text-[11px] text-[#474554] bg-[#f0eded] px-2 py-0.5 rounded font-mono">
              PRD §9.4, §13.2
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Tier 1 */}
            <div className="bg-white border border-[#e7e7eb] rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#777585]">Tier 1</span>
                <span className="px-2 py-0.5 rounded-full bg-[#f0eded] text-[#474554] text-[10px] font-bold">
                  Cleared
                </span>
              </div>
              <h3 className="text-base font-bold text-[#1c1b1b]">Base Mentor</h3>
              <div className="text-2xl font-extrabold text-[#1c1b1b] font-heading">
                ₹500 – ₹800 <span className="text-xs font-normal text-[#777585]">/ session</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#474554] pt-2 border-t border-[#e7e7eb]">
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-[#006d3a]">check</span>
                  Identity &amp; Work Domain Verified
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-[#006d3a]">check</span>
                  Initial 3 diagnostic sessions completed
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-[#006d3a]">check</span>
                  Standard calendar slot bookings
                </li>
              </ul>
            </div>

            {/* Tier 2 (Active) */}
            <div className="bg-white border-2 border-[#5145cd] rounded-2xl p-5 shadow-md space-y-3 relative">
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#5145cd] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                Active Tier (Accredited)
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5145cd]">Tier 2</span>
                <span className="px-2 py-0.5 rounded-full bg-[#eaf5ef] text-[#006d3a] text-[10px] font-bold">
                  4.96 Rating
                </span>
              </div>
              <h3 className="text-base font-bold text-[#1c1b1b]">Bar Raiser Lead</h3>
              <div className="text-2xl font-extrabold text-[#5145cd] font-heading">
                ₹800 – ₹1,200 <span className="text-xs font-normal text-[#777585]">/ session</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#474554] pt-2 border-t border-[#e7e7eb]">
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-[#006d3a]">check</span>
                  10+ completed audits (Current: 24)
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-[#006d3a]">check</span>
                  &gt;4.90 rating (Current: 4.96)
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-[#006d3a]">check</span>
                  Priority Wave 1 dispatch access (30m window)
                </li>
              </ul>
            </div>

            {/* Tier 3 */}
            <div className="bg-white border border-[#e7e7eb] rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#777585]">Tier 3</span>
                <span className="px-2 py-0.5 rounded-full bg-[#e3dfff] text-[#130068] text-[10px] font-bold">
                  Unlock in 6 sessions
                </span>
              </div>
              <h3 className="text-base font-bold text-[#1c1b1b]">Principal / Staff Advisor</h3>
              <div className="text-2xl font-extrabold text-[#1c1b1b] font-heading">
                ₹1,500+ <span className="text-xs font-normal text-[#777585]">/ session</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#474554] pt-2 border-t border-[#e7e7eb]">
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-[#777585]">circle</span>
                  30+ completed Tier-1 scorecards
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-[#006d3a]">check</span>
                  0 candidate disputes logged
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-[#777585]">circle</span>
                  Direct VIP candidate bookings &amp; custom bundle priority
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer Disclosures */}
        <div className="p-4 rounded-2xl bg-white border border-[#e7e7eb] text-xs text-[#474554] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="space-y-0.5">
            <span className="font-bold text-[#1c1b1b] block">
              DreamX Outcome-Accountable Marketplace Protocol (PRD V3.0)
            </span>
            <p className="text-[11px] text-[#777585]">
              All mentor payouts are calculated on 100% gross list price. Platform membership discounts are absorbed by DreamX treasury. Funds are secured via Razorpay Nodal Escrow.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono">
            <span className="px-2 py-1 rounded bg-[#f0eded] text-[#1c1b1b]">DPDP Act 2023 Shielded</span>
          </div>
        </div>
      </main>
    </div>
  );
}
