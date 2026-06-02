import { Facebook, Github, Instagram, Package, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return <footer className="mt-20 border-t bg-slate-950 px-4 py-12 text-white">
    <div className="mx-auto grid max-w-[96rem] gap-8 md:grid-cols-4">
      <div className="md:col-span-2"><div className="flex items-center gap-3 text-xl font-extrabold"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-primary"><Package /></span>Share Instead</div><p className="mt-4 max-w-md text-sm leading-7 text-slate-300">A premium peer-to-peer rental marketplace for using less, earning more, and borrowing better.</p><div className="mt-5 flex gap-3 text-slate-300"><Twitter size={18} /><Instagram size={18} /><Facebook size={18} /><Github size={18} /></div></div>
      <div><b>Marketplace</b><div className="mt-3 grid gap-2 text-sm text-slate-300"><Link to="/browse">Browse</Link><Link to="/add-item">List items</Link><Link to="/requests">Requests</Link></div></div>
      <div><b>Company</b><div className="mt-3 grid gap-2 text-sm text-slate-300"><span>Trust</span><span>Support</span><span>Privacy</span></div></div>
    </div>
    <div className="mx-auto mt-10 max-w-[96rem] border-t border-white/10 pt-6 text-sm text-slate-400">© 2026 Share Instead. All rights reserved.</div>
  </footer>;
}
