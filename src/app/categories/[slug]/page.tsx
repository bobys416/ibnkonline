"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProductCard } from "@/components/store/ProductCard";
import { getCategory, getProductsByCategory } from "@/lib/catalog";

function CategoryContent() {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategory(slug);
  const products = getProductsByCategory(slug);

  if (!category) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-black">Department not found</h1>
        <Link href="/categories" className="text-[#0071DC] font-bold text-sm">Browse departments</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1536px] mx-auto px-4 py-8 space-y-6">
      <div>
        <p className="text-xs font-bold text-[#0071DC] uppercase">Department</p>
        <h1 className="text-3xl font-black">{category.name}</h1>
        <p className="text-sm text-slate-600">{category.tagline}</p>
      </div>
      {products.length === 0 ? (
        <p className="text-sm text-slate-500">More products are arriving in this department.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="max-w-xl mx-auto px-4 py-20 text-center text-sm text-slate-600">Loading department…</div>}>
      <CategoryContent />
    </Suspense>
  );
}
