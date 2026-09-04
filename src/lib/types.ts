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

export interface Work {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  coverImageUrl: string | null;
  heroImageUrl: string | null;
  status: WorkStatus;
  year: number | null;
  category: string | null;
  genres: string[];
  featured: boolean;
  published: boolean;
  publishedAt: string | null;
  /** Optional detail-page fields. Absent/empty = section is not rendered. */
  trailerUrl: string | null;
  galleryImageUrls: string[];
  credits: WorkCredit[];
}

export interface JournalPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  category: string | null;
  authorName: string | null;
  published: boolean;
  publishedAt: string | null;
  featured: boolean;
}

export interface HeroContent {
  visible: boolean;
  imageUrl: string | null;
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
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  durationSeconds: number | null;
  releaseDate: string | null;
  published: boolean;
}
