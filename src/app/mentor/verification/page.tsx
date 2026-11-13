"use client";

import * as React from "react";
import { useAuth } from "@/lib/auth-context";

interface AuditLedgerEntry {
  timestamp: string;
  event: string;
  agent: string;
  method: string;
  status: "verified" | "pre_validated" | "compliant" | "certified";
  hash: string;
}

const AUDIT_LEDGER: AuditLedgerEntry[] = [
  {
    timestamp: "14 Oct 2026, 16:30 IST",
    event: "L5/L6 Seniority Accreditation Granted",
    agent: "Priyadarshini Rao (Head of Trust)",
    method: "Dual-Control Corporate Mailbox Probe",
    status: "verified",
    hash: "0x9f28a71c8902..b71c",
  },
  {
    timestamp: "14 Oct 2026, 15:45 IST",
    event: "Form 16 & Corporate ID Hash Verification",
    agent: "DreamX Automated Doc Probe",
    method: "AES-256 SHA-256 Matching",
    status: "verified",
    hash: "0x83e21098df44..44a0",
  },
  {
    timestamp: "14 Oct 2026, 14:10 IST",
    event: "Work Email Domain DKIM Probe Passed",
    agent: "System Mailbox Agent",
    method: "DKIM / DMARC Handshake",
    status: "pre_validated",
    hash: "0x11ab49c011e4..cd99",
  },
  {
    timestamp: "12 Oct 2026, 11:20 IST",
    event: "Government Identity Masked KYC Verified",
    agent: "UIDAI Offline XML Engine",
    method: "Masked Aadhaar Verification",
    status: "compliant",
    hash: "0x77c908f43210..ef12",
  },
  {
    timestamp: "10 Oct 2026, 09:15 IST",
    event: "S06 Distributed Systems Rubric Passed",
    agent: "Bar Raiser Review Board",
    method: "Evaluator Rubric 98/100",
    status: "certified",
    hash: "0x33d188ef7721..99bb",
  },
];

export default function MentorVerificationPage() {
  const { user } = useAuth();
  const [copiedHash, setCopiedHash] = React.useState(false);
  const [s08Modal, setS08Modal] = React.useState(false);

  const handleCopyHash = () => {
    navigator.clipboard?.writeText("0x4f9a8b1c7739e801a2c3d4e5f6071829a8b7c6d5e4f3a2b1c0d9e8f7a6b581ce");
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 3000);
  };

  return (
    <div className="flex flex-col w-full bg-[#fcf9f8] min-h-screen text-[#1c1b1b]">
      {/* Top Header Ribbon */}
      <div className="w-full bg-white border-b border-[#e7e7eb] px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1c1b1b]">Mentor Hub</span>
          <span className="text-[#c8c4d6]">/</span>
          <span className="font-bold text-[#5145cd]">Trust Verification Desk</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf5ef] border border-[#94f7b2] text-[#006d3a] font-semibold text-[11px]">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            <span>Tier-1 Verified Mentor (PRD §9.1 Protocol)</span>
          </div>
          <span className="text-[#474554] text-[11px]">Asia/Kolkata (IST • UTC+05:30)</span>
        </div>
      </div>

      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c1b1b] tracking-tight font-heading">
                Trust Verification &amp; Credential Audit Desk
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#eaf5ef] text-[#006d3a]">
                Audited
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#474554] mt-1">
              Cryptographic proof of identity, senior employment, and service-specific rubric authorization under DreamX PRD §9.1.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => alert("Downloading Accredited Mentor Badge (SVG/PNG)...")}
              className="px-4 py-2.5 bg-white border border-[#e7e7eb] hover:bg-[#f6f3f2] text-[#1c1b1b] text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Download Badge</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-[#5145cd] hover:bg-[#3828b5] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span>Export Audit Certificate</span>
            </button>
          </div>
        </div>

        {/* Overall Verification Status Banner */}
        <div className="bg-gradient-to-r from-white via-white to-[#eaf5ef]/40 border border-[#94f7b2] rounded-2xl p-6 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#eaf5ef] text-[#006d3a] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">verified_user</span>
                </div>
                <h2 className="text-lg font-bold text-[#1c1b1b] font-heading">
                  Accreditation Status: FULLY ACCREDITED &amp; DISPATCH READY
                </h2>
              </div>
              <p className="text-xs text-[#474554] max-w-2xl leading-relaxed">
                Cryptographically verified under Indian DPDP Act 2023 &amp; RBI Nodal Escrow Compliance guidelines. Pre-funded escrow dispatches unlock automatically upon booking confirmation.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-[#f6f3f2] border border-[#e7e7eb] font-mono text-[#1c1b1b]">
                  Docket ID: DX-VFD-99401
                </span>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="px-2.5 py-1 rounded-lg bg-[#f6f3f2] border border-[#e7e7eb] font-mono text-[#5145cd] hover:bg-white flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">content_copy</span>
                  <span>{copiedHash ? "Fingerprint Copied!" : "SHA-256: 0x4f9a8b1c...81ce"}</span>
                </button>
                <span className="text-[#006d3a] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  Next Annual Re-check: 14 Oct 2027
                </span>
              </div>
            </div>

            <div className="lg:text-right shrink-0 p-4 rounded-xl bg-white border border-[#e7e7eb] shadow-xs space-y-1">
              <span className="text-[10px] text-[#777585] uppercase font-bold tracking-wider block">
                Calibrated Rating
              </span>
              <div className="flex items-center lg:justify-end gap-1.5 text-2xl font-extrabold text-[#1c1b1b] font-heading">
                <span className="text-amber-500">★</span>
                <span>4.96</span>
                <span className="text-xs font-normal text-[#777585]">/ 5.00</span>
              </div>
              <span className="text-[11px] font-bold text-[#006d3a] block">
                Tier-1 Bar Raiser Lead
              </span>
            </div>
          </div>
        </div>

        {/* 3-Tier Verification Breakdown Grid */}
        <section aria-labelledby="three-tier-title" className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#1c1b1b] font-heading" id="three-tier-title">
              Three-Tier Verification Architecture (PRD §9.1)
            </h2>
            <span className="text-[11px] text-[#474554] bg-[#f0eded] px-2 py-0.5 rounded font-mono">
              3 Independent Trust Checks
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Tier 1: Identity & Professional Presence */}
            <div className="bg-white border border-[#e7e7eb] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#e7e7eb]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#777585]">
                    Check 01
                  </span>
                  <h3 className="text-sm font-bold text-[#1c1b1b]">Identity &amp; Presence</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#eaf5ef] text-[#006d3a] text-[10px] font-bold">
                  100% Verified
                </span>
              </div>

              <ul className="space-y-3 text-xs text-[#474554]">
                <li className="space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-[#1c1b1b]">
                    <span>Corporate Work Email</span>
                    <span className="text-[#006d3a] text-[11px]">DKIM Match</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#5145cd] block">
                    {user?.email || "mentor.partner@dreamx.in"}
                  </span>
                </li>

                <li className="space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-[#1c1b1b]">
                    <span>Government Identity</span>
                    <span className="text-[#006d3a] text-[11px]">DPDP Shielded</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#777585] block">
                    Masked Aadhaar (•••• •••• 8912)
                  </span>
                </li>

                <li className="space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-[#1c1b1b]">
                    <span>LinkedIn Provenance</span>
                    <span className="text-[#006d3a] text-[11px]">OAuth Verified</span>
                  </div>
                  <span className="text-[11px] text-[#474554] block">
                    12+ Years Experience • 500+ Connections
                  </span>
                </li>

                <li className="space-y-0.5">
                  <div className="flex items-center justify-between font-bold text-[#1c1b1b]">
                    <span>Primary Phone 2FA</span>
                    <span className="text-[#006d3a] text-[11px]">SMS OTP</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#777585] block">
                    +91 98*** **321
                  </span>
                </li>
              </ul>
            </div>

            {/* Tier 2: Seniority & Employer Audit */}
            <div className="bg-white border border-[#e7e7eb] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#e7e7eb]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#777585]">
                    Check 02
                  </span>
                  <h3 className="text-sm font-bold text-[#1c1b1b]">Seniority &amp; Employer</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#eaf5ef] text-[#006d3a] text-[10px] font-bold">
                  Auditor Approved
                </span>
              </div>

              <ul className="space-y-3 text-xs text-[#474554]">
                <li className="space-y-0.5">
                  <span className="font-bold text-[#1c1b1b] block">Current Verified Employer</span>
                  <span className="text-xs text-[#1c1b1b] font-semibold block">
                    Google India Pvt Ltd (Bengaluru Campus)
                  </span>
                </li>

                <li className="space-y-0.5">
                  <span className="font-bold text-[#1c1b1b] block">Confirmed Designation</span>
                  <span className="text-xs text-[#5145cd] font-semibold block">
                    Senior Staff Software Engineer / Lead AI (L5/L6)
                  </span>
                </li>

                <li className="space-y-0.5">
                  <span className="font-bold text-[#1c1b1b] block">Audited Documents</span>
                  <span className="text-[11px] text-[#474554] block">
                    Corporate ID Badge + Form 16 Tax Hash
                  </span>
                </li>

                <li className="space-y-0.5 pt-1 border-t border-[#e7e7eb]">
                  <span className="text-[10px] text-[#777585] block">Audited by:</span>
                  <span className="text-xs text-[#1c1b1b] font-semibold block">
                    Priyadarshini Rao (Head of Trust &amp; Verification Desk)
                  </span>
                  <span className="text-[10px] text-[#777585] block">Signed 14 Oct 2026, 16:30 IST</span>
                </li>
              </ul>
            </div>

            {/* Tier 3: Service-Specific Rubrics */}
            <div className="bg-white border border-[#e7e7eb] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#e7e7eb]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#777585]">
                    Check 03
                  </span>
                  <h3 className="text-sm font-bold text-[#1c1b1b]">Service Approvals</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#e3dfff] text-[#130068] text-[10px] font-bold">
                  3 Approved • 1 Pending
                </span>
              </div>

              <ul className="space-y-2.5 text-xs">
                <li className="p-2.5 rounded-xl bg-[#f6f3f2] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1c1b1b] block">S06: Technical Mock</span>
                    <span className="text-[11px] text-[#474554]">4.96 rating • 24 completed</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#eaf5ef] text-[#006d3a] text-[10px] font-bold">
                    Approved
                  </span>
                </li>

                <li className="p-2.5 rounded-xl bg-[#f6f3f2] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1c1b1b]">S01: Resume Line-by-Line</span>
                    <span className="text-[11px] text-[#474554] block">100% 48h SLA adherence</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#eaf5ef] text-[#006d3a] text-[10px] font-bold">
                    Approved
                  </span>
                </li>

                <li className="p-2.5 rounded-xl bg-[#f6f3f2] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1c1b1b]">S05: Behavioral STAR</span>
                    <span className="text-[11px] text-[#474554] block">Leadership bar-raiser rubric</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#eaf5ef] text-[#006d3a] text-[10px] font-bold">
                    Approved
                  </span>
                </li>

                <li className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1c1b1b]">S08: Salary Negotiation</span>
                    <span className="text-[10px] text-amber-800 block">Requires 15-min assessment</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setS08Modal(true)}
                    className="px-2 py-1 rounded bg-[#5145cd] text-white text-[10px] font-bold hover:bg-[#3828b5]"
                  >
                    Take Quiz
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Immutable Audit Trail Table */}
        <section aria-labelledby="audit-trail-title" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#1c1b1b] font-heading" id="audit-trail-title">
                Immutable Verification Ledger &amp; Audit Trail
              </h2>
              <span className="text-[11px] text-[#474554] bg-[#f0eded] px-2 py-0.5 rounded font-mono">
                PRD §9.2
              </span>
            </div>
            <button
              type="button"
              onClick={() => alert("Exporting full CSV audit trail...")}
              className="text-xs text-[#5145cd] font-bold hover:underline"
            >
              Download CSV Export
            </button>
          </div>

          <div className="bg-white border border-[#e7e7eb] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f6f3f2] border-b border-[#e7e7eb] text-[11px] font-bold text-[#777585] uppercase tracking-wider">
                    <th className="py-3 px-4">Timestamp (IST)</th>
                    <th className="py-3 px-4">Audit Event</th>
                    <th className="py-3 px-4">Verification Agent / System</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Log Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e7e7eb]">
                  {AUDIT_LEDGER.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-[#f6f3f2]/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[#474554] text-[11px]">
                        {entry.timestamp}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#1c1b1b]">
                        {entry.event}
                      </td>
                      <td className="py-3.5 px-4 text-[#474554]">
                        {entry.agent}
                      </td>
                      <td className="py-3.5 px-4 text-[#777585]">
                        {entry.method}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-[#eaf5ef] text-[#006d3a] text-[10px] font-bold uppercase">
                          {entry.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-[11px] text-[#5145cd]">
                        {entry.hash}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* DPDP Act 2023 Callout Footer */}
        <div className="p-5 rounded-2xl bg-[#f6f3f2] border border-[#e7e7eb] text-xs text-[#474554] space-y-1 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-[#1c1b1b]">
            <span className="material-symbols-outlined text-[18px] text-[#006d3a]">shield</span>
            <span>Indian Digital Personal Data Protection (DPDP) Act 2023 Compliance &amp; Zero-Knowledge Custody</span>
          </div>
          <p className="text-[11px] text-[#777585] leading-relaxed">
            Sensitive identification documents and work proofs are processed in ephemeral sandboxes and stored in zero-knowledge encrypted cold storage. DreamX compliance officers verify documents using SHA-256 hashes without ever exposing unmasked credentials to candidates, employers, or third parties. 12-month auto-purge policy for unapproved submissions.
          </p>
        </div>
      </main>

      {/* S08 Assessment Modal */}
      {s08Modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#e7e7eb]">
              <h3 className="font-bold text-base text-[#1c1b1b] font-heading">
                S08: Salary Negotiation Rubric Assessment
              </h3>
              <button
                type="button"
                onClick={() => setS08Modal(false)}
                className="text-[#777585] hover:text-[#1c1b1b]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <p className="text-xs text-[#474554] leading-relaxed">
              This 15-minute diagnostic test covers Tier-1 GCC equity vesting curves, ESOP tax models under Indian IT Act, and counter-offer strategy scripts. Scoring $\ge$85% grants instant service accreditation.
            </p>
            <div className="p-3 rounded-xl bg-[#f6f3f2] text-xs text-[#1c1b1b] space-y-1">
              <span className="font-bold block">Assessment Details:</span>
              <span className="text-[#474554] block">• 10 scenario-based multiple choice questions</span>
              <span className="text-[#474554] block">• Time limit: 15 minutes</span>
              <span className="text-[#474554] block">• Passing score: 85%</span>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setS08Modal(false)}
                className="px-4 py-2 border border-[#e7e7eb] rounded-xl text-xs font-bold text-[#474554]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("S08 Rubric Quiz session initialized. Redirecting to evaluation sandbox...");
                  setS08Modal(false);
                }}
                className="px-4 py-2 bg-[#5145cd] text-white rounded-xl text-xs font-bold hover:bg-[#3828b5]"
              >
                Start Assessment Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
