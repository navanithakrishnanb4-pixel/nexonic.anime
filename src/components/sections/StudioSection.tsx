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
    <ScrollReveal className="px-margin-mobile md:px-margin-desktop py-xl border-t border-surface-container">
      <div className="max-w-2xl flex flex-col gap-sm">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface">
          Independent by design.
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          NEXONIC is a small, self-funded animation studio. We build original
          worlds from the ground up — no franchises, no adaptations. Every
          project is developed in-house, start to finish.
        </p>
        <div className="pt-sm">
          <Button href="/studio" variant="secondary">
            About the Studio
          </Button>
        </div>
      </div>
    </ScrollReveal>
  );
}
