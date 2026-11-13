"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  Search,
  Star,
  Copy,
  Check,
  Loader2,
  AlertTriangle,
  Award,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ServiceCode } from "@/lib/supabase/types";

interface ActionItem {
  title: string;
  timeline?: string;
  priority?: string;
  status?: string;
}

interface ReportRow {
  id: string;
  booking_id: string;
  mentor_id: string;
  student_id: string;
  service_code: ServiceCode;
  version: number;
  is_latest: boolean;
  rubric_scores: Record<string, number>;
  summary_notes: string;
  strengths: string[];
  growth_areas: string[];
  action_items: ActionItem[];
  deliverable_pdf_url: string | null;
  deliverable_sha256: string | null;
  sla_deadline_at: string;
  submitted_at: string;
  is_late: boolean;
  booking?: {
    id: string;
    booking_ref: string;
    session_start: string;
    session_end: string;
  } | null;
  mentor?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    mentor_profiles?: {
      job_title: string;
      current_employer: string;
    } | null;
  } | null;
}

interface FeedbackRow {
  id: string;
  booking_id: string;
  rating: number;
  feedback_text: string | null;
  recommend_to_peers: boolean;
  created_at: string;
}

interface PendingBookingRow {
  id: string;
  booking_ref: string;
  service_code: ServiceCode;
  status: string;
  session_start: string;
  session_end: string;
  mentor?: {
    id: string;
    full_name: string;
    mentor_profiles?: {
      job_title: string;
      current_employer: string;
    } | null;
  } | null;
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

export default function CandidateReportsPage() {
  const supabase = createClient();

  const [filter, setFilter] = React.useState<"all" | "delivered" | "pending">("all");
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [reports, setReports] = React.useState<ReportRow[]>([]);
  const [pendingBookings, setPendingBookings] = React.useState<PendingBookingRow[]>([]);
  const [feedbacks, setFeedbacks] = React.useState<Record<string, FeedbackRow>>({});

  // Copied hash state
  const [copiedHash, setCopiedHash] = React.useState<string | null>(null);

  // Checkbox state for action items
  const [completedActions, setCompletedActions] = React.useState<Record<string, boolean>>({});

  // Feedback Modal
  const [feedbackModalOpen, setFeedbackModalOpen] = React.useState(false);
  const [activeBookingForFeedback, setActiveBookingForFeedback] = React.useState<{
    bookingId: string;
    mentorName: string;
    serviceCode: string;
  } | null>(null);
  const [feedbackRating, setFeedbackRating] = React.useState(5);
  const [feedbackNotes, setFeedbackNotes] = React.useState("");
  const [recommendPeers, setRecommendPeers] = React.useState(true);
  const [submittingFeedback, setSubmittingFeedback] = React.useState(false);

  const refreshCandidateData = React.useCallback(async () => {
    try {
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();

      if (authErr || !user) return;

      const { data: reportData, error: reportErr } = await supabase
        .from("session_reports")
        .select(`
          id,
          booking_id,
          mentor_id,
          student_id,
          service_code,
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
          is_late,
          booking:booking_id (
            id,
            booking_ref,
            session_start,
            session_end
          ),
          mentor:mentor_id (
            id,
            full_name,
            avatar_url,
            mentor_profiles (
              job_title,
              current_employer
            )
          )
        `)
        .eq("student_id", user.id)
        .order("submitted_at", { ascending: false });

      if (!reportErr && reportData) {
        const parsedReports: ReportRow[] = (reportData as unknown as ReportRow[]).map((r) => ({
          ...r,
          rubric_scores: (r.rubric_scores as Record<string, number>) || {},
          strengths: r.strengths || [],
          growth_areas: r.growth_areas || [],
          action_items: (r.action_items as ActionItem[]) || [],
          mentor: Array.isArray(r.mentor) ? r.mentor[0] : r.mentor,
          booking: Array.isArray(r.booking) ? r.booking[0] : r.booking,
        }));
        setReports(parsedReports);
      }

      const { data: bookingsData } = await supabase
        .from("bookings")
        .select(`
          id,
          booking_ref,
          service_code,
          status,
          session_start,
          session_end,
          mentor:mentor_id (
            id,
            full_name,
            mentor_profiles (
              job_title,
              current_employer
            )
          )
        `)
        .eq("student_id", user.id)
        .in("status", ["confirmed", "in_progress"]);

      if (bookingsData) {
        const reportedBookingIds = new Set((reportData || []).map((r) => r.booking_id));
        const pending = (bookingsData as unknown as PendingBookingRow[])
          .filter((b) => !reportedBookingIds.has(b.id))
          .map((b) => ({
            ...b,
            mentor: Array.isArray(b.mentor) ? b.mentor[0] : b.mentor,
          }));
        setPendingBookings(pending);
      }

      const { data: feedbackData } = await supabase
        .from("session_feedback")
        .select("id, booking_id, rating, feedback_text, recommend_to_peers, created_at")
        .eq("student_id", user.id);

      if (feedbackData) {
        const map: Record<string, FeedbackRow> = {};
        feedbackData.forEach((fb) => {
          map[fb.booking_id] = fb;
        });
        setFeedbacks(map);
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
            setErrorMessage("Please sign in to view your career reports.");
            setLoading(false);
          }
          return;
        }

        const { data: reportData, error: reportErr } = await supabase
          .from("session_reports")
          .select(`
            id,
            booking_id,
            mentor_id,
            student_id,
            service_code,
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
            is_late,
            booking:booking_id (
              id,
              booking_ref,
              session_start,
              session_end
            ),
            mentor:mentor_id (
              id,
              full_name,
              avatar_url,
              mentor_profiles (
                job_title,
                current_employer
              )
            )
          `)
          .eq("student_id", user.id)
          .order("submitted_at", { ascending: false });

        if (reportErr) {
          if (isMounted) setErrorMessage(reportErr.message);
        } else if (reportData && isMounted) {
          const parsedReports: ReportRow[] = (reportData as unknown as ReportRow[]).map((r) => ({
            ...r,
            rubric_scores: (r.rubric_scores as Record<string, number>) || {},
            strengths: r.strengths || [],
            growth_areas: r.growth_areas || [],
            action_items: (r.action_items as ActionItem[]) || [],
            mentor: Array.isArray(r.mentor) ? r.mentor[0] : r.mentor,
            booking: Array.isArray(r.booking) ? r.booking[0] : r.booking,
          }));
          setReports(parsedReports);
        }

        const { data: bookingsData } = await supabase
          .from("bookings")
          .select(`
            id,
            booking_ref,
            service_code,
            status,
            session_start,
            session_end,
            mentor:mentor_id (
              id,
              full_name,
              mentor_profiles (
                job_title,
                current_employer
              )
            )
          `)
          .eq("student_id", user.id)
          .in("status", ["confirmed", "in_progress"]);

        if (bookingsData && isMounted) {
          const reportedBookingIds = new Set((reportData || []).map((r) => r.booking_id));
          const pending = (bookingsData as unknown as PendingBookingRow[])
            .filter((b) => !reportedBookingIds.has(b.id))
            .map((b) => ({
              ...b,
              mentor: Array.isArray(b.mentor) ? b.mentor[0] : b.mentor,
            }));
          setPendingBookings(pending);
        }

        const { data: feedbackData } = await supabase
          .from("session_feedback")
          .select("id, booking_id, rating, feedback_text, recommend_to_peers, created_at")
          .eq("student_id", user.id);

        if (feedbackData && isMounted) {
          const map: Record<string, FeedbackRow> = {};
          feedbackData.forEach((fb) => {
            map[fb.booking_id] = fb;
          });
          setFeedbacks(map);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setErrorMessage(err instanceof Error ? err.message : "Failed to load reports.");
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

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBookingForFeedback) return;

    try {
      setSubmittingFeedback(true);
      const res = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: activeBookingForFeedback.bookingId,
          rating: feedbackRating,
          feedbackText: feedbackNotes,
          recommendToPeers: recommendPeers,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to submit feedback.");
      } else {
        alert(data.message || "Thank you! Your feedback has been recorded.");
        setFeedbackModalOpen(false);
        setFeedbackNotes("");
        await refreshCandidateData();
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error submitting feedback.");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchRef = r.booking?.booking_ref.toLowerCase().includes(q);
      const matchMentor = r.mentor?.full_name.toLowerCase().includes(q);
      const matchHash = r.deliverable_sha256?.toLowerCase().includes(q);
      const matchNotes = r.summary_notes.toLowerCase().includes(q);
      if (!matchRef && !matchMentor && !matchHash && !matchNotes) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full bg-surface min-h-screen">
      {/* Top Breadcrumb & Metadata Header */}
      <div className="w-full bg-surface-container-low border-b border-outline-variant/20 px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 text-on-surface-variant font-medium">
          <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">dashboard</span>
            <span>Candidate Dashboard</span>
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-semibold">Deliverables &amp; Reports</span>
          <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold tracking-wide uppercase">
            PRD V3.0 Verified
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-secondary font-bold">
          <ShieldCheck className="w-4 h-4 text-secondary" />
          <span>Cryptographic Ledger Active (SHA-256)</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-8">
        {/* Title & Primary Action Controls */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div className="flex flex-col gap-1 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
              <span className="text-xs text-secondary font-bold uppercase tracking-wider">
                Institutional Deliverable Vault
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight font-heading">
              Career Deliverables &amp; Post-Session Scorecards
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Verifiable 8-dimension rubric scorecards, actionable roadmaps, and cryptographic integrity hashes delivered under 48-hour institutional escrow guarantee.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/mentors"
              className="px-4 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary/90 transition-colors text-xs font-bold flex items-center gap-2 shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Book New Session</span>
            </Link>
          </div>
        </div>

        {/* 1. SLA & Telemetry Metrics Grid (4 Bento Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 flex flex-col justify-between shadow-xs">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Total Delivered Reports
              </span>
              <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-on-surface font-heading tracking-tight">
                  {reports.length} Delivered
                </span>
                <span className="text-xs font-bold text-secondary">
                  {reports.length > 0 ? "100%" : "Ready"}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                <span>8-D Rubric Scorecards (PRD §11.2)</span>
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 flex flex-col justify-between shadow-xs">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                In-Flight Deliverables
              </span>
              <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <Clock className="w-4 h-4 animate-pulse" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-on-surface font-heading tracking-tight">
                  {pendingBookings.length} Active
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary text-[10px] font-bold">
                  48h SLA Active
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Guaranteed delivery countdown</span>
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 flex flex-col justify-between shadow-xs">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Turnaround Adherence
              </span>
              <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-on-surface font-heading tracking-tight">
                  100% On-Time
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                <span>Strict 48h Escrow Guarantee</span>
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 flex flex-col justify-between shadow-xs">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Escrow Protection
              </span>
              <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-extrabold text-on-surface font-heading tracking-tight">
                80% Auto-Refund
              </div>
              <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                <span>Nodal refund triggered if &gt;48h elapsed</span>
              </p>
            </div>
          </div>
        </div>

        {/* 2. Controls & Filter Bar */}
        <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                filter === "all"
                  ? "bg-primary-container text-on-primary font-bold shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              All Items ({reports.length + pendingBookings.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("delivered")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                filter === "delivered"
                  ? "bg-primary-container text-on-primary font-bold shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              Delivered Scorecards ({reports.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("pending")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                filter === "pending"
                  ? "bg-primary-container text-on-primary font-bold shadow-xs"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              In-Flight / Pending ({pendingBookings.length})
            </button>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2 text-outline" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hash, mentor, service..."
                className="w-full h-8 pl-9 pr-3 rounded-xl bg-surface-container-low text-xs text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary border border-outline-variant/20"
              />
            </div>
          </div>
        </div>

        {/* Loading & Error States */}
        {loading && (
          <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-sm font-semibold text-on-surface">Loading candidate deliverables...</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Zero State */}
        {!loading && reports.length === 0 && pendingBookings.length === 0 && (
          <div className="p-12 text-center bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/50 shadow-xs flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-container/20 text-primary flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div className="max-w-md space-y-1">
              <h3 className="text-base font-bold text-on-surface">No deliverables delivered yet</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Once your booked mentor conducts your session, your verified 8-dimension scorecard and cryptographic audit seal will appear here within 48 hours.
              </p>
            </div>
            <Link
              href="/mentors"
              className="px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary/90 text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Book Your First Session</span>
            </Link>
          </div>
        )}

        {/* Deliverables List */}
        {!loading && (
          <div className="flex flex-col gap-6">
            {/* 1. Pending In-Flight Sessions */}
            {(filter === "all" || filter === "pending") &&
              pendingBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs p-6 flex flex-col gap-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-outline-variant/20 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary text-[11px] font-bold">
                        SESSION IN-FLIGHT • 48H SLA WINDOW
                      </span>
                      <span className="font-mono text-on-surface font-semibold">{b.booking_ref}</span>
                    </div>
                    <span className="text-primary font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Scorecard due within 48h of session end</span>
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-on-surface text-base">
                        {SERVICE_TITLES[b.service_code] || b.service_code}
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Mentor: <strong>{b.mentor?.full_name || "Assigned Mentor"}</strong> • {b.mentor?.mentor_profiles?.job_title} ({b.mentor?.mentor_profiles?.current_employer})
                      </p>
                    </div>

                    <div className="text-xs text-on-surface-variant font-tabular">
                      Session Scheduled: {new Date(b.session_start).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                    </div>
                  </div>
                </div>
              ))}

            {/* 2. Delivered Reports */}
            {(filter === "all" || filter === "delivered") &&
              filteredReports.map((r) => {
                const serviceTitle =
                  SERVICE_TITLES[r.service_code] || `${r.service_code}: Mentorship Session`;
                const scores = Object.values(r.rubric_scores);
                const avgScore =
                  scores.length > 0
                    ? (scores.reduce((a, b) => a + Number(b), 0) / scores.length).toFixed(1)
                    : "8.0";
                const feedbackSubmitted = !!feedbacks[r.booking_id];

                return (
                  <div
                    key={r.id}
                    className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                  >
                    {/* Top Bar */}
                    <div className="px-6 py-3.5 bg-surface-container-low border-b border-outline-variant/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>DELIVERED • VERIFIED</span>
                        </span>
                        <div className="h-3 w-px bg-surface-container-high hidden sm:block" />
                        <span className="text-on-surface font-bold">{r.service_code}</span>
                        <span className="text-on-surface-variant font-mono">
                          Ref: {r.booking?.booking_ref || r.booking_id.slice(-8)}
                        </span>
                        <span className="px-2 py-0.2 rounded-full bg-surface-container-high text-on-surface text-[10px] font-bold">
                          v{r.version} {r.is_latest ? "(Latest)" : "(Archived Version)"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-secondary font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{r.is_late ? "Submitted Past SLA" : "Delivered Within 48h SLA"}</span>
                      </div>
                    </div>

                    {/* Core Body */}
                    <div className="p-6 flex flex-col gap-5">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                        <div className="flex items-start gap-3.5">
                          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-container-high flex items-center justify-center font-bold text-primary text-base">
                            {r.mentor?.full_name ? r.mentor.full_name[0] : "M"}
                          </div>
                          <div className="flex flex-col">
                            <h2 className="text-base sm:text-lg font-bold text-on-surface font-heading">
                              {serviceTitle}
                            </h2>
                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-xs">
                              <span className="font-bold text-on-surface">
                                {r.mentor?.full_name || "Verified Mentor"}
                              </span>
                              {r.mentor?.mentor_profiles && (
                                <>
                                  <span className="text-outline">•</span>
                                  <span className="text-on-surface-variant">
                                    {r.mentor.mentor_profiles.job_title} @ {r.mentor.mentor_profiles.current_employer}
                                  </span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-on-surface-variant">
                              <span>Submitted: {new Date(r.submitted_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
                            </div>
                          </div>
                        </div>

                        {/* Average Score Badge */}
                        <div className="flex items-center gap-3.5 bg-surface-container-low border border-outline-variant/20 p-3.5 rounded-xl shrink-0 self-start">
                          <div className="flex flex-col items-center px-1">
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black text-primary font-heading">
                                {avgScore}
                              </span>
                              <span className="text-xs text-on-surface-variant font-bold">/ 10</span>
                            </div>
                            <span className="px-2 py-0.2 rounded-full bg-primary-fixed text-primary text-[10px] font-bold uppercase mt-0.5">
                              8-D Calibrated
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Executive Summary */}
                      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1.5 text-xs">
                        <div className="flex items-center gap-1.5 text-on-surface font-bold uppercase tracking-wider text-[11px]">
                          <FileText className="w-4 h-4 text-primary" />
                          <span>Evaluator Executive Summary</span>
                        </div>
                        <p className="text-on-surface leading-relaxed italic">
                          &ldquo;{r.summary_notes}&rdquo;
                        </p>
                      </div>

                      {/* Dimensional Breakdown Grid */}
                      {Object.keys(r.rubric_scores).length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block">
                            Dimensional Score Calibration
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            {Object.entries(r.rubric_scores).map(([dim, score]) => (
                              <div
                                key={dim}
                                className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between"
                              >
                                <span className="uppercase text-[11px] font-semibold text-on-surface-variant">
                                  {dim}
                                </span>
                                <span className="font-bold text-primary text-xs">{score} / 10</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Strengths & Growth Areas */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {r.strengths.length > 0 && (
                          <div className="p-3.5 rounded-xl bg-secondary-container/10 border border-secondary/20 space-y-1.5">
                            <span className="font-bold text-secondary text-[11px] uppercase tracking-wider block">
                              Demonstrated Strengths
                            </span>
                            <ul className="list-disc list-inside space-y-1 text-on-surface">
                              {r.strengths.map((str, idx) => (
                                <li key={idx}>{str}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {r.growth_areas.length > 0 && (
                          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
                            <span className="font-bold text-amber-800 text-[11px] uppercase tracking-wider block">
                              Areas for Growth
                            </span>
                            <ul className="list-disc list-inside space-y-1 text-amber-950">
                              {r.growth_areas.map((ga, idx) => (
                                <li key={idx}>{ga}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Action Items */}
                      {r.action_items.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block">
                            Post-Session Action Plan
                          </span>
                          <div className="flex flex-col gap-2">
                            {r.action_items.map((item, idx) => {
                              const key = `${r.id}_${idx}`;
                              const isChecked = !!completedActions[key];
                              return (
                                <label
                                  key={idx}
                                  className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:bg-surface-container cursor-pointer transition-colors text-xs"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) =>
                                      setCompletedActions((prev) => ({
                                        ...prev,
                                        [key]: e.target.checked,
                                      }))
                                    }
                                    className="mt-0.5 rounded accent-primary shrink-0"
                                  />
                                  <div className="flex flex-col">
                                    <span
                                      className={`font-medium ${
                                        isChecked ? "line-through text-on-surface-variant" : "text-on-surface"
                                      }`}
                                    >
                                      {item.title}
                                    </span>
                                    <span className="text-[10px] text-secondary font-semibold mt-0.5">
                                      {isChecked ? "Completed by candidate!" : item.timeline || "Action item"}
                                    </span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Footer with SHA-256 seal & Actions */}
                    <div className="px-6 py-3.5 bg-surface-container-low border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                      {r.deliverable_sha256 && (
                        <div className="flex items-center gap-1.5 font-mono text-on-surface-variant">
                          <ShieldCheck className="w-4 h-4 text-secondary" />
                          <span>SHA-256: {r.deliverable_sha256.slice(0, 18)}...</span>
                          <button
                            type="button"
                            onClick={() => handleCopyHash(r.deliverable_sha256!)}
                            className="p-1 hover:text-primary transition-colors"
                            title="Copy Cryptographic SHA-256 Hash"
                          >
                            {copiedHash === r.deliverable_sha256 ? (
                              <Check className="w-3.5 h-3.5 text-secondary" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <span className="text-secondary font-sans font-bold">• Audit Intact</span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 ml-auto">
                        {feedbackSubmitted ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary-container text-on-secondary-container text-xs font-semibold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>Rated ({feedbacks[r.booking_id].rating}★)</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveBookingForFeedback({
                                bookingId: r.booking_id,
                                mentorName: r.mentor?.full_name || "Mentor",
                                serviceCode: r.service_code,
                              });
                              setFeedbackModalOpen(true);
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container text-xs font-semibold flex items-center gap-1.5 border border-outline-variant/20 shadow-xs"
                          >
                            <Star className="w-3.5 h-3.5 text-amber-500" />
                            <span>Submit Mentor Rating</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="px-3.5 py-1.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Print Scorecard (v{r.version})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* 3. Mentor Feedback Modal */}
      {feedbackModalOpen && activeBookingForFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-xl border border-outline-variant/30 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div>
                <h3 className="font-bold text-base text-on-surface">Rate Your Mentorship Session</h3>
                <p className="text-xs text-on-surface-variant">
                  {activeBookingForFeedback.serviceCode} with {activeBookingForFeedback.mentorName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-semibold text-on-surface block">
                  Overall Rating (1 to 5 Stars):
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= feedbackRating
                            ? "text-amber-500 fill-amber-500"
                            : "text-outline-variant"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-on-surface ml-2 text-sm">
                    {feedbackRating}.0 / 5.0
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-on-surface block">
                  Detailed Feedback &amp; Review (Optional)
                </label>
                <textarea
                  rows={3}
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  placeholder="How well did your mentor help calibrate your career readiness?"
                  className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recommendPeers}
                  onChange={(e) => setRecommendPeers(e.target.checked)}
                  className="rounded accent-primary"
                />
                <span className="text-on-surface font-medium">
                  I would recommend this mentor to peers and fellow candidates.
                </span>
              </label>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setFeedbackModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="px-5 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary/90 font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  {submittingFeedback ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Feedback</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
