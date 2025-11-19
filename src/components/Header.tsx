import { useState } from "react";
import { useCart } from "../context/CartContext";

const IconButton = ({ path, label }: { path: string; label: string }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <title>{label}</title>
    <path d={path} />
  </svg>
);

type HeaderProps = {
  onOpenCart: () => void;
};

const navLinks = [
  { label: "How it works", href: "#how" },
  { label: "Benefits", href: "#benefits" },
  { label: "Shop", href: "#shop" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" }
];

export const Header = ({ onOpenCart }: HeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, cartTotal } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-parchment/10 bg-night/95 backdrop-blur">
      <div className="section-container flex items-center justify-between py-4">
        <div className="font-serif text-2xl font-semibold text-gold">VinoVeil</div>
        <nav className="hidden items-center space-x-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm uppercase tracking-wide text-parchment/80 transition hover:text-gold"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={onOpenCart}
            className="flex items-center space-x-2 rounded-full border border-gold/50 px-4 py-2 text-sm font-semibold text-parchment transition hover:border-gold hover:text-gold"
          >
            <IconButton path="M6 7h12l-1 12H7L6 7zm3-2a3 3 0 0 1 6 0" label="Cart" />
            <span>{cartCount} items</span>
            <span className="text-gold">${cartTotal.toFixed(2)}</span>
          </button>
        </nav>
        <div className="flex items-center space-x-3 lg:hidden">
          <button
            onClick={onOpenCart}
            className="rounded-full border border-gold/50 p-2 text-parchment hover:text-gold"
            aria-label="Open cart"
          >
            <IconButton path="M6 7h12l-1 12H7L6 7zm3-2a3 3 0 0 1 6 0" label="Cart" />
          </button>
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-full border border-gold/50 p-2 text-parchment hover:text-gold"
            aria-label="Open navigation"
          >
            <IconButton path="M4 7h16M4 12h16M4 17h16" label="Menu" />
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-30 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-40 w-64 bg-cocoa p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="font-serif text-xl text-gold">VinoVeil</div>
              <button onClick={() => setMobileOpen(false)} aria-label="Close navigation" className="text-parchment">
                <IconButton path="M6 6l12 12M6 18 18 6" label="Close" />
              </button>
            </div>
            <div className="mt-8 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-semibold text-parchment/80 hover:text-gold"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
