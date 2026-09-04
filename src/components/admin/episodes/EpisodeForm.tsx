"use client";

import { FormField, TextInput, TextArea, Select } from "@/components/admin/form/FormField";
import { NotPersistedNotice } from "@/components/admin/NotPersistedNotice";
import { Button } from "@/components/ui/Button";

/**
 * The series/work selector is a Select with no options because there
 * are zero Works to choose from — that's correct, not broken. Once
 * works exist, this form pulls from getAllWorks() to populate it; the
 * form structure itself doesn't need to change.
 */
export function EpisodeForm() {
  return (
    <form className="flex flex-col gap-lg max-w-2xl" onSubmit={(e) => e.preventDefault()}>
      <NotPersistedNotice />

      <FormField label="Series" htmlFor="workId" hint="No works exist yet — create one first">
        <Select id="workId" name="workId" disabled>
          <option value="">No works available</option>
        </Select>
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        <FormField label="Season number" htmlFor="seasonNumber">
          <TextInput id="seasonNumber" name="seasonNumber" type="number" min={1} defaultValue={1} />
        </FormField>
        <FormField label="Episode number" htmlFor="episodeNumber">
          <TextInput id="episodeNumber" name="episodeNumber" type="number" min={1} />
        </FormField>
      </div>

      <FormField label="Title" htmlFor="title">
        <TextInput id="title" name="title" required />
      </FormField>

      <FormField label="Description" htmlFor="description">
        <TextArea id="description" name="description" rows={4} />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        <FormField label="Thumbnail URL" htmlFor="thumbnailUrl">
          <TextInput id="thumbnailUrl" name="thumbnailUrl" />
        </FormField>
        <FormField label="Video URL" htmlFor="videoUrl">
          <TextInput id="videoUrl" name="videoUrl" />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
        <FormField label="Duration (seconds)" htmlFor="durationSeconds">
          <TextInput id="durationSeconds" name="durationSeconds" type="number" />
        </FormField>
        <FormField label="Release date" htmlFor="releaseDate">
          <TextInput id="releaseDate" name="releaseDate" type="date" />
        </FormField>
        <FormField label="Status" htmlFor="status">
          <Select id="status" name="status" defaultValue="draft">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
        </FormField>
      </div>

      <div className="flex gap-sm pt-sm border-t border-surface-container">
        <Button type="submit" variant="primary" disabled>
          Save Draft
        </Button>
        <Button type="button" variant="secondary" disabled>
          Publish
        </Button>
      </div>
    </form>
  );
}
