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
        <PlanProvider>
          <SiteNav />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </PlanProvider>
      </body>
    </html>
  );
}
