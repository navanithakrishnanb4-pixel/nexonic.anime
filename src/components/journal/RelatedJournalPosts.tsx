import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { JournalCard } from "@/components/cards/JournalCard";
import type { JournalPost } from "@/lib/types";

interface RelatedJournalPostsProps {
  posts: JournalPost[];
}

export function RelatedJournalPosts({ posts }: RelatedJournalPostsProps) {
  if (posts.length === 0) return null;

  return (
    <ScrollReveal className="px-margin-mobile md:px-margin-desktop py-lg border-t border-surface-container mt-lg">
      <h2 className="font-headline-md text-headline-md text-on-surface mb-md">
        More from the Journal
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
        {posts.map((post) => (
          <JournalCard key={post.id} post={post} />
        ))}
      </div>
    </ScrollReveal>
  );
}
