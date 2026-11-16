"use client";

import * as React from "react";
import {
  Globe,
  Save,
  Plus,
  Trash2,
  Calendar,
  Lock,
  Clock,
  ShieldCheck,
  Ban,
} from "lucide-react";
import { WeeklySlot, DateException, MentorBooking, getServiceById } from "../types";
import { StatusBadge } from "../StatusBadge";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface AvailabilityViewProps {
  weeklySlots: WeeklySlot[];
  exceptions: DateException[];
  bookings: MentorBooking[];
  onSaveAvailability: (slots: WeeklySlot[], exceptions: DateException[]) => void;
}

export function AvailabilityView({
  weeklySlots: initialSlots,
  exceptions: initialExceptions,
  bookings,
  onSaveAvailability,
}: AvailabilityViewProps) {
  const [slots, setSlots] = React.useState<WeeklySlot[]>(initialSlots);
  const [exceptions, setExceptions] = React.useState<DateException[]>(initialExceptions);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  // Add block state
  const [newDay, setNewDay] = React.useState("Wednesday");
  const [newStart, setNewStart] = React.useState("19:30");
  const [newEnd, setNewEnd] = React.useState("21:30");
  const [slotError, setSlotError] = React.useState<string | null>(null);

  // Add exception state
  const [excDate, setExcDate] = React.useState("2026-11-20");
  const [excType, setExcType] = React.useState<"Unavailable" | "Custom Hours">("Unavailable");
  const [excHours, setExcHours] = React.useState("18:00 – 20:00 IST");
  const [excReason, setExcReason] = React.useState("");
  const [excError, setExcError] = React.useState<string | null>(null);

  const toggleSlot = (id: string) => {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
    setHasUnsavedChanges(true);
  };

  const updateSlotTime = (id: string, field: "startTime" | "endTime", val: string) => {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: val } : s)));
    setHasUnsavedChanges(true);
  };

  const removeSlot = (id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
    setHasUnsavedChanges(true);
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStart >= newEnd) {
      setSlotError("End time must be after start time (24h IST).");
      return;
    }
    const hasOverlap = slots.some(
      (s) => s.dayOfWeek === newDay && newStart < s.endTime && newEnd > s.startTime
    );
    if (hasOverlap) {
      setSlotError(`Overlaps with an existing ${newDay} window.`);
      return;
    }

    setSlots((prev) => [
      ...prev,
      { id: `w-${Date.now()}`, dayOfWeek: newDay, startTime: newStart, endTime: newEnd, enabled: true },
    ]);
    setSlotError(null);
    setHasUnsavedChanges(true);
  };

  const handleAddException = (e: React.FormEvent) => {
    e.preventDefault();
    if (!excDate) {
      setExcError("Please select a valid calendar date.");
      return;
    }
    if (!excReason.trim()) {
      setExcError("Please enter a short note so you can track this override.");
      return;
    }

    setExceptions((prev) => [
      ...prev,
      {
        id: `ex-${Date.now()}`,
        date: excDate,
        type: excType,
        customHours: excType === "Custom Hours" ? excHours : undefined,
        reason: excReason.trim(),
      },
    ]);
    setExcReason("");
    setExcError(null);
    setHasUnsavedChanges(true);
  };

  const removeException = (id: string) => {
    setExceptions((prev) => prev.filter((e) => e.id !== id));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    const invalid = slots.find((s) => s.startTime >= s.endTime);
    if (invalid) {
      setSlotError(`Invalid window on ${invalid.dayOfWeek}: end time must be after start time.`);
      return;
    }
    setSlotError(null);
    onSaveAvailability(slots, exceptions);
    setHasUnsavedChanges(false);
  };

  const lockedBookings = bookings.filter(
    (b) => b.status === "Ready to Join" || b.status === "Confirmed"
  );

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-2.5 py-0.5 text-xs font-semibold text-sky-900">
                <Globe className="h-3.5 w-3.5" />
                <span>Operating Timezone: Asia/Kolkata (IST · UTC+05:30)</span>
              </span>
              {hasUnsavedChanges ? (
                <StatusBadge label="Unsaved schedule changes" tone="warning" />
              ) : (
                <StatusBadge label="Synced with booking rules" tone="success" />
              )}
            </div>
            <h1 className="mt-2 text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              Availability &amp; Slot Exceptions
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
              Configure recurring weekly IST availability and date-specific exceptions. Confirmed bookings and active checkout holds remain locked server-side to prevent double booking (PRD §10.2 &amp; §10.4).
            </p>
          </div>

          <button
            type="button"
            disabled={!hasUnsavedChanges}
            onClick={handleSave}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#5145cd] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#4035b3] disabled:opacity-45 disabled:cursor-not-allowed transition-colors shadow-xs"
          >
            <Save className="h-4 w-4" />
            <span>Save Availability Rules</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Recurring Weekly Windows */}
        <div className="lg:col-span-7 space-y-5">
          <section className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3.5">
              <div>
                <h2 className="text-base font-bold text-zinc-900">Weekly Recurring Windows</h2>
                <p className="text-xs text-zinc-500">Used for Direct Booking calendars and Smart Match eligibility</p>
              </div>
              <span className="text-xs font-mono text-zinc-500">
                {slots.filter((s) => s.enabled).length} active blocks
              </span>
            </div>

            <div className="space-y-3">
              {DAYS_OF_WEEK.map((day) => {
                const daySlots = slots.filter((s) => s.dayOfWeek === day);

                return (
                  <div
                    key={day}
                    className="rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="w-28 shrink-0">
                      <span className="text-xs font-bold text-zinc-900">{day}</span>
                    </div>

                    {daySlots.length === 0 ? (
                      <span className="text-xs text-zinc-400 italic flex-1">
                        No recurring windows configured
                      </span>
                    ) : (
                      <div className="flex-1 flex flex-wrap items-center gap-2">
                        {daySlots.map((slot) => (
                          <div
                            key={slot.id}
                            className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs ${
                              slot.enabled
                                ? "bg-white border-zinc-300 text-zinc-900 shadow-2xs"
                                : "bg-zinc-100 border-zinc-200 text-zinc-400"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={slot.enabled}
                              onChange={() => toggleSlot(slot.id)}
                              aria-label={`Enable ${day} ${slot.startTime} to ${slot.endTime}`}
                              className="h-3.5 w-3.5 accent-[#5145cd] rounded cursor-pointer"
                            />
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => updateSlotTime(slot.id, "startTime", e.target.value)}
                              aria-label={`${day} start time`}
                              className="bg-transparent font-mono text-xs focus:outline-none"
                            />
                            <span className="text-zinc-400">–</span>
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => updateSlotTime(slot.id, "endTime", e.target.value)}
                              aria-label={`${day} end time`}
                              className="bg-transparent font-mono text-xs focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeSlot(slot.id)}
                              aria-label={`Remove ${day} window`}
                              className="text-zinc-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Block Form */}
            <form
              onSubmit={handleAddSlot}
              className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-3.5 space-y-2.5"
            >
              <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5 text-[#5145cd]" />
                <span>Add Recurring Weekly Window (IST)</span>
              </span>

              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  value={newDay}
                  onChange={(e) => setNewDay(e.target.value)}
                  aria-label="Day of week"
                  className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                >
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <input
                  type="time"
                  value={newStart}
                  onChange={(e) => setNewStart(e.target.value)}
                  aria-label="Start time"
                  className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-mono text-zinc-900"
                />
                <span className="text-xs text-zinc-500">to</span>
                <input
                  type="time"
                  value={newEnd}
                  onChange={(e) => setNewEnd(e.target.value)}
                  aria-label="End time"
                  className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-mono text-zinc-900"
                />

                <button
                  type="submit"
                  className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800"
                >
                  Add Block
                </button>
              </div>

              {slotError && <p className="text-xs font-medium text-rose-600">{slotError}</p>}
            </form>
          </section>
        </div>

        {/* Right 5 cols: Exceptions & Protected Bookings */}
        <div className="lg:col-span-5 space-y-5">
          {/* Section: Date-Specific Exceptions */}
          <section className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 shadow-xs space-y-4">
            <div className="border-b border-zinc-200/80 pb-3">
              <h2 className="text-base font-bold text-zinc-900">Date-Specific Exceptions &amp; Blackouts</h2>
              <p className="text-xs text-zinc-500">Override recurring rules for holidays, travel, or extra open slots</p>
            </div>

            <div className="space-y-2.5">
              {exceptions.length === 0 ? (
                <p className="text-xs text-zinc-500 py-2">No date-specific overrides active.</p>
              ) : (
                exceptions.map((exc) => (
                  <div
                    key={exc.id}
                    className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 flex items-start justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-zinc-900">{exc.date}</span>
                        <StatusBadge
                          label={exc.type === "Unavailable" ? "Unavailable" : exc.customHours || "Custom"}
                          tone={exc.type === "Unavailable" ? "danger" : "info"}
                          size="sm"
                        />
                      </div>
                      <p className="text-xs text-zinc-600">{exc.reason}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeException(exc.id)}
                      aria-label={`Remove exception on ${exc.date}`}
                      className="text-zinc-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Date Exception Form */}
            <form
              onSubmit={handleAddException}
              className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-3.5 space-y-2.5"
            >
              <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                {excType === "Unavailable" ? (
                  <Ban className="h-3.5 w-3.5 text-rose-600" />
                ) : (
                  <Calendar className="h-3.5 w-3.5 text-[#5145cd]" />
                )}
                <span>Add Date Override</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="date"
                  value={excDate}
                  onChange={(e) => setExcDate(e.target.value)}
                  aria-label="Override date"
                  className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-mono text-zinc-900"
                />
                <select
                  value={excType}
                  onChange={(e) => setExcType(e.target.value as typeof excType)}
                  aria-label="Override type"
                  className="rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                >
                  <option value="Unavailable">Unavailable All Day</option>
                  <option value="Custom Hours">Custom IST Hours</option>
                </select>
              </div>

              {excType === "Custom Hours" && (
                <input
                  type="text"
                  value={excHours}
                  onChange={(e) => setExcHours(e.target.value)}
                  placeholder="e.g. 15:00 – 18:00 IST"
                  aria-label="Custom IST hours"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
                />
              )}

              <input
                type="text"
                value={excReason}
                onChange={(e) => {
                  setExcReason(e.target.value);
                  if (excError) setExcError(null);
                }}
                placeholder="Reason (e.g. Personal travel / Weekend mock marathon)"
                aria-label="Exception reason"
                className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-900"
              />

              {excError && <p className="text-xs font-medium text-rose-600">{excError}</p>}

              <button
                type="submit"
                className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
              >
                Add Date Exception
              </button>
            </form>
          </section>

          {/* Section: Committed Bookings (Protected) */}
          <section className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-[#5145cd]" />
                <span>Committed Bookings (Protected)</span>
              </h2>
              <span className="text-xs text-zinc-500 font-mono">{lockedBookings.length} locked</span>
            </div>

            <p className="text-xs text-zinc-500">
              Editing recurring availability affects future open slots only; confirmed student bookings remain protected.
            </p>

            <div className="space-y-2">
              {lockedBookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-lg border border-indigo-100 bg-indigo-50/40 px-3 py-2 text-xs flex items-center justify-between gap-2"
                >
                  <div>
                    <p className="font-semibold text-zinc-900">
                      {getServiceById(b.serviceId).name} · {b.studentName}
                    </p>
                    <p className="text-zinc-600 flex items-center gap-1 mt-0.5 font-mono text-[11px]">
                      <Clock className="h-3 w-3 text-zinc-400" />
                      <span>
                        {b.scheduledDate} · {b.scheduledTime}
                      </span>
                    </p>
                  </div>
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
