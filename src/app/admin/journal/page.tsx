import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyList } from "@/components/admin/AdminEmptyList";
import { Button } from "@/components/ui/Button";
import { getAllJournalPosts } from "@/lib/journal-data";

export default async function AdminJournalPage() {
  const posts = await getAllJournalPosts();

  return (
    <div className="flex flex-col gap-lg">
      <AdminPageHeader
        title="Journal"
        description="Manage studio journal articles."
        action={
          <Button href="/admin/journal/new" variant="primary">
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
        <div className="flex flex-col divide-y divide-surface-container border border-surface-container rounded-xl overflow-hidden">
          {posts.map((post) => (
            <a
              key={post.id}
              href={`/admin/journal/${post.id}`}
              className="flex items-center justify-between px-md py-sm hover:bg-surface-container-low transition-colors"
            >
              <span className="font-body-md text-body-md text-on-surface">{post.title}</span>
              <span className="font-caption text-caption text-on-surface-variant uppercase">
                {post.published ? "Published" : "Draft"}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
