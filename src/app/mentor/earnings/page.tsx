"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { exportToCsv } from "@/lib/export";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Download,
  Search,
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  Building,
  CreditCard,
  Copy,
  Clock,
  Sparkles,
  Receipt,
  Percent,
  Calendar,
  AlertCircle,
  X,
  Check,
  TrendingUp,
} from "lucide-react";

interface PayoutTransaction {
  id: string;
  date: string;
  timeInfo: string;
  sessionsCount: number;
  sessionBreakdown: string;
  gross: number;
  tds: number;
  net: number;
  isEstimate?: boolean;
  reference: string;
  verifiedTime?: string;
  status: "Queued for Disbursal" | "Settled" | "Escrow Pending";
  isInFlight?: boolean;
}

export default function MentorEarningsPage() {
  const { user } = useAuth();
  // Live IST Clock
  const [istTime, setIstTime] = React.useState("23:45:10 IST");
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
        setIstTime(`${formatted} IST`);
      } catch {
        // fallback
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter tab state
  const [activeTab, setActiveTab] = React.useState<"all" | "settled" | "escrow" | "tds">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dateFilter, setDateFilter] = React.useState("90");

  // Copy state feedback
  const [copiedUTR, setCopiedUTR] = React.useState<string | null>(null);
  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedUTR(text);
    setTimeout(() => setCopiedUTR(null), 2000);
  };

  // Bank edit modal state
  const [bankModalOpen, setBankModalOpen] = React.useState(false);
  const [bankSuccess, setBankSuccess] = React.useState(false);
  const [accountNumber, setAccountNumber] = React.useState("••••••••••••4812");
  const [ifscCode, setIfscCode] = React.useState("HDFC0000240");
  const [upiId, setUpiId] = React.useState("mentor@okhdfcbank");

  const supabase = React.useMemo(() => createClient(), []);
  const [transactions, setTransactions] = React.useState<PayoutTransaction[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    async function loadSettlements() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("mentor_settlements")
          .select(`
            id,
            booking_id,
            gross_amount_paise,
            net_payout_paise,
            tds_deduction_paise,
            payout_status,
            disbursed_at,
            created_at,
            bookings(booking_ref, service_code)
          `)
          .eq("mentor_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0 && isMounted) {
          const mapped: PayoutTransaction[] = data.map((s: any) => {
            const dt = new Date(s.disbursed_at || s.created_at);
            const isInFlight = s.payout_status === "in_escrow";
            const isSettled = s.payout_status === "disbursed";
            const status: "Queued for Disbursal" | "Settled" | "Escrow Pending" = isSettled
              ? "Settled"
              : isInFlight
              ? "Escrow Pending"
              : "Queued for Disbursal";

            return {
              id: `PAY-${s.id.slice(0, 8).toUpperCase()}`,
              date: dt.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
              timeInfo: `${dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} IST`,
              sessionsCount: 1,
              sessionBreakdown: `${s.bookings?.service_code || "1:1"} (${s.bookings?.booking_ref || "Direct"})`,
              gross: Math.round(s.gross_amount_paise / 100),
              tds: Math.round(s.tds_deduction_paise / 100),
              net: Math.round(s.net_payout_paise / 100),
              isEstimate: isInFlight,
              reference: isSettled ? `NEFT-${s.id.slice(0, 8)}` : "Pending 48h SLA Review",
              status,
              isInFlight,
            };
          });
          setTransactions(mapped);
        } else if (isMounted) {
          setTransactions([]);
        }
      } catch (err) {
        console.warn("Failed to load settlements:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadSettlements();
    return () => {
      isMounted = false;
    };
  }, [user, supabase]);

  // Derived financial summary cards
  const financials = React.useMemo(() => {
    let cleared = 0;
    let inEscrow = 0;
    let lifetimeNet = 0;
    let lifetimeTds = 0;

    transactions.forEach((tx) => {
      if (tx.status === "Queued for Disbursal") {
        cleared += tx.net;
      } else if (tx.status === "Escrow Pending") {
        inEscrow += tx.net;
      } else if (tx.status === "Settled") {
        lifetimeNet += tx.net;
        lifetimeTds += tx.tds;
      }
    });

    return {
      cleared,
      inEscrow,
      lifetimeNet,
      lifetimeTds,
      escrowCount: transactions.filter((t) => t.status === "Escrow Pending").length,
    };
  }, [transactions]);

  const filteredTransactions = transactions.filter((t) => {
    if (activeTab === "settled" && t.status !== "Settled") return false;
    if (activeTab === "escrow" && !t.isInFlight) return false;
    if (activeTab === "tds" && t.tds <= 0) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        t.id.toLowerCase().includes(q) ||
        t.date.toLowerCase().includes(q) ||
        t.reference.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleBankFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBankSuccess(true);
    setTimeout(() => {
      setBankSuccess(false);
      setBankModalOpen(false);
    }, 1500);
  };

  return (
    <div className="flex-1 bg-[#fcf9f8] text-[#1c1b1b] min-h-screen">
      {/* 1. TOP STICKY BAR */}
      <header className="sticky top-0 z-30 w-full flex items-center justify-between h-16 bg-white border-b border-[#e7e7eb] px-6 lg:px-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#474554]">
          <Link href="/mentor" className="hover:text-[#1c1b1b] transition-colors">
            Mentor Portal
          </Link>
          <ChevronRight className="w-4 h-4 text-[#777585]" />
          <span className="hover:text-[#1c1b1b] transition-colors">
            Finance &amp; Accounting
          </span>
          <ChevronRight className="w-4 h-4 text-[#777585]" />
          <span className="text-[#5145cd] font-semibold">Earnings &amp; Payouts</span>
        </div>

        {/* Telemetry & Signals */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#f6f3f2] border border-[#e7e7eb] text-xs">
            <Clock className="w-3.5 h-3.5 text-[#777585]" />
            <span className="text-[#777585]">Asia/Kolkata (IST • UTC+05:30)</span>
            <span className="font-semibold text-[#1c1b1b] tabular-nums">{istTime}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eaf5ef] border border-[#d1edd9] text-[#16834a] text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-semibold">Razorpay Nodal Route Active</span>
          </div>

          <Link
            href="/mentor/dispatch"
            className="hidden sm:flex items-center gap-1.5 bg-[#f6f3f2] hover:bg-[#e7e7eb] text-[#1c1b1b] px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#e7e7eb] transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5145cd]" />
            <span>Accept Offers</span>
          </Link>

          <div className="flex items-center gap-2 pl-2 border-l border-[#e7e7eb]">
            <span className="w-2.5 h-2.5 bg-[#16834a] rounded-full" />
            <span className="text-xs font-semibold text-[#1c1b1b] hidden md:inline">
              Tier-2 Bar Raiser
            </span>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8 space-y-8">
        {/* 2.1 Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-2">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c1b1b] tracking-tight">
                Mentor Earnings Ledger &amp; Escrow Settlement
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e3dfff] text-[#130068] border border-[#c5c0ff]">
                <ShieldCheck className="w-3.5 h-3.5" />
                PRD §13.1 Tier-2 Compensation Model
              </span>
            </div>
            <p className="text-sm text-[#474554] leading-relaxed">
              Weekly automated settlements directly to your Indian bank account or UPI ID. Mentors receive 100% of listed session price; DreamX absorbs all student discounts per PRD §13.1.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => setBankModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#f6f3f2] text-[#1c1b1b] border border-[#e7e7eb] rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              <Building className="w-4 h-4 text-[#777585]" />
              <span>Manage Bank &amp; UPI Account</span>
            </button>
            <button
              onClick={() => alert("Downloading TRACES Form 16A Annual TDS Statement (PDF)...")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#5145cd] hover:bg-[#3828b5] text-white rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-xs active:scale-[0.99]"
            >
              <Download className="w-4 h-4" />
              <span>Download Annual Tax Statement (Form 16A / TDS PDF)</span>
            </button>
          </div>
        </div>

        {/* 2.2 Financial Health Bento Grid (4 Cards) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="bg-white border border-[#e7e7eb] rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-semibold text-[#777585] uppercase tracking-wider">
                CLEARED FOR NEXT SETTLEMENT
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#f6f3f2] flex items-center justify-center text-[#777585]">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-3xl font-extrabold text-[#1c1b1b] tabular-nums">
                ₹{financials.cleared.toLocaleString("en-IN")}
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eaf5ef] text-[#16834a] border border-[#d1edd9]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16834a]" />
                Auto-disburses Monday 10:00 AM IST
              </div>
            </div>
            <div className="pt-3 border-t border-[#e7e7eb] text-xs text-[#474554] flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#777585]" />
              <span>Settling to verified UPI/NEFT • Deliverables approved</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-[#e7e7eb] rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-semibold text-[#777585] uppercase tracking-wider">
                CURRENTLY HELD IN NODAL ESCROW
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#fbf4e8] text-[#a7670b] flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-3xl font-extrabold text-[#1c1b1b] tabular-nums">
                ₹{financials.inEscrow.toLocaleString("en-IN")}
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fbf4e8] text-[#a7670b] border border-[#f5e3c8]">
                <Clock className="w-3.5 h-3.5" />
                {financials.escrowCount} active booking{financials.escrowCount === 1 ? "" : "s"} in 48h deliverable window
              </div>
            </div>
            <div className="pt-3 border-t border-[#e7e7eb] text-xs text-[#474554] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#777585]" />
              <span>Auto-unlocks upon review sign-off or 48h SLA</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-[#e7e7eb] rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-semibold text-[#777585] uppercase tracking-wider">
                LIFETIME SETTLED REVENUE
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#eaf5ef] text-[#16834a] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-3xl font-extrabold text-[#1c1b1b] tabular-nums">
                ₹{financials.lifetimeNet.toLocaleString("en-IN")}
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eaf5ef] text-[#16834a] border border-[#d1edd9]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Disbursed to bank account
              </div>
            </div>
            <div className="pt-3 border-t border-[#e7e7eb] text-xs text-[#474554] flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#16834a]" />
              <span>Total TDS Withheld: ₹{financials.lifetimeTds.toLocaleString("en-IN")} (Sec 194J)</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-[#e7e7eb] rounded-xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-semibold text-[#777585] uppercase tracking-wider">
                COMMISSION TRANSPARENCY
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#e3dfff]/60 text-[#5145cd] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="text-3xl font-extrabold text-[#1c1b1b] tabular-nums">
                20.0% <span className="text-base text-[#777585] font-normal">Platform Cut</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e3dfff] text-[#130068] border border-[#c5c0ff]">
                <Sparkles className="w-3.5 h-3.5" />
                80% Net Rate Retained by Mentor
              </div>
            </div>
            <div className="pt-3 border-t border-[#e7e7eb] text-xs text-[#474554] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#777585]" />
              <span>Covers Razorpay gateway fees &amp; escrow audit infrastructure</span>
            </div>
          </div>
        </section>

        {/* 2.3 Filter Tabs, Search Bar & Weekly Payout Ledger Table */}
        <section className="bg-white border border-[#e7e7eb] rounded-xl shadow-xs overflow-hidden">
          {/* Controls Header */}
          <div className="p-5 border-b border-[#e7e7eb] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#fcf9f8]">
            <div className="flex items-center gap-2 overflow-x-auto">
              {[
                { id: "all", label: "All Transactions (71)" },
                { id: "settled", label: "Settled Disbursals (8)" },
                { id: "escrow", label: "Escrow Pending (3)" },
                { id: "tds", label: "TDS Withholding (10%)" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                    activeTab === tab.id
                      ? "bg-[#5145cd] text-white shadow-xs"
                      : "text-[#777585] hover:text-[#1c1b1b] hover:bg-[#f0eded]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-64 md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#777585]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search UTR, Payout Ref, or Date..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#e7e7eb] bg-white text-xs text-[#1c1b1b] placeholder:text-[#777585] focus:outline-none focus:border-[#5145cd]"
                />
              </div>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="py-1.5 px-3 rounded-lg border border-[#e7e7eb] bg-white text-[#1c1b1b] text-xs font-medium focus:border-[#5145cd] outline-none"
              >
                <option value="90">Last 90 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="365">Financial Year 2026-27</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  exportToCsv("dreamx-settlement-ledger", filteredTransactions, [
                    { key: "id", label: "Payout Ref ID" },
                    { key: "date", label: "Settlement Date" },
                    { key: "sessionsCount", label: "Sessions Count" },
                    { key: "sessionBreakdown", label: "Breakdown" },
                    { key: "gross", label: "Gross Payout (INR)" },
                    { key: "tds", label: "TDS Withheld (INR)" },
                    { key: "net", label: "Net Credited (INR)" },
                    { key: "reference", label: "Bank Reference" },
                    { key: "status", label: "Status" },
                  ]);
                }}
                className="p-2 rounded-lg border border-[#e7e7eb] bg-white text-[#777585] hover:text-[#1c1b1b] hover:bg-[#f6f3f2] transition-colors"
                title="Export Ledger as CSV"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f6f3f2]/60 border-b border-[#e7e7eb] text-[11px] font-semibold text-[#777585] uppercase tracking-wider">
                  <th className="py-3 px-5">Payout Ref ID</th>
                  <th className="py-3 px-5">Settlement Date</th>
                  <th className="py-3 px-5">Completed Sessions</th>
                  <th className="py-3 px-5 text-right">Gross Payout</th>
                  <th className="py-3 px-5 text-right">TDS Withheld (10%)</th>
                  <th className="py-3 px-5 text-right">Net Credited</th>
                  <th className="py-3 px-5">Bank UTR / NEFT Reference</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-center">Receipt &amp; Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e7eb] text-xs">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-xs text-[#777585]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Receipt className="w-8 h-8 text-gray-300" />
                        <span className="font-semibold text-gray-700">No settlement records found</span>
                        <span className="text-gray-500 max-w-sm">
                          Payouts and Section 194J TDS deductions will appear here once you complete scheduled sessions and submit diagnostic scorecards within the 48-hour SLA.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className={`transition-colors ${
                      tx.isInFlight
                        ? "bg-[#e3dfff]/20 hover:bg-[#e3dfff]/30"
                        : "hover:bg-[#f6f3f2]/50"
                    }`}
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        {tx.isInFlight ? (
                          <Clock className="w-4 h-4 text-[#5145cd]" />
                        ) : (
                          <Receipt className="w-4 h-4 text-[#777585]" />
                        )}
                        <span className="font-semibold text-[#5145cd] font-mono">
                          {tx.id}
                        </span>
                        {tx.isInFlight && (
                          <span className="text-[10px] bg-[#5145cd] text-white px-1.5 py-0.5 rounded font-medium">
                            In-Flight
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="font-medium text-[#1c1b1b]">{tx.date}</div>
                      <div
                        className={`text-[11px] font-medium ${
                          tx.isInFlight ? "text-[#5145cd]" : "text-[#777585]"
                        }`}
                      >
                        {tx.timeInfo}
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <div className="font-medium text-[#1c1b1b]">{tx.sessionsCount} Sessions</div>
                      <div className="text-[11px] text-[#777585]">{tx.sessionBreakdown}</div>
                    </td>

                    <td className="py-4 px-5 text-right font-medium text-[#1c1b1b] tabular-nums">
                      ₹{tx.gross.toLocaleString("en-IN")}
                    </td>

                    <td className="py-4 px-5 text-right text-[#a7670b] tabular-nums">
                      -₹{tx.tds.toLocaleString("en-IN")} {tx.isEstimate && <span className="text-[10px] text-[#777585]">(Est.)</span>}
                    </td>

                    <td className="py-4 px-5 text-right font-bold text-[#1c1b1b] tabular-nums">
                      ₹{tx.net.toLocaleString("en-IN")} {tx.isEstimate && <span className="text-[10px] text-[#777585] font-normal">(Est.)</span>}
                    </td>

                    <td className="py-4 px-5">
                      {tx.isInFlight ? (
                        <div className="flex items-center gap-1.5 text-[11px] text-[#777585] font-medium">
                          <span className="w-2 h-2 rounded-full bg-[#a7670b] animate-pulse" />
                          <span>{tx.reference}</span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-1.5 font-mono text-xs text-[#1c1b1b]">
                            <span>{tx.reference}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(tx.reference)}
                              className="text-[#777585] hover:text-[#1c1b1b] transition-colors"
                              title="Copy UTR"
                            >
                              {copiedUTR === tx.reference ? (
                                <Check className="w-3.5 h-3.5 text-[#16834a]" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          <div className="text-[11px] text-[#16834a] flex items-center gap-1 mt-0.5">
                            <Check className="w-3 h-3" />
                            <span>{tx.verifiedTime}</span>
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-5">
                      {tx.isInFlight ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e3dfff] text-[#130068] border border-[#c5c0ff]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5145cd] animate-ping" />
                          <span>Queued for Disbursal</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eaf5ef] text-[#16834a] border border-[#d1edd9]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16834a]" />
                          <span>Settled</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-5 text-center">
                      {tx.isInFlight ? (
                        <button
                          type="button"
                          onClick={() => alert(`Showing breakdown for upcoming batch: ₹18,450 across 21 verified deliverables`)}
                          className="inline-flex items-center gap-1 text-[#5145cd] hover:underline font-semibold text-xs"
                        >
                          <span>View Breakup</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const invoiceText = [
                              "DREAMX SETTLEMENT TAX INVOICE & DISBURSEMENT RECEIPT",
                              "===========================================================",
                              `Invoice Reference : ${tx.id}`,
                              `Settlement Date   : ${tx.date} (${tx.timeInfo})`,
                              `Service Module    : ${tx.sessionBreakdown}`,
                              `Gross Fee Accrued : INR ${tx.gross.toLocaleString("en-IN")}`,
                              `Section 194J TDS  : -INR ${tx.tds.toLocaleString("en-IN")} (10% Statutory)`,
                              `Net Credited      : INR ${tx.net.toLocaleString("en-IN")}`,
                              `Bank Reference    : ${tx.reference}`,
                              `Status            : ${tx.status}`,
                              "Nodal Partner     : Razorpay Software Ltd. / DreamX Escrow",
                              "===========================================================",
                              "Generated by DreamX Financial Ledger Engine (PRD §13 & §14)",
                            ].join("\r\n");

                            const blob = new Blob([invoiceText], { type: "text/plain;charset=utf-8" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `DreamX-Invoice-${tx.id}.txt`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[#474554] hover:text-[#5145cd] hover:bg-[#f0eded] transition-colors text-xs font-medium"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Invoice</span>
                        </button>
                      )}
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>

          {/* Ledger Pagination */}
          <div className="px-5 py-3 border-t border-[#e7e7eb] bg-[#f6f3f2]/40 flex items-center justify-between text-xs text-[#777585]">
            <div className="flex items-center gap-2">
              <span>
                Showing <strong className="text-[#1c1b1b]">1 - 4</strong> of 8 settled payout disbursements
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled
                className="p-1 rounded text-[#777585] disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 py-0.5 rounded bg-[#f0eded] text-[#1c1b1b] font-semibold">
                1
              </span>
              <span className="px-2 py-0.5 rounded text-[#777585] hover:bg-[#f0eded] cursor-pointer">
                2
              </span>
              <button className="p-1 rounded text-[#777585] hover:text-[#1c1b1b]">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* 2.4 Two-Column Architecture: Bank Verification & Indian Statutory Compliance */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: Bank & UPI Destination Card (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-[#e7e7eb] rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f6f3f2] border border-[#e7e7eb] flex items-center justify-center text-[#5145cd]">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1c1b1b]">
                      Disbursement Destination
                    </h3>
                    <p className="text-xs text-[#777585]">Direct Nodal Route Settlement</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eaf5ef] text-[#16834a] border border-[#d1edd9]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active Rail
                </span>
              </div>

              {/* Bank Details Box */}
              <div className="p-4 rounded-lg bg-[#f6f3f2]/60 border border-[#e7e7eb] space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#e7e7eb]">
                  <span className="text-[#777585] uppercase font-semibold text-[11px]">
                    Registered Entity
                  </span>
                  <span className="font-semibold text-[#1c1b1b]">{user?.name || "Verified Legal Entity"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#777585]">Bank Name</span>
                  <span className="font-medium text-[#1c1b1b]">HDFC Bank Limited</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#777585]">Account Number</span>
                  <div className="flex items-center gap-1.5 font-mono font-semibold text-[#1c1b1b]">
                    <span>{accountNumber}</span>
                    <span title="Penny-drop probe verified">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16834a]" />
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#777585]">Branch &amp; IFSC</span>
                  <span className="font-medium text-[#1c1b1b]">
                    Koramangala 4th Block • {ifscCode}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#e7e7eb]">
                  <div className="flex flex-col">
                    <span className="text-[#777585]">Secondary UPI ID</span>
                    <span className="text-[10px] text-[#16834a] font-medium">
                      Auto-failover enabled
                    </span>
                  </div>
                  <span className="font-mono font-medium text-[#1c1b1b]">{upiId}</span>
                </div>
              </div>

              {/* Protocol Status */}
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#eaf5ef]/60 border border-[#bfe4cc] text-xs text-[#00522b]">
                <ShieldCheck className="w-4 h-4 text-[#16834a] shrink-0" />
                <span className="leading-relaxed">
                  <strong>Razorpay Route V2 Nodal Payout Protocol Active:</strong> Automated penny-drop reverse verification probe cleared on Oct 14, 2026.
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#e7e7eb] flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setBankModalOpen(true)}
                className="inline-flex items-center gap-1.5 font-semibold text-[#5145cd] hover:underline"
              >
                <CreditCard className="w-4 h-4" />
                <span>Edit Payout Details</span>
              </button>
              <button
                type="button"
                onClick={() => alert("Triggering ₹1.00 reverse penny-drop verification probe to your bank account...")}
                className="px-3 py-1.5 rounded-lg border border-[#e7e7eb] hover:bg-[#f6f3f2] font-medium text-[#1c1b1b] transition-colors"
              >
                Verify via Micro-Deposit
              </button>
            </div>
          </div>

          {/* Column 2: Indian Statutory & Tax Compliance Note (Section 194J) (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-[#e7e7eb] rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#fbf4e8] border border-[#f5e3c8] flex items-center justify-center text-[#a7670b]">
                    <Percent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1c1b1b]">
                      Indian Tax Compliance &amp; TDS Withholding (Section 194J)
                    </h3>
                    <p className="text-xs text-[#777585]">
                      Mandatory Indian Statutory Governance (PRD §24 V-05, V-06)
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eaf5ef] text-[#16834a] border border-[#d1edd9]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  PAN Linked
                </span>
              </div>

              {/* Tax Content Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="p-3.5 rounded-lg bg-[#fcf9f8] border border-[#e7e7eb] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#1c1b1b] font-semibold text-xs">
                    <Percent className="w-4 h-4 text-[#5145cd]" />
                    <span>10% TDS Deduction</span>
                  </div>
                  <p className="text-xs text-[#474554] leading-relaxed">
                    Mentorship services constitute technical &amp; professional fees under Section 194J of the Income Tax Act, 1961. A statutory 10% TDS is deducted at credit and remitted directly to the Central Board of Direct Taxes (CBDT).
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#fcf9f8] border border-[#e7e7eb] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#1c1b1b] font-semibold text-xs">
                    <Calendar className="w-4 h-4 text-[#5145cd]" />
                    <span>Quarterly Form 16A Schedule</span>
                  </div>
                  <p className="text-xs text-[#474554] leading-relaxed">
                    Certificates are generated on TRACES: Q1 (Jul 15), Q2 (Oct 15), Q3 (Jan 15), Q4 (May 31). Mentors can claim full credit against annual ITR filings under their registered PAN.
                  </p>
                </div>
              </div>

              {/* GST & PAN Verification Details Strip */}
              <div className="p-3 rounded-lg bg-[#f6f3f2] border border-[#e7e7eb] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#777585]" />
                  <span className="text-[#777585]">Verified PAN:</span>
                  <span className="font-mono font-semibold text-[#1c1b1b]">ABCPS••••D</span>
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#eaf5ef] text-[#16834a]">
                    Aadhaar Linked
                  </span>
                </div>
                <div className="text-xs text-[#777585]">
                  GST Position: <span className="text-[#1c1b1b] font-medium">Exempt (&lt; ₹20L aggregate turnover)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#e7e7eb] flex items-center justify-between text-xs">
              <span className="text-[#777585]">Need assistance with your Tax Ledger or TRACES Form 16A?</span>
              <a
                href="#finance-help"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Opening ticket with DreamX Finance & Compliance Desk...");
                }}
                className="font-semibold text-[#5145cd] hover:underline flex items-center gap-1"
              >
                <span>Contact Finance Desk</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* 2.5 Statutory Regulatory Footer */}
        <footer className="pt-6 pb-8 border-t border-[#e7e7eb] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#777585]">
          <div className="flex items-center gap-3 max-w-2xl">
            <Building className="w-5 h-5 text-[#777585] shrink-0" />
            <p className="leading-relaxed">
              All DreamX mentor payouts are settled through RBI-authorized Nodal Escrow Accounts in full compliance with the Payment and Settlement Systems Act, 2007 and Indian Income Tax Act 1961. DreamX operates a zero-commission model on standard 1:1 service list prices.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <Link href="/terms" className="hover:text-[#1c1b1b] transition-colors">
              Mentor Compensation Policy (PRD §13)
            </Link>
            <span className="text-[#c8c4d6]">•</span>
            <Link href="/faq" className="hover:text-[#1c1b1b] transition-colors">
              TDS &amp; Tax FAQ
            </Link>
            <span className="text-[#c8c4d6]">•</span>
            <Link href="/refunds" className="hover:text-[#1c1b1b] transition-colors">
              Razorpay Nodal Custody Agreement
            </Link>
          </div>
        </footer>
      </main>

      {/* 3. MODAL FOR EDITING BANK & PAYOUT DETAILS */}
      {bankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#e7e7eb] space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#e7e7eb] pb-3">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-[#5145cd]" />
                <h3 className="font-bold text-base text-[#1c1b1b]">Edit Bank &amp; Payout Rails</h3>
              </div>
              <button
                onClick={() => setBankModalOpen(false)}
                className="text-[#777585] hover:text-[#1c1b1b]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bankSuccess ? (
              <div className="p-6 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#eaf5ef] text-[#16834a] flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#1c1b1b]">Bank Account Updated</h4>
                <p className="text-xs text-[#474554]">
                  Reverse penny-drop probe scheduled. Next payout cycle will disburse to this destination.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBankFormSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1c1b1b] block">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#e7e7eb] bg-white focus:outline-none focus:border-[#5145cd]"
                    placeholder="Enter Indian Bank Account Number"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1c1b1b] block">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#e7e7eb] bg-white focus:outline-none focus:border-[#5145cd] font-mono"
                    placeholder="e.g. HDFC0000240"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1c1b1b] block">
                    Secondary UPI ID (Auto-Failover Rail)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#e7e7eb] bg-white focus:outline-none focus:border-[#5145cd] font-mono"
                    placeholder="e.g. name@okhdfcbank"
                  />
                </div>

                <div className="p-3 rounded-lg bg-[#f6f3f2] text-[11px] text-[#474554]">
                  <strong>Penny-drop requirement:</strong> DreamX deposits ₹1.00 into this account to verify name match with registered PAN before disbursing settlements.
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBankModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-[#e7e7eb] text-xs font-medium text-[#474554] hover:bg-[#f6f3f2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#5145cd] text-white text-xs font-semibold hover:bg-[#3828b5] transition-all shadow-xs"
                  >
                    Save &amp; Initiate Verification
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
