import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyList } from "@/components/admin/AdminEmptyList";
import { Button } from "@/components/ui/Button";
import { DeleteWorkButton } from "@/components/admin/works/DeleteWorkButton";
import { getAllWorks } from "@/lib/works-data";

export const dynamic = "force-dynamic";

export default async function AdminWorksPage() {
  const works = await getAllWorks();

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Works"
        description="Manage Nexonic's published and in-progress projects."
        action={
          <Button
            href="/admin/works/new"
            variant="primary"
            className="!bg-gradient-to-r !from-neon-violet !to-neon-pink-deep !text-white !rounded-full hover:!opacity-90"
          >
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
        <div className="flex flex-col divide-y divide-white/5 border border-white/10 rounded-2xl overflow-hidden bg-ink-800/30">
          {works.map((work) => (
            <div
              key={work.id}
              className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-white/5 transition-colors"
            >
              <a href={`/admin/works/${work.id}`} className="flex-1 min-w-0 flex flex-col gap-0.5">
                <span className="font-outfit text-sm text-paper-100 truncate">{work.title}</span>
                <span className="font-outfit text-xs text-paper-500 uppercase">
                  {[work.category, work.status.replace(/_/g, " "), work.year, work.featured && "Featured"]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </a>
              <DeleteWorkButton workId={work.id} workTitle={work.title} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
