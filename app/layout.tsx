import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PlanProvider } from "@/lib/plan-context";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

/** Inline CSS vars for one drifting cloud bank. */
function cloudVars(
  top: string,
  w: string,
  h: string,
  o: number,
  t: string,
  d: string,
): React.CSSProperties {
  return {
    "--cloud-top": top,
    "--cloud-w": w,
    "--cloud-h": h,
    "--cloud-o": o,
    "--cloud-t": t,
    "--cloud-d": d,
  } as React.CSSProperties;
}

const SITE_DESCRIPTION =
  "A Christian companion for life's final farewell: plan the service, book clergy, choose the casket and flowers, create tribute videos, and print the order of service — every detail carried with reverence.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Legacy — Christian Funeral Planning & Memorials",
    template: "%s · Legacy",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Legacy",
    title: "Legacy — Christian Funeral Planning & Memorials",
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Legacy — Christian Funeral Planning & Memorials",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        {/* Reveal-on-scroll only arms when JS runs and motion is welcome. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-ok')}catch(e){}",
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        {/* Flowing clouds drifting across the site-wide heavenly-blue sky.
            Deterministic values (no randomness) keep SSR and client identical;
            negative delays scatter the banks mid-sky on first paint. */}
        <div aria-hidden className="sky-clouds">
          <span style={cloudVars("6%", "64rem", "16rem", 0.8, "150s", "-38s")} />
          <span
            className="cloud-blue"
            style={cloudVars("20%", "44rem", "12rem", 0.6, "115s", "-80s")}
          />
          <span style={cloudVars("42%", "72rem", "18rem", 0.7, "180s", "-130s")} />
          <span
            className="cloud-blue"
            style={cloudVars("63%", "50rem", "13rem", 0.55, "135s", "-25s")}
          />
          <span style={cloudVars("81%", "60rem", "15rem", 0.65, "160s", "-100s")} />
        </div>
        <PlanProvider>
          <SiteNav />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </PlanProvider>
      </body>
    </html>
  );
}
