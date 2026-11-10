"use client";

import * as React from "react";
import Link from "next/link";
import { SERVICES } from "@/data/services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Search,
  Timer,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  Zap,
} from "lucide-react";

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const categories = ["All", "Resume & Profile", "Interview Prep", "Career Strategy"];

  const filteredServices = React.useMemo(() => {
    return SERVICES.filter((svc) => {
      const matchesCategory =
        selectedCategory === "All" || svc.category === selectedCategory;
      const matchesSearch =
        svc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        svc.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        svc.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Top Breadcrumb Context */}
      <section className="bg-white border-b border-[#e7e7eb] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#66666f]">
            <Link href="/" className="hover:text-[#5145cd]">Home</Link>
            <span>/</span>
            <span className="font-semibold text-[#171717]">Services Catalogue</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[#16834a] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Escrow Protection
            </span>
            <span>•</span>
            <span className="text-[#66666f]">Contractual 48h Deliverable SLA</span>
          </div>
        </div>
      </section>

      {/* Hero Header */}
      <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#e7e7eb]">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef2ff] text-[#5145cd] text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>10 Standardized Career Outcome Deliverables</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171717] tracking-tight">
            Standardized Career Services. Guaranteed Deliverables.
          </h1>
          <p className="text-base sm:text-lg text-[#66666f] max-w-2xl leading-relaxed">
            Every session is time-boxed, rubric-evaluated, and protected by DreamX Deliverable Escrow. All fees in INR (₹) inclusive of 18% GST.
          </p>

          {/* Search & Filter Toolbar */}
          <div className="pt-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b95]" />
              <input
                type="text"
                placeholder="Search services (e.g. S06 Mock, ATS, Resume)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#e7e7eb] bg-[#fafafc] text-sm text-[#171717] focus:outline-none focus:border-[#5145cd] focus:bg-white transition-colors"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    selectedCategory === cat
                      ? "bg-[#5145cd] text-white border-[#5145cd] shadow-xs"
                      : "bg-white text-[#66666f] border-[#e7e7eb] hover:bg-[#f7f7f8] hover:text-[#171717]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 w-full">
        <div className="flex items-center justify-between pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8b8b95]">
            Showing {filteredServices.length} of {SERVICES.length} Services
          </span>
          <span className="text-xs font-semibold text-[#16834a]">
            Active Mentors Online: 142
          </span>
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#e7e7eb] p-8 space-y-3">
            <p className="text-base font-bold text-[#171717]">No matching services found</p>
            <p className="text-xs text-[#66666f]">Try searching for &quot;Mock&quot;, &quot;Resume&quot;, or &quot;Negotiation&quot;.</p>
            <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((svc) => (
              <Card
                key={svc.id}
                className="p-6 flex flex-col justify-between hover:shadow-lg transition-all border-[#e7e7eb] bg-white group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#5145cd] bg-[#eef2ff] px-2 py-0.5 rounded">
                      {svc.code}
                    </span>
                    <Badge variant={svc.popular ? "default" : "neutral"}>
                      {svc.format}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#171717] group-hover:text-[#5145cd] transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-[#66666f] mt-1.5 leading-relaxed line-clamp-3">
                      {svc.shortDescription}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#f7f7f8] text-xs text-[#66666f]">
                    <div className="flex items-center gap-2">
                      <Timer className="w-3.5 h-3.5 text-[#16834a]" />
                      <span>{svc.duration} • {svc.sla}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-3.5 h-3.5 text-[#5145cd]" />
                      <span className="truncate">{svc.deliverable}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#f7f7f8] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8b8b95] block">
                      Fixed Fee (Incl. 18% GST)
                    </span>
                    <span className="text-2xl font-extrabold text-[#171717] tnum">
                      ₹{svc.price}
                    </span>
                  </div>
                  <Link href={`/services/${svc.slug}`}>
                    <Button size="sm">
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
