"use client";

import Image from "next/image";
import Link from "next/link";
import type { JournalPost } from "@/lib/types";

interface JournalFeaturedCardProps {
  post: JournalPost;
}

export function JournalFeaturedCard({ post }: JournalFeaturedCardProps) {
  return (
    <Link
      href={`/journal/${post.slug}`}
      className="group grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden bg-ink-800 border border-white/5 hover:border-white/10 transition-colors block"
    >
      <div className="relative aspect-video md:aspect-auto overflow-hidden bg-ink-700">
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-paper-500 text-xs">
            No cover yet
          </div>
        )}
      </div>
      <div className="p-8 md:p-12 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-outfit px-2.5 py-1 rounded-full bg-neon-violet/15 text-neon-violet-soft border border-neon-violet/25 text-[10px] font-bold tracking-wider uppercase">
            Featured
          </span>
          {post.category && (
            <span className="font-outfit px-2.5 py-1 rounded-full bg-ink-700 text-paper-400 text-[10px] font-semibold tracking-wide uppercase">
              {post.category}
            </span>
          )}
        </div>
        <h2 className="font-display font-semibold text-paper-50 text-2xl md:text-3xl leading-snug mb-3 group-hover:text-neon-violet-soft transition-colors">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="font-outfit text-paper-500 text-sm leading-relaxed mb-7 line-clamp-3">{post.excerpt}</p>
        )}
        <div className="flex items-center justify-between">
          {post.authorName && (
            <p className="font-outfit text-paper-200 text-xs font-medium">{post.authorName}</p>
          )}
          <span className="font-outfit flex items-center gap-1.5 text-neon-violet-soft text-sm font-medium group-hover:gap-2.5 transition-all ml-auto">
            Read
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
