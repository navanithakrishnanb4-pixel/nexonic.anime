import type { Metadata } from "next";
import { JournalCatalogue } from "@/components/catalogue/JournalCatalogue";
import { getAllJournalPosts } from "@/lib/journal-data";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes on production, process, and progress from the NEXONIC animation studio.",
};

export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const posts = await getAllJournalPosts();

  return (
    <div className="min-h-screen">
      <div className="bg-ink-900 border-b border-white/5 py-16">
        <div className="max-w-[1440px] mx-auto px-6">
          <p className="font-outfit text-neon-violet-soft text-[11px] font-semibold tracking-widest uppercase mb-2">
            From the Studio
          </p>
          <h1 className="font-display italic text-paper-50 text-5xl font-light mb-3">
            Journal
          </h1>
          <p className="font-outfit text-paper-400 text-sm max-w-md">
            Notes on production, process, and progress — written directly by the
            studio as our projects take shape.
          </p>
        </div>
      </div>

      <JournalCatalogue posts={posts} />
    </div>
  );
}
