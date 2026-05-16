import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { isShopifyPurchaseConfigured, resolveShopifyPrimaryPurchaseUrl } from "../config/commerce";
import { useCart } from "../context/CartContext";
import { useProducts } from "../hooks/useProducts";
import { calculateTotals } from "../lib/cartTotals";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  onBeginCheckout: () => void;
};

const focusSelectors = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';

export const CartDrawer = ({ open, onClose, onBeginCheckout }: CartDrawerProps) => {
  const navigate = useNavigate();
  const { items, updateItem, removeItem } = useCart();
  const { products, variants } = useProducts();
  const drawerRef = useRef<HTMLDivElement>(null);
  const { subtotalCents } = calculateTotals(items, variants, 0, 0);
  const subtotal = subtotalCents / 100;
  const shopifyUrl = resolveShopifyPrimaryPurchaseUrl();
  const useShopifyCheckout = isShopifyPurchaseConfigured() && Boolean(shopifyUrl);

  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusable = drawer.querySelectorAll<HTMLElement>(focusSelectors);
    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }

      if (event.key === "Tab") {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const goShop = () => {
    navigate("/vino-veil");
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-espresso shadow-2xl shadow-black/60 ring-1 ring-gold/20"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gold/15 px-6 py-5">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-gold/70">Your VinoVeil cart</p>
              <h2 className="font-serif text-2xl text-parchment">Cart preview</h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="rounded-full border border-gold/30 p-2 text-parchment transition hover:border-gold hover:text-gold"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 6l12 12M6 18 18 6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-parchment/70">
                <p>Your cart is empty. When Shopify checkout is enabled, you can also purchase from the product page.</p>
                <button type="button" className="button-secondary" onClick={goShop}>
                  View VinoVeil
                </button>
              </div>
            ) : (
              items.map((item) => {
                const variant = variants.find((entry) => entry.id === item.variantId);
                const product = products.find((entry) => entry.id === variant?.productId);
                const productName = product?.name ?? "VinoVeil Glass Cover";
                const variantTitle = variant?.title ?? "Bundle";
                const unitPrice = variant ? variant.priceCents / 100 : 0;

                return (
                  <div
                    key={item.variantId}
                    className="rounded-3xl border border-gold/20 bg-night/40 p-4 shadow-inner shadow-black/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="h-14 w-14 overflow-hidden rounded-2xl border border-gold/25 bg-night/70">
                          <img
                            src={product?.primaryImage ?? "/hero-vinoveil.jpg"}
                            alt={productName}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-parchment">{productName}</p>
                          <p className="text-sm text-parchment/60">
                            {variantTitle} · ${unitPrice.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                      <button
                        className="text-sm text-gold transition hover:text-parchment"
                        onClick={() => removeItem(item.variantId)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-gold/30 bg-night/60 px-2 py-1">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${productName}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-amber/10 text-gold transition hover:bg-amber/20"
                          onClick={() => updateItem(item.variantId, Math.max(1, item.quantity - 1))}
                        >
                          –
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${productName}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-amber/10 text-gold transition hover:bg-amber/20"
                          onClick={() => updateItem(item.variantId, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <p className="text-lg font-semibold text-parchment">
                        ${(item.quantity * unitPrice).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-gold/20 bg-night/60 px-6 py-6">
            <div className="space-y-3 text-parchment">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-parchment/70">
                <span>Shipping & tax</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gold">
                <span>Estimated total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-parchment/50">
                {useShopifyCheckout
                  ? "Shopify checkout opens in a new tab when you continue."
                  : "This cart is a preview. Final purchase will move to Shopify once configured."}
              </p>
              <button
                type="button"
                className="button-primary block w-full text-center disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => {
                  if (useShopifyCheckout && shopifyUrl) {
                    window.open(shopifyUrl, "_blank", "noopener,noreferrer");
                  } else {
                    onBeginCheckout();
                  }
                }}
              >
                {useShopifyCheckout ? "Continue to Shopify" : "Continue (preview checkout)"}
              </button>
              <button type="button" className="button-secondary w-full" onClick={goShop}>
                Continue shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
