"use client";

import * as React from "react";
import Link from "next/link";

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

const INITIAL_CLAIMS: InboundClaim[] = [
  {
    id: "REQ-8902",
    serviceCode: "S06",
    serviceTitle: "Technical Mock Interview & Distributed Systems",
    duration: "60 min Live Session + 8-D Diagnostic Scorecard",
    remainingMinutes: 24,
    candidateId: "#DX-9124",
    candidateLevel: "Early Career Backend • 0-2 YoE",
    targetTrack: "Google L4 / Swiggy L5 Systems",
    dossierName: "Resume_Rohan_v2.pdf (Audited)",
    slotText: "Tomorrow, Oct 26 • 07:30 PM – 08:30 PM IST",
    slotSubtext: "(Matches your Friday evening window)",
    payout: 799,
    mode: "live",
  },
  {
    id: "REQ-8905",
    serviceCode: "S01",
    serviceTitle: "Resume Line-by-Line Teardown & ATS Audit",
    duration: "Async 48h Scorecard SLA (No call required)",
    remainingMinutes: 18,
    candidateId: "#DX-8411",
    candidateLevel: "Career Switcher • 3 YoE",
    targetTrack: "FinTech GCC Senior Backend • Distributed Kafka",
    dossierName: "Resume_Deepak_Fintech.pdf (2.1 MB)",
    slotText: "Async Delivery: 48h Scorecard SLA Clock",
    slotSubtext: "(Turnaround begins upon acceptance)",
    payout: 479,
    mode: "async",
  },
];

export default function MentorDashboardPage() {
  const [claims, setClaims] = React.useState<InboundClaim[]>(INITIAL_CLAIMS);
  const [actionNotice, setActionNotice] = React.useState<string | null>(null);

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
                  Weekly Payout Cleared
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-[#1c1b1b] tracking-tight tabular-nums font-heading">
                  ₹18,450
                </span>
                <span className="text-xs text-[#006d3a] font-bold">100% Payout Basis</span>
              </div>
              <p className="text-xs text-[#474554] mt-2 leading-relaxed">
                Auto-settlement via UPI/NEFT to HDFC Bank (**** 4812) on Monday • 0% commission deductions on core rate
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#e7e7eb] flex items-center justify-between text-xs">
              <span className="text-[#474554] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#777585]">lock_clock</span>
                Pending in 48h Escrow Lock:
              </span>
              <span className="font-bold text-[#1c1b1b] tabular-nums">₹2,597</span>
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
                  Zero SLA Breaches
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-[#1c1b1b] tracking-tight tabular-nums font-heading">
                  100%
                </span>
                <span className="text-xs text-[#006d3a] font-bold">24 Scorecards Signed</span>
              </div>
              <p className="text-xs text-[#474554] mt-2 leading-relaxed">
                Average turnaround: 28.4 hrs (vs 48h SLA) across 24 completed candidate scorecards
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#e7e7eb] flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#474554]">SLA Margin Buffer</span>
                <span className="font-bold text-[#006d3a]">19.6h buffer remaining</span>
              </div>
              <div className="w-full bg-[#f0eded] h-2 rounded-full overflow-hidden">
                <div className="bg-[#006d3a] h-full rounded-full" style={{ width: "59%" }} />
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
                High-affinity candidate requests matched to your approved services (S06 &amp; S01)
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#e7e7eb] flex items-center justify-between text-xs">
              <span className="text-amber-800 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-amber-600">hourglass_top</span>
                Auto-expires to Wave 2 in:
              </span>
              <span className="font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-mono">
                &lt;25 mins
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
            <div className="p-8 bg-white border border-[#e7e7eb] rounded-2xl text-center text-xs text-[#777585]">
              No pending claims right now. All dispatched offers have been accepted or processed.
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
            <span className="text-xs text-[#474554]">3 Active Engagements</span>
          </div>

          <div className="bg-white border border-[#e7e7eb] rounded-2xl overflow-hidden shadow-xs">
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
                  {/* Row 1: Upcoming Live Call */}
                  <tr className="hover:bg-[#f6f3f2]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1c1b1b]">Aarav Sharma</div>
                      <div className="text-[11px] text-[#474554]">#DX-8419 • Target: SDE-2</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#1c1b1b]">S06 Technical Mock</span>
                      <span className="block text-[11px] text-[#777585]">60 min Live Call</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1c1b1b]">Today, Oct 25</div>
                      <div className="text-[11px] text-[#474554]">07:30 PM IST</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#eaf5ef] text-[#006d3a] font-mono text-[11px] font-bold">
                        <span className="material-symbols-outlined text-[14px]">videocam</span>
                        meet.google.com/qxr-mkpv-yzt
                      </div>
                      <span className="block text-[10px] text-[#777585] mt-0.5">Opens 15m prior to start</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-[#5145cd] font-bold">
                        <span className="w-2 h-2 rounded-full bg-[#5145cd] animate-pulse" />
                        Session Live in 3h 15m
                      </div>
                      <span className="text-[10px] text-[#777585]">SLA starts post-call</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href="/mentor/sessions"
                          className="px-2.5 py-1.5 border border-[#e7e7eb] hover:bg-[#f6f3f2] text-[#1c1b1b] rounded-lg text-xs font-bold transition-colors"
                        >
                          Review Dossier
                        </Link>
                        <a
                          href="https://meet.google.com/qxr-mkpv-yzt"
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-[#006d3a] text-white rounded-lg text-xs font-bold hover:bg-[#00522b] transition-all flex items-center gap-1 shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                          Join Call
                        </a>
                      </div>
                    </td>
                  </tr>

                  {/* Row 2: Report Due */}
                  <tr className="hover:bg-[#f6f3f2]/50 transition-colors bg-amber-50/30">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1c1b1b]">Kavya Nair</div>
                      <div className="text-[11px] text-[#474554]">#DX-7832 • Target: ML Platform Eng</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#1c1b1b]">S05 Behavioral STAR Framework</span>
                      <span className="block text-[11px] text-[#777585]">60 min Call Completed</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1c1b1b]">Oct 24 • Completed</div>
                      <div className="text-[11px] text-[#777585]">Yesterday 08:30 PM</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006d3a]">
                        <span className="material-symbols-outlined text-xs">check_circle</span>
                        100% Attendance Verified
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                        <span className="material-symbols-outlined text-xs text-amber-600">alarm</span>
                        18h 45m left to submit
                      </div>
                      <span className="text-[10px] text-amber-700">80% refund risk if missed</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href="/mentor/sessions"
                        className="px-3 py-1.5 bg-[#5145cd] text-white rounded-lg text-xs font-bold hover:bg-[#3828b5] transition-all inline-flex items-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[14px]">upload_file</span>
                        Upload 8-D Scorecard
                      </Link>
                    </td>
                  </tr>

                  {/* Row 3: Delivered & Signed */}
                  <tr className="hover:bg-[#f6f3f2]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1c1b1b]">Tanmay Roy</div>
                      <div className="text-[11px] text-[#474554]">#DX-6941 • Target: Frontend Lead</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#1c1b1b]">S09 Career Roadmap Session</span>
                      <span className="block text-[11px] text-[#777585]">60 min Call Completed</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1c1b1b]">Oct 22 • Completed</div>
                      <div className="text-[11px] text-[#777585]">3 Days Ago</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006d3a]">
                        <span className="material-symbols-outlined text-xs">check_circle</span>
                        Google Meet Verified
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006d3a]">
                        <span className="material-symbols-outlined text-xs">verified</span>
                        Delivered &amp; Signed
                      </span>
                      <span className="block text-[10px] text-[#777585] font-mono">SHA-256: 0x8f2d..91b</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href="/mentor/sessions"
                        className="px-3 py-1.5 border border-[#e7e7eb] hover:bg-[#f6f3f2] text-[#1c1b1b] rounded-lg text-xs font-bold transition-colors inline-block"
                      >
                        View Report
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
                Active Tier (Vikram Singh)
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
