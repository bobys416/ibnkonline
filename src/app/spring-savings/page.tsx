"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, Tag, ShieldCheck, Truck, ChevronRight } from "lucide-react";
import { IbnkLogo } from "@/components/ibnk/IbnkLogo";

export default function SpringSavingsPage() {
  const deals = [
    {
      title: "Patio 4-Piece Wicker Conversation Outdoor Furniture Set",
      price: "₹12,499",
      wasPrice: "₹24,999",
      discount: "50% Off",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Pure Cotton Floral Designer Bedsheet with Pillow Covers",
      price: "₹349",
      wasPrice: "₹999",
      discount: "65% Off",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Heavy Duty Garden Hose 50ft with 10-Pattern Spray Nozzle",
      price: "₹799",
      wasPrice: "₹1,899",
      discount: "58% Off",
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Handcrafted Ceramic Plant Pots with Drainage (Set of 3)",
      price: "₹499",
      wasPrice: "₹1,299",
      discount: "62% Off",
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-[1440px] mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-[#1554D1] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#172033]">Spring Savings</span>
        </nav>

        {/* Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-[#1554D1] text-white p-8 md:p-12 shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7900] text-white font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Seasonal Mega Sale · iBNK.online
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Spring Savings &amp; Seasonal Rollbacks
            </h1>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              Refresh your home, patio, garden, and wardrobe with direct-from-manufacturer prices. Free delivery from Wadala Hub, Mumbai.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/products"
                className="px-6 py-3 rounded-full bg-white text-emerald-800 font-black text-xs hover:bg-slate-100 transition-colors shadow-sm inline-flex items-center gap-2"
              >
                Shop Spring Deals <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((deal) => (
            <div
              key={deal.title}
              className="bg-white rounded-3xl border border-slate-200/80 p-4 flex flex-col justify-between hover:shadow-lg transition-all group"
            >
              <div>
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 mb-3">
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 rounded-full bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5">
                    {deal.discount}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#172033] line-clamp-2 mb-2 group-hover:text-[#1554D1] transition-colors">
                  {deal.title}
                </h3>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                <div>
                  <span className="font-black text-base text-[#172033]">{deal.price}</span>
                  <span className="text-xs text-slate-400 line-through ml-2">{deal.wasPrice}</span>
                </div>
                <Link
                  href="/products"
                  className="rounded-full bg-[#1554D1] text-white p-2 hover:bg-[#0E44B0] transition-colors"
                  aria-label={`View deal for ${deal.title}`}
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
