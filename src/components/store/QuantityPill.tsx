"use client";

import { Minus, Plus } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export function QuantityPill({ product }: { product: CatalogProduct }) {
  const { items, addItem, setQuantity } = useCart();
  const defaultVariant = product.variants[0];
  const line = items.find((i) => i.productId === product.id && i.variantId === defaultVariant.id);
  const qty = line?.quantity ?? 0;

  if (qty === 0) {
    return (
      <button
        onClick={() => addItem(product.id, defaultVariant.id)}
        className="w-full py-2 px-3 rounded-full border border-slate-300 bg-white text-[#172033] hover:bg-[#FF7900] hover:border-[#FF7900] hover:text-white font-bold text-xs transition-all shadow-2xs flex items-center justify-center gap-1 active:scale-98"
      >
        <Plus className="w-3.5 h-3.5" />
        Add to Cart
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between bg-[#1554D1] text-white rounded-full p-1 text-xs font-bold shadow-xs">
      <button
        onClick={() => setQuantity(product.id, defaultVariant.id, qty - 1)}
        className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="font-bold px-2">{qty} in cart</span>
      <button
        onClick={() => addItem(product.id, defaultVariant.id)}
        className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
