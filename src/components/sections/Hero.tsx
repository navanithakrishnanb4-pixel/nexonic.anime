"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import type { HeroContent } from "@/lib/types";

interface HeroProps {
  content: HeroContent;
}

/**
 * Visually ported to the Figma cinematic hero. Deliberately keeps the
 * exact same HeroContent prop contract as before — this is styling
 * only, not a data-layer change, so homepage-data.ts/HomepageForm
 * needed no changes.
 *
 * Two things the Figma reference had that this does NOT reproduce:
 * - No "Now Streaming" badge or episode/rating/Sub·Dub meta row —
 *   those describe a specific featured Work with fields (score,
 *   episodeCount, Sub/Dub) that don't exist in the real schema.
 *   HeroContent is admin-authored banner copy, not a Work spotlight;
 *   showing fake streaming metadata would be fabricated content.
 * - No hero background image when content.imageUrl is null (the
 *   current real state). Falls back to a moody gradient instead of
 *   Figma's always-present photo, so the empty state stays honest.
 */
export function Hero({ content }: HeroProps) {
  if (!content.visible) return null;

  return (
    <section className="relative h-screen min-h-[560px] max-h-[900px] flex items-end overflow-hidden bg-ink-950">
      {content.imageUrl ? (
        <Image
          src={content.imageUrl}
          alt=""
          fill
          priority
          style={{ objectPosition: content.imagePosition }}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_theme(colors.ink-700)_0%,_theme(colors.ink-950)_60%)]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/70 via-transparent to-transparent" />

      <div
        className="absolute top-24 right-16 w-80 h-80 rounded-full border border-neon-violet/10 spin-slow pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-32 right-24 w-60 h-60 rounded-full border border-neon-pink/10 spin-slow pointer-events-none"
        style={{ animationDirection: "reverse" }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 pb-20">
        <div className="max-w-2xl">
          {content.eyebrow && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/25 text-[11px] font-semibold tracking-wider uppercase mb-5">
              {content.eyebrow}
            </span>
          )}

          <h1
            className="font-display italic font-light text-paper-50 leading-none mb-5"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
          >
            {content.title}
          </h1>

          <p className="font-outfit text-paper-300 text-base leading-relaxed max-w-lg mb-7">
            {content.description}
          </p>

          {(content.ctaLabel || content.secondaryCtaLabel) && (
            <div className="flex items-center flex-wrap gap-3">
              {content.ctaLabel && content.ctaHref && (
                <Button
                  href={content.ctaHref}
                  variant="primary"
                  className="!bg-white !text-ink-900 hover:!bg-paper-200 !rounded-full !px-7 !py-3 !text-sm !font-semibold shadow-xl shadow-ink-950/40"
                >
                  {content.ctaLabel}
                </Button>
              )}
              {content.secondaryCtaLabel && content.secondaryCtaHref && (
                <Button
                  href={content.secondaryCtaHref}
                  variant="secondary"
                  className="!border-white/25 !text-paper-100 hover:!bg-white/8 hover:!border-white/40 !rounded-full !px-7 !py-3 !text-sm backdrop-blur-sm"
                >
                  {content.secondaryCtaLabel}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-ink-900 to-transparent" />
    </section>
  );
}
