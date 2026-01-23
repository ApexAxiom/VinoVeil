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
        const orders = await dataClient.models.Order.list(userDataOptions);
        if (!active) return;
        setState({ orders: (orders.data as Order[]) ?? [], loading: false });
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
