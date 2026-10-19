interface IconProps {
  size?: number;
  className?: string;
}

function base(size: number, className: string | undefined, children: React.ReactNode, strokeWidth = 2) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const PlusIcon = ({ size = 14, className }: IconProps) =>
  base(size, className, <><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></>, 2.5);

export const SearchIcon = ({ size = 14, className }: IconProps) =>
  base(size, className, <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></>);

export const EyeIcon = ({ size = 13, className }: IconProps) =>
  base(size, className, <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>);

export const EditIcon = ({ size = 13, className }: IconProps) =>
  base(size, className, <><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></>);

export const TrashIcon = ({ size = 13, className }: IconProps) =>
  base(size, className, <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></>);
