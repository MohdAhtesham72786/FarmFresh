import { useEffect, useState } from "react";
import { Heart, Leaf, ShoppingBasket, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import ProductImage from "../ui/ProductImage";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { formatCurrency } from "../../utils/format";

export default function ProductCard({ product }) {
  const { addToCart, cart } = useCart();
  const { isSaved, toggle } = useWishlist();
  const outOfStock = product.available_quantity < 1;
  const lowStock = !outOfStock && product.available_quantity <= 10;
  const saved = isSaved(product.id);
  const cartItem = cart?.items?.find((item) => item.product_id === product.id);
  const inCartQty = cartItem?.quantity ?? 0;
  const remaining = Math.max(0, product.available_quantity - inCartQty);
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [wishBusy, setWishBusy] = useState(false);
  const [localError, setLocalError] = useState("");

  const canAdd = !outOfStock && remaining > 0;

  const onWishlist = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (wishBusy) return;
    setWishBusy(true);
    await toggle(product.id);
    setWishBusy(false);
  };

  useEffect(() => {
    if (!justAdded) return undefined;
    const timer = setTimeout(() => setJustAdded(false), 1600);
    return () => clearTimeout(timer);
  }, [justAdded]);

  const onAdd = async () => {
    setLocalError("");
    if (!canAdd) {
      setLocalError(outOfStock ? "This product is out of stock." : "No more units available. Open the cart to change quantity.");
      return;
    }
    setAdding(true);
    const res = await addToCart(product.id, 1);
    setAdding(false);
    if (res.ok) setJustAdded(true);
    else setLocalError(res.error || "Could not add to cart.");
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-forest-200 hover:shadow-elevated">
      <div className="relative overflow-hidden">
        <Link to={`/products/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-cream-100">
          <ProductImage
            src={product.image_url}
            name={product.name}
            category={product.category}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/25 via-transparent to-transparent" />
        </Link>
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-forest-800 shadow-sm">
          {product.category}
        </span>
        <button
          type="button"
          onClick={onWishlist}
          disabled={wishBusy}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className={`absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 ${
            saved
              ? "border-red-200 bg-white text-red-500"
              : "border-white/80 bg-white/95 text-forest-500 hover:text-red-500"
          }`}
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-red-500 animate-heart-pop" : ""}`} />
        </button>
        {outOfStock && (
          <span className="absolute bottom-3 left-3 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-semibold text-white">
            Sold out
          </span>
        )}
        {lowStock && (
          <span className="absolute bottom-3 left-3 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-semibold text-white">
            Low stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <h3 className="font-display text-base font-semibold leading-snug text-forest-900 sm:text-[17px]">
          <Link to={`/products/${product.id}`} className="transition-colors hover:text-fresh-600">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-forest-500">
          <Leaf className="h-3.5 w-3.5 text-fresh-600" />
          {product.farmer_name}
        </p>

        <div className="mt-3 flex items-end justify-between gap-3">
          <p className="font-display text-xl font-semibold text-forest-800">{formatCurrency(product.price)}</p>
          <p className={`text-xs font-medium ${outOfStock ? "text-red-600" : "text-forest-400"}`}>
            {outOfStock ? "Out of stock" : `${product.available_quantity} in stock`}
          </p>
        </div>

        {inCartQty > 0 && (
          <p className="mt-1 text-xs font-medium text-fresh-700">{inCartQty} in cart</p>
        )}

        {localError && <p className="mt-2 text-xs font-medium text-red-600">{localError}</p>}

        <div className="mt-auto pt-3">
          {inCartQty > 0 ? (
            <Link to="/cart" className="block">
              <Button variant="fresh" size="sm" className="w-full rounded-full">
                <ShoppingCart className="h-4 w-4" />
                {justAdded ? "Added · Go to cart" : "Go to cart"}
              </Button>
            </Link>
          ) : (
            <Button
              variant="fresh"
              size="sm"
              className="w-full rounded-full"
              disabled={!canAdd || adding}
              onClick={onAdd}
            >
              <ShoppingBasket className="h-4 w-4" />
              {adding ? "Adding…" : "Add to cart"}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}