import { NextResponse, type NextRequest } from "next/server";
import { createConsultingInquiry } from "@/lib/server/consulting";
import { CHURCH_SIZES, INTERESTS } from "@/lib/consulting";

interface InquiryBody {
  name?: string;
  church?: string;
  email?: string;
  size?: string;
  interest?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: InquiryBody;
  try {
    body = (await req.json()) as InquiryBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim().slice(0, 120) ?? "";
  const church = body.church?.trim().slice(0, 160) ?? "";
  const email = body.email?.trim().slice(0, 200) ?? "";
  const message = body.message?.trim().slice(0, 4000) ?? "";
  // Free-typed values (from a tampered client) fall back to the honest default.
  const size = CHURCH_SIZES.includes(body.size ?? "") ? (body.size as string) : CHURCH_SIZES[0];
  const interest = INTERESTS.includes(body.interest ?? "")
    ? (body.interest as string)
    : INTERESTS[INTERESTS.length - 1];

  if (!name) return NextResponse.json({ error: "Please tell us your name." }, { status: 400 });
  if (!church) {
    return NextResponse.json({ error: "Please tell us your church's name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  const { reference } = await createConsultingInquiry({
    name,
    church,
    email,
    size,
    interest,
    message,
  });
  return NextResponse.json({ ok: true, reference });
}
