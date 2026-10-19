"use client";

import { FormField, TextInput } from "@/components/admin/form/FormField";
import { NotPersistedNotice } from "@/components/admin/NotPersistedNotice";
import { Button } from "@/components/ui/Button";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="admin-card rounded-2xl border border-white/5 p-6 flex flex-col gap-4">
      <h2 className="font-display text-lg font-semibold text-paper-50">{title}</h2>
      {children}
    </div>
  );
}

/**
 * Figma admin Settings layout (section cards). Still intentionally
 * UI-only — there is no settings table, and the brief was not to add
 * one just to make this page "work". Omitted from the Figma reference:
 * its "Admin access" and IDE-waitlist sections (they describe features
 * that don't exist here) and its pre-filled contact email/socials
 * (invented values; these fields stay empty).
 */
export function SettingsForm() {
  return (
    <form className="flex flex-col gap-6 max-w-3xl" onSubmit={(e) => e.preventDefault()}>
      <NotPersistedNotice />

      <Card title="General">
        <FormField label="Site name" htmlFor="siteName">
          <TextInput id="siteName" name="siteName" defaultValue="NEXONIC" />
        </FormField>
        <FormField label="Contact email" htmlFor="contactEmail">
          <TextInput id="contactEmail" name="contactEmail" type="email" placeholder="not set" />
        </FormField>
      </Card>

      <Card title="Social links">
        <FormField label="Twitter / X" htmlFor="twitter">
          <TextInput id="twitter" name="twitter" placeholder="not set" />
        </FormField>
        <FormField label="Instagram" htmlFor="instagram">
          <TextInput id="instagram" name="instagram" placeholder="not set" />
        </FormField>
        <FormField label="YouTube" htmlFor="youtube">
          <TextInput id="youtube" name="youtube" placeholder="not set" />
        </FormField>
      </Card>

      <Card title="SEO defaults">
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
      </Card>

      <div>
        <Button
          type="submit"
          variant="primary"
          disabled
          className="!bg-gradient-to-r !from-neon-violet !to-neon-pink-deep !text-white !rounded-xl hover:!opacity-90"
        >
          Save Settings
        </Button>
      </div>
    </form>
  );
}
