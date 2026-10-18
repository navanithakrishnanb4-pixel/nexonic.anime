import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { JournalForm } from "@/components/admin/journal/JournalForm";
import { createJournalPostAction } from "@/lib/journal-actions";
import { getAllMedia } from "@/lib/media-data";

export const dynamic = "force-dynamic";

export default async function NewJournalPostPage() {
  const media = await getAllMedia();

  return (
    <div className="flex flex-col gap-lg">
      <AdminPageHeader title="New Journal Post" description="Write a new studio journal entry." />
      <JournalForm action={createJournalPostAction} media={media} />
    </div>
  );
}
