import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { partnerUpdateStatus } from "@/app/portal/actions";
import { signOut } from "@/app/account/actions";
import { Badge, Button, Card, Container, formatLongDate } from "@/components/ui";
import { getCurrentUser } from "@/lib/server/auth";
import { getPartnerLink, listRequestsForPartner } from "@/lib/server/portal";
import { listRequestMessages, type RequestMessageRow } from "@/lib/server/messaging";
import { RequestThread } from "@/components/request-thread";
import type { CoordinationRequestRow } from "@/lib/server/coordination";
import type { ServicePlan } from "@/lib/types";
import { casketById } from "@/lib/data/caskets";
import { flowerById } from "@/lib/data/flowers";
import { addonById } from "@/lib/data/addons";
import { hymnById } from "@/lib/data/hymns";
import { scriptureById } from "@/lib/data/scriptures";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Partner Portal",
  description: "Coordination requests from families, addressed to your care.",
};

const STATUS_TONES: Record<string, "gold" | "sage" | "ink"> = {
  received: "gold",
  confirmed: "sage",
  "in-progress": "ink",
  completed: "sage",
};

function parsePlan(json: string): Partial<ServicePlan> | null {
  try {
    return JSON.parse(json) as Partial<ServicePlan>;
  } catch {
    return null;
  }
}

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function RequestCard({
  request,
  messages,
}: {
  request: CoordinationRequestRow;
  messages: RequestMessageRow[];
}) {
  const plan = parsePlan(request.plan_json);
  const lovedOne = plan?.deceased?.fullName || "A family's loved one";
  const when = [
    plan?.service?.date ? formatLongDate(plan.service.date) : "",
    plan?.service?.time ?? "",
  ]
    .filter(Boolean)
    .join(" at ");
  const where = [
    plan?.service?.venueName,
    [plan?.service?.location?.city, plan?.service?.location?.state].filter(Boolean).join(", "),
  ]
    .filter(Boolean)
    .join(" — ");
  const hymns = (plan?.hymnIds ?? []).map((id) => hymnById(id)?.title).filter(Boolean);
  const readings = (plan?.scriptureIds ?? [])
    .map((id) => scriptureById(id)?.reference)
    .filter(Boolean);
  const casket = plan?.casketId ? casketById(plan.casketId)?.name : "";
  const flowers = (plan?.flowerIds ?? []).map((id) => flowerById(id)?.name).filter(Boolean);
  const addons = (plan?.addonIds ?? []).map((id) => addonById(id)?.name).filter(Boolean);

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-sm font-medium text-ink">{request.reference}</span>
          <Badge tone={STATUS_TONES[request.status] ?? "ink"}>{request.status}</Badge>
        </div>
        <span className="text-xs text-ink-faint">Received {formatWhen(request.created_at)}</span>
      </div>

      <h3 className="mt-3 font-display text-2xl font-medium text-ink">
        The service for {lovedOne}
      </h3>
      <p className="mt-1 text-sm text-ink-soft">
        {when ? `${when}. ` : "Date to be confirmed. "}
        {where ? `${where}.` : ""}
      </p>
      <p className="mt-2 text-sm text-ink-soft">
        Family contact:{" "}
        <span className="font-medium text-ink">{request.contact_name}</span> ·{" "}
        <a className="text-gold-deep hover:underline" href={`mailto:${request.contact_email}`}>
          {request.contact_email}
        </a>
        {request.contact_phone ? (
          <>
            {" · "}
            <a className="text-gold-deep hover:underline" href={`tel:${request.contact_phone}`}>
              {request.contact_phone}
            </a>
          </>
        ) : null}
      </p>
      {request.notes ? (
        <p className="mt-2 rounded-xl bg-gold-pale/40 px-4 py-2.5 text-sm text-ink-soft">
          “{request.notes}”
        </p>
      ) : null}

      <details className="mt-4 rounded-xl border border-line bg-parchment px-4 py-3">
        <summary className="cursor-pointer text-sm font-medium text-ink">
          The family&apos;s plan in full
        </summary>
        <dl className="mt-3 space-y-1.5 text-sm text-ink-soft">
          {casket ? <div>Casket / urn: {casket}</div> : null}
          {flowers.length ? <div>Flowers: {flowers.join(", ")}</div> : null}
          {addons.length ? <div>Honors & add-ons: {addons.join(", ")}</div> : null}
          {hymns.length ? <div>Hymns: {hymns.join(", ")}</div> : null}
          {readings.length ? <div>Readings: {readings.join(", ")}</div> : null}
          {plan?.deceased?.veteran ? (
            <div>
              🎖️ Veteran — {plan.deceased.veteranBranch || "branch to be confirmed"}; honors
              requested.
            </div>
          ) : null}
          {plan?.service?.visitation ? <div>Visitation the evening before.</div> : null}
          {plan?.service?.livestream ? <div>Livestream requested.</div> : null}
          {plan?.service?.graveside ? <div>Graveside committal to follow.</div> : null}
        </dl>
      </details>

      <RequestThread requestId={request.id} messages={messages} viewerRole="partner" />

      <form
        action={partnerUpdateStatus}
        className="mt-5 flex flex-wrap items-end gap-3 border-t border-line pt-4"
      >
        <input type="hidden" name="id" value={request.id} />
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink">Status</span>
          <select
            name="status"
            defaultValue={request.status}
            className="rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink focus:border-gold focus:outline-none"
          >
            <option value="received">received</option>
            <option value="confirmed">confirmed — we have it in hand</option>
            <option value="in-progress">in progress</option>
            <option value="completed">completed</option>
          </select>
        </label>
        <Button type="submit" variant="outline">
          Update
        </Button>
        <span className="text-xs text-ink-faint">
          The family sees this on their dashboard the moment you update it.
        </span>
      </form>
    </Card>
  );
}

export default async function PortalPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "partner") redirect("/account");
  const link = getPartnerLink(user.id);
  if (!link) redirect("/account");

  const requests = listRequestsForPartner(link);
  const open = requests.filter((r) => r.status !== "completed").length;

  return (
    <div className="pb-24">
      <header className="border-b border-line bg-parchment-deep/60">
        <Container className="py-12 sm:py-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="ornament text-[0.7rem] font-semibold uppercase tracking-[0.25em]">
                Partner portal
              </span>
              <h1 className="mt-3 font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
                {link.org_name}
              </h1>
              <p className="mt-2 text-sm text-ink-soft">
                {open === 1 ? "1 open request" : `${open} open requests`} · signed in as{" "}
                {user.email}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/account/settings"
                className="rounded-full px-4 py-2 text-sm font-medium text-gold-deep transition-colors hover:bg-gold-pale/50"
              >
                Settings
              </a>
              <form action={signOut}>
                <Button variant="outline">Sign out</Button>
              </form>
            </div>
          </div>
        </Container>
      </header>

      <Container className="flex flex-col gap-5 py-12">
        {requests.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="mx-auto max-w-md text-sm leading-relaxed text-ink-soft">
              No requests yet. When a family chooses {link.org_name} in their plan and sends it
              to coordination, every detail arrives here — treat each one as a knock on the door.
            </p>
          </Card>
        ) : (
          requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              messages={listRequestMessages(request.id)}
            />
          ))
        )}
        <p className="text-xs text-ink-faint">
          Questions about a request? Call the Legacy coordination desk any hour — families are
          told you and we are working as one.
        </p>
      </Container>
    </div>
  );
}
