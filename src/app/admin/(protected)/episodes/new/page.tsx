import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EpisodeForm } from "@/components/admin/episodes/EpisodeForm";
import { createEpisodeAction } from "@/lib/episodes-actions";
import { getAllWorks } from "@/lib/works-data";
import { getAllMedia } from "@/lib/media-data";

export const dynamic = "force-dynamic";

export default async function NewEpisodePage() {
  const [works, media] = await Promise.all([getAllWorks(), getAllMedia()]);

  return (
    <div className="flex flex-col gap-lg">
      <AdminPageHeader title="New Episode" description="Add an episode to a series." />
      <EpisodeForm action={createEpisodeAction} works={works} media={media} />
    </div>
  );
}
