"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { JournalPost } from "@/lib/types";
import { DURATION } from "@/lib/motion";

interface JournalCardProps {
  post: JournalPost;
}

export function JournalCard({ post }: JournalCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Link
      href={`/journal/${post.slug}`}
      className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-xl"
    >
      <motion.div
        className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-surface-container-low"
        whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
        transition={{ duration: DURATION.standard }}
      >
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 90vw, 400px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-container-low text-on-surface-variant text-caption font-caption">
            No cover yet
          </div>
        )}
      </motion.div>
      <div className="mt-sm">
        {post.category && (
          <span className="font-caption text-caption text-primary uppercase tracking-wide">
            {post.category}
          </span>
        )}
        <h2 className="font-headline-md text-headline-md text-on-surface mt-xs group-hover:text-primary transition-colors duration-200">
          {post.title}
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs line-clamp-2">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}
