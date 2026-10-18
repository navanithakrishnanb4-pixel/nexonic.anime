// Shape of content once it comes from the CMS. Nothing in this file is data
// — it is the contract components render against. Until Supabase exists,
// every page must be able to render these types as empty arrays / null.

export type WorkStatus =
  | "draft"
  | "in_development"
  | "coming_soon"
  | "ongoing"
  | "completed"
  | "archived";

export interface WorkCredit {
  name: string;
  role: string;
}

/**
 * One gallery image. Mirrors the future `work_gallery_media` join table
 * (work_id, media_id, position) agreed in the Phase 18 schema review —
 * `mediaId` is the eventual FK, `url` is the placeholder direct-URL
 * value used until the Media Library/picker exists. `position` matches
 * the join table's ordering column so display order survives the move
 * to real media IDs without a data migration on this shape.
 */
export interface WorkGalleryImage {
  mediaId: string | null;
  url: string | null;
  alt: string;
  position: number;
}

export interface Work {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  /** Placeholder direct URL. See coverMediaId for the future FK. */
  coverImageUrl: string | null;
  /** Future FK → media_assets.id. Null until the Media Library exists;
   *  present now so nothing about this contract has to change shape
   *  when it's wired up — only this field stops being null. */
  coverMediaId: string | null;
  heroImageUrl: string | null;
  heroMediaId: string | null;
  status: WorkStatus;
  year: number | null;
  category: string | null;
  genres: string[];
  featured: boolean;
  publishedAt: string | null;
  /** Optional detail-page fields. Absent/empty = section is not rendered. */
  trailerUrl: string | null;
  gallery: WorkGalleryImage[];
  credits: WorkCredit[];
}

export type ContentStatus = "draft" | "published" | "archived";

export interface JournalPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  /** Future FK → media_assets.id, same pattern as Work.coverMediaId. */
  coverMediaId: string | null;
  category: string | null;
  authorName: string | null;
  /**
   * Single source of truth for publication state — draft / published /
   * archived. There is intentionally no separate `published: boolean`
   * alongside this; a second flag could drift out of sync with status
   * (e.g. status="archived" but published=true), so anything that used
   * to check a boolean now checks `status === "published"`.
   */
  status: ContentStatus;
  publishedAt: string | null;
  featured: boolean;
}

export interface HeroContent {
  visible: boolean;
  imageUrl: string | null;
  /** Future FK → media_assets.id, same pattern as Work.coverMediaId. */
  imageMediaId: string | null;
  eyebrow: string | null;
  title: string;
  description: string;
  ctaLabel: string | null;
  ctaHref: string | null;
  secondaryCtaLabel: string | null;
  secondaryCtaHref: string | null;
  /** CSS object-position value, lets the CMS reposition focal point per image. */
  imagePosition: string;
}

export interface Episode {
  id: string;
  workId: string;
  /** Denormalized for display in admin lists without a second query per row. */
  workTitle?: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string | null;
  /** Future FK → media_assets.id, same pattern as Work.coverMediaId. */
  thumbnailMediaId: string | null;
  videoUrl: string | null;
  durationSeconds: number | null;
  releaseDate: string | null;
  /** Same reasoning as JournalPost.status — no parallel boolean. */
  status: ContentStatus;
}
