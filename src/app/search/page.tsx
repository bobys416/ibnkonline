"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/store/ProductCard";
import { searchProducts } from "@/lib/catalog";
import { Suspense } from "react";

function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const items = useMemo(() => searchProducts(q), [q]);

  return (
    <div className="max-w-[1536px] mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-black">Search results</h1>
      <p className="text-sm text-slate-600">{q ? `Showing ${items.length} matches for “${q}”` : "Browse the full catalog"}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((p) => (
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
