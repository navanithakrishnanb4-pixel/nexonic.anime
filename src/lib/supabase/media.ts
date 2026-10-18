import type { SupabaseClient } from "@supabase/supabase-js";

/** The single Storage bucket used across the whole app. */
export const MEDIA_BUCKET = "media";

/**
 * Builds the public URL for a Storage object from its path. This is
 * the ONLY place that knows the bucket name — the Media Library (a
 * later step) should call this same function rather than constructing
 * Storage URLs itself, so the bucket structure only has to change in
 * one place if it ever does.
 *
 * Uses the SDK's own getPublicUrl (no network call, pure string
 * construction) rather than hand-building the URL, so this stays
 * correct if Supabase's public URL format ever changes.
 */
export function getMediaPublicUrl(supabase: SupabaseClient, storagePath: string): string {
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}
