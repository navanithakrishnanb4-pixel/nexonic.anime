"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { adminNav } from "@/lib/admin-nav";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 flex-shrink-0 border-r border-surface-container bg-surface-container-lowest h-screen sticky top-0">
      <div className="h-16 flex items-center px-md border-b border-surface-container">
        <Link href="/admin" className="font-headline-md text-headline-md font-bold text-on-surface">
          NEXONIC
        </Link>
        <span className="ml-xs font-caption text-caption text-on-surface-variant uppercase tracking-widest">
          Admin
        </span>
      </div>

      <nav className="flex flex-col gap-xs p-sm flex-grow" aria-label="Admin navigation">
        {adminNav.map((item) => {
          const isActive =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-sm px-sm py-xs rounded-lg font-body-md text-body-md transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                isActive
                  ? "bg-surface-container-high text-on-surface"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
              }`}
            >
              <Icon name={item.icon} size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-sm border-t border-surface-container">
        <Link
          href="/"
          className="flex items-center gap-sm px-sm py-xs rounded-lg font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Icon name="arrow_back" size={20} />
          View site
        </Link>
      </div>
    </aside>
  );
}
