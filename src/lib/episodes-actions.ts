"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ContentStatus } from "@/lib/types";

export interface EpisodeFormState {
  error: string | null;
}

const UNIQUE_VIOLATION = "23505";

function parseEpisodeFormData(formData: FormData) {
  const seasonNumber = Number(formData.get("seasonNumber"));
  const episodeNumber = Number(formData.get("episodeNumber"));
  const durationRaw = formData.get("durationSeconds");
  const duration = durationRaw && String(durationRaw).trim() !== "" ? Number(durationRaw) : null;
  const releaseDate = (formData.get("releaseDate") as string) || null;

  return {
    work_id: String(formData.get("workId") ?? "").trim(),
    season_number: Number.isFinite(seasonNumber) ? seasonNumber : 1,
    episode_number: Number.isFinite(episodeNumber) ? episodeNumber : 1,
    title: String(formData.get("title") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    thumbnail_media_id: (formData.get("thumbnailMediaId") as string) || null,
    video_url: (formData.get("videoUrl") as string) || null,
    duration_seconds: duration !== null && Number.isFinite(duration) ? duration : null,
    release_date: releaseDate,
    status: (formData.get("status") as ContentStatus) || "draft",
  };
}

function validate(values: ReturnType<typeof parseEpisodeFormData>): string | null {
  if (!values.work_id) return "Select the series this episode belongs to.";
  if (!values.title) return "Title is required.";
  if (!values.slug) return "Slug is required.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug)) {
    return "Slug must be lowercase letters, numbers, and hyphens only.";
  }
  if (values.season_number < 1) return "Season number must be at least 1.";
  if (values.episode_number < 1) return "Episode number must be at least 1.";
  return null;
}

/**
 * The schema may not have a DB-level unique constraint across
 * (work_id, season_number, episode_number) — unlike slug, which the
 * DB itself is expected to enforce (same 23505 pattern as Works/
 * Journal). This check is the app-level equivalent for that
 * combination, run before insert/update rather than assumed.
 */
async function findDuplicateEpisodeNumber(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  values: ReturnType<typeof parseEpisodeFormData>,
  excludeId?: string
): Promise<boolean> {
  let query = supabase
    .from("episodes")
    .select("id")
    .eq("work_id", values.work_id)
    .eq("season_number", values.season_number)
    .eq("episode_number", values.episode_number);

  if (excludeId) query = query.neq("id", excludeId);

  const { data, error } = await query.maybeSingle();
  if (error) return false; // fail open on lookup error — the save attempt itself will surface real problems
  return Boolean(data);
}

export async function createEpisodeAction(
  _prevState: EpisodeFormState,
  formData: FormData
): Promise<EpisodeFormState> {
  const values = parseEpisodeFormData(formData);
  const validationError = validate(values);
  if (validationError) return { error: validationError };

  const supabase = createServerSupabaseClient();

  if (await findDuplicateEpisodeNumber(supabase, values)) {
    return {
      error: `Season ${values.season_number}, Episode ${values.episode_number} already exists for this series.`,
    };
  }

  const { data, error } = await supabase.from("episodes").insert(values).select("id").single();

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      return { error: `The slug "${values.slug}" is already in use. Choose a different slug.` };
    }
    if (error.code === "23503") {
      return { error: "The selected series doesn't exist. Please choose a valid series." };
    }
    console.error("[episodes-actions] createEpisodeAction failed:", error.message);
    return { error: "Something went wrong saving this episode. Please try again." };
  }

  revalidatePath("/watch");
  revalidatePath("/admin/episodes");
  redirect(`/admin/episodes/${data.id}`);
}

export async function updateEpisodeAction(
  id: string,
  _prevState: EpisodeFormState,
  formData: FormData
): Promise<EpisodeFormState> {
  const values = parseEpisodeFormData(formData);
  const validationError = validate(values);
  if (validationError) return { error: validationError };

  const supabase = createServerSupabaseClient();

  if (await findDuplicateEpisodeNumber(supabase, values, id)) {
    return {
      error: `Season ${values.season_number}, Episode ${values.episode_number} already exists for this series.`,
    };
  }

  const { data: existing } = await supabase
    .from("episodes")
    .select("work_id, works(slug)")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("episodes").update(values).eq("id", id);

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      return { error: `The slug "${values.slug}" is already in use. Choose a different slug.` };
    }
    if (error.code === "23503") {
      return { error: "The selected series doesn't exist. Please choose a valid series." };
    }
    console.error("[episodes-actions] updateEpisodeAction failed:", error.message);
    return { error: "Something went wrong saving this episode. Please try again." };
  }

  revalidatePath("/watch");
  revalidatePath("/admin/episodes");
  revalidatePath(`/admin/episodes/${id}`);
  const workSlug = (existing as unknown as { works: { slug: string } | null } | null)?.works
    ?.slug;
  if (workSlug) revalidatePath(`/watch/${workSlug}`);

  return { error: null };
}

export async function deleteEpisodeAction(id: string): Promise<{ error: string | null }> {
  const supabase = createServerSupabaseClient();

  const { data: existing } = await supabase
    .from("episodes")
    .select("work_id, works(slug)")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("episodes").delete().eq("id", id);

  if (error) {
    console.error("[episodes-actions] deleteEpisodeAction failed:", error.message);
    return { error: "Something went wrong deleting this episode. Please try again." };
  }

  revalidatePath("/watch");
  revalidatePath("/admin/episodes");
  const workSlug = (existing as unknown as { works: { slug: string } | null } | null)?.works
    ?.slug;
  if (workSlug) revalidatePath(`/watch/${workSlug}`);

  return { error: null };
}
