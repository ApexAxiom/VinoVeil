import { Helmet } from "react-helmet-async";

export function Privacy() {
  return (
    <div className="section-container space-y-4">
      <Helmet>
        <title>Privacy Policy | VinoVeil</title>
      </Helmet>
      <h1 className="font-serif text-4xl">Privacy policy</h1>
      <p className="text-sm text-parchment/70">
        We respect your privacy. We collect only the information needed to fulfill orders and
        improve your experience. Your information is never sold.
      </p>
    </div>
  );
}
