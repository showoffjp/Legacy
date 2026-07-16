import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import {
  unpublishMemorialAction,
  updateApplicationStatus,
  updateAssignmentStatus,
  updateRequestStatus,
} from "@/app/admin/actions";
import {
  condolenceCount,
  listAllPublishedMemorials,
  mealSummary,
  rsvpSummary,
} from "@/lib/server/memorials";
import { listPortalAccounts } from "@/lib/server/portal";
import { listRequestMessages } from "@/lib/server/messaging";
import { RequestThread } from "@/components/request-thread";
import { InvitePartnerForm } from "@/components/admin/invite-partner-form";
import { FUNERAL_HOMES } from "@/lib/data/funeral-homes";
import { CLERGY } from "@/lib/data/clergy";
import { categoryLabel } from "@/components/partners/categories";
import { Badge, Button, Card, Container, formatLongDate, formatUsd } from "@/components/ui";
import { clergyById } from "@/lib/data/clergy";
import { funeralHomeById } from "@/lib/data/funeral-homes";
import { getCurrentUser } from "@/lib/server/auth";
import {
  listCoordinationRequests,
  type CoordinationRequestRow,
} from "@/lib/server/coordination";
import { listMessages, type MessageRow } from "@/lib/server/notify";
import {
  listPartnerApplications,
  type PartnerApplicationRow,
} from "@/lib/server/partners";
import {
  ASSIGNMENT_STATUSES,
  listOrders,
  parseFunding,
  type OrderRow,
} from "@/lib/server/payments";
import type { ServicePlan } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Coordinator Console",
};

/* ——— Status vocabulary ——— */

const REQUEST_STATUSES = ["received", "confirmed", "in-progress", "completed"] as const;
const APPLICATION_STATUSES = ["received", "reviewing", "approved", "declined"] as const;

type BadgeTone = "gold" | "sage" | "ink";

const STATUS_TONES: Record<string, BadgeTone> = {
  received: "gold",
  confirmed: "sage",
  "in-progress": "ink",
  completed: "sage",
  reviewing: "ink",
  approved: "sage",
  declined: "ink",
  pending: "ink",
  paid: "sage",
  queued: "gold",
};

function toneFor(status: string): BadgeTone {
  return STATUS_TONES[status] ?? "ink";
}

/* ——— Small formatting helpers ——— */

/** "in-progress" → "In progress", "traditional-burial" → "Traditional burial". */
function humanize(value: string): string {
  const words = value.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** Full ISO timestamp → "July 15, 2026, 3:40 PM". */
function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function pluralize(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

function parsePlan(json: string): Partial<ServicePlan> {
  try {
    const parsed: unknown = JSON.parse(json);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as Partial<ServicePlan>;
    }
  } catch {
    // Malformed plan JSON — render the request without plan details.
  }
  return {};
}

/* ——— Shared building blocks ——— */

const selectCls =
  "rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold-pale";

function StatusForm({
  action,
  id,
  current,
  statuses,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  current: string;
  statuses: readonly string[];
}) {
  return (
    <form
      action={action}
      className="mt-5 flex flex-wrap items-end gap-3 border-t border-line/70 pt-4"
    >
      <input type="hidden" name="id" value={id} />
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-ink-soft">Status</span>
        <select name="status" defaultValue={current} className={selectCls}>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {humanize(status)}
            </option>
          ))}
        </select>
      </label>
      <Button type="submit" variant="outline" className="px-5 py-2 text-xs">
        Update
      </Button>
    </form>
  );
}

function ConsoleSection({
  title,
  count,
  note,
  children,
}: {
  title: string;
  count: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-14 first:mt-0">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h2 className="font-display text-3xl font-medium text-ink">{title}</h2>
        <span className="text-sm text-ink-faint">{count}</span>
      </div>
      {note ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-faint">{note}</p> : null}
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <Card className="border-dashed bg-white/50 p-8 text-center shadow-none">
      <p className="text-sm text-ink-faint">{children}</p>
    </Card>
  );
}

/* ——— Coordination requests ——— */

function PlanDetails({ plan }: { plan: Partial<ServicePlan> }) {
  const service = plan.service;
  const when = [service?.date ? formatLongDate(service.date) : "", service?.time ?? ""]
    .filter(Boolean)
    .join(" · ");
  const venue = [
    service?.venueName ?? "",
    [service?.location?.city, service?.location?.state].filter(Boolean).join(", "),
  ]
    .filter(Boolean)
    .join(" — ");

  const rows: { term: string; value: string }[] = [
    { term: "Service", value: service?.kind ? humanize(service.kind) : "" },
    { term: "Date & time", value: when },
    { term: "Venue", value: venue },
    { term: "Casket / urn", value: plan.casketId ?? "" },
    { term: "Flowers", value: (plan.flowerIds ?? []).join(", ") },
    { term: "Hymns", value: (plan.hymnIds ?? []).join(", ") },
    { term: "Scriptures", value: (plan.scriptureIds ?? []).join(", ") },
  ];

  return (
    <dl className="space-y-2 text-sm">
      {rows.map((row) => (
        <div key={row.term} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
          <dt className="w-32 shrink-0 font-medium text-ink">{row.term}</dt>
          <dd className="text-ink-soft">{row.value || "Not yet chosen"}</dd>
        </div>
      ))}
    </dl>
  );
}

function RequestCard({ request }: { request: CoordinationRequestRow }) {
  const plan = parsePlan(request.plan_json);
  const home = funeralHomeById(request.funeral_home_id);
  const minister = clergyById(request.clergy_id);
  const lovedOne = plan.deceased?.fullName || "Name not yet recorded";
  const cityState = [plan.service?.location?.city, plan.service?.location?.state]
    .filter(Boolean)
    .join(", ");

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="font-display text-xl font-medium text-ink">{request.reference}</h3>
        <Badge tone={toneFor(request.status)}>{humanize(request.status)}</Badge>
        <span className="ml-auto text-xs text-ink-faint">
          Received {formatTimestamp(request.created_at)}
        </span>
      </div>

      <div className="mt-4 grid gap-x-10 gap-y-3 text-sm sm:grid-cols-2">
        <div>
          <p className="font-medium text-ink">
            {lovedOne}
            {cityState ? (
              <span className="font-normal text-ink-soft"> · {cityState}</span>
            ) : null}
          </p>
          <p className="mt-1 text-ink-soft">
            {request.contact_name} · {request.contact_email}
            {request.contact_phone ? ` · ${request.contact_phone}` : ""}
          </p>
        </div>
        <div className="space-y-1 text-ink-soft">
          <p>Funeral home: {home?.name ?? "Not yet selected"}</p>
          <p>Minister: {minister?.name ?? "Not yet selected"}</p>
        </div>
      </div>

      {request.notes ? (
        <p className="mt-4 rounded-xl bg-parchment-deep/50 px-4 py-3 text-sm leading-relaxed text-ink-soft">
          {request.notes}
        </p>
      ) : null}

      <details className="group mt-4 rounded-xl border border-line/70 bg-white/60">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
          View full plan
          <span
            aria-hidden
            className="shrink-0 text-lg leading-none text-gold transition-transform duration-200 group-open:rotate-45"
          >
            +
          </span>
        </summary>
        <div className="border-t border-line/70 px-4 py-4">
          <PlanDetails plan={plan} />
        </div>
      </details>

      <RequestThread
        requestId={request.id}
        messages={listRequestMessages(request.id)}
        viewerRole="coordinator"
      />

      <StatusForm
        action={updateRequestStatus}
        id={request.id}
        current={request.status}
        statuses={REQUEST_STATUSES}
      />
    </Card>
  );
}

/* ——— Partner applications ——— */

function ApplicationCard({ application }: { application: PartnerApplicationRow }) {
  const location = [
    [application.city, application.state].filter(Boolean).join(", "),
    application.zip,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="font-display text-xl font-medium text-ink">{application.org_name}</h3>
        <Badge tone="ink">{categoryLabel(application.category)}</Badge>
        <Badge tone={toneFor(application.status)}>{humanize(application.status)}</Badge>
        <span className="ml-auto text-xs text-ink-faint">
          Applied {formatTimestamp(application.created_at)}
        </span>
      </div>

      <div className="mt-4 space-y-1 text-sm text-ink-soft">
        <p>
          {application.contact_name} · {application.email}
          {application.phone ? ` · ${application.phone}` : ""}
        </p>
        {location ? <p>{location}</p> : null}
        {application.website ? (
          <p>
            <a
              href={application.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-deep underline decoration-gold-pale underline-offset-4 hover:text-gold"
            >
              {application.website}
            </a>
          </p>
        ) : null}
      </div>

      {application.message ? (
        <p className="mt-4 rounded-xl bg-parchment-deep/50 px-4 py-3 text-sm leading-relaxed text-ink-soft">
          {application.message}
        </p>
      ) : null}

      <StatusForm
        action={updateApplicationStatus}
        id={application.id}
        current={application.status}
        statuses={APPLICATION_STATUSES}
      />
    </Card>
  );
}

/* ——— Orders ——— */

function OrderCard({ order }: { order: OrderRow }) {
  const funding = order.provider === "insurance-assignment" ? parseFunding(order) : null;
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="min-w-0">
          <p className="font-display text-lg font-medium text-ink">
            {order.reference}
            <span className="font-normal text-ink-soft"> — {order.package_name}</span>
          </p>
          <p className="mt-0.5 text-sm text-ink-soft">
            {order.contact_name} · {order.contact_email}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <p className="font-display text-xl font-medium text-ink">
            {formatUsd(order.amount_usd)}
          </p>
          <Badge
            tone={
              order.status === "paid"
                ? "sage"
                : order.status === "assignment-verified"
                  ? "gold"
                  : "ink"
            }
          >
            {humanize(order.status)}
          </Badge>
        </div>
      </div>
      {funding ? (
        <p className="mt-3 rounded-xl bg-gold-pale/40 px-4 py-2.5 text-sm text-ink-soft">
          🤝 Insurance assignment — {funding.insurer}
          {funding.policyNumber ? ` · policy ${funding.policyNumber}` : ""} · in the name of{" "}
          {funding.policyholder}
          {funding.faceAmountUsd > 0 ? ` · ~${formatUsd(funding.faceAmountUsd)} benefit` : ""}
          {funding.phone ? ` · ${funding.phone}` : ""}
        </p>
      ) : null}
      <p className="mt-3 text-xs text-ink-faint">
        Placed {formatTimestamp(order.created_at)}
        {order.paid_at ? ` · Paid ${formatTimestamp(order.paid_at)}` : ""}
      </p>
      {funding && order.status !== "paid" ? (
        <StatusForm
          action={updateAssignmentStatus}
          id={order.id}
          current={order.status}
          statuses={ASSIGNMENT_STATUSES}
        />
      ) : null}
    </Card>
  );
}

/* ——— Message outbox ——— */

function MessageCard({ message }: { message: MessageRow }) {
  const truncated = message.body.length > 140;
  const snippet = truncated ? `${message.body.slice(0, 140).trimEnd()}…` : message.body;

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone={message.channel === "sms" ? "sage" : "ink"}>{message.channel}</Badge>
        <span className="text-sm font-medium text-ink">{message.recipient}</span>
        <Badge tone={toneFor(message.status)}>{humanize(message.status)}</Badge>
        <span className="ml-auto text-xs text-ink-faint">
          {formatTimestamp(message.created_at)}
        </span>
      </div>

      {message.subject ? (
        <p className="mt-3 text-sm font-medium text-ink">{message.subject}</p>
      ) : null}
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{snippet}</p>

      {truncated ? (
        <details className="group mt-2">
          <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-[0.14em] text-gold-deep [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Read full message</span>
            <span className="hidden group-open:inline">Collapse</span>
          </summary>
          <p className="mt-3 whitespace-pre-wrap rounded-xl bg-parchment-deep/50 px-4 py-3 text-sm leading-relaxed text-ink-soft">
            {message.body}
          </p>
        </details>
      ) : null}
    </Card>
  );
}

/* ——— The console ——— */

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "coordinator") redirect("/account");

  const requests = listCoordinationRequests();
  const applications = listPartnerApplications();
  const orders = listOrders();
  const messages = listMessages();
  const memorials = listAllPublishedMemorials();
  const portalAccounts = listPortalAccounts();
  const homeOptions = FUNERAL_HOMES.map((h) => ({
    id: h.id,
    label: `${h.name} — ${h.location.city}, ${h.location.state}`,
  }));
  const clergyOptions = CLERGY.map((c) => ({
    id: c.id,
    label: `${c.name} (${c.denomination}) — ${c.location.city}, ${c.location.state}`,
  }));

  const openRequests = requests.filter((r) => r.status !== "completed").length;

  return (
    <div className="pb-24">
      <header className="border-b border-line bg-parchment-deep/60">
        <Container className="py-14 sm:py-16">
          <span className="ornament text-[0.7rem] font-semibold uppercase tracking-[0.25em]">
            Legacy care team
          </span>
          <h1 className="mt-4 font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
            The Coordinator Console
          </h1>
          <p className="mt-4 text-sm text-ink-soft">
            {pluralize(openRequests, "open request")} ·{" "}
            {pluralize(applications.length, "application")} ·{" "}
            {pluralize(orders.length, "order")}
          </p>
        </Container>
      </header>

      <Container className="pt-12 sm:pt-14">
        <ConsoleSection
          title="Coordination requests"
          count={pluralize(requests.length, "request")}
        >
          {requests.length === 0 ? (
            <EmptyState>
              No coordination requests yet. When a family sends their plan, it will appear
              here first — treat every one as a knock on the door.
            </EmptyState>
          ) : (
            requests.map((request) => <RequestCard key={request.id} request={request} />)
          )}
        </ConsoleSection>

        <ConsoleSection
          title="Partner applications"
          count={pluralize(applications.length, "application")}
        >
          {applications.length === 0 ? (
            <EmptyState>
              No applications waiting. When someone asks to join the partner network, their
              application will appear here for a personal review.
            </EmptyState>
          ) : (
            applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))
          )}
        </ConsoleSection>

        <ConsoleSection title="Orders" count={pluralize(orders.length, "order")}>
          {orders.length === 0 ? (
            <EmptyState>
              No orders yet. Package purchases will appear here with their payment status.
            </EmptyState>
          ) : (
            orders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </ConsoleSection>

        <ConsoleSection
          title="Partner portal accounts"
          count={pluralize(portalAccounts.length, "account")}
          note="Open a portal for a funeral home or minister — their coordination requests arrive there, and their status updates flow straight back to the family's dashboard."
        >
          <Card className="p-6">
            <InvitePartnerForm funeralHomes={homeOptions} clergy={clergyOptions} />
          </Card>
          {portalAccounts.map((account) => (
            <Card key={account.user_id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-medium text-ink">{account.org_name}</p>
                  <p className="mt-0.5 text-sm text-ink-faint">
                    {account.name} · {account.email}
                  </p>
                </div>
                <Badge tone={account.kind === "funeral-home" ? "gold" : "sage"}>
                  {account.kind === "funeral-home" ? "Funeral home" : "Clergy"}
                </Badge>
              </div>
            </Card>
          ))}
        </ConsoleSection>

        <ConsoleSection
          title="Published memorials"
          count={pluralize(memorials.length, "memorial")}
          note="Every family-published page of remembrance. Unpublishing hides a page without deleting its guestbook or RSVPs."
        >
          {memorials.length === 0 ? (
            <EmptyState>
              No published memorials yet. When a family publishes a page of remembrance from
              their plan, it appears here.
            </EmptyState>
          ) : (
            memorials.map((memorial) => {
              const rsvps = rsvpSummary(memorial.slug);
              const meals = mealSummary(memorial.slug);
              const condolences = condolenceCount(memorial.slug);
              return (
                <Card key={memorial.slug} className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <a
                        href={`/memorials/${memorial.slug}`}
                        className="font-display text-xl font-medium text-ink underline-offset-4 hover:underline"
                      >
                        {memorial.data.fullName}
                      </a>
                      <p className="mt-1 text-sm text-ink-faint">
                        /memorials/{memorial.slug} · {pluralize(condolences, "condolence")} ·{" "}
                        {rsvps.guests} guests expected · {pluralize(meals.dishes, "dish")}{" "}
                        promised
                      </p>
                    </div>
                    <form action={unpublishMemorialAction}>
                      <input type="hidden" name="slug" value={memorial.slug} />
                      <Button type="submit" variant="outline">
                        Unpublish
                      </Button>
                    </form>
                  </div>
                </Card>
              );
            })
          )}
        </ConsoleSection>

        <ConsoleSection
          title="Message outbox"
          count={pluralize(messages.length, "message")}
          note="Messages are recorded here in demo mode; a production SMTP or Twilio transport delivers them without any change to the call sites."
        >
          {messages.length === 0 ? (
            <EmptyState>
              No messages recorded yet. Confirmations to families and notices to partners
              will gather here as they are sent.
            </EmptyState>
          ) : (
            messages.map((message) => <MessageCard key={message.id} message={message} />)
          )}
        </ConsoleSection>
      </Container>
    </div>
  );
}
