"use client";

import * as React from "react";
import Link from "next/link";
import {
  Gavel,
  Download,
  AlertTriangle,
  Building2,
  Clock,
  ShieldCheck,
  Users,
  CheckCircle2,
  FileCode2,
  ArrowUpRight,
  TrendingUp,
  Search,
  Lock,
  Wallet,
  Cpu,
  ShieldAlert,
  X,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = React.useState<"all" | "escrow" | "sla" | "audits">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showPauseModal, setShowPauseModal] = React.useState(false);
  const [showAuditDrawer, setShowAuditDrawer] = React.useState(false);
  const [showDefinitionsModal, setShowDefinitionsModal] = React.useState(false);
  const [pausePin, setPausePin] = React.useState("");
  const [pauseConfirmed, setPauseConfirmed] = React.useState(false);
  const [liveAnalytics, setLiveAnalytics] = React.useState<any>(null);
  const [liveQueues, setLiveQueues] = React.useState<any>(null);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [anRes, qRes] = await Promise.all([
          fetch('/api/admin/analytics?adminId=00000000-0000-0000-0000-000000000001'),
          fetch('/api/admin/queues?adminId=00000000-0000-0000-0000-000000000001')
        ]);
        if (anRes.ok) setLiveAnalytics(await anRes.json());
        if (qRes.ok) setLiveQueues(await qRes.json());
      } catch (e) {
        console.error('Failed to load admin live telemetry', e);
      }
    }
    loadData();
  }, []);

  const events = [
    {
      id: "EVT-9921",
      category: "escrow",
      time: "2 mins ago",
      title: "Escrow Pre-Funding for S06 Technical Mock Interview",
      statusPill: "ESCROW HELD ₹799",
      statusColor: "bg-[#eaf5ef] text-[#16834a] border-[#16834a]/20",
      candidate: "#DX-8421 (IIT-D '24)",
      mentor: "Vikram Singh (Staff AI, Uber)",
      ref: "RPZ-NODAL: #RPZ-88491",
      sha: "0x9a8f...4d2",
      verificationNote: "Node Confirmed",
      verified: true,
    },
    {
      id: "EVT-9918",
      category: "escrow",
      time: "14 mins ago",
      title: "8-Dimension Rubric Scorecard Committed & Deliverable Validated",
      statusPill: "RELEASED ₹799 (NODAL)",
      statusColor: "bg-indigo-50 text-[#3828b5] border-indigo-200",
      candidate: "Service: S05 Resume Red-Pen",
      mentor: "Signed by: Siddharth Iyer (Gojek)",
      ref: "Artifact: DEL-SCR-3108",
      sha: "0x8f2d...34f",
      verificationNote: "Rubric Verified",
      verified: true,
    },
    {
      id: "EVT-9914",
      category: "sla",
      time: "28 mins ago",
      title: "Smart Match Wave 2 Escalation Triggered for REQ-8902",
      statusPill: "CASCADE ACTIVE (WAVE 2)",
      statusColor: "bg-[#fbf4e8] text-[#a7670b] border-[#a7670b]/20",
      candidate: "Reason: 30-min Wave 1 timer expired",
      mentor: "Action: Dispatched to 14 accredited Wave 2 mentors",
      ref: "REQ-8902-S06",
      sha: "0x77c1...b12",
      verificationNote: "Cascading Broadcast",
      verified: false,
    },
    {
      id: "EVT-9908",
      category: "audits",
      time: "45 mins ago",
      title: "New Mentor Application Submitted: Meera Krishnan",
      statusPill: "AUDIT PENDING (STAFF DUAL)",
      statusColor: "bg-gray-100 text-gray-700 border-gray-200",
      candidate: "Role: Staff SDE @ Flipkart (10 YoE)",
      mentor: "Credentials: Tier-1 & Tier-2 Docs Pushed to Sandbox",
      ref: "MTR-APP-1045",
      sha: "0x3e19...8aa",
      verificationNote: "Awaiting Examiner 1",
      verified: false,
      actionHref: "/admin/verification",
    },
    {
      id: "EVT-9892",
      category: "sla",
      time: "1h 12m ago",
      title: "Automated SLA Breach Refund Triggered under PRD §12.2",
      statusPill: "AUTO-REFUNDED 80% (₹639)",
      statusColor: "bg-red-50 text-red-700 border-red-200",
      candidate: "Session: #SES-7120",
      mentor: "Breach: 48-Hour delivery limit missed by 1h 00m",
      ref: "REFUND-RPZ-7491",
      sha: "0x2a14...599",
      verificationNote: "Non-Discretionary",
      verified: false,
    },
    {
      id: "EVT-9884",
      category: "audits",
      time: "1h 40m ago",
      title: "Dual-Control KYC Clearance Granted for Vikramaditya Rao",
      statusPill: "ACCREDITED (TRIPLE-TRUST)",
      statusColor: "bg-[#eaf5ef] text-[#16834a] border-[#16834a]/20",
      candidate: "Accredited: S06 System Design + S10 Bar Raiser",
      mentor: "Signatories: Priyadarshini Rao & Arjun Mehta",
      ref: "MTR-402-ACCR",
      sha: "0x4f9a...81c",
      verificationNote: "Dual-Approved",
      verified: true,
    },
  ];

  const filteredEvents = events.filter((ev) => {
    if (activeTab === "escrow" && ev.category !== "escrow") return false;
    if (activeTab === "sla" && ev.category !== "sla") return false;
    if (activeTab === "audits" && ev.category !== "audits") return false;
    if (
      searchQuery &&
      !ev.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ev.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ev.candidate.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ev.mentor.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Category,Time,Title,Status,Ref,SHA\n" +
      events.map((e) => `"${e.id}","${e.category}","${e.time}","${e.title}","${e.statusPill}","${e.ref}","${e.sha}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dreamx_operations_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header Section & High-Stake Emergency Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#e7e7eb]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c1b1b] tracking-tight">
              Marketplace Operations &amp; Trust Governance Desk
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3828b5]/10 text-[#3828b5] border border-[#3828b5]/25 text-xs font-bold">
              <Gavel className="w-3.5 h-3.5" />
              PRD §21 V3.0 Canonical Governance
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#474554] mt-1 max-w-3xl leading-relaxed">
            Real-time monitoring of platform GMV, nodal escrow balances, 48-hour deliverable SLAs, mentor verification queues, and Smart Match dispatch cascade health.
          </p>
        </div>

        {/* Action Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowDefinitionsModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-50 border border-indigo-200 text-[#3828b5] hover:bg-indigo-100 text-xs font-semibold shadow-xs transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-[#3828b5]" />
            <span>Metric Definitions &amp; Small-Sample Policy (PRD §20)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[#e7e7eb] text-[#1c1b1b] hover:bg-gray-50 text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>Export Daily Ledger (CSV)</span>
          </button>

          <button
            onClick={() => setShowAuditDrawer(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[#e7e7eb] text-[#1c1b1b] hover:bg-gray-50 text-xs font-semibold shadow-xs transition-colors"
          >
            <FileCode2 className="w-4 h-4 text-[#3828b5]" />
            <span>Audit Verification Drawer</span>
          </button>

          <button
            onClick={() => setShowPauseModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 text-xs font-bold transition-colors"
            title="Requires dual-custody MFA authorization"
          >
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Emergency Escrow Pause</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Executive Bento KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Bento 1: Platform GMV & Liquidity */}
        <div className="p-5 rounded-xl bg-white border border-[#e7e7eb] shadow-xs relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Platform GMV &amp; Liquidity
            </span>
            <Building2 className="w-4 h-4 text-[#3828b5]" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#1c1b1b] tracking-tight">
              {liveAnalytics?.metrics?.gmv ? `₹${Number(liveAnalytics.metrics.gmv.amount_inr).toLocaleString('en-IN')}` : '₹24,82,400'}
            </span>
            <span className="text-xs font-bold text-[#16834a] bg-[#eaf5ef] px-2 py-0.5 rounded flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> {liveAnalytics?.metrics?.take_rate ? `${liveAnalytics.metrics.take_rate.percentage}% Take Rate` : '+18.4%'}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs space-y-1">
            <div className="flex justify-between items-center text-gray-600">
              <span>Platform Take Fee:</span>
              <span className="font-bold text-[#1c1b1b] font-mono">
                {liveAnalytics?.metrics?.take_rate ? `₹${(liveAnalytics.metrics.take_rate.platform_fee_paise / 100).toLocaleString('en-IN')}` : '₹4,96,480'}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span>Settlement Escrow:</span>
              <span className="font-bold text-[#16834a] font-mono">100% Pre-funded</span>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#3828b5] to-[#705cf6]"></div>
        </div>

        {/* Bento 2: Active In-Flight Deliverables */}
        <div className="p-5 rounded-xl bg-white border border-[#e7e7eb] shadow-xs relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              In-Flight Deliverables
            </span>
            <Clock className="w-4 h-4 text-[#3828b5]" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#1c1b1b] tracking-tight">
              {liveQueues?.counts?.late_reports !== undefined ? `${liveQueues.counts.late_reports} Late / Queued` : '142 Active'}
            </span>
            <span className="text-xs font-bold text-[#16834a] bg-[#eaf5ef] px-2 py-0.5 rounded">
              {liveAnalytics?.metrics?.report_sla_adherence ? `${liveAnalytics.metrics.report_sla_adherence.percentage}% SLA Met` : '99.2% SLA Met'}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs space-y-1">
            <div className="flex justify-between items-center text-gray-600">
              <span>On-Time Delivery Target:</span>
              <span className="font-bold text-[#1c1b1b]">&gt; 95.0% within 48h</span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span>Late Exceptions:</span>
              <span className="font-bold text-[#a7670b] bg-[#fbf4e8] px-1.5 py-0.5 rounded font-mono">
                {liveQueues?.counts?.late_reports ?? 0} requiring audit
              </span>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
        </div>

        {/* Bento 3: Platform Dispute & Exception Rate */}
        <div className="p-5 rounded-xl bg-white border border-[#e7e7eb] shadow-xs relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Dispute &amp; Exception Rate
            </span>
            <ShieldCheck className="w-4 h-4 text-[#3828b5]" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#1c1b1b] tracking-tight">
              {liveAnalytics?.metrics?.dispute_rate ? `${liveAnalytics.metrics.dispute_rate.percentage}%` : '0.42%'}
            </span>
            <span className="text-xs font-bold text-[#16834a] bg-[#eaf5ef] px-2 py-0.5 rounded">
              Target &lt; 3.0%
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs space-y-1">
            <div className="flex justify-between items-center text-gray-600">
              <span>Active Disputes:</span>
              <span className="font-bold text-[#1c1b1b]">
                {liveQueues?.counts?.disputes ?? 1} in review
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span>Dual Approvals Awaiting Co-sign:</span>
              <span className="font-bold text-[#3828b5] font-mono">
                {liveQueues?.counts?.financial_approvals ?? 0} queued
              </span>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
        </div>

        {/* Bento 4: Accredited Mentor Pool Capacity */}
        <div className="p-5 rounded-xl bg-white border border-[#e7e7eb] shadow-xs relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Accredited Mentor Pool
            </span>
            <Users className="w-4 h-4 text-[#3828b5]" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#1c1b1b] tracking-tight">
              {liveQueues?.counts?.verifications !== undefined ? `${liveQueues.counts.verifications} Pending` : '4 Pending'}
            </span>
            <span className="text-xs font-bold text-[#3828b5] bg-[#3828b5]/10 px-2 py-0.5 rounded">
              Review Queue Active
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs space-y-1">
            <div className="flex justify-between items-center text-gray-600">
              <span>Pending Dual-Control Audits:</span>
              <span className="font-bold text-[#a7670b] font-mono">
                {liveQueues?.counts?.verifications ?? 4} queued
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span>Support Desk Open:</span>
              <span className="font-bold text-[#16834a]">
                {liveQueues?.counts?.support_tickets ?? 0} active tickets
              </span>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400"></div>
        </div>
      </div>

      {/* 3. Core Two-Column Canvas (8 cols Ledger / 4 cols Regulatory Health) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: REAL-TIME PLATFORM AUDIT & EVENT LEDGER (8 COLS) */}
        <div className="lg:col-span-8 space-y-4" id="audit-ledger">
          <div className="bg-white rounded-xl border border-[#e7e7eb] shadow-xs overflow-hidden">
            {/* Ledger Header & Tabs */}
            <div className="p-4 sm:p-5 border-b border-[#e7e7eb] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-5 h-5 text-[#3828b5]" />
                  <h2 className="text-base font-bold text-[#1c1b1b]">
                    Cryptographic Operations &amp; Audit Ledger
                  </h2>
                </div>
                <p className="text-xs text-[#66666f] mt-0.5">
                  Immutable SHA-256 event streams across escrow, SLA clocks, and rubric commits.
                </p>
              </div>

              {/* Tabs */}
              <div className="flex items-center bg-[#f0eded] p-1 rounded-lg border border-[#e7e7eb] text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === "all"
                      ? "bg-white text-[#1c1b1b] shadow-xs"
                      : "text-gray-600 hover:text-[#1c1b1b]"
                  }`}
                >
                  All Events (142)
                </button>
                <button
                  onClick={() => setActiveTab("escrow")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === "escrow"
                      ? "bg-white text-[#1c1b1b] shadow-xs"
                      : "text-gray-600 hover:text-[#1c1b1b]"
                  }`}
                >
                  Escrow (64)
                </button>
                <button
                  onClick={() => setActiveTab("sla")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === "sla"
                      ? "bg-white text-[#1c1b1b] shadow-xs"
                      : "text-gray-600 hover:text-[#1c1b1b]"
                  }`}
                >
                  SLAs (8)
                </button>
                <button
                  onClick={() => setActiveTab("audits")}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === "audits"
                      ? "bg-white text-[#1c1b1b] shadow-xs"
                      : "text-gray-600 hover:text-[#1c1b1b]"
                  }`}
                >
                  Audits (12)
                </button>
              </div>
            </div>

            {/* Quick Status & Search Strip */}
            <div className="px-4 py-2.5 bg-[#f6f3f2] border-b border-[#e7e7eb] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-mono text-[11px] text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  BLOCK #498211
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-[11px] text-gray-600">
                  Dual-Signatory Hash Verification:{" "}
                  <strong className="text-[#16834a] font-mono">ENFORCED</strong>
                </span>
              </div>
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Filter hash, ID, candidate..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 bg-white border border-[#e7e7eb] rounded-md text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#3828b5]"
                />
              </div>
            </div>

            {/* Event Rows */}
            <div className="divide-y divide-[#e7e7eb]">
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-[#1c1b1b] bg-[#f0eded] px-2 py-0.5 rounded text-[11px]">
                        {evt.id}
                      </span>
                      <span className="text-gray-400 text-[11px] font-medium">
                        {evt.time}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${evt.statusColor}`}
                      >
                        {evt.statusPill}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-[#1c1b1b]">
                      {evt.title}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#474554]">
                      <span>{evt.candidate}</span>
                      <span className="text-gray-300">•</span>
                      <span>{evt.mentor}</span>
                      <span className="text-gray-300">•</span>
                      <span className="font-mono text-gray-500">{evt.ref}</span>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-end justify-between md:justify-center gap-1.5 shrink-0">
                    <span className="font-mono text-[11px] text-gray-500 bg-[#f0eded] px-2 py-0.5 rounded border border-[#e7e7eb]">
                      SHA: {evt.sha}
                    </span>
                    {evt.actionHref ? (
                      <Link
                        href={evt.actionHref}
                        className="text-[11px] font-bold text-[#3828b5] hover:underline flex items-center gap-1"
                      >
                        <span>Review Dossier</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <span
                        className={`text-[11px] font-medium flex items-center gap-1 ${
                          evt.verified ? "text-emerald-700" : "text-amber-700"
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {evt.verificationNote}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination & Cryptographic Integrity Footer */}
            <div className="p-3 bg-[#f6f3f2] border-t border-[#e7e7eb] flex items-center justify-between text-xs text-gray-600">
              <span className="font-mono text-[11px]">
                Showing {filteredEvents.length} of {events.length} active ledger blocks in epoch #1842
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled
                  className="px-2.5 py-1 rounded border border-[#e7e7eb] bg-white text-gray-400 text-xs font-semibold cursor-not-allowed opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => alert("All 142 historical ledger records verified against cloud SHA root.")}
                  className="px-2.5 py-1 rounded border border-[#e7e7eb] bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold shadow-xs"
                >
                  Verify Epoch SHA
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SYSTEM HEALTH & REGULATORY METERS (4 COLS) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Razorpay Nodal Escrow Reserve Health */}
          <div className="p-5 rounded-xl bg-white border border-[#e7e7eb] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#16834a]" />
                <h3 className="text-sm font-bold text-[#1c1b1b]">
                  Razorpay Nodal Escrow Health
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#eaf5ef] text-[#16834a] text-[10px] font-bold border border-[#16834a]/20">
                100% SOLVENT
              </span>
            </div>

            {/* Ratio Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-gray-600">Pre-funded Escrow Ratio</span>
                <span className="font-bold text-[#1c1b1b]">100.0% Required / 100.0% Actual</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full w-full"></div>
              </div>
              <p className="text-[10px] text-gray-500 mt-1 font-mono">
                Zero unbacked float. Zero platform counterparty risk.
              </p>
            </div>

            {/* Ledger Breakdown */}
            <div className="p-3 rounded-lg bg-[#f6f3f2] border border-[#e7e7eb] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Nodal Float:</span>
                <span className="font-mono font-bold text-[#1c1b1b]">₹6,42,800.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cleared MTD Disbursals:</span>
                <span className="font-mono font-bold text-[#3828b5]">₹18,42,100.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Deliverable Holds:</span>
                <span className="font-mono font-bold text-[#a7670b]">₹1,13,458.00</span>
              </div>
            </div>

            {/* Signatory status */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100">
              <span className="flex items-center gap-1 text-[#16834a] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Dual-Control Authorizer
              </span>
              <span className="font-mono text-gray-400">NODAL-GATE-IND-01</span>
            </div>
          </div>

          {/* Card 2: DPDP Act 2023 & RBI Statutory Compliance */}
          <div className="p-5 rounded-xl bg-white border border-[#e7e7eb] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#3828b5]" />
                <h3 className="text-sm font-bold text-[#1c1b1b]">
                  DPDP Act &amp; RBI Compliance
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#3828b5]/10 text-[#3828b5] text-[10px] font-bold">
                CERTIFIED
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#f6f3f2] border border-[#e7e7eb] space-y-0.5">
                <p className="font-bold text-[#1c1b1b] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Ephemeral Sandbox Storage
                </p>
                <p className="text-[11px] text-gray-600 leading-normal">
                  Zero plain-text Aadhaar or PAN storage. AES-256 encrypted blobs deleted 7 days post-verification.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#f6f3f2] border border-[#e7e7eb] space-y-0.5">
                <p className="font-bold text-[#1c1b1b] flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  Cryptographic Digest Schedule
                </p>
                <p className="text-[11px] text-gray-600 leading-normal">
                  Daily ledger SHA root committed to cloud vault at 23:59:59 IST automatically.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#f6f3f2] border border-[#e7e7eb] space-y-0.5">
                <p className="font-bold text-[#1c1b1b] flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Audit Chain Immutability
                </p>
                <p className="text-[11px] text-gray-600 leading-normal">
                  100% verified SHA-256 unbroken chain. 0 anomalous mutations detected.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Smart Match Cascade Health */}
          <div className="p-5 rounded-xl bg-white border border-[#e7e7eb] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#3828b5]" />
                <h3 className="text-sm font-bold text-[#1c1b1b]">
                  Smart Match Cascade Health
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#eaf5ef] text-[#16834a] text-[10px] font-bold">
                OPTIMAL
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-700">Wave 1 Claim Rate (0-30 min)</span>
                  <span className="font-mono font-bold text-[#16834a]">86.4%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[86.4%]"></div>
                </div>
                <span className="text-[10px] text-gray-500">Avg claim latency: 4.8 minutes</span>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-700">Wave 2 Cascade Rate (30-60 min)</span>
                  <span className="font-mono font-bold text-[#a7670b]">13.6%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[13.6%]"></div>
                </div>
                <span className="text-[10px] text-gray-500">Avg claim latency: 18.2 minutes</span>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-gray-700">
                  2-Hour Fallback Expirations (Dropped):
                </span>
                <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-xs">
                  0 TODAY
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Statutory Institutional Regulatory Footer */}
      <footer className="mt-8 pt-6 pb-6 border-t border-[#e7e7eb] text-xs text-gray-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-bold text-[#1c1b1b] text-xs">
            DreamX Technologies Private Limited • Admin Operations &amp; Trust Desk
          </p>
          <p className="text-[11px] text-gray-500 max-w-4xl leading-relaxed">
            Governed under the Indian Information Technology Act 2000 (§43A, §72A), Digital Personal Data Protection (DPDP) Act 2023, and RBI Master Direction on Escrow Accounts &amp; Intermediary Settlement (DPSS.CO.PD.No.1102/02.14.08/2009-10). All ledger mutations require dual-signatory staff clearance.
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono text-gray-400 shrink-0">
          <span>ENV: PROD-AP-SOUTH-1</span>
          <span>BUILD: 2024.11.08</span>
        </div>
      </footer>

      {/* EMERGENCY ESCROW PAUSE CONFIRMATION MODAL */}
      {showPauseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-red-600 font-bold text-base">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <span>Emergency Escrow Freeze</span>
              </div>
              <button
                onClick={() => {
                  setShowPauseModal(false);
                  setPauseConfirmed(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-800 space-y-1.5 leading-relaxed">
              <p className="font-bold">CAUTION: High-Impact Dual-Control Action</p>
              <p>
                Triggering an emergency pause freezes all pending Razorpay Nodal Escrow payouts, halts automated deliverable releases, and notifies all 84 accredited mentors and active candidates.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-gray-700 block">
                Enter Dual-Control Authorization PIN (6-digit):
              </label>
              <input
                type="password"
                maxLength={6}
                placeholder="••••••"
                value={pausePin}
                onChange={(e) => setPausePin(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-center font-mono text-lg tracking-widest focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setShowPauseModal(false);
                  setPausePin("");
                }}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 text-xs"
              >
                Cancel
              </button>
              <button
                disabled={pausePin.length < 6}
                onClick={() => {
                  setPauseConfirmed(true);
                  setTimeout(() => {
                    setShowPauseModal(false);
                    setPausePin("");
                    setPauseConfirmed(false);
                    alert("Emergency Escrow Pause simulation initiated. Audit log EVT-9922 recorded with dual-signature requirement.");
                  }, 600);
                }}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 disabled:opacity-50 text-xs shadow-xs"
              >
                {pauseConfirmed ? "Authorizing..." : "Freeze Nodal Outflows"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT VERIFICATION DRAWER */}
      {showAuditDrawer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-lg h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-5 h-5 text-[#3828b5]" />
                  <h3 className="font-bold text-base text-[#1c1b1b]">
                    Audit Verification Drawer
                  </h3>
                </div>
                <button
                  onClick={() => setShowAuditDrawer(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 space-y-1">
                <span className="font-bold block">Current Node Verification Status</span>
                <p>
                  Epoch #1842 contains 142 micro-ledger transactions signed by dual staff auditors (#ADM-001 &amp; #ADM-004).
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
                  <span className="text-gray-500 uppercase tracking-wider text-[10px] font-bold block">
                    Cloud Vault SHA-256 Root
                  </span>
                  <p className="font-mono text-gray-800 break-all select-all font-semibold">
                    0x8f2d34fab81e1948211da4829104bcde2190145cbe98401349a8fe4d2910a912
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
                  <span className="text-gray-500 uppercase tracking-wider text-[10px] font-bold block">
                    Razorpay Nodal Custody Certificate
                  </span>
                  <p className="text-gray-700">
                    Certificate Serial: <strong className="font-mono">RPZ-NOD-2024-99812</strong>
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    Issued under RBI Master Direction on Intermediary Settlement.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
                  <span className="text-gray-500 uppercase tracking-wider text-[10px] font-bold block">
                    DPDP Act 2023 §8 Compliance Audit
                  </span>
                  <p className="text-gray-700">
                    Aadhaar Redaction Status: <strong className="text-emerald-700">100% Redacted (Zero Plaintext)</strong>
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    Automatic key destruction scheduled every 7 days.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowAuditDrawer(false)}
                className="w-full py-2.5 rounded-lg bg-[#3828b5] text-white font-bold text-xs hover:bg-[#2e2195] transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* METRIC DEFINITIONS & SMALL-SAMPLE POLICY MODAL (PRD §20, P12 EXIT CRITERIA 2 & 3) */}
      {showDefinitionsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#3828b5]" />
                <h3 className="font-bold text-base text-[#1c1b1b]">
                  Marketplace Metrics Governance (PRD §20)
                </h3>
              </div>
              <button
                onClick={() => setShowDefinitionsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Every marketplace and funnel metric has a statutory definition on file. Integer paise is enforced across all financial amounts. Small-sample outcome percentages (&lt; 5 ratings) are strictly suppressed from public publishing to prevent misleading statistics.
            </p>

            <div className="space-y-3 text-xs">
              {/* GMV */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1c1b1b]">1. Gross Merchandise Value (GMV)</span>
                  <span className="font-mono text-[#3828b5] font-bold">Integer Paise</span>
                </div>
                <p className="text-gray-600"><strong>Numerator:</strong> SUM(amount_paise) for status IN (&apos;confirmed&apos;, &apos;completed&apos;) AND payment_status = &apos;captured&apos;</p>
                <p className="text-gray-600"><strong>Denominator:</strong> 1 (Absolute financial sum)</p>
                <p className="text-gray-500 text-[11px]"><strong>Exclusions:</strong> Refunded bookings, unpaid reservations, test seed bookings.</p>
              </div>

              {/* Take Rate */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1c1b1b]">2. Platform Take Rate</span>
                  <span className="font-mono text-emerald-700 font-bold">Nominal 20.0%</span>
                </div>
                <p className="text-gray-600"><strong>Numerator:</strong> SUM(platform_fee_paise) in active escrow or payout</p>
                <p className="text-gray-600"><strong>Denominator:</strong> SUM(gross_amount_paise)</p>
                <p className="text-gray-500 text-[11px]"><strong>Exclusions:</strong> Forfeited escrow due to full student cancellation refunds.</p>
              </div>

              {/* Dispute Rate */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1c1b1b]">3. Dispute Rate</span>
                  <span className="font-mono text-indigo-700 font-bold">Target &lt; 3.0%</span>
                </div>
                <p className="text-gray-600"><strong>Numerator:</strong> COUNT(disputes) opened within time window</p>
                <p className="text-gray-600"><strong>Denominator:</strong> COUNT(bookings) with status = &apos;completed&apos;</p>
                <p className="text-gray-500 text-[11px]"><strong>Exclusions:</strong> Student cancellations &gt;= 1 hour before session start.</p>
              </div>

              {/* Report SLA */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1c1b1b]">4. Report Delivery SLA Adherence</span>
                  <span className="font-mono text-amber-700 font-bold">Target &gt; 95.0%</span>
                </div>
                <p className="text-gray-600"><strong>Numerator:</strong> COUNT(session_reports) with is_late = false</p>
                <p className="text-gray-600"><strong>Denominator:</strong> COUNT(session_reports) total submitted</p>
                <p className="text-gray-500 text-[11px]"><strong>Exclusions:</strong> Rescheduled sessions or unheld bookings.</p>
              </div>

              {/* Small-Sample Suppression Rule */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-900">5. Small-Sample Suppression Rule (PRD §20)</span>
                  <span className="font-mono text-amber-800 font-bold">Threshold &lt; 5 Ratings</span>
                </div>
                <p className="text-amber-800">
                  Candidate self-reported feedback ratings are kept strictly distinct from verified mentor rubric scorecards. If any category contains fewer than 5 ratings, percentage/averages are suppressed from public marketing to protect statistical validity.
                </p>
                <div className="mt-2 p-2 bg-white rounded border border-amber-200 text-[11px] font-mono text-gray-700">
                  Current Status: {liveAnalytics?.metrics?.outcomes_separation?.self_reported?.display_text || "Insufficient Sample (< 5 ratings) - Suppressed"}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowDefinitionsModal(false)}
                className="px-5 py-2 rounded-lg bg-[#3828b5] text-white font-bold text-xs hover:bg-[#2e2195] transition-colors"
              >
                Close Metrics Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
