"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface HomepageFormState {
  error: string | null;
}

function parseHomepageFormData(formData: FormData) {
  return {
    hero_eyebrow: (formData.get("eyebrow") as string) || null,
    hero_title: String(formData.get("heroTitle") ?? "").trim(),
    hero_description: String(formData.get("heroDescription") ?? "").trim(),
    hero_media_id: (formData.get("heroMediaId") as string) || null,
    hero_image_position: (formData.get("heroImagePosition") as string) || "center",
    hero_cta_label: (formData.get("ctaLabel") as string) || null,
    hero_cta_href: (formData.get("ctaHref") as string) || null,
    hero_secondary_cta_label: (formData.get("secondaryCtaLabel") as string) || null,
    hero_secondary_cta_href: (formData.get("secondaryCtaHref") as string) || null,
    hero_visible: formData.get("heroVisible") === "on",
    featured_work_id: (formData.get("featuredWorkId") as string) || null,
    featured_work_visible: formData.get("featuredWorkVisible") === "on",
    featured_journal_id: (formData.get("featuredJournalId") as string) || null,
    featured_journal_visible: formData.get("featuredJournalVisible") === "on",
  };
}

function validate(values: ReturnType<typeof parseHomepageFormData>): string | null {
  if (!values.hero_title) return "Hero title is required.";
  if (!values.hero_description) return "Hero description is required.";
  return null;
}

/**
 * homepage_config is a singleton — one row, no id in the form. This
 * action reads whichever row currently exists (if any) and either
 * updates it or inserts the first one. This is the one place an
 * insert into this table happens automatically, and only because the
 * admin explicitly submitted the configuration form — not an
 * auto-seed on page load, which getHeroContent()/getHomepageConfig()
 * deliberately never do.
 */
export async function updateHomepageConfigAction(
  _prevState: HomepageFormState,
  formData: FormData
): Promise<HomepageFormState> {
  const values = parseHomepageFormData(formData);
  const validationError = validate(values);
  if (validationError) return { error: validationError };

  const supabase = createServerSupabaseClient();

  const { data: existing, error: lookupError } = await supabase
    .from("homepage_config")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (lookupError) {
    console.error("[homepage-actions] lookup failed:", lookupError.message);
    return { error: "Something went wrong loading the current configuration. Please try again." };
  }

  const { error } = existing
    ? await supabase.from("homepage_config").update(values).eq("id", existing.id)
    : await supabase.from("homepage_config").insert(values);

  if (error) {
    console.error("[homepage-actions] updateHomepageConfigAction failed:", error.message);
    return { error: "Something went wrong saving the homepage configuration. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin/homepage");
  return { error: null };
}
