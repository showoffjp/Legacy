import type { Metadata } from "next";
import { ObituaryView } from "@/components/plan/obituary-view";

export const metadata: Metadata = {
  title: "Obituary",
  description:
    "A printable obituary generated from your plan, with a copy-ready version for newspaper submission.",
};

export default function ObituaryPage() {
  return <ObituaryView />;
}
