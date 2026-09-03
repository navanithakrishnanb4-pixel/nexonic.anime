"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { primaryNav } from "@/lib/nav";

/**
 * Mobile-only tab bar (hidden md and up, matching the ZIP's md:hidden
 * behavior). Active tab is derived from the real route instead of being
 * hard-coded to "Home" the way the static Stitch export had it.
 */
export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-surface/95 backdrop-blur-md border-t border-white/5 fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 md:hidden px-4 rounded-t-xl shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
      {primaryNav.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex flex-col items-center justify-center transition-colors duration-200 touch-manipulation ${
              isActive ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Icon name={item.icon} filled={isActive} className="mb-xs" />
            <span className="font-label-md text-[10px] tracking-widest uppercase">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
