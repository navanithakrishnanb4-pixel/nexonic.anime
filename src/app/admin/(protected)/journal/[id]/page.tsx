import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyList } from "@/components/admin/AdminEmptyList";
import { JournalForm } from "@/components/admin/journal/JournalForm";
import { DeleteJournalPostButton } from "@/components/admin/journal/DeleteJournalPostButton";
import { getJournalPostById } from "@/lib/journal-data";
import { updateJournalPostAction } from "@/lib/journal-actions";
import { getAllMedia } from "@/lib/media-data";

interface EditJournalPostPageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default async function EditJournalPostPage({ params }: EditJournalPostPageProps) {
  const [post, media] = await Promise.all([
    getJournalPostById(params.id),
    getAllMedia(),
  ]);

  if (!post) {
    return (
      <div className="flex flex-col gap-lg">
        <AdminPageHeader title="Edit Journal Post" />
        <AdminEmptyList
          icon="search_off"
          message="This post doesn't exist — it may have been deleted, or the ID is wrong."
          actionLabel="Back to Journal"
          actionHref="/admin/journal"
        />
      </div>
    );
  }

  const boundUpdate = updateJournalPostAction.bind(null, post.id);

  return (
    <div className="flex flex-col gap-lg">
      <AdminPageHeader
        title={`Edit: ${post.title}`}
        action={
          <DeleteJournalPostButton
            postId={post.id}
            postTitle={post.title}
            redirectTo="/admin/journal"
          />
        }
      />
      <JournalForm post={post} action={boundUpdate} media={media} />
    </div>
  );
}
