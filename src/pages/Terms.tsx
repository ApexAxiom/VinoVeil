import { Helmet } from "react-helmet-async";

export function Terms() {
  return (
    <div className="section-container space-y-4">
      <Helmet>
        <title>Terms | VinoVeil</title>
      </Helmet>
      <h1 className="font-serif text-4xl">Terms & Conditions</h1>
      <p className="text-sm text-parchment/70">
        By placing an order, you agree to our fulfillment timelines and return policy. For support,
        contact hello@vinoveil.com.
      </p>
    </div>
  );
}
