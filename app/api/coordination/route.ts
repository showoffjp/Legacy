import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/server/auth";
import { createCoordinationRequest } from "@/lib/server/coordination";
import { EMPTY_PLAN, type ServicePlan } from "@/lib/types";

interface CoordinationBody {
  plan?: ServicePlan;
  contact?: { name?: string; email?: string; phone?: string };
  notes?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: CoordinationBody;
  try {
    body = (await req.json()) as CoordinationBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.contact?.name?.trim() ?? "";
  const email = body.contact?.email?.trim() ?? "";
  const phone = body.contact?.phone?.trim() ?? "";
  if (!name) return NextResponse.json({ error: "Please tell us your name." }, { status: 400 });
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  if (!body.plan || typeof body.plan !== "object") {
    return NextResponse.json({ error: "Missing plan" }, { status: 400 });
  }

  // Deep-merge over the empty plan so partial or hand-crafted payloads can
  // never leave nested objects missing.
  const incoming = body.plan;
  const plan: ServicePlan = {
    ...EMPTY_PLAN,
    ...incoming,
    deceased: { ...EMPTY_PLAN.deceased, ...incoming.deceased },
    service: {
      ...EMPTY_PLAN.service,
      ...incoming.service,
      location: { ...EMPTY_PLAN.service.location, ...incoming.service?.location },
    },
    program: { ...EMPTY_PLAN.program, ...incoming.program },
    hymnIds: Array.isArray(incoming.hymnIds) ? incoming.hymnIds : [],
    scriptureIds: Array.isArray(incoming.scriptureIds) ? incoming.scriptureIds : [],
    flowerIds: Array.isArray(incoming.flowerIds) ? incoming.flowerIds : [],
    addonIds: Array.isArray(incoming.addonIds) ? incoming.addonIds : [],
  };
  const user = await getCurrentUser();
  const { reference } = await createCoordinationRequest({
    userId: user?.id ?? null,
    contact: { name, email, phone },
    notes: body.notes?.trim() ?? "",
    plan,
  });

  return NextResponse.json({ ok: true, reference });
}
