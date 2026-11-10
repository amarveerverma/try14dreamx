"use client";

import * as React from "react";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Settings,
  ShieldCheck,
  Download,
  Trash2,
} from "lucide-react";

export default function StudentSettingsPage() {
  const { user, membership } = useAuth();
  const [downloadSuccess, setDownloadSuccess] = React.useState(false);

  const handleExportData = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5145cd]">
          <Settings className="w-3.5 h-3.5" />
          <span>Profile &amp; Statutory Compliance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
          Account Settings &amp; Privacy Controls
        </h1>
        <p className="text-xs sm:text-sm text-[#66666f]">
          Manage your account profile, communication preferences, and exercise DPDP Act 2023 data rights.
        </p>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-xl bg-[#ebf7ee] border border-[#94f7b2] text-xs font-bold text-[#006d3a] text-center">
          DPDP Data Export requested: Your full audit archive will be emailed within 15 minutes.
        </div>
      )}

      {/* Account Info */}
      <Card className="p-6 bg-white border-[#e7e7eb] shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#171717]">Candidate Profile Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#171717]">Display Name</label>
            <Input value={user?.name || "Candidate"} disabled className="h-10 text-sm bg-[#fafafc]" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#171717]">Registered Email</label>
            <Input value={user?.email || "candidate@dreamx.in"} disabled className="h-10 text-sm bg-[#fafafc]" />
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 text-xs text-[#8b8b95]">
          <span>Current Membership: <strong className="text-[#171717]">{membership.tier.toUpperCase()} Plan</strong></span>
          <span>Timezone: <strong className="text-[#171717]">Asia/Kolkata (IST)</strong></span>
        </div>
      </Card>

      {/* DPDP Act 2023 Statutory Compliance Box */}
      <Card className="p-6 bg-white border-[#e7e7eb] shadow-sm space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#16834a]" />
            <h2 className="text-base font-bold text-[#171717]">DPDP Act 2023 Data Principal Rights</h2>
          </div>
          <p className="text-xs text-[#66666f]">
            Under the Digital Personal Data Protection Act 2023 (India), you have the right to access, export, or request irreversible erasure of your personal career data.
          </p>
        </div>

        <div className="space-y-4 text-xs">
          {/* Data Export */}
          <div className="p-4 rounded-xl bg-[#fafafc] border border-[#e7e7eb] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-sm text-[#171717] block">Export All Diagnostic &amp; Session Records</span>
              <span className="text-[#66666f]">Download full JSON/CSV export of scores, reviews, and escrow transactions.</span>
            </div>
            <Button size="sm" variant="outline" onClick={handleExportData}>
              <Download className="w-3.5 h-3.5 mr-1" />
              <span>Request Export</span>
            </Button>
          </div>

          {/* Grievance Officer */}
          <div className="p-4 rounded-xl bg-[#fafafc] border border-[#e7e7eb] space-y-1">
            <span className="font-bold text-sm text-[#171717] block">Statutory Grievance Redressal</span>
            <p className="text-[#66666f]">
              Designated Grievance Officer under Indian IT Rules 2021: <br />
              <strong className="text-[#171717]">grievance@dreamx.in</strong> • Legal Entity: DreamX Technologies India Pvt. Ltd. (Bengaluru, Karnataka)
            </p>
          </div>

          {/* Account Deletion */}
          <div className="p-4 rounded-xl bg-[#fdf2f2] border border-[#ffdad6] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-sm text-[#c43b3b] block">Irreversible Data Erasure</span>
              <span className="text-[#66666f]">Permanently delete your candidate profile, scorecards, and resumes from cloud vaults.</span>
            </div>
            <Button size="sm" variant="danger">
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              <span>Delete Account</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
