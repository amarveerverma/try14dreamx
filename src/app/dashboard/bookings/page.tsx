"use client";

import * as React from "react";
import Link from "next/link";

type BookingFilterTab = "all" | "upcoming" | "in_progress" | "completed" | "cancelled";

interface BookingItem {
  id: string;
  ref: string;
  serviceCode: string;
  serviceName: string;
  mentorName: string;
  mentorRole: string;
  mentorAvatar: string;
  mentorRating: string;
  mentorStats: string;
  mentorBadge: string;
  status: "upcoming" | "in_progress" | "completed" | "cancelled";
  amount: number;
  originalAmount?: number;
  escrowStatus: string;
  dateStr: string;
  timeStr: string;
  unlockTime?: string;
  googleCalSynced: boolean;
  agendaItems: string[];
  deliverableAudit?: {
    turnaround: string;
    auditHash: string;
    score: string;
    scoreLabel: string;
    impact: string;
    pdfName: string;
  };
  meetingUrl?: string;
  canCancel: boolean;
  cancellationDeadline?: string;
}

const INITIAL_BOOKINGS: BookingItem[] = [
  {
    id: "bk-1",
    ref: "DX-BK-90241",
    serviceCode: "SERVICE S06",
    serviceName: "Technical Mock Interview & Distributed Concurrency Drill",
    mentorName: "Vikramaditya Rao",
    mentorRole: "Lead AI/ML Architect • Ex-Swiggy, Flipkart Backend",
    mentorAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBpF51LRr27m1jrWugkkhbEAechQtKfChiuAL_m_TCLJm0JTs618T9CpkiaDV2uftZWKRKqlTxIsDYZoUicsZ2lV-uawBCcWBvMo4exsYoLbwZWJoVu9lK5LQ2UJ9UTczf3kEt5Ax0gEM6MyZRg7fdwyJAu4x0Ydm4yawN9qwwoHZgKR16xcQYtcVAk7-dr8S0pRcxO1lDMeEeVvHHZmUMijp_e4bYEjSR_53koTY5v",
    mentorRating: "4.96",
    mentorStats: "142 Mock Interviews Cleared",
    mentorBadge: "Tier-1 Bar Raiser",
    status: "upcoming",
    amount: 999,
    escrowStatus: "FUNDED_HOLD",
    dateStr: "Tomorrow, 25 Oct 2024",
    timeStr: "07:30 PM – 08:30 PM IST",
    unlockTime: "18h 45m",
    googleCalSynced: true,
    agendaItems: [
      "Kafka Partition Rebalancing, Redlock Distributed Mutex, and Sharding Schema Drill.",
      "Candidate Resume: Rohan_Backend_SDE2.pdf (1.4MB)",
    ],
    canCancel: true,
    cancellationDeadline: "Tomorrow, 25 Oct at 06:30 PM IST",
  },
  {
    id: "bk-2",
    ref: "DX-BK-91884",
    serviceCode: "SERVICE S08",
    serviceName: "Salary Negotiation & ESOP Valuation Strategy",
    mentorName: "Arishta Sengupta",
    mentorRole: "Principal Engineering Manager • Ex-Flipkart, Zomato",
    mentorAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3Ch4q5Yu56AlYjoqvRW7uQyxv2Ac8od38Ax3rBQn99nyQd-caLo-8cyT7l8vWBrrvn8MeqbHYBG6jyAfnGYo47ho47KVUvIL1nyBVTfWURsNrkFlrnohjmNel3EsEM8ywvsdvdCQHYgYayNFZ0RX95NfJpAyQxqSYC1IRJuV-9e_9xJ7Sd_9haafC_fQ2Ov-j-9GBhDNVZmOOUT-K13elFqxNuhGwG7eeFWRMnfHF",
    mentorRating: "5.00",
    mentorStats: "Over ₹3.8 Cr Total Comp Negotiated",
    mentorBadge: "Smart Match Wave 1",
    status: "upcoming",
    amount: 664,
    originalAmount: 699,
    escrowStatus: "FUNDED_HOLD",
    dateStr: "Monday, 28 Oct 2024",
    timeStr: "06:00 PM – 06:30 PM IST",
    unlockTime: "3d 21h",
    googleCalSynced: true,
    agendaItems: [
      "SDE-2 Bangalore Market Banding (₹32L – ₹44L CTC benchmarks).",
      "Liquidity event discounting and Series C vs Public RSUs trade-off model.",
    ],
    canCancel: true,
    cancellationDeadline: "Monday, 28 Oct at 05:00 PM IST",
  },
  {
    id: "bk-3",
    ref: "DX-BK-88402",
    serviceCode: "SERVICE S05",
    serviceName: "Behavioral STAR Framework & Leadership Drill",
    mentorName: "Siddharth Iyer",
    mentorRole: "Director of Engineering, Gojek • Tier-1 Bar Raiser",
    mentorAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-6Boim2n1G8wSM4Swruj12cC671MBvPdM0IKLUrypnomIL6LB2XWJpU4m2Nyoq1_6ckjrgHYS8lL4GHZojHRHb30dcTH31fdm4CVnorlbLfhC4_Jb3XliiHSmccIzbwQ-M8wzVxRPqis45-K7htJYnCcYH4db1HwMNOUz50nW3IJdlcXmQVZky-rgGJMz1K-DGXmAYF2vZz6edWnqmYrp7CBH2vQnyOYZ1lIz4xIi",
    mentorRating: "4.92",
    mentorStats: "96 Behavioral Drills Conducted",
    mentorBadge: "Ex-Bar Raiser",
    status: "completed",
    amount: 799,
    escrowStatus: "SETTLED_RELEASED",
    dateStr: "Conducted on 23 Oct 2024",
    timeStr: "Duration: 58 mins verified",
    googleCalSynced: true,
    agendaItems: ["STAR Framework Mastery", "Conflict Resolution in High-Throughput Outages"],
    deliverableAudit: {
      turnaround: "Delivered in 41 hrs (Met 48h SLA)",
      auditHash: "#0x9a8f2",
      score: "7.8 / 10",
      scoreLabel: "Validated STAR Scorecard",
      impact: "+8 pts to 8-D Matrix",
      pdfName: "S05_STAR_Scorecard_DX-BK-88402.pdf",
    },
    canCancel: false,
  },
  {
    id: "bk-4",
    ref: "DX-BK-86119",
    serviceCode: "SERVICE S01",
    serviceName: "Resume Review & ATS Bar-Raiser Audit",
    mentorName: "Priya Nair",
    mentorRole: "Ex-Amazon Bar Raiser • Senior Technical Recruiter",
    mentorAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDxKyD7EpqOVet8kYv-7dwBUe2sVhs1W1e3_imbVScnG06CWvupNyrEhe1Z0Zy26bvA8nqzVzHxiAoXh-Yf4WBDkoCcfaFBW7bNKACwWL-RrYcXSejZFzqIVFSoPN81hqUthHae8pXijf2tE8OSJq41P7ddELXdp--gD1sRY45ptoHWhhkyWkeWjHe9Ya6EWGndfJbslPfazM7PU_wO-rD-tyRMlc1P_GRpwOJsFtT3",
    mentorRating: "4.98",
    mentorStats: "210+ Resume Line Audits",
    mentorBadge: "Bar Raiser",
    status: "completed",
    amount: 599,
    escrowStatus: "SETTLED_RELEASED",
    dateStr: "Conducted on 18 Oct 2024",
    timeStr: "Duration: 45 mins",
    googleCalSynced: true,
    agendaItems: ["Line-by-line Google XYZ bullet rewrite", "ATS parser optimization for Greenhouse"],
    deliverableAudit: {
      turnaround: "Delivered in 34 hrs (Fast Turnaround)",
      auditHash: "#0x4f19b",
      score: "8.4 / 10",
      scoreLabel: "ATS Compatibility Index",
      impact: "ATS Tier-1 Ready (+6 pts)",
      pdfName: "S01_ATS_Audit_DX-BK-86119.pdf",
    },
    canCancel: false,
  },
];

export default function CandidateBookingsPage() {
  const [activeTab, setActiveTab] = React.useState<BookingFilterTab>("upcoming");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortOption, setSortOption] = React.useState("nearest");
  const [bookings, setBookings] = React.useState<BookingItem[]>(INITIAL_BOOKINGS);
  const [cancelingBooking, setCancelingBooking] = React.useState<BookingItem | null>(null);
  const [cancelSuccessMsg, setCancelSuccessMsg] = React.useState("");
  const [syncFeedback, setSyncFeedback] = React.useState("");

  // Counts
  const counts = React.useMemo(() => {
    return {
      all: bookings.length,
      upcoming: bookings.filter((b) => b.status === "upcoming").length,
      in_progress: bookings.filter((b) => b.status === "in_progress").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    };
  }, [bookings]);

  // Filtered & Sorted bookings
  const filteredBookings = React.useMemo(() => {
    return bookings.filter((b) => {
      if (activeTab === "upcoming" && b.status !== "upcoming") return false;
      if (activeTab === "in_progress" && b.status !== "in_progress") return false;
      if (activeTab === "completed" && b.status !== "completed") return false;
      if (activeTab === "cancelled" && b.status !== "cancelled") return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          b.serviceName.toLowerCase().includes(q) ||
          b.mentorName.toLowerCase().includes(q) ||
          b.ref.toLowerCase().includes(q) ||
          b.serviceCode.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [bookings, activeTab, searchQuery]);

  const handleCancelBooking = (booking: BookingItem) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, status: "cancelled", escrowStatus: "REFUNDED_100" } : b))
    );
    setCancelingBooking(null);
    setCancelSuccessMsg(
      `Booking ${booking.ref} cancelled successfully. 100% refund (₹${booking.amount}) initiated via Razorpay Nodal Escrow.`
    );
    setTimeout(() => setCancelSuccessMsg(""), 6000);
  };

  const handleSyncIcal = () => {
    setSyncFeedback("Syncing with Google Calendar via DreamX Meet API...");
    setTimeout(() => {
      setSyncFeedback("Calendar synchronized! 2 active sessions confirmed in Google Calendar.");
      setTimeout(() => setSyncFeedback(""), 4000);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full bg-surface min-h-screen">
      {/* Top Highlight Bar / Context Breadcrumb */}
      <div className="w-full bg-surface-container-low border-b border-outline-variant/20 px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 text-on-surface-variant font-medium">
          <Link href="/dashboard" className="hover:text-primary transition-colors">
            Dashboard
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-semibold">My Bookings &amp; Escrow Management</span>
          <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold tracking-wide uppercase">
            PRD v3.0 Certified
          </span>
          <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-medium">
            Razorpay Nodal Custody
          </span>
        </div>

        <div className="flex items-center gap-3 text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span>Automated SLA Enforcement: <strong className="text-on-surface">Active</strong></span>
          </span>
          <span className="text-outline-variant">|</span>
          <span>Escrow Engine ID: <code className="font-mono text-primary font-bold">NODAL-RZP-99214</code></span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-8">
        {/* Hero / Title Section with Balance Overview */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="flex flex-col gap-1 max-w-2xl">
            <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Candidate Protection Guaranteed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight font-heading">
              My Bookings &amp; Escrow Protection
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Deterministic session lifecycles, verified calendar synchronization, atomic Razorpay Nodal Escrow holds, and automated 48-hour deliverable SLA enforcement.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-end">
            <button
              type="button"
              onClick={handleSyncIcal}
              className="px-3.5 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-semibold text-xs border border-outline-variant/30 shadow-xs hover:bg-surface-container transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">calendar_add_on</span>
              <span>Sync External iCal</span>
            </button>

            <Link href="/services">
              <button
                type="button"
                className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-xs hover:bg-primary-container transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Book New Service (S01–S10)</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Feedback Alerts */}
        {syncFeedback && (
          <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">sync</span>
            <span>{syncFeedback}</span>
          </div>
        )}

        {cancelSuccessMsg && (
          <div className="p-4 rounded-xl bg-secondary-container/30 border border-secondary/30 text-secondary text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{cancelSuccessMsg}</span>
          </div>
        )}

        {/* 1. Escrow Ledger Summary Metrics (4 Bento Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Active Escrow Balance */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Locked in Escrow
              </span>
              <div className="w-8 h-8 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight font-heading flex items-baseline gap-1">
                <span>₹1,663</span>
                <span className="text-xs text-on-surface-variant font-normal">INR</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-secondary font-semibold">
                <span className="material-symbols-outlined text-[14px]">format_image_left</span>
                <span>2 Sessions Protected (PRD §13.1)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Released to Mentors */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Completed &amp; Released
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">payments</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight font-heading flex items-baseline gap-1">
                <span>₹1,398</span>
                <span className="text-xs text-on-surface-variant font-normal">settled</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px] text-secondary">task_alt</span>
                <span>2 Signed Deliverables Approved</span>
              </div>
            </div>
          </div>

          {/* Card 3: SLA Turnaround Compliance */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Deliverable SLA Track
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container-high text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">timer</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-secondary tracking-tight font-heading">
                100%
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-on-surface-variant">
                <span className="font-bold text-on-surface">Avg. 37.5 hrs</span>
                <span>vs. 48h SLA cap</span>
              </div>
            </div>
          </div>

          {/* Card 4: Statutory Refund Policy Pill */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Candidate Rights
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container-high text-tertiary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">policy</span>
              </div>
            </div>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-on-surface">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <span><strong>100% Refund:</strong> ≥1h prior</span>
              </div>
              <div className="flex items-center gap-1.5 text-on-surface">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span><strong>80% Auto-Refund:</strong> Late deliverable</span>
              </div>
              <p className="text-[11px] text-on-surface-variant pt-1">
                Direct reverse payment to source account
              </p>
            </div>
          </div>
        </div>

        {/* 2. Filter Bar & Navigation Tabs */}
        <div className="bg-surface-container-lowest rounded-2xl p-2 sm:p-2.5 border border-outline-variant/30 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-primary-container text-on-primary font-bold shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              All Bookings ({counts.all})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "upcoming"
                  ? "bg-primary-container text-on-primary font-bold shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              Upcoming &amp; Escrow Locked ({counts.upcoming})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("in_progress")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "in_progress"
                  ? "bg-primary-container text-on-primary font-bold shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              In Progress / Deliverable Due ({counts.in_progress})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("completed")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "completed"
                  ? "bg-primary-container text-on-primary font-bold shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              Completed &amp; Scorecards Ready ({counts.completed})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cancelled")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "cancelled"
                  ? "bg-primary-container text-on-primary font-bold shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              Cancelled / Refunded ({counts.cancelled})
            </button>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-2 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Mentor, Service ID, Ref..."
                className="w-full h-8 pl-9 pr-3 rounded-lg bg-surface-container-low text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="h-8 pl-3 pr-7 rounded-lg bg-surface-container-low text-xs text-on-surface font-semibold focus:outline-none appearance-none cursor-pointer"
              >
                <option value="nearest">Nearest Session First</option>
                <option value="highest">Highest Escrow Value</option>
                <option value="recent">Recently Booked</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1.5 text-[18px] pointer-events-none text-on-surface-variant">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* 3. Section 1: Active Upcoming Bookings (Grid) */}
        {(activeTab === "all" || activeTab === "upcoming") && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">event_upcoming</span>
                <h2 className="text-lg font-bold text-on-surface tracking-tight font-heading">
                  Active Upcoming Sessions
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                  {counts.upcoming} Under Atomic Hold
                </span>
              </div>
              <span className="text-xs text-on-surface-variant">
                Real-time meeting sync powered by Google Meet API
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredBookings
                .filter((b) => b.status === "upcoming")
                .map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden flex flex-col justify-between"
                  >
                    {/* Header Strip */}
                    <div className="p-5 flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-mono font-bold text-[10px]">
                              {booking.serviceCode}
                            </span>
                            <span className="text-xs text-on-surface-variant font-mono">
                              Ref: <span className="font-semibold text-on-surface">{booking.ref}</span>
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-on-surface font-heading mt-1">
                            {booking.serviceName}
                          </h3>
                        </div>

                        <div className="flex flex-col items-end shrink-0">
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
                            <span className="material-symbols-outlined text-[15px]">verified_user</span>
                            <span>₹{booking.amount} Locked</span>
                          </div>
                          {booking.originalAmount && (
                            <span className="text-[10px] text-on-surface-variant mt-0.5 line-through">
                              List: ₹{booking.originalAmount} (5% Pro Credit)
                            </span>
                          )}
                          <span className="text-[10px] text-on-surface-variant mt-0.5 font-mono">
                            Escrow State: {booking.escrowStatus}
                          </span>
                        </div>
                      </div>

                      {/* Mentor Profile Snippet */}
                      <div className="flex items-center gap-3.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-surface-container shrink-0">
                          <img
                            src={booking.mentorAvatar}
                            alt={booking.mentorName}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-secondary flex items-center justify-center text-on-secondary text-[8px] font-bold">
                            ✓
                          </span>
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-on-surface truncate">
                              {booking.mentorName}
                            </span>
                            <span className="px-1.5 py-0.2 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-semibold">
                              {booking.mentorBadge}
                            </span>
                          </div>
                          <span className="text-xs text-on-surface-variant truncate">
                            {booking.mentorRole}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-on-surface-variant">
                            <span className="flex items-center gap-0.5 text-secondary font-bold">
                              <span className="material-symbols-outlined text-[13px]">star</span>
                              {booking.mentorRating}
                            </span>
                            <span>•</span>
                            <span>{booking.mentorStats}</span>
                          </div>
                        </div>
                      </div>

                      {/* Time & Telemetry */}
                      <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col gap-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2 font-bold text-on-surface">
                            <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
                            <span>{booking.dateStr}</span>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container-lowest text-on-surface font-mono text-[12px] font-bold">
                            <span className="material-symbols-outlined text-[15px] text-primary">schedule</span>
                            <span>{booking.timeStr}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
                            </span>
                            <span className="text-on-surface">
                              Session unlocks in: <strong className="text-primary font-mono">{booking.unlockTime}</strong>
                            </span>
                          </div>
                          <span className="flex items-center gap-1 text-[11px] text-secondary font-semibold">
                            <span className="material-symbols-outlined text-[13px]">sync</span>
                            Synced to Google Cal
                          </span>
                        </div>
                      </div>

                      {/* Agenda & Pre-Session Materials */}
                      <div className="flex flex-col gap-1.5 text-xs">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                          Pre-Configured Scope &amp; Target Rubric
                        </span>
                        <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1.5">
                          {booking.agendaItems.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-on-surface leading-relaxed">
                              <span className="material-symbols-outlined text-[15px] text-primary shrink-0 mt-0.5">
                                {idx === 0 ? "terminal" : "description"}
                              </span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* PRD §12 Compliance Policy */}
                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 text-[11px] text-on-surface-variant">
                        <span className="material-symbols-outlined text-[15px] text-secondary shrink-0 mt-0.5">
                          gavel
                        </span>
                        <span>
                          <strong>PRD §12.1 Compliance:</strong> 100% full instant refund active until{" "}
                          <strong>{booking.cancellationDeadline}</strong> (exactly 60 mins prior to start).
                        </span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-5 py-3.5 bg-surface-container-low border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex items-center gap-1.5">
                        {booking.canCancel && (
                          <button
                            type="button"
                            onClick={() => setCancelingBooking(booking)}
                            className="px-2.5 py-1.5 rounded-lg text-error hover:bg-error-container text-xs font-semibold transition-colors"
                          >
                            Cancel Session (100% Refund)
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setSyncFeedback(`Reschedule request initiated for ${booking.ref}. Check your email.`)}
                          className="px-2.5 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container text-xs font-semibold transition-colors"
                        >
                          Reschedule
                        </button>
                      </div>

                      <button
                        type="button"
                        disabled
                        className="px-3.5 py-2 rounded-xl bg-surface-container-high text-on-surface-variant cursor-not-allowed text-xs font-bold flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[15px]">lock</span>
                        <span>Join Google Meet (Unlocks 15m prior)</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 4. Section 2: Completed Deliverables & Settlement Audits */}
        {(activeTab === "all" || activeTab === "completed") && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">assignment_turned_in</span>
                <h2 className="text-lg font-bold text-on-surface tracking-tight font-heading">
                  Completed Deliverables &amp; Settlement Audits
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-bold">
                  {counts.completed} Completed &amp; Settled
                </span>
              </div>
              <span className="text-xs text-on-surface-variant">All scorecards are digitally signed and immutable</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredBookings
                .filter((b) => b.status === "completed")
                .map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs p-5 flex flex-col justify-between gap-4"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono font-bold text-[10px]">
                              {booking.serviceCode}
                            </span>
                            <span className="text-xs text-on-surface-variant font-mono">
                              Ref: <span className="font-semibold text-on-surface">{booking.ref}</span>
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-on-surface font-heading mt-1">
                            {booking.serviceName}
                          </h3>
                        </div>

                        <span className="px-2.5 py-1 rounded-full bg-surface-container text-secondary text-xs font-bold uppercase tracking-wider shrink-0">
                          Settled • ₹{booking.amount}
                        </span>
                      </div>

                      {/* Mentor Details */}
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-surface-container overflow-hidden shrink-0">
                          <img
                            src={booking.mentorAvatar}
                            alt={booking.mentorName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col text-xs">
                          <span className="font-bold text-on-surface">{booking.mentorName}</span>
                          <span className="text-[11px] text-on-surface-variant">{booking.mentorRole}</span>
                          <span className="text-[10px] text-on-surface-variant mt-0.5">
                            {booking.dateStr} • {booking.timeStr}
                          </span>
                        </div>
                      </div>

                      {/* Deliverable Audit Badge */}
                      {booking.deliverableAudit && (
                        <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 text-secondary font-semibold">
                              <span className="material-symbols-outlined text-[16px]">check_circle</span>
                              <span>{booking.deliverableAudit.turnaround}</span>
                            </span>
                            <span className="font-mono text-on-surface-variant text-[11px]">
                              Audit Hash: {booking.deliverableAudit.auditHash}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-on-surface-variant uppercase font-medium">
                                {booking.deliverableAudit.scoreLabel}
                              </span>
                              <span className="text-xl font-black text-on-surface font-heading">
                                {booking.deliverableAudit.score}
                              </span>
                            </div>

                            <span className="px-2.5 py-1 rounded-lg bg-secondary-container text-on-secondary-container text-xs font-bold">
                              {booking.deliverableAudit.impact}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Download & View Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs">
                      <div className="flex items-center gap-2">
                        <Link href="/dashboard/reports">
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[16px]">download</span>
                            <span>Signed PDF</span>
                          </button>
                        </Link>
                        <Link href="/dashboard/readiness">
                          <button
                            type="button"
                            className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-medium flex items-center gap-1 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">code</span>
                            <span>JSON</span>
                          </button>
                        </Link>
                      </div>

                      <Link
                        href="/dashboard/reports"
                        className="text-primary hover:underline font-bold flex items-center gap-1"
                      >
                        <span>View Full Report</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 5. Section 3: The DreamX Nodal Escrow & SLA Blueprint (Interactive Architecture Panel) */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">account_balance</span>
                <h2 className="text-lg sm:text-xl font-bold text-on-surface font-heading">
                  The DreamX Nodal Escrow &amp; SLA Blueprint
                </h2>
              </div>
              <p className="text-xs text-on-surface-variant">
                Zero-risk candidate protection architecture. Your funds are never released to mentors until verifiable proof of delivery passes automated QA.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>RBI Compliant Escrow</span>
              </span>
            </div>
          </div>

          {/* 4-Step Visual Process Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant uppercase font-bold">Pre-Payment</span>
              </div>
              <h4 className="text-sm font-bold text-on-surface font-heading">Atomic Razorpay Hold</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Funds captured directly into dedicated Nodal Escrow account. Mentors have 0% access to funds during booking.
              </p>
              <div className="mt-auto pt-2 flex items-center gap-1 text-[11px] text-secondary font-bold">
                <span className="material-symbols-outlined text-[14px]">shield</span>
                <span>Protected 100%</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant uppercase font-bold">Live Session</span>
              </div>
              <h4 className="text-sm font-bold text-on-surface font-heading">Attendance Telemetry</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Google Meet API automatically logs joins, departures, and active talk-time. 90% attendance minimum verified deterministically.
              </p>
              <div className="mt-auto pt-2 flex items-center gap-1 text-[11px] text-primary font-bold">
                <span className="material-symbols-outlined text-[14px]">sensors</span>
                <span>Real-time Audit</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant uppercase font-bold">Post-Session</span>
              </div>
              <h4 className="text-sm font-bold text-on-surface font-heading">48h Deliverable SLA</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Mentor must upload rubric scorecard &amp; action plan within 48h. If missed, 80% auto-refund issues back to candidate instantly.
              </p>
              <div className="mt-auto pt-2 flex items-center gap-1 text-[11px] text-error font-bold">
                <span className="material-symbols-outlined text-[14px]">auto_mode</span>
                <span>Strict SLA Trigger</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary text-xs flex items-center justify-center font-bold">
                  4
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant uppercase font-bold">Settlement</span>
              </div>
              <h4 className="text-sm font-bold text-on-surface font-heading">Mutual Release</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Candidate downloads signed rubric. Escrow unlocks and releases mentor payout post 48-hour dispute resolution window.
              </p>
              <div className="mt-auto pt-2 flex items-center gap-1 text-[11px] text-secondary font-bold">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>Zero Disputes</span>
              </div>
            </div>
          </div>

          {/* Concierge Support Footnote */}
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[20px]">support_agent</span>
              <div className="flex flex-col text-xs">
                <span className="font-bold text-on-surface">Concierge SLA Escrow Support</span>
                <span className="text-on-surface-variant">
                  Live coordinator available. In-session emergencies responded within 15 minutes.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => alert("Connecting you with DreamX Escrow Concierge desk...")}
              className="px-3.5 py-2 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface font-semibold text-xs border border-outline-variant/30 shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[16px]">headset_mic</span>
              <span>Contact Escrow Concierge</span>
            </button>
          </div>
        </div>

        {/* 6. Regulatory & ASCI Footnote */}
        <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant border-t border-outline-variant/20">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>© 2024 DreamX Platform Pvt. Ltd.</span>
            <span>•</span>
            <span>All financial transactions stored in integer paise (₹1 = 100 paise)</span>
            <span>•</span>
            <span>Nodal Account Partner: Razorpay Software Ltd.</span>
          </div>
          <div className="flex items-center gap-3 font-semibold">
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Escrow</Link>
            <span>•</span>
            <Link href="/refunds" className="hover:text-primary transition-colors">SLA Dispute Policy (§16.3)</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-primary transition-colors">ASCI Disclosure</Link>
          </div>
        </div>
      </div>

      {/* CANCELLATION MODAL */}
      {cancelingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl border border-outline-variant/30 shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-error">
                <span className="material-symbols-outlined text-[24px]">cancel</span>
                <h3 className="text-lg font-bold text-on-surface font-heading">Cancel Booking</h3>
              </div>
              <button
                type="button"
                onClick={() => setCancelingBooking(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Are you sure you want to cancel <strong className="text-on-surface">{cancelingBooking.serviceName}</strong> with{" "}
              <strong className="text-on-surface">{cancelingBooking.mentorName}</strong>?
            </p>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1 text-xs">
              <span className="font-bold text-on-surface">100% Instant Escrow Refund:</span>
              <span className="text-secondary font-bold text-sm">₹{cancelingBooking.amount} to source account</span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">
                Eligible under PRD §12.1 (cancelled &gt;60 mins prior to start time).
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCancelingBooking(null)}
                className="px-4 py-2 rounded-xl border border-outline-variant/30 text-xs font-semibold hover:bg-surface-container"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={() => handleCancelBooking(cancelingBooking)}
                className="px-4 py-2 rounded-xl bg-error text-on-error text-xs font-bold hover:opacity-90 shadow-xs"
              >
                Confirm 100% Refund Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
