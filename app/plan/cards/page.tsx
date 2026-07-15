import type { Metadata } from "next";
import { CardsView } from "@/components/plan/cards-view";

export const metadata: Metadata = {
  title: "Acknowledgment Cards",
  description:
    "Printable acknowledgment cards matching the service program — the family's thanks for every kindness shown.",
};

export default function CardsPage() {
  return <CardsView />;
}
