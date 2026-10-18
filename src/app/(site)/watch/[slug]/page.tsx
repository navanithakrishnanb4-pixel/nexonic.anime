import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWorkForWatch } from "@/lib/watch-data";
import { WatchSeriesClient } from "@/components/watch/WatchSeriesClient";

interface WatchDetailPageProps {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: WatchDetailPageProps): Promise<Metadata> {
  const result = await getWorkForWatch(params.slug);
  if (!result) return { title: "Not Found" };
  return { title: result.work.title, description: result.work.shortDescription };
}

export default async function WatchDetailPage({ params }: WatchDetailPageProps) {
  const result = await getWorkForWatch(params.slug);

  if (!result) {
    notFound();
  }

  const { work, seasons } = result;

  return (
    <div className="min-h-screen bg-ink-900">
      <div className="max-w-[1440px] mx-auto px-6 py-10">
        <header className="max-w-2xl mb-8">
          <h1 className="font-display italic text-paper-50 text-3xl md:text-4xl font-light mb-2">
            {work.title}
          </h1>
          {work.shortDescription && (
            <p className="font-outfit text-paper-400 text-sm">{work.shortDescription}</p>
          )}
        </header>

        <WatchSeriesClient work={work} seasons={seasons} />
      </div>
    </div>
  );
}
