"use client";

import * as React from "react";
import {
  Check,
  CreditCard,
  Receipt,
  Info,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { StudentModal } from "../ui/StudentModal";
import { StudentStatusBadge } from "../ui/StudentStatusBadge";
import {
  MembershipData,
  MEMBERSHIP_TIERS,
  formatPaise,
} from "../types";

export interface StudentMembershipViewProps {
  membership: MembershipData;
  onChangeMembership: (tier: "Free" | "Pro" | "Elite", interval: "monthly" | "annual") => void;
  onToggleCancelRenewal: () => void;
}

export function StudentMembershipView({
  membership,
  onChangeMembership,
  onToggleCancelRenewal,
}: StudentMembershipViewProps) {
  const [billingInterval, setBillingInterval] = React.useState<"monthly" | "annual">(
    membership.billingInterval
  );
  const [confirmPlan, setConfirmPlan] = React.useState<{
    tier: "Free" | "Pro" | "Elite";
    interval: "monthly" | "annual";
  } | null>(null);

  const selectedTierConfig = confirmPlan
    ? MEMBERSHIP_TIERS.find((t) => t.tier === confirmPlan.tier)
    : null;
  const payableToday = selectedTierConfig && confirmPlan
    ? confirmPlan.interval === "annual"
      ? selectedTierConfig.annualUpfrontPaise
      : selectedTierConfig.monthlyPaise
    : 0;

  return (
    <div className="space-y-6">
      {/* Current Plan Overview */}
      <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StudentStatusBadge
                label={`Current Plan: ${membership.tier}`}
                tone={membership.tier === "Free" ? "neutral" : "primary"}
              />
              <StudentStatusBadge
                label={membership.status}
                tone={membership.status === "Active" ? "success" : "warning"}
              />
            </div>
            <h1 className="mt-2 text-xl sm:text-2xl font-bold text-zinc-900">
              Membership & Billing
            </h1>
            <p className="mt-1 text-sm text-zinc-600 max-w-3xl">
              Your active <strong>{membership.discountPercent}% service discount</strong> applies
              automatically at checkout on eligible 1:1 career bookings. Membership and custom
              bundle discounts never stack—DreamX always applies the single better rate.
            </p>
          </div>

          {membership.tier !== "Free" && (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 text-xs space-y-1.5 shrink-0">
              <p className="text-zinc-600">
                Cycle: <strong className="text-zinc-900 capitalize">{membership.billingInterval}</strong>{" "}
                · Started {membership.startedDate}
              </p>
              <p className="text-zinc-600">
                {membership.status === "Active" ? "Next renewal:" : "Benefits active until:"}{" "}
                <strong className="font-mono text-zinc-900">{membership.renewalDate}</strong>
              </p>
              <button
                type="button"
                onClick={onToggleCancelRenewal}
                className="text-xs font-semibold text-[#5145cd] hover:underline"
              >
                {membership.status === "Active"
                  ? "Schedule Renewal Cancellation"
                  : "Resume Scheduled Renewal"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tier Comparison Cards */}
      <section className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-zinc-900">
              Compare Approved Membership Tiers (INR)
            </h2>
            <p className="text-xs text-zinc-500">
              Transparent upfront pricing. Only confirmed MVP benefits are displayed (PRD 7.2).
            </p>
          </div>
          <div className="inline-flex items-center rounded-xl border border-zinc-200 bg-zinc-100 p-1">
            <button
              type="button"
              onClick={() => setBillingInterval("monthly")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                billingInterval === "monthly"
                  ? "bg-white text-zinc-900 shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingInterval("annual")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                billingInterval === "annual"
                  ? "bg-white text-zinc-900 shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Annual Upfront (Save up to 25%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {MEMBERSHIP_TIERS.map((tier) => {
            const isCurrent =
              membership.tier === tier.tier &&
              (tier.tier === "Free" || membership.billingInterval === billingInterval);
            const price =
              billingInterval === "annual" ? tier.annualUpfrontPaise : tier.monthlyPaise;

            return (
              <article
                key={tier.tier}
                className={`rounded-2xl border p-5 flex flex-col justify-between space-y-5 ${
                  tier.tier === "Pro"
                    ? "border-[#5145cd] bg-indigo-50/35 ring-1 ring-[#5145cd]/20"
                    : "border-zinc-200 bg-white"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-zinc-900">{tier.tier}</h3>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      {tier.discountPercent}% Service Discount
                    </span>
                  </div>
                  <div className="font-mono tabular-nums">
                    <span className="text-2xl sm:text-3xl font-bold text-zinc-900">
                      {formatPaise(price)}
                    </span>
                    <span className="text-xs text-zinc-500 ml-1">
                      {tier.tier === "Free"
                        ? "forever"
                        : billingInterval === "annual"
                        ? "/ year paid upfront"
                        : "/ month"}
                    </span>
                    {tier.tier !== "Free" && billingInterval === "annual" && (
                      <p className="text-xs text-[#4035b3] font-semibold mt-0.5">
                        Effective {formatPaise(tier.effectiveAnnualMonthlyPaise)} / month
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600">{tier.tagline}</p>
                  <ul className="space-y-2 pt-2 border-t border-zinc-200/75 text-xs text-zinc-700">
                    {tier.confirmedBenefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  disabled={isCurrent}
                  onClick={() =>
                    setConfirmPlan({
                      tier: tier.tier,
                      interval: billingInterval,
                    })
                  }
                  className={`w-full rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors ${
                    isCurrent
                      ? "bg-zinc-100 text-zinc-500 cursor-default"
                      : "bg-[#5145cd] text-white hover:bg-[#4035b3]"
                  }`}
                >
                  {isCurrent ? "Current Active Plan" : `Select ${tier.tier} (${billingInterval})`}
                </button>
              </article>
            );
          })}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs text-zinc-600 flex items-start gap-2.5">
          <Info className="h-4 w-4 text-[#5145cd] shrink-0 mt-0.5" />
          <p>
            <strong>Billing & Cancellation Clarity (PRD 7.2):</strong> Cancelling a membership stops
            future scheduled renewals at the end of your current paid period and is not an
            automatic retroactive refund. Upgrade/downgrade proration remains subject to provider
            validation.
          </p>
        </div>
      </section>

      {/* Verified Billing Invoices History */}
      <section className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 shadow-xs space-y-3">
        <h2 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
          <Receipt className="h-4 w-4 text-[#5145cd]" />
          Verified Billing History
        </h2>
        <div className="divide-y divide-zinc-100 text-xs">
          {membership.invoices.map((inv) => (
            <div key={inv.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-zinc-900">{inv.description}</p>
                <p className="font-mono text-[11px] text-zinc-500">
                  {inv.id} · {inv.date}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-zinc-900 tabular-nums">
                  {formatPaise(inv.amountPaise)}
                </span>
                <StudentStatusBadge label={inv.status} tone="success" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Plan Change Confirmation Modal */}
      <StudentModal
        open={!!confirmPlan}
        onClose={() => setConfirmPlan(null)}
        title={confirmPlan ? `Confirm ${confirmPlan.tier} Plan (${confirmPlan.interval})` : "Confirm Plan"}
        subtitle="Review total amount due today, billing interval, and cancellation effect before confirming."
        footer={
          confirmPlan && (
            <>
              <button
                type="button"
                onClick={() => setConfirmPlan(null)}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onChangeMembership(confirmPlan.tier, confirmPlan.interval);
                  setConfirmPlan(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#5145cd] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4035b3]"
              >
                <Lock className="h-3.5 w-3.5" />
                Confirm Plan ({formatPaise(payableToday)} Due Today)
              </button>
            </>
          )
        }
      >
        {confirmPlan && selectedTierConfig && (
          <div className="space-y-3.5 text-xs sm:text-sm">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Selected Tier</span>
                <strong className="text-zinc-900">
                  DreamX {selectedTierConfig.tier} ({selectedTierConfig.discountPercent}% Service
                  Discount)
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Billing Frequency</span>
                <strong className="text-zinc-900 capitalize">
                  {confirmPlan.interval === "annual" ? "Annual Upfront" : "Monthly"}
                </strong>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-200 text-sm font-bold text-zinc-900">
                <span>Total Amount Due Today</span>
                <span className="font-mono text-[#4035b3] tabular-nums">
                  {formatPaise(payableToday)}
                </span>
              </div>
            </div>
            <p className="text-xs text-zinc-600 flex items-start gap-2">
              <CreditCard className="h-4 w-4 text-[#5145cd] shrink-0 mt-0.5" />
              <span>
                Benefits take effect once the server verifies subscription payment state. Applicable
                GST/taxes and provider subscription terms apply per India launch gate V-01/V-05.
              </span>
            </p>
            <p className="text-[11px] text-zinc-500 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              Simulated dev subscription state update.
            </p>
          </div>
        )}
      </StudentModal>
    </div>
  );
}
