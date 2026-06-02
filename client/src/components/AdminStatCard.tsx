import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

export function AdminStatCard({ icon: Icon, label, value, change = "+12%" }: { icon: LucideIcon; label: string; value: string | number; change?: string }) {
  const positive = !change.startsWith("-");
  const Trend = positive ? ArrowUpRight : ArrowDownRight;
  return <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white"><Icon size={20} /></div>
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold ${positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}><Trend size={14} />{change}</span>
    </div>
    <p className="mt-5 text-2xl font-extrabold text-slate-950">{value}</p>
    <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
  </div>;
}
