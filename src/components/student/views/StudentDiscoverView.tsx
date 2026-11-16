"use client";

import * as React from "react";
import {
  Compass,
  Layers,
  Info,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  ReadinessDimension,
  SEED_DISCOVER_PATHS,
  DiscoverPath,
} from "../types";
import { StatusBadge } from "@/components/mentor/StatusBadge";
import { SERVICES_CATALOGUE, formatINR } from "@/components/mentor/types";

interface StudentDiscoverViewProps {
  membershipTier: "Free" | "Pro" | "Elite";
  dimensions: ReadinessDimension[];
  bundleServiceIds: string[];
  onStartBooking: (serviceId: string) => void;
  onToggleBundleService: (serviceId: string) => void;
  onNavigate: (tab: string, recordId?: string) => void;
}

export function StudentDiscoverView({
  membershipTier,
  dimensions,
  bundleServiceIds,
  onStartBooking,
  onToggleBundleService,
  onNavigate,
}: StudentDiscoverViewProps) {
  const [selectedPathId, setSelectedPathId] = React.useState<string>("technical-interviews");
  const currentPath =
    SEED_DISCOVER_PATHS.find((p) => p.id === selectedPathId) || SEED_DISCOVER_PATHS[0];

  const [selectedChoiceId, setSelectedChoiceId] = React.useState<string>(
    currentPath.followUpChoices[0].id
  );

  const handlePathChange = (pathId: string) => {
    setSelectedPathId(pathId);
    const path = SEED_DISCOVER_PATHS.find((p) => p.id === pathId) || SEED_DISCOVER_PATHS[0];
    setSelectedChoiceId(path.followUpChoices[0].id);
  };

  const currentChoice =
    currentPath.followUpChoices.find((c) => c.id === selectedChoiceId) ||
    currentPath.followUpChoices[0];

  // Helper for pricing with membership tier discount
  const getPayablePaise = (listPaise: number) => {
    const discountPercent = membershipTier === "Elite" ? 10 : membershipTier === "Pro" ? 5 : 0;
    const discountPaise = Math.round((listPaise * discountPercent) / 100);
    return {
      payablePaise: listPaise - discountPaise,
      discountPaise,
      discountPercent,
    };
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* 1. Header Banner */}
      <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-semibold text-[#4035b3]">
              <Compass className="w-3.5 h-3.5" />
              Goal-First Career Discovery
            </span>
            <h1 className="mt-2 text-2xl font-bold text-zinc-900 tracking-tight">
              What are you trying to improve right now?
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
              Start with your immediate career goal rather than memorizing ten service names. DreamX maps your goal and readiness coverage to eligible calibrated mentors using deterministic rules.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("services", "bundle")}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 px-4 py-2.5 text-xs font-bold text-[#4035b3] transition-all cursor-pointer shadow-xs"
          >
            <Layers className="w-4 h-4" />
            <span>Custom 3-Service Bundle ({bundleServiceIds.length}/3)</span>
          </button>
        </div>

        {/* Path Selector Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {SEED_DISCOVER_PATHS.map((p) => {
            const isSelected = p.id === selectedPathId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePathChange(p.id)}
                className={`text-left rounded-xl border p-3.5 transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#5145cd] bg-indigo-50/70 ring-2 ring-[#5145cd]/20 shadow-xs"
                    : "border-zinc-200 bg-zinc-50/70 hover:bg-white hover:border-zinc-300"
                }`}
              >
                <p className="text-xs sm:text-sm font-bold text-zinc-900">{p.label}</p>
                <p className="mt-1 text-[11px] text-zinc-600 leading-snug line-clamp-2">
                  {p.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Follow-up Section */}
      <section className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-6 shadow-xs space-y-5">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-zinc-900">
            Follow-up context: <span className="font-normal text-zinc-600">{currentPath.followUpQuestion}</span>
          </h2>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {currentPath.followUpChoices.map((choice) => {
              const isSelected = choice.id === currentChoice.id;
              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => setSelectedChoiceId(choice.id)}
                  className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#5145cd] border-[#5145cd] text-white shadow-sm"
                      : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  {choice.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rule Explanation Banner */}
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/90 px-4 py-3 flex items-start gap-2.5 text-xs text-zinc-700">
          <Info className="w-4 h-4 text-[#5145cd] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-zinc-900">Deterministic Recommendation Rule:</strong>{" "}
            {currentChoice.ruleExplanation} (Calibrated PRD V3.0 catalogue rule — not probabilistic AI).
          </p>
        </div>

        {/* Recommended Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
          {currentChoice.recommendedServiceIds.map((svcId, idx) => {
            const svc = SERVICES_CATALOGUE.find((s) => s.id === svcId) || SERVICES_CATALOGUE[0];
            const pricing = getPayablePaise(svc.listPricePaise);
            const isBundled = bundleServiceIds.includes(svc.id);

            const dimensionContexts = svc.mappedDimensions.map((d) => {
              const dim = dimensions.find((item) => item.dimension === d);
              if (!dim) return `${d}: Unassessed`;
              if (dim.notApplicable) return `${d}: N/A`;
              return `${d}: ${dim.score !== null ? `${dim.score}/5` : "Unassessed"}`;
            });

            return (
              <article
                key={svc.id}
                className="rounded-2xl border border-zinc-200/90 bg-white p-5 flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#5145cd] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {svc.id}
                      </span>
                      <StatusBadge
                        label={idx === 0 ? "Primary Match" : "Complementary Step"}
                        tone={idx === 0 ? "primary" : "neutral"}
                        size="sm"
                      />
                    </div>
                    <div className="text-right font-mono tabular-nums">
                      <span className="text-base font-extrabold text-zinc-900">
                        {formatINR(pricing.payablePaise)}
                      </span>
                      {pricing.discountPaise > 0 && (
                        <span className="ml-1.5 text-xs text-zinc-400 line-through">
                          {formatINR(svc.listPricePaise)}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-zinc-900">{svc.name}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">{svc.shortOutcome}</p>

                  {/* Readiness Context Banner */}
                  <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3 text-xs space-y-1">
                    <p className="font-semibold text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Your Readiness Context for {svc.id}
                    </p>
                    <p className="text-emerald-900 text-[11px] leading-relaxed">
                      Addresses dimensions: <strong>{dimensionContexts.join(" · ")}</strong>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 pt-1">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {svc.durationMinutes} min 1:1 session
                    </span>
                    <span>•</span>
                    <span>
                      Deliverable: <strong className="text-zinc-700">{svc.deliverableName}</strong> (48h SLA)
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                  <button
                    type="button"
                    onClick={() => onToggleBundleService(svc.id)}
                    className={`w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isBundled
                        ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                        : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    {isBundled ? (
                      <>
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        <span>Remove from Bundle</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Add to 3-Service Bundle</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onStartBooking(svc.id)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#5145cd] hover:bg-[#4338ca] text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Book Single Session</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
