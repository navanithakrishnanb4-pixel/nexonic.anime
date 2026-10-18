/**
 * Hand-written row types for the subset of `public.works`,
 * `public.media_assets`, and `public.work_gallery_media` columns this
 * app actually reads, matching the column names from the Phase 18
 * schema design. This is NOT output from `supabase gen types` — there
 * was no generated-types step in this task. If your actual migration
 * used different column names/types than the Phase 18 proposal, these
 * will silently mismatch at runtime (Supabase just won't return the
 * field, or will error) rather than fail to compile, since Supabase's
 * JS client isn't strictly typed against your live schema without
 * running the generator. Running `supabase gen types typescript` and
 * swapping these hand-written interfaces for the generated ones is a
 * reasonable near-term follow-up, not done here to stay in scope.
 */

export interface WorkRow {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  cover_media_id: string | null;
  hero_media_id: string | null;
  status: string;
  year: number | null;
  category: string | null;
  genres: string[] | null;
  featured: boolean;
  trailer_url: string | null;
  credits: { name: string; role: string }[] | null;
  published_at: string | null;
}

/**
 * Full row shape for public.media_assets, as used by the Media Library
 * (works-data.ts only ever needs a subset of these fields for cover/
 * hero/gallery resolution and selects accordingly, but the type here
 * reflects the whole table).
 */
export interface MediaAssetRow {
  id: string;
  storage_path: string;
  file_name: string;
  bucket_name: string;
  mime_type: string;
  file_size: number | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  caption: string | null;
  created_by: string | null;
  created_at: string;
}

export interface WorkGalleryMediaRow {
  media_id: string;
  position: number;
  media_assets: { storage_path: string; alt_text: string | null } | null;
}

/**
 * Hand-written row types for public.journal_posts, public.episodes,
 * public.homepage_config, and public.announcements — same caveat as
 * WorkRow above: NOT generated from `supabase gen types`, written to
 * match the Phase 18 schema proposal for these tables. If the live
 * migration used different column names/types, these mismatch at
 * runtime rather than at compile time. See the reference migration
 * (supabase/reference-schema.sql, added in this step) for the exact
 * columns these types assume — reconcile that file against your real
 * schema (`supabase db diff` or the Table Editor) before relying on
 * this to compile-time-guarantee correctness.
 */
export interface JournalPostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_media_id: string | null;
  category: string | null;
  author_name: string | null;
  status: string;
  featured: boolean;
  published_at: string | null;
}

export interface EpisodeRow {
  id: string;
  work_id: string;
  season_number: number;
  episode_number: number;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_media_id: string | null;
  video_url: string | null;
  duration_seconds: number | null;
  release_date: string | null;
  status: string;
}

/** Single-row config table — every read/write targets the one existing row. */
export interface HomepageConfigRow {
  id: string;
  hero_eyebrow: string | null;
  hero_title: string;
  hero_description: string;
  hero_media_id: string | null;
  hero_image_position: string | null;
  hero_cta_label: string | null;
  hero_cta_href: string | null;
  hero_secondary_cta_label: string | null;
  hero_secondary_cta_href: string | null;
  hero_visible: boolean;
  featured_work_id: string | null;
  featured_work_visible: boolean;
  featured_journal_id: string | null;
  featured_journal_visible: boolean;
}

export interface AnnouncementRow {
  id: string;
  message: string;
  link_url: string | null;
  link_label: string | null;
  visible: boolean;
  starts_at: string | null;
  ends_at: string | null;
}
