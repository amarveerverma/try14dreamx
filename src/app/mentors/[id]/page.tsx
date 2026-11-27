import * as React from "react";
import { notFound } from "next/navigation";
import { MENTORS, type Mentor } from "@/data/mentors";
import { MentorProfileView } from "./MentorProfileView";
import { createClient } from "@/lib/supabase/server";

export function generateStaticParams() {
  return MENTORS.map((m) => ({ id: m.slug }));
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default async function MentorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Check static benchmark mentors first
  let mentor = MENTORS.find((m) => m.slug === id || m.id === id);

  // 2. Dynamic Supabase Lookup for registered/onboarded mentors
  if (!mentor) {
    try {
      const supabase = await createClient();

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      let targetUserId: string | null = null;
      let matchedApp: Record<string, unknown> | null = null;
      let matchedUser: Record<string, unknown> | null = null;

      if (isUuid) {
        targetUserId = id;
      } else {
        // Find matching mentor_applications by slug or name
        const { data: apps } = await supabase
          .from("mentor_applications")
          .select("*");

        if (apps && apps.length > 0) {
          const found = apps.find(
            (a) =>
              slugify(a.full_name || "") === id.toLowerCase() ||
              slugify((a.email || "").split("@")[0]) === id.toLowerCase() ||
              a.user_id === id
          );
          if (found) {
            targetUserId = found.user_id;
            matchedApp = found;
          }
        }

        if (!targetUserId) {
          const { data: profs } = await supabase
            .from("profiles")
            .select("*")
            .eq("role", "mentor");

          if (profs && profs.length > 0) {
            const foundP = profs.find(
              (p) =>
                (p.full_name && slugify(p.full_name) === id.toLowerCase()) ||
                (p.email && slugify(p.email.split("@")[0]) === id.toLowerCase()) ||
                p.id === id
            );
            if (foundP) {
              targetUserId = foundP.id;
              matchedUser = foundP;
            }
          }
        }
      }

      if (targetUserId) {
        const { data: dbMentor } = await supabase
          .from("mentor_profiles")
          .select("*")
          .eq("id", targetUserId)
          .maybeSingle();

        if (!matchedApp) {
          const { data: appData } = await supabase
            .from("mentor_applications")
            .select("*")
            .eq("user_id", targetUserId)
            .maybeSingle();
          matchedApp = appData;
        }

        if (!matchedUser) {
          const { data: uData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", targetUserId)
            .maybeSingle();
          matchedUser = uData;
        }

        if (dbMentor || matchedApp || matchedUser) {
          const fullName =
            (matchedApp?.full_name as string) ||
            (matchedUser?.full_name as string) ||
            ((matchedUser?.email as string)?.split("@")[0]) ||
            "Accredited Mentor";
          const company =
            (dbMentor?.verified_company as string) ||
            (dbMentor?.current_employer as string) ||
            (matchedApp?.current_employer as string) ||
            "Tech Enterprise";
          const role =
            (dbMentor?.job_title as string) ||
            (matchedApp?.job_title as string) ||
            "Senior Engineering Mentor";
          const yoe = Number(
            dbMentor?.years_of_experience ||
            matchedApp?.years_of_experience ||
            5
          );
          const bio =
            (dbMentor?.bio as string) ||
            (matchedApp?.bio as string) ||
            "Accredited engineering practitioner on DreamX with proven corporate pedigree and 48-hour deliverable SLA alignment.";
          
          const rawServices =
            (dbMentor?.approved_services && (dbMentor.approved_services as string[]).length > 0)
              ? (dbMentor.approved_services as string[])
              : (matchedApp?.requested_services && (matchedApp.requested_services as string[]).length > 0)
              ? (matchedApp.requested_services as string[])
              : ["S01", "S06"];

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

          const mappedServices = rawServices.map((s) => serviceLabels[s] || `${s} Career Consultation`);

          mentor = {
            id: targetUserId,
            slug: slugify(fullName),
            name: fullName,
            role,
            company,
            avatar:
              (matchedUser?.avatar_url as string) ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
            tier: yoe >= 8 ? "Executive (8+ yrs)" : yoe >= 3 ? "Senior (3–7 yrs)" : "Peer (1–3 yrs)",
            experienceYears: yoe,
            location: "India (IST)",
            rating: 5.0,
            reviewCount: 0,
            bio,
            approvedServices: mappedServices,
            skills: (matchedApp?.domains && (matchedApp.domains as string[]).length > 0)
              ? (matchedApp.domains as string[])
              : ["Distributed Systems", "Backend Architecture", "System Design"],
            verifiedCompany: true,
            activeAvailability: "Available this week",
          };
        }
      }
    } catch (err) {
      console.error("Error querying live mentor profile:", err);
    }
  }

  if (!mentor) {
    notFound();
  }

  return <MentorProfileView mentor={mentor} />;
}
