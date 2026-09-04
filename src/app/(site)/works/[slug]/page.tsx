import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWorkBySlug } from "@/lib/works-data";
import { WorkDetailHero } from "@/components/works/WorkDetailHero";
import { WorkGallery } from "@/components/works/WorkGallery";
import { WorkCredits } from "@/components/works/WorkCredits";

interface WorkDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: WorkDetailPageProps): Promise<Metadata> {
  const work = await getWorkBySlug(params.slug);
  if (!work) return { title: "Work Not Found" };
  return {
    title: work.title,
    description: work.shortDescription || work.description,
  };
}

/**
 * /works/[slug]. Calls next/navigation's notFound() — not a manual
 * "if null render EmptyState" branch — so a bad slug gets a real 404
 * status code and the shared not-found.tsx in this same route segment,
 * instead of a 200 response with an empty-looking page. With zero
 * works currently published, every slug hits this path; that's
 * expected, not a bug to work around.
 */
export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const work = await getWorkBySlug(params.slug);

  if (!work) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <WorkDetailHero work={work} />
      <WorkGallery images={work.galleryImageUrls} workTitle={work.title} />
      <WorkCredits credits={work.credits} />
    </div>
  );
}
