import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { WorkCredit } from "@/lib/types";

interface WorkCreditsProps {
  credits: WorkCredit[];
}

export function WorkCredits({ credits }: WorkCreditsProps) {
  if (credits.length === 0) return null;

  return (
    <ScrollReveal className="mb-12">
      <h2 className="font-display text-xl font-semibold text-paper-50 mb-4">Credits</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {credits.map((credit, i) => (
          <div key={`${credit.name}-${i}`} className="flex flex-col gap-0.5">
            <dt className="font-outfit text-paper-200 text-sm">{credit.name}</dt>
            <dd className="font-outfit text-paper-500 text-xs uppercase tracking-wide">{credit.role}</dd>
          </div>
        ))}
      </dl>
    </ScrollReveal>
  );
}
