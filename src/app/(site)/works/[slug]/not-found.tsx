import Link from "next/link";

/**
 * Rendered by Next.js when notFound() is called inside
 * app/(site)/works/[slug]/page.tsx. Scoped to this one route, so
 * restyling it doesn't affect any other not-yet-ported page.
 */
export default function WorkNotFound() {
  return (
    <div className="min-h-[70vh] bg-ink-900 flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-display italic text-paper-50 text-4xl mb-4">Series Not Found</h1>
        <p className="font-outfit text-paper-500 text-sm mb-6">
          It may not be published yet, or the link may be out of date.
        </p>
        <Link href="/works" className="font-outfit text-neon-violet-soft hover:text-neon-pink transition-colors text-sm font-medium">
          ← Back to Works
        </Link>
      </div>
    </div>
  );
}
