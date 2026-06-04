import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { z } from "zod";
import { api } from "../api/client";
import { FormField } from "../components/FormField";
import { PageContainer } from "../components/PageContainer";
import { SectionHeader } from "../components/SectionHeader";
import { UploadDropzone } from "../components/UploadDropzone";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { useApi } from "../hooks/useApi";
import type { Category, Item } from "../types";

const schema = z.object({ title: z.string().min(3), description: z.string().min(12), category: z.string().min(1), pricePerDay: z.coerce.number().positive(), location: z.string().min(2), isAvailable: z.string() });
type Form = z.infer<typeof schema>;

export function AddItem() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { data: categories } = useApi<Category[]>(() => api.get("/categories"), []);
  const [files, setFiles] = useState<File[]>([]);
  const [loadingItem, setLoadingItem] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<Form>({ resolver: zodResolver(schema), defaultValues: { isAvailable: "true" } });

  useEffect(() => {
    if (!id) return;
    setLoadingItem(true);
    api.get<Item>(`/items/${id}`).then(({ data }) => {
      reset({
        title: data.title,
        description: data.description,
        category: data.category._id,
        pricePerDay: data.pricePerDay,
        location: data.location,
        isAvailable: data.isAvailable ? "true" : "false"
      });
    }).catch((error) => {
      toast.error(error.response?.data?.message || "Unable to load item for editing.");
    }).finally(() => setLoadingItem(false));
  }, [id, reset]);

  const submit = async (values: Form) => {
    const form = new FormData();
    Object.entries(values).forEach(([k, v]) => form.append(k, String(v)));
    files.forEach((f) => form.append("images", f));
    if (id) {
      await api.put(`/items/${id}`, form);
      toast.success("Item updated");
    } else {
      await api.post("/items", form);
      toast.success("Item submitted for approval");
    }
    setFiles([]);
    navigate("/my-products");
  };

  return <PageContainer narrow>
    <SectionHeader eyebrow={id ? "Edit listing" : "Earn from idle gear"} title={id ? "Update item" : "Add item"} description="Create or update your rental listing with photos, pricing, location, and availability." />
    <Card>
      <form onSubmit={handleSubmit(submit)} className="grid gap-5">
        <UploadDropzone files={files} onFiles={setFiles} />
        <FormField label="Title" error={errors.title?.message}><Input placeholder="Bosch cordless drill kit" {...register("title")} /></FormField>
        <FormField label="Description" error={errors.description?.message} help="Mention condition, included accessories, and pickup details."><textarea className="field min-h-36" placeholder="Describe your item" {...register("description")} /></FormField>
        <div className="grid gap-5 md:grid-cols-2">
          <FormField label="Category" error={errors.category?.message}><Select {...register("category")}><option value="">Select category</option>{categories?.map((c) => <option value={c._id} key={c._id}>{c.name}</option>)}</Select></FormField>
          <FormField label="Price per day" error={errors.pricePerDay?.message}><Input type="number" placeholder="24" {...register("pricePerDay")} /></FormField>
          <FormField label="Location" error={errors.location?.message}><Input placeholder="Damascus" {...register("location")} /></FormField>
          <FormField label="Availability"><Select {...register("isAvailable")}><option value="true">Available</option><option value="false">Unavailable</option></Select></FormField>
        </div>
        <Button disabled={isSubmitting || loadingItem}>{isSubmitting || loadingItem ? "Processing..." : id ? "Save changes" : "Submit item"}</Button>
      </form>
    </Card>
  </PageContainer>;
}
