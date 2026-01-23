import type { Product, ProductVariant } from "../types/catalog";

export const seededProducts: Product[] = [
  {
    id: "vino-veil",
    slug: "vinoveil",
    name: "VinoVeil Glass Cover",
    shortDescription: "Elegant mesh cover that keeps fruit flies and curious breezes away.",
    description:
      "VinoVeil pairs a delicate gold-rimmed mesh with a secure elastic edge to protect every pour. Designed for alfresco sipping, tastings, and quiet nights on the terrace.",
    features: [
      "Fine mesh barrier keeps insects out",
      "Elastic edge fits standard wine glasses",
      "Reusable, washable, and travel-ready",
      "Lightweight silhouette with gold accents"
    ],
    primaryImage: "/vinoveil-product-1.jpg",
    galleryImages: [
      "/vinoveil-product-1.jpg",
      "/vinoveil-product-2.jpg",
      "/vinoveil-product-3.jpg",
      "/vinoveil-mesh-gold-halo.png"
    ]
  }
];

export const seededVariants: ProductVariant[] = [
  {
    id: "vino-veil-4",
    productId: "vino-veil",
    sku: "VV-4PK",
    title: "4-Pack",
    priceCents: 3200,
    currency: "USD",
    active: true
  },
  {
    id: "vino-veil-8",
    productId: "vino-veil",
    sku: "VV-8PK",
    title: "8-Pack",
    priceCents: 5600,
    currency: "USD",
    active: true
  },
  {
    id: "vino-veil-12",
    productId: "vino-veil",
    sku: "VV-12PK",
    title: "12-Pack",
    priceCents: 7800,
    currency: "USD",
    active: true
  }
];
