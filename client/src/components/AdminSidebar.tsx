import { BarChart3, Boxes, FolderTree, LayoutDashboard, Settings, Users, WalletCards } from "lucide-react";
import { NavLink } from "react-router-dom";

const nav = [
  ["Overview", "/admin", LayoutDashboard],
  ["Users", "/admin/users", Users],
  ["Items", "/admin/items", Boxes],
  ["Categories", "/admin/categories", FolderTree],
  ["Requests", "/admin/requests", WalletCards],
  ["Reports", "/admin/reports", BarChart3],
  ["Settings", "/admin/settings", Settings]
];

export function AdminSidebar() {
  return <aside className="sticky top-0 h-auto border-r border-white/10 bg-slate-950 p-4 text-white lg:h-screen lg:w-72 lg:p-5">
    <div className="mb-8 rounded-3xl bg-white/5 p-4"><p className="text-xs font-bold uppercase tracking-wider text-cyan-300">Admin</p><h2 className="mt-1 text-xl font-extrabold">Share Instead</h2></div>
    <nav className="grid gap-2">{nav.map(([label, href, Icon]: any) => <NavLink end={href === "/admin"} key={href} to={href} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${isActive ? "bg-white text-slate-950 shadow-xl" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}><Icon size={18} />{label}</NavLink>)}</nav>
  </aside>;
}
