"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight, Truck, CheckCircle2 } from "lucide-react";
import { useCart, FREE_SHIPPING_THRESHOLD_PAISE } from "@/lib/cart";
import { formatINR } from "@/lib/money";
import { useState } from "react";

export default function CartPage() {
  const { items, setQuantity, removeItem, subtotalPaise, shippingPaise, totalPaise } = useCart();
  const [isGift, setIsGift] = useState(false);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_PAISE - subtotalPaise);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-[#FF9900] mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F1111]">Your Amazon Cart is empty</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Shop today&apos;s blockbuster deals, top picks in electronics, fashion, and grocery essentials across iBNK.in.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-bold text-xs sm:text-sm transition-all shadow-xs"
          >
            Explore Today&apos;s Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAEDED] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1480px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Cart Items List (8 cols on lg) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-lg border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-baseline justify-between border-b border-slate-200 pb-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-normal text-[#0F1111]">
                Shopping Cart
              </h1>
              <p className="text-xs text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer mt-1">
                Deselect all items
              </p>
            </div>
            <span className="text-xs text-slate-500 font-medium">Price</span>
          </div>

          {/* Amazon Free Shipping Banner */}
          <div className={`p-3.5 rounded-lg border text-xs sm:text-sm flex items-start gap-3 ${
            remaining > 0
              ? "bg-blue-50/70 border-blue-200 text-[#0F1111]"
              : "bg-emerald-50 border-emerald-200 text-emerald-900"
          }`}>
            <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${remaining > 0 ? "text-[#007185]" : "text-[#007600]"}`} />
            {remaining > 0 ? (
              <p>
                Add <strong>{formatINR(remaining)}</strong> of eligible items to your order for <strong>FREE Delivery</strong>.
              </p>
            ) : (
              <p className="font-semibold">
                Part of your order qualifies for <strong>FREE Delivery</strong>. Choose this option at checkout.
              </p>
            )}
          </div>

          {/* Cart Item Cards */}
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="py-5 flex flex-col sm:flex-row gap-4 justify-between"
              >
                <div className="flex gap-4 min-w-0 flex-1">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-bold text-sm text-[#0F1111] hover:text-[#007185] transition-colors line-clamp-2 leading-snug"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-[#007600] font-bold">In stock</p>
                    <p className="text-[11px] text-slate-500">
                      Eligible for FREE Shipping · {item.variant.name}
                    </p>

                    {/* Quantity dropdown and actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                      <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-300 rounded-md px-2 py-1">
                        <span className="text-[11px] font-semibold text-slate-600">Qty:</span>
                        <select
                          value={item.quantity}
                          onChange={(e) => setQuantity(item.productId, item.variantId, Math.max(1, Number(e.target.value)))}
                          className="bg-transparent font-bold text-[#0F1111] outline-none cursor-pointer text-xs"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>

                      <span className="text-slate-300">|</span>

                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="text-[#007185] hover:text-[#C7511F] hover:underline font-medium text-xs"
                      >
                        Delete
                      </button>

                      <span className="text-slate-300">|</span>

                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="text-[#007185] hover:text-[#C7511F] hover:underline font-medium text-xs"
                      >
                        Save for later
                      </button>

                      <span className="text-slate-300">|</span>

                      <Link
                        href={`/products/${item.product.slug}`}
                        className="text-[#007185] hover:text-[#C7511F] hover:underline font-medium text-xs"
                      >
                        See more like this
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="text-right sm:pl-4 shrink-0">
                  <p className="font-bold text-base text-[#0F1111]">{formatINR(item.lineTotalPaise)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-right pt-3 border-t border-slate-100">
            <span className="text-sm font-normal text-slate-700">
              Subtotal ({items.length} {items.length === 1 ? "item" : "items"}):{" "}
            </span>
            <span className="text-lg font-bold text-[#0F1111]">{formatINR(subtotalPaise)}</span>
          </div>
        </div>

        {/* Amazon Right Sidebar: Checkout Card (4 cols on lg) */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-lg border border-slate-200/90 shadow-xs space-y-3.5 sticky top-24">
            {/* Free shipping check */}
            <div className="flex items-center gap-2 text-xs text-[#007600] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#007600] shrink-0" />
              <span>Your order qualifies for FREE Delivery.</span>
            </div>

            <div className="text-sm text-slate-800 leading-tight">
              <span>Subtotal ({items.length} {items.length === 1 ? "item" : "items"}): </span>
              <span className="text-lg font-bold text-[#0F1111]">{formatINR(subtotalPaise)}</span>
            </div>

            {/* Gift option */}
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isGift}
                onChange={(e) => setIsGift(e.target.checked)}
                className="w-4 h-4 accent-[#FF9900] rounded"
              />
              <span>This order contains a gift</span>
            </label>

            {/* Amazon Yellow "Proceed to Buy" button */}
            <Link
              href="/checkout"
              className="block w-full text-center py-2.5 px-4 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] font-bold text-xs sm:text-sm tracking-wide shadow-xs transition-all active:scale-98"
            >
              Proceed to Buy
            </Link>

            <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
              <p className="flex items-center gap-1">
                <span>🛡️</span> 100% Purchase Protection
              </p>
              <p className="flex items-center gap-1">
                <span>💳</span> Instant UPI, Cards, Net Banking &amp; COD accepted
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
