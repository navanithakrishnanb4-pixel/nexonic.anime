import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyList } from "@/components/admin/AdminEmptyList";
import { Button } from "@/components/ui/Button";
import { DeleteJournalPostButton } from "@/components/admin/journal/DeleteJournalPostButton";
import { getAllJournalPosts } from "@/lib/journal-data";

export const dynamic = "force-dynamic";

export default async function AdminJournalPage() {
  const posts = await getAllJournalPosts();

  return (
    <div className="flex flex-col gap-lg">
      <AdminPageHeader
        title="Journal"
        description="Manage studio journal articles."
        action={
          <Button href="/admin/journal/new" variant="primary" className="!bg-gradient-to-r !from-neon-violet !to-neon-pink-deep !text-white !rounded-full hover:!opacity-90">
            New Post
          </Button>
        }
      />

      {posts.length === 0 ? (
        <AdminEmptyList
          icon="article"
          message="No journal posts yet. Write the first one."
          actionLabel="New Post"
          actionHref="/admin/journal/new"
        />
      ) : (
        <div className="flex flex-col divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between gap-md px-md py-sm hover:bg-ink-800 transition-colors"
            >
              <a
                href={`/admin/journal/${post.id}`}
                className="flex-1 min-w-0 flex flex-col gap-xs"
              >
                <span className="font-outfit text-sm text-paper-100 truncate">
                  {post.title}
                </span>
                <span className="font-outfit text-xs text-paper-500 uppercase">
                  {[post.category, post.status, post.featured && "Featured"]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </a>
              <DeleteJournalPostButton postId={post.id} postTitle={post.title} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
