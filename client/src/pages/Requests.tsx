import { Check, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { api, assetUrl } from "../api/client";
import { EmptyState } from "../components/EmptyState";
import { PageContainer } from "../components/PageContainer";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBadge } from "../components/StatusBadge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useApi } from "../hooks/useApi";
import type { RentalRequest } from "../types";

const tabs = ["All", "Pending", "Approved", "Rejected"];
export function Requests() {
  const [tab, setTab] = useState("All");
  const { data, setData } = useApi<RentalRequest[]>(() => api.get("/requests"), []);
  const filtered = (data || []).filter((r) => tab === "All" || r.status === tab.toLowerCase());
  const status = async (id: string, value: string) => { const { data: updated } = await api.patch(`/requests/${id}/status`, { status: value }); setData((data || []).map((r) => r._id === id ? updated : r)); toast.success("Request updated"); };
  return <PageContainer className="max-w-6xl">
    <SectionHeader eyebrow="Rental flow" title="Rental requests" description="Review incoming and outgoing requests by status." />
    <div className="mb-6 flex flex-wrap gap-2">{tabs.map((t) => <Button key={t} size="sm" variant={tab === t ? "primary" : "secondary"} onClick={() => setTab(t)}>{t}</Button>)}</div>
    {filtered.length ? <div className="grid gap-5">{filtered.map((r) => <Card key={r._id} className="flex flex-col gap-4 lg:flex-row lg:items-center"><img src={assetUrl(r.item?.images?.[0])} className="h-32 w-full rounded-2xl object-cover lg:w-44" /><div className="flex-1"><StatusBadge status={r.status} /><h3 className="mt-2 text-lg font-extrabold">{r.item?.title}</h3><p className="text-sm text-slate-500">Requester: {r.renter?.name} - {new Date(r.startDate).toLocaleDateString()} to {new Date(r.endDate).toLocaleDateString()}</p><p className="font-bold text-primary">${r.totalAmount}</p></div>{r.status === "pending" && <div className="flex gap-2"><Button onClick={() => status(r._id, "approved")}><Check size={16} />Accept</Button><Button variant="danger" onClick={() => status(r._id, "rejected")}><X size={16} />Reject</Button></div>}</Card>)}</div> : <EmptyState title="No requests" description="Rental requests will appear here when users request your items." />}
  </PageContainer>;
}
