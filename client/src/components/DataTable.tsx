import { MoreHorizontal, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "./ui/Input";

export type Column<T> = { key: string; header: string; render: (row: T) => React.ReactNode; sortValue?: (row: T) => string | number };

export function DataTable<T extends { _id?: string }>({ data = [], columns, actions }: { data?: T[]; columns: Column<T>[]; actions?: (row: T) => React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");
  const rows = useMemo(() => {
    const filtered = data.filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));
    const col = columns.find((c) => c.key === sort);
    return col?.sortValue ? [...filtered].sort((a, b) => String(col.sortValue!(a)).localeCompare(String(col.sortValue!(b)))) : filtered;
  }, [data, query, sort, columns]);
  return <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row"><div className="flex max-w-sm items-center gap-2 rounded-2xl bg-slate-50 px-3"><Search size={17} className="text-slate-400" /><Input placeholder="Search table" value={query} onChange={(e) => setQuery(e.target.value)} className="border-0 bg-transparent focus:ring-0" /></div><select className="field sm:w-48" value={sort} onChange={(e) => setSort(e.target.value)}><option value="">Sort by</option>{columns.map((c) => <option key={c.key} value={c.key}>{c.header}</option>)}</select></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead><tr className="border-b text-xs uppercase text-slate-500">{columns.map((c) => <th className="px-3 py-3 font-extrabold" key={c.key}>{c.header}</th>)}{actions && <th className="px-3 py-3 text-right"><MoreHorizontal size={16} /></th>}</tr></thead><tbody>{rows.slice(0, 8).map((row, i) => <tr key={row._id || i} className="border-b last:border-0">{columns.map((c) => <td className="px-3 py-4 align-middle" key={c.key}>{c.render(row)}</td>)}{actions && <td className="px-3 py-4 text-right">{actions(row)}</td>}</tr>)}</tbody></table></div>
    <div className="mt-4 flex items-center justify-between text-sm text-slate-500"><span>Showing {Math.min(rows.length, 8)} of {rows.length}</span><div className="flex gap-2"><button className="rounded-xl border px-3 py-1.5 font-bold">Prev</button><button className="rounded-xl border px-3 py-1.5 font-bold">Next</button></div></div>
  </div>;
}
