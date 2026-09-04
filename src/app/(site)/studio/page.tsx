import type { Metadata } from "next";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export const metadata: Metadata = {
  title: "Studio",
  description: "About NEXONIC, an independent animation studio.",
};

/**
 * Public /studio page. No team roster, history, awards, clients, or
 * stats — none of that exists yet and none of it is invented here.
 * Sections are written so real content (a real founding year, real
 * contact details, a real team) can be dropped in later without a
 * layout change. The "Contact" section deliberately has no email or
 * social link yet — fabricating one would look real but wouldn't be;
 * better an honest placeholder than a dead or fake contact point.
 */
export default function StudioPage() {
  return (
    <div className="flex flex-col">
      <ScrollReveal className="px-margin-mobile md:px-margin-desktop py-xl max-w-3xl">
        <span className="font-label-md text-label-md text-primary uppercase tracking-widest">
          The Studio
        </span>
        <h1 className="font-display-hero-mobile text-headline-lg-mobile md:font-display-hero md:text-headline-lg text-on-surface mt-sm">
          Independent by design.
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-md">
          NEXONIC is a small, self-funded animation studio. We build original
          worlds from the ground up — no franchises, no adaptations. Every
          project is developed in-house, start to finish.
        </p>
      </ScrollReveal>

      <ScrollReveal className="px-margin-mobile md:px-margin-desktop py-lg border-t border-surface-container max-w-3xl">
        <h2 className="font-headline-md text-headline-md text-on-surface">
          Creative direction
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
          Our work centers on original intellectual property — stories,
          characters, and worlds that belong entirely to Nexonic. We favor
          deliberate, hand-considered animation over volume, and we&apos;d
          rather ship one project we&apos;re proud of than several we
          aren&apos;t.
        </p>
      </ScrollReveal>

      <ScrollReveal className="px-margin-mobile md:px-margin-desktop py-lg border-t border-surface-container max-w-3xl">
        <h2 className="font-headline-md text-headline-md text-on-surface">
          Technology &amp; process
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
          Alongside traditional production, we experiment with the tools
          used to make animation — pipeline, tooling, and technique — where
          it genuinely improves the work rather than as a gimmick.
        </p>
      </ScrollReveal>

      <ScrollReveal className="px-margin-mobile md:px-margin-desktop py-xl border-t border-surface-container max-w-3xl">
        <h2 className="font-headline-md text-headline-md text-on-surface">
          Get in touch
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
          Contact details and social channels will be published here as the
          studio comes online.
        </p>
      </ScrollReveal>
    </div>
  );
}
