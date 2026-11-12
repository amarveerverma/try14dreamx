"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

type SettingsTab = "profile" | "security" | "privacy" | "notifications" | "billing";

export default function CandidateAccountSettingsPage() {
  const { user, membership } = useAuth();
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("profile");

  // Form states
  const [fullName, setFullName] = React.useState(user?.name || "Aarav Sharma");
  const [phone, setPhone] = React.useState("+91 98765 43210");
  const [timezone, setTimezone] = React.useState("Asia/Kolkata (IST • UTC+05:30)");
  const [segmentTrack, setSegmentTrack] = React.useState("Early Career (0–2 YoE) Backend [PRD §8.2]");
  const [careerGoal, setCareerGoal] = React.useState("SDE-2 Distributed Systems @ Tier-1 GCC / Product Unicorn");
  const [targetComp, setTargetComp] = React.useState("₹32L – ₹44L CTC");

  // Privacy toggles
  const [privateProfile, setPrivateProfile] = React.useState(true);
  const [readinessSharing, setReadinessSharing] = React.useState(false);
  const [attendanceTelemetry, setAttendanceTelemetry] = React.useState(true);

  // Notifications
  const [notifyTransactional, setNotifyTransactional] = React.useState(true);
  const [notifySmartMatch, setNotifySmartMatch] = React.useState(true);
  const [notifyDeliverable, setNotifyDeliverable] = React.useState(true);
  const [notifyMarketing, setNotifyMarketing] = React.useState(false);

  // Modals & Feedback
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = React.useState("");

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleDownloadArchive = () => {
    const archiveData = {
      candidateId: user?.id || "DX-8419",
      name: fullName,
      email: user?.email || "aarav.sharma@techpulse.io",
      phone: phone,
      timezone: timezone,
      segment: segmentTrack,
      careerGoal: careerGoal,
      targetComp: targetComp,
      privacySettings: {
        profileVisibility: privateProfile ? "INCOGNITO" : "PUBLIC",
        readinessSharing: readinessSharing ? "OPTED_IN" : "RESTRICTED",
        sessionAttendanceTelemetry: attendanceTelemetry ? "ACTIVE" : "DISABLED",
      },
      retentionPolicy: "DPDP Act 2023 Compliant",
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(archiveData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DreamX_Candidate_Archive_${user?.id || "DX-8419"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      {/* Top Breadcrumb & Statutory Compliance Row */}
      <div className="w-full bg-surface-container-low border-b border-outline-variant/20 px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <nav className="flex items-center gap-2 text-on-surface-variant font-medium">
          <Link href="/dashboard" className="hover:text-primary transition-colors">
            Dashboard
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-semibold">Account &amp; Privacy Settings</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
            <span>DPDP ACT 2023 COMPLIANT (PRD §18.4)</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            <span>SECURITY LEVEL: RE-ENFORCED</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6">
        {/* Title & Primary Action Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight font-heading">
              Account, Security &amp; Privacy Settings
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
              Manage your personal profile, credentials, DPDP statutory rights, notification dispatch channels, and data retention schedules.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleDownloadArchive}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-semibold text-xs border border-outline-variant/30 shadow-xs hover:bg-surface-container transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
              <span>Download Archive (PRD §18.4)</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary-container text-on-primary font-bold text-xs shadow-xs hover:opacity-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* Save feedback banner */}
        {saveSuccess && (
          <div className="p-3.5 rounded-xl bg-secondary-container/40 border border-secondary/30 text-secondary text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>Settings saved successfully! Updated preferences have been applied across the platform.</span>
          </div>
        )}

        {/* Interactive Navigation Tabs */}
        <div className="bg-surface-container-low rounded-2xl p-1.5 border border-outline-variant/20 shadow-xs">
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "profile"
                  ? "bg-surface-container-lowest text-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">badge</span>
              <span>Profile &amp; Career Identity</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "security"
                  ? "bg-surface-container-lowest text-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">shield_lock</span>
              <span>Security &amp; Credentials</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("privacy")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "privacy"
                  ? "bg-surface-container-lowest text-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">gavel</span>
              <span>Privacy &amp; Data Rights (DPDP)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "notifications"
                  ? "bg-surface-container-lowest text-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">notifications_active</span>
              <span>Notification Channels</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("billing")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "billing"
                  ? "bg-surface-container-lowest text-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">credit_card</span>
              <span>Billing &amp; Memberships ({membership.tier === "elite" ? "Elite" : "Pro"})</span>
            </button>
          </div>
        </div>

        {/* Main Body Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Primary Content (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* SECTION 1: Candidate Identity & Target Vector */}
            {(activeTab === "profile" || activeTab === "billing") && (
              <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-outline-variant/10">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        PRD §4.1, §8.2 Scope
                      </span>
                      <h2 className="text-lg font-bold text-on-surface font-heading">
                        Candidate Identity &amp; Target Vector
                      </h2>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      <span>Identity Audited</span>
                    </span>
                  </div>

                  {/* Avatar & Identifier Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold text-lg shadow-xs shrink-0 font-heading">
                      {fullName.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="font-bold text-sm text-on-surface">{fullName}</span>
                        <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant text-[11px] font-mono font-semibold">
                          Candidate #{user?.id || "DX-8419"}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-secondary text-[16px]">domain_verification</span>
                        <span>{user?.email || "aarav.sharma@techpulse.io"} (Verified via Work Domain)</span>
                      </p>
                    </div>
                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => alert("Photo update will prompt standard biometric re-verification.")}
                        className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-colors"
                      >
                        Change Avatar
                      </button>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl bg-surface-container-low text-xs text-on-surface font-semibold border border-outline-variant/20 focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        Primary Contact Email
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="email"
                          readOnly
                          value={user?.email || "aarav.sharma@techpulse.io"}
                          className="w-full h-10 pl-3.5 pr-9 rounded-xl bg-surface-container text-xs text-on-surface font-medium cursor-not-allowed opacity-90 border border-outline-variant/20"
                        />
                        <span className="material-symbols-outlined text-secondary text-[18px] absolute right-3">lock</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        Phone Number
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full h-10 px-3.5 rounded-xl bg-surface-container-low text-xs text-on-surface font-semibold border border-outline-variant/20 focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary shadow-inner"
                        />
                        <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold shrink-0 whitespace-nowrap">
                          SMS Verified
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        Operating Timezone [PRD §1]
                      </label>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-xs text-on-surface font-semibold border border-outline-variant/20 focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
                      >
                        <option>Asia/Kolkata (IST • UTC+05:30)</option>
                        <option>Asia/Dubai (GST • UTC+04:00)</option>
                        <option>Asia/Singapore (SGT • UTC+08:00)</option>
                        <option>Europe/London (BST • UTC+01:00)</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        Current Track / Segment [PRD §8.2]
                      </label>
                      <input
                        type="text"
                        value={segmentTrack}
                        onChange={(e) => setSegmentTrack(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl bg-surface-container-low text-xs text-on-surface font-semibold border border-outline-variant/20 focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        Primary Career Goal
                      </label>
                      <input
                        type="text"
                        value={careerGoal}
                        onChange={(e) => setCareerGoal(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl bg-surface-container-low text-xs text-on-surface font-semibold border border-outline-variant/20 focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        Target Compensation Band
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={targetComp}
                          onChange={(e) => setTargetComp(e.target.value)}
                          className="w-full h-10 px-3.5 rounded-xl bg-surface-container-low text-xs text-on-surface font-bold border border-outline-variant/20 focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary shadow-inner"
                        />
                        <span className="absolute right-3 text-[11px] text-outline font-semibold">INR Annual</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3 bg-surface-container-low border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-on-surface-variant">Last modified by candidate: October 24, 2024 at 11:32 IST</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFullName("Aarav Sharma");
                      setCareerGoal("SDE-2 Distributed Systems @ Tier-1 GCC / Product Unicorn");
                      setTargetComp("₹32L – ₹44L CTC");
                    }}
                    className="text-primary font-bold hover:underline"
                  >
                    Revert to Audit Snapshot
                  </button>
                </div>
              </section>
            )}

            {/* SECTION 2: DPDP Statutory Privacy Controls & Evidence Visibility */}
            {(activeTab === "privacy" || activeTab === "profile") && (
              <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-outline-variant/10">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                        Statutory Rights (PRD §18.3, §18.4)
                      </span>
                      <h2 className="text-lg font-bold text-on-surface font-heading">
                        DPDP Compliance &amp; Dossier Privacy
                      </h2>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      <span>Indian DPDP Act 2023</span>
                    </div>
                  </div>

                  {/* Highlight Banner */}
                  <div className="p-4 rounded-xl bg-tertiary-fixed/30 border border-tertiary/20 mb-6 flex gap-3 items-start">
                    <span className="material-symbols-outlined text-tertiary text-[22px] shrink-0 mt-0.5">policy</span>
                    <div className="text-xs text-on-surface leading-relaxed">
                      <strong className="block mb-0.5">Strict Candidate Privacy Baseline (PRD §8.4)</strong>
                      Readiness scores and assessment telemetry are strictly private by default and never accessible to hiring partners or corporate recruiters without explicit, cryptographically signed opt-in approval.
                    </div>
                  </div>

                  {/* Privacy Toggles */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                      <div className="pr-4">
                        <span className="text-sm font-bold text-on-surface block mb-0.5">
                          Profile Visibility Vector
                        </span>
                        <p className="text-xs text-on-surface-variant">
                          Private / Incognito — Only approved vetted mentors with active paid bookings can view authorized assessment dossier.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrivateProfile(!privateProfile)}
                        className={`w-12 h-6 rounded-full p-0.5 transition-colors focus:outline-none shrink-0 ${
                          privateProfile ? "bg-primary-container" : "bg-surface-container-highest"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-surface-container-lowest shadow-sm transform transition-transform ${
                            privateProfile ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                      <div className="pr-4">
                        <span className="text-sm font-bold text-on-surface block mb-0.5">
                          Readiness Vector Sharing [PRD §8.4]
                        </span>
                        <p className="text-xs text-on-surface-variant">
                          Locked from prospective employers. Verification tokens require zero-knowledge cryptographic credential handshake.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setReadinessSharing(!readinessSharing)}
                        className={`w-12 h-6 rounded-full p-0.5 transition-colors focus:outline-none shrink-0 ${
                          readinessSharing ? "bg-primary-container" : "bg-surface-container-highest"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-surface-container-lowest shadow-sm transform transition-transform ${
                            readinessSharing ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
                      <div className="pr-4">
                        <span className="text-sm font-bold text-on-surface block mb-0.5">
                          Session Attendance Telemetry (PRD §12)
                        </span>
                        <p className="text-xs text-on-surface-variant">
                          Google Meet 90% attendance logging enabled for Escrow fund release verification and dispute arbitration protection.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttendanceTelemetry(!attendanceTelemetry)}
                        className={`w-12 h-6 rounded-full p-0.5 transition-colors focus:outline-none shrink-0 ${
                          attendanceTelemetry ? "bg-primary-container" : "bg-surface-container-highest"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-surface-container-lowest shadow-sm transform transition-transform ${
                            attendanceTelemetry ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Data Retention Policy Grid */}
                  <div className="mt-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-outline text-[16px]">history_toggle_off</span>
                      <span>Statutory Data Retention Schedule (PRD §18.3)</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                        <span className="text-[10px] text-on-surface-variant uppercase font-bold block">
                          Resumes &amp; Code Artifacts
                        </span>
                        <span className="text-sm font-bold text-on-surface">12 Months</span>
                        <span className="text-on-surface-variant text-[11px] block mt-0.5">
                          Purged 12 months after last login
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                        <span className="text-[10px] text-on-surface-variant uppercase font-bold block">
                          Verified Scorecards &amp; Rubrics
                        </span>
                        <span className="text-sm font-bold text-on-surface">Account Lifetime</span>
                        <span className="text-on-surface-variant text-[11px] block mt-0.5">
                          Immutable audit trail verification
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                        <span className="text-[10px] text-on-surface-variant uppercase font-bold block">
                          1:1 Session Video Recordings
                        </span>
                        <span className="text-sm font-bold text-error">Not Stored By Default</span>
                        <span className="text-on-surface-variant text-[11px] block mt-0.5">
                          Zero persistent audio/video logging (PRD §18.3)
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                        <span className="text-[10px] text-on-surface-variant uppercase font-bold block">
                          Financial &amp; Escrow Ledgers
                        </span>
                        <span className="text-sm font-bold text-on-surface">8 Years Statutory</span>
                        <span className="text-on-surface-variant text-[11px] block mt-0.5">
                          Mandated by Indian Accounting Standards
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Erasure / Deletion Notice */}
                  <div className="mt-6 p-4 rounded-xl bg-error-container/20 border border-error/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-error block">
                        Right to Erasure &amp; Dossier Purge (PRD §18.3)
                      </span>
                      <p className="text-xs text-on-surface-variant mt-0.5 max-w-xl">
                        Soft-delete triggered immediately upon request. All indexed personal data and code vectors are cryptographically purged within 30 days pursuant to DPDP statutory obligations.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeleteModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-error text-on-error text-xs font-bold shrink-0 shadow-xs hover:opacity-90"
                    >
                      Request Dossier Deletion
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* SECTION 4: Notification Channels */}
            {(activeTab === "notifications" || activeTab === "profile") && (
              <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-outline-variant/10">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        PRD §14.1, §14.2 Architecture
                      </span>
                      <h2 className="text-lg font-bold text-on-surface font-heading">
                        Notification &amp; SLA Dispatch Preferences
                      </h2>
                    </div>
                    <span className="text-xs font-mono text-on-surface-variant">Resend Engine v2.4</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-surface-container-low text-on-surface-variant font-bold uppercase border-b border-outline-variant/20">
                          <th className="py-2.5 px-4 rounded-l-lg">Event &amp; Dispatch Category</th>
                          <th className="py-2.5 px-4 text-center">In-App Hub</th>
                          <th className="py-2.5 px-4 text-center">Email (Resend)</th>
                          <th className="py-2.5 px-4 text-center rounded-r-lg">WhatsApp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        <tr className="hover:bg-surface-container-low/50">
                          <td className="py-3 px-4">
                            <span className="font-bold text-on-surface block">Transactional Confirmations &amp; Meet Links</span>
                            <span className="text-on-surface-variant text-[11px]">Calendar invites, escrow confirmations, Google Meet links</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => setNotifyTransactional(!notifyTransactional)}
                              aria-label="Toggle transactional email notifications"
                              className="focus:outline-none hover:scale-110 transition-transform cursor-pointer"
                            >
                              <span className={`material-symbols-outlined text-[20px] ${notifyTransactional ? "text-secondary" : "text-outline"}`}>
                                {notifyTransactional ? "check_circle" : "cancel"}
                              </span>
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[10px] font-bold">
                              Deferred (§14.2)
                            </span>
                          </td>
                        </tr>

                        <tr className="hover:bg-surface-container-low/50">
                          <td className="py-3 px-4">
                            <span className="font-bold text-on-surface block">Smart Match Wave Alerts &amp; Mentor Claims</span>
                            <span className="text-on-surface-variant text-[11px]">Notified when verified mentors accept custom requests</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => setNotifySmartMatch(!notifySmartMatch)}
                              aria-label="Toggle Smart Match alerts"
                              className="focus:outline-none hover:scale-110 transition-transform cursor-pointer"
                            >
                              <span className={`material-symbols-outlined text-[20px] ${notifySmartMatch ? "text-secondary" : "text-outline"}`}>
                                {notifySmartMatch ? "check_circle" : "cancel"}
                              </span>
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[10px] font-bold">
                              Deferred (§14.2)
                            </span>
                          </td>
                        </tr>

                        <tr className="hover:bg-surface-container-low/50">
                          <td className="py-3 px-4">
                            <span className="font-bold text-on-surface block">Deliverable Ready &amp; 48h SLA Alerts</span>
                            <span className="text-on-surface-variant text-[11px]">Async scorecard deliveries and SLA countdown milestones</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => setNotifyDeliverable(!notifyDeliverable)}
                              aria-label="Toggle deliverable alerts"
                              className="focus:outline-none hover:scale-110 transition-transform cursor-pointer"
                            >
                              <span className={`material-symbols-outlined text-[20px] ${notifyDeliverable ? "text-secondary" : "text-outline"}`}>
                                {notifyDeliverable ? "check_circle" : "cancel"}
                              </span>
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[10px] font-bold">
                              Deferred (§14.2)
                            </span>
                          </td>
                        </tr>

                        <tr className="hover:bg-surface-container-low/50">
                          <td className="py-3 px-4">
                            <span className="font-bold text-on-surface block">Marketing &amp; Promotional Announcements</span>
                            <span className="text-on-surface-variant text-[11px]">Cohort webinars, discount drives, platform updates</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="material-symbols-outlined text-outline text-[20px]">cancel</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => setNotifyMarketing(!notifyMarketing)}
                              aria-label="Toggle marketing announcements"
                              className="focus:outline-none hover:scale-110 transition-transform cursor-pointer"
                            >
                              <span className={`material-symbols-outlined text-[20px] ${notifyMarketing ? "text-secondary" : "text-outline"}`}>
                                {notifyMarketing ? "check_circle" : "cancel"}
                              </span>
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="material-symbols-outlined text-outline text-[20px]">cancel</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-surface-container-low flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-outline text-[18px]">info</span>
                    <span>
                      Notice: WhatsApp Interactive Dispatch is currently deferred per PRD §14.2 to preserve signal-to-noise ratio during initial cohort rollouts.
                    </span>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Security Telemetry & Subscription Billing (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* SECTION 5: Current Plan & Subscription Ledger (PRD §7.1, §7.3) */}
            <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Subscription Ledger
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 mb-4">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-bold text-base text-on-surface font-heading">
                    DreamX {membership.tier === "elite" ? "Elite" : "Pro"}
                  </span>
                  <span className="text-base font-black text-primary font-heading">
                    {membership.tier === "elite" ? "₹399" : "₹199"}
                    <span className="text-xs text-on-surface-variant font-normal"> / mo</span>
                  </span>
                </div>
                <span className="text-[11px] text-on-surface-variant block mb-3">
                  Billed automatically via Razorpay AutoPay
                </span>
                <div className="p-2.5 rounded-lg bg-surface-container-lowest flex items-center gap-2 mb-3 border border-outline-variant/10 text-xs">
                  <span className="material-symbols-outlined text-secondary text-[18px]">percent</span>
                  <span className="font-medium text-on-surface">5% Platform-Funded Discount on All 1:1 Services (PRD §7.3)</span>
                </div>
                <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1 border-t border-outline-variant/20">
                  <span>Next Renewal</span>
                  <span className="font-bold text-on-surface">November 12, 2024</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link href="/membership">
                  <button
                    type="button"
                    className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                    <span>Upgrade to Elite (10% Off • ₹399/mo)</span>
                  </button>
                </Link>
                <button
                  type="button"
                  onClick={() => alert("Redirecting to Razorpay AutoPay Mandate portal...")}
                  className="w-full py-2 rounded-xl bg-surface-container-low text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors"
                >
                  Manage Razorpay Mandate
                </button>
              </div>
            </section>

            {/* SECTION 3: Security & Session Telemetry (PRD §17.1, §18.1) */}
            <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs p-5">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-outline-variant/10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    PRD §17.1, §18.1
                  </span>
                  <h3 className="text-sm font-bold text-on-surface font-heading">
                    Credentials &amp; Access
                  </h3>
                </div>
                <span className="material-symbols-outlined text-secondary text-[20px]">security</span>
              </div>

              {/* Two Factor Status */}
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[16px]">lock_clock</span>
                    <span>Two-Factor Authentication</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
                    ENABLED
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  Google Authenticator / TOTP — Active since Oct 10, 2024.
                </p>
                <button
                  type="button"
                  onClick={() => alert("Displaying your encrypted 2FA backup codes...")}
                  className="mt-1.5 text-primary text-xs font-bold hover:underline"
                >
                  Configure Backup Keys
                </button>
              </div>

              {/* Connected Accounts */}
              <div className="mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                  Connected Accounts
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/10">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-outline text-[18px]">corporate_fare</span>
                      <div>
                        <span className="font-bold text-on-surface block leading-tight">Google Workspace (SSO)</span>
                        <span className="text-on-surface-variant text-[11px] block">{user?.email || "aarav.sharma@techpulse.io"}</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-secondary text-[18px]">link</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/10">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-outline text-[18px]">code</span>
                      <div>
                        <span className="font-bold text-on-surface block leading-tight">GitHub Integration</span>
                        <span className="text-on-surface-variant text-[11px] block">14 repos indexed for S06 vector</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-secondary text-[18px]">link</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/10">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-outline text-[18px]">account_box</span>
                      <div>
                        <span className="font-bold text-on-surface block leading-tight">LinkedIn Identity</span>
                        <span className="text-on-surface-variant text-[11px] block">Verified v3 Inbound Audit</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-secondary text-[18px]">link</span>
                  </div>
                </div>
              </div>

              {/* Active Sessions */}
              <div>
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Active Authorized Sessions
                  </span>
                  <span className="text-on-surface-variant font-mono">2 Logged In</span>
                </div>
                <div className="space-y-2 mb-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/10">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-on-surface">MacBook Pro 16&quot; • Chrome 129</span>
                      <span className="px-1.5 py-0.2 rounded bg-secondary-fixed text-on-secondary-fixed text-[9px] font-bold">
                        CURRENT
                      </span>
                    </div>
                    <span className="text-on-surface-variant text-[11px] block mt-0.5">
                      Bengaluru, India • IP: 49.37.192.12
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/10">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-on-surface">iPhone 15 Pro • Safari Mobile</span>
                      <span className="text-on-surface-variant text-[11px]">2h ago</span>
                    </div>
                    <span className="text-on-surface-variant text-[11px] block mt-0.5">
                      Bengaluru, India • IP: 49.37.192.89
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert("All other active sessions have been securely terminated.")}
                  className="w-full py-2 rounded-xl bg-surface-container-low text-error text-xs font-bold hover:bg-error-container/30 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Terminate All Other Sessions</span>
                </button>
              </div>
            </section>

            {/* Trust & Escrow Guarantee Stamp */}
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-[24px] shrink-0 mt-0.5">verified</span>
              <div className="text-xs text-on-surface-variant leading-relaxed">
                <span className="font-bold text-on-surface block mb-0.5">Automated Escrow Hold Guarantee</span>
                All mentorship booking funds remain in Razorpay Nodal Escrow until mentor completes 45+ min attendance log and candidate signs off on deliverable SLA (PRD §12).
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Footer */}
        <div className="py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant border-t border-outline-variant/20">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>Indian Information Technology (Intermediary Guidelines) Rules, 2021 Compliant</span>
            <span>•</span>
            <span>Grievance Redressal Officer: legal@dreamx.career</span>
            <span>•</span>
            <span>Razorpay Nodal Escrow Node: DX-IND-9021</span>
          </div>
          <div className="flex items-center gap-3 font-semibold">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-primary transition-colors">DPDP Inquiries</Link>
          </div>
        </div>
      </div>

      {/* DOSSIER PURGE / ERASURE CONFIRMATION MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl border border-outline-variant/30 shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-error">
                <span className="material-symbols-outlined text-[24px]">delete_forever</span>
                <h3 className="text-lg font-bold text-on-surface font-heading">
                  Request Dossier Purge (DPDP §18.3)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDeleteModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Under Section 18.3 of the Indian Digital Personal Data Protection Act, this request initiates an immediate soft-delete. All indexed personal data, resume parses, and code vectors will be cryptographically purged in 30 days.
            </p>

            <div className="p-3 rounded-xl bg-error-container/20 border border-error/30 text-xs text-error">
              To proceed, please type <strong className="font-mono font-bold">DELETE-DOSSIER</strong> below:
            </div>

            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="DELETE-DOSSIER"
              className="w-full h-10 px-3.5 rounded-xl bg-surface-container-low text-xs text-on-surface font-mono border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-error"
            />

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 rounded-xl border border-outline-variant/30 text-xs font-semibold hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmation !== "DELETE-DOSSIER"}
                onClick={() => {
                  setDeleteModal(false);
                  alert("Dossier erasure request submitted. Legal acknowledgment dispatched to your registered email.");
                }}
                className="px-4 py-2 rounded-xl bg-error text-on-error text-xs font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
              >
                Confirm Dossier Erasure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
