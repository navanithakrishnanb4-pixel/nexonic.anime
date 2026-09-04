"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import { WorkCard } from "@/components/cards/WorkCard";
import { JournalCard } from "@/components/cards/JournalCard";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { searchContent, type SearchResults } from "@/lib/search-data";

/**
 * Client component so it can read/write the `?q=` query param and
 * re-run search on submit without a full page reload. The search
 * itself (lib/search-data.ts) is a plain async function, so this
 * component doesn't care whether it's backed by an in-memory filter
 * (now) or a Supabase query (later).
 */
export function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [inputValue, setInputValue] = useState(initialQuery);
  const [results, setResults] = useState<SearchResults>({ works: [], journalPosts: [] });
  const [isPending, startTransition] = useTransition();
  const hasQuery = initialQuery.trim().length > 0;

  useEffect(() => {
    let cancelled = false;
    searchContent(initialQuery).then((r) => {
      if (!cancelled) setResults(r);
    });
    return () => {
      cancelled = true;
    };
  }, [initialQuery]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    startTransition(() => {
      router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
    });
  }

  const totalResults = results.works.length + results.journalPosts.length;

  return (
    <div className="flex flex-col gap-lg">
      <form onSubmit={handleSubmit} role="search" className="flex items-center gap-sm max-w-xl">
        <label htmlFor="search-input" className="sr-only">
          Search NEXONIC
        </label>
        <div className="flex-grow flex items-center gap-sm bg-surface-container-low border border-outline-variant rounded-full px-md py-sm focus-within:border-primary transition-colors">
          <Icon name="search" className="text-on-surface-variant" size={20} />
          <input
            id="search-input"
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search works and journal posts…"
            className="flex-grow bg-transparent outline-none font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant"
          />
        </div>
        <button
          type="submit"
          className="font-label-md text-label-md text-on-primary bg-primary rounded-full px-md py-sm hover:bg-primary-fixed-dim transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Search
        </button>
      </form>

      <div aria-live="polite">
        {!hasQuery ? (
          <EmptyState icon="search" message="Search for works and journal posts once they're published." />
        ) : isPending ? null : totalResults === 0 ? (
          <EmptyState
            icon="search_off"
            message={`No results for "${initialQuery}". Nothing has been published matching that search yet.`}
          />
        ) : (
          <div className="flex flex-col gap-lg">
            {results.works.length > 0 && (
              <ScrollReveal className="flex flex-col gap-md">
                <h2 className="font-headline-md text-headline-md text-on-surface">Works</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-md">
                  {results.works.map((work) => (
                    <WorkCard key={work.id} work={work} />
                  ))}
                </div>
              </ScrollReveal>
            )}
            {results.journalPosts.length > 0 && (
              <ScrollReveal className="flex flex-col gap-md">
                <h2 className="font-headline-md text-headline-md text-on-surface">Journal</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
                  {results.journalPosts.map((post) => (
                    <JournalCard key={post.id} post={post} />
                  ))}
                </div>
              </ScrollReveal>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
