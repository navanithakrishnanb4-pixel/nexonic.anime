"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { deleteMediaAction, updateMediaMetadataAction, type MediaActionState } from "@/lib/media-actions";
import type { MediaAsset } from "@/lib/media-data";

interface MediaItemCardProps {
  asset: MediaAsset;
}

const initialState: MediaActionState = { error: null };

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-sm text-neon-violet-soft hover:underline disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

export function MediaItemCard({ asset }: MediaItemCardProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const boundUpdate = updateMediaMetadataAction.bind(null, asset.id);
  const [updateState, updateFormAction] = useFormState(boundUpdate, initialState);

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${asset.fileName}"? This removes both the file and its record and cannot be undone.`
    );
    if (!confirmed) return;

    startDeleteTransition(async () => {
      const result = await deleteMediaAction(asset.id);
      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-sm rounded-lg border border-white/10 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset.url}
        alt={asset.altText || asset.fileName}
        className="w-full aspect-square object-cover bg-ink-800"
      />

      <div className="flex flex-col gap-xs px-sm pb-sm">
        <span className="font-outfit text-sm text-paper-100 truncate" title={asset.fileName}>
          {asset.fileName}
        </span>
        <span className="font-outfit text-xs text-paper-500 uppercase">
          {asset.category}
          {asset.width && asset.height ? ` · ${asset.width}×${asset.height}` : ""}
        </span>

        {editing ? (
          <form action={updateFormAction} className="flex flex-col gap-xs mt-xs">
            <input
              name="altText"
              defaultValue={asset.altText ?? ""}
              placeholder="Alt text"
              className="rounded-md border border-white/10 bg-ink-900 px-xs py-xs text-sm text-paper-100"
            />
            <input
              name="caption"
              defaultValue={asset.caption ?? ""}
              placeholder="Caption"
              className="rounded-md border border-white/10 bg-ink-900 px-xs py-xs text-sm text-paper-100"
            />
            {updateState.error && <p className="text-xs text-red-300">{updateState.error}</p>}
            <div className="flex gap-sm items-center">
              <SaveButton />
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-sm text-paper-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between pt-xs">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-sm text-paper-500 hover:underline"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-sm text-red-300 hover:underline disabled:opacity-50"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        )}
        {deleteError && <p className="text-xs text-red-300">{deleteError}</p>}
      </div>
    </div>
  );
}
