"use client";

import { useState } from "react";
import { WorksFilterBar } from "@/components/catalogue/WorksFilterBar";
import { WorksGridCard } from "@/components/works/WorksGridCard";
import type { Work, WorkStatus } from "@/lib/types";

interface WorksCatalogueProps {
  works: Work[];
}

function SearchOffIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-400">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

/**
 * `works` is fetched server-side in app/(site)/works/page.tsx and
 * passed in as a plain prop, same as before the redesign — only the
 * presentation changed. Filtering/search/sort are real, run against
 * the real array; with zero Works published this just means an empty
 * result set, not fake behavior.
 */
export function WorksCatalogue({ works }: WorksCatalogueProps) {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [status, setStatus] = useState<WorkStatus | "all">("all");
  const [sort, setSort] = useState("latest");

  const filtered = works
    .filter((w) => genre === "All" || w.genres.includes(genre))
    .filter((w) => status === "all" || w.status === status)
    .filter((w) => !search || w.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title);
      return (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
    });

  return (
    <>
      <WorksFilterBar
        works={works}
        search={search}
        onSearchChange={setSearch}
        genre={genre}
        onGenreChange={setGenre}
        status={status}
        onStatusChange={setStatus}
        sort={sort}
        onSortChange={setSort}
      />

      <div className="max-w-[1440px] mx-auto px-6 py-12">
        {filtered.length === 0 ? (
          <div className="py-28 text-center">
            <div className="w-16 h-16 rounded-2xl bg-paper-200 border border-paper-300 flex items-center justify-center mx-auto mb-5">
              <SearchOffIcon />
            </div>
            <p className="font-display italic text-ink-600 text-xl mb-1">
              {works.length === 0 ? "No series published yet" : "No series found"}
            </p>
            <p className="font-outfit text-ink-400 text-sm">
              {works.length === 0
                ? "Nexonic's first projects are currently in development."
                : "Try adjusting your filters."}
            </p>
          </div>
        ) : (
          <>
            <p className="font-outfit text-ink-400 text-xs mb-7">
              {filtered.length} {filtered.length === 1 ? "series" : "series"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-5 gap-y-8">
              {filtered.map((work) => (
                <WorksGridCard key={work.id} work={work} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
