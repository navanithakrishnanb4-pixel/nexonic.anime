import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyList } from "@/components/admin/AdminEmptyList";
import { Button } from "@/components/ui/Button";
import { getAllWorks } from "@/lib/works-data";

export default async function AdminWorksPage() {
  const works = await getAllWorks();

  return (
    <div className="flex flex-col gap-lg">
      <AdminPageHeader
        title="Works"
        description="Manage Nexonic's published and in-progress projects."
        action={
          <Button href="/admin/works/new" variant="primary">
            New Work
          </Button>
        }
      />

      {works.length === 0 ? (
        <AdminEmptyList
          icon="movie"
          message="No works yet. Create the first one to get started."
          actionLabel="New Work"
          actionHref="/admin/works/new"
        />
      ) : (
        <div className="flex flex-col divide-y divide-surface-container border border-surface-container rounded-xl overflow-hidden">
          {works.map((work) => (
            <a
              key={work.id}
              href={`/admin/works/${work.id}`}
              className="flex items-center justify-between px-md py-sm hover:bg-surface-container-low transition-colors"
            >
              <span className="font-body-md text-body-md text-on-surface">{work.title}</span>
              <span className="font-caption text-caption text-on-surface-variant uppercase">
                {work.status.replace(/_/g, " ")}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
