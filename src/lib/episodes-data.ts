import type { Episode } from "@/lib/types";

/** No episode source exists yet — always empty until Supabase is wired up. */
export async function getAllEpisodes(): Promise<Episode[]> {
  return [];
}
