import { Hero } from "@/components/sections/Hero";
import { StudioSection } from "@/components/sections/StudioSection";
import { ContentShelf } from "@/components/shelves/ContentShelf";
import { WorkCard } from "@/components/cards/WorkCard";
import { JournalCard } from "@/components/cards/JournalCard";
import {
  getFeaturedJournalPosts,
  getFeaturedWorks,
  getHeroContent,
} from "@/lib/homepage-data";

/**
 * Canonical NEXONIC homepage (Step 8). Server component: fetches its
 * three content pieces (hero, works, journal) from the data seam in
 * lib/homepage-data.ts, all of which currently resolve to empty/default
 * values. Nothing here special-cases "0 items" — ContentShelf already
 * renders EmptyState automatically, so this page works identically
 * once real content exists later, no changes needed here for that.
 */
export default async function HomePage() {
  const [hero, works, journalPosts] = await Promise.all([
    getHeroContent(),
    getFeaturedWorks(),
    getFeaturedJournalPosts(),
  ]);

  return (
    <>
      <Hero content={hero} />

      <ContentShelf
        title="Works"
        items={works}
        renderItem={(work) => <WorkCard work={work} />}
        emptyIcon="movie"
        emptyMessage="Our first worlds are still being built."
        viewAllHref="/works"
      />

      <ContentShelf
        title="Journal"
        items={journalPosts}
        renderItem={(post) => <JournalCard post={post} />}
        emptyIcon="edit_note"
        emptyMessage="The studio journal is coming soon."
        viewAllHref="/journal"
      />

      <StudioSection />
    </>
  );
}
