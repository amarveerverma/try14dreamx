import * as React from "react";
import { notFound } from "next/navigation";
import { MENTORS } from "@/data/mentors";
import { MentorProfileView } from "./MentorProfileView";
import { VikramadityaProfileView } from "./VikramadityaProfileView";

export function generateStaticParams() {
  return [
    { id: "arishta-sengupta" },
    { id: "vikramaditya-rao" },
    { id: "ananya-sharma" },
    { id: "vikram-singh" },
    { id: "rohan-deshmukh" },
    { id: "priya-nair" },
  ];
}

export default async function MentorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Mentor Profile 2: Vikramaditya Rao (Lead ML Engineer & AI Systems Architect)
  if (id === "vikramaditya-rao" || id === "ananya-sharma") {
    return <VikramadityaProfileView />;
  }

  // Mentor Profile 1 & Other Profiles: Arishta Sengupta / Dynamic Calibrated Mentor
  const mentor = MENTORS.find((m) => m.slug === id);
  if (!mentor) {
    notFound();
  }

  return <MentorProfileView mentor={mentor} />;
}
