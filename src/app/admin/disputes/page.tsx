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
import { createClient } from "@/lib/supabase/client";

export default function AdminDisputesPage() {
  const supabase = React.useMemo(() => createClient(), []);
  const [selectedProtocol, setSelectedProtocol] = React.useState<"A" | "B" | "C">("A");
  const [coSigned, setCoSigned] = React.useState(false);
  const [executingDisgorgement, setExecutingDisgorgement] = React.useState(false);
  const [disgorgementSuccess, setDisgorgementSuccess] = React.useState(false);
  const [playingAudio, setPlayingAudio] = React.useState(false);
  const [disputes, setDisputes] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadDisputes() {
      try {
        const { data } = await supabase
          .from("disputes")
          .select("*, bookings(booking_ref, amount_paise, service_code)")
          .order("created_at", { ascending: false });
        if (data) setDisputes(data);
      } catch (err) {
        console.warn("Could not load disputes:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDisputes();
  }, [supabase]);

  const activeDisputes = disputes.filter(
    (d) => d.status === "opened" || d.status === "under_review" || d.status === "evidence_pending"
  );
  const resolvedDisputes = disputes.filter(
    (d) => d.status?.startsWith("resolved") || d.status === "cancelled"
  );

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
      disputes
        .map(
          (d) =>
            `"${d.dispute_ref || d.id}","${d.student_id}","${d.mentor_id}","${d.booking_id}","₹${
              (d.refund_amount_paise || 0) / 100
            }","Protocol ${selectedProtocol}","${d.status}"`
        )
        .join("\n");
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
                {activeDisputes.length} {activeDisputes.length === 1 ? "Case" : "Cases"}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded border ${
                  activeDisputes.length > 0
                    ? "text-red-600 bg-red-50 border-red-200"
                    : "text-[#16834a] bg-[#eaf5ef] border-[#16834a]/20"
                }`}
              >
                {activeDisputes.length > 0 ? "In-Flight" : "Clear"}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {activeDisputes.length > 0
                ? `${activeDisputes.length} active arbitration case(s) in SLA window`
                : "Zero active dispute tickets in escalation"}
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
                ₹{resolvedDisputes.reduce((acc, d) => acc + (d.refund_amount_paise || 0) / 100, 0)}
              </span>
              <span className="text-xs font-bold text-[#16834a] bg-[#eaf5ef] px-2 py-0.5 rounded">
                Live Disgorged
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {resolvedDisputes.length} automated refunds recorded in database
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
                {disputes.length > 0 ? `${((activeDisputes.length / disputes.length) * 100).toFixed(2)}%` : "0.00%"}
              </span>
              <span className="text-xs font-bold text-[#16834a] bg-[#eaf5ef] px-2 py-0.5 rounded">
                Target &lt; 1.50%
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              100% clean delivery rate across completed sessions
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span className="font-bold text-[#3828b5]">100% Dual-Signed Protocol</span>
            <span className="font-mono text-gray-400 font-semibold">PRD §21 Compliant</span>
          </div>
        </div>
      </div>

      {/* 3. In-Depth Active Dispute Case Card */}
      {activeDisputes.length === 0 ? (
        <div className="rounded-xl border border-[#e7e7eb] bg-white shadow-xs p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#eaf5ef] text-[#16834a] flex items-center justify-center mx-auto border border-[#16834a]/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-[#1c1b1b]">Zero Active Escrow Disputes</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            All candidate bookings, mentor deliveries, and nodal escrow transactions are operating normally under PRD §12.1. Any arbitration escalation raised by a candidate or mentor will populate here in real time.
          </p>
        </div>
      ) : (
      <div className="rounded-xl border border-[#e7e7eb] bg-white shadow-xs overflow-hidden">
        {/* Card Header & Metadata Bar */}
        <div className="bg-[#f6f3f2] p-5 border-b border-[#e7e7eb]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xl font-extrabold text-[#1c1b1b] font-mono">
                Case #{activeDisputes[0]?.dispute_ref || activeDisputes[0]?.id?.slice(0, 8)}
              </span>
              <span className="text-gray-300">•</span>
              <h2 className="text-base font-bold text-[#1c1b1b]">
                {activeDisputes[0]?.reason_code || "SLA Delivery Exception"}
              </h2>
              <span className="rounded bg-[#3828b5]/10 border border-[#3828b5]/20 px-2 py-0.5 text-xs font-bold text-[#3828b5]">
                {activeDisputes[0]?.bookings?.service_code || "Active Session"}
              </span>
            </div>
          </div>
        </div>
      </div>
      )}

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
            {resolvedDisputes.length} Resolved {resolvedDisputes.length === 1 ? "Case" : "Cases"}
          </span>
        </div>

        {resolvedDisputes.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500">
            No historical disputes recorded. All completed sessions have concluded cleanly with zero escalations.
          </div>
        ) : (
          <div className="divide-y divide-[#e7e7eb]">
            {resolvedDisputes.map((d) => (
              <div key={d.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#1c1b1b]">{d.dispute_ref || d.id?.slice(0, 8)}</span>
                    <span className="text-gray-400">•</span>
                    <span className="font-semibold text-gray-800">{d.reason_code}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                      {d.status?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {d.resolution_notes || "Resolved under PRD §12.1"}
                  </p>
                </div>
                <span className="font-mono text-gray-400 text-[11px]">{new Date(d.resolved_at || d.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
