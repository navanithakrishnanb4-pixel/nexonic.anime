import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllWorks, getWorkBySlug } from "@/lib/works-data";
import { getEpisodeCountForWork } from "@/lib/episodes-data";
import { WorkDetailHero } from "@/components/works/WorkDetailHero";
import { WorkSidebar } from "@/components/works/WorkSidebar";
import { WorkEpisodesTeaser } from "@/components/works/WorkEpisodesTeaser";
import { WorkGallery } from "@/components/works/WorkGallery";
import { WorkCredits } from "@/components/works/WorkCredits";
import { RelatedWorks } from "@/components/works/RelatedWorks";

interface WorkDetailPageProps {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

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
 * Third page ported to the Figma visual design. Adds two real queries
 * the old version didn't need: an episode count (episodes-data.ts's
 * getEpisodeCountForWork) and a related-works lookup (genre overlap
 * against getAllWorks() — not a separate "related" table or fabricated
 * list). With the current empty database both resolve to 0 / [], which
 * their components already render honestly (no episodes yet / no
 * related-works section at all).
 */
export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const work = await getWorkBySlug(params.slug);

  if (!work) {
    notFound();
  }

  const [episodeCount, allWorks] = await Promise.all([
    getEpisodeCountForWork(work.id),
    getAllWorks(),
  ]);

  const related = allWorks
    .filter((w) => w.id !== work.id && w.genres.some((g) => work.genres.includes(g)))
    .slice(0, 6);

  return (
    <div className="bg-ink-900">
      <WorkDetailHero work={work} />

      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_320px] gap-12">
          <div>
            <section className="mb-12">
              <h2 className="font-display text-xl font-semibold text-paper-50 mb-4">Synopsis</h2>
              <p className="font-outfit text-paper-300 text-base leading-relaxed">
                {work.description || work.shortDescription}
              </p>
            </section>

            <WorkEpisodesTeaser workSlug={work.slug} episodeCount={episodeCount} />
          </div>

          <WorkSidebar work={work} />
        </div>

        <WorkGallery images={work.gallery} workTitle={work.title} />
        <WorkCredits credits={work.credits} />
        <RelatedWorks works={related} />
      </div>
    </div>
  );
}
