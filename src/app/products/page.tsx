"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
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
    <div className="min-h-screen bg-[#FAFAF7] py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="max-w-[1440px] mx-auto space-y-6">
        {/* Header and Search */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div>
            <span className="text-xs font-bold text-[#1554D1] uppercase tracking-wider">Marketplace Catalog</span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#172033] tracking-tight">Shop All Products</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {items.length} of {PRODUCTS.length} products available with INR pricing, stock reservation &amp; fast dispatch.
            </p>
          </div>
          <div className="relative block w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products in this catalogue..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-[#172033] outline-none focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/15 shadow-2xs transition-all"
            />
          </div>
        </div>

        {/* Filter Bar with Glass Styling */}
        <div className="rounded-3xl border border-slate-200 bg-white p-3 sm:p-4 flex flex-wrap gap-2 items-center shadow-2xs">
          <span className="inline-flex items-center gap-1.5 px-2 text-xs font-bold text-slate-500">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#1554D1]" /> Filter:
          </span>
          <button
            onClick={() => setCategory("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              category === "all"
                ? "bg-[#1554D1] text-white shadow-xs"
                : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            All Products
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCategory(c.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                category === c.slug
                  ? "bg-[#1554D1] text-white shadow-xs"
                  : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {c.name}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-bold bg-white text-[#172033] outline-none focus:border-[#1554D1]"
            >
              <option value="featured">Featured Deals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {items.slice(0, visibleCount).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center space-y-2">
            <p className="font-bold text-[#172033] text-base">No products match your search or filter.</p>
            <p className="text-xs text-slate-500">Try searching with a different term or browse all categories.</p>
            <button
              onClick={() => { setQuery(""); setCategory("all"); }}
              className="mt-2 text-xs font-bold text-[#1554D1] hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* Pagination / Show More */}
        {visibleCount < items.length && (
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setVisibleCount((count) => count + 24)}
              className="rounded-full bg-[#1554D1] hover:bg-[#0E44B0] px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-sm transition-all active:scale-98"
            >
              Show more products ({items.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
