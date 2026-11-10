import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MENTORS } from "@/data/mentors";
import { SERVICES } from "@/data/services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ShieldCheck,
  Star,
  Clock,
  ArrowRight,
  CheckCircle,
  Briefcase,
  MapPin,
  AlertCircle,
} from "lucide-react";

export function generateStaticParams() {
  return MENTORS.map((mentor) => ({
    id: mentor.slug,
  }));
}

export default async function MentorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mentor = MENTORS.find((m) => m.slug === id);

  if (!mentor) {
    notFound();
  }

  // Find services approved for this mentor
  const mentorServices = SERVICES.filter((s) =>
    mentor.approvedServices.some((as) => as.includes(s.code))
  );

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Breadcrumb Context Bar */}
      <section className="bg-white border-b border-[#e7e7eb] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#66666f]">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#5145cd]">Home</Link>
            <span>/</span>
            <Link href="/mentors" className="hover:text-[#5145cd]">Mentors</Link>
            <span>/</span>
            <span className="font-semibold text-[#171717]">{mentor.name}</span>
          </div>
          <span className="text-xs font-semibold text-[#16834a] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Identity & Corporate Email Verified
          </span>
        </div>
      </section>

      {/* Main Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Profile Bio & Services (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Profile Overview Card */}
            <Card className="p-6 sm:p-8 bg-white border-[#e7e7eb] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-[#5145cd]/20 shadow-md">
                  <Image
                    src={mentor.avatar}
                    alt={mentor.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
                      {mentor.name}
                    </h1>
                    <Badge variant="verified">Background Verified</Badge>
                  </div>

                  <p className="text-sm font-semibold text-[#5145cd]">
                    {mentor.role} @ {mentor.company}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#66666f] pt-1">
                    <span className="flex items-center gap-1 text-[#a7670b] font-bold">
                      <Star className="w-4 h-4 fill-[#a7670b]" /> {mentor.rating} ({mentor.reviewCount} sessions)
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" /> {mentor.experienceYears}+ years exp
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {mentor.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2 pt-2 border-t border-[#f7f7f8]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8b8b95]">
                  Professional Background
                </h3>
                <p className="text-sm text-[#66666f] leading-relaxed">
                  {mentor.bio}
                </p>
              </div>

              {/* Skills */}
              <div className="space-y-2 pt-2 border-t border-[#f7f7f8]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8b8b95]">
                  Domain Competencies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-[#f7f7f8] text-xs font-semibold text-[#171717] border border-[#e7e7eb]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Legal verification note per PRD UX-06 */}
              <div className="p-3.5 rounded-xl bg-[#fafafc] border border-[#e7e7eb] flex items-start gap-2.5 text-xs text-[#8b8b95]">
                <AlertCircle className="w-4 h-4 text-[#8b8b95] shrink-0 mt-0.5" />
                <p>
                  Verification confirms that this mentor is an active practitioner with verified credentials. Mentorship is provided in a personal professional capacity and does not represent an institutional endorsement by {mentor.company}.
                </p>
              </div>
            </Card>

            {/* Approved Services for this mentor */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#171717]">
                Approved Services Offered by {mentor.name.split(" ")[0]}
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {mentorServices.map((svc) => (
                  <Card
                    key={svc.id}
                    className="p-5 bg-white border-[#e7e7eb] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#5145cd] bg-[#eef2ff] px-2 py-0.5 rounded">
                          {svc.code}
                        </span>
                        <h3 className="text-base font-bold text-[#171717]">
                          {svc.title}
                        </h3>
                      </div>
                      <p className="text-xs text-[#66666f] line-clamp-2">
                        {svc.shortDescription}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-[#8b8b95] pt-1">
                        <span>{svc.duration}</span>
                        <span>•</span>
                        <span className="text-[#16834a] font-medium">{svc.sla}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-[#f7f7f8]">
                      <span className="text-xl font-extrabold text-[#171717] tnum">
                        ₹{svc.price}
                      </span>
                      <Link href={`/services/${svc.slug}`}>
                        <Button size="sm">
                          <span>Select Slot</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Next Slot & Booking Schedule (4 cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <Card className="p-6 bg-white border-[#e7e7eb] shadow-lg space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8b8b95] block">
                  Upcoming Availability
                </span>
                <div className="p-3.5 rounded-xl bg-[#ebf7ee] border border-[#94f7b2]/40 text-xs space-y-1">
                  <div className="font-bold text-[#006d3a] flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Available Next:
                  </div>
                  <div className="font-extrabold text-sm text-[#171717]">
                    {mentor.activeAvailability}
                  </div>
                </div>
              </div>

              {/* Standard 48h Deliverable Guarantee */}
              <div className="space-y-3 text-xs text-[#66666f]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#16834a]" />
                  <span>48-Hour Structured Rubric Report</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#16834a]" />
                  <span>Google Meet / Zoom calendar sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#16834a]" />
                  <span>100% Escrow Protection</span>
                </div>
              </div>

              <Link href="/signup" className="w-full block">
                <Button size="lg" className="w-full shadow-md">
                  <span>Book Session with {mentor.name.split(" ")[0]}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
