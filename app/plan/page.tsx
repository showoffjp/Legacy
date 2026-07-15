import type { Metadata } from "next";
import { PlanWizard } from "@/components/plan/wizard";

export const metadata: Metadata = {
  title: "Plan a Service",
  description:
    "A gentle planning companion: the service, the funeral home, the clergy, the casket, the flowers, the music — one step at a time.",
};

export default function PlanPage() {
  return <PlanWizard />;
}
