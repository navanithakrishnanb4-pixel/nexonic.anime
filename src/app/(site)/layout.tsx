import { TopAppBar } from "@/components/layout/TopAppBar";
import { BottomNavBar } from "@/components/layout/BottomNavBar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/motion/PageTransition";

/**
 * Layout for every public-facing route (Home, Works, Journal, Watch,
 * Search, Studio). Route group `(site)` — no URL segment added.
 * This is exactly what root layout.tsx rendered before Step 17; moved
 * here unchanged so /admin can opt out of it entirely.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen pt-16 pb-16 md:pb-0">
      <a href="#main-content" className="sr-only sr-only-focusable">
        Skip to content
      </a>
      <TopAppBar />
      <main id="main-content" className="flex-grow flex flex-col">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <BottomNavBar />
    </div>
  );
}
