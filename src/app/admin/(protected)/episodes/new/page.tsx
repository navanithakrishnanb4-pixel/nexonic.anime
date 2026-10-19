import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminBackLink } from "@/components/admin/ui/AdminBackLink";
import { EpisodeForm } from "@/components/admin/episodes/EpisodeForm";
import { createEpisodeAction } from "@/lib/episodes-actions";
import { getAllWorks } from "@/lib/works-data";
import { getAllMedia } from "@/lib/media-data";

export const dynamic = "force-dynamic";

export default async function NewEpisodePage() {
  const [works, media] = await Promise.all([getAllWorks(), getAllMedia()]);

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <AdminBackLink href="/admin/episodes" label="All episodes" />
      <AdminPageHeader title="New Episode" description="Add an episode to a series." />
      <div className="admin-card rounded-2xl border border-white/5 p-6 sm:p-8">
        <EpisodeForm action={createEpisodeAction} works={works} media={media} />
      </div>
    </div>
  );
}
