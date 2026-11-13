/**
 * DreamX Calendar Integration Utility
 * Generates direct Google Calendar Web URLs and standard RFC 5545 iCalendar (.ics) files.
 * Works seamlessly across desktop, Android, iOS, and Outlook without complex OAuth requirements.
 */

export interface CalendarEventPayload {
  title: string;
  description: string;
  location?: string;
  startTime: Date | string;
  endTime: Date | string;
  bookingRef?: string;
}

function formatDateToICS(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

/**
 * Creates a direct Google Calendar Web URL.
 * When clicked, immediately opens calendar.google.com with title, time, and meeting details prefilled.
 */
export function getGoogleCalendarUrl(event: CalendarEventPayload): string {
  const start = new Date(event.startTime);
  const end = new Date(event.endTime);

  const startIso = formatDateToICS(start);
  const endIso = formatDateToICS(end);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: event.description,
    dates: `${startIso}/${endIso}`,
  });

  if (event.location) {
    params.set("location", event.location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates an RFC 5545 standard .ics file and triggers a browser download.
 */
export function downloadIcsFile(event: CalendarEventPayload): void {
  const start = new Date(event.startTime);
  const end = new Date(event.endTime);
  const now = new Date();

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DreamX Career Platform//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.bookingRef || "DX"}-${Date.now()}@dreamx.in`,
    `DTSTAMP:${formatDateToICS(now)}`,
    `DTSTART:${formatDateToICS(start)}`,
    `DTEND:${formatDateToICS(end)}`,
    `SUMMARY:${event.title.replace(/,/g, "\\,")}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n").replace(/,/g, "\\,")}`,
    event.location ? `LOCATION:${event.location.replace(/,/g, "\\,")}` : "",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${event.bookingRef || "dreamx-session"}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
