import type { CartLineItem, ProductVariant } from "../types/catalog";

export interface CalculatedTotals {
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
}

const DEFAULT_SHIPPING_CENTS = 800;

/** Calculate cart totals based on variants and quantities. */
export function calculateTotals(
  items: CartLineItem[],
  variants: ProductVariant[],
  shippingCents: number = DEFAULT_SHIPPING_CENTS,
  taxRate: number = 0
): CalculatedTotals {
  const subtotalCents = items.reduce((sum, item) => {
    const variant = variants.find((variant) => variant.id === item.variantId);
    if (!variant) return sum;
    return sum + variant.priceCents * item.quantity;
  }, 0);

  const taxCents = Math.round(subtotalCents * taxRate);
  const totalCents = subtotalCents + shippingCents + taxCents;

  return { subtotalCents, shippingCents, taxCents, totalCents };
}
