const FALLBACK = { label: "Draft", classes: "bg-paper-500/10 text-paper-400 border-paper-500/20" };

const STYLES: Record<string, { label: string; classes: string }> = {
  draft: FALLBACK,
  in_development: { label: "In Development", classes: "bg-neon-violet/12 text-neon-violet-soft border-neon-violet/20" },
  coming_soon: { label: "Coming Soon", classes: "bg-neon-pink/12 text-neon-pink border-neon-pink/20" },
  ongoing: { label: "Ongoing", classes: "bg-neon-cyan/12 text-neon-cyan border-neon-cyan/20" },
  completed: { label: "Completed", classes: "bg-emerald-500/12 text-emerald-400 border-emerald-500/20" },
  published: { label: "Published", classes: "bg-emerald-500/12 text-emerald-400 border-emerald-500/20" },
  archived: { label: "Archived", classes: "bg-paper-500/10 text-paper-500 border-paper-500/15" },
};

/** One badge for every status enum in the system (work, episode, journal). */
export function AdminStatusBadge({ status }: { status: string }) {
  const s = STYLES[status] ?? FALLBACK;
  return (
    <span className={`font-outfit px-2.5 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap ${s.classes}`}>
      {s.label}
    </span>
  );
}
