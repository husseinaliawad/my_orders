import { cn } from "../../utils/cn";
export function Badge({ className, children }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700", className)}>{children}</span>;
}
