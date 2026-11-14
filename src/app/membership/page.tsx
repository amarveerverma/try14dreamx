"use client";

import * as React from "react";
import { useAuth } from "@/lib/auth-context";

interface ServiceItem {
  id: string;
  code: string;
  title: string;
  price: number;
  duration: string;
  description: string;
}

const BUNDLE_CATALOG: ServiceItem[] = [
  {
    id: "s01",
    code: "S01",
    title: "Resume Line-by-Line Teardown",
    price: 599,
    duration: "45m",
    description: "45 min live deep-dive + ATS score diagnostic",
  },
  {
    id: "s02",
    code: "S02",
    title: "ATS Keyword & Format Audit",
    price: 799,
    duration: "45m",
    description: "45 min parser optimization & recruiter search match",
  },
  {
    id: "s03",
    code: "S03",
    title: "LinkedIn Profile Optimization",
    price: 499,
    duration: "30m",
    description: "30 min recruiter discoverability & featured media audit",
  },
  {
    id: "s04",
    code: "S04",
    title: "Portfolio & GitHub Teardown",
    price: 599,
    duration: "45m",
    description: "45 min live architecture critique of proof-of-work",
  },
  {
    id: "s05",
    code: "S05",
    title: "Behavioral Mock (STAR Method)",
    price: 799,
    duration: "60m",
    description: "60 min leadership principles & culture drill",
  },
  {
    id: "s06",
    code: "S06",
    title: "System Design & DSA Technical Mock",
    price: 1499,
    duration: "60m",
    description: "60 min bar-raiser drill with Principal Architect",
  },
  {
    id: "s07",
    code: "S07",
    title: "Hiring Manager Bar-Raiser Mock",
    price: 1299,
    duration: "60m",
    description: "60 min end-to-end loop simulation with hiring director",
  },
  {
    id: "s08",
    code: "S08",
    title: "Offer & Salary Negotiation Advisory",
    price: 999,
    duration: "45m",
    description: "45 min offer leveling, clawback & tax guidance",
  },
  {
    id: "s09",
    code: "S09",
    title: "Career Pivot & Domain Transition Plan",
    price: 899,
    duration: "60m",
    description: "60 min personalized milestone & stack roadmap",
  },
  {
    id: "s10",
    code: "S10",
    title: "Promotion & Performance Review Strategy",
    price: 799,
    duration: "45m",
    description: "45 min internal promotion dossier & impact calibration",
  },
];

export default function MembershipPage() {
  const { membership, upgradeMembership, cancelMembership } = useAuth();
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "annual">("monthly");
  const [selectedServices, setSelectedServices] = React.useState<string[]>(["s01", "s06", "s08"]);
  const [openFaq, setOpenFaq] = React.useState<string | null>("faq-1");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = React.useState(false);
  const [isPurchasing, setIsPurchasing] = React.useState(false);
  const [isUpgrading, setIsUpgrading] = React.useState(false);
  const [serverPricing, setServerPricing] = React.useState<{
    originalAmountPaise: number;
    discountPercentage: number;
    discountPaise: number;
    finalAmountPaise: number;
    discountType: string;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleUpgrade = async (tier: "pro" | "elite") => {
    setIsUpgrading(true);
    try {
      await upgradeMembership(tier, billingCycle === "annual");
      showToast(`Plan updated: DreamX ${tier.toUpperCase()} (${billingCycle === "annual" ? "Annual" : "Monthly"}) activated!`);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error upgrading plan.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleDowngrade = async () => {
    setIsUpgrading(true);
    try {
      await cancelMembership();
      showToast("Cancellation scheduled. Benefits remain active until current period ends.");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error updating plan.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      if (selectedServices.length <= 1) {
        showToast("Please maintain at least 1 service in your selection.");
        return;
      }
      setSelectedServices(selectedServices.filter((s) => s !== id));
    } else {
      if (selectedServices.length >= 3) {
        // Swap out oldest
        const [, ...rest] = selectedServices;
        setSelectedServices([...rest, id]);
      } else {
        setSelectedServices([...selectedServices, id]);
      }
    }
  };

  // Synchronize server-verified pricing (PRD §7.3, P10 Exit Criteria 1)
  React.useEffect(() => {
    let isMounted = true;
    async function fetchPricing() {
      if (selectedServices.length === 3) {
        try {
          const selectedCodes = BUNDLE_CATALOG.filter((i) => selectedServices.includes(i.id)).map(
            (i) => i.code
          );
          const res = await fetch("/api/pricing/calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              isBundle: true,
              bundleServiceCodes: selectedCodes,
            }),
          });
          const data = await res.json();
          if (data.success && isMounted) {
            setServerPricing({
              originalAmountPaise: data.pricing.original_amount_paise,
              discountPercentage: data.pricing.discount_percentage,
              discountPaise: data.pricing.discount_paise,
              finalAmountPaise: data.pricing.final_amount_paise,
              discountType: data.pricing.discount_type,
            });
          }
        } catch {
          // Fallback
        }
      } else {
        if (isMounted) setServerPricing(null);
      }
    }

    fetchPricing();
    return () => {
      isMounted = false;
    };
  }, [selectedServices]);

  // Calculations for bundle using server-returned values (PRD §7.3)
  const selectedItems = BUNDLE_CATALOG.filter((item) => selectedServices.includes(item.id));
  const isBundleUnlocked = selectedServices.length === 3;
  const grossTotal = serverPricing
    ? Math.round(serverPricing.originalAmountPaise / 100)
    : selectedItems.reduce((acc, curr) => acc + curr.price, 0);
  const discountAmount = serverPricing
    ? Math.round(serverPricing.discountPaise / 100)
    : isBundleUnlocked
    ? Math.round(grossTotal * 0.05)
    : 0;
  const netPayable = serverPricing ? Math.round(serverPricing.finalAmountPaise / 100) : grossTotal - discountAmount;
  const appliedDiscountPct = serverPricing ? serverPricing.discountPercentage : isBundleUnlocked ? 5 : 0;

  const handlePurchaseBundle = async () => {
    setIsPurchasing(true);
    try {
      const selectedCodes = selectedItems.map((i) => i.code);
      const res = await fetch("/api/bundle/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceCodes: selectedCodes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to purchase bundle.");
      } else {
        setIsCheckoutModalOpen(false);
        showToast(data.message || "Bundle purchased! 3 session credits added to your vault.");
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error purchasing bundle.");
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-surface">
      {/* Subtle Ambient Top Gradient for Structural Softness */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[340px] bg-gradient-to-b from-primary/8 via-primary/2 to-transparent blur-3xl pointer-events-none rounded-full" />

        {/* Toast feedback */}
        {toastMessage && (
          <div className="fixed top-24 right-6 z-50 bg-primary text-on-primary px-4 py-3 rounded-xl shadow-lg text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Header & Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-8 sm:pt-12 pb-12 sm:pb-16 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-xs uppercase tracking-wider mb-6 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Transparent Value Architecture • PRD V3.0 Baseline</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-on-surface max-w-4xl mx-auto tracking-tight leading-[1.15] font-heading">
            Predictable Career Acceleration: Membership Plans &amp; Custom Bundles
          </h1>

          <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl mx-auto mt-6 leading-relaxed">
            Unlock continuous discounts on 1:1 verified mentor drills, structured 48-hour scorecards, and priority matching. No hidden fees, no deceptive placement claims, and zero discount stacking.
          </p>

          {/* Billing Cycle Toggle Switch */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="bg-surface-container-high p-1.5 rounded-xl flex items-center shadow-xs border border-outline-variant/30">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-lg text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-surface-container-lowest text-on-surface shadow-xs font-bold"
                    : "text-on-surface-variant hover:text-on-surface font-medium"
                }`}
              >
                Billed Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`px-5 py-2 rounded-lg text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === "annual"
                    ? "bg-surface-container-lowest text-on-surface shadow-xs font-bold"
                    : "text-on-surface-variant hover:text-on-surface font-medium"
                }`}
              >
                <span>Billed Annually</span>
                <span className="bg-secondary/15 text-secondary text-[11px] font-bold px-2 py-0.5 rounded-full leading-none">
                  Save up to 25%
                </span>
              </button>
            </div>
            <span className="text-xs text-secondary flex items-center gap-1 font-semibold px-2">
              <span className="material-symbols-outlined text-[16px]">celebration</span>
              <span>2 Months Free on Annual Commitments</span>
            </span>
          </div>
        </section>

        {/* 2. Three Membership Tiers Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-16 sm:pb-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Tier 1: Free Tier */}
            <div className={`bg-surface-container-lowest rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs border transition-all ${
              membership.tier === "free" ? "border-outline-variant/50" : "border-outline-variant/30"
            }`}>
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs uppercase tracking-wider text-outline font-bold font-mono">Tier 01</span>
                  <span className="px-2.5 py-1 rounded-full bg-surface-container text-xs text-on-surface-variant font-semibold">
                    Baseline
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-on-surface font-heading">Free Tier</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                  For placement seekers and early explorers auditing skills.
                </p>

                {/* Price */}
                <div className="mt-6 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-on-surface font-heading">₹0</span>
                    <span className="text-xs sm:text-sm text-outline">/ forever</span>
                  </div>
                  <p className="text-xs text-outline mt-1">Standard catalog prices • 0% Member Discount</p>
                </div>

                <div className="h-px bg-surface-container-highest my-6" />

                {/* Features List */}
                <ul className="space-y-3.5">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="text-xs sm:text-sm text-on-surface leading-relaxed">
                      Full access to <strong>8-Dimension Career Readiness</strong> assessment tool
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="text-xs sm:text-sm text-on-surface leading-relaxed">
                      Standard direct booking for S01–S10 at listed catalog prices
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="text-xs sm:text-sm text-on-surface leading-relaxed">
                      Standard Smart Match dispatch queue for verified mentors
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="text-xs sm:text-sm text-on-surface leading-relaxed">
                      Public verified mentor reviews &amp; past placement proofs
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="text-xs sm:text-sm text-on-surface leading-relaxed">
                      Verified PDF outcome reports delivered within strict 48h SLA
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-surface-container">
                {membership.tier === "free" ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3 rounded-xl text-xs sm:text-sm bg-surface-container text-outline cursor-not-allowed text-center font-bold"
                  >
                    Current Plan (Active)
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleDowngrade}
                    className="w-full py-3 rounded-xl text-xs sm:text-sm bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors text-center font-bold cursor-pointer"
                  >
                    Switch to Free Tier
                  </button>
                )}
                <p className="text-[11px] text-center text-outline mt-2.5">No billing information required</p>
              </div>
            </div>

            {/* Tier 2: Pro (Featured) */}
            <div className={`bg-surface-container-lowest rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-md border-2 border-primary relative transform lg:-translate-y-2`}>
              {/* Floating Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[11px] font-bold px-4 py-1 rounded-full shadow-xs flex items-center gap-1.5 uppercase tracking-wide">
                <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span>Most Popular Choice</span>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs uppercase tracking-wider text-primary font-bold font-mono">Tier 02</span>
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-xs text-primary font-bold">
                    5% Off Catalog
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-on-surface font-heading">Pro Membership</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                  For active job seekers &amp; 0–2 YoE engineers accelerating placements.
                </p>

                {/* Price */}
                <div className="mt-6 mb-6">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-on-surface font-heading">
                      {billingCycle === "annual" ? "₹149" : "₹199"}
                    </span>
                    <span className="text-xs sm:text-sm text-outline">/ month</span>
                  </div>
                  <p className="text-xs text-secondary font-semibold mt-1">
                    {billingCycle === "annual"
                      ? "₹1,788 billed annually (Save 25% • 2 months free)"
                      : "Billed monthly • Cancel anytime without penalties"}
                  </p>
                </div>

                <div className="h-px bg-surface-container-highest my-6" />

                {/* Features List */}
                <ul className="space-y-3.5">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="text-xs sm:text-sm text-on-surface leading-relaxed">
                      <strong>5% Discount across all catalog sessions</strong> (S01–S10), fully funded by DreamX
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="text-xs sm:text-sm text-on-surface leading-relaxed">
                      <strong>Wave 1 Priority Dispatch:</strong> Fast-track match routing to Top 5% verified mentors
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="text-xs sm:text-sm text-on-surface leading-relaxed">
                      Readiness trend history &amp; comparative percentile progression tracking
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="text-xs sm:text-sm text-on-surface leading-relaxed">
                      <strong>2 Free Resume Pre-checks</strong> per month prior to full mentor drills
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="text-xs sm:text-sm text-on-surface leading-relaxed">
                      Dedicated WhatsApp concierge for priority slot coordination
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">
                      bolt
                    </span>
                    <span className="text-xs sm:text-sm leading-relaxed">
                      <strong>Phase 2 Ready:</strong> 500 AI Monthly Credits allowance for automated mock telemetry
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-surface-container">
                {membership.tier === "pro" ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3 rounded-xl text-xs sm:text-sm bg-primary/20 text-primary cursor-default text-center font-bold"
                  >
                    Current Plan (Active Pro)
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isUpgrading}
                    onClick={() => handleUpgrade("pro")}
                    className="w-full py-3.5 rounded-xl text-xs sm:text-sm bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md font-bold text-center flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isUpgrading ? "Updating..." : "Upgrade to Pro"}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                )}
                <p className="text-[11px] text-center text-outline mt-2.5">
                  Protected by 14-day pro-rated refund guarantee
                </p>
              </div>
            </div>

            {/* Tier 3: Elite Access */}
            <div className={`bg-surface-container-lowest rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs border transition-all ${
              membership.tier === "elite" ? "border-secondary ring-2 ring-secondary" : "border-outline-variant/30"
            }`}>
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs uppercase tracking-wider text-outline font-bold font-mono">Tier 03</span>
                  <span className="px-2.5 py-1 rounded-full bg-surface-container-highest text-xs text-on-surface font-bold">
                    10% Off Catalog
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-on-surface font-heading">Elite Access</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                  For senior transitioners &amp; high-stakes bar-raiser applicants.
                </p>

                {/* Price */}
                <div className="mt-6 mb-6">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-on-surface font-heading">
                      {billingCycle === "annual" ? "₹349" : "₹399"}
                    </span>
                    <span className="text-xs sm:text-sm text-outline">/ month</span>
                  </div>
                  <p className="text-xs text-secondary font-semibold mt-1">
                    {billingCycle === "annual"
                      ? "₹4,188 billed annually (Save 12.5% • 2 months free)"
                      : "Billed monthly • Complete executive concierge"}
                  </p>
                </div>

                <div className="h-px bg-surface-container-highest my-6" />

                {/* Features List */}
                <ul className="space-y-3.5">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="text-xs sm:text-sm text-on-surface leading-relaxed">
                      <strong>10% Flat Discount on all catalog services</strong> (S01–S10), fully funded by DreamX
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="text-xs sm:text-sm text-on-surface leading-relaxed">
                      <strong>Instant Wave 1 Dispatch:</strong> &lt;15 min priority ping to principal mentors
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="text-xs sm:text-sm text-on-surface leading-relaxed">
                      Unlimited readiness re-assessments &amp; comparative delta audit decks
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="text-xs sm:text-sm text-on-surface leading-relaxed">
                      <strong>Direct 1:1 async prep channel</strong> with your mentor ahead of sessions
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="text-xs sm:text-sm text-on-surface leading-relaxed">
                      <strong>Expedited 24-Hour Deliverable Turnaround SLA</strong> on selected scorecard audits
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">
                      bolt
                    </span>
                    <span className="text-xs sm:text-sm leading-relaxed">
                      <strong>Phase 2 Ready:</strong> 1,000 AI Monthly Credits + 10% bonus on top-up packs
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-surface-container">
                {membership.tier === "elite" ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3 rounded-xl text-xs sm:text-sm bg-secondary/20 text-secondary cursor-default text-center font-bold"
                  >
                    Current Plan (Active Elite)
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isUpgrading}
                    onClick={() => handleUpgrade("elite")}
                    className="w-full py-3.5 rounded-xl text-xs sm:text-sm bg-inverse-surface text-inverse-on-surface hover:bg-on-surface transition-all shadow-md font-bold text-center flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isUpgrading ? "Updating..." : "Get Elite Access"}</span>
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </button>
                )}
                <p className="text-[11px] text-center text-outline mt-2.5">
                  Dedicated Relationship Manager assigned immediately
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Interactive Custom 3-Service Bundle Builder */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
          <div className="bg-surface-container-low rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xs border border-outline-variant/30">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-outline-variant/20">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider mb-3">
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  <span>Custom Bundle Engine (PRD §7.3)</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface font-heading">
                  Curate Your Custom 3-Service Bundle (Save 5%)
                </h2>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-2 max-w-3xl leading-relaxed">
                  Select any 3 distinct modules from the canonical catalog (S01–S10). Get an immediate 5% bundle discount funded entirely by DreamX — your mentors receive 100% of their base compensation.
                </p>
              </div>
              <div className="flex items-center gap-3 bg-surface-container-lowest px-4 py-2.5 rounded-xl shadow-xs border border-outline-variant/30 shrink-0">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-on-surface font-bold">
                  <span className="material-symbols-outlined text-primary text-[20px]">layers</span>
                  <span>Modules Selected:</span>
                  <span className="text-primary font-mono">{selectedServices.length} / 3</span>
                </div>
              </div>
            </div>

            {/* Builder Layout: Left Grid of Available Services, Right Sticky Summary Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-8">
              {/* Services Selector Grid (7 Cols) */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BUNDLE_CATALOG.map((item) => {
                  const isSelected = selectedServices.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleService(item.id)}
                      className={`cursor-pointer p-5 rounded-2xl shadow-xs transition-all relative border ${
                        isSelected
                          ? "bg-surface-container-lowest ring-2 ring-primary border-primary"
                          : "bg-surface-container-lowest border-outline-variant/30 opacity-80 hover:opacity-100 hover:border-outline-variant/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${
                            isSelected ? "bg-primary/10 text-primary" : "bg-surface-container text-outline"
                          }`}
                        >
                          {item.code}
                        </span>
                        <span
                          className={`material-symbols-outlined text-[22px] transition-colors ${
                            isSelected ? "text-primary" : "text-outline-variant"
                          }`}
                          style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          {isSelected ? "check_circle" : "radio_button_unchecked"}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-on-surface leading-snug font-heading">
                        {item.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-container text-xs">
                        <span className="text-outline">Duration: {item.duration}</span>
                        <span className="text-sm font-bold text-on-surface font-mono">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bundle Calculation Summary Card (5 Cols Sticky) */}
              <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-6 lg:p-8 shadow-md border border-outline-variant/30 sticky top-28">
                <div className="flex items-center justify-between pb-4 border-b border-surface-container">
                  <span className="text-xs uppercase tracking-wider text-outline font-bold">
                    Custom Track Summary
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      isBundleUnlocked
                        ? "bg-secondary/15 text-secondary"
                        : "bg-surface-container text-outline"
                    }`}
                  >
                    {isBundleUnlocked ? "5% Bundle Discount" : "Pick 3 Modules"}
                  </span>
                </div>

                {/* Dynamic Selected Items List */}
                <div className="divide-y divide-surface-container my-4">
                  {selectedItems.map((item, idx) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-2 text-xs sm:text-sm">
                      <span className="text-on-surface font-medium truncate">
                        {idx + 1}. {item.title}
                      </span>
                      <span className="text-on-surface font-bold shrink-0 font-mono">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown Box */}
                <div className="bg-surface-container-low p-4 rounded-xl space-y-2 mb-6 border border-outline-variant/20">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-on-surface-variant">
                    <span>Total List Price (Gross)</span>
                    <span className="text-on-surface font-semibold font-mono">
                      ₹{grossTotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm text-secondary">
                    <div className="flex items-center gap-1.5">
                      <span>Track Bundle Savings (5%)</span>
                      {isBundleUnlocked && (
                        <span className="text-[10px] bg-secondary/15 text-secondary px-1.5 py-0.2 rounded font-bold">
                          100% Platform Funded
                        </span>
                      )}
                    </div>
                    <span className="font-bold font-mono">
                      {isBundleUnlocked ? `-₹${discountAmount.toLocaleString("en-IN")}` : "₹0"}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-surface-container-highest flex items-baseline justify-between">
                    <div>
                      <span className="text-sm sm:text-base font-bold text-on-surface font-heading">
                        Net Payable
                      </span>
                      <p className="text-[11px] text-outline">Inclusive of all 18% GST</p>
                    </div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-primary font-heading font-mono">
                      ₹{netPayable.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Guarantees Notice */}
                <div className="p-3.5 rounded-xl bg-surface-container/60 mb-6 space-y-2 border border-outline-variant/20 text-xs">
                  <div className="flex items-center gap-2 text-on-surface">
                    <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                    <span>Valid for 6 months • Individual 48h deliverables</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface">
                    <span className="material-symbols-outlined text-secondary text-[16px]">schedule</span>
                    <span>100% full refund if cancelled ≥1h before any session</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  type="button"
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {isBundleUnlocked
                      ? `Proceed to Checkout with Bundle (₹${netPayable.toLocaleString("en-IN")})`
                      : `Select 3 Services to Unlock 5% Discount (₹${netPayable.toLocaleString("en-IN")})`}
                  </span>
                  <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
                </button>
                <p className="text-[11px] text-center text-outline mt-2.5">Immediate slot allocation upon confirmation</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Core Discount & Financial Rules Governance (PRD §7.3, §7.4, §13) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
          <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-xs border border-outline-variant/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[26px]">gavel</span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-surface-container text-xs uppercase tracking-wide text-on-surface-variant font-bold">
                    Governance Protocol
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-on-surface mt-1 font-heading">
                    The DreamX Non-Stacking Commercial Rule (PRD §7.3 &amp; §13)
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="p-4 rounded-xl bg-surface-container-low space-y-2 border border-outline-variant/20">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm sm:text-base">
                      <span className="material-symbols-outlined text-[20px]">filter_1</span>
                      <span>Single Best Rule</span>
                    </div>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      Membership discounts (Pro 5% / Elite 10%) and Track Bundle discounts (5%) do <strong>NOT stack</strong>. If an Elite member checks out a 3-service bundle, our transaction engine automatically applies their superior 10% Elite discount.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-low space-y-2 border border-outline-variant/20">
                    <div className="flex items-center gap-2 text-secondary font-bold text-sm sm:text-base">
                      <span className="material-symbols-outlined text-[20px]">shield_person</span>
                      <span>Zero Mentor Penalties</span>
                    </div>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      Discounts are <strong>100% absorbed and funded by DreamX platform margins</strong>. Your mentors are compensated strictly on original gross catalog prices, ensuring unmatched evaluation rigor.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-low space-y-2 border border-outline-variant/20">
                    <div className="flex items-center gap-2 text-tertiary font-bold text-sm sm:text-base">
                      <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                      <span>Integer Nodal Escrow</span>
                    </div>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      All transaction values are strictly calculated in integer paise, held in Indian Razorpay Nodal Escrow, and settled following deliverable verification under statutory GST compliance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Architectural Plan Comparison */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface font-heading">
              Architectural Plan Comparison
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
              Clinical feature-by-feature evaluation of DreamX membership benefits, SLAs, and technical guarantees.
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-xs border border-outline-variant/30">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-surface-container-low text-xs sm:text-sm font-bold font-heading">
                    <th className="p-4 sm:p-5 text-on-surface w-2/5">Capability &amp; SLA Commitment</th>
                    <th className="p-4 sm:p-5 text-on-surface text-center w-1/5">Free</th>
                    <th className="p-4 sm:p-5 text-primary text-center w-1/5 bg-primary/5 border-x border-primary/20">
                      Pro Plan
                    </th>
                    <th className="p-4 sm:p-5 text-on-surface text-center w-1/5">Elite Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container text-xs sm:text-sm">
                  {/* Category 1 */}
                  <tr className="bg-surface-container/30">
                    <td className="p-3.5 px-5 text-xs font-bold uppercase tracking-wider text-outline" colSpan={4}>
                      1. Mentorship &amp; Catalog Economics
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4 px-5 text-on-surface font-medium">Catalog Service Discount (S01–S10)</td>
                    <td className="p-4 text-center text-on-surface-variant">0% (List Price)</td>
                    <td className="p-4 text-center text-primary font-bold bg-primary/5 border-x border-primary/10">5% Flat</td>
                    <td className="p-4 text-center text-secondary font-bold">10% Flat</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4 px-5 text-on-surface font-medium">Mentor Compensation Protection</td>
                    <td className="p-4 text-center text-secondary font-medium">100% Payout</td>
                    <td className="p-4 text-center text-secondary font-medium bg-primary/5 border-x border-primary/10">
                      100% Payout (Platform Funded)
                    </td>
                    <td className="p-4 text-center text-secondary font-medium">100% Payout (Platform Funded)</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4 px-5 text-on-surface font-medium">Monthly Free Resume Pre-checks</td>
                    <td className="p-4 text-center text-outline">—</td>
                    <td className="p-4 text-center text-on-surface font-semibold bg-primary/5 border-x border-primary/10">2 per month</td>
                    <td className="p-4 text-center text-on-surface font-semibold">Unlimited</td>
                  </tr>

                  {/* Category 2 */}
                  <tr className="bg-surface-container/30">
                    <td className="p-3.5 px-5 text-xs font-bold uppercase tracking-wider text-outline" colSpan={4}>
                      2. Readiness Intelligence &amp; SLA
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4 px-5 text-on-surface font-medium">8-Dimension Assessment Engine</td>
                    <td className="p-4 text-center text-on-surface">Standard Baseline</td>
                    <td className="p-4 text-center text-on-surface bg-primary/5 border-x border-primary/10">Advanced Historical Trend</td>
                    <td className="p-4 text-center text-on-surface font-semibold">Unlimited Delta Progression</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4 px-5 text-on-surface font-medium">Scorecard Turnaround SLA</td>
                    <td className="p-4 text-center text-on-surface">Standard 48 Hours</td>
                    <td className="p-4 text-center text-on-surface bg-primary/5 border-x border-primary/10">Standard 48 Hours</td>
                    <td className="p-4 text-center text-primary font-bold">Expedited 24h SLA (Select Tracks)</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4 px-5 text-on-surface font-medium">Direct Async Pre-Session Prep Channel</td>
                    <td className="p-4 text-center text-outline">—</td>
                    <td className="p-4 text-center text-outline bg-primary/5 border-x border-primary/10">—</td>
                    <td className="p-4 text-center text-secondary font-bold">Included (Private Channel)</td>
                  </tr>

                  {/* Category 3 */}
                  <tr className="bg-surface-container/30">
                    <td className="p-3.5 px-5 text-xs font-bold uppercase tracking-wider text-outline" colSpan={4}>
                      3. Dispatch, Matching &amp; Support
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4 px-5 text-on-surface font-medium">Smart Match Priority Queue</td>
                    <td className="p-4 text-center text-on-surface-variant">Standard Dispatch</td>
                    <td className="p-4 text-center text-primary font-semibold bg-primary/5 border-x border-primary/10">Wave 1 Priority Queue</td>
                    <td className="p-4 text-center text-primary font-bold">Instant Wave 1 (&lt;15 min ping)</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4 px-5 text-on-surface font-medium">Support Concierge Channel</td>
                    <td className="p-4 text-center text-on-surface-variant">Standard Helpdesk</td>
                    <td className="p-4 text-center text-on-surface font-medium bg-primary/5 border-x border-primary/10">Dedicated WhatsApp Concierge</td>
                    <td className="p-4 text-center text-on-surface font-semibold">Dedicated Relationship Manager</td>
                  </tr>

                  {/* Category 4 */}
                  <tr className="bg-surface-container/30">
                    <td className="p-3.5 px-5 text-xs font-bold uppercase tracking-wider text-outline" colSpan={4}>
                      4. Phase 2 Telemetry Credit Allowance
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4 px-5 text-on-surface font-medium">Monthly AI Platform Credits</td>
                    <td className="p-4 text-center text-outline">Pay-per-use</td>
                    <td className="p-4 text-center text-on-surface font-semibold bg-primary/5 border-x border-primary/10">500 Credits / mo</td>
                    <td className="p-4 text-center text-on-surface font-bold">1,000 Credits / mo + 10% pack bonus</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 6. Enforceable Guarantees & FAQs */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-20 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Guarantees Visual Callout */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
                Institutional Trust
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-heading">
                Enforceable Guarantees &amp; Escrow Security
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Career decisions are high-stakes. DreamX eliminates predatory edtech practices through algorithmic escrow, SLA-bound refunds, and transparent non-stackable economics.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="p-4 rounded-xl bg-surface-container-low flex items-start gap-3.5 border border-outline-variant/20">
                  <span className="material-symbols-outlined text-secondary text-[24px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                    security
                  </span>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-on-surface font-heading">
                      100% Pre-Session Refund Protocol
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                      Cancel any booked 1:1 session or bundle item at least 1 hour prior to scheduled time for instant, zero-penalty full credit or original source refund.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low flex items-start gap-3.5 border border-outline-variant/20">
                  <span className="material-symbols-outlined text-secondary text-[24px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                    timer
                  </span>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-on-surface font-heading">
                      48h Deliverable SLA Penalty
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                      If a mentor fails to submit their verified rubric scorecard within 48 hours of session completion, receive an automatic 80% fee refund while retaining full access to subsequent deliverables.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low flex items-start gap-3.5 border border-outline-variant/20">
                  <span className="material-symbols-outlined text-secondary text-[24px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                    block
                  </span>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-on-surface font-heading">
                      Zero Lock-In Commitment
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                      Pause or cancel your Pro or Elite membership in 1 click via dashboard. Your tier benefits remain active through your paid billing cycle with zero surprise renewals.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="lg:col-span-7 space-y-4">
              <div className="pb-2">
                <span className="text-xs uppercase tracking-wider text-outline font-bold">Frequently Asked Questions</span>
                <h4 className="text-xl sm:text-2xl font-bold text-on-surface mt-1 font-heading">
                  Everything You Need to Know
                </h4>
              </div>

              {[
                {
                  id: "faq-1",
                  q: "How does the custom 3-service bundle discount work?",
                  a: "When you curate any 3 distinct services (e.g. S01 Resume Review + S06 System Design + S08 Salary Negotiation), the DreamX engine automatically calculates a 5% discount across the collective gross sum. You do not need to schedule all three immediately — individual credits remain active in your account for 6 months.",
                },
                {
                  id: "faq-2",
                  q: "What happens if I have an Elite membership and buy a bundle?",
                  a: "In accordance with PRD §7.3, discounts do not stack. Because the Elite membership offers a 10% discount across all individual services, that superior 10% rate is applied to every item in the bundle, granting you greater savings than the standard 5% bundle discount alone.",
                },
                {
                  id: "faq-3",
                  q: "Are mentors paid less when discounts or bundles are applied?",
                  a: "Never. DreamX mentors are seasoned engineering leaders and bar-raisers whose time is valued at market rates. All discounts (both membership tier percentages and bundle concessions) are funded 100% out of DreamX platform margins. Mentors always receive their full contractual payout.",
                },
                {
                  id: "faq-4",
                  q: "How are GST and invoices handled for Indian tax filings?",
                  a: "All displayed pricing includes statutory 18% GST. Upon successful transaction through our Razorpay Nodal gateway, a compliant digital tax invoice bearing your name/organization GSTIN is instantly generated and delivered to your registered email and profile dashboard.",
                },
                {
                  id: "faq-5",
                  q: "Can I switch between monthly and annual plans midway?",
                  a: "Yes. Upgrades from monthly to annual take effect immediately with pro-rated credit applied from your unused monthly balance. Downward tier transitions take effect at the conclusion of your current billing period without early termination penalties.",
                },
              ].map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-outline-variant/30 overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className="w-full text-left flex items-center justify-between gap-4 cursor-pointer hover:text-primary transition-colors"
                    >
                      <span className="text-sm sm:text-base font-bold text-on-surface font-heading">{faq.q}</span>
                      <span
                        className={`material-symbols-outlined text-outline text-[20px] shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-primary" : ""
                        }`}
                      >
                        expand_more
                      </span>
                    </button>
                    {isOpen && (
                      <p className="text-xs sm:text-sm text-on-surface-variant mt-3 leading-relaxed border-t border-outline-variant/10 pt-3">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-outline-variant/30 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">shopping_bag</span>
                <h3 className="text-lg sm:text-xl font-bold text-on-surface font-heading">Confirm Track Bundle</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-on-surface-variant">
                You are locking in {selectedItems.length} modules under Razorpay Nodal Escrow protection:
              </p>
              <div className="space-y-2 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <span className="text-on-surface font-medium">
                      {item.code}: {item.title}
                    </span>
                    <span className="font-mono font-bold text-on-surface">₹{item.price}</span>
                  </div>
                ))}
                {isBundleUnlocked && discountAmount > 0 && (
                  <div className="flex items-center justify-between text-xs text-secondary pt-2 border-t border-surface-container-highest">
                    <span>
                      {appliedDiscountPct}% {serverPricing?.discountType === "membership" ? "Membership Discount" : "Track Bundle Discount"}
                    </span>
                    <span className="font-mono font-bold">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm font-bold text-on-surface pt-2 border-t border-surface-container-highest">
                  <span>Total Amount Payable</span>
                  <span className="font-mono text-primary text-base font-extrabold">₹{netPayable}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-secondary/10 text-secondary text-xs flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">verified_user</span>
              <span>
                Protected by 100% Escrow and 48-Hour Rubric SLA Guarantee. Sessions can be scheduled individually at your convenience over 90 days.
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(false)}
                className="flex-1 py-3 rounded-xl border border-outline-variant/40 text-on-surface text-xs sm:text-sm font-bold hover:bg-surface-container transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPurchasing}
                onClick={handlePurchaseBundle}
                className="flex-1 py-3 rounded-xl bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isPurchasing ? (
                  <span>Processing Escrow...</span>
                ) : (
                  <>
                    <span>Pay ₹{netPayable} via Escrow</span>
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
