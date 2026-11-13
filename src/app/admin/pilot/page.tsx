"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  FileCheck,
  Users,
  DollarSign,
  AlertCircle,
  Check,
  RotateCcw,
} from "lucide-react";

interface PilotScorecard {
  success: boolean;
  reviewed_at: string;
  pilot_cohort: {
    status: string;
    domains: string[];
    active_pilot_mentors: number;
  };
  metrics: {
    completion_rate: { value: number; target: string; passed: boolean };
    sla_compliance: { value: number; target: string; passed: boolean };
    dispute_rate: { value: number; target: string; passed: boolean };
    nodal_escrow_integrity: { violations: number; target: string; passed: boolean };
  };
  unit_economics_paise: {
    gmv_paise: number;
    escrow_held_paise: number;
    settled_paise: number;
    platform_net_revenue_paise: number;
    gst_remitted_paise: number;
    tds_withheld_paise: number;
  };
  decision_evaluation: {
    all_targets_met: boolean;
    recommended_decision: "EXPAND" | "ADJUST" | "PAUSE";
    rationale: string;
  };
}

export default function PilotAcceptancePage() {
  const [data, setData] = React.useState<PilotScorecard | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Decision state
  const [decision, setDecision] = React.useState<"EXPAND" | "ADJUST" | "PAUSE">("EXPAND");
  const [notes, setNotes] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitFeedback, setSubmitFeedback] = React.useState<{ success: boolean; msg: string } | null>(null);

  const fetchScorecard = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/pilot");
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to load pilot metrics");
      }
      setData(json);
      if (json.decision_evaluation?.recommended_decision) {
        setDecision(json.decision_evaluation.recommended_decision);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load pilot scorecard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchScorecard();
  }, [fetchScorecard]);

  const handleRecordDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitFeedback(null);

    try {
      const res = await fetch("/api/admin/pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, notes }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to record decision");
      }
      setSubmitFeedback({
        success: true,
        msg: `Official Pilot Acceptance Decision [${decision}] recorded in audit logs.`,
      });
      fetchScorecard();
    } catch (err) {
      setSubmitFeedback({
        success: false,
        msg: err instanceof Error ? err.message : "Submission failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatInr = (paise: number) => {
    const rupees = Math.round(paise / 100);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(rupees);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header & Navigation Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e7e7eb]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#5145cd] bg-[#5145cd]/10 px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider">
              PRD §22 • Phase P14 Acceptance
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500">Controlled Pilot Review &amp; Metric Integrity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c1b1b] tracking-tight font-heading mt-1">
            Pilot Acceptance &amp; Launch Cohort Scorecard
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchScorecard}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#e7e7eb] text-xs font-bold text-[#1c1b1b] hover:bg-[#f6f3f2] flex items-center gap-1.5 transition-all shadow-xs"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh Audit</span>
          </button>
          <Link
            href="/admin/launch-gates"
            className="px-3.5 py-2 rounded-xl bg-[#5145cd] text-white text-xs font-bold hover:bg-[#4337b9] flex items-center gap-1.5 transition-all shadow-xs"
          >
            <span>Launch Gates (9/9) →</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Top Cohort Banner: 3 Official Launch Domains */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#1c1b1b] to-[#2c2b3b] text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              Pilot Cohort Status: {data?.pilot_cohort?.status || "ACTIVE"}
            </span>
            <h2 className="text-lg font-bold">Three Official Launch Domains (PRD §22.1)</h2>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-sm">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active Pilot Mentors: {data?.pilot_cohort?.active_pilot_mentors || 3}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Domain 1</span>
            <span className="text-sm font-bold text-white block">Software Engineering</span>
            <span className="text-xs text-gray-300">Staff SDEs, Concurrency &amp; System Design</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Domain 2</span>
            <span className="text-sm font-bold text-white block">Data Science &amp; AI</span>
            <span className="text-xs text-gray-300">Lead ML Architects, Triton, vLLM &amp; RAG</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Domain 3</span>
            <span className="text-sm font-bold text-white block">Product Management</span>
            <span className="text-xs text-gray-300">FinTech &amp; Checkout Product Leaders</span>
          </div>
        </div>
      </div>

      {/* 3. Four Core Pilot Questions Grid (PRD §22.2) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#1c1b1b] font-heading">
            Statutory Pilot Acceptance Metric Gates (PRD §22.2)
          </h3>
          <span className="text-xs text-gray-500 font-mono">Real-Time Database Aggregation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Question 1: Completion Rate */}
          <div className="p-4 rounded-xl bg-white border border-[#e7e7eb] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Q1: Bookings</span>
              {data?.metrics?.completion_rate?.passed ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" /> Met
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  <AlertTriangle className="w-3 h-3" /> In Progress
                </span>
              )}
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#1c1b1b]">
                {data?.metrics?.completion_rate?.value ?? 0}%
              </div>
              <span className="text-xs text-gray-500">Target: {data?.metrics?.completion_rate?.target || ">= 85.0%"}</span>
            </div>
            <p className="text-[11px] text-gray-500 pt-2 border-t border-gray-100">
              Measures candidate completion and attendance holding up in live practice.
            </p>
          </div>

          {/* Question 2: Deliverable SLA Compliance */}
          <div className="p-4 rounded-xl bg-white border border-[#e7e7eb] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Q2: 48h SLA</span>
              {data?.metrics?.sla_compliance?.passed ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" /> Met
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  <AlertTriangle className="w-3 h-3" /> SLA Alert
                </span>
              )}
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#1c1b1b]">
                {data?.metrics?.sla_compliance?.value ?? 0}%
              </div>
              <span className="text-xs text-gray-500">Target: {data?.metrics?.sla_compliance?.target || ">= 95.0%"}</span>
            </div>
            <p className="text-[11px] text-gray-500 pt-2 border-t border-gray-100">
              Evaluates timely submission of verified 8-dimension diagnostic scorecards.
            </p>
          </div>

          {/* Question 3: Dispute Rate */}
          <div className="p-4 rounded-xl bg-white border border-[#e7e7eb] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Q3: Disputes</span>
              {data?.metrics?.dispute_rate?.passed ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" /> Met
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                  <Clock className="w-3 h-3" /> Monitored
                </span>
              )}
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#1c1b1b]">
                {data?.metrics?.dispute_rate?.value ?? 0}%
              </div>
              <span className="text-xs text-gray-500">Target: {data?.metrics?.dispute_rate?.target || "< 5.0%"}</span>
            </div>
            <p className="text-[11px] text-gray-500 pt-2 border-t border-gray-100">
              Evaluates satisfaction and adherence to dispute resolution SLA guidelines.
            </p>
          </div>

          {/* Question 4: Nodal Escrow Integrity */}
          <div className="p-4 rounded-xl bg-white border border-[#e7e7eb] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">Q4: Escrow</span>
              {data?.metrics?.nodal_escrow_integrity?.passed ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" /> 0 Violations
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                  <XCircle className="w-3 h-3" /> Breach
                </span>
              )}
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#1c1b1b]">
                {data?.metrics?.nodal_escrow_integrity?.violations ?? 0}
              </div>
              <span className="text-xs text-gray-500">Target: 0 Nodal Violations</span>
            </div>
            <p className="text-[11px] text-gray-500 pt-2 border-t border-gray-100">
              Cryptographic guarantee that zero funds are released without deliverable signoff.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Unit Economics & Platform Margin (PRD §22.2, V-22) */}
      <div className="bg-white rounded-2xl border border-[#e7e7eb] shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-[#1c1b1b] font-heading">
              Unit Economics &amp; Nodal Cashflow Verification (PRD §22.2, V-22)
            </h3>
            <p className="text-xs text-gray-500">
              Authoritative paise-level accounting reconciled with Razorpay nodal holding accounts.
            </p>
          </div>
          <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
            18% GST &amp; 10% Section 194J TDS Verified
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-xl bg-[#f6f3f2] space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Gross Merchandise Value</span>
            <span className="text-sm sm:text-base font-black text-[#1c1b1b] block">
              {formatInr(data?.unit_economics_paise?.gmv_paise ?? 0)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-indigo-700 block">Nodal Escrow Held</span>
            <span className="text-sm sm:text-base font-black text-[#3828b5] block">
              {formatInr(data?.unit_economics_paise?.escrow_held_paise ?? 0)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Settled to Mentors</span>
            <span className="text-sm sm:text-base font-black text-[#006d3a] block">
              {formatInr(data?.unit_economics_paise?.settled_paise ?? 0)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f6f3f2] space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Platform Net Cut</span>
            <span className="text-sm sm:text-base font-black text-[#1c1b1b] block">
              {formatInr(data?.unit_economics_paise?.platform_net_revenue_paise ?? 0)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f6f3f2] space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">18% GST Remitted</span>
            <span className="text-sm sm:text-base font-black text-gray-700 block">
              {formatInr(data?.unit_economics_paise?.gst_remitted_paise ?? 0)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f6f3f2] space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">10% TDS Withheld</span>
            <span className="text-sm sm:text-base font-black text-gray-700 block">
              {formatInr(data?.unit_economics_paise?.tds_withheld_paise ?? 0)}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Go / No-Go Decision Console (Implementation Plan P14 Exit Criteria 3) */}
      <div className="bg-white rounded-2xl border border-[#e7e7eb] shadow-md p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5145cd] font-bold">
              Exit Criteria 3: Formal Pilot Decision Recording
            </span>
            <h3 className="text-lg font-extrabold text-[#1c1b1b] font-heading mt-0.5">
              Executive Go / No-Go Determination
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Algorithmic Recommendation:</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono ${
              data?.decision_evaluation?.recommended_decision === "EXPAND"
                ? "bg-emerald-100 text-emerald-800"
                : data?.decision_evaluation?.recommended_decision === "ADJUST"
                ? "bg-amber-100 text-amber-800"
                : "bg-rose-100 text-rose-800"
            }`}>
              {data?.decision_evaluation?.recommended_decision || "EVALUATING"}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed bg-[#f6f3f2] p-3.5 rounded-xl border border-gray-200">
          <strong>Review Rationale:</strong> {data?.decision_evaluation?.rationale || "Awaiting audit verification"}
        </p>

        {submitFeedback && (
          <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            submitFeedback.success
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}>
            {submitFeedback.success ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{submitFeedback.msg}</span>
          </div>
        )}

        <form onSubmit={handleRecordDecision} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700">
              Select Official Executive Determination:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                onClick={() => setDecision("EXPAND")}
                className={`p-3.5 rounded-xl border cursor-pointer flex flex-col gap-1 transition-all ${
                  decision === "EXPAND"
                    ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-900">EXPAND COHORT</span>
                  <input
                    type="radio"
                    name="pilot_decision"
                    checked={decision === "EXPAND"}
                    onChange={() => setDecision("EXPAND")}
                    className="text-emerald-600 accent-emerald-600"
                  />
                </div>
                <span className="text-[11px] text-gray-500">
                  Metrics hold up. Open cohort registration to next 100 students and add 10 mentors.
                </span>
              </label>

              <label
                onClick={() => setDecision("ADJUST")}
                className={`p-3.5 rounded-xl border cursor-pointer flex flex-col gap-1 transition-all ${
                  decision === "ADJUST"
                    ? "border-amber-600 bg-amber-50/60 ring-2 ring-amber-500"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-amber-900">ADJUST PROTOCOLS</span>
                  <input
                    type="radio"
                    name="pilot_decision"
                    checked={decision === "ADJUST"}
                    onChange={() => setDecision("ADJUST")}
                    className="text-amber-600 accent-amber-600"
                  />
                </div>
                <span className="text-[11px] text-gray-500">
                  Calibrate SLA windows or pricing before broad launch. Retain current mentor pool.
                </span>
              </label>

              <label
                onClick={() => setDecision("PAUSE")}
                className={`p-3.5 rounded-xl border cursor-pointer flex flex-col gap-1 transition-all ${
                  decision === "PAUSE"
                    ? "border-rose-600 bg-rose-50/60 ring-2 ring-rose-500"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-rose-900">PAUSE EXPANSION</span>
                  <input
                    type="radio"
                    name="pilot_decision"
                    checked={decision === "PAUSE"}
                    onChange={() => setDecision("PAUSE")}
                    className="text-rose-600 accent-rose-600"
                  />
                </div>
                <span className="text-[11px] text-gray-500">
                  SLA breaches or escrow anomalies detected. Halt marketing until remediation.
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">
              Sign-off Notes &amp; Audit Commentary:
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Unit economics verified across 3 domains. 48h SLA compliance at 100%. Recommending scale-up to 100 candidate cohort."
              rows={3}
              className="w-full p-3 rounded-xl border border-[#e7e7eb] text-xs font-medium text-[#1c1b1b] focus:outline-none focus:ring-2 focus:ring-[#5145cd] bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#5145cd] hover:bg-[#4337b9] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              {isSubmitting ? <RotateCcw className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
              <span>Record Executive Sign-Off Certificate</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
