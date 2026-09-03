"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArtworkFrame } from "@/components/ui/ArtworkFrame";
import { staggerChildren, fadeInUp } from "@/lib/motion";
import type { HeroContent } from "@/lib/types";

interface HeroProps {
  content: HeroContent;
}

/**
 * Canonical hero, refined per Step 8 QA feedback.
 *
 * Previous version was a full-bleed image with text over a scrim —
 * with no real image yet, that read as a generic text-first landing
 * page. This version is a split composition: copy on one side, a
 * bordered ArtworkFrame on the other. The frame's own empty state
 * (icon + "Concept artwork in development") makes the missing-image
 * case look intentional instead of unfinished, and gives future CMS
 * artwork an obvious, cinematic place to land without touching this
 * component again.
 *
 * Still no shader, per this step's explicit instruction.
 */
export function Hero({ content }: HeroProps) {
  if (!content.visible) return null;

  return (
    <section
      aria-label="Studio introduction"
      className="relative w-full border-b border-surface-container overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest via-surface to-surface pointer-events-none" />

      <motion.div
        className="relative z-10 px-margin-mobile md:px-margin-desktop py-xl md:py-[96px] grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-xl items-center min-h-[60vh] md:min-h-[75vh]"
        variants={staggerChildren(0.12)}
        initial="hidden"
        animate="visible"
      >
        {/* Copy column */}
        <div className="flex flex-col items-start gap-md order-2 md:order-1">
          {content.eyebrow && (
            <motion.span
              variants={fadeInUp}
              className="font-label-md text-label-md text-primary uppercase tracking-widest"
            >
              {content.eyebrow}
            </motion.span>
          )}

          <motion.h1
            variants={fadeInUp}
            className="font-display-hero-mobile text-display-hero-mobile md:font-display-hero md:text-display-hero text-on-surface"
          >
            {content.title}
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="font-body-lg text-body-lg text-on-surface-variant max-w-md"
          >
            {content.description}
          </motion.p>

          {(content.ctaLabel || content.secondaryCtaLabel) && (
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-sm pt-sm">
              {content.ctaLabel && content.ctaHref && (
                <Button href={content.ctaHref} variant="primary">
                  {content.ctaLabel}
                </Button>
              )}
              {content.secondaryCtaLabel && content.secondaryCtaHref && (
                <Button href={content.secondaryCtaHref} variant="secondary">
                  {content.secondaryCtaLabel}
                </Button>
              )}
            </motion.div>
          )}
        </div>

        {/* Artwork column */}
        <motion.div
          variants={fadeInUp}
          className="order-1 md:order-2 w-full"
        >
          <ArtworkFrame
            imageUrl={content.imageUrl}
            alt={content.imageUrl ? content.title : ""}
            imagePosition={content.imagePosition}
            priority
            className="aspect-[4/3] md:aspect-[3/4]"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
