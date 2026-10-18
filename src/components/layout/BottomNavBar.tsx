"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { primaryNav } from "@/lib/nav";

/**
 * Mobile-only tab bar, ported to the ink/neon theme. Active tab comes
 * from the real route.
 */
export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="bg-ink-950/95 backdrop-blur-md border-t border-white/5 fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 md:hidden px-4"
    >
      {primaryNav.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors duration-200 touch-manipulation ${
              isActive ? "text-neon-violet-soft" : "text-paper-500 hover:text-paper-200"
            }`}
          >
            <Icon name={item.icon} filled={isActive} />
            <span className="font-outfit text-[10px] tracking-widest uppercase font-medium">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
