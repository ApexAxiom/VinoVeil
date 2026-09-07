import { apiRequest } from './api';
import type { Product, ProductVariant } from '../types/catalog';
import type { Order } from '../types/amplify';

// These methods are the existing React consumers' complete data surface.
export const dataClient = {
  listProducts: () => apiRequest<{ data: Product[] }>('/api/products'),
  listVariants: () => apiRequest<{ data: ProductVariant[] }>('/api/variants'),
  listOrders: () => apiRequest<{ data: Order[] }>('/api/orders'),
  sendContactMessage: (input: { name: string; email: string; message: string }) =>
    apiRequest<{ data: { ok: boolean } }>('/api/contact', input),
};
