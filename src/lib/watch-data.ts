import type { Episode, Work } from "@/lib/types";
import { getAllWorks, getWorkBySlug } from "@/lib/works-data";

/**
 * TEMPORARY DATA LAYER for Watch. Reuses works-data.ts rather than
 * duplicating a second "Work" source — a watchable series IS a Work,
 * just one with published episodes. Episodes have no seam of their
 * own yet (no episodes-data.ts) because there is nothing to fetch:
 * this file is where a real getEpisodesForWork(workId) call plugs in
 * later without changing any component below it.
 */

export interface SeasonGroup {
  seasonNumber: number;
  episodes: Episode[];
}

/** Works that have at least one published episode. Currently always []. */
export async function getWatchableWorks(): Promise<Work[]> {
  const works = await getAllWorks();
  const episodesByWork = await getEpisodesIndex();
  return works.filter((w) => (episodesByWork[w.id]?.length ?? 0) > 0);
}

export async function getWorkForWatch(
  slug: string
): Promise<{ work: Work; seasons: SeasonGroup[] } | null> {
  const work = await getWorkBySlug(slug);
  if (!work) return null;

  const episodes = (await getEpisodesIndex())[work.id] ?? [];
  const seasons = groupBySeason(episodes);
  return { work, seasons };
}

// --- internal ---

async function getEpisodesIndex(): Promise<Record<string, Episode[]>> {
  // No episode source exists yet. Real implementation later: fetch all
  // published episodes and group by workId.
  return {};
}

function groupBySeason(episodes: Episode[]): SeasonGroup[] {
  const map = new Map<number, Episode[]>();
  for (const ep of episodes) {
    const list = map.get(ep.seasonNumber) ?? [];
    list.push(ep);
    map.set(ep.seasonNumber, list);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([seasonNumber, eps]) => ({
      seasonNumber,
      episodes: eps.sort((a, b) => a.episodeNumber - b.episodeNumber),
    }));
}
