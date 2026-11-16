"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  Info,
} from "lucide-react";
import { StudentModal } from "../ui/StudentModal";
import {
  StudentProfileData,
  ReadinessDimension,
  CandidateSegment,
  calculateReadinessScore,
  RUBRIC_SCALE,
} from "../types";

export interface StudentOnboardingModalProps {
  open: boolean;
  profile: StudentProfileData;
  dimensions: ReadinessDimension[];
  onClose: () => void;
  onCompleteOnboarding: (
    updatedProfile: StudentProfileData,
    updatedDimensions: ReadinessDimension[]
  ) => void;
}

const SEGMENT_OPTIONS: { id: CandidateSegment; desc: string }[] = [
  {
    id: "Student",
    desc: "Campus placement or internship preparation (Technical Skills 20%, Portfolio 12%)",
  },
  {
    id: "Fresh graduate",
    desc: "0–1 yr experience targeting entry SWE, Data/AI, or APM roles",
  },
  {
    id: "Early-career professional",
    desc: "1–5 yrs experience targeting role growth or product-company transition",
  },
  {
    id: "Career switcher",
    desc: "Transitioning tracks or domains (Career Planning 20%, Portfolio 15%)",
  },
];

const TARGET_DOMAINS = ["Software Engineering", "Data Science / AI", "Product Management"];

export function StudentOnboardingModal({
  open,
  profile,
  dimensions,
  onClose,
  onCompleteOnboarding,
}: StudentOnboardingModalProps) {
  const [step, setStep] = React.useState<number>(1);
  const [tempProfile, setTempProfile] = React.useState<StudentProfileData>(profile);
  const [scoresMap, setScoresMap] = React.useState<Record<string, number | null>>(() => {
    const map: Record<string, number | null> = {};
    dimensions.forEach((d) => {
      map[d.dimension] = d.score;
    });
    return map;
  });

  React.useEffect(() => {
    if (!open) return;
    setStep(1);
    setTempProfile(profile);
    const map: Record<string, number | null> = {};
    dimensions.forEach((d) => {
      map[d.dimension] = d.score;
    });
    setScoresMap(map);
  }, [open, profile, dimensions]);

  const activeDimensions: ReadinessDimension[] = dimensions.map((d) => {
    if (d.dimension === "Portfolio" && tempProfile.portfolioNotApplicable) {
      return { ...d, score: null, notApplicable: true, status: "Not Applicable" };
    }
    const val = scoresMap[d.dimension];
    return {
      ...d,
      notApplicable: false,
      score: val,
      status:
        d.status === "Mentor Verified"
          ? "Mentor Verified"
          : val !== null && val > 0
          ? "Baseline Self-Report"
          : "Not Assessed",
    };
  });

  const readiness = calculateReadinessScore(
    activeDimensions,
    tempProfile.segment,
    tempProfile.portfolioNotApplicable
  );

  const footer = (
    <div className="w-full flex items-center justify-between">
      <button
        type="button"
        disabled={step === 1}
        onClick={() => setStep((s) => Math.max(1, s - 1))}
        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Previous
      </button>

      <div className="flex items-center gap-2">
        {step === 4 && (
          <button
            type="button"
            onClick={() => setStep(5)}
            className="rounded-lg px-3 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800"
          >
            Skip Optional Step
          </button>
        )}
        {step < 6 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(6, s + 1))}
            className="inline-flex items-center gap-1 rounded-lg bg-[#5145cd] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4035b3]"
          >
            Continue
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              onCompleteOnboarding({ ...tempProfile, onboardingCompleted: true }, activeDimensions);
              setStep(1);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            <CheckCircle2 className="h-4 w-4" />
            Save & Update Dashboard
          </button>
        )}
      </div>
    </div>
  );

  return (
    <StudentModal
      open={open}
      onClose={onClose}
      maxWidthClass="max-w-2xl"
      title={`Guided Career Onboarding — Step ${step} of 6`}
      subtitle="Your answers calibrate readiness weights and deterministic next-step service recommendations."
      footer={footer}
    >
      {/* Step Indicator */}
      <div className="mb-5">
        <div className="grid grid-cols-6 gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-colors ${
                s <= step ? "bg-[#5145cd]" : "bg-zinc-200"
              }`}
            />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-zinc-900">
            Step 1 — Select your current career stage
          </h3>
          <p className="text-xs text-zinc-600">
            Why we ask: DreamX applies approved segment-specific readiness weights (totalling 100%)
            based on your career stage (PRD 8.2).
          </p>
          <div className="space-y-2">
            {SEGMENT_OPTIONS.map((seg) => (
              <button
                key={seg.id}
                type="button"
                onClick={() => setTempProfile({ ...tempProfile, segment: seg.id })}
                className={`w-full text-left rounded-xl border p-3.5 transition-all ${
                  tempProfile.segment === seg.id
                    ? "border-[#5145cd] bg-indigo-50/55 ring-1 ring-[#5145cd]/25"
                    : "border-zinc-200 bg-white hover:bg-zinc-50"
                }`}
              >
                <p className="text-xs font-bold text-zinc-900">{seg.id}</p>
                <p className="text-xs text-zinc-600 mt-0.5">{seg.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-900">
            Step 2 — Target career domain & role
          </h3>
          <p className="text-xs text-zinc-600">
            Why we ask: Matches you only with mentors verified in your target domain (India MVP
            launch domains).
          </p>
          <div>
            <span className="block text-xs font-semibold text-zinc-800 mb-1.5">
              Primary Domain
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {TARGET_DOMAINS.map((dom) => (
                <button
                  key={dom}
                  type="button"
                  onClick={() => setTempProfile({ ...tempProfile, targetDomain: dom })}
                  className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors ${
                    tempProfile.targetDomain === dom
                      ? "border-[#5145cd] bg-[#5145cd] text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  {dom}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="onb-target-role" className="block text-xs font-semibold text-zinc-800">
              Specific Target Role
            </label>
            <input
              id="onb-target-role"
              type="text"
              value={tempProfile.targetRole}
              onChange={(e) => setTempProfile({ ...tempProfile, targetRole: e.target.value })}
              placeholder="e.g., Backend Engineer (SDE-2), New Grad SWE, Data Scientist"
              className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-900">
            Step 3 — Current situation & timeline
          </h3>
          <p className="text-xs text-zinc-600">
            Why we ask: Helps prioritize urgent mock interviews versus foundational roadmap or
            resume work.
          </p>
          <div>
            <label htmlFor="onb-timeline" className="block text-xs font-semibold text-zinc-800">
              Target Interview / Application Timeline
            </label>
            <select
              id="onb-timeline"
              value={tempProfile.interviewTimeline}
              onChange={(e) =>
                setTempProfile({ ...tempProfile, interviewTimeline: e.target.value })
              }
              className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900"
            >
              <option value="Active interview loops within 2–4 weeks">
                Active interview loops within 2–4 weeks
              </option>
              <option value="Preparing applications over next 1–2 months">
                Preparing applications over next 1–2 months
              </option>
              <option value="3+ month structured upskilling & transition">
                3+ month structured upskilling & transition
              </option>
            </select>
          </div>
          <div>
            <label htmlFor="onb-challenge" className="block text-xs font-semibold text-zinc-800">
              Biggest Immediate Blocker
            </label>
            <textarea
              id="onb-challenge"
              rows={3}
              value={tempProfile.primaryChallenge}
              onChange={(e) =>
                setTempProfile({ ...tempProfile, primaryChallenge: e.target.value })
              }
              className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900"
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-900">
            Step 4 — Optional Career Documents & Portfolio Applicability
          </h3>
          <p className="text-xs text-zinc-600">
            Optional at onboarding (Principle 7: Avoid unnecessary friction). Resumes remain
            private by default.
          </p>
          <div>
            <label htmlFor="onb-resume" className="block text-xs font-semibold text-zinc-800">
              Private Resume Artifact Filename (Optional)
            </label>
            <input
              id="onb-resume"
              type="text"
              value={tempProfile.resumeFileName ?? ""}
              onChange={(e) =>
                setTempProfile({
                  ...tempProfile,
                  resumeFileName: e.target.value.trim() || null,
                })
              }
              placeholder="e.g., My_Resume_2026.pdf"
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm"
            />
          </div>
          <label className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 cursor-pointer">
            <input
              type="checkbox"
              checked={tempProfile.portfolioNotApplicable}
              onChange={(e) =>
                setTempProfile({ ...tempProfile, portfolioNotApplicable: e.target.checked })
              }
              className="mt-0.5 accent-[#5145cd]"
            />
            <div className="text-xs">
              <span className="font-semibold text-zinc-900 block">
                Portfolio is Not Applicable (N/A) for my target track
              </span>
              <span className="text-zinc-600">
                When N/A, Portfolio’s weight is proportionally redistributed across the remaining 7
                dimensions (PRD 8.3).
              </span>
            </div>
          </label>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-zinc-900">
            Step 5 — Baseline Self-Assessment (0–5 Anchors)
          </h3>
          <p className="text-xs text-zinc-600">
            Leave any dimension as &quot;Not assessed&quot; if you lack evidence—DreamX never fabricates
            scores when data is missing.
          </p>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {dimensions.map((d) => {
              if (d.dimension === "Portfolio" && tempProfile.portfolioNotApplicable) return null;
              const isVerified = d.status === "Mentor Verified";
              return (
                <div
                  key={d.dimension}
                  className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="font-semibold text-zinc-900">{d.dimension}</span>
                    {isVerified && (
                      <span className="ml-2 text-[10px] font-semibold text-emerald-700">
                        (Mentor Verified)
                      </span>
                    )}
                  </div>
                  <select
                    disabled={isVerified}
                    value={scoresMap[d.dimension] ?? ""}
                    onChange={(e) =>
                      setScoresMap({
                        ...scoresMap,
                        [d.dimension]: e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                    className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1 text-xs disabled:opacity-65"
                  >
                    <option value="">Not assessed yet</option>
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {RUBRIC_SCALE[lvl].label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-indigo-950 flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-[#5145cd]" />
                Calculated Readiness Baseline ({tempProfile.segment})
              </p>
              <p className="text-xs text-zinc-600 mt-1">
                Coverage: {readiness.assessedCount} of {readiness.applicableCount} applicable
                dimensions evidenced
                {readiness.adjustedForPortfolioNA ? " · Adjusted for Portfolio N/A" : ""}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold font-mono text-[#4035b3] tabular-nums">
                {readiness.overallScore === null
                  ? "Insufficient Data"
                  : `${readiness.overallScore}/100`}
              </span>
            </div>
          </div>

          {readiness.highestPriorityGap && (
            <div className="rounded-xl border border-zinc-200 bg-white p-3.5 space-y-1 text-xs">
              <p className="font-semibold text-zinc-900">
                Suggested Next Useful Action: Address {readiness.highestPriorityGap.dimension}
              </p>
              <p className="text-zinc-600">
                {readiness.highestPriorityGap.dimension} carries the largest remaining weighted
                readiness gap for your {tempProfile.segment} profile.
              </p>
            </div>
          )}

          <p className="text-[11px] text-zinc-500 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 shrink-0" />
            Your readiness score is private by default and is never marketed as a hiring guarantee.
          </p>
        </div>
      )}
    </StudentModal>
  );
}
