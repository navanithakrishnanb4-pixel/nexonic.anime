import { LogoMark } from "@/components/brand/Logo";
import Link from "next/link";
import { footerLegalLinks } from "@/lib/nav";

/**
 * Figma footer layout with real content only. Differences from the
 * reference, on purpose:
 * - Link columns list only routes that exist (Works, Watch, Search,
 *   Studio, Journal). The reference's "New Releases", "Coming Soon",
 *   "Our Process", "Careers", "Press Kit" pointed at filters/anchors/
 *   pages that don't exist here.
 * - Brand blurb reuses the site's own existing description instead of
 *   the reference's "streaming platform... worldwide" claim.
 * - Legal links still come from lib/nav.ts. /privacy and /terms are
 *   not built yet, so they 404 until those pages exist — unchanged
 *   from before the redesign.
 */
const LINK_COLUMNS: { heading: string; items: { label: string; href: string }[] }[] = [
  {
    heading: "Platform",
    items: [
      { label: "Browse Works", href: "/works" },
      { label: "Watch", href: "/watch" },
      { label: "Search", href: "/search" },
    ],
  },
  {
    heading: "Studio",
    items: [
      { label: "About Nexonic", href: "/studio" },
      { label: "Journal", href: "/journal" },
    ],
  },
  {
    heading: "Legal",
    items: footerLegalLinks.map((l) => ({ label: l.label, href: l.href })),
  },
];

export function Footer() {
  return (
    <footer className="bg-ink-950 border-t border-white/5 w-full">
      <div className="h-px bg-gradient-to-r from-neon-violet/40 via-neon-pink/40 to-neon-cyan/40" />

      <div className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <LogoMark size={44} />
              <span className="font-display font-semibold text-paper-50 tracking-widest uppercase text-base">
                Nexonic
              </span>
            </div>
            <p className="font-outfit text-paper-500 text-sm leading-relaxed max-w-xs">
              An independent animation studio building original stories and technology.
            </p>
          </div>

          {LINK_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="font-outfit text-paper-50 text-xs font-semibold tracking-widest uppercase mb-4">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-outfit text-paper-500 text-sm hover:text-paper-200 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="font-outfit text-paper-500 text-xs">
            © {new Date().getFullYear()} NEXONIC Animation Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
