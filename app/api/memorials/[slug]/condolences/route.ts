import { NextResponse, type NextRequest } from "next/server";
import { addCondolence, getPublishedMemorial } from "@/lib/server/memorials";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!getPublishedMemorial(slug)) {
    return NextResponse.json({ error: "Memorial not found" }, { status: 404 });
  }
  let body: { name?: string; message?: string };
  try {
    body = (await req.json()) as { name?: string; message?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const name = body.name?.trim().slice(0, 120) ?? "";
  const message = body.message?.trim().slice(0, 4000) ?? "";
  if (!name) return NextResponse.json({ error: "Please share your name." }, { status: 400 });
  if (!message) {
    return NextResponse.json({ error: "Please write a few words of comfort." }, { status: 400 });
  }
  const condolence = addCondolence(slug, name, message);
  return NextResponse.json({ ok: true, condolence });
}
