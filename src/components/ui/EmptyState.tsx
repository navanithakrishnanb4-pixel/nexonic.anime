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
      className={`bg-surface-container-low rounded-xl border border-surface-container p-xl flex flex-col items-center justify-center text-center min-h-[300px] ${className}`}
    >
      <Icon name={icon} className="text-outline-variant mb-md opacity-50" size={48} />
      <p className="font-body-lg text-body-lg text-on-surface-variant">{message}</p>
    </div>
  );
}
