import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "./AuthContext";

type CartLike = { items?: unknown[] };
type CartContextValue = {
  count: number;
  refreshCartCount: () => Promise<void>;
  syncCartCount: (cart: CartLike | null | undefined) => void;
  clearCartCount: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  const syncCartCount = useCallback((cart: CartLike | null | undefined) => {
    setCount(cart?.items?.length || 0);
  }, []);

  const clearCartCount = useCallback(() => setCount(0), []);

  const refreshCartCount = useCallback(async () => {
    if (!user) {
      setCount(0);
      return;
    }
    const { data } = await api.get<CartLike>("/cart");
    syncCartCount(data);
  }, [syncCartCount, user]);

  useEffect(() => {
    refreshCartCount().catch(() => setCount(0));
  }, [refreshCartCount]);

  const value = useMemo(() => ({ count, refreshCartCount, syncCartCount, clearCartCount }), [clearCartCount, count, refreshCartCount, syncCartCount]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
