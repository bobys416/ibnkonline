"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Clock,
  Flame,
  RotateCcw,
  ShieldCheck,
  Store,
  Truck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { IbnkLogo } from "@/components/ibnk/IbnkLogo";
import { ProductCard } from "@/components/store/ProductCard";
import { CATEGORIES, getFlashDeals } from "@/lib/catalog";

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 38, seconds: 42 });
  const [isMounted, setIsMounted] = useState(false);
  const flashDeals = getFlashDeals();

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const bentoCollections = [
    {
      title: "Top Picks in Electronics",
      href: "/categories/electronics",
      items: [
        { label: "Smart TVs", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=300&q=80" },
        { label: "Headphones", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80" },
        { label: "Laptops & PCs", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=300&q=80" },
        { label: "Smartwatches", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80" },
      ],
    },
    {
      title: "Outdoor & Patio Refresh",
      href: "/categories/patio-garden",
      items: [
        { label: "Patio Furniture", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=300&q=80" },
        { label: "Garden Planters", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=300&q=80" },
        { label: "Home Seating", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80" },
        { label: "Weekend Grills", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80" },
      ],
    },
    {
      title: "Pantry & Snack Favorites",
      href: "/categories/grocery",
      items: [
        { label: "Coffee & Tea", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80" },
        { label: "Healthy Snacks", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80" },
        { label: "Breakfast Cereals", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=300&q=80" },
        { label: "Beverages", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=300&q=80" },
      ],
    },
    {
      title: "Trending Fashion & Footwear",
      href: "/categories/fashion",
      items: [
        { label: "Sneakers", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80" },
        { label: "Denim & Jeans", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=300&q=80" },
        { label: "Activewear", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80" },
        { label: "Handbags", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&q=80" },
      ],
    },
  ];

  return (
    <div data-hydrated={isMounted ? "true" : "false"} className="flex flex-col gap-6 md:gap-8 pb-16 bg-[#FAFAF7]">
      {/* 1. Hero Promo Section */}
      <section className="max-w-[1440px] mx-auto px-4 w-full pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Hero Card */}
          <div className="lg:col-span-8 rounded-3xl overflow-hidden bg-gradient-to-r from-[#172033] via-[#1554D1] to-[#1E67FF] text-white p-6 sm:p-10 relative flex flex-col justify-between min-h-[380px] shadow-sm">
            <div className="relative z-10 max-w-xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7900] text-white font-bold text-xs uppercase tracking-wider shadow-2xs">
                <Flame className="w-3.5 h-3.5 fill-white" />
                Flash Deals Live · INR Checkout
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Save up to 65% with everyday low prices.
              </h1>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                Discover unmissable deals across 4K Smart TVs, tech gadgets, fashion, grocery, and home essentials. Instant online payments &amp; COD.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/deals"
                  className="px-6 py-3 rounded-full bg-[#FF7900] hover:bg-[#E06A00] text-white font-bold text-sm transition-all shadow-sm inline-flex items-center gap-2 active:scale-98"
                >
                  Shop Flash Deals <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products"
                  className="px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-sm transition-all backdrop-blur-xs"
                >
                  Explore All Products
                </Link>
              </div>
            </div>
            <div className="relative z-10 pt-6 border-t border-white/20 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-white/90">
              <span className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#FF7900]" /> Dispatched from Wadala Hub
              </span>
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#FF7900]" /> Free shipping on ₹499+
              </span>
              <span className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#FF7900]" /> Hassle-free 7-day returns
              </span>
            </div>
          </div>

          {/* Right Bento Column */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="rounded-3xl bg-white p-6 shadow-xs border border-slate-200/80 flex-1 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1554D1] flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#172033]">Pan-India Delivery</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Fast doorstep delivery from our primary Mumbai fulfillment facility.
                </p>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#1554D1] hover:underline"
              >
                Browse catalog <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-[#172033] to-[#0A2E80] text-white p-6 flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <IbnkLogo variant="white" className="h-6 w-auto" width={80} height={24} />
                <span className="font-bold text-sm">Ab har dukaan, bank samaan</span>
              </div>
              <h3 className="text-base font-black">Quality products at honest prices</h3>
              <p className="text-xs text-slate-300">
                Verified sellers, transparent GST invoices, and secure payments via Stripe.
              </p>
              <Link
                href="/categories"
                className="block text-center py-2.5 rounded-full bg-[#FF7900] hover:bg-[#E06A00] text-white font-bold text-xs transition-colors shadow-2xs"
              >
                Browse Departments
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Explore Departments Grid */}
      <section className="max-w-[1440px] mx-auto px-4 w-full">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-extrabold text-[#172033]">Explore Popular Categories</h2>
            <Link href="/categories" className="text-xs font-bold text-[#1554D1] hover:underline inline-flex items-center gap-1">
              All Departments <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="flex flex-col items-center gap-2 group shrink-0 w-20 sm:w-24 text-center"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-transparent group-hover:border-[#1554D1] transition-all">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-[#1554D1] line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Flash Deals Row */}
      <section className="max-w-[1440px] mx-auto px-4 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse inline-block" />
                <h2 className="text-xl sm:text-2xl font-black text-[#172033]">Today&apos;s Flash Deals</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Limited-time discounted prices with fast delivery</p>
            </div>
            <div className="flex items-center gap-2 bg-blue-50/80 px-4 py-2 rounded-full border border-blue-100">
              <Clock className="w-4 h-4 text-[#1554D1]" />
              <span className="text-xs font-bold text-slate-700">Ends in:</span>
              <span className="font-mono font-bold text-xs text-[#1554D1]">
                {String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m : {String(timeLeft.seconds).padStart(2, "0")}s
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {flashDeals.slice(0, 6).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Bento Collections */}
      <section className="max-w-[1440px] mx-auto px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bentoCollections.map((col) => (
            <div key={col.title} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
              <h3 className="font-bold text-[#172033] text-sm sm:text-base mb-4">{col.title}</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {col.items.map((item) => (
                  <Link key={item.label} href={col.href} className="group flex flex-col gap-1.5">
                    <div className="relative h-28 w-full rounded-2xl overflow-hidden bg-slate-50">
                      <Image src={item.image} alt={item.label} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-[#1554D1] transition-colors">{item.label}</span>
                  </Link>
                ))}
              </div>
              <Link href={col.href} className="text-xs font-bold text-[#1554D1] hover:underline inline-flex items-center gap-1 pt-2 border-t border-slate-100 w-full">
                Shop all {col.title} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Trust & Assurance Badges */}
      <section className="max-w-[1440px] mx-auto px-4 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shadow-2xs">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#1554D1] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#172033]">Everyday Low Prices</h4>
              <p className="text-xs text-slate-500 mt-0.5">Transparent INR pricing with GST-compliant invoicing.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-[#FF7900] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#172033]">Free Shipping on ₹499+</h4>
              <p className="text-xs text-slate-500 mt-0.5">Fast delivery dispatched from our central Wadala hub.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#172033]">7-Day Easy Returns</h4>
              <p className="text-xs text-slate-500 mt-0.5">Doorstep pickup and swift refund processing.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#172033]">Secure Online Payments</h4>
              <p className="text-xs text-slate-500 mt-0.5">PCI-DSS encrypted Stripe checkout &amp; Cash on Delivery.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
