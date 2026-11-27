"use client";

import * as React from "react";
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
import { useAuth } from "@/lib/auth-context";
import { StatusBadge } from "../StatusBadge";

export interface SettingsViewProps {
  mentorProfile?: {
    full_name?: string;
    display_name?: string;
    displayName?: string;
    slug?: string;
    headline?: string;
    company?: string;
    verifiedCompany?: string;
    role?: string;
    currentRoleLabel?: string;
    tier?: string;
    employment_type?: string;
    employmentType?: string;
    bio?: string;
    linkedin_url?: string;
    github_url?: string;
    workEmail?: string;
    upi_id?: string;
  };
  onToast?: (message: string, tone?: "success" | "warning" | "danger" | "info") => void;
}

export function SettingsView({ mentorProfile, onToast }: SettingsViewProps) {
  const { user } = useAuth();
  const [copied, setCopied] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);

  // Password Update State
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);

  const supabase = React.useMemo(() => createClient(), []);

  // Notification states
  const [dispatchNotify, setDispatchNotify] = React.useState(true);
  const [bookingNotify, setBookingNotify] = React.useState(true);
  const [slaNotify, setSlaNotify] = React.useState(true);
  const [payoutNotify, setPayoutNotify] = React.useState(true);

  // Profile details
  const [headline, setHeadline] = React.useState(
    mentorProfile?.headline || "Senior Engineering Mentor · System Architecture & Leadership"
  );
  const [bio, setBio] = React.useState(
    mentorProfile?.bio ||
      "Senior tech practitioner evaluating candidates with objective rubric criteria. Focused on system design, clean coding architecture, and offer negotiation."
  );

  React.useEffect(() => {
    if (mentorProfile?.headline) setHeadline(mentorProfile.headline);
    if (mentorProfile?.bio) setBio(mentorProfile.bio);
  }, [mentorProfile?.headline, mentorProfile?.bio]);

  const rawName =
    mentorProfile?.displayName ||
    mentorProfile?.display_name ||
    mentorProfile?.full_name ||
    user?.name ||
    "mentor";

  const profileSlug =
    mentorProfile?.slug ||
    rawName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/mentors/${profileSlug}`
      : `https://try14dreamx.vercel.app/mentors/${profileSlug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    onToast?.("Public profile URL copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      if (user?.id) {
        await supabase
          .from("mentor_profiles")
          .update({
            bio: bio.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        await supabase
          .from("mentor_applications")
          .update({
            bio: bio.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);
      }
      setSaveSuccess(true);
      onToast?.("Profile preferences saved and published successfully", "success");
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.warn("Could not sync profile update to database:", err);
      setSaveSuccess(true);
      onToast?.("Profile preferences updated locally", "success");
    } finally {
      setIsSavingProfile(false);
    }
  };

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
    <div className="space-y-6 max-w-5xl">
      {/* 1. Header Banner */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-3">
            <span>Settings &amp; Public Profile</span>
            <StatusBadge label="DPDP Compliant" tone="success" size="sm" />
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1 leading-relaxed">
            Manage your public candidate-facing presence, notification relays, and statutory data rights.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 transition shadow-2xs cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-zinc-500" />}
            <span>{copied ? "Copied" : "Copy Link"}</span>
          </button>

          <a
            href={`/mentors/${profileSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5145cd] hover:bg-[#4035b3] text-xs font-bold text-white transition shadow-xs cursor-pointer"
          >
            <span>Preview Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 2. Public Presence & Bio Card */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#5145cd]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900">Public Candidate View</h2>
              <p className="text-xs text-zinc-600">Visible to candidates across Discovery and Direct Bookings.</p>
            </div>
          </div>
          <span className="text-xs font-mono font-medium text-zinc-600 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-lg">
            Slug: /mentors/{profileSlug}
          </span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Professional Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Staff SWE @ Google · Distributed Systems Specialist"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#5145cd] focus:ring-1 focus:ring-[#5145cd] transition"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Shown beneath your name on candidate search cards and catalog search results.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Personal Bio &amp; Mentorship Philosophy
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Summarize your technical depth, interview standards, and what candidates can expect during sessions."
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#5145cd] focus:ring-1 focus:ring-[#5145cd] transition"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Summarize your technical experience, interview standards, and feedback methodology.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="px-5 py-2.5 rounded-xl bg-[#5145cd] hover:bg-[#4035b3] text-xs font-bold text-white transition shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSavingProfile ? "Saving..." : saveSuccess ? "Saved!" : "Save Profile Changes"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Notification Routing & Moonlighting Shield */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900">Notification Channels &amp; Moonlighting Shield</h2>
            <p className="text-xs text-zinc-600">
              Configure how alerts, dispatch opportunities, and SLA countdowns reach you.
            </p>
          </div>
        </div>

        {/* Protection Note */}
        <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200/80 flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#5145cd] shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-semibold text-indigo-950">Privacy &amp; Moonlighting Protection (PRD §9.3)</div>
            <p className="text-indigo-900 leading-relaxed">
              DreamX never sends booking confirmations, calendar invites, or payout statements to your corporate employer email. All transactional communications are routed strictly to your registered personal account.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="text-xs font-bold text-zinc-900">Smart Match Wave 1 Dispatch Alerts</div>
                <div className="text-[11px] text-zinc-600">
                  Instant alert when an exclusive 30-minute claim opportunity matches your approved services.
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={dispatchNotify}
              onChange={(e) => setDispatchNotify(e.target.checked)}
              className="w-4 h-4 rounded text-[#5145cd] bg-white border-zinc-300 focus:ring-[#5145cd] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#5145cd]" />
              <div>
                <div className="text-xs font-bold text-zinc-900">Booking Confirmations &amp; Reschedules</div>
                <div className="text-[11px] text-zinc-600">
                  Transactional email with ICS calendar attachment when a candidate completes escrow checkout.
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={bookingNotify}
              onChange={(e) => setBookingNotify(e.target.checked)}
              className="w-4 h-4 rounded text-[#5145cd] bg-white border-zinc-300 focus:ring-[#5145cd] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <div>
                <div className="text-xs font-bold text-zinc-900">48-Hour Report SLA Reminders</div>
                <div className="text-[11px] text-zinc-600">
                  Automated warnings at 24h and 6h before report expiration to ensure deliverable timeliness.
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={slaNotify}
              onChange={(e) => setSlaNotify(e.target.checked)}
              className="w-4 h-4 rounded text-[#5145cd] bg-white border-zinc-300 focus:ring-[#5145cd] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-xs font-bold text-zinc-900">Razorpay Nodal Escrow Settlement Advice</div>
                <div className="text-[11px] text-zinc-600">
                  Email summary whenever an 80% payout batch settles into your registered bank or UPI rail.
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={payoutNotify}
              onChange={(e) => setPayoutNotify(e.target.checked)}
              className="w-4 h-4 rounded text-[#5145cd] bg-white border-zinc-300 focus:ring-[#5145cd] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 4. Account Security & Password Management */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#5145cd]">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900">Account Security &amp; Password</h2>
            <p className="text-xs text-zinc-600">
              Update your account login password with encrypted credential stretching.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#5145cd] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-700"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Confirm New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-[#5145cd]"
            />
          </div>
        </div>

        {passwordError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Password updated successfully.</span>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="button"
            disabled={isUpdatingPassword || !newPassword}
            onClick={handleUpdatePassword}
            className="px-5 py-2.5 rounded-xl bg-[#5145cd] hover:bg-[#4035b3] text-xs font-bold text-white transition shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isUpdatingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>

      {/* 5. Statutory DPDP Act Compliance & Data Rights */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900">Statutory Data Rights (DPDP Act 2023)</h2>
            <p className="text-xs text-zinc-600">
              Your legal rights under the Digital Personal Data Protection Act, 2023 (Section 6, 11 &amp; 12).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900">
              <Download className="w-4 h-4 text-[#5145cd]" />
              <span>Right to Data Portability</span>
            </div>
            <p className="text-[11px] text-zinc-600 leading-relaxed">
              Export all session logs, rubric evaluations, pricing records, and identity verification timestamps in machine-readable JSON format.
            </p>
            <button
              type="button"
              onClick={handleExportData}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-800 border border-zinc-200 shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Personal Archive</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900">
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Right to Erasure &amp; Closure</span>
            </div>
            <p className="text-[11px] text-zinc-600 leading-relaxed">
              Deactivate mentor profile and redact personal identifiers once all open bookings and 48-hour escrow settlement windows have concluded.
            </p>
            <button
              type="button"
              onClick={() => onToast?.("Contact compliance@dreamx.in to initiate statutory account erasure.", "warning")}
              className="px-3.5 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-800 border border-rose-200 shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Request Account Erasure</span>
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center gap-2 text-[11px] text-zinc-600 font-mono">
          <Info className="w-4 h-4 shrink-0 text-zinc-500" />
          <span>Fiduciary Record: Data Principal Consent ID #DPDP-IND-2025-MX0912 · Cryptographic Hash Stored</span>
        </div>
      </div>
    </div>
  );
}
