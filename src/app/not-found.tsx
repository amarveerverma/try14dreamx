import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, Home, BookOpen, ShieldCheck } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative w-full min-h-[calc(100vh-16rem)] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#5145cd]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fdf2f2] border border-[#ffdad6] text-xs font-semibold text-[#c43b3b]">
          <span className="w-2 h-2 rounded-full bg-[#c43b3b] animate-pulse" />
          <span>Error 404 • Resource Relocated or Inactive</span>
        </div>

        {/* Big 404 Graphic */}
        <div className="relative py-4 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-[#eef2ff] border border-[#e0e7ff] flex items-center justify-center text-[#5145cd] shadow-sm mb-4">
            <Compass className="w-10 h-10" />
          </div>
          <span className="text-8xl sm:text-9xl font-extrabold text-[#5145cd]/15 tracking-tighter absolute select-none pointer-events-none">
            404
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight relative">
            Lost your career track? <br />
            This route does not exist.
          </h1>
        </div>

        {/* Reassurance text */}
        <p className="text-sm sm:text-base text-[#66666f] leading-relaxed max-w-lg mx-auto">
          The requested link may have changed, the session slot has expired, or the URL was mistyped. Your diagnostic assessments, booking escrow credits, and active 48-hour deliverable SLAs remain fully safe.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <Link href="/">
            <Button size="lg" className="shadow-md">
              <Home className="w-4 h-4 mr-1" />
              <span>Return to Home</span>
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="outline" size="lg">
              <BookOpen className="w-4 h-4 mr-1" />
              <span>Browse Services (S01–S08)</span>
            </Button>
          </Link>
        </div>

        {/* Trust verification reassurance */}
        <div className="pt-6 border-t border-[#e7e7eb] flex items-center justify-center gap-6 text-xs text-[#66666f]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#16834a]" />
            100% Escrow Integrity Preserved
          </span>
          <span>•</span>
          <span>Asia/Kolkata Support SLA</span>
        </div>
      </div>
    </div>
  );
}
