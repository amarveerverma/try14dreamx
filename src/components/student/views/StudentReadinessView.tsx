"use client";

import * as React from "react";
import {
  BarChart3,
  Lock,
  Info,
  UploadCloud,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { StudentModal } from "../ui/StudentModal";
import { StudentStatusBadge } from "../ui/StudentStatusBadge";
import {
  ReadinessDimension,
  ReadinessHistoryEntry,
  CandidateSegment,
  calculateReadinessScore,
  RUBRIC_SCALE,
  getServiceById,
} from "../types";

export interface StudentReadinessViewProps {
  segment: CandidateSegment;
  portfolioNotApplicable: boolean;
  dimensions: ReadinessDimension[];
  history: ReadinessHistoryEntry[];
  onTogglePortfolioNA: () => void;
  onRequestReassessment: (dimension: string, evidenceNote: string) => void;
  onStartBooking: (serviceId: string) => void;
}

export function StudentReadinessView({
  segment,
  portfolioNotApplicable,
  dimensions,
  history,
  onTogglePortfolioNA,
  onRequestReassessment,
  onStartBooking,
}: StudentReadinessViewProps) {
  const [evidenceModalDimension, setEvidenceModalDimension] = React.useState<string | null>(null);
  const [evidenceText, setEvidenceText] = React.useState<string>("");
  const [evidenceError, setEvidenceError] = React.useState<string | null>(null);

  const readiness = calculateReadinessScore(dimensions, segment, portfolioNotApplicable);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-900">
                <Lock className="h-3 w-3" />
                Private by Default (Never Publicly Shared)
              </span>
              <span className="font-mono text-xs text-zinc-500">
                Segment: {segment} · rubric-v3.0
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">
              Career Readiness Assessment
            </h1>
            <p className="text-sm text-zinc-600">
              Deterministic eight-dimension preparation index calculated from attributed evidence (
              <code className="font-mono text-xs bg-zinc-100 px-1 py-0.5 rounded">
                Σ(weight × score / 5) × 100
              </code>
              ). Not a scientifically validated hiring probability.
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 px-5 py-4 flex items-center gap-4 shrink-0">
            <BarChart3 className="h-8 w-8 text-[#5145cd]" />
            <div>
              <span className="text-xs font-semibold text-indigo-950 block">Overall Readiness</span>
              <span className="text-3xl font-bold font-mono text-[#4035b3] tabular-nums">
                {readiness.overallScore === null
                  ? "Insufficient Evidence"
                  : `${readiness.overallScore}/100`}
              </span>
              <span className="block text-[11px] text-zinc-600">
                {readiness.assessedCount} of {readiness.applicableCount} applicable dimensions
                assessed
              </span>
            </div>
          </div>
        </div>

        {/* Portfolio N/A Weight Toggle Banner */}
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/85 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5 text-zinc-700">
            <Info className="h-4 w-4 text-[#5145cd] shrink-0 mt-0.5" />
            <p>
              {portfolioNotApplicable ? (
                <>
                  <strong className="text-zinc-900">Adjusted Score Active (Portfolio N/A):</strong>{" "}
                  Portfolio’s base segment weight is proportionally redistributed across the 7
                  remaining dimensions so applicable weights sum to 100%.
                </>
              ) : (
                <>
                  <strong className="text-zinc-900">All 8 Dimensions Applicable:</strong> Standard{" "}
                  {segment} weights are active (totalling 100%). Unassessed dimensions are never
                  labelled as confirmed zero competence.
                </>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onTogglePortfolioNA}
            className="shrink-0 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100"
          >
            {portfolioNotApplicable ? "Mark Portfolio Applicable" : "Mark Portfolio N/A"}
          </button>
        </div>
      </div>

      {/* 8 Dimensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dimensions.map((dim) => {
          const isNA = dim.dimension === "Portfolio" && portfolioNotApplicable;
          const weight = readiness.effectiveWeights[dim.dimension];
          const service = getServiceById(dim.relatedServiceId);
          const scoreLabel = isNA
            ? "Not Applicable — Weight proportionally redistributed"
            : dim.score === null
            ? RUBRIC_SCALE[0].label
            : RUBRIC_SCALE[dim.score]?.label;

          return (
            <article
              key={dim.dimension}
              className={`rounded-2xl border bg-white/94 backdrop-blur-md p-5 shadow-xs flex flex-col justify-between space-y-4 ${
                isNA ? "border-zinc-200/70 opacity-80" : "border-white/80"
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-zinc-900">{dim.dimension}</h2>
                      <span className="font-mono text-xs text-zinc-500 tabular-nums">
                        Weight: {weight}%
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#4035b3] mt-0.5">{scoreLabel}</p>
                  </div>
                  <StudentStatusBadge
                    label={isNA ? "N/A" : dim.status}
                    tone={
                      isNA
                        ? "neutral"
                        : dim.status === "Mentor Verified"
                        ? "success"
                        : dim.status === "Not Assessed"
                        ? "warning"
                        : "info"
                    }
                  />
                </div>

                {!isNA && (
                  <div className="grid grid-cols-5 gap-1.5" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-2 rounded-full ${
                          dim.score !== null && level <= dim.score
                            ? "bg-[#5145cd]"
                            : "bg-zinc-200/80"
                        }`}
                      />
                    ))}
                  </div>
                )}

                <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/75 p-3 text-xs space-y-1">
                  <p className="text-zinc-700 leading-relaxed">{dim.evidenceSummary}</p>
                  <p className="text-[11px] text-zinc-500">
                    Attribution: <strong>{dim.assessorLabel}</strong> · Updated: {dim.lastUpdated}
                  </p>
                </div>

                <p className="text-xs text-zinc-600">
                  <strong className="text-zinc-900">Suggested action:</strong>{" "}
                  {dim.suggestedAction}
                </p>
              </div>

              {!isNA && (
                <div className="pt-3 border-t border-zinc-200/80 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEvidenceModalDimension(dim.dimension);
                      setEvidenceText("");
                      setEvidenceError(null);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-900"
                  >
                    <UploadCloud className="h-3.5 w-3.5" />
                    Provide Evidence
                  </button>
                  <button
                    type="button"
                    onClick={() => onStartBooking(service.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-[#4035b3] hover:bg-indigo-100"
                  >
                    Book {service.id} · {service.name}
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Preserved Assessment History Trail */}
      <section className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3">
          <h2 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-[#5145cd]" />
            Preserved Assessment History
          </h2>
          <span className="text-xs text-zinc-500">Prior snapshots are never overwritten</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {history.map((snap) => (
            <div
              key={snap.id}
              className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3.5 space-y-1 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-zinc-500">{snap.date}</span>
                <span className="font-mono font-bold text-[#4035b3] text-sm tabular-nums">
                  {snap.score}/100
                </span>
              </div>
              <p className="font-medium text-zinc-800">{snap.triggerNote}</p>
              <p className="text-[11px] text-zinc-500">
                Coverage: {snap.assessedCount}/{snap.applicableCount} · {snap.rubricVersion}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Provide Evidence Modal */}
      <StudentModal
        open={!!evidenceModalDimension}
        onClose={() => setEvidenceModalDimension(null)}
        title={`Submit New Evidence — ${evidenceModalDimension ?? ""}`}
        subtitle="Recorded as student-supplied artifact context for your next mentor reassessment (PRD 8.4)."
        footer={
          <>
            <button
              type="button"
              onClick={() => setEvidenceModalDimension(null)}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="reassess-evidence-form"
              className="rounded-lg bg-[#5145cd] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4035b3]"
            >
              Attach Evidence Note
            </button>
          </>
        }
      >
        <form
          id="reassess-evidence-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (evidenceModalDimension) {
              if (evidenceText.trim().length < 15) {
                setEvidenceError(
                  "Please describe your new artifact or evidence reference (at least 15 characters)."
                );
                return;
              }
              onRequestReassessment(evidenceModalDimension, evidenceText.trim());
              setEvidenceModalDimension(null);
              setEvidenceText("");
              setEvidenceError(null);
            }
          }}
          className="space-y-3 text-xs"
        >
          <p className="text-zinc-600">
            Note: Readiness scores never increase automatically without attributed assessment review.
            Submitting your updated artifact prepares it for your next mentor session.
          </p>
          <textarea
            rows={3}
            value={evidenceText}
            onChange={(e) => {
              setEvidenceText(e.target.value);
              if (evidenceError) setEvidenceError(null);
            }}
            placeholder="e.g., Added architecture diagram & benchmark suite to GitHub payment-webhook repo..."
            className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
          />
          {evidenceError && <p className="font-semibold text-rose-600">{evidenceError}</p>}
        </form>
      </StudentModal>
    </div>
  );
}
