export function FormField({ label, error, help, children }: { label: string; error?: string; help?: string; children: React.ReactNode }) {
  return <label className="block"><span className="label">{label}</span>{children}{help && !error && <p className="mt-1 text-xs text-slate-500">{help}</p>}{error && <p className="mt-1 text-sm text-rose-600">{error}</p>}</label>;
}
