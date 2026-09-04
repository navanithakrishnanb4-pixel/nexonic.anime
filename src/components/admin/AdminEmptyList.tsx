import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

interface AdminEmptyListProps {
  icon: string;
  message: string;
  actionLabel: string;
  actionHref: string;
}

export function AdminEmptyList({ icon, message, actionLabel, actionHref }: AdminEmptyListProps) {
  return (
    <div className="flex flex-col items-center gap-md">
      <EmptyState icon={icon} message={message} className="w-full" />
      <Button href={actionHref} variant="primary">
        {actionLabel}
      </Button>
    </div>
  );
}
