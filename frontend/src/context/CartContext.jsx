import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { cartApi } from "../api";
import { formatError } from "../utils/format";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, tone = "success") => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 3200);
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await cartApi.get();
      setCart(data);
    } catch (e) {
      setError(formatError(e.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addToCart = async (productId, quantity = 1) => {
    setError("");
    try {
      const { data } = await cartApi.add(productId, quantity);
      setCart(data);
      showToast("Added to your cart");
      return { ok: true };
    } catch (e) {
      const msg = formatError(e.response?.data?.detail);
      setError(msg);
      return { ok: false, error: msg };
    }
  };

  const updateQty = async (cartItemId, quantity) => {
    setError("");
    try {
      const { data } = await cartApi.update(cartItemId, quantity);
      setCart(data);
      return { ok: true };
    } catch (e) {
      const msg = formatError(e.response?.data?.detail);
      setError(msg);
      return { ok: false, error: msg };
    }
  };

  const removeItem = async (cartItemId) => {
    setError("");
    try {
      const { data } = await cartApi.remove(cartItemId);
      setCart(data);
      showToast("Item removed");
    } catch (e) {
      setError(formatError(e.response?.data?.detail));
    }
  };

  const value = useMemo(
    () => ({
      cart,
      loading,
      error,
      toast,
      refresh,
      addToCart,
      updateQty,
      removeItem,
      itemCount: cart?.item_count ?? 0,
      grandTotal: cart?.grand_total ?? 0,
    }),
    [cart, loading, error, toast, refresh],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}