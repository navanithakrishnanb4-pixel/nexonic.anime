"use client";

import Image from "next/image";
import Link from "next/link";
import type { JournalPost } from "@/lib/types";

interface JournalGridCardProps {
  post: JournalPost;
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

/**
 * No author avatar, no "read time" — neither has an equivalent field
 * on the real JournalPost contract. Author name and publish date, both
 * real, shown as plain text instead.
 */
export function JournalGridCard({ post }: JournalGridCardProps) {
  const date = formatDate(post.publishedAt);

  return (
    <Link
      href={`/journal/${post.slug}`}
      className="group bg-paper-50 rounded-2xl overflow-hidden border border-paper-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block"
    >
      <div className="aspect-video overflow-hidden bg-paper-200">
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            width={480}
            height={270}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-paper-500 text-xs">
            No cover yet
          </div>
        )}
      </div>
      <div className="p-6">
        {post.category && (
          <span className="font-outfit px-2.5 py-0.5 rounded-full bg-paper-200 text-ink-600 border border-paper-300 text-[10px] font-bold tracking-wide uppercase">
            {post.category}
          </span>
        )}
        <h3 className="font-display font-semibold text-ink-900 text-base leading-snug mb-2 mt-3 line-clamp-2 group-hover:text-neon-violet transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="font-outfit text-ink-500 text-xs leading-relaxed line-clamp-2 mb-5">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-2 font-outfit text-ink-400 text-xs">
          {post.authorName && <span>{post.authorName}</span>}
          {post.authorName && date && <span className="text-paper-500">·</span>}
          {date && <span>{date}</span>}
        </div>
      </div>
    </Link>
  );
}
