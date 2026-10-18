/**
 * Filter/sort option constants for the Journal catalogue UI. Split out
 * from journal-data.ts on purpose: journal-data.ts imports the
 * server-only Supabase client (next/headers), which taints the whole
 * module for bundling — importing anything from it, even a plain
 * constant, from a Client Component ("use client", e.g.
 * JournalCatalogue) fails the build. This file has zero server-only
 * imports so client components can safely import from it.
 */
export const journalCategoryFilters = [
  { label: "All", value: "all" },
  { label: "Production", value: "production" },
  { label: "Behind the Scenes", value: "behind-the-scenes" },
  { label: "Studio News", value: "studio-news" },
];

export const journalSortOptions = [
  { label: "Latest", value: "latest" },
  { label: "A–Z", value: "az" },
];
