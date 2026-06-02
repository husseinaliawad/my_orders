import type { LucideIcon } from "lucide-react";
import { PackageOpen } from "lucide-react";
import { Button } from "./ui/Button";

export function EmptyState({ icon: Icon = PackageOpen, title = "Nothing here yet", description = "Try changing filters or adding new content.", cta }: { icon?: LucideIcon; title?: string; description?: string; cta?: { label: string; onClick: () => void } }) {
  return <div className="grid place-items-center rounded-3xl border border-dashed border-slate-300 bg-gradient-to-br from-white to-slate-50 p-10 text-center">
    <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon size={28} /></div>
    <h3 className="text-lg font-extrabold text-slate-950">{title}</h3>
    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
    {cta && <Button className="mt-5" onClick={cta.onClick}>{cta.label}</Button>}
  </div>;
}
