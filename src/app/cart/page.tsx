"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCart, FREE_SHIPPING_THRESHOLD_PAISE } from "@/lib/cart";
import { formatINR } from "@/lib/money";

export default function CartPage() {
  const { items, setQuantity, removeItem, subtotalPaise, shippingPaise, totalPaise } = useCart();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_PAISE - subtotalPaise);

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-3xl font-black">Your cart is empty</h1>
        <p className="text-sm text-slate-600">Add flash deals, groceries, or electronics to get started.</p>
        <Link href="/products" className="inline-block px-6 py-3 rounded-full bg-[#0071DC] text-white font-black text-sm">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1536px] mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-4">
        <h1 className="text-3xl font-black">Cart ({items.length})</h1>
        {remaining > 0 ? (
          <p className="text-sm text-slate-600">Add {formatINR(remaining)} more for free shipping.</p>
        ) : (
          <p className="text-sm text-emerald-700 font-semibold">You unlocked free shipping.</p>
        )}
        {items.map((item) => (
          <div key={`${item.productId}-${item.variantId}`} className="bg-white rounded-3xl border p-4 flex gap-4">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 shrink-0">
              <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <Link href={`/products/${item.product.slug}`} className="font-bold text-sm hover:text-[#0071DC]">
                {item.product.name}
              </Link>
              <p className="text-xs text-slate-500">{item.variant.name}</p>
              <p className="font-black mt-1">{formatINR(item.unitPricePaise)}</p>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => setQuantity(item.productId, item.variantId, Number(e.target.value))}
                  className="w-16 rounded-full border px-3 py-1 text-sm"
                />
                <button onClick={() => removeItem(item.productId, item.variantId)} className="text-rose-600 text-xs font-bold inline-flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
            <p className="font-black text-sm">{formatINR(item.lineTotalPaise)}</p>
          </div>
        ))}
      </div>
      <aside className="lg:col-span-4">
        <div className="bg-white rounded-3xl border p-6 sticky top-28 space-y-3">
          <h2 className="font-black text-lg">Order summary</h2>
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatINR(subtotalPaise)}</span></div>
          <div className="flex justify-between text-sm"><span>Shipping</span><span>{shippingPaise === 0 ? "Free" : formatINR(shippingPaise)}</span></div>
          <div className="flex justify-between font-black text-lg pt-2 border-t"><span>Total</span><span>{formatINR(totalPaise)}</span></div>
          <Link href="/checkout" className="block text-center py-3 rounded-full bg-[#0071DC] text-white font-black text-sm">
            Continue to checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}
