import { Heart, ShoppingBasket } from "lucide-react";
import { Link } from "react-router-dom";
import ProductImage from "../../components/ui/ProductImage";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { formatCurrency } from "../../utils/format";

export default function WishlistPage() {
  const { items, loading, error, toggle } = useWishlist();
  const { addToCart, cart } = useCart();

  const inCart = (productId) => cart?.items?.some((item) => item.product_id === productId);

  return (
    <div className="container-app py-6 sm:py-10">
      <h1 className="font-display text-3xl font-bold text-forest-900">Wishlist</h1>
      <p className="mt-2 text-forest-500">Saved products from this browser session.</p>

      {error && (
        <div className="mt-6">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      {loading ? (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Heart}
            title="No saved products yet"
            description="Tap the heart on any product card to save it here."
            action={
              <Link to="/">
                <Button>Browse products</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="grid gap-4 rounded-3xl border border-forest-100 bg-white p-4 shadow-card sm:grid-cols-[96px_1fr_auto] sm:p-5"
            >
              <Link to={`/products/${item.product_id}`}>
                <ProductImage
                  src={item.image_url}
                  name={item.product_name}
                  category={item.category}
                  className="h-24 w-full rounded-2xl object-cover sm:w-24"
                />
              </Link>
              <div>
                <Link to={`/products/${item.product_id}`} className="font-semibold text-forest-900 hover:text-fresh-600">
                  {item.product_name}
                </Link>
                <p className="text-sm text-forest-500">{item.farmer_name}</p>
                <p className="mt-1 text-sm font-medium text-forest-700">{formatCurrency(item.unit_price)}</p>
                <p className={`text-xs ${item.available_quantity < 1 ? "text-red-600" : "text-forest-400"}`}>
                  {item.available_quantity < 1 ? "Out of stock" : `${item.available_quantity} in stock`}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <Button
                  size="sm"
                  variant="fresh"
                  className="rounded-full"
                  disabled={item.available_quantity < 1 || inCart(item.product_id)}
                  onClick={() => addToCart(item.product_id, 1)}
                >
                  <ShoppingBasket className="h-4 w-4" />
                  {inCart(item.product_id) ? "In cart" : "Add to cart"}
                </Button>
                {inCart(item.product_id) && (
                  <Link to="/cart" className="text-center text-xs font-semibold text-forest-700 hover:text-fresh-600">
                    Go to cart
                  </Link>
                )}
                <Button size="sm" variant="ghost" className="rounded-full" onClick={() => toggle(item.product_id)}>
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  Remove
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}