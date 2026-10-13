"use client";

import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, getProductsByCategory } from "@/lib/catalog";

export default function CategoriesPage() {
  return (
    <div className="max-w-[1536px] mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-black">All departments</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <Link key={cat.slug} href={`/categories/${cat.slug}`} className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 group">
            <div className="relative h-40">
              <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="p-5">
              <h2 className="font-black text-lg">{cat.name}</h2>
              <p className="text-sm text-slate-600">{cat.tagline}</p>
              <p className="text-xs font-bold text-[#1554D1] mt-2">{getProductsByCategory(cat.slug).length} products</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
