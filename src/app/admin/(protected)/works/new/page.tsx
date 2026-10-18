import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { WorkForm } from "@/components/admin/works/WorkForm";
import { createWorkAction } from "@/lib/works-actions";
import { getAllMedia } from "@/lib/media-data";

export const dynamic = "force-dynamic";

export default async function NewWorkPage() {
  const media = await getAllMedia();

  return (
    <div className="flex flex-col gap-lg">
      <AdminPageHeader title="New Work" description="Create a new Nexonic project." />
      <WorkForm action={createWorkAction} media={media} />
    </div>
  );
}
