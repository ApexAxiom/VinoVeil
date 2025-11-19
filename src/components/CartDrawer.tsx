import { useCart } from "../context/CartContext";

const CloseIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="h-6 w-6 text-parchment"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 6l12 12M6 18 18 6" />
  </svg>
);

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/your-placeholder";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { items, cartTotal, updateItem, removeItem } = useCart();
  const shipping = items.length ? 6 : 0;
  const grandTotal = cartTotal + shipping;

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-cocoa p-6 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-gold">Your Cart</h2>
          <button onClick={onClose} aria-label="Close cart">
            <CloseIcon />
          </button>
        </div>
        <div className="mt-6 space-y-4 overflow-y-auto">
          {items.length === 0 && <p className="text-parchment/70">Your cart is empty.</p>}
          {items.map((item) => (
            <div key={item.product.id} className="rounded-2xl border border-parchment/10 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-parchment">{item.product.name}</p>
                <button className="text-sm text-gold hover:underline" onClick={() => removeItem(item.product.id)}>
                  Remove
                </button>
              </div>
              <p className="text-sm text-parchment/70">{item.product.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <label className="text-sm text-parchment/70">
                  Qty
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) =>
                      updateItem(item.product.id, Math.max(1, Number(event.target.value)))
                    }
                    className="input-base mt-2 w-24"
                  />
                </label>
                <p className="text-lg font-semibold text-parchment">
                  ${(item.quantity * item.product.price).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-3 border-t border-parchment/10 pt-4 text-parchment">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shipping === 0 ? "—" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-gold">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
          <button
            disabled={!items.length}
            className="button-primary w-full disabled:cursor-not-allowed disabled:border-gold/30 disabled:bg-gold/40"
            onClick={() => window.open(STRIPE_PAYMENT_LINK, "_blank")}
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
};
