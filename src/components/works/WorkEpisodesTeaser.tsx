import Link from "next/link";

interface WorkEpisodesTeaserProps {
  workSlug: string;
  episodeCount: number;
}

/**
 * Deliberately a teaser, not a full inline episode list — the actual
 * list with playback already lives on /watch/[slug]. No fake "coming
 * {date}" — the Figma reference used anime.releaseDate, which has no
 * equivalent for a whole Work in the real schema.
 */
export function WorkEpisodesTeaser({ workSlug, episodeCount }: WorkEpisodesTeaserProps) {
  if (episodeCount === 0) {
    return (
      <section className="py-12 text-center rounded-2xl bg-ink-800/30 border border-white/5">
        <p className="font-display italic text-paper-400 text-xl mb-2">No episodes yet</p>
        <p className="font-outfit text-paper-500 text-sm">This series is currently in production.</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-paper-50 mb-4">Episodes</h2>
      <Link
        href={`/watch/${workSlug}`}
        className="group flex items-center justify-between p-5 rounded-2xl bg-ink-800/50 border border-white/5 hover:bg-ink-800 hover:border-white/10 transition-all"
      >
        <span className="font-outfit text-paper-200 text-sm">
          {episodeCount} {episodeCount === 1 ? "episode" : "episodes"} available
        </span>
        <span className="font-outfit flex items-center gap-1.5 text-neon-violet-soft text-sm font-medium">
          Watch now
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      </Link>
    </section>
  );
}
