"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { formatINR } from "@/lib/money";
import { getOrder, type StoredOrder } from "@/lib/orders";
import { useAuth } from "@/lib/auth-context";

function OrderDetailContent() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Try local storage with user ownership check
    const local = getOrder(orderNumber, user);
    if (local) {
      setOrder(local);
      setLoading(false);
      return;
    }

    // 2. Fetch from server API
    async function fetchOrder() {
      try {
        const raw = localStorage.getItem("buymecart.session");
        const token = raw ? JSON.parse(raw)?.accessToken : null;

        const res = await fetch(`/api/orders/${encodeURIComponent(orderNumber)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        if (json.success && json.data?.order) {
          setOrder(json.data.order);
        } else {
          setOrder(null);
        }
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    }

    void fetchOrder();
  }, [orderNumber, user]);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-[#1554D1] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Retrieving order details…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-black text-[#172033]">Order not found</h1>
        <p className="text-xs text-slate-500">
          This order could not be found or belongs to a different account.
        </p>
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-[#1554D1] font-bold text-sm hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to your orders</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-5">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-2 shadow-xs">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
        <h1 className="text-3xl font-black text-[#172033]">Order placed</h1>
        <p className="text-sm font-semibold text-slate-700">{order.orderNumber}</p>
        <p className="text-xs text-slate-500">
          {order.paymentMethod === "COD"
            ? "Cash on delivery — pay when your order arrives."
            : `Paid online via ${order.paymentMethodDetail ?? "iBNK Secure Pay"}`}
        </p>
      </div>

      {/* Amazon Live Order Tracking Progress */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-[#0F1111] text-sm">Package Tracking</span>
          <span className="text-[#007600] font-bold">Estimated Delivery: Tomorrow by 8 PM</span>
        </div>
        <div className="relative flex items-center justify-between pt-2">
          {/* Progress bar line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
          <div className="absolute top-1/2 left-0 w-2/3 h-1 bg-[#007600] -translate-y-1/2 z-0" />

          {/* Step 1: Placed */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 text-center">
            <div className="w-7 h-7 rounded-full bg-[#007600] text-white flex items-center justify-center font-bold text-xs ring-4 ring-white">
              ✓
            </div>
            <span className="text-[11px] font-bold text-slate-800">Ordered</span>
          </div>

          {/* Step 2: Packed */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 text-center">
            <div className="w-7 h-7 rounded-full bg-[#007600] text-white flex items-center justify-center font-bold text-xs ring-4 ring-white">
              ✓
            </div>
            <span className="text-[11px] font-bold text-slate-800">Packed</span>
          </div>

          {/* Step 3: Shipped */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 text-center">
            <div className="w-7 h-7 rounded-full bg-[#007600] text-white flex items-center justify-center font-bold text-xs ring-4 ring-white">
              ✓
            </div>
            <span className="text-[11px] font-bold text-[#007600]">Shipped</span>
          </div>

          {/* Step 4: Delivered */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 text-center">
            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs ring-4 ring-white">
              4
            </div>
            <span className="text-[11px] font-medium text-slate-400">Delivery</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 text-sm shadow-xs">
        <p className="font-bold text-slate-800 text-xs uppercase tracking-wide">Ordered Items</p>
        <div className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <div key={`${item.productId}-${item.variantId}`} className="py-2.5 flex justify-between gap-3 text-xs sm:text-sm">
              <span className="text-slate-700">
                {item.productName} × {item.quantity}
              </span>
              <span className="font-bold text-slate-900 shrink-0">
                {formatINR(item.unitPricePaise * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-black text-base pt-3 border-t border-slate-200">
          <span>Total</span>
          <span className="text-[#1554D1]">{formatINR(order.totalPaise)}</span>
        </div>
        {order.gatewayPaymentId && (
          <p className="text-xs text-slate-400 pt-1">Payment ID: {order.gatewayPaymentId}</p>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 text-sm shadow-xs space-y-1">
        <p className="font-bold text-slate-800 text-xs uppercase tracking-wide mb-2">Delivery Address</p>
        <p className="font-semibold text-slate-900">
          {order.address.fullName} · {order.address.phone}
        </p>
        <p className="text-xs text-slate-600">
          {[
            order.address.addressLine1,
            order.address.addressLine2,
            order.address.landmark,
            order.address.city,
            [order.address.state, order.address.pinCode].filter(Boolean).join(" "),
          ]
            .filter(Boolean)
            .join(", ")}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/orders"
          className="flex-1 text-center py-3 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all"
        >
          View all your orders
        </Link>
        <Link
          href="/products"
          className="flex-1 text-center py-3 rounded-full bg-[#FF7900] hover:bg-[#e06a00] text-white font-black text-xs shadow-md transition-all"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto px-4 py-20 text-center text-sm text-slate-600">
          Loading your order…
        </div>
      }
    >
      <OrderDetailContent />
    </Suspense>
  );
}
