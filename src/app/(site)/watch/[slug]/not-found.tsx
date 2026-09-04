import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function WatchNotFound() {
  return (
    <div className="px-margin-mobile md:px-margin-desktop py-xl flex flex-col items-center gap-lg min-h-[50vh] justify-center">
      <EmptyState
        icon="search_off"
        message="We couldn't find that series. It may not be published yet, or the link may be out of date."
        className="max-w-md"
      />
      <Button href="/watch" variant="secondary">
        Back to Watch
      </Button>
    </div>
  );
}
