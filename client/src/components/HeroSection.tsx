import { CheckCircle2, ShieldCheck, Sparkles, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import type { Item } from "../types";
import { SearchBar } from "./SearchBar";
import { SmartImage } from "./SmartImage";
import { Card } from "./ui/Card";

export function HeroSection({ featured, keyword, location, onKeyword, onLocation, onSearch }: { featured?: Item; keyword?: string; location?: string; onKeyword?: (value: string) => void; onLocation?: (value: string) => void; onSearch?: () => void }) {
  return <section className="relative overflow-hidden border-b border-slate-200/70">
    <div className="absolute inset-0 bg-[linear-gradient(115deg,#f7f3ff_0%,#ffffff_44%,#e6f8fb_100%)]" />
    <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-cyan-300/16 blur-3xl" />
    <div className="relative mx-auto grid max-w-[96rem] items-center gap-16 px-4 py-16 sm:px-6 lg:grid-cols-[.96fr_1.04fr] lg:px-8 lg:py-20">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center lg:text-left">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[11px] font-bold text-primary shadow-sm"><Sparkles size={14} />Peer rentals, curated locally</div>
        <h1 className="max-w-xl text-[2rem] font-bold leading-[1.16] tracking-normal text-slate-950 sm:text-[2.55rem] xl:text-[3.35rem]">Rent less. Own smarter. <span className="gradient-text">Share what sits idle.</span></h1>
        <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600 lg:text-[15px]">A premium local marketplace for borrowing cameras, tools, books, event gear, and everyday equipment from trusted people nearby.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">{["Verified owners", "Admin moderated", "Transparent totals"].map((label) => <span key={label} className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm"><CheckCircle2 size={14} className="text-emerald-500" />{label}</span>)}</div>
        <div className="mt-8 max-w-3xl"><SearchBar keyword={keyword} location={location} onKeyword={onKeyword} onLocation={onLocation} onSearch={onSearch} /></div>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} className="relative hidden min-h-[455px] lg:block">
        <div className="absolute left-12 top-8 h-[370px] w-[315px] rotate-[-4deg] rounded-[1.8rem] bg-slate-950 shadow-[0_34px_90px_rgba(15,23,42,.22)]" />
        <div className="absolute left-4 top-0 h-[370px] w-[315px] overflow-hidden rounded-[1.8rem] border-[8px] border-white bg-white shadow-[0_30px_85px_rgba(15,23,42,.18)]">
          <SmartImage src={featured?.images?.[0]} fallbackLabel={featured?.title || "Featured rental"} className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-transparent p-5 pt-20 text-white"><div className="flex items-center gap-1 text-amber-300"><Star size={16} fill="currentColor" /><b>{featured?.rating || "4.9"}</b></div><h3 className="mt-2 text-lg font-bold">{featured?.title || "Featured rental"}</h3><p className="mt-1 text-sm text-white/75">{featured?.location || "Nearby"} - ${featured?.pricePerDay || 24}/day</p></div>
        </div>
        <Card className="absolute right-10 top-24 w-60 border-white/80 bg-white/90 p-4"><div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-500">This week</span><TrendingUp className="text-emerald-500" size={18} /></div><p className="mt-2 text-xl font-bold">$1,284</p><p className="text-xs leading-5 text-slate-500">Community earnings from unused gear</p><div className="mt-4 grid grid-cols-7 items-end gap-1.5">{[28, 48, 36, 58, 46, 68, 54].map((h, i) => <div key={i} className="rounded-full bg-gradient-to-t from-primary to-cyan-400" style={{ height: h }} />)}</div></Card>
        <Card className="absolute bottom-12 right-20 w-64 border-white/80 bg-white/95 p-4"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><ShieldCheck size={20} /></div><div><b className="text-sm font-bold">Protected request flow</b><p className="text-xs leading-5 text-slate-500">Owners approve dates before pickup.</p></div></div></Card>
      </motion.div>
    </div>
  </section>;
}
