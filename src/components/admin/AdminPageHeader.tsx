import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-semibold text-paper-50">{title}</h1>
        {description && <p className="font-outfit text-paper-500 text-sm mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}
