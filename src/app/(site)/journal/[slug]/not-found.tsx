import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function JournalArticleNotFound() {
  return (
    <div className="px-margin-mobile md:px-margin-desktop py-xl flex flex-col items-center gap-lg min-h-[50vh] justify-center">
      <EmptyState
        icon="search_off"
        message="We couldn't find that article. It may not be published yet, or the link may be out of date."
        className="max-w-md"
      />
      <Button href="/journal" variant="secondary">
        Back to Journal
      </Button>
    </div>
  );
}
