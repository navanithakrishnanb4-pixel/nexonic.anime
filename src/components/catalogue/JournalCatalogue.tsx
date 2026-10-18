"use client";

import { useState } from "react";
import { JournalGridCard } from "@/components/journal/JournalGridCard";
import { JournalFeaturedCard } from "@/components/journal/JournalFeaturedCard";
import type { JournalPost } from "@/lib/types";

interface JournalCatalogueProps {
  posts: JournalPost[];
}

/**
 * Category pills are derived from the real `posts` data — no fixed
 * taxonomy exists in the schema. Sort control from the pre-redesign
 * version was dropped — the approved Figma reference only shows a
 * category filter here; posts are already ordered by publish date via
 * journal-data.ts's query. Featured spotlight only renders when a real
 * post has featured=true.
 */
export function JournalCatalogue({ posts }: JournalCatalogueProps) {
  const [category, setCategory] = useState("All");

  const categories = Array.from(new Set(posts.map((p) => p.category).filter((c): c is string => Boolean(c))));

  const featured = category === "All" ? posts.find((p) => p.featured) : undefined;
  const filtered = posts
    .filter((p) => !featured || p.id !== featured.id)
    .filter((p) => category === "All" || p.category === category);

  return (
    <>
      {featured && (
        <div className="bg-ink-900">
          <div className="max-w-[1440px] mx-auto px-6 py-12">
            <JournalFeaturedCard post={featured} />
          </div>
        </div>
      )}

      <div className="bg-paper-100">
        <div className="max-w-[1440px] mx-auto px-6">
          {categories.length > 0 && (
            <div className="py-8 border-b border-paper-300/60 flex items-center gap-2 overflow-x-auto shelf-scroll">
              {["All", ...categories].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`font-outfit shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    category === cat
                      ? "bg-ink-900 text-paper-50 shadow-md"
                      : "bg-paper-200 text-ink-600 hover:bg-paper-300 border border-paper-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="py-12">
            {filtered.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-display italic text-ink-600 text-xl mb-1">
                  {posts.length === 0 ? "The studio journal is coming soon" : "No articles in this category"}
                </p>
                <p className="font-outfit text-ink-400 text-sm">
                  {posts.length === 0
                    ? "Check back for updates on Nexonic's projects and process."
                    : "Try a different category."}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((post) => (
                  <JournalGridCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
