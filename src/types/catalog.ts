export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  features: string[];
  primaryImage: string;
  galleryImages: string[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  title: string;
  priceCents: number;
  currency: string;
  active: boolean;
}

export interface CartLineItem {
  variantId: string;
  quantity: number;
}
