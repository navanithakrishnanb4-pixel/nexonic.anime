"use client";

import Link from "next/link";
import { useState } from "react";
import { EyeIcon, EditIcon, TrashIcon } from "@/components/admin/ui/AdminIcons";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { FilterChips, SearchBox } from "@/components/admin/ui/AdminToolbar";
import { AdminStatusBadge } from "@/components/admin/ui/AdminStatusBadge";
import { useDeleteConfirm } from "@/components/admin/ui/useDeleteConfirm";
import { deleteWorkAction } from "@/lib/works-actions";
import type { Work } from "@/lib/types";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "In Development", value: "in_development" },
  { label: "Coming Soon", value: "coming_soon" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Completed", value: "completed" },
  { label: "Archived", value: "archived" },
];

/**
 * Figma admin Works layout: search + status chips over a table with
 * Art / Title / Status / Year / Actions and a delete-confirmation
 * modal. Everything is real — rows are the Work[] from Supabase, delete
 * calls the existing deleteWorkAction. The Figma "Updated" column shows
 * Year here, since the Work contract has no updated-at field.
 */
export function AdminWorksTable({ works }: { works: Work[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const del = useDeleteConfirm<Work>(deleteWorkAction);

  const filtered = works
    .filter((w) => !search || w.title.toLowerCase().includes(search.toLowerCase()))
    .filter((w) => status === "all" || w.status === status);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <SearchBox value={search} onChange={setSearch} placeholder="Search works…" />
        <FilterChips options={STATUS_FILTERS} value={status} onChange={setStatus} />
      </div>

      <div className="admin-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto] sm:grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-5 py-3 border-b border-white/5 font-outfit text-paper-500 text-[11px] font-semibold tracking-wide uppercase">
          <span>Art</span>
          <span>Title</span>
          <span>Status</span>
          <span className="hidden sm:block">Year</span>
          <span>Actions</span>
        </div>

        <div className="divide-y divide-white/5">
          {filtered.map((work) => (
            <div
              key={work.id}
              className="grid grid-cols-[auto_1fr_auto_auto] sm:grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors"
            >
              <div className="w-9 h-12 rounded-lg overflow-hidden bg-ink-700 shrink-0">
                {work.coverImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={work.coverImageUrl} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-outfit text-paper-100 text-sm font-medium line-clamp-1">
                  {work.title}
                  {work.featured && <span className="ml-2 text-[10px] text-neon-violet-soft">Featured</span>}
                </p>
                <p className="font-outfit text-paper-500 text-xs mt-0.5 line-clamp-1">
                  {[work.category, ...work.genres].filter(Boolean).join(" · ") || "—"}
                </p>
              </div>
              <AdminStatusBadge status={work.status} />
              <span className="hidden sm:block font-outfit text-paper-500 text-xs whitespace-nowrap">{work.year ?? "—"}</span>
              <div className="flex items-center gap-1">
                <Link
                  href={`/works/${work.slug}`}
                  title="View"
                  aria-label={`View ${work.title}`}
                  className="p-1.5 text-paper-500 hover:text-neon-cyan rounded-lg hover:bg-neon-cyan/10 transition-all"
                >
                  <EyeIcon />
                </Link>
                <Link
                  href={`/admin/works/${work.id}`}
                  title="Edit"
                  aria-label={`Edit ${work.title}`}
                  className="p-1.5 text-paper-500 hover:text-neon-violet-soft rounded-lg hover:bg-neon-violet/10 transition-all"
                >
                  <EditIcon />
                </Link>
                <button
                  type="button"
                  title="Delete"
                  aria-label={`Delete ${work.title}`}
                  onClick={() => del.ask(work)}
                  className="p-1.5 text-paper-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-12 text-center font-outfit text-paper-500 text-sm">
              {works.length === 0 ? "No works yet. Create the first one to get started." : "No works match your filters."}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={del.target !== null}
        title="Delete work?"
        message={`This permanently removes "${del.target?.title ?? ""}" from the database and cannot be undone.`}
        pending={del.pending}
        error={del.error}
        onCancel={del.cancel}
        onConfirm={del.confirm}
      />
    </>
  );
}
