import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AnnouncementForm } from "@/components/admin/announcements/AnnouncementForm";
import { AnnouncementRow } from "@/components/admin/announcements/AnnouncementRow";
import { getAllAnnouncements } from "@/lib/announcements-data";
import { createAnnouncementAction } from "@/lib/announcements-actions";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  const announcements = await getAllAnnouncements();
  const visibleCount = announcements.filter((a) => a.visible).length;

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <AdminPageHeader title="Announcements" description={`${announcements.length} total · ${visibleCount} visible`} />
      </div>

      <div className="space-y-3 mb-10">
        {announcements.length === 0 ? (
          <div className="admin-card rounded-2xl border border-white/5 py-12 text-center font-outfit text-paper-500 text-sm">
            No announcements yet.
          </div>
        ) : (
          announcements.map((a) => <AnnouncementRow key={a.id} announcement={a} />)
        )}
      </div>

      <div className="admin-card rounded-2xl border border-white/5 p-6">
        <h2 className="font-display font-semibold text-paper-50 text-lg mb-4">New announcement</h2>
        <AnnouncementForm action={createAnnouncementAction} submitLabel="Create Announcement" />
      </div>
    </div>
  );
}
