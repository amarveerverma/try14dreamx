"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function MentorWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // If in the onboarding wizard, render standalone
  if (pathname === "/mentor/onboarding") {
    return <>{children}</>;
  }

  // Auth and Mentor Role Gate
  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace(`/login?role=mentor&redirect=${encodeURIComponent(pathname)}`);
      } else if (user.role !== "mentor" && user.role !== "admin") {
        router.replace("/mentor/onboarding?notice=apply_as_mentor");
      }
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#0d0e15] text-white">
        <div className="w-10 h-10 border-3 border-[#5145cd] border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs font-semibold text-gray-400 font-mono">
          Verifying Mentor Credentials...
        </span>
      </div>
    );
  }

  if (!user || (user.role !== "mentor" && user.role !== "admin")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#0d0e15] text-white">
        <div className="w-10 h-10 border-3 border-[#5145cd] border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs font-semibold text-gray-400 font-mono">
          Redirecting to authentication...
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
