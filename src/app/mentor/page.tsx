"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";

// Ambient Canvas & Modals
import { FlowingGradientBackground, CanvasMode } from "@/components/mentor/FlowingGradientBackground";
import { MentorModal } from "@/components/mentor/MentorModal";

// Types & Mock/Seed Data
import {
  SERVICES_CATALOGUE,
  ServiceApproval,
  WeeklySlot,
  DateException,
  DispatchOffer,
  MentorBooking,
  SessionReport,
  FinancialLedgerRecord,
  MentorProfileData,
  DEFAULT_WEEKLY_SLOTS,
  DEFAULT_DATE_EXCEPTIONS,
  SEED_DISPATCH_OFFERS,
  SEED_BOOKINGS,
  SEED_REPORTS,
  SEED_FINANCIAL_LEDGER,
  SEED_NOTIFICATIONS,
  SEED_PROFILE,
  SEED_TRUST_PILLARS,
  SEED_SERVICE_APPROVALS,
  Tone
} from "@/components/mentor/types";

// 10 Modular Views
import { OverviewView } from "@/components/mentor/views/OverviewView";
import { VerificationView } from "@/components/mentor/views/VerificationView";
import { ServicesView } from "@/components/mentor/views/ServicesView";
import { AvailabilityView } from "@/components/mentor/views/AvailabilityView";
import { DispatchView } from "@/components/mentor/views/DispatchView";
import { BookingsView } from "@/components/mentor/views/BookingsView";
import { SessionConsoleView } from "@/components/mentor/views/SessionConsoleView";
import { ReportsView } from "@/components/mentor/views/ReportsView";
import { EarningsView } from "@/components/mentor/views/EarningsView";
import { SettingsView } from "@/components/mentor/views/SettingsView";

// Lucide Icons
import {
  LayoutDashboard,
  ShieldCheck,
  Grid,
  Calendar,
  Zap,
  CalendarCheck,
  Video,
  FileCheck2,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  HelpCircle,
  LogOut,
  Clock,
  Sparkles,
  CheckCircle,
  X,
  AlertTriangle
} from "lucide-react";

type MentorTab =
  | "overview"
  | "verification"
  | "services"
  | "availability"
  | "dispatch"
  | "bookings"
  | "sessions"
  | "reports"
  | "earnings"
  | "settings";

function MentorPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();

  // Tab state synced with URL search query
  const tabParam = searchParams.get("tab") as MentorTab | null;
  const [activeTab, setActiveTab] = React.useState<MentorTab>(tabParam || "overview");

  // Keep activeTab synced with query params
  React.useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam, activeTab]);

  const handleTabChange = (tab: MentorTab) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.pushState({}, "", url.toString());
  };

  const handleNavigate = (route: string, recordId?: string) => {
    const validTabs: MentorTab[] = [
      "overview",
      "verification",
      "services",
      "availability",
      "dispatch",
      "bookings",
      "sessions",
      "reports",
      "earnings",
      "settings",
    ];
    if (validTabs.includes(route as MentorTab)) {
      if (route === "bookings" && recordId) {
        setHighlightedBookingId(recordId);
      }
      if (route === "sessions" && recordId) {
        setHighlightedBookingId(recordId);
      }
      if (route === "reports" && recordId) {
        setHighlightedReportId(recordId);
      }
      if (route === "dispatch" && recordId) {
        setHighlightedOfferId(recordId);
      }
      handleTabChange(route as MentorTab);
    }
  };

  // Canvas Mode state
  const [canvasMode, setCanvasMode] = React.useState<CanvasMode>("vibrant");

  // Sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  // Global search query
  const [searchQuery, setSearchQuery] = React.useState("");

  // SLA Policy Modal
  const [showPolicyModal, setShowPolicyModal] = React.useState(false);

  // Notifications Popover
  const [showNotifications, setShowNotifications] = React.useState(false);

  // Role Simulator state
  const [simulatedTier, setSimulatedTier] = React.useState<"tier1" | "tier2" | "tier3">("tier1");
  const [isApplicantMode, setIsApplicantMode] = React.useState(false);

  // Targeted record highlights
  const [highlightedBookingId, setHighlightedBookingId] = React.useState<string | undefined>("BK-901");
  const [highlightedOfferId, setHighlightedOfferId] = React.useState<string | undefined>(undefined);
  const [highlightedReportId, setHighlightedReportId] = React.useState<string | undefined>(undefined);

  // Toasts
  const [toasts, setToasts] = React.useState<
    Array<{ id: string; message: string; tone: Tone }>
  >([]);

  const addToast = (message: string, tone: Tone = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Central Application Data State
  const [profile, setProfile] = React.useState<MentorProfileData>(SEED_PROFILE);
  const [trustPillars, setTrustPillars] = React.useState(SEED_TRUST_PILLARS);
  const [serviceApprovals, setServiceApprovals] = React.useState<ServiceApproval[]>(SEED_SERVICE_APPROVALS);
  const [dispatchOffers, setDispatchOffers] = React.useState<DispatchOffer[]>(SEED_DISPATCH_OFFERS);
  const [bookings, setBookings] = React.useState<MentorBooking[]>(SEED_BOOKINGS);
  const [reports, setReports] = React.useState<SessionReport[]>(SEED_REPORTS);
  const [ledger, setLedger] = React.useState<FinancialLedgerRecord[]>(SEED_FINANCIAL_LEDGER);
  const [weeklySlots, setWeeklySlots] = React.useState<WeeklySlot[]>(DEFAULT_WEEKLY_SLOTS);
  const [exceptions, setExceptions] = React.useState<DateException[]>(DEFAULT_DATE_EXCEPTIONS);

  // Load live Supabase profile, bookings, and slots if authenticated
  React.useEffect(() => {
    async function loadLiveMentorData() {
      if (!user) return;
      try {
        const supabase = createClient();
        const { data: dbProfile } = await supabase
          .from("mentor_profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (dbProfile) {
          setProfile((prev) => ({
            ...prev,
            displayName: user.name || prev.displayName,
            headline: dbProfile.job_title && dbProfile.current_employer ? `${dbProfile.job_title} at ${dbProfile.current_employer}` : prev.headline,
            currentRoleLabel: dbProfile.current_employer ? `${dbProfile.job_title || "Staff Engineer"} (${dbProfile.current_employer})` : prev.currentRoleLabel,
            bio: dbProfile.bio || prev.bio,
            yearsOfExperience: dbProfile.years_of_experience || prev.yearsOfExperience,
            verifiedCompany: dbProfile.verified_company || dbProfile.current_employer || "",
            employmentType: (dbProfile.employment_type as "employed" | "alumni") || "employed",
            experienceVerificationLabel: dbProfile.verification_status === "approved" ? "Verified Practitioner (Active)" : "Accreditation Submitted (In Review)",
          }));

          // Live Trust Pillars
          setTrustPillars([
            {
              id: "identity",
              title: "1. Identity Verification",
              status: "Verified",
              requiredEvidence: [
                "Government photo identity record",
                "Masked ID hash stored in audit vault",
              ],
              submittedEvidence: [
                "Encrypted Identity Record on File (DPDP Act Protected)",
              ],
              submittedAt: dbProfile.created_at || new Date().toISOString(),
            },
            {
              id: "employment",
              title: "2. Current / Past Tech Employment",
              status: dbProfile.work_email_verified ? "Verified" : (dbProfile.verification_status === "approved" ? "Verified" : "Submitted"),
              requiredEvidence: [
                "Corporate email verification or relieving letter / Form 16",
                "Confirmed employer domain",
              ],
              submittedEvidence: [
                dbProfile.work_email_verified
                  ? `Cryptographically verified corporate inbox (${dbProfile.work_email || "Official"})`
                  : (dbProfile.verified_company ? `Pedigree confirmed at ${dbProfile.verified_company}` : "Document proof uploaded"),
              ],
              submittedAt: dbProfile.updated_at || new Date().toISOString(),
            },
            {
              id: "rubric",
              title: "3. Rubric & SLA Agreement",
              status: "Verified",
              requiredEvidence: [
                "48-hour report delivery commitment",
                "Adherence to objective 8-dimension rubric criteria",
              ],
              submittedEvidence: [
                "Standard Mentor Service Level Agreement accepted",
                "Nodal Escrow terms & 24h dispute window ratified",
              ],
              submittedAt: dbProfile.updated_at || new Date().toISOString(),
            },
          ]);

          // Live approved services mapping
          if (dbProfile.approved_services && dbProfile.approved_services.length > 0) {
            const approvedCodes = new Set(dbProfile.approved_services as string[]);
            setServiceApprovals(
              SERVICES_CATALOGUE.map((svc) => ({
                serviceId: svc.id,
                status: approvedCodes.has(svc.id) ? "Approved" : "Submitted",
                submittedAt: dbProfile.created_at || new Date().toISOString(),
                reviewedAt: approvedCodes.has(svc.id) ? (dbProfile.updated_at || new Date().toISOString()) : undefined,
                activeForBookings: approvedCodes.has(svc.id),
                directBookingEnabled: approvedCodes.has(svc.id),
                smartMatchEnabled: approvedCodes.has(svc.id),
                evidenceSummary: "Corporate Pedigree Verified",
              }))
            );
          }
        }

        // Live Bookings for this Mentor
        const { data: dbBookings } = await supabase
          .from("bookings")
          .select("id, booking_ref, service_code, amount_paise, status, payment_status, created_at, session_start")
          .eq("mentor_id", user.id)
          .order("created_at", { ascending: false });

        if (dbBookings && dbBookings.length > 0) {
          const mapped: MentorBooking[] = dbBookings.map((b) => ({
            id: b.id,
            bookingRef: b.booking_ref,
            serviceId: b.service_code,
            bookingMode: b.booking_ref.includes("SM") ? "Smart Match" : "Direct",
            studentName: "Enrolled Candidate",
            studentSegment: "Candidate",
            targetRole: "Engineering Candidate",
            targetDomain: "Technology",
            sessionGoal: "Diagnostic Assessment",
            scheduledDate: b.session_start ? new Date(b.session_start).toLocaleDateString() : "To be scheduled",
            scheduledTime: b.session_start ? new Date(b.session_start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Flexible",
            durationMinutes: 60,
            status: b.status === "in_progress" ? "Ready to Join" : b.status === "confirmed" ? "Confirmed" : b.status === "completed" ? "Completed" : "Cancelled",
            paymentStatus: b.payment_status === "captured" ? "Verified" : "Pending",
            joinPermittedByServer: b.status === "in_progress",
            meetingProviderLabel: "Join link unlocks 10 min before scheduled start",
            attendance: {},
            authorizedDocuments: [],
            readinessContext: {
              overallScore: null,
              rubricVersion: "PRD-v3.0",
              lastAssessedDate: "Awaiting Assessment",
              coverageLabel: "Unassessed",
              dimensions: [],
            },
            reportStatus: b.status === "completed" ? "Report delivered" : "Awaiting session",
            timeline: [],
          }));
          setBookings(mapped);
        }

        // Live Availability Slots
        const { data: dbSlots } = await supabase
          .from("mentor_availability_slots")
          .select("*")
          .eq("mentor_id", user.id);

        if (dbSlots && dbSlots.length > 0) {
          const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          setWeeklySlots(
            dbSlots.map((s) => ({
              id: s.id,
              dayOfWeek: dayNames[s.day_of_week] || "Monday",
              startTime: s.start_time,
              endTime: s.end_time,
              enabled: s.is_active,
            }))
          );
        }
      } catch (err) {
        console.error("Error loading live mentor data:", err);
      }
    }
    loadLiveMentorData();
  }, [user]);

  // Workflow Handlers
  const handleClaimOffer = async (
    offerId: string,
    chosenWindowLabel: string
  ): Promise<"accepted" | "already_claimed"> => {
    const offer = dispatchOffers.find((o) => o.id === offerId);
    if (!offer) return "already_claimed";

    if (offer.simulateContendedClaim) {
      setDispatchOffers((prev) =>
        prev.map((o) => (o.id === offerId ? { ...o, status: "Already Claimed" } : o))
      );
      addToast(
        `Atomic Collision: Request ${offer.requestCode} was just claimed by another calibrated mentor. Claim locked.`,
        "warning"
      );
      return "already_claimed";
    }

    // Accept offer
    setDispatchOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: "Accepted" } : o))
    );

    // Create a new committed booking
    const newBooking: MentorBooking = {
      id: `BK-${Date.now().toString().slice(-4)}`,
      bookingRef: `DX-BK-2026-${Math.floor(2000 + Math.random() * 8000)}`,
      serviceId: offer.serviceId,
      bookingMode: "Smart Match",
      studentName: offer.studentAlias,
      studentSegment: offer.studentSegment,
      targetRole: offer.targetDomain,
      targetDomain: offer.targetDomain,
      sessionGoal: offer.goalSummary,
      scheduledDate: chosenWindowLabel.split("·")[0]?.trim() || "Sat, 08 Nov 2026",
      scheduledTime: chosenWindowLabel.split("·")[1]?.trim() || "10:30 – 11:30 IST",
      durationMinutes: 60,
      status: "Confirmed",
      paymentStatus: "Verified",
      joinPermittedByServer: false,
      meetingProviderLabel: "Join link unlocks 10 min before scheduled start",
      attendance: {},
      authorizedDocuments: [
        {
          id: `doc-${Date.now()}`,
          title: `${offer.studentAlias.split(" ")[0]}_Dossier_Context.pdf`,
          type: "PDF Dossier",
          signedUrlExpiresIn: "Generated at session window",
          summaryPreview: offer.sessionContextNote,
        },
      ],
      readinessContext: {
        overallScore: 65,
        rubricVersion: "rubric-v3.0",
        lastAssessedDate: "3 days ago",
        coverageLabel: "5 of 8 dimensions assessed",
        dimensions: [
          { dimension: "Technical Skills", score: 3, lastUpdated: "3 days ago", note: "Solid DS/Algo" },
          { dimension: "Interview Skills", score: null, lastUpdated: "Not assessed", note: "Primary focus of today’s session" },
          { dimension: "Communication", score: 3, lastUpdated: "3 days ago", note: "Clear explanations" },
        ],
      },
      reportStatus: "Awaiting session",
      timeline: [
        {
          timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " IST",
          event: "Smart Match offer atomically claimed by mentor",
          actor: "Mentor",
        },
        {
          timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " IST",
          event: "Booking confirmed & calendar invite queued",
          actor: "System",
        },
      ],
    };

    setBookings((prev) => [newBooking, ...prev]);
    addToast(`Offer ${offer.requestCode} claimed successfully! Added to Bookings.`, "success");
    return "accepted";
  };

  const handleDeclineOffer = (offerId: string) => {
    setDispatchOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: "Declined" } : o))
    );
    addToast("Dispatch offer declined. Returned to deterministic matching pool.", "neutral");
  };

  const handleToggleServiceSetting = (
    serviceId: string,
    settingKey: "activeForBookings" | "directBookingEnabled" | "smartMatchEnabled"
  ) => {
    setServiceApprovals((prev) =>
      prev.map((s) => (s.serviceId === serviceId ? { ...s, [settingKey]: !s[settingKey] } : s))
    );
    addToast("Service catalog preferences updated.", "success");
  };

  const handleSaveAvailability = async (slots: WeeklySlot[], newExceptions: DateException[]) => {
    setWeeklySlots(slots);
    setExceptions(newExceptions);
    addToast("Weekly IST availability windows saved successfully.", "success");

    if (user?.id) {
      try {
        const supabase = createClient();
        const dayMap: Record<string, number> = {
          Sunday: 0,
          Monday: 1,
          Tuesday: 2,
          Wednesday: 3,
          Thursday: 4,
          Friday: 5,
          Saturday: 6,
        };
        for (const slot of slots) {
          await supabase.from("mentor_availability_slots").upsert({
            mentor_id: user.id,
            day_of_week: dayMap[slot.dayOfWeek] ?? 1,
            start_time: slot.startTime,
            end_time: slot.endTime,
            is_active: slot.enabled,
          });
        }
      } catch (err) {
        console.warn("Could not sync availability slots to Supabase:", err);
      }
    }
  };

  const handleMentorCancelBooking = (bookingId: string, reason: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: "Cancelled",
              cancellationNote: `Cancelled by mentor (PRD §12.2): ${reason}`,
              timeline: [
                ...b.timeline,
                {
                  timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " IST",
                  event: `Mentor cancelled session: ${reason}`,
                  actor: "Mentor",
                },
              ],
            }
          : b
      )
    );
    addToast("Session cancelled. Student has been notified with free rebooking credit.", "warning");
  };

  const handleRecordMentorJoin = (bookingId: string) => {
    const timeStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " IST";
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              attendance: { ...b.attendance, mentorJoinedAt: timeStr },
              timeline: [
                ...b.timeline,
                { timestamp: timeStr, event: "Mentor entered authorized session vault", actor: "Mentor" },
              ],
            }
          : b
      )
    );
    addToast("Mentor attendance verified by server.", "success");
  };

  const handleMarkSessionCompleted = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const timeStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " IST";
    const service = SERVICES_CATALOGUE.find((s) => s.id === booking.serviceId) || SERVICES_CATALOGUE[0];

    // Update booking
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: "Completed",
              reportStatus: "Report pending",
              reportDueInHours: 48,
              attendance: { ...b.attendance, completedAt: timeStr },
              timeline: [
                ...b.timeline,
                { timestamp: timeStr, event: "Session concluded — 48h report SLA timer started", actor: "System" },
              ],
            }
          : b
      )
    );

    // Create session report with 48h timer
    const newReport: SessionReport = {
      id: `RPT-${Math.floor(600 + Math.random() * 400)}`,
      bookingId: booking.id,
      bookingRef: booking.bookingRef,
      serviceId: booking.serviceId,
      studentName: booking.studentName,
      studentSegment: booking.studentSegment,
      targetRole: booking.targetRole,
      sessionDate: `${booking.scheduledDate}, ${booking.scheduledTime}`,
      status: "Report pending",
      slaRemainingLabel: "47h 59m left (48h SLA)",
      assessmentPurpose: service.shortOutcome,
      summary: `Completed 1:1 ${service.name}. Candidate demonstrated strong engagement; diagnostic rubric in progress.`,
      rubricScores: service.rubricCriteria.map((c) => ({
        criterionId: c.id,
        label: c.label,
        rating: 3,
        observation: "Demonstrated clear foundation; fine-tuning recommendations pending.",
      })),
      dimensionObservations: service.mappedDimensions.map((d) => ({
        dimension: d,
        score: 3,
        observation: `Evaluated live during ${service.name} loop.`,
      })),
      strengths: ["Clear verbal articulation", "Receptive to structured critique"],
      improvementAreas: ["Dry-run edge cases before implementation"],
      actionPlan: [
        {
          id: `ap-${Date.now()}`,
          action: "Review recommended reference material and practice structured constraint checklist.",
          priority: "High",
          timeframe: "Next 7 days",
        },
      ],
      suggestedNextSteps: [
        {
          recommendedServiceId: "S06",
          reason: "Reinforce live technical interviewing readiness.",
        },
      ],
      assessmentLimitations: `Reflects single ${service.durationMinutes}-minute simulation under rubric-v3.0. Does not guarantee placement outcomes.`,
      versions: [],
    };

    setReports((prev) => [newReport, ...prev]);
    setHighlightedReportId(newReport.id);
    addToast(
      `Session marked Completed! 48-hour SLA report timer has started for ${booking.studentName}.`,
      "info"
    );
  };

  const handleSaveOrSubmitReport = (
    bookingId: string,
    reportPayload: Partial<SessionReport>,
    isFinal: boolean
  ) => {
    const existing = reports.find((r) => r.bookingId === bookingId);
    if (!existing) return;

    if (isFinal) {
      setReports((prev) =>
        prev.map((r) =>
          r.bookingId === bookingId
            ? {
                ...r,
                ...reportPayload,
                status: "Report delivered",
                slaRemainingLabel: "Delivered within 48h SLA",
                versions: [
                  ...r.versions,
                  {
                    version: `v${r.versions.length + 1}.0`,
                    createdAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
                    authorName: profile.displayName,
                    changeNote: "Delivered to student portal and recorded in immutable escrow audit trail.",
                  },
                ],
              }
            : r
        )
      );

      // Update booking
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, reportStatus: "Report delivered" } : b))
      );

      // Add to financial ledger
      const service = SERVICES_CATALOGUE.find((s) => s.id === existing.serviceId) || SERVICES_CATALOGUE[0];
      const newLedgerEntry: FinancialLedgerRecord = {
        id: `FIN-${Math.floor(400 + Math.random() * 600)}`,
        bookingRef: existing.bookingRef,
        serviceId: existing.serviceId,
        studentName: existing.studentName,
        completedDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        grossListedPricePaise: service.listPricePaise,
        studentAppliedDiscountLabel: "None (List Price)",
        studentPaidPaise: service.listPricePaise,
        mentorCalculationBasisPaise: service.listPricePaise,
        adjustmentPaise: 0,
        verificationStatus: "Provider Webhook Verified",
        settlementStatus: "Recorded — Awaiting V-01/V-04 Settlement Gate",
      };

      setLedger((prev) => [newLedgerEntry, ...prev]);
      addToast("Diagnostic Report delivered! Escrow settlement credit recorded in ledger.", "success");
    } else {
      setReports((prev) =>
        prev.map((r) => (r.bookingId === bookingId ? { ...r, ...reportPayload } : r))
      );
      addToast("Report draft saved to local secure cache.", "neutral");
    }
  };

  const handleExportStatementToast = () => {
    addToast("Exporting non-dilution earnings ledger as CSV...", "info");
    const headers = "ID,Booking Ref,Service ID,Student,Date,Gross Listed (Paise),Mentor Basis (Paise),Adjustment (Paise),Status\n";
    const rows = ledger
      .map(
        (l) =>
          `${l.id},${l.bookingRef},${l.serviceId},"${l.studentName}",${l.completedDate},${l.grossListedPricePaise},${l.mentorCalculationBasisPaise},${l.adjustmentPaise},"${l.settlementStatus}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dreamx-mentor-ledger-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast("Earnings statement CSV downloaded successfully.", "success");
  };

  // Nav Tab Definitions
  const navTabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "verification", label: "Verification", icon: ShieldCheck, badge: "3/3 Live" },
    { id: "services", label: "Services (S01–S10)", icon: Grid },
    { id: "availability", label: "Availability", icon: Calendar },
    {
      id: "dispatch",
      label: "Dispatch Queue",
      icon: Zap,
      badge: dispatchOffers.filter((o) => o.status === "Pending").length.toString(),
      badgeTone: "warning" as const,
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: CalendarCheck,
      badge: bookings.filter((b) => b.status === "Ready to Join" || b.status === "Confirmed").length.toString(),
    },
    { id: "sessions", label: "Session Console", icon: Video },
    {
      id: "reports",
      label: "Reports (48h SLA)",
      icon: FileCheck2,
      badge: reports.filter((r) => r.status === "Report pending" || r.status === "Revision requested").length.toString(),
      badgeTone: "danger" as const,
    },
    { id: "earnings", label: "Earnings & Ledger", icon: DollarSign },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#0d0e15] text-white flex flex-col font-sans selection:bg-[#5145cd] selection:text-white">
      {/* 1. Ambient Background Canvas */}
      <FlowingGradientBackground mode={canvasMode} />

      {/* 2. Top Header Navigation */}
      <header className="sticky top-0 z-40 w-full h-16 border-b border-white/10 bg-[#0d0e15]/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6">
        {/* Brand & Mode Controls */}
        <div className="flex items-center gap-4">
          <Link href="/mentor" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5145cd] to-violet-500 flex items-center justify-center font-extrabold text-white text-xs shadow-lg shadow-indigo-900/40">
              DX
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-sm tracking-tight text-white">DreamX</span>
              <span className="text-[11px] font-mono text-gray-400 ml-1.5">Mentor Portal</span>
            </div>
          </Link>

          {/* Canvas Mode Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
            {(["vibrant", "balanced", "calm", "showcase"] as CanvasMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setCanvasMode(mode)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition-all cursor-pointer ${
                  canvasMode === mode
                    ? "bg-[#5145cd] text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="hidden md:flex items-center w-72 lg:w-96">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services, candidates, ref codes..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#5145cd] focus:ring-1 focus:ring-[#5145cd] transition-all"
            />
          </div>
        </div>

        {/* Right Action Ribbon */}
        <div className="flex items-center gap-3">
          {/* Policy Guide */}
          <button
            type="button"
            onClick={() => setShowPolicyModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 transition-all cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>48h SLA Policy</span>
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#0d0e15]" />
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#141624] border border-white/10 p-4 shadow-2xl space-y-3 z-50 backdrop-blur-xl">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-bold text-white">Notifications &amp; Alerts</span>
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  {SEED_NOTIFICATIONS.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        handleNavigate(n.targetRoute, n.targetRecordId);
                        setShowNotifications(false);
                      }}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer space-y-1 transition-all"
                    >
                      <div className="flex items-center justify-between text-indigo-300 font-bold">
                        <span className="flex items-center gap-1.5">{n.title}</span>
                        <span className="text-[10px] font-mono text-gray-400">{n.timestamp}</span>
                      </div>
                      <p className="text-gray-300 text-[11px] leading-relaxed">{n.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-black text-xs shadow-md">
              {profile.displayName ? profile.displayName.slice(0, 2).toUpperCase() : "AV"}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-white leading-none">{profile.displayName}</div>
              <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
                {simulatedTier === "tier1" ? "Tier 1 (FAANG / Ex-Google)" : simulatedTier === "tier2" ? "Tier 2 (High-Growth Tech)" : "Tier 3 (Enterprise IT)"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Main Workspace Container */}
      <div className="relative z-10 flex-1 flex w-full max-w-[1920px] mx-auto overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`shrink-0 border-r border-white/10 bg-[#0d0e15]/60 backdrop-blur-md transition-all duration-300 flex flex-col justify-between py-4 ${
            sidebarCollapsed ? "w-16 px-2" : "w-64 px-4"
          }`}
        >
          {/* Top Nav Items */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 pb-3 mb-2 border-b border-white/5">
              {!sidebarCollapsed && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Navigation
                </span>
              )}
              <button
                type="button"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 ml-auto"
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>

            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id as MentorTab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#5145cd] text-white shadow-lg shadow-indigo-950/40"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
                  title={sidebarCollapsed ? tab.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
                  {!sidebarCollapsed && (
                    <span className="flex-1 text-left truncate">{tab.label}</span>
                  )}
                  {!sidebarCollapsed && tab.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold ${
                        tab.badgeTone === "warning"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : tab.badgeTone === "danger"
                          ? "bg-red-500/20 text-red-300 border border-red-500/30"
                          : "bg-white/10 text-gray-300"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Sidebar Footer */}
          <div className="pt-4 border-t border-white/5 space-y-2">
            {!sidebarCollapsed ? (
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">Escrow Guarantee</span>
                  <span className="text-emerald-400 font-bold">100% Locked</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full w-full" />
                </div>
                <p className="text-[10px] text-gray-500 leading-snug">
                  All sessions held in Razorpay Nodal Escrow until 48h rubric delivery.
                </p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={async () => {
                await logout();
                router.replace("/login?role=mentor");
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/30 transition-all cursor-pointer ${
                sidebarCollapsed ? "justify-center px-0" : ""
              }`}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === "overview" && (
            <OverviewView
              profile={profile}
              isApplicantMode={isApplicantMode}
              trustPillars={trustPillars}
              serviceApprovals={serviceApprovals}
              dispatchOffers={dispatchOffers}
              bookings={bookings}
              reports={reports}
              ledger={ledger}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === "verification" && (
            <VerificationView
              isApplicantMode={isApplicantMode}
              trustPillars={trustPillars}
              serviceApprovals={serviceApprovals}
              onSubmitAdditionalEvidence={(serviceId, evidenceSummary) => {
                setServiceApprovals((prev) =>
                  prev.map((s) =>
                    s.serviceId === serviceId
                      ? { ...s, status: "Under review", evidenceSummary }
                      : s
                  )
                );
                addToast("Additional evidence submitted to Trust Reviewers (#VR-12).", "success");
              }}
              onRequestNewServiceApproval={(serviceId, evidenceSummary) => {
                const newApproval: ServiceApproval = {
                  serviceId,
                  status: "Under review",
                  activeForBookings: false,
                  directBookingEnabled: false,
                  smartMatchEnabled: false,
                  submittedAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
                  reviewerNote: "Queued with Service Approval Reviewer. Target SLA: 2–3 business days.",
                  evidenceSummary,
                };
                setServiceApprovals((prev) => [...prev.filter((s) => s.serviceId !== serviceId), newApproval]);
                addToast(`Service ${serviceId} approval requested! Under review.`, "success");
              }}
            />
          )}

          {activeTab === "services" && (
            <ServicesView
              isApplicantMode={isApplicantMode}
              serviceApprovals={serviceApprovals}
              onToggleServiceSetting={handleToggleServiceSetting}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === "availability" && (
            <AvailabilityView
              weeklySlots={weeklySlots}
              exceptions={exceptions}
              bookings={bookings}
              onSaveAvailability={handleSaveAvailability}
            />
          )}

          {activeTab === "dispatch" && (
            <DispatchView
              isApplicantMode={isApplicantMode}
              offers={dispatchOffers}
              highlightedOfferId={highlightedOfferId}
              onClaimOffer={handleClaimOffer}
              onDeclineOffer={handleDeclineOffer}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === "bookings" && (
            <BookingsView
              bookings={bookings}
              initialSelectedBookingId={highlightedBookingId}
              onNavigate={handleNavigate}
              onMentorCancelBooking={handleMentorCancelBooking}
            />
          )}

          {activeTab === "sessions" && (
            <SessionConsoleView
              bookings={bookings}
              reports={reports}
              selectedBookingId={highlightedBookingId}
              mentorName={profile.displayName}
              onSelectBooking={(id) => setHighlightedBookingId(id)}
              onRecordMentorJoin={handleRecordMentorJoin}
              onMarkSessionCompleted={handleMarkSessionCompleted}
              onSaveOrSubmitReport={handleSaveOrSubmitReport}
            />
          )}

          {activeTab === "reports" && (
            <ReportsView
              reports={reports}
              mentorName={profile.displayName}
              initialReportId={highlightedReportId}
              onOpenBookingInConsole={(bookingId) => {
                setHighlightedBookingId(bookingId);
                handleTabChange("sessions");
              }}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === "earnings" && (
            <EarningsView
              ledger={ledger}
              onExportStatementToast={handleExportStatementToast}
            />
          )}

          {activeTab === "settings" && (
            <SettingsView
              mentorProfile={profile}
              onToast={addToast}
            />
          )}
        </main>
      </div>

      {/* 4. SLA Policy Modal */}
      {showPolicyModal && (
        <MentorModal
          title="DreamX 48-Hour Escrow & Deliverable Policy"
          open={showPolicyModal}
          onClose={() => setShowPolicyModal(false)}
          maxWidthClass="max-w-2xl"
          footer={
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowPolicyModal(false)}
                className="px-4 py-2 rounded-xl bg-[#5145cd] text-white text-xs font-bold shadow-md hover:bg-[#4338ca] transition-all cursor-pointer"
              >
                I Understand &amp; Agree
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-white">Trust Architecture &amp; Payout Release</div>
                <p className="text-gray-400">
                  To protect both mentors and candidates, DreamX operates an institutional 80/20 non-dilution escrow split under PRD §7.3.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Key Mentor Obligations</h4>
              <ul className="space-y-2 list-disc list-inside text-gray-400 pl-1">
                <li>
                  <strong className="text-gray-200">Session Attendance:</strong> Join via the encrypted Jitsi Vault within 5 minutes of scheduled slot time.
                </li>
                <li>
                  <strong className="text-gray-200">48-Hour Report SLA:</strong> Every S01–S10 session requires an 11-section structured rubric report submitted within 48 hours of session conclusion.
                </li>
                <li>
                  <strong className="text-gray-200">Candidate Dispute Window:</strong> Candidates have 48 hours to inspect deliverables. If no dispute is filed, Razorpay Route automatically releases your 80% payout.
                </li>
                <li>
                  <strong className="text-gray-200">Zero Moonlighting Exposure:</strong> All communications, reminders, and payout advice are delivered exclusively to your private email.
                </li>
              </ul>
            </div>
          </div>
        </MentorModal>
      )}

      {/* 5. Floating Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-2xl backdrop-blur-xl text-xs font-medium flex items-center gap-2.5 transition-all animate-in fade-in slide-in-from-bottom-2 ${
              toast.tone === "success"
                ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200"
                : toast.tone === "warning"
                ? "bg-amber-950/90 border-amber-500/40 text-amber-200"
                : toast.tone === "danger"
                ? "bg-red-950/90 border-red-500/40 text-red-200"
                : "bg-[#141624]/90 border-indigo-500/30 text-indigo-200"
            }`}
          >
            {toast.tone === "success" && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.tone === "warning" && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
            {toast.tone === "danger" && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
            {toast.tone === "info" && <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />}
            <span className="leading-snug flex-1">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MentorPortalPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen w-full bg-[#0d0e15] text-white">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-[#5145cd] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold text-gray-400 font-mono">
              Loading Mentor Delivery Console...
            </span>
          </div>
        </div>
      }
    >
      <MentorPortalContent />
    </React.Suspense>
  );
}
