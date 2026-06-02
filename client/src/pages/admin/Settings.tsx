import { FormField } from "../../components/FormField";
import { SectionHeader } from "../../components/SectionHeader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

export function Settings() {
  return <div>
    <SectionHeader eyebrow="Configuration" title="Settings" description="Manage platform naming, fees, and support contact details." />
    <Card className="max-w-2xl"><div className="grid gap-4"><FormField label="Platform name"><Input defaultValue="Share Instead" /></FormField><FormField label="Service fee percent"><Input defaultValue="10" placeholder="Service fee percent" /></FormField><FormField label="Support email"><Input defaultValue="support@shareinstead.com" /></FormField><Button>Save settings</Button></div></Card>
  </div>;
}
