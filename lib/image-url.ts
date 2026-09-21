const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

/**
 * Normalizes any stored image URL value for safe rendering. Legacy local
 * filesystem paths (unsupported on serverless) fall back to a bundled
 * placeholder instead of attempting to read from disk. Client-safe: no
 * server-only imports, so components using it can remain client components.
 */
export function getSafeImageUrl(url?: string | null): string {
  if (!url) return PLACEHOLDER_IMAGE;
  if (url.startsWith("/api/uploads/")) return url;
  if (url.startsWith("https://")) return url;
  return PLACEHOLDER_IMAGE;
}
