import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";

type FavoritesContextValue = {
  favoriteIds: string[];
  isFavorite: (itemId: string) => boolean;
  toggleFavorite: (itemId: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);
const storageKey = (userId?: string) => `share-instead:favorites:${userId || "guest"}`;

function readFavorites(key: string) {
  try {
    const stored = localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const key = useMemo(() => storageKey(user?._id), [user?._id]);
  const skipNextPersist = useRef(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => readFavorites(key));

  useEffect(() => {
    skipNextPersist.current = true;
    setFavoriteIds(readFavorites(key));
  }, [key]);

  useEffect(() => {
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    localStorage.setItem(key, JSON.stringify(favoriteIds));
  }, [favoriteIds, key]);

  const isFavorite = useCallback((itemId: string) => favoriteIds.includes(itemId), [favoriteIds]);

  const toggleFavorite = useCallback((itemId: string) => {
    const nextIsFavorite = !favoriteIds.includes(itemId);
    setFavoriteIds((current) => {
      if (current.includes(itemId)) return current.filter((id) => id !== itemId);
      return [...current, itemId];
    });
    return nextIsFavorite;
  }, [favoriteIds]);

  const value = useMemo(() => ({ favoriteIds, isFavorite, toggleFavorite }), [favoriteIds, isFavorite, toggleFavorite]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
};
