"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { MENTORS, type Mentor } from "@/data/mentors";
import { CompanyLogo } from "@/components/ui/company-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import {
  ShieldCheck,
  Star,
  Clock,
  ArrowRight,
  Briefcase,
} from "lucide-react";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function MentorsPage() {
  const [selectedTier, setSelectedTier] = React.useState<string>("All");
  const [mentorsList, setMentorsList] = React.useState<Mentor[]>(MENTORS);

  React.useEffect(() => {
    async function loadLiveMentors() {
      try {
        const supabase = createClient();
        const { data: dbMentors } = await supabase
          .from("mentor_profiles")
          .select("*, profiles(*)");

        if (dbMentors && dbMentors.length > 0) {
          const serviceLabels: Record<string, string> = {
            S01: "S01 Resume Review",
            S02: "S02 Architecture Design",
            S03: "S03 Project Deep-Dive",
            S04: "S04 Codebase & Architecture",
            S05: "S05 Behavioral & Leadership",
            S06: "S06 Technical Mock Interview",
            S07: "S07 Career Consultation",
            S08: "S08 Offer Negotiation",
            S09: "S09 Transition Strategy",
            S10: "S10 Algorithmic Coding Prep",
          };

          const mapped: Mentor[] = dbMentors.map((m: any) => {
            const prof = m.profiles || {};
            const fullName = prof.full_name || "Accredited Mentor";
            const yoe = Number(m.years_of_experience || 5);
            const services = (m.approved_services || []).map((s: string) => serviceLabels[s] || `${s} Consultation`);

            return {
              id: m.id,
              slug: slugify(fullName),
              name: fullName,
              role: m.job_title || "Senior Practitioner",
              company: m.verified_company || m.current_employer || "Tech Enterprise",
              avatar:
                prof.avatar_url ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
              tier: yoe >= 8 ? "Executive (8+ yrs)" : yoe >= 3 ? "Senior (3–7 yrs)" : "Peer (1–3 yrs)",
              experienceYears: yoe,
              location: "India (IST)",
              rating: Number(m.rating || 5.0),
              reviewCount: Number(m.reviews_count || 0),
              bio: m.bio || "Accredited engineering practitioner on DreamX with proven corporate pedigree and institutional SLA alignment.",
              approvedServices: services.length > 0 ? services : ["S01 Resume Review", "S06 Technical Mock Interview"],
              skills: ["Distributed Systems", "Backend Architecture", "System Design"],
              verifiedCompany: true,
              activeAvailability: "Available this week",
            };
          });

          // Deduplicate by ID
          const existingIds = new Set(MENTORS.map((m) => m.id));
          const additions = mapped.filter((m) => !existingIds.has(m.id));
          setMentorsList([...MENTORS, ...additions]);
        }
      } catch (err) {
        console.warn("Could not load live mentors:", err);
      }
    }
    loadLiveMentors();
  }, []);

  const filteredMentors = React.useMemo(() => {
    if (selectedTier === "All") return mentorsList;
    return mentorsList.filter((m) => m.tier.startsWith(selectedTier));
  }, [selectedTier, mentorsList]);

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
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Background &amp; Employment Verified
          </span>
        </div>
      </section>

      {/* Hero Header */}
      <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#e7e7eb]">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef2ff] text-[#5145cd] text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>3-Tier Verified Engineering &amp; Product Leaders</span>
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
                {tier === "All" ? `All Mentors (${mentorsList.length})` : `${tier} Tier`}
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
                      <div className="flex items-center gap-1 text-xs font-bold text-[#171717] bg-[#f7f7f8] px-2 py-0.5 rounded-full border border-[#e7e7eb]">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{mentor.rating.toFixed(2)}</span>
                        {mentor.reviewCount > 0 && (
                          <span className="text-[#66666f] font-normal">({mentor.reviewCount})</span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs font-medium text-[#66666f]">
                      {mentor.role}
                    </p>

                    <div className="flex items-center gap-2 pt-0.5">
                      <CompanyLogo name={mentor.company} className="w-4 h-4" />
                      <span className="text-xs font-semibold text-[#171717]">{mentor.company}</span>
                      {mentor.verifiedCompany && (
                        <span className="text-[10px] bg-[#ebf7ee] text-[#16834a] px-1.5 py-0.2 rounded font-bold border border-[#d3ebd7]">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Badges Bar */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge variant="neutral" className="border-[#e7e7eb] text-[#66666f] bg-[#fafafc]">
                    {mentor.tier}
                  </Badge>
                  <Badge variant="neutral" className="border-[#e7e7eb] text-[#66666f] bg-[#fafafc]">
                    {mentor.experienceYears}+ yrs YoE
                  </Badge>
                  <span className="text-xs text-[#66666f] flex items-center gap-1 ml-auto font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#5145cd]" /> {mentor.activeAvailability}
                  </span>
                </div>

                {/* Bio Snippet */}
                <p className="text-xs text-[#66666f] line-clamp-2 leading-relaxed">
                  {mentor.bio}
                </p>

                {/* Skills/Pillars */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {mentor.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md bg-[#f7f7f8] border border-[#e7e7eb] text-[11px] text-[#66666f]"
                    >
                      {skill}
                    </span>
                  ))}
                  {mentor.skills.length > 4 && (
                    <span className="text-[11px] text-[#66666f] font-medium self-center pl-1">
                      +{mentor.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer: Approved Services & CTA */}
              <div className="pt-6 mt-6 border-t border-[#e7e7eb] flex items-center justify-between gap-4">
                <div className="flex items-center gap-1 text-[11px] text-[#16834a] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{mentor.approvedServices.length} Calibrated Services</span>
                </div>

                <Link href={`/mentors/${mentor.slug}`}>
                  <Button size="sm" className="bg-[#5145cd] hover:bg-[#4035b3] text-white text-xs font-semibold gap-1.5 shadow-xs">
                    <span>View Profile &amp; Slots</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
