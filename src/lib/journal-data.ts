import type { JournalPost } from "@/lib/types";

/**
 * TEMPORARY DATA LAYER for the Journal. Same seam pattern as
 * lib/works-data.ts — returns JournalPost[], currently empty because
 * there are zero real articles. Replace the body with a Supabase query
 * later; the Journal page and everything under it already handles an
 * empty array correctly, so no downstream changes are needed.
 */
export async function getAllJournalPosts(): Promise<JournalPost[]> {
  return [];
}

/**
 * Returns the published post matching `slug`, or null. Same contract
 * pattern as works-data.ts's getWorkBySlug — the [slug] page treats
 * null as "not found" via next/navigation's notFound(), never as an
 * error state or a reason to fabricate an article.
 */
export async function getJournalPostBySlug(slug: string): Promise<JournalPost | null> {
  const posts = await getAllJournalPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

/**
 * Up to 3 other published posts, excluding the current one. Currently
 * always empty. Used for the "related content" section on the article
 * page, which self-omits when this returns [].
 */
export async function getRelatedJournalPosts(
  excludeSlug: string,
  limit = 3
): Promise<JournalPost[]> {
  const posts = await getAllJournalPosts();
  return posts.filter((p) => p.slug !== excludeSlug).slice(0, limit);
}

export const journalCategoryFilters = [
  { label: "All", value: "all" },
  { label: "Production", value: "production" },
  { label: "Behind the Scenes", value: "behind-the-scenes" },
  { label: "Studio News", value: "studio-news" },
];

export const journalSortOptions = [
  { label: "Latest", value: "latest" },
  { label: "A–Z", value: "az" },
];
