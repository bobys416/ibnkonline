"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/store/ProductCard";
import { getCategory, getProductsByCategory } from "@/lib/catalog";

function CategoryContent() {
  const params = useParams();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : (rawSlug as string) || "";
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.toLowerCase().trim() ?? "";

  const category = getCategory(slug);
  const allProducts = useMemo(() => getProductsByCategory(slug), [slug]);

  const products = useMemo(() => {
    if (!q) return allProducts;
    return allProducts.filter((p) =>
      [p.name, p.brand, p.shortDescription].join(" ").toLowerCase().includes(q)
    );
  }, [allProducts, q]);

  if (!category) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-3">
        <h1 className="text-2xl font-black text-[#0F1111]">Department not found</h1>
        <p className="text-xs text-slate-500">We couldn&apos;t find this shopping department.</p>
        <Link href="/categories" className="inline-block px-5 py-2 rounded-lg bg-[#FFD814] text-[#0F1111] font-bold text-xs">
          Browse all departments
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1536px] mx-auto px-4 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <Link href="/" className="hover:underline">Home</Link>
          <span>›</span>
          <Link href="/categories" className="hover:underline">Departments</Link>
          <span>›</span>
          <span className="font-semibold text-slate-700">{category.name}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F1111]">{category.name}</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{category.tagline}</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {products.length} {products.length === 1 ? "product" : "products"}
            {q && ` matching "${q}"`}
          </span>
        </div>
        {q && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1554D1] text-xs font-bold">
            <span>Filtered by: &quot;{q}&quot;</span>
            <Link href={`/categories/${slug}`} className="hover:underline text-[11px] font-semibold text-slate-500">
              (Clear search)
            </Link>
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <p className="text-base font-bold text-[#0F1111]">No products found in this department.</p>
          <p className="text-xs text-slate-500">Try browsing all products or resetting search filters.</p>
          <Link href="/products" className="inline-block px-5 py-2 rounded-lg bg-[#FFD814] text-[#0F1111] font-bold text-xs">
            Shop all catalog
          </Link>
        </div>
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
