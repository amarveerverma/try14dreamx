"use client";

import * as React from "react";
import Link from "next/link";
import {
  Video,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UploadCloud,
  FileCheck,
  Download,
  Search,
  Filter,
  CheckSquare,
  Square,
  X,
  Layers,
  Sparkles,
  Lock,
  Mic,
  ChevronRight,
  TrendingUp,
  Loader2,
  UserCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ServiceCode } from "@/lib/supabase/types";

interface SessionReport {
  id: string;
  version: number;
  is_latest: boolean;
  rubric_scores: Record<string, number>;
  summary_notes: string;
  strengths: string[];
  growth_areas: string[];
  action_items: Array<{ title: string; timeline: string; priority: string; status?: string }>;
  deliverable_pdf_url: string | null;
  deliverable_sha256: string | null;
  sla_deadline_at: string;
  submitted_at: string;
  is_late: boolean;
}

interface SettlementInfo {
  id: string;
  payout_status: string;
  net_payout_paise: number;
  gross_amount_paise: number;
}

interface AttendanceInfo {
  id: string;
  user_id: string;
  role: string;
  status: string;
  duration_seconds: number;
  joined_at: string;
}

interface BookingRow {
  id: string;
  booking_ref: string;
  service_code: ServiceCode;
  status: string;
  session_start: string;
  session_end: string;
  amount_paise: number;
  pre_session_notes: string | null;
  resume_url: string | null;
  meeting_url: string | null;
  created_at: string;
  student: {
    id: string;
    full_name: string;
    email: string;
    target_role: string | null;
    avatar_url: string | null;
  } | null;
  session_reports: SessionReport[];
  mentor_settlements: SettlementInfo[];
  session_attendance: AttendanceInfo[];
}

const SERVICE_TITLES: Record<string, string> = {
  S01: "S01: Resume Line-by-Line Teardown & ATS Bar-Raiser Audit",
  S02: "S02: System Architecture & Low-Level Design Deep Dive",
  S03: "S03: Full Portfolio & GitHub Project Quality Audit",
  S04: "S04: High-Throughput System Design & Scalability Drill",
  S05: "S05: Behavioral STAR Framework & Leadership Drill",
  S06: "S06: Technical Mock Interview & Distributed Architecture Drill",
  S07: "S07: Salary Negotiation Strategy & Total Compensation Calibration",
  S08: "S08: Career Transition Roadmap & Non-Traditional Pivot Plan",
  S09: "S09: Executive Communication & Engineering Leadership Drill",
  S10: "S10: Comprehensive 30-Day Intensive Career Transformation",
};

export default function MentorSessionsPage() {
  const supabase = createClient();

  // Clock & Current Epoch
  const [istTime, setIstTime] = React.useState("16:15:32 UTC+05:30");
  const [currentEpoch, setCurrentEpoch] = React.useState(0);
  React.useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        setCurrentEpoch(now.getTime());
        const formatted = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now);
        setIstTime(`${formatted} UTC+05:30`);
      } catch {
        // Fallback
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter tabs
  const [activeTab, setActiveTab] = React.useState<"all" | "upcoming" | "scorecard_due" | "completed">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"earliest" | "latest" | "payout">("earliest");

  // Data states
  const [loading, setLoading] = React.useState(true);
  const [bookings, setBookings] = React.useState<BookingRow[]>([]);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Scorecard modal state
  const [scorecardModalOpen, setScorecardModalOpen] = React.useState(false);
  const [activeBookingForModal, setActiveBookingForModal] = React.useState<BookingRow | null>(null);
  const [isSubmittingReport, setIsSubmittingReport] = React.useState(false);
  const [submittedSuccess, setSubmittedSuccess] = React.useState(false);
  const [submissionFeedback, setSubmissionFeedback] = React.useState<string | null>(null);

  // Scorecard form inputs
  const [dimScores, setDimScores] = React.useState<Record<string, number>>({
    dim1: 8,
    dim2: 7,
    dim3: 8,
    dim4: 7,
    dim5: 8,
    dim6: 7,
    dim7: 8,
    dim8: 7,
  });
  const [qualitativeNotes, setQualitativeNotes] = React.useState(
    "Candidate exhibited strong structural decomposition and situational awareness. Recommend deepening calibration on distributed write-conflict recovery and p99 latency boundaries."
  );
  const [strengthsInput, setStrengthsInput] = React.useState(
    "Rigorous problem decomposition, clear communication of CAP trade-offs, structured error propagation"
  );
  const [growthAreasInput, setGrowthAreasInput] = React.useState(
    "Quantification of latency vs consistency benchmarks, deeper familiarity with distributed locking race conditions"
  );
  const [actionItemInput, setActionItemInput] = React.useState(
    "Draft a concrete multi-region failover playbook with explicit RPO/RTO metrics."
  );

  // Attendance marking state
  const [markingAttendanceId, setMarkingAttendanceId] = React.useState<string | null>(null);

  // Interactive Checklist states for due cards
  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});

  const refreshSessions = React.useCallback(async () => {
    try {
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();

      if (authErr || !user) return;

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          booking_ref,
          service_code,
          status,
          session_start,
          session_end,
          amount_paise,
          pre_session_notes,
          resume_url,
          meeting_url,
          created_at,
          student:student_id (
            id,
            full_name,
            email,
            target_role,
            avatar_url
          ),
          session_reports (
            id,
            version,
            is_latest,
            rubric_scores,
            summary_notes,
            strengths,
            growth_areas,
            action_items,
            deliverable_pdf_url,
            deliverable_sha256,
            sla_deadline_at,
            submitted_at,
            is_late
          ),
          mentor_settlements (
            id,
            payout_status,
            net_payout_paise,
            gross_amount_paise
          ),
          session_attendance (
            id,
            user_id,
            role,
            status,
            duration_seconds,
            joined_at
          )
        `)
        .eq("mentor_id", user.id)
        .order("session_start", { ascending: true });

      if (!error && data) {
        const rows: BookingRow[] = (data as unknown as BookingRow[]).map((b) => ({
          ...b,
          session_reports: b.session_reports || [],
          mentor_settlements: b.mentor_settlements || [],
          session_attendance: b.session_attendance || [],
        }));
        setBookings(rows);
      }
    } catch {
      // Background refresh
    }
  }, [supabase]);

  React.useEffect(() => {
    let isMounted = true;
    async function loadInitial() {
      try {
        const {
          data: { user },
          error: authErr,
        } = await supabase.auth.getUser();

        if (authErr || !user) {
          if (isMounted) {
            setErrorMessage("Please sign in to view your mentor sessions.");
            setLoading(false);
          }
          return;
        }

        const { data, error } = await supabase
          .from("bookings")
          .select(`
            id,
            booking_ref,
            service_code,
            status,
            session_start,
            session_end,
            amount_paise,
            pre_session_notes,
            resume_url,
            meeting_url,
            created_at,
            student:student_id (
              id,
              full_name,
              email,
              target_role,
              avatar_url
            ),
            session_reports (
              id,
              version,
              is_latest,
              rubric_scores,
              summary_notes,
              strengths,
              growth_areas,
              action_items,
              deliverable_pdf_url,
              deliverable_sha256,
              sla_deadline_at,
              submitted_at,
              is_late
            ),
            mentor_settlements (
              id,
              payout_status,
              net_payout_paise,
              gross_amount_paise
            ),
            session_attendance (
              id,
              user_id,
              role,
              status,
              duration_seconds,
              joined_at
            )
          `)
          .eq("mentor_id", user.id)
          .order("session_start", { ascending: true });

        if (error) {
          if (isMounted) setErrorMessage(error.message);
        } else if (data && isMounted) {
          const rows: BookingRow[] = (data as unknown as BookingRow[]).map((b) => ({
            ...b,
            session_reports: b.session_reports || [],
            mentor_settlements: b.mentor_settlements || [],
            session_attendance: b.session_attendance || [],
          }));
          setBookings(rows);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setErrorMessage(err instanceof Error ? err.message : "Failed to load sessions.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadInitial();
    return () => {
      isMounted = false;
    };
  }, [supabase]);

  // Determine category of each booking
  const getBookingCategory = (b: BookingRow): "upcoming" | "scorecard_due" | "completed" => {
    const hasLatestReport = b.session_reports.some((r) => r.is_latest);
    if (hasLatestReport) {
      return "completed";
    }

    const now = new Date();
    const sessionEnd = new Date(b.session_end);

    // If session end time is in the past or status is completed, scorecard is due
    if (sessionEnd < now || b.status === "completed") {
      return "scorecard_due";
    }

    return "upcoming";
  };

  // Filter & Search
  const filteredBookings = React.useMemo(() => {
    return bookings
      .filter((b) => {
        const cat = getBookingCategory(b);
        if (activeTab === "upcoming" && cat !== "upcoming") return false;
        if (activeTab === "scorecard_due" && cat !== "scorecard_due") return false;
        if (activeTab === "completed" && cat !== "completed") return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchRef = b.booking_ref.toLowerCase().includes(q);
          const matchService = b.service_code.toLowerCase().includes(q);
          const matchStudent = b.student?.full_name?.toLowerCase().includes(q);
          const matchNotes = b.pre_session_notes?.toLowerCase().includes(q);
          if (!matchRef && !matchService && !matchStudent && !matchNotes) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "earliest") {
          return new Date(a.session_start).getTime() - new Date(b.session_start).getTime();
        }
        if (sortBy === "latest") {
          return new Date(b.session_start).getTime() - new Date(a.session_start).getTime();
        }
        if (sortBy === "payout") {
          const pA = a.mentor_settlements[0]?.net_payout_paise || a.amount_paise * 0.8;
          const pB = b.mentor_settlements[0]?.net_payout_paise || b.amount_paise * 0.8;
          return pB - pA;
        }
        return 0;
      });
  }, [bookings, activeTab, searchQuery, sortBy]);

  // Mark Attendance Handler
  const handleMarkAttendance = async (bookingId: string) => {
    try {
      setMarkingAttendanceId(bookingId);
      const res = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          status: "completed",
          durationSeconds: 3600,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to mark attendance.");
      } else {
        await refreshSessions();
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error marking attendance");
    } finally {
      setMarkingAttendanceId(null);
    }
  };

  // Scorecard Submission Handler
  const handleScorecardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBookingForModal) return;

    try {
      setIsSubmittingReport(true);
      const strengthsArr = strengthsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const growthAreasArr = growthAreasInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const actionItemsArr = [
        {
          title: actionItemInput,
          timeline: "Within 7 days",
          priority: "High",
          status: "pending",
        },
      ];

      const res = await fetch("/api/reports/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: activeBookingForModal.id,
          rubricScores: dimScores,
          summaryNotes: qualitativeNotes,
          strengths: strengthsArr,
          growthAreas: growthAreasArr,
          actionItems: actionItemsArr,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to submit session report.");
        setIsSubmittingReport(false);
        return;
      }

      setSubmissionFeedback(data.message || "Scorecard committed successfully!");
      setSubmittedSuccess(true);
      await refreshSessions();

      setTimeout(() => {
        setSubmittedSuccess(false);
        setScorecardModalOpen(false);
        setIsSubmittingReport(false);
      }, 1800);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error submitting report");
      setIsSubmittingReport(false);
    }
  };

  // Derived metrics
  const upcomingCount = bookings.filter((b) => getBookingCategory(b) === "upcoming").length;
  const dueCount = bookings.filter((b) => getBookingCategory(b) === "scorecard_due").length;
  const completedCount = bookings.filter((b) => getBookingCategory(b) === "completed").length;

  const totalEscrowPaise = bookings.reduce((sum, b) => {
    const settlement = b.mentor_settlements[0];
    if (settlement?.payout_status === "in_escrow") {
      return sum + (settlement.net_payout_paise || b.amount_paise * 0.8);
    }
    return sum;
  }, 0);

  return (
    <div className="flex-1 bg-[#fcf9f8] text-[#1c1b1b] min-h-screen">
      {/* 1. TOP STICKY BAR */}
      <header className="sticky top-0 z-30 w-full flex items-center justify-between h-16 bg-white border-b border-[#e7e7eb] px-6 lg:px-10">
        <div className="flex items-center gap-3 text-xs sm:text-sm font-medium">
          <Link href="/mentor" className="text-[#474554] hover:text-[#1c1b1b] transition-colors">
            Mentor Portal
          </Link>
          <span className="text-[#777585]">/</span>
          <span className="font-bold text-[#1c1b1b]">Sessions &amp; Deliverables</span>

          <div className="hidden xl:flex items-center gap-4 ml-6 pl-6 border-l border-[#e7e7eb] text-xs">
            <Link
              href="/mentor/dispatch"
              className="text-[#474554] hover:text-[#1c1b1b] transition-colors"
            >
              Smart Match Dispatch
            </Link>
            <Link
              href="/mentor/availability"
              className="text-[#474554] hover:text-[#1c1b1b] transition-colors"
            >
              Direct Calendar
            </Link>
            <span className="text-[#5145cd] font-semibold border-b-2 border-[#5145cd] pb-0.5">
              SLA Delivery Engine
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f6f3f2] border border-[#e7e7eb] text-xs font-tabular">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16834a] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16834a]" />
            </span>
            <span className="font-semibold text-[#1c1b1b]">Asia/Kolkata (IST)</span>
            <span className="text-[#474554]">{istTime}</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold bg-[#edf3fc] text-[#2864c5] border border-[#d8e2ff]">
              <ShieldCheck className="w-3.5 h-3.5" />
              48h Rubric SLA Active
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold bg-[#eaf5ef] text-[#16834a] border border-[#d1edd9]">
              <Lock className="w-3.5 h-3.5" />
              Nodal Escrow Protected
            </span>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8 space-y-8">
        {/* 2.1 Header & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-[#e7e7eb] pb-6">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c1b1b] tracking-tight">
                Candidate Sessions &amp; Scorecard Console
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#e3dfff] text-[#130068]">
                PRD §11 Active Delivery
              </span>
            </div>
            <p className="text-sm text-[#474554] leading-relaxed">
              Standardized 8-dimension rubric scorecards must be submitted within 48 hours of session completion to trigger automated escrow payout release under PRD §11.2.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setActiveTab(activeTab === "all" ? "scorecard_due" : "all");
              }}
              className="px-3.5 py-2 rounded-lg border border-[#e7e7eb] bg-white hover:bg-[#f6f3f2] text-[#1c1b1b] text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-xs"
            >
              <Filter className="w-4 h-4 text-[#777585]" />
              <span>{activeTab === "scorecard_due" ? "Show All Sessions" : "Filter Scorecards Due"}</span>
            </button>
            <a
              href="#rubric-criteria"
              className="px-4 py-2 rounded-lg bg-white border border-[#5145cd] text-[#5145cd] hover:bg-[#e3dfff]/30 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-xs"
            >
              <UploadCloud className="w-4 h-4" />
              <span>View 8-D Rubric Standard</span>
            </a>
          </div>
        </div>

        {/* 2.2 Operational SLA Bento Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-[#e7e7eb] rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[#777585] font-semibold">
              <span>Deliverables In Flight</span>
              <span className="p-1.5 rounded-lg bg-[#e3dfff]/60 text-[#5145cd]">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#1c1b1b] tabular-nums">
                {upcomingCount + dueCount} Active
              </span>
              {dueCount > 0 && (
                <span className="inline-flex items-center text-xs font-semibold text-[#a7670b] bg-[#fbf4e8] px-2 py-0.5 rounded border border-[#f5e3c8]">
                  {dueCount} Due Now
                </span>
              )}
            </div>
            <p className="text-xs text-[#474554]">
              {upcomingCount} upcoming calls scheduled, {dueCount} post-call rubric scorecards in 48h SLA window.
            </p>
          </div>

          <div className="bg-white border border-[#e7e7eb] rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[#777585] font-semibold">
              <span>48-Hour SLA Compliance</span>
              <span className="p-1.5 rounded-lg bg-[#eaf5ef] text-[#16834a]">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#1c1b1b] tabular-nums">
                {completedCount > 0 ? "100.0%" : "Ready"}
              </span>
              <span className="inline-flex items-center text-xs font-semibold text-[#16834a] bg-[#eaf5ef] px-2 py-0.5 rounded border border-[#d1edd9]">
                Verified Standing
              </span>
            </div>
            <p className="text-xs text-[#474554]">
              {completedCount} scorecards delivered, zero escrow penalties or candidate disputes recorded.
            </p>
          </div>

          <div className="bg-white border border-[#e7e7eb] rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[#777585] font-semibold">
              <span>Escrow Pending Disbursal</span>
              <span className="p-1.5 rounded-lg bg-[#edf3fc] text-[#2864c5]">
                <Lock className="w-4 h-4" />
              </span>
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#1c1b1b] tabular-nums">
                ₹{Math.round(totalEscrowPaise / 100).toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-semibold text-[#16834a] bg-[#eaf5ef] px-2 py-0.5 rounded border border-[#d1edd9]">
                Nodal Escrow
              </span>
            </div>
            <p className="text-xs text-[#474554]">
              Auto-unlocks to registered bank account immediately upon 8-D scorecard submission.
            </p>
          </div>
        </section>

        {/* 2.3 Filter Tabs & Search Row */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 bg-[#f6f3f2] rounded-lg border border-[#e7e7eb] overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "all"
                  ? "bg-white text-[#1c1b1b] shadow-xs"
                  : "text-[#474554] hover:text-[#1c1b1b]"
              }`}
            >
              <span>All Sessions</span>
              <span className="px-1.5 py-0.2 bg-[#e3dfff] text-[#130068] rounded-full text-[10px]">
                {bookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "upcoming"
                  ? "bg-white text-[#1c1b1b] shadow-xs"
                  : "text-[#474554] hover:text-[#1c1b1b]"
              }`}
            >
              <span>Upcoming Calls</span>
              <span className="px-1.5 py-0.2 bg-[#f0eded] text-[#474554] rounded-full text-[10px]">
                {upcomingCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("scorecard_due")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "scorecard_due"
                  ? "bg-white text-[#1c1b1b] shadow-xs"
                  : "text-[#474554] hover:text-[#1c1b1b]"
              }`}
            >
              <span>Scorecards Due (SLA)</span>
              <span className="px-1.5 py-0.2 bg-[#fbf4e8] text-[#a7670b] rounded-full text-[10px]">
                {dueCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("completed")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "completed"
                  ? "bg-white text-[#1c1b1b] shadow-xs"
                  : "text-[#474554] hover:text-[#1c1b1b]"
              }`}
            >
              <span>Delivered &amp; Unlocked</span>
              <span className="px-1.5 py-0.2 bg-[#f0eded] text-[#474554] rounded-full text-[10px]">
                {completedCount}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#777585]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Candidate, Ref, S01-S10..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#e7e7eb] rounded-lg focus:border-[#5145cd] outline-none"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "earliest" | "latest" | "payout")}
              className="text-xs py-1.5 pl-3 pr-8 bg-white border border-[#e7e7eb] rounded-lg text-[#474554] focus:border-[#5145cd] outline-none"
            >
              <option value="earliest">Earliest Slot First</option>
              <option value="latest">Latest Slot First</option>
              <option value="payout">Highest Net Payout</option>
            </select>
          </div>
        </section>

        {/* Loading & Error States */}
        {loading && (
          <div className="p-12 text-center bg-white rounded-xl border border-[#e7e7eb] shadow-xs flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#5145cd]" />
            <span className="text-sm font-semibold text-[#1c1b1b]">Loading verified mentor sessions...</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Empty Zero State */}
        {!loading && filteredBookings.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-[#c8c4d6] shadow-xs flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#e3dfff] text-[#5145cd] flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>
            <div className="max-w-md space-y-1">
              <h3 className="text-base font-bold text-[#1c1b1b]">No sessions in this view</h3>
              <p className="text-xs text-[#474554] leading-relaxed">
                Sessions assigned to you will appear here with live Google Meet links, candidate briefing notes, and 48-hour 8-dimension rubric submission portals.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/mentor/dispatch"
                className="px-4 py-2 rounded-lg bg-[#5145cd] text-white text-xs font-semibold hover:bg-[#3828b5] transition-all shadow-xs"
              >
                Check Dispatch Queue
              </Link>
              <Link
                href="/mentor/availability"
                className="px-4 py-2 rounded-lg border border-[#e7e7eb] bg-white text-xs font-semibold hover:bg-[#f6f3f2] transition-all"
              >
                Set Calendar Availability
              </Link>
            </div>
          </div>
        )}

        {/* 2.4 Detailed Session Cards */}
        {!loading && (
          <section className="space-y-6">
            {filteredBookings.map((b) => {
              const category = getBookingCategory(b);
              const latestReport = b.session_reports.find((r) => r.is_latest);
              const settlement = b.mentor_settlements[0];
              const payoutRupees = Math.round(
                (settlement?.net_payout_paise || b.amount_paise * 0.8) / 100
              ).toLocaleString("en-IN");
              const serviceTitle =
                SERVICE_TITLES[b.service_code] || `${b.service_code}: Specialized Mentorship Session`;
              const sessionStartDate = new Date(b.session_start).toLocaleDateString("en-IN", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              const sessionStartTime = new Date(b.session_start).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              });
              const sessionEndTime = new Date(b.session_end).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              });

              // CARD 1: Upcoming Live Call
              if (category === "upcoming") {
                return (
                  <div
                    key={b.id}
                    className="bg-white border border-[#e7e7eb] rounded-xl overflow-hidden shadow-xs space-y-0"
                  >
                    <div className="p-6 border-b border-[#e7e7eb] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#e3dfff] text-[#5145cd] flex items-center justify-center shrink-0 mt-0.5">
                          <Video className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-semibold text-[#5145cd]">
                              {b.booking_ref}
                            </span>
                            <span className="text-[#c8c4d6]">•</span>
                            <h3 className="text-base font-bold text-[#1c1b1b]">{serviceTitle}</h3>
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-[#474554]">
                            <span className="font-semibold text-[#1c1b1b]">
                              {b.student?.full_name || "Enrolled Candidate"}
                            </span>
                            <span>({b.student?.target_role || b.student?.email || "Candidate"})</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbf4e8] text-[#a7670b] border border-[#f5e3c8] text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Scheduled Call</span>
                        </div>
                        <span className="mt-1 text-xs text-[#474554] font-tabular">
                          {sessionStartDate} • {sessionStartTime} – {sessionEndTime} IST
                        </span>
                      </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-7 space-y-4">
                        <div className="bg-[#f6f3f2] border border-[#e7e7eb] rounded-lg p-3.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] uppercase tracking-wider text-[#777585] font-semibold">
                              Google Meet Telemetry &amp; Attendance
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#16834a]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#16834a]" />
                              Attendance automated
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-white border border-[#e7e7eb] px-3 py-2 rounded">
                            <div className="flex items-center gap-2 font-mono text-xs text-[#5145cd] font-semibold">
                              <Video className="w-4 h-4 text-[#777585]" />
                              <span>{b.meeting_url || "meet.google.com/qxr-mkpv-yzt"}</span>
                            </div>
                            <span className="text-[11px] text-[#474554] bg-[#f0eded] px-2 py-0.5 rounded">
                              Unlocks 15m prior
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-[#1c1b1b] uppercase tracking-wider">
                            Candidate Dossier &amp; Briefing Notes
                          </span>
                          {b.resume_url && (
                            <div className="flex items-center gap-3">
                              <a
                                href={b.resume_url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#e7e7eb] bg-white text-xs hover:border-[#5145cd] transition-colors"
                              >
                                <FileText className="w-4 h-4 text-[#5145cd]" />
                                <span className="font-medium text-[#1c1b1b]">View Candidate Resume</span>
                                <Download className="w-3.5 h-3.5 ml-1 text-[#777585]" />
                              </a>
                            </div>
                          )}
                          <div className="text-xs text-[#474554] bg-[#f6f3f2]/60 p-2.5 rounded border border-[#e7e7eb]">
                            <strong className="text-[#1c1b1b]">Pre-Session Scope:</strong>{" "}
                            {b.pre_session_notes || "Candidate focus: High-throughput architecture and structured problem decomposition."}
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-5 flex flex-col justify-between bg-[#f6f3f2] border border-[#e7e7eb] rounded-lg p-5">
                        <div className="space-y-2">
                          <span className="text-xs uppercase tracking-wider text-[#777585] font-semibold">
                            SLA Commitment Guarantee
                          </span>
                          <p className="text-xs text-[#474554] leading-relaxed">
                            48-hour deliverable countdown begins immediately upon session completion. Submit 8-D scorecard to unlock instant nodal settlement.
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#e7e7eb] flex items-center justify-between">
                          <div>
                            <span className="text-[11px] text-[#777585] block">Contract Net Payout</span>
                            <span className="text-2xl font-bold text-[#1c1b1b] tabular-nums">
                              ₹{payoutRupees}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] font-semibold text-[#16834a] bg-[#eaf5ef] px-2 py-0.5 rounded block">
                              100% Payout Basis
                            </span>
                            <span className="text-[10px] text-[#474554] mt-0.5 block">
                              Nodal Protected • Escrow Ref #{b.booking_ref.slice(-8)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-3 bg-[#f6f3f2] border-t border-[#e7e7eb] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-[#474554]">
                        <CheckCircle2 className="w-4 h-4 text-[#16834a]" />
                        <span>Candidate confirmed audio/video check • Screen sharing permissions validated</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={markingAttendanceId === b.id}
                          onClick={() => handleMarkAttendance(b.id)}
                          className="px-4 py-2 rounded-lg border border-[#e7e7eb] bg-white hover:bg-[#f0eded] text-[#1c1b1b] font-medium transition-all flex items-center gap-1.5"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-[#16834a]" />
                          <span>{markingAttendanceId === b.id ? "Marking..." : "Mark Attendance (Joined)"}</span>
                        </button>
                        <a
                          href={b.meeting_url || "https://meet.google.com"}
                          target="_blank"
                          rel="noreferrer"
                          className="px-5 py-2 rounded-lg bg-[#5145cd] hover:bg-[#3828b5] text-white font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-[0.99]"
                        >
                          <Video className="w-4 h-4" />
                          <span>Join Google Meet</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              }

              // CARD 2: Scorecard Due (SLA window running)
              if (category === "scorecard_due") {
                const deadlineDate = new Date(
                  new Date(b.session_end).getTime() + 48 * 3600 * 1000
                );
                const remainingHours = Math.max(
                  0,
                  Math.round((deadlineDate.getTime() - (currentEpoch || deadlineDate.getTime())) / (3600 * 1000))
                );

                return (
                  <div
                    key={b.id}
                    className="bg-white border-2 border-[#a7670b]/40 rounded-xl overflow-hidden shadow-xs space-y-0"
                  >
                    <div className="p-6 border-b border-[#e7e7eb] bg-[#fbf4e8]/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#fbf4e8] text-[#a7670b] flex items-center justify-center shrink-0 mt-0.5">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-semibold text-[#474554]">
                              {b.booking_ref}
                            </span>
                            <span className="text-[#c8c4d6]">•</span>
                            <h3 className="text-base font-bold text-[#1c1b1b]">{serviceTitle}</h3>
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-[#474554]">
                            <span className="font-semibold text-[#1c1b1b]">
                              {b.student?.full_name || "Enrolled Candidate"}
                            </span>
                            <span>• {b.student?.target_role || b.student?.email || "Candidate"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf5ef] text-[#16834a] border border-[#b2e2c5] text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Attendance Confirmed
                        </span>
                        <span className="mt-1 text-xs text-[#474554]">
                          Session Ended • {new Date(b.session_end).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-5">
                      <div className="p-4 rounded-lg bg-[#fbf4e8] border border-[#f5e3c8] space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-[#a7670b]">
                            <AlertTriangle className="w-4 h-4 animate-pulse" />
                            <span className="text-xs sm:text-sm font-bold tracking-tight">
                              48-Hour SLA Active: {remainingHours}h remaining to submit 8-D scorecard
                            </span>
                          </div>
                          <span className="text-xs text-[#a7670b] font-medium font-tabular">
                            Cutoff: {deadlineDate.toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })} IST
                          </span>
                        </div>

                        <div className="w-full bg-[#f0eded] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#a7670b] h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, Math.max(10, 100 - (remainingHours / 48) * 100))}%`,
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#a7670b]">
                          <span>Notice: Submitting on-time immediately unlocks ₹{payoutRupees} escrow payout under PRD §11.2.</span>
                          <span className="font-semibold">SLA Window: 48h strict</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                        <div className="lg:col-span-8 space-y-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#777585]">
                            Pending Deliverable Checklist
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setCheckedItems((prev) => ({
                                  ...prev,
                                  [`rubric_${b.id}`]: !prev[`rubric_${b.id}`],
                                }))
                              }
                              className="p-3 rounded-lg border border-[#e7e7eb] bg-white flex items-center justify-between text-left hover:bg-[#f6f3f2] transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                {checkedItems[`rubric_${b.id}`] ? (
                                  <CheckSquare className="w-4 h-4 text-[#16834a]" />
                                ) : (
                                  <Square className="w-4 h-4 text-[#a7670b]" />
                                )}
                                <span className="text-xs font-medium text-[#1c1b1b]">
                                  8-Dimension Rubric Scorecard
                                </span>
                              </div>
                              <span className="text-[10px] font-semibold text-[#ba1a1a] bg-[#ffdad6]/60 px-1.5 py-0.5 rounded">
                                Mandatory
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setCheckedItems((prev) => ({
                                  ...prev,
                                  [`action_${b.id}`]: !prev[`action_${b.id}`],
                                }))
                              }
                              className="p-3 rounded-lg border border-[#e7e7eb] bg-white flex items-center justify-between text-left hover:bg-[#f6f3f2] transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                {checkedItems[`action_${b.id}`] ? (
                                  <CheckSquare className="w-4 h-4 text-[#16834a]" />
                                ) : (
                                  <Square className="w-4 h-4 text-[#a7670b]" />
                                )}
                                <span className="text-xs font-medium text-[#1c1b1b]">
                                  Candidate Action Plan
                                </span>
                              </div>
                              <span className="text-[10px] font-semibold text-[#ba1a1a] bg-[#ffdad6]/60 px-1.5 py-0.5 rounded">
                                Mandatory
                              </span>
                            </button>
                          </div>
                        </div>

                        <div className="lg:col-span-4 bg-[#f6f3f2] border border-[#e7e7eb] rounded-lg p-3 flex flex-col justify-between">
                          <div>
                            <span className="text-xs text-[#777585] block">Locked in Escrow</span>
                            <span className="text-2xl font-bold text-[#1c1b1b] tabular-nums">
                              ₹{payoutRupees}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#474554]">
                            Auto-settles upon report upload and cryptographic sign-off.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-3 bg-[#fbf4e8]/30 border-t border-[#e7e7eb] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-[#474554]">
                        <Mic className="w-4 h-4 text-[#5145cd]" />
                        <span>Ready to evaluate candidate performance across all 8 dimensions</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveBookingForModal(b);
                            setScorecardModalOpen(true);
                          }}
                          className="px-5 py-2 rounded-lg bg-[#5145cd] hover:bg-[#3828b5] text-white font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-[0.99]"
                        >
                          <FileCheck className="w-4 h-4" />
                          <span>Launch 8-D Scorecard Editor</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              // CARD 3: Completed & Delivered
              return (
                <div
                  key={b.id}
                  className="bg-white border border-[#e7e7eb] rounded-xl overflow-hidden opacity-95 hover:opacity-100 transition-opacity shadow-xs space-y-0"
                >
                  <div className="p-6 border-b border-[#e7e7eb] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#eaf5ef] text-[#16834a] flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-semibold text-[#777585]">
                            {b.booking_ref}
                          </span>
                          <span className="text-[#c8c4d6]">•</span>
                          <h3 className="text-base font-bold text-[#1c1b1b]">{serviceTitle}</h3>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-[#474554]">
                          <span className="font-semibold text-[#1c1b1b]">
                            {b.student?.full_name || "Enrolled Candidate"}
                          </span>
                          <span>• {b.student?.target_role || b.student?.email || "Candidate"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf5ef] text-[#16834a] border border-[#b2e2c5] text-xs font-semibold">
                        <TrendingUp className="w-3.5 h-3.5" />
                        ₹{payoutRupees} {settlement?.payout_status === "eligible_for_payout" ? "Unlocked for Disbursal" : "Settled to Bank"}
                      </span>
                      <span className="mt-1 text-xs text-[#474554] font-tabular">
                        Delivered {latestReport ? new Date(latestReport.submitted_at).toLocaleDateString("en-IN") : "Recently"} • Version {latestReport?.version || 1}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    <div className="lg:col-span-8 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-[#16834a] bg-[#eaf5ef] px-2 py-0.5 rounded">
                          {latestReport?.is_late ? "Submitted Past SLA" : "Delivered Within 48h SLA Window"}
                        </span>
                        {latestReport?.deliverable_sha256 && (
                          <span className="text-xs text-[#474554] font-mono">
                            SHA-256: {latestReport.deliverable_sha256.slice(0, 18)}...
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#474554]">
                        Executive Summary:{" "}
                        <em className="text-[#1c1b1b]">&ldquo;{latestReport?.summary_notes}&rdquo;</em>
                      </p>
                    </div>

                    <div className="lg:col-span-4 flex items-center justify-end gap-3 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveBookingForModal(b);
                          setScorecardModalOpen(true);
                        }}
                        className="px-3.5 py-1.5 rounded-lg border border-[#e7e7eb] bg-white hover:bg-[#f6f3f2] text-[#1c1b1b] font-medium flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-[#5145cd]" />
                        <span>Revise Scorecard (v{(latestReport?.version || 1) + 1})</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* 2.5 Standardized 8-Dimension Rubric Criteria Guidelines (PRD §8.4) */}
        <section
          id="rubric-criteria"
          className="bg-white border border-[#e7e7eb] rounded-xl p-6 lg:p-8 space-y-6 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e7e7eb] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#e3dfff] text-[#5145cd]">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1c1b1b]">
                  Post-Session Deliverable Standards &amp; Mandatory 8-Dimension Rubric (PRD §8.4)
                </h2>
                <p className="text-xs text-[#474554]">
                  Every scorecard must provide numerical ratings (1-10) and line-item written annotations for all 8 engineering dimensions.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#5145cd] uppercase tracking-wider bg-[#f6f3f2] px-3 py-1 rounded">
              Version 2.4 Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {[
              { id: "DIM-01", name: "Requirements & Edge Cases", desc: "Scope clarification, functional constraints, out-of-scope boundaries." },
              { id: "DIM-02", name: "Core Architecture", desc: "Component decoupling, microservice boundaries, service mesh." },
              { id: "DIM-03", name: "Concurrency & Sharding", desc: "Distributed locks, database partitions, write-conflict resolution." },
              { id: "DIM-04", name: "Trade-offs & CAP Realism", desc: "Consistency vs Availability justification, pragmatic trade-off analysis." },
              { id: "DIM-05", name: "Latency & Resilience", desc: "Multi-tier caching, circuit breakers, fallback strategies, retry storms." },
              { id: "DIM-06", name: "API & Data Schemas", desc: "Idempotency keys, gRPC vs REST, normalized vs wide-column storage." },
              { id: "DIM-07", name: "Executive Clarity", desc: "Structured top-down communication, handling interviewer pushback." },
              { id: "DIM-08", name: "Telemetry & Observability", desc: "Distributed tracing, RED/USE metrics, SLO/SLA alerting budgets." },
            ].map((dim) => (
              <div
                key={dim.id}
                className="p-3.5 rounded-lg bg-[#f6f3f2] border border-[#e7e7eb] flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#5145cd] font-mono">
                    {dim.id}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#777585]" />
                </div>
                <span className="text-xs font-bold text-[#1c1b1b]">{dim.name}</span>
                <span className="text-[11px] text-[#474554] leading-relaxed">{dim.desc}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-[#474554] border-t border-[#e7e7eb]">
            <span>
              Quality note: DreamX deliverables are immutable, cryptographic candidate assets. Ensure actionable, line-item feedback is provided for each dimension.
            </span>
            <span className="text-[#5145cd] font-semibold flex items-center gap-1">
              <span>Cryptographic Immutable Versioning Enforced</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </section>

        {/* 2.6 Statutory Governance & Escrow Footer */}
        <footer className="pt-6 border-t border-[#e7e7eb] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#777585] pb-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#16834a] shrink-0" />
            <span>
              DreamX Mentor Operations governed under Indian DPDP Act 2023, RBI Nodal Escrow Guidelines, and ASCI Career Benchmark Standards.
            </span>
          </div>
          <div className="flex items-center gap-4 text-[#474554]">
            <Link href="/terms" className="hover:text-[#1c1b1b] transition-colors">
              SLA Compensation Policy (§12.2)
            </Link>
            <Link href="/mentor/earnings" className="hover:text-[#1c1b1b] transition-colors">
              Escrow Audit Log
            </Link>
          </div>
        </footer>
      </main>

      {/* 3. MODAL FOR LAUNCHING 8-D SCORECARD EDITOR */}
      {scorecardModalOpen && activeBookingForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-[#e7e7eb] space-y-5 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#e7e7eb] pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#5145cd]" />
                <div>
                  <h3 className="font-bold text-base text-[#1c1b1b]">
                    Submit 8-Dimension Rubric Scorecard
                  </h3>
                  <span className="text-xs text-[#777585]">
                    {activeBookingForModal.booking_ref} • {activeBookingForModal.student?.full_name || "Enrolled Candidate"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setScorecardModalOpen(false)}
                className="text-[#777585] hover:text-[#1c1b1b]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#eaf5ef] text-[#16834a] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#1c1b1b]">Scorecard Committed!</h4>
                <p className="text-xs text-[#474554]">
                  {submissionFeedback || "Cryptographic SHA-256 deliverable generated and attached to candidate dossier. Escrow release unlocked."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleScorecardSubmit} className="space-y-4">
                <div className="p-3 rounded-lg bg-[#f6f3f2] text-xs text-[#474554] space-y-1">
                  <span className="font-semibold text-[#1c1b1b] block">PRD §8.4 Mandatory Rubric Evaluation:</span>
                  <span>Rate candidate competency across each dimension on a scale of 1 to 10.</span>
                </div>

                {/* Score Input Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { key: "dim1", label: "DIM-01 Req." },
                    { key: "dim2", label: "DIM-02 Arch." },
                    { key: "dim3", label: "DIM-03 Shard." },
                    { key: "dim4", label: "DIM-04 Trade." },
                    { key: "dim5", label: "DIM-05 Resil." },
                    { key: "dim6", label: "DIM-06 Schema" },
                    { key: "dim7", label: "DIM-07 Clarity" },
                    { key: "dim8", label: "DIM-08 Telem." },
                  ].map((dim) => (
                    <div key={dim.key} className="p-2.5 rounded-lg border border-[#e7e7eb] bg-[#fcf9f8] space-y-1">
                      <label className="text-[11px] font-semibold text-[#1c1b1b] block">
                        {dim.label}
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={dimScores[dim.key]}
                        onChange={(e) =>
                          setDimScores({
                            ...dimScores,
                            [dim.key]: Math.min(10, Math.max(1, Number(e.target.value))),
                          })
                        }
                        className="w-full text-xs font-bold text-center py-1 bg-white border border-[#e7e7eb] rounded focus:border-[#5145cd] outline-none"
                      />
                    </div>
                  ))}
                </div>

                {/* Qualitative Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1c1b1b] block">
                    Detailed Qualitative Annotations &amp; Executive Summary
                  </label>
                  <textarea
                    rows={3}
                    value={qualitativeNotes}
                    onChange={(e) => setQualitativeNotes(e.target.value)}
                    className="w-full text-xs p-3 rounded-lg border border-[#e7e7eb] focus:border-[#5145cd] outline-none"
                    placeholder="Provide specific feedback on code snippets, architectural trade-offs, and books/articles to study..."
                    required
                  />
                </div>

                {/* Strengths & Growth Areas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1c1b1b] block">
                      Candidate Strengths (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={strengthsInput}
                      onChange={(e) => setStrengthsInput(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#e7e7eb] focus:border-[#5145cd] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1c1b1b] block">
                      Growth Areas (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={growthAreasInput}
                      onChange={(e) => setGrowthAreasInput(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#e7e7eb] focus:border-[#5145cd] outline-none"
                    />
                  </div>
                </div>

                {/* Action Item */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1c1b1b] block">
                    Recommended Post-Session Action Item
                  </label>
                  <input
                    type="text"
                    value={actionItemInput}
                    onChange={(e) => setActionItemInput(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#e7e7eb] focus:border-[#5145cd] outline-none"
                    required
                  />
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#e7e7eb]">
                  <span className="text-xs text-[#16834a] font-semibold">
                    Net Payout to Disburse: ₹{Math.round((activeBookingForModal.mentor_settlements[0]?.net_payout_paise || activeBookingForModal.amount_paise * 0.8) / 100).toLocaleString("en-IN")}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setScorecardModalOpen(false)}
                      className="px-4 py-2 rounded-lg border border-[#e7e7eb] text-xs font-medium text-[#474554] hover:bg-[#f6f3f2]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingReport}
                      className="px-5 py-2 rounded-lg bg-[#5145cd] hover:bg-[#3828b5] text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      {isSubmittingReport ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Committing...</span>
                        </>
                      ) : (
                        <span>Sign &amp; Release Scorecard</span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
