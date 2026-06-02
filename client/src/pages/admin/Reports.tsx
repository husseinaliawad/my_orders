import { BarChart3, TrendingUp } from "lucide-react";
import { SectionHeader } from "../../components/SectionHeader";
import { Card } from "../../components/ui/Card";

export function Reports() {
  return <div>
    <SectionHeader eyebrow="Insights" title="Reports" description="Simple visual summaries for rentals, revenue mix, and platform momentum." />
    <div className="grid gap-6 lg:grid-cols-2">
      <Card><div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary"><BarChart3 /></div><h2 className="mt-4 text-lg font-extrabold">Monthly rentals</h2><div className="mt-8 flex h-48 items-end gap-3">{[45, 80, 55, 120, 95, 140].map((h, i) => <div key={i} className="flex-1 rounded-t-2xl bg-gradient-to-t from-primary to-skybrand" style={{ height: h }} />)}</div></Card>
      <Card><div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><TrendingUp /></div><h2 className="mt-4 text-lg font-extrabold">Revenue mix</h2><div className="mt-8 grid gap-4">{["Tools", "Cameras", "Equipment"].map((x, i) => <div key={x}><div className="mb-1 flex justify-between text-sm"><span>{x}</span><b>{[42, 34, 24][i]}%</b></div><div className="h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-gradient-to-r from-primary to-cyan-500" style={{ width: `${[42, 34, 24][i]}%` }} /></div></div>)}</div></Card>
    </div>
  </div>;
}
