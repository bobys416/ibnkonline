"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Package,
  Layers,
  Store,
  Clock,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [operator, setOperator] = useState({
    name: "Catalogue Operator",
    email: "operations@ibnk.online",
    role: "PRODUCT_OPERATIONS",
  });

  if (pathname === "/admin/login") {
    return null;
  }

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ibnk.portal.user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.email) setOperator(parsed);
      }
    } catch {}
  }, []);

  const navItems = [
    { label: "Operations Dashboard", href: "/admin", icon: Layers, exact: true },
    { label: "Product Catalogue", href: "/admin/products", icon: Package },
    { label: "Inventory & Stock", href: "/admin/inventory", icon: AlertTriangle },
    { label: "Merchant Onboarding", href: "/admin/merchants/onboarding", icon: Store },
    { label: "Submitted Requests", href: "/admin/approvals", icon: Clock },
  ];

  return (
    <>
      {/* Mobile Topbar */}
      <header className="md:hidden bg-[#172033] text-white px-4 py-3 flex items-center justify-between border-b border-slate-700 w-full">
        <div className="flex items-center gap-2">
          <Image
            src="/images/ibnk-logo.png"
            alt="iBNK"
            width={70}
            height={24}
            className="h-6 w-auto object-contain brightness-0 invert"
          />
          <span className="text-xs bg-blue-600/60 font-semibold px-2 py-0.5 rounded text-blue-100">
            Operations Portal
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 rounded text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Persistent Sidebar */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-[#172033] text-white flex-shrink-0 flex flex-col justify-between border-r border-slate-800`}
      >
        <div>
          {/* Logo & Portal Branding */}
          <div className="p-5 border-b border-slate-800">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo/ibnk-logo.png"
                alt="iBNK Marketplace"
                width={100}
                height={32}
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-blue-400 font-bold">
                Operations Portal
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded">
                Live Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Catalogue Management & Merchant Intake
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#1554D1] text-white shadow-sm"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-300" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Operator Profile & System Links */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                OP
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-white truncate">{operator.name}</div>
                <div className="text-[10px] text-blue-300 truncate">{operator.email}</div>
              </div>
            </div>
            <div className="mt-2 text-[10px] bg-slate-700/80 text-slate-300 px-2 py-0.5 rounded text-center font-mono">
              Role: PRODUCT_OPERATIONS
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <Link
              href="/master-admin"
              className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Master Admin Center</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-blue-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
              <span>Customer Storefront</span>
            </Link>
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/auth/portal-logout", { method: "POST" });
                localStorage.removeItem("ibnk.portal.user");
                localStorage.removeItem("ibnk.portal.token");
                window.location.href = "/admin/login";
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Operator Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

