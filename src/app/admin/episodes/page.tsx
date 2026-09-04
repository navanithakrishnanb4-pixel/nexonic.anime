import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyList } from "@/components/admin/AdminEmptyList";
import { Button } from "@/components/ui/Button";
import { getAllEpisodes } from "@/lib/episodes-data";

export default async function AdminEpisodesPage() {
  const episodes = await getAllEpisodes();

  return (
    <div className="flex flex-col gap-lg">
      <AdminPageHeader
        title="Episodes"
        description="Manage episodes across all series."
        action={
          <Button href="/admin/episodes/new" variant="primary">
            New Episode
          </Button>
        }
      />

      <AdminEmptyList
        icon="video_library"
        message={
          episodes.length === 0
            ? "No episodes yet. Episodes belong to a Work — create a Work first."
            : "Episode list rendering not needed yet."
        }
        actionLabel="New Episode"
        actionHref="/admin/episodes/new"
      />
    </div>
  );
}
