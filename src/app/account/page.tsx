"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readOrders } from "@/lib/orders";

export default function AccountPage() {
  const [email, setEmail] = useState("guest@ibnk.online");
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("buymecart.session");
      if (raw) {
        const parsed = JSON.parse(raw) as { email?: string; user?: { email?: string } };
        setEmail(parsed.email || parsed.user?.email || "guest@ibnk.online");
      }
    } catch {
      setEmail("guest@ibnk.online");
    }
    setOrderCount(readOrders().length);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-5">
      <h1 className="text-3xl font-black">My account</h1>
      <div className="bg-white rounded-3xl border p-6">
        <p className="text-sm text-slate-500">Signed in as</p>
        <p className="font-black text-lg">{email}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/orders" className="bg-white rounded-3xl border p-5">
          <p className="text-xs text-slate-500">Orders</p>
          <p className="text-2xl font-black">{orderCount}</p>
        </Link>
        <Link href="/cart" className="bg-white rounded-3xl border p-5">
          <p className="text-xs text-slate-500">Cart</p>
          <p className="font-black">Review items</p>
        </Link>
        <Link href="/deals" className="bg-white rounded-3xl border p-5">
          <p className="text-xs text-slate-500">Saved for later</p>
          <p className="font-black">Flash deals</p>
        </Link>
      </div>
    </div>
  );
}
