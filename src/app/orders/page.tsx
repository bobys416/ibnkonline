"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/money";
import { readOrders, type StoredOrder } from "@/lib/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  useEffect(() => setOrders(readOrders()), []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      <h1 className="text-3xl font-black">Your orders</h1>
      {orders.length === 0 ? (
        <p className="text-sm text-slate-600">No orders yet. <Link href="/products" className="text-[#0071DC] font-bold">Shop now</Link></p>
      ) : (
        orders.map((o) => (
          <Link key={o.orderNumber} href={`/orders/${o.orderNumber}`} className="block bg-white rounded-3xl border p-5">
            <div className="flex justify-between gap-3">
              <div>
                <p className="font-black">{o.orderNumber}</p>
                <p className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleString("en-IN")} · {o.paymentMethod}</p>
              </div>
              <p className="font-black">{formatINR(o.totalPaise)}</p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
