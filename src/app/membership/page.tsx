"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Check,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

export default function MembershipPage() {
  const { membership, upgradeMembership, cancelMembership } = useAuth();
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "annual">("annual");
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const handleUpgrade = (tier: "pro" | "elite") => {
    upgradeMembership(tier, billingCycle === "annual");
    setSuccessMessage(`Membership successfully activated: DreamX ${tier.toUpperCase()} (${billingCycle})!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleDowngrade = () => {
    cancelMembership();
    setSuccessMessage("Plan changed to Free Tier. Zero membership fees applied.");
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const plans = [
    {
      id: "free" as const,
      name: "Free Member",
      tier: "Starter",
      badge: "Standard Access",
      monthlyPrice: 0,
      annualPrice: 0,
      effectiveMonthly: 0,
      discount: "0% off (Standard Price)",
      description: "Pay-as-you-go access to individual 1:1 sessions and async diagnostics.",
      features: [
        "Full access to 10 standardized services (S01–S10)",
        "Direct mentor booking with calendar sync",
        "Standard 48-hour deliverable turnaround SLA",
        "Official 8-dimension PDF scorecard per session",
        "Standard Smart Match dispatch waves",
      ],
      isCurrent: membership.tier === "free",
      highlight: false,
    },
    {
      id: "pro" as const,
      name: "DreamX Pro",
      tier: "Pro",
      badge: "Most Popular",
      monthlyPrice: 199,
      annualPrice: 1788,
      effectiveMonthly: 149,
      discount: "5% off all bookings",
      description: "For active job seekers targeting tier-1 tech transitions within 3–6 months.",
      features: [
        "5% automatic discount on all marketplace bookings",
        "Priority Smart Match wave 1 dispatch (15-min SLA)",
        "Free monthly Career Readiness Diagnostic benchmark",
        "Dedicated grievance redressal channel (12h SLA)",
        "Early access to newly onboarded Big Tech mentors",
      ],
      isCurrent: membership.tier === "pro",
      highlight: membership.tier === "pro",
    },
    {
      id: "elite" as const,
      name: "DreamX Elite",
      tier: "Elite",
      badge: "Maximum Savings",
      monthlyPrice: 399,
      annualPrice: 4188,
      effectiveMonthly: 349,
      discount: "10% off all bookings",
      description: "For ambitious engineers and leaders seeking comprehensive career acceleration.",
      features: [
        "10% automatic discount on all marketplace bookings",
        "Instant Wave 1 VIP Smart Match dispatch (5-min SLA)",
        "Unlimited quarterly readiness progression tracking",
        "Quarterly resume re-audit session",
        "Dedicated career success manager assistance",
      ],
      isCurrent: membership.tier === "elite",
      highlight: membership.tier === "elite",
    },
  ];

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Top Breadcrumb Context */}
      <section className="bg-white border-b border-[#e7e7eb] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#66666f]">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#5145cd]">Home</Link>
            <span>/</span>
            <span className="font-semibold text-[#171717]">Membership Plans</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#171717]">
              Current Account Status:{" "}
              <strong className="text-[#5145cd] uppercase font-bold">{membership.tier} Tier</strong>
            </span>
            <span className="text-[#8b8b95]">•</span>
            <span className="text-xs font-semibold text-[#16834a] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Cancel anytime in 1 click
            </span>
          </div>
        </div>
      </section>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="bg-[#ebf7ee] border-b border-[#94f7b2] py-2.5 px-4 text-center text-xs font-bold text-[#006d3a]">
          {successMessage}
        </div>
      )}

      {/* Hero Header */}
      <section className="bg-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#e7e7eb]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef2ff] text-[#5145cd] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DreamX Club Membership</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171717] tracking-tight">
            Transparent Pricing. Substantial Booking Discounts.
          </h1>
          <p className="text-base sm:text-lg text-[#66666f] max-w-2xl mx-auto leading-relaxed">
            Every candidate starts with a <strong>Free Account</strong>. Upgrading to Pro or Elite applies instant 5% or 10% discounts across all 10 standardized services once confirmed.
          </p>

          {/* Monthly vs Annual Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${billingCycle === "monthly" ? "text-[#171717]" : "text-[#8b8b95]"}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
              className="relative w-14 h-8 rounded-full bg-[#5145cd] p-1 transition-colors focus:outline-none"
              aria-label="Toggle billing cycle"
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                  billingCycle === "annual" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === "annual" ? "text-[#171717]" : "text-[#8b8b95]"}`}>
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full bg-[#ebf7ee] text-[#16834a] text-[10px] font-bold">
                Save 25%
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const displayPrice =
              billingCycle === "annual"
                ? plan.effectiveMonthly
                : plan.monthlyPrice;

            return (
              <Card
                key={plan.name}
                className={`p-6 sm:p-8 bg-white border flex flex-col justify-between transition-all ${
                  plan.isCurrent
                    ? "border-[#16834a] ring-2 ring-[#16834a] shadow-xl relative"
                    : "border-[#e7e7eb] shadow-sm hover:shadow-md"
                }`}
              >
                {plan.isCurrent && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#16834a] text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Your Active Plan</span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8b8b95] block">
                      {plan.tier}
                    </span>
                    <h3 className="text-xl font-bold text-[#171717] mt-0.5">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-[#66666f] mt-1.5 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-extrabold text-[#171717] tnum">
                        ₹{displayPrice}
                      </span>
                      <span className="text-xs text-[#66666f]">/ month</span>
                    </div>
                    {billingCycle === "annual" && plan.annualPrice > 0 && (
                      <p className="text-[11px] text-[#8b8b95]">
                        Billed annually at ₹{plan.annualPrice} (inclusive of 18% GST)
                      </p>
                    )}
                    <div className="pt-1">
                      <Badge variant={plan.isCurrent ? "verified" : "neutral"}>
                        {plan.discount}
                      </Badge>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 pt-4 border-t border-[#f7f7f8]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#171717] block">
                      Included Benefits:
                    </span>
                    <ul className="space-y-2.5 text-xs text-[#66666f]">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-[#16834a] shrink-0 mt-0.5" />
                          <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8 mt-6 border-t border-[#f7f7f8]">
                  {plan.isCurrent ? (
                    <Button
                      variant="outline"
                      size="md"
                      disabled
                      className="w-full opacity-70 cursor-not-allowed"
                    >
                      <span>Active Current Plan</span>
                    </Button>
                  ) : plan.id === "free" ? (
                    <Button
                      variant="outline"
                      size="md"
                      onClick={handleDowngrade}
                      className="w-full"
                    >
                      <span>Switch to Free Tier</span>
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => handleUpgrade(plan.id)}
                      className="w-full shadow-md"
                    >
                      <span>Upgrade to {plan.tier}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Commercial Transparency Box per PRD Principle 6 */}
        <div className="mt-12 p-5 rounded-2xl bg-[#fafafc] border border-[#e7e7eb] max-w-3xl mx-auto flex items-start gap-3 text-xs text-[#66666f] leading-relaxed">
          <HelpCircle className="w-5 h-5 text-[#5145cd] shrink-0 mt-0.5" />
          <p>
            <strong>Billing &amp; Cancellation Policy:</strong> Membership status is server-confirmed. Discounts (5% for Pro, 10% for Elite) are applied to checkout amounts only when an active subscription exists. You can downgrade or cancel at any time with no lock-in.
          </p>
        </div>
      </section>
    </div>
  );
}
