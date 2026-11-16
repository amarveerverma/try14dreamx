"use client";

import * as React from "react";
import {
  Calendar,
  Clock,
  Lock,
  Video,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  MessageSquareWarning,
} from "lucide-react";
import { StudentModal } from "../ui/StudentModal";
import { StudentStatusBadge } from "../ui/StudentStatusBadge";
import { StudentBooking, getServiceById, formatPaise } from "../types";

export interface StudentBookingsViewProps {
  bookings: StudentBooking[];
  initialSelectedId?: string;
  onChooseFallbackSlot: (bookingId: string) => void;
  onChooseFallbackRefund: (bookingId: string) => void;
  onStudentCancelBooking: (bookingId: string) => void;
  onSubmitPostSessionIssue: (bookingId: string, issueText: string) => void;
  onJoinSessionToast: (bookingRef: string) => void;
  onNavigate: (tab: string, recordId?: string) => void;
}

export function StudentBookingsView({
  bookings,
  initialSelectedId,
  onChooseFallbackSlot,
  onChooseFallbackRefund,
  onStudentCancelBooking,
  onSubmitPostSessionIssue,
  onJoinSessionToast,
  onNavigate,
}: StudentBookingsViewProps) {
  const [activeFilter, setActiveFilter] = React.useState<string>("all");
  const [selectedBookingId, setSelectedBookingId] = React.useState<string | null>(
    initialSelectedId ?? "SBK-102"
  );
  const [cancelModalBooking, setCancelModalBooking] = React.useState<StudentBooking | null>(null);
  const [issueModalBooking, setIssueModalBooking] = React.useState<StudentBooking | null>(null);
  const [issueDescription, setIssueDescription] = React.useState<string>("");
  const [issueError, setIssueError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (initialSelectedId) {
      setActiveFilter("all");
      setSelectedBookingId(initialSelectedId);
    }
  }, [initialSelectedId]);

  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === "upcoming" && !["Upcoming", "Ready to Join"].includes(b.status))
      return false;
    if (
      activeFilter === "attention" &&
      !["Needs Decision", "Smart Match In Progress"].includes(b.status)
    )
      return false;
    if (activeFilter === "completed" && b.status !== "Completed") return false;
    if (activeFilter === "cancelled" && b.status !== "Cancelled") return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Tabs */}
      <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">
            My Bookings & Smart Match Requests
          </h1>
          <p className="mt-1 text-sm text-zinc-600 max-w-3xl">
            Track confirmed sessions, live Smart Match waves, server-authorized meeting links,
            cancellation rules, and 48-hour structured deliverables.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5" role="tablist">
          {[
            { id: "all", label: `All (${bookings.length})` },
            {
              id: "upcoming",
              label: `Upcoming / Ready (${
                bookings.filter((b) => ["Upcoming", "Ready to Join"].includes(b.status)).length
              })`,
            },
            {
              id: "attention",
              label: `Needs Attention / Matching (${
                bookings.filter((b) =>
                  ["Needs Decision", "Smart Match In Progress"].includes(b.status)
                ).length
              })`,
            },
            {
              id: "completed",
              label: `Completed (${bookings.filter((b) => b.status === "Completed").length})`,
            },
            {
              id: "cancelled",
              label: `Cancelled (${bookings.filter((b) => b.status === "Cancelled").length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeFilter === tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeFilter === tab.id
                  ? "bg-[#5145cd] text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-white/80 bg-white/94 p-10 text-center space-y-2">
          <Calendar className="h-7 w-7 text-zinc-400 mx-auto" />
          <p className="text-sm font-semibold text-zinc-800">No bookings in this tab</p>
          <button
            type="button"
            onClick={() => onNavigate("discover")}
            className="rounded-lg bg-[#5145cd] px-4 py-2 text-xs font-semibold text-white"
          >
            Discover Career Services
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const service = getServiceById(b.serviceId);
            const isExpanded = selectedBookingId === b.id;
            return (
              <article
                key={b.id}
                className={`rounded-2xl border bg-white/94 backdrop-blur-md p-5 shadow-xs transition-all ${
                  b.status === "Needs Decision"
                    ? "border-amber-300 ring-2 ring-amber-200/50"
                    : isExpanded
                    ? "border-[#5145cd]"
                    : "border-white/80"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-zinc-500">
                        {b.bookingRef}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#5145cd] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {service.id}
                      </span>
                      <h2 className="text-base font-bold text-zinc-900">{service.name}</h2>
                      <StudentStatusBadge
                        label={b.status}
                        tone={
                          b.status === "Ready to Join" || b.status === "Completed"
                            ? "success"
                            : b.status === "Needs Decision"
                            ? "warning"
                            : b.status === "Cancelled"
                            ? "danger"
                            : "info"
                        }
                      />
                      <span className="text-xs text-zinc-500">· {b.mode}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-700">
                      Mentor: <strong className="text-zinc-900">{b.mentorName}</strong>
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-zinc-400" />
                        {b.dateLabel} · {b.timeLabel} ({b.durationMinutes} min)
                      </span>
                      <span className="font-mono tabular-nums">
                        Paid:{" "}
                        <strong className="text-zinc-800">{formatPaise(b.finalPaidPaise)}</strong> (
                        {b.paymentStatus})
                      </span>
                      <span>
                        Deliverable: <strong className="text-zinc-800">{b.reportStatus}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedBookingId(isExpanded ? null : b.id)}
                      className="rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
                    >
                      {isExpanded ? "Hide Details" : "Booking Details"}
                    </button>
                    {b.joinPermittedByServer && (
                      <button
                        type="button"
                        onClick={() => onJoinSessionToast(b.bookingRef)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                      >
                        <Video className="h-3.5 w-3.5" />
                        Join Session
                      </button>
                    )}
                    {b.reportId && b.reportStatus === "Report delivered" && (
                      <button
                        type="button"
                        onClick={() => onNavigate("reports", b.reportId)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#5145cd] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#4035b3]"
                      >
                        <FileCheck className="h-3.5 w-3.5" />
                        View Report
                      </button>
                    )}
                  </div>
                </div>

                {/* 2-Hour Timeout Decision Box */}
                {b.status === "Needs Decision" && b.fallbackAlternativeSlot && (
                  <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50/85 p-4 space-y-3">
                    <div className="flex items-start gap-2.5 text-xs text-amber-950">
                      <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">
                          2-Hour Smart Match Timeout Reached — Explicit Student Choice Required
                        </p>
                        <p className="mt-0.5">
                          Wave 1 and Wave 2 (after 30m) completed without an approved mentor
                          available for your requested window. DreamX never automatically
                          reschedules you—please choose one option below:
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="rounded-xl border border-indigo-200 bg-white p-3.5 flex flex-col justify-between space-y-2.5">
                        <div className="text-xs space-y-0.5">
                          <span className="font-bold text-[#4035b3] block">
                            Option A — Accept Open Alternative Slot
                          </span>
                          <p className="font-semibold text-zinc-900">
                            {b.fallbackAlternativeSlot.mentorName}
                          </p>
                          <p className="text-zinc-600">
                            {b.fallbackAlternativeSlot.dateLabel} ·{" "}
                            {b.fallbackAlternativeSlot.timeLabel}
                          </p>
                          <p className="text-[11px] text-emerald-700">
                            {b.fallbackAlternativeSlot.mentorVerificationLabel}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onChooseFallbackSlot(b.id)}
                          className="w-full rounded-lg bg-[#5145cd] px-3 py-2 text-xs font-semibold text-white hover:bg-[#4035b3]"
                        >
                          Confirm This Open Slot
                        </button>
                      </div>

                      <div className="rounded-xl border border-zinc-200 bg-white p-3.5 flex flex-col justify-between space-y-2.5">
                        <div className="text-xs space-y-0.5">
                          <span className="font-bold text-zinc-900 block">
                            Option B — Request 100% Full Refund
                          </span>
                          <p className="text-zinc-600">
                            Cancel this unmatched request and initiate a full refund of{" "}
                            <strong className="font-mono tabular-nums">
                              {formatPaise(b.finalPaidPaise)}
                            </strong>{" "}
                            to your original payment method.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onChooseFallbackRefund(b.id)}
                          className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-100"
                        >
                          Request 100% Full Refund
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-zinc-200/80 grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
                    <div className="lg:col-span-7 space-y-3">
                      <div className="rounded-xl border border-zinc-200 bg-zinc-50/75 p-3.5 space-y-1.5">
                        <p className="font-semibold text-zinc-900">Booking Timeline</p>
                        <ol className="space-y-1.5 border-l-2 border-indigo-200 pl-3">
                          {b.timeline.map((entry, idx) => (
                            <li key={idx}>
                              <p className="font-medium text-zinc-800">{entry.label}</p>
                              <p className="font-mono text-[11px] text-zinc-500">
                                {entry.timestamp}
                              </p>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className="rounded-xl border border-zinc-200 bg-white p-3.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-[#5145cd]" />
                          <span>
                            {b.joinPermittedByServer
                              ? "Server confirmed your meeting entry authorization."
                              : "Join Session button unlocks only when authorized by the backend."}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5 space-y-3">
                      <div className="rounded-xl border border-zinc-200 bg-zinc-50/75 p-3.5 space-y-1">
                        <p className="font-semibold text-zinc-900">Payment Breakdown</p>
                        <div className="flex justify-between text-zinc-600">
                          <span>Listed Price</span>
                          <span className="font-mono tabular-nums">
                            {formatPaise(b.listedPricePaise)}
                          </span>
                        </div>
                        <div className="flex justify-between text-emerald-700">
                          <span>Discount ({b.appliedDiscountLabel})</span>
                          <span className="font-mono tabular-nums">
                            -{formatPaise(b.discountPaise)}
                          </span>
                        </div>
                        <div className="flex justify-between font-bold text-zinc-900 pt-1 border-t border-zinc-200">
                          <span>Total Paid</span>
                          <span className="font-mono tabular-nums">
                            {formatPaise(b.finalPaidPaise)}
                          </span>
                        </div>
                      </div>

                      {["Upcoming", "Ready to Join", "Smart Match In Progress"].includes(
                        b.status
                      ) && (
                        <button
                          type="button"
                          onClick={() => setCancelModalBooking(b)}
                          className="w-full rounded-xl border border-rose-200 bg-rose-50/60 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                        >
                          Cancel Booking / View Refund Rule
                        </button>
                      )}

                      {b.status === "Completed" && !b.complaintSubmitted && (
                        <button
                          type="button"
                          onClick={() => {
                            setIssueModalBooking(b);
                            setIssueDescription("");
                            setIssueError(null);
                          }}
                          className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                        >
                          <MessageSquareWarning className="h-3.5 w-3.5 text-amber-600" />
                          Report Post-Session Issue (48h Window)
                        </button>
                      )}

                      {b.complaintSubmitted && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-950">
                          <strong>Issue Submitted ({b.complaintSubmitted.submittedAt}):</strong>{" "}
                          {b.complaintSubmitted.status}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Cancellation Modal */}
      <StudentModal
        open={!!cancelModalBooking}
        onClose={() => setCancelModalBooking(null)}
        title={
          cancelModalBooking
            ? `Cancel Booking ${cancelModalBooking.bookingRef}`
            : "Cancel Booking"
        }
        subtitle="Review applicable DreamX cancellation terms before confirming."
        footer={
          cancelModalBooking && (
            <>
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700"
              >
                Keep Booking
              </button>
              {(cancelModalBooking.hoursUntilSession ?? 2) >= 1 && (
                <button
                  type="button"
                  onClick={() => {
                    onStudentCancelBooking(cancelModalBooking.id);
                    setCancelModalBooking(null);
                  }}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
                >
                  Confirm Cancellation (100% Refund)
                </button>
              )}
            </>
          )
        }
      >
        {cancelModalBooking &&
          ((cancelModalBooking.hoursUntilSession ?? 2) >= 1 ? (
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-950 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Eligible for 100% Full Refund (PRD 12.1):</strong> Because your session is
                  more than 1 hour away, cancelling initiates a 100% refund of{" "}
                  <strong>{formatPaise(cancelModalBooking.finalPaidPaise)}</strong>. Refund
                  initiation and bank settlement are tracked separately.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-950 flex items-start gap-2">
                <HelpCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Less Than 1 Hour Before Session (frontend.md 13.3 & PRD 12.2):</strong>{" "}
                  Automatic full-refund cancellation applies up to 1 hour before start. For urgent
                  emergencies within 1 hour of the session, please submit a documented exception
                  request to DreamX Support rather than assuming an automatic refund.
                </p>
              </div>
            </div>
          ))}
      </StudentModal>

      {/* Post-Session Issue Modal */}
      <StudentModal
        open={!!issueModalBooking}
        onClose={() => setIssueModalBooking(null)}
        title="Report Post-Session Quality Issue (Within 48h Window)"
        subtitle="Substantiated issues under the published policy receive an 80% refund (PRD 12.1)."
        footer={
          <>
            <button
              type="button"
              onClick={() => setIssueModalBooking(null)}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="student-issue-form"
              className="rounded-lg bg-[#5145cd] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4035b3]"
            >
              Submit Issue for Review
            </button>
          </>
        }
      >
        <form
          id="student-issue-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (issueModalBooking) {
              if (issueDescription.trim().length < 15) {
                setIssueError(
                  "Please describe the session issue (at least 15 characters) so Operations can review attendance and scope evidence."
                );
                return;
              }
              onSubmitPostSessionIssue(issueModalBooking.id, issueDescription.trim());
              setIssueModalBooking(null);
              setIssueDescription("");
              setIssueError(null);
            }
          }}
          className="space-y-3 text-xs"
        >
          <p className="text-zinc-600">
            Operations reviews attendance timestamps, approved service scope, and deliverable
            evidence. No session recording is stored by default.
          </p>
          <textarea
            rows={4}
            value={issueDescription}
            onChange={(e) => {
              setIssueDescription(e.target.value);
              if (issueError) setIssueError(null);
            }}
            placeholder="Describe what fell short of the stated service scope or technical disruption..."
            className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
          />
          {issueError && <p className="font-semibold text-rose-600">{issueError}</p>}
        </form>
      </StudentModal>
    </div>
  );
}
