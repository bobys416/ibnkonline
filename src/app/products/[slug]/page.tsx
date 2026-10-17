"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ShieldCheck,
  Star,
  Truck,
  ChevronRight,
  Check,
  RotateCcw,
  Lock,
  Tag,
  CreditCard,
  MapPin,
  HelpCircle,
  ThumbsUp,
  Share2,
} from "lucide-react";
import { getCategory, getProductBySlug, registerDynamicProduct, PRODUCTS, type CatalogProduct } from "@/lib/catalog";
import { calculateDiscountPercent, formatINR } from "@/lib/money";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/store/ProductCard";
import { useSyncExternalStore } from "react";
import {
  getDeliveryLocationSnapshot,
  parseDeliveryLocation,
  subscribeToDeliveryLocation,
} from "@/lib/delivery-location";

function ProductDetailContent() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<CatalogProduct | undefined>(() => {
    const p = getProductBySlug(params.slug);
    if (p) registerDynamicProduct(p);
    return p;
  });
  const [isFetching, setIsFetching] = useState(!product);
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(product?.variants[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedNotice, setAddedNotice] = useState(false);

  const locationSnapshot = useSyncExternalStore(
    subscribeToDeliveryLocation,
    getDeliveryLocationSnapshot,
    () => null
  );
  const savedLocation = useMemo(() => {
    try {
      return parseDeliveryLocation(locationSnapshot);
    } catch {
      return null;
    }
  }, [locationSnapshot]);

  useEffect(() => {
    if (!product && params.slug) {
      setIsFetching(true);
      fetch(`/api/products?slug=${encodeURIComponent(params.slug)}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data?.product) {
            const p = json.data.product;
            registerDynamicProduct(p);
            setProduct(p);
            if (p.variants?.[0]?.id) {
              setVariantId(p.variants[0].id);
            }
          }
        })
        .catch(() => {})
        .finally(() => {
          setIsFetching(false);
        });
    } else if (product) {
      registerDynamicProduct(product);
    }
  }, [params.slug, product]);

  const related = useMemo(
    () => PRODUCTS.filter((p) => p.categorySlug === product?.categorySlug && p.id !== product?.id).slice(0, 4),
    [product]
  );

  if (!product) {
    if (isFetching) {
      return (
        <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading product details…</p>
        </div>
      );
    }
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

  // Provide multi-angle images if array has 1 item
  const galleryImages =
    product.images && product.images.length > 1
      ? product.images
      : [
          product.images[0],
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        ];

  const handleAddToCart = () => {
    addItem(product.id, variant.id, qty);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    addItem(product.id, variant.id, qty);
    router.push("/checkout");
  };

  // Mock estimated monthly EMI
  const monthlyEmi = Math.round(price / 12 / 100);

  return (
    <div className="min-h-screen bg-white py-4 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-[1480px] mx-auto space-y-6">
        {/* Amazon-style Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-[#007185] hover:underline">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href="/products" className="hover:text-[#007185] hover:underline">Products</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href={`/categories/${product.categorySlug}`} className="hover:text-[#007185] hover:underline">
            {getCategory(product.categorySlug)?.name ?? product.categorySlug}
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-[#0F1111] font-medium truncate max-w-sm">{product.name}</span>
        </nav>

        {/* 3-Column Amazon PDP Grid: Gallery | Product Info | Sticky Buy Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: Multi-Thumbnail Image Gallery (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col-reverse sm:flex-row gap-4 items-start">
            {/* Thumbnails strip */}
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onMouseEnter={() => setActiveImageIndex(idx)}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 transition-all bg-slate-50 ${
                    activeImageIndex === idx
                      ? "border-[#E77600] shadow-sm ring-2 ring-[#E77600]/30"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                  aria-label={`View image thumbnail ${idx + 1}`}
                >
                  <Image src={imgUrl} alt={`${product.name} thumbnail ${idx + 1}`} fill className="object-contain p-1" />
                </button>
              ))}
            </div>

            {/* Main Stage Image */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border border-slate-200/90 p-4 flex items-center justify-center">
              <Image
                src={galleryImages[activeImageIndex] || galleryImages[0]}
                alt={product.name}
                fill
                priority
                className="object-contain p-6 hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 right-3 text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Hover to zoom
              </span>
            </div>
          </div>

          {/* Column 2: Center Details (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <Link
                href={`/categories/${product.categorySlug}`}
                className="text-xs font-bold text-[#007185] hover:text-[#C7511F] hover:underline"
              >
                Visit the {product.brand} Store
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0F1111] leading-snug mt-1">
                {product.name}
              </h1>
            </div>

            {/* Amazon Rating & #1 Best Seller badge */}
            <div className="flex flex-wrap items-center gap-3 text-xs border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1">
                <span className="font-bold text-[#0F1111]">{product.rating}</span>
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300 fill-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer">
                {product.reviewCount.toLocaleString("en-IN")} ratings
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer">
                100+ answered questions
              </span>
            </div>

            {/* Amazon Best Seller Tag */}
            {product.isBestSeller && (
              <div className="inline-flex items-center gap-2 bg-[#E67A00] text-white px-2.5 py-1 text-xs font-black rounded-sm shadow-2xs">
                <span>#1 Best Seller</span>
                <span className="font-normal opacity-90 text-[11px]">in {getCategory(product.categorySlug)?.name || "Electronics"}</span>
              </div>
            )}

            {/* Amazon Pricing Section */}
            <div className="space-y-1 py-1 border-b border-slate-100 pb-3">
              <div className="flex items-baseline gap-2">
                {save > 0 && (
                  <span className="text-2xl font-light text-[#CC0C39]">
                    -{save}%
                  </span>
                )}
                <span className="text-3xl font-bold text-[#0F1111]">{formatINR(price)}</span>
              </div>

              {mrp > price && (
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span>M.R.P.:</span>
                  <span className="line-through">{formatINR(mrp)}</span>
                </div>
              )}
              <p className="text-xs text-[#0F1111] font-medium">Inclusive of all taxes</p>
              <p className="text-xs text-slate-700">
                <span className="font-bold">EMI</span> starts at ₹{monthlyEmi.toLocaleString("en-IN")} per month.{" "}
                <span className="text-[#007185] font-semibold hover:underline cursor-pointer">EMI options</span>
              </p>
            </div>

            {/* Bank Offers Carousel Card */}
            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F1111]">
                <Tag className="w-4 h-4 text-[#B12704]" />
                <span>Offers &amp; Instant Discounts</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                  <p className="font-bold text-[#0F1111]">Bank Offer</p>
                  <p className="text-slate-600 leading-tight">Upto ₹1,500.00 discount on select Credit Cards</p>
                  <span className="text-[#007185] font-bold block pt-0.5">3 offers &gt;</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                  <p className="font-bold text-[#0F1111]">Partner Offers</p>
                  <p className="text-slate-600 leading-tight">Get GST invoice and save up to 28% on business purchases</p>
                  <span className="text-[#007185] font-bold block pt-0.5">1 offer &gt;</span>
                </div>
              </div>
            </div>

            {/* Product Variants (Color, Size) */}
            {product.variants.length > 1 && (
              <div className="space-y-2 pt-1 border-b border-slate-100 pb-3">
                <label className="text-xs font-bold text-[#0F1111] block">
                  Select Style / Color / Size:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVariantId(v.id)}
                      className={`px-3.5 py-1.5 rounded-md text-xs font-bold border transition-all ${
                        variantId === v.id
                          ? "bg-[#FFF8F0] border-[#E77600] text-[#0F1111] shadow-2xs ring-1 ring-[#E77600]"
                          : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* About this item bullet points */}
            <div className="space-y-2 pt-1">
              <h3 className="text-sm font-bold text-[#0F1111]">About this item</h3>
              <ul className="list-disc list-outside pl-4 text-xs text-slate-700 space-y-1.5 leading-relaxed">
                <li>{product.description}</li>
                {product.specs.map((s) => (
                  <li key={s.key}>
                    <span className="font-bold">{s.key}:</span> {s.value}
                  </li>
                ))}
                <li>GST-compliant tax invoice included with every shipment.</li>
                <li>Eligible for 7-day replacement guarantee against manufacturing defects.</li>
              </ul>
            </div>
          </div>

          {/* Column 3: Amazon Sticky Master Buy Box (3 cols on lg) */}
          <div className="lg:col-span-3">
            <div className="border border-slate-200/90 rounded-2xl p-5 bg-white shadow-md space-y-4 lg:sticky lg:top-24">
              {/* Buy Box Price */}
              <div className="space-y-0.5">
                <span className="text-2xl font-bold text-[#B12704]">{formatINR(price)}</span>
                <p className="text-xs text-slate-500">
                  {mrp > price && <span className="line-through mr-1.5">{formatINR(mrp)}</span>}
                  Inclusive of all taxes
                </p>
              </div>

              {/* Delivery ETA & Pincode */}
              <div className="space-y-1 text-xs">
                <p className="text-slate-800">
                  <span className="font-bold text-[#007185]">FREE delivery</span>{" "}
                  <span className="font-bold">Tomorrow, 2 PM</span>. Order within{" "}
                  <span className="text-[#007600] font-bold">4 hrs 15 mins</span>.
                </p>
                <div className="flex items-center gap-1.5 text-slate-600 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#007185] shrink-0" />
                  <span className="truncate">
                    Deliver to {savedLocation ? `${savedLocation.city || "Mumbai"} ${savedLocation.pinCode}` : "Mumbai 400001"}
                  </span>
                </div>
              </div>

              {/* In Stock Notice */}
              <div>
                {variant.stockQuantity > 0 ? (
                  <span className="text-base font-bold text-[#007600]">In stock</span>
                ) : (
                  <span className="text-base font-bold text-[#CC0C39]">Currently unavailable</span>
                )}
                {variant.stockQuantity > 0 && variant.stockQuantity <= 5 && (
                  <p className="text-xs text-[#B12704] font-semibold mt-0.5">
                    Only {variant.stockQuantity} left in stock - order soon.
                  </p>
                )}
              </div>

              {/* Quantity Select Dropdown */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <span>Quantity:</span>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="bg-transparent font-bold text-[#0F1111] outline-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons: Yellow Add to Cart & Orange Buy Now */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-2.5 px-4 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  {addedNotice ? "✓ Added to Cart" : "Add to Cart"}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-2.5 px-4 rounded-full bg-[#FFA41C] hover:bg-[#FA8900] text-[#0F1111] font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-98"
                >
                  Buy Now
                </button>
              </div>

              {/* Security and Seller Credibility Table */}
              <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
                <div className="flex items-center gap-1.5 text-[#007185]">
                  <Lock className="w-3.5 h-3.5" />
                  <span className="font-semibold">Secure transaction</span>
                </div>
                <div className="grid grid-cols-2 text-[11px] gap-1 pt-1">
                  <span className="text-slate-400">Ships from</span>
                  <span className="font-bold text-slate-800">iBNK Fulfillment</span>
                  <span className="text-slate-400">Sold by</span>
                  <span className="font-bold text-[#007185] truncate">{product.brand} Official</span>
                </div>
              </div>

              {/* Badges Strip */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[10px] text-center text-slate-600 font-semibold">
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-[#007185]" />
                  <span>7 days Replacement</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-[#007185]" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#007185]" />
                  <span>1 Year Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Table Section */}
        {product.specs.length > 0 && (
          <section className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4">
            <h2 className="text-lg font-black text-[#0F1111]">Technical Details &amp; Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
              {product.specs.map((s, idx) => (
                <div key={idx} className="flex border-b border-slate-100 py-2 justify-between">
                  <span className="font-bold text-slate-500 w-1/2">{s.key}</span>
                  <span className="text-slate-900 font-semibold w-1/2 text-left">{s.value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Amazon Customer Reviews Breakdown Section */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-6">
          <h2 className="text-lg font-black text-[#0F1111]">Customer Ratings &amp; Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Rating Breakdown Bars */}
            <div className="md:col-span-4 space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#0F1111]">{product.rating}</span>
                <span className="text-sm text-slate-500">out of 5 stars</span>
              </div>
              <p className="text-xs text-slate-500">{product.reviewCount.toLocaleString("en-IN")} global ratings</p>

              <div className="space-y-2 pt-2 text-xs">
                {[
                  { star: "5 star", pct: 74 },
                  { star: "4 star", pct: 18 },
                  { star: "3 star", pct: 5 },
                  { star: "2 star", pct: 2 },
                  { star: "1 star", pct: 1 },
                ].map((item) => (
                  <div key={item.star} className="flex items-center gap-3">
                    <span className="w-12 text-[#007185] font-semibold">{item.star}</span>
                    <div className="flex-1 h-4 bg-slate-100 rounded-sm overflow-hidden">
                      <div className="h-full bg-[#FFA41C]" style={{ width: `${item.pct}%` }} />
                    </div>
                    <span className="w-8 text-right text-slate-600">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Review Highlights */}
            <div className="md:col-span-8 space-y-4">
              <h3 className="font-bold text-sm text-[#0F1111]">Top reviews from India</h3>
              <div className="space-y-4 text-xs">
                <div className="border-b border-slate-100 pb-3 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                      R
                    </div>
                    <span className="font-bold text-slate-800">Rohan V.</span>
                    <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                      <Check className="w-3 h-3" /> Verified Purchase
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-[#0F1111]">Exceeded expectations. Outstanding quality!</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Delivered right on time in pristine packaging. Build quality is top-notch, exactly as described. Genuine GST invoice received.
                  </p>
                </div>

                <div className="border-b border-slate-100 pb-3 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                      P
                    </div>
                    <span className="font-bold text-slate-800">Pooja Sharma</span>
                    <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                      <Check className="w-3 h-3" /> Verified Purchase
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-[#0F1111]">Great value for money</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Smooth ordering and fast delivery to Mumbai. Very satisfied with the customer service and prompt delivery notifications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related in this category */}
        {related.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-lg sm:text-xl font-black text-[#0F1111]">Customers who viewed this item also viewed</h2>
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
