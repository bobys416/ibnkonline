"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, Tag, ShieldCheck, Truck, Star } from "lucide-react";
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
    <div className="max-w-[1536px] mx-auto px-4 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-[#0071DC] text-white p-8 md:p-12 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC220] text-slate-950 font-black text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Seasonal Mega Sale · IBNK.online
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Spring Savings & Seasonal Rollbacks
          </h1>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed">
            Spruce up your home, patio, garden, and wardrobe with direct-from-manufacturer prices. Free delivery from Wadala Hub, Mumbai.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/"
              className="px-6 py-3 rounded-full bg-white text-emerald-800 font-black text-xs hover:bg-slate-100 transition-colors shadow-sm inline-flex items-center gap-2"
            >
              Shop All Spring Deals <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Grid of Deals */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-4">
          Featured Spring Rollbacks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {deals.map((deal) => (
            <div
              key={deal.title}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between hover:shadow-lg transition-all group"
            >
              <div>
                <div className="relative h-48 w-full rounded-xl overflow-hidden bg-slate-50 mb-3">
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                    {deal.discount}
                  </span>
                </div>
                <h3 className="font-semibold text-xs text-slate-800 line-clamp-2 mb-2 group-hover:text-[#0071DC] transition-colors">
                  {deal.title}
                </h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-lg font-black text-slate-900">{deal.price}</span>
                  <span className="text-xs text-slate-400 line-through">{deal.wasPrice}</span>
                </div>
              </div>
              <button
                onClick={() => alert(`Added ${deal.title} to cart!`)}
                className="w-full py-2 rounded-full bg-slate-900 hover:bg-[#0071DC] text-white font-bold text-xs transition-colors"
              >
                + Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
