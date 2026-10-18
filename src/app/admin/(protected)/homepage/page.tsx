import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { HomepageForm } from "@/components/admin/homepage/HomepageForm";
import { getHomepageConfig } from "@/lib/homepage-data";
import { updateHomepageConfigAction } from "@/lib/homepage-actions";
import { getAllMedia } from "@/lib/media-data";
import { getAllWorks } from "@/lib/works-data";
import { getAllJournalPosts } from "@/lib/journal-data";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  const [config, media, works, journalPosts] = await Promise.all([
    getHomepageConfig(),
    getAllMedia(),
    getAllWorks(),
    getAllJournalPosts(),
  ]);

  return (
    <div className="flex flex-col gap-lg">
      <AdminPageHeader title="Homepage" description="Configure the public homepage." />
      <HomepageForm
        config={config}
        action={updateHomepageConfigAction}
        media={media}
        works={works}
        journalPosts={journalPosts}
      />
    </div>
  );
}
