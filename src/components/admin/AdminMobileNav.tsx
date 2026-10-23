"use client";

import { LogoMark } from "@/components/brand/Logo";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { adminNav } from "@/lib/admin-nav";
import { DURATION } from "@/lib/motion";
import { LogoutButton } from "@/components/admin/LogoutButton";

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  // Escape closes the drawer; page scroll is locked while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <header className="h-16 flex items-center justify-between px-5 border-b border-white/5 bg-ink-950 sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2.5">
          <LogoMark size={28} />
          <span className="font-display font-semibold text-paper-50 text-sm tracking-wide uppercase">
            Admin
          </span>
        </Link>
        <button
          type="button"
          aria-label="Open admin menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="p-2 rounded-full text-paper-400 hover:text-paper-100 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-violet"
        >
          <Icon name="menu" />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog" aria-modal="true" aria-label="Admin menu"
            className="fixed inset-0 z-50 bg-ink-950/98 backdrop-blur-lg flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.standard }}
          >
            <div className="h-16 flex items-center justify-between px-5">
              <span className="font-display font-semibold text-paper-50 text-sm tracking-wide uppercase">
                Admin
              </span>
              <button
                type="button"
                aria-label="Close admin menu"
                onClick={() => setOpen(false)}
                className="p-2 rounded-full text-paper-400 hover:text-paper-100 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-violet"
              >
                <Icon name="close" />
              </button>
            </div>
            <nav className="font-outfit flex flex-col gap-1 px-5" aria-label="Admin navigation">
              {adminNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 py-3 text-base text-paper-200"
                >
                  <Icon name={item.icon} />
                  {item.label}
                </Link>
              ))}
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 py-3 mt-2 border-t border-white/5 text-base text-paper-500"
              >
                <Icon name="arrow_back" />
                View site
              </Link>
              <LogoutButton className="!text-paper-500 py-3 text-base" />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
