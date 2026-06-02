import { cn } from "../../utils/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; size?: "sm" | "md" };
export function Button({ className, variant = "primary", size = "md", ...props }: Props) {
  return <button className={cn("inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60", size === "sm" ? "px-3 py-2 text-sm" : "px-5 py-3", variant === "primary" && "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/25", variant === "secondary" && "border border-slate-200 bg-white text-slate-800 shadow-sm", variant === "ghost" && "text-slate-700 hover:bg-slate-100", variant === "danger" && "bg-rose-600 text-white", className)} {...props} />;
}
