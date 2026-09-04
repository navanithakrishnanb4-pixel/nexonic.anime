import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

interface AdminStatCardProps {
  label: string;
  count: number;
  href: string;
  icon: string;
}

/**
 * Renders whatever count it's given — currently always 0 across the
 * dashboard, because that's the real state, not a placeholder. Links
 * through to the relevant admin list page.
 */
export function AdminStatCard({ label, count, href, icon }: AdminStatCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-sm p-md rounded-xl border border-surface-container bg-surface-container-lowest hover:border-outline-variant transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
    >
      <div className="flex items-center justify-between">
        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
          {label}
        </span>
        <Icon name={icon} className="text-on-surface-variant" size={20} />
      </div>
      <span className="font-display-hero-mobile text-headline-lg-mobile text-on-surface">
        {count}
      </span>
    </Link>
  );
}
