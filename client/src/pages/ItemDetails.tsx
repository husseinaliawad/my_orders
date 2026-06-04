import { CalendarDays, MapPin, Star } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { PageContainer } from "../components/PageContainer";
import { ProductCard } from "../components/ProductCard";
import { SectionHeader } from "../components/SectionHeader";
import { SmartImage } from "../components/SmartImage";
import { StatusBadge } from "../components/StatusBadge";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useCart } from "../context/CartContext";
import { useApi } from "../hooks/useApi";
import type { Item } from "../types";

export function ItemDetails() {
  const { id } = useParams();
  const [startDate, setStart] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEnd] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const { syncCartCount } = useCart();
  const { data: item } = useApi<Item>(() => api.get(`/items/${id}`), [id]);
  const { data: similar } = useApi<Item[]>(() => api.get("/items?sort=rated"), []);
  const add = async () => { const { data } = await api.post("/cart", { itemId: id, startDate, endDate }); syncCartCount(data); toast.success("Added to cart"); };
  if (!item) return <PageContainer><LoadingSkeleton /></PageContainer>;
  return <PageContainer>
    <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr]"><div><SmartImage src={item.images?.[0]} fallbackLabel={item.title} className="h-[360px] w-full rounded-3xl object-cover shadow-soft sm:h-[460px]" /><div className="mt-4 grid grid-cols-4 gap-3">{item.images.map((img) => <SmartImage key={img} src={img} fallbackLabel={item.title} className="h-20 rounded-2xl object-cover sm:h-24" />)}</div></div>
      <Card><div className="flex flex-wrap gap-2"><Badge>{item.category.name}</Badge><StatusBadge status={item.isAvailable ? "available" : "unavailable"} /></div><h1 className="mt-4 text-2xl font-extrabold leading-tight text-slate-950 sm:text-3xl">{item.title}</h1><div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500"><span className="flex items-center gap-1"><Star size={16} className="text-amber-500" fill="currentColor" />{item.rating}</span><span className="flex items-center gap-1"><MapPin size={16} />{item.location}</span><span>Owner: {item.owner.name}</span></div><p className="mt-6 text-sm leading-7 text-slate-600">{item.description}</p><div className="my-6 rounded-3xl bg-gradient-to-r from-primary/10 to-skybrand/10 p-5"><span className="text-sm text-slate-500">Price per day</span><p className="text-3xl font-extrabold text-primary">${item.pricePerDay}</p></div><div className="grid gap-3 sm:grid-cols-2"><label><span className="label">Start date</span><Input type="date" value={startDate} onChange={(e) => setStart(e.target.value)} /></label><label><span className="label">End date</span><Input type="date" value={endDate} onChange={(e) => setEnd(e.target.value)} /></label></div><div className="mt-5 flex items-center gap-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600"><CalendarDays size={18} /> Available most weekdays. Owner confirms final handoff.</div><Button className="mt-6 w-full" onClick={add}>Add to cart / Request rental</Button></Card></div>
    <div className="mt-14"><SectionHeader title="Similar items" eyebrow="More to rent" /><div className="grid gap-6 md:grid-cols-3">{similar?.filter((x) => x._id !== item._id).slice(0, 3).map((x) => <ProductCard item={x} key={x._id} />)}</div></div>
  </PageContainer>;
}
