import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminBackLink } from "@/components/admin/ui/AdminBackLink";
import { AdminEmptyList } from "@/components/admin/AdminEmptyList";
import { WorkForm } from "@/components/admin/works/WorkForm";
import { DeleteWorkButton } from "@/components/admin/works/DeleteWorkButton";
import { getWorkById } from "@/lib/works-data";
import { updateWorkAction } from "@/lib/works-actions";
import { getAllMedia } from "@/lib/media-data";

interface EditWorkPageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default async function EditWorkPage({ params }: EditWorkPageProps) {
  const [work, media] = await Promise.all([getWorkById(params.id), getAllMedia()]);

  if (!work) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl">
        <AdminPageHeader title="Edit Work" />
        <AdminEmptyList
          icon="search_off"
          message="This work doesn't exist — it may have been deleted, or the ID is wrong."
          actionLabel="Back to Works"
          actionHref="/admin/works"
        />
      </div>
    );
  }

  const boundUpdate = updateWorkAction.bind(null, work.id);

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <AdminBackLink href="/admin/works" label="All works" />
      <AdminPageHeader
        title={`Edit: ${work.title}`}
        action={
          <DeleteWorkButton workId={work.id} workTitle={work.title} redirectTo="/admin/works" />
        }
      />
      <div className="admin-card rounded-2xl border border-white/5 p-6 sm:p-8">
        <WorkForm work={work} action={boundUpdate} media={media} />
      </div>
    </div>
  );
}
