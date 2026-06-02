import { Check, Trash2, X } from "lucide-react";
import { api, assetUrl } from "../../api/client";
import { DataTable, type Column } from "../../components/DataTable";
import { SectionHeader } from "../../components/SectionHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { Button } from "../../components/ui/Button";
import { useApi } from "../../hooks/useApi";
import type { Item } from "../../types";

export function ManageItems() {
  const { data, setData } = useApi<Item[]>(() => api.get("/admin/items"), []);
  const status = async (id: string, value: string) => { const { data: item } = await api.patch(`/admin/items/${id}/status`, { status: value }); setData((data || []).map((x) => x._id === id ? item : x)); };
  const del = async (id: string) => { await api.delete(`/admin/items/${id}`); setData((data || []).filter((x) => x._id !== id)); };
  const columns: Column<Item>[] = [
    { key: "item", header: "Item", render: (item) => <div className="flex items-center gap-3"><img src={assetUrl(item.images?.[0])} className="h-12 w-14 rounded-xl object-cover" /><div><b>{item.title}</b><p className="text-xs text-slate-500">{item.owner?.name}</p></div></div>, sortValue: (i) => i.title },
    { key: "price", header: "Price", render: (item) => <b>${item.pricePerDay}/day</b>, sortValue: (i) => i.pricePerDay },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> }
  ];
  return <div><SectionHeader eyebrow="Catalog" title="Manage items" description="Approve, reject, edit, and remove marketplace listings." /><DataTable data={data || []} columns={columns} actions={(item) => <div className="flex justify-end gap-2"><Button size="sm" onClick={() => status(item._id, "approved")}><Check size={15} /></Button><Button size="sm" variant="secondary" onClick={() => status(item._id, "rejected")}><X size={15} /></Button><Button size="sm" variant="danger" onClick={() => del(item._id)}><Trash2 size={15} /></Button></div>} /></div>;
}
