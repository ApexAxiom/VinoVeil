import { SITE_URL } from "../config/commerce";

/** Absolute URL for meta tags when `VITE_SITE_URL` is set; otherwise falls back to `window.location.origin` in the browser. */
export function getSiteOrigin(): string {
  if (SITE_URL) return SITE_URL;
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "";
}

export function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const origin = getSiteOrigin();
  if (!origin) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${origin}${path}`;
}
