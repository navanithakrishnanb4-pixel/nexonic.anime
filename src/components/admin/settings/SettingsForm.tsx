"use client";

import { FormField, TextInput } from "@/components/admin/form/FormField";
import { NotPersistedNotice } from "@/components/admin/NotPersistedNotice";
import { Button } from "@/components/ui/Button";

export function SettingsForm() {
  return (
    <form className="flex flex-col gap-lg max-w-2xl" onSubmit={(e) => e.preventDefault()}>
      <NotPersistedNotice />

      <div className="flex flex-col gap-md">
        <h2 className="font-display text-xl font-semibold text-paper-100">General</h2>
        <FormField label="Site name" htmlFor="siteName">
          <TextInput id="siteName" name="siteName" defaultValue="NEXONIC" />
        </FormField>
        <FormField label="Contact email" htmlFor="contactEmail">
          <TextInput id="contactEmail" name="contactEmail" type="email" placeholder="not set" />
        </FormField>
      </div>

      <div className="flex flex-col gap-md border-t border-white/10 pt-md">
        <h2 className="font-display text-xl font-semibold text-paper-100">Social links</h2>
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

      <div className="flex flex-col gap-md border-t border-white/10 pt-md">
        <h2 className="font-display text-xl font-semibold text-paper-100">SEO defaults</h2>
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

      <div className="pt-sm border-t border-white/10">
        <Button type="submit" variant="primary" disabled className="!bg-gradient-to-r !from-neon-violet !to-neon-pink-deep !text-white !rounded-full hover:!opacity-90">
          Save Settings
        </Button>
      </div>
    </form>
  );
}
