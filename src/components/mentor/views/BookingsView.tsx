"use client";

import * as React from "react";
import {
  Calendar,
  Clock,
  Search,
  User,
  FileText,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Video,
  XCircle,
} from "lucide-react";
import { MentorBooking, getServiceById, formatINR } from "../types";
import { StatusBadge } from "../StatusBadge";
import { MentorModal } from "../MentorModal";

interface BookingsViewProps {
  bookings: MentorBooking[];
  initialSelectedBookingId?: string;
  onNavigate: (route: string, recordId?: string) => void;
  onMentorCancelBooking: (bookingId: string, reason: string) => void;
}

export function BookingsView({
  bookings,
  initialSelectedBookingId,
  onNavigate,
  onMentorCancelBooking,
}: BookingsViewProps) {
  const [activeFilter, setActiveFilter] = React.useState<"all" | "upcoming" | "completed" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedBookingId, setSelectedBookingId] = React.useState<string>(
    initialSelectedBookingId || bookings[0]?.id || ""
  );

  // Cancellation modal state
  const [cancelModalOpen, setCancelModalOpen] = React.useState(false);
  const [cancelReason, setCancelReason] = React.useState("");
  const [cancelError, setCancelError] = React.useState<string | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === "upcoming" && b.status !== "Ready to Join" && b.status !== "Confirmed") {
      return false;
    }
    if (activeFilter === "completed" && b.status !== "Completed") return false;
    if (activeFilter === "cancelled" && b.status !== "Cancelled") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const service = getServiceById(b.serviceId);
      return (
        b.bookingRef.toLowerCase().includes(q) ||
        b.studentName.toLowerCase().includes(q) ||
        service.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedBooking = bookings.find((b) => b.id === selectedBookingId) || filteredBookings[0];

  return (
    <div className="space-y-6">
      {/* 1. Top Header */}
      <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              Mentor Committed Bookings
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
              Committed 1:1 sessions with student escrow protection. Server-authorized rooms unlock 10 minutes prior to scheduled start times.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: `All (${bookings.length})` },
              { id: "upcoming", label: "Upcoming / Active" },
              { id: "completed", label: "Completed" },
              { id: "cancelled", label: "Cancelled" },
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

        <div className="mt-4 relative max-w-md">
          <Search className="h-4 w-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ref, student, service..."
            className="w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 py-1.5 text-xs text-zinc-900 focus:border-[#5145cd] focus:outline-none"
          />
        </div>
      </div>

      {/* 2. Split Screen: List on Left, Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500 bg-white rounded-2xl border border-zinc-200">
              No bookings match this filter.
            </div>
          ) : (
            filteredBookings.map((b) => {
              const service = getServiceById(b.serviceId);
              const isSelected = selectedBooking?.id === b.id;

              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBookingId(b.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? "bg-white border-[#5145cd] shadow-md ring-2 ring-[#5145cd]/20"
                      : "bg-white/94 border-zinc-200/80 hover:bg-white hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {b.bookingRef}
                    </span>
                    <StatusBadge
                      label={b.status}
                      tone={
                        b.status === "Ready to Join"
                          ? "success"
                          : b.status === "Confirmed"
                          ? "info"
                          : b.status === "Completed"
                          ? "neutral"
                          : "danger"
                      }
                      size="sm"
                    />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-zinc-900">{service.name}</h3>
                    <p className="text-xs text-zinc-600 font-medium">{b.studentName}</p>
                    <p className="text-[11px] font-mono text-zinc-400 mt-1">
                      {b.scheduledDate} · {b.scheduledTime}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Detail Drawer (7 cols) */}
        {selectedBooking && (
          <div className="lg:col-span-7 rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-700">{selectedBooking.bookingRef}</span>
                  <span className="text-xs text-zinc-400">•</span>
                  <span className="text-xs font-semibold text-zinc-600">{selectedBooking.bookingMode} Booking</span>
                </div>
                <h2 className="text-lg font-bold text-zinc-900 mt-0.5">
                  {getServiceById(selectedBooking.serviceId).name}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {selectedBooking.status === "Ready to Join" || selectedBooking.status === "Confirmed" ? (
                  <button
                    type="button"
                    onClick={() => onNavigate("sessions", selectedBooking.id)}
                    className="px-4 py-2 rounded-xl bg-[#5145cd] hover:bg-[#4035b3] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Enter Console</span>
                  </button>
                ) : null}

                {selectedBooking.status === "Confirmed" && (
                  <button
                    type="button"
                    onClick={() => {
                      setCancelReason("");
                      setCancelError(null);
                      setCancelModalOpen(true);
                    }}
                    className="px-3 py-2 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>

            {/* Session Time & Student Profile Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                <span className="text-zinc-500 font-semibold block">Scheduled IST Window:</span>
                <p className="font-bold text-zinc-900 text-sm">
                  {selectedBooking.scheduledDate} · {selectedBooking.scheduledTime}
                </p>
                <p className="text-[11px] text-zinc-500 font-mono">
                  {selectedBooking.durationMinutes} Minutes (Rubric Debrief Included)
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                <span className="text-zinc-500 font-semibold block">Candidate Context:</span>
                <p className="font-bold text-zinc-900">{selectedBooking.studentName}</p>
                <p className="text-[11px] text-zinc-600">
                  {selectedBooking.targetRole} · {selectedBooking.targetDomain} ({selectedBooking.studentSegment})
                </p>
              </div>
            </div>

            {/* Student Goal */}
            <div className="space-y-1 text-xs">
              <span className="font-bold text-zinc-900">Student Objective:</span>
              <p className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-700 leading-relaxed">
                {selectedBooking.sessionGoal}
              </p>
            </div>

            {/* Candidate Documents via Signed URLs */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-zinc-900">Session-Authorized Student Artifacts:</span>
              {selectedBooking.authorizedDocuments.length === 0 ? (
                <p className="text-zinc-400 italic">No artifacts uploaded by candidate for this booking.</p>
              ) : (
                <div className="space-y-1.5">
                  {selectedBooking.authorizedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-xl border border-zinc-200 bg-white flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[#5145cd] shrink-0" />
                        <div>
                          <p className="font-semibold text-zinc-900">{doc.title}</p>
                          <p className="text-[11px] text-zinc-500">{doc.summaryPreview}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                        {doc.signedUrlExpiresIn}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="space-y-2 text-xs pt-2 border-t border-zinc-100">
              <span className="font-bold text-zinc-900">Booking Audit Trail:</span>
              <div className="space-y-1">
                {selectedBooking.timeline.map((ev, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-zinc-600 text-[11px]">
                    <span className="font-mono text-zinc-400 shrink-0">{ev.timestamp}:</span>
                    <span>{ev.event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Booking Modal (PRD §12.2 Compliance) */}
      <MentorModal
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Confirmed Booking"
        subtitle="Operational action compliant with student-protection rules (PRD §12.2)."
        footer={
          <>
            <button
              type="button"
              onClick={() => setCancelModalOpen(false)}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Keep Booking
            </button>
            <button
              type="button"
              onClick={() => {
                if (!cancelReason.trim()) {
                  setCancelError("Please state an operational reason for cancellation.");
                  return;
                }
                if (selectedBooking) {
                  onMentorCancelBooking(selectedBooking.id, cancelReason.trim());
                  setCancelModalOpen(false);
                }
              }}
              className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
            >
              Confirm Cancellation
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Student-Protection Notice (PRD §12.2):
            </span>
            <p className="leading-relaxed">
              When a mentor initiates cancellation, the student is immediately notified and given the exclusive choice between an alternate open slot or an immediate 100% refund.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-zinc-800 mb-1">
              Operational Reason (Recorded in Mentor Audit Ledger):
            </label>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => {
                setCancelReason(e.target.value);
                if (cancelError) setCancelError(null);
              }}
              placeholder="e.g. Unplanned critical production on-call escalation overlapping scheduled window..."
              className="w-full rounded-xl border border-zinc-300 p-3 text-xs text-zinc-900 focus:outline-none focus:border-[#5145cd]"
            />
            {cancelError && <p className="mt-1 text-xs font-medium text-rose-600">{cancelError}</p>}
          </div>
        </div>
      </MentorModal>
    </div>
  );
}
