"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { adminNav } from "@/lib/admin-nav";
import { LogoutButton } from "@/components/admin/LogoutButton";

/**
 * Ported to the Figma admin visual language (dark ink background,
 * neon-violet active indicator, font-outfit/font-display). Icons stay
 * Material Symbols (via the existing Icon component) rather than
 * switching every icon to hand-drawn inline SVGs like the Figma
 * reference — same icon set already used across the whole admin
 * section, and redrawing ~12 icons for a cosmetic family change wasn't
 * worth the added surface area for this pass. Nav data/active-route
 * logic/auth are unchanged — this is styling only.
 */
export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 flex-shrink-0 border-r border-white/5 bg-ink-950 h-screen sticky top-0">
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-violet to-neon-pink flex items-center justify-center shrink-0">
          <span className="font-display font-bold text-white text-sm leading-none">N</span>
        </div>
        <div className="leading-none">
          <span className="font-display font-semibold text-paper-50 text-sm tracking-wide uppercase block">
            Nexonic
          </span>
          <span className="font-outfit text-paper-500 text-[10px] uppercase tracking-widest">Admin</span>
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-3 flex-grow" aria-label="Admin navigation">
        {adminNav.map((item) => {
          const isActive =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`font-outfit relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-violet ${
                isActive
                  ? "bg-white/5 text-paper-50 font-medium"
                  : "text-paper-500 hover:bg-white/5 hover:text-paper-200"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-gradient-to-b from-neon-violet to-neon-pink" />
              )}
              <Icon name={item.icon} size={19} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5 flex flex-col gap-1">
        <Link
          href="/"
          className="font-outfit flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-paper-500 hover:bg-white/5 hover:text-paper-200 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-violet"
        >
          <Icon name="arrow_back" size={19} />
          View site
        </Link>
        <LogoutButton className="font-outfit !text-paper-500 hover:!text-paper-200 !rounded-xl" />
      </div>
    </aside>
  );
}
