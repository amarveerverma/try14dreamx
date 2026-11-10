"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Plus,
} from "lucide-react";

export default function MentorAvailabilityPage() {
  const [days] = React.useState([
    { day: "Tuesday", slots: ["7:00 PM – 8:00 PM IST", "8:30 PM – 9:30 PM IST"], active: true },
    { day: "Thursday", slots: ["7:00 PM – 8:00 PM IST"], active: true },
    { day: "Saturday", slots: ["11:00 AM – 12:00 PM IST", "4:00 PM – 5:00 PM IST"], active: true },
    { day: "Sunday", slots: ["11:00 AM – 12:00 PM IST"], active: true },
  ]);

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5145cd]">
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendar Slot Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
            Recurring Availability &amp; Buffer Rules
          </h1>
          <p className="text-xs sm:text-sm text-[#66666f]">
            Candidate bookings sync directly with your Google Calendar or Outlook. 2-hour minimum notice buffer enforced.
          </p>
        </div>
        <Button size="sm">
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Add Custom Slot</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {days.map((d) => (
          <Card key={d.day} className="p-5 bg-white border-[#e7e7eb] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#171717]">{d.day}</span>
                <Badge variant="verified">Active Window</Badge>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {d.slots.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-[#fafafc] border border-[#e7e7eb] text-xs font-semibold text-[#171717] flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#5145cd]" />
                    <span>{s}</span>
                  </span>
                ))}
              </div>
            </div>
            <Button size="sm" variant="outline">
              <span>Edit Slots</span>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
