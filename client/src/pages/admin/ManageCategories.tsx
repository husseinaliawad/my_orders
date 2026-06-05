import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../api/client";
import { CategoryCard } from "../../components/CategoryCard";
import { SectionHeader } from "../../components/SectionHeader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { useApi } from "../../hooks/useApi";
import type { Category } from "../../types";

export function ManageCategories() {
  const { data, setData } = useApi<Category[]>(() => api.get("/categories"), []);
  const [name, setName] = useState("");
  const add = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Enter a category name");
      return;
    }

    try {
      const { data: c } = await api.post("/categories", { name: trimmed, icon: "Package", description: "Custom rental category" });
      setData([...(data || []), c].sort((a, b) => a.name.localeCompare(b.name)));
      setName("");
      toast.success("Category added");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not add category");
    }
  };
  const del = async (id: string) => { await api.delete(`/categories/${id}`); setData((data || []).filter((c) => c._id !== id)); };
  return <div><SectionHeader eyebrow="Taxonomy" title="Manage categories" description="Create and organize marketplace categories with icon-driven cards." /><Card className="mb-6 flex flex-col gap-3 sm:flex-row"><Input placeholder="New category" value={name} onChange={(e) => setName(e.target.value)} /><Button onClick={add}><Plus size={16} />Add</Button></Card><div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">{data?.map((c, i) => <div key={c._id} className="relative"><CategoryCard category={c} index={i} count={20 + i} /><Button size="sm" variant="danger" className="absolute bottom-4 right-4" onClick={() => del(c._id)}><Trash2 size={14} /></Button></div>)}</div></div>;
}
