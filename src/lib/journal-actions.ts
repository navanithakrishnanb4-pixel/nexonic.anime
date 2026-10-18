"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ContentStatus } from "@/lib/types";

export interface JournalFormState {
  error: string | null;
}

const UNIQUE_VIOLATION = "23505";

function parseJournalFormData(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
    cover_media_id: (formData.get("coverMediaId") as string) || null,
    category: (formData.get("category") as string) || null,
    author_name: (formData.get("authorName") as string) || null,
    status: (formData.get("status") as ContentStatus) || "draft",
    featured: formData.get("featured") === "on",
    // published_at is set the moment a post first becomes "published",
    // and left alone on every subsequent save — see setPublishedAt below.
  };
}

function validate(values: ReturnType<typeof parseJournalFormData>): string | null {
  if (!values.title) return "Title is required.";
  if (!values.slug) return "Slug is required.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug)) {
    return "Slug must be lowercase letters, numbers, and hyphens only (e.g. my-post-title).";
  }
  return null;
}

export async function createJournalPostAction(
  _prevState: JournalFormState,
  formData: FormData
): Promise<JournalFormState> {
  const values = parseJournalFormData(formData);
  const validationError = validate(values);
  if (validationError) return { error: validationError };

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("journal_posts")
    .insert({
      ...values,
      published_at: values.status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      return { error: `The slug "${values.slug}" is already in use. Choose a different slug.` };
    }
    console.error("[journal-actions] createJournalPostAction failed:", error.message);
    return { error: "Something went wrong saving this post. Please try again." };
  }

  revalidatePath("/journal");
  revalidatePath("/admin/journal");
  revalidatePath("/"); // homepage journal shelf may include this post
  redirect(`/admin/journal/${data.id}`);
}

export async function updateJournalPostAction(
  id: string,
  _prevState: JournalFormState,
  formData: FormData
): Promise<JournalFormState> {
  const values = parseJournalFormData(formData);
  const validationError = validate(values);
  if (validationError) return { error: validationError };

  const supabase = createServerSupabaseClient();

  const { data: existing } = await supabase
    .from("journal_posts")
    .select("slug, status, published_at")
    .eq("id", id)
    .maybeSingle();

  // published_at is stamped the first time status becomes "published"
  // and never overwritten afterward — re-saving an already-published
  // post (or archiving/unarchiving it) must not shuffle its original
  // publish date.
  const shouldStampPublishedAt =
    values.status === "published" && existing?.status !== "published";

  const { error } = await supabase
    .from("journal_posts")
    .update({
      ...values,
      ...(shouldStampPublishedAt ? { published_at: new Date().toISOString() } : {}),
    })
    .eq("id", id);

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      return { error: `The slug "${values.slug}" is already in use. Choose a different slug.` };
    }
    console.error("[journal-actions] updateJournalPostAction failed:", error.message);
    return { error: "Something went wrong saving this post. Please try again." };
  }

  revalidatePath("/journal");
  revalidatePath("/admin/journal");
  revalidatePath(`/admin/journal/${id}`);
  revalidatePath("/");
  if (existing?.slug) revalidatePath(`/journal/${existing.slug}`);
  if (values.slug !== existing?.slug) revalidatePath(`/journal/${values.slug}`);

  return { error: null };
}

export async function deleteJournalPostAction(id: string): Promise<{ error: string | null }> {
  const supabase = createServerSupabaseClient();

  const { data: existing } = await supabase
    .from("journal_posts")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("journal_posts").delete().eq("id", id);

  if (error) {
    console.error("[journal-actions] deleteJournalPostAction failed:", error.message);
    if (error.code === "23503") {
      return {
        error:
          "This post can't be deleted because other content still references it (e.g. the homepage configuration).",
      };
    }
    return { error: "Something went wrong deleting this post. Please try again." };
  }

  revalidatePath("/journal");
  revalidatePath("/admin/journal");
  revalidatePath("/");
  if (existing?.slug) revalidatePath(`/journal/${existing.slug}`);

  return { error: null };
}
