import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { getAllWorks } from "@/lib/works-data";
import { getAllJournalPosts } from "@/lib/journal-data";
import { getAllEpisodes } from "@/lib/episodes-data";
import { getAllMedia } from "@/lib/media-data";
import { getAllAnnouncements } from "@/lib/announcements-data";

export default async function AdminDashboardPage() {
  const [works, episodes, journalPosts, media, announcements] = await Promise.all([
    getAllWorks(),
    getAllEpisodes(),
    getAllJournalPosts(),
    getAllMedia(),
    getAllAnnouncements(),
  ]);

  return (
    <div className="flex flex-col gap-lg">
      <AdminPageHeader
        title="Dashboard"
        description="Overview of Nexonic's content. Counts are real — the site currently has zero published content."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-md">
        <AdminStatCard label="Works" count={works.length} href="/admin/works" icon="movie" />
        <AdminStatCard
          label="Episodes"
          count={episodes.length}
          href="/admin/episodes"
          icon="video_library"
        />
        <AdminStatCard
          label="Journal Posts"
          count={journalPosts.length}
          href="/admin/journal"
          icon="article"
        />
        <AdminStatCard label="Media Assets" count={media.length} href="/admin/media" icon="perm_media" />
        <AdminStatCard
          label="Announcements"
          count={announcements.length}
          href="/admin/announcements"
          icon="campaign"
        />
      </div>

      <div className="rounded-xl border border-surface-container p-md">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Recent Activity</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">No recent activity.</p>
      </div>
    </div>
  );
}
