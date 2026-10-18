"use client";

import { useState } from "react";
import { EpisodeRow } from "@/components/watch/EpisodeRow";
import { VideoPlayer } from "@/components/watch/VideoPlayer";
import type { SeasonGroup } from "@/lib/watch-data";
import type { Work } from "@/lib/types";

interface WatchSeriesClientProps {
  work: Work;
  seasons: SeasonGroup[];
}

export function WatchSeriesClient({ work, seasons }: WatchSeriesClientProps) {
  const allEpisodes = seasons.flatMap((s) => s.episodes);
  const [selectedId, setSelectedId] = useState(allEpisodes[0]?.id ?? null);
  const selected = allEpisodes.find((e) => e.id === selectedId) ?? null;

  if (allEpisodes.length === 0) {
    return (
      <div className="py-20 text-center rounded-2xl bg-ink-800/40 border border-white/5">
        <p className="font-display italic text-paper-400 text-xl mb-2">No episodes yet</p>
        <p className="font-outfit text-paper-500 text-sm">
          {work.title} is currently in production.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
      <VideoPlayer videoUrl={selected?.videoUrl ?? null} title={selected?.title ?? work.title} />

      <div className="flex flex-col gap-4 max-h-[70vh] lg:overflow-y-auto shelf-scroll">
        {seasons.map((season) => (
          <div key={season.seasonNumber} className="flex flex-col gap-1">
            <h2 className="font-outfit text-paper-500 text-[11px] uppercase tracking-widest px-2 mb-1">
              Season {season.seasonNumber}
            </h2>
            {season.episodes.map((episode) => (
              <EpisodeRow
                key={episode.id}
                episode={episode}
                active={episode.id === selectedId}
                onSelect={() => setSelectedId(episode.id)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
