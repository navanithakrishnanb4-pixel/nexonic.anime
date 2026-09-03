interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
}

/**
 * Thin wrapper around the Material Symbols Outlined font used throughout
 * the Stitch design. Centralizing this means the font import only has to
 * be declared once (see app/layout.tsx) instead of per-page <link> tags.
 */
export function Icon({ name, className = "", filled = false, size }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{
        fontVariationSettings: filled ? "'FILL' 1" : undefined,
        fontSize: size ? `${size}px` : undefined,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
