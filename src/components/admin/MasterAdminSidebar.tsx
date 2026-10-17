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
  ExternalLink,
  ChevronRight,
  Check,
} from "lucide-react";

export function MasterAdminSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState({
    name: "Master Executive",
    email: "master_admin",
    role: "master_admin",
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ibnk.portal.user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.email && parsed.roles?.includes("master_admin")) {
          setAdminUser({
            name: parsed.name || "Master Executive",
            email: parsed.email || "master_admin",
            role: "master_admin",
          });
        }
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
      <header className="md:hidden bg-[#09061A] text-white px-4 py-3 flex items-center justify-between border-b border-purple-500/20 w-full">
        <div className="flex items-center gap-2">
          <span className="font-black text-white tracking-wider text-sm">B SPARK</span>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
            MASTER HUB
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 rounded text-purple-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Persistent B SPARK MASTER HUB Sidebar */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-72 bg-[#09061A] text-white flex-shrink-0 flex flex-col justify-between border-r border-purple-900/30 min-h-screen select-none`}
      >
        <div className="p-4 space-y-4">
          {/* Header & Clearance */}
          <div className="flex items-center justify-between pb-2 border-b border-purple-500/10">
            <Link href="/master-admin" className="flex items-center gap-2 group">
              <svg
                className="h-6 w-6 shrink-0 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon points="20,18 7,5 11,22" fill="#00C8FF" />
                <polygon points="20,20 11,22 13,33" fill="#2563EB" />
                <polygon points="20,18 21,5 34,13" fill="#A855F7" />
                <polygon points="20,20 34,13 27,31" fill="#FF7828" />
                <polygon points="20,17 15,24 20,29 25,24" fill="#EC4899" />
              </svg>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-white text-base tracking-wider">B SPARK</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
                  MASTER HUB
                </span>
              </div>
            </Link>
          </div>

          {/* Master Admin Card */}
          <div className="bg-[#130E2A]/90 border border-amber-500/30 rounded-2xl p-3.5 space-y-3 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 p-[1.5px]">
                    <div className="w-full h-full rounded-full bg-[#181135] flex items-center justify-center font-black text-xs text-amber-300">
                      MA
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-[#130E2A]" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-white truncate">{adminUser.name}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-amber-300">
                    <Check className="w-3 h-3 text-[#10B981]" />
                    <span className="truncate">{adminUser.email}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await fetch("/api/auth/portal-logout", { method: "POST" });
                  localStorage.removeItem("ibnk.portal.user");
                  localStorage.removeItem("ibnk.portal.token");
                  window.location.href = "/master-admin/login";
                }}
                className="text-purple-400 hover:text-white p-1 rounded transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between text-[11px]">
              <span className="font-mono text-amber-300 text-[10px] bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
                Clearance: Level 4
              </span>
              <div className="flex items-center gap-1.5 text-[#10B981] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>Online</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h5 className="text-slate-400 text-[10px] font-bold uppercase tracking-wider px-3 mb-2">
              MASTER GOVERNANCE
            </h5>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-amber-500/20 border border-amber-400/50 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.25)] font-bold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-amber-400" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Switcher */}
        <div className="p-4 border-t border-purple-500/10 space-y-2">
          <Link
            href="/admin"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-slate-300 hover:text-white text-xs font-semibold transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Operations Portal</span>
          </Link>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span>Customer Storefront</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
