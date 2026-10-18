import Link from "next/link";

export default function JournalArticleNotFound() {
  return (
    <div className="min-h-screen bg-paper-100 flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-display italic text-ink-900 text-4xl mb-4">Article Not Found</h1>
        <p className="font-outfit text-ink-500 text-sm mb-4">
          It may not be published yet, or the link may be out of date.
        </p>
        <Link href="/journal" className="font-outfit text-neon-violet hover:text-neon-pink transition-colors text-sm font-medium">
          ← Back to Journal
        </Link>
      </div>
    </div>
  );
}
