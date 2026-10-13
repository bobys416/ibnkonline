"use client";

import { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ShieldCheck, Star, Truck, ChevronRight, Check } from "lucide-react";
import { getCategory, getProductBySlug, PRODUCTS } from "@/lib/catalog";
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
  const [addedNotice, setAddedNotice] = useState(false);

  const related = useMemo(
    () => PRODUCTS.filter((p) => p.categorySlug === product?.categorySlug && p.id !== product?.id).slice(0, 4),
    [product]
  );

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-3">
        <h1 className="text-2xl font-black text-[#172033]">Product not found</h1>
        <p className="text-xs text-slate-500">The product you requested could not be located in our catalog.</p>
        <Link href="/products" className="text-[#1554D1] font-bold text-sm hover:underline inline-block">
          Return to catalog
        </Link>
      </div>
    );
  }

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const price = variant.sellingPricePaise ?? product.sellingPricePaise;
  const mrp = variant.mrpPaise ?? product.mrpPaise;
  const save = calculateDiscountPercent(mrp, price);

  const handleAddToCart = () => {
    addItem(product.id, variant.id, qty);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-[1440px] mx-auto space-y-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-[#1554D1] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/products" className="hover:text-[#1554D1] transition-colors">Products</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href={`/categories/${product.categorySlug}`} className="hover:text-[#1554D1] transition-colors">
            {getCategory(product.categorySlug)?.name ?? product.categorySlug}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#172033] truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Gallery */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                priority
                className="object-contain p-4"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <span className="text-xs font-bold text-[#1554D1] uppercase tracking-wider">
                {product.brand} · SKU: {product.sku}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#172033] tracking-tight mt-1">
                {product.name}
              </h1>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-xs text-amber-900">{product.rating}</span>
              </div>
              <span className="text-xs text-slate-500">
                ({product.reviewCount.toLocaleString("en-IN")} customer reviews)
              </span>
            </div>

            {/* Price section */}
            <div className="border-y border-slate-100 py-4 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#172033]">{formatINR(price)}</span>
                {mrp > price && (
                  <>
                    <span className="text-sm text-slate-400 line-through">MRP {formatINR(mrp)}</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {save}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-500">Inclusive of all taxes (GST) · Express dispatch available</p>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">{product.description}</p>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                  Select Option:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVariantId(v.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        variantId === v.id
                          ? "bg-[#1554D1] text-white border-[#1554D1] shadow-2xs"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-full bg-slate-50 px-3 py-2">
                  <span className="text-xs font-bold text-slate-400 mr-2">Qty:</span>
                  <input
                    type="number"
                    min={1}
                    max={variant.stockQuantity}
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, Math.min(variant.stockQuantity, Number(e.target.value))))}
                    className="w-12 bg-transparent text-sm font-bold text-[#172033] text-center outline-none"
                  />
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 rounded-full bg-[#1554D1] hover:bg-[#0E44B0] text-white font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-98"
                >
                  {addedNotice ? "✓ Added to Cart!" : "Add to Cart"}
                </button>
                <button
                  onClick={() => {
                    addItem(product.id, variant.id, qty);
                    router.push("/checkout");
                  }}
                  className="flex-1 py-3.5 px-6 rounded-full bg-[#FF7900] hover:bg-[#E06A00] text-white font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-98"
                >
                  Buy Now
                </button>
              </div>
              <p className="text-xs text-slate-500">
                <span className="font-semibold text-emerald-700">{variant.stockQuantity} in stock</span> · {product.delivery}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="rounded-2xl bg-white border border-slate-200/80 p-3.5 flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#1554D1] shrink-0" />
                <span className="font-medium text-slate-700">
                  {product.freeShipping ? "Free Delivery on ₹499+" : "Standard Shipping"}
                </span>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200/80 p-3.5 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#1554D1] shrink-0" />
                <span className="font-medium text-slate-700">
                  {product.isCodEligible ? "Cash on Delivery Eligible" : "Online Payment"}
                </span>
              </div>
            </div>

            {/* Specifications */}
            {product.specs.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2">
                <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">Specifications</h3>
                <dl className="grid grid-cols-2 gap-3 text-xs pt-1">
                  {product.specs.map((s) => (
                    <div key={s.key}>
                      <dt className="text-slate-400 font-medium">{s.key}</dt>
                      <dd className="font-bold text-[#172033] mt-0.5">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-lg sm:text-xl font-black text-[#172033]">Related in this Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
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
