import { DollarSign, ShieldCheck, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { CategoryCard } from "../components/CategoryCard";
import { CTASection } from "../components/CTASection";
import { HeroSection } from "../components/HeroSection";
import { PageContainer } from "../components/PageContainer";
import { ProductCard } from "../components/ProductCard";
import { SectionHeader } from "../components/SectionHeader";
import { StatsCard } from "../components/StatsCard";
import { Card } from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import type { Category, Item } from "../types";

export function Home() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const { data: categories } = useApi<Category[]>(() => api.get("/categories"), []);
  const { data: items } = useApi<Item[]>(() => api.get("/items?sort=rated"), []);

  const search = () => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("search", keyword.trim());
    if (location.trim()) params.set("location", location.trim());
    nav(`/browse${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return <div>
    <HeroSection featured={items?.[0]} keyword={keyword} location={location} onKeyword={setKeyword} onLocation={setLocation} onSearch={search} />
    <PageContainer className="py-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard icon={ShieldCheck} number="5k+" label="items ready to rent" />
        <StatsCard icon={Star} number="4.8" label="average renter rating" />
        <StatsCard icon={DollarSign} number="10%" label="simple service fee" />
      </div>
    </PageContainer>

    <PageContainer className="py-10">
      <SectionHeader eyebrow="Find the right shelf" title="Browse by category" description="Each category is built for quick scanning, clear availability, and better local discovery." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{categories?.map((category, index) => <CategoryCard key={category._id} category={category} index={index} count={18 + index * 7} onClick={() => nav(`/browse?category=${encodeURIComponent(category._id)}`)} />)}</div>
    </PageContainer>

    <PageContainer className="py-12">
      <SectionHeader eyebrow="Curated marketplace" title="Featured items" action={{ label: "View all", to: "/browse" }} />
      <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-4">{items?.slice(0, 4).map((item) => <ProductCard key={item._id} item={item} />)}</div>
    </PageContainer>

    <PageContainer className="py-12">
      <div className="grid gap-6 md:grid-cols-3">{["Find trusted local items", "Book dates and checkout", "Pickup, use, and return"].map((title, index) => <Card key={title} className="bg-gradient-to-br from-white to-slate-50"><div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-sm font-extrabold text-white">{index + 1}</div><h3 className="text-lg font-extrabold">{title}</h3><p className="mt-2 text-sm leading-7 text-slate-500">A smooth rental workflow with request tracking, owner approvals, and transparent totals.</p></Card>)}</div>
    </PageContainer>

    <CTASection title="Built for practical sharing with premium controls." description="Admin moderation, item approvals, request status tracking, account blocking, and clear owner/renter flows." buttonLabel={user ? "List your first item" : "Browse rentals"} onClick={() => nav(user ? "/add-item" : "/browse")} />
  </div>;
}
