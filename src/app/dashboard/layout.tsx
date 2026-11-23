"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // If inside standalone onboarding route, pass through
  if (pathname === "/dashboard/onboarding") {
    return <>{children}</>;
  }

  // Auth & Onboarding gate
  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (user.role === "mentor") {
        router.replace(user.onboarding_completed ? "/mentor" : "/mentor/onboarding");
      } else if (user.role === "admin") {
        router.replace("/admin");
      } else if (!user.onboarding_completed && pathname !== "/dashboard/onboarding") {
        const isCookieOnboarded = typeof document !== "undefined" && document.cookie.includes("dreamx_onboarded=true");
        if (!isCookieOnboarded) {
          router.replace("/dashboard/onboarding");
        }
      }
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-[#fafafa]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#5145cd] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-zinc-600 font-mono">
            Loading student portal...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-[#fafafa]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#5145cd] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-zinc-600 font-mono">
            Redirecting to sign-in...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
