import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EpisodeForm } from "@/components/admin/episodes/EpisodeForm";

export default function NewEpisodePage() {
  return (
    <div className="flex flex-col gap-lg">
      <AdminPageHeader title="New Episode" description="Add an episode to a series." />
      <EpisodeForm />
    </div>
  );
}
