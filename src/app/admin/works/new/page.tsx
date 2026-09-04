import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { WorkForm } from "@/components/admin/works/WorkForm";

export default function NewWorkPage() {
  return (
    <div className="flex flex-col gap-lg">
      <AdminPageHeader title="New Work" description="Create a new Nexonic project." />
      <WorkForm />
    </div>
  );
}
