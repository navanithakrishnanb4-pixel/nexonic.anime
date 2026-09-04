import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { WorkCredit } from "@/lib/types";

interface WorkCreditsProps {
  credits: WorkCredit[];
}

export function WorkCredits({ credits }: WorkCreditsProps) {
  if (credits.length === 0) return null;

  return (
    <ScrollReveal className="px-margin-mobile md:px-margin-desktop py-lg border-t border-surface-container">
      <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Credits</h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-md">
        {credits.map((credit, i) => (
          <div key={`${credit.name}-${i}`} className="flex flex-col gap-xs">
            <dt className="font-body-md text-body-md text-on-surface">{credit.name}</dt>
            <dd className="font-caption text-caption text-on-surface-variant uppercase tracking-wide">
              {credit.role}
            </dd>
          </div>
        ))}
      </dl>
    </ScrollReveal>
  );
}
