import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PlanProvider } from "@/lib/plan-context";
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

export const metadata: Metadata = {
  title: {
    default: "Legacy — Christian Funeral Planning & Memorials",
    template: "%s · Legacy",
  },
  description:
    "A Christian companion for life's final farewell: plan the service, book clergy, choose the casket and flowers, create tribute videos, and print the order of service — every detail carried with reverence.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
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
