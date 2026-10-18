"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { FormField, TextInput, TextArea, Select } from "@/components/admin/form/FormField";
import { MediaPicker } from "@/components/admin/media/MediaPicker";
import type { JournalPost } from "@/lib/types";
import type { JournalFormState } from "@/lib/journal-actions";
import type { MediaAsset } from "@/lib/media-data";

interface JournalFormProps {
  /** Undefined for /admin/journal/new. */
  post?: Partial<JournalPost>;
  action: (prevState: JournalFormState, formData: FormData) => Promise<JournalFormState>;
  media: MediaAsset[];
}

const initialState: JournalFormState = { error: null };

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-neon-violet px-md py-sm font-outfit text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Saving…" : isEdit ? "Save Changes" : "Create Post"}
    </button>
  );
}

/**
 * Content is a plain textarea, not a rich-text editor — no editor
 * dependency is justified yet, and JournalArticleBody already renders
 * plain text split into paragraphs, so this form's output matches what
 * the reader expects with no extra parsing layer.
 */
export function JournalForm({ post, action, media }: JournalFormProps) {
  const isEdit = Boolean(post);
  const [state, formAction] = useFormState(action, initialState);
  const [coverMediaId, setCoverMediaId] = useState<string | null>(post?.coverMediaId ?? null);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        <FormField label="Title" htmlFor="title">
          <TextInput id="title" name="title" defaultValue={post?.title} required />
        </FormField>
        <FormField label="Slug" htmlFor="slug" hint="Used in the URL, e.g. /journal/your-slug">
          <TextInput id="slug" name="slug" defaultValue={post?.slug} required />
        </FormField>
      </div>

      <FormField label="Excerpt" htmlFor="excerpt" hint="Shown on cards and previews">
        <TextInput id="excerpt" name="excerpt" defaultValue={post?.excerpt ?? ""} />
      </FormField>

      <MediaPicker
        name="coverMediaId"
        label="Cover image"
        value={coverMediaId}
        onChange={setCoverMediaId}
        media={media}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        <FormField label="Category" htmlFor="category">
          <TextInput
            id="category"
            name="category"
            placeholder="e.g. Production"
            defaultValue={post?.category ?? ""}
          />
        </FormField>
        <FormField label="Author" htmlFor="authorName">
          <TextInput id="authorName" name="authorName" defaultValue={post?.authorName ?? ""} />
        </FormField>
      </div>

      <FormField label="Content" htmlFor="content" hint="Plain text. Paragraphs are separated by a blank line.">
        <TextArea id="content" name="content" rows={10} defaultValue={post?.content ?? ""} />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md items-end">
        <FormField label="Status" htmlFor="status">
          <Select id="status" name="status" defaultValue={post?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Select>
        </FormField>
        <label className="flex items-center gap-sm font-outfit text-sm text-paper-100 pb-sm">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={post?.featured}
            className="w-4 h-4 accent-neon-violet"
          />
          Feature on homepage
        </label>
      </div>

      <div className="flex gap-sm pt-sm border-t border-white/10">
        <SubmitButton isEdit={isEdit} />
      </div>
    </form>
  );
}
