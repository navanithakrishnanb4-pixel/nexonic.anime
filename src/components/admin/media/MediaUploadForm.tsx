"use client";

import { useState, type ChangeEvent } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { uploadMediaAction, type MediaActionState } from "@/lib/media-actions";

const CATEGORIES = [
  { label: "Works", value: "works" },
  { label: "Episodes", value: "episodes" },
  { label: "Journal", value: "journal" },
  { label: "Homepage", value: "homepage" },
  { label: "Studio", value: "studio" },
];

const ACCEPTED = "image/jpeg,image/png,image/webp,image/gif,image/avif";

const initialState: MediaActionState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="font-outfit text-sm font-medium text-white bg-neon-violet rounded-full px-md py-xs disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Uploading…" : "Upload"}
    </button>
  );
}

/**
 * Reads the image's natural width/height in the browser (plain
 * `Image()` + `URL.createObjectURL`, no dependency) and passes them as
 * hidden fields — this is the "practical, no extra image-processing
 * dependency" path called out in the brief. If this ever fails for a
 * given file (corrupt image, unusual format), width/height are simply
 * left null; upload still proceeds.
 */
function readImageDimensions(file: File): Promise<{ width: number | null; height: number | null }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ width: null, height: null });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export function MediaUploadForm() {
  const [state, formAction] = useFormState(uploadMediaAction, initialState);
  const [dimensions, setDimensions] = useState<{ width: number | null; height: number | null }>({
    width: null,
    height: null,
  });
  const [fileError, setFileError] = useState<string | null>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setFileError(null);
    if (!file) return;

    if (!ACCEPTED.split(",").includes(file.type)) {
      setFileError("Unsupported file type. Choose a JPEG, PNG, WebP, GIF, or AVIF image.");
      e.target.value = "";
      return;
    }

    const dims = await readImageDimensions(file);
    setDimensions(dims);
  }

  return (
    <form action={formAction} className="border border-dashed border-white/10 rounded-xl p-lg flex flex-col gap-md">
      <div className="flex flex-col gap-sm">
        <label htmlFor="file" className="font-outfit text-sm text-paper-100">
          Image file
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept={ACCEPTED}
          required
          onChange={handleFileChange}
          className="font-outfit text-sm text-paper-500 file:mr-sm file:rounded-full file:border-0 file:bg-ink-700 file:px-sm file:py-xs file:text-paper-100"
        />
        {fileError && <p className="text-sm text-red-300">{fileError}</p>}
      </div>

      <input type="hidden" name="width" value={dimensions.width ?? ""} />
      <input type="hidden" name="height" value={dimensions.height ?? ""} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
        <label className="flex flex-col gap-xs">
          <span className="font-outfit text-sm text-paper-100">Category</span>
          <select
            name="category"
            defaultValue="studio"
            className="rounded-md border border-white/10 bg-ink-900 px-sm py-xs text-sm text-paper-100"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-xs sm:col-span-1">
          <span className="font-outfit text-sm text-paper-100">Alt text</span>
          <input
            name="altText"
            type="text"
            className="rounded-md border border-white/10 bg-ink-900 px-sm py-xs text-sm text-paper-100"
          />
        </label>
        <label className="flex flex-col gap-xs">
          <span className="font-outfit text-sm text-paper-100">Caption</span>
          <input
            name="caption"
            type="text"
            className="rounded-md border border-white/10 bg-ink-900 px-sm py-xs text-sm text-paper-100"
          />
        </label>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-300">
          {state.error}
        </p>
      )}

      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
