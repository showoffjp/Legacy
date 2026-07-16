import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/server/auth";
import { getPlanForUser, upsertPlanForUser } from "@/lib/server/plans";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const plan = getPlanForUser(user.id);
  return NextResponse.json({ plan: plan?.data ?? null, updatedAt: plan?.updatedAt ?? null });
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const data = (body as { data?: unknown })?.data;
  if (!data || typeof data !== "object") {
    return NextResponse.json({ error: "Missing plan data" }, { status: 400 });
  }
  // Guard the row size — a huge embedded portrait shouldn't sink the sync.
  const json = JSON.stringify(data);
  if (json.length > 2_000_000) {
    return NextResponse.json({ error: "Plan too large" }, { status: 413 });
  }
  const updatedAt = upsertPlanForUser(user.id, data);
  return NextResponse.json({ ok: true, updatedAt });
}
