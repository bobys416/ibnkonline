"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Truck, ShieldCheck, Tag, Heart, ArrowRight, Sparkles, ShoppingBag, Plus } from "lucide-react";

interface MeeshoProduct {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: string;
  category: string;
  freeDelivery: boolean;
  image: string;
  badge?: string;
}

export function MeeshoStyleSection() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeBudget, setActiveBudget] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const categories = [
    { id: "all", label: "All Items" },
    { id: "ethnic", label: "Women Ethnic" },
    { id: "western", label: "Women Western" },
    { id: "men", label: "Men's Fashion" },
    { id: "home", label: "Home & Kitchen" },
    { id: "jewellery", label: "Jewellery" },
    { id: "beauty", label: "Beauty & Personal" },
  ];

  const budgetStores = [
    { label: "Under ₹99", maxPrice: 99, color: "from-pink-500 to-rose-500" },
    { label: "Under ₹199", maxPrice: 199, color: "from-purple-600 to-indigo-600" },
    { label: "Under ₹299", maxPrice: 299, color: "from-blue-600 to-cyan-600" },
    { label: "Under ₹499", maxPrice: 499, color: "from-emerald-600 to-teal-600" },
  ];

  const products: MeeshoProduct[] = [
    {
      id: "m_saree_1",
      title: "Kanjivaram Soft Silk Woven Jacquard Saree with Blouse Piece",
      price: 389,
      originalPrice: 1499,
      discount: 74,
      rating: 4.3,
      reviews: "18.4k",
      category: "ethnic",
      freeDelivery: true,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80",
      badge: "Trending #1",
    },
    {
      id: "m_kurti_1",
      title: "Anarkali Rayon Embroidered Floral Kurti with Pant & Dupatta Set",
      price: 299,
      originalPrice: 999,
      discount: 70,
      rating: 4.4,
      reviews: "12.8k",
      category: "ethnic",
      freeDelivery: true,
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80",
      badge: "Best Seller",
    },
    {
      id: "m_top_1",
      title: "Korean Style Ribbed Puff Sleeves Casual Western Top",
      price: 189,
      originalPrice: 599,
      discount: 68,
      rating: 4.2,
      reviews: "9.1k",
      category: "western",
      freeDelivery: true,
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "m_dress_1",
      title: "Floral Printed A-Line Georgette Midi Dress for Women",
      price: 249,
      originalPrice: 799,
      discount: 69,
      rating: 4.5,
      reviews: "6.7k",
      category: "western",
      freeDelivery: true,
      image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "m_shirt_1",
      title: "Men Cotton Blend Mandarin Collar Casual Long Sleeve Shirt",
      price: 279,
      originalPrice: 899,
      discount: 69,
      rating: 4.3,
      reviews: "14.2k",
      category: "men",
      freeDelivery: true,
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "m_tshirt_1",
      title: "Men Oversized Pure Cotton Graphic Anime Print Round Neck T-Shirt",
      price: 199,
      originalPrice: 699,
      discount: 71,
      rating: 4.4,
      reviews: "22.5k",
      category: "men",
      freeDelivery: true,
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80",
      badge: "Hot Deal",
    },
    {
      id: "m_bedsheet_1",
      title: "Pure Cotton Double King Size Glace Bedsheet with 2 Pillow Covers",
      price: 249,
      originalPrice: 799,
      discount: 68,
      rating: 4.2,
      reviews: "11.3k",
      category: "home",
      freeDelivery: true,
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "m_curtain_1",
      title: "Polyester Jacquard Room Darkening Long Eyelet Door Curtains (Set of 2)",
      price: 199,
      originalPrice: 650,
      discount: 69,
      rating: 4.1,
      reviews: "8.9k",
      category: "home",
      freeDelivery: true,
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "m_jewellery_1",
      title: "Gold Plated Kundan & Pearl Traditional Choker Jewellery Set",
      price: 149,
      originalPrice: 599,
      discount: 75,
      rating: 4.6,
      reviews: "31.2k",
      category: "jewellery",
      freeDelivery: true,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80",
      badge: "Top Rated",
    },
    {
      id: "m_earrings_1",
      title: "Oxidised Silver Traditional Jhumka Earrings with Hanging Pearls",
      price: 89,
      originalPrice: 349,
      discount: 74,
      rating: 4.5,
      reviews: "19.8k",
      category: "jewellery",
      freeDelivery: true,
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "m_skincare_1",
      title: "Vitamin C Brightening Face Serum with Hyaluronic Acid (30ml)",
      price: 179,
      originalPrice: 549,
      discount: 67,
      rating: 4.4,
      reviews: "15.4k",
      category: "beauty",
      freeDelivery: true,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "m_lipstick_1",
      title: "12hr Long-Lasting Waterproof Matte Liquid Lipstick Set (Combo of 4)",
      price: 129,
      originalPrice: 499,
      discount: 74,
      rating: 4.3,
      reviews: "24.1k",
      category: "beauty",
      freeDelivery: true,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesBudget = activeBudget === null || p.price <= activeBudget;
    return matchesCategory && matchesBudget;
  });

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="max-w-[1536px] mx-auto px-4 w-full">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        {/* Section Header with Meesho Brand Accents */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fcebf7] text-[#9F2089] font-black text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Direct From Manufacturer · Lowest Prices
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Top Picks in Indian Fashion, Ethnic Wear & Daily Essentials
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Quality verified products delivered direct from verified factories with Cash on Delivery & Free Returns.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              ✓ 100% Cash on Delivery
            </span>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-200 hidden sm:inline">
              ✓ 7-Day Easy Returns
            </span>
          </div>
        </div>

        {/* Budget Stores Strip (Under ₹99, ₹199, ₹299, ₹499) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase text-slate-600 tracking-wider">
              Budget Stores — Shop by Price
            </span>
            {activeBudget !== null && (
              <button
                onClick={() => setActiveBudget(null)}
                className="text-xs font-bold text-[#9F2089] hover:underline"
              >
                Clear Budget Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {budgetStores.map((store) => (
              <button
                key={store.label}
                onClick={() =>
                  setActiveBudget(activeBudget === store.maxPrice ? null : store.maxPrice)
                }
                className={`py-3 px-4 rounded-2xl bg-gradient-to-r ${store.color} text-white font-black text-center shadow-xs hover:opacity-95 transition-all flex items-center justify-between ${
                  activeBudget === store.maxPrice ? "ring-4 ring-purple-300 scale-102" : ""
                }`}
              >
                <span className="text-sm">{store.label}</span>
                <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  View →
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-4 mb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-[#9F2089] text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredProducts.map((p) => {
            const isFav = wishlist[p.id];
            return (
              <div
                key={p.id}
                className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative h-44 sm:h-52 w-full bg-slate-50 overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badge */}
                    {p.badge && (
                      <span className="absolute top-2 left-2 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#9F2089] text-white shadow-xs">
                        {p.badge}
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-slate-600 hover:text-rose-500 shadow-xs transition-colors"
                      aria-label="Wishlist"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isFav ? "fill-rose-500 text-rose-500" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h3 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug mb-2 group-hover:text-[#9F2089] transition-colors">
                      {p.title}
                    </h3>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-base sm:text-lg font-black text-slate-900 font-sans">
                        ₹{p.price}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ₹{p.originalPrice}
                      </span>
                      <span className="text-[11px] font-black text-emerald-600">
                        {p.discount}% off
                      </span>
                    </div>

                    {/* Free Delivery Tag */}
                    {p.freeDelivery && (
                      <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 mb-2">
                        Free Delivery
                      </span>
                    )}

                    {/* Rating Pill */}
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px]">
                        <span>{p.rating}</span>
                        <Star className="w-2.5 h-2.5 fill-white text-white" />
                      </span>
                      <span className="text-[10px] text-slate-400">({p.reviews})</span>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="p-3 pt-0">
                  <button
                    onClick={() => {
                      alert(`Added "${p.title}" to IBNK cart!`);
                    }}
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-[#9F2089] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Meesho / iBnK Supplier & Reseller Banner ("Ab har dukaan bank samaan") */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#9F2089] via-[#80146e] to-[#004f9a] text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase font-black tracking-widest text-amber-300">
              Supplier & Reseller Ecosystem · Wadala Hub Mumbai
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Sell on IBNK at 0% Commission — Ab Har Dukaan Bank Samaan
            </h3>
            <p className="text-xs sm:text-sm text-white/85 max-w-xl">
              Join 11 Lakh+ Indian manufacturers and sellers. Reach millions of customers across 28,000+ pin codes with 7-day payment settlement directly to your bank account.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/sell"
              className="px-6 py-3 rounded-full bg-white text-[#9F2089] font-black text-xs hover:bg-slate-100 transition-colors shadow-sm"
            >
              Start Selling (0% Fee)
            </Link>
            <Link
              href="/resell"
              className="px-6 py-3 rounded-full bg-[#FF7900] text-white font-black text-xs hover:bg-[#e06a00] transition-colors shadow-sm"
            >
              Resell & Earn
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
