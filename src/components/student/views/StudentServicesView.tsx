"use client";

import * as React from "react";
import {
  Search,
  Layers,
  Users,
  Clock,
  Lock,
  Loader2,
  Info,
  ShieldCheck,
  X,
} from "lucide-react";
import { StudentModal } from "../ui/StudentModal";
import { StudentStatusBadge } from "../ui/StudentStatusBadge";
import {
  ServiceDefinition,
  MentorPreview,
  SERVICES_CATALOGUE,
  getServiceById,
  formatPaise,
  calculateBundlePricing,
  SEED_AVAILABLE_MENTORS,
} from "../types";

export interface StudentServicesViewProps {
  membershipTier: string;
  initialFocusId?: string;
  bundleServiceIds: string[];
  onToggleBundleService: (serviceId: string) => void;
  onClearBundle: () => void;
  onPurchaseBundle: (serviceIds: string[], payablePaise: number, discountLabel: string) => void;
  onStartBooking: (serviceId: string, mentorSlug?: string) => void;
}

export function StudentServicesView({
  membershipTier,
  initialFocusId,
  bundleServiceIds,
  onToggleBundleService,
  onClearBundle,
  onPurchaseBundle,
  onStartBooking,
}: StudentServicesViewProps) {
  const [activeTab, setActiveTab] = React.useState<"catalogue" | "mentors" | "bundle">(
    initialFocusId === "bundle" ? "bundle" : "catalogue"
  );
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [mentorDomain, setMentorDomain] = React.useState<string>("All");
  const [mentorService, setMentorService] = React.useState<string>("All");

  const [activeServiceModal, setActiveServiceModal] = React.useState<ServiceDefinition | null>(null);
  const [activeMentorModal, setActiveMentorModal] = React.useState<MentorPreview | null>(null);
  const [showClearConfirm, setShowClearConfirm] = React.useState<boolean>(false);
  const [isCheckingOutBundle, setIsCheckingOutBundle] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (initialFocusId === "bundle") {
      setActiveTab("bundle");
    } else if (initialFocusId && initialFocusId.startsWith("mentor:")) {
      const slug = initialFocusId.slice(7);
      setActiveTab("mentors");
      const foundMentor = SEED_AVAILABLE_MENTORS.find((m) => m.slug === slug);
      if (foundMentor) setActiveMentorModal(foundMentor);
    } else if (initialFocusId && initialFocusId.startsWith("S")) {
      setActiveTab("catalogue");
      const foundService = SERVICES_CATALOGUE.find((s) => s.id === initialFocusId);
      if (foundService) setActiveServiceModal(foundService);
    }
  }, [initialFocusId]);

  const filteredServices = SERVICES_CATALOGUE.filter((s) => {
    if (selectedCategory !== "All" && s.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.id.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.shortOutcome.toLowerCase().includes(q) ||
        s.deliverableName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredMentors = SEED_AVAILABLE_MENTORS.filter((m) => {
    if (mentorDomain !== "All" && !m.domains.includes(mentorDomain)) return false;
    if (mentorService !== "All" && !m.approvedServiceIds.includes(mentorService)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.displayName.toLowerCase().includes(q) ||
        m.headline.toLowerCase().includes(q) ||
        m.bio.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const bundleSubtotal = bundleServiceIds.reduce(
    (acc, id) => acc + getServiceById(id).listPricePaise,
    0
  );
  const bundlePricing = calculateBundlePricing(
    bundleSubtotal,
    membershipTier,
    bundleServiceIds.length === 3
  );

  const handleCheckoutBundle = async () => {
    if (bundleServiceIds.length !== 3 || isCheckingOutBundle) return;
    setIsCheckingOutBundle(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsCheckingOutBundle(false);
    onPurchaseBundle(bundleServiceIds, bundlePricing.payablePaise, bundlePricing.appliedLabel);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Tab Controls */}
      <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">
              Career Services, Verified Mentors & Custom Bundles
            </h1>
            <p className="mt-1 text-sm text-zinc-600 max-w-3xl">
              Standardized 1:1 human-mentor services with upfront INR pricing, transparent
              verification labels, and structured post-session reports within 48 hours.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "catalogue"}
              onClick={() => setActiveTab("catalogue")}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
                activeTab === "catalogue"
                  ? "bg-[#5145cd] text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Service Catalogue ({SERVICES_CATALOGUE.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "mentors"}
              onClick={() => setActiveTab("mentors")}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
                activeTab === "mentors"
                  ? "bg-[#5145cd] text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              Find Mentors ({SEED_AVAILABLE_MENTORS.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "bundle"}
              onClick={() => setActiveTab("bundle")}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${
                activeTab === "bundle"
                  ? "bg-[#5145cd] text-white"
                  : "bg-indigo-50 text-[#4035b3] border border-indigo-200 hover:bg-indigo-100"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Custom 3-Service Bundle ({bundleServiceIds.length}/3)
            </button>
          </div>
        </div>

        {/* Filters */}
        {activeTab !== "bundle" && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            {activeTab === "catalogue" ? (
              <div className="flex flex-wrap items-center gap-1.5">
                {["All", "Profile & Assets", "Interviews", "Career Direction"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      selectedCategory === cat
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={mentorDomain}
                  onChange={(e) => setMentorDomain(e.target.value)}
                  aria-label="Filter mentors by career domain"
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800"
                >
                  <option value="All">All Launch Domains</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Data Science / AI">Data Science / AI</option>
                  <option value="Product Management">Product Management</option>
                </select>
                <select
                  value={mentorService}
                  onChange={(e) => setMentorService(e.target.value)}
                  aria-label="Filter mentors by approved service"
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800"
                >
                  <option value="All">All Approved Services</option>
                  {SERVICES_CATALOGUE.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id} — {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="relative w-full sm:w-64">
              <Search className="h-4 w-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === "catalogue"
                    ? "Search S01–S10 services..."
                    : "Search verified mentors..."
                }
                aria-label="Search marketplace"
                className="w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 py-1.5 text-xs text-zinc-900 focus:border-[#5145cd] focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tab 1: Service Catalogue */}
      {activeTab === "catalogue" &&
        (filteredServices.length === 0 ? (
          <div className="rounded-2xl border border-white/80 bg-white/94 p-10 text-center space-y-2">
            <p className="text-sm font-semibold text-zinc-800">No services match your filter</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="rounded-lg bg-[#5145cd] px-3.5 py-1.5 text-xs font-semibold text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredServices.map((svc) => {
              const inBundle = bundleServiceIds.includes(svc.id);
              const pricing = calculateBundlePricing(svc.listPricePaise, membershipTier, false);
              return (
                <article
                  key={svc.id}
                  className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#5145cd] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/80">
                            {svc.id}
                          </span>
                          <span className="text-xs font-medium text-zinc-500">{svc.category}</span>
                        </div>
                        <h2 className="mt-1.5 text-base font-bold text-zinc-900">{svc.name}</h2>
                      </div>
                      <div className="text-right font-mono tabular-nums">
                        <span className="text-base font-bold text-zinc-900 block">
                          {formatPaise(pricing.payablePaise)}
                        </span>
                        {pricing.discountPaise > 0 ? (
                          <span className="text-[11px] text-emerald-700">
                            List {formatPaise(svc.listPricePaise)} ({membershipTier})
                          </span>
                        ) : (
                          <span className="text-[11px] text-zinc-500">Listed price</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">{svc.shortOutcome}</p>
                    <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/75 p-3 text-xs space-y-1">
                      <p className="text-zinc-800">
                        <strong>What you receive:</strong> {svc.deliverableName}
                      </p>
                      <p className="text-zinc-500 flex items-center gap-3">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {svc.durationMinutes} min
                        </span>
                        <span>· Report within 48h</span>
                        <span>· {svc.bookingModes.join(" & ")}</span>
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-zinc-200/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveServiceModal(svc)}
                        className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                      >
                        Explore Details
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleBundleService(svc.id)}
                        className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                          inBundle
                            ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                            : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                        }`}
                      >
                        {inBundle ? "✓ In Bundle" : "+ 3-Bundle"}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onStartBooking(svc.id)}
                      className="rounded-lg bg-[#5145cd] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#4035b3]"
                    >
                      Book Service
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ))}

      {/* Tab 2: Verified Mentors Directory */}
      {activeTab === "mentors" &&
        (filteredMentors.length === 0 ? (
          <div className="rounded-2xl border border-white/80 bg-white/94 p-10 text-center space-y-2">
            <p className="text-sm font-semibold text-zinc-800">
              No verified mentors match your domain or service filter
            </p>
            <button
              type="button"
              onClick={() => {
                setMentorDomain("All");
                setMentorService("All");
                setSearchQuery("");
              }}
              className="rounded-lg bg-[#5145cd] px-3.5 py-1.5 text-xs font-semibold text-white"
            >
              Reset Mentor Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredMentors.map((mentor) => (
              <article
                key={mentor.id}
                className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-[#5145cd] text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {mentor.displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-base font-bold text-zinc-900">{mentor.displayName}</h2>
                      <p className="text-xs text-zinc-700 font-medium">{mentor.headline}</p>
                      <p className="text-[11px] text-zinc-500">
                        {mentor.experienceSummary} · {mentor.yearsOfExperience} yrs
                      </p>
                    </div>
                  </div>
                  <StudentStatusBadge label={mentor.verificationLabel} tone="success" />
                  <p className="text-xs text-zinc-600 leading-relaxed">{mentor.bio}</p>
                  <div>
                    <span className="text-[11px] font-semibold text-zinc-500 block mb-1.5">
                      Approved to Deliver ({mentor.approvedServiceIds.length} Services):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {mentor.approvedServiceIds.map((sid) => (
                        <span
                          key={sid}
                          className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-800"
                        >
                          {sid} · {getServiceById(sid).name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-zinc-200/80 flex items-center justify-between gap-2">
                  <span className="text-xs text-emerald-800 font-medium">
                    Next open: {mentor.nextAvailableLabel}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveMentorModal(mentor)}
                      className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                    >
                      Public Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => onStartBooking(mentor.approvedServiceIds[0], mentor.slug)}
                      className="rounded-lg bg-[#5145cd] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#4035b3]"
                    >
                      Direct Book
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ))}

      {/* Tab 3: Custom 3-Service Bundle Builder */}
      {activeTab === "bundle" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-7 rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3.5">
              <div>
                <h2 className="text-base font-semibold text-zinc-900">
                  Select Any 3 Eligible Career Services
                </h2>
                <p className="text-xs text-zinc-500">
                  Custom 3-service bundle receives a 5% discount (replaces legacy fixed 4-pack).
                </p>
              </div>
              <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 font-mono text-xs font-bold text-[#4035b3]">
                {bundleServiceIds.length} / 3 Selected
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICES_CATALOGUE.map((svc) => {
                const isSelected = bundleServiceIds.includes(svc.id);
                return (
                  <button
                    key={svc.id}
                    type="button"
                    disabled={!isSelected && bundleServiceIds.length >= 3}
                    onClick={() => onToggleBundleService(svc.id)}
                    className={`text-left rounded-xl border p-3.5 transition-all disabled:opacity-45 disabled:cursor-not-allowed ${
                      isSelected
                        ? "border-[#5145cd] bg-indigo-50/60 ring-1 ring-[#5145cd]/25"
                        : "border-zinc-200 bg-white hover:bg-zinc-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#5145cd]">{svc.id}</span>
                      <span className="font-mono text-xs font-semibold text-zinc-900 tabular-nums">
                        {formatPaise(svc.listPricePaise)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-bold text-zinc-900">{svc.name}</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {svc.durationMinutes} min ·{" "}
                      {isSelected ? "Click to remove" : "Click to add"}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="lg:col-span-5 rounded-2xl border border-white/80 bg-white/95 backdrop-blur-md p-5 shadow-xs space-y-4 h-fit">
            <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3">
              <h2 className="text-base font-semibold text-zinc-900">Custom Bundle Summary</h2>
              {bundleServiceIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {bundleServiceIds.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-500">
                Select 3 services on the left to unlock the custom bundle checkout.
              </div>
            ) : (
              <div className="space-y-2">
                {bundleServiceIds.map((sid) => {
                  const svc = getServiceById(sid);
                  return (
                    <div
                      key={sid}
                      className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-zinc-900">
                          {svc.id} · {svc.name}
                        </p>
                        <p className="text-[11px] text-zinc-500">{svc.durationMinutes} min</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-zinc-800 tabular-nums">
                          {formatPaise(svc.listPricePaise)}
                        </span>
                        <button
                          type="button"
                          onClick={() => onToggleBundleService(sid)}
                          aria-label={`Remove ${svc.name}`}
                          className="text-zinc-400 hover:text-rose-600 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="rounded-xl border border-indigo-200/80 bg-indigo-50/40 p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-zinc-700">
                <span>Original Listed Subtotal</span>
                <span className="font-mono tabular-nums">{formatPaise(bundleSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-800">
                <span>Best Eligible Discount ({bundlePricing.appliedLabel})</span>
                <span className="font-mono tabular-nums">-{formatPaise(bundlePricing.discountPaise)}</span>
              </div>
              <div className="pt-2 border-t border-indigo-200 flex items-center justify-between text-sm font-bold text-zinc-900">
                <span>Final Bundle Subtotal</span>
                <span className="font-mono text-[#4035b3] tabular-nums">
                  {formatPaise(bundlePricing.payablePaise)}
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 pt-1">{bundlePricing.nonStackingExplanation}</p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-[11px] text-zinc-600 space-y-1">
              <p className="font-semibold text-zinc-800 flex items-center gap-1">
                <Info className="h-3.5 w-3.5 text-[#5145cd]" />
                Bundle Terms (PRD 7.4)
              </p>
              <p>
                Requires exactly 3 eligible services. Bundle entitlements are non-transferable and not
                cash-redeemable. DreamX funds the eligible discount while mentor payout basis remains
                the original listed price.
              </p>
            </div>

            <button
              type="button"
              disabled={bundleServiceIds.length !== 3 || isCheckingOutBundle}
              onClick={handleCheckoutBundle}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#5145cd] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#4035b3] disabled:opacity-45 disabled:cursor-not-allowed transition-colors"
            >
              {isCheckingOutBundle ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying Bundle Checkout...
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" />
                  {bundleServiceIds.length === 3
                    ? `Checkout 3-Service Bundle (${formatPaise(bundlePricing.payablePaise)})`
                    : `Select ${3 - bundleServiceIds.length} More Service(s)`}
                </>
              )}
            </button>
          </section>
        </div>
      )}

      {/* Service Detail Modal */}
      <StudentModal
        open={!!activeServiceModal}
        onClose={() => setActiveServiceModal(null)}
        title={activeServiceModal ? `${activeServiceModal.id} — ${activeServiceModal.name}` : ""}
        subtitle={
          activeServiceModal
            ? `${activeServiceModal.durationMinutes} min · Listed ${formatPaise(
                activeServiceModal.listPricePaise
              )} · Structured report within 48 hours`
            : ""
        }
        footer={
          activeServiceModal && (
            <>
              <button
                type="button"
                onClick={() => setActiveServiceModal(null)}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const sid = activeServiceModal.id;
                  setActiveServiceModal(null);
                  onStartBooking(sid);
                }}
                className="rounded-lg bg-[#5145cd] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4035b3]"
              >
                Book {activeServiceModal.id} Now
              </button>
            </>
          )
        }
      >
        {activeServiceModal && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <h3 className="font-semibold text-zinc-900">Who Should Use This Service</h3>
              <p className="text-zinc-600 mt-1">{activeServiceModal.intendedFor}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/55 p-3.5">
                <h4 className="font-semibold text-emerald-950 text-xs">What the Session Covers</h4>
                <ul className="mt-1.5 space-y-1 text-xs text-emerald-900 list-disc pl-4">
                  {activeServiceModal.scopeIncluded.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 bg-rose-50/55 p-3.5">
                <h4 className="font-semibold text-rose-950 text-xs">
                  What This Service Does Not Guarantee
                </h4>
                <ul className="mt-1.5 space-y-1 text-xs text-rose-900 list-disc pl-4">
                  {activeServiceModal.exclusions.map((e, idx) => (
                    <li key={idx}>{e}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 space-y-1 text-xs">
              <p>
                <strong>Expected Deliverable:</strong> {activeServiceModal.deliverableName}{" "}
                (delivered within 48h SLA)
              </p>
              <p>
                <strong>Cancellation & Complaint Policy:</strong> 100% refund when cancelled ≥1
                hour before start. Post-session quality issues reported within 48 hours qualify for
                an 80% refund when substantiated.
              </p>
            </div>
          </div>
        )}
      </StudentModal>

      {/* Mentor Public Profile Modal */}
      <StudentModal
        open={!!activeMentorModal}
        onClose={() => setActiveMentorModal(null)}
        title={activeMentorModal ? activeMentorModal.displayName : ""}
        subtitle={activeMentorModal ? `/mentors/${activeMentorModal.slug}` : ""}
        footer={
          activeMentorModal && (
            <button
              type="button"
              onClick={() => setActiveMentorModal(null)}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white"
            >
              Close Profile
            </button>
          )
        }
      >
        {activeMentorModal && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <p className="font-semibold text-zinc-900">{activeMentorModal.headline}</p>
              <p className="text-xs text-zinc-500">
                {activeMentorModal.experienceSummary} · {activeMentorModal.yearsOfExperience} yrs ·
                Speaks {activeMentorModal.languages.join(", ")}
              </p>
              <StudentStatusBadge label={activeMentorModal.verificationLabel} tone="success" />
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed bg-zinc-50 border border-zinc-200 rounded-xl p-3.5">
              {activeMentorModal.bio}
            </p>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                Approved Services — Click to Direct Book
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeMentorModal.approvedServiceIds.map((sid) => {
                  const svc = getServiceById(sid);
                  return (
                    <button
                      key={sid}
                      type="button"
                      onClick={() => {
                        const slug = activeMentorModal.slug;
                        setActiveMentorModal(null);
                        onStartBooking(sid, slug);
                      }}
                      className="text-left rounded-xl border border-zinc-200 hover:border-[#5145cd] bg-white p-3 flex items-center justify-between gap-2 transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-zinc-900">
                          {svc.id} · {svc.name}
                        </p>
                        <p className="text-[11px] text-zinc-500">{svc.durationMinutes} min</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#5145cd]">
                        {formatPaise(svc.listPricePaise)} →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              Verification labels confirm DreamX review of identity, experience, and service
              eligibility without implying employer endorsement.
            </p>
          </div>
        )}
      </StudentModal>

      {/* Clear Bundle Confirmation Modal */}
      <StudentModal
        open={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="Clear Custom Bundle Selections?"
        subtitle="You have unsaved bundle service selections."
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowClearConfirm(false)}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700"
            >
              Keep Selections
            </button>
            <button
              type="button"
              onClick={() => {
                onClearBundle();
                setShowClearConfirm(false);
              }}
              className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
            >
              Clear Bundle
            </button>
          </>
        }
      >
        <p className="text-xs text-zinc-600">
          Clearing removes your {bundleServiceIds.length} selected service(s) from the custom
          3-service bundle builder.
        </p>
      </StudentModal>
    </div>
  );
}
