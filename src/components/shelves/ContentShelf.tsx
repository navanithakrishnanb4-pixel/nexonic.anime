import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { EmptyState } from "@/components/ui/EmptyState";

interface ContentShelfProps<T extends { id: string }> {
  title: string;
  items: T[];
  renderItem: (item: T) => ReactNode;
  emptyIcon: string;
  emptyMessage: string;
  /** Optional link shown next to the heading, e.g. "View all". */
  viewAllHref?: string;
}

/**
 * The one shelf component used for both Works and Journal rows on the
 * homepage (and reusable for any future shelf). Renders the Stitch
 * empty-state block automatically when `items` is empty — this is what
 * makes "the site must render an empty database" true by construction
 * rather than by every page remembering to check `items.length`.
 */
export function ContentShelf<T extends { id: string }>({
  title,
  items,
  renderItem,
  emptyIcon,
  emptyMessage,
  viewAllHref,
}: ContentShelfProps<T>) {
  return (
    <ScrollReveal
      className="px-margin-mobile md:px-margin-desktop py-lg flex flex-col gap-md"
    >
      <div className="flex items-center justify-between border-b border-surface-container pb-sm">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface">
          {title}
        </h2>
        {viewAllHref && items.length > 0 && (
          <a
            href={viewAllHref}
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
          >
            VIEW ALL
          </a>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState icon={emptyIcon} message={emptyMessage} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-md">
          {items.map((item) => (
            <div key={item.id}>{renderItem(item)}</div>
          ))}
        </div>
      )}
    </ScrollReveal>
  );
}
