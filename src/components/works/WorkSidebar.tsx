import Link from "next/link";
import type { Work } from "@/lib/types";

interface WorkSidebarProps {
  work: Work;
}

const STATUS_LABEL: Record<Work["status"], string> = {
  draft: "Draft",
  in_development: "In Development",
  coming_soon: "Coming Soon",
  ongoing: "Ongoing",
  completed: "Completed",
  archived: "Archived",
};

/**
 * No Studio/Director/Content-Rating rows — the Figma sidebar's
 * "Series Info" included fields with no equivalent in the real schema.
 * Every work at Nexonic is by definition made by Nexonic, so a
 * "Studio" field would just repeat the site's own name; a "Director"
 * credit belongs in the existing Credits section (real data) rather
 * than a fabricated single-line field here.
 */
export function WorkSidebar({ work }: WorkSidebarProps) {
  const rows: [string, string][] = [
    ...(work.category ? ([["Category", work.category]] as [string, string][]) : []),
    ...(work.year ? ([["Year", String(work.year)]] as [string, string][]) : []),
    ["Status", STATUS_LABEL[work.status]],
  ];

  return (
    <aside className="flex flex-col gap-6">
      <div className="bg-ink-800/50 border border-white/5 rounded-2xl p-6">
        <h3 className="font-outfit font-semibold text-paper-50 text-sm mb-4">Series Info</h3>
        <dl className="space-y-3">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2">
              <dt className="font-outfit text-paper-500 text-xs">{k}</dt>
              <dd className="font-outfit text-paper-300 text-xs font-medium text-right">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {work.genres.length > 0 && (
        <div className="bg-ink-800/50 border border-white/5 rounded-2xl p-6">
          <h3 className="font-outfit font-semibold text-paper-50 text-sm mb-3">Genres</h3>
          <div className="flex flex-wrap gap-2">
            {work.genres.map((g) => (
              <Link
                key={g}
                href={`/works?genre=${encodeURIComponent(g)}`}
                className="font-outfit px-3 py-1 rounded-full bg-neon-violet/12 border border-neon-violet/20 text-neon-violet-soft text-xs hover:bg-neon-violet/20 transition-colors"
              >
                {g}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
