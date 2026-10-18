import type { Episode } from "@/lib/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getMediaPublicUrl } from "@/lib/supabase/media";
import type { EpisodeRow, MediaAssetRow } from "@/lib/supabase/types";

type ServerSupabase = ReturnType<typeof createServerSupabaseClient>;
type EpisodeRowWithWork = EpisodeRow & { works: { title: string } | null };

/**
 * Real Supabase-backed Episodes data seam. Same visibility contract as
 * works-data.ts/journal-data.ts: RLS on public.episodes decides what an
 * anon-key query sees, this file never adds its own status filter.
 */

async function resolveThumbnailUrls(
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
    console.error("[episodes-data] media_assets lookup failed:", error?.message);
    return new Map();
  }

  const map = new Map<string, string>();
  for (const row of data as MediaAssetRow[]) {
    map.set(row.id, getMediaPublicUrl(supabase, row.storage_path));
  }
  return map;
}

function mapEpisodeRow(
  row: EpisodeRow | EpisodeRowWithWork,
  thumbMap: Map<string, string>
): Episode {
  return {
    id: row.id,
    workId: row.work_id,
    workTitle: "works" in row ? row.works?.title : undefined,
    seasonNumber: row.season_number,
    episodeNumber: row.episode_number,
    title: row.title,
    slug: row.slug,
    description: row.description ?? "",
    thumbnailUrl: row.thumbnail_media_id ? thumbMap.get(row.thumbnail_media_id) ?? null : null,
    thumbnailMediaId: row.thumbnail_media_id,
    videoUrl: row.video_url,
    durationSeconds: row.duration_seconds,
    releaseDate: row.release_date,
    status: (row.status as Episode["status"]) || "draft",
  };
}

/** Every publicly-visible episode, per RLS. Used by /admin/episodes (sees all statuses there). */
export async function getAllEpisodes(): Promise<Episode[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("episodes")
    .select("*, works(title)")
    .order("season_number", { ascending: true })
    .order("episode_number", { ascending: true });

  if (error) {
    console.error("[episodes-data] getAllEpisodes failed:", error.message);
    return [];
  }
  if (!data || data.length === 0) return [];

  const rows = data as unknown as EpisodeRowWithWork[];
  const thumbMap = await resolveThumbnailUrls(supabase, rows.map((r) => r.thumbnail_media_id));
  return rows.map((row) => mapEpisodeRow(row, thumbMap));
}

/** Published episodes for a single work, ordered for the Watch page. */
export async function getEpisodesForWork(workId: string): Promise<Episode[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("episodes")
    .select("*")
    .eq("work_id", workId)
    .order("season_number", { ascending: true })
    .order("episode_number", { ascending: true });

  if (error) {
    console.error("[episodes-data] getEpisodesForWork failed:", error.message);
    return [];
  }
  if (!data || data.length === 0) return [];

  const rows = data as EpisodeRow[];
  const thumbMap = await resolveThumbnailUrls(supabase, rows.map((r) => r.thumbnail_media_id));
  return rows.map((row) => mapEpisodeRow(row, thumbMap));
}

export async function getEpisodeById(id: string): Promise<Episode | null> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("episodes")
    .select("*, works(title)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[episodes-data] getEpisodeById failed:", error.message);
    return null;
  }
  if (!data) return null;

  const row = data as unknown as EpisodeRowWithWork;
  const thumbMap = await resolveThumbnailUrls(supabase, [row.thumbnail_media_id]);
  return mapEpisodeRow(row, thumbMap);
}

/**
 * Lightweight count, for the public Work Detail page's episode teaser
 * — deliberately doesn't fetch full episode rows just to display a
 * number. RLS applies exactly as everywhere else, so this only ever
 * counts what's actually visible to the current session.
 */
export async function getEpisodeCountForWork(workId: string): Promise<number> {
  const supabase = createServerSupabaseClient();
  const { count, error } = await supabase
    .from("episodes")
    .select("id", { count: "exact", head: true })
    .eq("work_id", workId);

  if (error) {
    console.error("[episodes-data] getEpisodeCountForWork failed:", error.message);
    return 0;
  }
  return count ?? 0;
}
