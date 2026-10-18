import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { MediaUploadForm } from "@/components/admin/media/MediaUploadForm";
import { MediaItemCard } from "@/components/admin/media/MediaItemCard";
import { getAllMedia } from "@/lib/media-data";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const media = await getAllMedia();

  return (
    <div className="flex flex-col gap-lg">
      <AdminPageHeader
        title="Media Library"
        description="Images used across the site: posters, hero artwork, thumbnails, gallery images, logos."
      />

      <MediaUploadForm />

      {media.length === 0 ? (
        <EmptyState icon="perm_media" message="No media assets uploaded yet." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-md">
          {media.map((asset) => (
            <MediaItemCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
    </div>
  );
}
