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
  ChevronLeft,
  Sparkles,
  Star,
  CheckCircle2,
} from "lucide-react";
import { IbnkLogo } from "@/components/ibnk/IbnkLogo";
import { ProductCard } from "@/components/store/ProductCard";
import { CATEGORIES, getFlashDeals, getAllProducts } from "@/lib/catalog";
import { formatINR } from "@/lib/money";

const heroBanners = [
  {
    id: 1,
    tag: "GREAT INDIAN FESTIVAL LIVE",
    title: "Big Savings on Electronics & Smartphones",
    subtitle: "Up to 75% off on top tech, 4K Smart TVs, ANC headphones & laptops. Instant bank discounts.",
    ctaText: "Shop Electronics Deals",
    ctaHref: "/categories/electronics",
    secondaryCtaText: "Explore All Deals",
    secondaryCtaHref: "/deals",
    bgGradient: "from-[#0F1111] via-[#131A22] to-[#232F3E]",
    badgeBg: "bg-[#FF9900] text-[#0F1111]",
    highlightText: "FREE 1-Day Fast Delivery",
  },
  {
    id: 2,
    tag: "SUPER VALUE DAYS",
    title: "Pantry & Daily Grocery Starting ₹99",
    subtitle: "Stock up on premium basmati rice, dry fruits, roasted coffees, snacks, and organic staples.",
    ctaText: "Shop Grocery Essentials",
    ctaHref: "/categories/grocery",
    secondaryCtaText: "View Fresh Deals",
    secondaryCtaHref: "/deals",
    bgGradient: "from-[#0A3D62] via-[#1E3799] to-[#0C2461]",
    badgeBg: "bg-[#FFD814] text-[#0F1111]",
    highlightText: "Express Doorstep Delivery from Wadala Hub",
  },
  {
    id: 3,
    tag: "MEGA FASHION DAYS",
    title: "Trending Styles for Men, Women & Kids",
    subtitle: "Min. 50% to 70% off on sneakers, ethnic handlooms, activewear, denim, and premium accessories.",
    ctaText: "Explore Fashion Offers",
    ctaHref: "/categories/fashion",
    secondaryCtaText: "Shop Top Brands",
    secondaryCtaHref: "/categories/fashion",
    bgGradient: "from-[#2C3A47] via-[#182C61] to-[#3B3B98]",
    badgeBg: "bg-[#FF4D4D] text-white",
    highlightText: "Hassle-free 7-Day Size Exchanges",
  },
];

export default function HomePage() {
  const [activeBanner, setActiveBanner] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 38, seconds: 42 });
  const [isMounted, setIsMounted] = useState(false);
  const flashDeals = getFlashDeals();
  const allProducts = getAllProducts();
  const bestSellers = allProducts.filter((p) => p.isBestSeller).slice(0, 8);
  const electronicsPicks = allProducts.filter((p) => p.categorySlug === "electronics").slice(0, 8);

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

    const bannerTimer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % heroBanners.length);
    }, 6000);

    return () => {
      clearInterval(timer);
      clearInterval(bannerTimer);
    };
  }, []);

  const bentoCollections = [
    {
      title: "Up to 75% off | Top Tech & Electronics",
      href: "/categories/electronics",
      items: [
        { label: "Smart TVs & Projectors", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=300&q=80" },
        { label: "Noise Cancelling Audio", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80" },
        { label: "Laptops & Computing", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=300&q=80" },
        { label: "Smartwatches & Bands", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80" },
      ],
    },
    {
      title: "Starting ₹99 | Pantry & Snack Favorites",
      href: "/categories/grocery",
      items: [
        { label: "Artisan Coffee & Tea", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80" },
        { label: "Healthy Snacks & Nuts", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80" },
        { label: "Aged Basmati Rice", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80" },
        { label: "Beverages & Drinks", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=300&q=80" },
      ],
    },
    {
      title: "Up to 70% off | Styles for Men & Women",
      href: "/categories/fashion",
      items: [
        { label: "Footwear & Sneakers", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80" },
        { label: "Classic Denim & Jeans", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=300&q=80" },
        { label: "Athleisure & Activewear", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80" },
        { label: "Handbags & Wallets", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&q=80" },
      ],
    },
    {
      title: "Revamp your home in style | Budget Picks",
      href: "/categories/home",
      items: [
        { label: "Cushion Covers & Linen", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=300&q=80" },
        { label: "Home Decor & Lighting", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=300&q=80" },
        { label: "Ergonomic Chairs", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80" },
        { label: "Kitchen Cookware", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=300&q=80" },
      ],
    },
  ];

  const current = heroBanners[activeBanner];

  return (
    <div data-hydrated={isMounted ? "true" : "false"} className="flex flex-col gap-6 md:gap-8 pb-16 bg-[#E3E6E6]">
      {/* 1. Amazon Master Billboard Hero Carousel */}
      <section className="relative w-full max-w-[1500px] mx-auto overflow-hidden">
        <div
          className={`relative min-h-[380px] sm:min-h-[440px] md:min-h-[480px] bg-gradient-to-r ${current.bgGradient} text-white px-6 sm:px-12 md:px-16 pt-10 pb-28 flex flex-col justify-between transition-all duration-500`}
        >
          {/* Slide Content */}
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md ${current.badgeBg} font-black text-xs uppercase tracking-wider shadow-sm`}>
              <Flame className="w-3.5 h-3.5 fill-current" />
              {current.tag}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              {current.title}
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl">
              {current.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={current.ctaHref}
                className="px-6 py-3 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-black text-xs sm:text-sm transition-all shadow-md active:scale-98 inline-flex items-center gap-2"
              >
                {current.ctaText} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={current.secondaryCtaHref}
                className="px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm transition-all backdrop-blur-xs"
              >
                {current.secondaryCtaText}
              </Link>
            </div>
          </div>

          {/* Bottom Features Banner inside hero */}
          <div className="relative z-10 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-white/90">
            <span className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#FFD814]" /> Dispatched from Wadala Hub, Mumbai
            </span>
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#FFD814]" /> Free Delivery on ₹499+
            </span>
            <span className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#FFD814]" /> 7-Day Easy Returns &amp; Replacements
            </span>
          </div>

          {/* Left / Right Carousel Arrow Buttons */}
          <button
            onClick={() => setActiveBanner((prev) => (prev - 1 + heroBanners.length) % heroBanners.length)}
            className="absolute left-2 top-1/3 -translate-y-1/2 w-10 h-16 rounded bg-black/30 hover:bg-black/60 text-white flex items-center justify-center transition-colors z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setActiveBanner((prev) => (prev + 1) % heroBanners.length)}
            className="absolute right-2 top-1/3 -translate-y-1/2 w-10 h-16 rounded bg-black/30 hover:bg-black/60 text-white flex items-center justify-center transition-colors z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel Slide Indicators */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {heroBanners.map((b, idx) => (
              <button
                key={b.id}
                onClick={() => setActiveBanner(idx)}
                className={`h-2 rounded-full transition-all ${
                  activeBanner === idx ? "w-8 bg-[#FFD814]" : "w-2 bg-white/50"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Amazon trademark bottom gradient fade into page content */}
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#E3E6E6] to-transparent pointer-events-none" />
        </div>
      </section>

      {/* 2. Amazon 4-Card Bento Grid Overlapping Hero */}
      <section className="max-w-[1480px] mx-auto px-4 w-full -mt-24 sm:-mt-28 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {bentoCollections.map((col) => (
            <div key={col.title} className="bg-white rounded-lg p-5 border border-slate-200/80 shadow-md flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-[#0F1111] text-lg mb-3 leading-snug">{col.title}</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {col.items.map((item) => (
                    <Link key={item.label} href={col.href} className="group flex flex-col gap-1.5">
                      <div className="relative h-28 w-full rounded-md overflow-hidden bg-slate-100">
                        <Image src={item.image} alt={item.label} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-800 group-hover:text-[#007185] transition-colors line-clamp-1">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
              <Link href={col.href} className="text-xs font-bold text-[#007185] hover:text-[#C7511F] hover:underline inline-flex items-center gap-1 pt-2 border-t border-slate-100 w-full">
                See all offers <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Explore Departments Row */}
      <section className="max-w-[1480px] mx-auto px-4 w-full">
        <div className="bg-white rounded-lg p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-[#0F1111]">Explore Popular Departments</h2>
            <Link href="/categories" className="text-xs font-bold text-[#007185] hover:text-[#C7511F] hover:underline inline-flex items-center gap-1">
              All Departments <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="flex flex-col items-center gap-2 group shrink-0 w-24 text-center"
              >
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-transparent group-hover:border-[#FF9900] transition-all">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                </div>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-[#007185] line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Today's Blockbuster Deals with Countdown Timer */}
      <section className="max-w-[1480px] mx-auto px-4 w-full">
        <div className="bg-white rounded-lg p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse inline-block" />
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0F1111]">Today&apos;s Blockbuster Deals</h2>
                <p className="text-xs text-slate-500">Curated daily savings across top categories</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
              <Clock className="w-4 h-4 text-[#B12704]" />
              <span className="text-xs font-bold text-slate-700">Deals end in:</span>
              <span className="font-mono font-black text-xs text-[#B12704]">
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

      {/* 5. Best Sellers in Electronics & Tech */}
      <section className="max-w-[1480px] mx-auto px-4 w-full">
        <div className="bg-white rounded-lg p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#0F1111]">Best Sellers in Electronics</h2>
              <p className="text-xs text-slate-500">Most popular tech gadgets and accessories</p>
            </div>
            <Link href="/categories/electronics" className="text-xs font-bold text-[#007185] hover:text-[#C7511F] hover:underline">
              See more <ChevronRight className="w-3.5 h-3.5 inline" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {electronicsPicks.slice(0, 4).map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Amazon Trust Guarantee Strip */}
      <section className="max-w-[1480px] mx-auto px-4 w-full">
        <div className="bg-white rounded-lg p-6 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#007185] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[#0F1111]">Free Delivery</h4>
              <p className="text-xs text-slate-500 mt-0.5">On orders above ₹499 dispatched from our Mumbai hub.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[#0F1111]">7 Days Replacement</h4>
              <p className="text-xs text-slate-500 mt-0.5">Hassle-free doorstep pickup and verified returns.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-[#B12704] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[#0F1111]">100% Genuine Products</h4>
              <p className="text-xs text-slate-500 mt-0.5">Directly sourced from verified Indian manufacturers.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-[#0F1111]">Pay on Delivery / COD</h4>
              <p className="text-xs text-slate-500 mt-0.5">Cash, UPI, or Cards accepted at your doorstep.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
