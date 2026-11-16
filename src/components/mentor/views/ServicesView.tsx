"use client";

import * as React from "react";
import {
  Clock,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Lock,
  Layers,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import {
  ServiceApproval,
  ServiceDefinition,
  SERVICES_CATALOGUE,
  formatINR,
  getToneForStatus,
} from "../types";
import { StatusBadge } from "../StatusBadge";
import { MentorModal } from "../MentorModal";

interface ServicesViewProps {
  isApplicantMode: boolean;
  serviceApprovals: ServiceApproval[];
  onToggleServiceSetting: (serviceId: string, settingKey: "activeForBookings" | "directBookingEnabled" | "smartMatchEnabled") => void;
  onNavigate: (route: string) => void;
}

export function ServicesView({
  isApplicantMode,
  serviceApprovals,
  onToggleServiceSetting,
  onNavigate,
}: ServicesViewProps) {
  const [activeTab, setActiveTab] = React.useState<"all" | "approved" | "pending" | "unrequested">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [inspectModalService, setInspectModalService] = React.useState<ServiceDefinition | null>(null);

  const approvalMap = React.useMemo(() => {
    return new Map(serviceApprovals.map((s) => [s.serviceId, s]));
  }, [serviceApprovals]);

  const filteredServices = SERVICES_CATALOGUE.filter((service) => {
    const approval = approvalMap.get(service.id);
    const effectiveStatus = approval
      ? isApplicantMode && approval.status === "Approved"
        ? "Under review"
        : approval.status
      : "Not requested";

    if (activeTab === "approved" && effectiveStatus !== "Approved") return false;
    if (
      activeTab === "pending" &&
      !["Submitted", "Under review", "More information required", "Rejected"].includes(effectiveStatus)
    ) {
      return false;
    }
    if (activeTab === "unrequested" && approval) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        service.id.toLowerCase().includes(q) ||
        service.name.toLowerCase().includes(q) ||
        service.category.toLowerCase().includes(q) ||
        service.shortOutcome.toLowerCase().includes(q)
      );
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Card */}
      <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              My Services &amp; Deliverable Scope
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
              Standardized 1:1 career services from the DreamX India catalogue (S01–S10). Only services with{" "}
              <span className="font-semibold text-zinc-800">Approved</span> status can accept paid Direct or Smart Match bookings.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("verification")}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors shadow-2xs"
          >
            <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
            <span>Manage Service Approvals</span>
          </button>
        </div>

        {/* Pricing Guard Notice */}
        <div className="mt-4 rounded-xl border border-indigo-200/80 bg-indigo-50/55 px-4 py-3 flex items-start gap-3">
          <BookOpen className="h-4 w-4 text-[#5145cd] shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-700 leading-relaxed">
            <span className="font-semibold text-zinc-900">Server-Authoritative Pricing (PRD §6.2 &amp; §7.3):</span>{" "}
            Listed INR prices below are stored in integer paise. Student Pro (5%), Elite (10%), and Custom 3-Service Bundle (5%) discounts are fully funded by DreamX. Your calculated mentor payout basis is never reduced.
          </p>
        </div>

        {/* Status Filter Tabs & Search Bar */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: `All Catalogue (${SERVICES_CATALOGUE.length})` },
              { id: "approved", label: "Approved" },
              { id: "pending", label: "Pending / Action Needed" },
              { id: "unrequested", label: "Available to Apply" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#5145cd] text-white shadow-2xs"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="h-4 w-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter S01–S10 services..."
              className="w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 py-1.5 text-xs text-zinc-900 focus:border-[#5145cd] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Service Cards Grid */}
      {filteredServices.length === 0 ? (
        <div className="rounded-2xl border border-white/80 bg-white/92 p-10 text-center">
          <p className="text-sm font-semibold text-zinc-800">No matching services found</p>
          <p className="mt-1 text-xs text-zinc-500">
            Clear your search query or switch status tabs to inspect the full S01–S10 catalogue.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredServices.map((service) => {
            const approval = approvalMap.get(service.id);
            const status = approval
              ? isApplicantMode && approval.status === "Approved"
                ? "Under review"
                : approval.status
              : "Not requested";
            const isApproved = status === "Approved";

            return (
              <article
                key={service.id}
                className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#5145cd] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/70">
                          {service.id}
                        </span>
                        <span className="text-xs font-medium text-zinc-500">{service.category}</span>
                      </div>
                      <h2 className="mt-1.5 text-base font-semibold text-zinc-900">{service.name}</h2>
                    </div>
                    <StatusBadge label={status} tone={getToneForStatus(status)} />
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed">{service.shortOutcome}</p>

                  <div className="grid grid-cols-3 gap-2 rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-3 text-xs">
                    <div>
                      <span className="text-[11px] text-zinc-500 block">Duration</span>
                      <span className="font-semibold text-zinc-900 flex items-center gap-1 mt-0.5 tabular-nums">
                        <Clock className="h-3.5 w-3.5 text-zinc-400" />
                        {service.durationMinutes} min
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-zinc-500 block">List Price</span>
                      <span className="font-semibold text-zinc-900 mt-0.5 block tabular-nums">
                        {formatINR(service.listPricePaise)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-zinc-500 block">Report SLA</span>
                      <span className="font-semibold text-zinc-900 mt-0.5 block">
                        Within {service.reportSlaHours}h
                      </span>
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="text-zinc-700">
                      <span className="font-semibold text-zinc-900">Deliverable:</span>{" "}
                      {service.deliverableName}
                    </p>
                    <p className="text-zinc-500">
                      <span className="font-medium text-zinc-700">Mapped Readiness Dimensions:</span>{" "}
                      {service.mappedDimensions.join(", ")}
                    </p>
                  </div>

                  {approval?.reviewerNote && !isApproved && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-2 text-xs text-amber-950">
                      <span className="font-semibold">Status reason: </span>
                      {approval.reviewerNote}
                    </div>
                  )}
                </div>

                {/* Offering Controls / Status Actions */}
                <div className="pt-3.5 border-t border-zinc-200/80 space-y-3">
                  {isApproved && approval ? (
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onToggleServiceSetting(service.id, "activeForBookings")}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold border transition-colors ${
                            approval.activeForBookings
                              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                              : "bg-zinc-100 border-zinc-200 text-zinc-600"
                          }`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>{approval.activeForBookings ? "Offering Active" : "Paused"}</span>
                        </button>

                        {service.bookingModes.includes("Direct") && (
                          <button
                            type="button"
                            disabled={!approval.activeForBookings}
                            onClick={() => onToggleServiceSetting(service.id, "directBookingEnabled")}
                            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-colors disabled:opacity-50 ${
                              approval.directBookingEnabled && approval.activeForBookings
                                ? "bg-indigo-50 border-indigo-200 text-[#4035b3]"
                                : "bg-white border-zinc-200 text-zinc-500"
                            }`}
                          >
                            Direct: {approval.directBookingEnabled ? "On" : "Off"}
                          </button>
                        )}

                        {service.bookingModes.includes("Smart Match") && (
                          <button
                            type="button"
                            disabled={!approval.activeForBookings}
                            onClick={() => onToggleServiceSetting(service.id, "smartMatchEnabled")}
                            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-colors disabled:opacity-50 ${
                              approval.smartMatchEnabled && approval.activeForBookings
                                ? "bg-indigo-50 border-indigo-200 text-[#4035b3]"
                                : "bg-white border-zinc-200 text-zinc-500"
                            }`}
                          >
                            Smart Match: {approval.smartMatchEnabled ? "On" : "Off"}
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setInspectModalService(service)}
                        className="text-xs font-semibold text-[#5145cd] hover:text-[#4035b3]"
                      >
                        Scope &amp; Rubric
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-zinc-500">
                        {status === "Not requested"
                          ? "Requires qualification approval"
                          : "Locked for paid bookings until approved"}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setInspectModalService(service)}
                          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                        >
                          Inspect Rubric
                        </button>
                        {(status === "Not requested" || status === "More information required") && (
                          <button
                            type="button"
                            onClick={() => onNavigate("verification")}
                            className="rounded-lg bg-[#5145cd] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#4035b3]"
                          >
                            {status === "Not requested" ? "Apply" : "Respond"}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Scope & Rubric Inspection Modal */}
      <MentorModal
        open={!!inspectModalService}
        onClose={() => setInspectModalService(null)}
        title={inspectModalService ? `${inspectModalService.id} — ${inspectModalService.name}` : ""}
        subtitle={
          inspectModalService
            ? `${inspectModalService.durationMinutes} min · Listed ${formatINR(inspectModalService.listPricePaise)} · 48-hour report SLA`
            : ""
        }
        footer={
          <button
            type="button"
            onClick={() => setInspectModalService(null)}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
          >
            Close Specification
          </button>
        }
      >
        {inspectModalService && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <h3 className="font-semibold text-zinc-900">Intended Candidate &amp; Target Persona</h3>
              <p className="text-zinc-600 mt-1">{inspectModalService.intendedFor}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5">
                <h4 className="font-semibold text-emerald-950 text-xs">Scope Included</h4>
                <ul className="mt-1.5 space-y-1 text-xs text-emerald-900 list-disc pl-4">
                  {inspectModalService.scopeIncluded.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3.5">
                <h4 className="font-semibold text-rose-950 text-xs">Explicit Exclusions (PRD §2.5)</h4>
                <ul className="mt-1.5 space-y-1 text-xs text-rose-900 list-disc pl-4">
                  {inspectModalService.exclusions.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-zinc-900 flex items-center gap-1.5 text-xs sm:text-sm">
                <Layers className="h-4 w-4 text-[#5145cd]" />
                <span>Service-Specific Rubric Criteria ({inspectModalService.deliverableName})</span>
              </h4>
              <div className="mt-2 space-y-2">
                {inspectModalService.rubricCriteria.map((c) => (
                  <div key={c.id} className="rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5">
                    <p className="text-xs font-semibold text-zinc-900">{c.label}</p>
                    <p className="text-xs text-zinc-600 mt-0.5">{c.guidance}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </MentorModal>
    </div>
  );
}
