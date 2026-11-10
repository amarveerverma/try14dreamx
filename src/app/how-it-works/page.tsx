import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Target,
  BarChart3,
  Users,
  FileCheck,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      icon: Target,
      title: "Define Your Target Role & Goal",
      description: "Tell us where you are today and where you want to go — whether it's switching from service to product, cracking SDE-2 at Swiggy, or breaking into AI engineering.",
      detail: "Goal-first intake maps your intent directly to recommended services instead of making you guess.",
      color: "bg-[#eef2ff] text-[#5145cd]",
    },
    {
      num: "02",
      icon: BarChart3,
      title: "8-Dimension Readiness Assessment",
      description: "Benchmark your profile across 8 concrete axes: Resume Quality, Technical Depth, System Architecture, Proof of Work, Communication, Interview Readiness, Career Strategy, and Executive Composure.",
      detail: "Objective 0–5 anchors pinpoint your exact blind spots before you sit in high-stakes interviews.",
      color: "bg-[#ebf7ee] text-[#16834a]",
    },
    {
      num: "03",
      icon: Users,
      title: "Match with a Verified Practitioner",
      description: "Choose your mentor directly from Google, Microsoft, and top Indian unicorns, or trigger our Smart Match engine for automated dispatch.",
      detail: "Every mentor is identity-verified with audited corporate credentials. Zero unvetted profiles.",
      color: "bg-[#eef4fd] text-[#2864c5]",
    },
    {
      num: "04",
      icon: FileCheck,
      title: "1:1 Live Session & 48h Rubric Report",
      description: "Complete an intense, time-boxed 1:1 simulation or async teardown. Within 48 hours, receive an official rubric scorecard with annotated action items.",
      detail: "Protected by 100% deliverable escrow. If the SLA is missed, your session is automatically refunded.",
      color: "bg-[#fef6e7] text-[#a7670b]",
    },
    {
      num: "05",
      icon: TrendingUp,
      title: "Track Progression to Offer Readiness",
      description: "Watch your readiness score climb as you complete milestones. Re-evaluate quarterly and unlock direct hiring partner visibility.",
      detail: "Progress is backed by evidence and verified rubric logs, never artificial score inflation.",
      color: "bg-[#fdf2f2] text-[#c43b3b]",
    },
  ];

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Top Breadcrumb Bar */}
      <section className="bg-white border-b border-[#e7e7eb] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#66666f]">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#5145cd]">Home</Link>
            <span>/</span>
            <span className="font-semibold text-[#171717]">How It Works</span>
          </div>
          <span className="text-xs font-semibold text-[#16834a] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Outcome-Accountable Methodology
          </span>
        </div>
      </section>

      {/* Hero Header */}
      <section className="bg-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#e7e7eb]">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <Badge variant="default">The DreamX Guided Career Pathway</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171717] tracking-tight">
            How DreamX Turns Career Goals into Measurable Offers
          </h1>
          <p className="text-base sm:text-lg text-[#66666f] max-w-2xl mx-auto leading-relaxed">
            From initial readiness assessment to verified 1:1 simulation and contractual 48-hour deliverable reports. Here is how our 5-step engine works.
          </p>
        </div>
      </section>

      {/* 5-Step Visual Pathway */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 w-full">
        <div className="space-y-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.num}
                className="p-6 sm:p-8 bg-white border-[#e7e7eb] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  {/* Step Emblem */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${step.color} shadow-xs`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Step Description */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#8b8b95]">
                        STEP {step.num}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-[#171717]">
                      {step.title}
                    </h2>

                    <p className="text-sm text-[#66666f] leading-relaxed">
                      {step.description}
                    </p>

                    <div className="p-3 rounded-xl bg-[#fafafc] border border-[#e7e7eb] text-xs text-[#171717] font-medium flex items-center gap-2 mt-3">
                      <CheckCircle className="w-4 h-4 text-[#16834a] shrink-0" />
                      <span>{step.detail}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 text-center space-y-4 p-10 rounded-3xl bg-[#1e1b4b] text-white">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to begin with Step 01?
          </h2>
          <p className="text-sm text-[#e0e7ff]/80 max-w-md mx-auto">
            Take the 5-minute career intake quiz and unlock your personalized service recommendations.
          </p>
          <div className="pt-2">
            <Link href="/signup">
              <Button size="lg" className="bg-[#5145cd] text-white hover:bg-[#4035b3] shadow-lg">
                <span>Start Free Assessment</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
