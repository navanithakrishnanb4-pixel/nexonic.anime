"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArtworkFrame } from "@/components/ui/ArtworkFrame";
import { staggerChildren, fadeInUp } from "@/lib/motion";
import type { Work } from "@/lib/types";

const STATUS_LABEL: Record<Work["status"], string> = {
  draft: "Draft",
  in_development: "In Development",
  coming_soon: "Coming Soon",
  ongoing: "Ongoing",
  completed: "Completed",
  archived: "Archived",
};

interface WorkDetailHeroProps {
  work: Work;
}

export function WorkDetailHero({ work }: WorkDetailHeroProps) {
  return (
    <section className="px-margin-mobile md:px-margin-desktop py-xl grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-xl items-start">
      <ArtworkFrame
        imageUrl={work.heroImageUrl ?? work.coverImageUrl}
        alt={work.title}
        layoutId={`work-artwork-${work.slug}`}
        priority
        className="aspect-[3/4] md:sticky md:top-24"
      />

      <motion.div
        className="flex flex-col items-start gap-md"
        variants={staggerChildren(0.1)}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-sm">
          <span className="font-caption text-caption text-primary uppercase tracking-widest border border-primary/40 rounded-full px-sm py-xs">
            {STATUS_LABEL[work.status]}
          </span>
          {work.category && (
            <span className="font-caption text-caption text-on-surface-variant uppercase tracking-widest">
              {work.category}
            </span>
          )}
          {work.year && (
            <span className="font-caption text-caption text-on-surface-variant uppercase tracking-widest">
              {work.year}
            </span>
          )}
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="font-display-hero-mobile text-headline-lg-mobile md:font-display-hero md:text-headline-lg text-on-surface"
        >
          {work.title}
        </motion.h1>

        {work.genres.length > 0 && (
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-xs">
            {work.genres.map((genre) => (
              <span
                key={genre}
                className="font-label-md text-label-md text-on-surface-variant bg-surface-container-low border border-outline-variant/40 rounded-full px-sm py-xs"
              >
                {genre}
              </span>
            ))}
          </motion.div>
        )}

        <motion.p
          variants={fadeInUp}
          className="font-body-lg text-body-lg text-on-surface-variant max-w-xl"
        >
          {work.description || work.shortDescription}
        </motion.p>

        {work.trailerUrl && (
          <motion.div variants={fadeInUp}>
            <Button href={work.trailerUrl} variant="primary">
              Watch Trailer
            </Button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
