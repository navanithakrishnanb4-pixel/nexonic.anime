import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyList } from "@/components/admin/AdminEmptyList";
import { AnnouncementForm } from "@/components/admin/announcements/AnnouncementForm";
import { AnnouncementRow } from "@/components/admin/announcements/AnnouncementRow";
import { getAllAnnouncements } from "@/lib/announcements-data";
import { createAnnouncementAction } from "@/lib/announcements-actions";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  const announcements = await getAllAnnouncements();

  return (
    <div className="flex flex-col gap-lg">
      <AdminPageHeader
        title="Announcements"
        description="Site-wide messages, optionally scheduled and linked."
      />

      <div className="flex flex-col gap-md">
        <h2 className="font-display text-xl font-semibold text-paper-100">New Announcement</h2>
        <AnnouncementForm action={createAnnouncementAction} submitLabel="Create Announcement" />
      </div>

      <div className="border-t border-white/10 pt-lg flex flex-col gap-md">
        <h2 className="font-display text-xl font-semibold text-paper-100">All Announcements</h2>
        {announcements.length === 0 ? (
          <AdminEmptyList icon="campaign" message="No announcements yet." />
        ) : (
          <div className="flex flex-col gap-sm">
            {announcements.map((a) => (
              <AnnouncementRow key={a.id} announcement={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
