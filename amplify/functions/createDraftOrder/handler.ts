import type { Handler } from "aws-lambda";

interface DraftOrderInput {
  arguments: {
    items: Array<{
      variantId: string;
      qty: number;
    }>;
    shippingAddress: Record<string, unknown>;
    email: string;
  };
}

/**
 * Draft order creation handler.
 * TODO: Look up variants in DB and compute totals securely.
 */
export const handler: Handler<DraftOrderInput> = async (event) => {
  const { items, shippingAddress, email } = event.arguments;

  // TODO: Fetch variant pricing from DynamoDB.
  // TODO: STRIPE_SECRET_KEY usage will be in checkout session handler.

  const subtotalCents = 0;
  const shippingCents = 800;
  const taxCents = 0;
  const totalCents = subtotalCents + shippingCents + taxCents;

  return {
    id: crypto.randomUUID(),
    status: "PAYMENT_PENDING",
    currency: "USD",
    items,
    subtotalCents,
    shippingCents,
    taxCents,
    totalCents,
    shippingAddress,
    email
  };
};
