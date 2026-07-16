import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/server/auth";
import { publishMemorialFromPlan } from "@/lib/server/memorials";
import { EMPTY_PLAN, type ServicePlan } from "@/lib/types";

export async function POST(req: NextRequest) {
  let body: { plan?: ServicePlan };
  try {
    body = (await req.json()) as { plan?: ServicePlan };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const incoming = body.plan;
  if (!incoming || typeof incoming !== "object") {
    return NextResponse.json({ error: "Missing plan" }, { status: 400 });
  }
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
  if (!plan.deceased.fullName.trim()) {
    return NextResponse.json(
      { error: "Please add your loved one's name before publishing their memorial." },
      { status: 400 },
    );
  }
  if (plan.deceased.portraitDataUrl.length > 1_000_000) {
    // Downscaled portraits are ~100 KB; anything larger is not from our uploader.
    plan.deceased.portraitDataUrl = "";
  }

  const user = await getCurrentUser();
  const slug = await publishMemorialFromPlan(plan, user?.id ?? null);
  return NextResponse.json({ ok: true, slug });
}
