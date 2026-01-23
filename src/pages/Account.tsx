import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../hooks/useOrders";

export function Account() {
  const { user } = useAuth();
  const { orders } = useOrders();

  return (
    <div className="section-container space-y-8">
      <Helmet>
        <title>Account | VinoVeil</title>
      </Helmet>
      <h1 className="font-serif text-4xl">Welcome back</h1>
      <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <Card padding="lg" className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-gold/70">Profile</p>
          <p className="text-lg text-ivory">{user?.email ?? user?.username}</p>
          <p className="text-sm text-parchment/70">Membership status: VinoVeil Collector</p>
          <Link to="/account/orders" className="text-sm text-gold">
            View order history →
          </Link>
        </Card>
        <Card padding="lg" className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-gold/70">Recent orders</p>
          {orders.slice(0, 2).map((order) => (
            <div key={order.id} className="text-sm text-parchment/70">
              <p className="text-ivory">Order {order.id.slice(0, 8)}...</p>
              <p>Status: {order.status}</p>
            </div>
          ))}
          {orders.length === 0 ? (
            <p className="text-sm text-parchment/70">No orders yet.</p>
          ) : null}
          <Link to="/account/orders">
            <Button variant="secondary" size="sm">
              Manage orders
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
