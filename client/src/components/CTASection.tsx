import type { LucideIcon } from "lucide-react";
import { ShieldCheck } from "lucide-react";
import { Button } from "./ui/Button";

export function CTASection({ icon: Icon = ShieldCheck, title, description, buttonLabel, onClick }: { icon?: LucideIcon; title: string; description: string; buttonLabel: string; onClick?: () => void }) {
  return <section className="mx-auto max-w-[96rem] px-4 py-12 sm:px-6 lg:px-8"><div className="relative overflow-hidden rounded-3xl bg-slate-950 p-10 text-white md:p-12"><div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" /><div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-violet-500/25 blur-3xl" /><div className="relative"><Icon size={38} /><h2 className="mt-5 max-w-2xl text-3xl font-extrabold leading-tight">{title}</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">{description}</p><Button variant="secondary" className="mt-8 border-white bg-white text-slate-950 shadow-lg shadow-primary/20 hover:bg-slate-50" onClick={onClick}>{buttonLabel}</Button></div></div></section>;
}
