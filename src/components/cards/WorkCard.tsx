"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Work } from "@/lib/types";
import { DURATION } from "@/lib/motion";

interface WorkCardProps {
  work: Work;
  /** Override the default /works/[slug] destination — used by /watch to
   *  link the same card into the watch experience instead of the work
   *  detail page, without duplicating this component. */
  href?: string;
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
 * MOTION: the cover image carries a layoutId (`work-artwork-{slug}`)
 * matched by ArtworkFrame on the Work Detail hero, for Framer Motion's
 * shared-layout image continuity. See the Step 10 report for an honest
 * caveat: PageTransition currently unmounts the outgoing page before
 * mounting the incoming one (AnimatePresence mode="wait"), which limits
 * how much true cross-route continuity Framer Motion can produce. The
 * layoutId is wired up correctly; whether it reads as a strong "shared
 * element" effect or just consistent framing/timing depends on that
 * mode setting, which I did not change without approval.
 */
export function WorkCard({ work, href }: WorkCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Link
      href={href ?? `/works/${work.slug}`}
      className="group block rounded-xl overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <motion.div
        layoutId={`work-artwork-${work.slug}`}
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
