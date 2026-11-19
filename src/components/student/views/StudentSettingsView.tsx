"use client";

import * as React from "react";
import {
  User,
  ShieldCheck,
  CheckCircle2,
  Save,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { StudentModal } from "../ui/StudentModal";
import { StudentProfileData, CandidateSegment } from "../types";

export interface StudentSettingsViewProps {
  profile: StudentProfileData;
  onSaveProfile: (updatedProfile: StudentProfileData) => void;
  onOpenOnboarding: () => void;
  onPrivacyRequest: (requestType: string) => void;
}

export function StudentSettingsView({
  profile,
  onSaveProfile,
  onOpenOnboarding,
  onPrivacyRequest,
}: StudentSettingsViewProps) {
  const [formState, setFormState] = React.useState<StudentProfileData>(profile);
  const [showPrivacyModal, setShowPrivacyModal] = React.useState<boolean>(false);
  const [privacyRequestType, setPrivacyRequestType] = React.useState<string>(
    "Download Readiness & Booking Data Export"
  );
  const [savedSuccess, setSavedSuccess] = React.useState<boolean>(false);

  // Password Update State
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);

  const supabase = React.useMemo(() => createClient(), []);

  React.useEffect(() => {
    setFormState(profile);
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formState);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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
        setTimeout(() => setPasswordSuccess(false), 4000);
      }
    } catch {
      setPasswordError("Network error while updating password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">
            Student Profile, Artifacts & Privacy Settings
          </h1>
          <p className="mt-1 text-sm text-zinc-600 max-w-3xl">
            Manage your career goal, readiness segment, private career documents, notification
            channels, and DPDP data-retention rights.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenOnboarding}
          className="shrink-0 rounded-xl border border-indigo-200 bg-indigo-50/80 px-4 py-2.5 text-xs font-semibold text-[#4035b3] hover:bg-indigo-100"
        >
          Launch 6-Step Onboarding Wizard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile & Target Role Configuration */}
        <div className="lg:col-span-7 space-y-6">
          <section className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-semibold text-zinc-900 flex items-center gap-2 border-b border-zinc-200/80 pb-3">
              <User className="h-4 w-4 text-[#5145cd]" />
              Career Goal & Segment Configuration
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="st-fname" className="block text-xs font-semibold text-zinc-800">
                  First Name
                </label>
                <input
                  id="st-fname"
                  type="text"
                  required
                  value={formState.firstName}
                  onChange={(e) => setFormState({ ...formState, firstName: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
                />
              </div>
              <div>
                <label htmlFor="st-lname" className="block text-xs font-semibold text-zinc-800">
                  Last Name
                </label>
                <input
                  id="st-lname"
                  type="text"
                  required
                  value={formState.lastName}
                  onChange={(e) => setFormState({ ...formState, lastName: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="st-segment" className="block text-xs font-semibold text-zinc-800">
                  Career Stage (Controls Readiness Weights)
                </label>
                <select
                  id="st-segment"
                  value={formState.segment}
                  onChange={(e) =>
                    setFormState({ ...formState, segment: e.target.value as CandidateSegment })
                  }
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900"
                >
                  <option value="Student">Student</option>
                  <option value="Fresh graduate">Fresh graduate</option>
                  <option value="Early-career professional">Early-career professional</option>
                  <option value="Career switcher">Career switcher</option>
                </select>
              </div>

              <div>
                <label htmlFor="st-domain" className="block text-xs font-semibold text-zinc-800">
                  Target Domain (India MVP)
                </label>
                <select
                  id="st-domain"
                  value={formState.targetDomain}
                  onChange={(e) => setFormState({ ...formState, targetDomain: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900"
                >
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Data Science / AI">Data Science / AI</option>
                  <option value="Product Management">Product Management</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="st-role" className="block text-xs font-semibold text-zinc-800">
                Target Role
              </label>
              <input
                id="st-role"
                type="text"
                required
                value={formState.targetRole}
                onChange={(e) => setFormState({ ...formState, targetRole: e.target.value })}
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#5145cd]"
              />
            </div>

            <div>
              <label htmlFor="st-college" className="block text-xs font-semibold text-zinc-800">
                College / Institution / Current Organization
              </label>
              <input
                id="st-college"
                type="text"
                value={formState.collegeOrCompany}
                onChange={(e) =>
                  setFormState({ ...formState, collegeOrCompany: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900"
              />
            </div>

            <div>
              <label htmlFor="st-challenge" className="block text-xs font-semibold text-zinc-800">
                Primary Goal / Blocker Summary
              </label>
              <textarea
                id="st-challenge"
                rows={3}
                value={formState.primaryChallenge}
                onChange={(e) =>
                  setFormState({ ...formState, primaryChallenge: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900"
              />
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formState.portfolioNotApplicable}
                onChange={(e) =>
                  setFormState({ ...formState, portfolioNotApplicable: e.target.checked })
                }
                className="mt-0.5 accent-[#5145cd]"
              />
              <div className="text-xs">
                <span className="font-semibold text-zinc-900 block">
                  Mark Portfolio as Not Applicable (N/A)
                </span>
                <span className="text-zinc-600">
                  When enabled, Portfolio’s weight is proportionally redistributed across the other
                  7 dimensions.
                </span>
              </div>
            </label>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#5145cd] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#4035b3] transition-colors"
              >
                <Save className="h-4 w-4" />
                Save Profile Changes
              </button>
              {savedSuccess && (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Profile updated successfully
                </span>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Private Documents & Privacy Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Private Documents Card */}
          <section className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-semibold text-zinc-900 flex items-center gap-2 border-b border-zinc-200/80 pb-3">
              <Lock className="h-4 w-4 text-[#5145cd]" />
              Private Career Artifacts
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-xs font-semibold text-zinc-800 block mb-1">
                  Private Resume PDF
                </span>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-zinc-900">
                      {formState.resumeFileName ?? "No resume uploaded"}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Uploaded {formState.resumeUploadedAt ?? "Not available"}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Encrypted Storage
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="st-linkedin" className="block text-xs font-semibold text-zinc-800">
                  LinkedIn Profile URL
                </label>
                <input
                  id="st-linkedin"
                  type="url"
                  value={formState.linkedInUrl ?? ""}
                  onChange={(e) => setFormState({ ...formState, linkedInUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs"
                />
              </div>

              <div>
                <label htmlFor="st-github" className="block text-xs font-semibold text-zinc-800">
                  GitHub / Portfolio URL
                </label>
                <input
                  id="st-github"
                  type="url"
                  value={formState.portfolioUrl ?? ""}
                  onChange={(e) => setFormState({ ...formState, portfolioUrl: e.target.value })}
                  placeholder="https://github.com/username"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs"
                />
              </div>
            </div>
          </section>

          {/* Privacy & DPDP Retention Policy */}
          <section className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-semibold text-zinc-900 flex items-center gap-2 border-b border-zinc-200/80 pb-3">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Privacy & Retention Baseline (PRD 18.3)
            </h2>
            <ul className="space-y-1.5 text-xs text-zinc-600">
              <li className="flex justify-between py-1 border-b border-zinc-100">
                <span>Readiness score visibility</span>
                <strong className="text-zinc-900">Private by default</strong>
              </li>
              <li className="flex justify-between py-1 border-b border-zinc-100">
                <span>Uploaded resumes</span>
                <strong className="text-zinc-900">12 months post-activity</strong>
              </li>
              <li className="flex justify-between py-1 border-b border-zinc-100">
                <span>Session recordings</span>
                <strong className="text-zinc-900">Not stored by default</strong>
              </li>
              <li className="flex justify-between py-1">
                <span>Account deletion</span>
                <strong className="text-zinc-900">Soft-delete + 30d purge target</strong>
              </li>
            </ul>

            <button
              type="button"
              onClick={() => setShowPrivacyModal(true)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              Request Data Export or Account Deletion
            </button>
          </section>

          {/* Security & Password Management */}
          <section className="rounded-2xl border border-white/80 bg-white/94 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-semibold text-zinc-900 flex items-center gap-2 border-b border-zinc-200/80 pb-3">
              <KeyRound className="h-4 w-4 text-[#5145cd]" />
              Account Security &amp; Password
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-semibold text-zinc-800">
                  New Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-800">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs"
                />
              </div>

              {passwordError && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Password updated successfully.</span>
                </div>
              )}

              <button
                type="button"
                disabled={isUpdatingPassword || !newPassword}
                onClick={handleUpdatePassword}
                className="w-full rounded-xl bg-[#5145cd] hover:bg-[#4338ca] text-white px-3.5 py-2 text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isUpdatingPassword ? "Updating Password..." : "Update Password"}
              </button>
            </div>
          </section>
        </div>
      </form>

      {/* DPDP Privacy Request Modal */}
      <StudentModal
        open={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="Student Privacy & Data Rights Request"
        subtitle="Handled under DreamX DPDP privacy & lawful retention rules (PRD 18.3 & 18.4)."
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowPrivacyModal(false)}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (privacyRequestType === "Purge Stored Resume Artifact Immediately") {
                  onSaveProfile({
                    ...formState,
                    resumeFileName: null,
                    resumeUploadedAt: "Purged per student request",
                  });
                }
                onPrivacyRequest(privacyRequestType);
                setShowPrivacyModal(false);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#5145cd] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4035b3]"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Submit Privacy Request
            </button>
          </>
        }
      >
        <div className="space-y-3 text-xs sm:text-sm">
          <select
            value={privacyRequestType}
            onChange={(e) => setPrivacyRequestType(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm"
          >
            <option value="Download Readiness & Booking Data Export">
              Download Personal Data, Readiness History & Reports
            </option>
            <option value="Purge Stored Resume Artifact Immediately">
              Delete Stored Private Resume PDF
            </option>
            <option value="Account Soft-Delete & 30-Day Personal Data Purge">
              Account Soft-Delete (Lawful 8-yr payment & active-dispute exceptions apply)
            </option>
          </select>
          <p className="text-xs text-zinc-500">
            Statutory payment records (8 years), audit logs (3 years), and active dispute files are
            retained under documented legal exceptions and are not promised immediate deletion from
            immutable backups.
          </p>
        </div>
      </StudentModal>
    </div>
  );
}
