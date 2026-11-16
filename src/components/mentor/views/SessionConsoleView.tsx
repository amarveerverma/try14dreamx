"use client";

import * as React from "react";
import {
  Video,
  CheckCircle2,
  Clock,
  Lock,
  User,
  FileText,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Send,
  Save,
} from "lucide-react";
import { MentorBooking, SessionReport, getServiceById } from "../types";
import { StatusBadge } from "../StatusBadge";

interface SessionConsoleViewProps {
  bookings: MentorBooking[];
  reports: SessionReport[];
  selectedBookingId?: string;
  mentorName: string;
  onSelectBooking: (bookingId: string) => void;
  onRecordMentorJoin: (bookingId: string) => void;
  onMarkSessionCompleted: (bookingId: string) => void;
  onSaveOrSubmitReport: (bookingId: string, reportPayload: Partial<SessionReport>, isFinal: boolean) => void;
}

export function SessionConsoleView({
  bookings,
  reports,
  selectedBookingId,
  mentorName,
  onSelectBooking,
  onRecordMentorJoin,
  onMarkSessionCompleted,
  onSaveOrSubmitReport,
}: SessionConsoleViewProps) {
  const activeBookings = bookings.filter((b) => b.status !== "Cancelled");
  const currentBooking =
    activeBookings.find((b) => b.id === selectedBookingId) || activeBookings[0];

  const service = currentBooking ? getServiceById(currentBooking.serviceId) : null;
  const currentReport = reports.find((r) => r.bookingId === currentBooking?.id);

  // Quick draft states in console
  const [draftSummary, setDraftSummary] = React.useState(currentReport?.summary || "");

  if (!currentBooking || !service) {
    return (
      <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-12 text-center text-xs text-zinc-500 shadow-xs">
        No active or completed sessions to inspect in the delivery console.
      </div>
    );
  }

  const isCompleted = currentBooking.status === "Completed";
  const mentorJoined = !!currentBooking.attendance.mentorJoinedAt;
  const studentJoined = !!currentBooking.attendance.studentJoinedAt;

  return (
    <div className="space-y-6">
      {/* 1. Header with Session Switcher */}
      <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {currentBooking.bookingRef}
              </span>
              <span className="text-xs text-zinc-500 font-semibold font-mono">
                SESSION CONSOLE · PRD §12.3
              </span>
            </div>
            <h1 className="mt-1 text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              {service.name} · {currentBooking.studentName}
            </h1>
            <p className="mt-0.5 text-xs text-zinc-500">
              Scheduled window: {currentBooking.scheduledDate} · {currentBooking.scheduledTime} (Asia/Kolkata)
            </p>
          </div>

          {/* Session Switcher Selector */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-bold text-zinc-600 hidden sm:inline">Switch Session:</span>
            <select
              value={currentBooking.id}
              onChange={(e) => onSelectBooking(e.target.value)}
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-[#5145cd]"
            >
              {activeBookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.bookingRef} — {b.studentName} ({b.scheduledDate})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Room Control Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Live Room Controls & Attendance */}
        <div className="lg:col-span-7 space-y-5">
          <section className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#5145cd]">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-zinc-900">Encrypted Delivery Room</h2>
                  <p className="text-[11px] text-zinc-500">Strictly no meeting recordings stored by default (PRD §12.3)</p>
                </div>
              </div>
              <StatusBadge
                label={isCompleted ? "Concluded" : currentBooking.status}
                tone={isCompleted ? "neutral" : "success"}
                size="sm"
              />
            </div>

            {/* Attendance Status Boxes */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                <span className="text-zinc-500 font-medium block">Student Waiting Room:</span>
                <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      studentJoined ? "bg-emerald-500 animate-pulse" : "bg-zinc-300"
                    }`}
                  />
                  <span>
                    {studentJoined ? `Joined (${currentBooking.attendance.studentJoinedAt})` : "Waiting to connect"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                <span className="text-zinc-500 font-medium block">Mentor Attendance:</span>
                <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      mentorJoined ? "bg-emerald-500" : "bg-zinc-300"
                    }`}
                  />
                  <span>
                    {mentorJoined ? `Checked In (${currentBooking.attendance.mentorJoinedAt})` : "Not checked in"}
                  </span>
                </div>
              </div>
            </div>

            {/* Room Launch Actions */}
            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950">Server Room Authorization:</span>
                <span className="text-[11px] font-mono text-[#5145cd] font-semibold">
                  {currentBooking.meetingProviderLabel}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {!mentorJoined && !isCompleted && (
                  <button
                    type="button"
                    onClick={() => onRecordMentorJoin(currentBooking.id)}
                    className="px-4 py-2 rounded-xl bg-[#5145cd] hover:bg-[#4035b3] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Server Meeting Room</span>
                  </button>
                )}

                {mentorJoined && !isCompleted && (
                  <button
                    type="button"
                    onClick={() => onMarkSessionCompleted(currentBooking.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Completed &amp; Start 48h SLA</span>
                  </button>
                )}

                {isCompleted && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Session Concluded · 48h SLA Report Active</span>
                  </span>
                )}
              </div>
            </div>

            {/* Candidate Uploaded Private Artifacts */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-900 block">Candidate Uploaded Artifacts:</span>
              {currentBooking.authorizedDocuments.length === 0 ? (
                <p className="text-xs text-zinc-400 italic">No artifacts uploaded.</p>
              ) : (
                <div className="space-y-2">
                  {currentBooking.authorizedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-xl border border-zinc-200 bg-white flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[#5145cd] shrink-0" />
                        <div>
                          <p className="font-semibold text-zinc-900">{doc.title}</p>
                          <p className="text-[11px] text-zinc-500">{doc.summaryPreview}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => alert(`Opening secure private document: ${doc.title}`)}
                        className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-semibold text-[11px] shrink-0 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3 text-zinc-400" />
                        <span>Inspect Artifact</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right 5 cols: Readiness Context & Quick Report Note */}
        <div className="lg:col-span-5 space-y-5">
          {/* Readiness Context Snapshot */}
          <section className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-zinc-900">Pre-Session Candidate Readiness</h2>
            <p className="text-xs text-zinc-500">
              Coverage: {currentBooking.readinessContext.coverageLabel}
            </p>

            <div className="space-y-2">
              {currentBooking.readinessContext.dimensions.map((dim, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-zinc-800">{dim.dimension}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-zinc-500 text-[11px]">{dim.note}</span>
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                        dim.score === "N/A"
                          ? "bg-zinc-200 text-zinc-700"
                          : dim.score === null
                          ? "bg-amber-100 text-amber-900"
                          : "bg-indigo-100 text-[#4035b3]"
                      }`}
                    >
                      {dim.score === null ? "Unassessed" : dim.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Draft Notes */}
          <section className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-zinc-900">Post-Session Diagnostic Observations</h2>
            <p className="text-xs text-zinc-500">
              Jot live bullet points during session debrief; syncs automatically with the 48h SLA report.
            </p>

            <textarea
              rows={4}
              value={draftSummary}
              onChange={(e) => setDraftSummary(e.target.value)}
              placeholder="Candidate demonstrated strong algorithmic speed, missed space complexity recursion stack..."
              className="w-full rounded-xl border border-zinc-300 p-3 text-xs text-zinc-900 focus:outline-none focus:border-[#5145cd]"
            />

            <button
              type="button"
              onClick={() => {
                onSaveOrSubmitReport(currentBooking.id, { summary: draftSummary }, false);
              }}
              className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Observations Draft</span>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
