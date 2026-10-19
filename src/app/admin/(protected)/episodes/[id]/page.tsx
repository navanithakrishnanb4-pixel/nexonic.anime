import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminBackLink } from "@/components/admin/ui/AdminBackLink";
import { AdminEmptyList } from "@/components/admin/AdminEmptyList";
import { EpisodeForm } from "@/components/admin/episodes/EpisodeForm";
import { DeleteEpisodeButton } from "@/components/admin/episodes/DeleteEpisodeButton";
import { getEpisodeById } from "@/lib/episodes-data";
import { updateEpisodeAction } from "@/lib/episodes-actions";
import { getAllWorks } from "@/lib/works-data";
import { getAllMedia } from "@/lib/media-data";

interface EditEpisodePageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default async function EditEpisodePage({ params }: EditEpisodePageProps) {
  const [episode, works, media] = await Promise.all([
    getEpisodeById(params.id),
    getAllWorks(),
    getAllMedia(),
  ]);

  if (!episode) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl">
        <AdminPageHeader title="Edit Episode" />
        <AdminEmptyList
          icon="search_off"
          message="This episode doesn't exist — it may have been deleted, or the ID is wrong."
          actionLabel="Back to Episodes"
          actionHref="/admin/episodes"
        />
      </div>
    );
  }

  const boundUpdate = updateEpisodeAction.bind(null, episode.id);

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <AdminBackLink href="/admin/episodes" label="All episodes" />
      <AdminPageHeader
        title={`Edit: ${episode.title}`}
        action={
          <DeleteEpisodeButton
            episodeId={episode.id}
            episodeTitle={episode.title}
            redirectTo="/admin/episodes"
          />
        }
      />
      <div className="admin-card rounded-2xl border border-white/5 p-6 sm:p-8">
        <EpisodeForm episode={episode} action={boundUpdate} works={works} media={media} />
      </div>
    </div>
  );
}
