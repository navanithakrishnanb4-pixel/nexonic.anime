import { Icon } from "@/components/ui/Icon";

/**
 * Every create/edit form in this admin shell renders this. There is no
 * backend yet (Supabase is a later phase), so nothing here actually
 * saves — this banner says so explicitly rather than letting a "Save"
 * button imply persistence that doesn't exist.
 */
export function NotPersistedNotice() {
  return (
    <div className="flex items-start gap-sm rounded-lg border border-outline-variant/50 bg-surface-container-low px-md py-sm">
      <Icon name="info" className="text-on-surface-variant mt-[2px]" size={18} />
      <p className="font-caption text-caption text-on-surface-variant">
        This form is not yet connected to a backend. Fields are functional UI
        only — nothing is saved until Supabase is integrated in a later phase.
      </p>
    </div>
  );
}
