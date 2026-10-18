"use client";

import type { Work, WorkStatus } from "@/lib/types";

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

const STATUS_OPTIONS: { label: string; value: WorkStatus | "all" }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Coming Soon", value: "coming_soon" },
  { label: "In Development", value: "in_development" },
  { label: "Completed", value: "completed" },
];

const SORT_OPTIONS = [
  { label: "Newest", value: "latest" },
  { label: "A–Z", value: "az" },
];

interface WorksFilterBarProps {
  works: Work[];
  search: string;
  onSearchChange: (v: string) => void;
  genre: string;
  onGenreChange: (v: string) => void;
  status: WorkStatus | "all";
  onStatusChange: (v: WorkStatus | "all") => void;
  sort: string;
  onSortChange: (v: string) => void;
}

/**
 * Genre pills are derived from the actual `works` data (unique genres
 * across whatever's really published), not a hardcoded taxonomy list
 * — the Figma prototype's GENRES array was fixed because its data was
 * fictional and fully known in advance; our real Works don't have a
 * fixed genre set, so hardcoding one here risks pills that don't match
 * any real content, or missing genres real works actually use.
 *
 * No "Top Rated" sort option — that depended on the Figma prototype's
 * `score` field, which has no equivalent in the real schema.
 */
export function WorksFilterBar({
  works,
  search,
  onSearchChange,
  genre,
  onGenreChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
}: WorksFilterBarProps) {
  const genres = Array.from(new Set(works.flatMap((w) => w.genres))).sort();

  return (
    <div className="sticky top-16 z-30 bg-paper-50/95 backdrop-blur-xl border-b border-paper-300/70 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search works…"
              className="font-outfit bg-paper-100 border border-paper-300 text-ink-800 text-xs rounded-xl py-2 pl-8 pr-3 w-44 outline-none focus:border-neon-violet/50 focus:ring-2 focus:ring-neon-violet/10 placeholder:text-ink-400 transition-all"
            />
          </div>

          {genres.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto shelf-scroll pb-0.5">
              <button
                type="button"
                onClick={() => onGenreChange("All")}
                className={`font-outfit shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  genre === "All"
                    ? "bg-ink-900 text-paper-50 shadow-sm"
                    : "bg-paper-200 text-ink-600 hover:bg-paper-300 border border-paper-300/60"
                }`}
              >
                All
              </button>
              {genres.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => onGenreChange(g)}
                  className={`font-outfit shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    genre === g
                      ? "bg-ink-900 text-paper-50 shadow-sm"
                      : "bg-paper-200 text-ink-600 hover:bg-paper-300 border border-paper-300/60"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto shrink-0">
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value as WorkStatus | "all")}
              className="font-outfit bg-paper-100 border border-paper-300 text-ink-700 text-xs rounded-xl px-3 py-1.5 outline-none focus:border-neon-violet/40 cursor-pointer"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="font-outfit bg-paper-100 border border-paper-300 text-ink-700 text-xs rounded-xl px-3 py-1.5 outline-none focus:border-neon-violet/40 cursor-pointer"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
