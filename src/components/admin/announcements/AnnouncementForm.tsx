"use client";

import { useFormState, useFormStatus } from "react-dom";
import { FormField, TextInput } from "@/components/admin/form/FormField";
import { Button } from "@/components/ui/Button";
import type { Announcement } from "@/lib/announcements-data";
import type { AnnouncementFormState } from "@/lib/announcements-actions";

interface AnnouncementFormProps {
  announcement?: Partial<Announcement>;
  action: (prevState: AnnouncementFormState, formData: FormData) => Promise<AnnouncementFormState>;
  submitLabel?: string;
  onCancel?: () => void;
}

const initialState: AnnouncementFormState = { error: null };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" disabled={pending} className="!bg-gradient-to-r !from-neon-violet !to-neon-pink-deep !text-white !rounded-full hover:!opacity-90">
      {pending ? "Saving…" : label}
    </Button>
  );
}

/** ISO datetime -> value a <input type="date"> accepts. */
function toDateInputValue(iso: string | null | undefined): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export function AnnouncementForm({
  announcement,
  action,
  submitLabel = "Save Announcement",
  onCancel,
}: AnnouncementFormProps) {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-md max-w-2xl">
      {state.error && (
        <div
          role="alert"
          className="rounded-md border border-red-400/30 bg-red-400/10 px-md py-sm text-sm text-red-300"
        >
          {state.error}
        </div>
      )}

      <FormField label="Message" htmlFor="message">
        <TextInput id="message" name="message" defaultValue={announcement?.message ?? ""} required />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        <FormField label="Link URL (optional)" htmlFor="linkUrl">
          <TextInput id="linkUrl" name="linkUrl" defaultValue={announcement?.linkUrl ?? ""} />
        </FormField>
        <FormField label="Link label (optional)" htmlFor="linkLabel">
          <TextInput id="linkLabel" name="linkLabel" defaultValue={announcement?.linkLabel ?? ""} />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        <FormField label="Start date" htmlFor="startsAt">
          <TextInput
            id="startsAt"
            name="startsAt"
            type="date"
            defaultValue={toDateInputValue(announcement?.startsAt)}
          />
        </FormField>
        <FormField label="End date" htmlFor="endsAt">
          <TextInput
            id="endsAt"
            name="endsAt"
            type="date"
            defaultValue={toDateInputValue(announcement?.endsAt)}
          />
        </FormField>
      </div>

      <label className="flex items-center gap-sm font-outfit text-sm text-paper-100">
        <input
          type="checkbox"
          name="visible"
          className="w-4 h-4 accent-neon-violet"
          defaultChecked={announcement?.visible ?? true}
        />
        Visible
      </label>

      <div className="pt-sm border-t border-white/10 flex gap-sm">
        <SubmitButton label={submitLabel} />
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-paper-500 hover:underline"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
