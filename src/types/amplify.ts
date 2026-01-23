import type { Product, ProductVariant } from "./catalog";

export interface OrderItem {
  variantId: string;
  sku: string;
  name: string;
  variantTitle: string;
  qty: number;
  unitPriceCents: number;
  lineTotalCents: number;
  image?: string;
}

export interface Order {
  id: string;
  status: "PAYMENT_PENDING" | "PAID" | "FULFILLED" | "CANCELLED" | "REFUNDED";
  currency: string;
  items: OrderItem[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  shippingAddress: Record<string, unknown>;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export type Schema = {
  Product: { type: "model"; fields: Product };
  ProductVariant: { type: "model"; fields: ProductVariant };
  Order: { type: "model"; fields: Order };
};
