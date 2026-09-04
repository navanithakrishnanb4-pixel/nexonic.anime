import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyList } from "@/components/admin/AdminEmptyList";
import { WorkForm } from "@/components/admin/works/WorkForm";
import { getWorkById } from "@/lib/works-data";

interface EditWorkPageProps {
  params: { id: string };
}

/**
 * There are currently zero works, so every id resolves to "not found."
 * Rather than a hard 404 (this is an internal admin tool, not a public
 * route), it shows an in-context empty state pointing back to the list
 * — consistent with how the rest of the admin handles absent content.
 */
export default async function EditWorkPage({ params }: EditWorkPageProps) {
  const work = await getWorkById(params.id);

  if (!work) {
    return (
      <div className="flex flex-col gap-lg">
        <AdminPageHeader title="Edit Work" />
        <AdminEmptyList
          icon="search_off"
          message="This work doesn't exist yet — there are no works in the system."
          actionLabel="Back to Works"
          actionHref="/admin/works"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg">
      <AdminPageHeader title={`Edit: ${work.title}`} />
      <WorkForm work={work} />
    </div>
  );
}
