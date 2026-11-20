"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { StudentPortalShell } from "@/components/student/StudentPortalShell";

function DashboardContent() {
  return <StudentPortalShell />;
}

export default function StudentDashboardPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen w-full bg-[#fafafa]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-[#5145cd] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold text-zinc-600 font-mono">
              Loading student workspace...
            </span>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </React.Suspense>
  );
}
