import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { FormField, TextInput } from "@/components/admin/form/FormField";
import { NotPersistedNotice } from "@/components/admin/NotPersistedNotice";
import { Button } from "@/components/ui/Button";

/**
 * Deliberately small: site name, social links, contact, basic SEO
 * defaults. No settings invented beyond what a small studio site
 * actually needs — no multi-user/roles/billing sections, per the
 * project's explicit no-over-engineering rule.
 */
export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-lg">
      <AdminPageHeader title="Settings" description="Site-wide configuration." />

      <form className="flex flex-col gap-lg max-w-2xl">
        <NotPersistedNotice />

        <div className="flex flex-col gap-md">
          <h2 className="font-headline-md text-headline-md text-on-surface">General</h2>
          <FormField label="Site name" htmlFor="siteName">
            <TextInput id="siteName" name="siteName" defaultValue="NEXONIC" />
          </FormField>
          <FormField label="Contact email" htmlFor="contactEmail">
            <TextInput id="contactEmail" name="contactEmail" type="email" placeholder="not set" />
          </FormField>
        </div>

        <div className="flex flex-col gap-md border-t border-surface-container pt-md">
          <h2 className="font-headline-md text-headline-md text-on-surface">Social links</h2>
          <FormField label="Twitter / X" htmlFor="twitter">
            <TextInput id="twitter" name="twitter" placeholder="not set" />
          </FormField>
          <FormField label="Instagram" htmlFor="instagram">
            <TextInput id="instagram" name="instagram" placeholder="not set" />
          </FormField>
          <FormField label="YouTube" htmlFor="youtube">
            <TextInput id="youtube" name="youtube" placeholder="not set" />
          </FormField>
        </div>

        <div className="flex flex-col gap-md border-t border-surface-container pt-md">
          <h2 className="font-headline-md text-headline-md text-on-surface">SEO defaults</h2>
          <FormField label="Default meta title" htmlFor="metaTitle">
            <TextInput id="metaTitle" name="metaTitle" defaultValue="NEXONIC Animation Studio" />
          </FormField>
          <FormField label="Default meta description" htmlFor="metaDescription">
            <TextInput
              id="metaDescription"
              name="metaDescription"
              defaultValue="NEXONIC is an independent animation studio building original stories and technology."
            />
          </FormField>
        </div>

        <div className="pt-sm border-t border-surface-container">
          <Button type="submit" variant="primary" disabled>
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
