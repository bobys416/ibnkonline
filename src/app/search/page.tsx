"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/store/ProductCard";
import { searchProducts, registerDynamicProduct, CatalogProduct } from "@/lib/catalog";

function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const initialItems = useMemo(() => searchProducts(q), [q]);
  const [items, setItems] = useState<CatalogProduct[]>(initialItems);
  const [isMounted, setIsMounted] = useState(false);

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

  const displayItems = isMounted ? items : initialItems;

  return (
    <div className="max-w-[1536px] mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-black">Search results</h1>
      <p className="text-sm text-slate-600">
        {q ? `Showing ${displayItems.length} matches for “${q}”` : "Browse the full catalog"}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayItems.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading search…</div>}>
      <SearchResults />
    </Suspense>
  );
}
