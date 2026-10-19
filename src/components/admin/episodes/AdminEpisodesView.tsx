"use client";

import Link from "next/link";
import { useState } from "react";
import { EditIcon, TrashIcon } from "@/components/admin/ui/AdminIcons";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { SearchBox } from "@/components/admin/ui/AdminToolbar";
import { AdminStatusBadge } from "@/components/admin/ui/AdminStatusBadge";
import { useDeleteConfirm } from "@/components/admin/ui/useDeleteConfirm";
import { deleteEpisodeAction } from "@/lib/episodes-actions";
import type { Episode, Work } from "@/lib/types";

function formatDuration(seconds: number | null): string {
  return seconds ? `${Math.round(seconds / 60)}m` : "—";
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const COLS = "grid-cols-[3.5rem_5rem_1fr_4rem_6.5rem_6.5rem_4.5rem]";

/**
 * Figma admin Episodes layout: a series selector, a series overview card
 * and an episode table. Omitted from the reference: its "Planned"
 * episode-count (no such field in the schema) — the overview shows the
 * real number of episodes instead. No "view" action: there is no
 * per-episode public page to link to.
 */
export function AdminEpisodesView({ episodes, works }: { episodes: Episode[]; works: Work[] }) {
  const [workId, setWorkId] = useState("all");
  const [search, setSearch] = useState("");
  const del = useDeleteConfirm<Episode>(deleteEpisodeAction);

  const seriesWithEpisodes = works.filter((w) => episodes.some((e) => e.workId === w.id));
  const selectedWork = workId === "all" ? null : works.find((w) => w.id === workId) ?? null;

  const filtered = episodes
    .filter((e) => workId === "all" || e.workId === workId)
    .filter((e) => !search || e.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <select
          value={workId}
          onChange={(e) => setWorkId(e.target.value)}
          aria-label="Series"
          className="font-outfit bg-ink-800 border border-white/10 text-paper-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-neon-violet/40 cursor-pointer min-w-[220px]"
        >
          <option value="all">All series</option>
          {seriesWithEpisodes.map((w) => (
            <option key={w.id} value={w.id}>
              {w.title}
            </option>
          ))}
        </select>
        <SearchBox value={search} onChange={setSearch} placeholder="Search episodes…" />
      </div>

      {selectedWork && (
        <div className="admin-card rounded-2xl border border-white/5 p-5 mb-6 flex items-center gap-4">
          <div className="w-12 h-16 rounded-lg overflow-hidden bg-ink-700 shrink-0">
            {selectedWork.coverImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selectedWork.coverImageUrl} alt="" className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display text-paper-50 font-semibold">{selectedWork.title}</p>
            <p className="font-outfit text-paper-500 text-xs mt-0.5">
              {[selectedWork.category, ...selectedWork.genres, selectedWork.year].filter(Boolean).join(" · ")}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-display text-neon-cyan text-2xl font-light">{filtered.length}</p>
            <p className="font-outfit text-paper-500 text-xs">episodes</p>
          </div>
        </div>
      )}

      <div className="admin-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div className={`grid ${COLS} items-center gap-4 px-5 py-3 border-b border-white/5 font-outfit text-paper-500 text-[11px] font-semibold tracking-wide uppercase`}>
              <span>EP</span>
              <span />
              <span>Title</span>
              <span>Time</span>
              <span>Released</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-white/5">
              {filtered.map((ep) => (
                <div key={ep.id} className={`grid ${COLS} items-center gap-4 px-5 py-3.5 hover:bg-white/[0.03] transition-colors`}>
                  <span className="font-outfit text-paper-400 text-xs font-semibold whitespace-nowrap">
                    S{ep.seasonNumber}·E{ep.episodeNumber}
                  </span>
                  <div className="w-20 aspect-video rounded-lg overflow-hidden bg-ink-700">
                    {ep.thumbnailUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ep.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-outfit text-paper-100 text-sm font-medium line-clamp-1">{ep.title}</p>
                    <p className="font-outfit text-paper-500 text-xs mt-0.5 line-clamp-1">
                      {workId === "all" && ep.workTitle ? `${ep.workTitle} — ` : ""}
                      {ep.description || "No description"}
                    </p>
                  </div>
                  <span className="font-outfit text-paper-400 text-xs">{formatDuration(ep.durationSeconds)}</span>
                  <span className="font-outfit text-paper-400 text-xs whitespace-nowrap">{formatDate(ep.releaseDate)}</span>
                  <AdminStatusBadge status={ep.status} />
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/episodes/${ep.id}`}
                      title="Edit"
                      aria-label={`Edit ${ep.title}`}
                      className="p-1.5 text-paper-500 hover:text-neon-violet-soft rounded-lg hover:bg-neon-violet/10 transition-all"
                    >
                      <EditIcon />
                    </Link>
                    <button
                      type="button"
                      title="Delete"
                      aria-label={`Delete ${ep.title}`}
                      onClick={() => del.ask(ep)}
                      className="p-1.5 text-paper-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="py-12 text-center font-outfit text-paper-500 text-sm">
                  {episodes.length === 0
                    ? works.length === 0
                      ? "No episodes yet. Episodes belong to a Work — create a Work first."
                      : "No episodes yet. Create the first one."
                    : "No episodes match your filters."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={del.target !== null}
        title="Delete episode?"
        message={`This permanently removes "${del.target?.title ?? ""}" and cannot be undone.`}
        pending={del.pending}
        error={del.error}
        onCancel={del.cancel}
        onConfirm={del.confirm}
      />
    </>
  );
}
