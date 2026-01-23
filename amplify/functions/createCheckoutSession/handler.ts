import type { Handler } from "aws-lambda";

interface CheckoutSessionInput {
  arguments: {
    orderId: string;
  };
}

/**
 * Checkout session stub.
 * TODO: STRIPE_SECRET_KEY and Stripe Checkout Session creation.
 * TODO: Add webhook to mark order paid.
 */
export const handler: Handler<CheckoutSessionInput> = async (event) => {
  const { orderId } = event.arguments;

  return {
    url: `/checkout/payment-placeholder?orderId=${orderId}`
  };
};
