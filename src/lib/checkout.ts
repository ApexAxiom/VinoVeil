import type { CartLineItem, Product, ProductVariant } from "../types/catalog";
import type { Order, OrderItem } from "../types/amplify";
import { calculateTotals } from "./cartTotals";
import { dataClient, userDataOptions } from "./dataClient";

export interface DraftOrderPayload {
  items: CartLineItem[];
  shippingAddress: Record<string, unknown>;
  email: string;
  products: Product[];
  variants: ProductVariant[];
}

export interface CheckoutSession {
  url: string;
}

/**
 * Create a draft order using Amplify Data mutation or a local fallback.
 */
export async function createDraftOrder(payload: DraftOrderPayload): Promise<Order> {
  const { items, shippingAddress, email, products, variants } = payload;
  const orderItems = items.reduce<OrderItem[]>((acc, item) => {
    const variant = variants.find((entry) => entry.id === item.variantId);
    if (!variant) return acc;
    const product = products.find((entry) => entry.id === variant.productId);
    if (!product) return acc;
    acc.push({
      variantId: variant.id,
      sku: variant.sku,
      name: product.name,
      variantTitle: variant.title,
      qty: item.quantity,
      unitPriceCents: variant.priceCents,
      lineTotalCents: variant.priceCents * item.quantity,
      image: product.primaryImage
    });
    return acc;
  }, []);

  const totals = calculateTotals(items, variants);

  const fallbackOrder: Order = {
    id: crypto.randomUUID(),
    status: "PAYMENT_PENDING",
    currency: "USD",
    items: orderItems,
    subtotalCents: totals.subtotalCents,
    shippingCents: totals.shippingCents,
    taxCents: totals.taxCents,
    totalCents: totals.totalCents,
    shippingAddress,
    email,
    createdAt: new Date().toISOString()
  };

  try {
    const mutations = dataClient.mutations as unknown as {
      createDraftOrder: (input: Record<string, unknown>, options: typeof userDataOptions) =>
        | Promise<{ data: Order | null }>
        | { data: Order | null };
    };

    const response = await mutations.createDraftOrder(
      {
        items: orderItems,
        shippingAddress,
        email
      },
      userDataOptions
    );

    return response.data ?? fallbackOrder;
  } catch {
    return fallbackOrder;
  }
}

/**
 * Create a checkout session stub for Stripe integration.
 */
export async function createCheckoutSession(orderId: string): Promise<CheckoutSession> {
  try {
    const mutations = dataClient.mutations as unknown as {
      createCheckoutSession: (input: Record<string, unknown>, options: typeof userDataOptions) =>
        | Promise<{ data: CheckoutSession | null }>
        | { data: CheckoutSession | null };
    };

    const response = await mutations.createCheckoutSession({ orderId }, userDataOptions);
    if (response.data) return response.data;
  } catch {
    // Fallback to local placeholder
  }

  return { url: `/checkout/payment-placeholder?orderId=${orderId}` };
}
