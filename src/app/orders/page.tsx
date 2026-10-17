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
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0F1111]">No orders placed yet</h2>
            <p className="text-xs text-slate-500 mt-1">
              You haven&apos;t placed any orders with this account yet. Discover trending deals and essentials.
            </p>
          </div>
          <Link
            href="/deals"
            className="inline-block px-6 py-2.5 rounded-lg bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] font-bold text-xs shadow-xs transition-all"
          >
            Explore Deals &amp; Offers
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.orderNumber}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all"
            >
              {/* Amazon Order Card Header Bar */}
              <div className="bg-[#F0F2F2] border-b border-slate-200 px-5 py-3 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Order Placed</span>
                    <span className="font-medium text-[#0F1111]">
                      {new Date(o.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total</span>
                    <span className="font-bold text-[#0F1111]">{formatINR(o.totalPaise)}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Ship To</span>
                    <span className="font-medium text-[#007185] hover:underline cursor-pointer">
                      {o.address?.fullName || user.fullName}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Order # {o.orderNumber}
                  </span>
                  <div className="flex items-center gap-2 pt-0.5">
                    <Link
                      href={`/orders/${o.orderNumber}`}
                      className="text-[#007185] hover:underline hover:text-[#C7511F] font-semibold text-xs"
                    >
                      View order details
                    </Link>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-500 text-xs">
                      {o.paymentMethod === "COD" ? "Cash on Delivery" : "Paid via Card/UPI"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amazon Order Card Body */}
              <div className="p-5 flex flex-col md:flex-row items-start justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-[#0F1111]">
                      {o.status === "CONFIRMED"
                        ? "Order Confirmed - Arriving Soon"
                        : o.status === "FAILED"
                          ? "Order Incomplete"
                          : "Arriving in 1-2 Days"}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        o.paymentStatus === "SUCCESS"
                          ? "bg-emerald-50 text-emerald-700"
                          : o.paymentMethod === "COD"
                            ? "bg-amber-50 text-amber-800"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>

                  {o.items?.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`} className="flex items-start gap-4">
                      {item.imageUrl && (
                        <div className="w-16 h-16 rounded border border-slate-200 overflow-hidden shrink-0 bg-slate-50 relative">
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-semibold text-sm text-[#007185] hover:underline hover:text-[#C7511F] line-clamp-2 leading-snug"
                        >
                          {item.productName}
                        </Link>
                        <p className="text-xs text-slate-500 mt-1">
                          Qty: {item.quantity} · {formatINR(item.unitPricePaise)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Amazon Action Buttons */}
                <div className="flex flex-col gap-2 w-full md:w-52 shrink-0">
                  <Link
                    href={`/orders/${o.orderNumber}`}
                    className="w-full text-center py-2 px-3 rounded-lg bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-xs font-bold text-[#0F1111] shadow-xs transition-colors"
                  >
                    Track package
                  </Link>
                  <Link
                    href={`/products/${o.items?.[0]?.slug || ""}`}
                    className="w-full text-center py-2 px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-[#0F1111] shadow-2xs transition-colors"
                  >
                    Buy it again
                  </Link>
                  <Link
                    href="/help"
                    className="w-full text-center py-2 px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-[#0F1111] shadow-2xs transition-colors"
                  >
                    Return or replace items
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
