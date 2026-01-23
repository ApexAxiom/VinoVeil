import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "../components/ui/Button";
import { QuantityStepper } from "../components/ui/QuantityStepper";
import { Price } from "../components/ui/Price";
import { useCart } from "../context/CartContext";
import { useProducts } from "../hooks/useProducts";
import { calculateTotals } from "../lib/cartTotals";

export function Cart() {
  const { items, updateItem, removeItem } = useCart();
  const { products, variants } = useProducts();
  const navigate = useNavigate();

  const cartVariants = variants.filter((variant) =>
    items.some((item) => item.variantId === variant.id)
  );
  const totals = calculateTotals(items, cartVariants);

  if (items.length === 0) {
    return (
      <div className="section-container space-y-4">
        <Helmet>
          <title>Your Cart | VinoVeil</title>
        </Helmet>
        <h1 className="font-serif text-3xl">Your cart is empty</h1>
        <Link to="/shop" className="text-gold">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="section-container space-y-8">
      <Helmet>
        <title>Your Cart | VinoVeil</title>
      </Helmet>
      <h1 className="font-serif text-4xl">Your cart</h1>
      <div className="grid gap-8 lg:grid-cols-[1.5fr_0.5fr]">
        <div className="space-y-4">
          {items.map((item) => {
            const variant = variants.find((entry) => entry.id === item.variantId);
            const product = products.find((entry) => entry.id === variant?.productId);
            if (!variant || !product) return null;
            return (
              <div
                key={item.variantId}
                className="flex flex-col gap-4 rounded-[32px] border border-gold/20 bg-cocoa/70 p-6 md:flex-row md:items-center"
              >
                <img
                  src={product.primaryImage}
                  alt={product.name}
                  className="h-28 w-28 rounded-3xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-serif text-xl text-ivory">{product.name}</p>
                  <p className="text-sm text-parchment/70">{variant.title}</p>
                  <p className="text-sm text-parchment/70">
                    <Price amountCents={variant.priceCents} />
                  </p>
                </div>
                <QuantityStepper
                  value={item.quantity}
                  onChange={(value) => updateItem(item.variantId, value)}
                />
                <button
                  type="button"
                  className="text-sm text-gold"
                  onClick={() => removeItem(item.variantId)}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
        <div className="rounded-[32px] border border-gold/20 bg-cocoa/80 p-6 text-sm text-parchment/70">
          <h2 className="font-serif text-2xl text-ivory">Order summary</h2>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <Price amountCents={totals.subtotalCents} />
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <Price amountCents={totals.shippingCents} />
            </div>
            <div className="flex items-center justify-between">
              <span>Tax</span>
              <Price amountCents={totals.taxCents} />
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base text-ivory">
              <span>Total</span>
              <Price amountCents={totals.totalCents} />
            </div>
          </div>
          <Button className="mt-6 w-full" onClick={() => navigate("/checkout")}> 
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
