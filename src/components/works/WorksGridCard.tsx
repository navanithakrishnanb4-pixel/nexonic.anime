"use client";

import Image from "next/image";
import Link from "next/link";
import type { Work } from "@/lib/types";

interface WorksGridCardProps {
  work: Work;
}

/**
 * Deliberately a SEPARATE component from the shared WorkCard.tsx, not
 * a restyle of it. WorkCard is also used by the still-unported Home
 * "Works" shelf and /watch — restyling it in place would make those
 * pages show a light paper-themed card floating inside an otherwise
 * dark, not-yet-ported page. This card exists only for /works until
 * Home/Watch get their own pass.
 *
 * No star/score badge — the Figma prototype's `anime.score` field has
 * no equivalent in our real Work contract (no rating system exists in
 * the schema), so it's simply omitted rather than faked.
 */
const STATUS_DISPLAY: Record<Work["status"], { label: string; classes: string }> = {
  draft: { label: "Draft", classes: "bg-paper-500/15 text-paper-300 border-paper-500/30" },
  in_development: {
    label: "In Development",
    classes: "bg-neon-pink/15 text-neon-pink border-neon-pink/30",
  },
  coming_soon: {
    label: "Coming Soon",
    classes: "bg-neon-violet/15 text-neon-violet border-neon-violet/30",
  },
  ongoing: { label: "Ongoing", classes: "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30" },
  completed: { label: "Completed", classes: "bg-paper-500/15 text-paper-300 border-paper-500/30" },
  archived: { label: "Archived", classes: "bg-paper-500/15 text-paper-300 border-paper-500/30" },
};

export function WorksGridCard({ work }: WorksGridCardProps) {
  const status = STATUS_DISPLAY[work.status];
  const metaLine = [work.genres[0] ?? work.category, work.year].filter(Boolean).join(" · ");

  return (
    <Link href={`/works/${work.slug}`} className="group block">
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-paper-200 mb-3 shadow-sm hover:shadow-xl transition-shadow duration-300 group-hover:-translate-y-1">
        {work.coverImageUrl ? (
          <Image
            src={work.coverImageUrl}
            alt={work.title}
            fill
            sizes="(max-width: 768px) 45vw, 240px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-paper-500 text-xs">
            No cover yet
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />

        <div className="absolute top-2.5 left-2.5">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-sm ${status.classes}`}
          >
            {status.label}
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-11 h-11 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white" className="translate-x-0.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-neon-violet to-neon-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <h3 className="font-display font-semibold text-ink-900 text-sm leading-tight line-clamp-2 group-hover:text-neon-violet transition-colors mb-1">
        {work.title}
      </h3>
      {metaLine && <p className="font-outfit text-ink-500 text-xs">{metaLine}</p>}
    </Link>
  );
}
