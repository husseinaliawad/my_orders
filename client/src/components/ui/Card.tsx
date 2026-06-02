import { cn } from "../../utils/cn";
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-soft", className)} {...props} />;
}
