import type { Metadata } from "next";
import Link from "next/link";
import { LogoLockup } from "@/components/brand/Logo";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export const metadata: Metadata = {
  title: "Studio",
  description: "About NEXONIC, an independent animation studio.",
};

/**
 * Ported to the Figma visual language using ONLY the studio copy that
 * already existed on this page. The Figma Studio page is mostly
 * invented content, all deliberately not carried over: a stats band
 * (fake numbers), six named team members with stock photos, a stock
 * "studio workspace" image, a 6-step pipeline and four "principles"
 * making specific unverified claims, and a Careers hiring section.
 * When real facts exist (founding year, team, contact), they slot into
 * the existing section structure without a layout change.
 */
export default function StudioPage() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-ink-950 overflow-hidden pt-28 pb-24">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-neon-violet/10 spin-slow pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-neon-pink/10 spin-slow pointer-events-none"
          style={{ animationDirection: "reverse", animationDuration: "30s" }}
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-neon-cyan/10 pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 text-center">
          <div className="mx-auto mb-8 w-fit">
            <LogoLockup width={180} priority />
          </div>
          <p className="font-outfit text-neon-violet-soft text-[11px] font-semibold tracking-widest uppercase mb-5">
            The Studio
          </p>
          <h1
            className="font-display italic text-paper-50 leading-tight mb-6"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            Independent by design.
          </h1>
          <p className="font-outfit text-paper-400 text-lg leading-relaxed max-w-xl mx-auto mb-10">
            NEXONIC is a small, self-funded animation studio. We build original worlds from the
            ground up — no franchises, no adaptations. Every project is developed in-house, start
            to finish.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/works"
              className="font-outfit px-7 py-3 rounded-full bg-gradient-to-r from-neon-violet to-neon-pink-deep text-white font-semibold text-sm hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-neon-violet/25"
            >
              Our Works
            </Link>
            <Link
              href="/journal"
              className="font-outfit px-7 py-3 rounded-full border border-white/15 text-paper-200 font-medium text-sm hover:bg-white/5 hover:border-white/30 transition-all"
            >
              Read Journal
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-paper-100 py-24">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <ScrollReveal>
              <p className="font-outfit text-ink-500 text-[11px] font-semibold tracking-widest uppercase mb-4">
                How we work
              </p>
              <h2
                className="font-display italic text-ink-900 leading-tight"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                Original work, made deliberately.
              </h2>
            </ScrollReveal>

            <div className="grid gap-6">
              <ScrollReveal className="flex gap-5 p-6 rounded-2xl bg-paper-50 border border-paper-200 hover:border-paper-400 transition-colors">
                <span className="font-display text-paper-500 text-sm font-light mt-0.5 shrink-0 w-7">01</span>
                <div>
                  <h3 className="font-display font-semibold text-ink-900 text-base mb-2">Creative direction</h3>
                  <p className="font-outfit text-ink-500 text-sm leading-relaxed">
                    Our work centers on original intellectual property — stories, characters, and
                    worlds that belong entirely to Nexonic. We favor deliberate, hand-considered
                    animation over volume, and we&apos;d rather ship one project we&apos;re proud of
                    than several we aren&apos;t.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal className="flex gap-5 p-6 rounded-2xl bg-paper-50 border border-paper-200 hover:border-paper-400 transition-colors">
                <span className="font-display text-paper-500 text-sm font-light mt-0.5 shrink-0 w-7">02</span>
                <div>
                  <h3 className="font-display font-semibold text-ink-900 text-base mb-2">Technology &amp; process</h3>
                  <p className="font-outfit text-ink-500 text-sm leading-relaxed">
                    Alongside traditional production, we experiment with the tools used to make
                    animation — pipeline, tooling, and technique — where it genuinely improves the
                    work rather than as a gimmick.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink-950 py-20">
        <div className="max-w-[1440px] mx-auto px-6 text-center">
          <p className="font-outfit text-neon-pink text-[11px] font-semibold tracking-widest uppercase mb-4">
            Get in touch
          </p>
          <h2 className="font-display italic text-paper-50 text-3xl md:text-4xl mb-4">
            Contact details are coming.
          </h2>
          <p className="font-outfit text-paper-400 text-base max-w-md mx-auto">
            Contact details and social channels will be published here as the studio comes online.
          </p>
        </div>
      </section>
    </div>
  );
}
