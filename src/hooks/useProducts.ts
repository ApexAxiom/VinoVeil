import { useEffect, useState } from "react";
import { dataClient, publicDataOptions } from "../lib/dataClient";
import type { Product, ProductVariant } from "../types/catalog";
import { seededProducts, seededVariants } from "../data/seedProducts";

interface ProductState {
  products: Product[];
  variants: ProductVariant[];
  loading: boolean;
  error?: string;
}

/** Load product catalog from Amplify or fallback seed data. */
export function useProducts() {
  const [state, setState] = useState<ProductState>({
    products: seededProducts,
    variants: seededVariants,
    loading: true
  });

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const products = await dataClient.models.Product.list(publicDataOptions);
        const variants = await dataClient.models.ProductVariant.list(publicDataOptions);
        if (!active) return;
        setState({
          products: (products.data as Product[]) ?? seededProducts,
          variants: (variants.data as ProductVariant[]) ?? seededVariants,
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
