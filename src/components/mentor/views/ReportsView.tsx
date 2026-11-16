"use client";

import * as React from "react";
import {
  FileCheck,
  Clock,
  Printer,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  History,
  Send,
  Save,
  BookOpen,
} from "lucide-react";
import { SessionReport, getServiceById, ActionPlanItem } from "../types";
import { StatusBadge } from "../StatusBadge";
import { MentorModal } from "../MentorModal";

interface ReportsViewProps {
  reports: SessionReport[];
  mentorName: string;
  initialReportId?: string;
  onOpenBookingInConsole: (bookingId: string) => void;
  onNavigate: (route: string) => void;
}

export function ReportsView({
  reports,
  mentorName,
  initialReportId,
  onOpenBookingInConsole,
}: ReportsViewProps) {
  const [activeReportId, setActiveReportId] = React.useState<string>(
    initialReportId || reports[0]?.id || ""
  );
  const [activeFilter, setActiveFilter] = React.useState<"all" | "pending" | "delivered" | "revision">("all");
  const [fullReaderReport, setFullReaderReport] = React.useState<SessionReport | null>(null);

  const filteredReports = reports.filter((r) => {
    if (activeFilter === "pending" && r.status !== "Report pending" && r.status !== "Report delayed") {
      return false;
    }
    if (activeFilter === "delivered" && r.status !== "Report delivered") return false;
    if (activeFilter === "revision" && r.status !== "Revision requested") return false;
    return true;
  });

  const selectedReport = reports.find((r) => r.id === activeReportId) || filteredReports[0];

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#5145cd] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                PRD §11.1–§11.3
              </span>
              <span className="text-xs text-zinc-500 font-semibold font-mono">
                11-Section Service-Specific Reports
              </span>
            </div>
            <h1 className="mt-1 text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              Session Deliverables &amp; 48-Hour Report SLA
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
              Every completed session must deliver a structured 11-section rubric report within 48 hours. Report submission unlocks escrow settlement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: `All Reports (${reports.length})` },
              { id: "pending", label: "Awaiting Report" },
              { id: "revision", label: "Revision Requested" },
              { id: "delivered", label: "Delivered" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id as typeof activeFilter)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeFilter === f.id
                    ? "bg-[#5145cd] text-white shadow-2xs"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200/80"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredReports.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500 bg-white rounded-2xl border border-zinc-200">
              No reports in this queue.
            </div>
          ) : (
            filteredReports.map((r) => {
              const service = getServiceById(r.serviceId);
              const isSelected = selectedReport?.id === r.id;

              return (
                <div
                  key={r.id}
                  onClick={() => setActiveReportId(r.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? "bg-white border-[#5145cd] shadow-md ring-2 ring-[#5145cd]/20"
                      : "bg-white/94 border-zinc-200/80 hover:bg-white hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {r.id}
                    </span>
                    <StatusBadge
                      label={r.status}
                      tone={
                        r.status === "Report delivered"
                          ? "success"
                          : r.status === "Revision requested"
                          ? "warning"
                          : "info"
                      }
                      size="sm"
                    />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-zinc-900">{service.name}</h3>
                    <p className="text-xs text-zinc-600 font-medium">{r.studentName}</p>
                    <p className="text-[11px] font-mono text-zinc-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{r.slaRemainingLabel}</span>
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Preview Drawer (7 cols) */}
        {selectedReport && (
          <div className="lg:col-span-7 rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-700">
                  {selectedReport.id} · Booking Ref: {selectedReport.bookingRef}
                </span>
                <h2 className="text-lg font-bold text-zinc-900 mt-0.5">
                  {getServiceById(selectedReport.serviceId).name}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFullReaderReport(selectedReport)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-zinc-300 hover:bg-zinc-50 text-xs font-bold text-zinc-800 transition-all flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Full 11-Section View</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  title="Print / PDF"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Revision Notice Banner */}
            {selectedReport.revisionRequestReason && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  Operations Revision Clarification:
                </span>
                <p className="leading-relaxed">{selectedReport.revisionRequestReason}</p>
              </div>
            )}

            {/* Executive Summary */}
            <div className="space-y-1 text-xs">
              <span className="font-bold text-zinc-900">Executive Summary:</span>
              <p className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-zinc-700 leading-relaxed">
                {selectedReport.summary}
              </p>
            </div>

            {/* Rubric Dimension Observations */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-zinc-900">Rubric Calibration Scores:</span>
              <div className="space-y-2">
                {selectedReport.rubricScores.map((score) => (
                  <div
                    key={score.criterionId}
                    className="p-3 rounded-xl bg-white border border-zinc-200 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-900">{score.label}</span>
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-indigo-50 text-[#5145cd] border border-indigo-200">
                        {score.rating} / 4
                      </span>
                    </div>
                    <p className="text-zinc-600 text-[11px] leading-relaxed">{score.observation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Improvement Areas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1.5">
                <span className="font-bold text-emerald-950 block">Demonstrated Strengths:</span>
                <ul className="space-y-1 text-emerald-900 list-disc pl-4 text-[11px]">
                  {selectedReport.strengths.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-1.5">
                <span className="font-bold text-amber-950 block">Priority Growth Areas:</span>
                <ul className="space-y-1 text-amber-900 list-disc pl-4 text-[11px]">
                  {selectedReport.improvementAreas.map((imp, idx) => (
                    <li key={idx}>{imp}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Plan */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-zinc-900">Prioritized Student Action Plan:</span>
              <div className="space-y-1.5">
                {selectedReport.actionPlan.map((ap) => (
                  <div
                    key={ap.id}
                    className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between gap-3 text-[11px]"
                  >
                    <span className="text-zinc-800">{ap.action}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded bg-white border border-zinc-300 font-semibold text-zinc-700">
                        {ap.timeframe}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          ap.priority === "High"
                            ? "bg-rose-100 text-rose-900"
                            : "bg-zinc-200 text-zinc-700"
                        }`}
                      >
                        {ap.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Version Audit Trail */}
            <div className="pt-3 border-t border-zinc-100 text-xs flex items-center justify-between text-zinc-500">
              <span className="flex items-center gap-1">
                <History className="w-3.5 h-3.5" />
                <span>
                  Version Trail: {selectedReport.versions.length > 0 ? selectedReport.versions.map((v) => v.version).join(", ") : "v1.0 (Drafting)"}
                </span>
              </span>
              <button
                type="button"
                onClick={() => onOpenBookingInConsole(selectedReport.bookingId)}
                className="text-[#5145cd] font-semibold hover:underline"
              >
                Open Session in Console →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 11-Section Web View Reader Modal */}
      <MentorModal
        open={!!fullReaderReport}
        onClose={() => setFullReaderReport(null)}
        title={fullReaderReport ? `Official Report: ${fullReaderReport.id} — ${getServiceById(fullReaderReport.serviceId).name}` : ""}
        subtitle={fullReaderReport ? `Candidate: ${fullReaderReport.studentName} · Mentor: ${mentorName} · Deliverable SLA Compliant` : ""}
        maxWidthClass="max-w-3xl"
        footer={
          <button
            type="button"
            onClick={() => setFullReaderReport(null)}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
          >
            Close Reader
          </button>
        }
      >
        {fullReaderReport && (
          <div className="space-y-6 text-xs sm:text-sm text-zinc-800">
            {/* Section 1 & 2 */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-zinc-200">
              <div>
                <span className="text-[11px] font-bold uppercase text-zinc-400 block">1. Target Candidate</span>
                <p className="font-bold text-zinc-900 mt-0.5">{fullReaderReport.studentName}</p>
                <p className="text-zinc-600 text-xs">{fullReaderReport.targetRole} ({fullReaderReport.studentSegment})</p>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase text-zinc-400 block">2. Accredited Mentor</span>
                <p className="font-bold text-zinc-900 mt-0.5">{mentorName}</p>
                <p className="text-zinc-600 text-xs">DreamX Senior Verified Practitioner</p>
              </div>
            </div>

            {/* Section 3 & 4 */}
            <div>
              <span className="text-[11px] font-bold uppercase text-zinc-400 block">3. Assessment Purpose</span>
              <p className="mt-1 leading-relaxed text-zinc-700">{fullReaderReport.assessmentPurpose}</p>
            </div>

            {/* Section 5 */}
            <div>
              <span className="text-[11px] font-bold uppercase text-zinc-400 block">4. Executive Summary</span>
              <p className="mt-1 leading-relaxed text-zinc-700">{fullReaderReport.summary}</p>
            </div>

            {/* Section 6 */}
            <div>
              <span className="text-[11px] font-bold uppercase text-zinc-400 block">5. Rubric Evaluation Scores</span>
              <div className="mt-2 space-y-2">
                {fullReaderReport.rubricScores.map((s) => (
                  <div key={s.criterionId} className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                      <span>{s.label}</span>
                      <span className="font-mono text-[#5145cd]">{s.rating} / 4</span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-1">{s.observation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 7 & 8 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="font-bold text-emerald-950 text-xs block">6. Key Strengths</span>
                <ul className="mt-2 space-y-1 text-xs text-emerald-900 list-disc pl-4">
                  {fullReaderReport.strengths.map((str, i) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <span className="font-bold text-amber-950 text-xs block">7. Priority Improvements</span>
                <ul className="mt-2 space-y-1 text-xs text-amber-900 list-disc pl-4">
                  {fullReaderReport.improvementAreas.map((imp, i) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Section 9 */}
            <div>
              <span className="text-[11px] font-bold uppercase text-zinc-400 block">8. Prioritized Action Plan</span>
              <div className="mt-2 space-y-2">
                {fullReaderReport.actionPlan.map((ap) => (
                  <div key={ap.id} className="p-2.5 rounded-lg border border-zinc-200 flex items-center justify-between text-xs">
                    <span>{ap.action}</span>
                    <span className="font-bold text-[#5145cd]">{ap.timeframe}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 10 */}
            <div>
              <span className="text-[11px] font-bold uppercase text-zinc-400 block">9. Suggested Follow-Up Service</span>
              <div className="mt-2 p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950">
                {fullReaderReport.suggestedNextSteps.map((s, idx) => (
                  <div key={idx}>
                    <strong>Recommended: {getServiceById(s.recommendedServiceId).name}</strong>
                    <p className="mt-0.5 text-indigo-900">{s.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 11 */}
            <div className="p-3.5 rounded-xl bg-zinc-100 border border-zinc-200 text-[11px] text-zinc-500 leading-relaxed">
              <strong className="block text-zinc-700 mb-0.5">10. Assessment Limitations &amp; Disclaimers:</strong>
              {fullReaderReport.assessmentLimitations}
            </div>
          </div>
        )}
      </MentorModal>
    </div>
  );
}
