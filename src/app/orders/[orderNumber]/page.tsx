"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { formatINR } from "@/lib/money";
import { getOrder, type StoredOrder } from "@/lib/orders";

function OrderDetailContent() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    setOrder(getOrder(orderNumber) ?? null);
  }, [orderNumber]);

  if (!order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-black">Order not found</h1>
        <Link href="/orders" className="text-[#1554D1] font-bold text-sm hover:underline">View orders</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-5">
      <div className="bg-white rounded-3xl border p-8 text-center space-y-2">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
        <h1 className="text-3xl font-black">Order placed</h1>
        <p className="text-sm text-slate-600">{order.orderNumber}</p>
        <p className="text-xs text-slate-500">
          {order.paymentMethod === "COD"
            ? "Cash on delivery — pay when your order arrives."
            : `Paid online via ${order.paymentMethodDetail ?? "IBNK Secure Pay"}`}
        </p>
      </div>
      <div className="bg-white rounded-3xl border p-6 space-y-2 text-sm">
        {order.items.map((item) => (
          <div key={`${item.productId}-${item.variantId}`} className="flex justify-between">
            <span>{item.productName} × {item.quantity}</span>
            <span className="font-semibold">{formatINR(item.unitPricePaise * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between font-black pt-3 border-t"><span>Total</span><span>{formatINR(order.totalPaise)}</span></div>
        {order.gatewayPaymentId && <p className="text-xs text-slate-500">Payment ID {order.gatewayPaymentId}</p>}
      </div>
      <div className="bg-white rounded-3xl border p-6 text-sm">
        <p className="font-black mb-1">Deliver to</p>
        <p>{order.address.fullName}, {order.address.phone}</p>
        <p>
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
      <Link href="/products" className="block text-center py-3 rounded-full bg-[#FF7900] hover:bg-[#e06a00] text-white font-black shadow-md transition-all">
        Continue shopping
      </Link>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<div className="max-w-lg mx-auto px-4 py-20 text-center text-sm text-slate-600">Loading your order…</div>}>
      <OrderDetailContent />
    </Suspense>
  );
}
