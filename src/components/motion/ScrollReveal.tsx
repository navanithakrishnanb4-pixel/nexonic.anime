"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeInUp } from "@/lib/motion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in seconds, used for hand-staggering sibling sections. */
  delay?: number;
}

/**
 * Reveals its children once when they scroll into view. When the user has
 * requested reduced motion, renders children statically with no animation —
 * framer-motion's useReducedMotion hook reads the OS-level media query, this
 * is a belt-and-suspenders companion to the CSS override in globals.css.
 */
export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
