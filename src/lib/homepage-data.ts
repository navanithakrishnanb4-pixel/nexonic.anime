import type { HeroContent, JournalPost, Work } from "@/lib/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getMediaPublicUrl } from "@/lib/supabase/media";
import { getWorkById } from "@/lib/works-data";
import { getJournalPostById } from "@/lib/journal-data";
import type { HomepageConfigRow } from "@/lib/supabase/types";

/**
 * Admin-facing config shape — everything HomepageForm needs, including
 * raw ids (not resolved Work/JournalPost objects) so the form can drive
 * <select> defaultValues. Separate from HeroContent (the public
 * contract) the same way MediaAsset is separate from the raw
 * media_assets row — components never see the DB row directly.
 */
export interface HomepageConfig {
  heroEyebrow: string | null;
  heroTitle: string;
  heroDescription: string;
  heroMediaId: string | null;
  heroImagePosition: string;
  heroCtaLabel: string | null;
  heroCtaHref: string | null;
  heroSecondaryCtaLabel: string | null;
  heroSecondaryCtaHref: string | null;
  heroVisible: boolean;
  featuredWorkId: string | null;
  featuredWorkVisible: boolean;
  featuredJournalId: string | null;
  featuredJournalVisible: boolean;
}

const DEFAULT_HERO: HeroContent = {
  visible: true,
  imageUrl: null,
  imageMediaId: null,
  eyebrow: "Independent Animation Studio",
  title: "Stories built frame by frame.",
  description:
    "NEXONIC is an independent animation studio developing original worlds. Our first projects are currently in development.",
  ctaLabel: "Explore the Studio",
  ctaHref: "/studio",
  secondaryCtaLabel: "View Works",
  secondaryCtaHref: "/works",
  imagePosition: "center",
};

const DEFAULT_CONFIG: HomepageConfig = {
  heroEyebrow: DEFAULT_HERO.eyebrow,
  heroTitle: DEFAULT_HERO.title,
  heroDescription: DEFAULT_HERO.description,
  heroMediaId: null,
  heroImagePosition: DEFAULT_HERO.imagePosition,
  heroCtaLabel: DEFAULT_HERO.ctaLabel,
  heroCtaHref: DEFAULT_HERO.ctaHref,
  heroSecondaryCtaLabel: DEFAULT_HERO.secondaryCtaLabel,
  heroSecondaryCtaHref: DEFAULT_HERO.secondaryCtaHref,
  heroVisible: DEFAULT_HERO.visible,
  featuredWorkId: null,
  featuredWorkVisible: false,
  featuredJournalId: null,
  featuredJournalVisible: false,
};

/**
 * Reads the single homepage_config row. Returns null (not an error) if
 * the table is empty — per the brief, that's the expected state for a
 * brand-new install and callers fall back to safe defaults rather than
 * inserting a row automatically or crashing.
 */
async function fetchConfigRow(): Promise<HomepageConfigRow | null> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("homepage_config")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[homepage-data] fetchConfigRow failed:", error.message);
    return null;
  }
  return (data as HomepageConfigRow | null) ?? null;
}

/** Admin-facing read — raw ids, safe defaults if no row exists yet. */
export async function getHomepageConfig(): Promise<HomepageConfig> {
  const row = await fetchConfigRow();
  if (!row) return DEFAULT_CONFIG;

  return {
    heroEyebrow: row.hero_eyebrow,
    heroTitle: row.hero_title || DEFAULT_HERO.title,
    heroDescription: row.hero_description || DEFAULT_HERO.description,
    heroMediaId: row.hero_media_id,
    heroImagePosition: row.hero_image_position || "center",
    heroCtaLabel: row.hero_cta_label,
    heroCtaHref: row.hero_cta_href,
    heroSecondaryCtaLabel: row.hero_secondary_cta_label,
    heroSecondaryCtaHref: row.hero_secondary_cta_href,
    heroVisible: row.hero_visible,
    featuredWorkId: row.featured_work_id,
    featuredWorkVisible: row.featured_work_visible,
    featuredJournalId: row.featured_journal_id,
    featuredJournalVisible: row.featured_journal_visible,
  };
}

/** Public-facing hero, resolved to a real image URL. Safe defaults, never crashes. */
export async function getHeroContent(): Promise<HeroContent> {
  const row = await fetchConfigRow();
  if (!row) return DEFAULT_HERO;

  const supabase = createServerSupabaseClient();
  let imageUrl: string | null = null;
  if (row.hero_media_id) {
    const { data } = await supabase
      .from("media_assets")
      .select("storage_path")
      .eq("id", row.hero_media_id)
      .maybeSingle();
    if (data) imageUrl = getMediaPublicUrl(supabase, data.storage_path);
  }

  return {
    visible: row.hero_visible,
    imageUrl,
    imageMediaId: row.hero_media_id,
    eyebrow: row.hero_eyebrow,
    title: row.hero_title || DEFAULT_HERO.title,
    description: row.hero_description || DEFAULT_HERO.description,
    ctaLabel: row.hero_cta_label,
    ctaHref: row.hero_cta_href,
    secondaryCtaLabel: row.hero_secondary_cta_label,
    secondaryCtaHref: row.hero_secondary_cta_href,
    imagePosition: row.hero_image_position || "center",
  };
}

/**
 * At most one item — "featured work" is a single selection, per the
 * existing HomepageForm/schema. Returns [] (not an error) if unset,
 * hidden, or the referenced work no longer exists/isn't publicly
 * visible per RLS — getWorkById already returns null in all those
 * cases, so this never needs to special-case them itself.
 */
export async function getFeaturedWorks(): Promise<Work[]> {
  const row = await fetchConfigRow();
  if (!row || !row.featured_work_visible || !row.featured_work_id) return [];

  const work = await getWorkById(row.featured_work_id);
  return work ? [work] : [];
}

export async function getFeaturedJournalPosts(): Promise<JournalPost[]> {
  const row = await fetchConfigRow();
  if (!row || !row.featured_journal_visible || !row.featured_journal_id) return [];

  const post = await getJournalPostById(row.featured_journal_id);
  return post ? [post] : [];
}
