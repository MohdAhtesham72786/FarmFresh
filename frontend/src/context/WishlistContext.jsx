import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { wishlistApi } from "../api";
import { formatError } from "../utils/format";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await wishlistApi.get();
      setWishlist(data);
    } catch (e) {
      setError(formatError(e.response?.data?.detail) || "Could not load wishlist.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const ids = useMemo(() => new Set((wishlist?.items || []).map((item) => item.product_id)), [wishlist]);

  const isSaved = useCallback((productId) => ids.has(productId), [ids]);

  const toggle = useCallback(async (productId) => {
    setError("");
    try {
      if (ids.has(productId)) {
        const { data } = await wishlistApi.remove(productId);
        setWishlist(data);
        return { ok: true, saved: false };
      }
      const { data } = await wishlistApi.add(productId);
      setWishlist(data);
      return { ok: true, saved: true };
    } catch (e) {
      const msg = formatError(e.response?.data?.detail) || "Could not update wishlist.";
      setError(msg);
      return { ok: false, error: msg };
    }
  }, [ids]);

  const value = useMemo(
    () => ({
      wishlist,
      loading,
      error,
      refresh,
      toggle,
      isSaved,
      itemCount: wishlist?.item_count ?? 0,
      items: wishlist?.items ?? [],
    }),
    [wishlist, loading, error, refresh, isSaved, toggle],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}