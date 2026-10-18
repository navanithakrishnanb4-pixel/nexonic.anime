"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HomeWorkCard } from "@/components/works/HomeWorkCard";
import { searchContentAction } from "@/lib/search-actions";
import type { SearchResults } from "@/lib/search-data";

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

/**
 * Same search mechanics as before the redesign: submit-driven, reads/
 * writes ?q=, calls the searchContentAction Server Action (search-
 * data.ts is server-only now that it touches Supabase). Only the
 * presentation changed.
 *
 * Omitted from the Figma reference: the "Browse by Genre" suggestion
 * chips (a hardcoded list of 8 genres — there's no fixed taxonomy in
 * the real schema, so those chips would point at content that may not
 * exist) and article "read time" (no such field).
 */
export function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [inputValue, setInputValue] = useState(initialQuery);
  const [results, setResults] = useState<SearchResults>({ works: [], journalPosts: [] });
  const [activeTab, setActiveTab] = useState<"series" | "articles">("series");
  const [isPending, startTransition] = useTransition();
  const hasQuery = initialQuery.trim().length > 0;

  useEffect(() => {
    let cancelled = false;
    searchContentAction(initialQuery).then((r) => {
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

  return (
    <div className="min-h-screen bg-ink-900">
      <div className="bg-ink-950 border-b border-white/5 py-12">
        <div className="max-w-[1440px] mx-auto px-6">
          <h1 className="font-display italic text-paper-50 text-5xl font-light mb-8">Search</h1>
          <form onSubmit={handleSubmit} role="search" className="relative max-w-xl">
            <label htmlFor="search-input" className="sr-only">
              Search NEXONIC
            </label>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-paper-500 pointer-events-none">
              <SearchIcon />
            </div>
            <input
              id="search-input"
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search works and journal posts…"
              className="font-outfit w-full bg-ink-800 border border-white/10 text-paper-100 text-base rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-neon-violet/50 focus:ring-2 focus:ring-neon-violet/10 placeholder:text-paper-500 transition-all"
            />
          </form>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-10" aria-live="polite">
        {!hasQuery ? (
          <div className="py-20 text-center">
            <p className="font-display italic text-paper-400 text-2xl mb-2">Search Nexonic</p>
            <p className="font-outfit text-paper-500 text-sm">
              Find works and journal posts once they&apos;re published.
            </p>
          </div>
        ) : isPending ? null : (
          <>
            <div className="flex items-center gap-1 border-b border-white/10 mb-8">
              {(["series", "articles"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`font-outfit relative px-4 py-3 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab ? "text-paper-50" : "text-paper-400 hover:text-paper-200"
                  }`}
                >
                  {tab} ({tab === "series" ? results.works.length : results.journalPosts.length})
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-neon-violet to-neon-pink rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {activeTab === "series" &&
              (results.works.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="font-display italic text-paper-400 text-2xl mb-2">No series found</p>
                  <p className="font-outfit text-paper-500 text-sm">
                    Nothing published matches &ldquo;{initialQuery}&rdquo; yet. Browse{" "}
                    <Link href="/works" className="text-neon-violet-soft">
                      all works
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-5">
                  {results.works.map((work) => (
                    <HomeWorkCard key={work.id} work={work} />
                  ))}
                </div>
              ))}

            {activeTab === "articles" &&
              (results.journalPosts.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="font-display italic text-paper-400 text-2xl mb-2">No articles found</p>
                  <p className="font-outfit text-paper-500 text-sm">
                    Nothing published matches &ldquo;{initialQuery}&rdquo; yet. Browse the{" "}
                    <Link href="/journal" className="text-neon-violet-soft">
                      journal
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-w-2xl">
                  {results.journalPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/journal/${post.slug}`}
                      className="group flex gap-5 p-5 rounded-2xl bg-ink-800/40 border border-white/5 hover:bg-ink-800 hover:border-white/10 transition-all"
                    >
                      <div className="relative w-24 aspect-video shrink-0 rounded-xl overflow-hidden bg-ink-700">
                        {post.coverImageUrl && (
                          <Image src={post.coverImageUrl} alt={post.title} fill sizes="96px" className="object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {post.category && (
                          <span className="font-outfit text-[10px] font-bold tracking-wide uppercase text-paper-500">
                            {post.category}
                          </span>
                        )}
                        <h3 className="font-display font-semibold text-paper-100 text-sm leading-snug line-clamp-2 group-hover:text-neon-violet-soft transition-colors mt-1">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="font-outfit text-paper-500 text-xs mt-1.5 line-clamp-1">{post.excerpt}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
}
