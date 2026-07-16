import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { getCurrentUser } from "@/lib/server/auth";
import { getMemorialForOwner } from "@/lib/server/memorials";
import { MemorialEditForm } from "@/components/account/memorial-edit-form";

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
      </Container>
    </div>
  );
}
