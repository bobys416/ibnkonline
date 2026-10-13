"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { useCart, FREE_SHIPPING_THRESHOLD_PAISE } from "@/lib/cart";
import { formatINR } from "@/lib/money";

export default function CartPage() {
  const { items, setQuantity, removeItem, subtotalPaise, shippingPaise, totalPaise } = useCart();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_PAISE - subtotalPaise);

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#1554D1] mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#172033]">Your shopping cart is empty</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Discover flash deals, electronics, fashion, and grocery essentials across iBNK.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1554D1] hover:bg-[#0E44B0] text-white font-bold text-xs sm:text-sm transition-all shadow-sm"
        >
          Explore Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cart items list */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-baseline justify-between border-b border-slate-200 pb-4">
            <h1 className="text-2xl sm:text-3xl font-black text-[#172033]">
              Shopping Cart ({items.length})
            </h1>
            <Link href="/products" className="text-xs font-bold text-[#1554D1] hover:underline">
              Continue shopping
            </Link>
          </div>

          {/* Free Shipping Progress Callout */}
          <div className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center gap-3 ${
            remaining > 0
              ? "bg-blue-50/60 border-blue-100 text-[#172033]"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}>
            <Truck className={`w-5 h-5 shrink-0 ${remaining > 0 ? "text-[#1554D1]" : "text-[#16A34A]"}`} />
            {remaining > 0 ? (
              <p>
                Add <strong>{formatINR(remaining)}</strong> more of eligible items to unlock <strong>Free Standard Delivery</strong>.
              </p>
            ) : (
              <p className="font-bold">
                Congratulations! You have unlocked Free Standard Delivery for this order.
              </p>
            )}
          </div>

          {/* Product Items */}
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 flex gap-4 shadow-2xs transition-all hover:border-slate-300"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-bold text-xs sm:text-sm text-[#172033] hover:text-[#1554D1] transition-colors line-clamp-2"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.variant.name}</p>
                  <p className="font-black text-sm text-[#172033] mt-1">{formatINR(item.unitPricePaise)}</p>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-slate-200 rounded-full bg-slate-50 px-2 py-0.5">
                      <span className="text-[10px] text-slate-400 font-bold mr-1.5 uppercase">Qty:</span>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={item.quantity}
                        onChange={(e) => setQuantity(item.productId, item.variantId, Math.max(1, Number(e.target.value)))}
                        className="w-10 bg-transparent text-xs font-bold text-[#172033] text-center outline-none"
                      />
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="text-rose-600 hover:text-rose-700 text-xs font-bold inline-flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-sm text-[#172033]">{formatINR(item.lineTotalPaise)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sticky top-28 space-y-4 shadow-sm">
            <h2 className="font-black text-lg text-[#172033] border-b border-slate-100 pb-3">
              Order Summary
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} {items.length === 1 ? "item" : "items"})</span>
                <span className="font-semibold text-[#172033]">{formatINR(subtotalPaise)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Estimate</span>
                <span className="font-semibold text-[#172033]">
                  {shippingPaise === 0 ? <strong className="text-emerald-700">Free</strong> : formatINR(shippingPaise)}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Applicable Taxes (GST)</span>
                <span>Included</span>
              </div>
            </div>

            <div className="flex justify-between font-black text-lg text-[#172033] pt-3 border-t border-slate-100">
              <span>Estimated Total</span>
              <span>{formatINR(totalPaise)}</span>
            </div>

            <Link
              href="/checkout"
              className="block w-full text-center py-3.5 rounded-full bg-[#FF7900] hover:bg-[#E06A00] text-white font-black text-xs sm:text-sm tracking-wide shadow-sm transition-all active:scale-98"
            >
              Proceed to Checkout
            </Link>

            <p className="text-[10px] text-center text-slate-400">
              Secure Stripe-hosted card checkout &amp; Cash on Delivery available
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
