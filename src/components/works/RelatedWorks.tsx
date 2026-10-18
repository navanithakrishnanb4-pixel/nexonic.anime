import { HomeWorkCard } from "@/components/works/HomeWorkCard";
import type { Work } from "@/lib/types";

interface RelatedWorksProps {
  works: Work[];
}

/** Self-omits when there's nothing real to relate — no filler cards. */
export function RelatedWorks({ works }: RelatedWorksProps) {
  if (works.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-white/5">
      <h2 className="font-display text-2xl font-semibold text-paper-50 mb-8">You Might Also Like</h2>
      <div className="shelf-scroll flex gap-5 overflow-x-auto pb-2">
        {works.map((work) => (
          <HomeWorkCard key={work.id} work={work} size="sm" />
        ))}
      </div>
    </section>
  );
}
