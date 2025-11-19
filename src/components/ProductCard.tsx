import { useState } from "react";
import { Product } from "../context/CartContext";

type ProductCardProps = {
  product: Product;
  onAdd: (product: Product, quantity: number) => void;
};

export const ProductCard = ({ product, onAdd }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="glass-card flex h-full flex-col rounded-[32px] p-6 text-parchment">
      <div className="space-y-4">
        {product.badge && (
          <span className="inline-flex items-center rounded-full border border-gold/40 px-3 py-1 text-xs uppercase tracking-[0.4em] text-gold/80">
            {product.badge}
          </span>
        )}
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl text-parchment">{product.name}</h3>
          <p className="text-3xl font-semibold text-gold">${product.price.toFixed(2)}</p>
        </div>
        <p className="text-parchment/70">{product.description}</p>
        <ul className="space-y-2 text-sm text-parchment/80">
          {product.details.map((detail) => (
            <li key={detail} className="flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="gold-divider my-6" />
      <div className="mt-auto flex flex-col gap-3">
        <label className="text-sm text-parchment/70">
          Quantity
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}
            className="input-base mt-2 bg-night/60"
          />
        </label>
        <button
          onClick={() => {
            onAdd(product, quantity);
            setQuantity(1);
          }}
          className="button-primary"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
