import Link from "next/link";

/**
 * Global not-found. Lives at the app root, so it renders under the
 * minimal root layout (no site chrome) and carries its own small
 * header. Route-specific not-found pages get the full chrome via the
 * (site) layout.
 */
const LINKS = [
  { label: "Home", href: "/", primary: true },
  { label: "Works", href: "/works", primary: false },
  { label: "Journal", href: "/journal", primary: false },
  { label: "Watch", href: "/watch", primary: false },
];

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-ink-950 relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-neon-violet/10 spin-slow pointer-events-none"
        aria-hidden="true"
      />

      <header className="relative z-10 flex items-center justify-center h-16 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-violet">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-violet to-neon-pink flex items-center justify-center">
            <span className="font-display font-bold text-white text-sm leading-none">N</span>
          </span>
          <span className="font-display font-semibold text-paper-50 tracking-widest uppercase text-sm">Nexonic</span>
        </Link>
      </header>

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center gap-8 px-6 text-center py-16">
        <div className="flex flex-col gap-3 max-w-md">
          <p className="font-outfit text-neon-violet-soft text-[11px] font-semibold tracking-widest uppercase">Error 404</p>
          <h1 className="font-display italic font-light text-paper-50 text-5xl">Signal Lost</h1>
          <p className="font-outfit text-paper-400 text-base">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </p>
        </div>

        <nav aria-label="Suggested pages" className="flex flex-wrap justify-center gap-3">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                l.primary
                  ? "font-outfit px-6 py-2.5 rounded-full bg-gradient-to-r from-neon-violet to-neon-pink-deep text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
                  : "font-outfit px-6 py-2.5 rounded-full border border-white/15 text-paper-200 text-sm font-medium hover:bg-white/5 hover:border-white/30 transition-all"
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
}
