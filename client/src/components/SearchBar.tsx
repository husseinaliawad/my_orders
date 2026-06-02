import { CalendarDays, MapPin, Search } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

export function SearchBar({ keyword, location, onKeyword, onLocation, onSearch, showDate = false }: { keyword?: string; location?: string; onKeyword?: (value: string) => void; onLocation?: (value: string) => void; onSearch?: () => void; showDate?: boolean }) {
  return <div className="grid gap-3 rounded-3xl border border-white/80 bg-white/90 p-3 shadow-[0_22px_70px_rgba(15,23,42,.12)] md:grid-cols-[1fr_1fr_auto]">
    <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3"><Search size={18} className="text-slate-400" /><Input value={keyword || ""} onChange={(e) => onKeyword?.(e.target.value)} placeholder="What are you looking for?" className="border-0 bg-transparent text-sm focus:ring-0" /></div>
    <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3"><MapPin size={18} className="text-slate-400" /><Input value={location || ""} onChange={(e) => onLocation?.(e.target.value)} placeholder="Location" className="border-0 bg-transparent text-sm focus:ring-0" /></div>
    {showDate && <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 md:col-span-2 lg:col-span-1"><CalendarDays size={18} className="text-slate-400" /><Input type="date" className="border-0 bg-transparent text-sm focus:ring-0" /></div>}
    <Button onClick={onSearch} className="px-5 py-2.5 text-sm">Search</Button>
  </div>;
}
