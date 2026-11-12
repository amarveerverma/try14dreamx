import * as React from "react";
import { Metadata } from "next";
import { HowItWorksClient } from "./HowItWorksClient";

export const metadata: Metadata = {
  title: "How DreamX Works: A Deterministic Career Improvement Loop | DreamX",
  description:
    "No unstructured calls. No unverified claims. DreamX replaces ambiguous mentorship with an evidence-informed 8-dimension readiness model, milestone-locked escrow, and enforceable 48-hour deliverable SLAs.",
};

export default function HowItWorksPage() {
  return <HowItWorksClient />;
}
