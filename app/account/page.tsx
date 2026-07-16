import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Card, Container } from "@/components/ui";
import { AuthPanel } from "@/components/account/auth-panel";
import { getCurrentUser } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Your Account",
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "coordinator" ? "/admin" : "/account/dashboard");

  return (
    <div className="pb-24">
      <section className="border-b border-line bg-parchment-deep/60">
        <Container className="flex flex-col items-center py-16 text-center sm:py-20">
          <span className="ornament text-[0.7rem] font-semibold uppercase tracking-[0.25em]">
            Your account
          </span>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
            Kept safe, together
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-soft">
            An account keeps your family&rsquo;s plan safe across devices, and lets several
            family members carry it together — each one signing in to the same gathered
            wishes, so no detail rests on a single pair of shoulders.
          </p>
        </Container>
      </section>

      <section>
        <Container className="py-14 sm:py-16">
          <div className="mx-auto max-w-md">
            <Card className="p-7 sm:p-8">
              <AuthPanel />
            </Card>
            <p className="mt-6 text-center text-sm leading-relaxed text-ink-faint">
              Planning without an account? Everything you do in the planner is saved
              privately on your device — an account simply adds a safe copy and
              coordination history.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
