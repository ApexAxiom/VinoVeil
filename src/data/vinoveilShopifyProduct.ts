/**
 * Local product record intended to map to Shopify product fields later.
 * Pricing is intentionally placeholder — replace in Shopify when live.
 */

export type ShopifyProductImagePlaceholder = {
  /** Public path under /public or full CDN URL after migration */
  src: string;
  alt: string;
};

export type ShopifyVariantPlaceholder = {
  id: string;
  title: string;
  /** Temporary placeholder — actual price comes from Shopify */
  priceNote: string;
};

export const vinoveilShopifyProduct = {
  title: "VinoVeil Wine Glass Cover",
  handle: "vinoveil-wine-glass-cover",
  shortDescription:
    "A reusable mesh wine veil that rests over stemware to help keep your pour pleasant outdoors.",
  longDescription:
    "VinoVeil is designed as a simple, elegant layer for wine glasses: breathable mesh, a gentle raised outer edge, and an elastic rim so it stays in place while you relax on the patio or host at the table. Use it when you want a polished look without fuss.",
  pricePlaceholder: "Price set in Shopify (placeholder — not final)",
  variantsPlaceholder: [
    { id: "placeholder-single", title: "Example: single", priceNote: "TBD in Shopify" },
    { id: "placeholder-set", title: "Example: set / bundle", priceNote: "TBD in Shopify" }
  ] satisfies ShopifyVariantPlaceholder[],
  imagesPlaceholder: [
    {
      src: "/hero-vinoveil.jpg",
      alt: "VinoVeil mesh wine glass cover on stemware in a warm, low-light setting"
    },
    {
      src: "/vinoveil-product-1.jpg",
      alt: "VinoVeil cover fitted on a wine glass showing mesh top and rim"
    },
    {
      src: "/vinoveil-mesh-gold-halo.png",
      alt: "Detail of VinoVeil mesh and outer rim"
    }
  ] satisfies ShopifyProductImagePlaceholder[],
  dimensionsPlaceholder: "Exact dimensions to be confirmed for Shopify — placeholder only.",
  materialsPlaceholder: "Materials description to be finalized in Shopify — placeholder only.",
  careInstructions:
    "Rinse after use and wash gently by hand with mild soap; air dry before storing.",
  seoTitle: "VinoVeil | Premium reusable mesh wine glass cover",
  seoDescription:
    "Discover VinoVeil — an elegant reusable mesh wine veil for patios, dining outdoors, gifts, and gatherings. Shop-ready layout; configure Shopify to enable checkout.",
  tags: [
    "wine accessory",
    "outdoor dining",
    "patio",
    "gift",
    "mesh cover",
    "stemware",
    "VinoVeil"
  ]
} as const;

export type VinoveilShopifyProduct = typeof vinoveilShopifyProduct;
