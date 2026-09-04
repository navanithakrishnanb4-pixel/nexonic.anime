import type { JournalPost, Work } from "@/lib/types";
import { getAllWorks } from "@/lib/works-data";
import { getAllJournalPosts } from "@/lib/journal-data";

export interface SearchResults {
  works: Work[];
  journalPosts: JournalPost[];
}

/**
 * Searches published Works and Journal posts by title/description
 * substring match. Runs real logic against getAllWorks()/getAllJournalPosts()
 * — it's just that both currently resolve to [], so every query returns
 * empty results. This is intentionally simple (Array.filter, no search
 * index) per the brief's instruction not to introduce search
 * infrastructure prematurely; swapping to Postgres full-text search or
 * a Supabase RPC later only touches this function.
 */
export async function searchContent(query: string): Promise<SearchResults> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return { works: [], journalPosts: [] };

  const [works, journalPosts] = await Promise.all([getAllWorks(), getAllJournalPosts()]);

  return {
    works: works.filter(
      (w) =>
        w.title.toLowerCase().includes(trimmed) ||
        w.shortDescription.toLowerCase().includes(trimmed)
    ),
    journalPosts: journalPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(trimmed) || p.excerpt.toLowerCase().includes(trimmed)
    ),
  };
}
