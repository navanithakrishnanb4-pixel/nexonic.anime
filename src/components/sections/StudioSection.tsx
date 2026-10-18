import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

/**
 * Short "about the studio" band on the homepage. This is intentionally
 * NOT the full Studio page (that's Step 16, its own route) — just a
 * two-sentence teaser + link, matching how the ZIP's home screens used
 * a condensed studio blurb rather than duplicating the Studio page.
 */
export function StudioSection() {
  return (
    <ScrollReveal className="px-6 py-16 border-t border-white/5 bg-ink-900">
      <div className="max-w-2xl mx-auto flex flex-col gap-sm text-center items-center">
        <h2 className="font-display italic text-3xl font-light text-paper-50">
          Independent by design.
        </h2>
        <p className="font-outfit text-paper-300 text-sm leading-relaxed max-w-lg">
          NEXONIC is a small, self-funded animation studio. We build original
          worlds from the ground up — no franchises, no adaptations. Every
          project is developed in-house, start to finish.
        </p>
        <div className="pt-sm">
          <Button
            href="/studio"
            variant="secondary"
            className="!border-white/25 !text-paper-100 hover:!bg-white/8 hover:!border-white/40 !rounded-full"
          >
            About the Studio
          </Button>
        </div>
      </div>
    </ScrollReveal>
  );
}
