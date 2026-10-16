"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { readOrders } from "@/lib/orders";
import {
  User,
  Package,
  ShoppingCart,
  LogOut,
  ShieldCheck,
  Heart,
  ArrowRight,
  Store,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [orderCount, setOrderCount] = useState(0);
  const [shopifyInfo, setShopifyInfo] = useState<{
    configured: boolean;
    domain?: string;
    sampleProductCount?: number;
    status: string;
  } | null>(null);
  const [checkingShopify, setCheckingShopify] = useState(false);

  useEffect(() => {
    if (user) {
      const userOrders = readOrders(user);
      setOrderCount(userOrders.length);

      // Check Shopify Vercel Integration status
      setCheckingShopify(true);
      fetch("/api/shopify/status")
        .then((res) => res.json())
        .then((data) => setShopifyInfo(data))
        .catch(() => setShopifyInfo({ configured: false, status: "error" }))
        .finally(() => setCheckingShopify(false));
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#1554D1] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-500">Loading your profile…</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-5 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1554D1] flex items-center justify-center mx-auto">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#172033]">Your iBNK Account</h1>
            <p className="text-sm text-slate-600 mt-1">
              Please sign in to access your profile, order history, addresses, and saved deals.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              href="/login?redirect=/account"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#1554D1] hover:bg-[#0E44B0] text-white font-bold text-sm shadow-md transition-all"
            >
              <span>Sign in</span>
            </Link>
            <Link
              href="/register?redirect=/account"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
            >
              <span>Create an account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  async function handleSignOut() {
    await logout();
    router.push("/login");
  }

  const isOperatorOrAdmin =
    user.roles.includes("master_admin") ||
    user.roles.includes("super_admin") ||
    user.roles.includes("product_operations");

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#172033]">My account</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Manage your profile, purchases, and security.</p>
        </div>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-xs font-bold text-slate-600 transition-all shadow-2xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign out</span>
        </button>
      </div>

      {/* User profile card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1554D1] to-[#FF7900] text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-md">
          {user.fullName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-black text-lg text-[#172033] truncate">{user.fullName}</h2>
            {isOperatorOrAdmin && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-[#1554D1] text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3" />
                <span>Portal Operator</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 truncate">{user.email}</p>
          {user.phone && <p className="text-xs text-slate-400 mt-0.5">{user.phone}</p>}
        </div>
      </div>

      {/* Quick stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/orders"
          className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#1554D1]/40 hover:shadow-xs transition-all flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
              <Package className="w-4 h-4 text-[#1554D1]" />
              <span>Purchases</span>
            </div>
            <p className="text-2xl font-black text-[#172033]">{orderCount}</p>
            <p className="text-[11px] text-[#1554D1] font-bold mt-1">View order history →</p>
          </div>
        </Link>

        <Link
          href="/cart"
          className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#1554D1]/40 hover:shadow-xs transition-all flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
              <ShoppingCart className="w-4 h-4 text-[#FF7900]" />
              <span>Cart</span>
            </div>
            <p className="text-sm font-bold text-slate-800">Review items</p>
            <p className="text-[11px] text-[#FF7900] font-bold mt-1">Proceed to checkout →</p>
          </div>
        </Link>

        <Link
          href="/deals"
          className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#1554D1]/40 hover:shadow-xs transition-all flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Saved Deals</span>
            </div>
            <p className="text-sm font-bold text-slate-800">Flash savings</p>
            <p className="text-[11px] text-rose-600 font-bold mt-1">Explore discounts →</p>
          </div>
        </Link>
      </div>

      {/* Shopify Integration & Multi-Store Status */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#172033]">Shopify Integration (Vercel)</h3>
                <span className="flex h-2 w-2 relative">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      shopifyInfo?.configured ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      shopifyInfo?.configured ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {shopifyInfo?.configured
                  ? `Connected Store: ${shopifyInfo.domain || "Shopify Storefront"}`
                  : "Shopify Storefront configuration synchronized from Vercel"}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setCheckingShopify(true);
              fetch("/api/shopify/status")
                .then((r) => r.json())
                .then((d) => setShopifyInfo(d))
                .finally(() => setCheckingShopify(false));
            }}
            disabled={checkingShopify}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checkingShopify ? "animate-spin text-[#1554D1]" : ""}`} />
            <span>{checkingShopify ? "Syncing…" : "Sync"}</span>
          </button>
        </div>

        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Integration Provider</span>
            <span className="font-bold text-slate-800">Vercel Shopify Integration</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Storefront API Status</span>
            <span
              className={`font-bold flex items-center gap-1 ${
                shopifyInfo?.configured ? "text-emerald-700" : "text-amber-700"
              }`}
            >
              {shopifyInfo?.configured ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Active &amp; Ready</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Configuring Tokens</span>
                </>
              )}
            </span>
          </div>
          {shopifyInfo?.domain && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Store Domain</span>
              <span className="font-mono text-slate-700">{shopifyInfo.domain}</span>
            </div>
          )}
          {shopifyInfo?.sampleProductCount !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Available Products</span>
              <span className="font-bold text-slate-800">
                {shopifyInfo.sampleProductCount > 0
                  ? `${shopifyInfo.sampleProductCount} synced samples`
                  : "Ready for catalog sync"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Operator shortcuts if privileged */}
      {isOperatorOrAdmin && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#FF7900]" />
            <h3 className="font-bold text-sm">Administrative Controls</h3>
          </div>
          <p className="text-xs text-slate-300">
            Your account is assigned administrative privileges. Access operational command portals below:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all"
            >
              <span>Product Operations Portal (/admin)</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              href="/master-admin"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1554D1] hover:bg-[#0E44B0] text-xs font-bold text-white transition-all"
            >
              <span>Master Admin Control Center (/master-admin)</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
