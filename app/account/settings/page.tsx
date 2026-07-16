import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Card, Container } from "@/components/ui";
import { getCurrentUser } from "@/lib/server/auth";
import { PasswordForm } from "@/components/account/password-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account Settings",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/account");

  return (
    <div className="pb-24">
      <header className="border-b border-line bg-parchment-deep/60">
        <Container className="py-12">
          <span className="ornament text-[0.7rem] font-semibold uppercase tracking-[0.25em]">
            Account settings
          </span>
          <h1 className="mt-3 font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
            {user.name}
          </h1>
          <p className="mt-2 text-sm text-ink-faint">{user.email}</p>
        </Container>
      </header>
      <Container className="max-w-2xl py-12">
        <Card className="p-8">
          <h2 className="font-display text-2xl font-semibold text-ink">Change your password</h2>
          <p className="mt-1 mb-6 text-sm text-ink-soft">
            If you signed in with a temporary password from an invitation, choose your own here.
          </p>
          <PasswordForm />
        </Card>
      </Container>
    </div>
  );
}
