import { describe, expect, it } from "vitest";
import { calculateTotals } from "../lib/cartTotals";

const variants = [
  { id: "v1", productId: "p1", sku: "SKU1", title: "4-Pack", priceCents: 2500, currency: "USD", active: true },
  { id: "v2", productId: "p1", sku: "SKU2", title: "8-Pack", priceCents: 4500, currency: "USD", active: true }
];

describe("calculateTotals", () => {
  it("computes totals", () => {
    const totals = calculateTotals(
      [
        { variantId: "v1", quantity: 2 },
        { variantId: "v2", quantity: 1 }
      ],
      variants,
      800,
      0
    );
    expect(totals.subtotalCents).toBe(9500);
    expect(totals.totalCents).toBe(10300);
  });
});
