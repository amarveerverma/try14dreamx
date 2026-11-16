"use client";

import * as React from "react";
import {
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  ShieldCheck,
  Calendar,
  Lock,
} from "lucide-react";
import { DispatchOffer, getServiceById, formatINR } from "../types";
import { StatusBadge } from "../StatusBadge";

interface DispatchViewProps {
  isApplicantMode: boolean;
  offers: DispatchOffer[];
  highlightedOfferId?: string;
  onClaimOffer: (offerId: string, chosenWindowLabel: string) => Promise<"accepted" | "already_claimed">;
  onDeclineOffer: (offerId: string) => void;
  onNavigate: (route: string) => void;
}

export function DispatchView({
  isApplicantMode,
  offers,
  highlightedOfferId,
  onClaimOffer,
  onDeclineOffer,
  onNavigate,
}: DispatchViewProps) {
  const [selectedWindowMap, setSelectedWindowMap] = React.useState<Record<string, string>>({});
  const [claimingOfferId, setClaimingOfferId] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<"pending" | "resolved">("pending");

  const pendingOffers = offers.filter((o) => o.status === "Pending");
  const resolvedOffers = offers.filter((o) => o.status !== "Pending");

  const handleClaim = async (offer: DispatchOffer) => {
    const chosenWindow =
      selectedWindowMap[offer.id] || offer.preferredWindows[0]?.label || "Next Available IST Slot";
    setClaimingOfferId(offer.id);
    await onClaimOffer(offer.id, chosenWindow);
    setClaimingOfferId(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Header Banner */}
      <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#5145cd] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                PRD §10.1–§10.4
              </span>
              <span className="text-xs text-zinc-500 font-semibold">Deterministic Smart Match Engine</span>
            </div>
            <h1 className="mt-1 text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              Smart Match Dispatch Offers
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
              Algorithmic dispatch offers matching your approved services, domain expertise, and weekly IST calendar. First-to-claim atomic locks prevent concurrent race conditions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "pending"
                  ? "bg-[#5145cd] text-white shadow-xs"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200/80"
              }`}
            >
              Pending Offers ({pendingOffers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("resolved")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "resolved"
                  ? "bg-[#5145cd] text-white shadow-xs"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200/80"
              }`}
            >
              Resolved History ({resolvedOffers.length})
            </button>
          </div>
        </div>

        {/* Dispatch SLA Rule Banner */}
        <div className="mt-4 rounded-xl border border-indigo-200/80 bg-indigo-50/50 p-3.5 flex items-start gap-3 text-xs text-zinc-700">
          <Clock className="w-4 h-4 text-[#5145cd] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-zinc-900">Confirmed Dispatch Timing:</span>
            <p className="text-zinc-600">
              Wave 1 dispatches exclusively to top-tier qualified mentors for the first 30 minutes. Wave 2 opens wider eligibility. At 120 minutes without claim, the candidate chooses an open slot or 100% full refund.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Offers List */}
      {activeTab === "pending" ? (
        pendingOffers.length === 0 ? (
          <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-12 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-zinc-800">No pending dispatch offers right now</h2>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
              Expand your recurring weekly IST windows in the Availability tab to become eligible for more Smart Match student requests.
            </p>
            <button
              type="button"
              onClick={() => onNavigate("availability")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800"
            >
              <Calendar className="w-4 h-4" />
              <span>Review IST Availability</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingOffers.map((offer) => {
              const service = getServiceById(offer.serviceId);
              const isClaiming = claimingOfferId === offer.id;
              const isContended = offer.simulateContendedClaim;

              return (
                <article
                  key={offer.id}
                  className={`rounded-2xl border bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs transition-all space-y-4 ${
                    highlightedOfferId === offer.id
                      ? "border-[#5145cd] ring-2 ring-[#5145cd]/20"
                      : "border-white/80"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {offer.requestCode}
                      </span>
                      <h2 className="text-base font-bold text-zinc-900">{service.name}</h2>
                      <span className="text-xs text-zinc-500 tabular-nums font-semibold">
                        {service.durationMinutes} min · {formatINR(service.listPricePaise)}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          offer.wave === "Wave 1"
                            ? "bg-purple-100 text-purple-900 border border-purple-200"
                            : "bg-amber-100 text-amber-900 border border-amber-200"
                        }`}
                      >
                        {offer.wave} ({offer.expiresInMinutes}m window left)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                      <span>Elapsed: {offer.minutesSinceRequest}m</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Left: Student & Match Context */}
                    <div className="lg:col-span-7 space-y-3 text-xs">
                      <div>
                        <span className="font-bold text-zinc-900 block mb-1">Student Goal Summary:</span>
                        <p className="text-zinc-700 bg-zinc-50 rounded-xl p-3 border border-zinc-200/80 leading-relaxed">
                          &ldquo;{offer.goalSummary}&rdquo;
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-zinc-600">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Candidate: <strong className="text-zinc-900">{offer.studentAlias}</strong> ({offer.studentSegment})</span>
                        </div>
                        <div>
                          <span>Domain: <strong className="text-zinc-900">{offer.targetDomain}</strong></span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="font-bold text-zinc-900 block">Why this request matched you:</span>
                        <ul className="space-y-1 text-zinc-600 pl-4 list-disc">
                          {offer.matchReasons.map((reason, idx) => (
                            <li key={idx}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right: Slot Selection & Claim Action */}
                    <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-zinc-900 block">
                          Student Preferred IST Windows ({offer.preferredWindows.length}):
                        </span>
                        <div className="space-y-1.5">
                          {offer.preferredWindows.map((win) => {
                            const isSelected =
                              (selectedWindowMap[offer.id] || offer.preferredWindows[0]?.label) === win.label;

                            return (
                              <button
                                key={win.id}
                                type="button"
                                onClick={() =>
                                  setSelectedWindowMap((prev) => ({ ...prev, [offer.id]: win.label }))
                                }
                                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-between ${
                                  isSelected
                                    ? "bg-indigo-50/80 border-[#5145cd] text-[#4035b3] shadow-xs"
                                    : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                                }`}
                              >
                                <span>{win.label}</span>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-[#5145cd]" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Claim / Decline Actions */}
                      <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                        <button
                          type="button"
                          disabled={isApplicantMode || isClaiming}
                          onClick={() => handleClaim(offer)}
                          className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#5145cd] hover:bg-[#4035b3] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>{isClaiming ? "Claiming Slot Atomically..." : "Confirm & Claim Slot"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeclineOffer(offer.id)}
                          className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 text-xs font-bold transition-all"
                        >
                          Decline
                        </button>
                      </div>

                      {isApplicantMode && (
                        <p className="text-[11px] font-semibold text-amber-800 text-center">
                          Applicant mode: paid claim locked until accreditation is completed.
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )
      ) : (
        /* Resolved History Tab */
        <div className="space-y-3">
          {resolvedOffers.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500 bg-white rounded-2xl border border-zinc-200">
              No resolved dispatch history yet.
            </div>
          ) : (
            resolvedOffers.map((offer) => {
              const service = getServiceById(offer.serviceId);
              return (
                <div
                  key={offer.id}
                  className="rounded-xl border border-zinc-200 bg-white/94 p-4 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-zinc-700">{offer.requestCode}</span>
                      <span className="font-semibold text-zinc-900">{service.name}</span>
                      <StatusBadge
                        label={offer.status}
                        tone={
                          offer.status === "Accepted"
                            ? "success"
                            : offer.status === "Already Claimed"
                            ? "warning"
                            : "neutral"
                        }
                        size="sm"
                      />
                    </div>
                    <p className="text-zinc-500">Candidate: {offer.studentAlias}</p>
                  </div>

                  <span className="text-[11px] font-mono text-zinc-400">
                    {offer.status === "Accepted" ? "Converted to Confirmed Booking" : "Offer Closed"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
