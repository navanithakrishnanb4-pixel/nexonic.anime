interface JournalArticleBodyProps {
  content: string;
}

/**
 * Renders plain-text/paragraph content at a readable measure. Content
 * is split on blank lines into paragraphs rather than piped through
 * dangerouslySetInnerHTML — there's no rich-text editor yet (Step 17
 * explicitly avoids adding one), so `content` is expected to be plain
 * text for now. When a real content format (Markdown/HTML from a rich
 * editor) is decided later, this is the one place that needs to change.
 */
export function JournalArticleBody({ content }: JournalArticleBodyProps) {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="max-w-2xl mx-auto px-margin-mobile md:px-0 flex flex-col gap-md">
      {paragraphs.map((paragraph, i) => (
        <p key={i} className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
