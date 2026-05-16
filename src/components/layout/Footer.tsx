import { Link } from "react-router-dom";

const links = [
  { label: "Shipping & Returns", to: "/shipping-returns" },
  { label: "Privacy", to: "/privacy" },
  { label: "Terms", to: "/terms" }
];

/** Global site footer. */
export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-night/80">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="font-serif text-2xl text-gold">VinoVeil</p>
            <p className="mt-3 text-sm text-parchment/70">
              Premium wine glass covers that keep your evenings elegant and undisturbed.
            </p>
          </div>
          <div className="space-y-2 text-sm text-parchment/70">
            <p className="text-xs uppercase tracking-[0.2em] text-gold/70">Explore</p>
            <Link className="block transition hover:text-parchment" to="/vino-veil">
              Buy VinoVeil
            </Link>
            <Link className="block transition hover:text-parchment" to="/shop">
              Catalog
            </Link>
            <Link className="block transition hover:text-parchment" to="/faq">
              FAQ
            </Link>
            <Link className="block transition hover:text-parchment" to="/contact">
              Contact
            </Link>
          </div>
          <div className="space-y-2 text-sm text-parchment/70">
            <p className="text-xs uppercase tracking-[0.2em] text-gold/70">Policies</p>
            {links.map((link) => (
              <Link key={link.to} className="block transition hover:text-parchment" to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <p className="mt-10 text-xs uppercase tracking-[0.3em] text-parchment/50">
          © 2026 VinoVeil. Crafted for slow pours and golden evenings.
        </p>
      </div>
    </footer>
  );
}
