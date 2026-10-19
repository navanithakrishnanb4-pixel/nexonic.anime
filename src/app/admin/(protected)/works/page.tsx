import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminWorksTable } from "@/components/admin/works/AdminWorksTable";
import { PlusIcon } from "@/components/admin/ui/AdminIcons";
import { getAllWorks } from "@/lib/works-data";

export const dynamic = "force-dynamic";

export default async function AdminWorksPage() {
  const works = await getAllWorks();

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <AdminPageHeader
          title="Works"
          description={`${works.length} total`}
          action={
            <Link
              href="/admin/works/new"
              className="font-outfit flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-violet to-neon-pink-deep text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-neon-violet/20"
            >
              <PlusIcon />
              New Work
            </Link>
          }
        />
      </div>
      <AdminWorksTable works={works} />
    </div>
  );
}
