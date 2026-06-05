import { BarChart3, TrendingUp } from "lucide-react";
import { api } from "../../api/client";
import { SectionHeader } from "../../components/SectionHeader";
import { Card } from "../../components/ui/Card";
import { useApi } from "../../hooks/useApi";

type ReportsData = {
  monthlyRentals: { _id: string; count: number; revenue: number }[];
  revenueByCategory: { _id: string; total: number }[];
  statusCounts: { _id: string; count: number }[];
  topItems: { _id: string; title: string; rating: number; category?: { name: string } }[];
  categories: number;
};

export function Reports() {
  const { data } = useApi<ReportsData>(() => api.get("/admin/reports"), []);
  const maxMonthly = Math.max(1, ...(data?.monthlyRentals || []).map((x) => x.count));
  const totalRevenue = (data?.revenueByCategory || []).reduce((sum, x) => sum + x.total, 0) || 1;
  return <div>
    <SectionHeader eyebrow="Insights" title="Reports" description="Simple visual summaries for rentals, revenue mix, and platform momentum." />
    <div className="grid gap-6 lg:grid-cols-2">
      <Card><div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary"><BarChart3 /></div><h2 className="mt-4 text-lg font-extrabold">Monthly rentals</h2><div className="mt-8 flex h-48 items-end gap-3">{(data?.monthlyRentals || []).map((month) => <div key={month._id} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-2xl bg-gradient-to-t from-primary to-skybrand" style={{ height: `${Math.max(8, (month.count / maxMonthly) * 180)}px` }} /><span className="text-[11px] font-bold text-slate-500">{month._id.slice(5)}</span></div>)}</div></Card>
      <Card><div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><TrendingUp /></div><h2 className="mt-4 text-lg font-extrabold">Revenue mix</h2><div className="mt-8 grid gap-4">{(data?.revenueByCategory || []).map((x) => { const percent = Math.round((x.total / totalRevenue) * 100); return <div key={x._id}><div className="mb-1 flex justify-between text-sm"><span>{x._id}</span><b>{percent}%</b></div><div className="h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-gradient-to-r from-primary to-cyan-500" style={{ width: `${percent}%` }} /></div></div>; })}</div></Card>
      <Card><h2 className="text-lg font-extrabold">Request status</h2><div className="mt-5 grid gap-3">{(data?.statusCounts || []).map((x) => <div key={x._id} className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm"><span className="capitalize">{x._id}</span><b>{x.count}</b></div>)}</div></Card>
      <Card><h2 className="text-lg font-extrabold">Top rated items</h2><div className="mt-5 grid gap-3">{(data?.topItems || []).map((item) => <div key={item._id} className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm"><span>{item.title}</span><b>{item.rating}</b></div>)}</div></Card>
    </div>
  </div>;
}
