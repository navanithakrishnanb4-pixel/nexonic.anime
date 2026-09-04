import { Icon } from "@/components/ui/Icon";

interface VideoPlayerProps {
  videoUrl: string | null;
  title: string;
}

/**
 * Clean placeholder for the eventual player. Per the brief: no custom
 * video hosting, no embedding random YouTube videos to fill space. If
 * `videoUrl` is set, this renders a real <video>/iframe-ready region;
 * for now it always shows the "not yet available" state since no
 * episode has a real videoUrl.
 */
export function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  if (!videoUrl) {
    return (
      <div className="relative aspect-video w-full rounded-xl border border-outline-variant/40 bg-surface-container-low flex flex-col items-center justify-center gap-sm">
        <Icon name="play_circle" className="text-outline-variant opacity-50" size={40} />
        <span className="font-caption text-caption text-on-surface-variant uppercase tracking-widest">
          Video not yet available
        </span>
      </div>
    );
  }

  // Real playback wiring intentionally left minimal — the point of
  // this step is the container/contract, not a player implementation.
  return (
    <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-outline-variant/40 bg-black">
      <video src={videoUrl} controls title={title} className="w-full h-full" />
    </div>
  );
}
