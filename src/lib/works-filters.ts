/**
 * Plain constants only — deliberately kept out of works-data.ts.
 *
 * works-data.ts now imports lib/supabase/server.ts (next/headers),
 * which is server-only. WorksCatalogue.tsx is a Client Component that
 * needs these two arrays for its filter/sort UI; if they lived in
 * works-data.ts, importing them would pull the entire server Supabase
 * client into the client bundle and break the build (Next.js correctly
 * refuses to let next/headers reach client code). This file has zero
 * server-only imports, so it's safe for both server and client code to
 * import from.
 */
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
