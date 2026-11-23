import { useEffect, useState } from "react";
import { ArrowRight, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { catalogApi } from "../../api";
import { categoryAnchorId, DEFAULT_CATEGORIES, slugifyCategory } from "../../utils/categories";
import Button from "../ui/Button";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    catalogApi
      .categories()
      .then(({ data }) => {
        if (Array.isArray(data) && data.length) setCategories(data);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="mt-10 border-t border-forest-100 sm:mt-14">
      <section className="relative overflow-hidden bg-forest-900 text-white">
        <img
          src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1600&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-900/95 to-forest-900/80" />
        <div className="container-app relative flex flex-col items-center px-4 py-14 text-center sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fresh-400">Local &amp; seasonal</p>
          <h2 className="mt-3 max-w-lg font-display text-3xl font-bold leading-tight sm:text-4xl">
            Taste what&apos;s growing near you
          </h2>
          <p className="mt-3 max-w-md text-sm text-forest-200 sm:text-base">
            Discover farm-fresh produce, dairy, and pantry staples from trusted growers in one place.
          </p>
          <Link to={{ pathname: "/", hash: "#catalog" }} className="mt-7">
            <Button variant="fresh" size="lg" className="rounded-full px-7">
              Browse the catalog
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="bg-cream-50">
        <div className="container-app grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-14">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-800 text-white">
                <Leaf className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-bold text-forest-900">FarmFresh</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-forest-600">
              Your neighborhood organic marketplace for produce, dairy, eggs, and pantry goods.
            </p>
          </div>

          <FooterColumn title="Explore">
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/wishlist">Wishlist</FooterLink>
            <FooterLink to="/cart">Cart</FooterLink>
            <FooterLink to="/orders">Orders</FooterLink>
            <FooterLink to="/checkout">Checkout</FooterLink>
          </FooterColumn>

          <FooterColumn title="Categories">
            {categories.map((cat) => {
              const slug = slugifyCategory(cat);
              return (
                <FooterLink
                  key={slug}
                  id={`footer-${categoryAnchorId(cat)}`}
                  to={{
                    pathname: "/",
                    search: `?category=${encodeURIComponent(slug)}`,
                    hash: "#catalog",
                  }}
                >
                  {cat}
                </FooterLink>
              );
            })}
          </FooterColumn>

          <div>
            <p className="font-display text-sm font-semibold text-forest-900">Growers</p>
            <p className="mt-4 text-sm leading-relaxed text-forest-600">
              Manage products, stock, and orders from the operator dashboard.
            </p>
            <Link
              to="/admin/login"
              className="mt-3 inline-flex text-sm font-semibold text-forest-800 underline decoration-forest-300 underline-offset-4 transition-colors hover:text-fresh-600"
            >
              Sign in to admin
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-forest-100 bg-white">
        <div className="container-app flex flex-col items-center justify-between gap-3 py-5 text-center text-xs text-forest-500 sm:flex-row sm:text-left">
          <p>© {year} FarmFresh. Proudly supporting local agriculture.</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 sm:justify-end">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "auto" })}
              className="transition-colors hover:text-forest-800"
            >
              Shop
            </Link>
            <Link
              to="/cart"
              onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "auto" })}
              className="transition-colors hover:text-forest-800"
            >
              Cart
            </Link>
            <Link to="/admin/login" className="transition-colors hover:text-forest-800">
              Admin
            </Link>
          </div>
        </div>
      </section>
    </footer>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div>
      <p className="font-display text-sm font-semibold text-forest-900">{title}</p>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ to, id, children }) {
  const hash = typeof to === "object" ? to.hash || "" : "";

  return (
    <li>
      <Link
        id={id}
        to={to}
        onClick={() => {
          if (hash) return;
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }}
        className="text-sm font-medium text-forest-600 transition-colors hover:text-forest-900"
      >
        {children}
      </Link>
    </li>
  );
}
