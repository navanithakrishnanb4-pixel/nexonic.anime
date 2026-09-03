"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CatalogueControls } from "@/components/catalogue/CatalogueControls";
import { WorkCard } from "@/components/cards/WorkCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { staggerChildren, fadeInUp } from "@/lib/motion";
import { workCategoryFilters, workSortOptions } from "@/lib/works-data";
import type { Work } from "@/lib/types";

interface WorksCatalogueProps {
  works: Work[];
}

/**
 * Grid + controls for /works. Not built on ContentShelf — ContentShelf
 * bakes in a shelf heading and "view all" link meant for a homepage
 * row; this page needs a page-level heading, a description, and filter
 * controls above a full grid instead. Reuses WorkCard and EmptyState
 * directly rather than duplicating their markup.
 *
 * Client component only because the filter/sort controls need local
 * state. `works` itself is fetched server-side in app/works/page.tsx
 * and passed in as a prop.
 */
export function WorksCatalogue({ works }: WorksCatalogueProps) {
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("latest");

  // Filtering/sorting logic is here and does run — it's just a no-op
  // against an empty array right now. This is the real behavior that
  // will apply the moment `works` is non-empty; nothing to rewrite later.
  const filtered =
    category === "all" ? works : works.filter((w) => w.category === category);

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "az") return a.title.localeCompare(b.title);
    // "latest": fall back to publishedAt, most recent first
    return (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
  });

  return (
    <div className="flex flex-col gap-lg">
      <ScrollReveal>
        <CatalogueControls
          categories={workCategoryFilters}
          activeCategory={category}
          onCategoryChange={setCategory}
          sortOptions={workSortOptions}
          activeSort={sort}
          onSortChange={setSort}
        />
      </ScrollReveal>

      {sorted.length === 0 ? (
        <EmptyState
          icon="movie"
          message="Nexonic has no published works yet. Our first projects are currently in development."
        />
      ) : (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-md"
          variants={staggerChildren(0.06)}
          initial="hidden"
          animate="visible"
        >
          {sorted.map((work) => (
            <motion.div key={work.id} variants={fadeInUp}>
              <WorkCard work={work} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
