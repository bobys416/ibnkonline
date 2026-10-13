"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog";
import { calculateDiscountPercent, formatINRShort } from "@/lib/money";
import { QuantityPill } from "@/components/store/QuantityPill";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const save = calculateDiscountPercent(product.mrpPaise, product.sellingPricePaise);

  return (
    <article className="rounded-2xl border border-slate-200/80 p-3.5 flex flex-col justify-between hover:shadow-md hover:border-[#1554D1]/40 transition-all group bg-white">
      <div>
        <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-50 mb-3">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 16vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.badge && (
            <div className="absolute top-2 left-2">
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs ${
                  product.badge === "Rollback"
                    ? "bg-[#FF7900] text-white"
                    : product.badge === "Flash Deal"
                      ? "bg-rose-600 text-white"
                      : "bg-[#1554D1] text-white"
                }`}
              >
                {product.badge}
              </span>
            </div>
          )}
        </div>

        <div className="mb-2">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-lg font-black text-[#172033] tracking-tight">
              {formatINRShort(product.sellingPricePaise)}
            </span>
            {product.mrpPaise > product.sellingPricePaise && (
              <span className="text-xs text-slate-400 line-through">{formatINRShort(product.mrpPaise)}</span>
            )}
          </div>
          {save > 0 && <span className="text-[11px] font-bold text-emerald-700">Save {save}%</span>}
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-xs font-semibold text-slate-800 group-hover:text-[#1554D1] transition-colors line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>
        </Link>

        {product.rating > 0 && (
          <div className="flex items-center gap-1 text-[11px] text-slate-600 mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold">{product.rating}</span>
            <span className="text-slate-400">({product.reviewCount.toLocaleString("en-IN")})</span>
          </div>
        )}
        <p className="text-[10px] text-slate-500 line-clamp-1 mb-3">{product.delivery}</p>
      </div>
      <QuantityPill product={product} />
    </article>
  );
}
