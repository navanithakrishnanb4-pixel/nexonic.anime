import type { Metadata } from "next";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { WorkCard } from "@/components/cards/WorkCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getWatchableWorks } from "@/lib/watch-data";

export const metadata: Metadata = {
  title: "Watch",
  description: "Stream original series and films from NEXONIC.",
};

export default async function WatchPage() {
  const works = await getWatchableWorks();

  return (
    <div className="px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-lg">
      <header className="max-w-2xl flex flex-col gap-xs">
        <h1 className="font-display-hero-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface">
          Watch
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Stream NEXONIC&apos;s original series and films as they release.
        </p>
      </header>

      {works.length === 0 ? (
        <EmptyState
          icon="live_tv"
          message="Nothing is available to watch yet. Our first episodes are still in production."
        />
      ) : (
        <ScrollReveal className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-md">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} href={`/watch/${work.slug}`} />
          ))}
        </ScrollReveal>
      )}
    </div>
  );
}
