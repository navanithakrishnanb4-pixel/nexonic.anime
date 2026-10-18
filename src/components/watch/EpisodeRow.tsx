import Image from "next/image";
import type { Episode } from "@/lib/types";

interface EpisodeRowProps {
  episode: Episode;
  active?: boolean;
  onSelect?: () => void;
}

function formatDuration(seconds: number | null): string | null {
  if (!seconds) return null;
  return `${Math.round(seconds / 60)}m`;
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function EpisodeRow({ episode, active = false, onSelect }: EpisodeRowProps) {
  const duration = formatDuration(episode.durationSeconds);
  const releaseDate = formatDate(episode.releaseDate);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? "true" : undefined}
      className={`w-full flex items-center gap-3 text-left rounded-xl p-2 transition-colors duration-200 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-violet ${
        active ? "bg-ink-800 border-white/10" : "bg-transparent border-transparent hover:bg-ink-800/60"
      }`}
    >
      <div className="relative w-28 aspect-video flex-shrink-0 rounded-lg overflow-hidden bg-ink-800">
        {episode.thumbnailUrl ? (
          <Image src={episode.thumbnailUrl} alt={episode.title} fill sizes="112px" className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-paper-500 text-[10px]">
            No thumbnail
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="font-outfit text-paper-500 text-[10px] uppercase tracking-wide">
          Episode {episode.episodeNumber}
        </span>
        <span className="font-outfit text-paper-100 text-sm truncate">{episode.title}</span>
        <span className="font-outfit text-paper-500 text-xs">
          {[duration, releaseDate].filter(Boolean).join(" · ")}
        </span>
      </div>
    </button>
  );
}
