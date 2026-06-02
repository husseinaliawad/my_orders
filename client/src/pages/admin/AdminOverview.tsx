import { Boxes, DollarSign, Users, WalletCards } from "lucide-react";
import { api } from "../../api/client";
import { AdminStatCard } from "../../components/AdminStatCard";
import { LoadingSkeleton } from "../../components/LoadingSkeleton";
import { SectionHeader } from "../../components/SectionHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { Card } from "../../components/ui/Card";
import { useApi } from "../../hooks/useApi";

export function AdminOverview() {
  const { data, loading } = useApi<any>(() => api.get("/admin/stats"), []);
  if (loading) return <LoadingSkeleton type="dashboard" />;
  return <div>
    <SectionHeader eyebrow="Control center" title="Dashboard overview" description="Track platform health, moderation volume, revenue, and latest activity." />
    <div className="grid gap-5 md:grid-cols-4"><AdminStatCard icon={Users} label="Total users" value={data?.totalUsers || 0} /><AdminStatCard icon={Boxes} label="Total items" value={data?.totalItems || 0} change="+8%" /><AdminStatCard icon={WalletCards} label="Requests" value={data?.totalRequests || 0} change="+15%" /><AdminStatCard icon={DollarSign} label="Revenue" value={`$${data?.totalRevenue || 0}`} change="+22%" /></div>
    <div className="mt-8 grid gap-6 lg:grid-cols-2"><Card><h2 className="mb-4 text-lg font-extrabold">Latest users</h2>{data?.latestUsers?.map((u: any) => <div className="flex items-center justify-between border-b py-3 last:border-0" key={u._id}><div><b>{u.name}</b><p className="text-sm text-slate-500">{u.email}</p></div><StatusBadge status={u.isBlocked ? "blocked" : "active"} /></div>)}</Card><Card><h2 className="mb-4 text-lg font-extrabold">Latest rentals</h2>{data?.latestRentals?.map((r: any) => <div className="flex items-center justify-between border-b py-3 last:border-0" key={r._id}><div><b>{r.item?.title}</b><p className="text-sm text-slate-500">${r.totalAmount}</p></div><StatusBadge status={r.status} /></div>)}</Card></div>
  </div>;
}
