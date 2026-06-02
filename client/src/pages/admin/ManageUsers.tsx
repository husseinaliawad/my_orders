import { Ban, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../api/client";
import { DataTable, type Column } from "../../components/DataTable";
import { SectionHeader } from "../../components/SectionHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { Button } from "../../components/ui/Button";
import { useApi } from "../../hooks/useApi";
import type { User } from "../../types";

export function ManageUsers() {
  const { data, setData } = useApi<User[]>(() => api.get("/admin/users"), []);
  const block = async (id: string) => { const { data: u } = await api.patch(`/admin/users/${id}/block`); setData((data || []).map((x) => x._id === id ? u : x)); };
  const del = async (id: string) => { await api.delete(`/admin/users/${id}`); setData((data || []).filter((x) => x._id !== id)); toast.success("User deleted"); };
  const columns: Column<User>[] = [
    { key: "name", header: "User", render: (u) => <div><b>{u.name}</b><p className="text-xs text-slate-500">{u.email}</p></div>, sortValue: (u) => u.name },
    { key: "role", header: "Role", render: (u) => <span className="font-bold capitalize">{u.role}</span>, sortValue: (u) => u.role },
    { key: "status", header: "Status", render: (u) => <StatusBadge status={u.isBlocked ? "blocked" : "active"} /> }
  ];
  return <div><SectionHeader eyebrow="People" title="Manage users" description="Search, block, unblock, and remove platform users." /><DataTable data={data || []} columns={columns} actions={(u) => <div className="flex justify-end gap-2"><Button size="sm" variant="secondary" onClick={() => block(u._id)}><Ban size={15} />Block</Button><Button size="sm" variant="danger" onClick={() => del(u._id)}><Trash2 size={15} /></Button></div>} /></div>;
}
