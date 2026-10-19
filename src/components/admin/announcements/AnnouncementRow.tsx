"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnnouncementForm } from "@/components/admin/announcements/AnnouncementForm";
import { EditIcon, TrashIcon } from "@/components/admin/ui/AdminIcons";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { useDeleteConfirm } from "@/components/admin/ui/useDeleteConfirm";
import {
  deleteAnnouncementAction,
  setAnnouncementVisibleAction,
  updateAnnouncementAction,
} from "@/lib/announcements-actions";
import type { Announcement } from "@/lib/announcements-data";

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/** Real state, computed from the real fields and the current time. */
function getState(a: Announcement): { label: string; classes: string } {
  const now = Date.now();
  if (!a.visible) return { label: "Hidden", classes: "bg-paper-500/10 text-paper-400 border-paper-500/20" };
  if (a.startsAt && new Date(a.startsAt).getTime() > now)
    return { label: "Scheduled", classes: "bg-neon-violet/12 text-neon-violet-soft border-neon-violet/20" };
  if (a.endsAt && new Date(a.endsAt).getTime() < now)
    return { label: "Expired", classes: "bg-paper-500/10 text-paper-500 border-paper-500/15" };
  return { label: "Live", classes: "bg-emerald-500/12 text-emerald-400 border-emerald-500/20" };
}

/**
 * Figma announcement card: message, status badge, on/off switch, edit
 * and delete. Status (Live / Scheduled / Expired / Hidden) is derived
 * from the real visible/starts/ends fields — computed, never stored.
 * The switch calls a real Server Action.
 */
export function AnnouncementRow({ announcement }: { announcement: Announcement }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);
  const [togglePending, startToggle] = useTransition();
  const del = useDeleteConfirm<Announcement>(deleteAnnouncementAction);
  const boundUpdate = updateAnnouncementAction.bind(null, announcement.id);

  const state = getState(announcement);
  const starts = formatDate(announcement.startsAt);
  const ends = formatDate(announcement.endsAt);

  function toggle() {
    startToggle(async () => {
      const result = await setAnnouncementVisibleAction(announcement.id, !announcement.visible);
      if (result.error) {
        setToggleError(result.error);
        return;
      }
      setToggleError(null);
      router.refresh();
    });
  }

  if (editing) {
    return (
      <div className="admin-card rounded-2xl border border-white/10 p-5">
        <AnnouncementForm
          announcement={announcement}
          action={boundUpdate}
          submitLabel="Save Changes"
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className={`admin-card rounded-2xl border p-5 transition-all ${announcement.visible ? "border-white/10" : "border-white/5 opacity-70"}`}>
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`font-outfit px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${state.classes}`}>
              {state.label}
            </span>
          </div>
          <p className="font-outfit text-paper-100 text-sm leading-relaxed">{announcement.message}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 font-outfit text-xs text-paper-500">
            {announcement.linkUrl && (
              <span>
                Link: {announcement.linkLabel ? `${announcement.linkLabel} → ` : ""}
                <span className="text-paper-400">{announcement.linkUrl}</span>
              </span>
            )}
            {starts && <span>Starts {starts}</span>}
            {ends && <span>Ends {ends}</span>}
          </div>
          {toggleError && (
            <p role="alert" className="font-outfit text-xs text-red-300 mt-2">
              {toggleError}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            role="switch"
            aria-checked={announcement.visible}
            aria-label={announcement.visible ? "Hide announcement" : "Show announcement"}
            disabled={togglePending}
            onClick={toggle}
            className={`relative w-10 h-[22px] rounded-full transition-colors mr-2 disabled:opacity-50 ${announcement.visible ? "bg-neon-violet" : "bg-ink-600"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-white transition-transform ${announcement.visible ? "translate-x-[18px]" : ""}`}
            />
          </button>
          <button
            type="button"
            title="Edit"
            aria-label="Edit announcement"
            onClick={() => setEditing(true)}
            className="p-1.5 text-paper-500 hover:text-neon-violet-soft rounded-lg hover:bg-neon-violet/10 transition-all"
          >
            <EditIcon />
          </button>
          <button
            type="button"
            title="Delete"
            aria-label="Delete announcement"
            onClick={() => del.ask(announcement)}
            className="p-1.5 text-paper-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <ConfirmModal
        open={del.target !== null}
        title="Delete announcement?"
        message="This permanently removes the announcement and cannot be undone."
        pending={del.pending}
        error={del.error}
        onCancel={del.cancel}
        onConfirm={del.confirm}
      />
    </div>
  );
}
