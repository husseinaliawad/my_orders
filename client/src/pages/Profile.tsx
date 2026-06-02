import { UserRound } from "lucide-react";
import { FormField } from "../components/FormField";
import { PageContainer } from "../components/PageContainer";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBadge } from "../components/StatusBadge";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";

export function Profile() {
  const { user } = useAuth();
  return <PageContainer narrow>
    <SectionHeader eyebrow="Account" title="Profile" description="Review your marketplace account and role." />
    <Card><div className="mb-6 flex items-center gap-4"><div className="grid h-16 w-16 place-items-center rounded-3xl bg-primary/10 text-primary"><UserRound size={30} /></div><div><h2 className="text-xl font-extrabold">{user?.name}</h2><StatusBadge status={user?.role || "user"} /></div></div><div className="grid gap-4 md:grid-cols-2"><FormField label="Name"><Input value={user?.name || ""} readOnly /></FormField><FormField label="Email"><Input value={user?.email || ""} readOnly /></FormField></div></Card>
  </PageContainer>;
}
