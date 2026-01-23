import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { createDraftOrder } from "../functions/createDraftOrder/resource";
import { createCheckoutSession } from "../functions/createCheckoutSession/resource";

const schema = a.schema({
  Product: a
    .model({
      slug: a.string().required(),
      name: a.string().required(),
      shortDescription: a.string().required(),
      description: a.string().required(),
      features: a.string().array().required(),
      active: a.boolean().required(),
      primaryImage: a.string().required(),
      galleryImages: a.string().array().required(),
      seoTitle: a.string(),
      seoDescription: a.string(),
      variants: a.hasMany("ProductVariant", "productId")
    })
    .authorization((allow) => [allow.publicApiKey().to(["read"]), allow.group("ADMINS")]),
  ProductVariant: a
    .model({
      productId: a.id().required(),
      sku: a.string().required(),
      title: a.string().required(),
      priceCents: a.integer().required(),
      currency: a.string().default("USD"),
      inventory: a.integer(),
      active: a.boolean().required(),
      product: a.belongsTo("Product", "productId")
    })
    .authorization((allow) => [allow.publicApiKey().to(["read"]), allow.group("ADMINS")]),
  UserProfile: a
    .model({
      owner: a.string().required(),
      email: a.string().required(),
      fullName: a.string(),
      defaultShippingAddress: a.json(),
      marketingOptIn: a.boolean().default(false)
    })
    .authorization((allow) => [allow.owner(), allow.group("ADMINS").to(["read"]) ]),
  Order: a
    .model({
      status: a.enum(["PAYMENT_PENDING", "PAID", "FULFILLED", "CANCELLED", "REFUNDED"]),
      currency: a.string().default("USD"),
      items: a.json().required(),
      subtotalCents: a.integer().required(),
      shippingCents: a.integer().required(),
      taxCents: a.integer().required(),
      totalCents: a.integer().required(),
      shippingAddress: a.json().required(),
      email: a.string().required()
    })
    .authorization((allow) => [allow.owner(), allow.group("ADMINS")]),
  ContactMessage: a
    .model({
      name: a.string().required(),
      email: a.string().required(),
      message: a.string().required()
    })
    .authorization((allow) => [allow.publicApiKey().to(["create"]), allow.group("ADMINS")]),
  createDraftOrder: a
    .mutation()
    .arguments({
      items: a.json().required(),
      shippingAddress: a.json().required(),
      email: a.string().required()
    })
    .returns(a.ref("Order"))
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(createDraftOrder)),
  createCheckoutSession: a
    .mutation()
    .arguments({
      orderId: a.id().required()
    })
    .returns(
      a.customType({
        url: a.string().required()
      })
    )
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(createCheckoutSession))
});

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30
    }
  }
});

export type Schema = ClientSchema<typeof data.schema>;
