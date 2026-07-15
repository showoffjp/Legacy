import type { Metadata } from "next";
import { Suspense } from "react";
import { DirectoryClient } from "@/components/directory/directory-client";
import { Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = { title: "Trusted Directory" };

export default function DirectoryPage() {
  return (
    <div className="pb-10 pt-14 sm:pt-20">
      <Container>
        <SectionHeading
          eyebrow="Trusted Directory"
          title="Trusted hands, vetted with care"
          lede="Every partner in this directory has been vetted by our care team — licensing confirmed, references checked in person, and a shared commitment to serving grieving families with dignity."
        />
      </Container>

      <Suspense
        fallback={
          <Container className="py-24 text-center">
            <p className="text-sm tracking-wide text-ink-faint">
              Gathering our trusted partners…
            </p>
          </Container>
        }
      >
        <DirectoryClient />
      </Suspense>
    </div>
  );
}
