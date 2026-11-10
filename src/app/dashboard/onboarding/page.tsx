"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  UploadCloud,
  FileText,
  Trash2,
  ShieldCheck,
  Globe,
  GraduationCap,
  Plus,
  X,
  Target,
  Check,
} from "lucide-react";

export default function OnboardingWizardPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const totalSteps = 4;

  // STEP 1: Target Market & Career Stage
  const [market, setMarket] = React.useState("CM-IN");
  const [careerStage, setCareerStage] = React.useState("college-student");
  const [timezone, setTimezone] = React.useState("Asia/Kolkata");

  // STEP 2: Target Role & Companies
  const [targetRole, setTargetRole] = React.useState("AI / Distributed Systems Engineer");
  const [selectedCompanies, setSelectedCompanies] = React.useState<string[]>([
    "Google",
    "Swiggy",
    "Microsoft",
  ]);

  // STEP 3: Academic Credentials & Tech Stack (Empty by default)
  const [university, setUniversity] = React.useState("");
  const [gradYear, setGradYear] = React.useState("");
  const [degree, setDegree] = React.useState("");
  const [gpa, setGpa] = React.useState("");
  const [skills, setSkills] = React.useState<string[]>([
    "Python",
    "Data Structures",
    "System Design",
  ]);
  const [newSkill, setNewSkill] = React.useState("");

  // STEP 4: Resume Upload
  const [resumeFile, setResumeFile] = React.useState<{ name: string; size: string } | null>(null);
  const [isEvaluating, setIsEvaluating] = React.useState(false);
  const [evaluationDone, setEvaluationDone] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Quick Pre-fill trigger (Demo helper)
  const handlePrefillDemo = () => {
    setUniversity("Indian Institute of Technology, Delhi (IIT Delhi)");
    setGradYear("2026");
    setDegree("B.Tech • Computer Science and Engineering");
    setGpa("9.12 / 10.0 (Top 5% Cohort)");
    setResumeFile({ name: "ananya_sharma_resume_v2.pdf", size: "384 KB" });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeStr =
        file.size > 1024 * 1024
          ? (file.size / (1024 * 1024)).toFixed(1) + " MB"
          : Math.round(file.size / 1024) + " KB";
      setResumeFile({ name: file.name, size: sizeStr });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const sizeStr =
        file.size > 1024 * 1024
          ? (file.size / (1024 * 1024)).toFixed(1) + " MB"
          : Math.round(file.size / 1024) + " KB";
      setResumeFile({ name: file.name, size: sizeStr });
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (s: string) => {
    setSkills(skills.filter((item) => item !== s));
  };

  const toggleCompany = (company: string) => {
    if (selectedCompanies.includes(company)) {
      setSelectedCompanies(selectedCompanies.filter((c) => c !== company));
    } else {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  };

  const runEvaluation = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      setEvaluationDone(true);
    }, 1200);
  };

  const handleFinish = () => {
    router.push("/dashboard");
  };

  // Readiness calculation preview
  const readinessScore = evaluationDone
    ? 745
    : resumeFile
    ? 680
    : university
    ? 520
    : 380;

  return (
    <div className="min-h-[calc(100vh-16rem)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Top Demo Helper Bar */}
      <div className="bg-[#f2f3ff] rounded-xl p-3 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs border border-[#5145cd]/20">
        <div className="flex items-center gap-2">
          <Badge variant="verified">Architecture Quick Rig</Badge>
          <span className="text-[#66666f]">Need to test with realistic candidate data?</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handlePrefillDemo}
          className="text-xs h-7 py-0"
        >
          <Sparkles className="w-3 h-3 mr-1 text-[#5145cd]" />
          Pre-fill Demo Data (Ananya • IIT Delhi)
        </Button>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white rounded-xl shadow-xs border border-[#e7e7eb] p-6 mb-8">
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
          <div
            onClick={() => setStep(1)}
            className={`cursor-pointer flex flex-col items-center gap-1.5 ${
              step === 1 ? "text-[#5145cd]" : step > 1 ? "text-[#16834a]" : "text-[#8b8b95]"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 1
                  ? "bg-[#5145cd] text-white shadow-sm"
                  : step > 1
                  ? "bg-[#ebf7ee] text-[#16834a] border border-[#16834a]"
                  : "bg-[#f2f3ff] text-[#8b8b95]"
              }`}
            >
              {step > 1 ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <span>Market & Stage</span>
          </div>

          <div
            onClick={() => setStep(2)}
            className={`cursor-pointer flex flex-col items-center gap-1.5 ${
              step === 2 ? "text-[#5145cd]" : step > 2 ? "text-[#16834a]" : "text-[#8b8b95]"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 2
                  ? "bg-[#5145cd] text-white shadow-sm"
                  : step > 2
                  ? "bg-[#ebf7ee] text-[#16834a] border border-[#16834a]"
                  : "bg-[#f2f3ff] text-[#8b8b95]"
              }`}
            >
              {step > 2 ? <Check className="w-4 h-4" /> : "2"}
            </div>
            <span>Target Role & Ambition</span>
          </div>

          <div
            onClick={() => setStep(3)}
            className={`cursor-pointer flex flex-col items-center gap-1.5 ${
              step === 3 ? "text-[#5145cd]" : step > 3 ? "text-[#16834a]" : "text-[#8b8b95]"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 3
                  ? "bg-[#5145cd] text-white shadow-sm"
                  : step > 3
                  ? "bg-[#ebf7ee] text-[#16834a] border border-[#16834a]"
                  : "bg-[#f2f3ff] text-[#8b8b95]"
              }`}
            >
              {step > 3 ? <Check className="w-4 h-4" /> : "3"}
            </div>
            <span>Education & Skills</span>
          </div>

          <div
            onClick={() => setStep(4)}
            className={`cursor-pointer flex flex-col items-center gap-1.5 ${
              step === 4 ? "text-[#5145cd]" : "text-[#8b8b95]"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 4
                  ? "bg-[#5145cd] text-white shadow-sm"
                  : "bg-[#f2f3ff] text-[#8b8b95]"
              }`}
            >
              4
            </div>
            <span>Resume & Scoring</span>
          </div>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full bg-[#f0eded] rounded-full h-1.5 mt-5">
          <div
            className="bg-[#5145cd] h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Form Left, Score Dial Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container */}
        <div className="lg:col-span-8">
          <Card className="p-6 sm:p-8 bg-white border-[#e7e7eb] shadow-sm space-y-6">
            {/* ================= STEP 1 ================= */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5145cd] mb-1">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Target Career Ecosystem</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#171717] tracking-tight">
                    Select Your Market & Career Stage
                  </h2>
                  <p className="text-xs text-[#66666f] mt-1">
                    DreamX models hiring rubrics and compensation expectations independently based on your target market.
                  </p>
                </div>

                {/* Country and Timezone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#171717]">Home Jurisdiction (Residency)</label>
                    <select
                      value="IN"
                      disabled
                      className="w-full h-10 px-3 bg-[#fafafc] border border-[#e7e7eb] rounded-lg text-sm font-semibold text-[#171717]"
                    >
                      <option value="IN">🇮🇳 India (IN) • High Density Hub</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#171717]">Operational Timezone</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-[#e7e7eb] rounded-lg text-sm text-[#171717] focus:border-[#5145cd] focus:outline-none"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST • UTC+05:30)</option>
                      <option value="Asia/Singapore">Asia/Singapore (SGT • UTC+08:00)</option>
                      <option value="Europe/London">Europe/London (GMT • UTC+00:00)</option>
                      <option value="America/New_York">America/New_York (EST • UTC-05:00)</option>
                    </select>
                  </div>
                </div>

                {/* Market Selection Cards */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#171717]">Primary Target Market Engine</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMarket("CM-IN")}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        market === "CM-IN"
                          ? "bg-[#eef2ff] border-[#5145cd] ring-1 ring-[#5145cd]"
                          : "bg-white border-[#e7e7eb] hover:bg-[#fafafc]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#171717]">CM-IN: India Tier-1 & Unicorns</span>
                        <Badge variant="verified">Default</Badge>
                      </div>
                      <p className="text-xs text-[#66666f] mt-1">
                        High emphasis on DSA, Low-Latency Concurrency, and Machine Coding.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMarket("CM-US")}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        market === "CM-US"
                          ? "bg-[#eef2ff] border-[#5145cd] ring-1 ring-[#5145cd]"
                          : "bg-white border-[#e7e7eb] hover:bg-[#fafafc]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#171717]">CM-US: Silicon Valley Remote</span>
                        <Badge variant="neutral">Global</Badge>
                      </div>
                      <p className="text-xs text-[#66666f] mt-1">
                        1-page STAR resume format, deep system design, and behavioral leadership.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Career Stage */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#171717]">Where are you currently?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { id: "college-student", label: "College Student (Final / Pre-Final Year)" },
                      { id: "fresh-grad", label: "Fresh Graduate / Seeking 1st Job" },
                      { id: "early-pro", label: "Early Professional (1–3 yrs in service/tech)" },
                      { id: "switcher", label: "Career Switcher / Non-CS Background" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCareerStage(item.id)}
                        className={`p-3 rounded-lg border text-left text-xs font-semibold transition-all ${
                          careerStage === item.id
                            ? "bg-[#eef2ff] border-[#5145cd] text-[#5145cd]"
                            : "bg-white border-[#e7e7eb] text-[#171717] hover:bg-[#fafafc]"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button size="md" onClick={() => setStep(2)}>
                    <span>Continue to Target Role</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* ================= STEP 2 ================= */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5145cd] mb-1">
                    <Target className="w-3.5 h-3.5" />
                    <span>Aspirational Goal</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#171717] tracking-tight">
                    What is your target engineering role?
                  </h2>
                  <p className="text-xs text-[#66666f] mt-1">
                    Our mentor matching engine pairs you with mentors currently hiring for this exact profile.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#171717]">Target Job Title / Domain</label>
                  <Input
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. SDE-2 Backend Engineer, AI/ML Specialist, Product Manager"
                    className="h-10 text-sm"
                  />
                </div>

                {/* Target Companies */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#171717]">
                    Select Target Companies of Interest
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Google",
                      "Microsoft",
                      "Amazon",
                      "Swiggy",
                      "Zomato",
                      "Razorpay",
                      "Uber",
                      "Atlassian",
                    ].map((company) => {
                      const isSelected = selectedCompanies.includes(company);
                      return (
                        <button
                          key={company}
                          type="button"
                          onClick={() => toggleCompany(company)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            isSelected
                              ? "bg-[#5145cd] text-white shadow-xs"
                              : "bg-[#f2f3ff] text-[#66666f] hover:bg-[#e7e7eb]"
                          }`}
                        >
                          <span>{company}</span>
                          {isSelected ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button size="md" onClick={() => setStep(3)}>
                    <span>Continue to Education</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* ================= STEP 3 ================= */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5145cd] mb-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Academic & Technical Proofs</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#171717] tracking-tight">
                    Your Education & Technical Competencies
                  </h2>
                  <p className="text-xs text-[#66666f] mt-1">
                    Enter your academic credentials. These fields start completely empty so you can provide your own details.
                  </p>
                </div>

                {/* Institution & Grad Year */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-[#171717]">College / University Name</label>
                    <Input
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="e.g. IIT Delhi, BITS Pilani, NIT Trichy, VIT..."
                      className="h-10 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#171717]">Graduation Year</label>
                    <select
                      value={gradYear}
                      onChange={(e) => setGradYear(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-[#e7e7eb] rounded-lg text-sm text-[#171717] focus:border-[#5145cd] focus:outline-none"
                    >
                      <option value="" disabled>Select year</option>
                      <option value="2027">2027 or later</option>
                      <option value="2026">2026 (Pre-Final Year)</option>
                      <option value="2025">2025 (Final Year)</option>
                      <option value="2024">2024 (Recent Alum)</option>
                      <option value="2023">2023</option>
                      <option value="experienced">2022 or earlier (&gt;2 yrs exp)</option>
                    </select>
                  </div>
                </div>

                {/* Degree & GPA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#171717]">Degree & Specialization</label>
                    <Input
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="e.g. B.Tech Computer Science, BCA, MCA, M.Tech..."
                      className="h-10 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#171717]">CGPA / Percentage (Optional)</label>
                    <Input
                      value={gpa}
                      onChange={(e) => setGpa(e.target.value)}
                      placeholder="e.g. 8.4 / 10.0 or 82%"
                      className="h-10 text-sm"
                    />
                  </div>
                </div>

                {/* Skills Cloud */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-[#171717]">Technical Skills & Stack</label>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-lg bg-[#f2f3ff] text-[#5145cd] text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      placeholder="Add competency (e.g. React, Kubernetes, PostgreSQL)..."
                      className="h-9 text-xs"
                    />
                    <Button size="sm" variant="outline" onClick={addSkill} type="button">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add
                    </Button>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setStep(2)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button size="md" onClick={() => setStep(4)}>
                    <span>Continue to Resume Upload</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* ================= STEP 4: RESUME VAULT ================= */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5145cd] mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Deterministic 8-Dimension Evaluation</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#171717] tracking-tight">
                    Upload Your Resume for Scoring
                  </h2>
                  <p className="text-xs text-[#66666f] mt-1">
                    Establishing your baseline score triggers customized rubric recommendations for Tier-1 placements.
                  </p>
                </div>

                {/* Dropzone */}
                {!resumeFile ? (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="p-8 border-2 border-dashed border-[#e7e7eb] hover:border-[#5145cd] rounded-2xl bg-[#fafafc] hover:bg-[#f2f3ff]/50 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#eef2ff] text-[#5145cd] flex items-center justify-center shadow-xs">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-[#171717] block">
                        Drop your resume here or click to browse
                      </span>
                      <span className="text-xs text-[#8b8b95] mt-1 block">
                        Supports PDF or DOCX up to 5MB. Strictly encrypted via AES-256.
                      </span>
                    </div>
                    <div className="flex items-center gap-3 pt-2 text-[11px] text-[#8b8b95]">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#16834a]" /> Zero LLM Retention
                      </span>
                      <span>•</span>
                      <span>Private Storage Bucket</span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  /* Uploaded File Card */
                  <div className="p-4 rounded-xl border border-[#94f7b2] bg-[#ebf7ee] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white text-[#16834a] flex items-center justify-center shadow-xs">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-[#171717] block">
                          {resumeFile.name}
                        </span>
                        <span className="text-xs text-[#66666f]">
                          {resumeFile.size} • Uploaded & Ready for Baseline Rubric
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="verified">Parsed</Badge>
                      <button
                        type="button"
                        onClick={() => setResumeFile(null)}
                        className="p-1.5 text-[#8b8b95] hover:text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Evaluation Action Callout */}
                <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#5145cd]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="font-bold text-sm text-[#171717] block">
                      Ready to calibrate your Career Readiness Score?
                    </span>
                    <span className="text-xs text-[#66666f] block">
                      Runs semantic alignment against 1,200+ verified hiring rubrics.
                    </span>
                  </div>
                  <Button
                    size="sm"
                    disabled={!resumeFile || isEvaluating}
                    onClick={runEvaluation}
                    className="shadow-sm whitespace-nowrap"
                  >
                    {isEvaluating ? (
                      <span>Evaluating...</span>
                    ) : evaluationDone ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Score Synchronized
                      </span>
                    ) : (
                      <span>Run Baseline Evaluation</span>
                    )}
                  </Button>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setStep(3)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button size="lg" onClick={handleFinish} className="shadow-md">
                    <span>Complete & Launch Workspace</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Rail: Real-time Readiness Score & Matched Mentor */}
        <div className="lg:col-span-4 space-y-6">
          {/* Readiness Score Card */}
          <Card className="p-6 bg-white border-[#e7e7eb] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8b8b95]">
                Real-Time Readiness Dial
              </span>
              <Badge variant="verified">Tier 1 Target</Badge>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#171717] tnum">
                {readinessScore}
              </span>
              <span className="text-sm font-semibold text-[#8b8b95]">/ 1000</span>
              <span className="text-xs font-semibold text-[#16834a] ml-auto">
                {evaluationDone ? "+65 via Rubric Parse" : "Baseline Mode"}
              </span>
            </div>

            {/* Gauge Progress Bar */}
            <div className="w-full bg-[#f0eded] rounded-full h-2">
              <div
                className="bg-[#5145cd] h-2 rounded-full transition-all duration-700"
                style={{ width: `${(readinessScore / 1000) * 100}%` }}
              />
            </div>

            {/* 4 Rubric Dimensions */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>ATS Resume Quality</span>
                  <span className="text-[#5145cd]">{resumeFile ? "85%" : "0%"}</span>
                </div>
                <div className="w-full bg-[#f0eded] rounded-full h-1">
                  <div
                    className="bg-[#5145cd] h-1 rounded-full"
                    style={{ width: resumeFile ? "85%" : "0%" }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Technical Depth</span>
                  <span className="text-[#5145cd]">{skills.length > 0 ? "78%" : "0%"}</span>
                </div>
                <div className="w-full bg-[#f0eded] rounded-full h-1">
                  <div
                    className="bg-[#5145cd] h-1 rounded-full"
                    style={{ width: skills.length > 0 ? "78%" : "0%" }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Market Alignment ({market})</span>
                  <span className="text-[#5145cd]">70%</span>
                </div>
                <div className="w-full bg-[#f0eded] rounded-full h-1">
                  <div className="bg-[#5145cd] h-1 rounded-full w-[70%]" />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#fafafc] border border-[#e7e7eb] text-xs text-[#66666f]">
              <span className="font-semibold text-[#171717] block mb-0.5">Automated Insight:</span>
              {evaluationDone
                ? "High alignment with Google / Swiggy Tier-1 rubric. Complete a mock interview (S06) to push score above 800."
                : resumeFile
                ? "Resume parsed! Run baseline evaluation to calibrate dimension weights."
                : "Enter education and upload your resume to unlock complete 8-dimension calibration."}
            </div>
          </Card>

          {/* Matched Mentor Teaser */}
          <Card className="p-6 bg-white border-[#e7e7eb] shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#8b8b95] uppercase">Top Matched Mentor</span>
              <span className="text-[#16834a]">98% Fit</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#eef2ff] text-[#5145cd] flex items-center justify-center font-bold text-sm">
                VS
              </div>
              <div>
                <span className="font-bold text-sm text-[#171717] block">Vikramaditya S.</span>
                <span className="text-xs text-[#66666f]">Senior L5 Mentor @ Google</span>
              </div>
            </div>

            <p className="text-xs text-[#66666f]">
              Specialized in guiding candidates through Distributed Systems & Google / Swiggy hiring loops.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
