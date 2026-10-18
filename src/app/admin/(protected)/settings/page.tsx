import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-lg">
      <AdminPageHeader title="Settings" description="Site-wide configuration." />
      <SettingsForm />
    </div>
  );
}
