import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminBackLink } from "@/components/admin/ui/AdminBackLink";
import { JournalForm } from "@/components/admin/journal/JournalForm";
import { createJournalPostAction } from "@/lib/journal-actions";
import { getAllMedia } from "@/lib/media-data";

export const dynamic = "force-dynamic";

export default async function NewJournalPostPage() {
  const media = await getAllMedia();

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <AdminBackLink href="/admin/journal" label="All posts" />
      <AdminPageHeader title="New Journal Post" description="Write a new studio journal entry." />
      <div className="admin-card rounded-2xl border border-white/5 p-6 sm:p-8">
        <JournalForm action={createJournalPostAction} media={media} />
      </div>
    </div>
  );
}
