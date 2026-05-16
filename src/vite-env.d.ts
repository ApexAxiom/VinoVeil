/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHOPIFY_STORE_URL?: string;
  readonly VITE_SHOPIFY_PRODUCT_HANDLE?: string;
  readonly VITE_SHOPIFY_PRODUCT_URL?: string;
  readonly VITE_SHOPIFY_BUY_BUTTON_URL?: string;
  readonly VITE_ENABLE_SHOPIFY_CHECKOUT?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_WAITLIST_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
