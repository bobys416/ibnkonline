"use client";

import { ProductCard } from "@/components/store/ProductCard";
import { getFlashDeals } from "@/lib/catalog";

export default function DealsPage() {
  const deals = getFlashDeals();
  return (
    <div className="max-w-[1536px] mx-auto px-4 py-8 space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-rose-600 to-[#0071DC] text-white p-8">
        <h1 className="text-3xl sm:text-5xl font-black">Flash Deals & Rollbacks</h1>
        <p className="text-white/90 mt-2">Time-boxed INR prices. Add to cart and pay with UPI, cards, or COD.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {deals.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
