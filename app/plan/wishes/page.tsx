import type { Metadata } from "next";
import { WishesView } from "@/components/plan/wishes-view";

export const metadata: Metadata = {
  title: "Letter of Wishes",
  description:
    "A printable, signable Letter of Wishes recording every choice for the service — a gift of clarity kept with your important documents.",
};

export default function WishesPage() {
  return <WishesView />;
}
