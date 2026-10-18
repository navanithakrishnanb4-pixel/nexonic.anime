"use server";

import { searchContent, type SearchResults } from "@/lib/search-data";

/**
 * Thin Server Action wrapper. Before works-data.ts read from Supabase,
 * SearchClient (a Client Component) called searchContent() directly —
 * that worked because everything involved was plain in-memory array
 * filtering. Now that searchContent() transitively depends on
 * lib/supabase/server.ts (next/headers, cookies — server-only APIs),
 * a Client Component can no longer import that call chain at all; the
 * bundler correctly refuses to ship next/headers to the browser.
 *
 * A Server Action is the smallest correct fix: this function still
 * runs entirely on the server, but Next.js generates the client-safe
 * RPC glue automatically, so SearchClient can keep calling it exactly
 * like an async function with no other code changes.
 */
export async function searchContentAction(query: string): Promise<SearchResults> {
  return searchContent(query);
}
