import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { FormField } from "../components/FormField";
import { PageContainer } from "../components/PageContainer";
import { SectionHeader } from "../components/SectionHeader";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useCart } from "../context/CartContext";
import { useApi } from "../hooks/useApi";
import type { CartItem } from "../types";

export function Checkout() {
  const nav = useNavigate();
  const { clearCartCount } = useCart();
  const { data } = useApi<{ items: CartItem[] }>(() => api.get("/cart"), []);
  const subtotal = (data?.items || []).reduce((s, x) => s + x.total, 0);
  const submit = async () => { await api.post("/cart/checkout", { payment: "mock" }); clearCartCount(); toast.success("Rental request sent"); nav("/requests"); };
  return <PageContainer className="grid gap-8 lg:grid-cols-[1fr_380px]"><Card><SectionHeader eyebrow="Mock payment" title="Checkout" description="No real gateway is used. Confirming creates rental requests for the owners." /><div className="grid gap-4 md:grid-cols-2"><FormField label="Full name"><Input placeholder="Full name" /></FormField><FormField label="Email"><Input placeholder="Email" /></FormField><FormField label="Card number"><Input placeholder="4242 4242 4242 4242" /></FormField><FormField label="Expiry"><Input placeholder="MM / YY" /></FormField><FormField label="CVC"><Input placeholder="CVC" /></FormField><FormField label="Billing ZIP"><Input placeholder="ZIP" /></FormField></div><Button className="mt-6" onClick={submit}>Confirm rental request</Button></Card><Card><h2 className="text-xl font-extrabold">Order summary</h2>{data?.items.map((x) => <div key={x.item._id} className="mt-4 flex justify-between text-sm"><span>{x.item.title}</span><b>${x.total}</b></div>)}<div className="mt-5 flex justify-between border-t pt-4 text-lg"><b>Total</b><b>${Math.round(subtotal * 1.1)}</b></div></Card></PageContainer>;
}
