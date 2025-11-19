import { useState } from "react";
import { Product } from "../context/CartContext";

type ProductCardProps = {
  product: Product;
  onAdd: (product: Product, quantity: number) => void;
};

export const ProductCard = ({ product, onAdd }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col rounded-3xl border border-parchment/10 bg-cocoa/70 p-6 text-parchment shadow-lg">
      <div className="space-y-3">
        <h3 className="font-serif text-2xl text-gold">{product.name}</h3>
        <p className="text-parchment/70">{product.description}</p>
        <p className="text-3xl font-semibold text-parchment">${product.price.toFixed(2)}</p>
        <ul className="space-y-2 text-sm text-parchment/80">
          {product.details.map((detail) => (
            <li key={detail} className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-gold" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <label className="text-sm text-parchment/70">
          Quantity
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}
            className="input-base mt-2"
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
