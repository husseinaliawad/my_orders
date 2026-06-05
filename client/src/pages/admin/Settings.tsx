import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../api/client";
import { FormField } from "../../components/FormField";
import { SectionHeader } from "../../components/SectionHeader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

export function Settings() {
  const [settings, setSettings] = useState({ platformName: "", serviceFeePercent: "", supportEmail: "" });
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    api.get("/admin/settings").then(({ data }) => setSettings({
      platformName: data.platformName,
      serviceFeePercent: String(data.serviceFeePercent),
      supportEmail: data.supportEmail
    })).catch((error) => toast.error(error?.response?.data?.message || "Could not load settings"));
  }, []);
  const save = async () => {
    try {
      setSaving(true);
      const { data } = await api.put("/admin/settings", { ...settings, serviceFeePercent: Number(settings.serviceFeePercent) });
      setSettings({ platformName: data.platformName, serviceFeePercent: String(data.serviceFeePercent), supportEmail: data.supportEmail });
      toast.success("Settings saved");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not save settings");
    } finally {
      setSaving(false);
    }
  };
  return <div>
    <SectionHeader eyebrow="Configuration" title="Settings" description="Manage platform naming, fees, and support contact details." />
    <Card className="max-w-2xl"><div className="grid gap-4"><FormField label="Platform name"><Input value={settings.platformName} onChange={(e) => setSettings({ ...settings, platformName: e.target.value })} /></FormField><FormField label="Service fee percent"><Input value={settings.serviceFeePercent} onChange={(e) => setSettings({ ...settings, serviceFeePercent: e.target.value })} placeholder="Service fee percent" type="number" /></FormField><FormField label="Support email"><Input value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} /></FormField><Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save settings"}</Button></div></Card>
  </div>;
}
