"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { EditIcon, TrashIcon } from "@/components/admin/ui/AdminIcons";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { useDeleteConfirm } from "@/components/admin/ui/useDeleteConfirm";
import { deleteMediaAction, updateMediaMetadataAction, type MediaActionState } from "@/lib/media-actions";
import type { MediaAsset } from "@/lib/media-data";

const initialState: MediaActionState = { error: null };

function formatSize(bytes: number | null): string | null {
  if (!bytes) return null;
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="font-outfit text-xs font-semibold text-neon-violet-soft hover:underline disabled:opacity-50">
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

/**
 * Media tile in the Figma admin style (square preview, filename, real
 * metadata, edit/delete). Edit changes alt text and caption through the
 * existing updateMediaMetadataAction; delete goes through the shared
 * ConfirmModal and the existing deleteMediaAction, which removes both
 * the database row and the Storage object.
 */
export function MediaItemCard({ asset }: { asset: MediaAsset }) {
  const [editing, setEditing] = useState(false);
  const del = useDeleteConfirm<MediaAsset>(deleteMediaAction);
  const boundUpdate = updateMediaMetadataAction.bind(null, asset.id);
  const [updateState, updateFormAction] = useFormState(boundUpdate, initialState);

  const meta = [
    asset.category,
    asset.width && asset.height ? `${asset.width}×${asset.height}` : null,
    formatSize(asset.fileSize),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="admin-card rounded-2xl border border-white/5 overflow-hidden flex flex-col">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset.url} alt={asset.altText || asset.fileName} className="w-full aspect-square object-cover bg-ink-700" />

      <div className="flex flex-col gap-1 p-3">
        <span className="font-outfit text-sm text-paper-100 truncate" title={asset.fileName}>
          {asset.fileName}
        </span>
        <span className="font-outfit text-[11px] text-paper-500 uppercase tracking-wide">{meta}</span>

        {editing ? (
          <form action={updateFormAction} className="flex flex-col gap-2 mt-2">
            <input
              name="altText"
              defaultValue={asset.altText ?? ""}
              placeholder="Alt text"
              className="font-outfit bg-ink-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-paper-100 outline-none focus:border-neon-violet/40"
            />
            <input
              name="caption"
              defaultValue={asset.caption ?? ""}
              placeholder="Caption"
              className="font-outfit bg-ink-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-paper-100 outline-none focus:border-neon-violet/40"
            />
            {updateState.error && <p className="font-outfit text-xs text-red-300">{updateState.error}</p>}
            <div className="flex gap-3 items-center">
              <SaveButton />
              <button type="button" onClick={() => setEditing(false)} className="font-outfit text-xs text-paper-500 hover:underline">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-1 pt-1 -ml-1.5">
            <button
              type="button"
              title="Edit alt text and caption"
              aria-label={`Edit details for ${asset.fileName}`}
              onClick={() => setEditing(true)}
              className="p-1.5 text-paper-500 hover:text-neon-violet-soft rounded-lg hover:bg-neon-violet/10 transition-all"
            >
              <EditIcon />
            </button>
            <button
              type="button"
              title="Delete"
              aria-label={`Delete ${asset.fileName}`}
              onClick={() => del.ask(asset)}
              className="p-1.5 text-paper-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
            >
              <TrashIcon />
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        open={del.target !== null}
        title="Delete media?"
        message={`This removes both the file and its record for "${asset.fileName}" and cannot be undone. If a work, post or episode still uses it, deletion will be blocked.`}
        pending={del.pending}
        error={del.error}
        onCancel={del.cancel}
        onConfirm={del.confirm}
      />
    </div>
  );
}
