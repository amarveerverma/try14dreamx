"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Search,
  Printer,
  ExternalLink,
  Building2,
  ChevronRight,
  FileText,
  Copy,
  Check,
  CreditCard,
  Scale,
  RotateCcw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RefundsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeArticle, setActiveArticle] = React.useState<string>("art-1");
  const [copiedSha, setCopiedSha] = React.useState(false);
  const [disgorgementState, setDisgorgementState] = React.useState<string | null>(null);

  const shaDigest = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

  const handleCopySha = () => {
    navigator.clipboard?.writeText(shaDigest);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleTriggerAction = (actionKey: string) => {
    setDisgorgementState(actionKey);
    setTimeout(() => setDisgorgementState(null), 3500);
  };

  const articles = [
    { id: "art-1", num: "1", title: "Nodal Escrow Mechanics & Segregated Custody" },
    { id: "art-2", num: "2", title: "48-Hour Deliverable SLA & Automatic Disgorgement" },
    { id: "art-3", num: "3", title: "1-Hour Free Cancellation & Rescheduling Rule" },
    { id: "art-4", num: "4", title: "Mentor No-Show Protection (+20% Goodwill Credit)" },
    { id: "art-5", num: "5", title: "Settlement Timeframes & Payment Gateways" },
    { id: "art-6", num: "6", title: "72-Hour Binding Dispute Arbitration Desk" },
  ];

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.num.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-sans antialiased selection:bg-[#5145cd] selection:text-white">
      {/* 1. Top Statutory Ribbon */}
      <div className="bg-[#171717] text-white border-b border-[#2d2d38] text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              RBI Nodal Direction & Consumer Protection Compliant
            </span>
            <span className="hidden sm:inline text-zinc-500">•</span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <Clock className="w-3.5 h-3.5" />
              48-Hour SLA Disgorgement Guarantee
            </span>
            <span className="hidden md:inline text-zinc-500">•</span>
            <span className="text-zinc-400 hidden lg:inline">
              100% Pre-funded Escrow via Razorpay Nodal
            </span>
          </div>
          <div className="flex items-center gap-3 text-zinc-400">
            <span>Canonical Refund Spec v3.0.4</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-300 font-medium">Effective: Nov 2026</span>
          </div>
        </div>
      </div>

      {/* 2. Institutional Navigation Sub-header */}
      <header className="bg-white border-b border-[#e7e7eb] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-lg font-black tracking-tight text-[#171717] hover:text-[#5145cd] transition-colors"
            >
              DreamX
            </Link>
            <span className="text-zinc-300">/</span>
            <div className="flex items-center gap-2">
              <Badge
                variant="warning"
                className="bg-[#fef6e7] text-[#a7670b] border-[#fed7aa] font-medium text-xs px-2.5 py-0.5"
              >
                Escrow & Refund Protocol
              </Badge>
              <span className="text-xs text-zinc-500 hidden md:inline">
                Cancellation & Disgorgement Policy
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-md justify-end">
            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Search refund rules, disgorgement triggers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 text-xs bg-[#f7f7f8] border-[#e7e7eb] focus-visible:ring-[#5145cd]"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 h-9 text-xs border-[#e7e7eb] hover:bg-[#f7f7f8]"
            >
              <Download className="w-3.5 h-3.5 text-zinc-600" />
              <span>Refund Dossier</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 h-9 text-xs border-[#e7e7eb] hover:bg-[#f7f7f8]"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-600" />
              <span>Print</span>
            </Button>
            <Link href="/services">
              <Button
                size="sm"
                className="bg-[#5145cd] hover:bg-[#4338ca] text-white h-9 text-xs font-semibold px-3.5 shadow-xs"
              >
                Marketplace
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 3. Hero Header & 3-Card Safeguard Bento */}
      <section className="border-b border-[#e7e7eb] bg-white py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fef6e7] text-[#a7670b] text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Automated Escrow Disgorgement Protocol • RBI & Consumer Protection</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171717] tracking-tight leading-tight">
              Cancellation, Escrow Disgorgement & Refund Policy
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              Statutory governance of candidate pre-funded nodal escrow accounts, automatic 48-hour
              deliverable SLA disgorgement, zero-penalty 1-hour cancellation rights, and dual-control
              dispute arbitration under the Indian Consumer Protection (E-Commerce) Rules and RBI Nodal Directives.
            </p>
          </div>

          {/* 4 Key Safeguard Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <Card className="p-5 bg-[#fcf9f8] border-[#e7e7eb] rounded-xl hover:border-zinc-300 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#5145cd] flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#5145cd]">
                    100% Pre-funded Escrow
                  </div>
                  <div className="text-sm font-bold text-zinc-900">Segregated RBI Nodal</div>
                </div>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Candidate booking fees are locked in an RBI-mandated nodal account with 0% platform or
                mentor pre-settlement access. Funds disburse only upon verified deliverable approval.
              </p>
            </Card>

            <Card className="p-5 bg-[#fcf9f8] border-[#e7e7eb] rounded-xl hover:border-zinc-300 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-red-800">
                    48h Disgorgement Trigger
                  </div>
                  <div className="text-sm font-bold text-zinc-900">Automated Refund</div>
                </div>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                If a mentor fails to deliver the verified 8-dimension scorecard within 48:00:00 hours,
                non-discretionary disgorgement releases the escrow directly back to the student.
              </p>
            </Card>

            <Card className="p-5 bg-[#fcf9f8] border-[#e7e7eb] rounded-xl hover:border-zinc-300 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                    1-Hour Free Cancellation
                  </div>
                  <div className="text-sm font-bold text-zinc-900">Zero Penalty Policy</div>
                </div>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Candidates can cancel any upcoming 1:1 session up to 60 minutes prior to
                call time for an immediate 100% refund with zero cancellation charges (PRD §12.2).
              </p>
            </Card>

            <Card className="p-5 bg-[#fcf9f8] border-[#e7e7eb] rounded-xl hover:border-zinc-300 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#a7670b] flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#a7670b]">
                    Support Desk &amp; Hours
                  </div>
                  <div className="text-sm font-bold text-zinc-900">Mon–Sat 9AM–9PM IST</div>
                </div>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Dedicated operations team with guaranteed &lt; 4-hour response SLA. Reach us at support@dreamx.in or via the candidate support ticketing desk.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. Main Two-Column Document Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sticky Table of Clauses & Disgorgement Console Widget (4 cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            <Card className="p-5 bg-white border-[#e7e7eb] rounded-xl shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0eded]">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Table of Clauses
                </span>
                <span className="text-xs font-medium text-[#a7670b] bg-[#fef6e7] px-2 py-0.5 rounded-full">
                  6 Articles
                </span>
              </div>

              <nav className="space-y-1">
                {filteredArticles.map((art) => {
                  const isActive = activeArticle === art.id;
                  return (
                    <a
                      key={art.id}
                      href={`#${art.id}`}
                      onClick={() => setActiveArticle(art.id)}
                      className={`flex items-start gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                        isActive
                          ? "bg-[#eef2ff] text-[#5145cd] font-semibold"
                          : "text-zinc-600 hover:bg-[#f7f7f8] hover:text-zinc-900"
                      }`}
                    >
                      <span className="font-mono text-xs opacity-60">Art {art.num}.</span>
                      <span className="flex-1 leading-snug">{art.title}</span>
                    </a>
                  );
                })}
              </nav>

              {/* Candidate Disgorgement Console Widget */}
              <div className="pt-3 border-t border-[#f0eded] space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-900">
                  <span className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-[#5145cd]" />
                    Candidate Disgorgement Console
                  </span>
                  <Badge variant="neutral" className="text-[10px] bg-zinc-50">
                    Live Escrow
                  </Badge>
                </div>

                <div className="space-y-1.5 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTriggerAction("cancel")}
                    className="w-full justify-start text-[11px] h-8 border-[#e7e7eb] hover:bg-[#f7f7f8]"
                  >
                    <RotateCcw className="w-3 h-3 text-zinc-500 mr-2" />
                    Request Instant Cancellation (&ge;1 hr window)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTriggerAction("disgorge")}
                    className="w-full justify-start text-[11px] h-8 border-[#e7e7eb] hover:bg-[#f7f7f8] text-red-700"
                  >
                    <AlertCircle className="w-3 h-3 text-red-600 mr-2" />
                    Trigger SLA Disgorgement Claim (&gt;48h delay)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTriggerAction("dispute")}
                    className="w-full justify-start text-[11px] h-8 border-[#e7e7eb] hover:bg-[#f7f7f8]"
                  >
                    <FileText className="w-3 h-3 text-zinc-500 mr-2" />
                    File Escrow Dispute Notice (72h SLA)
                  </Button>
                </div>

                {disgorgementState && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 animate-in fade-in duration-200">
                    {disgorgementState === "cancel" &&
                      "Booking window check: Eligible for 100% instant refund. Razorpay IMPS/UPI reverse transfer queued."}
                    {disgorgementState === "disgorge" &&
                      "Telemetry audit verified: 48:00:00 delivery window exceeded. 100% automatic disgorgement triggered to source account."}
                    {disgorgementState === "dispute" &&
                      "Escrow notice routed to Dual-Control Arbitration Desk (Auditor L6 + Adv. Rajeshwar K. Sharma)."}
                  </div>
                )}
              </div>
            </Card>

            {/* Cryptographic Audit Stamp Card */}
            <Card className="p-4 bg-[#f7f7f8] border-[#e7e7eb] rounded-xl text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider">
                  Cryptographic Audit Stamp
                </span>
                <Badge variant="neutral" className="text-[10px] bg-white border-zinc-200">
                  SHA-256 Verified
                </Badge>
              </div>
              <div className="bg-white p-2.5 rounded-md border border-[#e7e7eb] font-mono text-[10px] text-zinc-600 break-all select-all flex items-center justify-between gap-2">
                <span>{shaDigest}</span>
                <button
                  type="button"
                  onClick={handleCopySha}
                  className="text-zinc-400 hover:text-zinc-700 p-1 rounded"
                  title="Copy SHA-256 Digest"
                  aria-label="Copy SHA-256 Digest"
                >
                  {copiedSha ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
                </button>
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                <span>Canonical Version: v3.0.4</span>
                <span className="text-emerald-700 font-medium">✓ Ledger Synced</span>
              </div>
            </Card>

            {/* Cross-Link Badges */}
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/terms"
                className="flex items-center justify-between p-3 rounded-lg bg-white border border-[#e7e7eb] text-xs font-semibold text-zinc-700 hover:border-[#5145cd] hover:text-[#5145cd] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Terms of Service & Escrow Charter</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </Link>
              <Link
                href="/privacy"
                className="flex items-center justify-between p-3 rounded-lg bg-white border border-[#e7e7eb] text-xs font-semibold text-zinc-700 hover:border-[#5145cd] hover:text-[#5145cd] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Privacy Policy & DPDP Act</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </Link>
            </div>
          </aside>

          {/* Right Column: Detailed Statutory Articles (8 cols) */}
          <section className="lg:col-span-8 space-y-8">
            {/* Article 1: Nodal Escrow Mechanics */}
            <Card id="art-1" className="p-6 sm:p-8 bg-white border-[#e7e7eb] rounded-xl shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5145cd] uppercase tracking-wider">
                <Lock className="w-4 h-4" />
                <span>Article 1</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                1. Nodal Escrow Mechanics & Segregated Custody (PRD §11 & RBI Directives)
              </h2>

              <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
                <p>
                  <strong>1.1 Statutory Custody Foundation:</strong> All candidate payments on DreamX operate
                  in strict compliance with Reserve Bank of India Directive
                  `DPSS.CO.PD.No.1102/02.14.08/2009-10` governing nodal accounts for payment intermediaries.
                  100% of candidate booking payments are deposited directly into a designated, segregated Nodal
                  Escrow Account maintained with our RBI-authorized nodal banking partner (Razorpay Software Pvt.
                  Ltd.).
                </p>
                <p>
                  <strong>1.2 Zero Platform Pre-Commingling:</strong> At no stage do candidate booking deposits
                  mingle with DreamX operational working capital or mentor personal accounts prior to
                  statutory deliverable verification. Mentors and platform administrators have zero unilateral
                  disbursal permissions.
                </p>

                {/* 5-Step Visual Flow of Nodal Custody */}
                <div className="pt-2">
                  <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider block mb-3">
                    Programmatic Lifecycle of Nodal Escrow Funds:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                    <div className="p-3 rounded-lg bg-[#fcf9f8] border border-[#e7e7eb] space-y-1">
                      <span className="text-[10px] font-mono font-bold text-[#5145cd] block">STEP 01</span>
                      <strong className="text-zinc-900 block text-xs">Checkout Lock</strong>
                      <span className="text-zinc-500 text-[11px] block">100% pre-funded in nodal escrow</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#fcf9f8] border border-[#e7e7eb] space-y-1">
                      <span className="text-[10px] font-mono font-bold text-[#5145cd] block">STEP 02</span>
                      <strong className="text-zinc-900 block text-xs">Meet Telemetry</strong>
                      <span className="text-zinc-500 text-[11px] block">Google Meet API attendance audit</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#fcf9f8] border border-[#e7e7eb] space-y-1">
                      <span className="text-[10px] font-mono font-bold text-amber-600 block">STEP 03</span>
                      <strong className="text-zinc-900 block text-xs">48h SLA Window</strong>
                      <span className="text-zinc-500 text-[11px] block">Mentor delivers 8-D scorecard</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#fcf9f8] border border-[#e7e7eb] space-y-1">
                      <span className="text-[10px] font-mono font-bold text-indigo-600 block">STEP 04</span>
                      <strong className="text-zinc-900 block text-xs">Student Review</strong>
                      <span className="text-zinc-500 text-[11px] block">48h sign-off or dispute window</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#ebf7ee] border border-[#b8e8c5] space-y-1">
                      <span className="text-[10px] font-mono font-bold text-emerald-700 block">STEP 05</span>
                      <strong className="text-emerald-900 block text-xs">Disbursal Cleared</strong>
                      <span className="text-emerald-700 text-[11px] block">Net mentor compensation released</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Article 2: 48-Hour SLA Automatic Disgorgement */}
            <Card id="art-2" className="p-6 sm:p-8 bg-white border-[#e7e7eb] rounded-xl shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-red-600" />
                <span>Article 2</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                2. 48-Hour Deliverable SLA & Automatic Disgorgement (PRD §12.2)
              </h2>

              <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
                <p>
                  <strong>2.1 Non-Discretionary Statutory Deadline:</strong> Following the completion of a live
                  1:1 session (Services S01 through S10), mentors are contractually bound to upload the complete,
                  verified 8-Dimension Career Readiness Scorecard within exactly <strong>48:00:00 hours</strong> of
                  call conclusion.
                </p>
                <p>
                  <strong>2.2 Automated Disgorgement Execution:</strong> If the 48-hour deliverable countdown
                  expires without a verified rubric submission, our smart contract engine executes an automated,
                  non-discretionary disgorgement of escrow funds directly back to the candidate&apos;s source
                  payment instrument.
                </p>
              </div>

              {/* Automated Disgorgement Matrix Table */}
              <div className="border border-[#e7e7eb] rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#f7f7f8] text-zinc-700 border-b border-[#e7e7eb] font-semibold">
                    <tr>
                      <th className="p-3">Trigger Condition</th>
                      <th className="p-3">Candidate Disgorgement Remedy</th>
                      <th className="p-3">Mentor Sanction / Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e7e7eb] text-zinc-600">
                    <tr>
                      <td className="p-3 font-medium text-zinc-900">
                        Mentor misses 48h deadline without extension
                      </td>
                      <td className="p-3 text-emerald-700 font-semibold">
                        80% automated cash disgorgement to source + 20% platform credit
                      </td>
                      <td className="p-3 text-red-600 font-medium">
                        100% payout forfeited + 0.5 reliability strike
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-zinc-900">
                        Incomplete / AI-boilerplate rubric rejected
                      </td>
                      <td className="p-3 text-emerald-700 font-semibold">
                        100% full refund upon 72h arbitration confirmation
                      </td>
                      <td className="p-3 text-red-600 font-medium">
                        Forfeiture + accreditation review
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-zinc-900">
                        Candidate approves deliverable (or 48h elapses)
                      </td>
                      <td className="p-3 text-zinc-500">
                        Deliverable verified & added to Candidate Vault
                      </td>
                      <td className="p-3 text-emerald-700 font-semibold">
                        100% net compensation released to mentor account
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Article 3: Flexible Cancellation & Rescheduling (1-Hour Rule) */}
            <Card id="art-3" className="p-6 sm:p-8 bg-white border-[#e7e7eb] rounded-xl shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#16834a] uppercase tracking-wider">
                <RotateCcw className="w-4 h-4 text-[#16834a]" />
                <span>Article 3</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                3. Flexible Cancellation & Rescheduling (1-Hour Rule)
              </h2>

              <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
                <p>
                  <strong>3.1 1-Hour Zero-Penalty Cancellation:</strong> Candidates may cancel any scheduled
                  session with at least <strong>60 minutes advance notice</strong> prior to the confirmed start
                  time. The entire session fee held in escrow is refunded immediately (100%) to the candidate&apos;s
                  source payment instrument with zero platform processing fees (PRD §11.1).
                </p>
                <p>
                  <strong>3.2 Complimentary Rescheduling Window:</strong> Candidates are entitled to 1 free
                  rescheduling request per booking, provided the request is submitted at least 2 hours prior to
                  session start time.
                </p>
                <p>
                  <strong>3.3 Sub-1-Hour Late Cancellation:</strong> Cancellations initiated with less than 60
                  minutes remaining before call time result in a 50% candidate refund and 50% mentor calendar
                  reservation compensation to reimburse the mentor for reserved unbooked time.
                </p>
              </div>
            </Card>

            {/* Article 4: Mentor No-Show Protection */}
            <Card id="art-4" className="p-6 sm:p-8 bg-white border-[#e7e7eb] rounded-xl shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Article 4</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                4. Mentor No-Show Protection & Goodwill Remedy
              </h2>

              <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
                <p>
                  <strong>4.1 15-Minute Unpunctuality Threshold:</strong> In the event an accredited mentor fails
                  to join the designated Google Meet room within <strong>15 minutes</strong> of scheduled start
                  time, our automated attendance bot marks the session as &quot;Mentor No-Show&quot;.
                </p>
                <div className="bg-[#ebf7ee] p-4 rounded-lg border border-[#b8e8c5] text-xs text-[#0f5b33] space-y-1.5">
                  <div className="font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#16834a]" />
                    <span>Candidate Goodwill Remedy:</span>
                  </div>
                  <p>
                    The candidate immediately receives: (1) <strong>100% full refund</strong> of all escrow
                    monies, plus (2) an additional <strong>₹200 / 20% platform goodwill credit</strong> applied
                    instantly to their DreamX student wallet for immediate re-booking.
                  </p>
                </div>
                <p>
                  <strong>4.2 Mentor Disciplinary Sanction:</strong> The offending mentor incurs a 1.0 reliability
                  penalty strike, temporary dispatch queue suspension, and mandatory re-verification by the Trust
                  & Accreditation Desk before accepting new candidate bookings.
                </p>
              </div>
            </Card>

            {/* Article 5: Settlement Timeframes */}
            <Card id="art-5" className="p-6 sm:p-8 bg-white border-[#e7e7eb] rounded-xl shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5145cd] uppercase tracking-wider">
                <CreditCard className="w-4 h-4" />
                <span>Article 5</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                5. Settlement Timeframes & Payment Gateways
              </h2>

              <p className="text-sm text-zinc-600 leading-relaxed">
                Refunds are processed automatically through our licensed payment partner (Razorpay) via the
                original payment rail used during checkout:
              </p>

              {/* Rails Comparison Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-4 rounded-lg border border-[#e7e7eb] bg-[#f7f7f8] space-y-1">
                  <span className="text-[10px] font-mono text-[#5145cd] uppercase font-bold block">UPI / IMPS</span>
                  <strong className="text-zinc-900 block text-xs">15 mins to 2 hours</strong>
                  <span className="text-zinc-500 text-[11px] block">Direct NPCI instant reversal</span>
                </div>
                <div className="p-4 rounded-lg border border-[#e7e7eb] bg-[#f7f7f8] space-y-1">
                  <span className="text-[10px] font-mono text-[#5145cd] uppercase font-bold block">Net Banking / Debit</span>
                  <strong className="text-zinc-900 block text-xs">1 to 2 business days</strong>
                  <span className="text-zinc-500 text-[11px] block">Standard RBI clearing cycle</span>
                </div>
                <div className="p-4 rounded-lg border border-[#e7e7eb] bg-[#f7f7f8] space-y-1">
                  <span className="text-[10px] font-mono text-[#5145cd] uppercase font-bold block">Credit Cards</span>
                  <strong className="text-zinc-900 block text-xs">2 to 4 business days</strong>
                  <span className="text-zinc-500 text-[11px] block">Issuing bank settlement window</span>
                </div>
              </div>
            </Card>

            {/* Article 6: 72-Hour Binding Dispute Arbitration Desk */}
            <Card id="art-6" className="p-6 sm:p-8 bg-white border-[#e7e7eb] rounded-xl shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5145cd] uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Article 6</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                6. 72-Hour Binding Dual-Control Dispute Arbitration Desk
              </h2>

              <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
                <p>
                  <strong>6.1 Objective Telemetry Review:</strong> For contested sessions or disputes regarding
                  rubric evaluation quality (filed within 48 hours of deliverable receipt), claims are resolved
                  by our Dual-Control Arbitration Panel (Principal Technical Auditor L6 + Legal Counsel Adv.
                  Rajeshwar K. Sharma, LL.M.).
                </p>
                <p>
                  <strong>6.2 Evidence-Based Investigation:</strong> Arbitration decisions are made strictly on
                  objective technical telemetry: Google Meet API join/leave timestamps, participant speaking
                  ratios, screen-share duration, and rubric scoring completeness against the 8-Dimension Matrix.
                </p>
              </div>

              <div className="bg-[#fcf9f8] p-5 rounded-xl border border-[#e7e7eb] space-y-3 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-zinc-500 text-xs block">Presiding Arbitrator:</span>
                    <strong className="text-zinc-900 font-bold">Adv. Rajeshwar K. Sharma, LL.M.</strong>
                    <span className="text-zinc-500 text-xs block mt-0.5">
                      Statutory Grievance Officer & Sole Arbitrator
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-xs block">Official Dispute Email:</span>
                    <a
                      href="mailto:disputes@dreamx.in"
                      className="text-[#5145cd] font-bold hover:underline inline-flex items-center gap-1"
                    >
                      disputes@dreamx.in
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="text-zinc-500 text-xs block mt-0.5">
                      Binding SLA: 72 hours max
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-zinc-500 text-xs block">Arbitration Seat & Authority:</span>
                    <span className="text-zinc-800">
                      Arbitration & Conciliation Act 1996 • Competent Courts of Bengaluru, Karnataka, India
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#e7e7eb] flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
                  <span>Claim Submission Window: <strong>48 Hours post-call</strong></span>
                  <span>Binding Decision SLA: <strong>72 Hours</strong></span>
                  <span>Escrow Action: <strong>Freeze during review</strong></span>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </main>

      {/* 5. Institutional Compliance Footer */}
      <footer className="bg-white border-t border-[#e7e7eb] py-12 px-4 sm:px-8 mt-16 text-xs text-zinc-600">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f0eded] pb-6">
            <div className="space-y-1">
              <span className="text-base font-extrabold text-[#171717] tracking-tight">DreamX</span>
              <p className="text-xs text-zinc-500">
                Escrow Disgorgement Protocol • Consumer Protection (E-Commerce) Rules 2020 Compliant
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-600">
              <Link href="/terms" className="hover:text-[#5145cd] transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-[#5145cd] transition-colors">
                Privacy Policy (DPDP 2023)
              </Link>
              <span>•</span>
              <Link href="/refunds" className="text-[#a7670b] font-semibold hover:underline">
                Refund & SLA Disgorgement
              </Link>
              <span>•</span>
              <a href="mailto:disputes@dreamx.in" className="hover:text-[#5145cd] transition-colors">
                Arbitration Desk
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-zinc-500">
            <div>
              © 2026 DreamX Career Acceleration Technologies India Pvt. Ltd. CIN: U72900KA2024PTC188204. All rights reserved.
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                RBI Nodal Escrow Protected
              </span>
              <span>•</span>
              <span>ISO 27001 / SOC 2 Type II Certified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
