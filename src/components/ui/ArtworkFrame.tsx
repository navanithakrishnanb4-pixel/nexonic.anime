"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { EASE } from "@/lib/motion";

interface ArtworkFrameProps {
  imageUrl: string | null;
  /** Required when imageUrl is set — this component never renders a
   *  decorative image without real alt text. */
  alt?: string;
  imagePosition?: string;
  className?: string;
  priority?: boolean;
  /** Optional shared layout id for Work Card → Work Detail image
   *  continuity. See WorkCard's cover image for the matching id. */
  layoutId?: string;
}

/**
 * A deliberately-framed artwork region: thin border, subtle corner
 * brackets, fixed aspect ratio. Used wherever the design needs a clear
 * "this is where studio artwork goes" panel instead of a full-bleed
 * background image — which is what made the homepage read as a text-
 * first SaaS landing page rather than a studio site.
 *
 * When imageUrl is null, renders an intentional placeholder (icon +
 * caption) inside the same frame, so the empty state looks designed
 * rather than broken. No stock/fictional imagery is ever substituted.
 */
export function ArtworkFrame({
  imageUrl,
  alt = "",
  imagePosition = "center",
  className = "",
  priority = false,
  layoutId,
}: ArtworkFrameProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      layoutId={layoutId}
      className={`relative w-full overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-low ${className}`}
      initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: EASE, delay: layoutId ? 0 : 0.15 }}
    >
      {/* corner brackets — restrained, no glow */}
      <span className="pointer-events-none absolute top-3 left-3 w-4 h-4 border-t border-l border-on-surface/25 z-10" />
      <span className="pointer-events-none absolute top-3 right-3 w-4 h-4 border-t border-r border-on-surface/25 z-10" />
      <span className="pointer-events-none absolute bottom-3 left-3 w-4 h-4 border-b border-l border-on-surface/25 z-10" />
      <span className="pointer-events-none absolute bottom-3 right-3 w-4 h-4 border-b border-r border-on-surface/25 z-10" />

      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          priority={priority}
          style={{ objectPosition: imagePosition }}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-sm text-center px-md">
          <Icon name="image" className="text-outline-variant opacity-60" size={32} />
          <span className="font-caption text-caption text-on-surface-variant uppercase tracking-widest">
            Concept artwork in development
          </span>
        </div>
      )}
    </motion.div>
  );
}
