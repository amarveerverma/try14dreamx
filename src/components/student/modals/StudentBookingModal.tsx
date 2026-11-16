"use client";

import * as React from "react";
import {
  Lock,
  UserCheck,
  Radio,
  Calendar,
  Clock,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle2,
  Info,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { StudentModal } from "../ui/StudentModal";
import { StudentStatusBadge } from "../ui/StudentStatusBadge";
import {
  getServiceById,
  formatPaise,
  calculateBundlePricing,
  SEED_AVAILABLE_MENTORS,
  MentorPreview,
} from "../types";

export interface BookingConfirmationPayload {
  serviceId: string;
  mode: "Direct" | "Smart Match";
  mentor?: MentorPreview;
  slotDateLabel: string;
  slotTimeLabel: string;
  preferredWindows?: string[];
  listedPricePaise: number;
  appliedDiscountLabel: string;
  discountPaise: number;
  finalPaidPaise: number;
}

export interface StudentBookingModalProps {
  open: boolean;
  serviceId: string | null;
  preselectedMentorSlug?: string;
  membershipTier: string;
  onClose: () => void;
  onBookingConfirmed: (payload: BookingConfirmationPayload) => void;
}

export function StudentBookingModal({
  open,
  serviceId,
  preselectedMentorSlug,
  membershipTier,
  onClose,
  onBookingConfirmed,
}: StudentBookingModalProps) {
  const service = serviceId ? getServiceById(serviceId) : null;
  const approvedMentors = service
    ? SEED_AVAILABLE_MENTORS.filter((m) => m.approvedServiceIds.includes(service.id))
    : [];
  const supportsSmartMatch = service ? service.bookingModes.includes("Smart Match") : true;

  const [step, setStep] = React.useState<"configure" | "checkout" | "verifying">("configure");
  const [bookingMode, setBookingMode] = React.useState<"Direct" | "Smart Match">("Direct");
  const [selectedMentorId, setSelectedMentorId] = React.useState<string>("");
  const [selectedSlotId, setSelectedSlotId] = React.useState<string>("");
  const [preferredWindows, setPreferredWindows] = React.useState<string[]>([
    "Sat, 08 Nov 2026 · 10:30 – 11:30 IST",
    "Sun, 09 Nov 2026 · 16:00 – 17:00 IST",
  ]);
  const [newDate, setNewDate] = React.useState<string>("2026-11-10");
  const [newTimeWindow, setNewTimeWindow] = React.useState<string>("19:30 – 20:30 IST");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [verifyingMsg, setVerifyingMsg] = React.useState<string>("");

  React.useEffect(() => {
    if (!open || !service) return;
    setStep("configure");
    setErrorMsg(null);
    const preselected = preselectedMentorSlug
      ? approvedMentors.find((m) => m.slug === preselectedMentorSlug)
      : approvedMentors[0];
    setBookingMode("Direct");
    setSelectedMentorId(preselected?.id ?? approvedMentors[0]?.id ?? "");
    const initialSlot = (preselected ?? approvedMentors[0])?.availableSlots.find(
      (s) => s.status === "Available"
    );
    setSelectedSlotId(initialSlot?.id ?? "");
  }, [open, serviceId, preselectedMentorSlug]);

  if (!open || !service) return null;

  const activeMentor =
    approvedMentors.find((m) => m.id === selectedMentorId) ?? approvedMentors[0];
  const activeSlot = activeMentor?.availableSlots.find((s) => s.id === selectedSlotId);
  const pricing = calculateBundlePricing(service.listPricePaise, membershipTier, false);

  const handleAddWindow = () => {
    if (!newDate) {
      setErrorMsg("Select a valid future date in Asia/Kolkata (IST).");
      return;
    }
    const entry = `${newDate} · ${newTimeWindow}`;
    if (preferredWindows.includes(entry)) {
      setErrorMsg("Duplicate availability window — each preferred window must be distinct.");
      return;
    }
    setPreferredWindows((prev) => [...prev, entry]);
    setErrorMsg(null);
  };

  const handlePayAndConfirm = async () => {
    setStep("verifying");
    setVerifyingMsg(
      bookingMode === "Direct"
        ? "Acquiring atomic server slot hold..."
        : "Validating Smart Match request & eligibility..."
    );
    await new Promise((r) => setTimeout(r, 450));
    setVerifyingMsg(
      "Awaiting authoritative payment-provider webhook verification (redirect alone is never trusted)..."
    );
    await new Promise((r) => setTimeout(r, 600));

    onBookingConfirmed({
      serviceId: service.id,
      mode: bookingMode,
      mentor: bookingMode === "Direct" ? activeMentor : undefined,
      slotDateLabel:
        bookingMode === "Direct"
          ? activeSlot?.dateLabel ?? "Selected date"
          : `Preferred: ${preferredWindows[0]?.split(" · ")[0] ?? "Upcoming"}`,
      slotTimeLabel:
        bookingMode === "Direct"
          ? activeSlot?.timeLabel ?? "Selected slot"
          : `${preferredWindows.length} IST window(s) submitted`,
      preferredWindows: bookingMode === "Smart Match" ? preferredWindows : undefined,
      listedPricePaise: pricing.subtotalPaise,
      appliedDiscountLabel: pricing.appliedLabel,
      discountPaise: pricing.discountPaise,
      finalPaidPaise: pricing.payablePaise,
    });
    onClose();
  };

  const footerContent =
    step === "configure" ? (
      <>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            if (bookingMode === "Direct") {
              if (!activeMentor || !activeSlot || activeSlot.status !== "Available") {
                setErrorMsg("Please select an approved mentor and an available IST time slot.");
                return;
              }
            } else if (preferredWindows.length === 0) {
              setErrorMsg("Add at least one preferred IST availability window for Smart Match.");
              return;
            }
            setErrorMsg(null);
            setStep("checkout");
          }}
          className="rounded-lg bg-[#5145cd] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4035b3]"
        >
          Review Price & Policies →
        </button>
      </>
    ) : step === "checkout" ? (
      <>
        <button
          type="button"
          onClick={() => setStep("configure")}
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          ← Back to Slot Selection
        </button>
        <button
          type="button"
          onClick={handlePayAndConfirm}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#5145cd] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4035b3]"
        >
          <Lock className="h-3.5 w-3.5" />
          Pay {formatPaise(pricing.payablePaise)} & Verify Booking
        </button>
      </>
    ) : undefined;

  return (
    <StudentModal
      open={open}
      onClose={() => step !== "verifying" && onClose()}
      maxWidthClass="max-w-2xl"
      title={`Book ${service.id} — ${service.name}`}
      subtitle={`${service.durationMinutes} min · Deliverable: ${service.deliverableName} (within 48h SLA) · IST`}
      footer={footerContent}
    >
      {step === "configure" && (
        <div className="space-y-4 text-xs sm:text-sm">
          {/* Mode Switch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setBookingMode("Direct");
                setErrorMsg(null);
              }}
              className={`text-left rounded-xl border p-3.5 transition-all ${
                bookingMode === "Direct"
                  ? "border-[#5145cd] bg-indigo-50/55 ring-1 ring-[#5145cd]/25"
                  : "border-zinc-200 bg-white hover:bg-zinc-50"
              }`}
            >
              <p className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 text-[#5145cd]" />
                Direct Booking
              </p>
              <p className="text-[11px] text-zinc-600 mt-1">
                Choose a specific service-approved mentor and lock an exact open IST time slot.
              </p>
            </button>
            <button
              type="button"
              disabled={!supportsSmartMatch}
              onClick={() => {
                setBookingMode("Smart Match");
                setErrorMsg(null);
              }}
              className={`text-left rounded-xl border p-3.5 transition-all disabled:opacity-45 disabled:cursor-not-allowed ${
                bookingMode === "Smart Match"
                  ? "border-[#5145cd] bg-indigo-50/55 ring-1 ring-[#5145cd]/25"
                  : "border-zinc-200 bg-white hover:bg-zinc-50"
              }`}
            >
              <p className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                <Radio className="h-4 w-4 text-[#5145cd]" />
                Smart Match Dispatch
              </p>
              <p className="text-[11px] text-zinc-600 mt-1">
                {supportsSmartMatch
                  ? "Submit preferred IST windows; Wave 2 at 30m, explicit slot or 100% refund choice at 2h."
                  : "This specialized service supports Direct Booking only."}
              </p>
            </button>
          </div>

          {bookingMode === "Direct" ? (
            <div className="space-y-4">
              <div>
                <span className="block text-xs font-semibold text-zinc-800 mb-2">
                  1. Select Mentor Approved for {service.id} ({approvedMentors.length} verified)
                </span>
                <div className="space-y-2">
                  {approvedMentors.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedMentorId(m.id);
                        const available = m.availableSlots.find((s) => s.status === "Available");
                        setSelectedSlotId(available?.id ?? "");
                      }}
                      className={`w-full text-left rounded-xl border p-3 transition-colors ${
                        activeMentor?.id === m.id
                          ? "border-[#5145cd] bg-indigo-50/45"
                          : "border-zinc-200 bg-zinc-50/60 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-zinc-900">
                          {m.displayName} · {m.yearsOfExperience} yrs
                        </span>
                        <StudentStatusBadge label="Approved for Service" tone="success" />
                      </div>
                      <p className="text-[11px] text-zinc-600 mt-0.5">{m.headline}</p>
                      <p className="text-[10px] text-emerald-800 mt-1 font-medium">
                        {m.verificationLabel}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {activeMentor && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-zinc-800">
                      2. Select Available Slot (Asia/Kolkata · IST)
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Server revalidates & locks slot at checkout
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeMentor.availableSlots.map((slot) => {
                      const isAvailable = slot.status === "Available";
                      const isSelected = selectedSlotId === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={`text-left rounded-xl border p-2.5 text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            isSelected && isAvailable
                              ? "border-[#5145cd] bg-[#5145cd] text-white"
                              : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {slot.dateLabel}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                isSelected && isAvailable
                                  ? "bg-white/20 text-white"
                                  : slot.status === "Available"
                                  ? "bg-emerald-50 text-emerald-800"
                                  : slot.status === "Temporarily held"
                                  ? "bg-amber-50 text-amber-800"
                                  : "bg-zinc-100 text-zinc-500"
                              }`}
                            >
                              {slot.status}
                            </span>
                          </div>
                          <p
                            className={`mt-1 font-mono text-[11px] ${
                              isSelected && isAvailable ? "text-indigo-100" : "text-zinc-500"
                            }`}
                          >
                            {slot.timeLabel}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/55 p-3.5 text-xs text-zinc-700 space-y-1">
                <p className="font-semibold text-indigo-950">
                  How Smart Match Works (Deterministic MVP)
                </p>
                <p>
                  Your request is sent only to verified mentors approved for{" "}
                  <strong>{service.name}</strong> who match your preferred IST windows. Wave 2
                  starts at <strong>30 minutes</strong> if unclaimed. At <strong>2 hours</strong>{" "}
                  without acceptance, you explicitly choose an open alternative slot or a{" "}
                  <strong>100% full refund</strong>—DreamX never auto-reschedules you.
                </p>
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-semibold text-zinc-800">
                  Your Preferred IST Availability Windows ({preferredWindows.length})
                </span>
                {preferredWindows.map((win, idx) => (
                  <div
                    key={win}
                    className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs"
                  >
                    <span className="font-medium text-zinc-800 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#5145cd]" />
                      {win}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPreferredWindows((prev) => prev.filter((_, i) => i !== idx))
                      }
                      aria-label={`Remove window ${win}`}
                      className="text-zinc-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-dashed border-zinc-300 p-3 flex flex-wrap items-center gap-2">
                <input
                  type="date"
                  min="2026-11-06"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  aria-label="Preferred date"
                  className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-mono"
                />
                <select
                  value={newTimeWindow}
                  onChange={(e) => setNewTimeWindow(e.target.value)}
                  aria-label="Preferred IST window"
                  className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs"
                >
                  <option value="10:30 – 11:30 IST">10:30 – 11:30 IST</option>
                  <option value="14:00 – 15:00 IST">14:00 – 15:00 IST</option>
                  <option value="19:30 – 20:30 IST">19:30 – 20:30 IST</option>
                  <option value="20:30 – 21:30 IST">20:30 – 21:30 IST</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddWindow}
                  className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Window
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <p role="alert" className="text-xs font-semibold text-rose-600 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMsg}
            </p>
          )}
        </div>
      )}

      {step === "checkout" && (
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Service & Duration</span>
              <span className="font-semibold text-zinc-900">
                {service.id} · {service.name} ({service.durationMinutes} min)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Booking Mode & Mentor</span>
              <span className="font-semibold text-zinc-900">
                {bookingMode === "Direct"
                  ? `Direct · ${activeMentor?.displayName ?? "Selected mentor"}`
                  : "Smart Match Dispatch (Approved Mentors)"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Scheduled / Preferred IST</span>
              <span className="font-mono font-medium text-zinc-800">
                {bookingMode === "Direct"
                  ? `${activeSlot?.dateLabel} · ${activeSlot?.timeLabel}`
                  : `${preferredWindows.length} preferred IST window(s)`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Post-Session Deliverable</span>
              <span className="font-medium text-zinc-800">
                {service.deliverableName} (within 48h)
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-indigo-200/80 bg-white p-4 space-y-2 text-xs">
            <p className="font-bold text-zinc-900">Authoritative Price Breakdown (INR)</p>
            <div className="flex items-center justify-between text-zinc-700">
              <span>Listed Service Price</span>
              <span className="font-mono tabular-nums">{formatPaise(pricing.subtotalPaise)}</span>
            </div>
            <div className="flex items-center justify-between text-emerald-800">
              <span>Eligible Discount ({pricing.appliedLabel})</span>
              <span className="font-mono tabular-nums">-{formatPaise(pricing.discountPaise)}</span>
            </div>
            <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-sm font-bold text-zinc-900">
              <span>Final Payable Amount</span>
              <span className="font-mono text-[#4035b3] tabular-nums">
                {formatPaise(pricing.payablePaise)}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 pt-1">{pricing.nonStackingExplanation}</p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-3.5 space-y-1.5 text-[11px] text-zinc-600">
            <p className="flex items-start gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Cancellation Policy (PRD 12.1):</strong> Cancel at least 1 hour before your
                1:1 session for a 100% full refund. Substantiated post-session quality complaints
                reported within 48 hours qualify for an 80% refund.
              </span>
            </p>
            <p className="flex items-start gap-1.5">
              <Info className="h-3.5 w-3.5 text-[#5145cd] shrink-0 mt-0.5" />
              <span>
                <strong>Payment Verification (Dev Simulation · Gate V-01):</strong> Simulates
                provider-adapter payment & signed server webhook confirmation. No hiring or
                placement outcome is guaranteed.
              </span>
            </p>
          </div>
        </div>
      )}

      {step === "verifying" && (
        <div className="py-10 text-center space-y-3">
          <Loader2 className="h-8 w-8 text-[#5145cd] animate-spin mx-auto" />
          <p className="text-sm font-semibold text-zinc-900">Verifying Payment & Slot State</p>
          <p className="text-xs text-zinc-600 max-w-md mx-auto">{verifyingMsg}</p>
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <ShieldCheck className="h-3.5 w-3.5" />
            Server-Authoritative Confirmation
          </span>
        </div>
      )}
    </StudentModal>
  );
}
