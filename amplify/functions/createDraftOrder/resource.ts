import { defineFunction } from "@aws-amplify/backend";

/** Lambda for creating a draft order. */
export const createDraftOrder = defineFunction({
  name: "createDraftOrder",
  entry: "./handler.ts"
});
