import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

export type CartItem = {
  variantId: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

const CART_STORAGE_KEY = "vinoveil_cart_v2";

function loadInitialCart(): CartState {
  const defaultState: CartState = { items: [] };

  if (typeof window === "undefined") {
    return defaultState;
  }

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return defaultState;
    const parsed = JSON.parse(stored) as CartState;
    if (!parsed?.items) return defaultState;
    return { items: parsed.items };
  } catch (error) {
    console.error("Failed to load cart from storage", error);
    return defaultState;
  }
}

type CartAction =
  | { type: "ADD"; variantId: string; quantity: number }
  | { type: "UPDATE"; variantId: string; quantity: number }
  | { type: "REMOVE"; variantId: string }
  | { type: "CLEAR" };

interface CartContextValue {
  items: CartItem[];
  addItem: (variantId: string, quantity: number) => void;
  updateItem: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextValue>({
  items: [],
  addItem: () => undefined,
  updateItem: () => undefined,
  removeItem: () => undefined,
  clearCart: () => undefined,
  itemCount: 0
});

/** Reducer used for cart state updates. */
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((item) => item.variantId === action.variantId);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.variantId === action.variantId
              ? { ...item, quantity: item.quantity + action.quantity }
              : item
          )
        };
      }
      return { items: [...state.items, { variantId: action.variantId, quantity: action.quantity }] };
    }
    case "UPDATE": {
      return {
        items: state.items
          .map((item) =>
            item.variantId === action.variantId ? { ...item, quantity: action.quantity } : item
          )
          .filter((item) => item.quantity > 0)
      };
    }
    case "REMOVE":
      return { items: state.items.filter((item) => item.variantId !== action.variantId) };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

/** Cart provider for localStorage-backed cart state. */
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialCart);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: state.items }));
    } catch (error) {
      console.error("Failed to persist cart", error);
    }
  }, [state.items]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items: state.items,
      addItem: (variantId: string, quantity: number) =>
        dispatch({ type: "ADD", variantId, quantity }),
      updateItem: (variantId: string, quantity: number) =>
        dispatch({ type: "UPDATE", variantId, quantity }),
      removeItem: (variantId: string) => dispatch({ type: "REMOVE", variantId }),
      clearCart: () => dispatch({ type: "CLEAR" }),
      itemCount
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/** Hook to use cart context. */
export const useCart = () => useContext(CartContext);
