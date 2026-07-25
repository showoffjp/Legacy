"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";

const R = 42;
const CIRCUMFERENCE = 2 * Math.PI * R;

/**
 * A percentage stat drawn as a heavenly-blue arc with the number counting
 * up in its center. The finished state is server-rendered (arc at target,
 * true figure in text); motion only runs under html.motion-ok.
 */
export function StatRing({
  value,
  suffix = "%",
  duration = 1700,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const numRef = useRef<HTMLSpanElement | null>(null);
  const gradientId = useId();

  useEffect(() => {
    const root = rootRef.current;
    const num = numRef.current;
    if (!root || !num) return;
    if (!document.documentElement.classList.contains("motion-ok")) return;
    if (!("IntersectionObserver" in window)) return;

    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        root.classList.add("stat-ring-in"); // CSS draws the arc
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          num.textContent = `${Math.round(value * eased)}${suffix}`;
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, suffix, duration]);

  const target = CIRCUMFERENCE * (1 - Math.min(100, Math.max(0, value)) / 100);

  return (
    <div
      ref={rootRef}
      className="stat-ring relative mx-auto h-28 w-28"
      style={
        {
          "--ring-full": `${CIRCUMFERENCE}px`,
          "--ring-target": `${target}px`,
        } as CSSProperties
      }
    >
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke="var(--color-heaven-pale)"
          strokeWidth="6"
        />
        <circle
          className="stat-ring-arc"
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
        />
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7ea9dc" />
            <stop offset="100%" stopColor="#2f5e93" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        <span ref={numRef} className="font-display text-[1.7rem] font-semibold text-heaven-deep">
          {value}
          {suffix}
        </span>
      </span>
    </div>
  );
}
