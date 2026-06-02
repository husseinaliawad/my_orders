import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/Button";

export function SectionHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: { label: string; to?: string; onClick?: () => void } }) {
  const actionButton = action ? <Button variant="secondary" onClick={action.onClick}>{action.label}<ArrowRight size={16} /></Button> : null;
  return <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 md:flex-row md:items-end">
    <div>
      {eyebrow && <p className="text-sm font-bold text-primary">{eyebrow}</p>}
      <h1 className="mt-1 text-2xl font-bold tracking-normal text-slate-950 sm:text-[1.7rem]">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">{description}</p>}
    </div>
    {action?.to ? <Link to={action.to}>{actionButton}</Link> : actionButton}
  </div>;
}
