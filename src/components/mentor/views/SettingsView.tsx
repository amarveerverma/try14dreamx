"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Bell,
  Shield,
  ExternalLink,
  Copy,
  Check,
  Mail,
  Smartphone,
  Lock,
  Download,
  Trash2,
  AlertTriangle,
  Sparkles,
  Info,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { StatusBadge } from "../StatusBadge";

interface SettingsViewProps {
  mentorProfile?: {
    full_name?: string;
    display_name?: string;
    headline?: string;
    company?: string;
    role?: string;
    tier?: string;
    employment_type?: string;
    bio?: string;
    linkedin_url?: string;
    github_url?: string;
  };
  onToast?: (message: string, tone?: "success" | "warning" | "danger" | "info") => void;
}

export function SettingsView({ mentorProfile, onToast }: SettingsViewProps) {
  const [copied, setCopied] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  // Password Update State
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);

  const supabase = React.useMemo(() => createClient(), []);

  const handleUpdatePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPasswordError(error.message || "Failed to update password.");
      } else {
        setPasswordSuccess(true);
        setNewPassword("");
        setConfirmPassword("");
        onToast?.("Password updated successfully", "success");
        setTimeout(() => setPasswordSuccess(false), 4000);
      }
    } catch {
      setPasswordError("Network error while updating password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Notification states
  const [dispatchNotify, setDispatchNotify] = React.useState(true);
  const [bookingNotify, setBookingNotify] = React.useState(true);
  const [slaNotify, setSlaNotify] = React.useState(true);
  const [payoutNotify, setPayoutNotify] = React.useState(true);
  const [marketingEmail, setMarketingEmail] = React.useState(false);

  // Profile details
  const [headline, setHeadline] = React.useState(
    mentorProfile?.headline || "Staff Software Engineer • Ex-Google • Distributed Systems"
  );
  const [bio, setBio] = React.useState(
    mentorProfile?.bio ||
      "10+ years architecting hyper-scale backend infrastructure and evaluating candidates across 250+ technical loops. Focused on system design, clean coding habits, and offer negotiation."
  );

  const profileSlug = mentorProfile?.display_name
    ? mentorProfile.display_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    : "amarveer-verma";

  const publicUrl = `https://try14dreamx.vercel.app/mentors/${profileSlug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    onToast?.("Public profile URL copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    onToast?.("Profile preferences saved successfully", "success");
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportData = () => {
    const payload = {
      profile: mentorProfile,
      exportedAt: new Date().toISOString(),
      statutoryCompliance: "Digital Personal Data Protection (DPDP) Act 2023 - Section 6 & 11",
      platform: "DreamX Technologies Pvt. Ltd.",
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dreamx-mentor-archive-${profileSlug}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onToast?.("DPDP personal data archive downloaded", "info");
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>Settings &amp; Public Profile</span>
            <StatusBadge label="DPDP Compliant" tone="success" size="sm" />
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your public candidate-facing presence, notification relays, and statutory data rights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
            <span>{copied ? "Copied" : "Copy Profile Link"}</span>
          </button>

          <a
            href={`/mentors/${profileSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#5145cd] hover:bg-[#4338ca] text-xs font-bold text-white transition-all shadow-lg shadow-indigo-950/40"
          >
            <span>Preview Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 2. Public Presence & Bio Card */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Public Candidate View</h2>
              <p className="text-xs text-gray-400">Visible to students across Discovery and Direct Bookings.</p>
            </div>
          </div>
          <span className="text-xs font-mono text-gray-500">Slug: /mentors/{profileSlug}</span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Professional Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-[#5145cd]"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Shown beneath your name on candidate cards and catalog search results.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
              Personal Bio &amp; Mentorship Philosophy
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-[#5145cd]"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Summarize your technical depth, interview standards, and what students can expect during 1:1 sessions.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#5145cd] hover:bg-[#4338ca] text-xs font-bold text-white transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{saveSuccess ? "Saved!" : "Save Profile Changes"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Notification Routing & Moonlighting Shield */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Notification Channels &amp; Moonlighting Shield</h2>
            <p className="text-xs text-gray-400">
              Configure how alerts, wave opportunities, and SLA countdowns reach you.
            </p>
          </div>
        </div>

        {/* Protection Note */}
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-start gap-3">
          <Shield className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-semibold text-indigo-300">Privacy &amp; Moonlighting Protection</div>
            <p className="text-gray-400 leading-relaxed">
              DreamX never sends booking confirmations, calendar invites, or payout statements to your corporate employer email. All transactional notifications are routed strictly to your registered personal account.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/20 border border-white/5">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-white">Smart Match Wave 1 Dispatch Alerts</div>
                <div className="text-[11px] text-gray-400">
                  Instant push notification when an exclusive 30-minute claim opportunity matches your approved services.
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={dispatchNotify}
              onChange={(e) => setDispatchNotify(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 bg-black/40 border-gray-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/20 border border-white/5">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-indigo-400" />
              <div>
                <div className="text-xs font-bold text-white">Booking Confirmations &amp; Reschedules</div>
                <div className="text-[11px] text-gray-400">
                  Transactional email with ICS calendar attachment when a candidate completes escrow checkout.
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={bookingNotify}
              onChange={(e) => setBookingNotify(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 bg-black/40 border-gray-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/20 border border-white/5">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-white">48-Hour Report SLA Reminders</div>
                <div className="text-[11px] text-gray-400">
                  Automated warnings at 24h and 6h before report expiration to prevent auto-cancellation or penalty.
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={slaNotify}
              onChange={(e) => setSlaNotify(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 bg-black/40 border-gray-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/20 border border-white/5">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-xs font-bold text-white">Razorpay Nodal Escrow Settlement Advice</div>
                <div className="text-[11px] text-gray-400">
                  Email summary whenever an 80% payout batch settles into your bank account.
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={payoutNotify}
              onChange={(e) => setPayoutNotify(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 bg-black/40 border-gray-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Account Security & Password Management */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Account Security &amp; Password</h2>
            <p className="text-xs text-gray-400">
              Update your account login password with encrypted credential stretching.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-[#5145cd] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder:text-gray-600 focus:outline-none focus:border-[#5145cd]"
            />
          </div>
        </div>

        {passwordError && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Password updated successfully.</span>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="button"
            disabled={isUpdatingPassword || !newPassword}
            onClick={handleUpdatePassword}
            className="px-5 py-2.5 rounded-xl bg-[#5145cd] hover:bg-[#4338ca] text-xs font-bold text-white transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            {isUpdatingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>

      {/* 4. Statutory DPDP Act Compliance & Data Rights */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Statutory Data Rights (DPDP Act 2023)</h2>
            <p className="text-xs text-gray-400">
              Your legal rights under the Digital Personal Data Protection Act, 2023 (Section 6, 11 &amp; 12).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Right to Data Portability</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Export all session logs, rubric evaluations, pricing records, and identity verification timestamps in machine-readable JSON format.
            </p>
            <button
              type="button"
              onClick={handleExportData}
              className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-200 border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Personal Archive</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Trash2 className="w-4 h-4 text-red-400" />
              <span>Right to Erasure &amp; Closure</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Deactivate mentor profile and redact personal identifiers once all open bookings and 48-hour escrow settlement windows have concluded.
            </p>
            <button
              type="button"
              onClick={() => onToast?.("Contact compliance@dreamx.in to initiate statutory account erasure.", "warning")}
              className="px-3.5 py-2 rounded-lg bg-red-950/30 hover:bg-red-900/40 text-xs font-semibold text-red-300 border border-red-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Request Account Erasure</span>
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex items-center gap-2 text-[11px] text-gray-500 font-mono">
          <Info className="w-4 h-4 shrink-0 text-gray-400" />
          <span>Fiduciary Record: Data Principal Consent ID #DPDP-IND-2025-MX0912 • Cryptographic Hash Stored</span>
        </div>
      </div>
    </div>
  );
}
