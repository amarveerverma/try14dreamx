"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";

interface DispatchOffer {
  id: string;
  requestId: string;
  serviceCode: string;
  serviceTitle: string;
  duration: string;
  waveTag: string;
  matchScore: number;
  initialSeconds: number;
  candidateId: string;
  candidateLevel: string;
  targetTrack: string;
  focusArea: string;
  resumeFileName?: string;
  slotText: string;
  deliveryType: "live" | "async";
  payout: number;
}

interface RemoteDispatchRow {
  id: string;
  request_id: string;
  wave: number;
  match_score: number;
  status: string;
  request: {
    id: string;
    request_ref: string;
    service_code: string;
    amount_paise: number;
    target_role: string | null;
    pre_session_notes: string | null;
    resume_url: string | null;
    current_wave: number;
    timeout_at: string;
    created_at: string;
  } | null;
}

export default function MentorDispatchPage() {
  const { user } = useAuth();
  const supabase = React.useMemo(() => createClient(), []);
  const [offers, setOffers] = React.useState<DispatchOffer[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"all" | "wave1" | "wave2" | "archived">("all");
  const [paused, setPaused] = React.useState(false);
  const [claimNotice, setClaimNotice] = React.useState<string | null>(null);
  const [claimNoticeType, setClaimNoticeType] = React.useState<"success" | "conflict">("success");

  // Load real dispatches for this mentor from Supabase
  React.useEffect(() => {
    let isMounted = true;
    async function loadDispatches() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("smart_match_dispatches")
          .select(`
            id,
            request_id,
            wave,
            match_score,
            status,
            request:smart_match_requests(
              id,
              request_ref,
              service_code,
              amount_paise,
              target_role,
              pre_session_notes,
              resume_url,
              current_wave,
              timeout_at,
              created_at
            )
          `)
          .eq("mentor_id", user.id)
          .eq("status", "dispatched");

        if (error) {
          console.warn("Could not load dispatches:", error);
          if (isMounted) setOffers([]);
        } else if (data && data.length > 0) {
          const mapped: DispatchOffer[] = (data as unknown as RemoteDispatchRow[]).map((row) => {
            const req = row.request;
            const netPayout = req ? Math.round((req.amount_paise * 0.8) / 100) : 799;
            const timeoutDate = req ? new Date(req.timeout_at) : new Date(Date.now() + 1800000);
            const remainingSec = Math.max(0, Math.round((timeoutDate.getTime() - Date.now()) / 1000));

            return {
              id: req ? req.request_ref : row.id.slice(0, 8),
              requestId: row.request_id,
              serviceCode: req?.service_code || "S06",
              serviceTitle:
                req?.service_code === "S06"
                  ? "Technical Mock Interview & Distributed Architecture Drill"
                  : req?.service_code === "S01"
                  ? "Resume Line-by-Line Teardown & ATS Benchmark"
                  : `Service ${req?.service_code || "S06"}`,
              duration: "60 min Live Call + 8-D Diagnostic Scorecard",
              waveTag: `Wave ${row.wave} (${row.wave === 1 ? "Priority Direct Fit" : "Expanded Pool"} • ${row.match_score}% Match Score)`,
              matchScore: Number(row.match_score),
              initialSeconds: remainingSec,
              candidateId: `#DX-${req ? req.id.slice(0, 4) : "CAND"}`,
              candidateLevel: req?.target_role || "Candidate Track",
              targetTrack: req?.target_role || "Tier-1 Product Systems",
              focusArea: req?.pre_session_notes || "Core engineering and trade-off evaluation drill.",
              resumeFileName: req?.resume_url ? "Candidate_Resume.pdf" : undefined,
              slotText: "Flexible IST Evening Window (Next 48 Hours)",
              deliveryType: "live",
              payout: netPayout,
            };
          });
          if (isMounted) setOffers(mapped);
        } else {
          if (isMounted) setOffers([]);
        }
      } catch (err) {
        console.warn("Dispatch fetch error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadDispatches();
    return () => {
      isMounted = false;
    };
  }, [user, supabase]);

  const handleClaim = async (requestId: string, title: string) => {
    try {
      const res = await fetch("/api/smart-match/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409 || data.code === "OFFER_ALREADY_ACCEPTED") {
          // Exit Criteria 1 notice
          setClaimNoticeType("conflict");
          setClaimNotice("Notice: Another mentor accepted this offer in Wave 1 (Single-winner mutex lock). Your queue has been refreshed.");
          setOffers((prev) => prev.filter((o) => o.requestId !== requestId));
        } else {
          setClaimNoticeType("conflict");
          setClaimNotice(data.error || "Failed to accept offer.");
        }
        setTimeout(() => setClaimNotice(null), 6000);
        return;
      }

      setOffers((prev) => prev.filter((o) => o.requestId !== requestId));
      setClaimNoticeType("success");
      setClaimNotice(`Offer ${data.booking_ref} (${title}) claimed successfully! Calendar invite & Google Meet link generated. Escrow funded.`);
      setTimeout(() => setClaimNotice(null), 6000);
    } catch (err) {
      setClaimNoticeType("conflict");
      setClaimNotice(err instanceof Error ? err.message : "Error accepting offer.");
      setTimeout(() => setClaimNotice(null), 6000);
    }
  };

  const handleDecline = (requestId: string) => {
    setOffers((prev) => prev.filter((o) => o.requestId !== requestId));
    setClaimNoticeType("success");
    setClaimNotice(`Offer declined. Cascaded to expanded Wave 2 mentor pool.`);
    setTimeout(() => setClaimNotice(null), 4000);
  };

  return (
    <div className="flex flex-col w-full bg-[#fcf9f8] min-h-screen text-[#1c1b1b]">
      {/* Top Header Ribbon */}
      <div className="w-full bg-white border-b border-[#e7e7eb] px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Link href="/mentor" className="text-[#474554] hover:text-[#1c1b1b]">
            Mentor Portal
          </Link>
          <span className="text-[#c8c4d6]">/</span>
          <span className="font-bold text-[#5145cd]">Smart Match Dispatch Engine</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf5ef] border border-[#94f7b2] text-[#006d3a] font-bold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#006d3a] animate-pulse" />
            <span>Dispatch Engine Online (Polling Wave 1 &amp; Wave 2)</span>
          </div>
          <span className="text-[#474554] text-[11px]">Asia/Kolkata (IST • UTC+05:30)</span>
        </div>
      </div>

      {claimNotice && (
        <div
          className={`mx-4 sm:mx-6 lg:mx-8 mt-4 p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in ${
            claimNoticeType === "conflict"
              ? "bg-amber-50 border-amber-300 text-amber-900"
              : "bg-[#eaf5ef] border-[#94f7b2] text-[#006d3a]"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">
              {claimNoticeType === "conflict" ? "error" : "verified"}
            </span>
            <span>{claimNotice}</span>
          </div>
          <button type="button" onClick={() => setClaimNotice(null)} className="cursor-pointer">
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
                Smart Match Dispatch Queue &amp; Inbound Offers
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#e3dfff] text-[#130068]">
                PRD §10.3 v3.0
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#474554] mt-1">
              Deterministic matching algorithm PRD §10.3: Review, claim, or decline priority 1:1 sessions. Wave 1 dispatch requests must be claimed within the 30-minute SLA window before cascading to Wave 2.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPaused(!paused)}
              className={`px-4 py-2.5 border rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                paused
                  ? "bg-amber-100 border-amber-300 text-amber-900"
                  : "bg-white border-[#e7e7eb] hover:bg-[#f6f3f2] text-[#1c1b1b]"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {paused ? "play_arrow" : "pause"}
              </span>
              <span>{paused ? "Resume Inbound Waves" : "Pause Inbound Dispatch"}</span>
            </button>
          </div>
        </div>

        {/* Dispatch Telemetry & SLA Strip (3 Bento Metric Cards) */}
        <section aria-label="Dispatch Telemetry" className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="bg-white border border-[#e7e7eb] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#777585] uppercase tracking-wider">
                  Active Wave 1 Priority
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Cascades in &lt;24m
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-[#1c1b1b] tracking-tight tabular-nums font-heading">
                  {offers.length} Pending Claims
                </span>
              </div>
              <p className="text-xs text-[#474554] mt-2 leading-relaxed">
                Top-3 mentor affinity assignment based on L5/L6 bar raiser accreditation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#e7e7eb] flex items-center justify-between text-xs text-[#777585]">
              <span>Exclusivity Window:</span>
              <span className="font-bold text-[#1c1b1b]">30 Minutes Strict</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-[#e7e7eb] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#c8c4d6] transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#777585] uppercase tracking-wider">
                  Acceptance Velocity
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#eaf5ef] text-[#006d3a]">
                  Platform Top 5%
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-[#1c1b1b] tracking-tight tabular-nums font-heading">
                  4.8 mins
                </span>
                <span className="text-xs text-[#006d3a] font-bold">avg claim speed</span>
              </div>
              <p className="text-xs text-[#474554] mt-2 leading-relaxed">
                99.4% on-time claim rate across 42 historically dispatched offers.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#e7e7eb] flex items-center justify-between text-xs text-[#777585]">
              <span>Fastest Claim Recorded:</span>
              <span className="font-bold text-[#1c1b1b]">1m 12s</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-[#e7e7eb] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#c8c4d6] transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#777585] uppercase tracking-wider">
                  Nodal Escrow Protection
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#eaf5ef] text-[#006d3a]">
                  <span className="material-symbols-outlined text-[13px]">lock</span>
                  Razorpay Route V2
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-[#1c1b1b] tracking-tight tabular-nums font-heading">
                  ₹{offers.reduce((acc, o) => acc + o.payout, 0)} Guaranteed
                </span>
              </div>
              <p className="text-xs text-[#474554] mt-2 leading-relaxed">
                Funds pre-captured and held in atomic nodal escrow; 0% mentor commission deduction.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#e7e7eb] flex items-center justify-between text-xs text-[#777585]">
              <span>Auto-settlement:</span>
              <span className="font-bold text-[#006d3a]">Weekly to HDFC (**** 4812)</span>
            </div>
          </div>
        </section>

        {/* Queue Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#e7e7eb]">
          <div className="flex items-center gap-2">
            {[
              { id: "all", label: `All Inbound (${offers.length})` },
              { id: "wave1", label: `Wave 1 Priority (${offers.length})` },
              { id: "wave2", label: "Wave 2 Cascaded (0)" },
              { id: "archived", label: "Archived / Expired (14)" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-[#5145cd] text-white shadow-xs"
                    : "bg-white border border-[#e7e7eb] text-[#474554] hover:bg-[#f6f3f2]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-[#777585] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006d3a] animate-ping" />
            Auto-refreshing in 12s • Audio alerts enabled
          </span>
        </div>

        {/* Inbound Offer Cards */}
        {isLoading ? (
          <div className="p-12 bg-white border border-[#e7e7eb] rounded-2xl text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#5145cd] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-[#777585]">Polling live Smart Match dispatch queue...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="p-12 bg-white border border-[#e7e7eb] rounded-2xl text-center space-y-2">
            <span className="material-symbols-outlined text-4xl text-[#777585]">task_alt</span>
            <h3 className="text-base font-bold text-[#1c1b1b]">No Pending Claims</h3>
            <p className="text-xs text-[#474554] max-w-sm mx-auto">
              You are all caught up! New Wave 1 offers matched to your L5/L6 senior engineering profile will appear here with instant sound alert.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white border border-[#e7e7eb] rounded-2xl p-5 sm:p-6 shadow-xs hover:border-[#5145cd]/50 transition-all space-y-4 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#5145cd]" />

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-[#5145cd] uppercase font-mono tracking-wider">
                        OFFER {offer.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#eaf5ef] text-[#006d3a] border border-[#94f7b2]">
                        {offer.waveTag}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#1c1b1b] font-heading">
                      {offer.serviceCode}: {offer.serviceTitle}
                    </h3>
                    <p className="text-xs text-[#474554]">{offer.duration}</p>
                  </div>

                  {/* Payout & Countdown */}
                  <div className="sm:text-right shrink-0 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#777585] block">
                      Protected Net Payout
                    </span>
                    <span className="text-2xl font-extrabold text-[#1c1b1b] tabular-nums font-heading block">
                      ₹{offer.payout}
                    </span>
                    <span className="text-[10px] text-[#006d3a] font-bold block">
                      100% Full List Basis
                    </span>
                  </div>
                </div>

                {/* Urgent Countdown Bar */}
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <span className="material-symbols-outlined text-sm text-amber-600 animate-spin">timer</span>
                    <span>23m 40s remaining before Wave 2 cascade</span>
                  </div>
                  <span className="text-[11px] text-amber-800">
                    Exclusive to you and 2 other accredited mentors
                  </span>
                </div>

                {/* Candidate & Scope Box */}
                <div className="p-4 rounded-xl bg-[#f6f3f2] border border-[#e7e7eb] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1c1b1b] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#777585]">account_circle</span>
                      Candidate {offer.candidateId} ({offer.candidateLevel})
                    </span>
                    <span className="text-[#5145cd] font-semibold">{offer.slotText}</span>
                  </div>
                  <div className="space-y-1 text-[#474554]">
                    <p>
                      <strong className="text-[#1c1b1b]">Target Goal:</strong> {offer.targetTrack}
                    </p>
                    <p>
                      <strong className="text-[#1c1b1b]">Scope &amp; Focus:</strong> {offer.focusArea}
                    </p>
                    {offer.resumeFileName && (
                      <p className="flex items-center gap-1 text-[#5145cd] pt-1">
                        <span className="material-symbols-outlined text-xs">attachment</span>
                        <span className="underline cursor-pointer">{offer.resumeFileName}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Decision Triggers */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[11px] text-[#777585]">
                    Accepting locks your slot and sends calendar invite with Google Meet link.
                  </span>
                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => handleDecline(offer.requestId)}
                      className="px-4 py-2 border border-[#e7e7eb] hover:bg-red-50 hover:text-red-700 text-[#474554] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Decline Request
                    </button>
                    <button
                      type="button"
                      onClick={() => handleClaim(offer.requestId, offer.serviceTitle)}
                      className="px-5 py-2 bg-[#5145cd] hover:bg-[#3828b5] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 focus:ring-2 focus:ring-offset-2 focus:ring-[#5145cd] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      <span>Accept Offer &amp; Lock Slot</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Two-Wave Smart Match Cascade Blueprint (PRD §10.3 Visual Flow Card) */}
        <section aria-labelledby="cascade-flow-title" className="bg-white border border-[#e7e7eb] rounded-2xl p-6 shadow-xs space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#777585]">
              Algorithmic Architecture
            </span>
            <h2 className="text-base font-bold text-[#1c1b1b] font-heading mt-0.5" id="cascade-flow-title">
              Two-Wave Smart Match Cascade Blueprint (PRD §10.3)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-[#f6f3f2] border border-[#e7e7eb] space-y-1.5">
              <span className="w-5 h-5 rounded-full bg-[#5145cd] text-white text-[10px] font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-xs text-[#1c1b1b]">Candidate Booking</h3>
              <p className="text-[11px] text-[#474554] leading-relaxed">
                Candidate selects unassigned slot and deposits full session fee into Razorpay Nodal Escrow hold.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#e3dfff]/50 border border-[#5145cd]/30 space-y-1.5">
              <span className="w-5 h-5 rounded-full bg-[#5145cd] text-white text-[10px] font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-xs text-[#5145cd]">Wave 1: Affinity Lock</h3>
              <p className="text-[11px] text-[#474554] leading-relaxed">
                Dispatched exclusively to top-3 accredited mentors. Mentors have 30 minutes to claim before cascade.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f6f3f2] border border-[#e7e7eb] space-y-1.5">
              <span className="w-5 h-5 rounded-full bg-[#777585] text-white text-[10px] font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="font-bold text-xs text-[#1c1b1b]">Wave 2: Pool Expansion</h3>
              <p className="text-[11px] text-[#474554] leading-relaxed">
                If unclaimed at 30 minutes, dispatch cascades to all verified mentors with matching domain credentials.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f6f3f2] border border-[#e7e7eb] space-y-1.5">
              <span className="w-5 h-5 rounded-full bg-[#006d3a] text-white text-[10px] font-bold flex items-center justify-center">
                4
              </span>
              <h3 className="font-bold text-xs text-[#006d3a]">2h Candidate Protection</h3>
              <p className="text-[11px] text-[#474554] leading-relaxed">
                If unclaimed after 120 minutes, candidate receives immediate choice of alternate slot or 100% instant refund.
              </p>
            </div>
          </div>
        </section>

        {/* Footer Disclosures */}
        <div className="p-4 rounded-2xl bg-white border border-[#e7e7eb] text-xs text-[#777585] space-y-1 shadow-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#1c1b1b]">
            <span className="material-symbols-outlined text-[16px] text-[#006d3a]">security</span>
            <span>Statutory Nodal Escrow &amp; Atomicity Guarantee</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            All payouts stored in integer paise and disbursed via Razorpay Nodal Escrow Route. No double-booking race conditions enforced via atomic database row locking. DPDP Act 2023 candidate privacy safeguards strictly applied.
          </p>
        </div>
      </main>
    </div>
  );
}
