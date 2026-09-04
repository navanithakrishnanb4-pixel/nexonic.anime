"use client";

import { FormField, TextInput, TextArea, Select } from "@/components/admin/form/FormField";
import { NotPersistedNotice } from "@/components/admin/NotPersistedNotice";
import { Button } from "@/components/ui/Button";
import type { Work, WorkStatus } from "@/lib/types";

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
  /** Undefined for /admin/works/new. Populated for edit, once real data exists. */
  work?: Work;
}

/**
 * Shared by /admin/works/new and /admin/works/[id]. Fields are wired
 * to `defaultValue`/`defaultChecked` from `work` so an edit form pre-
 * fills correctly once real data exists — but this is an uncontrolled
 * form (no onChange/useState) since there is nothing to submit to yet.
 * Wiring real submission is Supabase-phase work, not this step's.
 */
export function WorkForm({ work }: WorkFormProps) {
  const isEdit = Boolean(work);

  return (
    <form
      className="flex flex-col gap-lg max-w-2xl"
      onSubmit={(e) => e.preventDefault()}
    >
      <NotPersistedNotice />

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
          defaultValue={work?.shortDescription}
        />
      </FormField>

      <FormField label="Description" htmlFor="description">
        <TextArea id="description" name="description" rows={5} defaultValue={work?.description} />
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
                {s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ")}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        <FormField label="Cover image URL" htmlFor="coverImageUrl" hint="Media Library integration comes later">
          <TextInput id="coverImageUrl" name="coverImageUrl" defaultValue={work?.coverImageUrl ?? ""} />
        </FormField>
        <FormField label="Hero image URL" htmlFor="heroImageUrl">
          <TextInput id="heroImageUrl" name="heroImageUrl" defaultValue={work?.heroImageUrl ?? ""} />
        </FormField>
      </div>

      <FormField label="Trailer URL" htmlFor="trailerUrl" hint="Optional. External video URL (e.g. YouTube).">
        <TextInput id="trailerUrl" name="trailerUrl" defaultValue={work?.trailerUrl ?? ""} />
      </FormField>

      <FormField label="Genres" htmlFor="genres" hint="Comma-separated">
        <TextInput id="genres" name="genres" defaultValue={work?.genres.join(", ")} />
      </FormField>

      <label className="flex items-center gap-sm font-body-md text-body-md text-on-surface">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={work?.featured}
          className="w-4 h-4 accent-primary"
        />
        Feature on homepage
      </label>

      <div className="flex gap-sm pt-sm border-t border-surface-container">
        <Button type="submit" variant="primary" disabled>
          {isEdit ? "Save Changes" : "Save Draft"}
        </Button>
        <Button type="button" variant="secondary" disabled>
          Publish
        </Button>
      </div>
    </form>
  );
}
