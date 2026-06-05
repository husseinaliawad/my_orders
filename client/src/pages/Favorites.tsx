import toast from "react-hot-toast";
import { api } from "../api/client";
import { EmptyState } from "../components/EmptyState";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { PageContainer } from "../components/PageContainer";
import { ProductCard } from "../components/ProductCard";
import { SectionHeader } from "../components/SectionHeader";
import { useFavorites } from "../context/FavoritesContext";
import { useApi } from "../hooks/useApi";
import type { Item } from "../types";

export function Favorites() {
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();
  const { data, loading } = useApi<Item[]>(() => api.get("/items"), []);
  const favorites = (data || []).filter((item) => favoriteIds.includes(item._id));
  const favorite = (item: Item) => {
    const saved = toggleFavorite(item._id);
    toast.success(saved ? "Added to favorites" : "Removed from favorites");
  };
  const request = async (item: Item) => {
    try {
      await api.post("/requests", { item: item._id, startDate: new Date().toISOString(), endDate: new Date(Date.now() + 86400000).toISOString() });
      toast.success("Rental request sent to owner");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Please login to request this item");
    }
  };

  return <PageContainer>
    <SectionHeader eyebrow="Saved items" title="Favorites" description="Items you saved for quick rental requests." />
    {loading ? <LoadingSkeleton /> : favorites.length ? <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{favorites.map((item) => <ProductCard key={item._id} item={item} isFavorite={isFavorite(item._id)} onFavorite={favorite} onCart={request} />)}</div> : <EmptyState title="No favorites yet" description="Tap the heart on an item to save it here." />}
  </PageContainer>;
}
