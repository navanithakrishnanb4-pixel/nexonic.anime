"use client";

import { LogoMark } from "@/components/brand/Logo";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { primaryNav } from "@/lib/nav";
import { DURATION } from "@/lib/motion";

function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark size={size === "md" ? 36 : 30} priority />
      <span className="font-display font-semibold text-paper-50 tracking-widest uppercase text-sm">
        Nexonic
      </span>
    </span>
  );
}

/**
 * Fixed top bar on every public page, ported to the Figma ink/neon
 * theme. Structure and behavior unchanged: menu button opens a nav
 * drawer (card tiles), logo links home, search links to /search.
 */
export function TopAppBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Escape closes the drawer; page scroll is locked while it is open.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  return (
    <>
      <header className="bg-ink-950/90 backdrop-blur-md border-b border-white/5 fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 md:px-10 h-16">
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="text-paper-400 hover:text-paper-50 transition-colors duration-300 flex items-center justify-center p-2 rounded-full hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-violet"
        >
          <Icon name="menu" />
        </button>

        <Link
          href="/"
          aria-label="Nexonic home"
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-violet rounded-lg"
        >
          <Logo />
        </Link>

        <Link
          href="/search"
          aria-label="Search"
          className="text-paper-400 hover:text-paper-50 transition-colors duration-300 flex items-center justify-center p-2 rounded-full hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-violet"
        >
          <Icon name="search" />
        </Link>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            role="dialog" aria-modal="true" aria-label="Menu"
            className="fixed inset-0 z-[60] bg-ink-950/98 backdrop-blur-lg flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.standard }}
          >
            <div className="flex justify-between items-center px-5 md:px-10 h-16">
              <Logo />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="text-paper-400 hover:text-paper-50 p-2 rounded-full hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-violet"
              >
                <Icon name="close" />
              </button>
            </div>

            <nav className="flex-1 px-5 md:px-10 mt-8 overflow-y-auto" aria-label="Main navigation">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                {primaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-ink-800/50 hover:bg-ink-800 hover:border-neon-violet/40 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-violet"
                  >
                    <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-ink-700 group-hover:bg-neon-violet/15 text-paper-400 group-hover:text-neon-violet-soft transition-colors duration-200 shrink-0">
                      <Icon name={item.icon} size={22} />
                    </span>
                    <span className="flex flex-col min-w-0">
                      <span className="font-display font-semibold text-paper-50 text-lg group-hover:text-neon-violet-soft transition-colors duration-200">
                        {item.label}
                      </span>
                      {item.description && (
                        <span className="font-outfit text-xs text-paper-500 truncate">{item.description}</span>
                      )}
                    </span>
                    <Icon
                      name="arrow_forward"
                      size={18}
                      className="ml-auto text-paper-500 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 shrink-0"
                    />
                  </Link>
                ))}
              </div>

              <Link
                href="/search"
                onClick={() => setMenuOpen(false)}
                className="group flex items-center gap-4 p-4 mt-3 rounded-2xl border border-white/10 bg-ink-800/50 hover:bg-ink-800 hover:border-neon-violet/40 transition-all duration-200 max-w-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-violet"
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-ink-700 group-hover:bg-neon-violet/15 text-paper-400 group-hover:text-neon-violet-soft transition-colors duration-200 shrink-0">
                  <Icon name="search" size={22} />
                </span>
                <span className="flex flex-col min-w-0">
                  <span className="font-display font-semibold text-paper-50 text-lg group-hover:text-neon-violet-soft transition-colors duration-200">
                    Search
                  </span>
                  <span className="font-outfit text-xs text-paper-500">Find works and journal posts</span>
                </span>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
