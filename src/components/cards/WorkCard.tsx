"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Work } from "@/lib/types";
import { DURATION } from "@/lib/motion";

interface WorkCardProps {
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
 * Single card used for both the Works grid and the Home "Works" shelf.
 * Status text is derived from Work.status, never hard-coded per-card —
 * per the architecture note that badges must not be typed into pages.
 *
 * NOTE ON MOTION: this deliberately does NOT attempt the "poster expands
 * into work-detail hero" shared-element transition from the original
 * spec. That interaction was never actually designed in the Stitch ZIP
 * (see architecture step, section H) — it needs its own design pass
 * before it's built, not an improvised version bolted onto this card.
 */
export function WorkCard({ work }: WorkCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Link
      href={`/works/${work.slug}`}
      className="group block rounded-xl overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <motion.div
        className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-surface-container-low"
        whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
        transition={{ duration: DURATION.standard }}
      >
        {work.coverImageUrl ? (
          <Image
            src={work.coverImageUrl}
            alt={work.title}
            fill
            sizes="(max-width: 768px) 45vw, 240px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-container-low text-on-surface-variant text-caption font-caption">
            No cover yet
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.div>
      <div className="mt-sm flex items-start justify-between gap-sm">
        <h3 className="font-headline-md text-body-lg text-on-surface group-hover:text-primary transition-colors duration-200">
          {work.title}
        </h3>
      </div>
      <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wide">
        {STATUS_LABEL[work.status]}
        {work.year ? ` · ${work.year}` : ""}
      </span>
    </Link>
  );
}
