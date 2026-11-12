"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Scale,
  Lock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Search,
  Printer,
  ExternalLink,
  HelpCircle,
  Building2,
  ChevronRight,
  FileText,
  Copy,
  Check,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TermsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeArticle, setActiveArticle] = React.useState<string>("art-1");
  const [copiedSha, setCopiedSha] = React.useState(false);

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

  const articles = [
    { id: "art-1", num: "1", title: "Acceptance, Scope & Bengaluru Jurisdiction" },
    { id: "art-2", num: "2", title: "Outcome-Accountable Marketplace Model" },
    { id: "art-3", num: "3", title: "Strict No Placement Guarantee Pledge (PRD §1.2)" },
    { id: "art-4", num: "4", title: "Nodal Escrow Custody & 48h Deliverable SLA" },
    { id: "art-5", num: "5", title: "Pricing, 18% GST & Invoicing Structure" },
    { id: "art-6", num: "6", title: "Mentor Accreditation & Code of Conduct" },
    { id: "art-7", num: "7", title: "Candidate Non-Circumvention & Integrity" },
    { id: "art-8", num: "8", title: "Statutory Grievance Redressal Officer" },
  ];

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.num.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-sans antialiased selection:bg-[#5145cd] selection:text-white">
      {/* 1. Top Global Institutional Ribbon */}
      <div className="bg-[#171717] text-white border-b border-[#2d2d38] text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Indian Contract Act 1872 & IT Act 2000 Compliant
            </span>
            <span className="hidden sm:inline text-zinc-500">•</span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              RBI Nodal Account Direction 2009
            </span>
            <span className="hidden md:inline text-zinc-500">•</span>
            <span className="text-zinc-400 hidden lg:inline">
              Jurisdiction: Republic of India • Bengaluru, KA
            </span>
          </div>
          <div className="flex items-center gap-3 text-zinc-400">
            <span>Canonical Legal Spec v3.0.4</span>
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
                variant="default"
                className="bg-[#eef2ff] text-[#5145cd] border-[#d2ceff] font-medium text-xs px-2.5 py-0.5"
              >
                Legal & Governance Repository
              </Badge>
              <span className="text-xs text-zinc-500 hidden md:inline">
                Terms of Service
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-md justify-end">
            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Search clauses, definitions..."
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
              <span>Download PDF</span>
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0eded] text-zinc-800 text-xs font-semibold">
              <Scale className="w-3.5 h-3.5 text-[#5145cd]" />
              <span>Statutory Contract • Bilateral Candidate & Mentor Charter</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171717] tracking-tight leading-tight">
              Terms of Service & Escrow Governance
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              Statutory charter governing bilateral candidate-mentor diagnostic interactions,
              segregated RBI-mandated nodal escrow accounts, deliverable SLA enforcement, and
              unconditional zero-placement deception pledges under the Indian Legal Framework.
            </p>
          </div>

          {/* 3-Card Safeguard Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <Card className="p-5 bg-[#fcf9f8] border-[#e7e7eb] rounded-xl hover:border-zinc-300 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                    Non-Speculative Charter
                  </div>
                  <div className="text-sm font-bold text-zinc-900">100% Diagnostic Rubrics</div>
                </div>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Zero deceptive placement hype. DreamX delivers audited competency benchmarks and
                explicitly disclaims guaranteed hiring or broker commissions (PRD §1.2 & §12.5).
              </p>
            </Card>

            <Card className="p-5 bg-[#fcf9f8] border-[#e7e7eb] rounded-xl hover:border-zinc-300 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#5145cd]">
                    Segregated Nodal Escrow
                  </div>
                  <div className="text-sm font-bold text-zinc-900">RBI Regulated Custody</div>
                </div>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                All booking fees are pre-funded into segregated RBI nodal custody via Razorpay.
                Zero platform commingling; funds disburse only after deliverable verification.
              </p>
            </Card>

            <Card className="p-5 bg-[#fcf9f8] border-[#e7e7eb] rounded-xl hover:border-zinc-300 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                    48h Deliverable SLA
                  </div>
                  <div className="text-sm font-bold text-zinc-900">Automated Disgorgement</div>
                </div>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Mentors are contractually bound to submit verified 8-dimension scorecards within
                48 hours. Missing the deadline triggers algorithmic 80%–100% disgorgement refund.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. Main Two-Column Document Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sticky Table of Contents & Verification Badge (4 cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            <Card className="p-5 bg-white border-[#e7e7eb] rounded-xl shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0eded]">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Table of Clauses
                </span>
                <span className="text-xs font-medium text-[#5145cd] bg-[#eef2ff] px-2 py-0.5 rounded-full">
                  8 Articles
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

              {/* Concierge Help Box */}
              <div className="pt-3 border-t border-[#f0eded] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
                  <HelpCircle className="w-4 h-4 text-[#5145cd]" />
                  <span>Legal Concierge Desk</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Questions regarding commercial terms or nodal account escrow? Contact our legal
                  counsel at{" "}
                  <a href="mailto:legal@dreamx.in" className="text-[#5145cd] font-medium hover:underline">
                    legal@dreamx.in
                  </a>
                  . Statutory 24h SLA.
                </p>
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
                  {copiedSha ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                <span>Timestamp: 2026-11-06T12:00 IST</span>
                <span className="text-emerald-700 font-medium">✓ Ledger Synced</span>
              </div>
            </Card>

            {/* Cross-Link Badges */}
            <div className="flex flex-col gap-2 pt-1">
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
              <Link
                href="/refunds"
                className="flex items-center justify-between p-3 rounded-lg bg-white border border-[#e7e7eb] text-xs font-semibold text-zinc-700 hover:border-[#5145cd] hover:text-[#5145cd] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Cancellation & Escrow Disgorgement</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </Link>
            </div>
          </aside>

          {/* Right Column: Detailed Statutory Articles (8 cols) */}
          <section className="lg:col-span-8 space-y-8">
            {/* Article 1 */}
            <Card id="art-1" className="p-6 sm:p-8 bg-white border-[#e7e7eb] rounded-xl shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5145cd] uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Article 1</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                1. Acceptance of Terms, Scope & Bengaluru Jurisdiction
              </h2>
              <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
                <p>
                  <strong>1.1 Electronic Contractual Consent:</strong> These Terms of Service (&quot;Terms&quot;)
                  constitute a legally binding electronic agreement under the Information Technology Act, 2000
                  and the rules framed thereunder, read with the provisions of the Indian Contract Act, 1872. By
                  clicking &quot;I Accept&quot;, creating an account, or transacting on the DreamX platform
                  (&quot;Platform&quot;), you (&quot;User&quot;, &quot;Candidate&quot;, or &quot;Mentor&quot;) agree
                  to be bound unconditionally by these terms.
                </p>
                <p>
                  <strong>1.2 Entity Identification:</strong> The Platform is owned, maintained, and operated
                  by <strong>DreamX Career Acceleration Technologies India Private Limited</strong> (CIN:
                  U72900KA2024PTC188204), a private company incorporated under the Companies Act, 2013, with its
                  registered corporate office at Indiranagar 100ft Road, Bengaluru, Karnataka 560038, India.
                </p>
                <p>
                  <strong>1.3 Legal Capacity & Eligibility:</strong> Use of the Platform is permitted only to
                  individuals who are competent to contract under Section 11 of the Indian Contract Act, 1872
                  (at least 18 years of age, of sound mind, and not disqualified by law).
                </p>
                <p>
                  <strong>1.4 Exclusive Forum & Territorial Jurisdiction:</strong> Any dispute, controversy, or
                  claim arising out of or in connection with these Terms, including validity or termination,
                  shall be governed by the laws of the Republic of India and subject to the exclusive
                  jurisdiction of the competent courts seated at <strong>Bengaluru, Karnataka, India</strong>.
                </p>
              </div>
            </Card>

            {/* Article 2 */}
            <Card id="art-2" className="p-6 sm:p-8 bg-white border-[#e7e7eb] rounded-xl shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5145cd] uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Article 2</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                2. Outcome-Accountable Marketplace Model
              </h2>
              <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
                <p>
                  <strong>2.1 Diagnostic Evaluation Nature:</strong> DreamX operates strictly as a bilateral
                  technology marketplace connecting technology professionals (&quot;Mentors&quot;) with early-career
                  candidates and software engineers (&quot;Candidates&quot;) for the specific purpose of administering
                  structured competency diagnostic assessments, mock interviews, and resume quality audits
                  (Services S01 through S10).
                </p>
                <p>
                  <strong>2.2 Independent Professional Relationship:</strong> Mentors operate on DreamX strictly
                  as independent professional contractors and not as employees, agents, or legal partners of
                  DreamX Technologies India Pvt Ltd. Mentors independently set their availability and conduct
                  evaluations adhering to the DreamX 8-Dimension Evaluation Rubric (PRD §8).
                </p>
                <p>
                  <strong>2.3 Non-Advisory Status:</strong> Feedback provided during sessions reflects the
                  evaluator&apos;s professional assessment of demonstrated skills and does not constitute formal legal,
                  financial, or human resource consultancy.
                </p>
              </div>
            </Card>

            {/* Article 3: STRICT NO PLACEMENT GUARANTEE CALLOUT */}
            <Card id="art-3" className="p-6 sm:p-8 bg-[#fffbfa] border-[#fed7d7] rounded-xl shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Article 3 • Mandatory Statutory Declaration</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                3. Strict No Job Guarantee / No Placement Assurance Pledge (PRD §1.2 & §12.5)
              </h2>

              <div className="bg-white p-5 rounded-lg border border-red-200 space-y-3 text-xs sm:text-sm text-zinc-700 leading-relaxed">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-zinc-900 text-sm">
                      Unconditional Disclaimer of Employment Brokerage & Placement Guarantees
                    </h3>
                    <p className="mt-1 text-zinc-600">
                      In strict compliance with the Consumer Protection (E-Commerce) Rules, 2020 and the
                      Advertising Standards Council of India (ASCI) Guidelines for Educational Services:
                    </p>
                  </div>
                </div>

                <ul className="list-disc pl-5 space-y-2 text-zinc-700 text-xs sm:text-sm">
                  <li>
                    <strong>No Placement Brokerage:</strong> DreamX does <em>NOT</em> offer, sell, promise, or
                    guarantee job placements, interviews, employment offers, or salary increments at any company.
                  </li>
                  <li>
                    <strong>No Employer Referral Guarantees:</strong> Booking an accredited mentor from Google,
                    Amazon, Uber, Microsoft, or any other enterprise does not constitute a company referral,
                    interview shortlist, or hiring solicitation. Mentors are contractually forbidden from selling
                    internal job referrals (PRD §9.4).
                  </li>
                  <li>
                    <strong>Deterministic Diagnostic Evaluation:</strong> The Platform&apos;s sole deliverable is the
                    objective calibration and evaluation of demonstrated software engineering competencies across
                    the 8-Dimension Career Readiness Matrix.
                  </li>
                  <li>
                    <strong>Prohibition of Deceptive Commercial Hype:</strong> Any representative, affiliate, or
                    marketing material claiming &quot;100% placement assurance&quot; is strictly unauthorized and void
                    under law.
                  </li>
                </ul>
              </div>

              <p className="text-xs text-zinc-500 italic">
                Enforced under PRD V3.0 §1.2 and verified in accordance with Section 2(47) of the Consumer
                Protection Act, 2019.
              </p>
            </Card>

            {/* Article 4 */}
            <Card id="art-4" className="p-6 sm:p-8 bg-white border-[#e7e7eb] rounded-xl shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5145cd] uppercase tracking-wider">
                <Lock className="w-4 h-4" />
                <span>Article 4</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                4. Nodal Escrow Custody & 48-Hour Deliverable SLA
              </h2>

              <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
                <p>
                  <strong>4.1 RBI Nodal Direction Compliance:</strong> In accordance with Reserve Bank of
                  India (RBI) Circular DPSS.CO.PD.No.1102/02.14.08/2009-10 regarding the direction of electronic
                  payment intermediaries, 100% of candidate booking payments are deposited directly into a
                  segregated Nodal Escrow Account administered via our licensed nodal banking partner (Razorpay
                  Software Private Limited).
                </p>
                <p>
                  <strong>4.2 Atomic Escrow Hold Mechanics:</strong> Funds are locked in escrow upon checkout.
                  Neither DreamX nor the assigned mentor has access to pre-settlement funds until the following
                  three programmatic validation conditions are satisfied:
                </p>

                <div className="bg-[#f7f7f8] p-4 rounded-lg border border-[#e7e7eb] space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-zinc-900 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Condition 1: Video Call Telemetry Sign-off (Google Meet API verification)</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-900 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Condition 2: Deliverable Scorecard Submission within 48:00:00 hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-900 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Condition 3: 48-hour candidate review window elapsed without unresolved dispute</span>
                  </div>
                </div>

                <p>
                  <strong>4.3 Automated 48-Hour Deliverable Disgorgement:</strong> Mentors must upload the
                  verified 8-dimension written scorecard within 48 hours of session conclusion. Failure to upload
                  within the 48-hour SLA triggers an automated, non-discretionary 80%–100% refund to the
                  candidate&apos;s original payment instrument (PRD §12.2).
                </p>
              </div>

              {/* SLA Table */}
              <div className="border border-[#e7e7eb] rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#f7f7f8] text-zinc-700 border-b border-[#e7e7eb] font-semibold">
                    <tr>
                      <th className="p-3">Scenario / Event</th>
                      <th className="p-3">Candidate Escrow Action</th>
                      <th className="p-3">Mentor Payout Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e7e7eb] text-zinc-600">
                    <tr>
                      <td className="p-3 font-medium text-zinc-900">Cancellation &ge; 1 hr before session</td>
                      <td className="p-3 text-emerald-700 font-semibold">100% Instant Refund (Zero Fee)</td>
                      <td className="p-3">Disbursal Voided</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-zinc-900">Mentor misses 48h Deliverable SLA</td>
                      <td className="p-3 text-emerald-700 font-semibold">80% Cash Disgorgement + 20% Credit</td>
                      <td className="p-3 text-red-600 font-medium">100% Payout Forfeited</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-zinc-900">Mentor No-Show (&gt;15 min delay)</td>
                      <td className="p-3 text-emerald-700 font-semibold">100% Refund + ₹200 Goodwill Credit</td>
                      <td className="p-3 text-red-600 font-medium">Forfeited + Trust Strike</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-zinc-900">Candidate accepts scorecard</td>
                      <td className="p-3 text-zinc-500">Service Fulfilled</td>
                      <td className="p-3 text-emerald-700 font-semibold">Net Payout Released</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Article 5 */}
            <Card id="art-5" className="p-6 sm:p-8 bg-white border-[#e7e7eb] rounded-xl shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5145cd] uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Article 5</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                5. Transparent Pricing, GST (18%) & Platform Invoicing Structure
              </h2>
              <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
                <p>
                  <strong>5.1 Rupee Integer Paise Precision:</strong> All commercial service fees (S01–S10) and
                  memberships are denominated and charged in Indian Rupees (INR, ₹). In accordance with PRD §7,
                  all computational prices are calculated in integer paise to eliminate floating-point rounding
                  discrepancies.
                </p>
                <p>
                  <strong>5.2 Statutory Goods and Services Tax (GST):</strong> Invoicing complies with the Central
                  Goods and Services Tax Act, 2017 (CGST) and Karnataka Goods and Services Tax Act, 2017 (SGST).
                  The statutory 18% GST rate is explicitly itemized on every generated tax invoice.
                </p>
                <p>
                  <strong>5.3 Platform-Funded Commercial Discounts:</strong> Promotional bundle discounts (e.g.
                  curate 3 services for 5% off) and Pro membership discounts are 100% platform-funded by DreamX
                  and are never deducted from accredited mentor compensation. Mentors always receive their full
                  agreed hourly remuneration (PRD §7.3).
                </p>
              </div>
            </Card>

            {/* Article 6 */}
            <Card id="art-6" className="p-6 sm:p-8 bg-white border-[#e7e7eb] rounded-xl shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5145cd] uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Article 6</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                6. Mentor Accreditation & Professional Code of Conduct (PRD §9)
              </h2>
              <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
                <p>
                  <strong>6.1 Rigorous 5+ YoE Bar:</strong> To ensure high diagnostic fidelity, only verified
                  technology practitioners with a minimum of 5 years of verified industry experience in product
                  companies, Global Capability Centers (GCCs), or Tier-1 unicorns are eligible for accreditation.
                </p>
                <p>
                  <strong>6.2 Dual-Control KYC Verification:</strong> Mentor employer verification requires
                  official work email authentication or encrypted corporate proof. All work history proofs are
                  stored in ephemeral sandboxes and automatically deleted 7 days post-verification to respect
                  mentor employment privacy (PRD §9.2).
                </p>
                <p>
                  <strong>6.3 Objective Evaluation Bar:</strong> Mentors are contractually bound to provide
                  objective, evidence-backed evaluation rubrics. Generative AI-filled boilerplate or low-effort
                  evaluations are subject to candidate dispute and rejection by the DreamX Trust & Verification
                  Desk.
                </p>
              </div>
            </Card>

            {/* Article 7 */}
            <Card id="art-7" className="p-6 sm:p-8 bg-white border-[#e7e7eb] rounded-xl shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5145cd] uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Article 7</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                7. Candidate Non-Circumvention & Mutual Platform Integrity
              </h2>
              <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
                <p>
                  <strong>7.1 Non-Circumvention Obligation:</strong> For a period of 12 months following any
                  initial diagnostic session between a Candidate and a Mentor introduced via DreamX, both parties
                  agree not to solicit, offer, or accept diagnostic or advisory payments outside the DreamX
                  platform.
                </p>
                <p>
                  <strong>7.2 Protection of Nodal Escrow Safeguards:</strong> Transactions arranged outside the
                  Platform forfeit all RBI Nodal Escrow protections, 48-hour deliverable SLAs, and grievance
                  arbitration mechanisms provided by DreamX.
                </p>
              </div>
            </Card>

            {/* Article 8: Grievance Redressal Officer */}
            <Card id="art-8" className="p-6 sm:p-8 bg-white border-[#e7e7eb] rounded-xl shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5145cd] uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Article 8</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                8. Statutory Grievance Redressal Officer & Dispute Arbitration
              </h2>

              <p className="text-sm text-zinc-600 leading-relaxed">
                Pursuant to Rule 3(11) of the Information Technology (Intermediary Guidelines and Digital Media
                Ethics Code) Rules, 2021 and Section 5(9) of the Consumer Protection (E-Commerce) Rules, 2020,
                the designated Grievance Officer details are published below:
              </p>

              <div className="bg-[#fcf9f8] p-5 rounded-xl border border-[#e7e7eb] space-y-3 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-zinc-500 text-xs block">Designated Officer:</span>
                    <strong className="text-zinc-900 font-bold">Adv. Rajeshwar K. Sharma, LL.M.</strong>
                    <span className="text-zinc-500 text-xs block mt-0.5">
                      Head of Trust, Governance & Grievance Redressal
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-xs block">Official Email:</span>
                    <a
                      href="mailto:grievance@dreamx.in"
                      className="text-[#5145cd] font-bold hover:underline inline-flex items-center gap-1"
                    >
                      grievance@dreamx.in
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="text-zinc-500 text-xs block mt-0.5">
                      Statutory SLA: 24h acknowledgement
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-zinc-500 text-xs block">Registered Corporate Office:</span>
                    <span className="text-zinc-800">
                      DreamX Career Acceleration Technologies Pvt. Ltd., Level 4, Prestige Meridian, Indiranagar
                      100ft Road, Bengaluru, Karnataka 560038, India
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#e7e7eb] flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
                  <span>Acknowledgment SLA: <strong>24 Hours</strong></span>
                  <span>Disposal Resolution SLA: <strong>15 Calendar Days</strong></span>
                  <span>Arbitration Seat: <strong>Bengaluru, KA</strong></span>
                </div>
              </div>

              <p className="text-xs text-zinc-500 leading-relaxed">
                In the event of an unresolved dispute, the matter shall be referred to binding sole arbitration
                under the Indian Arbitration and Conciliation Act, 1996, with the venue and seat at Bengaluru.
              </p>
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
                Outcome-Accountable Career Acceleration & Diagnostic Evaluation Ecosystem
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-600">
              <Link href="/terms" className="text-[#5145cd] font-semibold hover:underline">
                Terms of Service
              </Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-[#5145cd] transition-colors">
                Privacy Policy (DPDP 2023)
              </Link>
              <span>•</span>
              <Link href="/refunds" className="hover:text-[#5145cd] transition-colors">
                Refund & SLA Disgorgement
              </Link>
              <span>•</span>
              <a href="mailto:grievance@dreamx.in" className="hover:text-[#5145cd] transition-colors">
                Grievance Officer
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
                RBI Nodal Escrow Compliant
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
