import * as React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SERVICES } from "@/data/services";
import { ServiceDetailClient } from "./ServiceDetailClient";

export function generateStaticParams() {
  return SERVICES.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return { title: "Service Not Found | DreamX" };

  return {
    title: `${service.code}: ${service.title} | DreamX Escrow-Protected Mentorship`,
    description: service.shortDescription || service.fullDescription,
  };
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

  return <ServiceDetailClient service={service} />;
}
