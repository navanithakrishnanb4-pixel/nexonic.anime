import { Icon } from "./Icon";

interface EmptyStateProps {
  icon: string;
  message: string;
  className?: string;
}

/**
 * The exact empty-state pattern already present in the Stitch ZIP
 * ("Our first worlds are still being built.", "The studio journal is
 * coming soon."). Reused everywhere a shelf/list has zero published
 * items — this is how the site stays honest with an empty database
 * instead of a component silently rendering nothing.
 */
export function EmptyState({ icon, message, className = "" }: EmptyStateProps) {
  return (
    <div
      className={`bg-ink-800/50 rounded-2xl border border-white/10 p-12 flex flex-col items-center justify-center text-center min-h-[300px] ${className}`}
    >
      <Icon name={icon} className="text-paper-500 mb-4 opacity-60" size={48} />
      <p className="font-outfit text-base text-paper-400">{message}</p>
    </div>
  );
}
