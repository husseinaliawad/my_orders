import type { LucideIcon } from "lucide-react";
import { cn } from "../utils/cn";

export function StatsCard({ icon: Icon, number, label, className }: { icon: LucideIcon; number: string | number; label: string; className?: string }) {
  return <div className={cn("rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm", className)}>
    <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary to-cyan-500 text-white shadow-lg shadow-primary/15"><Icon size={21} /></div>
    <p className="text-2xl font-bold text-slate-950">{number}</p>
    <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
  </div>;
}
