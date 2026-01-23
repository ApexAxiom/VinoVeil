import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Price } from "../components/ui/Price";
import { useOrders } from "../hooks/useOrders";

export function OrderDetail() {
  const { id } = useParams();
  const { orders } = useOrders();
  const order = orders.find((item) => item.id === id);

  if (!order) {
    return (
      <div className="section-container space-y-4">
        <p className="text-parchment/70">Order not found.</p>
        <Link to="/account/orders" className="text-gold">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="section-container space-y-8">
      <Helmet>
        <title>Order {order.id} | VinoVeil</title>
      </Helmet>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl">Order details</h1>
        <span className="text-xs uppercase tracking-[0.2em] text-gold/70">{order.status}</span>
      </div>
      <Card padding="lg" className="space-y-4">
        {order.items.map((item) => (
          <div key={item.variantId} className="flex items-center justify-between text-sm">
            <div>
              <p className="text-ivory">{item.name}</p>
              <p className="text-parchment/60">{item.variantTitle}</p>
            </div>
            <p className="text-parchment/70">Qty {item.qty}</p>
            <Price amountCents={item.lineTotalCents} />
          </div>
        ))}
        <div className="border-t border-white/10 pt-4 text-sm text-parchment/70">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <Price amountCents={order.subtotalCents} />
          </div>
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <Price amountCents={order.shippingCents} />
          </div>
          <div className="flex items-center justify-between">
            <span>Tax</span>
            <Price amountCents={order.taxCents} />
          </div>
          <div className="flex items-center justify-between text-ivory">
            <span>Total</span>
            <Price amountCents={order.totalCents} />
          </div>
        </div>
      </Card>
    </div>
  );
}
