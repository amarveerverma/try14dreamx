"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  Calendar,
  BarChart3,
  Map,
  FileCheck,
  CreditCard,
  Settings,
  Search,
  Bell,
  HelpCircle,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCheck,
  Palette,
  Users,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { FlowingGradientBackground, CanvasMode, ColorTelemetry } from "../mentor/FlowingGradientBackground";
import { StudentModal } from "./ui/StudentModal";
import { StudentBookingModal, BookingConfirmationPayload } from "./modals/StudentBookingModal";
import { StudentOnboardingModal } from "./modals/StudentOnboardingModal";

import { StudentOverviewView } from "./views/StudentOverviewView";
import { StudentDiscoverView } from "./views/StudentDiscoverView";
import { StudentServicesView } from "./views/StudentServicesView";
import { StudentBookingsView } from "./views/StudentBookingsView";
import { StudentReadinessView } from "./views/StudentReadinessView";
import { StudentJourneyView } from "./views/StudentJourneyView";
import { StudentReportsView } from "./views/StudentReportsView";
import { StudentMembershipView } from "./views/StudentMembershipView";
import { StudentSettingsView } from "./views/StudentSettingsView";

import {
  StudentProfileData,
  ReadinessDimension,
  ReadinessHistoryEntry,
  StudentBooking,
  StudentReport,
  JourneyStage,
  VoluntaryOutcome,
  MembershipData,
  StudentNotification,
  SEED_STUDENT_PROFILE,
  SEED_DIMENSIONS,
  SEED_READINESS_HISTORY,
  SEED_STUDENT_BOOKINGS,
  SEED_STUDENT_REPORTS,
  SEED_JOURNEY_STAGES,
  SEED_VOLUNTARY_OUTCOMES,
  SEED_MEMBERSHIP,
  SEED_NOTIFICATIONS,
  SEED_AVAILABLE_MENTORS,
  SERVICES_CATALOGUE,
  getServiceById,
  calculateReadinessScore,
  MEMBERSHIP_TIERS,
  formatPaise,
} from "./types";

export interface StudentPortalShellProps {
  initialTab?: string;
  onSwitchToMentorPortal?: () => void;
}

interface ToastMessage {
  id: string;
  tone: "success" | "info" | "warning" | "danger";
  title: string;
  detail?: string;
}

export function StudentPortalShell({
  initialTab = "overview",
  onSwitchToMentorPortal,
}: StudentPortalShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const tabParam = searchParams.get("tab") || initialTab;
  const [activeTab, setActiveTab] = React.useState<string>(tabParam);
  const [recordFocusId, setRecordFocusId] = React.useState<string | undefined>(undefined);

  // Layout & UI States
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState<boolean>(false);
  const [searchModalOpen, setSearchModalOpen] = React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [notificationsOpen, setNotificationsOpen] = React.useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState<boolean>(false);
  const [trustGuideOpen, setTrustGuideOpen] = React.useState<boolean>(false);
  const [onboardingOpen, setOnboardingOpen] = React.useState<boolean>(false);

  // Booking Modal State
  const [bookingModalState, setBookingModalState] = React.useState<{
    open: boolean;
    serviceId: string | null;
    mentorSlug?: string;
  }>({ open: false, serviceId: null });

  // Ambient Canvas Mode
  const [ambientMode, setAmbientMode] = React.useState<CanvasMode>("vibrant");
  const [colorTelemetry, setColorTelemetry] = React.useState<ColorTelemetry>({
    huePrimary: 245,
    hueSecondary: 198,
    xPct: 35,
    yPct: 30,
  });

  // Core Student State
  const [profile, setProfile] = React.useState<StudentProfileData>(() => {
    if (user?.email) {
      const parts = (user.name || user.email.split("@")[0]).split(" ");
      return {
        ...SEED_STUDENT_PROFILE,
        firstName: parts[0] || SEED_STUDENT_PROFILE.firstName,
        lastName: parts.slice(1).join(" ") || SEED_STUDENT_PROFILE.lastName,
        email: user.email,
      };
    }
    return SEED_STUDENT_PROFILE;
  });

  const supabase = React.useMemo(() => createClient(), []);

  const [dimensions, setDimensions] = React.useState<ReadinessDimension[]>(SEED_DIMENSIONS);
  const [history, setHistory] = React.useState<ReadinessHistoryEntry[]>(SEED_READINESS_HISTORY);
  const [bookings, setBookings] = React.useState<StudentBooking[]>(SEED_STUDENT_BOOKINGS);
  const [reports, setReports] = React.useState<StudentReport[]>(SEED_STUDENT_REPORTS);
  const [journeyStages] = React.useState<JourneyStage[]>(SEED_JOURNEY_STAGES);
  const [voluntaryOutcomes, setVoluntaryOutcomes] = React.useState<VoluntaryOutcome[]>(SEED_VOLUNTARY_OUTCOMES);
  const [membership, setMembership] = React.useState<MembershipData>(SEED_MEMBERSHIP);
  const [bundleServiceIds, setBundleServiceIds] = React.useState<string[]>(["S01", "S06"]);
  const [notifications, setNotifications] = React.useState<StudentNotification[]>(SEED_NOTIFICATIONS);
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  // 1. Fetch live authenticated student data from Supabase
  React.useEffect(() => {
    if (!user || !user.id) return;
    const currentUserId: string = user.id;
    let isCancelled = false;

    async function loadStudentData() {
      try {
        // Fetch Profile
        const { data: dbProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUserId)
          .maybeSingle();

        if (dbProfile && !isCancelled) {
          const names = (dbProfile.full_name || user?.name || user?.email?.split("@")[0] || "").split(" ");
          setProfile((prev) => ({
            ...prev,
            firstName: names[0] || prev.firstName,
            lastName: names.slice(1).join(" ") || prev.lastName,
            email: dbProfile.email || prev.email,
            targetRole: dbProfile.target_role || prev.targetRole,
          }));
        }

        // Fetch Live Bookings
        const { data: dbBookings } = await supabase
          .from("bookings")
          .select("id, booking_ref, service_code, amount_paise, status, payment_status, created_at, session_start, mentor_id")
          .eq("student_id", currentUserId)
          .order("created_at", { ascending: false });

        if (dbBookings && !isCancelled) {
          const mappedBookings: StudentBooking[] = (dbBookings as any[]).map((b) => {
            const svc = getServiceById(b.service_code);
            return {
              id: b.id,
              bookingRef: b.booking_ref,
              serviceId: b.service_code,
              mode: b.booking_ref.includes("SM") ? "Smart Match" : "Direct",
              mentorName: "Assigned Verified Mentor",
              mentorSlug: "mentor",
              mentorVerificationLabel: "Verified Tech Practitioner",
              dateLabel: b.session_start ? new Date(b.session_start).toLocaleDateString() : "To Be Scheduled",
              timeLabel: b.session_start ? new Date(b.session_start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Flexible",
              durationMinutes: svc.durationMinutes,
              status: b.status === "in_progress" ? "Ready to Join" : b.status === "confirmed" ? "Upcoming" : b.status === "completed" ? "Completed" : "Cancelled",
              listedPricePaise: svc.listPricePaise,
              appliedDiscountLabel: "Standard Fee",
              discountPaise: 0,
              finalPaidPaise: b.amount_paise || svc.listPricePaise,
              paymentStatus: "Payment Verified",
              joinPermittedByServer: b.status === "in_progress",
              reportStatus: b.status === "completed" ? "Report delivered" : "Awaiting session",
              timeline: [{ timestamp: b.created_at, label: "Booking Confirmed" }],
            };
          });
          setBookings(mappedBookings);
        }

        // Check for baseline assessment in localStorage
        const savedBaseline = typeof window !== "undefined" ? localStorage.getItem(`dreamx_baseline_score_${currentUserId}`) : null;
        const savedRatings = typeof window !== "undefined" ? localStorage.getItem(`dreamx_baseline_ratings_${currentUserId}`) : null;
        if (savedBaseline && savedRatings && !isCancelled) {
          try {
            const parsedRatings = JSON.parse(savedRatings);
            setDimensions((prev) =>
              prev.map((d, idx) => {
                const rating = parsedRatings[idx + 1];
                if (rating) {
                  return {
                    ...d,
                    score: rating,
                    status: "Baseline Self-Report",
                    assessorLabel: "Candidate Self-Calibration",
                  };
                }
                return d;
              })
            );
          } catch (e) {
            console.warn("Could not parse saved onboarding ratings:", e);
          }
        }
      } catch (err) {
        console.warn("Error loading student live data:", err);
      }
    }

    loadStudentData();
    return () => {
      isCancelled = true;
    };
  }, [user?.id, supabase]);

  // Sync tab with URL search parameter
  React.useEffect(() => {
    const t = searchParams.get("tab");
    if (t && t !== activeTab) {
      setActiveTab(t);
    }
  }, [searchParams]);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const showToast = (tone: ToastMessage["tone"], title: string, detail?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-2), { id, tone, title, detail }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4600);
  };

  const handleNavigate = (tab: string, recordId?: string) => {
    setActiveTab(tab);
    setRecordFocusId(recordId);
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
    setProfileDropdownOpen(false);
    setSearchModalOpen(false);
    if (typeof window !== "undefined") {
      const newUrl = recordId ? `/dashboard?tab=${tab}&id=${recordId}` : `/dashboard?tab=${tab}`;
      window.history.replaceState(null, "", newUrl);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStartBooking = (serviceId: string, mentorSlug?: string) => {
    setBookingModalState({ open: true, serviceId, mentorSlug });
  };

  const handleToggleBundle = (serviceId: string) => {
    setBundleServiceIds((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId);
      }
      if (prev.length >= 3) {
        showToast(
          "warning",
          "Bundle Limit Reached (3 Services)",
          "Remove one selected service before adding a different service."
        );
        return prev;
      }
      showToast("info", `Added ${serviceId} to Custom 3-Service Bundle`);
      return [...prev, serviceId];
    });
  };

  const handleBookingConfirmed = (payload: BookingConfirmationPayload) => {
    const service = getServiceById(payload.serviceId);
    const newId = `SBK-${110 + bookings.length}`;
    const newRef =
      payload.mode === "Direct"
        ? `DX-BK-2026-${1120 + bookings.length}`
        : `DX-SM-2026-${8850 + bookings.length}`;

    const newBooking: StudentBooking = {
      id: newId,
      bookingRef: newRef,
      serviceId: payload.serviceId,
      mode: payload.mode,
      mentorName:
        payload.mode === "Direct" && payload.mentor
          ? payload.mentor.displayName
          : "Matching Eligible Approved Mentor (Wave 1 Active)",
      mentorSlug: payload.mentor?.slug,
      mentorVerificationLabel: payload.mentor?.verificationLabel,
      dateLabel: payload.slotDateLabel,
      timeLabel: payload.slotTimeLabel,
      durationMinutes: service.durationMinutes,
      status: payload.mode === "Direct" ? "Upcoming" : "Smart Match In Progress",
      smartMatchStage: payload.mode === "Smart Match" ? "Matching (Wave 1)" : undefined,
      preferredWindows: payload.preferredWindows,
      listedPricePaise: payload.listedPricePaise,
      appliedDiscountLabel: payload.appliedDiscountLabel,
      discountPaise: payload.discountPaise,
      finalPaidPaise: payload.finalPaidPaise,
      paymentStatus: "Payment Verified",
      hoursUntilSession: 48,
      joinPermittedByServer: false,
      reportStatus: "Awaiting session",
      timeline: [
        {
          timestamp: "Just now (IST)",
          label:
            payload.mode === "Direct"
              ? `Slot locked & payment verified (${formatPaise(payload.finalPaidPaise)})`
              : `Smart Match Wave 1 dispatched after verified payment (${formatPaise(
                  payload.finalPaidPaise
                )})`,
        },
      ],
    };

    setBookings((prev) => [newBooking, ...prev]);
    setNotifications((prev) => [
      {
        id: `SN-${Date.now()}`,
        title:
          payload.mode === "Direct"
            ? `Booking Confirmed (${newRef})`
            : `Smart Match Request Dispatched (${newRef})`,
        description: `${service.name} (${service.durationMinutes} min) recorded in My Bookings.`,
        timestamp: "Just now",
        unread: true,
        targetRoute: "bookings",
        targetRecordId: newId,
      },
      ...prev,
    ]);

    showToast(
      "success",
      payload.mode === "Direct"
        ? `Booking Confirmed (${newRef})`
        : `Smart Match Dispatched (${newRef})`,
      `Verified payment of ${formatPaise(payload.finalPaidPaise)}.`
    );
    handleNavigate("bookings", newId);
  };

  const handlePurchaseBundle = (
    serviceIds: string[],
    payablePaise: number,
    appliedDiscountLabel: string
  ) => {
    const totalList = serviceIds.reduce((sum, id) => sum + getServiceById(id).listPricePaise, 0);
    const newItems: StudentBooking[] = serviceIds.map((sid, idx) => {
      const svc = getServiceById(sid);
      const discount = Math.round(
        svc.listPricePaise - (svc.listPricePaise * payablePaise) / totalList
      );
      return {
        id: `SBK-BND-${Date.now()}-${idx}`,
        bookingRef: `DX-BND-2026-${920 + bookings.length + idx}`,
        serviceId: sid,
        mode: "Smart Match",
        mentorName: "Bundle Service Entitlement — Dispatch Wave 1 Active",
        dateLabel: "Flexible IST Window",
        timeLabel: "Awaiting mentor acceptance",
        durationMinutes: svc.durationMinutes,
        status: "Smart Match In Progress",
        smartMatchStage: "Matching (Wave 1)",
        listedPricePaise: svc.listPricePaise,
        appliedDiscountLabel,
        discountPaise: discount,
        finalPaidPaise: svc.listPricePaise - discount,
        paymentStatus: "Payment Verified",
        hoursUntilSession: 72,
        joinPermittedByServer: false,
        reportStatus: "Awaiting session",
        timeline: [
          {
            timestamp: "Just now (IST)",
            label: `Purchased via Custom 3-Service Bundle (${appliedDiscountLabel})`,
          },
        ],
      };
    });

    setBookings((prev) => [...newItems, ...prev]);
    setBundleServiceIds([]);
    showToast(
      "success",
      "Custom 3-Service Bundle Confirmed",
      `All 3 services added to My Bookings (${formatPaise(payablePaise)} total).`
    );
    handleNavigate("bookings");
  };

  const handleChooseFallbackSlot = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    const mentorName = booking?.fallbackAlternativeSlot?.mentorName ?? "your verified mentor";
    setBookings((prev) =>
      prev.map((b) =>
        b.id !== bookingId || !b.fallbackAlternativeSlot
          ? b
          : {
              ...b,
              status: "Upcoming",
              smartMatchStage: "Mentor accepted",
              mentorName: b.fallbackAlternativeSlot.mentorName,
              mentorVerificationLabel: b.fallbackAlternativeSlot.mentorVerificationLabel,
              dateLabel: b.fallbackAlternativeSlot.dateLabel,
              timeLabel: b.fallbackAlternativeSlot.timeLabel,
              timeline: [
                ...b.timeline,
                {
                  timestamp: "Just now (IST)",
                  label: `Student explicitly confirmed open slot with ${b.fallbackAlternativeSlot.mentorName}`,
                },
              ],
            }
      )
    );
    showToast("success", "Alternative Open Slot Confirmed", `Your session with ${mentorName} is confirmed.`);
  };

  const handleChooseFallbackRefund = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: "Cancelled",
              smartMatchStage: "Refund requested",
              paymentStatus: "Refund Initiated",
              reportStatus: "Not applicable",
              timeline: [
                ...b.timeline,
                {
                  timestamp: "Just now (IST)",
                  label: "Student explicitly selected 100% full refund after 2h Smart Match timeout",
                },
              ],
            }
          : b
      )
    );
    showToast("info", "100% Full Refund Initiated", "Refund initiation recorded; settlement follows provider confirmation.");
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: "Cancelled",
              paymentStatus: "Refund Initiated",
              joinPermittedByServer: false,
              reportStatus: "Not applicable",
              timeline: [
                ...b.timeline,
                {
                  timestamp: "Just now (IST)",
                  label: "Cancelled by student ≥1 hour before start — 100% full refund initiated",
                },
              ],
            }
          : b
      )
    );
    showToast("info", "Booking Cancelled (100% Refund Initiated)");
  };

  const handleSubmitPostSessionIssue = (bookingId: string, issueText: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              paymentStatus: "Dispute Under Review",
              complaintSubmitted: {
                submittedAt: "06 Nov 2026, IST",
                reason: issueText,
                status: "Under Operations Review (80% Substantiated Policy)",
              },
              timeline: [
                ...b.timeline,
                {
                  timestamp: "Just now (IST)",
                  label: `Post-session quality issue submitted within 48h window: "${issueText}"`,
                },
              ],
            }
          : b
      )
    );
    showToast(
      "info",
      "Post-Session Issue Logged",
      "Operations will review attendance and scope evidence under the 80% refund policy."
    );
  };

  const handleTogglePortfolioNA = () => {
    const nextVal = !profile.portfolioNotApplicable;
    const updatedDims = dimensions.map((d) =>
      d.dimension === "Portfolio"
        ? {
            ...d,
            notApplicable: nextVal,
            status: (nextVal
              ? "Not Applicable"
              : d.score !== null && d.score > 0
              ? "Baseline Self-Report"
              : "Not Assessed") as ReadinessDimension["status"],
          }
        : d
    );
    setProfile((prev) => ({ ...prev, portfolioNotApplicable: nextVal }));
    setDimensions(updatedDims);
    const scoreResult = calculateReadinessScore(updatedDims, profile.segment, nextVal);
    if (scoreResult.overallScore !== null) {
      setHistory((prev) => [
        ...prev,
        {
          id: `rh-${Date.now()}`,
          date: "06 Nov 2026",
          score: scoreResult.overallScore!,
          assessedCount: scoreResult.assessedCount,
          applicableCount: scoreResult.applicableCount,
          triggerNote: nextVal
            ? "Marked Portfolio N/A (weight redistributed)"
            : "Marked Portfolio Applicable",
          rubricVersion: "rubric-v3.0",
        },
      ]);
    }
    showToast(
      "info",
      nextVal ? "Portfolio Marked N/A — Weights Redistributed" : "Portfolio Marked Applicable"
    );
  };

  const handleRequestReassessment = (dimension: string, evidenceNote: string) => {
    setDimensions((prev) =>
      prev.map((d) =>
        d.dimension === dimension
          ? {
              ...d,
              lastUpdated: "06 Nov 2026 (Artifact attached)",
              evidenceSummary: `${d.evidenceSummary} · Student note: "${evidenceNote}"`,
            }
          : d
      )
    );
    showToast(
      "success",
      `Evidence Attached for ${dimension}`,
      "Queued as context for your next mentor reassessment."
    );
  };

  const handleChangeMembership = (tier: "Free" | "Pro" | "Elite", interval: "monthly" | "annual") => {
    const tierConfig = MEMBERSHIP_TIERS.find((t) => t.tier === tier)!;
    const price = interval === "annual" ? tierConfig.annualUpfrontPaise : tierConfig.monthlyPaise;
    setMembership((prev) => ({
      tier,
      billingInterval: interval,
      status: "Active",
      startedDate: "06 Nov 2026",
      renewalDate: interval === "annual" ? "06 Nov 2027" : "06 Dec 2026",
      discountPercent: tierConfig.discountPercent,
      invoices:
        price > 0
          ? [
              {
                id: `INV-2026-${4500 + prev.invoices.length}`,
                date: "06 Nov 2026",
                description: `DreamX ${tier} Membership — ${interval} (${tierConfig.discountPercent}% Service Discount)`,
                amountPaise: price,
                status: "Verified",
              },
              ...prev.invoices,
            ]
          : prev.invoices,
    }));
    showToast(
      "success",
      `Switched to ${tier} Plan`,
      `Your ${tierConfig.discountPercent}% service discount is now active at checkout.`
    );
  };

  const handleToggleCancelRenewal = () => {
    setMembership((prev) => {
      const nextStatus = prev.status === "Active" ? "Cancelled (Active Until Period End)" : "Active";
      showToast(
        "info",
        nextStatus === "Active" ? "Scheduled Renewal Resumed" : "Scheduled Renewal Cancelled",
        nextStatus === "Active"
          ? "Membership will renew on schedule."
          : "Benefits stay active until your current period ends; no automatic retroactive refund."
      );
      return { ...prev, status: nextStatus };
    });
  };

  const handlePrivacyRequest = (type: string) => {
    showToast("info", "Privacy Request Submitted", `Logged DPDP request: "${type}".`);
  };

  // Badge calculations
  const attentionCount = bookings.filter(
    (b) => b.status === "Needs Decision" || b.status === "Ready to Join"
  ).length;
  const unassessedCount = dimensions.filter(
    (d) => !(profile.portfolioNotApplicable && d.dimension === "Portfolio") && d.score === null
  ).length;
  const unreadCount = notifications.filter((n) => n.unread).length;

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "discover", label: "Discover", icon: Compass },
    {
      id: "services",
      label: "Services",
      icon: BookOpen,
      badgeCount: bundleServiceIds.length > 0 ? bundleServiceIds.length : undefined,
      badgeTone: "primary" as const,
    },
    {
      id: "bookings",
      label: "My Bookings",
      icon: Calendar,
      badgeCount: attentionCount || undefined,
      badgeTone: "warning" as const,
    },
    {
      id: "readiness",
      label: "Career Readiness",
      icon: BarChart3,
      badgeCount: unassessedCount || undefined,
      badgeTone: "primary" as const,
    },
    { id: "journey", label: "Career Journey", icon: Map },
    {
      id: "reports",
      label: "Reports",
      icon: FileCheck,
      badgeCount: reports.length || undefined,
      badgeTone: "success" as const,
    },
    { id: "membership", label: "Membership", icon: CreditCard },
    { id: "settings", label: "Profile & Settings", icon: Settings },
  ];

  // Global search matching
  const searchResults = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const results: {
      id: string;
      kind: "Service" | "Mentor" | "Booking" | "Report";
      title: string;
      sub: string;
      route: string;
      recordId?: string;
    }[] = [];

    SERVICES_CATALOGUE.forEach((s) => {
      if (
        s.id.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.shortOutcome.toLowerCase().includes(q)
      ) {
        results.push({
          id: `st-svc-${s.id}`,
          kind: "Service",
          title: `${s.id} · ${s.name}`,
          sub: `${s.durationMinutes} min · ${formatPaise(s.listPricePaise)}`,
          route: "services",
          recordId: s.id,
        });
      }
    });

    SEED_AVAILABLE_MENTORS.forEach((m) => {
      if (m.displayName.toLowerCase().includes(q) || m.headline.toLowerCase().includes(q)) {
        results.push({
          id: `st-m-${m.id}`,
          kind: "Mentor",
          title: m.displayName,
          sub: m.headline,
          route: "services",
          recordId: `mentor:${m.slug}`,
        });
      }
    });

    bookings.forEach((b) => {
      const s = getServiceById(b.serviceId);
      if (
        b.bookingRef.toLowerCase().includes(q) ||
        b.mentorName.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q)
      ) {
        results.push({
          id: `st-bk-${b.id}`,
          kind: "Booking",
          title: `${b.bookingRef} · ${s.name}`,
          sub: `${b.mentorName} · ${b.status}`,
          route: "bookings",
          recordId: b.id,
        });
      }
    });

    reports.forEach((r) => {
      const s = getServiceById(r.serviceId);
      if (
        r.id.toLowerCase().includes(q) ||
        s.deliverableName.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q)
      ) {
        results.push({
          id: `st-rpt-${r.id}`,
          kind: "Report",
          title: `${r.id} · ${s.deliverableName}`,
          sub: `${r.sessionDate} · ${r.bookingRef}`,
          route: "reports",
          recordId: r.id,
        });
      }
    });

    return results.slice(0, 6);
  }, [searchQuery, bookings, reports]);

  return (
    <div className="min-h-screen relative text-zinc-900 flex flex-col font-sans">
      {/* Background Canvas */}
      <FlowingGradientBackground mode={ambientMode} onColorTelemetry={setColorTelemetry} />

      <div className="flex-1 flex flex-col p-2 sm:p-3.5 gap-3 max-w-[1600px] w-full mx-auto pb-20 lg:pb-3.5">
        {/* Top Header Navbar */}
        <header className="sticky top-2 sm:top-3.5 z-30 rounded-2xl border border-white/80 bg-white/84 backdrop-blur-xl px-4 py-2.5 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden rounded-lg p-1.5 text-zinc-700 hover:bg-zinc-100"
              aria-label="Open mobile navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* DreamX Brand */}
            <button
              type="button"
              onClick={() => handleNavigate("overview")}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs"
                style={{
                  background: `linear-gradient(135deg, #5145cd 0%, hsl(${colorTelemetry.huePrimary}, 72%, 52%) 100%)`,
                }}
              >
                DX
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-zinc-900 tracking-tight">
                    DreamX
                  </span>
                  <span className="rounded-md bg-indigo-50 border border-indigo-200/80 px-1.5 py-0.5 text-[10px] font-semibold text-[#4035b3]">
                    STUDENT PORTAL
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 font-mono truncate">
                  /dashboard · Verified 1:1 Mentorship
                </p>
              </div>
            </button>
          </div>

          {/* Search Trigger */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <Search className="h-4 w-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onFocus={() => setSearchModalOpen(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search career services, mentors, bookings... (Ctrl+K)"
              aria-label="Search student portal"
              className="w-full rounded-xl border border-zinc-200/90 bg-white/90 pl-9 pr-14 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-[#5145cd] focus:bg-white focus:outline-none"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
              ⌘K
            </kbd>
          </div>

          {/* Right Header Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Ambient Mode Switcher */}
            <div className="hidden xl:flex items-center gap-1 rounded-xl border border-zinc-200/90 bg-white/85 p-1">
              <span
                className="h-3 w-3 rounded-full ml-1.5 mr-0.5 shrink-0 transition-colors"
                style={{ backgroundColor: `hsl(${colorTelemetry.huePrimary}, 82%, 58%)` }}
                title={`Mouse-reactive hue: ${colorTelemetry.huePrimary}°`}
              />
              {[
                { id: "vibrant" as const, label: "Flow" },
                { id: "balanced" as const, label: "Soft" },
                { id: "calm" as const, label: "Calm" },
                { id: "showcase" as const, label: "Canvas" },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setAmbientMode(mode.id)}
                  className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors ${
                    ambientMode === mode.id
                      ? "bg-[#5145cd] text-white"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Mobile Ambient Mode Cycle */}
            <button
              type="button"
              onClick={() =>
                setAmbientMode((m) =>
                  m === "vibrant" ? "balanced" : m === "balanced" ? "calm" : "vibrant"
                )
              }
              title="Cycle ambient gradient mode"
              aria-label="Cycle ambient gradient mode"
              className="xl:hidden rounded-xl border border-zinc-200 bg-white/90 p-2 text-zinc-700 hover:bg-white"
            >
              <Palette className="h-4 w-4 text-[#5145cd]" />
            </button>

            {/* Trust Guide Button */}
            <button
              type="button"
              onClick={() => setTrustGuideOpen(true)}
              aria-label="Student booking, refund, and readiness policy guide"
              title="Student Trust & Refund Guide"
              className="rounded-xl border border-zinc-200 bg-white/90 p-2 text-zinc-700 hover:bg-white"
            >
              <HelpCircle className="h-4 w-4" />
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen((prev) => !prev);
                  setProfileDropdownOpen(false);
                }}
                aria-label={`Student notifications (${unreadCount} unread)`}
                className="relative rounded-xl border border-zinc-200 bg-white/90 p-2 text-zinc-700 hover:bg-white"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-[#5145cd] text-[10px] font-bold text-white flex items-center justify-center tabular-nums">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-zinc-200 bg-white shadow-2xl z-40 overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900">
                      Notifications ({unreadCount} unread)
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5145cd] hover:underline"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100">
                    {notifications.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          setNotifications((prev) =>
                            prev.map((item) => (item.id === n.id ? { ...item, unread: false } : item))
                          );
                          handleNavigate(n.targetRoute, n.targetRecordId);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-zinc-50 flex items-start gap-2.5 transition-colors ${
                          n.unread ? "bg-indigo-50/35" : "bg-white"
                        }`}
                      >
                        <span
                          className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                            n.unread ? "bg-[#5145cd]" : "bg-transparent"
                          }`}
                        />
                        <div className="space-y-0.5 min-w-0">
                          <p className="text-xs font-semibold text-zinc-900">{n.title}</p>
                          <p className="text-[11px] text-zinc-600 leading-snug">{n.description}</p>
                          <p className="text-[10px] font-mono text-zinc-400">{n.timestamp}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen((prev) => !prev);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white/90 pl-1.5 pr-2.5 py-1 hover:bg-white"
              >
                <span className="h-7 w-7 rounded-lg bg-[#5145cd] text-white text-xs font-bold flex items-center justify-center">
                  {profile.firstName[0]}
                  {profile.lastName[0]}
                </span>
                <span className="hidden md:block text-xs font-semibold text-zinc-800 max-w-[110px] truncate">
                  {profile.firstName} {profile.lastName}
                </span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-zinc-200 bg-white shadow-2xl z-40 p-3 space-y-2.5">
                  <div className="px-2 py-1 border-b border-zinc-100">
                    <p className="text-xs font-bold text-zinc-900">
                      {profile.firstName} {profile.lastName}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      {membership.tier} Plan ({membership.discountPercent}% off) · {profile.segment}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setOnboardingOpen(true);
                    }}
                    className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    Run 6-Step Career Onboarding
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleNavigate("settings");
                    }}
                    className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    Profile & Privacy Settings
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Body with Sidebar + Active View */}
        <div className="flex-1 flex gap-3.5 items-start">
          {/* Desktop Left Sidebar */}
          <aside
            aria-label="Student primary navigation"
            className={`hidden lg:flex flex-col sticky top-[76px] rounded-2xl border border-white/80 bg-white/84 backdrop-blur-xl p-2.5 shadow-xs transition-all ${
              sidebarCollapsed ? "w-[68px]" : "w-60"
            }`}
          >
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigate(item.id)}
                    title={sidebarCollapsed ? item.label : undefined}
                    aria-current={isActive ? "page" : undefined}
                    className={`w-full flex items-center justify-between gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#5145cd] text-white shadow-xs"
                        : "text-zinc-700 hover:bg-white hover:text-zinc-950"
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-zinc-500"}`}
                      />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </span>
                    {!sidebarCollapsed && item.badgeCount && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${
                          isActive
                            ? "bg-white/20 text-white"
                            : item.badgeTone === "warning"
                            ? "bg-amber-100 text-amber-900"
                            : item.badgeTone === "success"
                            ? "bg-emerald-100 text-emerald-900"
                            : "bg-indigo-100 text-[#4035b3]"
                        }`}
                      >
                        {item.badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="mt-4 pt-3 border-t border-zinc-200/75 flex items-center justify-between px-1">
              {!sidebarCollapsed && (
                <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                  <Users className="h-3 w-3 text-[#5145cd]" />
                  Student Portal
                </span>
              )}
              <button
                type="button"
                onClick={() => setSidebarCollapsed((c) => !c)}
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-900 ml-auto"
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>
            </div>
          </aside>

          {/* Active View Container */}
          <main className="flex-1 min-w-0">
            {activeTab === "overview" && (
              <StudentOverviewView
                profile={profile}
                dimensions={dimensions}
                bookings={bookings}
                reports={reports}
                journeyStages={journeyStages}
                membership={membership}
                onNavigate={handleNavigate}
                onStartBooking={(svcId) => handleStartBooking(svcId)}
                onOpenOnboarding={() => setOnboardingOpen(true)}
                onJoinSessionToast={(ref) =>
                  showToast(
                    "success",
                    `Connected to Authorized Session (${ref})`,
                    "Server verified your session-room token."
                  )
                }
              />
            )}

            {activeTab === "discover" && (
              <StudentDiscoverView
                membershipTier={membership.tier}
                dimensions={dimensions}
                bundleServiceIds={bundleServiceIds}
                onStartBooking={(svcId) => handleStartBooking(svcId)}
                onToggleBundleService={handleToggleBundle}
                onNavigate={handleNavigate}
              />
            )}

            {activeTab === "services" && (
              <StudentServicesView
                membershipTier={membership.tier}
                initialFocusId={recordFocusId}
                bundleServiceIds={bundleServiceIds}
                onToggleBundleService={handleToggleBundle}
                onClearBundle={() => setBundleServiceIds([])}
                onPurchaseBundle={handlePurchaseBundle}
                onStartBooking={handleStartBooking}
              />
            )}

            {activeTab === "bookings" && (
              <StudentBookingsView
                bookings={bookings}
                initialSelectedId={recordFocusId}
                onChooseFallbackSlot={handleChooseFallbackSlot}
                onChooseFallbackRefund={handleChooseFallbackRefund}
                onStudentCancelBooking={handleCancelBooking}
                onSubmitPostSessionIssue={handleSubmitPostSessionIssue}
                onJoinSessionToast={(ref) =>
                  showToast(
                    "success",
                    `Connected to Authorized Session (${ref})`,
                    "Server verified your session-room token."
                  )
                }
                onNavigate={handleNavigate}
              />
            )}

            {activeTab === "readiness" && (
              <StudentReadinessView
                segment={profile.segment}
                portfolioNotApplicable={profile.portfolioNotApplicable}
                dimensions={dimensions}
                history={history}
                onTogglePortfolioNA={handleTogglePortfolioNA}
                onRequestReassessment={handleRequestReassessment}
                onStartBooking={(svcId) => handleStartBooking(svcId)}
              />
            )}

            {activeTab === "journey" && (
              <StudentJourneyView
                stages={journeyStages}
                outcomes={voluntaryOutcomes}
                onAddVoluntaryOutcome={(category, title) => {
                  setVoluntaryOutcomes((prev) => [
                    ...prev,
                    {
                      id: `VO-${Date.now()}`,
                      category: category as VoluntaryOutcome["category"],
                      title,
                      recordedDate: "06 Nov 2026",
                      verificationState: "Self-Reported",
                    },
                  ]);
                  showToast("success", "Milestone Recorded", `Logged "${title}".`);
                }}
                onStartBooking={(svcId) => handleStartBooking(svcId)}
              />
            )}

            {activeTab === "reports" && (
              <StudentReportsView
                reports={reports}
                bookings={bookings}
                initialReportId={recordFocusId}
                onStartBooking={(svcId) => handleStartBooking(svcId)}
              />
            )}

            {activeTab === "membership" && (
              <StudentMembershipView
                membership={membership}
                onChangeMembership={handleChangeMembership}
                onToggleCancelRenewal={handleToggleCancelRenewal}
              />
            )}

            {activeTab === "settings" && (
              <StudentSettingsView
                profile={profile}
                onSaveProfile={(updated) => {
                  setProfile(updated);
                  showToast("success", "Profile Saved");
                }}
                onOpenOnboarding={() => setOnboardingOpen(true)}
                onPrivacyRequest={handlePrivacyRequest}
              />
            )}
          </main>
        </div>
      </div>

      {/* Global Search Modal */}
      {searchModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 bg-zinc-950/45 backdrop-blur-xs"
          onClick={() => setSearchModalOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-white border border-zinc-200 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200">
              <Search className="h-4 w-4 text-zinc-400" />
              <input
                autoFocus
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services, mentors, bookings, reports..."
                className="flex-1 text-sm bg-transparent border-none outline-none text-zinc-900 placeholder:text-zinc-400"
              />
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-zinc-100">
              {searchResults.length === 0 ? (
                <p className="text-xs text-zinc-500 py-6 text-center">
                  {searchQuery.trim()
                    ? `No matches for "${searchQuery}".`
                    : "Type to search career catalogue, verified mentors, or bookings..."}
                </p>
              ) : (
                searchResults.map((res) => (
                  <button
                    key={res.id}
                    type="button"
                    onClick={() => {
                      setSearchModalOpen(false);
                      handleNavigate(res.route, res.recordId);
                    }}
                    className="w-full text-left rounded-lg p-2.5 hover:bg-indigo-50/70 flex items-center justify-between gap-2 transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-zinc-900">{res.title}</p>
                      <p className="text-[11px] text-zinc-500">{res.sub}</p>
                    </div>
                    <span className="shrink-0 rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
                      {res.kind}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <StudentBookingModal
        open={bookingModalState.open}
        serviceId={bookingModalState.serviceId}
        preselectedMentorSlug={bookingModalState.mentorSlug}
        membershipTier={membership.tier}
        onClose={() => setBookingModalState({ open: false, serviceId: null })}
        onBookingConfirmed={handleBookingConfirmed}
      />

      {/* Onboarding Wizard Modal */}
      <StudentOnboardingModal
        open={onboardingOpen}
        profile={profile}
        dimensions={dimensions}
        onClose={() => setOnboardingOpen(false)}
        onCompleteOnboarding={(updatedProfile, updatedDimensions) => {
          setProfile(updatedProfile);
          setDimensions(updatedDimensions);
          showToast("success", "Career Profile Calibrated", "Dashboard readiness updated.");
        }}
      />

      {/* Trust & Policy Guide Modal */}
      <StudentModal
        open={trustGuideOpen}
        onClose={() => setTrustGuideOpen(false)}
        title="DreamX Student Trust & Refund Architecture"
        subtitle="Operational standards, consumer rights, and cancellation rules (PRD 12.1 & 18.3)."
        footer={
          <button
            type="button"
            onClick={() => setTrustGuideOpen(false)}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white"
          >
            I Understand
          </button>
        }
      >
        <div className="space-y-4 text-xs sm:text-sm text-zinc-700">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 space-y-1">
            <h4 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              1. 100% Full Refund Cancellation SLA (PRD 12.1)
            </h4>
            <p className="text-xs text-emerald-900 leading-relaxed">
              You can cancel any scheduled 1:1 session at least 1 hour before start time for an
              immediate 100% full refund back to your original payment method.
            </p>
          </div>

          <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-3.5 space-y-1">
            <h4 className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-[#5145cd]" />
              2. Attributed Readiness Scores (PRD 8.1)
            </h4>
            <p className="text-xs text-indigo-950 leading-relaxed">
              Readiness scores are deterministic preparation benchmarks calculated from documented
              mentor rubric assessments. They are private by default and never promised as a hiring
              or placement guarantee.
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 space-y-1">
            <h4 className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-amber-700" />
              3. Post-Session Quality Guarantee (48h Window)
            </h4>
            <p className="text-xs text-amber-950 leading-relaxed">
              If a session falls short of the published deliverable scope or suffers technical
              disruption, submit an issue within 48 hours for an Operations review. Substantiated
              claims receive an 80% refund.
            </p>
          </div>
        </div>
      </StudentModal>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="fixed inset-0 bg-zinc-950/45 backdrop-blur-xs" />
          <div
            className="relative w-72 max-w-[80vw] bg-white h-full p-4 flex flex-col justify-between shadow-2xl z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-[#5145cd] text-white font-bold flex items-center justify-center text-xs">
                    DX
                  </div>
                  <div>
                    <p className="font-bold text-sm text-zinc-900">DreamX</p>
                    <p className="text-[10px] text-zinc-500 font-mono">STUDENT PORTAL</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center justify-between gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-[#5145cd] text-white"
                          : "text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </span>
                      {item.badgeCount && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            isActive ? "bg-white/20 text-white" : "bg-indigo-100 text-[#4035b3]"
                          }`}
                        >
                          {item.badgeCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom-Right Toast Stack */}
      {toasts.length > 0 && (
        <div
          role="region"
          aria-label="Notification toasts"
          className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-xl p-3.5 shadow-xl border text-xs flex items-start justify-between gap-3 backdrop-blur-md transition-all ${
                toast.tone === "success"
                  ? "bg-emerald-950/90 text-white border-emerald-700/60"
                  : toast.tone === "warning"
                  ? "bg-amber-950/90 text-white border-amber-700/60"
                  : toast.tone === "danger"
                  ? "bg-rose-950/90 text-white border-rose-700/60"
                  : "bg-zinc-950/90 text-white border-zinc-700/60"
              }`}
            >
              <div className="space-y-0.5">
                <p className="font-semibold">{toast.title}</p>
                {toast.detail && <p className="text-[11px] text-white/80">{toast.detail}</p>}
              </div>
              <button
                type="button"
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="text-white/60 hover:text-white"
                aria-label="Dismiss toast"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
