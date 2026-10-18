import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FigmaShelf } from "@/components/shelves/FigmaShelf";
import { WatchEpisodeCard } from "@/components/watch/WatchEpisodeCard";
import { getLatestEpisodesAcrossWorks, getWatchableWorksWithEpisodes } from "@/lib/watch-data";

export const metadata: Metadata = {
  title: "Watch",
  description: "Stream original series and films from NEXONIC.",
};

export const dynamic = "force-dynamic";

/**
 * SCOPING NOTE, same category as Home: the Figma reference has an
 * "Episodes / Schedule" tab toggle, where Schedule buckets episodes
 * into fake "Today / Tomorrow / This Week" groups by slicing an array
 * — there's no real weekly-release-schedule concept in the schema
 * (only a per-episode release_date). Fabricating that grouping would
 * be fake data wearing a real UI, so the Schedule tab is omitted
 * entirely. What's here — the latest-episodes shelf and per-series
 * shelves — is all driven by getLatestEpisodesAcrossWorks() and
 * getWatchableWorksWithEpisodes(), both real queries.
 */
export default async function WatchPage() {
  const [latest, seriesWithEpisodes] = await Promise.all([
    getLatestEpisodesAcrossWorks(),
    getWatchableWorksWithEpisodes(),
  ]);

  const hasAnything = latest.length > 0 || seriesWithEpisodes.length > 0;

  return (
    <div className="min-h-screen bg-ink-900">
      <div className="bg-ink-950 border-b border-white/5 py-12">
        <div className="max-w-[1440px] mx-auto px-6">
          <p className="font-outfit text-neon-cyan text-[11px] font-semibold tracking-widest uppercase mb-2">
            Episode Hub
          </p>
          <h1 className="font-display italic text-paper-50 text-5xl font-light mb-3">Watch</h1>
          <p className="font-outfit text-paper-400 text-sm">
            Episodes from every ongoing Nexonic series, as they release.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-12">
        {!hasAnything ? (
          <div className="py-28 text-center">
            <p className="font-display italic text-paper-400 text-xl mb-2">Nothing to watch yet</p>
            <p className="font-outfit text-paper-500 text-sm">
              Our first episodes are still in production.
            </p>
          </div>
        ) : (
          <div className="space-y-14">
            {latest.length > 0 && (
              <FigmaShelf title="Latest Episodes" eyebrow="Just Released" isEmpty={false} emptyMessage="">
                {latest.map(({ episode, work }) => (
                  <WatchEpisodeCard key={episode.id} episode={episode} work={work} />
                ))}
              </FigmaShelf>
            )}

            {seriesWithEpisodes.map(({ work, episodes }) => (
              <section key={work.id}>
                <div className="flex items-end justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-ink-800">
                      {work.coverImageUrl && (
                        <Image src={work.coverImageUrl} alt={work.title} fill className="object-cover" />
                      )}
                    </div>
                    <h2 className="font-display font-semibold text-paper-50 text-xl">{work.title}</h2>
                  </div>
                  <Link
                    href={`/works/${work.slug}`}
                    className="font-outfit text-xs text-paper-400 hover:text-paper-100 font-medium transition-colors"
                  >
                    Series page →
                  </Link>
                </div>
                <div className="shelf-scroll flex gap-4 overflow-x-auto pb-2">
                  {episodes.map((episode) => (
                    <WatchEpisodeCard key={episode.id} episode={episode} work={work} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
