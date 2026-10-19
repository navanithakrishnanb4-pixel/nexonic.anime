import Link from "next/link";

export function AdminBackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="font-outfit inline-flex items-center gap-1.5 text-sm text-paper-500 hover:text-paper-200 transition-colors w-fit focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-violet rounded"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
      {label}
    </Link>
  );
}
