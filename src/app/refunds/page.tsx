import * as React from "react";
import { Card } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function RefundsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef6e7] text-[#a7670b] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Consumer Protection & Escrow Policy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight">
          Cancellation & Refund Policy
        </h1>
        <p className="text-xs text-[#8b8b95]">Automated Escrow Disgorgement Protocol</p>
      </div>

      <Card className="p-6 sm:p-10 bg-white border-[#e7e7eb] shadow-sm space-y-6 text-sm text-[#66666f] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#171717]">1. 48-Hour SLA Guarantee</h2>
          <p>
            Mentors are required to deliver structured rubric feedback reports within 48 hours of session completion. If a mentor fails to submit the report within 48 hours, the session fee held in escrow is automatically and unconditionally refunded in full (100%) to the candidate&apos;s source payment method.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#171717]">2. Candidate Cancellation & Rescheduling</h2>
          <p>
            Candidates can reschedule a live session with at least 2 hours advance notice with zero penalty. Cancellations initiated with more than 12 hours notice receive a 100% refund. Cancellations between 2 and 12 hours notice receive an 80% refund (20% retained as mentor reservation compensation).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#171717]">3. Mentor No-Show Protection</h2>
          <p>
            If a mentor fails to join a scheduled live session within 10 minutes of start time, the session is canceled and the candidate receives an immediate 100% refund plus a 20% platform credit toward their next booking.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#171717]">4. Refund Settlement Timeframes</h2>
          <p>
            UPI refunds settle instantly or within 2 hours. NetBanking and debit/credit card refunds process within 2–4 banking days via our payment gateway partner.
          </p>
        </section>
      </Card>
    </div>
  );
}
