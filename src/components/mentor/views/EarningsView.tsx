"use client";

import * as React from "react";
import {
  DollarSign,
  Download,
  ShieldCheck,
  Info,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
} from "lucide-react";
import { FinancialLedgerRecord, formatINR, getServiceById } from "../types";
import { StatusBadge } from "../StatusBadge";

interface EarningsViewProps {
  ledger: FinancialLedgerRecord[];
  onExportStatementToast: () => void;
}

export function EarningsView({ ledger, onExportStatementToast }: EarningsViewProps) {
  const [filter, setFilter] = React.useState<"all" | "verified" | "adjusted">("all");

  const filteredRecords = ledger.filter((record) => {
    if (filter === "verified" && record.verificationStatus !== "Provider Webhook Verified") {
      return false;
    }
    if (filter === "adjusted" && record.adjustmentPaise === 0) return false;
    return true;
  });

  const totalGrossBasisPaise = ledger.reduce((acc, r) => acc + r.grossListedPricePaise, 0);
  const totalAdjustmentsPaise = ledger.reduce((acc, r) => acc + r.adjustmentPaise, 0);
  const totalMentorBasisPaise = ledger.reduce((acc, r) => acc + r.mentorCalculationBasisPaise + r.adjustmentPaise, 0);
  const completedSessionsCount = ledger.filter((r) => r.verificationStatus === "Provider Webhook Verified").length;

  const handleExportCSV = () => {
    const headers = [
      "LedgerID",
      "BookingRef",
      "Service",
      "CompletedDate",
      "GrossListedINR",
      "StudentDiscountFundedByDreamX",
      "MentorGrossBasisINR",
      "AdjustmentsINR",
      "VerificationStatus",
      "SettlementStatus",
    ];

    const rows = ledger.map((r) => [
      r.id,
      r.bookingRef,
      `"${getServiceById(r.serviceId).name}"`,
      r.completedDate,
      (r.grossListedPricePaise / 100).toFixed(2),
      `"${r.studentAppliedDiscountLabel}"`,
      (r.mentorCalculationBasisPaise / 100).toFixed(2),
      (r.adjustmentPaise / 100).toFixed(2),
      r.verificationStatus,
      `"${r.settlementStatus}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `DreamX_Mentor_Verified_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onExportStatementToast();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#5145cd] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                PRD §7.3 &amp; §18.2
              </span>
              <span className="text-xs text-zinc-500 font-semibold font-mono">
                Statutory RBI Nodal Escrow Compliance
              </span>
            </div>
            <h1 className="mt-1 text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              Mentor Earnings &amp; Settlement Ledger
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
              Transparent, immutable settlement accounting. Mentors receive the full listed service basis; all promotional coupons and bundle discounts are 100% funded by DreamX.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Verified CSV</span>
          </button>
        </div>

        {/* PRD Non-Dilution Policy Banner */}
        <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/60 p-3.5 flex items-start gap-3 text-xs text-indigo-950">
          <ShieldCheck className="w-4 h-4 text-[#5145cd] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-zinc-900">Discount Non-Dilution Rule (PRD §7.3):</span>
            <p className="text-zinc-600 leading-relaxed">
              When a student applies Pro (5%), Elite (10%), or 3-Service Bundle (5%) discounts, DreamX absorbs the difference entirely. Your calculation basis remains anchored to the gross listed price.
            </p>
          </div>
        </div>
      </div>

      {/* 2. KPI Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
            Completed Sessions
          </span>
          <div className="text-2xl font-black text-zinc-900 tracking-tight">
            {completedSessionsCount}
          </div>
          <p className="text-[11px] text-zinc-500">Delivered within 48h SLA</p>
        </div>

        <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
            Gross Listed Basis
          </span>
          <div className="text-2xl font-black text-zinc-900 tracking-tight">
            {formatINR(totalGrossBasisPaise)}
          </div>
          <p className="text-[11px] text-zinc-500">Unreduced by discounts</p>
        </div>

        <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
            Dispute / Refund Adjustments
          </span>
          <div className="text-2xl font-black text-rose-700 tracking-tight">
            {formatINR(totalAdjustmentsPaise)}
          </div>
          <p className="text-[11px] text-zinc-500">Substantiated claims</p>
        </div>

        <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
            Net Verified Gross
          </span>
          <div className="text-2xl font-black text-emerald-700 tracking-tight">
            {formatINR(totalMentorBasisPaise)}
          </div>
          <p className="text-[11px] text-zinc-500">Pre-commission nodal escrow</p>
        </div>
      </div>

      {/* 3. Detailed Ledger Table */}
      <section className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
          <div>
            <h2 className="text-base font-bold text-zinc-900">Per-Session Settlement Entries</h2>
            <p className="text-xs text-zinc-500">Immutable ledger events verified against payment webhooks</p>
          </div>

          <div className="flex items-center gap-1.5">
            {[
              { id: "all", label: "All Records" },
              { id: "verified", label: "Webhook Verified" },
              { id: "adjusted", label: "Adjusted" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id as typeof filter)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filter === tab.id
                    ? "bg-[#5145cd] text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-400 font-mono uppercase text-[10px]">
                <th className="py-2.5 px-3">Booking / Date</th>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3 text-right">Listed Price</th>
                <th className="py-2.5 px-3">Student Discount (DreamX-Funded)</th>
                <th className="py-2.5 px-3 text-right">Mentor Basis</th>
                <th className="py-2.5 px-3 text-right">Adjustment</th>
                <th className="py-2.5 px-3 text-right">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredRecords.map((r) => {
                const service = getServiceById(r.serviceId);

                return (
                  <tr key={r.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-indigo-700 block">{r.bookingRef}</span>
                      <span className="text-[11px] text-zinc-400">{r.completedDate}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-zinc-900 block">{service.name}</span>
                      <span className="text-[11px] text-zinc-500">{r.studentName}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-zinc-800">
                      {formatINR(r.grossListedPricePaise)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[11px] font-medium inline-block">
                        {r.studentAppliedDiscountLabel}
                      </span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">
                        Student paid: {formatINR(r.studentPaidPaise)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#5145cd]">
                      {formatINR(r.mentorCalculationBasisPaise)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-xs">
                      {r.adjustmentPaise !== 0 ? (
                        <span className="text-rose-600 font-semibold">{formatINR(r.adjustmentPaise)}</span>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-semibold text-zinc-800 text-[11px] block">
                        {r.settlementStatus}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-mono">
                        {r.verificationStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
