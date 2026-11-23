import { useEffect, useState } from "react";
import { Boxes, CircleDollarSign, Package, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { adminDashboardApi } from "../../api";
import StatCard from "../../components/admin/StatCard";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import { StatCardSkeleton } from "../../components/ui/Skeleton";
import { formatCurrency } from "../../utils/format";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await adminDashboardApi.stats();
        setStats(data);
      } catch {
        setError("Unable to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-900">Product dashboard</h1>
          <p className="mt-1 text-sm text-forest-500">Live inventory and order metrics from the API.</p>
        </div>
        <Link to="/admin/products/new">
          <Button>Add product</Button>
        </Link>
      </div>

      {error && (
        <div className="mb-6">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : stats ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total products" value={stats.total_products} icon={Package} />
            <StatCard
              label="Active"
              value={stats.active_products}
              hint={`${stats.inactive_products} inactive`}
              icon={Boxes}
            />
            <StatCard
              label="Inventory units"
              value={stats.total_inventory_units}
              hint={`${stats.low_stock_products} low stock`}
              icon={TriangleAlert}
            />
            <StatCard
              label="Catalog value"
              value={formatCurrency(stats.inventory_value)}
              hint={`${stats.out_of_stock_products} out of stock`}
              icon={CircleDollarSign}
            />
          </div>

          <div className="mt-6 rounded-3xl border border-forest-100 bg-white p-6 shadow-card">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-forest-900">Orders</h2>
                <p className="text-sm text-forest-500">Live checkout activity from the API.</p>
              </div>
              <Link to="/admin/orders" className="text-sm font-semibold text-fresh-600 hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-cream-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-forest-400">Total orders</p>
                <p className="mt-1 font-display text-2xl font-bold text-forest-900">{stats.total_orders}</p>
              </div>
              <div className="rounded-2xl bg-cream-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-forest-400">Revenue</p>
                <p className="mt-1 font-display text-2xl font-bold text-forest-900">{formatCurrency(stats.total_revenue)}</p>
              </div>
              <div className="rounded-2xl bg-cream-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-forest-400">Today</p>
                <p className="mt-1 font-display text-2xl font-bold text-forest-900">{stats.orders_today}</p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}