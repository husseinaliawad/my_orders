import { ArrowRight, BookOpen, Briefcase, Camera, Laptop, Package, Wrench } from "lucide-react";
import type { Category } from "../types";

const icons: Record<string, any> = { Wrench, Camera, BookOpen, Briefcase, Laptop, Package };
const accents = ["from-violet-500 to-blue-600", "from-cyan-500 to-emerald-500", "from-amber-400 to-orange-500", "from-rose-500 to-fuchsia-600", "from-slate-700 to-slate-950"];

export function CategoryCard({ category, index = 0, count = 24, onClick }: { category: Category; index?: number; count?: number; onClick?: () => void }) {
  const Icon = icons[category.icon] || Package;
  return <button type="button" onClick={onClick} className="group rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,.12)]">
    <div className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${accents[index % accents.length]} text-white shadow-lg`}><Icon size={23} /></div>
    <div className="flex items-center justify-between gap-3"><h3 className="text-base font-bold text-slate-950">{category.name}</h3><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">{count}</span></div>
    <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">{category.description}</p>
    <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">Explore <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span>
  </button>;
}
