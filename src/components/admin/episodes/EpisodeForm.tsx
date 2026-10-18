"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { FormField, TextInput, TextArea, Select } from "@/components/admin/form/FormField";
import { MediaPicker } from "@/components/admin/media/MediaPicker";
import type { Episode, Work } from "@/lib/types";
import type { EpisodeFormState } from "@/lib/episodes-actions";
import type { MediaAsset } from "@/lib/media-data";

interface EpisodeFormProps {
  episode?: Partial<Episode>;
  action: (prevState: EpisodeFormState, formData: FormData) => Promise<EpisodeFormState>;
  works: Pick<Work, "id" | "title">[];
  media: MediaAsset[];
}

const initialState: EpisodeFormState = { error: null };

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-neon-violet px-md py-sm font-outfit text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Saving…" : isEdit ? "Save Changes" : "Create Episode"}
    </button>
  );
}

export function EpisodeForm({ episode, action, works, media }: EpisodeFormProps) {
  const isEdit = Boolean(episode);
  const [state, formAction] = useFormState(action, initialState);
  const [thumbnailMediaId, setThumbnailMediaId] = useState<string | null>(
    episode?.thumbnailMediaId ?? null
  );

  return (
    <form action={formAction} className="flex flex-col gap-lg max-w-2xl">
      {state.error && (
        <div
          role="alert"
          className="rounded-md border border-red-400/30 bg-red-400/10 px-md py-sm text-sm text-red-300"
        >
          {state.error}
        </div>
      )}

      <FormField
        label="Series"
        htmlFor="workId"
        hint={works.length === 0 ? "No works exist yet — create one first" : undefined}
      >
        <Select
          id="workId"
          name="workId"
          defaultValue={episode?.workId ?? ""}
          disabled={works.length === 0}
          required
        >
          <option value="">{works.length === 0 ? "No works available" : "Select a series…"}</option>
          {works.map((w) => (
            <option key={w.id} value={w.id}>
              {w.title}
            </option>
          ))}
        </Select>
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        <FormField label="Season number" htmlFor="seasonNumber">
          <TextInput
            id="seasonNumber"
            name="seasonNumber"
            type="number"
            min={1}
            defaultValue={episode?.seasonNumber ?? 1}
          />
        </FormField>
        <FormField label="Episode number" htmlFor="episodeNumber">
          <TextInput
            id="episodeNumber"
            name="episodeNumber"
            type="number"
            min={1}
            defaultValue={episode?.episodeNumber ?? undefined}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        <FormField label="Title" htmlFor="title">
          <TextInput id="title" name="title" defaultValue={episode?.title} required />
        </FormField>
        <FormField label="Slug" htmlFor="slug" hint="Lowercase, hyphenated">
          <TextInput id="slug" name="slug" defaultValue={episode?.slug} required />
        </FormField>
      </div>

      <FormField label="Description" htmlFor="description">
        <TextArea id="description" name="description" rows={4} defaultValue={episode?.description ?? ""} />
      </FormField>

      <MediaPicker
        name="thumbnailMediaId"
        label="Thumbnail"
        value={thumbnailMediaId}
        onChange={setThumbnailMediaId}
        media={media}
      />

      <FormField
        label="Video URL"
        htmlFor="videoUrl"
        hint="External video URL (e.g. YouTube). Video hosting is not part of this system."
      >
        <TextInput id="videoUrl" name="videoUrl" defaultValue={episode?.videoUrl ?? ""} />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
        <FormField label="Duration (seconds)" htmlFor="durationSeconds">
          <TextInput
            id="durationSeconds"
            name="durationSeconds"
            type="number"
            defaultValue={episode?.durationSeconds ?? undefined}
          />
        </FormField>
        <FormField label="Release date" htmlFor="releaseDate">
          <TextInput
            id="releaseDate"
            name="releaseDate"
            type="date"
            defaultValue={episode?.releaseDate ?? ""}
          />
        </FormField>
        <FormField label="Status" htmlFor="status">
          <Select id="status" name="status" defaultValue={episode?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Select>
        </FormField>
      </div>

      <div className="flex gap-sm pt-sm border-t border-white/10">
        <SubmitButton isEdit={isEdit} />
      </div>
    </form>
  );
}
