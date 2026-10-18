"use client";

import Image from "next/image";
import Link from "next/link";
import type { Episode, Work } from "@/lib/types";

interface WatchEpisodeCardProps {
  episode: Episode;
  work: Work;
}

function formatDuration(seconds: number | null): string | null {
  if (!seconds) return null;
  return `${Math.round(seconds / 60)}m`;
}

/**
 * Links to /watch/[slug], not a per-episode URL — this app has no
 * per-episode route (episode selection happens client-side on the
 * series page via WatchSeriesClient).
 */
export function WatchEpisodeCard({ episode, work }: WatchEpisodeCardProps) {
  const duration = formatDuration(episode.durationSeconds);

  return (
    <Link href={`/watch/${work.slug}`} className="group block w-72 shrink-0">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-ink-800 mb-3">
        {episode.thumbnailUrl ? (
          <Image
            src={episode.thumbnailUrl}
            alt={episode.title}
            fill
            sizes="288px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-paper-500 text-xs">
            No thumbnail yet
          </div>
        )}
        <div className="absolute inset-0 bg-ink-950/30 group-hover:bg-ink-950/10 transition-colors duration-300" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" className="translate-x-0.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>

        {duration && (
          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-ink-950/80 backdrop-blur-sm text-paper-200 text-[10px] font-medium">
            {duration}
          </span>
        )}
        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-ink-950/70 backdrop-blur-sm text-paper-400 text-[10px] font-medium">
          EP {episode.episodeNumber}
        </span>
      </div>

      <p className="font-outfit text-paper-500 text-xs mb-0.5">{work.title}</p>
      <h3 className="font-display font-medium text-paper-100 text-sm leading-snug line-clamp-1 group-hover:text-neon-violet-soft transition-colors">
        {episode.title}
      </h3>
    </Link>
  );
}
