import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/**
 * Global not-found, per Next.js convention lives at the app root so it
 * catches any route that matches no page — including ones outside
 * (site)/admin entirely, like a typo'd URL. Route-specific not-found
 * states (e.g. app/(site)/works/[slug]/not-found.tsx) already get the
 * full public chrome for free via the (site) layout; this one doesn't,
 * because it renders under the minimal root layout, so it includes its
 * own lightweight header rather than leaving the page chrome-less.
 */
export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-center h-16 border-b border-white/5">
        <Link
          href="/"
          className="text-headline-md font-headline-md font-bold tracking-tight text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded"
        >
          NEXONIC
        </Link>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center gap-lg px-margin-mobile text-center py-xl">
        <Icon name="signal_disconnected" className="text-outline-variant opacity-50" size={48} />
        <div className="flex flex-col gap-xs max-w-md">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
            Signal Lost
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </p>
        </div>

        <nav aria-label="Suggested pages" className="flex flex-wrap justify-center gap-sm pt-sm">
          <Button href="/" variant="primary">
            Home
          </Button>
          <Button href="/works" variant="secondary">
            Works
          </Button>
          <Button href="/journal" variant="secondary">
            Journal
          </Button>
          <Button href="/watch" variant="secondary">
            Watch
          </Button>
        </nav>
      </main>
    </div>
  );
}
