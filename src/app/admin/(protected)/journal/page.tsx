import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminJournalTable } from "@/components/admin/journal/AdminJournalTable";
import { PlusIcon } from "@/components/admin/ui/AdminIcons";
import { getAllJournalPosts } from "@/lib/journal-data";

export const dynamic = "force-dynamic";

export default async function AdminJournalPage() {
  const posts = await getAllJournalPosts();

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <AdminPageHeader
          title="Journal"
          description={`${posts.length} ${posts.length === 1 ? "article" : "articles"}`}
          action={
            <Link
              href="/admin/journal/new"
              className="font-outfit flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-violet to-neon-pink-deep text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-neon-violet/20"
            >
              <PlusIcon />
              New Post
            </Link>
          }
        />
      </div>
      <AdminJournalTable posts={posts} />
    </div>
  );
}
