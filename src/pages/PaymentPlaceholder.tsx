import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card } from "../components/ui/Card";
import { buttonSurfaceClassName } from "../components/ui/Button";

export function PaymentPlaceholder() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="section-container space-y-8">
      <Helmet>
        <title>Payment Placeholder | VinoVeil</title>
      </Helmet>
      <Card padding="lg" className="space-y-4">
        <h1 className="font-serif text-3xl text-gold">Payment step coming soon</h1>
        <p className="text-sm text-parchment/70">
          Stripe integration is on deck. Your order has been created and is waiting for payment.
        </p>
        {orderId ? (
          <p className="text-xs uppercase tracking-[0.2em] text-parchment/60">
            Order ID: {orderId}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/account/orders"
            className={buttonSurfaceClassName({ variant: "secondary", size: "md" })}
          >
            View orders
          </Link>
          <Link to="/shop" className={buttonSurfaceClassName({ variant: "primary", size: "md" })}>
            Continue shopping
          </Link>
        </div>
      </Card>
    </div>
  );
}
