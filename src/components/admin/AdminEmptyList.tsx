import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

interface AdminEmptyListProps {
  icon: string;
  message: string;
  /** Omit both when there's already a create form on the same page (e.g. Announcements). */
  actionLabel?: string;
  actionHref?: string;
}

export function AdminEmptyList({ icon, message, actionLabel, actionHref }: AdminEmptyListProps) {
  return (
    <div className="flex flex-col items-center gap-md">
      <EmptyState icon={icon} message={message} className="w-full" />
      {actionLabel && actionHref && (
        <Button href={actionHref} variant="primary" className="!bg-gradient-to-r !from-neon-violet !to-neon-pink-deep !text-white !rounded-full hover:!opacity-90">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
