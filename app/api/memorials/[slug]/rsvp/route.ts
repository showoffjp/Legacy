import { NextResponse, type NextRequest } from "next/server";
import { addRsvp, getPublishedMemorial } from "@/lib/server/memorials";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!getPublishedMemorial(slug)) {
    return NextResponse.json({ error: "Memorial not found" }, { status: 404 });
  }
  let body: { name?: string; attending?: boolean; guests?: number; note?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const name = body.name?.trim().slice(0, 120) ?? "";
  if (!name) return NextResponse.json({ error: "Please share your name." }, { status: 400 });
  addRsvp({
    slug,
    name,
    attending: body.attending !== false,
    guests: typeof body.guests === "number" && Number.isFinite(body.guests) ? body.guests : 1,
    note: body.note?.trim().slice(0, 1000) ?? "",
  });
  return NextResponse.json({ ok: true });
}
