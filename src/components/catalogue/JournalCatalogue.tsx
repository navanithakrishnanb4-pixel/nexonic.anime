"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CatalogueControls } from "@/components/catalogue/CatalogueControls";
import { JournalCard } from "@/components/cards/JournalCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { staggerChildren, fadeInUp } from "@/lib/motion";
import { journalCategoryFilters, journalSortOptions } from "@/lib/journal-data";
import type { JournalPost } from "@/lib/types";

interface JournalCatalogueProps {
  posts: JournalPost[];
}

/**
 * Same structure as WorksCatalogue: CatalogueControls (reused as-is,
 * it was already generic — not works-specific) above a grid built
 * directly on JournalCard + EmptyState, not ContentShelf, for the same
 * reason as the Works page (page-level heading vs. shelf heading).
 * Filtering/sorting is real logic running against an empty array.
 */
export function JournalCatalogue({ posts }: JournalCatalogueProps) {
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("latest");

  const filtered =
    category === "all" ? posts : posts.filter((p) => p.category === category);

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "az") return a.title.localeCompare(b.title);
    return (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
  });

  return (
    <div className="flex flex-col gap-lg">
      <ScrollReveal>
        <CatalogueControls
          categories={journalCategoryFilters}
          activeCategory={category}
          onCategoryChange={setCategory}
          sortOptions={journalSortOptions}
          activeSort={sort}
          onSortChange={setSort}
        />
      </ScrollReveal>

      {sorted.length === 0 ? (
        <EmptyState
          icon="edit_note"
          message="The studio journal is coming soon. Check back for updates on Nexonic's projects and process."
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg"
          variants={staggerChildren(0.06)}
          initial="hidden"
          animate="visible"
        >
          {sorted.map((post) => (
            <motion.div key={post.id} variants={fadeInUp}>
              <JournalCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
