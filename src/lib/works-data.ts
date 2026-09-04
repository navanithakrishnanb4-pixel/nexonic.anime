import type { Work } from "@/lib/types";

/**
 * TEMPORARY DATA LAYER for the Works catalogue. Same seam pattern as
 * lib/homepage-data.ts — one function, returns Work[], currently empty
 * because there are zero published works. Replace the body with a real
 * Supabase query later; WorksPage and everything under it already
 * handles an empty array correctly, so no downstream changes needed.
 */
export async function getAllWorks(): Promise<Work[]> {
  return [];
}

/**
 * Returns the published Work matching `slug`, or null if none exists.
 * Currently always null — there are zero real works. The Work Detail
 * page treats null as "not found," not as an error, and renders the
 * dedicated not-found state rather than crashing or inventing content.
 */
export async function getWorkBySlug(slug: string): Promise<Work | null> {
  const works = await getAllWorks();
  return works.find((w) => w.slug === slug) ?? null;
}

/** Admin lookup by id (public pages look up by slug instead). */
export async function getWorkById(id: string): Promise<Work | null> {
  const works = await getAllWorks();
  return works.find((w) => w.id === id) ?? null;
}

export const workCategoryFilters = [
  { label: "All", value: "all" },
  { label: "Series", value: "series" },
  { label: "Film", value: "film" },
  { label: "Short", value: "short" },
  { label: "Experimental", value: "experimental" },
];

export const workSortOptions = [
  { label: "Latest", value: "latest" },
  { label: "A–Z", value: "az" },
];
