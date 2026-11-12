"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Clock,
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
  Database,
  Trash2,
  RefreshCw,
  Server,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PrivacyPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeArticle, setActiveArticle] = React.useState<string>("art-1");
  const [copiedSha, setCopiedSha] = React.useState(false);
  const [actionFeedback, setActionFeedback] = React.useState<string | null>(null);

  const shaDigest = "a789c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b771";

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

  const triggerAction = (label: string) => {
    setActionFeedback(label);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const articles = [
    { id: "art-1", num: "1", title: "Data Fiduciary Status & Statutory Scope (DPDP §2(i))" },
    { id: "art-2", num: "2", title: "Candidate Evaluation Vectors & Rubric Shield (PRD §18)" },
    { id: "art-3", num: "3", title: "Ephemeral Mentor KYC Sandbox (7-Day Purge)" },
    { id: "art-4", num: "4", title: "Data Principal Statutory Rights & Resolution SLAs" },
    { id: "art-5", num: "5", title: "Authorized Sub-processors & Sovereign Cloud Custody" },
    { id: "art-6", num: "6", title: "Data Protection Officer (DPO) & Redressal" },
  ];

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.num.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-sans antialiased selection:bg-[#5145cd] selection:text-white">
      {/* 1. Top Compliance Ribbon */}
      <div className="bg-[#171717] text-white border-b border-[#2d2d38] text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              DPDP Act 2023 Certified Data Fiduciary
            </span>
            <span className="hidden sm:inline text-zinc-500">•</span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              AES-256 Storage Encryption at Rest
            </span>
            <span className="hidden md:inline text-zinc-500">•</span>
            <span className="text-zinc-400 hidden lg:inline">
              Jurisdiction: Republic of India • Bengaluru, KA
            </span>
          </div>
          <div className="flex items-center gap-3 text-zinc-400">
            <span>Canonical DPDP Spec v3.0.4</span>
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
                variant="success"
                className="bg-[#ebf7ee] text-[#16834a] border-[#b8e8c5] font-medium text-xs px-2.5 py-0.5"
              >
                Data Protection & Privacy Desk
              </Badge>
              <span className="text-xs text-zinc-500 hidden md:inline">
                DPDP Act 2023 Compliance
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-md justify-end">
            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Search privacy rules, rights, SLAs..."
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
              <span>Dossier PDF</span>
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebf7ee] text-[#16834a] text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Statutory Data Fiduciary Charter • MeitY & DPDP Compliance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171717] tracking-tight leading-tight">
              Privacy Policy & Data Fiduciary Repository
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              Statutory governance of personal data, evaluation rubrics, ephemeral mentor KYC
              sandboxes, and data principal rights under the Digital Personal Data Protection Act,
              2023 (DPDP Act) and Ministry of Electronics & IT (MeitY) directives.
            </p>
          </div>

          {/* 3 Key Safeguard Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <Card className="p-5 bg-[#fcf9f8] border-[#e7e7eb] rounded-xl hover:border-zinc-300 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                    Zero Data Brokering
                  </div>
                  <div className="text-sm font-bold text-zinc-900">100% Private Resumes</div>
                </div>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Candidate resumes, scorecards, and diagnostic metrics are NEVER sold, scraped, or
                brokered to headhunters, recruiters, or AI training datasets (PRD §18.1).
              </p>
            </Card>

            <Card className="p-5 bg-[#fcf9f8] border-[#e7e7eb] rounded-xl hover:border-zinc-300 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#5145cd]">
                    AES-256 Storage
                  </div>
                  <div className="text-sm font-bold text-zinc-900">Ephemeral Signed URLs</div>
                </div>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Documents are encrypted at rest with AES-256. Access is granted exclusively via
                time-limited, signed URLs (15-min TTL) to assigned mentors during the session window.
              </p>
            </Card>

            <Card className="p-5 bg-[#fcf9f8] border-[#e7e7eb] rounded-xl hover:border-zinc-300 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-800">
                    7-Day Ephemeral KYC
                  </div>
                  <div className="text-sm font-bold text-zinc-900">Auto-Purge Execution</div>
                </div>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Mentor corporate work badges and salary slips are irreversibly destroyed 168 hours
                post-verification to protect employment confidentiality (PRD §9.2).
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. Main Two-Column Privacy Architecture */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sticky Index & Self-Serve Console (4 cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            <Card className="p-5 bg-white border-[#e7e7eb] rounded-xl shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0eded]">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Statutory Clauses
                </span>
                <span className="text-xs font-medium text-[#16834a] bg-[#ebf7ee] px-2 py-0.5 rounded-full">
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

              {/* Data Principal Self-Serve Action Console */}
              <div className="pt-3 border-t border-[#f0eded] space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-900">
                  <span className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-[#5145cd]" />
                    Data Principal Console
                  </span>
                  <Badge variant="neutral" className="text-[10px] bg-zinc-50">
                    Self-Serve
                  </Badge>
                </div>

                <div className="space-y-1.5 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => triggerAction("dossier")}
                    className="w-full justify-start text-[11px] h-8 border-[#e7e7eb] hover:bg-[#f7f7f8]"
                  >
                    <Download className="w-3 h-3 text-zinc-500 mr-2" />
                    Request Full Dossier Archive (JSON/ZIP)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => triggerAction("soft-delete")}
                    className="w-full justify-start text-[11px] h-8 border-[#e7e7eb] hover:bg-[#f7f7f8] text-amber-800"
                  >
                    <Trash2 className="w-3 h-3 text-amber-600 mr-2" />
                    Trigger 30-Day Soft-Delete Purge
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => triggerAction("redressal")}
                    className="w-full justify-start text-[11px] h-8 border-[#e7e7eb] hover:bg-[#f7f7f8]"
                  >
                    <RefreshCw className="w-3 h-3 text-zinc-500 mr-2" />
                    File Data Redressal Notice (24h SLA)
                  </Button>
                </div>

                {actionFeedback && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 animate-in fade-in duration-200">
                    {actionFeedback === "dossier" &&
                      "Dossier generation queued. An encrypted export link will be sent to your verified email within 72 hours."}
                    {actionFeedback === "soft-delete" &&
                      "Soft-delete flag initiated. Your profile is de-indexed; permanent cryptographic shredding scheduled in 30 days."}
                    {actionFeedback === "redressal" &&
                      "Notice routed to Data Protection Officer (Adv. Rajeshwar K. Sharma). 24h statutory acknowledgment email sent."}
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
                <span>DPDP Registry Id: #DX-DPDP-2026-KA</span>
                <span className="text-emerald-700 font-medium">✓ Compliant</span>
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
              <div className="flex items-center gap-2 text-xs font-bold text-[#16834a] uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Article 1</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                1. Data Fiduciary Status & Statutory Scope under DPDP Act 2023
              </h2>
              <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
                <p>
                  <strong>1.1 Statutory Designation:</strong> DreamX Career Acceleration Technologies India
                  Private Limited operates strictly as a <strong>Data Fiduciary</strong> within the meaning of
                  Section 2(i) of the Digital Personal Data Protection Act, 2023 (&quot;DPDP Act&quot;).
                </p>
                <p>
                  <strong>1.2 Strict Purpose Limitation:</strong> We collect and process digital personal data
                  strictly and solely for: (a) verifying user identity and session scheduling, (b) generating
                  and delivering verified competency diagnostic scorecards (Services S01–S10), and (c)
                  facilitating segregated escrow payments via licensed nodal banking partners.
                </p>
                <div className="bg-[#ebf7ee] p-4 rounded-lg border border-[#b8e8c5] text-xs text-[#0f5b33] space-y-1.5">
                  <div className="font-bold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#16834a]" />
                    <span>Non-Negotiable Zero Data Brokering Covenant:</span>
                  </div>
                  <p>
                    Candidate resumes, interview code submissions, mock session recordings, and 8-dimension
                    diagnostic scorecards are <strong>NEVER sold, rented, monetized, leased, or brokered</strong> to
                    third-party recruitment agencies, staffing firms, or foundation AI training models.
                  </p>
                </div>
              </div>
            </Card>

            {/* Article 2 */}
            <Card id="art-2" className="p-6 sm:p-8 bg-white border-[#e7e7eb] rounded-xl shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5145cd] uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Article 2</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                2. Candidate Evaluation Vectors & Rubric Confidentiality (PRD §18)
              </h2>
              <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
                <p>
                  <strong>2.1 100% Private Evaluation Vectors by Default:</strong> In accordance with PRD §18,
                  all diagnostic evaluations across the 8-Dimension Career Readiness Matrix (Architecture,
                  Concurrency, System Design, Communication, etc.) are treated as the confidential intellectual
                  property of the candidate. No public or recruiter-facing profile is ever generated without the
                  candidate&apos;s explicit, granular, opt-in consent.
                </p>
                <p>
                  <strong>2.2 Ephemeral Video Telemetry:</strong> Live 1:1 sessions operate over ephemeral Google
                  Meet WebRTC bridges. DreamX does not record, intercept, or store audio/video streams on central
                  servers by default. Attendance telemetry is collected strictly for escrow release verification
                  via authenticated API webhooks.
                </p>
                <p>
                  <strong>2.3 Code Artifact Encryption:</strong> Technical mock source code and architecture
                  diagrams submitted during sessions are encrypted with AES-256 and purged from cache 30 days
                  following session sign-off.
                </p>
              </div>
            </Card>

            {/* Article 3: EPHEMERAL MENTOR KYC PURGE */}
            <Card id="art-3" className="p-6 sm:p-8 bg-white border-[#e7e7eb] rounded-xl shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Article 3</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                3. Ephemeral Mentor KYC Sandbox & 7-Day Auto-Purge Protocol (PRD §9.2)
              </h2>

              <p className="text-sm text-zinc-600 leading-relaxed">
                To guarantee absolute employment confidentiality for top-tier software engineers mentoring on
                the Platform, DreamX enforces a cryptographically automated 7-day purge lifecycle for corporate
                credential verifications:
              </p>

              {/* 3-Step Lifecycle Visual */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-lg bg-[#fcf9f8] border border-[#e7e7eb] space-y-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 text-[#5145cd] flex items-center justify-center font-bold text-[11px]">
                    1
                  </div>
                  <strong className="text-zinc-900 block font-bold">TLS 1.3 Ingestion</strong>
                  <p className="text-zinc-500 text-[11px] leading-relaxed">
                    Corporate badges, work email OTPs, or Form 16 are ingested into an isolated, air-gapped AWS S3
                    bucket with server-side KMS encryption.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-[#fcf9f8] border border-[#e7e7eb] space-y-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 text-[#5145cd] flex items-center justify-center font-bold text-[11px]">
                    2
                  </div>
                  <strong className="text-zinc-900 block font-bold">Dual-Control Audit</strong>
                  <p className="text-zinc-500 text-[11px] leading-relaxed">
                    Accredited human audit team inspects credentials via time-limited, signed tokens (15-min TTL)
                    with zero local download permissions.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[11px]">
                    3
                  </div>
                  <strong className="text-amber-900 block font-bold">168h Automatic Shred</strong>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    Exactly 168 hours post-verification, automated S3 lifecycle rules cryptographically delete the
                    files. Only an immutable SHA-256 hash remains.
                  </p>
                </div>
              </div>

              <div className="text-xs text-zinc-500 bg-[#f7f7f8] p-3 rounded-lg border border-[#e7e7eb]">
                <strong>Statutory Compliance:</strong> In accordance with Section 8(7) of the DPDP Act 2023, personal
                data is retained only for the duration strictly necessary to satisfy the purpose of verification.
              </div>
            </Card>

            {/* Article 4 */}
            <Card id="art-4" className="p-6 sm:p-8 bg-white border-[#e7e7eb] rounded-xl shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5145cd] uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Article 4</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                4. Data Principal Statutory Rights & Resolution SLAs
              </h2>

              <p className="text-sm text-zinc-600 leading-relaxed">
                Under Chapter III of the DPDP Act 2023, every user (&quot;Data Principal&quot;) is entitled to the
                following enforceable statutory rights, serviced under strict platform SLAs:
              </p>

              {/* Rights Matrix Table */}
              <div className="border border-[#e7e7eb] rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#f7f7f8] text-zinc-700 border-b border-[#e7e7eb] font-semibold">
                    <tr>
                      <th className="p-3">Statutory Right</th>
                      <th className="p-3">Scope & Deliverable</th>
                      <th className="p-3">Enforceable SLA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e7e7eb] text-zinc-600">
                    <tr>
                      <td className="p-3 font-medium text-zinc-900">Right to Access (§11)</td>
                      <td className="p-3">Complete export of personal data, rubric scores, and sub-processor shares in JSON/ZIP</td>
                      <td className="p-3 text-emerald-700 font-semibold">72 Hours max</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-zinc-900">Right to Correction (§12)</td>
                      <td className="p-3">Rectification of incorrect contact data, educational credentials, or career history</td>
                      <td className="p-3 text-emerald-700 font-semibold">24 Hours max</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-zinc-900">Right to Erasure (§12(3))</td>
                      <td className="p-3">Complete deletion of account, resumes, and scorecards (subject only to GST tax audit laws)</td>
                      <td className="p-3 text-emerald-700 font-semibold">30 Days (Soft-Delete)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-zinc-900">Right of Grievance (§13)</td>
                      <td className="p-3">Direct redressal by designated Data Protection Officer with written resolution report</td>
                      <td className="p-3 text-emerald-700 font-semibold">15 Days statutory</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-zinc-900">Right to Nominate (§14)</td>
                      <td className="p-3">Nominate a legal representative to exercise rights in the event of death or incapacity</td>
                      <td className="p-3 text-emerald-700 font-semibold">5 Business Days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Article 5 */}
            <Card id="art-5" className="p-6 sm:p-8 bg-white border-[#e7e7eb] rounded-xl shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5145cd] uppercase tracking-wider">
                <Server className="w-4 h-4" />
                <span>Article 5</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                5. Authorized Sub-processors & Sovereign Cloud Custody
              </h2>
              <div className="space-y-3 text-sm text-zinc-600 leading-relaxed">
                <p>
                  <strong>5.1 Sovereign Indian Cloud Residency:</strong> In strict adherence to DPDP Act data
                  localization requirements, all primary databases, evaluation scores, and identity records are
                  hosted within the territory of India at AWS Asia Pacific (Mumbai) region (`ap-south-1`).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-lg border border-[#e7e7eb] bg-[#f7f7f8] space-y-1">
                    <strong className="text-zinc-900 block font-semibold">Razorpay Software Pvt. Ltd.</strong>
                    <span className="text-zinc-500 block">Nodal Escrow banking rails • RBI Compliant (Mumbai)</span>
                  </div>
                  <div className="p-3 rounded-lg border border-[#e7e7eb] bg-[#f7f7f8] space-y-1">
                    <strong className="text-zinc-900 block font-semibold">Supabase Inc. / PostgreSQL</strong>
                    <span className="text-zinc-500 block">Row-Level Security (RLS) encrypted custody • Mumbai region</span>
                  </div>
                  <div className="p-3 rounded-lg border border-[#e7e7eb] bg-[#f7f7f8] space-y-1">
                    <strong className="text-zinc-900 block font-semibold">Cloudflare India</strong>
                    <span className="text-zinc-500 block">WAF & DDoS scrubbing • Zero persistent payload storage</span>
                  </div>
                  <div className="p-3 rounded-lg border border-[#e7e7eb] bg-[#f7f7f8] space-y-1">
                    <strong className="text-zinc-900 block font-semibold">Google Workspace API</strong>
                    <span className="text-zinc-500 block">Ephemeral WebRTC video bridge • No centralized recording</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Article 6: DPO Details */}
            <Card id="art-6" className="p-6 sm:p-8 bg-white border-[#e7e7eb] rounded-xl shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#16834a] uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Article 6</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
                6. Data Protection Officer (DPO) & Redressal Escalation
              </h2>

              <p className="text-sm text-zinc-600 leading-relaxed">
                Pursuant to Section 8(5) and Section 10 of the DPDP Act 2023, DreamX has appointed a statutory
                Data Protection Officer responsible for overseeing compliance, addressing data principal rights,
                and liaising with the Data Protection Board of India (DPBI):
              </p>

              <div className="bg-[#fcf9f8] p-5 rounded-xl border border-[#e7e7eb] space-y-3 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-zinc-500 text-xs block">Designated DPO:</span>
                    <strong className="text-zinc-900 font-bold">Adv. Rajeshwar K. Sharma, LL.M.</strong>
                    <span className="text-zinc-500 text-xs block mt-0.5">
                      Statutory Data Protection Officer & Legal Counsel
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-xs block">Official Email:</span>
                    <a
                      href="mailto:dpo@dreamx.in"
                      className="text-[#5145cd] font-bold hover:underline inline-flex items-center gap-1"
                    >
                      dpo@dreamx.in
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="text-zinc-500 text-xs block mt-0.5">
                      Secondary: privacy@dreamx.in
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-zinc-500 text-xs block">Physical Corporate Address:</span>
                    <span className="text-zinc-800">
                      DreamX Career Acceleration Technologies Pvt. Ltd., Outer Ring Road, Bellandur, Bengaluru,
                      Karnataka 560103, India
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#e7e7eb] flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
                  <span>Mandatory Acknowledgment: <strong>24 Hours</strong></span>
                  <span>Investigation Report: <strong>15 Calendar Days</strong></span>
                  <span>Regulatory Board: <strong>Data Protection Board of India</strong></span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Statutory Escalation Avenue:</strong> If you are dissatisfied with the resolution
                  provided by our Data Protection Officer, you retain the statutory right under Section 13(3) of
                  the DPDP Act to submit an appeal directly to the <strong>Data Protection Board of India</strong>.
                </p>
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
                Data Protection & Privacy Desk • Digital Personal Data Protection Act 2023 Compliant
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-600">
              <Link href="/terms" className="hover:text-[#5145cd] transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
              <Link href="/privacy" className="text-[#16834a] font-semibold hover:underline">
                Privacy Policy (DPDP 2023)
              </Link>
              <span>•</span>
              <Link href="/refunds" className="hover:text-[#5145cd] transition-colors">
                Refund & SLA Disgorgement
              </Link>
              <span>•</span>
              <a href="mailto:dpo@dreamx.in" className="hover:text-[#5145cd] transition-colors">
                Data Protection Officer
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
                DPDP Act 2023 Certified
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
