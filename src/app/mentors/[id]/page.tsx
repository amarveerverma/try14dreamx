import * as React from "react";
import { notFound } from "next/navigation";
import { MENTORS } from "@/data/mentors";
import { MentorProfileView } from "./MentorProfileView";

export function generateStaticParams() {
  return MENTORS.map((m) => ({ id: m.slug }));
}

export default async function MentorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Dynamic Verified Mentor Profile Rendering
  const mentor = MENTORS.find((m) => m.slug === id || m.id === id);
  if (!mentor) {
    notFound();
  }

  return <MentorProfileView mentor={mentor} />;
}
