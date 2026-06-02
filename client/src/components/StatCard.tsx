import type { LucideIcon } from "lucide-react";
import { StatsCard } from "./StatsCard";
export function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) {
  return <StatsCard icon={Icon} label={label} number={value} />;
}
