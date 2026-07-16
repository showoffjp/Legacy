"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Card } from "@/components/ui";

export function ShareMemorial({ personName }: { personName: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard unavailable — leave quietly; the address bar still holds the link.
    }
  }

  return (
    <Card className="flex flex-col items-center justify-between gap-6 p-8 text-center sm:flex-row sm:p-10 sm:text-left">
      <div>
        <h2 className="font-display text-2xl font-medium text-ink">Share this memorial</h2>
        <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-ink-soft">
          Send this page to family and friends so they may read {personName}&rsquo;s story and
          sign the guestbook.
        </p>
      </div>
      <Button variant="outline" onClick={copyLink} className="shrink-0">
        <span aria-hidden className="text-gold">
          {copied ? "✓" : "⧉"}
        </span>
        <span aria-live="polite">{copied ? "Copied" : "Copy link"}</span>
      </Button>
    </Card>
  );
}
