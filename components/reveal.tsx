"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Reveal-on-scroll. Elements begin softly hidden and rise into place as they
 * enter the viewport, with optional stagger via `delay` (ms).
 *
 * Robustness: content is only hidden when the root <html> carries the
 * `motion-ok` class (set by an inline script in the layout when JS runs and
 * the visitor has not requested reduced motion). No JS, reduced motion, or
 * print → everything is simply visible.
 */

let sharedObserver: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver | null {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) return null;
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            sharedObserver?.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
  }
  return sharedObserver;
}

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span" | "figure";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = getObserver();
    if (!observer) {
      el.classList.add("reveal-in");
      return;
    }
    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag
      ref={ref as any}
      className={`reveal ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
