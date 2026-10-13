"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { CATEGORIES, PRODUCTS } from "@/lib/catalog";

export default function ProductsPage() {
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(24);

  const items = useMemo(() => {
    let list = category === "all" ? [...PRODUCTS] : PRODUCTS.filter((p) => p.categorySlug === category);
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery) {
      list = list.filter((p) => [p.name, p.brand, p.shortDescription].join(" ").toLowerCase().includes(normalizedQuery));
    }
    if (sort === "price-asc") list.sort((a, b) => a.sellingPricePaise - b.sellingPricePaise);
    if (sort === "price-desc") list.sort((a, b) => b.sellingPricePaise - a.sellingPricePaise);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "newest") list.sort((a, b) => Number(b.isNewArrival) - Number(a.isNewArrival));
    return list;
  }, [category, query, sort]);

  useEffect(() => setVisibleCount(24), [category, query, sort]);

  return (
    <div className="max-w-[1536px] mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div>
          <p className="text-xs font-bold text-[#0071DC] uppercase tracking-wider">Catalog</p>
          <h1 className="text-3xl font-black text-slate-900">Shop all products</h1>
          <p className="text-sm text-slate-600 mt-1">{items.length} of {PRODUCTS.length} items with live INR pricing, stock, and checkout.</p>
        </div>
        <label className="relative block w-full lg:max-w-md">
          <span className="sr-only">Search products</span>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this catalogue" className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#0071DC] focus:ring-2 focus:ring-[#0071DC]/15" />
        </label>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 flex flex-wrap gap-2 items-center">
        <span className="inline-flex items-center gap-1.5 px-2 text-xs font-bold text-slate-500"><SlidersHorizontal className="w-3.5 h-3.5" /> Filter</span>
        <button onClick={() => setCategory("all")} className={`px-4 py-2 rounded-full text-xs font-bold ${category === "all" ? "bg-[#0071DC] text-white" : "bg-white border border-slate-200"}`}>All</button>
        {CATEGORIES.map((c) => (
          <button key={c.slug} onClick={() => setCategory(c.slug)} className={`px-4 py-2 rounded-full text-xs font-bold ${category === c.slug ? "bg-[#0071DC] text-white" : "bg-white border border-slate-200"}`}>
            {c.name}
          </button>
        ))}
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="ml-auto px-3 py-2 rounded-full border border-slate-200 text-xs font-bold bg-white">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top rated</option>
          <option value="newest">New arrivals</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.slice(0, visibleCount).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {items.length === 0 && <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center"><p className="font-bold text-slate-800">No products match that search.</p><button onClick={() => setQuery("")} className="mt-2 text-sm font-bold text-[#0071DC]">Clear search</button></div>}
      {visibleCount < items.length && (
        <div className="flex justify-center pt-2">
          <button onClick={() => setVisibleCount((count) => count + 24)} className="rounded-full bg-[#0071DC] px-6 py-3 text-sm font-black text-white shadow-sm transition-colors hover:bg-[#004f9a]">Show more products ({items.length - visibleCount} remaining)</button>
        </div>
      )}
    </div>
  );
}
