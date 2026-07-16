import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private surfaces: consoles, portals, and account pages.
      disallow: ["/admin", "/portal", "/account/", "/api/", "/checkout"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
