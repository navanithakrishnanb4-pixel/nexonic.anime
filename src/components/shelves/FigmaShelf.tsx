"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";

interface FigmaShelfProps {
  title: string;
  eyebrow?: string;
  viewAllHref?: string;
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/**
 * Dark-theme shelf wrapper for Home. Replaces the old shared
 * ContentShelf.tsx (now orphaned — Home was its only real user).
 * Renders the existing empty-state copy/logic when `isEmpty` is true,
 * same as before the redesign; only the populated-state visuals
 * (horizontal scroll, scroll arrows) are new.
 */
export function FigmaShelf({ title, eyebrow, viewAllHref, isEmpty, emptyMessage, children }: FigmaShelfProps) {
  const shelfRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = shelfRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  function scroll(dir: "left" | "right") {
    const el = shelfRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 480 : -480, behavior: "smooth" });
    setTimeout(updateScrollState, 350);
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-5">
        <div>
          {eyebrow && (
            <p className="font-outfit text-neon-cyan text-[10px] font-semibold tracking-widest uppercase mb-1.5">
              {eyebrow}
            </p>
          )}
          <h2 className="font-display text-2xl font-semibold text-paper-50">{title}</h2>
        </div>
        {!isEmpty && (
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-paper-400 hover:text-paper-100 hover:border-white/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-paper-400 hover:text-paper-100 hover:border-white/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight />
              </button>
            </div>
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="font-outfit flex items-center gap-1.5 text-xs text-paper-400 hover:text-paper-100 font-medium transition-colors group"
              >
                View All
                <span className="transition-transform group-hover:translate-x-0.5">
                  <ArrowRight />
                </span>
              </Link>
            )}
          </div>
        )}
      </div>

      {isEmpty ? (
        <div className="rounded-2xl border border-white/10 bg-ink-800/60 py-14 px-6 text-center">
          <p className="font-outfit text-paper-400 text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <div ref={shelfRef} onScroll={updateScrollState} className="shelf-scroll flex gap-4 overflow-x-auto pb-2 -mb-2">
          {children}
        </div>
      )}
    </div>
  );
}
