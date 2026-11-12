"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { MENTORS } from "@/data/mentors";
import { CompanyLogo } from "@/components/ui/company-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ShieldCheck,
  Star,
  Clock,
  ArrowRight,
  Briefcase,
} from "lucide-react";

export default function MentorsPage() {
  const [selectedTier, setSelectedTier] = React.useState<string>("All");

  const filteredMentors = React.useMemo(() => {
    if (selectedTier === "All") return MENTORS;
    return MENTORS.filter((m) => m.tier.startsWith(selectedTier));
  }, [selectedTier]);

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Breadcrumb Context Bar */}
      <section className="bg-white border-b border-[#e7e7eb] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#66666f]">
            <Link href="/" className="hover:text-[#5145cd]">Home</Link>
            <span>/</span>
            <span className="font-semibold text-[#171717]">Verified Mentors Directory</span>
          </div>
          <span className="text-xs font-semibold text-[#16834a] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Background & Employment Verified
          </span>
        </div>
      </section>

      {/* Hero Header */}
      <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#e7e7eb]">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef2ff] text-[#5145cd] text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>3-Tier Verified Engineering & Product Leaders</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171717] tracking-tight">
            Work 1:1 with India&apos;s Top Tech Practitioners
          </h1>
          <p className="text-base sm:text-lg text-[#66666f] max-w-2xl leading-relaxed">
            Every mentor on DreamX has passed employment history verification, background audits, and rubric calibration. No self-proclaimed influencers.
          </p>

          {/* Tier Selection Pills */}
          <div className="pt-4 flex items-center gap-2 overflow-x-auto">
            {["All", "Peer", "Senior", "Executive"].map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedTier === tier
                    ? "bg-[#5145cd] text-white border-[#5145cd] shadow-xs"
                    : "bg-[#fafafc] text-[#66666f] border-[#e7e7eb] hover:bg-[#f7f7f8] hover:text-[#171717]"
                }`}
              >
                {tier === "All" ? `All Mentors (${MENTORS.length})` : `${tier} Tier`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMentors.map((mentor) => (
            <Card
              key={mentor.id}
              className="p-6 bg-white border-[#e7e7eb] flex flex-col justify-between hover:shadow-lg transition-all group"
            >
              <div className="space-y-4">
                {/* Header: Photo & Info */}
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-[#e7e7eb]">
                    <Image
                      src={mentor.avatar}
                      alt={mentor.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-[#171717] group-hover:text-[#5145cd] transition-colors">
                        {mentor.name}
                      </h3>
                      <Badge variant="verified">Verified</Badge>
                    </div>

                    <p className="text-xs font-semibold text-[#5145cd] flex items-center gap-1.5">
                      <span>{mentor.role} @ {mentor.company}</span>
                      <CompanyLogo name={mentor.company} className="w-3.5 h-3.5 inline-block" />
                    </p>

                    <div className="flex items-center gap-3 text-xs text-[#8b8b95] pt-0.5">
                      <span className="flex items-center gap-1 text-[#a7670b] font-semibold">
                        <Star className="w-3.5 h-3.5 fill-[#a7670b]" /> {mentor.rating} ({mentor.reviewCount})
                      </span>
                      <span>•</span>
                      <span>{mentor.experienceYears}+ years exp</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-[#66666f] leading-relaxed line-clamp-2">
                  {mentor.bio}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {mentor.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-[#f7f7f8] text-[11px] font-medium text-[#171717] border border-[#e7e7eb]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Next Availability */}
                <div className="p-3 rounded-xl bg-[#ebf7ee]/50 border border-[#94f7b2]/40 flex items-center justify-between text-xs">
                  <span className="text-[#006d3a] font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Next Available Slot:
                  </span>
                  <span className="font-bold text-[#171717]">{mentor.activeAvailability}</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-6 mt-6 border-t border-[#f7f7f8] flex items-center justify-between">
                <span className="text-xs text-[#66666f]">
                  Tier: <strong className="text-[#171717]">{mentor.tier.split(" ")[0]}</strong>
                </span>
                <Link href={`/mentors/${mentor.slug}`}>
                  <Button size="sm">
                    <span>View Profile & Slots</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
