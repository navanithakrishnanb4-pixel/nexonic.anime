"use client";

import Image from "next/image";
import Link from "next/link";
import type { JournalPost } from "@/lib/types";

interface HomeJournalCardProps {
  post: JournalPost;
}

export function HomeJournalCard({ post }: HomeJournalCardProps) {
  return (
    <Link href={`/journal/${post.slug}`} className="w-72 shrink-0 group block">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-ink-800 mb-3">
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            sizes="288px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-paper-500 text-xs">
            No cover yet
          </div>
        )}
      </div>
      {post.category && (
        <span className="font-outfit text-neon-violet-soft text-[10px] font-bold tracking-wider uppercase">
          {post.category}
        </span>
      )}
      <h3 className="font-display font-semibold text-paper-50 text-sm leading-tight line-clamp-2 group-hover:text-neon-violet-soft transition-colors mt-1">
        {post.title}
      </h3>
    </Link>
  );
}
