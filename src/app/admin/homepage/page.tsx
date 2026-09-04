import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { FormField, TextInput, TextArea } from "@/components/admin/form/FormField";
import { NotPersistedNotice } from "@/components/admin/NotPersistedNotice";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { getHeroContent } from "@/lib/homepage-data";

/**
 * Controlled section model, not a drag-and-drop page builder, per the
 * brief. Pre-filled from lib/homepage-data.ts's current defaults so
 * the admin sees exactly what's live. Section visibility toggles are
 * structural (checkboxes) — Works/Journal shelves are the only two
 * sections that currently exist, matching the real homepage.
 */
export default async function AdminHomepagePage() {
  const hero = await getHeroContent();

  return (
    <div className="flex flex-col gap-lg">
      <AdminPageHeader title="Homepage" description="Configure the public homepage." />

      <form className="flex flex-col gap-lg max-w-2xl">
        <NotPersistedNotice />

        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">Hero</h2>
          <div className="flex flex-col gap-md">
            <FormField label="Eyebrow" htmlFor="eyebrow">
              <TextInput id="eyebrow" name="eyebrow" defaultValue={hero.eyebrow ?? ""} />
            </FormField>
            <FormField label="Title" htmlFor="heroTitle">
              <TextInput id="heroTitle" name="heroTitle" defaultValue={hero.title} />
            </FormField>
            <FormField label="Description" htmlFor="heroDescription">
              <TextArea id="heroDescription" name="heroDescription" rows={3} defaultValue={hero.description} />
            </FormField>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <FormField label="Primary CTA label" htmlFor="ctaLabel">
                <TextInput id="ctaLabel" name="ctaLabel" defaultValue={hero.ctaLabel ?? ""} />
              </FormField>
              <FormField label="Primary CTA link" htmlFor="ctaHref">
                <TextInput id="ctaHref" name="ctaHref" defaultValue={hero.ctaHref ?? ""} />
              </FormField>
            </div>
            <FormField label="Hero image URL" htmlFor="heroImage" hint="Media Library integration comes later">
              <TextInput id="heroImage" name="heroImage" defaultValue={hero.imageUrl ?? ""} />
            </FormField>
          </div>
        </div>

        <div className="border-t border-surface-container pt-md">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">Sections</h2>
          <div className="flex flex-col gap-sm">
            {[
              { key: "works", label: "Works shelf" },
              { key: "journal", label: "Journal shelf" },
              { key: "studio", label: "Studio teaser" },
            ].map((section) => (
              <label
                key={section.key}
                className="flex items-center justify-between gap-sm px-md py-sm rounded-lg border border-surface-container"
              >
                <span className="flex items-center gap-sm font-body-md text-body-md text-on-surface">
                  <Icon name="drag_indicator" className="text-on-surface-variant" size={18} />
                  {section.label}
                </span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-sm pt-sm border-t border-surface-container">
          <Button type="submit" variant="primary" disabled>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
