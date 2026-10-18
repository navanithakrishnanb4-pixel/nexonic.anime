import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchClient } from "@/components/search/SearchClient";

export const metadata: Metadata = {
  title: "Search",
  description: "Search NEXONIC works and journal posts.",
};

export default function SearchPage() {
  return (
    // useSearchParams requires a Suspense boundary in the App Router
    <Suspense fallback={<div className="min-h-screen bg-ink-900" />}>
      <SearchClient />
    </Suspense>
  );
}
