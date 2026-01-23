import { describe, expect, it } from "vitest";
import { cartReducer } from "../context/CartContext";

const initialState = { items: [] };

describe("cartReducer", () => {
  it("adds new items", () => {
    const state = cartReducer(initialState, { type: "ADD", variantId: "v1", quantity: 2 });
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual({ variantId: "v1", quantity: 2 });
  });

  it("updates quantities", () => {
    const state = cartReducer(
      { items: [{ variantId: "v1", quantity: 1 }] },
      { type: "UPDATE", variantId: "v1", quantity: 3 }
    );
    expect(state.items[0].quantity).toBe(3);
  });

  it("removes items", () => {
    const state = cartReducer(
      { items: [{ variantId: "v1", quantity: 1 }] },
      { type: "REMOVE", variantId: "v1" }
    );
    expect(state.items).toHaveLength(0);
  });
});
