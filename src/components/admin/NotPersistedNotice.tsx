import { Icon } from "@/components/ui/Icon";

/**
 * Only used by SettingsForm now — Works/Episodes/Journal/Announcements
 * forms were wired to real Server Actions in later steps and no longer
 * render this. Settings itself is still intentionally UI-only (per the
 * 18L brief: no schema change just to make Settings "work"), so this
 * copy is still accurate for that one remaining context.
 */
export function NotPersistedNotice() {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-ink-800/60 px-4 py-3">
      <Icon name="info" className="text-paper-500 mt-[2px]" size={18} />
      <p className="font-outfit text-xs text-paper-500">
        This form is not yet connected to a backend. Fields are functional UI
        only — nothing is saved until Supabase is integrated for Settings.
      </p>
    </div>
  );
}
