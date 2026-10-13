"use client";

import Link from "next/link";
import { Flame, ChevronRight, Clock } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { getFlashDeals } from "@/lib/catalog";

export default function DealsPage() {
  const deals = getFlashDeals();
  return (
    <div className="min-h-screen bg-[#FAFAF7] py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="max-w-[1440px] mx-auto space-y-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-[#1554D1] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#172033]">Deals & Offers</span>
        </nav>

        {/* Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#FF7900] to-[#1554D1] text-white p-8 sm:p-10 shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white font-bold text-xs uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-white" />
            Limited-Time Rollbacks · INR Pricing
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Flash Deals &amp; Rollbacks
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-xl leading-relaxed">
            Everyday low prices on top electronics, home appliances, fashion, and groceries with fast dispatch from Wadala.
          </p>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {deals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
