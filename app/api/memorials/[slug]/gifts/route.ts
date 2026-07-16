import { NextResponse, type NextRequest } from "next/server";
import { addGiftPledge, getPublishedMemorial } from "@/lib/server/memorials";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!(await getPublishedMemorial(slug))) {
    return NextResponse.json({ error: "Memorial not found" }, { status: 404 });
  }
  let body: { name?: string; amountUsd?: number; note?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const name = body.name?.trim().slice(0, 120) ?? "";
  if (!name) return NextResponse.json({ error: "Please share your name." }, { status: 400 });
  await addGiftPledge({
    slug,
    name,
    amountUsd:
      typeof body.amountUsd === "number" && Number.isFinite(body.amountUsd) ? body.amountUsd : 0,
    note: body.note?.trim().slice(0, 500) ?? "",
  });
  return NextResponse.json({ ok: true });
}
