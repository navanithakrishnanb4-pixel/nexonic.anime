"use client";

import { useState } from "react";
import { EpisodeRow } from "@/components/watch/EpisodeRow";
import { VideoPlayer } from "@/components/watch/VideoPlayer";
import { EmptyState } from "@/components/ui/EmptyState";
import type { SeasonGroup } from "@/lib/watch-data";
import type { Work } from "@/lib/types";

interface WatchSeriesClientProps {
  work: Work;
  seasons: SeasonGroup[];
}

/**
 * Client-side because episode selection is local UI state. Seasons/
 * episodes are fetched server-side (app/watch/[slug]/page.tsx) and
 * passed in as props — this component just presents them.
 */
export function WatchSeriesClient({ work, seasons }: WatchSeriesClientProps) {
  const allEpisodes = seasons.flatMap((s) => s.episodes);
  const [selectedId, setSelectedId] = useState(allEpisodes[0]?.id ?? null);
  const selected = allEpisodes.find((e) => e.id === selectedId) ?? null;

  if (allEpisodes.length === 0) {
    return (
      <EmptyState
        icon="movie"
        message={`No episodes of ${work.title} are available to watch yet.`}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-lg items-start">
      <VideoPlayer
        videoUrl={selected?.videoUrl ?? null}
        title={selected?.title ?? work.title}
      />

      <div className="flex flex-col gap-md max-h-[70vh] lg:overflow-y-auto">
        {seasons.map((season) => (
          <div key={season.seasonNumber} className="flex flex-col gap-xs">
            <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest px-sm">
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
