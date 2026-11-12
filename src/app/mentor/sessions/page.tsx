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
} from "lucide-react";

interface SessionData {
  id: string;
  serviceCode: string;
  serviceTitle: string;
  candidateName: string;
  candidateId: string;
  candidateRole: string;
  targetScope: string;
  callTiming: string;
  callDate: string;
  category: "upcoming" | "scorecard_due" | "completed";
  meetUrl?: string;
  meetUnlockInfo?: string;
  resumeFileName?: string;
  atsScore?: string;
  payoutGross: string;
  slaLimitInfo: string;
  slaWarning?: {
    remainingHours: string;
    elapsedHours: string;
    elapsedPct: number;
    cutoff: string;
  };
  completedStats?: {
    deliveredIn: string;
    aheadOfSla: string;
    sha256: string;
    rating: string;
    quote: string;
    settledTo: string;
  };
}

export default function MentorSessionsPage() {
  // Live IST Clock
  const [istTime, setIstTime] = React.useState("16:15:32 UTC+05:30");
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
        setIstTime(`${formatted} UTC+05:30`);
      } catch {
        // fallback
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter tabs
  const [activeTab, setActiveTab] = React.useState<"all" | "upcoming" | "scorecard_due" | "completed">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState("earliest");

  // Interactive Checklist states for SES-7690
  const [rubricChecked, setRubricChecked] = React.useState(false);
  const [readingPlanChecked, setReadingPlanChecked] = React.useState(false);

  // Scorecard modal state
  const [scorecardModalOpen, setScorecardModalOpen] = React.useState(false);
  const [submittedSuccess, setSubmittedSuccess] = React.useState(false);
  const [activeSessionForModal, setActiveSessionForModal] = React.useState<SessionData | null>(null);

  // Scorecard form inputs
  const [dimScores, setDimScores] = React.useState<Record<string, number>>({
    dim1: 8,
    dim2: 7,
    dim3: 6,
    dim4: 8,
    dim5: 7,
    dim6: 8,
    dim7: 7,
    dim8: 6,
  });
  const [qualitativeNotes, setQualitativeNotes] = React.useState(
    "Candidate demonstrated exceptional structured thinking in decomposition of high-throughput distributed locking, but requires deeper calibration on write-conflict trade-offs."
  );

  const initialSessions: SessionData[] = [
    {
      id: "SES-7712",
      serviceCode: "S06",
      serviceTitle: "S06: Technical Mock Interview & Distributed Architecture Drill (60 min Call)",
      candidateName: "Ananya Sharma",
      candidateId: "#DX-8421",
      candidateRole: "Early Career Backend SDE • Targeting Swiggy L5 Systems",
      targetScope: "Microservice Race Conditions, Distributed Mutex (Redlock), Redis Cache Invalidation under heavy read spikes.",
      callTiming: "Live in 3h 15m",
      callDate: "Today, Oct 25 • 07:30 PM – 08:30 PM IST",
      category: "upcoming",
      meetUrl: "meet.google.com/qxr-mkpv-yzt",
      meetUnlockInfo: "Unlocks at 07:15 PM IST (15m prior)",
      resumeFileName: "Resume_Ananya_v4.pdf",
      atsScore: "ATS 92%",
      payoutGross: "₹799",
      slaLimitInfo: "48-hour deliverable countdown begins immediately upon Google Meet completion. Upload 8-D scorecard before Oct 27, 08:30 PM IST.",
    },
    {
      id: "SES-7690",
      serviceCode: "S05",
      serviceTitle: "S05: Behavioral STAR Framework & Leadership Drill (60 min)",
      candidateName: "Kavya Nair",
      candidateId: "#DX-7832",
      candidateRole: "ML Platform Eng @ FinTech",
      targetScope: "Cross-functional leadership pushback, trade-off storytelling under ambiguous executive review.",
      callTiming: "Attendance Verified (58m on Meet)",
      callDate: "Call Completed Yesterday • 08:30 PM IST",
      category: "scorecard_due",
      payoutGross: "₹639",
      slaLimitInfo: "Auto-settles upon report upload and candidate cryptographic sign-off.",
      slaWarning: {
        remainingHours: "18h 45m remaining",
        elapsedHours: "29h 15m elapsed of 48h limit",
        elapsedPct: 62,
        cutoff: "Tomorrow, 08:30 PM IST",
      },
    },
    {
      id: "SES-7540",
      serviceCode: "S01",
      serviceTitle: "S01: Resume Line-by-Line Teardown & ATS Bar-Raiser Audit",
      candidateName: "Tanmay Roy",
      candidateId: "#DX-6941",
      candidateRole: "Frontend Lead",
      targetScope: "Google XYZ formula qualification, tech stack re-indexing for tier-1 unicorns.",
      callTiming: "Delivered & Released",
      callDate: "Delivered Oct 22, 2026",
      category: "completed",
      payoutGross: "₹479",
      slaLimitInfo: "Escrow funds settled directly to mentor registered bank account.",
      completedStats: {
        deliveredIn: "28 hrs",
        aheadOfSla: "20 hrs ahead of SLA",
        sha256: "0x8f2d4e0a7c91b...34f",
        rating: "5/5",
        quote: "Crisp, brutal, actionable feedback on architecture bullet points.",
        settledTo: "HDFC Bank • A/C ending **** 4812 (#PAY-88210)",
      },
    },
  ];

  const [sessions, setSessions] = React.useState<SessionData[]>(initialSessions);

  // Filter and search
  const filteredSessions = sessions.filter((s) => {
    if (activeTab === "upcoming" && s.category !== "upcoming") return false;
    if (activeTab === "scorecard_due" && s.category !== "scorecard_due") return false;
    if (activeTab === "completed" && s.category !== "completed") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        s.id.toLowerCase().includes(q) ||
        s.serviceCode.toLowerCase().includes(q) ||
        s.serviceTitle.toLowerCase().includes(q) ||
        s.candidateName.toLowerCase().includes(q) ||
        s.candidateId.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleScorecardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSessionForModal) return;

    // Move session to completed
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionForModal.id
          ? {
              ...s,
              category: "completed",
              callTiming: "Delivered & Escrow Released",
              completedStats: {
                deliveredIn: "29h 20m",
                aheadOfSla: "18h 40m ahead of SLA",
                sha256: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 5)}`,
                rating: "Pending Review",
                quote: "Scorecard cryptographically committed to student career ledger.",
                settledTo: "Queued for Next Settlement Cycle",
              },
            }
          : s
      )
    );

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setScorecardModalOpen(false);
    }, 1500);
  };

  return (
    <div className="flex-1 bg-[#fcf9f8] text-[#1c1b1b] min-h-screen">
      {/* 1. TOP STICKY BAR */}
      <header className="sticky top-0 z-30 w-full flex items-center justify-between h-16 bg-white border-b border-[#e7e7eb] px-6 lg:px-10">
        {/* Breadcrumb & Subnav */}
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
              Dispatch Queue
            </Link>
            <Link
              href="/mentor/availability"
              className="text-[#474554] hover:text-[#1c1b1b] transition-colors"
            >
              Direct Bookings
            </Link>
            <span className="text-[#5145cd] font-semibold border-b-2 border-[#5145cd] pb-0.5">
              SLA Monitor
            </span>
          </div>
        </div>

        {/* Live Telemetry & Control Center */}
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
              Dual-Control SLA Active
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold bg-[#eaf5ef] text-[#16834a] border border-[#d1edd9]">
              <Lock className="w-3.5 h-3.5" />
              Razorpay Nodal Escrow Route
            </span>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-[#e7e7eb]">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded bg-[#eaf5ef] text-[#16834a]">
              <CheckCircle2 className="w-3 h-3" />
              Verified Mentor
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
                Candidate Sessions &amp; Scorecard Submission Console
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#e3dfff] text-[#130068]">
                L5 Bar Raiser
              </span>
            </div>
            <p className="text-sm text-[#474554] leading-relaxed">
              Standardized 8-dimension rubric scorecards and annotated PDFs must be submitted within 48 hours of session completion to trigger automated escrow payout release under PRD §11.2.
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
              <span>{activeTab === "scorecard_due" ? "Show All Sessions" : "Filter Sessions"}</span>
            </button>
            <a
              href="#rubric-criteria"
              className="px-4 py-2 rounded-lg bg-white border border-[#5145cd] text-[#5145cd] hover:bg-[#e3dfff]/30 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-xs"
            >
              <UploadCloud className="w-4 h-4" />
              <span>View 8-D Rubric Standard (v2.4)</span>
            </a>
          </div>
        </div>

        {/* 2.2 Operational SLA Bento Metrics (3 Cards) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Metric 1 */}
          <div className="bg-white border border-[#e7e7eb] rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[#777585] font-semibold">
              <span>Deliverables In Flight</span>
              <span className="p-1.5 rounded-lg bg-[#e3dfff]/60 text-[#5145cd]">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#1c1b1b] tabular-nums">
                2 Active
              </span>
              <span className="inline-flex items-center text-xs font-semibold text-[#a7670b] bg-[#fbf4e8] px-2 py-0.5 rounded border border-[#f5e3c8]">
                1 Due Soon
              </span>
            </div>
            <p className="text-xs text-[#474554]">
              1 live call upcoming in 3h 15m, 1 post-call rubric scorecard due within SLA window.
            </p>
          </div>

          {/* Metric 2 */}
          <div className="bg-white border border-[#e7e7eb] rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[#777585] font-semibold">
              <span>48-Hour SLA Compliance</span>
              <span className="p-1.5 rounded-lg bg-[#eaf5ef] text-[#16834a]">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#1c1b1b] tabular-nums">
                100.0%
              </span>
              <span className="inline-flex items-center text-xs font-semibold text-[#16834a] bg-[#eaf5ef] px-2 py-0.5 rounded border border-[#d1edd9]">
                Perfect Standing
              </span>
            </div>
            <p className="text-xs text-[#474554]">
              24 / 24 on-time rubric submissions, zero escrow penalties or candidate escalations.
            </p>
          </div>

          {/* Metric 3 */}
          <div className="bg-white border border-[#e7e7eb] rounded-xl p-5 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[#777585] font-semibold">
              <span>Escrow Pending Disbursal</span>
              <span className="p-1.5 rounded-lg bg-[#edf3fc] text-[#2864c5]">
                <Lock className="w-4 h-4" />
              </span>
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#1c1b1b] tabular-nums">
                ₹1,278
              </span>
              <span className="text-xs font-semibold text-[#16834a] bg-[#eaf5ef] px-2 py-0.5 rounded border border-[#d1edd9]">
                Nodal Protected
              </span>
            </div>
            <p className="text-xs text-[#474554]">
              Auto-releases to HDFC Bank (**** 4812) 48h after deliverable validation.
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
              <span>All Active</span>
              <span className="px-1.5 py-0.2 bg-[#e3dfff] text-[#130068] rounded-full text-[10px]">
                {sessions.length}
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
                {sessions.filter((s) => s.category === "upcoming").length}
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
              <span>Scorecard Due</span>
              <span className="px-1.5 py-0.2 bg-[#fbf4e8] text-[#a7670b] rounded-full text-[10px]">
                {sessions.filter((s) => s.category === "scorecard_due").length}
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
              <span>Delivered &amp; Released</span>
              <span className="px-1.5 py-0.2 bg-[#f0eded] text-[#474554] rounded-full text-[10px]">
                24
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
                placeholder="Search Candidate ID, S01-S10..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#e7e7eb] rounded-lg focus:border-[#5145cd] outline-none"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs py-1.5 pl-3 pr-8 bg-white border border-[#e7e7eb] rounded-lg text-[#474554] focus:border-[#5145cd] outline-none"
            >
              <option value="earliest">Earliest Deadline First</option>
              <option value="latest">Latest Scheduled Slot</option>
              <option value="payout">Highest Net Payout</option>
            </select>
          </div>
        </section>

        {/* 2.4 Detailed Session Cards */}
        <section className="space-y-6">
          {filteredSessions.map((session) => {
            // CARD 1: Upcoming Live Call
            if (session.category === "upcoming") {
              return (
                <div
                  key={session.id}
                  className="bg-white border border-[#e7e7eb] rounded-xl overflow-hidden shadow-xs space-y-0"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-[#e7e7eb] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#e3dfff] text-[#5145cd] flex items-center justify-center shrink-0 mt-0.5">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-semibold text-[#5145cd]">
                            {session.id}
                          </span>
                          <span className="text-[#c8c4d6]">•</span>
                          <h3 className="text-base font-bold text-[#1c1b1b]">
                            {session.serviceTitle}
                          </h3>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-[#474554]">
                          <span className="font-semibold text-[#1c1b1b]">
                            {session.candidateName} ({session.candidateId})
                          </span>
                          <span>({session.candidateRole})</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbf4e8] text-[#a7670b] border border-[#f5e3c8] text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{session.callTiming}</span>
                      </div>
                      <span className="mt-1 text-xs text-[#474554] font-tabular">
                        {session.callDate}
                      </span>
                    </div>
                  </div>

                  {/* Milestone Body */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Google Meet & Candidate Dossier */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="bg-[#f6f3f2] border border-[#e7e7eb] rounded-lg p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] uppercase tracking-wider text-[#777585] font-semibold">
                            Google Meet Telemetry
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#16834a]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#16834a]" />
                            Attendance automated via API
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-white border border-[#e7e7eb] px-3 py-2 rounded">
                          <div className="flex items-center gap-2 font-mono text-xs text-[#5145cd] font-semibold">
                            <Video className="w-4 h-4 text-[#777585]" />
                            <span>{session.meetUrl}</span>
                          </div>
                          <span className="text-[11px] text-[#474554] bg-[#f0eded] px-2 py-0.5 rounded">
                            {session.meetUnlockInfo}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-[#1c1b1b] uppercase tracking-wider">
                          Candidate Dossier &amp; Target Drill
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#e7e7eb] bg-white text-xs">
                            <FileText className="w-4 h-4 text-[#5145cd]" />
                            <span className="font-medium text-[#1c1b1b]">{session.resumeFileName}</span>
                            <span className="text-[10px] font-semibold text-[#16834a] bg-[#eaf5ef] px-1.5 py-0.2 rounded">
                              {session.atsScore}
                            </span>
                            <button
                              type="button"
                              onClick={() => alert(`Downloading ${session.resumeFileName}...`)}
                              className="hover:text-[#5145cd] transition-colors ml-1"
                              title="Download Resume"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-[#474554] bg-[#f6f3f2]/60 p-2.5 rounded border border-[#e7e7eb]">
                          <strong className="text-[#1c1b1b]">Targeted Scope:</strong> {session.targetScope}
                        </div>
                      </div>
                    </div>

                    {/* Right: SLA Commitment & Payout Guarantee */}
                    <div className="lg:col-span-5 flex flex-col justify-between bg-[#f6f3f2] border border-[#e7e7eb] rounded-lg p-5">
                      <div className="space-y-2">
                        <span className="text-xs uppercase tracking-wider text-[#777585] font-semibold">
                          SLA Commitment Guarantee
                        </span>
                        <p className="text-xs text-[#474554] leading-relaxed">
                          {session.slaLimitInfo}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#e7e7eb] flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-[#777585] block">Contract Net Payout</span>
                          <span className="text-2xl font-bold text-[#1c1b1b] tabular-nums">
                            {session.payoutGross}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-semibold text-[#16834a] bg-[#eaf5ef] px-2 py-0.5 rounded block">
                            100% Payout Basis
                          </span>
                          <span className="text-[10px] text-[#474554] mt-0.5 block">
                            0% platform deductions • Node #ESC-9941
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-6 py-3 bg-[#f6f3f2] border-t border-[#e7e7eb] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-[#474554]">
                      <CheckCircle2 className="w-4 h-4 text-[#16834a]" />
                      <span>Candidate confirmed audio/video check • Screen sharing permissions validated</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => alert(`Reviewing candidate notes for ${session.candidateId}`)}
                        className="px-4 py-2 rounded-lg border border-[#e7e7eb] bg-white hover:bg-[#f0eded] text-[#1c1b1b] font-medium transition-all"
                      >
                        Review Candidate Notes
                      </button>
                      <button
                        type="button"
                        onClick={() => alert(`Connecting to Google Meet: ${session.meetUrl}`)}
                        className="px-5 py-2 rounded-lg bg-[#5145cd] hover:bg-[#3828b5] text-white font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-[0.99]"
                      >
                        <Video className="w-4 h-4" />
                        <span>Join Google Meet</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // CARD 2: Scorecard Due (Urgent SLA Warning)
            if (session.category === "scorecard_due") {
              return (
                <div
                  key={session.id}
                  className="bg-white border-2 border-[#a7670b]/40 rounded-xl overflow-hidden shadow-xs space-y-0"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-[#e7e7eb] bg-[#fbf4e8]/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#fbf4e8] text-[#a7670b] flex items-center justify-center shrink-0 mt-0.5">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-semibold text-[#474554]">
                            {session.id}
                          </span>
                          <span className="text-[#c8c4d6]">•</span>
                          <h3 className="text-base font-bold text-[#1c1b1b]">
                            {session.serviceTitle}
                          </h3>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-[#474554]">
                          <span className="font-semibold text-[#1c1b1b]">
                            {session.candidateName} ({session.candidateId})
                          </span>
                          <span>• {session.candidateRole}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf5ef] text-[#16834a] border border-[#b2e2c5] text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {session.callTiming}
                      </span>
                      <span className="mt-1 text-xs text-[#474554]">
                        {session.callDate}
                      </span>
                    </div>
                  </div>

                  {/* Body with Amber SLA Countdown Banner */}
                  <div className="p-6 space-y-5">
                    {/* SLA Banner */}
                    <div className="p-4 rounded-lg bg-[#fbf4e8] border border-[#f5e3c8] space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-[#a7670b]">
                          <AlertTriangle className="w-4 h-4 animate-pulse" />
                          <span className="text-xs sm:text-sm font-bold tracking-tight">
                            SLA Deadline Approaching: {session.slaWarning?.remainingHours} to submit 8-D scorecard
                          </span>
                        </div>
                        <span className="text-xs text-[#a7670b] font-medium font-tabular">
                          {session.slaWarning?.elapsedHours}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-[#f0eded] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#a7670b] h-full rounded-full transition-all"
                          style={{ width: `${session.slaWarning?.elapsedPct || 62}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#a7670b]">
                        <span>Notice: Missed 48h SLA triggers automated 80% escrow refund to candidate under PRD §12.2.</span>
                        <span className="font-semibold">Cutoff: {session.slaWarning?.cutoff}</span>
                      </div>
                    </div>

                    {/* Checklist & Net Payout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                      <div className="lg:col-span-8 space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#777585]">
                          Pending Deliverable Checklist
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setRubricChecked(!rubricChecked)}
                            className="p-3 rounded-lg border border-[#e7e7eb] bg-white flex items-center justify-between text-left hover:bg-[#f6f3f2] transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {rubricChecked ? (
                                <CheckSquare className="w-4 h-4 text-[#16834a]" />
                              ) : (
                                <Square className="w-4 h-4 text-[#a7670b]" />
                              )}
                              <span className="text-xs font-medium text-[#1c1b1b]">
                                8-Dimension Rubric Scorecard
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold text-[#ba1a1a] bg-[#ffdad6]/60 px-1.5 py-0.5 rounded">
                              Required
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setReadingPlanChecked(!readingPlanChecked)}
                            className="p-3 rounded-lg border border-[#e7e7eb] bg-white flex items-center justify-between text-left hover:bg-[#f6f3f2] transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {readingPlanChecked ? (
                                <CheckSquare className="w-4 h-4 text-[#16834a]" />
                              ) : (
                                <Square className="w-4 h-4 text-[#a7670b]" />
                              )}
                              <span className="text-xs font-medium text-[#1c1b1b]">
                                Tailored Reading &amp; Action Plan
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold text-[#ba1a1a] bg-[#ffdad6]/60 px-1.5 py-0.5 rounded">
                              Required
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="lg:col-span-4 bg-[#f6f3f2] border border-[#e7e7eb] rounded-lg p-3 flex flex-col justify-between">
                        <div>
                          <span className="text-xs text-[#777585] block">Contract Net Payout</span>
                          <span className="text-2xl font-bold text-[#1c1b1b] tabular-nums">
                            {session.payoutGross}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#474554]">
                          Auto-settles upon report upload and candidate cryptographic sign-off.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-6 py-3 bg-[#fbf4e8]/30 border-t border-[#e7e7eb] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-[#474554]">
                      <Mic className="w-4 h-4 text-[#5145cd]" />
                      <span>Audio recording &amp; AI-generated summary transcript ready for mentor review</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => alert(`Opening Call Notes & Transcript for ${session.candidateId}`)}
                        className="px-4 py-2 rounded-lg border border-[#e7e7eb] bg-white hover:bg-[#f0eded] text-[#1c1b1b] font-medium transition-all"
                      >
                        View Call Notes &amp; Transcript Summary
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSessionForModal(session);
                          setScorecardModalOpen(true);
                        }}
                        className="px-5 py-2 rounded-lg bg-[#5145cd] hover:bg-[#3828b5] text-white font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-[0.99]"
                      >
                        <FileCheck className="w-4 h-4" />
                        <span>Launch 8-D Scorecard Editor / Upload PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // CARD 3: Completed & Escrow Released
            return (
              <div
                key={session.id}
                className="bg-white border border-[#e7e7eb] rounded-xl overflow-hidden opacity-95 hover:opacity-100 transition-opacity shadow-xs space-y-0"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-[#e7e7eb] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#eaf5ef] text-[#16834a] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-semibold text-[#777585]">
                          {session.id}
                        </span>
                        <span className="text-[#c8c4d6]">•</span>
                        <h3 className="text-base font-bold text-[#1c1b1b]">
                          {session.serviceTitle}
                        </h3>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-[#474554]">
                        <span className="font-semibold text-[#1c1b1b]">
                          {session.candidateName} ({session.candidateId})
                        </span>
                        <span>• {session.candidateRole}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf5ef] text-[#16834a] border border-[#b2e2c5] text-xs font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {session.payoutGross} Released to Bank
                    </span>
                    <span className="mt-1 text-xs text-[#474554] font-tabular">
                      {session.completedStats?.settledTo}
                    </span>
                  </div>
                </div>

                {/* Proof & Deliverable Summary */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  <div className="lg:col-span-8 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-[#16834a] bg-[#eaf5ef] px-2 py-0.5 rounded">
                        Delivered in {session.completedStats?.deliveredIn} ({session.completedStats?.aheadOfSla})
                      </span>
                      <span className="text-xs text-[#474554] font-mono">
                        SHA-256: {session.completedStats?.sha256}
                      </span>
                    </div>
                    <p className="text-xs text-[#474554]">
                      Candidate signed off with a <strong>{session.completedStats?.rating}</strong> Mentor Rating:{" "}
                      <em className="text-[#1c1b1b]">&ldquo;{session.completedStats?.quote}&rdquo;</em>
                    </p>
                  </div>

                  <div className="lg:col-span-4 flex items-center justify-end gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => alert(`Downloading verified deliverable for ${session.id}...`)}
                      className="px-3.5 py-1.5 rounded-lg border border-[#e7e7eb] bg-white hover:bg-[#f6f3f2] text-[#1c1b1b] font-medium flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Submitted PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Viewing public deliverable record for ${session.id}`)}
                      className="text-[#5145cd] hover:underline font-semibold"
                    >
                      View Public Deliverable
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

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

          {/* 8-Box Metric Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {[
              {
                id: "DIM-01",
                name: "Requirements & Edge Cases",
                desc: "Scope clarification, functional constraints, out-of-scope boundaries.",
              },
              {
                id: "DIM-02",
                name: "Core Architecture",
                desc: "Component decoupling, microservice boundaries, service mesh.",
              },
              {
                id: "DIM-03",
                name: "Concurrency & Sharding",
                desc: "Distributed locks, database partitions, write-conflict resolution.",
              },
              {
                id: "DIM-04",
                name: "Trade-offs & CAP Realism",
                desc: "Consistency vs Availability justification, pragmatic trade-off analysis.",
              },
              {
                id: "DIM-05",
                name: "Latency & Resilience",
                desc: "Multi-tier caching, circuit breakers, fallback strategies, retry storms.",
              },
              {
                id: "DIM-06",
                name: "API & Data Schemas",
                desc: "Idempotency keys, gRPC vs REST, normalized vs wide-column storage.",
              },
              {
                id: "DIM-07",
                name: "Executive Clarity",
                desc: "Structured top-down communication, handling interviewer pushback.",
              },
              {
                id: "DIM-08",
                name: "Telemetry & Observability",
                desc: "Distributed tracing, RED/USE metrics, SLO/SLA alerting budgets.",
              },
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
            <button
              type="button"
              onClick={() => alert("Downloading Mentor Scoring Rubric v2.4 (PDF)...")}
              className="text-[#5145cd] font-semibold hover:underline shrink-0 flex items-center gap-1"
            >
              <span>Download Mentor Scoring Rubric (v2.4 PDF)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
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
            <Link href="/admin/disputes" className="hover:text-[#1c1b1b] transition-colors">
              L5 Dispute Arbitration
            </Link>
          </div>
        </footer>
      </main>

      {/* 3. MODAL FOR LAUNCHING 8-D SCORECARD EDITOR / UPLOADING PDF */}
      {scorecardModalOpen && activeSessionForModal && (
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
                    {activeSessionForModal.id} • {activeSessionForModal.candidateName} ({activeSessionForModal.candidateId})
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
                  Cryptographic SHA-256 deliverable generated and attached to candidate dossier. Escrow release initiated.
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
                            [dim.key]: Number(e.target.value),
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
                    Detailed Qualitative Annotations &amp; Recommended Action Plan
                  </label>
                  <textarea
                    rows={4}
                    value={qualitativeNotes}
                    onChange={(e) => setQualitativeNotes(e.target.value)}
                    className="w-full text-xs p-3 rounded-lg border border-[#e7e7eb] focus:border-[#5145cd] outline-none"
                    placeholder="Provide specific feedback on code snippets, architectural trade-offs, and books/articles to study..."
                  />
                </div>

                {/* PDF Attachment option */}
                <div className="p-4 rounded-xl border border-dashed border-[#c8c4d6] bg-[#fcf9f8] text-center space-y-1">
                  <UploadCloud className="w-6 h-6 text-[#777585] mx-auto" />
                  <span className="text-xs font-medium text-[#1c1b1b] block">
                    Attach Optional Annotated PDF / Architecture Diagram
                  </span>
                  <span className="text-[11px] text-[#777585]">
                    PDF, PNG up to 10MB (AES-256 encrypted storage)
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-[#16834a] font-semibold">
                    Net Payout to Disburse: {activeSessionForModal.payoutGross}
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
                      className="px-5 py-2 rounded-lg bg-[#5145cd] hover:bg-[#3828b5] text-white text-xs font-semibold transition-all shadow-xs"
                    >
                      Sign &amp; Release Scorecard
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
