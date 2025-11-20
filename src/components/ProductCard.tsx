import { useState } from "react";
import { Product } from "../context/CartContext";

type ProductCardProps = {
  product: Product;
  onAdd: (product: Product, quantity: number) => void;
};

export const ProductCard = ({ product, onAdd }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const bullets = product.details;

  const changeQuantity = (delta: number) => {
    setQuantity((prev) => Math.min(10, Math.max(1, prev + delta)));
  };

  return (
    <div className="glass-card flex h-full flex-col rounded-[30px] overflow-hidden text-parchment">
      {product.image && (
        <div className="relative w-full overflow-hidden aspect-[4/5] sm:aspect-[3/4] bg-night/40 px-4 py-6 sm:px-6 sm:py-8 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain"
            onError={(e) => {
              // Fallback to hero image if product image doesn't exist
              const target = e.target as HTMLImageElement;
              if (target.src !== window.location.origin + "/hero-vinoveil.jpg") {
                target.src = "/hero-vinoveil.jpg";
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-transparent" />
          {product.badge && (
            <span className="absolute top-4 right-4 pill-tag">{product.badge}</span>
          )}
        </div>
      )}
      <div className="flex h-full flex-col p-6">
        <div className="space-y-5">
          {!product.image && product.badge && <span className="pill-tag">{product.badge}</span>}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl text-parchment">{product.name}</h3>
              <p className="mt-2 text-parchment/70">{product.description}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-semibold text-gold">${product.price.toFixed(0)}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-parchment/50">/ set</p>
            </div>
          </div>
        </div>
        <ul className="space-y-2 text-sm text-parchment/80">
          {bullets.map((detail) => (
            <li key={detail} className="flex items-start gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
        <div className="gold-divider my-6" />
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-parchment/70">Quantity</span>
            <div className="flex items-center gap-2 rounded-full border border-gold/30 bg-night/40 px-2 py-1">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-amber/10 text-gold transition hover:bg-amber/20"
                onClick={() => changeQuantity(-1)}
              >
                –
              </button>
              <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-amber/10 text-gold transition hover:bg-amber/20"
                onClick={() => changeQuantity(1)}
              >
                +
              </button>
            </div>
          </div>
          <button
            className="button-primary w-full"
            onClick={() => {
              onAdd(product, quantity);
              setQuantity(1);
            }}
          >
            Add to cart
          </button>
          <p className="text-center text-[0.75rem] uppercase tracking-[0.25em] text-parchment/55">Ready to ship in 3 business days</p>
        </div>
      </div>
    </div>
  );
};
