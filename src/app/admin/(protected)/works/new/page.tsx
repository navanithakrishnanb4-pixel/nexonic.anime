import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminBackLink } from "@/components/admin/ui/AdminBackLink";
import { WorkForm } from "@/components/admin/works/WorkForm";
import { createWorkAction } from "@/lib/works-actions";
import { getAllMedia } from "@/lib/media-data";

export const dynamic = "force-dynamic";

export default async function NewWorkPage() {
  const media = await getAllMedia();

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <AdminBackLink href="/admin/works" label="All works" />
      <AdminPageHeader title="New Work" description="Create a new Nexonic project." />
      <div className="admin-card rounded-2xl border border-white/5 p-6 sm:p-8">
        <WorkForm action={createWorkAction} media={media} />
      </div>
    </div>
  );
}
