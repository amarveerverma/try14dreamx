"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export default function MentorVerificationRedirectPage() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/mentor?tab=verification");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-2 border-[#5145cd] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
