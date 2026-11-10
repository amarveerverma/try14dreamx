"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Video,
} from "lucide-react";

export default function StudentBookingsPage() {
  const activeBookings = [
    {
      id: "BK-9021",
      service: "Technical Mock Interview (S06)",
      mentor: "Vikram Singh (Senior L5 @ Google)",
      scheduledTime: "Tomorrow, 7:00 PM – 8:00 PM IST",
      status: "Confirmed (Video Link Ready)",
      escrowStatus: "Held in Escrow (₹999)",
      slaDeadline: "Report due within 48h of call completion",
      action: "Join Video Session",
    },
    {
      id: "BK-8842",
      service: "Resume Line-by-Line Teardown (S01)",
      mentor: "Ananya Sharma (Staff Engineer @ Swiggy)",
      scheduledTime: "Async Review (Submitted Nov 9)",
      status: "In Progress (Mentor Reviewing)",
      escrowStatus: "Held in Escrow (₹599)",
      slaDeadline: "18 hours remaining on 48h SLA",
      action: "Track Deliverable",
    },
  ];

  const pastBookings = [
    {
      id: "BK-8104",
      service: "ATS Keyword & Format Audit (S02)",
      mentor: "Rohit Deshmukh (Founder & Ex-Razorpay)",
      completedDate: "Oct 28, 2026",
      status: "Delivered On-Time (100% SLA)",
      scorecardUrl: "/dashboard/reports",
    },
  ];

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5145cd]">
            <Calendar className="w-3.5 h-3.5" />
            <span>Session &amp; Deliverable Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
            My Bookings &amp; Escrow Deliverables
          </h1>
          <p className="text-xs sm:text-sm text-[#66666f]">
            All session fees are protected in escrow and released only upon delivery of verified 48-hour diagnostic rubrics.
          </p>
        </div>
        <Link href="/services">
          <Button size="sm">
            <span>Book New Service</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Active Bookings */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#171717]">Active Sessions &amp; Async Reviews</h2>
        <div className="grid grid-cols-1 gap-4">
          {activeBookings.map((b) => (
            <Card key={b.id} className="p-6 bg-white border-[#e7e7eb] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#171717]">{b.service}</span>
                    <Badge variant="verified">Live Booking</Badge>
                  </div>
                  <span className="text-xs text-[#5145cd] font-semibold block">{b.mentor}</span>
                </div>
                <div className="text-xs font-semibold text-[#16834a] flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{b.escrowStatus}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#fafafc] p-3.5 rounded-xl border border-[#e7e7eb]">
                <div className="flex items-center gap-2 text-[#171717]">
                  <Clock className="w-4 h-4 text-[#8b8b95]" />
                  <span><strong>Time:</strong> {b.scheduledTime}</span>
                </div>
                <div className="flex items-center gap-2 text-[#171717]">
                  <FileCheck className="w-4 h-4 text-[#5145cd]" />
                  <span><strong>SLA:</strong> {b.slaDeadline}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-[#8b8b95]">Booking Ref: {b.id}</span>
                <Button size="sm">
                  <Video className="w-3.5 h-3.5 mr-1" />
                  <span>{b.action}</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Past Completed Sessions */}
      <div className="space-y-4 pt-6 border-t border-[#e7e7eb]">
        <h2 className="text-lg font-bold text-[#171717]">Completed Sessions &amp; Scorecards</h2>
        <div className="grid grid-cols-1 gap-3">
          {pastBookings.map((pb) => (
            <Card key={pb.id} className="p-4 bg-white border-[#e7e7eb] flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-sm text-[#171717] block">{pb.service}</span>
                <span className="text-[#66666f]">{pb.mentor} • Completed on {pb.completedDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="success">{pb.status}</Badge>
                <Link href={pb.scorecardUrl}>
                  <Button size="sm" variant="outline">
                    <span>View Scorecard</span>
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
