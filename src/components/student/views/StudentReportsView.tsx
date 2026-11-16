"use client";

import * as React from "react";
import {
  FileSpreadsheet,
  Printer,
  Lock,
  Clock,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { StudentModal } from "../ui/StudentModal";
import { StudentStatusBadge } from "../ui/StudentStatusBadge";
import { StudentReport, StudentBooking, getServiceById } from "../types";

export interface StudentReportsViewProps {
  reports: StudentReport[];
  bookings: StudentBooking[];
  initialReportId?: string;
  onStartBooking: (serviceId: string) => void;
}

export function StudentReportsView({
  reports,
  bookings,
  initialReportId,
  onStartBooking,
}: StudentReportsViewProps) {
  const [selectedReport, setSelectedReport] = React.useState<StudentReport | null>(null);

  React.useEffect(() => {
    if (initialReportId) {
      const found = reports.find((r) => r.id === initialReportId);
      if (found) setSelectedReport(found);
    }
  }, [initialReportId, reports]);

  const pendingDeliverables = bookings.filter(
    (b) =>
      b.status !== "Cancelled" &&
      (b.reportStatus === "Awaiting session" ||
        b.reportStatus === "Report pending (48h SLA)" ||
        b.reportStatus === "Report delayed")
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">
            My Reports & Action Plans
          </h1>
          <p className="mt-1 text-sm text-zinc-600 max-w-3xl">
            Every completed DreamX 1:1 session delivers a structured, service-specific report and
            action plan targeted within <strong>48 hours</strong>. Reports are stored privately and
            retrieved via authorized access only.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-600 shrink-0">
          <Lock className="h-4 w-4 text-[#5145cd]" />
          <span>Short-Lived Authorized Access</span>
        </div>
      </div>

      {/* Delivered Reports List */}
      <section className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3.5">
          <h2 className="text-base font-semibold text-zinc-900">
            Delivered Mentor Reports ({reports.length})
          </h2>
          <span className="text-xs text-zinc-500">Accessible Web View + Print/PDF</span>
        </div>

        {reports.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500">
            No delivered reports yet. Completed session reports appear here within 48 hours.
          </div>
        ) : (
          <div className="space-y-3.5">
            {reports.map((rpt) => {
              const svc = getServiceById(rpt.serviceId);
              const author =
                rpt.versions[rpt.versions.length - 1]?.authorName ?? "Verified Mentor";
              return (
                <article
                  key={rpt.id}
                  className="rounded-xl border border-zinc-200/90 bg-zinc-50/60 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-zinc-500">
                        {rpt.id} · {rpt.bookingRef}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#5145cd] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {svc.id}
                      </span>
                      <StudentStatusBadge label="Report delivered" tone="success" />
                    </div>
                    <h3 className="text-base font-bold text-zinc-900">{svc.deliverableName}</h3>
                    <p className="text-xs text-zinc-600 line-clamp-2">{rpt.summary}</p>
                    <p className="text-xs text-zinc-500">
                      Mentor: <strong className="text-zinc-800">{author}</strong> · Session:{" "}
                      {rpt.sessionDate} · {rpt.slaRemainingLabel}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(rpt)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#5145cd] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4035b3]"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5" />
                      Open Full Report
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Pending Deliverables Section */}
      <section className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-zinc-200/80 pb-3">
          <h2 className="text-base font-semibold text-zinc-900">
            Awaiting Session / Pending Deliverables ({pendingDeliverables.length})
          </h2>
          <p className="text-xs text-zinc-500">
            Target delivery is within 48 hours after your session concludes. Delayed reports
            automatically escalate to Operations.
          </p>
        </div>

        {pendingDeliverables.length === 0 ? (
          <p className="text-xs text-zinc-500 py-3">No pending reports waiting right now.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {pendingDeliverables.map((b) => {
              const svc = getServiceById(b.serviceId);
              return (
                <div
                  key={b.id}
                  className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3.5 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-semibold text-zinc-600">{b.bookingRef}</span>
                    <StudentStatusBadge label={b.reportStatus} tone="info" />
                  </div>
                  <p className="font-bold text-zinc-900">
                    {svc.id} · {svc.deliverableName}
                  </p>
                  <p className="text-zinc-600 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-zinc-400" />
                    {b.dateLabel} · {b.timeLabel}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Full 11-Section Report Modal */}
      <StudentModal
        open={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        maxWidthClass="max-w-3xl"
        title={
          selectedReport
            ? `${getServiceById(selectedReport.serviceId).deliverableName} (${selectedReport.id})`
            : "Report"
        }
        subtitle="Authorized Student Web View · Private Storage Protected (frontend.md 16.2 & 16.4)"
        footer={
          <>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              <Printer className="h-3.5 w-3.5" />
              Print / Save PDF
            </button>
            <button
              type="button"
              onClick={() => setSelectedReport(null)}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white"
            >
              Close Report
            </button>
          </>
        }
      >
        {selectedReport && (
          <div className="space-y-5 text-xs sm:text-sm">
            {/* Header Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs">
              <div>
                <span className="text-zinc-500 block">1. Student & Context</span>
                <strong className="text-zinc-900 block mt-0.5">{selectedReport.studentName}</strong>
                <span className="text-zinc-600">{selectedReport.targetRole}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">2. Service & Session Date</span>
                <strong className="text-zinc-900 block mt-0.5">
                  {selectedReport.serviceId} · {getServiceById(selectedReport.serviceId).name}
                </strong>
                <span className="text-zinc-600">{selectedReport.sessionDate}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">3. Verified Mentor</span>
                <strong className="text-zinc-900 block mt-0.5">
                  {selectedReport.versions[0]?.authorName ?? "Approved Mentor"}
                </strong>
                <span className="text-zinc-600">{selectedReport.bookingRef}</span>
              </div>
            </div>

            {/* Assessment Purpose */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                4. Assessment Purpose
              </h3>
              <p className="text-zinc-700 mt-1">{selectedReport.assessmentPurpose}</p>
            </div>

            {/* Summary */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                5. Summary
              </h3>
              <p className="mt-1 text-zinc-800 leading-relaxed rounded-xl border border-indigo-100 bg-indigo-50/45 p-3.5">
                {selectedReport.summary}
              </p>
            </div>

            {/* Rubric Observations */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                6. Dimension-Level & Service Rubric Observations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedReport.rubricScores.map((rubric) => (
                  <div
                    key={rubric.criterionId}
                    className="rounded-xl border border-zinc-200 bg-white p-3 text-xs"
                  >
                    <div className="flex justify-between font-semibold text-zinc-900">
                      <span>{rubric.label}</span>
                      <span className="font-mono text-[#5145cd]">{rubric.rating}/5</span>
                    </div>
                    <p className="text-zinc-600 mt-1">{rubric.observation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Improvement Areas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/55 p-3.5 text-xs">
                <h3 className="font-bold uppercase tracking-wider text-emerald-900">
                  7. Strengths
                </h3>
                <ul className="mt-1.5 space-y-1 text-emerald-950 list-disc pl-4">
                  {selectedReport.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50/55 p-3.5 text-xs">
                <h3 className="font-bold uppercase tracking-wider text-amber-900">
                  8. Improvement Areas
                </h3>
                <ul className="mt-1.5 space-y-1 text-amber-950 list-disc pl-4">
                  {selectedReport.improvementAreas.map((a, idx) => (
                    <li key={idx}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Plan */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                9. Action Plan
              </h3>
              {selectedReport.actionPlan.map((act, idx) => (
                <div
                  key={act.id}
                  className="rounded-xl border border-zinc-200 bg-white p-3 flex items-center justify-between gap-3 text-xs"
                >
                  <span className="flex items-start gap-2 text-zinc-800">
                    <CheckCircle2 className="h-4 w-4 text-[#5145cd] shrink-0 mt-0.5" />
                    <span>
                      <strong>Step {idx + 1}:</strong> {act.action}
                    </span>
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500 shrink-0">
                    {act.priority} · {act.timeframe}
                  </span>
                </div>
              ))}
            </div>

            {/* Suggested Next Steps */}
            {selectedReport.suggestedNextSteps.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  10. Suggested Next Steps
                </h3>
                {selectedReport.suggestedNextSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-indigo-200 bg-indigo-50/55 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      {step.recommendedServiceId && (
                        <p className="font-bold text-indigo-950">
                          {step.recommendedServiceId} —{" "}
                          {getServiceById(step.recommendedServiceId).name}
                        </p>
                      )}
                      <p className="text-zinc-700 mt-0.5">{step.reason}</p>
                    </div>
                    {step.recommendedServiceId && (
                      <button
                        type="button"
                        onClick={() => {
                          const sid = step.recommendedServiceId!;
                          setSelectedReport(null);
                          onStartBooking(sid);
                        }}
                        className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-[#5145cd] px-3 py-1.5 font-semibold text-white hover:bg-[#4035b3]"
                      >
                        Book {step.recommendedServiceId}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Assessment Limitations & Versions Audit Trail */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 text-xs text-zinc-600 space-y-1.5">
              <p>
                <strong className="text-zinc-800">11. Assessment Limitations:</strong>{" "}
                {selectedReport.assessmentLimitations}
              </p>
              {selectedReport.versions.map((ver) => (
                <p
                  key={ver.version}
                  className="font-mono text-[11px] text-zinc-500 flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  {ver.version} · {ver.createdAt} · {ver.authorName} ({ver.changeNote})
                </p>
              ))}
            </div>
          </div>
        )}
      </StudentModal>
    </div>
  );
}
