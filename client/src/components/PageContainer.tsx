import { cn } from "../utils/cn";

export function PageContainer({ children, className, narrow = false }: { children: React.ReactNode; className?: string; narrow?: boolean }) {
  return <div className={cn("mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 lg:py-10", narrow ? "max-w-4xl" : "max-w-[96rem]", className)}>{children}</div>;
}
