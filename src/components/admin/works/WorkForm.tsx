"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import type { Work, WorkStatus } from "@/lib/types";
import type { WorkFormState } from "@/lib/works-actions";
import { MediaPicker } from "@/components/admin/media/MediaPicker";
import { GalleryPicker, type GalleryItem } from "@/components/admin/media/GalleryPicker";
import type { MediaAsset } from "@/lib/media-data";

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
};

function FormField({ label, htmlFor, hint, children }: FormFieldProps) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-1.5">
      <span className="font-outfit text-sm font-medium text-paper-200">{label}</span>
      {children}
      {hint ? <span className="font-outfit text-xs text-paper-500">{hint}</span> : null}
    </label>
  );
}

const fieldClasses =
  "font-outfit w-full rounded-xl border border-white/10 bg-ink-800 px-3.5 py-2.5 text-sm text-paper-100 placeholder:text-paper-500 outline-none focus:border-neon-violet/40 transition-colors";

function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={fieldClasses} />;
}

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={fieldClasses} />;
}

function Select(props: SelectHTMLAttributes<HTMLSelectElement> & { children?: ReactNode }) {
  return <select {...props} className={fieldClasses} />;
}

const STATUS_OPTIONS: WorkStatus[] = [
  "draft",
  "in_development",
  "coming_soon",
  "ongoing",
  "completed",
  "archived",
];

const CATEGORY_OPTIONS = ["series", "film", "short", "experimental"];

interface WorkFormProps {
  /** Undefined for /admin/works/new. */
  work?: Partial<Work>;
  /** createWorkAction, or updateWorkAction bound to the work's id. */
  action: (prevState: WorkFormState, formData: FormData) => Promise<WorkFormState>;
  media: MediaAsset[];
}

const initialState: WorkFormState = { error: null };

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="font-outfit rounded-full bg-gradient-to-r from-neon-violet to-neon-pink-deep px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Saving…" : isEdit ? "Save Changes" : "Create Work"}
    </button>
  );
}

/**
 * Shared by /admin/works/new and /admin/works/[id]. Same field set and
 * visual design as the earlier scaffolding version — only the
 * submission behavior changed, from a `disabled` button with
 * `onSubmit={preventDefault}` to a real Server Action wired through
 * `useFormState` (React 18 / Next 14's supported hook; not
 * `useActionState`, which is React 19 only and out of scope — no
 * dependency upgrades this step).
 *
 * Cover/hero/gallery media are now wired to the Media Library
 * (MediaPicker/GalleryPicker), now that step 18's media system exists.
 */
export function WorkForm({ work, action, media }: WorkFormProps) {
  const isEdit = Boolean(work);
  const [state, formAction] = useFormState(action, initialState);
  const [coverMediaId, setCoverMediaId] = useState<string | null>(work?.coverMediaId ?? null);
  const [heroMediaId, setHeroMediaId] = useState<string | null>(work?.heroMediaId ?? null);
  const [gallery, setGallery] = useState<GalleryItem[]>(
    (work?.gallery ?? [])
      .filter((g): g is typeof g & { mediaId: string } => Boolean(g.mediaId))
      .map((g, i) => ({ mediaId: g.mediaId, position: g.position ?? i }))
  );

  return (
    <form action={formAction} className="flex flex-col gap-lg max-w-2xl">
      {state.error && (
        <div
          role="alert"
          className="font-outfit rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm text-red-300"
        >
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        <FormField label="Title" htmlFor="title">
          <TextInput id="title" name="title" defaultValue={work?.title} required />
        </FormField>
        <FormField label="Slug" htmlFor="slug" hint="Used in the URL, e.g. /works/your-slug">
          <TextInput id="slug" name="slug" defaultValue={work?.slug} required />
        </FormField>
      </div>

      <FormField label="Short description" htmlFor="shortDescription" hint="Shown on cards and previews">
        <TextInput
          id="shortDescription"
          name="shortDescription"
          defaultValue={work?.shortDescription ?? ""}
        />
      </FormField>

      <FormField label="Description" htmlFor="description">
        <TextArea id="description" name="description" rows={5} defaultValue={work?.description ?? ""} />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
        <FormField label="Category" htmlFor="category">
          <Select id="category" name="category" defaultValue={work?.category ?? ""}>
            <option value="">Select…</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Year" htmlFor="year">
          <TextInput id="year" name="year" type="number" defaultValue={work?.year ?? undefined} />
        </FormField>
        <FormField label="Status" htmlFor="status">
          <Select id="status" name="status" defaultValue={work?.status ?? "draft"}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField label="Trailer URL" htmlFor="trailerUrl" hint="Optional. External video URL (e.g. YouTube).">
        <TextInput id="trailerUrl" name="trailerUrl" defaultValue={work?.trailerUrl ?? ""} />
      </FormField>

      <FormField label="Genres" htmlFor="genres" hint="Comma-separated">
        <TextInput id="genres" name="genres" defaultValue={work?.genres?.join(", ") ?? ""} />
      </FormField>

      <label className="flex items-center gap-2.5 font-outfit text-sm text-paper-200">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={work?.featured}
          className="w-4 h-4 accent-neon-violet"
        />
        Feature on homepage
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        <MediaPicker
          name="coverMediaId"
          label="Cover image"
          value={coverMediaId}
          onChange={setCoverMediaId}
          media={media}
        />
        <MediaPicker
          name="heroMediaId"
          label="Hero image"
          value={heroMediaId}
          onChange={setHeroMediaId}
          media={media}
        />
      </div>

      <GalleryPicker
        name="gallery"
        label="Gallery"
        value={gallery}
        onChange={setGallery}
        media={media}
      />

      <div className="flex gap-3 pt-4 border-t border-white/5">
        <SubmitButton isEdit={isEdit} />
      </div>
    </form>
  );
}
