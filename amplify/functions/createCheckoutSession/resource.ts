import { defineFunction } from "@aws-amplify/backend";

/** Lambda for creating a checkout session stub. */
export const createCheckoutSession = defineFunction({
  name: "createCheckoutSession",
  entry: "./handler.ts"
});
