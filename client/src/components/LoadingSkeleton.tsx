export function ProductCardSkeleton() {
  return <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><div className="h-56 animate-pulse bg-slate-100" /><div className="space-y-3 p-5"><div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" /><div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" /><div className="h-10 animate-pulse rounded-2xl bg-slate-100" /></div></div>;
}

export function LoadingSkeleton({ type = "products" }: { type?: "products" | "table" | "dashboard" }) {
  if (type === "table") return <div className="rounded-3xl border bg-white p-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="mb-3 h-12 animate-pulse rounded-2xl bg-slate-100" />)}</div>;
  if (type === "dashboard") return <div className="grid gap-5 md:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-36 animate-pulse rounded-3xl bg-slate-100" />)}</div>;
  return <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}</div>;
}
