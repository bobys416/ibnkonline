"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Star, Check } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { searchProducts, registerDynamicProduct, CatalogProduct, CATEGORIES } from "@/lib/catalog";

function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const initialItems = useMemo(() => searchProducts(q), [q]);
  const [items, setItems] = useState<CatalogProduct[]>(initialItems);
  const [isMounted, setIsMounted] = useState(false);
  const [sort, setSort] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [fastDeliveryOnly, setFastDeliveryOnly] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setItems(initialItems);
    if (!q) return;

    fetch(`/api/products?q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data?.products)) {
          for (const item of json.data.products) {
            registerDynamicProduct(item);
          }
          setItems(json.data.products);
        }
      })
      .catch(() => {});
  }, [q, initialItems]);

  const rawList = isMounted ? items : initialItems;

  const filteredAndSorted = useMemo(() => {
    let result = [...rawList];

    if (selectedCategory) {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    }
    if (minRating) {
      result = result.filter((p) => p.rating >= minRating);
    }
    if (fastDeliveryOnly) {
      result = result.filter((p) => p.delivery?.toLowerCase().includes("free") || p.sellingPricePaise > 49900);
    }

    if (sort === "price-asc") result.sort((a, b) => a.sellingPricePaise - b.sellingPricePaise);
    if (sort === "price-desc") result.sort((a, b) => b.sellingPricePaise - a.sellingPricePaise);
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [rawList, selectedCategory, minRating, fastDeliveryOnly, sort]);

  return (
    <div className="min-h-screen bg-white">
      {/* Amazon Search Subheader Bar */}
      <div className="border-b border-slate-200 bg-[#F7F8F8] px-4 py-2 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[#0F1111]">
            1-{filteredAndSorted.length} of {rawList.length} results for{" "}
            <span className="font-bold text-[#C45500]">&quot;{q || "All Products"}&quot;</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="search-sort" className="text-slate-500 font-medium">Sort by:</label>
          <select
            id="search-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs text-[#0F1111] font-semibold outline-none focus:border-[#E77600] shadow-2xs"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Avg. Customer Review</option>
          </select>
        </div>
      </div>

      <div className="max-w-[1536px] mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Amazon Left Filter Sidebar */}
        <aside className="w-full md:w-56 shrink-0 space-y-6 text-xs text-[#0F1111]">
          {/* Fast Delivery Filter */}
          <div className="border-b border-slate-200 pb-4">
            <h3 className="font-bold text-sm mb-2">Delivery Day</h3>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={fastDeliveryOnly}
                onChange={(e) => setFastDeliveryOnly(e.target.checked)}
                className="rounded accent-[#007185] w-3.5 h-3.5"
              />
              <span className="text-slate-700 text-xs font-semibold">Get It by Tomorrow</span>
            </label>
          </div>

          {/* Department Filter */}
          <div className="border-b border-slate-200 pb-4">
            <h3 className="font-bold text-sm mb-2">Department</h3>
            <ul className="space-y-1.5 text-slate-700">
              <li>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`text-left hover:text-[#C45500] ${!selectedCategory ? "font-bold text-[#0F1111]" : ""}`}
                >
                  All Categories
                </button>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <button
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`text-left hover:text-[#C45500] ${selectedCategory === c.slug ? "font-bold text-[#0F1111]" : ""}`}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Reviews Filter */}
          <div className="border-b border-slate-200 pb-4">
            <h3 className="font-bold text-sm mb-2">Customer Review</h3>
            <div className="space-y-1.5">
              {[4, 3, 2].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setMinRating(minRating === stars ? null : stars)}
                  className={`flex items-center gap-1.5 hover:text-[#C45500] ${minRating === stars ? "font-bold text-[#C45500]" : "text-slate-700"}`}
                >
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < stars ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs">&amp; Up</span>
                  {minRating === stars && <Check className="w-3.5 h-3.5 text-[#C45500] ml-1" />}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Filters CTA */}
          {(selectedCategory || minRating || fastDeliveryOnly) && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setMinRating(null);
                setFastDeliveryOnly(false);
              }}
              className="text-xs font-semibold text-[#007185] hover:underline"
            >
              Clear all filters
            </button>
          )}
        </aside>

        {/* Main Product Grid */}
        <main className="flex-1">
          {filteredAndSorted.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
              <h2 className="text-lg font-bold text-[#0F1111]">No results found</h2>
              <p className="text-xs text-slate-500">
                Try checking your spelling or use more general terms.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setMinRating(null);
                  setFastDeliveryOnly(false);
                }}
                className="px-4 py-2 rounded-lg bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-xs font-bold text-[#0F1111]"
              >
                Reset search filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAndSorted.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-semibold text-slate-500">Loading search results…</div>}>
      <SearchResults />
    </Suspense>
  );
}
