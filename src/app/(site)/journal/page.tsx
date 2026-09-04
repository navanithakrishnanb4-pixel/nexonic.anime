import type { Metadata } from "next";
import { JournalCatalogue } from "@/components/catalogue/JournalCatalogue";
import { getAllJournalPosts } from "@/lib/journal-data";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes on production, process, and progress from the NEXONIC animation studio.",
};

export default async function JournalPage() {
  const posts = await getAllJournalPosts();

  return (
    <div className="px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-lg">
      <header className="max-w-2xl flex flex-col gap-xs">
        <h1 className="font-display-hero-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface">
          Journal
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Notes on production, process, and progress — written directly by the
          studio as our projects take shape.
        </p>
      </header>

      <JournalCatalogue posts={posts} />
    </div>
  );
}
