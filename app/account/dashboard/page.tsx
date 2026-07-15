import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { signOut } from "@/app/account/actions";
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  Container,
  formatLongDate,
  formatUsd,
} from "@/components/ui";
import { getCurrentUser } from "@/lib/server/auth";
import { getPlanForUser } from "@/lib/server/plans";
import { listCoordinationRequestsForUser } from "@/lib/server/coordination";
import { listOrdersForUser } from "@/lib/server/payments";
import {
  condolenceCount,
  listMemorialsForOwner,
  rsvpSummary,
} from "@/lib/server/memorials";
import type { ServiceKind, ServicePlan } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Dashboard",
};

const KIND_LABELS: Record<ServiceKind, string> = {
  "traditional-burial": "Traditional burial",
  "cremation-with-service": "Cremation with service",
  "memorial-service": "Memorial service",
  "graveside-service": "Graveside service",
};

type BadgeTone = "gold" | "sage" | "ink";

const REQUEST_TONES: Record<string, BadgeTone> = {
  received: "gold",
  confirmed: "sage",
  "in-progress": "ink",
  completed: "sage",
};

const ORDER_TONES: Record<string, BadgeTone> = {
  pending: "ink",
  paid: "sage",
};

function statusLabel(status: string): string {
  const words = status.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** Format a full ISO timestamp (e.g. created_at) as a long date. */
function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function count(n: number, singular: string, plural = `${singular}s`): string {
  return `${n} ${n === 1 ? singular : plural}`;
}

function lovedOneFromPlanJson(planJson: string): string {
  try {
    const parsed = JSON.parse(planJson) as Partial<ServicePlan>;
    return parsed.deceased?.fullName?.trim() ?? "";
  } catch {
    return "";
  }
}

function DashboardSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Detail({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
        {term}
      </dt>
      <dd className="mt-1 text-sm leading-relaxed text-ink-soft">{children}</dd>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/account");

  const firstName = user.name.trim().split(/\s+/)[0] || user.name;
  const planRecord = getPlanForUser(user.id);
  const plan = planRecord ? (planRecord.data as ServicePlan) : null;
  const requests = listCoordinationRequestsForUser(user.id);
  const orders = listOrdersForUser(user.id);
  const memorials = listMemorialsForOwner(user.id);

  return (
    <div className="pb-24">
      <section className="border-b border-line bg-parchment-deep/60">
        <Container className="py-12 sm:py-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="ornament text-[0.7rem] font-semibold uppercase tracking-[0.25em]">
                Your dashboard
              </span>
              <h1 className="mt-3 font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
                Peace be with you, {firstName}.
              </h1>
              <p className="mt-2 text-sm text-ink-faint">{user.email}</p>
            </div>
            <form action={signOut}>
              <Button variant="outline">Sign out</Button>
            </form>
          </div>
        </Container>
      </section>

      <Container className="flex flex-col gap-12 py-12 sm:py-14">
        {user.role === "coordinator" ? (
          <Card className="flex flex-wrap items-center justify-between gap-4 p-6">
            <p className="text-sm leading-relaxed text-ink-soft">
              You also serve as a Legacy coordinator.
            </p>
            <ButtonLink variant="ghost" href="/admin">
              Open the coordinator console
            </ButtonLink>
          </Card>
        ) : null}

        <DashboardSection title="Your plan">
          {plan ? (
            <Card className="p-7 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl font-medium text-ink">
                  {plan.deceased.fullName || "Your loved one"}
                </h3>
                {planRecord ? (
                  <span className="text-xs text-ink-faint">
                    Last saved {formatWhen(planRecord.updatedAt)}
                  </span>
                ) : null}
              </div>
              <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                <Detail term="Service">
                  {plan.service.kind ? KIND_LABELS[plan.service.kind] : "Not yet chosen"}
                </Detail>
                <Detail term="When">
                  {plan.service.date ? formatLongDate(plan.service.date) : "Not yet set"}
                </Detail>
                <Detail term="Where">
                  {[
                    plan.service.venueName,
                    [plan.service.location.city, plan.service.location.state]
                      .filter(Boolean)
                      .join(", "),
                  ]
                    .filter(Boolean)
                    .join(" — ") || "Not yet chosen"}
                </Detail>
                <Detail term="Chosen so far">
                  {[
                    count(plan.hymnIds.length, "hymn"),
                    count(plan.scriptureIds.length, "reading"),
                    count(plan.flowerIds.length, "flower arrangement"),
                  ].join(" · ")}
                </Detail>
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/plan">Continue planning</ButtonLink>
                <ButtonLink variant="ghost" href="/plan/program">
                  View the program
                </ButtonLink>
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center sm:p-10">
              <p className="mx-auto max-w-md text-sm leading-relaxed text-ink-soft">
                Nothing is saved to your account yet. Begin in the planner — your plan will
                appear here once you save from a signed-in browser.
              </p>
              <div className="mt-6 flex justify-center">
                <ButtonLink href="/plan">Begin a plan</ButtonLink>
              </div>
            </Card>
          )}
        </DashboardSection>

        {memorials.length > 0 ? (
          <DashboardSection title="Their memorial pages">
            <div className="flex flex-col gap-4">
              {memorials.map((memorial) => {
                const rsvps = rsvpSummary(memorial.slug);
                const condolences = condolenceCount(memorial.slug);
                return (
                  <Card key={memorial.slug} className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="font-display text-xl font-medium text-ink">
                          {memorial.data.fullName}
                        </h3>
                        <p className="mt-1 text-sm text-ink-faint">
                          {condolences === 1
                            ? "1 condolence in the guestbook"
                            : `${condolences} condolences in the guestbook`}
                          {" · "}
                          {rsvps.families === 1
                            ? `1 family (${rsvps.guests} ${rsvps.guests === 1 ? "guest" : "guests"}) expected`
                            : `${rsvps.families} families (${rsvps.guests} guests) expected`}
                        </p>
                      </div>
                      <ButtonLink variant="ghost" href={`/memorials/${memorial.slug}`}>
                        Visit the memorial
                      </ButtonLink>
                    </div>
                  </Card>
                );
              })}
            </div>
          </DashboardSection>
        ) : null}

        <DashboardSection title="Coordination requests">
          {requests.length > 0 ? (
            <div className="flex flex-col gap-4">
              {requests.map((request) => {
                const lovedOne = lovedOneFromPlanJson(request.plan_json);
                return (
                  <Card key={request.id} className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-sm font-medium text-ink">
                          {request.reference}
                        </span>
                        <Badge tone={REQUEST_TONES[request.status] ?? "ink"}>
                          {statusLabel(request.status)}
                        </Badge>
                      </div>
                      <span className="text-xs text-ink-faint">
                        Sent {formatWhen(request.created_at)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      {lovedOne
                        ? `The service for ${lovedOne}, in our coordinators' care.`
                        : "This plan is in our coordinators' care."}
                    </p>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="mx-auto max-w-md text-sm leading-relaxed text-ink-soft">
                When you send your plan to our coordinators, its progress lives here.
              </p>
            </Card>
          )}
        </DashboardSection>

        <DashboardSection title="Orders">
          {orders.length > 0 ? (
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-base font-medium text-ink">
                          {order.package_name}
                        </h3>
                        <Badge tone={ORDER_TONES[order.status] ?? "ink"}>
                          {statusLabel(order.status)}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-ink-faint">
                        <span className="font-mono">{order.reference}</span> ·{" "}
                        {formatWhen(order.created_at)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="font-display text-xl font-medium text-ink">
                        {formatUsd(order.amount_usd)}
                      </span>
                      <ButtonLink
                        variant="ghost"
                        href={
                          order.status === "paid"
                            ? `/checkout/${order.reference}/receipt`
                            : `/checkout/${order.reference}`
                        }
                      >
                        {order.status === "paid" ? "View receipt" : "Complete payment"}
                      </ButtonLink>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="mx-auto max-w-md text-sm leading-relaxed text-ink-soft">
                No orders yet. When your family chooses a package, its record and receipt
                will rest here.
              </p>
              <div className="mt-6 flex justify-center">
                <ButtonLink variant="ghost" href="/pricing">
                  See packages &amp; pricing
                </ButtonLink>
              </div>
            </Card>
          )}
        </DashboardSection>
      </Container>
    </div>
  );
}
