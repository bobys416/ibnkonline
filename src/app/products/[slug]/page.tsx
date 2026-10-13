"use client";

import { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ShieldCheck, Star, Truck } from "lucide-react";
import { getProductBySlug, PRODUCTS } from "@/lib/catalog";
import { calculateDiscountPercent, formatINR } from "@/lib/money";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/store/ProductCard";

function ProductDetailContent() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const product = getProductBySlug(params.slug);
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(product?.variants[0]?.id ?? "");
  const [qty, setQty] = useState(1);

  const related = useMemo(
    () => PRODUCTS.filter((p) => p.categorySlug === product?.categorySlug && p.id !== product?.id).slice(0, 4),
    [product]
  );

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-black">Product not found</h1>
        <Link href="/products" className="text-[#0071DC] font-bold text-sm mt-3 inline-block">Back to catalog</Link>
      </div>
    );
  }

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const price = variant.sellingPricePaise ?? product.sellingPricePaise;
  const mrp = variant.mrpPaise ?? product.mrpPaise;
  const save = calculateDiscountPercent(mrp, price);

  return (
    <div className="max-w-[1536px] mx-auto px-4 py-8 space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/80">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50">
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
          </div>
        </div>
        <div className="lg:col-span-6 space-y-4">
          <p className="text-xs font-bold text-[#0071DC] uppercase">{product.brand} · {product.sku}</p>
          <h1 className="text-3xl font-black text-slate-900">{product.name}</h1>
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-bold">{product.rating}</span>
            <span className="text-slate-500">({product.reviewCount.toLocaleString("en-IN")} reviews)</span>
          </div>
          <div>
            <p className="text-3xl font-black">{formatINR(price)}</p>
            {mrp > price && (
              <p className="text-sm text-slate-500">
                MRP <span className="line-through">{formatINR(mrp)}</span> · <span className="text-emerald-700 font-bold">{save}% off</span>
              </p>
            )}
            <p className="text-xs text-slate-500 mt-1">Inclusive of GST · Prices in Indian Rupees</p>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{product.description}</p>
          {product.variants.length > 1 && (
            <div>
              <p className="text-xs font-bold mb-2">Options</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariantId(v.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold border ${variantId === v.id ? "bg-[#0071DC] text-white border-[#0071DC]" : "bg-white"}`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={variant.stockQuantity}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-20 rounded-full border px-3 py-2 text-sm"
            />
            <button
              onClick={() => addItem(product.id, variant.id, qty)}
              className="px-6 py-3 rounded-full bg-[#0071DC] text-white font-black text-sm"
            >
              Add to cart
            </button>
            <button
              onClick={() => {
                addItem(product.id, variant.id, qty);
                router.push("/checkout");
              }}
              className="px-6 py-3 rounded-full bg-[#FFC220] text-slate-950 font-black text-sm"
            >
              Buy now
            </button>
          </div>
          <p className="text-xs text-slate-500">{variant.stockQuantity} in stock · {product.delivery}</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl bg-white border p-3 flex items-center gap-2"><Truck className="w-4 h-4 text-[#0071DC]" /> {product.freeShipping ? "Free shipping" : "Standard shipping"}</div>
            <div className="rounded-2xl bg-white border p-3 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#0071DC]" /> {product.isCodEligible ? "COD available" : "Online payment only"}</div>
          </div>
          <dl className="bg-white rounded-2xl border p-4 grid grid-cols-2 gap-3 text-sm">
            {product.specs.map((s) => (
              <div key={s.key}><dt className="text-slate-500 text-xs">{s.key}</dt><dd className="font-semibold">{s.value}</dd></div>
            ))}
          </dl>
        </div>
      </div>
      <section>
        <h2 className="text-xl font-black mb-4">Related in this department</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="max-w-xl mx-auto px-4 py-20 text-center text-sm text-slate-600">Loading product…</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
