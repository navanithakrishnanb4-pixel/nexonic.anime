"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { AnnouncementForm } from "@/components/admin/announcements/AnnouncementForm";
import {
  deleteAnnouncementAction,
  updateAnnouncementAction,
} from "@/lib/announcements-actions";
import type { Announcement } from "@/lib/announcements-data";

interface AnnouncementRowProps {
  announcement: Announcement;
}

/**
 * Inline expand-to-edit, same idea as MediaItemCard's rename affordance
 * — there's no /admin/announcements/[id] route (the final route audit
 * doesn't call for one), so edit happens in place on this one page.
 */
export function AnnouncementRow({ announcement }: AnnouncementRowProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const boundUpdate = updateAnnouncementAction.bind(null, announcement.id);

  function handleDelete() {
    const confirmed = window.confirm(
      "Delete this announcement? This permanently removes it and cannot be undone."
    );
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteAnnouncementAction(announcement.id);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  if (editing) {
    return (
      <div className="border border-white/10 rounded-xl p-md">
        <AnnouncementForm
          announcement={announcement}
          action={boundUpdate}
          submitLabel="Save Changes"
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  const now = Date.now();
  const isScheduledFuture = announcement.startsAt && new Date(announcement.startsAt).getTime() > now;
  const isExpired = announcement.endsAt && new Date(announcement.endsAt).getTime() < now;

  let statusLabel = announcement.visible ? "Visible" : "Hidden";
  if (announcement.visible && isScheduledFuture) statusLabel = "Scheduled";
  if (announcement.visible && isExpired) statusLabel = "Expired";

  return (
    <div className="flex items-center justify-between gap-md px-md py-sm border border-white/10 rounded-xl">
      <div className="flex-1 min-w-0 flex flex-col gap-xs">
        <span className="font-outfit text-sm text-paper-100 truncate">
          {announcement.message}
        </span>
        <span className="font-outfit text-xs text-paper-500 uppercase flex items-center gap-xs">
          {statusLabel}
          {announcement.linkUrl && (
            <>
              <Icon name="link" size={12} />
              {announcement.linkLabel || announcement.linkUrl}
            </>
          )}
        </span>
        {error && <span className="text-xs text-red-300">{error}</span>}
      </div>
      <div className="flex items-center gap-md flex-shrink-0">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-sm text-neon-violet-soft hover:underline"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="text-sm text-red-300 hover:underline disabled:opacity-50"
        >
          {isPending ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
