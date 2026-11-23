import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Heart, Leaf, Menu, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import ScrollToTop from "../components/ScrollToTop";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import CatalogSearchBar from "../components/customer/CatalogSearchBar";
import SiteFooter from "../components/customer/SiteFooter";
import Alert from "../components/ui/Alert";

export default function CustomerLayout() {
  const { itemCount, toast } = useCart();
  const { itemCount: wishCount } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search, location.hash]);

  const navClass = ({ isActive }) =>
    `rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
      isActive ? "bg-forest-800 text-white" : "text-forest-700 hover:bg-cream-100"
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <ScrollToTop />
      <header className="sticky top-0 z-40 border-b border-forest-100/80 bg-white/90 backdrop-blur-md">
        <div className="container-app flex h-auto min-h-16 flex-wrap items-center justify-between gap-3 py-2 md:py-0 md:h-16">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-800 text-white">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-forest-900">FarmFresh</span>
          </Link>

          <CatalogSearchBar className="order-last w-full md:order-none md:mx-3 md:max-w-2xl md:flex-1" />

          <nav className="hidden items-center gap-1 md:flex md:shrink-0">
            <NavLink to="/" end className={navClass}>
              Shop
            </NavLink>
            <NavLink to="/orders" className={navClass}>
              Orders
            </NavLink>
            <NavLink to="/admin/login" className={navClass}>
              Admin
            </NavLink>
            <Link
              to="/wishlist"
              className="relative ml-1 inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-forest-700 transition-colors hover:text-forest-900"
            >
              <Heart className="h-4 w-4" />
              Wishlist
              {wishCount > 0 && (
                <span className="text-xs font-bold text-fresh-700">{wishCount}</span>
              )}
            </Link>
            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-forest-700 transition-colors hover:text-forest-900"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              {itemCount > 0 && (
                <span className="text-xs font-bold text-fresh-700">{itemCount}</span>
              )}
            </Link>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <Link to="/wishlist" className="relative rounded-full border border-forest-200 p-2 text-forest-700" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              {wishCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-fresh-600 text-[9px] font-bold text-white">
                  {wishCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative rounded-full border border-forest-200 p-2 text-forest-700" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-fresh-600 text-[9px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="rounded-full border border-forest-200 p-2 text-forest-700"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-forest-100 bg-white px-4 py-3 md:hidden" aria-label="Mobile">
            <div className="flex flex-col gap-1">
              <NavLink to="/" end className={navClass} onClick={() => setMenuOpen(false)}>
                Shop
              </NavLink>
              <NavLink to="/orders" className={navClass} onClick={() => setMenuOpen(false)}>
                Orders
              </NavLink>
              <NavLink to="/wishlist" className={navClass} onClick={() => setMenuOpen(false)}>
                Wishlist {wishCount > 0 ? `(${wishCount})` : ""}
              </NavLink>
              <NavLink to="/cart" className={navClass} onClick={() => setMenuOpen(false)}>
                Cart {itemCount > 0 ? `(${itemCount})` : ""}
              </NavLink>
              <NavLink to="/admin/login" className={navClass} onClick={() => setMenuOpen(false)}>
                Admin
              </NavLink>
            </div>
          </nav>
        )}
      </header>

      {toast && (
        <div className="fixed bottom-4 left-1/2 z-50 w-[min(24rem,calc(100%-2rem))] -translate-x-1/2">
          <Alert tone={toast.tone}>{toast.message}</Alert>
        </div>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      <SiteFooter />
    </div>
  );
}