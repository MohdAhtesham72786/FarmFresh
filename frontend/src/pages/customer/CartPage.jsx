import { Link } from "react-router-dom";
import { ShoppingCart, Trash2 } from "lucide-react";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import QuantityStepper from "../../components/ui/QuantityStepper";
import { Skeleton } from "../../components/ui/Skeleton";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/format";
import ProductImage from "../../components/ui/ProductImage";

export default function CartPage() {
  const { cart, loading, error, updateQty, removeItem, grandTotal, itemCount } = useCart();
  const items = cart?.items ?? [];

  if (loading && !cart) {
    return (
      <div className="container-app py-8">
        <Skeleton className="mb-4 h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container-app py-8 sm:py-10">
      <h1 className="font-display text-3xl font-bold text-forest-900">Your cart</h1>
      <p className="mt-2 text-forest-500">Review items before checkout. Totals are calculated by the API.</p>

      {error && (
        <div className="mt-6">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            description="Explore the shop and add farm-fresh products."
            action={
              <Link to="/">
                <Button>Go to shop</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 pb-24 md:grid-cols-[1fr_300px] md:pb-0 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="grid gap-4 rounded-3xl border border-forest-100 bg-white p-4 shadow-card sm:grid-cols-[96px_1fr_auto] sm:p-5"
              >
                <ProductImage
                  src={item.image_url}
                  name={item.product_name}
                  category={item.category}
                  className="h-24 w-full rounded-2xl object-cover sm:w-24"
                />
                <div>
                  <h2 className="font-semibold text-forest-900">{item.product_name}</h2>
                  <p className="text-sm text-forest-500">{item.farmer_name}</p>
                  <p className="mt-1 text-sm font-medium text-forest-700">{formatCurrency(item.unit_price)} each</p>
                  <p className="text-xs text-forest-400">Max {item.available_quantity}</p>
                  <div className="mt-3">
                    <QuantityStepper
                      value={item.quantity}
                      min={1}
                      max={item.available_quantity}
                      onChange={(next) => updateQty(item.id, next)}
                    />
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-end">
                  <p className="font-display text-xl font-semibold text-forest-800">
                    {formatCurrency(item.line_total)}
                  </p>
                  <Button variant="danger" size="sm" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </article>
            ))}
          </div>

          <aside className="hidden h-fit rounded-3xl border border-forest-100 bg-white p-6 shadow-card md:sticky md:top-24 md:block">
            <h2 className="font-display text-xl font-semibold text-forest-900">Order summary</h2>
            <div className="mt-4 space-y-2 text-sm text-forest-600">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{itemCount}</span>
              </div>
              <div className="flex justify-between border-t border-forest-100 pt-3 text-base font-bold text-forest-900">
                <span>Grand total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>
            <Link to="/checkout" className="mt-5 block">
              <Button className="w-full rounded-full" size="lg">
                Proceed to checkout
              </Button>
            </Link>
            <Link to="/" className="mt-2 block">
              <Button variant="ghost" className="w-full rounded-full">
                Continue shopping
              </Button>
            </Link>
          </aside>

          <aside className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-forest-100 bg-white/95 p-4 shadow-elevated backdrop-blur md:hidden">
            <div>
              <p className="text-xs font-medium text-forest-500">{itemCount} items</p>
              <p className="font-display text-lg font-bold text-forest-900">{formatCurrency(grandTotal)}</p>
            </div>
            <Link to="/checkout">
              <Button size="lg">Checkout</Button>
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}