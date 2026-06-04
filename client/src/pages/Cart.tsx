import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { EmptyState } from "../components/EmptyState";
import { PageContainer } from "../components/PageContainer";
import { SectionHeader } from "../components/SectionHeader";
import { SmartImage } from "../components/SmartImage";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useCart } from "../context/CartContext";
import { useApi } from "../hooks/useApi";
import type { CartItem } from "../types";

export function Cart() {
  const { data, setData } = useApi<{ items: CartItem[] }>(() => api.get("/cart"), []);
  const { syncCartCount } = useCart();
  const items = data?.items || [];
  const subtotal = items.reduce((s, x) => s + x.total, 0);
  const remove = async (id: string) => { const { data } = await api.delete(`/cart/${id}`); setData(data); syncCartCount(data); };
  return <PageContainer className="grid gap-8 lg:grid-cols-[1fr_360px]"><section><SectionHeader eyebrow="Review rentals" title="Cart" description="Confirm dates and totals before sending rental requests." />{items.length ? <div className="grid gap-5">{items.map((x) => <Card key={x.item._id} className="flex flex-col gap-4 sm:flex-row"><SmartImage src={x.item.images?.[0]} fallbackLabel={x.item.title} className="h-32 w-full rounded-2xl object-cover sm:w-36" /><div className="flex-1"><h3 className="font-extrabold">{x.item.title}</h3><p className="text-sm text-slate-500">{new Date(x.startDate).toLocaleDateString()} to {new Date(x.endDate).toLocaleDateString()} • {x.days} day(s) • ${x.item.pricePerDay}/day</p><p className="font-bold text-primary">${x.total}</p></div><Button variant="ghost" onClick={() => remove(x.item._id)}><Trash2 /></Button></Card>)}</div> : <EmptyState title="Your cart is empty" description="Browse items and add rentals to start checkout." />}</section><Card className="h-fit"><h2 className="text-xl font-extrabold">Order summary</h2><div className="mt-5 grid gap-3 text-sm text-slate-600"><div className="flex justify-between"><span>Subtotal</span><b>${subtotal}</b></div><div className="flex justify-between"><span>Service fee 10%</span><b>${Math.round(subtotal * .1)}</b></div><div className="flex justify-between border-t pt-3 text-base text-ink"><span>Total</span><b>${Math.round(subtotal * 1.1)}</b></div></div><Link to="/checkout"><Button className="mt-6 w-full" disabled={!items.length}>Checkout</Button></Link></Card></PageContainer>;
}
