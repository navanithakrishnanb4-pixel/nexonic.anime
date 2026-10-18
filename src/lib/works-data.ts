import type { Work, WorkGalleryImage } from "@/lib/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getMediaPublicUrl } from "@/lib/supabase/media";
import type { MediaAssetRow, WorkGalleryMediaRow, WorkRow } from "@/lib/supabase/types";

type ServerSupabase = ReturnType<typeof createServerSupabaseClient>;
type ResolvedMedia = { url: string; alt: string | null };

/**
 * Real Supabase-backed implementation of the Works data seam. Every
 * function here keeps the exact signature it had as a stub
 * (`Promise<Work[]>`, `Promise<Work | null>`) — nothing downstream
 * (WorksCatalogue, WorkCard, the Work Detail page, the admin list/edit
 * pages) needed to change, because the `Work` contract in lib/types.ts
 * is the boundary, not this file's internals.
 *
 * PUBLIC VISIBILITY: this file never adds its own `.eq('status', ...)`
 * filter. The Supabase client below always authenticates with the
 * publishable/anon key, so Row Level Security on `public.works` is
 * what decides what's visible — there is exactly one place that
 * enforces "only published content is public" (the RLS policy), not
 * two places that could quietly drift apart.
 *
 * ERROR HANDLING: every query logs to the server console on failure
 * and returns an empty/null result to the caller — never a thrown
 * error, never the raw Postgres/Supabase error message rendered to a
 * visitor. A failed query looks identical to "no content yet" from
 * the public site's perspective, which is the safe default until this
 * needs more granular error UI.
 */

async function resolveMediaUrls(
  supabase: ServerSupabase,
  mediaIds: (string | null)[]
): Promise<Map<string, ResolvedMedia>> {
  const ids = Array.from(new Set(mediaIds.filter((id): id is string => Boolean(id))));
  if (ids.length === 0) return new Map();

  const { data, error } = await supabase
    .from("media_assets")
    .select("id, storage_path, alt_text")
    .in("id", ids);

  if (error || !data) {
    console.error("[works-data] media_assets lookup failed:", error?.message);
    return new Map();
  }

  const map = new Map<string, ResolvedMedia>();
  for (const row of data as MediaAssetRow[]) {
    map.set(row.id, {
      url: getMediaPublicUrl(supabase, row.storage_path),
      alt: row.alt_text,
    });
  }
  return map;
}

function mapWorkRow(row: WorkRow, mediaMap: Map<string, ResolvedMedia>): Work {
  const cover = row.cover_media_id ? mediaMap.get(row.cover_media_id) : undefined;
  const hero = row.hero_media_id ? mediaMap.get(row.hero_media_id) : undefined;

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    shortDescription: row.short_description ?? "",
    description: row.description ?? "",
    coverImageUrl: cover?.url ?? null,
    coverMediaId: row.cover_media_id,
    heroImageUrl: hero?.url ?? null,
    heroMediaId: row.hero_media_id,
    status: row.status as Work["status"],
    year: row.year,
    category: row.category,
    genres: row.genres ?? [],
    featured: row.featured,
    publishedAt: row.published_at,
    trailerUrl: row.trailer_url,
    // Gallery is intentionally NOT populated here — list views (Works
    // grid, homepage shelf, admin list) never render it, so fetching
    // work_gallery_media for every row in a list would be wasted work.
    // getWorkBySlug below is the one path that populates it.
    gallery: [],
    credits: row.credits ?? [],
  };
}

async function fetchGallery(
  supabase: ServerSupabase,
  workId: string
): Promise<WorkGalleryImage[]> {
  const { data, error } = await supabase
    .from("work_gallery_media")
    .select("media_id, position, media_assets(storage_path, alt_text)")
    .eq("work_id", workId)
    .order("position", { ascending: true });

  if (error || !data) {
    console.error("[works-data] work_gallery_media lookup failed:", error?.message);
    return [];
  }

  return (data as unknown as WorkGalleryMediaRow[]).map((row) => ({
    mediaId: row.media_id,
    url: row.media_assets ? getMediaPublicUrl(supabase, row.media_assets.storage_path) : null,
    alt: row.media_assets?.alt_text ?? "",
    position: row.position,
  }));
}

/** Every publicly-visible Work, per RLS. Used by /works and the homepage shelf. */
export async function getAllWorks(): Promise<Work[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("works")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("[works-data] getAllWorks failed:", error.message);
    return [];
  }
  if (!data || data.length === 0) return [];

  const rows = data as WorkRow[];
  const mediaMap = await resolveMediaUrls(
    supabase,
    rows.flatMap((w) => [w.cover_media_id, w.hero_media_id])
  );

  return rows.map((row) => mapWorkRow(row, mediaMap));
}

/**
 * Returns the publicly-visible Work matching `slug`, including its
 * gallery, or null if none exists (unknown slug OR a real-but-draft
 * work that RLS hides from this anon-key query — both look identical
 * here, which is correct: a visitor shouldn't be able to distinguish
 * "doesn't exist" from "exists but isn't published" via this page).
 */
export async function getWorkBySlug(slug: string): Promise<Work | null> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase.from("works").select("*").eq("slug", slug).maybeSingle();

  if (error) {
    console.error("[works-data] getWorkBySlug failed:", error.message);
    return null;
  }
  if (!data) return null;

  const row = data as WorkRow;
  const mediaMap = await resolveMediaUrls(supabase, [row.cover_media_id, row.hero_media_id]);
  const work = mapWorkRow(row, mediaMap);
  work.gallery = await fetchGallery(supabase, row.id);
  return work;
}

/**
 * Admin lookup by id. IMPORTANT LIMITATION (see final report): this
 * uses the same anon-key client as every public query above, and admin
 * authentication does not exist yet (explicitly out of scope for this
 * step). That means RLS applies here exactly as it does publicly — a
 * draft work will NOT be returned to /admin/works/[id] until an
 * authenticated admin session exists. This is expected, not a bug:
 * /admin currently has no auth gate at all, so it must not have any
 * more data access than the public site does.
 */
export async function getWorkById(id: string): Promise<Work | null> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase.from("works").select("*").eq("id", id).maybeSingle();

  if (error) {
    console.error("[works-data] getWorkById failed:", error.message);
    return null;
  }
  if (!data) return null;

  const row = data as WorkRow;
  const mediaMap = await resolveMediaUrls(supabase, [row.cover_media_id, row.hero_media_id]);
  return mapWorkRow(row, mediaMap);
}

