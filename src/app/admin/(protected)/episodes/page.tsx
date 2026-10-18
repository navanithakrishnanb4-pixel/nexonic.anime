import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyList } from "@/components/admin/AdminEmptyList";
import { Button } from "@/components/ui/Button";
import { DeleteEpisodeButton } from "@/components/admin/episodes/DeleteEpisodeButton";
import { getAllEpisodes } from "@/lib/episodes-data";
import { getAllWorks } from "@/lib/works-data";

export const dynamic = "force-dynamic";

export default async function AdminEpisodesPage() {
  const [episodes, works] = await Promise.all([getAllEpisodes(), getAllWorks()]);

  return (
    <div className="flex flex-col gap-lg">
      <AdminPageHeader
        title="Episodes"
        description="Manage episodes across all series."
        action={
          <Button href="/admin/episodes/new" variant="primary" className="!bg-gradient-to-r !from-neon-violet !to-neon-pink-deep !text-white !rounded-full hover:!opacity-90">
            New Episode
          </Button>
        }
      />

      {episodes.length === 0 ? (
        <AdminEmptyList
          icon="video_library"
          message={
            works.length === 0
              ? "No episodes yet. Episodes belong to a Work — create a Work first."
              : "No episodes yet. Create the first one."
          }
          actionLabel="New Episode"
          actionHref="/admin/episodes/new"
        />
      ) : (
        <div className="flex flex-col divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden">
          {episodes.map((ep) => (
            <div
              key={ep.id}
              className="flex items-center justify-between gap-md px-md py-sm hover:bg-ink-800 transition-colors"
            >
              <a
                href={`/admin/episodes/${ep.id}`}
                className="flex-1 min-w-0 flex flex-col gap-xs"
              >
                <span className="font-outfit text-sm text-paper-100 truncate">
                  {ep.workTitle ?? "Unknown series"} — S{ep.seasonNumber}E{ep.episodeNumber}: {ep.title}
                </span>
                <span className="font-outfit text-xs text-paper-500 uppercase">
                  {ep.status}
                </span>
              </a>
              <DeleteEpisodeButton episodeId={ep.id} episodeTitle={ep.title} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
