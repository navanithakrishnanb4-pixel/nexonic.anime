"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { staggerChildren, fadeInUp } from "@/lib/motion";
import type { JournalPost } from "@/lib/types";

interface JournalArticleHeaderProps {
  post: JournalPost;
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function JournalArticleHeader({ post }: JournalArticleHeaderProps) {
  const publishedLabel = formatDate(post.publishedAt);

  return (
    <header className="flex flex-col gap-lg">
      <motion.div
        className="max-w-3xl mx-auto w-full px-margin-mobile md:px-0 flex flex-col gap-sm text-center items-center"
        variants={staggerChildren(0.1)}
        initial="hidden"
        animate="visible"
      >
        {post.category && (
          <motion.span
            variants={fadeInUp}
            className="font-label-md text-label-md text-primary uppercase tracking-widest"
          >
            {post.category}
          </motion.span>
        )}
        <motion.h1
          variants={fadeInUp}
          className="font-display-hero-mobile text-headline-lg-mobile md:font-display-hero md:text-headline-lg text-on-surface"
        >
          {post.title}
        </motion.h1>
        <motion.div
          variants={fadeInUp}
          className="font-caption text-caption text-on-surface-variant uppercase tracking-wide flex items-center gap-xs"
        >
          {post.authorName && <span>{post.authorName}</span>}
          {post.authorName && publishedLabel && <span aria-hidden="true">·</span>}
          {publishedLabel && <span>{publishedLabel}</span>}
        </motion.div>
      </motion.div>

      {post.coverImageUrl && (
        <motion.div
          className="relative w-full aspect-[16/7] max-w-5xl mx-auto rounded-xl overflow-hidden border border-outline-variant/40 bg-surface-container-low"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </motion.div>
      )}
    </header>
  );
}
