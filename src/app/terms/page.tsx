import * as React from "react";
import { Card } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eef2ff] text-[#5145cd] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Legal Agreement • India Jurisdiction</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-[#8b8b95]">Last updated: November 2026 • DreamX Technologies India Pvt Ltd</p>
      </div>

      <Card className="p-6 sm:p-10 bg-white border-[#e7e7eb] shadow-sm space-y-6 text-sm text-[#66666f] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#171717]">1. Acceptance of Terms</h2>
          <p>
            By accessing or using DreamX, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the platform. DreamX operates under the jurisdiction of the laws of India.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#171717]">2. Marketplace Nature & No Placement Guarantee</h2>
          <p>
            DreamX provides an outcome-accountable marketplace connecting students and candidates with verified industry mentors for diagnostic rubrics, interview preparation, and resume audits. DreamX does not offer, sell, or guarantee employment, job placements, or specific compensation outcomes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#171717]">3. Escrow & Contractual 48-Hour SLA</h2>
          <p>
            All marketplace fees are held in secure escrow. Mentors are contractually bound to provide verified sessions and deliver structured rubric reports within 48 hours of session conclusion. Failure to fulfill the deliverable results in automatic full refund to the candidate.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#171717]">4. Pricing & Taxes</h2>
          <p>
            All fees listed on DreamX are in Indian Rupees (INR, ₹) and are inclusive of applicable Goods and Services Tax (GST at 18%).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#171717]">5. Grievance Redressal</h2>
          <p>
            Pursuant to the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules 2021, grievances may be addressed to our designated Grievance Officer at <a href="mailto:grievance@dreamx.in" className="text-[#5145cd] underline">grievance@dreamx.in</a> with 24-hour acknowledgement and 15-day resolution.
          </p>
        </section>
      </Card>
    </div>
  );
}
