import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/server/auth";
import { createRemembrance } from "@/lib/server/remembrances";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: { yourName?: string; email?: string; lovedOneName?: string; deathDate?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const recipientName = String(body.yourName ?? "").trim().slice(0, 80);
  const recipientEmail = String(body.email ?? "").trim().slice(0, 200);
  const lovedOneName = String(body.lovedOneName ?? "").trim().slice(0, 120);
  const deathDate = String(body.deathDate ?? "").trim();

  if (!recipientName) {
    return NextResponse.json({ error: "Please tell us your name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(recipientEmail)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  if (!lovedOneName) {
    return NextResponse.json({ error: "Please tell us their name." }, { status: 400 });
  }

  const user = await getCurrentUser();
  const result = await createRemembrance({
    userId: user?.id ?? null,
    lovedOneName,
    deathDate,
    recipientName,
    recipientEmail,
  });
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, id: result.id, events: result.events });
}
