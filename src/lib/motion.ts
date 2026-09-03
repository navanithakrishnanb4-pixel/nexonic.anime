import type { Variants } from "framer-motion";

// Timing scale from the architecture doc. Keep all durations sourced from
// here — no magic numbers in components.
export const DURATION = {
  micro: 0.18, // 150-200ms: button/hover feedback
  standard: 0.38, // 300-450ms: card, nav, section transitions
  cinematic: 0.6, // 500-700ms: page-level entrances
} as const;

export const EASE = [0.2, 0.8, 0.2, 1] as const; // matches Stitch's fade-in-up easing

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.cinematic, ease: EASE },
  },
};

export const staggerChildren = (stagger = 0.08): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger },
  },
});

export const cardHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: DURATION.standard, ease: EASE },
  },
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.standard, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: DURATION.micro, ease: EASE },
  },
};
