"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { adminNav } from "@/lib/admin-nav";
import { DURATION } from "@/lib/motion";

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <header className="h-16 flex items-center justify-between px-margin-mobile border-b border-surface-container bg-surface-container-lowest sticky top-0 z-40">
        <Link href="/admin" className="font-headline-md text-headline-md font-bold text-on-surface">
          NEXONIC <span className="text-caption text-on-surface-variant">Admin</span>
        </Link>
        <button
          type="button"
          aria-label="Open admin menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Icon name="menu" />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-surface/98 backdrop-blur-lg flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.standard }}
          >
            <div className="h-16 flex items-center justify-between px-margin-mobile">
              <span className="font-headline-md text-headline-md font-bold text-on-surface">
                Admin
              </span>
              <button
                type="button"
                aria-label="Close admin menu"
                onClick={() => setOpen(false)}
                className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                <Icon name="close" />
              </button>
            </div>
            <nav className="flex flex-col gap-xs px-margin-mobile" aria-label="Admin navigation">
              {adminNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-sm py-sm font-body-lg text-body-lg text-on-surface"
                >
                  <Icon name={item.icon} />
                  {item.label}
                </Link>
              ))}
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-sm py-sm mt-sm border-t border-surface-container font-body-lg text-body-lg text-on-surface-variant"
              >
                <Icon name="arrow_back" />
                View site
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
