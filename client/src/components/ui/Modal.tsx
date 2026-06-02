import { X } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";

export function Modal({ open, title, children, onClose }: { open: boolean; title: string; children: React.ReactNode; onClose: () => void }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm">
    <Card className="w-full max-w-lg">
      <div className="mb-4 flex items-center justify-between"><h3 className="text-xl font-bold">{title}</h3><Button variant="ghost" size="sm" onClick={onClose}><X size={18} /></Button></div>
      {children}
    </Card>
  </div>;
}
