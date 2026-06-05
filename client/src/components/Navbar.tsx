import { BarChart3, Heart, Home, Menu, Package, PlusCircle, ShoppingCart, UserRound, WalletCards, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Button } from "./ui/Button";

const publicLinks = [
  ["Home", "/", Home],
  ["Browse", "/browse", Package]
];

const privateLinks = [
  ["Add Item", "/add-item", PlusCircle],
  ["My Products", "/my-products", BarChart3],
  ["Favorites", "/favorites", Heart],
  ["Requests", "/requests", WalletCards]
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const links = user ? [...publicLinks, ...privateLinks] : publicLinks;
  const navLink = ([label, href, Icon]: any) => <NavLink key={href} to={href} onClick={() => setOpen(false)} className={({ isActive }) => `inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-bold transition ${isActive ? "bg-slate-950 text-white shadow-lg shadow-slate-950/10" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}><Icon size={15} />{label}</NavLink>;
  const cartBadge = count > 0 ? <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-emerald-500 px-1.5 text-center text-xs font-bold text-white">{count}</span> : null;
  const handleLogout = () => {
    logout();
    setOpen(false);
    setProfileOpen(false);
    navigate("/");
  };

  return <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/75 backdrop-blur-2xl">
    <div className="mx-auto flex max-w-[96rem] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
      <Link to="/" className="flex items-center gap-3 text-lg font-bold text-slate-950"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-primary via-blue-600 to-cyan-500 text-white shadow-lg shadow-primary/20"><Package size={21} /></span>Share Instead</Link>
      <nav className="hidden items-center gap-1.5 lg:flex">{links.map(navLink)}{user?.role === "admin" && navLink(["Admin", "/admin", BarChart3])}</nav>
      <div className="hidden items-center gap-3 lg:flex">
        <Link to="/cart" className="relative rounded-full border border-slate-200 bg-white p-2.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><ShoppingCart size={20} />{cartBadge}</Link>
        {user ? <div className="relative"><button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"><UserRound size={17} />{user.name}</button>{profileOpen && <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"><Link className="block rounded-xl px-3 py-2 text-sm font-bold hover:bg-slate-50" to="/profile">Profile</Link><button className="w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-rose-600 hover:bg-rose-50" onClick={handleLogout}>Logout</button></div>}</div> : <Link to="/login"><Button className="px-4 py-2 text-sm">Login</Button></Link>}
      </div>
      <button className="rounded-xl border border-slate-200 p-2 lg:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </div>
    {open && <div className="border-t border-slate-200 bg-white p-4 lg:hidden"><nav className="grid gap-2">{links.map(navLink)}{user?.role === "admin" && navLink(["Admin", "/admin", BarChart3])}<Link className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-bold text-slate-600" to="/cart"><span className="relative"><ShoppingCart size={15} />{cartBadge}</span>Cart</Link>{user ? <button onClick={handleLogout} className="text-left rounded-full px-3.5 py-2 text-[13px] font-bold text-rose-600">Logout</button> : <Link to="/login" className="rounded-full px-3.5 py-2 text-[13px] font-bold text-primary">Login</Link>}</nav></div>}
  </header>;
}
