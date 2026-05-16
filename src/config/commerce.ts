/**
 * Central commerce configuration for Shopify-backed checkout.
 * Set Vite env vars in `.env` locally and in Amplify Hosting environment variables for production.
 */

const trim = (value: string | undefined) => (value ?? "").trim();

const env = import.meta.env;

/** Public Shopify store hostname or full store URL, e.g. your-store.myshopify.com or https://your-store.myshopify.com */
export const SHOPIFY_STORE_URL = trim(env.VITE_SHOPIFY_STORE_URL);

/** Product handle segment used with the store URL, e.g. vino-veil-glass-cover */
export const SHOPIFY_PRODUCT_HANDLE = trim(env.VITE_SHOPIFY_PRODUCT_HANDLE);

/** Full product page URL when you prefer not to derive from store + handle */
export const SHOPIFY_PRODUCT_URL = trim(env.VITE_SHOPIFY_PRODUCT_URL);

/** Shopify Buy Button / checkout URL or cart permalink when checkout is enabled */
export const SHOPIFY_BUY_BUTTON_URL = trim(env.VITE_SHOPIFY_BUY_BUTTON_URL);

/** When true, primary purchase CTAs use Shopify URLs. When false, CTAs use the waitlist path. */
export const ENABLE_SHOPIFY_CHECKOUT = env.VITE_ENABLE_SHOPIFY_CHECKOUT === "true";

/** Optional public site origin for canonical URLs and absolute Open Graph images (no trailing slash) */
export const SITE_URL = trim(env.VITE_SITE_URL).replace(/\/$/, "");

/** Optional email for mailto waitlist; if unset, waitlist links go to /contact#waitlist */
export const WAITLIST_EMAIL = trim(env.VITE_WAITLIST_EMAIL);

function normalizeStoreBase(): string | null {
  if (!SHOPIFY_STORE_URL) return null;
  if (SHOPIFY_STORE_URL.startsWith("http://") || SHOPIFY_STORE_URL.startsWith("https://")) {
    return SHOPIFY_STORE_URL.replace(/\/$/, "");
  }
  return `https://${SHOPIFY_STORE_URL.replace(/^\/+/, "").replace(/\/$/, "")}`;
}

/**
 * Resolves the Shopify product page URL from env (explicit URL wins, then store + handle).
 */
export function resolveShopifyProductPageUrl(): string | null {
  if (SHOPIFY_PRODUCT_URL) return SHOPIFY_PRODUCT_URL;
  const base = normalizeStoreBase();
  if (base && SHOPIFY_PRODUCT_HANDLE) {
    return `${base}/products/${SHOPIFY_PRODUCT_HANDLE.replace(/^\/+|\/+$/g, "")}`;
  }
  return null;
}

/**
 * Primary URL for purchase CTAs when Shopify checkout is enabled.
 * Prefers the buy-button / checkout URL, then product page URL.
 */
export function resolveShopifyPrimaryPurchaseUrl(): string | null {
  if (!ENABLE_SHOPIFY_CHECKOUT) return null;
  if (SHOPIFY_BUY_BUTTON_URL) return SHOPIFY_BUY_BUTTON_URL;
  return resolveShopifyProductPageUrl();
}

/** True when checkout flag is on and at least one purchase URL is available. */
export function isShopifyPurchaseConfigured(): boolean {
  return Boolean(resolveShopifyPrimaryPurchaseUrl());
}

/** Destination for waitlist / coming-soon CTAs (mailto or internal contact anchor). */
export function resolveWaitlistHref(): string {
  if (WAITLIST_EMAIL) {
    const subject = encodeURIComponent("VinoVeil waitlist");
    return `mailto:${WAITLIST_EMAIL}?subject=${subject}`;
  }
  return "/contact#waitlist";
}
