"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DIMENSIONS,
  calculateReadinessScore,
  type DimensionKey,
  type CandidateSegment,
  READINESS_DISCLAIMER,
} from "@/lib/readiness";
import {
  Target,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  RotateCcw,
  Compass,
  Save,
} from "lucide-react";

export default function CareerReadinessPage() {
  const { user } = useAuth();
  const [segment, setSegment] = React.useState<CandidateSegment>("student");
  const [isPortfolioApplicable, setIsPortfolioApplicable] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  // Baseline sample scores (0-5 scale)
  const [scores, setScores] = React.useState<Partial<Record<DimensionKey, number>>>({
    resume: 4.0,
    linkedin: 3.5,
    portfolio: 4.0,
    communication: 3.5,
    technical_skills: 2.5,
    interview_skills: 3.0,
    career_planning: 4.0,
    confidence: 3.0,
  });

  const result = React.useMemo(() => {
    return calculateReadinessScore(segment, scores, {
      isPortfolioApplicable,
      rubricVersion: "v1.0",
    });
  }, [segment, scores, isPortfolioApplicable]);

  const updateScore = (dim: DimensionKey, val: number) => {
    setScores((prev) => ({ ...prev, [dim]: val }));
  };

  const handleReset = () => {
    setScores({
      resume: 4.0,
      linkedin: 3.5,
      portfolio: 4.0,
      communication: 3.5,
      technical_skills: 2.5,
      interview_skills: 3.0,
      career_planning: 4.0,
      confidence: 3.0,
    });
    setIsPortfolioApplicable(true);
  };

  const handleSaveSnapshot = async () => {
    setSaving(true);
    try {
      if (user?.id) {
        const supabase = createClient();
        await supabase.from("readiness_assessments").insert({
          user_id: user.id,
          overall_score: result.overallScore,
          segment: result.segment,
          rubric_version: result.rubricVersion,
          evidence_coverage: result.evidenceCoverage,
          dimension_scores: JSON.parse(JSON.stringify(result.dimensionScores)),
          is_private: true,
        });

        await supabase.from("career_journey_events").insert({
          user_id: user.id,
          title: "Readiness Diagnostic Calibrated",
          description: `Score benchmark updated to ${result.overallScore}/100 with ${result.evidenceCoverage}% evidence coverage.`,
          category: "assessment",
          metadata: { score: result.overallScore, segment: result.segment },
        });
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-6xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5145cd]">
            <Target className="w-3.5 h-3.5" />
            <span>Deterministic Diagnostic Engine (PRD §8)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
            8-Dimension Career Readiness Model
          </h1>
          <p className="text-xs sm:text-sm text-[#66666f]">
            Calibrated for Tier-1 Indian tech, unicorn hiring rubrics, and GCC product engineering standards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>Reset Demo</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveSnapshot}
            disabled={saving}
          >
            <Save className="w-3.5 h-3.5 mr-1" />
            <span>{saving ? "Saving..." : "Save Benchmark"}</span>
          </Button>

          <Link href="/dashboard/journey">
            <Button size="sm">
              <Compass className="w-3.5 h-3.5 mr-1" />
              <span>Career Journey</span>
            </Button>
          </Link>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-[#ebf7ee] border border-[#a2e0b5] text-[#16834a] flex items-center gap-3 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            Diagnostic benchmark snapshot saved securely to your private candidate record!
          </span>
        </div>
      )}

      {/* Segment Switcher & Calibration Controls */}
      <Card className="p-5 bg-white border-[#e7e7eb] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#171717]">
              Candidate Segment Calibration
            </span>
            <p className="text-xs text-[#66666f]">
              Weights re-adjust automatically across segments to preserve 100% total allocation.
            </p>
          </div>

          {/* Segment Selector */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#fafafc] border border-[#e7e7eb]">
            {(
              [
                ["student", "College Student"],
                ["fresh_graduate", "Fresh Graduate"],
                ["early_career", "Early Career (1-3y)"],
                ["career_switcher", "Career Switcher"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSegment(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  segment === key
                    ? "bg-[#5145cd] text-white shadow-xs"
                    : "text-[#66666f] hover:text-[#171717]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio applicability toggle */}
        <div className="pt-3 border-t border-[#f7f7f8] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#171717]">Portfolio Dimension Applicable?</span>
            <span className="text-[#8b8b95]">
              (When disabled, Portfolio weight redistributes proportionally across remaining dimensions)
            </span>
          </div>
          <button
            onClick={() => setIsPortfolioApplicable(!isPortfolioApplicable)}
            className={`px-3 py-1 rounded-full font-bold text-xs border transition-colors ${
              isPortfolioApplicable
                ? "bg-[#ebf7ee] text-[#16834a] border-[#16834a]/30"
                : "bg-[#fdf2f2] text-[#c43b3b] border-[#c43b3b]/30"
            }`}
          >
            {isPortfolioApplicable ? "Portfolio Applicable (Active)" : "Portfolio Exempt (Redistributed)"}
          </button>
        </div>
      </Card>

      {/* Composite Score & Statutory Dial */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Dial */}
        <Card className="p-6 bg-white border-[#e7e7eb] shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8b8b95]">
                Composite Score
              </span>
              <Badge variant="verified">Rubric {result.rubricVersion}</Badge>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-extrabold text-[#171717] tnum">
                {result.overallScore}
              </span>
              <span className="text-lg font-semibold text-[#8b8b95]">/ 100</span>
            </div>
            <p className="text-xs text-[#16834a] font-semibold mt-1">
              Deterministic Σ(weight × score / 5) × 100
            </p>
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>Diagnostic Level</span>
              <span className="text-[#5145cd]">
                {result.overallScore >= 75
                  ? "Tier-1 Ready"
                  : result.overallScore >= 60
                  ? "Competitive Foundation"
                  : "Needs Foundation Gap Work"}
              </span>
            </div>
            <div className="w-full bg-[#f0eded] rounded-full h-2">
              <div
                className="bg-[#5145cd] h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, result.overallScore)}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Evidence Coverage */}
        <Card className="p-6 bg-white border-[#e7e7eb] shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8b8b95]">
                Evidence Coverage
              </span>
              <Badge variant="neutral">{result.assessedCount} of {isPortfolioApplicable ? 8 : 7} Assessed</Badge>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-extrabold text-[#171717] tnum">
                {result.evidenceCoverage}%
              </span>
              <span className="text-xs text-[#66666f]">Evidence Integrity</span>
            </div>
            <p className="text-xs text-[#66666f] mt-1">
              Missing scores are never silently zeroed.
            </p>
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="w-full bg-[#f0eded] rounded-full h-2">
              <div
                className="bg-[#16834a] h-2 rounded-full transition-all duration-500"
                style={{ width: `${result.evidenceCoverage}%` }}
              />
            </div>
            <span className="text-[11px] text-[#8b8b95] block text-right">
              {result.unassessedKeys.length === 0
                ? "Full Evidence Validated"
                : `${result.unassessedKeys.length} Unassessed Dimension(s)`}
            </span>
          </div>
        </Card>

        {/* Deterministic Opportunity Gap & Recommendation */}
        <Card className="p-6 bg-[#fafafc] border-[#5145cd]/30 shadow-sm flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5145cd]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Highest Weighted Gap</span>
            </div>
            <span className="font-extrabold text-base text-[#171717] block">
              {DIMENSIONS[result.highestGapDimension].label}
            </span>
            <p className="text-xs text-[#66666f] leading-relaxed">
              {result.recommendationReason}
            </p>
          </div>

          <Link href={`/services`} className="pt-2">
            <Button size="sm" className="w-full">
              <span>Target Highest Gap ({result.recommendedServiceCode})</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </Card>
      </div>

      {/* Statutory Disclaimer Beacon (PRD §8.4 / Exit Criterion 4) */}
      <div className="p-4 rounded-xl bg-[#fff9ed] border border-[#f0a64a]/30 flex items-start gap-3 text-xs text-[#9a5200]">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#f0a64a]" />
        <div>
          <strong className="block text-[#171717] font-semibold mb-0.5">
            Non-Hiring Guarantee Notice (PRD §8.4 & §28):
          </strong>
          <span>{READINESS_DISCLAIMER}</span>
        </div>
      </div>

      {/* 8-Dimension Detailed Evaluation Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#171717]">
            Dimension-Level Breakdown & Rubric Alignment (0–5 Scale)
          </h2>
          <span className="text-xs font-semibold text-[#8b8b95]">
            Effective Weights Total: 100%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(DIMENSIONS) as DimensionKey[]).map((key) => {
            const meta = DIMENSIONS[key];
            const weight = result.effectiveWeights[key];
            const isExempt = !isPortfolioApplicable && key === "portfolio";
            const currentScore = scores[key] ?? 0;
            const isHighestGap = result.highestGapDimension === key;

            return (
              <Card
                key={key}
                className={`p-5 bg-white border transition-all space-y-3 ${
                  isHighestGap
                    ? "border-[#5145cd] ring-1 ring-[#5145cd]/30 shadow-md"
                    : "border-[#e7e7eb] shadow-xs"
                } ${isExempt ? "opacity-50 pointer-events-none" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-[#171717]">{meta.label}</h3>
                      {isHighestGap && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#eef2ff] text-[#5145cd]">
                          Top Priority
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#8b8b95]">
                      Weight: {Math.round(weight * 100)}% of composite
                    </span>
                  </div>

                  <Badge variant={currentScore >= 4 ? "verified" : currentScore >= 2.5 ? "default" : "neutral"}>
                    {isExempt ? "Exempt" : `${currentScore.toFixed(1)} / 5.0`}
                  </Badge>
                </div>

                <p className="text-xs text-[#66666f] leading-relaxed">
                  {meta.description}
                </p>

                {/* Score slider control (0-5 scale in 0.5 steps) */}
                {!isExempt && (
                  <div className="space-y-1.5 pt-2 border-t border-[#f7f7f8]">
                    <div className="flex justify-between items-center text-[11px] font-semibold text-[#66666f]">
                      <span>Adjust Calibration Score:</span>
                      <span className="text-[#171717] font-bold">{currentScore.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={5}
                      step={0.5}
                      value={currentScore}
                      onChange={(e) => updateScore(key, parseFloat(e.target.value))}
                      className="w-full accent-[#5145cd] cursor-pointer"
                    />
                  </div>
                )}

                {/* Rubric Criteria Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {meta.rubricCriteria.map((crit) => (
                    <span
                      key={crit}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-[#fafafc] border border-[#e7e7eb] text-[#66666f]"
                    >
                      {crit}
                    </span>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
