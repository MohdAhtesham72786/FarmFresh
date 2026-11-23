import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Receipt } from "lucide-react";
import { ordersApi } from "../../api";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { describeApiError } from "../../utils/apiError";
import { formatCurrency } from "../../utils/format";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    ordersApi
      .list()
      .then(({ data }) => setOrders(data))
      .catch((err) =>
        setError(describeApiError(err, "Could not load orders for this session.")),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-app py-6 sm:py-10">
      <h1 className="font-display text-3xl font-bold text-forest-900">Your orders</h1>
      <p className="mt-2 text-forest-500">Orders placed from this browser session.</p>

      {error && (
        <div className="mt-6">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      {loading ? (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Receipt}
            title="No orders yet"
            description="Checkout from your cart to place the first order."
            action={
              <Link to="/">
                <Button>Browse products</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-3xl border border-forest-100 bg-white p-5 shadow-card sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold text-forest-900">Order #{order.id}</h2>
                  <p className="text-sm text-forest-500">
                    {new Date(order.created_at).toLocaleString()} · {order.customer_name}
                  </p>
                </div>
                <p className="font-display text-xl font-bold text-forest-800">{formatCurrency(order.grand_total)}</p>
              </div>
              <ul className="mt-4 space-y-1 text-sm text-forest-600">
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.product_id}-${item.product_name}`} className="flex justify-between gap-3">
                    <span>
                      {item.product_name} × {item.quantity}
                    </span>
                    <span className="font-medium text-forest-800">{formatCurrency(item.line_total)}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}