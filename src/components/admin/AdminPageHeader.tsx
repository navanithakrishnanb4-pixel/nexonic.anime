import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-sm">
      <div>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">{title}</h1>
        {description && (
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
