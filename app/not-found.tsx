import Link from "next/link";
import { ButtonLink, Container, VerseBlock } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-night text-parchment">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="hero-glow hero-glow-gold" />
        <div className="hero-glow hero-glow-sage" />
      </div>
      <Container className="relative flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <span className="ornament ornament-draw text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-gold-pale">
          This page is not here
        </span>
        <h1 className="hero-rise mt-6 max-w-2xl font-display text-5xl font-medium leading-[1.1] sm:text-6xl">
          What you were seeking
          <span className="gold-shimmer italic"> has moved on.</span>
        </h1>
        <p className="hero-rise mt-6 max-w-xl text-sm leading-relaxed text-parchment/70" style={{ animationDelay: "0.2s" }}>
          The page may have been unpublished, or the address mistyped. Everything Legacy carries
          is still a step away.
        </p>
        <div className="hero-rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "0.35s" }}>
          <ButtonLink href="/">Return home</ButtonLink>
          <ButtonLink href="/memorials" variant="outline-inverse">
            Visit the memorials
          </ButtonLink>
        </div>
        <VerseBlock
          className="mt-14 [&_blockquote]:text-lg [&_blockquote]:text-parchment/80 [&_figcaption]:text-gold-pale"
          text="I will lift up mine eyes unto the hills, from whence cometh my help."
          reference="Psalm 121:1"
        />
        <p className="mt-10 text-xs text-parchment/40">
          Looking for a memorial that was here?{" "}
          <Link href="/directory" className="underline underline-offset-2 hover:text-parchment/70">
            Our coordinators can help
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}
