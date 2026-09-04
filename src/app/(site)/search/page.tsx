import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchClient } from "@/components/search/SearchClient";

export const metadata: Metadata = {
  title: "Search",
  description: "Search NEXONIC works and journal posts.",
};

export default function SearchPage() {
  return (
    <div className="px-margin-mobile md:px-margin-desktop py-xl flex flex-col gap-lg">
      <header className="max-w-2xl flex flex-col gap-xs">
        <h1 className="font-display-hero-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface">
          Search
        </h1>
      </header>

      {/* useSearchParams requires a Suspense boundary in the App Router */}
      <Suspense fallback={null}>
        <SearchClient />
      </Suspense>
    </div>
  );
}
