import { useEffect, useState } from "react";
import { ArrowLeft, Heart, Leaf, ShoppingBasket, ShoppingCart } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { catalogApi } from "../../api";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import QuantityStepper from "../../components/ui/QuantityStepper";
import { Skeleton } from "../../components/ui/Skeleton";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { formatCurrency } from "../../utils/format";
import ProductImage from "../../components/ui/ProductImage";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { isSaved, toggle } = useWishlist();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    catalogApi
      .get(id)
      .then(({ data }) => {
        setProduct(data);
        setQty(1);
        setAdded(false);
        setFeedback("");
      })
      .catch(() => setError("This product is unavailable or no longer active."))
      .finally(() => setLoading(false));
  }, [id]);

  const maxQty = product?.available_quantity ?? 0;
  const inCartQty = cart?.items?.find((item) => item.product_id === product?.id)?.quantity ?? 0;
  const remaining = Math.max(0, maxQty - inCartQty);
  const outOfStock = maxQty < 1;
  const saved = product ? isSaved(product.id) : false;

  const onAdd = async () => {
    if (!product) return;
    setError("");
    if (qty > remaining) {
      setError(`Only ${remaining} more unit${remaining === 1 ? "" : "s"} available.`);
      return;
    }
    setSubmitting(true);
    setFeedback("");
    const res = await addToCart(product.id, qty);
    setSubmitting(false);
    if (res.ok) {
      setFeedback("Added to cart successfully.");
      setAdded(true);
    } else setError(res.error);
  };

  if (loading) {
    return (
      <div className="container-app grid gap-8 py-10 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="container-app py-10">
        <Alert tone="error">{error}</Alert>
        <Link to="/" className="mt-4 inline-block">
          <Button variant="ghost">Back to shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-8 sm:py-12">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-forest-600 hover:text-forest-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back to shop
      </button>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <div className="relative overflow-hidden rounded-[2rem] bg-cream-200 shadow-card">
          <ProductImage
            src={product.image_url}
            name={product.name}
            category={product.category}
            className="aspect-[4/3] w-full object-cover md:aspect-square"
          />
          <button
            type="button"
            onClick={() => toggle(product.id)}
            aria-pressed={saved}
            aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white shadow-sm transition-all hover:scale-110 active:scale-95 ${
              saved ? "border-red-200 text-red-500" : "border-forest-100 text-forest-500"
            }`}
          >
            <Heart className={`h-5 w-5 ${saved ? "fill-red-500 animate-heart-pop" : ""}`} />
          </button>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <span className="rounded-full bg-cream-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-forest-700">
            {product.category}
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-forest-900 sm:text-5xl">{product.name}</h1>
          <p className="mt-3 flex items-center gap-2 text-forest-500">
            <Leaf className="h-4 w-4 text-fresh-600" />
            Grown by <span className="font-semibold text-forest-800">{product.farmer_name}</span>
          </p>
          <p className="mt-5 font-display text-4xl font-bold text-forest-800">{formatCurrency(product.price)}</p>
          <p className={`mt-2 text-sm font-semibold ${outOfStock ? "text-red-600" : "text-fresh-600"}`}>
            {outOfStock ? "Currently out of stock" : `${maxQty} units available`}
          </p>
          <p className="mt-6 max-w-lg leading-relaxed text-forest-600">{product.description}</p>

          {maxQty > 0 && remaining > 0 && (
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-forest-400">Quantity</p>
                <QuantityStepper value={Math.min(qty, remaining)} min={1} max={remaining} onChange={setQty} />
              </div>
              {added ? (
                <Link to="/cart" className="sm:mt-6">
                  <Button variant="fresh" size="lg" className="rounded-full">
                    <ShoppingCart className="h-4 w-4" />
                    Added · Go to cart
                  </Button>
                </Link>
              ) : (
                <Button variant="fresh" size="lg" className="rounded-full sm:mt-6" disabled={submitting} onClick={onAdd}>
                  <ShoppingBasket className="h-4 w-4" />
                  {submitting ? "Adding…" : inCartQty > 0 ? "Add more" : "Add to cart"}
                </Button>
              )}
            </div>
          )}
          {inCartQty > 0 && remaining < 1 && maxQty > 0 && (
            <Link to="/cart" className="mt-8 inline-block">
              <Button variant="secondary" size="lg" className="rounded-full">
                <ShoppingCart className="h-4 w-4" />
                Go to cart
              </Button>
            </Link>
          )}

          {feedback && (
            <div className="mt-5">
              <Alert tone="success">{feedback}</Alert>
            </div>
          )}
          {error && product && (
            <div className="mt-5">
              <Alert tone="error">{error}</Alert>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}