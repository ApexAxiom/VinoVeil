import { useState } from "react";
import { useCart } from "../context/CartContext";

type HeaderProps = {
  onOpenCart: () => void;
};

const navLinks = [
  { label: "Story", href: "#top" },
  { label: "Craftsmanship", href: "#craft" },
  { label: "Benefits", href: "#benefits" },
  { label: "Shop", href: "#shop" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" }
];

const Icon = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" className="h-7 w-7 text-gold">
    {children}
  </svg>
);

const LogoMark = () => (
  <div className="flex items-center gap-3">
    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-night/60">
      <Icon>
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path
          d="M12 10.5h8m-6 0c0 2.4.8 4.1 2 4.1s2-1.7 2-4.1M10.5 21.5c3.3-1.3 7.7-1.3 11 0"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Icon>
    </span>
    <div className="leading-tight">
      <p className="font-serif text-xl md:text-2xl text-gold">VinoVeil</p>
      <p className="text-[0.6rem] uppercase tracking-[0.42em] text-parchment/50">Outdoor Cellar Essentials</p>
    </div>
  </div>
);

export const Header = ({ onOpenCart }: HeaderProps) => {
  const { itemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (href: string) => {
    const target = document.querySelector(href);
    if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const NavLinks = ({ orientation = "row" }: { orientation?: "row" | "col" }) => (
    <nav
      className={`flex ${orientation === "row" ? "items-center gap-8" : "flex-col gap-6"}`}
      aria-label="Primary"
    >
      {navLinks.map((link) => (
        <button
          key={link.href}
          className="text-xs uppercase tracking-[0.35em] text-parchment/70 transition hover:text-gold"
          onClick={() => {
            handleNavClick(link.href);
            setIsOpen(false);
          }}
        >
          {link.label}
        </button>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-gold/10 bg-night">
        <p className="section-container py-2 text-center text-[0.7rem] uppercase tracking-[0.32em] text-gold/80">
          Complimentary U.S. shipping over $50 · 30-day satisfaction promise
        </p>
      </div>
      <div className="border-b border-gold/10 bg-night/80 backdrop-blur-xl">
        <div className="section-container flex items-center justify-between py-4">
          <LogoMark />
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            <NavLinks />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCart}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-parchment transition hover:border-gold hover:text-gold"
              aria-label="Open cart"
            >
              <Icon>
                <path
                  d="M8.5 9h15l-1.6 12.5H10.1L8.5 9zm5-3c0-1.4 1-2.5 2.5-2.5S18.5 4.6 18.5 6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </Icon>
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold px-1 text-[0.65rem] font-semibold text-night">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              className="lg:hidden rounded-full border border-gold/40 p-2 text-parchment transition hover:border-gold hover:text-gold"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Toggle navigation"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 7h16M4 12h16M4 17h12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="lg:hidden" id="mobile-menu">
          <div
            className="fixed inset-0 z-30 bg-black/70"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-x-0 top-[4.6rem] z-40 bg-espresso/95 px-6 pb-10 pt-6 shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-serif text-xl text-gold">Navigation</p>
                <p className="text-[0.65rem] uppercase tracking-[0.32em] text-parchment/50">Explore</p>
              </div>
              <button
                className="rounded-full border border-gold/40 p-2 text-parchment transition hover:text-gold"
                onClick={() => setIsOpen(false)}
                aria-label="Close navigation"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M6 6l12 12M6 18 18 6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="mt-8 space-y-8 text-left">
              <NavLinks orientation="col" />
              <button
                onClick={() => {
                  onOpenCart();
                  setIsOpen(false);
                }}
                className="button-secondary w-full"
              >
                View cart
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
