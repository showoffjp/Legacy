"use client";

import { Button } from "@/components/ui";

export function PrintButton({ label = "Print this document" }: { label?: string }) {
  return (
    <Button type="button" variant="dark" onClick={() => window.print()} className="no-print">
      🖨 {label}
    </Button>
  );
}
