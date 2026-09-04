import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyList } from "@/components/admin/AdminEmptyList";
import { FormField, TextInput } from "@/components/admin/form/FormField";
import { NotPersistedNotice } from "@/components/admin/NotPersistedNotice";
import { Button } from "@/components/ui/Button";
import { getAllAnnouncements } from "@/lib/announcements-data";

export default async function AdminAnnouncementsPage() {
  const announcements = await getAllAnnouncements();

  return (
    <div className="flex flex-col gap-lg">
      <AdminPageHeader
        title="Announcements"
        description="Site-wide banners with an optional link and an active date range."
      />

      {announcements.length === 0 && (
        <AdminEmptyList
          icon="campaign"
          message="No announcements yet."
          actionLabel="Add Announcement"
          actionHref="#new-announcement"
        />
      )}

      <div id="new-announcement" className="border-t border-surface-container pt-lg">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-md">New Announcement</h2>
        <form className="flex flex-col gap-md max-w-2xl">
          <NotPersistedNotice />
          <FormField label="Text" htmlFor="text">
            <TextInput id="text" name="text" required />
          </FormField>
          <FormField label="Link (optional)" htmlFor="link">
            <TextInput id="link" name="link" />
          </FormField>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <FormField label="Start date" htmlFor="startDate">
              <TextInput id="startDate" name="startDate" type="date" />
            </FormField>
            <FormField label="End date" htmlFor="endDate">
              <TextInput id="endDate" name="endDate" type="date" />
            </FormField>
          </div>
          <label className="flex items-center gap-sm font-body-md text-body-md text-on-surface">
            <input type="checkbox" name="visible" className="w-4 h-4 accent-primary" defaultChecked />
            Visible
          </label>
          <div className="pt-sm border-t border-surface-container">
            <Button type="submit" variant="primary" disabled>
              Save Announcement
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
