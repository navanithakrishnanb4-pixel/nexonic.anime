import type { Metadata } from "next";
import { WorksCatalogue } from "@/components/catalogue/WorksCatalogue";
import { getAllWorks } from "@/lib/works-data";

export const metadata: Metadata = {
  title: "Works",
  description: "Original animated worlds from NEXONIC, an independent animation studio.",
};

export default async function WorksPage() {
  const works = await getAllWorks();

  return (
    <div className="px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-lg">
      <header className="max-w-2xl flex flex-col gap-xs">
        <h1 className="font-display-hero-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface">
          Works
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Original series, films, and shorts developed in-house at NEXONIC.
        </p>
      </header>

      <WorksCatalogue works={works} />
    </div>
  );
}
