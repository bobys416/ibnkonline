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
} from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (user) {
      const userOrders = readOrders(user);
      setOrderCount(userOrders.length);
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

  const accountCards = [
    {
      title: "Your Orders",
      description: "Track, return, or buy things again",
      icon: Package,
      href: "/orders",
      badge: orderCount > 0 ? `${orderCount} order${orderCount === 1 ? "" : "s"}` : undefined,
    },
    {
      title: "Your Cart & Saved",
      description: "Review items in cart or saved for later",
      icon: ShoppingCart,
      href: "/cart",
    },
    {
      title: "Deals & Wishlist",
      description: "Explore lightning deals and saved products",
      icon: Heart,
      href: "/deals",
    },
    {
      title: "Login & Security",
      description: "Edit name, mobile number, and password",
      icon: User,
      href: "#",
    },
    {
      title: "Customer Service",
      description: "Browse help topics, contact support, or track returns",
      icon: ShieldCheck,
      href: "/help",
    },
  ];

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F1111]">Your Account</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Manage your orders, profile, and security settings.</p>
        </div>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5 text-slate-500" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* User summary strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#232F3E] text-white font-black text-xl flex items-center justify-center shrink-0 shadow-xs">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-[#0F1111]">{user.fullName}</h2>
              {isOperatorOrAdmin && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-[#007185] text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Portal Operator</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">{user.email}</p>
            {user.phone && <p className="text-xs text-slate-400 mt-0.5">{user.phone}</p>}
          </div>
        </div>
        <Link
          href="/orders"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-xs font-bold text-[#0F1111] shadow-xs transition-colors self-start sm:self-auto"
        >
          <span>View Your Orders</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Amazon-style 2-column card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accountCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#E77600] hover:shadow-xs transition-all flex items-start gap-4 group"
            >
              <div className="p-3 rounded-lg bg-[#F7F8F8] text-[#232F3E] group-hover:bg-[#FFF8E7] group-hover:text-[#E77600] transition-colors shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#0F1111] group-hover:text-[#007185] transition-colors">
                    {card.title}
                  </h3>
                  {card.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FFD814] text-[#0F1111]">
                      {card.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-snug">{card.description}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Operator shortcuts if privileged */}
      {isOperatorOrAdmin && (
        <div className="bg-[#232F3E] text-white rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#FF9900]" />
            <h3 className="font-bold text-sm">Administrative Command Portals</h3>
          </div>
          <p className="text-xs text-slate-300">
            Your account is assigned administrative privileges. Access operational command portals below:
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all"
            >
              <span>Product Operations Portal (/admin)</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              href="/master-admin"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF9900] hover:bg-[#E08800] text-xs font-bold text-[#0F1111] transition-all"
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
