/**
 * Canonical public URL of the site, used for metadata, the sitemap and
 * structured data. Set NEXT_PUBLIC_SITE_URL to the real production domain
 * (e.g. https://nexonic.studio). If it isn't set, falls back to the
 * production URL Vercel exposes at build time, and finally localhost.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
export const SITE_NAME = "Nexonic Animation";
