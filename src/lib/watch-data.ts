import type { Episode, Work } from "@/lib/types";
import { getAllWorks, getWorkBySlug } from "@/lib/works-data";
import { getEpisodesForWork } from "@/lib/episodes-data";

/**
 * Watch data seam. A watchable series IS a Work, just one with
 * published episodes — this file reuses works-data.ts rather than
 * duplicating a second "Work" source, and now that episodes-data.ts
 * exists, groups its real Episode rows by season for the Watch UI.
 */

export interface SeasonGroup {
  seasonNumber: number;
  episodes: Episode[];
}

export interface EpisodeWithWork {
  episode: Episode;
  work: Work;
}

/**
 * Flat, real, cross-series episode feed for the Watch landing page's
 * "Latest Episodes" shelf — not a fabricated "New This Week" bucket.
 * Sorted by each episode's real release_date; with zero episodes
 * (current state) this is simply [], which the page's own empty state
 * already handles.
 */
export async function getLatestEpisodesAcrossWorks(limit = 8): Promise<EpisodeWithWork[]> {
  const works = await getAllWorks();
  const perWork = await Promise.all(
    works.map(async (w) => (await getEpisodesForWork(w.id)).map((episode) => ({ episode, work: w })))
  );
  return perWork
    .flat()
    .sort((a, b) => (b.episode.releaseDate ?? "").localeCompare(a.episode.releaseDate ?? ""))
    .slice(0, limit);
}

/** Per-series episode list, paired with the work — used for Watch's per-series shelves. */
export async function getWatchableWorksWithEpisodes(): Promise<
  { work: Work; episodes: Episode[] }[]
> {
  const works = await getAllWorks();
  const withEpisodes = await Promise.all(
    works.map(async (w) => ({ work: w, episodes: await getEpisodesForWork(w.id) }))
  );
  return withEpisodes.filter((w) => w.episodes.length > 0);
}

export async function getWorkForWatch(
  slug: string
): Promise<{ work: Work; seasons: SeasonGroup[] } | null> {
  const work = await getWorkBySlug(slug);
  if (!work) return null;

  const episodes = await getEpisodesForWork(work.id);
  const seasons = groupBySeason(episodes);
  return { work, seasons };
}

// --- internal ---

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
