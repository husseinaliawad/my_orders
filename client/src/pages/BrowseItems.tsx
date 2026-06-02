import toast from "react-hot-toast";
import { api } from "../api/client";
import { EmptyState } from "../components/EmptyState";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { PageContainer } from "../components/PageContainer";
import { ProductCard } from "../components/ProductCard";
import { SectionHeader } from "../components/SectionHeader";
import { SidebarFilter, type FilterState } from "../components/SidebarFilter";
import { Select } from "../components/ui/Select";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useApi } from "../hooks/useApi";
import type { Category, Item } from "../types";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const blankFilters: FilterState = { search: "", category: "", location: "", minPrice: "", maxPrice: "", rating: "", availability: "" };

export function BrowseItems() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFilters = searchParams.toString();
  const [sort, setSort] = useState("newest");
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...blankFilters,
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    location: searchParams.get("location") || ""
  }));
  const { syncCartCount } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { data: categories } = useApi<Category[]>(() => api.get("/categories"), []);
  const { data, loading } = useApi<Item[]>(() => api.get(`/items?search=${filters.search}&category=${filters.category}&location=${filters.location}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}&rating=${filters.rating}&availability=${filters.availability}&sort=${sort}`), [sort, filters]);

  useEffect(() => {
    const params = new URLSearchParams(urlFilters);
    setFilters((current) => ({
      ...current,
      search: params.get("search") || "",
      category: params.get("category") || "",
      location: params.get("location") || ""
    }));
  }, [urlFilters]);

  const updateFilters = (next: FilterState) => {
    setFilters(next);
    const params = new URLSearchParams(searchParams);
    if (next.search) params.set("search", next.search);
    else params.delete("search");
    if (next.category) params.set("category", next.category);
    else params.delete("category");
    if (next.location) params.set("location", next.location);
    else params.delete("location");
    setSearchParams(params, { replace: true });
  };

  const clearFilters = () => {
    setFilters(blankFilters);
    setSearchParams({}, { replace: true });
  };

  const add = async (item: Item) => { const { data } = await api.post("/cart", { itemId: item._id, startDate: new Date().toISOString(), endDate: new Date(Date.now() + 86400000).toISOString() }); syncCartCount(data); toast.success("Added to cart"); };
  const favorite = (item: Item) => {
    const saved = toggleFavorite(item._id);
    toast.success(saved ? "Added to favorites" : "Removed from favorites");
  };
  return <PageContainer className="grid gap-8 lg:grid-cols-[300px_1fr]">
    <SidebarFilter filters={filters} categories={categories || []} onChange={updateFilters} onClear={clearFilters} onApply={() => toast.success("Filters applied")} />
    <section><div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><SectionHeader eyebrow="Explore rentals" title="Browse items" description="Filter trusted local items by category, location, price, rating, and availability." /><Select value={sort} onChange={(e) => setSort(e.target.value)} className="sm:w-56"><option value="newest">Newest</option><option value="price-low">Price low-high</option><option value="price-high">Price high-low</option><option value="rated">Top rated</option></Select></div>{loading ? <LoadingSkeleton /> : data?.length ? <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{data.map((item) => <ProductCard key={item._id} item={item} isFavorite={isFavorite(item._id)} onCart={add} onFavorite={favorite} />)}</div> : <EmptyState title="No items found" description="Try clearing filters or searching a different item." />}</section>
  </PageContainer>;
}
