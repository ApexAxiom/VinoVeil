import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  details: string[];
  badge?: string;
  image?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

const CART_STORAGE_KEY = "vinoveil_cart_v1";

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
  | { type: "ADD"; product: Product; quantity: number }
  | { type: "UPDATE"; productId: string; quantity: number }
  | { type: "REMOVE"; productId: string }
  | { type: "CLEAR" };

const CartContext = createContext<{
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  updateItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}>({
  items: [],
  addItem: () => undefined,
  updateItem: () => undefined,
  removeItem: () => undefined,
  clearCart: () => undefined,
  cartCount: 0,
  cartTotal: 0
});

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((item) => item.product.id === action.product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + action.quantity }
              : item
          )
        };
      }
      return { items: [...state.items, { product: action.product, quantity: action.quantity }] };
    }
    case "UPDATE": {
      return {
        items: state.items
          .map((item) =>
            item.product.id === action.productId
              ? { ...item, quantity: action.quantity }
              : item
          )
          .filter((item) => item.quantity > 0)
      };
    }
    case "REMOVE":
      return { items: state.items.filter((item) => item.product.id !== action.productId) };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialCart);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({ items: state.items })
      );
    } catch (error) {
      console.error("Failed to persist cart", error);
    }
  }, [state.items]);

  const value = useMemo(() => {
    const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = state.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

    return {
      items: state.items,
      addItem: (product: Product, quantity: number) => dispatch({ type: "ADD", product, quantity }),
      updateItem: (productId: string, quantity: number) =>
        dispatch({ type: "UPDATE", productId, quantity }),
      removeItem: (productId: string) => dispatch({ type: "REMOVE", productId }),
      clearCart: () => dispatch({ type: "CLEAR" }),
      cartCount,
      cartTotal
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
