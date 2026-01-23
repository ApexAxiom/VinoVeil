import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { useOrders } from "../hooks/useOrders";
import { Price } from "../components/ui/Price";

export function AccountOrders() {
  const { orders, loading } = useOrders();

  return (
    <div className="section-container space-y-6">
      <Helmet>
        <title>Order History | VinoVeil</title>
      </Helmet>
      <h1 className="font-serif text-4xl">Order history</h1>
      {loading ? <p className="text-parchment/70">Loading orders...</p> : null}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gold/70">Order</p>
              <p className="text-sm text-ivory">{order.id}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gold/70">Status</p>
              <p className="text-sm text-parchment/70">{order.status}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gold/70">Total</p>
              <p className="text-sm text-parchment/70">
                <Price amountCents={order.totalCents} />
              </p>
            </div>
            <Link to={`/orders/${order.id}`} className="text-sm text-gold">
              View details →
            </Link>
          </Card>
        ))}
        {orders.length === 0 && !loading ? (
          <Card padding="lg">
            <p className="text-sm text-parchment/70">No orders yet.</p>
            <Link to="/shop" className="text-sm text-gold">
              Start shopping
            </Link>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
