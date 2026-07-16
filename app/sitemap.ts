import type { MetadataRoute } from "next";
import { MEMORIALS } from "@/lib/data/memorials";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/services",
    "/plan",
    "/plan/program",
    "/plan/obituary",
    "/plan/wishes",
    "/plan/cards",
    "/tribute",
    "/memorials",
    "/directory",
    "/checklist",
    "/resources",
    "/pricing",
    "/partners",
    "/account",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const memorialRoutes = MEMORIALS.map((memorial) => ({
    url: `${SITE_URL}/memorials/${memorial.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...memorialRoutes];
}
