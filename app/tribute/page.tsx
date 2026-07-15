import type { Metadata } from "next";
import { TributeStudio } from "@/components/tribute/studio";

export const metadata: Metadata = {
  title: "Tribute Video Studio",
  description:
    "Weave their photographs, favorite songs, and the verses they lived by into a tribute film — created privately in your browser, ready for the service.",
};

export default function TributePage() {
  return <TributeStudio />;
}
