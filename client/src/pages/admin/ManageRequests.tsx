import { api } from "../../api/client";
import { DataTable, type Column } from "../../components/DataTable";
import { SectionHeader } from "../../components/SectionHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { Select } from "../../components/ui/Select";
import { useApi } from "../../hooks/useApi";
import type { RentalRequest } from "../../types";

export function ManageRequests() {
  const { data, setData } = useApi<RentalRequest[]>(() => api.get("/admin/requests"), []);
  const change = async (id: string, status: string) => { const { data: updated } = await api.patch(`/requests/${id}/status`, { status }); setData((data || []).map((r) => r._id === id ? updated : r)); };
  const columns: Column<RentalRequest>[] = [
    { key: "item", header: "Item", render: (r) => <b>{r.item?.title}</b>, sortValue: (r) => r.item?.title || "" },
    { key: "people", header: "People", render: (r) => <span className="text-sm text-slate-600">{r.renter?.name} to {r.owner?.name}</span> },
    { key: "amount", header: "Amount", render: (r) => <b>${r.totalAmount}</b>, sortValue: (r) => r.totalAmount },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> }
  ];
  return <div><SectionHeader eyebrow="Operations" title="Manage rental requests" description="View all platform requests and adjust their lifecycle status." /><DataTable data={data || []} columns={columns} actions={(r) => <Select className="w-40" value={r.status} onChange={(e) => change(r._id, e.target.value)}><option value="pending">pending</option><option value="approved">approved</option><option value="rejected">rejected</option><option value="completed">completed</option></Select>} /></div>;
}
