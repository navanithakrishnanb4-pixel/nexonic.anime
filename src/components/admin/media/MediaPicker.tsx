"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { MediaAsset } from "@/lib/media-data";

interface MediaPickerProps {
  /** Full Media Library, fetched server-side and passed down as a prop —
   *  this component never fetches on its own (keeps it usable from any
   *  Server Component page without a client-side data seam). */
  media: MediaAsset[];
  /** Currently selected media_assets.id, or null for "none". */
  value: string | null;
  onChange: (id: string | null) => void;
  /** Hidden form field name this picker's value is submitted under. */
  name: string;
  label: string;
  hint?: string;
}

/**
 * Single reusable "browse existing media / select / cancel / confirm"
 * picker, per the brief's explicit instruction not to build a bespoke
 * upload/asset UI inside every form. Selection is submitted as a plain
 * hidden <input>, so it works with the existing Server Action + FormData
 * pattern every other field in these forms already uses — no client
 * state needs to reach the server any other way.
 *
 * Does not upload — uploading only happens on /admin/media. If the
 * asset an admin wants isn't in the library yet, they go upload it
 * there first. Keeping upload and selection separate avoids duplicating
 * MediaUploadForm's validation/Storage logic in every entity form.
 */
export function MediaPicker({ media, value, onChange, name, label, hint }: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const selected = media.find((m) => m.id === value) ?? null;

  return (
    <div className="flex flex-col gap-xs">
      <span className="font-outfit text-sm font-medium text-paper-100">{label}</span>
      <input type="hidden" name={name} value={value ?? ""} />

      <div className="flex items-center gap-sm">
        <div className="relative w-20 aspect-video flex-shrink-0 rounded-md overflow-hidden bg-ink-800 border border-white/10">
          {selected ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selected.url}
              alt={selected.altText || selected.fileName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon name="image" className="text-paper-500 opacity-50" size={18} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-xs min-w-0">
          <span className="font-outfit text-xs text-paper-500 truncate max-w-[16rem]">
            {selected ? selected.fileName : "No media selected"}
          </span>
          <div className="flex items-center gap-sm">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-sm text-neon-violet-soft hover:underline"
            >
              {selected ? "Change" : "Choose from Library"}
            </button>
            {selected && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="text-sm text-paper-500 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {hint && <span className="font-outfit text-xs text-paper-500">{hint}</span>}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Select media for ${label}`}
          className="fixed inset-0 z-[70] bg-ink-900/95 backdrop-blur-md flex flex-col p-margin-mobile md:p-lg"
        >
          <div className="flex items-center justify-between mb-md">
            <h2 className="font-display text-xl font-semibold text-paper-100">
              Select media — {label}
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
              {media.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => {
                    onChange(asset.id);
                    setOpen(false);
                  }}
                  className={`flex flex-col gap-xs rounded-lg border overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-violet ${
                    asset.id === value
                      ? "border-neon-violet ring-1 ring-neon-violet"
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
                    {asset.fileName}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="pt-md flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-paper-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
