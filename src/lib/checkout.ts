import type { CartLineItem, Product, ProductVariant } from "../types/catalog";
import type { Order } from "../types/amplify";
import { apiRequest } from "./api";

export interface DraftOrderPayload {
  items: CartLineItem[]; shippingAddress: Record<string, unknown>; email: string;
  products: Product[]; variants: ProductVariant[];
}
export interface CheckoutSession { url: string }

/** Unfinished server checkout must never become a fabricated local order. */
export async function createDraftOrder(payload: DraftOrderPayload): Promise<Order> {
  const response = await apiRequest<{ data: Order }>("/api/orders/draft", {
    items: payload.items, shippingAddress: payload.shippingAddress, email: payload.email
  });
  return response.data;
}
export async function createCheckoutSession(orderId: string): Promise<CheckoutSession> {
  const response = await apiRequest<{ data: CheckoutSession }>("/api/checkout", { orderId });
  return response.data;
}
