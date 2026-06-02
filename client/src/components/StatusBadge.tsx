import { cn } from "../utils/cn";

const styles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
  completed: "bg-blue-50 text-blue-700 border-blue-200",
  available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  unavailable: "bg-slate-100 text-slate-600 border-slate-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  blocked: "bg-rose-50 text-rose-700 border-rose-200"
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-extrabold capitalize", styles[status.toLowerCase()] || "border-slate-200 bg-slate-50 text-slate-600", className)}>{status}</span>;
}
