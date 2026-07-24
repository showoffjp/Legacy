import type { Metadata } from "next";
import { ConsultingNav } from "@/components/consulting/nav";
import { ConsultingFooter } from "@/components/consulting/footer";

const DESCRIPTION =
  "Steward AI helps churches adopt artificial intelligence with wisdom: board-ready AI policies, safe data practices, staff training, and hands-on implementation. Predominantly non-denominational — every congregation welcome.";

export const metadata: Metadata = {
  title: {
    default: "Steward AI — AI Consulting for Churches",
    template: "%s · Steward AI",
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Steward AI",
    title: "Steward AI — AI Consulting for Churches",
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Steward AI — AI Consulting for Churches",
    description: DESCRIPTION,
  },
};

export default function ConsultingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <ConsultingNav />
      <div className="flex-1">{children}</div>
      <ConsultingFooter />
    </div>
  );
}
