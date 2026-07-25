const DEFAULT_SITE_URL = "https://pc-barbershop.ru";

/**
 * Canonical site origin from NEXT_PUBLIC_APP_URL (no trailing slash).
 * Used by metadata, sitemap, robots, and JSON-LD so prod/preview stay in sync.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!raw) return DEFAULT_SITE_URL;

  try {
    return new URL(raw).origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}
