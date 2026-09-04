import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { Episode } from "@/lib/types";

interface EpisodeRowProps {
  episode: Episode;
  active?: boolean;
  onSelect?: () => void;
}

function formatDuration(seconds: number | null): string | null {
  if (!seconds) return null;
  const m = Math.round(seconds / 60);
  return `${m} min`;
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
      className={`w-full flex items-center gap-md text-left rounded-lg p-sm transition-colors duration-200 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        active
          ? "bg-surface-container-high border-outline-variant"
          : "bg-transparent border-transparent hover:bg-surface-container-low"
      }`}
    >
      <div className="relative w-28 aspect-video flex-shrink-0 rounded-md overflow-hidden bg-surface-container-low">
        {episode.thumbnailUrl ? (
          <Image
            src={episode.thumbnailUrl}
            alt={episode.title}
            fill
            sizes="112px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon name="movie" className="text-outline-variant opacity-50" size={20} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-xs min-w-0">
        <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wide">
          Episode {episode.episodeNumber}
        </span>
        <span className="font-body-md text-body-md text-on-surface truncate">
          {episode.title}
        </span>
        <span className="font-caption text-caption text-on-surface-variant">
          {[duration, releaseDate].filter(Boolean).join(" · ")}
        </span>
      </div>
    </button>
  );
}
