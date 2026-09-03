"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { primaryNav } from "@/lib/nav";
import { DURATION } from "@/lib/motion";

/**
 * Fixed top bar present on every public page. Menu button opens a full
 * nav drawer (mobile + desktop both use it, since the ZIP's TopAppBar
 * never actually showed inline desktop links — it relied on the same
 * hamburger everywhere). Search is a placeholder link to /search for now.
 */
export function TopAppBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-surface/95 backdrop-blur-md border-b border-white/5 fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 transition-all duration-200">
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="text-on-surface-variant hover:text-primary transition-colors duration-300 flex items-center justify-center p-2 rounded-full hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Icon name="menu" />
        </button>

        <Link
          href="/"
          className="text-headline-md font-headline-md font-bold tracking-tight text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded"
        >
          NEXONIC
        </Link>

        <Link
          href="/search"
          aria-label="Search"
          className="text-on-surface-variant hover:text-primary transition-colors duration-300 flex items-center justify-center p-2 rounded-full hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Icon name="search" />
        </Link>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-surface/98 backdrop-blur-lg flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.standard }}
          >
            <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16">
              <span className="text-headline-md font-headline-md font-bold text-on-surface">
                NEXONIC
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                <Icon name="close" />
              </button>
            </div>
            <nav className="flex flex-col gap-md px-margin-mobile md:px-margin-desktop mt-lg">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface hover:text-primary transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded w-fit"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
