import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEpisodesView } from "@/components/admin/episodes/AdminEpisodesView";
import { PlusIcon } from "@/components/admin/ui/AdminIcons";
import { getAllEpisodes } from "@/lib/episodes-data";
import { getAllWorks } from "@/lib/works-data";

export const dynamic = "force-dynamic";

export default async function AdminEpisodesPage() {
  const [episodes, works] = await Promise.all([getAllEpisodes(), getAllWorks()]);

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <AdminPageHeader
          title="Episodes"
          description="Manage episodes across all series."
          action={
            <Link
              href="/admin/episodes/new"
              className="font-outfit flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-violet to-neon-pink-deep text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-neon-violet/20"
            >
              <PlusIcon />
              New Episode
            </Link>
          }
        />
      </div>
      <AdminEpisodesView episodes={episodes} works={works} />
    </div>
  );
}
