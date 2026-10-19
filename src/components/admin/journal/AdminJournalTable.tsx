"use client";

import Link from "next/link";
import { useState } from "react";
import { EditIcon, EyeIcon, TrashIcon } from "@/components/admin/ui/AdminIcons";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { FilterChips, SearchBox } from "@/components/admin/ui/AdminToolbar";
import { AdminStatusBadge } from "@/components/admin/ui/AdminStatusBadge";
import { useDeleteConfirm } from "@/components/admin/ui/useDeleteConfirm";
import { deleteJournalPostAction } from "@/lib/journal-actions";
import type { JournalPost } from "@/lib/types";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const COLS = "grid-cols-[4.5rem_1fr_7rem_7rem_6.5rem_6rem_6rem]";

/**
 * Figma admin Journal layout: category chips + search over a table with
 * Cover / Title / Category / Author / Date / Actions. Added a Status
 * column (draft/published/archived), which the Figma reference lacked
 * but the real content model needs. Categories come from the actual
 * posts, not a fixed list.
 */
export function AdminJournalTable({ posts }: { posts: JournalPost[] }) {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const del = useDeleteConfirm<JournalPost>(deleteJournalPostAction);

  const categories = Array.from(new Set(posts.map((p) => p.category).filter((c): c is string => Boolean(c))));
  const chipOptions = [{ label: "All", value: "all" }, ...categories.map((c) => ({ label: c, value: c }))];

  const filtered = posts
    .filter((p) => category === "all" || p.category === category)
    .filter((p) => !search || p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <SearchBox value={search} onChange={setSearch} placeholder="Search posts…" />
        {categories.length > 0 && (
          <FilterChips
            options={chipOptions}
            value={category}
            onChange={setCategory}
            activeClass="bg-neon-pink/15 text-neon-pink border border-neon-pink/25"
          />
        )}
      </div>

      <div className="admin-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className={`grid ${COLS} items-center gap-4 px-5 py-3 border-b border-white/5 font-outfit text-paper-500 text-[11px] font-semibold tracking-wide uppercase`}>
              <span>Cover</span>
              <span>Title</span>
              <span>Category</span>
              <span>Author</span>
              <span>Date</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-white/5">
              {filtered.map((post) => (
                <div key={post.id} className={`grid ${COLS} items-center gap-4 px-5 py-3.5 hover:bg-white/[0.03] transition-colors`}>
                  <div className="w-[4.5rem] aspect-video rounded-lg overflow-hidden bg-ink-700">
                    {post.coverImageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.coverImageUrl} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-outfit text-paper-100 text-sm font-medium line-clamp-1">
                      {post.title}
                      {post.featured && <span className="ml-2 text-[10px] text-neon-pink">Featured</span>}
                    </p>
                    <p className="font-outfit text-paper-500 text-xs mt-0.5 line-clamp-1">{post.excerpt || "No excerpt"}</p>
                  </div>
                  <span className="font-outfit text-paper-400 text-xs line-clamp-1">{post.category ?? "—"}</span>
                  <span className="font-outfit text-paper-400 text-xs line-clamp-1">{post.authorName ?? "—"}</span>
                  <span className="font-outfit text-paper-400 text-xs whitespace-nowrap">{formatDate(post.publishedAt)}</span>
                  <AdminStatusBadge status={post.status} />
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/journal/${post.slug}`}
                      title="View"
                      aria-label={`View ${post.title}`}
                      className="p-1.5 text-paper-500 hover:text-neon-cyan rounded-lg hover:bg-neon-cyan/10 transition-all"
                    >
                      <EyeIcon />
                    </Link>
                    <Link
                      href={`/admin/journal/${post.id}`}
                      title="Edit"
                      aria-label={`Edit ${post.title}`}
                      className="p-1.5 text-paper-500 hover:text-neon-violet-soft rounded-lg hover:bg-neon-violet/10 transition-all"
                    >
                      <EditIcon />
                    </Link>
                    <button
                      type="button"
                      title="Delete"
                      aria-label={`Delete ${post.title}`}
                      onClick={() => del.ask(post)}
                      className="p-1.5 text-paper-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="py-12 text-center font-outfit text-paper-500 text-sm">
                  {posts.length === 0 ? "No journal posts yet. Write the first one." : "No posts match your filters."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={del.target !== null}
        title="Delete post?"
        message={`This permanently removes "${del.target?.title ?? ""}" and cannot be undone.`}
        pending={del.pending}
        error={del.error}
        onCancel={del.cancel}
        onConfirm={del.confirm}
      />
    </>
  );
}
