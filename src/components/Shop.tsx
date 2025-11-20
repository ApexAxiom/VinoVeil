import { Product, useCart } from "../context/CartContext";
import { ProductCard } from "./ProductCard";

const products: Product[] = [
  {
    id: "four-pack",
    name: "VinoVeil 4 Set",
    description: "For couples and sunset tastings.",
    price: 24,
    details: ["Hand-finished mesh and halo", "Fits most stems and coupes", "Includes soft storage pouch"]
  },
  {
    id: "eight-pack",
    name: "VinoVeil 8 Set",
    description: "For dinner parties and long weekends.",
    price: 42,
    details: ["Most popular among hosts", "Taste-neutral stainless mesh", "Stacks neatly between pours"],
    badge: "Most popular"
  },
  {
    id: "twelve-pack",
    name: "VinoVeil 12 Set (Entertainer)",
    description: "For weddings, tastings, and outdoor events.",
    price: 58,
    details: ["Covers the full table", "Reusable, rinse and dry", "Arrives boxed with care instructions"],
    badge: "Event ready"
  }
];

export const Shop = () => {
  const { addItem } = useCart();

  return (
    <section id="shop" className="section-container space-y-10">
      <div className="flex flex-col items-center text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-gold/70">Shop Vino Veil</p>
        <h2 className="font-serif text-3xl text-parchment sm:text-4xl">Choose your set.</h2>
        <p className="mt-3 max-w-2xl text-parchment/70">
          Limited production runs keep quality uncompromised. Each set arrives in a recyclable box with care instructions.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={addItem} />
        ))}
      </div>
    </section>
  );
};
