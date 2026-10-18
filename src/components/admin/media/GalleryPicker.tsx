"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { MediaAsset } from "@/lib/media-data";

export interface GalleryItem {
  mediaId: string;
  position: number;
}

interface GalleryPickerProps {
  media: MediaAsset[];
  value: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
  name: string;
  label: string;
  hint?: string;
}

function assetFor(media: MediaAsset[], id: string) {
  return media.find((m) => m.id === id) ?? null;
}

/**
 * Ordered multi-select on top of the same Media Library data as
 * MediaPicker — kept as a separate component rather than a "multiple"
 * mode on MediaPicker because the interaction (add one at a time,
 * reorder, remove) is genuinely different from single-select swap.
 * Mirrors work_gallery_media's (media_id, position) shape directly:
 * `value` IS that join table's row set, position is just array index
 * on save. Submitted as a single hidden JSON field — works-actions.ts
 * parses it and replaces the work's work_gallery_media rows wholesale.
 */
export function GalleryPicker({ media, value, onChange, name, label, hint }: GalleryPickerProps) {
  const [open, setOpen] = useState(false);
  const sorted = [...value].sort((a, b) => a.position - b.position);

  function addMedia(mediaId: string) {
    if (value.some((v) => v.mediaId === mediaId)) return;
    onChange([...value, { mediaId, position: value.length }]);
    setOpen(false);
  }

  function remove(mediaId: string) {
    const next = value
      .filter((v) => v.mediaId !== mediaId)
      .sort((a, b) => a.position - b.position)
      .map((v, i) => ({ ...v, position: i }));
    onChange(next);
  }

  function move(mediaId: string, direction: -1 | 1) {
    const items = [...sorted];
    const index = items.findIndex((v) => v.mediaId === mediaId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= items.length) return;
    const current = items[index];
    const swapped = items[target];
    if (!current || !swapped) return;
    items[index] = swapped;
    items[target] = current;
    onChange(items.map((v, i) => ({ mediaId: v.mediaId, position: i })));
  }

  return (
    <div className="flex flex-col gap-xs">
      <span className="font-outfit text-sm font-medium text-paper-100">{label}</span>
      <input type="hidden" name={name} value={JSON.stringify(sorted)} />

      {sorted.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-sm">
          {sorted.map((item, i) => {
            const asset = assetFor(media, item.mediaId);
            return (
              <div
                key={item.mediaId}
                className="relative rounded-lg overflow-hidden border border-white/10 aspect-video bg-ink-800 group"
              >
                {asset ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.url}
                    alt={asset.altText || asset.fileName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon name="broken_image" className="text-paper-500" size={18} />
                  </div>
                )}
                <div className="absolute inset-0 bg-ink-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-xs">
                  <button
                    type="button"
                    aria-label="Move earlier"
                    disabled={i === 0}
                    onClick={() => move(item.mediaId, -1)}
                    className="p-1 rounded-full bg-ink-700 disabled:opacity-30"
                  >
                    <Icon name="arrow_back" size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label="Remove"
                    onClick={() => remove(item.mediaId)}
                    className="p-1 rounded-full bg-red-400/20 text-red-300"
                  >
                    <Icon name="delete" size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label="Move later"
                    disabled={i === sorted.length - 1}
                    onClick={() => move(item.mediaId, 1)}
                    className="p-1 rounded-full bg-ink-700 disabled:opacity-30"
                  >
                    <Icon name="arrow_forward" size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="self-start text-sm text-neon-violet-soft hover:underline"
      >
        + Add gallery image
      </button>
      {hint && <span className="font-outfit text-xs text-paper-500">{hint}</span>}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Add media to ${label}`}
          className="fixed inset-0 z-[70] bg-ink-900/95 backdrop-blur-md flex flex-col p-margin-mobile md:p-lg"
        >
          <div className="flex items-center justify-between mb-md">
            <h2 className="font-display text-xl font-semibold text-paper-100">
              Add to {label}
            </h2>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="p-2 rounded-full text-paper-500 hover:text-paper-100 hover:bg-ink-800"
            >
              <Icon name="close" />
            </button>
          </div>

          {media.length === 0 ? (
            <p className="font-outfit text-sm text-paper-500">
              The Media Library is empty. Upload an image on the Media page first.
            </p>
          ) : (
            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-md content-start">
              {media.map((asset) => {
                const alreadyAdded = value.some((v) => v.mediaId === asset.id);
                return (
                  <button
                    key={asset.id}
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() => addMedia(asset.id)}
                    className={`flex flex-col gap-xs rounded-lg border overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-violet ${
                      alreadyAdded
                        ? "border-white/10 opacity-40 cursor-not-allowed"
                        : "border-white/10 hover:border-white/10"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.url}
                      alt={asset.altText || asset.fileName}
                      className="w-full aspect-square object-cover bg-ink-800"
                    />
                    <span className="font-outfit text-xs text-paper-500 truncate px-xs pb-xs">
                      {alreadyAdded ? "Already added" : asset.fileName}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="pt-md flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-paper-500 hover:underline"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
