import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import type { Schema } from "../src/types/amplify";
import { seededProducts, seededVariants } from "../src/data/seedProducts";

Amplify.configure(outputs);

const client = generateClient<Schema>();

/** Seed initial catalog data into Amplify Data. */
async function seed() {
  for (const product of seededProducts) {
    await client.models.Product.create({
      ...product,
      active: true
    });
  }

  for (const variant of seededVariants) {
    await client.models.ProductVariant.create(variant);
  }
}

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
