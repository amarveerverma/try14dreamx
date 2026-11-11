"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  READINESS_DISCLAIMER,
  CandidateSegment,
} from "@/lib/readiness";
import {
  Compass,
  CheckCircle2,
  Clock,
  TrendingUp,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  Lock,
  Sparkles,
  Milestone,
  History,
} from "lucide-react";

interface JourneyMilestone {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "upcoming";
  completedAt?: string;
  sla?: string;
}

interface AssessmentSummary {
  id: string;
  createdAt: string;
  overallScore: number;
  segment: CandidateSegment;
  rubricVersion: string;
  evidenceCoverage: number;
  assessorName: string;
  highestGapDimension: string;
  isPrivate: boolean;
}

interface JourneyEventRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
}

const SAMPLE_ASSESSMENTS: AssessmentSummary[] = [
  {
    id: "eval-002",
    createdAt: "2026-11-10T14:30:00+05:30",
    overallScore: 68.4,
    segment: "student",
    rubricVersion: "v1.0",
    evidenceCoverage: 75,
    assessorName: "Vikram Singh (Staff Eng, Google)",
    highestGapDimension: "Technical Depth & Core CS",
    isPrivate: true,
  },
  {
    id: "eval-001",
    createdAt: "2026-11-08T10:15:00+05:30",
    overallScore: 54.2,
    segment: "student",
    rubricVersion: "v1.0",
    evidenceCoverage: 50,
    assessorName: "Platform Initial Diagnostic",
    highestGapDimension: "Resume & ATS Scan",
    isPrivate: true,
  },
];

const DEFAULT_EVENTS: JourneyEventRecord[] = [
  {
    id: "ev-1",
    title: "Diagnostic Assessment Calibrated",
    description: "Initial 8-dimension benchmark established at 54.2/100.",
    category: "assessment",
    created_at: "2026-11-08T10:15:00+05:30",
  },
  {
    id: "ev-2",
    title: "Resume Line-by-Line Teardown Booked",
    description: "Assigned mentor Vikram Singh. 48-hour delivery escrow initiated.",
    category: "booking",
    created_at: "2026-11-09T17:30:00+05:30",
  },
  {
    id: "ev-3",
    title: "Benchmark Advanced to 68.4/100",
    description: "Observable improvement recorded in Resume & ATS Score (+14.2 points).",
    category: "assessment",
    created_at: "2026-11-10T14:30:00+05:30",
  },
];

export default function CareerJourneyPage() {
  const { user } = useAuth();
  const [assessments, setAssessments] = React.useState<AssessmentSummary[]>(SAMPLE_ASSESSMENTS);
  const [journeyEvents, setJourneyEvents] = React.useState<JourneyEventRecord[]>(DEFAULT_EVENTS);
  const [reassessing, setReassessing] = React.useState(false);
  const [reassessmentSuccess, setReassessmentSuccess] = React.useState(false);

  const milestones: JourneyMilestone[] = [
    {
      id: "m1",
      title: "1. Candidate Diagnostic Onboarding",
      description: "Profile registered, candidate segment calibrated, and DPDP consent secured.",
      status: "completed",
      completedAt: "2026-11-09T17:30:00+05:30",
    },
    {
      id: "m2",
      title: "2. 8-Axis Career Readiness Benchmark",
      description: "Baseline rubric evaluation across ATS resume, technical depth, and system design.",
      status: "completed",
      completedAt: "2026-11-10T12:00:00+05:30",
    },
    {
      id: "m3",
      title: "3. Highest-Gap Diagnostic Intervention",
      description: "Targeted 1:1 teardown or mock interview session with verified Tier-1 practitioner.",
      status: "in_progress",
      sla: "48h SLA Active",
    },
    {
      id: "m4",
      title: "4. Bar-Raiser Calibration & Re-Assessment",
      description: "Post-intervention rubric reassessment to confirm observable metric gains.",
      status: "upcoming",
    },
    {
      id: "m5",
      title: "5. Target Tier-1 Placement Execution",
      description: "Structured referral application pipeline with audited proof-of-work portfolio.",
      status: "upcoming",
    },
  ];

  React.useEffect(() => {
    async function loadJourneyData() {
      try {
        const supabase = createClient();
        if (user?.id) {
          // Fetch real assessments
          const { data: assessData } = await supabase
            .from("readiness_assessments")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (assessData && assessData.length > 0) {
            setAssessments(
              assessData.map((a) => ({
                id: a.id,
                createdAt: a.created_at,
                overallScore: a.overall_score,
                segment: a.segment,
                rubricVersion: a.rubric_version,
                evidenceCoverage: a.evidence_coverage,
                assessorName: a.assessor_id || "Verified Tier-1 Assessor",
                highestGapDimension: "Technical Skills & Architecture",
                isPrivate: a.is_private,
              }))
            );
          }

          // Fetch real journey events
          const { data: eventData } = await supabase
            .from("career_journey_events")
            .select("id, title, description, category, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (eventData && eventData.length > 0) {
            setJourneyEvents(eventData);
          }
        }
      } catch (err) {
        console.error("Error fetching journey data:", err);
      }
    }

    loadJourneyData();
  }, [user?.id]);

  const handleRequestReassessment = async () => {
    setReassessing(true);
    try {
      if (user?.id) {
        const supabase = createClient();
        await supabase.from("career_journey_events").insert({
          user_id: user.id,
          title: "Reassessment Requested",
          description: "Candidate submitted a formal request for an 8-axis diagnostic reassessment.",
          category: "assessment_request",
          metadata: { requested_at: new Date().toISOString() },
        });

        // Add locally to feed
        setJourneyEvents((prev) => [
          {
            id: `req-${Date.now()}`,
            title: "Reassessment Requested",
            description: "Candidate submitted a formal request for an 8-axis diagnostic reassessment.",
            category: "assessment_request",
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
      setReassessmentSuccess(true);
      setTimeout(() => setReassessmentSuccess(false), 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setReassessing(false);
    }
  };

  const latestScore = assessments[0]?.overallScore ?? 68.4;
  const previousScore = assessments[1]?.overallScore ?? 54.2;
  const scoreDelta = Math.round((latestScore - previousScore) * 10) / 10;

  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-6xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5145cd]">
            <Compass className="w-3.5 h-3.5" />
            <span>Candidate Growth Engine (PRD §8)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
            Guided Career Journey & Benchmark Track
          </h1>
          <p className="text-xs sm:text-sm text-[#66666f]">
            Structured progression milestones, diagnostic score evolution, and evidence-backed skill audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRequestReassessment}
            disabled={reassessing}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>{reassessing ? "Submitting..." : "Request Re-Assessment"}</span>
          </Button>

          <Link href="/dashboard/readiness">
            <Button size="sm">
              <span>Open 8-Axis Model</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {reassessmentSuccess && (
        <div className="p-4 rounded-xl bg-[#ebf7ee] border border-[#a2e0b5] text-[#16834a] flex items-center gap-3 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            Re-assessment request submitted! A verified mentor will review your updated portfolio and deliverables within the 48-hour SLA.
          </span>
        </div>
      )}

      {/* Overview Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 bg-white border-[#e7e7eb] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#8b8b95] uppercase tracking-wider">
            <span>Current Benchmark</span>
            <Badge variant="verified">Active</Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#171717]">{latestScore}</span>
            <span className="text-xs text-[#8b8b95]">/ 100</span>
            {scoreDelta > 0 && (
              <span className="text-xs font-bold text-[#16834a] flex items-center gap-0.5 ml-auto">
                <TrendingUp className="w-3.5 h-3.5" /> +{scoreDelta} pts
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#66666f]">
            Rubric version {assessments[0]?.rubricVersion || "v1.0"} • {assessments[0]?.evidenceCoverage || 75}% coverage
          </p>
        </Card>

        <Card className="p-5 bg-white border-[#e7e7eb] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#8b8b95] uppercase tracking-wider">
            <span>Active Journey Stage</span>
            <Badge variant="default">Stage 3 of 5</Badge>
          </div>
          <div className="text-lg font-bold text-[#171717]">
            Diagnostic Intervention
          </div>
          <p className="text-[11px] text-[#66666f] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#5145cd]" />
            <span>48h SLA Active for Resume Teardown (S01)</span>
          </p>
        </Card>

        <Card className="p-5 bg-white border-[#e7e7eb] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#8b8b95] uppercase tracking-wider">
            <span>Score Governance</span>
            <Badge variant="neutral">Private by Default</Badge>
          </div>
          <div className="text-sm font-bold text-[#171717] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#16834a]" />
            <span>Strict Privacy Safeguard</span>
          </div>
          <p className="text-[11px] text-[#66666f]">
            Scores are never shared publicly or with recruiters without candidate consent.
          </p>
        </Card>
      </div>

      {/* Guided Journey Stepper */}
      <Card className="p-6 bg-white border-[#e7e7eb] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e7e7eb] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#171717] flex items-center gap-2">
              <Milestone className="w-4 h-4 text-[#5145cd]" />
              <span>Structured Journey Path</span>
            </h2>
            <p className="text-xs text-[#66666f]">
              Progressive milestone track from initial diagnostic to verified interview readiness.
            </p>
          </div>
          <Badge variant="verified">Stage 3 Active</Badge>
        </div>

        <div className="space-y-4">
          {milestones.map((milestone) => {
            const isCompleted = milestone.status === "completed";
            const isInProgress = milestone.status === "in_progress";

            return (
              <div
                key={milestone.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isInProgress
                    ? "bg-[#eef2ff] border-[#5145cd] shadow-xs"
                    : isCompleted
                    ? "bg-[#fafafc] border-[#e7e7eb]"
                    : "bg-white border-[#e7e7eb] opacity-60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-[#16834a]" />
                    ) : isInProgress ? (
                      <div className="w-5 h-5 rounded-full border-2 border-[#5145cd] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#5145cd] animate-pulse" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-[#8b8b95]" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs sm:text-sm font-bold text-[#171717]">
                      {milestone.title}
                    </span>
                    <p className="text-xs text-[#66666f]">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  {isCompleted && (
                    <span className="text-[11px] font-semibold text-[#16834a] bg-[#ebf7ee] px-2 py-0.5 rounded-md">
                      Completed
                    </span>
                  )}
                  {isInProgress && (
                    <span className="text-[11px] font-bold text-[#5145cd] bg-white border border-[#5145cd] px-2 py-0.5 rounded-md">
                      {milestone.sla}
                    </span>
                  )}
                  {!isCompleted && !isInProgress && (
                    <span className="text-[11px] text-[#8b8b95]">
                      Upcoming
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Assessment History & Trajectory */}
      <Card className="p-6 bg-white border-[#e7e7eb] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e7e7eb] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#171717] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#5145cd]" />
              <span>Assessment History & Score Evolution</span>
            </h2>
            <p className="text-xs text-[#66666f]">
              Every assessment is timestamped, versioned, and preserves complete rubric evidence.
            </p>
          </div>
          <span className="text-xs text-[#8b8b95]">{assessments.length} Audits On Record</span>
        </div>

        <div className="divide-y divide-[#e7e7eb]">
          {assessments.map((a) => (
            <div key={a.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#171717]">
                    Readiness Score: {a.overallScore} / 100
                  </span>
                  <Badge variant="verified">Rubric {a.rubricVersion}</Badge>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#f4f4f6] text-[#66666f]">
                    {a.evidenceCoverage}% Evidence Coverage
                  </span>
                </div>
                <p className="text-xs text-[#66666f]">
                  Evaluated by: <strong className="text-[#171717]">{a.assessorName}</strong> • Target Segment: <span className="capitalize">{a.segment.replace("_", " ")}</span>
                </p>
                <div className="text-[11px] text-[#8b8b95]">
                  Primary Opportunity Gap Identified: <span className="font-semibold text-[#171717]">{a.highestGapDimension}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/dashboard/readiness">
                  <Button variant="outline" size="sm">
                    View Scorecard
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Completed Actions & Events Log */}
      <Card className="p-6 bg-white border-[#e7e7eb] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e7e7eb] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#171717] flex items-center gap-2">
              <History className="w-4 h-4 text-[#5145cd]" />
              <span>Candidate Journey Event Log</span>
            </h2>
            <p className="text-xs text-[#66666f]">
              Chronological feed of completed diagnostic actions, sessions, and milestone events.
            </p>
          </div>
          <span className="text-xs text-[#8b8b95]">{journeyEvents.length} Recorded Events</span>
        </div>

        <div className="divide-y divide-[#e7e7eb]">
          {journeyEvents.map((ev) => (
            <div key={ev.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#171717]">{ev.title}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#f4f4f6] text-[#66666f]">
                    {ev.category}
                  </span>
                </div>
                <p className="text-xs text-[#66666f]">{ev.description}</p>
              </div>
              <span className="text-[11px] text-[#8b8b95] shrink-0">
                {new Date(ev.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Highest Gap Recommendation Banner */}
      <Card className="p-6 bg-gradient-to-r from-[#fafafc] to-[#eef2ff] border-[#e7e7eb] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5145cd] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Next Recommended Intervention
            </span>
            <Badge variant="warning">Top Priority</Badge>
          </div>
          <h3 className="text-lg font-bold text-[#171717]">
            System Design & Technical Mock (S06)
          </h3>
          <p className="text-xs text-[#66666f] max-w-xl">
            Technical depth represents your highest-weighted diagnostic gap. Booking S06 targets your core algorithmic & architecture benchmark.
          </p>
        </div>

        <Link href="/services/s06-technical-mock" className="shrink-0">
          <Button>
            <span>Book S06 Session (₹999)</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Link>
      </Card>

      {/* Statutory Disclaimer - Mandatory Non-Hiring Guarantee (PRD §8.4) */}
      <div className="p-4 rounded-xl bg-[#fafafc] border border-[#e7e7eb] text-xs text-[#66666f] flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-[#a7670b] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-[#171717]">Statutory Benchmark Notice:</span>
          <p>{READINESS_DISCLAIMER}</p>
        </div>
      </div>
    </div>
  );
}
