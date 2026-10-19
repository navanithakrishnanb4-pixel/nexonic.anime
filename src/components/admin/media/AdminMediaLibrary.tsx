"use client";

import { useState } from "react";
import { FilterChips, SearchBox } from "@/components/admin/ui/AdminToolbar";
import { MediaItemCard } from "@/components/admin/media/MediaItemCard";
import type { MediaAsset } from "@/lib/media-data";

/**
 * Figma media-library grid with search and category chips. Categories
 * come from the real upload folders. Omitted from the Figma reference:
 * its grid/list toggle, and its fabricated file sizes — sizes shown
 * here are the real stored values.
 */
export function AdminMediaLibrary({ media }: { media: MediaAsset[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = Array.from(new Set(media.map((m) => m.category)));
  const chips = [{ label: "All", value: "all" }, ...categories.map((c) => ({ label: c, value: c }))];

  const filtered = media
    .filter((m) => category === "all" || m.category === category)
    .filter((m) => !search || m.fileName.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <SearchBox value={search} onChange={setSearch} placeholder="Search files…" />
        {categories.length > 0 && (
          <FilterChips
            options={chips}
            value={category}
            onChange={setCategory}
            activeClass="bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/25"
          />
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card rounded-2xl border border-white/5 py-14 text-center font-outfit text-paper-500 text-sm">
          {media.length === 0 ? "No media assets uploaded yet." : "No files match your filters."}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((asset) => (
            <MediaItemCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
    </>
  );
}
