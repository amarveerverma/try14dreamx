"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Timer,
  BarChart3,
  Layers,
  FileCheck,
  Users,
} from "lucide-react";

export default function Home() {
  const [selectedAxis, setSelectedAxis] = React.useState(0);

  const readinessAxes = [
    {
      id: "axis-01",
      number: "Axis 01",
      name: "Resume Quality",
      summary: "ATS formatting & impact metrics",
      rubric: [
        {
          score: "0–1",
          level: "Needs Fundamental Rebuild",
          desc: "Generic duty descriptions, broken ATS column formatting, zero verified metrics or repository proof.",
          color: "bg-[#fdf2f2] text-[#c43b3b]",
        },
        {
          score: "2–3",
          level: "Moderate Industry Standard",
          desc: "Single-column structure, standard action verbs present, but lacks clear Context-Action-Result framing.",
          color: "bg-[#f7f7f8] text-[#171717]",
        },
        {
          score: "4–5",
          level: "Top 5% Unicorn & Tier-1 Ready",
          desc: "X-Y-Z formula in every bullet point, verified production links, 90%+ ATS confidence score.",
          color: "bg-[#ebf7ee] text-[#16834a]",
        },
      ],
    },
    {
      id: "axis-02",
      number: "Axis 02",
      name: "Technical Depth",
      summary: "DSA, system design, core logic",
      rubric: [
        {
          score: "0–1",
          level: "Surface Level Understanding",
          desc: "Basic syntax knowledge without time/space complexity intuition; struggles with boundary conditions.",
          color: "bg-[#fdf2f2] text-[#c43b3b]",
        },
        {
          score: "2–3",
          level: "Working Competency",
          desc: "Solves standard Medium LeetCode problems; understands caching and DB indexing at baseline.",
          color: "bg-[#f7f7f8] text-[#171717]",
        },
        {
          score: "4–5",
          level: "High-Scale Architect",
          desc: "Defends trade-offs across CAP theorem, distributed consensus, concurrency, and performance bottlenecks.",
          color: "bg-[#ebf7ee] text-[#16834a]",
        },
      ],
    },
    {
      id: "axis-03",
      number: "Axis 03",
      name: "Interview Execution",
      summary: "STAR storytelling & live breakdown",
      rubric: [
        {
          score: "0–1",
          level: "Disorganized Communication",
          desc: "Rambles without structure; does not clarify ambiguous problem statements before jumping to code.",
          color: "bg-[#fdf2f2] text-[#c43b3b]",
        },
        {
          score: "2–3",
          level: "Functional Communicator",
          desc: "Answers directly and follows hints; STAR method used but lacks executive punch or failure retrospectives.",
          color: "bg-[#f7f7f8] text-[#171717]",
        },
        {
          score: "4–5",
          level: "Executive Alignment",
          desc: "Drives discussion like an internal tech lead; vocalizes thought process with composure under pressure.",
          color: "bg-[#ebf7ee] text-[#16834a]",
        },
      ],
    },
    {
      id: "axis-04",
      number: "Axis 04",
      name: "Proof of Work",
      summary: "GitHub repos & production apps",
      rubric: [
        {
          score: "0–1",
          level: "Tutorial Clone Portfolio",
          desc: "Unmodified tutorial clones (Todo app, Netflix clone); no deployment or real traffic.",
          color: "bg-[#fdf2f2] text-[#c43b3b]",
        },
        {
          score: "2–3",
          level: "Self-Initiated Projects",
          desc: "Custom full-stack project deployed on cloud; includes tests and clear README documentation.",
          color: "bg-[#f7f7f8] text-[#171717]",
        },
        {
          score: "4–5",
          level: "Production System Proof",
          desc: "Active open-source contributions, real user base, CI/CD pipeline, and observability telemetry.",
          color: "bg-[#ebf7ee] text-[#16834a]",
        },
      ],
    },
  ];

  const featuredServices = [
    {
      code: "S01",
      title: "Resume Line-by-Line Teardown",
      description: "Line-by-line rewrite, bullet structure transformation, and impact quantification by a senior engineer.",
      price: 599,
      duration: "45 min",
      deliverable: "Annotated PDF + Action Rubric",
      sla: "48h SLA Guarantee",
      badge: "Async SLA",
    },
    {
      code: "S02",
      title: "ATS Keyword & Format Audit",
      description: "Simulation against 4 enterprise ATS algorithms targeting Google, Swiggy, and Tier-1 GCCs.",
      price: 799,
      duration: "45 min",
      deliverable: "Keyword Match Matrix",
      sla: "48h SLA Guarantee",
      badge: "ATS Audit",
    },
    {
      code: "S05",
      title: "Behavioral Mock (STAR Method)",
      description: "Simulation covering conflict resolution, project leadership, and behavioral rubrics for Senior roles.",
      price: 799,
      duration: "60 min",
      deliverable: "STAR Scorecard + Video",
      sla: "1:1 Live Video",
      badge: "High Impact",
    },
    {
      code: "S06",
      title: "Technical Mock (DSA / System Design)",
      description: "60-min live coding simulation with Senior L5/SDE-3 engineering mentor followed by rubric critique.",
      price: 999,
      duration: "60 min",
      deliverable: "8-Axis Diagnostic Scorecard",
      sla: "1:1 Live Simulation",
      badge: "High Demand",
      featured: true,
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#fafafc] to-white py-14 lg:py-24 border-b border-[#e7e7eb]">
        <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-[#5145cd]/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-28 w-[28rem] h-[28rem] rounded-full bg-[#16834a]/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#e7e7eb] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#16834a] animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#171717]">
                India&apos;s Outcome-Accountable Career Network
              </span>
              <span className="text-[#8b8b95]">•</span>
              <span className="text-xs font-semibold text-[#16834a]">
                Tier-1 to Tier-3 Verified
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#171717] leading-[1.12]">
              Build career readiness with guidance that{" "}
              <span className="text-[#5145cd]">moves you forward</span>.
            </h1>

            <p className="text-base sm:text-lg text-[#66666f] leading-relaxed max-w-xl">
              Discover what needs improvement, work with verified career mentors, and receive structured feedback with practical next steps. No false placement claims.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-1 w-full sm:w-auto">
              <Link href="/signup">
                <Button size="lg" className="shadow-md">
                  <span>Get Started — Take Readiness Check</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg">
                  <span>Explore Services (S01–S10)</span>
                </Button>
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#e7e7eb] shadow-xs flex items-start gap-3.5 max-w-lg mt-2">
              <div className="w-9 h-9 rounded-lg bg-[#ebf7ee] flex items-center justify-center text-[#16834a] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#171717]">
                  No Job Guarantee Hype Pledge
                </div>
                <p className="text-xs text-[#66666f] leading-relaxed">
                  DreamX promises verified engineering & product mentorship, rubric-backed diagnostics, and automatic 1-hour cancellation refunds. We do not sell fraudulent job guarantees.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <Card className="shadow-lg border-[#e7e7eb] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#eef2ff] text-[#5145cd] flex items-center justify-center font-bold">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b8b95] block">
                      Candidate Benchmark
                    </span>
                    <span className="text-sm font-bold text-[#171717]">
                      8-Dimension Composite
                    </span>
                  </div>
                </div>
                <Badge variant="success">Cohort Active</Badge>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-[#171717] tnum">
                  68
                </span>
                <span className="text-sm font-semibold text-[#8b8b95]">/ 100</span>
                <span className="text-xs font-semibold text-[#16834a] ml-auto">
                  +14 pts vs Tier-2 Baseline
                </span>
              </div>

              <div className="w-full bg-[#f0eded] rounded-full h-2">
                <div className="bg-[#5145cd] h-2 rounded-full w-[68%]" />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-[#f7f7f8] border border-[#e7e7eb]">
                  <span className="text-[#8b8b95] block text-[10px] uppercase font-semibold">
                    Evaluated
                  </span>
                  <span className="font-bold text-[#171717]">6 / 8</span>
                </div>
                <div className="p-2 rounded-lg bg-[#f7f7f8] border border-[#e7e7eb]">
                  <span className="text-[#8b8b95] block text-[10px] uppercase font-semibold">
                    Tech Proof
                  </span>
                  <span className="font-bold text-[#5145cd]">Level 4</span>
                </div>
                <div className="p-2 rounded-lg bg-[#f7f7f8] border border-[#e7e7eb]">
                  <span className="text-[#8b8b95] block text-[10px] uppercase font-semibold">
                    ATS Fit
                  </span>
                  <span className="font-bold text-[#16834a]">91%</span>
                </div>
              </div>
            </Card>

            <Card className="shadow-md border-[#e7e7eb] p-5">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#ebf7ee] text-[#16834a] flex items-center justify-center shrink-0">
                  <Timer className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#171717]">
                      48h Deliverable SLA Guarantee
                    </span>
                    <span className="text-xs font-bold text-[#16834a]">
                      100% on-time
                    </span>
                  </div>
                  <p className="text-xs text-[#66666f] leading-normal">
                    In-depth rubric report delivered within 48 hours or full escrow refund credited.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 2: FOUR ACCOUNTABILITY PILLARS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5145cd]">
            Accountability Architecture
          </span>
          <h2 className="text-3xl font-extrabold text-[#171717] tracking-tight">
            Four pillars of deliberate career progression
          </h2>
          <p className="text-sm text-[#66666f]">
            Replacing unstructured friendly advice with an institutional diagnostic engine, rigorous SLAs, and industry veterans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#eef2ff] text-[#5145cd] flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#171717]">
                Dual Booking Engine
              </h3>
              <p className="text-xs text-[#66666f] leading-relaxed">
                Choose your mentor directly or use Smart Match algorithm with automated 30-min Wave 2 re-dispatch.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#f7f7f8] flex items-center gap-1.5 text-xs font-semibold text-[#5145cd]">
              <CheckCircle className="w-4 h-4" />
              <span>99.2% match fulfillment</span>
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#ebf7ee] text-[#16834a] flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#171717]">
                8-Dimension Rubric
              </h3>
              <p className="text-xs text-[#66666f] leading-relaxed">
                Standardized 0–5 behavioral and technical anchors eliminate subjective opinions with concrete evidence.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#f7f7f8] flex items-center gap-1.5 text-xs font-semibold text-[#16834a]">
              <CheckCircle className="w-4 h-4" />
              <span>Standardized anchors</span>
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#eef4fd] text-[#2864c5] flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#171717]">
                3-Tier Verified Mentors
              </h3>
              <p className="text-xs text-[#66666f] leading-relaxed">
                Peer (1–3 yrs), Senior (3–7 yrs), and Executive (8+ yrs) professionals from top tier tech hubs and GCCs.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#f7f7f8] flex items-center gap-1.5 text-xs font-semibold text-[#2864c5]">
              <CheckCircle className="w-4 h-4" />
              <span>Strict work history audit</span>
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#fef6e7] text-[#a7670b] flex items-center justify-center">
                <Timer className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#171717]">
                Contractual 48h SLA
              </h3>
              <p className="text-xs text-[#66666f] leading-relaxed">
                Every async code audit, resume teardown, or mock synthesis is delivered on schedule or fully refunded.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#f7f7f8] flex items-center gap-1.5 text-xs font-semibold text-[#a7670b]">
              <CheckCircle className="w-4 h-4" />
              <span>Legally tracked escrow</span>
            </div>
          </Card>
        </div>
      </section>

      {/* SECTION 3: 8-DIMENSION READINESS PREVIEW */}
      <section className="bg-[#f0eded]/40 py-20 border-y border-[#e7e7eb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#5145cd]">
                Diagnostic Framework
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
                The 8-Dimension Readiness Model
              </h2>
              <p className="text-sm text-[#66666f]">
                Every DreamX session maps feedback to tangible, observable criteria on an objective 0 to 5 scale.
              </p>
            </div>
            <div className="text-xs font-semibold text-[#171717] bg-white px-3.5 py-2 rounded-xl border border-[#e7e7eb]">
              Selected Dimension: <span className="text-[#5145cd] font-bold">{readinessAxes[selectedAxis].name}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {readinessAxes.map((axis, idx) => (
                <button
                  key={axis.id}
                  onClick={() => setSelectedAxis(idx)}
                  className={`p-4 rounded-xl text-left transition-all border ${
                    selectedAxis === idx
                      ? "bg-[#5145cd] text-white border-[#5145cd] shadow-md"
                      : "bg-white text-[#171717] border-[#e7e7eb] hover:bg-[#f7f7f8]"
                  }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                    selectedAxis === idx ? "text-[#e0e7ff]" : "text-[#8b8b95]"
                  }`}>
                    {axis.number}
                  </span>
                  <span className="font-bold text-sm block mt-0.5">
                    {axis.name}
                  </span>
                  <span className={`text-xs block mt-1 line-clamp-1 ${
                    selectedAxis === idx ? "text-[#e0e7ff]" : "text-[#66666f]"
                  }`}>
                    {axis.summary}
                  </span>
                </button>
              ))}
            </div>

            <Card className="lg:col-span-7 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#e7e7eb]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#16834a]">
                    Observable Anchors
                  </span>
                  <h3 className="text-xl font-bold text-[#171717] mt-0.5">
                    {readinessAxes[selectedAxis].name} Rubric
                  </h3>
                </div>
                <Badge variant="default">0–5 Anchor Scale</Badge>
              </div>

              <div className="space-y-3.5">
                {readinessAxes[selectedAxis].rubric.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#f7f7f8] flex items-start gap-4 border border-[#e7e7eb]">
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${item.color}`}>
                      {item.score}
                    </span>
                    <div className="space-y-1">
                      <span className="text-sm font-bold text-[#171717] block">
                        {item.level}
                      </span>
                      <p className="text-xs text-[#66666f] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-[#eef2ff] border border-[#e0e7ff] flex items-center justify-between text-xs">
                <span className="font-medium text-[#171717] flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#5145cd]" />
                  Every session generates an official PDF diagnostic scorecard.
                </span>
                <Link href="/signup" className="font-bold text-[#5145cd] hover:underline">
                  Take Diagnostic →
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 4: STANDARDIZED SERVICES CATALOG PREVIEW */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full" id="services">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5145cd]">
              Standardized Catalog
            </span>
            <h2 className="text-3xl font-extrabold text-[#171717] tracking-tight">
              Popular Verified Services
            </h2>
            <p className="text-sm text-[#66666f]">
              Direct upfront pricing in INR. All fees inclusive of 18% GST. No recurring surprise fees.
            </p>
          </div>
          <Link href="/services">
            <Button variant="outline" size="sm">
              <span>View All 10 Services</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((svc) => (
            <Card
              key={svc.code}
              className={`p-6 flex flex-col justify-between hover:shadow-lg transition-all relative ${
                svc.featured ? "ring-2 ring-[#5145cd]" : ""
              }`}
            >
              {svc.featured && (
                <div className="absolute -top-3 right-5 bg-[#5145cd] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#8b8b95]">
                    {svc.code}
                  </span>
                  <Badge variant={svc.featured ? "default" : "neutral"}>
                    {svc.badge}
                  </Badge>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-[#171717] leading-snug">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-[#66666f] leading-relaxed line-clamp-3">
                    {svc.description}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-[#66666f] pt-1">
                  <div className="flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5 text-[#16834a]" />
                    <span>{svc.duration} • {svc.sla}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-[#5145cd]" />
                    <span>{svc.deliverable}</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-[#f7f7f8] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8b8b95] block">
                    Fixed Fee
                  </span>
                  <span className="text-xl font-extrabold text-[#171717] tnum">
                    ₹{svc.price}
                  </span>
                </div>
                <Link href={`/services/${svc.code.toLowerCase()}`}>
                  <Button size="sm">
                    Book Now
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FINAL CTA STRIP */}
      <section className="bg-[#1e1b4b] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="verified" className="bg-[#94f7b2]/20 text-[#94f7b2] border-[#94f7b2]/30">
            Guaranteed 100% Escrow Protection
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to measure where you actually stand?
          </h2>
          <p className="text-sm sm:text-base text-[#e0e7ff]/80 max-w-xl mx-auto leading-relaxed">
            Take the objective 8-dimension career assessment, get matched with a verified engineer from a top tech company, and receive your 48-hour deliverable.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-[#5145cd] text-white hover:bg-[#4035b3] shadow-lg">
                <span>Start with Readiness Assessment</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" size="lg" className="border-white/20 text-white bg-white/10 hover:bg-white/20">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
