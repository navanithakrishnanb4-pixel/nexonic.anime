"use client";

import { FormField, TextInput, TextArea, Select } from "@/components/admin/form/FormField";
import { NotPersistedNotice } from "@/components/admin/NotPersistedNotice";
import { Button } from "@/components/ui/Button";

/**
 * Content is a plain textarea, not a rich-text editor — per the brief,
 * a complex editor dependency isn't justified yet. The public article
 * page (JournalArticleBody) already renders plain text split into
 * paragraphs, so this form's output format matches what the reader
 * expects with no extra parsing layer needed.
 */
export function JournalForm() {
  return (
    <form className="flex flex-col gap-lg max-w-2xl" onSubmit={(e) => e.preventDefault()}>
      <NotPersistedNotice />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        <FormField label="Title" htmlFor="title">
          <TextInput id="title" name="title" required />
        </FormField>
        <FormField label="Slug" htmlFor="slug" hint="Used in the URL, e.g. /journal/your-slug">
          <TextInput id="slug" name="slug" required />
        </FormField>
      </div>

      <FormField label="Excerpt" htmlFor="excerpt" hint="Shown on cards and previews">
        <TextInput id="excerpt" name="excerpt" />
      </FormField>

      <FormField label="Cover image URL" htmlFor="coverImageUrl">
        <TextInput id="coverImageUrl" name="coverImageUrl" />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        <FormField label="Category" htmlFor="category">
          <TextInput id="category" name="category" placeholder="e.g. Production" />
        </FormField>
        <FormField label="Author" htmlFor="authorName">
          <TextInput id="authorName" name="authorName" />
        </FormField>
      </div>

      <FormField label="Content" htmlFor="content" hint="Plain text. Paragraphs are separated by a blank line.">
        <TextArea id="content" name="content" rows={10} />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md items-end">
        <FormField label="Status" htmlFor="status">
          <Select id="status" name="status" defaultValue="draft">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Select>
        </FormField>
        <label className="flex items-center gap-sm font-body-md text-body-md text-on-surface pb-sm">
          <input type="checkbox" name="featured" className="w-4 h-4 accent-primary" />
          Feature on homepage
        </label>
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
