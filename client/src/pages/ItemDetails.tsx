import { CalendarDays, MapPin, Star } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { PageContainer } from "../components/PageContainer";
import { ProductCard } from "../components/ProductCard";
import { SectionHeader } from "../components/SectionHeader";
import { SmartImage } from "../components/SmartImage";
import { StatusBadge } from "../components/StatusBadge";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useApi } from "../hooks/useApi";
import type { Item } from "../types";

export function ItemDetails() {
  const { id } = useParams();
  const [startDate, setStart] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEnd] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewComment, setReviewComment] = useState("");
  const { data: item, setData: setItem } = useApi<Item>(() => api.get(`/items/${id}`), [id]);
  const { data: similar } = useApi<Item[]>(() => api.get("/items?sort=rated"), []);
  const add = async () => {
    try {
      await api.post("/requests", { item: id, startDate, endDate });
      toast.success("Rental request sent to owner");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Please login to request this item");
    }
  };
  const submitReview = async () => {
    try {
      const { data } = await api.post(`/items/${id}/reviews`, { rating: reviewRating, comment: reviewComment });
      setItem({ ...data.item, reviews: data.reviews });
      setReviewComment("");
      toast.success("Review saved");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not save review");
    }
  };
  if (!item) return <PageContainer><LoadingSkeleton /></PageContainer>;
  return <PageContainer>
    <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr]"><div><SmartImage src={item.images?.[0]} fallbackLabel={item.title} className="h-[360px] w-full rounded-3xl object-cover shadow-soft sm:h-[460px]" /><div className="mt-4 grid grid-cols-4 gap-3">{item.images.map((img) => <SmartImage key={img} src={img} fallbackLabel={item.title} className="h-20 rounded-2xl object-cover sm:h-24" />)}</div></div>
      <Card><div className="flex flex-wrap gap-2"><Badge>{item.category.name}</Badge><StatusBadge status={item.isAvailable ? "available" : "unavailable"} /></div><h1 className="mt-4 text-2xl font-extrabold leading-tight text-slate-950 sm:text-3xl">{item.title}</h1><div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500"><span className="flex items-center gap-1"><Star size={16} className="text-amber-500" fill="currentColor" />{item.rating}</span><span className="flex items-center gap-1"><MapPin size={16} />{item.location}</span><span>Owner: {item.owner.name}</span></div><p className="mt-6 text-sm leading-7 text-slate-600">{item.description}</p><div className="my-6 rounded-3xl bg-gradient-to-r from-primary/10 to-skybrand/10 p-5"><span className="text-sm text-slate-500">Price per day</span><p className="text-3xl font-extrabold text-primary">${item.pricePerDay}</p></div><div className="grid gap-3 sm:grid-cols-2"><label><span className="label">Start date</span><Input type="date" value={startDate} onChange={(e) => setStart(e.target.value)} /></label><label><span className="label">End date</span><Input type="date" value={endDate} onChange={(e) => setEnd(e.target.value)} /></label></div><div className="mt-5 flex items-center gap-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600"><CalendarDays size={18} /> Available most weekdays. Owner confirms final handoff.</div><Button className="mt-6 w-full" onClick={add}>Request rental</Button></Card></div>
    <div className="mt-10 grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card><h2 className="text-lg font-extrabold">Add review</h2><div className="mt-4 grid gap-3"><label><span className="label">Rating</span><select className="field" value={reviewRating} onChange={(e) => setReviewRating(e.target.value)}>{[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} stars</option>)}</select></label><label><span className="label">Comment</span><textarea className="field min-h-28" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Share your experience with this item" /></label><Button onClick={submitReview}>Save review</Button></div></Card>
      <Card><h2 className="text-lg font-extrabold">Reviews</h2>{item.reviews?.length ? <div className="mt-4 grid gap-4">{item.reviews.map((review) => <div key={review._id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"><div className="flex items-center justify-between gap-3"><b>{review.user?.name || "User"}</b><span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-sm font-bold text-amber-600"><Star size={14} fill="currentColor" />{review.rating}</span></div><p className="mt-2 text-sm leading-6 text-slate-600">{review.comment}</p></div>)}</div> : <p className="mt-3 text-sm text-slate-500">No reviews yet.</p>}</Card>
    </div>
    <div className="mt-14"><SectionHeader title="Similar items" eyebrow="More to rent" /><div className="grid gap-6 md:grid-cols-3">{similar?.filter((x) => x._id !== item._id).slice(0, 3).map((x) => <ProductCard item={x} key={x._id} />)}</div></div>
  </PageContainer>;
}
