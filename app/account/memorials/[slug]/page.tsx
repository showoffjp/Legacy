import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { getCurrentUser } from "@/lib/server/auth";
import { getMemorialForOwner, listGiftPledges } from "@/lib/server/memorials";
import { MemorialEditForm } from "@/components/account/memorial-edit-form";
import { Card, formatUsd } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage the Memorial",
};

export default async function ManageMemorialPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/account");
  const memorial = getMemorialForOwner(slug, user.id);
  if (!memorial) notFound();

  return (
    <div className="pb-24">
      <header className="border-b border-line bg-parchment-deep/60">
        <Container className="py-12">
          <span className="ornament text-[0.7rem] font-semibold uppercase tracking-[0.25em]">
            Their page of remembrance
          </span>
          <h1 className="mt-3 font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
            Managing {memorial.data.fullName}&apos;s memorial
          </h1>
          <p className="mt-3 text-sm text-ink-soft">
            <Link
              href={`/memorials/${memorial.slug}`}
              className="text-gold-deep underline-offset-2 hover:underline"
            >
              View the page as guests see it
            </Link>{" "}
            · changes appear the moment you save.
          </p>
        </Container>
      </header>
      <Container className="max-w-3xl py-12">
        <MemorialEditForm memorial={memorial} />

        {(() => {
          const pledges = listGiftPledges(memorial.slug);
          if (pledges.length === 0) return null;
          const total = pledges.reduce((sum, p) => sum + p.amount_usd, 0);
          return (
            <Card className="mt-10 p-8">
              <h2 className="font-display text-2xl font-semibold text-ink">
                Gifts given in their memory
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                {pledges.length === 1 ? "One gift" : `${pledges.length} gifts`}
                {total > 0 ? ` · about ${formatUsd(total)} in all` : ""} — gathered here for your
                acknowledgment cards.
              </p>
              <ul className="mt-5 divide-y divide-line/70">
                {pledges.map((pledge) => (
                  <li key={pledge.id} className="flex items-baseline justify-between gap-4 py-2.5">
                    <span className="text-sm font-medium text-ink">{pledge.name}</span>
                    <span className="flex-1 truncate text-sm text-ink-faint">{pledge.note}</span>
                    <span className="shrink-0 text-sm text-gold-deep">
                      {pledge.amount_usd > 0 ? formatUsd(pledge.amount_usd) : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })()}
      </Container>
    </div>
  );
}
