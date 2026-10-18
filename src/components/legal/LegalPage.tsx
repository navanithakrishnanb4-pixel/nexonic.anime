export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  items?: string[];
}

interface LegalPageProps {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}

/**
 * Shared layout for the Privacy and Terms pages: dark header band
 * (same pattern as Journal/Works) over a light paper reading column.
 * Static content only — nothing here touches the database.
 */
export function LegalPage({ title, intro, updated, sections }: LegalPageProps) {
  return (
    <div className="min-h-screen">
      <div className="bg-ink-900 border-b border-white/5 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <p className="font-outfit text-neon-violet-soft text-[11px] font-semibold tracking-widest uppercase mb-2">
            Legal
          </p>
          <h1 className="font-display italic text-paper-50 text-5xl font-light mb-3">{title}</h1>
          <p className="font-outfit text-paper-400 text-sm">Last updated: {updated}</p>
        </div>
      </div>

      <div className="bg-paper-100">
        <div className="max-w-3xl mx-auto px-6 py-14">
          <p className="font-outfit text-ink-700 text-lg leading-relaxed mb-12">{intro}</p>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <section key={section.heading}>
                <h2 className="font-display font-semibold text-ink-900 text-xl mb-3">
                  {i + 1}. {section.heading}
                </h2>
                {section.paragraphs?.map((p) => (
                  <p key={p} className="font-outfit text-ink-700 text-base leading-relaxed mb-3">
                    {p}
                  </p>
                ))}
                {section.items && (
                  <ul className="list-disc pl-6 space-y-2">
                    {section.items.map((item) => (
                      <li key={item} className="font-outfit text-ink-700 text-base leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
