import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { JournalForm } from "@/components/admin/journal/JournalForm";

export default function NewJournalPostPage() {
  return (
    <div className="flex flex-col gap-lg">
      <AdminPageHeader title="New Journal Post" description="Write a new studio journal entry." />
      <JournalForm />
    </div>
  );
}
