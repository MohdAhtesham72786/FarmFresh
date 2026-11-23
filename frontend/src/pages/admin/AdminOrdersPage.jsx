import { useEffect, useState } from "react";
import { adminOrdersApi } from "../../api";
import Alert from "../../components/ui/Alert";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatCurrency } from "../../utils/format";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminOrdersApi
      .list()
      .then(({ data }) => setOrders(data))
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-forest-900">Orders</h1>
      <p className="mt-1 text-sm text-forest-500">All customer checkouts, newest first.</p>

      {error && (
        <div className="mt-6">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-card">
        {loading ? (
          <div className="space-y-4 p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="p-12 text-center text-sm text-forest-500">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-forest-100 bg-cream-50/90 text-left text-[11px] font-semibold uppercase tracking-wide text-forest-500">
                  <th className="px-5 py-4">Order</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="min-w-[12rem] px-5 py-4">Items</th>
                  <th className="px-5 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-100/80">
                {orders.map((order) => (
                  <tr key={order.id} className="align-top transition-colors hover:bg-cream-50/60">
                    <td className="px-5 py-5">
                      <div className="space-y-1.5">
                        <p className="font-semibold text-forest-900">#{order.id}</p>
                        <p className="text-xs leading-relaxed text-forest-400">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="space-y-1.5">
                        <p className="font-medium text-forest-800">{order.customer_name}</p>
                        <p className="text-xs leading-relaxed text-forest-500">{order.customer_email}</p>
                        <p className="text-xs leading-relaxed text-forest-500">{order.customer_phone}</p>
                      </div>
                    </td>
                    <td className="px-5 py-5 text-forest-600">
                      <ul className="space-y-2">
                        {order.items.map((item) => (
                          <li key={`${order.id}-${item.product_name}`} className="leading-relaxed">
                            {item.product_name} × {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-5 py-5 text-right align-top">
                      <p className="font-display text-base font-semibold tabular-nums text-forest-900">
                        {formatCurrency(order.grand_total)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}