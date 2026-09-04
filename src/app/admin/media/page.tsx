import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { getAllMedia } from "@/lib/media-data";

/**
 * Upload UI is structural only — clicking it does nothing yet, no
 * Supabase Storage integration per this step's scope. It's disabled
 * rather than wired to a fake/local-only upload so it doesn't imply
 * files are actually being stored anywhere.
 */
export default async function AdminMediaPage() {
  const media = await getAllMedia();

  return (
    <div className="flex flex-col gap-lg">
      <AdminPageHeader
        title="Media Library"
        description="Images used across the site: posters, hero artwork, thumbnails, gallery images, logos."
      />

      <div className="border border-dashed border-outline-variant rounded-xl p-lg flex flex-col items-center gap-sm text-center">
        <Icon name="upload" className="text-outline-variant" size={28} />
        <p className="font-body-md text-body-md text-on-surface-variant">
          Drag files here or click to upload
        </p>
        <button
          type="button"
          disabled
          className="font-label-md text-label-md text-on-surface-variant border border-outline-variant rounded-full px-md py-xs opacity-50 cursor-not-allowed"
        >
          Upload (requires Storage integration)
        </button>
      </div>

      {media.length === 0 && (
        <EmptyState icon="perm_media" message="No media assets uploaded yet." />
      )}
    </div>
  );
}
