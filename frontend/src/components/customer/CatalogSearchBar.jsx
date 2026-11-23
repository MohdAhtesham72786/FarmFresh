import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";

export default function CatalogSearchBar({ className = "" }) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isShop = location.pathname === "/";

  const [search, setSearch] = useState(() => (isShop ? searchParams.get("q") || "" : ""));
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (isShop) setSearch(searchParams.get("q") || "");
  }, [searchParams, isShop]);

  useEffect(() => {
    const q = debouncedSearch.trim();

    if (!isShop) {
      if (!q) return;
      navigate({ pathname: "/", search: `?q=${encodeURIComponent(q)}`, hash: "#catalog" });
      return;
    }

    const currentQ = searchParams.get("q") || "";
    if (search.trim() !== q) return;
    if (q === currentQ) return;

    const next = new URLSearchParams(searchParams);
    if (q) next.set("q", q);
    else next.delete("q");

    navigate(
      {
        pathname: "/",
        search: next.toString() ? `?${next.toString()}` : "",
        hash: location.hash || "#catalog",
      },
      { replace: true },
    );
  }, [debouncedSearch, isShop, location.hash, navigate, searchParams]);

  return (
    <label className={`relative block min-w-0 ${className}`}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-forest-400" />
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search fresh produce…"
        className="h-11 w-full rounded-full border border-forest-100 bg-cream-50 py-0 pl-11 pr-4 text-sm text-forest-900 shadow-sm placeholder:text-forest-400 focus:border-fresh-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-fresh-500/20"
      />
    </label>
  );
}