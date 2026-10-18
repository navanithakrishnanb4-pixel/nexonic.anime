"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { WorkStatus } from "@/lib/types";

export interface WorkFormState {
  error: string | null;
}

const UNIQUE_VIOLATION = "23505";

/**
 * Maps the WorkForm's <input name="..."> fields directly to
 * public.works columns. This is the one place that does that mapping
 * for writes, mirroring how works-data.ts is the one place that maps
 * rows back into the Work contract for reads — neither direction
 * spreads raw Supabase shapes into components.
 */
function parseWorkFormData(formData: FormData) {
  const genres = String(formData.get("genres") ?? "")
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);

  const yearRaw = formData.get("year");
  const year = yearRaw && String(yearRaw).trim() !== "" ? Number(yearRaw) : null;

  return {
    title: String(formData.get("title") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    short_description: String(formData.get("shortDescription") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    category: (formData.get("category") as string) || null,
    year: year !== null && Number.isFinite(year) ? year : null,
    status: (formData.get("status") as WorkStatus) || "draft",
    trailer_url: (formData.get("trailerUrl") as string) || null,
    genres,
    featured: formData.get("featured") === "on",
    cover_media_id: (formData.get("coverMediaId") as string) || null,
    hero_media_id: (formData.get("heroMediaId") as string) || null,
  };
}

/** work_gallery_media rows are submitted as a single JSON field: [{mediaId, position}]. */
function parseGalleryFormData(formData: FormData): { media_id: string; position: number }[] {
  const raw = formData.get("gallery");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(String(raw)) as { mediaId: string; position: number }[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.mediaId === "string")
      .map((item, i) => ({ media_id: item.mediaId, position: item.position ?? i }));
  } catch {
    return [];
  }
}

/**
 * Replaces this work's entire work_gallery_media row set — delete-all
 * then bulk-insert. Simpler and safer than diffing against what's
 * already there (no partial-apply state to reason about if a step
 * fails), and the gallery is small enough per work that this is not a
 * performance concern.
 */
async function syncWorkGallery(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  workId: string,
  gallery: { media_id: string; position: number }[]
): Promise<string | null> {
  const { error: deleteError } = await supabase
    .from("work_gallery_media")
    .delete()
    .eq("work_id", workId);
  if (deleteError) {
    console.error("[works-actions] syncWorkGallery delete failed:", deleteError.message);
    return "Something went wrong saving the gallery. Please try again.";
  }

  if (gallery.length === 0) return null;

  const { error: insertError } = await supabase
    .from("work_gallery_media")
    .insert(gallery.map((g) => ({ work_id: workId, media_id: g.media_id, position: g.position })));
  if (insertError) {
    console.error("[works-actions] syncWorkGallery insert failed:", insertError.message);
    return "Something went wrong saving the gallery. Please try again.";
  }

  return null;
}

function validate(values: ReturnType<typeof parseWorkFormData>): string | null {
  if (!values.title) return "Title is required.";
  if (!values.slug) return "Slug is required.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug)) {
    return "Slug must be lowercase letters, numbers, and hyphens only (e.g. my-work-title).";
  }
  return null;
}

/**
 * Note on authorization: this function does NOT check "is this user an
 * admin" itself. It doesn't need to — the Supabase client here carries
 * the same session cookie the (protected) layout already verified
 * belongs to an authenticated admin before this page could even
 * render, AND the INSERT/UPDATE/DELETE RLS policies on public.works
 * independently re-check that same admin condition at the database
 * layer. If someone ever called this action without a valid admin
 * session (e.g. by hitting the action's endpoint directly), RLS
 * rejects the write regardless of what this code does — the database
 * is the actual enforcement point, not this function.
 */
export async function createWorkAction(
  _prevState: WorkFormState,
  formData: FormData
): Promise<WorkFormState> {
  const values = parseWorkFormData(formData);
  const validationError = validate(values);
  if (validationError) return { error: validationError };

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("works")
    .insert(values)
    .select("id")
    .single();

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      return { error: `The slug "${values.slug}" is already in use. Choose a different slug.` };
    }
    console.error("[works-actions] createWorkAction failed:", error.message);
    return { error: "Something went wrong saving this work. Please try again." };
  }

  const galleryError = await syncWorkGallery(supabase, data.id, parseGalleryFormData(formData));
  if (galleryError) return { error: galleryError };

  revalidatePath("/works");
  revalidatePath("/admin/works");
  redirect(`/admin/works/${data.id}`);
}

export async function updateWorkAction(
  id: string,
  _prevState: WorkFormState,
  formData: FormData
): Promise<WorkFormState> {
  const values = parseWorkFormData(formData);
  const validationError = validate(values);
  if (validationError) return { error: validationError };

  const supabase = createServerSupabaseClient();

  // Needed to revalidate the OLD public URL too, in case the slug changed.
  const { data: existing } = await supabase
    .from("works")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("works").update(values).eq("id", id);

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      return { error: `The slug "${values.slug}" is already in use. Choose a different slug.` };
    }
    console.error("[works-actions] updateWorkAction failed:", error.message);
    return { error: "Something went wrong saving this work. Please try again." };
  }

  const galleryError = await syncWorkGallery(supabase, id, parseGalleryFormData(formData));
  if (galleryError) return { error: galleryError };

  revalidatePath("/works");
  revalidatePath("/admin/works");
  revalidatePath(`/admin/works/${id}`);
  if (existing?.slug) revalidatePath(`/works/${existing.slug}`);
  if (values.slug !== existing?.slug) revalidatePath(`/works/${values.slug}`);

  return { error: null };
}

export async function deleteWorkAction(id: string): Promise<{ error: string | null }> {
  const supabase = createServerSupabaseClient();

  const { data: existing } = await supabase
    .from("works")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  // No custom soft-delete: this is a real DELETE. If the database's
  // own foreign-key constraints (e.g. episodes/work_gallery_media
  // referencing this work) block it, Supabase returns a foreign-key
  // violation error, which is surfaced as a plain message rather than
  // silently ignored or worked around with a cascading delete we
  // weren't asked to add.
  const { error } = await supabase.from("works").delete().eq("id", id);

  if (error) {
    console.error("[works-actions] deleteWorkAction failed:", error.message);
    if (error.code === "23503") {
      return {
        error:
          "This work can't be deleted because other content still references it (e.g. episodes or gallery media).",
      };
    }
    return { error: "Something went wrong deleting this work. Please try again." };
  }

  revalidatePath("/works");
  revalidatePath("/admin/works");
  if (existing?.slug) revalidatePath(`/works/${existing.slug}`);

  return { error: null };
}
