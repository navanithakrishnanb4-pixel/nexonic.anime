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
