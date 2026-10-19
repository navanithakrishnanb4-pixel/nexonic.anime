import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminMediaLibrary } from "@/components/admin/media/AdminMediaLibrary";
import { MediaUploadForm } from "@/components/admin/media/MediaUploadForm";
import { getAllMedia } from "@/lib/media-data";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const media = await getAllMedia();

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <AdminPageHeader
          title="Media Library"
          description={`${media.length} ${media.length === 1 ? "asset" : "assets"} · posters, hero artwork, thumbnails, gallery images and logos`}
        />
      </div>

      <div className="admin-card rounded-2xl border border-white/5 p-6 mb-8">
        <h2 className="font-display font-semibold text-paper-50 text-lg mb-4">Upload an image</h2>
        <MediaUploadForm />
      </div>

      <AdminMediaLibrary media={media} />
    </div>
  );
}
