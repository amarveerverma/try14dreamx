"use client";

import * as React from "react";
import Link from "next/link";
import {
  Gavel,
  Download,
  AlertTriangle,
  Clock,
  ShieldCheck,
  FileText,
  CheckCircle2,
  Hourglass,
  ExternalLink,
  Headphones,
  Check,
  FileCode2,
  RotateCcw,
} from "lucide-react";

export default function AdminDisputesPage() {
  const [selectedProtocol, setSelectedProtocol] = React.useState<"A" | "B" | "C">("A");
  const [coSigned, setCoSigned] = React.useState(false);
  const [executingDisgorgement, setExecutingDisgorgement] = React.useState(false);
  const [disgorgementSuccess, setDisgorgementSuccess] = React.useState(false);
  const [playingAudio, setPlayingAudio] = React.useState(false);

  const handleExecuteRuling = () => {
    setExecutingDisgorgement(true);
    setTimeout(() => {
      setExecutingDisgorgement(false);
      setCoSigned(true);
      setDisgorgementSuccess(true);
    }, 1200);
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "CaseID,Candidate,Mentor,Session,EscrowHold,Protocol,Status\n" +
      `"DSP-104","Aakash Gupta (#DX-3312)","Vikramaditya Rao (#MTR-402)","SES-7120","₹799","Protocol ${selectedProtocol}","${coSigned ? "Executed" : "Awaiting Co-Sign"}"\n` +
      `"DSP-103","Rohan Sharma (#DX-7749)","Ananya Sen (#MTR-218)","SES-7094","₹529","Dismissed (No-Show)","Resolved"\n` +
      `"DSP-101","Tanvi Mathur (#DX-4190)","Kunal Roy (#MTR-305)","SES-6981","₹760","50% Mutual Restitution","Resolved"\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dreamx_disputes_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#e7e7eb]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c1b1b] tracking-tight">
              Dispute Resolution &amp; Escrow Arbitration Desk
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3828b5]/10 text-[#3828b5] border border-[#3828b5]/25 text-xs font-bold">
              <Gavel className="w-3.5 h-3.5" />
              PRD §12.1 Statutory Governance
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#474554] mt-1 max-w-3xl leading-relaxed">
            Enforcing PRD §12.1, §12.2 and §21. 72-hour binding dual-control arbitration window for candidate-mentor session exceptions, 48-hour deliverable SLA breaches, and automated Razorpay nodal escrow disgorgement.
          </p>
        </div>

        {/* Action Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[#e7e7eb] text-[#1c1b1b] hover:bg-gray-50 text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>Export Dispute Manifest (CSV)</span>
          </button>

          <Link
            href="/refunds"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[#e7e7eb] text-[#1c1b1b] hover:bg-gray-50 text-xs font-semibold shadow-xs transition-colors"
          >
            <FileText className="w-4 h-4 text-[#3828b5]" />
            <span>Arbitration Manual &amp; SLAs</span>
          </Link>
        </div>
      </div>

      {/* 2. 3 Telemetry Bento Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-xl bg-white border border-[#e7e7eb] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Active Dispute Backlog
              </span>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1c1b1b]">
                1 Case
              </span>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                In-Flight
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Case DSP-104 • 42h remaining of 72h SLA window
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span>0 overdue cases</span>
            <span className="text-[#16834a] font-bold">Avg turnaround: 14.4h</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-xl bg-white border border-[#e7e7eb] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                48-Hour SLA Disgorgement Total
              </span>
              <RotateCcw className="w-4 h-4 text-[#16834a]" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1c1b1b]">
                ₹1,278
              </span>
              <span className="text-xs font-bold text-[#16834a] bg-[#eaf5ef] px-2 py-0.5 rounded">
                MTD Processed
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              2 automated refunds due to mentor SLA delay
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span className="text-[#16834a] font-bold">100% restored via Nodal Route</span>
            <span className="font-mono text-gray-400">RPZ-Route #NOD-99</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-xl bg-white border border-[#e7e7eb] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Platform Dispute Rate
              </span>
              <ShieldCheck className="w-4 h-4 text-[#3828b5]" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1c1b1b]">
                0.42%
              </span>
              <span className="text-xs font-bold text-[#16834a] bg-[#eaf5ef] px-2 py-0.5 rounded">
                Target &lt; 1.50%
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              99.58% clean delivery rate across 142 completed sessions
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span className="font-bold text-[#3828b5]">100% Dual-Signed Protocol</span>
            <span className="font-mono text-gray-400 font-semibold">PRD §21 Compliant</span>
          </div>
        </div>
      </div>

      {/* 3. In-Depth Active Dispute Case Card (DSP-104) */}
      <div className="rounded-xl border border-[#e7e7eb] bg-white shadow-xs overflow-hidden">
        {/* Card Header & Metadata Bar */}
        <div className="bg-[#f6f3f2] p-5 border-b border-[#e7e7eb]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xl font-extrabold text-[#1c1b1b] font-mono">
                Case #DSP-104
              </span>
              <span className="text-gray-300">•</span>
              <h2 className="text-base font-bold text-[#1c1b1b]">
                SLA Delivery Breach &amp; Incomplete 8-D Rubric
              </h2>
              <span className="rounded bg-[#3828b5]/10 border border-[#3828b5]/20 px-2 py-0.5 text-xs font-bold text-[#3828b5]">
                S06 Technical Mock Drill
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 border border-red-200 px-3 py-1 text-xs font-bold text-red-800">
                <AlertTriangle className="w-3.5 h-3.5" />
                High Priority / Disgorgement Triggered
              </span>
            </div>
          </div>

          {/* Key Metadata Strip */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-[#e7e7eb] text-xs">
            <div>
              <span className="text-gray-400 uppercase tracking-wider text-[10px] font-bold block">
                Candidate
              </span>
              <div className="font-bold text-[#1c1b1b]">Aakash Gupta</div>
              <div className="text-gray-500 text-[11px]">#DX-3312 • SDE-2 Candidate</div>
            </div>

            <div>
              <span className="text-gray-400 uppercase tracking-wider text-[10px] font-bold block">
                Mentor
              </span>
              <div className="font-bold text-[#1c1b1b]">Vikramaditya Rao</div>
              <div className="text-gray-500 text-[11px]">#MTR-402 • Lead AI Architect</div>
            </div>

            <div>
              <span className="text-gray-400 uppercase tracking-wider text-[10px] font-bold block">
                Session Ref
              </span>
              <div className="font-bold text-[#1c1b1b]">SES-7120</div>
              <div className="text-gray-500 text-[11px]">Concurrency &amp; System Drill</div>
            </div>

            <div>
              <span className="text-gray-400 uppercase tracking-wider text-[10px] font-bold block">
                Escrow Hold
              </span>
              <div className="font-bold text-[#3828b5]">₹799 Locked</div>
              <div className="text-gray-500 text-[11px]">Nodal Escrow #ESC-7120</div>
            </div>

            <div className="col-span-2 md:col-span-1">
              <span className="text-gray-400 uppercase tracking-wider text-[10px] font-bold block">
                72h SLA Resolution Timer
              </span>
              <div className="font-bold text-[#a7670b] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#a7670b]" />
                <span>42h 18m Remaining</span>
              </div>
              <div className="text-gray-500 text-[11px]">Cutoff: Nov 14, 08:30 PM IST</div>
            </div>
          </div>
        </div>

        {/* Incident Timeline Bar */}
        <div className="p-5 border-b border-[#e7e7eb] bg-white">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
            Incident Telemetry &amp; Chronological Ledger
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f6f3f2] border border-[#e7e7eb]">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eaf5ef] text-[#16834a] font-bold text-xs shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1c1b1b]">01: Call Completed</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Nov 09, 08:30 PM IST</div>
                <div className="text-[11px] text-[#16834a] font-semibold mt-1">Google Meet 61m Verified</div>
              </div>
            </div>

            {/* Step 2 (Breached) */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white font-bold text-xs shrink-0">
                !
              </div>
              <div>
                <div className="text-xs font-bold text-red-700">02: 48h SLA Cutoff</div>
                <div className="text-[11px] text-red-600 mt-0.5">Nov 11, 08:30 PM IST</div>
                <div className="text-[11px] text-red-700 font-bold mt-1">Breached by 5 hours</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f6f3f2] border border-[#e7e7eb]">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-[#3828b5] font-bold text-xs shrink-0">
                <Gavel className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1c1b1b]">03: Escalation Filed</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Nov 11, 09:15 PM IST</div>
                <div className="text-[11px] text-gray-700 font-medium mt-1">Candidate requested refund</div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f6f3f2] border border-[#e7e7eb]">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-[#a7670b] font-bold text-xs shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1c1b1b]">04: Late Rubric Upload</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Nov 12, 01:30 AM IST</div>
                <div className="text-[11px] text-[#a7670b] font-medium mt-1">Scorecard submitted (Late)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Evidence Vault (3-Column Comparison Panel) */}
        <div className="p-5 border-b border-[#e7e7eb] bg-gray-50/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
            Arbitration Evidence Vault &amp; Witness Telemetry
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Col 1: Telemetry */}
            <div className="rounded-lg border border-[#e7e7eb] bg-white p-4 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#1c1b1b] text-sm font-bold pb-2 border-b border-gray-100">
                <FileCode2 className="w-4 h-4 text-[#3828b5]" />
                <span>1. Session Telemetry Data</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Platform Hook</span>
                  <span className="font-semibold text-[#1c1b1b]">Google Meet API v2</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Candidate Join/Leave</span>
                  <span className="font-medium text-[#1c1b1b]">20:29:12 – 21:30:18</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Mentor Join/Leave</span>
                  <span className="font-medium text-[#1c1b1b]">20:28:44 – 21:30:10</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Audio Clarity Stream</span>
                  <span className="text-[#16834a] font-bold">98.4% Clean (0 Drops)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Screenshare Activity</span>
                  <span className="font-medium text-[#1c1b1b]">12 slides &amp; VS Code log</span>
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setPlayingAudio(!playingAudio);
                    if (!playingAudio) alert("Transcript summary audio stream playing (60s summary).");
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#e7e7eb] bg-[#f6f3f2] py-2 text-xs font-semibold text-[#1c1b1b] hover:bg-gray-100 transition-colors"
                >
                  <Headphones className="w-3.5 h-3.5 text-[#3828b5]" />
                  <span>{playingAudio ? "Pause Audio Transcript" : "Listen to AI Transcript Summary"}</span>
                </button>
              </div>
            </div>

            {/* Col 2: Candidate Statement */}
            <div className="rounded-lg border border-[#e7e7eb] bg-white p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-[#1c1b1b] text-sm font-bold">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span>2. Candidate Escalation</span>
                </div>
                <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                  11-Nov 21:15
                </span>
              </div>
              <div className="rounded-lg bg-[#f6f3f2] p-3 text-xs italic text-gray-700 leading-relaxed border-l-2 border-[#3828b5]">
                “The live 60-minute technical interview happened as planned. However, the mentor failed to upload the promised 8-dimension rubric scorecard and curated prep materials within the mandatory 48-hour SLA window. I have an upcoming on-site interview and required this feedback immediately. I am requesting an escrow disgorgement refund.”
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-gray-400">PRD Reference</span>
                <span className="font-bold text-[#1c1b1b]">PRD §12.1 (Deliverable SLA)</span>
              </div>
            </div>

            {/* Col 3: Mentor Statement */}
            <div className="rounded-lg border border-[#e7e7eb] bg-white p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2 text-[#1c1b1b] text-sm font-bold">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>3. Mentor Defense &amp; Log</span>
                </div>
                <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
                  12-Nov 01:30
                </span>
              </div>
              <div className="rounded-lg bg-[#f6f3f2] p-3 text-xs italic text-gray-700 leading-relaxed border-l-2 border-[#a7670b]">
                “I conducted a rigorous 61-minute mock interview covering Distributed Systems and concurrency. An unforeseen Sev-1 production outage at my primary workplace delayed my scorecard transcription by 5 hours. The complete 8-dimension scorecard, written code analysis, and recommended reading have now been uploaded in full.”
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-gray-400">Scorecard Artifact</span>
                <span className="text-[#3828b5] font-semibold flex items-center gap-1">
                  <span>DSP-104-Rubric.pdf (1.4MB)</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enforceable Statutory Rulings (PRD §12.2 & §21) */}
        <div className="p-5 bg-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-[#1c1b1b]">
                Enforceable Statutory Rulings (PRD §12.2 &amp; §21 Dual-Control Execution)
              </h3>
              <p className="text-xs text-gray-500">
                Select an institutional determination protocol below. Changes execute directly against Razorpay Nodal Escrow Node #ESC-7120 upon dual-signoff.
              </p>
            </div>
            <span className="text-xs font-bold text-[#3828b5] bg-[#3828b5]/10 px-3 py-1 rounded-full self-start sm:self-auto">
              PRD Standard Decision Tree
            </span>
          </div>

          {/* 3 Decision Protocol Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Protocol A */}
            <div
              onClick={() => setSelectedProtocol("A")}
              className={`relative rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between ${
                selectedProtocol === "A"
                  ? "border-2 border-[#3828b5] bg-indigo-50/30 shadow-sm"
                  : "border border-[#e7e7eb] hover:border-gray-400 bg-white"
              }`}
            >
              <div className="absolute -top-2.5 right-4 rounded-full bg-[#3828b5] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                PRD §12.2 Recommended
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${selectedProtocol === "A" ? "border-[#3828b5]" : "border-gray-400"}`}>
                    {selectedProtocol === "A" && <div className="h-2 w-2 rounded-full bg-[#3828b5]"></div>}
                  </div>
                  <span className="text-sm font-bold text-[#1c1b1b]">
                    Protocol A: 80% Escrow Disgorgement
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  SLA delay breached 48h deadline, but 60m live interview was completed. Disgorge 80% of escrow back to candidate, allowing mentor 20% pro-rata compensation.
                </p>

                <div className="mt-3 rounded-lg bg-[#f6f3f2] p-2.5 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Candidate Refund:</span>
                    <span className="font-bold text-[#16834a]">₹639.20 (80%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mentor Settlement:</span>
                    <span className="font-semibold text-[#1c1b1b]">₹159.80 (20%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Scorecard Deliverable:</span>
                    <span className="text-[#3828b5] font-semibold">Released to Candidate</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2 text-[11px] text-gray-400 border-t border-gray-100">
                Remediation: Advisory Note issued to Mentor Vikramaditya Rao.
              </div>
            </div>

            {/* Protocol B */}
            <div
              onClick={() => setSelectedProtocol("B")}
              className={`rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between ${
                selectedProtocol === "B"
                  ? "border-2 border-[#3828b5] bg-indigo-50/30 shadow-sm"
                  : "border border-[#e7e7eb] hover:border-gray-400 bg-white"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${selectedProtocol === "B" ? "border-[#3828b5]" : "border-gray-400"}`}>
                    {selectedProtocol === "B" && <div className="h-2 w-2 rounded-full bg-[#3828b5]"></div>}
                  </div>
                  <span className="text-sm font-bold text-[#1c1b1b]">
                    Protocol B: 100% Full Disgorgement
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  Strict zero-tolerance ruling. Unexcused delay past 48h cancels full mentor compensation. Candidate receives full restitution.
                </p>

                <div className="mt-3 rounded-lg bg-[#f6f3f2] p-2.5 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Candidate Refund:</span>
                    <span className="font-bold text-red-600">₹799.00 (100%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mentor Settlement:</span>
                    <span className="font-semibold text-[#1c1b1b]">₹0.00 (0%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mentor Rating Strike:</span>
                    <span className="text-red-600 font-bold">Strike 1 Recorded</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2 text-[11px] text-gray-400 border-t border-gray-100">
                Remediation: Automatic 7-day mentor suspension from dispatch pool.
              </div>
            </div>

            {/* Protocol C */}
            <div
              onClick={() => setSelectedProtocol("C")}
              className={`rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between ${
                selectedProtocol === "C"
                  ? "border-2 border-[#3828b5] bg-indigo-50/30 shadow-sm"
                  : "border border-[#e7e7eb] hover:border-gray-400 bg-white"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${selectedProtocol === "C" ? "border-[#3828b5]" : "border-gray-400"}`}>
                    {selectedProtocol === "C" && <div className="h-2 w-2 rounded-full bg-[#3828b5]"></div>}
                  </div>
                  <span className="text-sm font-bold text-[#1c1b1b]">
                    Protocol C: Dismiss Dispute &amp; Release
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  Accept mentor emergency outage defense. Dismiss candidate dispute, release completed scorecard, and disperse full escrow.
                </p>

                <div className="mt-3 rounded-lg bg-[#f6f3f2] p-2.5 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Candidate Refund:</span>
                    <span className="font-semibold text-[#1c1b1b]">₹0.00 (0%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mentor Settlement:</span>
                    <span className="font-bold text-[#16834a]">₹799.00 (100%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dispute Status:</span>
                    <span className="font-semibold text-gray-700">Dismissed as Unfounded</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2 text-[11px] text-gray-400 border-t border-gray-100">
                Remediation: No platform penalties recorded for either party.
              </div>
            </div>
          </div>

          {/* Dual-Control Signatory Action Bar */}
          <div className="mt-5 rounded-xl bg-[#f6f3f2] p-4 border border-[#e7e7eb] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#e7e7eb]">
                <CheckCircle2 className="w-4 h-4 text-[#16834a]" />
                <div>
                  <span className="font-bold text-[#1c1b1b]">Examiner 1: Signed</span>
                  <span className="text-gray-500 block text-[10px]">Arjun Mehta (#ADM-001)</span>
                </div>
              </div>

              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${coSigned ? "bg-white border-[#16834a]/30" : "bg-white border-amber-300"}`}>
                {coSigned ? (
                  <CheckCircle2 className="w-4 h-4 text-[#16834a]" />
                ) : (
                  <Hourglass className="w-4 h-4 text-[#a7670b] animate-spin" />
                )}
                <div>
                  <span className={`font-bold ${coSigned ? "text-[#16834a]" : "text-[#a7670b]"}`}>
                    {coSigned ? "Examiner 2: Dual-Signed" : "Examiner 2: Awaiting Co-Signatory"}
                  </span>
                  <span className="text-gray-500 block text-[10px]">
                    {coSigned ? "Priyadarshini Rao (#ADM-004)" : "Dual-Custody Key Required"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {disgorgementSuccess ? (
                <div className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Protocol {selectedProtocol} Disgorgement Executed against Nodal Gate!</span>
                </div>
              ) : (
                <button
                  disabled={executingDisgorgement}
                  onClick={handleExecuteRuling}
                  className="px-5 py-2.5 rounded-lg bg-[#3828b5] text-white hover:bg-[#2e2195] text-xs font-bold shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Gavel className="w-4 h-4" />
                  <span>{executingDisgorgement ? "Transacting Nodal Disgorgement..." : `Co-Sign & Execute Protocol ${selectedProtocol}`}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Closed Disputes Historical Log */}
      <div className="bg-white rounded-xl border border-[#e7e7eb] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e7e7eb]">
          <div>
            <h3 className="font-bold text-base text-[#1c1b1b]">
              Closed Disputes &amp; Historical Arbitration Log
            </h3>
            <p className="text-xs text-gray-500">
              Cryptographically signed settlements recorded in the platform master ledger.
            </p>
          </div>
          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2.5 py-1 rounded">
            3 Resolved Cases
          </span>
        </div>

        <div className="divide-y divide-[#e7e7eb]">
          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#1c1b1b]">DSP-103</span>
                <span className="text-gray-400">•</span>
                <span className="font-semibold text-gray-800">Candidate No-Show (Missed Appointment)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                  DISMISSED
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Session SES-7094 • Rohan Sharma vs Ananya Sen • Escrow ₹529 released to mentor per PRD §11.1
              </p>
            </div>
            <span className="font-mono text-gray-400 text-[11px]">Resolved Oct 28, 2026</span>
          </div>

          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#1c1b1b]">DSP-101</span>
                <span className="text-gray-400">•</span>
                <span className="font-semibold text-gray-800">Partial Audio Failure during Mock</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#edf3fc] text-[#2864c5]">
                  MUTUAL 50% RESTITUTION
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Session SES-6981 • Tanvi Mathur vs Kunal Roy • ₹380 refunded to candidate, ₹380 settled to mentor
              </p>
            </div>
            <span className="font-mono text-gray-400 text-[11px]">Resolved Oct 14, 2026</span>
          </div>

          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#1c1b1b]">DSP-098</span>
                <span className="text-gray-400">•</span>
                <span className="font-semibold text-gray-800">48h Deliverable SLA Delay</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700">
                  PROTOCOL A DISGORGEMENT
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Session SES-6840 • S07 System Design • ₹639.20 (80%) refunded to candidate via Nodal Gate
              </p>
            </div>
            <span className="font-mono text-gray-400 text-[11px]">Resolved Sep 30, 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
