interface VideoPlayerProps {
  videoUrl: string | null;
  title: string;
}

export function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  if (!videoUrl) {
    return (
      <div className="relative aspect-video w-full rounded-2xl border border-white/10 bg-ink-800 flex flex-col items-center justify-center gap-2">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-paper-500">
          <circle cx="12" cy="12" r="10" />
          <polygon points="10 8 16 12 10 16 10 8" />
        </svg>
        <span className="font-outfit text-paper-500 text-xs uppercase tracking-widest">
          Video not yet available
        </span>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
      <video src={videoUrl} controls title={title} className="w-full h-full" />
    </div>
  );
}
