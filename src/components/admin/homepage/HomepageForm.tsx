"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { FormField, TextInput, TextArea } from "@/components/admin/form/FormField";
import { MediaPicker } from "@/components/admin/media/MediaPicker";
import type { HomepageConfig } from "@/lib/homepage-data";
import type { HomepageFormState } from "@/lib/homepage-actions";
import type { MediaAsset } from "@/lib/media-data";
import type { Work, JournalPost } from "@/lib/types";

interface HomepageFormProps {
  config: HomepageConfig;
  action: (prevState: HomepageFormState, formData: FormData) => Promise<HomepageFormState>;
  media: MediaAsset[];
  works: Pick<Work, "id" | "title">[];
  journalPosts: Pick<JournalPost, "id" | "title">[];
}

const initialState: HomepageFormState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-neon-violet px-md py-sm font-outfit text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save Changes"}
    </button>
  );
}

/**
 * Owns the Server Action submission (useFormState), so this is the
 * Client Component boundary — not the page. AdminHomepagePage (Server
 * Component) fetches config/media/works/journalPosts and passes them
 * in as plain serializable props.
 *
 * Deliberately NOT a page-builder: one hero block, one featured-work
 * slot, one featured-journal slot, each with a visibility toggle.
 * Matches the brief's "keep homepage configuration intentionally
 * simple" instruction — no reorderable section list, no per-section
 * layout options beyond what already existed as static UI.
 */
export function HomepageForm({ config, action, media, works, journalPosts }: HomepageFormProps) {
  const [state, formAction] = useFormState(action, initialState);
  const [heroMediaId, setHeroMediaId] = useState<string | null>(config.heroMediaId);

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

      <div>
        <h2 className="font-display text-xl font-semibold text-paper-100 mb-sm">Hero</h2>
        <div className="flex flex-col gap-md">
          <label className="flex items-center gap-sm font-outfit text-sm text-paper-100">
            <input
              type="checkbox"
              name="heroVisible"
              defaultChecked={config.heroVisible}
              className="w-4 h-4 accent-neon-violet"
            />
            Show hero section
          </label>

          <FormField label="Eyebrow" htmlFor="eyebrow">
            <TextInput id="eyebrow" name="eyebrow" defaultValue={config.heroEyebrow ?? ""} />
          </FormField>
          <FormField label="Title" htmlFor="heroTitle">
            <TextInput id="heroTitle" name="heroTitle" defaultValue={config.heroTitle} required />
          </FormField>
          <FormField label="Description" htmlFor="heroDescription">
            <TextArea
              id="heroDescription"
              name="heroDescription"
              rows={3}
              defaultValue={config.heroDescription}
              required
            />
          </FormField>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <FormField label="Primary CTA label" htmlFor="ctaLabel">
              <TextInput id="ctaLabel" name="ctaLabel" defaultValue={config.heroCtaLabel ?? ""} />
            </FormField>
            <FormField label="Primary CTA link" htmlFor="ctaHref">
              <TextInput id="ctaHref" name="ctaHref" defaultValue={config.heroCtaHref ?? ""} />
            </FormField>
            <FormField label="Secondary CTA label" htmlFor="secondaryCtaLabel">
              <TextInput
                id="secondaryCtaLabel"
                name="secondaryCtaLabel"
                defaultValue={config.heroSecondaryCtaLabel ?? ""}
              />
            </FormField>
            <FormField label="Secondary CTA link" htmlFor="secondaryCtaHref">
              <TextInput
                id="secondaryCtaHref"
                name="secondaryCtaHref"
                defaultValue={config.heroSecondaryCtaHref ?? ""}
              />
            </FormField>
          </div>

          <MediaPicker
            name="heroMediaId"
            label="Hero image"
            value={heroMediaId}
            onChange={setHeroMediaId}
            media={media}
            hint="Leave empty to preserve the existing intentional no-image state."
          />

          <FormField
            label="Image position"
            htmlFor="heroImagePosition"
            hint="CSS object-position value, e.g. center, top, 30% 70%"
          >
            <TextInput
              id="heroImagePosition"
              name="heroImagePosition"
              defaultValue={config.heroImagePosition}
            />
          </FormField>
        </div>
      </div>

      <div className="border-t border-white/10 pt-md">
        <h2 className="font-display text-xl font-semibold text-paper-100 mb-sm">Featured Work</h2>
        <div className="flex flex-col gap-md">
          <label className="flex items-center gap-sm font-outfit text-sm text-paper-100">
            <input
              type="checkbox"
              name="featuredWorkVisible"
              defaultChecked={config.featuredWorkVisible}
              className="w-4 h-4 accent-neon-violet"
            />
            Show on homepage
          </label>
          <FormField
            label="Work"
            htmlFor="featuredWorkId"
            hint={works.length === 0 ? "No works exist yet" : undefined}
          >
            <select
              id="featuredWorkId"
              name="featuredWorkId"
              defaultValue={config.featuredWorkId ?? ""}
              disabled={works.length === 0}
              className="w-full bg-ink-800 border border-white/10 rounded-lg px-sm py-sm font-outfit text-sm text-paper-100"
            >
              <option value="">None</option>
              {works.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.title}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </div>

      <div className="border-t border-white/10 pt-md">
        <h2 className="font-display text-xl font-semibold text-paper-100 mb-sm">
          Featured Journal Post
        </h2>
        <div className="flex flex-col gap-md">
          <label className="flex items-center gap-sm font-outfit text-sm text-paper-100">
            <input
              type="checkbox"
              name="featuredJournalVisible"
              defaultChecked={config.featuredJournalVisible}
              className="w-4 h-4 accent-neon-violet"
            />
            Show on homepage
          </label>
          <FormField
            label="Journal post"
            htmlFor="featuredJournalId"
            hint={journalPosts.length === 0 ? "No journal posts exist yet" : undefined}
          >
            <select
              id="featuredJournalId"
              name="featuredJournalId"
              defaultValue={config.featuredJournalId ?? ""}
              disabled={journalPosts.length === 0}
              className="w-full bg-ink-800 border border-white/10 rounded-lg px-sm py-sm font-outfit text-sm text-paper-100"
            >
              <option value="">None</option>
              {journalPosts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </div>

      <div className="flex gap-sm pt-sm border-t border-white/10">
        <SubmitButton />
      </div>
    </form>
  );
}
