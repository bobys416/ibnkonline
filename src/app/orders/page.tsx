"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/money";
import { readOrders, type StoredOrder } from "@/lib/orders";
import { useAuth } from "@/lib/auth-context";
import { Package, LogIn, UserPlus, ShoppingBag, ArrowRight } from "lucide-react";

export default function OrdersPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [isFetchingServer, setIsFetchingServer] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setOrders([]);
      return;
    }

    // 1. Instantly load local orders filtered strictly for this user
    const localOrders = readOrders(user);
    setOrders(localOrders);

    // 2. Fetch server-side orders for this user
    async function syncServerOrders() {
      setIsFetchingServer(true);
      try {
        const raw = localStorage.getItem("buymecart.session");
        const token = raw ? JSON.parse(raw)?.accessToken : null;

        const res = await fetch("/api/orders", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        if (json.success && Array.isArray(json.data?.orders)) {
          const combined = new Map<string, StoredOrder>();
          // Put local first
          for (const o of localOrders) {
            combined.set(o.orderNumber, o);
          }
          // Merge server
          for (const o of json.data.orders) {
            combined.set(o.orderNumber, o);
          }
          setOrders(Array.from(combined.values()));
        }
      } catch {
        // Fall back to local filtered orders
      } finally {
        setIsFetchingServer(false);
      }
    }

    void syncServerOrders();
  }, [user, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#1554D1] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-500">Loading your account orders…</p>
      </div>
    );
  }

  // If user is not signed in, show explicit sign-in prompt
  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-5 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1554D1] flex items-center justify-center mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#172033]">Track your orders</h1>
            <p className="text-sm text-slate-600 mt-1">
              Sign in to view orders placed with your iBNK account, track shipping, and manage returns.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              href="/login?redirect=/orders"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#1554D1] hover:bg-[#0E44B0] text-white font-bold text-sm shadow-md transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign in to your account</span>
            </Link>
            <Link
              href="/register?redirect=/orders"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create an account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#172033]">Your orders</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Showing purchase history for <span className="font-semibold text-slate-700">{user.email}</span>
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1554D1] hover:underline"
        >
          <span>Continue shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#172033]">No orders placed yet</h2>
            <p className="text-xs text-slate-500 mt-1">
              You haven&apos;t placed any orders with this account yet. Discover trending deals and essentials.
            </p>
          </div>
          <Link
            href="/deals"
            className="inline-block px-6 py-2.5 rounded-full bg-[#FF7900] hover:bg-[#e06a00] text-white font-bold text-xs shadow-sm transition-all"
          >
            Explore Deals & Offers
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link
              key={o.orderNumber}
              href={`/orders/${o.orderNumber}`}
              className="block bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-[#1554D1]/40 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#172033] text-sm sm:text-base">{o.orderNumber}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        o.paymentStatus === "SUCCESS"
                          ? "bg-emerald-50 text-emerald-700"
                          : o.paymentMethod === "COD"
                            ? "bg-amber-50 text-amber-800"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {o.paymentMethod === "COD" ? "Cash on Delivery" : o.paymentStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {new Date(o.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-xs text-slate-600 pt-1">
                    {o.items?.length || 0} item{o.items?.length === 1 ? "" : "s"} · Deliver to {o.address?.fullName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm sm:text-base text-[#172033]">{formatINR(o.totalPaise)}</p>
                  <span className="text-[11px] font-bold text-[#1554D1] hover:underline">View details →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
