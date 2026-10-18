import Link from "next/link";

interface AdminStatCardProps {
  label: string;
  count: number;
  href: string;
  sub?: string;
  /** Tailwind text-color utility for the number, matching the Figma per-metric color coding. */
  accentClass?: string;
}

/**
 * Renders whatever count it's given — real, same as before the
 * redesign. `sub` is optional context text, only passed when the
 * caller has a real, cheaply-derivable value; never a fabricated detail.
 */
export function AdminStatCard({ label, count, href, sub, accentClass = "text-paper-50" }: AdminStatCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-2xl p-5 bg-ink-800/50 border border-white/5 hover:border-white/15 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-violet"
    >
      <p className={`font-display text-3xl font-light mb-1 ${accentClass}`}>{count}</p>
      <p className="font-outfit text-paper-200 text-sm font-medium">{label}</p>
      {sub && <p className="font-outfit text-paper-500 text-xs mt-0.5">{sub}</p>}
    </Link>
  );
}
