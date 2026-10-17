"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  LayoutGrid,
  Mail,
  GraduationCap,
  Users,
  Globe,
  ShieldCheck,
  Settings,
  Package,
  Store,
  Clock,
  AlertTriangle,
  Menu,
  X,
  LogOut,
  ChevronRight,
  ExternalLink,
  Check,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [operator, setOperator] = useState({
    name: "Super Administrator",
    email: "super_admin",
    role: "super_admin",
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ibnk.portal.user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.email) {
          setOperator({
            name: parsed.name || "Super Administrator",
            email: parsed.email || "super_admin",
            role: parsed.role || "super_admin",
          });
        }
      }
    } catch {}
  }, []);

  if (pathname === "/admin/login") {
    return null;
  }

  // Exact navigation items from B SPARK ADMIN HUB (media_1792233493781_0839f1a1.png)
  // while preserving all marketplace operations routes
  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutGrid, exact: true },
    { label: "Leads & Inquiries", href: "/admin", icon: Mail, exact: true, isHero: true },
    { label: "Product Catalogue", href: "/admin/products", icon: Package },
    { label: "Inventory & Stock", href: "/admin/inventory", icon: AlertTriangle },
    { label: "Merchant Onboarding", href: "/admin/merchants/onboarding", icon: Store },
    { label: "Submitted Requests", href: "/admin/approvals", icon: Clock },
    { label: "Admissions", href: "/admin/admissions", icon: GraduationCap },
    { label: "Subscribers", href: "/admin/subscribers", icon: Mail },
    { label: "Websites", href: "/admin/websites", icon: Globe },
    { label: "Admin Users", href: "/admin/users", icon: Users },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: ShieldCheck },
    { label: "Security & MFA", href: "/admin/security", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Topbar */}
      <header className="md:hidden bg-[#0A071E] text-white px-4 py-3 flex items-center justify-between border-b border-purple-500/20 w-full">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-white tracking-wider text-sm">B SPARK</span>
            <span className="text-[10px] bg-purple-900/60 border border-purple-500/40 text-purple-200 px-1.5 py-0.5 rounded font-bold">
              ADMIN HUB
            </span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 rounded text-purple-300 hover:text-white"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Persistent B SPARK ADMIN HUB Sidebar */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-72 bg-[#09061A] text-white flex-shrink-0 flex flex-col justify-between border-r border-purple-900/30 min-h-screen select-none`}
      >
        <div className="p-4 space-y-4">
          {/* 1. Header: B SPARK Logo + ADMIN HUB Badge */}
          <div className="flex items-center justify-between pb-2 border-b border-purple-500/10">
            <Link href="/admin" className="flex items-center gap-2 group">
              {/* Iridescent Spark Logo */}
              <svg
                className="h-6 w-6 shrink-0 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
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
                <span className="text-[10px] bg-purple-900/60 border border-purple-500/40 text-purple-200 px-2 py-0.5 rounded font-bold tracking-wide">
                  ADMIN HUB
                </span>
              </div>
            </Link>
          </div>

          {/* 2. Super Administrator Profile Card */}
          <div className="bg-[#130E2A]/90 border border-purple-500/20 rounded-2xl p-3.5 space-y-3 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* User Avatar with iridescent border */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 p-[1.5px]">
                    <div className="w-full h-full rounded-full bg-[#181135] flex items-center justify-center font-bold text-xs text-white">
                      SA
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-[#130E2A]" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-white truncate">{operator.name}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-purple-300">
                    <Check className="w-3 h-3 text-[#10B981]" />
                    <span className="truncate">{operator.email}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await fetch("/api/auth/portal-logout", { method: "POST" });
                  localStorage.removeItem("ibnk.portal.user");
                  localStorage.removeItem("ibnk.portal.token");
                  window.location.href = "/admin/login";
                }}
                className="text-purple-400 hover:text-white p-1 rounded transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Row inside card: Security & Profile + Online Status */}
            <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between text-[11px]">
              <Link
                href="/admin/security"
                className="flex items-center gap-1 text-purple-300 hover:text-white transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-purple-400" />
                <span>Security &amp; Profile</span>
              </Link>
              <div className="flex items-center gap-1.5 text-[#10B981] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>Online</span>
              </div>
            </div>
          </div>

          {/* 3. Section Title: CONTROL NAVIGATION */}
          <div className="pt-2">
            <h5 className="text-slate-400 text-[10px] font-bold uppercase tracking-wider px-3 mb-2">
              CONTROL NAVIGATION
            </h5>

            {/* Navigation links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                // Leads & Inquiries receives the glowing purple/magenta pill style as in screenshot
                const isHighlighted = item.isHero && pathname === "/admin";

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isHighlighted
                        ? "bg-[#8B2BE2]/25 border border-[#D946EF]/60 text-white shadow-[0_0_20px_rgba(217,70,239,0.3)] font-bold"
                        : isActive
                          ? "bg-purple-900/40 border border-purple-500/40 text-white"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isHighlighted ? (
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#9333EA] to-[#D946EF] flex items-center justify-center text-white shadow-xs">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <Icon className={`w-4 h-4 ${isActive ? "text-purple-300" : "text-slate-400"}`} />
                      )}
                      <span>{item.label}</span>
                    </div>

                    {isHighlighted && <ChevronRight className="w-4 h-4 text-purple-300" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* 4. Bottom Link: [↗ Public Site] */}
        <div className="p-4 border-t border-purple-500/10 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-slate-300 hover:text-white text-xs font-semibold transition-all shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
            <span>Public Site</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
