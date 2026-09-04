import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWorkForWatch } from "@/lib/watch-data";
import { WatchSeriesClient } from "@/components/watch/WatchSeriesClient";

interface WatchDetailPageProps {
  params: { slug: string };
}

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
    <div className="px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-lg">
      <header className="max-w-2xl flex flex-col gap-xs">
        <h1 className="font-display-hero-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface">
          {work.title}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {work.shortDescription}
        </p>
      </header>

      <WatchSeriesClient work={work} seasons={seasons} />
    </div>
  );
}
