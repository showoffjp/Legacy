import type { Metadata } from "next";
import { ProgramView } from "@/components/plan/program-view";

export const metadata: Metadata = {
  title: "Order of Service Program",
  description:
    "A printable order-of-service program generated from your plan — cover, order of worship, obituary, and acknowledgments.",
};

export default function ProgramPage() {
  return <ProgramView />;
}
