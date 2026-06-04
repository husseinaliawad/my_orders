import { DollarSign, Edit, PackageCheck, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../api/client";
import { EmptyState } from "../components/EmptyState";
import { PageContainer } from "../components/PageContainer";
import { SectionHeader } from "../components/SectionHeader";
import { SmartImage } from "../components/SmartImage";
import { StatsCard } from "../components/StatsCard";
import { StatusBadge } from "../components/StatusBadge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useApi } from "../hooks/useApi";
import type { Item } from "../types";

export function MyProducts() {
  const { data, setData } = useApi<Item[]>(() => api.get("/items/my/items"), []);
  const nav = useNavigate();
  const remove = async (id: string) => { await api.delete(`/items/${id}`); setData((data || []).filter((x) => x._id !== id)); toast.success("Item deleted"); };
  return <PageContainer>
    <SectionHeader eyebrow="Owner workspace" title="My products" description="Manage listed items, availability, status, and estimated earnings." action={{ label: "Add item", to: "/add-item" }} />
    <div className="mb-8 grid gap-5 md:grid-cols-3"><StatsCard icon={PackageCheck} label="Total listed" number={data?.length || 0} /><StatsCard icon={Edit} label="Active rentals" number={data?.filter((x) => x.isAvailable).length || 0} /><StatsCard icon={DollarSign} label="Estimated earnings" number={`$${(data || []).reduce((s, i) => s + i.pricePerDay, 0)}`} /></div>
    {data?.length ? <div className="grid gap-5">{data.map((item) => <Card key={item._id} className="flex flex-col gap-4 md:flex-row md:items-center"><SmartImage src={item.images?.[0]} fallbackLabel={item.title} className="h-32 w-full rounded-2xl object-cover md:w-44" /><div className="flex-1"><div className="flex flex-wrap gap-2"><StatusBadge status={item.status} /><StatusBadge status={item.isAvailable ? "available" : "unavailable"} /></div><h3 className="mt-2 text-lg font-extrabold">{item.title}</h3><p className="text-sm text-slate-500">${item.pricePerDay}/day - {item.location}</p></div><div className="flex gap-2"><Button variant="secondary" onClick={() => nav(`/items/${item._id}/edit`)}><Edit size={16} />Edit</Button><Button variant="danger" onClick={() => remove(item._id)}><Trash2 size={16} /></Button></div></Card>)}</div> : <EmptyState title="No products listed" description="Add an item to start earning from things you already own." cta={{ label: "Add item", onClick: () => location.assign("/add-item") }} />}
  </PageContainer>;
}
