import Link from "next/link";
import type { JournalPost } from "@/lib/types";

interface JournalArticleBodyProps {
  post: JournalPost;
}

/**
 * No author avatar or role/title line — JournalPost only has a plain
 * authorName string, no such fields exist; shown as plain text instead
 * of fabricating a placeholder avatar. Content is split on blank lines
 * into paragraphs, same as before — no rich-text editor exists yet.
 */
export function JournalArticleBody({ post }: JournalArticleBodyProps) {
  const paragraphs = post.content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="bg-paper-100">
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        <h1
          className="font-display font-semibold text-ink-900 leading-tight mb-4"
          style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
        >
          {post.title}
        </h1>

        {post.authorName && (
          <div className="flex items-center gap-3 pb-8 mb-8 border-b border-paper-300">
            <div className="w-10 h-10 rounded-full bg-paper-300 shrink-0 flex items-center justify-center font-outfit text-ink-600 text-sm font-semibold">
              {post.authorName.charAt(0).toUpperCase()}
            </div>
            <p className="font-outfit font-semibold text-ink-800 text-sm">{post.authorName}</p>
          </div>
        )}

        {post.excerpt && (
          <p className="font-outfit text-ink-600 text-lg leading-relaxed italic font-light mb-10 pl-6 border-l-4 border-neon-violet/40">
            {post.excerpt}
          </p>
        )}

        <div className="space-y-6">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="font-outfit text-ink-700 text-base leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {post.category && (
          <div className="mt-12 pt-8 border-t border-paper-300 flex flex-wrap items-center gap-2">
            <span className="font-outfit text-ink-500 text-xs mr-1">Filed under:</span>
            <Link
              href="/journal"
              className="font-outfit px-3 py-1 rounded-full bg-paper-200 text-ink-600 text-xs hover:bg-ink-900 hover:text-paper-50 transition-colors border border-paper-300"
            >
              {post.category}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
