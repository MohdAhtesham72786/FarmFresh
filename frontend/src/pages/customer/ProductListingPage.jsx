import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, PackageOpen, RefreshCw, Sprout, X } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { catalogApi } from "../../api";
import CategoryFilterBar from "../../components/customer/CategoryFilterBar";
import PriceFilterButton from "../../components/customer/PriceFilterButton";
import ProductCard from "../../components/customer/ProductCard";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { ProductCardSkeleton } from "../../components/ui/Skeleton";
import { useDebounce } from "../../hooks/useDebounce";
import { resolveCategory, slugifyCategory } from "../../utils/categories";
import { LANDING_PRODUCT_NAMES } from "../../utils/images";

function sortProducts(items, sort) {
  const list = [...items];
  if (sort === "price-asc") return list.sort((a, b) => Number(a.price) - Number(b.price));
  if (sort === "price-desc") return list.sort((a, b) => Number(b.price) - Number(a.price));
  return list.sort((a, b) => a.name.localeCompare(b.name));
}

export default function ProductListingPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchQuery = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "name";
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const category = resolveCategory(searchParams.get("category") || "", categories);
  const [priceMin, setPriceMin] = useState(null);
  const [priceMax, setPriceMax] = useState(null);

  const writeParams = useCallback(
    (patch, { replace = true, hash = location.hash } = {}) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(patch).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      const search = next.toString();
      navigate({ pathname: "/", search: search ? `?${search}` : "", hash }, { replace });
    },
    [location.hash, navigate, searchParams],
  );

  const setCategory = (name) => {
    writeParams({ category: name ? slugifyCategory(name) : "" }, { hash: "#catalog" });
  };

  useEffect(() => {
    catalogApi.categories().then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (category) params.category = category;
      const { data } = await catalogApi.list(params);
      setProducts(data);
    } catch (err) {
      if (!err.response) {
        setError(
          "Cannot reach the API. Start the backend on port 8000 (uvicorn) and keep this page on localhost:5173.",
        );
      } else {
        setError("We couldn't load products. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const isDefaultLanding = !debouncedSearch.trim() && !category;

  const priceBounds = useMemo(() => {
    if (!products.length) return { min: 0, max: 100 };
    const prices = products.map((p) => Number(p.price));
    const min = Math.floor(Math.min(...prices) * 100) / 100;
    const max = Math.ceil(Math.max(...prices) * 100) / 100;
    return { min, max: Math.max(min, max) };
  }, [products]);

  useEffect(() => {
    setPriceMin(priceBounds.min);
    setPriceMax(priceBounds.max);
  }, [priceBounds.min, priceBounds.max, debouncedSearch, category]);

  const resolvedMin = priceMin ?? priceBounds.min;
  const resolvedMax = priceMax ?? priceBounds.max;

  const priceFilterActive = resolvedMin > priceBounds.min || resolvedMax < priceBounds.max;

  const displayedProducts = useMemo(() => {
    let list;
    if (isDefaultLanding) {
      const byName = new Map(products.map((product) => [product.name, product]));
      list = LANDING_PRODUCT_NAMES.map((name) => byName.get(name)).filter(Boolean);
    } else {
      list = products;
    }
    if (priceMin != null && priceMax != null) {
      list = list.filter((p) => {
        const pr = Number(p.price);
        return pr >= priceMin && pr <= priceMax;
      });
    }
    return sortProducts(list, sort);
  }, [products, sort, isDefaultLanding, priceMin, priceMax]);

  const resetPriceRange = () => {
    setPriceMin(priceBounds.min);
    setPriceMax(priceBounds.max);
  };

  const clearFilters = () => {
    writeParams({ q: "", category: "", sort: "" }, { hash: "#catalog" });
    resetPriceRange();
  };

  const hasActiveFilters = Boolean(searchQuery.trim() || category || sort !== "name" || priceFilterActive);

  const scrollToCatalog = () => {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <section className="relative overflow-hidden text-white">
        <img
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/80 to-forest-900/40" />
        <div className="container-app relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/95 backdrop-blur">
              <Sprout className="h-3.5 w-3.5" />
              Organic marketplace
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
              Fresh from the farm to your table
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/85 sm:text-lg">
              Seasonal produce, dairy, and pantry goods from growers you can trust. Search, filter, and check out in
              minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" variant="fresh" className="rounded-full px-6" onClick={scrollToCatalog}>
                Shop the harvest
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20"
                onClick={() => {
                  setCategory("");
                  scrollToCatalog();
                }}
              >
                Browse all products
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="overflow-hidden rounded-[2rem] border border-white/20 shadow-elevated">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80"
                alt="Fresh market produce"
                className="h-80 w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <div id="catalog" className="container-app scroll-mt-24 py-8 sm:py-12">
        <div className="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-forest-900">Shop products</h2>
            <p className="mt-1 text-sm text-forest-500">
              {loading
                ? "Loading catalog…"
                : isDefaultLanding
                  ? `${displayedProducts.length} featured products`
                  : `${displayedProducts.length} product${displayedProducts.length === 1 ? "" : "s"} available`}
            </p>
          </div>
        </div>

        <CategoryFilterBar
          categories={categories}
          value={category}
          onChange={setCategory}
          trailing={
            <PriceFilterButton
              priceBounds={priceBounds}
              priceMin={resolvedMin}
              priceMax={resolvedMax}
              onPriceMinChange={setPriceMin}
              onPriceMaxChange={setPriceMax}
              onReset={resetPriceRange}
            />
          }
          showClearAll={hasActiveFilters}
          onClearAll={clearFilters}
        />

        {searchQuery.trim() && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex h-8 items-center gap-1 rounded-lg border border-forest-100 bg-white px-2.5 text-xs font-medium text-forest-700">
              “{searchQuery.trim()}”
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => writeParams({ q: "", category: searchParams.get("category") || "", sort: sort === "name" ? "" : sort })}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          </div>
        )}

        {error && (
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <Alert tone="error">{error}</Alert>
            </div>
            <Button variant="secondary" size="sm" onClick={fetchProducts} className="w-full shrink-0 sm:w-auto">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        )}

        {loading ? (
          <div className="grid gap-5 overflow-visible sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : !error && displayedProducts.length === 0 ? (
          <EmptyState
            icon={PackageOpen}
            title="No products found"
            description="Try another search, category, or clear your filters."
            action={
              hasActiveFilters ? (
                <Button variant="ghost" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : null
            }
          />
        ) : !error ? (
          <div className="grid gap-5 overflow-visible sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {displayedProducts.map((p, index) => (
              <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}