"use client";

import * as React from "react";
import Image from "next/image";
import {
  Gavel,
  Download,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  Mail,
  Globe,
  Eye,
  XCircle,
  PenTool,
  RotateCcw,
  Search,
  X,
  FileCode2,
} from "lucide-react";

interface Dossier {
  id: string;
  name: string;
  title: string;
  company: string;
  expYears: number;
  emailMasked: string;
  avatarUrl: string;
  services: { code: string; label: string }[];
  proofNote: string;
  scoreNote: string;
  slaLeft: string;
  slaUrgent?: boolean;
  examiner1: { name: string; signed: boolean };
  examiner2: { name: string; signed: boolean };
  status: "pending" | "approved" | "rejected" | "flagged";
}

export default function AdminMentorVerificationPage() {
  const [activeTab, setActiveTab] = React.useState<"pending" | "approved" | "flagged" | "rejected">("pending");
  const [seniorityFilter, setSeniorityFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDossier, setSelectedDossier] = React.useState<Dossier | null>(null);
  const [rejectingDossier, setRejectingDossier] = React.useState<Dossier | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState("");

  const [dossiers, setDossiers] = React.useState<Dossier[]>([
    {
      id: "MTR-APP-1029",
      name: "Siddharth Verma",
      title: "Staff L6 Software Engineer",
      company: "Google Bengaluru",
      expYears: 9,
      emailMasked: "s***h@google.com",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      services: [
        { code: "S06", label: "Technical Mock (System)" },
        { code: "S07", label: "System Design Mastery" },
      ],
      proofNote: "Corporate badge redacted (AES-256 encrypted on S3)",
      scoreNote: "System design diagnostic test: 94/100",
      slaLeft: "14h 22m remaining",
      examiner1: { name: "Arjun Mehta (#ADM-001)", signed: true },
      examiner2: { name: "Awaiting Co-Signatory", signed: false },
      status: "pending",
    },
    {
      id: "MTR-APP-1033",
      name: "Neha Kulkarni",
      title: "Lead Product Manager",
      company: "Razorpay FinTech Core",
      expYears: 7,
      emailMasked: "n***i@razorpay.com",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
      services: [
        { code: "S01", label: "Resume Line-by-Line Review" },
        { code: "S03", label: "LinkedIn Teardown" },
      ],
      proofNote: "Offer Letter & W-2 equivalent verified",
      scoreNote: "Case study rubric score: 96/100 (Top quartile)",
      slaLeft: "19h 05m remaining",
      examiner1: { name: "Unassigned", signed: false },
      examiner2: { name: "Unassigned", signed: false },
      status: "pending",
    },
    {
      id: "MTR-APP-1042",
      name: "Aditya Sengupta",
      title: "Principal Architect",
      company: "Uber Core Dispatch",
      expYears: 12,
      emailMasked: "a***a@uber.com",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      services: [
        { code: "S06", label: "Concurrency & Distributed" },
        { code: "S07", label: "System Architecture" },
        { code: "S08", label: "High-Scale Data Pipelines" },
      ],
      proofNote: "Corporate OTP & GitHub OSS architecture validated",
      scoreNote: "100% Diagnostic Quiz Pass (Scorecard locked)",
      slaLeft: "21h 40m remaining",
      examiner1: { name: "Priyadarshini Rao (#ADM-004)", signed: true },
      examiner2: { name: "Awaiting Co-Signatory", signed: false },
      status: "pending",
    },
    {
      id: "MTR-APP-1048",
      name: "Pooja Nair",
      title: "Senior Engineering Manager",
      company: "Swiggy Delivery Infra",
      expYears: 8,
      emailMasked: "p***a@swiggy.in",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
      services: [{ code: "S05", label: "Behavioral STAR Drill & Leadership" }],
      proofNote: "Aadhaar Sandbox Hash Verified & Digilocker match",
      scoreNote: "STAR interview rubric standard: 92/100",
      slaLeft: "7h 50m remaining",
      slaUrgent: true,
      examiner1: { name: "Unassigned", signed: false },
      examiner2: { name: "Unassigned", signed: false },
      status: "pending",
    },
  ]);

  const handleSign = (id: string) => {
    setDossiers((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        if (!d.examiner1.signed) {
          return {
            ...d,
            examiner1: { name: "Arjun Mehta (#ADM-001)", signed: true },
          };
        } else if (!d.examiner2.signed) {
          return {
            ...d,
            examiner2: { name: "Arjun Mehta (#ADM-001 Co-Sign)", signed: true },
            status: "approved",
          };
        }
        return d;
      })
    );
  };

  const handleBatchSignOff = () => {
    setDossiers((prev) =>
      prev.map((d) => {
        if (d.status === "pending") {
          return {
            ...d,
            examiner1: { name: "Arjun Mehta (#ADM-001)", signed: true },
            examiner2: { name: "Priyadarshini Rao (#ADM-004)", signed: true },
            status: "approved",
          };
        }
        return d;
      })
    );
    alert("Batch dual-control signature executed for all eligible pending dossiers! 4 mentors activated into Smart Match dispatch pool.");
  };

  const handleRejectConfirm = () => {
    if (!rejectingDossier) return;
    setDossiers((prev) =>
      prev.map((d) => (d.id === rejectingDossier.id ? { ...d, status: "rejected" } : d))
    );
    setRejectingDossier(null);
    setRejectionReason("");
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dossiers, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `dreamx_mentor_verification_manifest_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
  };

  const filteredDossiers = dossiers.filter((d) => {
    if (activeTab === "pending" && d.status !== "pending") return false;
    if (activeTab === "approved" && d.status !== "approved") return false;
    if (activeTab === "flagged" && d.status !== "flagged") return false;
    if (activeTab === "rejected" && d.status !== "rejected") return false;

    if (seniorityFilter === "staff" && !d.title.toLowerCase().includes("staff") && !d.title.toLowerCase().includes("principal")) {
      return false;
    }
    if (seniorityFilter === "manager" && !d.title.toLowerCase().includes("manager")) {
      return false;
    }
    if (seniorityFilter === "lead" && !d.title.toLowerCase().includes("lead")) {
      return false;
    }

    if (
      searchQuery &&
      !d.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !d.company.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !d.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !d.services.some((s) => s.code.toLowerCase().includes(searchQuery.toLowerCase()) || s.label.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#e7e7eb]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c1b1b] tracking-tight">
              Mentor Verification &amp; Accreditation Desk
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf3fc] text-[#2864c5] border border-[#bad5f7] text-xs font-bold">
              <Gavel className="w-3.5 h-3.5" />
              PRD §9 &amp; §18 Statutory Audit
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#474554] mt-1 max-w-3xl leading-relaxed">
            Rigorous dual-control auditing of applicant identity, employer tenure (strict 5+ YoE bar), corporate email OTP verification, and service-specific rubric testing per PRD §9 &amp; §18. Dual cryptographic signatures mandatory for release into dispatch matrix.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={seniorityFilter}
            onChange={(e) => setSeniorityFilter(e.target.value)}
            className="bg-white border border-[#e7e7eb] rounded-lg px-3 py-2 text-xs font-semibold text-[#1c1b1b] focus:outline-none focus:border-[#3828b5]"
          >
            <option value="all">Filter by Seniority: All Bands</option>
            <option value="staff">Staff / Principal (L6+)</option>
            <option value="manager">Senior Manager / Director</option>
            <option value="lead">Lead PM / Staff Architect</option>
          </select>

          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[#e7e7eb] text-[#1c1b1b] hover:bg-gray-50 text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>Export Manifest (JSON)</span>
          </button>

          <button
            onClick={handleBatchSignOff}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3828b5] text-white hover:bg-[#2e2195] text-xs font-bold shadow-xs transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Batch Audit Sign-Off</span>
          </button>
        </div>
      </div>

      {/* 2. Queue Metrics Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Pending Queue Backlog */}
        <div className="p-5 rounded-xl bg-white border border-[#e7e7eb] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Pending Queue Backlog
              </span>
              <Clock className="w-4 h-4 text-[#a7670b]" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1c1b1b]">
                {dossiers.filter((d) => d.status === "pending").length} Dossiers
              </span>
              <span className="text-xs font-bold text-[#a7670b] bg-[#fbf4e8] px-2 py-0.5 rounded border border-[#f5d9aa]">
                1 Urgent (&lt;8h left)
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span>Avg turnaround: <strong className="text-[#1c1b1b] font-mono">6.2 hrs</strong></span>
            <span className="font-mono text-gray-400">24h Max SLA</span>
          </div>
        </div>

        {/* Card 2: Accreditation Pass Bar */}
        <div className="p-5 rounded-xl bg-white border border-[#e7e7eb] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Accreditation Pass Bar
              </span>
              <ShieldCheck className="w-4 h-4 text-[#2864c5]" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1c1b1b]">
                31.8%
              </span>
              <span className="text-xs font-bold text-[#16834a] bg-[#eaf5ef] px-2 py-0.5 rounded">
                68.2% Gate Barred
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span>Preserves Tier-1 FAANG / Unicorn standards</span>
            <span className="font-mono text-gray-400 font-bold">PRD §9 Bar-Raiser</span>
          </div>
        </div>

        {/* Card 3: Auditor Protocol Compliance */}
        <div className="p-5 rounded-xl bg-white border border-[#e7e7eb] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Auditor Protocol Compliance
              </span>
              <CheckCircle2 className="w-4 h-4 text-[#16834a]" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#16834a]">
                100% Dual-Signed
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span>Zero single-party bypasses tolerated</span>
            <span className="font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded text-[11px]">
              SHA-256 Ledger
            </span>
          </div>
        </div>
      </div>

      {/* 3. Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-xl border border-[#e7e7eb]">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === "pending"
                ? "bg-[#3828b5] text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span>Pending Review</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === "pending" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"}`}>
              {dossiers.filter((d) => d.status === "pending").length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("approved")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === "approved"
                ? "bg-[#3828b5] text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span>Approved &amp; Active</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === "approved" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"}`}>
              84
            </span>
          </button>

          <button
            onClick={() => setActiveTab("flagged")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === "flagged"
                ? "bg-[#3828b5] text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span>Flagged / Clarification</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === "flagged" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800"}`}>
              2
            </span>
          </button>

          <button
            onClick={() => setActiveTab("rejected")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === "rejected"
                ? "bg-[#3828b5] text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span>Rejected</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === "rejected" ? "bg-white/20 text-white" : "bg-red-100 text-red-800"}`}>
              18
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Filter by Name, Employer, or Service Code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f6f3f2] border border-[#e7e7eb] rounded-lg text-[#1c1b1b] placeholder:text-gray-400 focus:outline-none focus:border-[#3828b5]"
          />
        </div>
      </div>

      {/* 4. Detailed Dossier Cards */}
      <div className="space-y-4">
        {filteredDossiers.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-[#e7e7eb] space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="font-bold text-sm text-[#1c1b1b]">No dossiers matching current criteria</p>
            <p className="text-xs text-gray-500">All pending mentor verification queues in this category have been processed.</p>
          </div>
        ) : (
          filteredDossiers.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-xl border border-[#e7e7eb] shadow-xs hover:border-[#3828b5]/40 transition-all overflow-hidden"
            >
              <div className="p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                {/* Left: Applicant info & badges */}
                <div className="flex items-start gap-4 min-w-[320px]">
                  <div className="relative shrink-0">
                    <Image
                      src={d.avatarUrl}
                      alt={d.name}
                      width={56}
                      height={56}
                      unoptimized
                      className="w-14 h-14 rounded-xl object-cover border border-[#e7e7eb]"
                    />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#eaf5ef] text-[#16834a] border border-[#16834a]/30 rounded-full flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base text-[#1c1b1b]">
                        {d.name}
                      </h3>
                      <span className="font-mono text-xs text-gray-500 bg-[#f0eded] px-2 py-0.5 rounded border border-[#e7e7eb]">
                        {d.id}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#edf3fc] text-[#2864c5] border border-[#bad5f7]">
                        {d.title}
                      </span>
                    </div>

                    <p className="text-xs text-[#1c1b1b] font-medium flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" />
                      <span>{d.company}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500">{d.expYears} Years Verified Exp</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#16834a] bg-[#eaf5ef] px-2 py-0.5 rounded border border-[#16834a]/20">
                        <Mail className="w-3 h-3" /> {d.emailMasked} OTP ✓
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-[#f6f3f2] px-2 py-0.5 rounded border border-[#e7e7eb]">
                        <Globe className="w-3 h-3 text-[#2864c5]" /> LinkedIn Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle: Services applied & Evidence Rubric */}
                <div className="flex-1 border-t xl:border-t-0 xl:border-l border-gray-100 pt-3 xl:pt-0 xl:pl-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Requested Service Accreditations
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {d.services.map((svc) => (
                        <span
                          key={svc.code}
                          className="px-2 py-1 bg-[#f0eded] rounded-md text-xs font-semibold text-[#1c1b1b] flex items-center gap-1 border border-[#e7e7eb]"
                        >
                          <span className="font-mono text-[#3828b5] font-bold">
                            {svc.code}
                          </span>
                          <span>{svc.label}</span>
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-[11px] text-gray-500 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{d.proofNote}</span>
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Dual-Control Status (PRD §21)
                    </span>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 flex items-center gap-1.5">
                          {d.examiner1.signed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#16834a]" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                          )}
                          <span><strong>Examiner 1:</strong> {d.examiner1.name}</span>
                        </span>
                        <span className={`font-mono text-[10px] font-bold ${d.examiner1.signed ? "text-[#16834a]" : "text-gray-400"}`}>
                          {d.examiner1.signed ? "SIGNED" : "UNASSIGNED"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 flex items-center gap-1.5">
                          {d.examiner2.signed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#16834a]" />
                          ) : (
                            <RotateCcw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                          )}
                          <span><strong>Examiner 2:</strong> {d.examiner2.name}</span>
                        </span>
                        <span className={`font-mono text-[10px] font-bold ${d.examiner2.signed ? "text-[#16834a]" : "text-[#a7670b]"}`}>
                          {d.examiner2.signed ? "SIGNED" : "PENDING CO-SIGN"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: SLA & Action Buttons */}
                <div className="flex flex-col sm:flex-row xl:flex-col items-end justify-between gap-3 shrink-0 pt-3 xl:pt-0 border-t xl:border-t-0 border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock className={`w-4 h-4 ${d.slaUrgent ? "text-red-500 animate-pulse" : "text-amber-600"}`} />
                    <span>
                      Review SLA:{" "}
                      <strong className={`font-mono ${d.slaUrgent ? "text-red-600 font-bold" : "text-[#1c1b1b]"}`}>
                        {d.slaLeft}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setSelectedDossier(d)}
                      className="px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#1c1b1b] hover:bg-gray-100 rounded-lg border border-[#e7e7eb] transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-gray-500" />
                      <span>Inspect</span>
                    </button>

                    <button
                      onClick={() => setRejectingDossier(d)}
                      className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => handleSign(d.id)}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#3828b5] hover:bg-[#2e2195] rounded-lg shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>
                        {!d.examiner1.signed
                          ? "Sign as Examiner 1"
                          : !d.examiner2.signed
                          ? "Approve & Co-Sign"
                          : "Fully Signed"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* INSPECT DOSSIER MODAL */}
      {selectedDossier && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Image
                  src={selectedDossier.avatarUrl}
                  alt={selectedDossier.name}
                  width={40}
                  height={40}
                  unoptimized
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-bold text-base text-[#1c1b1b]">
                    {selectedDossier.name} • {selectedDossier.id}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedDossier.title} @ {selectedDossier.company}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDossier(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
                <span className="text-gray-500 font-bold block text-[10px] uppercase">
                  Verified Corporate Email
                </span>
                <p className="font-mono text-[#1c1b1b] font-semibold">
                  {selectedDossier.emailMasked}
                </p>
                <span className="text-[10px] text-emerald-700">
                  Domain DNS &amp; OTP token matched.
                </span>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
                <span className="text-gray-500 font-bold block text-[10px] uppercase">
                  Total Experience Bar (PRD §9)
                </span>
                <p className="font-bold text-[#1c1b1b]">
                  {selectedDossier.expYears} Years (Meets 5+ YoE Threshold)
                </p>
                <span className="text-[10px] text-emerald-700">
                  LinkedIn tenure &amp; tax certificate confirmed.
                </span>
              </div>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs space-y-1.5">
              <span className="font-bold text-[#3828b5] block">
                Evidence Artifacts &amp; Test Scorecards
              </span>
              <p className="text-[#1c1b1b]">
                {selectedDossier.scoreNote}
              </p>
              <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-gray-600">
                <FileCode2 className="w-3.5 h-3.5 text-[#3828b5]" />
                <span>SHA-256 Digest: 0x4f81c9a01948ba281...</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-xs text-gray-500 font-mono">
                Dual Signatures Enforced (PRD §21)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDossier(null)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleSign(selectedDossier.id);
                    setSelectedDossier(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#3828b5] text-white text-xs font-bold hover:bg-[#2e2195]"
                >
                  Sign Dossier Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectingDossier && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-red-600 font-bold text-base">
                <XCircle className="w-5 h-5 text-red-600" />
                <span>Reject Mentor Application</span>
              </div>
              <button
                onClick={() => setRejectingDossier(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Rejecting applicant <strong>{rejectingDossier.name}</strong> ({rejectingDossier.id}). Provide a statutory reason code per PRD §9:
            </p>

            <select
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-red-500"
            >
              <option value="">Select Statutory Rejection Code</option>
              <option value="yoe">Tenure under minimum 5-year requirement (PRD §9.1)</option>
              <option value="otp">Corporate domain email unverified or personal email supplied</option>
              <option value="rubric">Failed 8-dimension diagnostic rubric scoring bar (&lt;85%)</option>
              <option value="policy">Employer moonlight policy non-compliance / conflict of interest</option>
            </select>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setRejectingDossier(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 text-xs"
              >
                Cancel
              </button>
              <button
                disabled={!rejectionReason}
                onClick={handleRejectConfirm}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 disabled:opacity-50 text-xs shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
