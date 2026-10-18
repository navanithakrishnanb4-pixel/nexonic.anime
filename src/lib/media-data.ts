import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getMediaPublicUrl } from "@/lib/supabase/media";
import type { MediaAssetRow } from "@/lib/supabase/types";

/**
 * App-level shape — same isolation principle as Work/JournalPost:
 * components never see a raw Supabase row, only this.
 */
export interface MediaAsset {
  id: string;
  fileName: string;
  url: string;
  storagePath: string;
  category: string; // top-level folder, derived from storage_path (works/, journal/, etc.)
  mimeType: string;
  fileSize: number | null;
  width: number | null;
  height: number | null;
  altText: string | null;
  caption: string | null;
  createdAt: string;
}

function mapMediaRow(row: MediaAssetRow, publicUrl: string): MediaAsset {
  return {
    id: row.id,
    fileName: row.file_name,
    url: publicUrl,
    storagePath: row.storage_path,
    category: row.storage_path.split("/")[0] ?? "other",
    mimeType: row.mime_type,
    fileSize: row.file_size,
    width: row.width,
    height: row.height,
    altText: row.alt_text,
    caption: row.caption,
    createdAt: row.created_at,
  };
}

export async function getAllMedia(): Promise<MediaAsset[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[media-data] getAllMedia failed:", error.message);
    return [];
  }
  if (!data) return [];

  return (data as MediaAssetRow[]).map((row) => mapMediaRow(row, getMediaPublicUrl(supabase, row.storage_path)));
}
