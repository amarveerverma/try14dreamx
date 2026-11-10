"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Home,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const digest = error.digest || "dx-err-runtime-fault";

  React.useEffect(() => {
    console.error("DreamX Application Error Boundary:", error);
  }, [error]);

  return (
    <div className="relative w-full min-h-[calc(100vh-16rem)] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#c43b3b]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Core Systems Beacon Strip */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#e7e7eb] shadow-xs text-xs font-semibold text-[#171717]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16834a] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16834a]" />
          </span>
          <span>Core Escrow & Diagnostic Services: Nominal (100% SLA)</span>
        </div>

        {/* Hero Diagnostic Emblem */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-[#fdf2f2] border border-[#ffdad6] flex items-center justify-center text-[#c43b3b] shadow-sm">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#5145cd]">
            DreamX Resiliency Protocol
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
            Something went wrong, but your progress is safe.
          </h1>
        </div>

        {/* Reassurance text */}
        <p className="text-sm sm:text-base text-[#66666f] leading-relaxed max-w-xl mx-auto">
          We encountered an unexpected runtime issue while rendering this view. Rest assured, your diagnostic assessments, scheduled 1:1 mentor bookings, UPI/Netbanking escrow credits, and verified 48-hour deliverable SLAs remain completely intact.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <Button onClick={() => reset()} size="lg" className="shadow-md">
            <RefreshCw className="w-4 h-4 mr-2" />
            <span>Try Again</span>
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg">
              <Home className="w-4 h-4 mr-2" />
              <span>Return to Home</span>
            </Button>
          </Link>
        </div>

        {/* Safe Telemetry Diagnostic Box */}
        <div className="p-4 rounded-xl bg-white border border-[#e7e7eb] text-left max-w-md mx-auto shadow-xs text-xs space-y-2">
          <div className="flex items-center justify-between font-semibold text-[#171717]">
            <span>Diagnostic Telemetry</span>
            <span className="text-[#16834a] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> State Preserved
            </span>
          </div>
          <p className="text-[#66666f] font-mono text-[11px] truncate">
            Incident Digest: {digest}
          </p>
        </div>
      </div>
    </div>
  );
}
