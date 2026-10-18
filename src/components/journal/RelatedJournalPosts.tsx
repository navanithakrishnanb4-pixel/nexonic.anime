import Image from "next/image";
import Link from "next/link";
import type { JournalPost } from "@/lib/types";

interface RelatedJournalPostsProps {
  posts: JournalPost[];
}

export function RelatedJournalPosts({ posts }: RelatedJournalPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="bg-paper-200 border-t border-paper-300">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="font-display font-semibold text-ink-900 text-xl mb-8">More from the Journal</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/journal/${post.slug}`}
              className="group bg-paper-50 rounded-2xl overflow-hidden border border-paper-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 block"
            >
              <div className="aspect-video overflow-hidden bg-paper-200">
                {post.coverImageUrl ? (
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-paper-500 text-xs">
                    No cover yet
                  </div>
                )}
              </div>
              <div className="p-5">
                {post.category && (
                  <span className="font-outfit text-[10px] font-bold tracking-wide uppercase text-ink-400">
                    {post.category}
                  </span>
                )}
                <h3 className="font-display font-semibold text-ink-900 text-sm mt-1 leading-snug line-clamp-2 group-hover:text-neon-violet transition-colors">
                  {post.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
