import type { HeroContent, JournalPost, Work } from "@/lib/types";

/**
 * TEMPORARY DATA LAYER.
 *
 * This file is the single seam between the homepage UI and content.
 * Right now it returns static/default values because there is no
 * Supabase backend yet (0 works, 0 journal posts, per the project's
 * content rules). When the CMS exists, replace the bodies of these
 * three functions with real queries — every component downstream
 * already renders whatever these return, including empty arrays, so
 * no page/component code should need to change.
 *
 * Do not add fictional Works/JournalPosts here. This must stay
 * genuinely empty until real content is published through /admin.
 */

export async function getHeroContent(): Promise<HeroContent> {
  return {
    visible: true,
    imageUrl: null,
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
}

export async function getFeaturedWorks(): Promise<Work[]> {
  return [];
}

export async function getFeaturedJournalPosts(): Promise<JournalPost[]> {
  return [];
}
