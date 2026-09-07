import { useEffect, useState } from "react";
import { dataClient } from "../lib/dataClient";
import type { Product, ProductVariant } from "../types/catalog";

interface ProductState {
  products: Product[];
  variants: ProductVariant[];
  loading: boolean;
  error?: string;
}

/** Load the real catalog; preserve truthful empty and error states. */
export function useProducts() {
  const [state, setState] = useState<ProductState>({
    products: [],
    variants: [],
    loading: true
  });

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [products, variants] = await Promise.all([dataClient.listProducts(), dataClient.listVariants()]);
        if (!active) return;
        setState({
          products: products.data ?? [],
          variants: variants.data ?? [],
          loading: false
        });
      } catch (error) {
        if (!active) return;
        setState((current) => ({
          ...current,
          loading: false,
          error: (error as Error).message
        }));
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  return state;
}
