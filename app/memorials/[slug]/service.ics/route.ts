import { NextResponse } from "next/server";
import { getPublishedMemorial } from "@/lib/server/memorials";

const KIND_LABELS: Record<string, string> = {
  "traditional-burial": "Funeral Service",
  "cremation-with-service": "Funeral Service",
  "memorial-service": "Memorial Service",
  "graveside-service": "Graveside Service",
};

function icsEscape(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** Downloadable calendar entry for the service (floating local time). */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const memorial = getPublishedMemorial(slug);
  const service = memorial?.data.service;
  if (!memorial || !service?.date) {
    return NextResponse.json({ error: "No service scheduled" }, { status: 404 });
  }

  const date = service.date.replace(/-/g, "");
  const time = (service.time || "11:00").replace(":", "") + "00";
  const startStamp = `${date}T${time}`;
  const endHour = String(
    Math.min(23, Number((service.time || "11:00").split(":")[0]) + 2),
  ).padStart(2, "0");
  const endStamp = `${date}T${endHour}${(service.time || "11:00").split(":")[1]}00`;

  const title = `${KIND_LABELS[service.kind] ?? "Service"} for ${memorial.data.fullName}`;
  const location = [service.venueName, service.city, service.state].filter(Boolean).join(", ");
  const description = [
    `In loving memory of ${memorial.data.fullName}.`,
    service.livestream ? "A livestream link will be shared by the family." : "",
    `Memorial: /memorials/${slug}`,
  ]
    .filter(Boolean)
    .join("\n");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Legacy//Memorial Service//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${slug}-service@legacy`,
    `DTSTAMP:${memorial.createdAt.replace(/[-:]/g, "").slice(0, 15)}Z`,
    `DTSTART:${startStamp}`,
    `DTEND:${endStamp}`,
    `SUMMARY:${icsEscape(title)}`,
    location ? `LOCATION:${icsEscape(location)}` : "",
    `DESCRIPTION:${icsEscape(description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="service-${slug}.ics"`,
    },
  });
}
