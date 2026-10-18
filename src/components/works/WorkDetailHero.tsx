"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Work } from "@/lib/types";

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

interface WorkDetailHeroProps {
  work: Work;
}

/**
 * No score, episode count, content rating, or Sub/Dub badges — the
 * Figma reference's meta row depended on fields that don't exist in
 * the real Work contract. Only status, genres, and year are shown.
 * Episode count moved to WorkEpisodesTeaser, which fetches it for real.
 */
export function WorkDetailHero({ work }: WorkDetailHeroProps) {
  const status = STATUS_DISPLAY[work.status];
  const heroImage = work.heroImageUrl ?? work.coverImageUrl;

  return (
    <div className="relative h-[70vh] min-h-[460px] max-h-[700px] overflow-hidden bg-ink-950">
      {heroImage ? (
        <Image src={heroImage} alt={work.title} fill priority className="object-cover" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_theme(colors.ink-700)_0%,_theme(colors.ink-950)_60%)]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/80 via-ink-950/30 to-transparent" />

      <div className="absolute top-20 left-6">
        <Link
          href="/works"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 backdrop-blur-md border border-white/10 text-paper-300 text-sm font-medium hover:text-paper-50 hover:border-white/25 transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 max-w-[1440px] mx-auto">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${status.classes}`}>
              {status.label}
            </span>
            {work.genres.map((g) => (
              <span key={g} className="font-outfit text-paper-400 text-xs">
                {g}
              </span>
            ))}
            {work.year && <span className="font-outfit text-paper-500 text-xs">{work.year}</span>}
          </div>

          <h1
            className="font-display italic text-paper-50 leading-none mb-3"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
          >
            {work.title}
          </h1>

          {work.shortDescription && (
            <p className="font-outfit text-paper-400 text-base mb-6">{work.shortDescription}</p>
          )}

          <div className="flex items-center gap-3">
            {work.trailerUrl && (
              <Button
                href={work.trailerUrl}
                variant="primary"
                className="!bg-white !text-ink-900 hover:!bg-paper-200 !rounded-full !px-7 !py-3 !text-sm !font-semibold shadow-xl"
              >
                Watch Trailer
              </Button>
            )}
            <Button
              href={`/watch/${work.slug}`}
              variant="secondary"
              className="!border-white/20 !text-paper-100 hover:!bg-white/8 !rounded-full !px-6 !py-3 !text-sm backdrop-blur-sm"
            >
              View on Watch
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
