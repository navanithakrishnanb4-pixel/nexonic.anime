import type { Metadata } from "next";
import { WorksCatalogue } from "@/components/catalogue/WorksCatalogue";
import { getAllWorks } from "@/lib/works-data";

export const metadata: Metadata = {
  title: "Works",
  description: "Original animated worlds from NEXONIC, an independent animation studio.",
};

// Live Supabase data — never statically frozen at build time. Unchanged
// from before the redesign; only the presentation below changed.
export const dynamic = "force-dynamic";

/**
 * First page ported to the approved Figma visual design. Data fetching
 * is untouched — same getAllWorks() call, same real Supabase-backed
 * Work[]. Only WorksCatalogue and its children changed. The shared
 * TopAppBar above this page is intentionally still the old dark theme
 * — it hasn't been ported yet, so there's a visible seam between it
 * and this page's dark header stripe/light body below. That's
 * expected until nav gets its own pass, not a bug.
 */
export default async function WorksPage() {
  const works = await getAllWorks();

  return (
    <div className="min-h-screen bg-paper-100">
      <div className="bg-ink-900 py-14">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="font-outfit text-neon-violet-soft text-[11px] font-semibold tracking-widest uppercase mb-2">
                Nexonic Originals
              </p>
              <h1
                className="font-display italic text-paper-50 font-light mb-2"
                style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)" }}
              >
                Works
              </h1>
              <p className="font-outfit text-paper-400 text-sm max-w-sm">
                Original series, films, and shorts developed in-house at NEXONIC.
              </p>
            </div>
            <div className="hidden lg:block relative w-32 h-32 shrink-0" aria-hidden="true">
              <div className="absolute inset-0 rounded-full border border-neon-violet/15 spin-slow" />
              <div
                className="absolute inset-4 rounded-full border border-neon-pink/10 spin-slow"
                style={{ animationDirection: "reverse" }}
              />
              <div className="absolute inset-[35%] rounded-full bg-gradient-to-br from-neon-violet/20 to-neon-pink/20" />
            </div>
          </div>
        </div>
      </div>

      <WorksCatalogue works={works} />
    </div>
  );
}
