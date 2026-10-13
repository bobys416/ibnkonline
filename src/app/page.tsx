"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Clock,
  Flame,
  Headphones,
  RotateCcw,
  ShieldCheck,
  Store,
  Tag,
  Truck,
  ChevronRight,
} from "lucide-react";
import { IbnkLogo } from "@/components/ibnk/IbnkLogo";
import { MeeshoStyleSection } from "@/components/meesho/MeeshoStyleSection";
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
      title: "Refresh Outdoor & Patio",
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
        { label: "Breakfast", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=300&q=80" },
        { label: "Beverages", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=300&q=80" },
      ],
    },
    {
      title: "Trending Fashion & Shoes",
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
    <div data-hydrated={isMounted ? "true" : "false"} className="flex flex-col gap-6 md:gap-8 pb-16 bg-[#f2f4f7]">
      <section className="max-w-[1536px] mx-auto px-4 w-full pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 rounded-3xl overflow-hidden bg-gradient-to-r from-[#004f9a] via-[#0071DC] to-[#0084ff] text-white p-6 sm:p-10 relative flex flex-col justify-between min-h-[380px] shadow-sm">
            <div className="relative z-10 max-w-xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC220] text-slate-950 font-black text-xs uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 fill-slate-950" />
                Flash Deals Live · INR
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Save up to 65% with Flash Deals.
              </h1>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                Everyday low prices on 4K TVs, kitchen tech, fashion, grocery, and home — paid with UPI, cards, netbanking, wallets, or COD.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/deals" className="px-6 py-3 rounded-full bg-white text-[#0071DC] font-black text-sm hover:bg-slate-100 transition-colors shadow-sm inline-flex items-center gap-2">
                  Shop Flash Deals <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/products" className="px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-sm">
                  Shop all products
                </Link>
              </div>
            </div>
            <div className="relative z-10 pt-6 border-t border-white/20 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-white/90">
              <span className="flex items-center gap-2"><Store className="w-4 h-4 text-[#FFC220]" /> Pickup today at Wadala Hub</span>
              <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-[#FFC220]" /> Free shipping on ₹499+</span>
              <span className="flex items-center gap-2"><RotateCcw className="w-4 h-4 text-[#FFC220]" /> Easy 7-day returns</span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="rounded-3xl bg-white p-6 shadow-xs border border-slate-200/80 flex-1">
              <div className="w-10 h-10 rounded-2xl bg-[#E6F1FC] text-[#0071DC] flex items-center justify-center mb-3">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Get it as fast as today</h3>
              <p className="text-xs text-slate-600 mt-1.5">Curbside pickup & same-day delivery from Wadala Hub, Mumbai.</p>
              <Link href="/checkout" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#0071DC]">
                Start an order <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-[#004f9a] to-[#002f6c] text-white p-6 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <IbnkLogo variant="white" className="h-6 w-auto" width={80} height={24} />
                <span className="font-black">IBNK+</span>
              </div>
              <h3 className="text-lg font-black">Members save more every month</h3>
              <p className="text-xs text-white/80 mt-1">Free delivery, no shipping minimum, and exclusive rollbacks.</p>
              <Link href="/ibnk-plus" className="mt-4 block text-center py-2.5 rounded-full bg-[#FFC220] text-slate-950 font-black text-xs">
                Start 30-Day Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1536px] mx-auto px-4 w-full">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-slate-900">Explore Departments</h2>
            <Link href="/categories" className="text-xs font-bold text-[#0071DC] inline-flex items-center gap-1">
              All Departments <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/categories/${cat.slug}`} className="flex flex-col items-center gap-2 group shrink-0 w-20 sm:w-24 text-center">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-transparent group-hover:border-[#0071DC]">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                </div>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-[#0071DC] line-clamp-1">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1536px] mx-auto px-4 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping inline-block" />
                <h2 className="text-2xl font-black text-slate-900">Flash Deals & Rollbacks</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Limited-time INR prices — add to cart and checkout with UPI</p>
            </div>
            <div className="flex items-center gap-2 bg-[#E6F1FC] px-4 py-2 rounded-2xl border border-[#cce1f8]">
              <Clock className="w-4 h-4 text-[#0071DC]" />
              <span className="text-xs font-bold text-slate-700">Ends in:</span>
              <span className="font-mono font-black text-xs text-[#0071DC]">
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

      <section className="max-w-[1536px] mx-auto px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bentoCollections.map((col) => (
            <div key={col.title} className="bg-white rounded-3xl p-5 border border-slate-200/80">
              <h3 className="font-extrabold text-slate-900 text-base mb-4">{col.title}</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {col.items.map((item) => (
                  <Link key={item.label} href={col.href} className="group flex flex-col gap-1.5">
                    <div className="relative h-28 w-full rounded-2xl overflow-hidden bg-slate-50">
                      <Image src={item.image} alt={item.label} fill className="object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                  </Link>
                ))}
              </div>
              <Link href={col.href} className="text-xs font-bold text-[#0071DC] inline-flex items-center gap-1 pt-2 border-t border-slate-100 w-full">
                Shop all {col.title} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <MeeshoStyleSection />

      <section className="max-w-[1536px] mx-auto px-4 w-full">
        <div className="rounded-3xl bg-gradient-to-r from-[#002f6c] via-[#004f9a] to-[#0071DC] text-white p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <IbnkLogo variant="white" className="h-8 w-auto" width={105} height={32} />
                <span className="font-black text-xl">IBNK+</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black">Get more of what you love with IBNK+</h2>
              <p className="text-white/85 text-sm max-w-xl">Unlimited store delivery, free shipping with no minimum, and member-only flash deals.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
                <div className="p-3 rounded-2xl bg-white/10"><Truck className="w-5 h-5 text-[#FFC220] mb-1" /><p className="font-bold">Free Delivery</p></div>
                <div className="p-3 rounded-2xl bg-white/10"><Store className="w-5 h-5 text-[#FFC220] mb-1" /><p className="font-bold">Free Shipping</p></div>
                <div className="p-3 rounded-2xl bg-white/10"><Tag className="w-5 h-5 text-[#FFC220] mb-1" /><p className="font-bold">Member Prices</p></div>
                <div className="p-3 rounded-2xl bg-white/10"><Headphones className="w-5 h-5 text-[#FFC220] mb-1" /><p className="font-bold">Priority Help</p></div>
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="bg-white text-slate-900 rounded-3xl p-6 text-center">
                <p className="text-3xl font-black text-[#0071DC]">30 Days Free</p>
                <p className="text-xs text-slate-600 mt-1 mb-4">Then ₹99/month. Cancel anytime.</p>
                <Link href="/ibnk-plus" className="block py-3 rounded-full bg-[#FFC220] font-black text-sm">Try IBNK+ Free</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1536px] mx-auto px-4 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F1FC] text-[#0071DC] flex items-center justify-center"><ShieldCheck className="w-6 h-6" /></div>
            <div><h4 className="font-bold text-sm">Everyday Low Prices</h4><p className="text-xs text-slate-500 mt-1">INR pricing across every department.</p></div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F1FC] text-[#0071DC] flex items-center justify-center"><Truck className="w-6 h-6" /></div>
            <div><h4 className="font-bold text-sm">Free Shipping on ₹499+</h4><p className="text-xs text-slate-500 mt-1">Pan-India delivery from Mumbai hub.</p></div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F1FC] text-[#0071DC] flex items-center justify-center"><RotateCcw className="w-6 h-6" /></div>
            <div><h4 className="font-bold text-sm">Easy Returns</h4><p className="text-xs text-slate-500 mt-1">Hassle-free returns on eligible items.</p></div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F1FC] text-[#0071DC] flex items-center justify-center"><Store className="w-6 h-6" /></div>
            <div><h4 className="font-bold text-sm">UPI & Cards</h4><p className="text-xs text-slate-500 mt-1">Razorpay-ready checkout plus COD.</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
