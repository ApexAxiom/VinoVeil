import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, buttonSurfaceClassName } from "../ui/Button";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const desktopNavLinks = [
  { label: "Home", to: "/" },
  { label: "Buy VinoVeil", to: "/vino-veil" },
  { label: "Catalog", to: "/shop" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" }
];

/** Site header with primary navigation. */
export function Header() {
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-night/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <Link to="/" className="shrink-0 font-serif text-2xl text-gold" onClick={closeMobile}>
          VinoVeil
        </Link>

        <nav className="hidden items-center gap-6 text-sm uppercase tracking-[0.2em] text-parchment/70 md:flex">
          {desktopNavLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "text-gold" : "transition hover:text-parchment"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/cart"
            className="relative inline-flex items-center rounded-full border border-gold/50 px-3 py-2 text-xs uppercase tracking-[0.2em] text-gold sm:px-4"
            onClick={closeMobile}
          >
            Cart
            <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-[0.6rem] font-semibold text-night">
              {itemCount}
            </span>
          </Link>
          {user ? (
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={signOut}>
              Sign out
            </Button>
          ) : (
            <Link
              to="/auth/sign-in"
              className={`hidden sm:inline-flex ${buttonSurfaceClassName({ variant: "secondary", size: "sm" })}`}
              onClick={closeMobile}
            >
              Account
            </Link>
          )}

          <button
            type="button"
            className="inline-flex rounded-full border border-gold/40 p-2 text-parchment transition hover:border-gold hover:text-gold md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 6l12 12M6 18 18 6" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-nav"
          className="border-t border-white/5 bg-night/95 px-4 py-6 md:hidden"
        >
          <nav className="flex flex-col gap-1 text-sm uppercase tracking-[0.2em] text-parchment/80">
            {desktopNavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-3 ${isActive ? "bg-gold/10 text-gold" : "hover:bg-white/5"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/auth/sign-in"
              className="mt-2 rounded-xl px-3 py-3 hover:bg-white/5"
              onClick={closeMobile}
            >
              Account
            </Link>
            {user ? (
              <button
                type="button"
                className="mt-1 rounded-xl px-3 py-3 text-left hover:bg-white/5"
                onClick={() => {
                  closeMobile();
                  signOut();
                }}
              >
                Sign out
              </button>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
