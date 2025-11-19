import { Product, useCart } from "../context/CartContext";
import { ProductCard } from "./ProductCard";

const products: Product[] = [
  {
    id: "four-pack",
    name: "VinoVeil 4 Pack",
    description: "A set for intimate pours and sunset tastings.",
    price: 24,
    details: ["Premium mesh material", "Top rack dishwasher safe", "Fits most standard wine glasses"]
  },
  {
    id: "eight-pack",
    name: "VinoVeil 8 Pack",
    description: "Perfect for dinner parties and patio soirées.",
    price: 42,
    details: [
      "Hand-finished metallic trim",
      "Dishwasher safe on gentle cycle",
      "Stacks neatly in any bar cart"
    ]
  },
  {
    id: "twelve-pack",
    name: "VinoVeil 12 Pack (Entertainer Set)",
    description: "Complete coverage for weddings, tastings, and events.",
    price: 58,
    details: [
      "Durable reusable mesh",
      "Includes velvet storage pouch",
      "Stable weight keeps cover in place"
    ]
  }
];

export const Shop = () => {
  const { addItem } = useCart();

  return (
    <section id="shop" className="section-container space-y-10">
      <div className="flex flex-col items-center text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-gold">Shop VinoVeil</p>
        <h2 className="font-serif text-3xl text-parchment sm:text-4xl">Choose your set</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={addItem} />
        ))}
      </div>
    </section>
  );
};
