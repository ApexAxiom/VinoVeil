import { Link, NavLink } from "react-router-dom";
import { Button } from "../ui/Button";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" }
];

/** Site header with primary navigation. */
export function Header() {
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-night/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <Link to="/" className="font-serif text-2xl text-gold">
          VinoVeil
        </Link>
        <nav className="hidden items-center gap-6 text-sm uppercase tracking-[0.2em] text-parchment/70 md:flex">
          {navLinks.map((link) => (
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
        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="relative inline-flex items-center rounded-full border border-gold/50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gold"
          >
            Cart
            <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-[0.6rem] font-semibold text-night">
              {itemCount}
            </span>
          </Link>
          {user ? (
            <Button variant="ghost" size="sm" onClick={signOut}>
              Sign out
            </Button>
          ) : (
            <Link to="/auth/sign-in">
              <Button variant="secondary" size="sm">
                Account
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
