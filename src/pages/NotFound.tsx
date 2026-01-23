import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="section-container space-y-4">
      <h1 className="font-serif text-4xl">Page not found</h1>
      <p className="text-sm text-parchment/70">The page you're looking for isn't here.</p>
      <Link to="/" className="text-gold">
        Return home
      </Link>
    </div>
  );
}
