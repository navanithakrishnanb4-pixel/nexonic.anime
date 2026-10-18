import { Hero } from "@/components/sections/Hero";
import { StudioSection } from "@/components/sections/StudioSection";
import { FigmaShelf } from "@/components/shelves/FigmaShelf";
import { HomeWorkCard } from "@/components/works/HomeWorkCard";
import { HomeJournalCard } from "@/components/journal/HomeJournalCard";
import {
  getFeaturedJournalPosts,
  getFeaturedWorks,
  getHeroContent,
} from "@/lib/homepage-data";

/**
 * Second page ported to the Figma visual design (after /works).
 *
 * SCOPING NOTE: the Figma reference's Home has five shelves (Trending,
 * Latest Episodes, an Upcoming spotlight, Popular, Recently Added).
 * Those depend on data axes that don't exist in the real schema —
 * trending/popularity ranking, episode air-dates, an "upcoming"
 * concept distinct from work status. Faking that categorization with
 * the same handful of (currently zero) real Works repeated under five
 * headings would be decorative clutter with no real function. This
 * page keeps exactly the two shelves with real backing data — Works
 * (featured) and Journal (featured) — restyled, plus Hero and the
 * Studio teaser. If trending/popularity tracking gets built later,
 * shelves like that become a real addition instead of a cosmetic one.
 */
export default async function HomePage() {
  const [hero, works, journalPosts] = await Promise.all([
    getHeroContent(),
    getFeaturedWorks(),
    getFeaturedJournalPosts(),
  ]);

  return (
    <div className="bg-ink-900">
      <Hero content={hero} />

      <section className="py-14">
        <div className="max-w-[1440px] mx-auto px-6">
          <FigmaShelf
            title="Works"
            eyebrow="From the Studio"
            viewAllHref="/works"
            isEmpty={works.length === 0}
            emptyMessage="Our first worlds are still being built."
          >
            {works.map((work) => (
              <HomeWorkCard key={work.id} work={work} />
            ))}
          </FigmaShelf>
        </div>
      </section>

      <div className="h-px bg-white/5 mx-6" />

      <section className="py-14">
        <div className="max-w-[1440px] mx-auto px-6">
          <FigmaShelf
            title="Journal"
            eyebrow="Latest Writing"
            viewAllHref="/journal"
            isEmpty={journalPosts.length === 0}
            emptyMessage="The studio journal is coming soon."
          >
            {journalPosts.map((post) => (
              <HomeJournalCard key={post.id} post={post} />
            ))}
          </FigmaShelf>
        </div>
      </section>

      <StudioSection />
    </div>
  );
}
