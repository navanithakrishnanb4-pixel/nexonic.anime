import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

/**
 * Rendered automatically by Next.js when `notFound()` is called inside
 * app/works/[slug]/page.tsx — covers both "slug doesn't exist" and
 * (right now) "zero works exist at all." Reuses EmptyState rather than
 * a bespoke 404 layout, and never fabricates a work to fill the page.
 */
export default function WorkNotFound() {
  return (
    <div className="px-margin-mobile md:px-margin-desktop py-xl flex flex-col items-center gap-lg min-h-[50vh] justify-center">
      <EmptyState
        icon="search_off"
        message="We couldn't find that work. It may not be published yet, or the link may be out of date."
        className="max-w-md"
      />
      <Button href="/works" variant="secondary">
        Back to Works
      </Button>
    </div>
  );
}
