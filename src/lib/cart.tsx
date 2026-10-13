"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProductById, getVariant, type CatalogProduct, type ProductVariant } from "@/lib/catalog";

const CART_KEY = "buymecart.cart.v1";
export const FREE_SHIPPING_THRESHOLD_PAISE = 49900;
export const STANDARD_SHIPPING_PAISE = 4900;

export type CartLine = {
  productId: string;
  variantId: string;
  quantity: number;
};

export type HydratedCartLine = CartLine & {
  product: CatalogProduct;
  variant: ProductVariant;
  unitPricePaise: number;
  mrpPaise: number;
  lineTotalPaise: number;
};

type CartContextValue = {
  lines: CartLine[];
  items: HydratedCartLine[];
  itemCount: number;
  subtotalPaise: number;
  shippingPaise: number;
  taxPaise: number;
  totalPaise: number;
  addItem: (productId: string, variantId?: string, quantity?: number) => void;
  setQuantity: (productId: string, variantId: string, quantity: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function hydrate(lines: CartLine[]): HydratedCartLine[] {
  return lines.flatMap((line) => {
    const product = getProductById(line.productId);
    if (!product) return [];
    const variant = getVariant(product, line.variantId);
    const unitPricePaise = variant.sellingPricePaise ?? product.sellingPricePaise;
    const mrpPaise = variant.mrpPaise ?? product.mrpPaise;
    return [
      {
        ...line,
        product,
        variant,
        unitPricePaise,
        mrpPaise,
        lineTotalPaise: unitPricePaise * line.quantity,
      },
    ];
  });
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      setLines([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const addItem = useCallback((productId: string, variantId?: string, quantity = 1) => {
    const product = getProductById(productId);
    if (!product) return;
    const variant = getVariant(product, variantId);
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId && l.variantId === variant.id);
      if (existing) {
        return prev.map((l) =>
          l.productId === productId && l.variantId === variant.id
            ? { ...l, quantity: Math.min(l.quantity + quantity, variant.stockQuantity) }
            : l
        );
      }
      return [...prev, { productId, variantId: variant.id, quantity: Math.min(quantity, variant.stockQuantity) }];
    });
  }, []);

  const setQuantity = useCallback((productId: string, variantId: string, quantity: number) => {
    setLines((prev) => {
      if (quantity <= 0) return prev.filter((l) => !(l.productId === productId && l.variantId === variantId));
      return prev.map((l) =>
        l.productId === productId && l.variantId === variantId ? { ...l, quantity } : l
      );
    });
  }, []);

  const removeItem = useCallback((productId: string, variantId: string) => {
    setLines((prev) => prev.filter((l) => !(l.productId === productId && l.variantId === variantId)));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(() => {
    const items = hydrate(lines);
    const subtotalPaise = items.reduce((sum, l) => sum + l.lineTotalPaise, 0);
    const shippingPaise =
      subtotalPaise === 0 || subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE ? 0 : STANDARD_SHIPPING_PAISE;
    const taxPaise = Math.round(subtotalPaise * 0.05);
    return {
      lines,
      items,
      itemCount: items.reduce((sum, l) => sum + l.quantity, 0),
      subtotalPaise,
      shippingPaise,
      taxPaise,
      totalPaise: subtotalPaise + shippingPaise,
      addItem,
      setQuantity,
      removeItem,
      clear,
    };
  }, [lines, addItem, setQuantity, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
