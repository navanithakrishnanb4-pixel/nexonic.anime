import type { JournalPost } from "@/lib/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getMediaPublicUrl } from "@/lib/supabase/media";
import type { JournalPostRow, MediaAssetRow } from "@/lib/supabase/types";

type ServerSupabase = ReturnType<typeof createServerSupabaseClient>;

/**
 * Real Supabase-backed implementation — same shape/seam contract as
 * works-data.ts. PUBLIC VISIBILITY: this file never filters by status
 * itself; RLS on public.journal_posts is the one place that decides
 * what an anon-key query can see. Admin pages call these same
 * functions and see drafts/archived posts because their session is
 * authenticated as admin, not because this file branches on who's
 * asking.
 */

async function resolveCoverUrls(
  supabase: ServerSupabase,
  mediaIds: (string | null)[]
): Promise<Map<string, string>> {
  const ids = Array.from(new Set(mediaIds.filter((id): id is string => Boolean(id))));
  if (ids.length === 0) return new Map();

  const { data, error } = await supabase
    .from("media_assets")
    .select("id, storage_path")
    .in("id", ids);

  if (error || !data) {
    console.error("[journal-data] media_assets lookup failed:", error?.message);
    return new Map();
  }

  const map = new Map<string, string>();
  for (const row of data as MediaAssetRow[]) {
    map.set(row.id, getMediaPublicUrl(supabase, row.storage_path));
  }
  return map;
}

function mapJournalRow(row: JournalPostRow, coverMap: Map<string, string>): JournalPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? "",
    content: row.content ?? "",
    coverImageUrl: row.cover_media_id ? coverMap.get(row.cover_media_id) ?? null : null,
    coverMediaId: row.cover_media_id,
    category: row.category,
    authorName: row.author_name,
    status: (row.status as JournalPost["status"]) || "draft",
    publishedAt: row.published_at,
    featured: row.featured,
  };
}

/** Every publicly-visible post, per RLS. Also used by /admin/journal (sees all statuses there). */
export async function getAllJournalPosts(): Promise<JournalPost[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("journal_posts")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("[journal-data] getAllJournalPosts failed:", error.message);
    return [];
  }
  if (!data || data.length === 0) return [];

  const rows = data as JournalPostRow[];
  const coverMap = await resolveCoverUrls(supabase, rows.map((r) => r.cover_media_id));
  return rows.map((row) => mapJournalRow(row, coverMap));
}

/** Returns the publicly-visible post matching `slug`, or null (unknown OR hidden by RLS). */
export async function getJournalPostBySlug(slug: string): Promise<JournalPost | null> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("journal_posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[journal-data] getJournalPostBySlug failed:", error.message);
    return null;
  }
  if (!data) return null;

  const row = data as JournalPostRow;
  const coverMap = await resolveCoverUrls(supabase, [row.cover_media_id]);
  return mapJournalRow(row, coverMap);
}

/** Admin lookup by id, for /admin/journal/[id]. Subject to the same RLS as everything above. */
export async function getJournalPostById(id: string): Promise<JournalPost | null> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("journal_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[journal-data] getJournalPostById failed:", error.message);
    return null;
  }
  if (!data) return null;

  const row = data as JournalPostRow;
  const coverMap = await resolveCoverUrls(supabase, [row.cover_media_id]);
  return mapJournalRow(row, coverMap);
}

/** Up to `limit` other published posts, excluding the current one. */
export async function getRelatedJournalPosts(
  excludeSlug: string,
  limit = 3
): Promise<JournalPost[]> {
  const posts = await getAllJournalPosts();
  return posts.filter((p) => p.slug !== excludeSlug).slice(0, limit);
}
