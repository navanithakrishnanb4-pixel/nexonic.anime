"use client";

import Image from "next/image";
import Link from "next/link";
import type { Work } from "@/lib/types";

interface HomeWorkCardProps {
  work: Work;
  size?: "sm" | "md" | "lg";
}

/**
 * Dark-theme card for horizontal shelves (Home currently; /watch and
 * others can adopt this same component once they're ported instead of
 * spawning a third card). Deliberately NOT the same component as
 * WorksGridCard (light/paper, used on the ported /works grid) — the
 * two pages have different backgrounds and this keeps each page's
 * card visually correct for where it actually sits, matching how the
 * Figma reference itself uses two separate card components.
 *
 * No star/score badge — same reasoning as WorksGridCard: the schema
 * has no rating field, so nothing is shown rather than faked.
 */
const STATUS_DISPLAY: Record<Work["status"], { label: string; classes: string }> = {
  draft: { label: "Draft", classes: "bg-paper-500/15 text-paper-300 border-paper-500/30" },
  in_development: {
    label: "In Development",
    classes: "bg-neon-pink/15 text-neon-pink border-neon-pink/30",
  },
  coming_soon: {
    label: "Coming Soon",
    classes: "bg-neon-violet/15 text-neon-violet-soft border-neon-violet/30",
  },
  ongoing: { label: "Ongoing", classes: "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30" },
  completed: { label: "Completed", classes: "bg-paper-500/15 text-paper-300 border-paper-500/30" },
  archived: { label: "Archived", classes: "bg-paper-500/15 text-paper-300 border-paper-500/30" },
};

const WIDTH: Record<NonNullable<HomeWorkCardProps["size"]>, string> = {
  sm: "w-36",
  md: "w-48",
  lg: "w-64",
};

export function HomeWorkCard({ work, size = "md" }: HomeWorkCardProps) {
  const status = STATUS_DISPLAY[work.status];

  return (
    <Link href={`/works/${work.slug}`} className={`${WIDTH[size]} shrink-0 group block`}>
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-ink-800 mb-3">
        {work.coverImageUrl ? (
          <Image
            src={work.coverImageUrl}
            alt={work.title}
            fill
            sizes="256px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-paper-500 text-xs">
            No cover yet
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        <div className="absolute top-2.5 left-2.5">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-sm ${status.classes}`}
          >
            {status.label}
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="translate-x-0.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      </div>

      <h3 className="font-display font-semibold text-paper-50 text-sm leading-tight line-clamp-2 group-hover:text-neon-violet-soft transition-colors mb-1">
        {work.title}
      </h3>
      {(work.genres[0] ?? work.category) && (
        <p className="font-outfit text-paper-500 text-xs">{work.genres[0] ?? work.category}</p>
      )}
    </Link>
  );
}
