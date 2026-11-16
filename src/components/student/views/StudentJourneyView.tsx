"use client";

import * as React from "react";
import {
  Flag,
  CheckCircle2,
  Circle,
  ArrowRight,
  Plus,
  Info,
} from "lucide-react";
import { StudentStatusBadge } from "../ui/StudentStatusBadge";
import { JourneyStage, VoluntaryOutcome, getServiceById } from "../types";

export interface StudentJourneyViewProps {
  stages: JourneyStage[];
  outcomes: VoluntaryOutcome[];
  onAddVoluntaryOutcome: (category: string, title: string) => void;
  onStartBooking: (serviceId: string) => void;
}

export function StudentJourneyView({
  stages,
  outcomes,
  onAddVoluntaryOutcome,
  onStartBooking,
}: StudentJourneyViewProps) {
  const [outcomeCategory, setOutcomeCategory] = React.useState<string>("Application Sent");
  const [outcomeTitle, setOutcomeTitle] = React.useState<string>("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-3">
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">Guided Career Journey</h1>
        <p className="text-sm text-zinc-600 max-w-3xl">
          Structured progression from initial baseline clarity to interview execution. Stages
          advance strictly through recorded assessment evidence and completed deliverables—never
          merely because a service was purchased.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 4 Progression Stages */}
        <div className="lg:col-span-8 space-y-4">
          {stages.map((stg) => (
            <section
              key={stg.id}
              className={`rounded-2xl border bg-white/94 backdrop-blur-md p-5 shadow-xs space-y-3.5 ${
                stg.status === "Current Stage"
                  ? "border-[#5145cd] ring-2 ring-[#5145cd]/15"
                  : "border-white/80"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-bold text-zinc-900">{stg.title}</h2>
                <div className="flex items-center gap-2">
                  {stg.completedDate && (
                    <span className="text-xs font-mono text-zinc-500">
                      Completed {stg.completedDate}
                    </span>
                  )}
                  <StudentStatusBadge
                    label={stg.status}
                    tone={
                      stg.status === "Completed"
                        ? "success"
                        : stg.status === "Current Stage"
                        ? "primary"
                        : "neutral"
                    }
                  />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600">{stg.description}</p>

              {/* Requirements Checklist */}
              <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/75 p-3.5 space-y-2">
                <p className="text-xs font-semibold text-zinc-800">Stage Evidence Requirements</p>
                <ul className="space-y-2">
                  {stg.requirements.map((req) => (
                    <li key={req.id} className="flex items-start gap-2.5 text-xs">
                      {req.met ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold text-zinc-900">{req.label}</p>
                        <p className="text-zinc-600">{req.evidenceNote}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Service Recommendations */}
              {stg.status !== "Completed" && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-semibold text-zinc-500">Relevant Services:</span>
                  {stg.recommendedServiceIds.map((sid) => {
                    const svc = getServiceById(sid);
                    return (
                      <button
                        key={sid}
                        type="button"
                        onClick={() => onStartBooking(sid)}
                        className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50/70 px-2.5 py-1 text-xs font-semibold text-[#4035b3] hover:bg-indigo-100"
                      >
                        {svc.id} · {svc.name}
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Right: Voluntary Career Milestones Log */}
        <div className="lg:col-span-4 space-y-4">
          <section className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
                <Flag className="h-4 w-4 text-[#5145cd]" />
                Career Milestones Log
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Voluntarily track real-world search outcomes (explicitly labelled Self-Reported per
                PRD 11.3).
              </p>
            </div>

            <div className="space-y-2.5">
              {outcomes.map((out) => (
                <div
                  key={out.id}
                  className="rounded-xl border border-zinc-200 bg-zinc-50/75 p-3 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[#4035b3]">{out.category}</span>
                    <StudentStatusBadge
                      label={out.verificationState}
                      tone="neutral"
                      showIcon={false}
                    />
                  </div>
                  <p className="text-zinc-800 font-medium">{out.title}</p>
                  <p className="text-[11px] font-mono text-zinc-500">{out.recordedDate}</p>
                </div>
              ))}
            </div>

            {/* Add Milestone Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (outcomeTitle.trim()) {
                  onAddVoluntaryOutcome(outcomeCategory, outcomeTitle.trim());
                  setOutcomeTitle("");
                }
              }}
              className="rounded-xl border border-dashed border-zinc-300 p-3.5 space-y-2.5"
            >
              <p className="text-xs font-semibold text-zinc-800 flex items-center gap-1">
                <Plus className="h-3.5 w-3.5 text-[#5145cd]" />
                Record Voluntary Milestone
              </p>
              <select
                value={outcomeCategory}
                onChange={(e) => setOutcomeCategory(e.target.value)}
                aria-label="Milestone category"
                className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs"
              >
                <option value="Resume Ready">Resume Ready</option>
                <option value="Application Sent">Application Sent</option>
                <option value="Interview Shortlist">Interview Shortlist</option>
                <option value="Offer Received">Offer Received</option>
              </select>
              <input
                type="text"
                value={outcomeTitle}
                onChange={(e) => setOutcomeTitle(e.target.value)}
                placeholder="e.g., Passed technical phone screen..."
                aria-label="Milestone summary"
                className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
              >
                Save Self-Reported Milestone
              </button>
            </form>

            <p className="text-[11px] text-zinc-500 flex items-start gap-1.5">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              DreamX never publishes unverified or small-sample outcome percentages as guaranteed
              results.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
