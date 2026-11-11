import type { MetadataRoute } from "next";
import { canonicalUrl, fetchPublicApi, type PublishedPageData } from "@/lib/seo";

const PUBLIC_INDEXABLE_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
    { path: "/", changeFrequency: "weekly", priority: 1.0 },
    { path: "/courses", changeFrequency: "weekly", priority: 0.9 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
    { path: "/book-counselling", changeFrequency: "weekly", priority: 0.8 },
    { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
    { path: "/gallery", changeFrequency: "monthly", priority: 0.7 },
    { path: "/verify-certificate", changeFrequency: "monthly", priority: 0.6 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  ];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const homePage = await fetchPublicApi<PublishedPageData>("/pages/home", 300);
  const stableFallbackDate = new Date("2026-11-11T00:00:00.000Z");
  const homeLastModified = homePage?.publishedAt ? new Date(homePage.publishedAt) : stableFallbackDate;

  return PUBLIC_INDEXABLE_ROUTES.map((route) => ({
    url: canonicalUrl(route.path),
    lastModified: route.path === "/" ? homeLastModified : stableFallbackDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
