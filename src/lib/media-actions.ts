"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { MEDIA_BUCKET } from "@/lib/supabase/media";

export interface MediaActionState {
  error: string | null;
}

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const ALLOWED_CATEGORIES = new Set(["works", "episodes", "journal", "homepage", "studio"]);

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-]+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Upload flow: validate → upload to Storage → insert media_assets row.
 * If the DB insert fails after a successful Storage upload, the
 * uploaded object is removed so nothing orphaned survives a failed
 * request (per the brief's explicit "do not leave orphaned Storage
 * files" instruction).
 *
 * Authorization: same reasoning as works-actions.ts — this action
 * relies on the caller already being inside a session that passed
 * the (protected) layout's admin check, AND on Storage policies that
 * independently require an admin-authorized session to write to the
 * `media` bucket. Neither check happens "in the UI."
 */
export async function uploadMediaAction(
  _prevState: MediaActionState,
  formData: FormData
): Promise<MediaActionState> {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to upload media." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Select an image file to upload." };
  }
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return { error: "Unsupported file type. Upload a JPEG, PNG, WebP, GIF, or AVIF image." };
  }

  const categoryRaw = String(formData.get("category") ?? "");
  const category = ALLOWED_CATEGORIES.has(categoryRaw) ? categoryRaw : "studio";

  const altText = String(formData.get("altText") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();

  // Client-detected dimensions (see MediaUploadForm) — best-effort, no
  // server-side image-processing dependency added for this.
  const widthRaw = formData.get("width");
  const heightRaw = formData.get("height");
  const width = widthRaw ? Number(widthRaw) : null;
  const height = heightRaw ? Number(heightRaw) : null;

  const uniqueName = `${randomUUID()}-${sanitizeFileName(file.name)}`;
  const storagePath = `${category}/${uniqueName}`;

  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error("[media-actions] Storage upload failed:", uploadError.message);
    return { error: "Upload failed. Please try again." };
  }

  const { error: insertError } = await supabase.from("media_assets").insert({
    storage_path: storagePath,
    bucket_name: MEDIA_BUCKET,
    file_name: file.name,
    mime_type: file.type,
    file_size: file.size,
    width: Number.isFinite(width) ? width : null,
    height: Number.isFinite(height) ? height : null,
    alt_text: altText || null,
    caption: caption || null,
    created_by: user.id,
  });

  if (insertError) {
    console.error("[media-actions] media_assets insert failed:", insertError.message);
    const { error: cleanupError } = await supabase.storage.from(MEDIA_BUCKET).remove([storagePath]);
    if (cleanupError) {
      console.error(
        "[media-actions] ORPHANED STORAGE OBJECT — cleanup after failed insert also failed:",
        storagePath,
        cleanupError.message
      );
    }
    return { error: "Upload failed while saving media details. Please try again." };
  }

  revalidatePath("/admin/media");
  return { error: null };
}

export async function updateMediaMetadataAction(
  id: string,
  _prevState: MediaActionState,
  formData: FormData
): Promise<MediaActionState> {
  const supabase = createServerSupabaseClient();

  const altText = String(formData.get("altText") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();

  const { error } = await supabase
    .from("media_assets")
    .update({ alt_text: altText || null, caption: caption || null })
    .eq("id", id);

  if (error) {
    console.error("[media-actions] updateMediaMetadataAction failed:", error.message);
    return { error: "Could not save changes. Please try again." };
  }

  revalidatePath("/admin/media");
  return { error: null };
}

export async function deleteMediaAction(id: string): Promise<{ error: string | null }> {
  const supabase = createServerSupabaseClient();

  const { data: existing, error: lookupError } = await supabase
    .from("media_assets")
    .select("storage_path, bucket_name")
    .eq("id", id)
    .maybeSingle();

  if (lookupError || !existing) {
    return { error: "This media asset no longer exists." };
  }

  // Database row removed first: if a Work/Journal/Episode/homepage_config
  // still references this asset via a foreign key, THIS is where the
  // delete is blocked (FK violation) — the visible admin state stays
  // consistent (the record is either fully gone or still fully present,
  // never "gone from the DB but the file remains and nothing points to
  // it," which the alternate order risks turning into a silent leak
  // that's harder to notice).
  const { error: deleteRowError } = await supabase.from("media_assets").delete().eq("id", id);

  if (deleteRowError) {
    console.error("[media-actions] media_assets delete failed:", deleteRowError.message);
    if (deleteRowError.code === "23503") {
      return {
        error:
          "This media asset can't be deleted because it's still used by a Work, Journal post, Episode, or the homepage configuration.",
      };
    }
    return { error: "Something went wrong deleting this media asset. Please try again." };
  }

  const { error: storageError } = await supabase.storage
    .from(existing.bucket_name || "media")
    .remove([existing.storage_path]);

  if (storageError) {
    // The database record is already gone (correct, per the ordering
    // above) — a failure here means an orphaned Storage object, logged
    // loudly so it's discoverable rather than silently forgotten.
    console.error(
      "[media-actions] ORPHANED STORAGE OBJECT after DB delete:",
      existing.storage_path,
      storageError.message
    );
  }

  revalidatePath("/admin/media");
  return { error: null };
}
