import { Heart, MapPin, Plus, ShieldCheck, Star } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { api, assetUrl } from "../api/client";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import type { Item } from "../types";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

export function ProductCard({ item, isFavorite = false, onCart, onFavorite }: { item: Item; isFavorite?: boolean; onCart?: (item: Item) => void; onFavorite?: (item: Item) => void }) {
  const { syncCartCount } = useCart();
  const { isFavorite: isSavedFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite || isSavedFavorite(item._id);

  const addToCart = async () => {
    if (onCart) {
      onCart(item);
      return;
    }

    try {
      const { data } = await api.post("/cart", { itemId: item._id, startDate: new Date().toISOString(), endDate: new Date(Date.now() + 86400000).toISOString() });
      syncCartCount(data);
      toast.success("Added to cart");
    } catch {
      toast.error("Please login to add items to cart");
    }
  };

  const toggleSaved = () => {
    if (onFavorite) {
      onFavorite(item);
      return;
    }

    const nextSaved = toggleFavorite(item._id);
    toast.success(nextSaved ? "Added to favorites" : "Removed from favorites");
  };

  return <Card className="group overflow-hidden border-slate-200/70 p-0 shadow-[0_20px_70px_rgba(15,23,42,.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_90px_rgba(15,23,42,.14)]">
    <div className="relative h-56 overflow-hidden rounded-t-[1.75rem] bg-slate-100">
      <img src={assetUrl(item.images?.[0])} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/55 to-transparent" />
      <Badge className="absolute left-4 top-4 border-white/50 bg-white/90 shadow-sm">{item.category?.name}</Badge>
      <button
        type="button"
        aria-label={saved ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={saved}
        title={saved ? "Remove from favorites" : "Add to favorites"}
        onClick={toggleSaved}
        className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/50 bg-white/90 shadow-sm transition hover:bg-white hover:text-rose-500 ${saved ? "text-rose-500" : "text-slate-700"}`}
      >
        <Heart size={18} fill={saved ? "currentColor" : "none"} />
      </button>
      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-slate-950/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md"><ShieldCheck size={14} />Verified owner</div>
    </div>
    <div className="p-5">
      <div className="mb-2 flex items-start justify-between gap-3"><h3 className="line-clamp-2 text-base font-bold tracking-normal">{item.title}</h3><span className="whitespace-nowrap rounded-2xl bg-primary/10 px-3 py-1 text-sm font-bold text-primary">${item.pricePerDay}<span className="text-xs text-slate-500">/day</span></span></div>
      <div className="flex items-center justify-between text-sm text-slate-500"><span className="flex items-center gap-1"><MapPin size={15} />{item.location}</span><span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 font-bold text-amber-600"><Star size={15} fill="currentColor" />{item.rating}</span></div>
      <div className="mt-3 flex items-center gap-2 text-sm text-slate-500"><img src={assetUrl(item.owner?.avatar) || "https://picsum.photos/seed/avatar/80"} className="h-7 w-7 rounded-full object-cover" /><span>Listed by <span className="font-bold text-slate-800">{item.owner?.name}</span></span></div>
      <div className="mt-5 grid grid-cols-2 gap-3"><Link to={`/items/${item._id}`} className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5">Details</Link><Button onClick={addToCart}><Plus size={16} />Cart</Button></div>
    </div>
  </Card>;
}
