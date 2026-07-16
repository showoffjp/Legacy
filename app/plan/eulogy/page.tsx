import type { Metadata } from "next";
import { EulogyStudio } from "@/components/plan/eulogy-studio";

export const metadata: Metadata = {
  title: "Write the Eulogy",
  description:
    "Gentle interview prompts woven into a eulogy draft in your own words — always yours to edit — with a large-type pulpit copy for whoever stands up to speak.",
};

export default function EulogyPage() {
  return <EulogyStudio />;
}
