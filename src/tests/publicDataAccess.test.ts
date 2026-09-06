import { parse, valueFromASTUntyped } from "graphql";
import { describe, expect, it, vi } from "vitest";
import { schema } from "../../amplify/data/resource";
import { publicDataOptions, userDataOptions } from "../lib/dataClient";
import { sendContactMessage } from "../lib/contact";

const contact = vi.hoisted(() => vi.fn());
vi.mock("aws-amplify/data", () => ({
  generateClient: () => ({ mutations: { sendContactMessage: contact } })
}));

// Compile the actual Amplify schema, then inspect the authorization directives
// consumed by its backend transformer. No AWS resources or records are created.
const document = parse(schema.transform().schema);
function rules(typeName: string, fieldName?: string) {
  const type = document.definitions.find(
    (entry) => entry.kind === "ObjectTypeDefinition" && entry.name.value === typeName
  );
  if (!type || type.kind !== "ObjectTypeDefinition") throw new Error(`Missing ${typeName}`);
  const subject = fieldName ? type.fields?.find((field) => field.name.value === fieldName) : type;
  const directive = subject?.directives?.find((entry) => entry.name.value === "auth");
  const argument = directive?.arguments?.find((entry) => entry.name.value === "rules");
  if (!argument) throw new Error(`Missing auth for ${typeName}.${fieldName ?? "model"}`);
  return valueFromASTUntyped(argument.value) as Array<Record<string, unknown>>;
}

describe("public identity-pool access", () => {
  it.each(["Product", "ProductVariant"])("allows only catalog reads for guests and signed-in visitors on %s", (name) => {
    expect(rules(name)).toEqual([
      { allow: "public", provider: "identityPool", operations: ["read"] },
      { allow: "private", provider: "identityPool", operations: ["read"] },
      { allow: "groups", groups: ["ADMINS"] }
    ]);
  });

  it("keeps contact creation public without exposing contact records", () => {
    expect(rules("ContactMessage")).toEqual([
      { allow: "public", provider: "identityPool", operations: ["create"] },
      { allow: "private", provider: "identityPool", operations: ["create"] },
      { allow: "groups", groups: ["ADMINS"] }
    ]);
    expect(rules("Mutation", "sendContactMessage")).toEqual([
      { allow: "public", provider: "identityPool" },
      { allow: "private", provider: "identityPool" }
    ]);
  });

  it("preserves private owner and checkout access", () => {
    expect(rules("Order")).toEqual([{ allow: "owner", ownerField: "owner" }, { allow: "groups", groups: ["ADMINS"] }]);
    expect(rules("UserProfile")).toEqual([
      { allow: "owner", ownerField: "owner" },
      { allow: "groups", groups: ["ADMINS"], operations: ["read"] }
    ]);
    for (const name of ["createDraftOrder", "createCheckoutSession"]) {
      expect(rules("Mutation", name)).toEqual([{ allow: "private" }]);
    }
    expect(userDataOptions).toEqual({ authMode: "userPool" });
  });

  it("uses the public identity role without an expiring key", async () => {
    expect(publicDataOptions).toEqual({ authMode: "identityPool" });
    expect(schema.transform().schema).not.toContain("apiKey");
    const payload = { name: "Unit test", email: "unit@example.invalid", message: "Never sent to a service" };
    contact.mockResolvedValueOnce({ data: { ok: true } });
    await sendContactMessage(payload);
    expect(contact).toHaveBeenLastCalledWith(payload, { authMode: "identityPool" });
    contact.mockResolvedValueOnce({ data: null });
    await expect(sendContactMessage(payload)).rejects.toThrow("Contact message was not accepted.");
  });
});
