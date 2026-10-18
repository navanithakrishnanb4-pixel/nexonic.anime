import Link from "next/link";
import Image from "next/image";
import type { JournalPost } from "@/lib/types";

interface JournalArticleHeroProps {
  post: JournalPost;
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/** No "read time" badge — no such field on the real JournalPost contract. */
export function JournalArticleHero({ post }: JournalArticleHeroProps) {
  const date = formatDate(post.publishedAt);

  return (
    <div className="relative h-[50vh] min-h-[360px] max-h-[520px] bg-ink-900 overflow-hidden">
      {post.coverImageUrl ? (
        <Image src={post.coverImageUrl} alt={post.title} fill priority className="object-cover" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_theme(colors.ink-700)_0%,_theme(colors.ink-950)_60%)]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/60 to-ink-900/20" />

      <div className="absolute top-6 left-6">
        <Link
          href="/journal"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 backdrop-blur-md border border-white/10 text-paper-300 text-sm hover:text-paper-50 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Journal
        </Link>
      </div>

      <div className="absolute bottom-8 left-0 right-0 max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-4">
          {post.category && (
            <span className="font-outfit px-3 py-1 rounded-full bg-neon-violet/20 text-neon-violet-soft border border-neon-violet/30 text-[10px] font-bold tracking-widest uppercase">
              {post.category}
            </span>
          )}
          {date && <span className="font-outfit text-paper-400 text-xs">{date}</span>}
        </div>
      </div>
    </div>
  );
}
