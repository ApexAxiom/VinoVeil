import { useEffect, useState } from "react";
import { dataClient, userDataOptions } from "../lib/dataClient";
import type { Order } from "../types/amplify";

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error?: string;
}

/** Load authenticated user's orders. */
export function useOrders() {
  const [state, setState] = useState<OrdersState>({ orders: [], loading: true });

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const models = dataClient.models as unknown as {
          Order: {
            list: (
              options: typeof userDataOptions
            ) => Promise<{ data?: Order[] | null }> | { data?: Order[] | null };
          };
        };
        const orders = await Promise.resolve(models.Order.list(userDataOptions));
        if (!active) return;
        setState({ orders: orders.data ?? [], loading: false });
      } catch (error) {
        if (!active) return;
        setState({ orders: [], loading: false, error: (error as Error).message });
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  return state;
}
