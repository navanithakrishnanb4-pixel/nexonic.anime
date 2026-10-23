import Image from "next/image";

/**
 * Official NEXONIC logo, from the supplied artwork (public/logo.png and
 * public/logo-mark.png — both cleaned of the source image's background,
 * stray corner mark and frame line). The artwork is designed for DARK
 * backgrounds: its dark outlines would fringe on a light one, so only
 * use these on the site's dark surfaces.
 */

/** Tiger emblem only — for headers, sidebars and other small spots. */
export function LogoMark({
  size = 32,
  className = "",
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo-mark.png"
      alt=""
      width={Math.round((size * 162) / 192)}
      height={size}
      priority={priority}
      className={`shrink-0 ${className}`}
    />
  );
}

/** Full lockup: emblem + "NEXONIC ANIMATION" wordmark. */
export function LogoLockup({
  width = 200,
  className = "",
  priority = false,
}: {
  width?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo.png"
      alt="Nexonic Animation"
      width={width}
      height={Math.round((width * 520) / 425)}
      priority={priority}
      className={className}
    />
  );
}
