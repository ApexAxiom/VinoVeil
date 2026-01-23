import { Helmet } from "react-helmet-async";

export function ShippingReturns() {
  return (
    <div className="section-container space-y-4">
      <Helmet>
        <title>Shipping & Returns | VinoVeil</title>
      </Helmet>
      <h1 className="font-serif text-4xl">Shipping & Returns</h1>
      <p className="text-sm text-parchment/70">
        Orders ship within 2-3 business days. Returns are accepted within 30 days of delivery.
        Contact us for a prepaid label and care instructions.
      </p>
    </div>
  );
}
