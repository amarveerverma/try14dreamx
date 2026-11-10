import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES } from "@/data/services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ShieldCheck,
  Timer,
  FileCheck,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Calendar,
  Lock,
} from "lucide-react";

export function generateStaticParams() {
  return SERVICES.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  // Calculate membership discounts
  const proPrice = Math.round(service.price * 0.95); // 5% discount
  const elitePrice = Math.round(service.price * 0.90); // 10% discount

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Breadcrumb Context Bar */}
      <section className="bg-white border-b border-[#e7e7eb] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#66666f]">
            <Link href="/" className="hover:text-[#5145cd]">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-[#5145cd]">Services</Link>
            <span>/</span>
            <span className="font-semibold text-[#171717]">{service.code}</span>
          </div>
          <span className="text-xs font-semibold text-[#16834a] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Escrow Protection Guaranteed
          </span>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Deep Dive (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-[#5145cd] bg-[#eef2ff] px-2.5 py-1 rounded-md">
                  {service.code}
                </span>
                <Badge variant="default">{service.category}</Badge>
                <Badge variant="success">{service.format}</Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight">
                {service.title}
              </h1>

              <p className="text-base text-[#66666f] leading-relaxed">
                {service.fullDescription}
              </p>
            </div>

            {/* Platform Delivery Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-4 bg-[#fafafc] border-[#e7e7eb] space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b8b95] block">
                  Session Duration
                </span>
                <span className="text-lg font-bold text-[#171717] flex items-center gap-1.5">
                  <Timer className="w-4 h-4 text-[#5145cd]" />
                  {service.duration}
                </span>
              </Card>

              <Card className="p-4 bg-[#fafafc] border-[#e7e7eb] space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b8b95] block">
                  Deliverable SLA
                </span>
                <span className="text-lg font-bold text-[#16834a] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#16834a]" />
                  {service.sla}
                </span>
              </Card>

              <Card className="p-4 bg-[#fafafc] border-[#e7e7eb] space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b8b95] block">
                  Delivery Format
                </span>
                <span className="text-lg font-bold text-[#171717] flex items-center gap-1.5 truncate">
                  <FileCheck className="w-4 h-4 text-[#2864c5]" />
                  {service.format.split(" ")[0]}
                </span>
              </Card>
            </div>

            {/* Deliverables Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#171717]">
                What You Will Receive
              </h2>
              <div className="p-5 rounded-2xl bg-white border border-[#e7e7eb] shadow-xs space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#ebf7ee] text-[#16834a] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#171717] block">
                      Contractual Deliverable
                    </span>
                    <p className="text-xs text-[#66666f] mt-0.5 leading-relaxed">
                      {service.deliverable}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#f7f7f8] space-y-2">
                  <span className="text-xs font-semibold text-[#171717] block">
                    Assessed Dimensions & Rubric:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {service.rubricCriteria.map((crit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#66666f] bg-[#f7f7f8] p-2.5 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5145cd]" />
                        <span>{crit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Prerequisites */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#171717]">
                Preparation & Prerequisites
              </h2>
              <div className="p-5 rounded-2xl bg-[#fafafc] border border-[#e7e7eb] space-y-2.5">
                <p className="text-xs text-[#66666f]">
                  To maximize session impact, please have the following ready upon booking:
                </p>
                <ul className="space-y-2 text-xs text-[#171717] font-medium">
                  {service.prerequisites.map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16834a]" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* What is NOT Guaranteed (PRD Requirement) */}
            <div className="p-5 rounded-2xl bg-[#fdf2f2] border border-[#ffdad6] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c43b3b]">
                <AlertCircle className="w-4 h-4" />
                <span>Scope Boundary Notice</span>
              </div>
              <p className="text-xs text-[#66666f] leading-relaxed">
                This service provides objective diagnostic assessment and expert feedback. It does not provide guaranteed job placements, direct referrals, or insider test answers. Full escrow refunds apply if the mentor fails the 48-hour SLA or does not attend.
              </p>
            </div>
          </div>

          {/* Right Column: Pricing & Booking Action Card (4 cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <Card className="p-6 bg-white border-[#e7e7eb] shadow-lg space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8b8b95] block">
                  Fixed Service Fee
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-[#171717] tnum">
                    ₹{service.price}
                  </span>
                  <span className="text-xs text-[#66666f]">incl. 18% GST</span>
                </div>
              </div>

              {/* DreamX Club Member Pricing */}
              <div className="p-3.5 rounded-xl bg-[#eef2ff] border border-[#e0e7ff] space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-[#5145cd]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    DreamX Club Members
                  </span>
                  <span>5%–10% OFF</span>
                </div>
                <div className="space-y-1 text-[#66666f]">
                  <div className="flex justify-between">
                    <span>Pro Member Price:</span>
                    <strong className="text-[#171717]">₹{proPrice}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Elite Member Price:</span>
                    <strong className="text-[#171717]">₹{elitePrice}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link href="/signup" className="w-full block">
                  <Button size="lg" className="w-full shadow-md">
                    <span>Book with Verified Mentor</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/signup" className="w-full block">
                  <Button variant="outline" size="md" className="w-full">
                    <span>Smart Match (3 Mentors in 30m)</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Details */}
              <div className="pt-4 border-t border-[#f7f7f8] space-y-2 text-xs text-[#66666f]">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#16834a]" />
                  <span>UPI, NetBanking & Cards Supported</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#5145cd]" />
                  <span>Reschedule allowed up to 2h before</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2864c5]" />
                  <span>Automatic 1h cancellation refund</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
