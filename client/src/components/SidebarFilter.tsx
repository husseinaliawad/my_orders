import { RotateCcw, SlidersHorizontal } from "lucide-react";
import type { Category } from "../types";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";

export type FilterState = { search: string; category: string; location: string; minPrice: string; maxPrice: string; rating: string; availability: string };

export function SidebarFilter({ filters, categories = [], onChange, onClear, onApply }: { filters: FilterState; categories?: Category[]; onChange: (next: FilterState) => void; onClear: () => void; onApply?: () => void }) {
  const set = (key: keyof FilterState, value: string) => onChange({ ...filters, [key]: value });
  return <Card className="h-fit p-5 lg:sticky lg:top-24">
    <div className="mb-5 flex items-center justify-between"><h2 className="flex items-center gap-2 text-lg font-extrabold"><SlidersHorizontal size={18} />Filters</h2><button onClick={onClear} className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-primary"><RotateCcw size={14} />Clear</button></div>
    <div className="grid gap-4">
      <Input placeholder="Search" value={filters.search} onChange={(e) => set("search", e.target.value)} />
      <Select value={filters.category} onChange={(e) => set("category", e.target.value)}><option value="">All categories</option>{categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</Select>
      <Input placeholder="Location" value={filters.location} onChange={(e) => set("location", e.target.value)} />
      <div className="grid grid-cols-2 gap-3"><Input placeholder="Min $" type="number" value={filters.minPrice} onChange={(e) => set("minPrice", e.target.value)} /><Input placeholder="Max $" type="number" value={filters.maxPrice} onChange={(e) => set("maxPrice", e.target.value)} /></div>
      <Select value={filters.rating} onChange={(e) => set("rating", e.target.value)}><option value="">Any rating</option><option value="4.5">4.5+</option><option value="4">4.0+</option></Select>
      <Select value={filters.availability} onChange={(e) => set("availability", e.target.value)}><option value="">Any availability</option><option value="true">Available</option><option value="false">Unavailable</option></Select>
      <Button type="button" onClick={onApply}>Apply filters</Button>
    </div>
  </Card>;
}
