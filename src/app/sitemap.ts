import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getAllWorks } from "@/lib/works-data";
import { getAllJournalPosts } from "@/lib/journal-data";

// Built from live Supabase data, so it must not be frozen at build time.
export const dynamic = "force-dynamic";

/**
 * Lists the public pages plus every publicly-visible work and journal
 * post (the data functions already return only what RLS lets the public
 * see, so drafts never appear here). With zero published content this is
 * just the static pages.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [works, posts] = await Promise.all([getAllWorks(), getAllJournalPosts()]);

  const staticPages = ["", "/works", "/journal", "/watch", "/studio", "/privacy", "/terms"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.6,
    })
  );

  const workPages = works.map((w) => ({
    url: `${SITE_URL}/works/${w.slug}`,
    lastModified: w.publishedAt ?? undefined,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const journalPages = posts.map((p) => ({
    url: `${SITE_URL}/journal/${p.slug}`,
    lastModified: p.publishedAt ?? undefined,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...workPages, ...journalPages];
}
