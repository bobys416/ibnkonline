"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  CheckCircle,
  Clock,
  Store,
  Layers,
  DollarSign,
  FileCheck2,
  Users,
  ScrollText,
  Network,
  ArrowLeft,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export function MasterAdminSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState({
    name: "Master Admin Executive",
    email: "masteradmin@ibnk.online",
    role: "MASTER_ADMIN",
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ibnk.portal.user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.email && parsed.roles?.includes("master_admin")) setAdminUser(parsed);
      }
    } catch {}
  }, []);

  if (pathname === "/master-admin/login") {
    return null;
  }

  const navItems = [
    { label: "Executive Overview", href: "/master-admin", icon: Layers, exact: true },
    { label: "Approval Center", href: "/master-admin/approvals", icon: FileCheck2 },
    { label: "Merchant Governance", href: "/master-admin/merchants", icon: Store },
    { label: "Distribution Network", href: "/master-admin/distributors", icon: Network },
    { label: "Financial Ledger", href: "/master-admin/transactions", icon: DollarSign },
    { label: "Settlements & Payouts", href: "/master-admin/settlements", icon: CheckCircle },
    { label: "RBAC & Access Control", href: "/master-admin/users", icon: Users },
    { label: "Immutable Audit Logs", href: "/master-admin/audit-logs", icon: ScrollText },
  ];

  return (
    <>
      {/* Mobile Topbar */}
      <header className="md:hidden bg-[#0F172A] text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 w-full">
        <div className="flex items-center gap-2">
          <Image
            src="/images/ibnk-logo.png"
            alt="iBNK"
            width={70}
            height={24}
            className="h-6 w-auto object-contain brightness-0 invert"
          />
          <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
            Master Admin
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
        } md:block w-full md:w-68 bg-[#0F172A] text-white flex-shrink-0 flex flex-col justify-between border-r border-slate-800/80`}
      >
        <div>
          {/* Header & Level 4 Security Clearance */}
          <div className="p-5 border-b border-slate-800/80">
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
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Control Center</span>
              </span>
              <span className="text-[10px] bg-red-950 text-red-300 border border-red-800/80 px-1.5 py-0.5 rounded font-mono">
                Level 4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Authoritative Approval & Financial Authority
            </p>
          </div>

          {/* Navigation Items */}
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
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Switchers */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="bg-slate-800/70 rounded-xl p-3 border border-slate-700/60">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">
                MA
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-white truncate">{adminUser.name}</div>
                <div className="text-[10px] text-amber-300 truncate">{adminUser.email}</div>
              </div>
            </div>
            <div className="mt-2 text-[10px] bg-amber-950/60 text-amber-300 border border-amber-800/60 px-2 py-0.5 rounded text-center font-mono">
              Role: MASTER_ADMIN
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-blue-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Operations Portal</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-blue-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>Customer Storefront</span>
            </Link>
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/auth/portal-logout", { method: "POST" });
                localStorage.removeItem("ibnk.portal.user");
                localStorage.removeItem("ibnk.portal.token");
                window.location.href = "/master-admin/login";
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Executive Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

