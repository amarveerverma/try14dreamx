"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Plus,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Lock,
  X,
  SlidersHorizontal,
  Mail,
  Link2,
  AlertCircle,
  ChevronRight,
  Sun,
  Sunset,
  Coffee,
} from "lucide-react";

interface SlotItem {
  id: string;
  timeRange: string;
  scope: string;
  isConfirmed?: boolean;
  candidateName?: string;
  candidateId?: string;
  serviceName?: string;
  escrowAmount?: string;
}

interface DaySchedule {
  day: string;
  enabled: boolean;
  blockedReason?: string;
  slots: SlotItem[];
}

export default function MentorAvailabilityPage() {
  // Live IST Clock
  const [istTime, setIstTime] = React.useState("19:48:10 IST");
  React.useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now);
        setIstTime(`${formatted} IST`);
      } catch {
        // fallback
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync state
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [syncStatus, setSyncStatus] = React.useState("Synced 2m ago");

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus("Just now");
    }, 1200);
  };

  // Governance settings state
  const [interSessionRest, setInterSessionRest] = React.useState("15 mins");
  const [advanceNotice, setAdvanceNotice] = React.useState("2 hours");

  // Weekly Schedule State
  const [schedules, setSchedules] = React.useState<DaySchedule[]>([
    {
      day: "Monday",
      enabled: false,
      blockedReason: "Unavailable • Corporate Sprint Planning (Google L5 Internal)",
      slots: [],
    },
    {
      day: "Tuesday",
      enabled: true,
      slots: [
        {
          id: "tue-1",
          timeRange: "07:00 PM – 08:00 PM IST",
          scope: "S06 Technical Mock / S01 Resume Review",
        },
        {
          id: "tue-2",
          timeRange: "08:30 PM – 09:30 PM IST",
          scope: "S06 Technical Mock eligible",
        },
      ],
    },
    {
      day: "Wednesday",
      enabled: false,
      blockedReason: "Unavailable • Blocked by Google Calendar Work Event (Team Sync)",
      slots: [],
    },
    {
      day: "Thursday",
      enabled: true,
      slots: [
        {
          id: "thu-1",
          timeRange: "07:30 PM – 08:30 PM IST",
          scope: "Open for Direct Booking & Smart Match",
        },
      ],
    },
    {
      day: "Friday",
      enabled: true,
      slots: [
        {
          id: "fri-1",
          timeRange: "07:30 PM – 08:30 PM IST",
          scope: "S06 Technical Mock",
          isConfirmed: true,
          candidateName: "Rohan Sharma",
          candidateId: "#DX-9124",
          serviceName: "S06 Technical Mock",
          escrowAmount: "₹999",
        },
      ],
    },
    {
      day: "Saturday",
      enabled: true,
      slots: [
        {
          id: "sat-1",
          timeRange: "10:30 AM – 11:30 AM IST",
          scope: "Morning architectural review window",
        },
        {
          id: "sat-2",
          timeRange: "04:00 PM – 05:00 PM IST",
          scope: "Afternoon mock drill",
        },
      ],
    },
    {
      day: "Sunday",
      enabled: true,
      slots: [
        {
          id: "sun-1",
          timeRange: "11:00 AM – 12:00 PM IST",
          scope: "Weekend career roadmap & strategy",
        },
      ],
    },
  ]);

  // Modal State for adding slot
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalDay, setModalDay] = React.useState("Tuesday");
  const [modalStartTime, setModalStartTime] = React.useState("19:00");
  const [modalEndTime, setModalEndTime] = React.useState("20:00");
  const [modalScope, setModalScope] = React.useState("S06 Technical Mock / S01 Resume Review");

  const toggleDay = (dayName: string) => {
    setSchedules((prev) =>
      prev.map((d) => (d.day === dayName ? { ...d, enabled: !d.enabled } : d))
    );
  };

  const removeSlot = (dayName: string, slotId: string) => {
    setSchedules((prev) =>
      prev.map((d) =>
        d.day === dayName
          ? { ...d, slots: d.slots.filter((s) => s.id !== slotId) }
          : d
      )
    );
  };

  const handleAddSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot: SlotItem = {
      id: `slot-${Date.now()}`,
      timeRange: `${modalStartTime} – ${modalEndTime} IST`,
      scope: modalScope,
    };
    setSchedules((prev) =>
      prev.map((d) =>
        d.day === modalDay
          ? { ...d, enabled: true, slots: [...d.slots, newSlot] }
          : d
      )
    );
    setModalOpen(false);
  };

  // Total active hours
  const activeHours = schedules
    .filter((d) => d.enabled)
    .reduce((acc, d) => acc + d.slots.length, 0);

  return (
    <div className="flex-1 bg-[#fcf9f8] text-[#1c1b1b] min-h-screen">
      {/* 1. TOP STICKY BAR */}
      <header className="sticky top-0 z-30 w-full flex items-center justify-between h-16 bg-white border-b border-[#e7e7eb] px-6 lg:px-10">
        {/* Breadcrumb Hierarchy */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#474554]">
          <Link href="/mentor" className="hover:text-[#1c1b1b] transition-colors">
            Mentor Portal
          </Link>
          <ChevronRight className="w-4 h-4 text-[#777585]" />
          <span className="hover:text-[#1c1b1b] transition-colors">
            Calendar &amp; Booking Settings
          </span>
          <ChevronRight className="w-4 h-4 text-[#777585]" />
          <span className="text-[#1c1b1b] font-semibold">Availability Manager</span>
        </div>

        {/* Telemetry Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f6f3f2] border border-[#e7e7eb] text-xs font-medium text-[#1c1b1b]">
            <span className="w-2 h-2 rounded-full bg-[#16834a] animate-ping" />
            <span className="hidden md:inline">Asia/Kolkata (IST • UTC+05:30) |</span>
            <span className="font-bold tabular-nums">{istTime}</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eaf5ef] border border-[#d1edd9] text-xs font-semibold text-[#16834a]">
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>Two-Way Sync Active</span>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8 space-y-8">
        {/* 2.1 Header & Actions */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
          <div className="space-y-1 max-w-3xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c1b1b] tracking-tight">
              Weekly Recurring Availability &amp; Booking Buffers
            </h1>
            <p className="text-sm text-[#474554] leading-relaxed">
              Candidate bookings sync directly with your Google Calendar / Outlook. 2-hour minimum notice buffer and 15-minute inter-session buffer enforced per PRD §11.1.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#e7e7eb] bg-white text-xs sm:text-sm font-semibold text-[#1c1b1b] hover:bg-[#f6f3f2] transition-all shadow-xs"
            >
              <RefreshCw className={`w-4 h-4 text-[#16834a] ${isSyncing ? "animate-spin" : ""}`} />
              <span>Sync Google Calendar</span>
              <span className="text-[11px] font-normal text-[#777585] ml-1">({syncStatus})</span>
            </button>
            <button
              onClick={() => {
                setModalDay("Tuesday");
                setModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#5145cd] text-xs sm:text-sm font-semibold text-white hover:bg-[#3828b5] transition-all shadow-sm active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Time Block</span>
            </button>
          </div>
        </section>

        {/* 2.2 Telemetry Bento Grid (3 Cards) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="p-5 rounded-xl bg-white border border-[#e7e7eb] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#777585]">
                Active Weekly Capacity
              </span>
              <Clock className="w-5 h-5 text-[#5145cd]" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold tabular-nums text-[#1c1b1b]">
                {activeHours} Hours
              </span>
              <span className="text-sm text-[#474554] font-medium">/ week committed</span>
            </div>
            <p className="text-xs text-[#474554] mt-1">
              4 weekdays, 2 weekend morning windows •{" "}
              <strong className="text-[#1c1b1b] font-semibold">Max 3 sessions/day cap</strong>
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-xl bg-white border border-[#e7e7eb] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#777585]">
                Two-Way Calendar Sync
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#eaf5ef] text-[#16834a] flex items-center gap-1 border border-[#d1edd9]">
                <CheckCircle2 className="w-3 h-3" />
                Live
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1 truncate">
              <span className="text-base font-bold text-[#1c1b1b] truncate">
                vikram.singh@google.com
              </span>
            </div>
            <p className="text-xs text-[#474554] mt-1">
              Auto-detects work conflicts &amp; Google Meet blocks •{" "}
              <span className="text-[#16834a] font-semibold">0 double-booking incidents</span>
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-xl bg-white border border-[#e7e7eb] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#777585]">
                Notice &amp; Booking Safeguards
              </span>
              <ShieldCheck className="w-5 h-5 text-[#5145cd]" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold tabular-nums text-[#1c1b1b]">
                {advanceNotice} Lead Time
              </span>
            </div>
            <p className="text-xs text-[#474554] mt-1">
              Zero surprise same-hour calls •{" "}
              <span className="text-[#5145cd] font-semibold">
                {interSessionRest} inter-session buffer locked
              </span>
            </p>
          </div>
        </section>

        {/* 2.3 Weekly Recurring Slot Grid (Monday to Sunday) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-[#1c1b1b]">Weekly Recurring Availability Windows</h2>
              <p className="text-xs text-[#474554]">
                Configure standard hours for algorithmic matching and candidate self-scheduling.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#474554]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16834a]" /> Confirmed Booking
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5145cd]" /> Active Slot
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c8c4d6]" /> Unavailable
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {schedules.map((dayPlan) => {
              const isFridayConfirmed = dayPlan.day === "Friday" && dayPlan.slots.some((s) => s.isConfirmed);

              return (
                <div
                  key={dayPlan.day}
                  className={`p-4 rounded-xl border transition-all ${
                    isFridayConfirmed
                      ? "border-[#16834a]/40 bg-white shadow-xs"
                      : dayPlan.enabled
                      ? "border-[#e7e7eb] bg-white shadow-xs hover:border-[#5145cd]/40"
                      : "border-[#e7e7eb] bg-[#f6f3f2]"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-4">
                      {/* Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => toggleDay(dayPlan.day)}
                        className={`w-11 h-6 rounded-full relative p-0.5 transition-colors focus:outline-none ${
                          dayPlan.enabled ? "bg-[#5145cd]" : "bg-[#c8c4d6]"
                        }`}
                        aria-label={`Toggle ${dayPlan.day}`}
                      >
                        <span
                          className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                            dayPlan.enabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>

                      <div className="w-28">
                        <span
                          className={`text-base font-bold ${
                            dayPlan.enabled ? "text-[#1c1b1b]" : "text-[#777585]"
                          }`}
                        >
                          {dayPlan.day}
                        </span>
                      </div>

                      {/* Status / Tag */}
                      {dayPlan.enabled ? (
                        isFridayConfirmed ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eaf5ef] text-[#16834a] border border-[#d1edd9] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            1 Confirmed Booking!
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e3dfff]/60 text-[#3828b5] border border-[#c5c0ff]">
                            {dayPlan.slots.length} {dayPlan.slots.length === 1 ? "Slot" : "Slots"} Active ({dayPlan.slots.length}h total)
                          </span>
                        )
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-[#777585]">
                          {dayPlan.blockedReason?.includes("Google Calendar") ? (
                            <span className="flex items-center gap-1 text-[#a7670b] bg-[#fbf4e8] px-2.5 py-1 rounded-md border border-[#f5e3c8]">
                              <AlertCircle className="w-3.5 h-3.5" />
                              {dayPlan.blockedReason}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5 text-[#777585]" />
                              {dayPlan.blockedReason || "Unavailable"}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {dayPlan.enabled ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setModalDay(dayPlan.day);
                              setModalOpen(true);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#e7e7eb] bg-white text-xs font-semibold text-[#1c1b1b] hover:bg-[#f6f3f2] transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#5145cd]" />
                            <span>Add Window</span>
                          </button>
                          {isFridayConfirmed && (
                            <Link
                              href="/mentor/sessions"
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#16834a] text-white text-xs font-semibold hover:bg-[#126b3c] transition-colors shadow-xs"
                            >
                              <span>Open Session Console</span>
                            </Link>
                          )}
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleDay(dayPlan.day)}
                          className="px-3 py-1.5 rounded-lg border border-[#e7e7eb] bg-white text-xs font-medium text-[#474554] hover:text-[#1c1b1b] hover:bg-[#f0eded] transition-colors"
                        >
                          Enable Day
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Slots List */}
                  {dayPlan.enabled && dayPlan.slots.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {dayPlan.slots.map((slot) => {
                        if (slot.isConfirmed) {
                          return (
                            <div
                              key={slot.id}
                              className="w-full flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-[#eaf5ef]/60 border border-[#bfe4cc]"
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#16834a]" />
                                <span className="font-bold text-[#1c1b1b] tabular-nums text-sm">
                                  {slot.timeRange}
                                </span>
                                <span className="text-[#777585]">|</span>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="font-semibold text-[#1c1b1b]">{slot.candidateName}</span>
                                  <span className="font-mono text-[11px] text-[#474554] bg-white px-2 py-0.5 rounded border border-[#bfe4cc]">
                                    {slot.candidateId}
                                  </span>
                                  <span className="text-[#777585]">•</span>
                                  <span className="text-[#16834a] font-medium">{slot.serviceName}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white border border-[#bfe4cc] text-[#16834a] tabular-nums">
                                  Escrow Locked {slot.escrowAmount}
                                </span>
                                <CheckCircle2 className="w-4 h-4 text-[#16834a]" />
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={slot.id}
                            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#f6f3f2] border border-[#e7e7eb] text-xs"
                          >
                            {slot.timeRange.includes("AM") ? (
                              <Sun className="w-3.5 h-3.5 text-[#a7670b]" />
                            ) : slot.timeRange.includes("04:00") ? (
                              <Sunset className="w-3.5 h-3.5 text-[#5145cd]" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-[#5145cd]" />
                            )}
                            <span className="font-semibold text-[#1c1b1b] tabular-nums">
                              {slot.timeRange}
                            </span>
                            <span className="text-[#777585]">|</span>
                            <span className="text-[#474554] text-[11px]">{slot.scope}</span>
                            <button
                              type="button"
                              onClick={() => removeSlot(dayPlan.day, slot.id)}
                              className="text-[#777585] hover:text-[#ba1a1a] transition-colors ml-1"
                              aria-label="Remove slot"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 2.4 Buffer & Booking Governance Rules Card (PRD §11.1 & §12.1 Compliance) */}
        <section className="p-6 rounded-2xl bg-white border border-[#e7e7eb] shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#e7e7eb] gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#e3dfff]/60 flex items-center justify-center text-[#5145cd]">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1c1b1b]">Buffer &amp; Booking Governance Rules</h2>
                <p className="text-xs text-[#474554]">
                  PRD §11.1 &amp; §12.1 mandatory system constraints protecting mentor focus and candidate review rigor.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#eaf5ef] text-[#16834a] border border-[#d1edd9] self-start md:self-auto">
              PRD Compliant
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Inter-Session Rest Buffer */}
            <div className="space-y-3">
              <div>
                <span className="text-sm font-semibold text-[#1c1b1b] block">
                  Inter-Session Rest Buffer
                </span>
                <span className="text-xs text-[#474554]">
                  Prevents cognitive fatigue between rigorous bar-raiser mocks.
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {["15 mins", "30 mins", "45 mins"].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setInterSessionRest(val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      interSessionRest === val
                        ? "bg-[#5145cd] text-white shadow-xs"
                        : "border border-[#e7e7eb] bg-white text-[#474554] hover:bg-[#f6f3f2]"
                    }`}
                  >
                    {val} {interSessionRest === val && "(Selected)"}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#777585]">
                Enforces automatic break gap after any 60m session.
              </p>
            </div>

            {/* Minimum Advance Booking Notice */}
            <div className="space-y-3">
              <div>
                <span className="text-sm font-semibold text-[#1c1b1b] block">
                  Minimum Advance Booking Notice
                </span>
                <span className="text-xs text-[#474554]">
                  Guarantees sufficient pre-session candidate dossier review time.
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {["1 hour", "2 hours", "4 hours", "24 hours"].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAdvanceNotice(val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      advanceNotice === val
                        ? "bg-[#5145cd] text-white shadow-xs"
                        : "border border-[#e7e7eb] bg-white text-[#474554] hover:bg-[#f6f3f2]"
                    }`}
                  >
                    {val} {val === "2 hours" && "(Recommended)"}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#777585]">
                Prevents unexpected same-hour booking intrusions.
              </p>
            </div>

            {/* Daily Session Cap & Reschedule Guardrail */}
            <div className="space-y-3">
              <div>
                <span className="text-sm font-semibold text-[#1c1b1b] block">
                  Daily Session Cap
                </span>
                <span className="text-xs text-[#474554]">
                  Caps daily slots to ensure uncompromised evaluation quality.
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#f6f3f2] border border-[#e7e7eb] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-[#5145cd]" />
                  <span className="text-sm font-bold text-[#1c1b1b] tabular-nums">
                    3 Sessions / Day
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#16834a] bg-[#eaf5ef] px-2 py-0.5 rounded border border-[#d1edd9]">
                  Enforced
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#f6f3f2] border border-[#e7e7eb] text-[11px] text-[#474554] leading-relaxed">
                <strong className="text-[#1c1b1b]">PRD §12.1 Guardrail:</strong> Full refund window opens &gt;1h prior to slot; 80% escrow protection applies if candidate no-shows.
              </div>
            </div>
          </div>
        </section>

        {/* 2.5 External Calendar Integration Desk */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-[#1c1b1b]">Calendar Synchronizations</h2>
            <p className="text-xs text-[#474554]">
              Bidirectional sync guarantees you never get booked when your corporate calendar is busy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Google Calendar (Connected) */}
            <div className="p-5 rounded-xl bg-white border border-[#16834a]/30 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#edf3fc] flex items-center justify-center text-[#2864c5]">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#1c1b1b] block">
                        Google Calendar
                      </span>
                      <span className="text-[11px] text-[#777585]">Primary Connected Calendar</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eaf5ef] text-[#16834a] border border-[#d1edd9]">
                    Connected
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#f6f3f2] border border-[#e7e7eb] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#1c1b1b] truncate">
                      vikram.singh@google.com
                    </span>
                    <span className="text-[11px] text-[#777585] tabular-nums">Sync token valid</span>
                  </div>
                  <div className="pt-2 border-t border-[#e7e7eb] text-xs text-[#474554] flex items-center justify-between">
                    <span>
                      Conflict Shield: <strong className="text-[#1c1b1b]">Auto-blocking 3 corporate holds this week</strong>
                    </span>
                    <ShieldCheck className="w-4 h-4 text-[#16834a]" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#e7e7eb] text-xs">
                <button
                  type="button"
                  onClick={handleSync}
                  className="font-semibold text-[#5145cd] hover:underline flex items-center gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>Re-sync Now</span>
                </button>
                <button
                  type="button"
                  className="font-medium text-[#474554] hover:text-[#1c1b1b]"
                >
                  Manage Permissions
                </button>
              </div>
            </div>

            {/* Microsoft Outlook / 365 (Available) */}
            <div className="p-5 rounded-xl bg-white border border-[#e7e7eb] shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#f0eded] flex items-center justify-center text-[#474554]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#1c1b1b] block">
                        Microsoft Outlook / 365
                      </span>
                      <span className="text-[11px] text-[#777585]">Secondary Corporate Account</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f0eded] text-[#777585]">
                    Not Connected
                  </span>
                </div>

                <div className="p-4 rounded-lg bg-[#f6f3f2] border border-dashed border-[#c8c4d6] text-center space-y-1">
                  <Link2 className="w-6 h-6 text-[#777585] mx-auto" />
                  <p className="text-xs text-[#474554]">
                    Connect Microsoft 365 or Outlook work calendar to automatically avoid internal corporate meeting collisions.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end pt-2 border-t border-[#e7e7eb]">
                <button
                  type="button"
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[#e7e7eb] bg-white text-xs font-semibold text-[#1c1b1b] hover:bg-[#f6f3f2] transition-colors shadow-xs"
                >
                  <Link2 className="w-3.5 h-3.5 text-[#5145cd]" />
                  <span>Connect Outlook Calendar</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2.6 Statutory Compliance & Escrow Protection Notice */}
        <footer className="p-4 rounded-xl bg-[#f6f3f2] border border-[#e7e7eb] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#474554]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#16834a] shrink-0" />
            <span>
              <strong className="text-[#1c1b1b] font-semibold">PRD §10.4 Guaranteed Atomic Hold:</strong> Slot reservations are held in atomic state. No candidate can confirm a session without prior 100% pre-funding into the Razorpay Nodal Escrow.
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium text-[#777585] shrink-0">
            <Link href="/terms" className="hover:text-[#5145cd] transition-colors">
              SLA Manual §11
            </Link>
            <span>•</span>
            <Link href="/refunds" className="hover:text-[#5145cd] transition-colors">
              Escrow Protection Protocol
            </Link>
          </div>
        </footer>
      </main>

      {/* 3. MODAL FOR ADDING CUSTOM TIME BLOCK */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#e7e7eb] space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#e7e7eb] pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#5145cd]" />
                <h3 className="font-bold text-base text-[#1c1b1b]">Add Availability Window</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#777585] hover:text-[#1c1b1b]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSlotSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#1c1b1b] block mb-1">
                  Select Day
                </label>
                <select
                  value={modalDay}
                  onChange={(e) => setModalDay(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#e7e7eb] bg-white focus:outline-none focus:border-[#5145cd]"
                >
                  {schedules.map((d) => (
                    <option key={d.day} value={d.day}>
                      {d.day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#1c1b1b] block mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={modalStartTime}
                    onChange={(e) => setModalStartTime(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-[#e7e7eb] bg-white focus:outline-none focus:border-[#5145cd]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1c1b1b] block mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={modalEndTime}
                    onChange={(e) => setModalEndTime(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-[#e7e7eb] bg-white focus:outline-none focus:border-[#5145cd]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1c1b1b] block mb-1">
                  Eligible Service Modules
                </label>
                <select
                  value={modalScope}
                  onChange={(e) => setModalScope(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#e7e7eb] bg-white focus:outline-none focus:border-[#5145cd]"
                >
                  <option value="S06 Technical Mock / S01 Resume Review">
                    S06 Technical Mock &amp; S01 Resume Review
                  </option>
                  <option value="S05 Behavioral STAR Framework">
                    S05 Behavioral STAR Framework Drill
                  </option>
                  <option value="S08 Salary Negotiation & ESOPs">
                    S08 Salary Negotiation &amp; ESOPs
                  </option>
                  <option value="Open for Direct Booking & Smart Match">
                    Open for All Approved Services
                  </option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#e7e7eb] text-xs font-medium text-[#474554] hover:bg-[#f6f3f2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#5145cd] text-white text-xs font-semibold hover:bg-[#3828b5] transition-all"
                >
                  Save Time Window
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
