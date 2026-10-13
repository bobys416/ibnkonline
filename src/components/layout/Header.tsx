"use client";

import React, { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  User,
  MapPin,
  ChevronDown,
  X,
  Truck,
  Store,
  Clock,
  Menu,
} from "lucide-react";
import { IbnkLogo } from "@/components/ibnk/IbnkLogo";
import { useCart } from "@/lib/cart";
import { formatINRShort } from "@/lib/money";
import { useRouter } from "next/navigation";
import {
  checkDeliveryServiceability,
  getDeliveryLocationSnapshot,
  parseDeliveryLocation,
  subscribeToDeliveryLocation,
} from "@/lib/delivery-location";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount, totalPaise } = useCart();
  const router = useRouter();
  const [isFulfillmentOpen, setIsFulfillmentOpen] = useState(false);
  const [fulfillmentType, setFulfillmentType] = useState<"shipping" | "pickup" | "delivery">("shipping");
  const [zipCodeInput, setZipCodeInput] = useState<string | null>(null);
  const locationSnapshot = useSyncExternalStore(
    subscribeToDeliveryLocation,
    getDeliveryLocationSnapshot,
    () => null
  );
  const { savedLocation, savedLocationError } = useMemo(() => {
    try {
      return { savedLocation: parseDeliveryLocation(locationSnapshot), savedLocationError: "" };
    } catch {
      return {
        savedLocation: null,
        savedLocationError: "Your saved delivery location could not be loaded.",
      };
    }
  }, [locationSnapshot]);
  const zipCode = zipCodeInput ?? savedLocation?.pinCode ?? "";
  const [locationMessage, setLocationMessage] = useState("");
  const [locationMessageType, setLocationMessageType] = useState<"error" | "success" | "info">("info");
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
  const [isDepartmentsOpen, setIsDepartmentsOpen] = useState(false);

  const departments = [
    { name: "Grocery & Essentials", icon: "🍎", href: "/categories/grocery" },
    { name: "Electronics & Tech", icon: "📱", href: "/categories/electronics" },
    { name: "Home, Furniture & Appliances", icon: "🛋️", href: "/categories/home" },
    { name: "Patio & Garden", icon: "🌱", href: "/categories/patio-garden" },
    { name: "Fashion & Clothing", icon: "👗", href: "/categories/fashion" },
    { name: "Baby & Nursery", icon: "🍼", href: "/categories/baby" },
    { name: "Toys & Video Games", icon: "🎮", href: "/categories/toys" },
    { name: "Beauty & Personal Care", icon: "✨", href: "/categories/beauty" },
    { name: "Sports, Fitness & Outdoors", icon: "⚽", href: "/categories/sports" },
    { name: "Auto & Tires", icon: "🚗", href: "/categories/auto" },
    { name: "Pharmacy & Health", icon: "💊", href: "/categories/pharmacy" },
  ];

  const subNavLinks = [
    { name: "Deals", href: "/deals", highlight: true },
    { name: "Grocery & Essentials", href: "/categories/grocery" },
    { name: "Spring Savings", href: "/spring-savings" },
    { name: "Fashion", href: "/categories/fashion" },
    { name: "Home", href: "/categories/home" },
    { name: "Electronics", href: "/categories/electronics" },
    { name: "Patio & Garden", href: "/categories/patio-garden" },
    { name: "Baby", href: "/categories/baby" },
    { name: "IBNK+", href: "/ibnk-plus", isWPlus: true },
  ];

  async function checkDeliveryPinCode() {
    if (!/^[1-9]\d{5}$/.test(zipCode)) {
      setLocationMessage("Enter a valid 6-digit Indian PIN code.");
      setLocationMessageType("error");
      return;
    }

    setIsCheckingLocation(true);
    setLocationMessage("Checking this PIN code...");
    setLocationMessageType("info");
    try {
      const serviceability = await checkDeliveryServiceability(zipCode);
      if (serviceability === "available") {
        setLocationMessage("This PIN code is serviceable. Add and save your full address at checkout.");
        setLocationMessageType("success");
      } else if (serviceability === "unavailable") {
        setLocationMessage("Delivery is not available to this PIN code.");
        setLocationMessageType("error");
      } else {
        setLocationMessage("Location found, but delivery coverage has not been configured for verification.");
        setLocationMessageType("info");
      }
    } catch (error) {
      setLocationMessage(
        error instanceof Error ? error.message : "Location lookup failed. Please try again."
      );
      setLocationMessageType("error");
    } finally {
      setIsCheckingLocation(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full shadow-[0_8px_24px_rgba(0,39,94,0.22)]">
      {/* Main header row */}
      <div className="bg-[#131921] px-2 py-2 text-white sm:px-4">
        <div className="mx-auto flex min-h-[68px] max-w-[1536px] items-center gap-2 sm:gap-3 lg:gap-4">
          <Link
            href="/"
            className="group shrink-0 select-none rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFC220]"
            title="IBNK Home"
          >
            <span className="flex h-[68px] w-[68px] items-center justify-center rounded-full border-2 border-[#FFC220] bg-white shadow-[0_6px_18px_rgba(0,0,0,0.45)] ring-2 ring-white/80 transition-shadow group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.55)] sm:h-[76px] sm:w-[76px]">
              <IbnkLogo
                variant="color"
                interactive
                className="h-[40px] w-[57px] sm:h-[45px] sm:w-[64px]"
                width={92}
                height={64}
              />
            </span>
          </Link>

          <button
            onClick={() => setIsFulfillmentOpen(true)}
            className="flex max-w-[96px] shrink-0 items-center gap-1 rounded-sm px-1 py-1 text-left hover:outline hover:outline-1 hover:outline-white sm:max-w-[170px] sm:gap-2 sm:px-2"
            aria-label="Choose delivery location"
          >
            <MapPin className="h-5 w-5 shrink-0 self-end text-white" />
            <span className="min-w-0">
              <span className="hidden text-[11px] leading-tight text-slate-300 sm:block">
                Deliver to
              </span>
              <span className="block truncate text-xs font-bold leading-tight sm:text-sm">
                {savedLocation
                  ? `${savedLocation.city || savedLocation.state || "Address"} ${savedLocation.pinCode}`
                  : "Set location"}
              </span>
            </span>
          </button>

          <div className="relative min-w-0 flex-1">
            <form
              className="relative flex h-11 items-center overflow-hidden rounded-md bg-white focus-within:ring-2 focus-within:ring-[#febd69]"
              onSubmit={(e) => {
                e.preventDefault();
                const q = searchQuery.trim();
                router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/products");
              }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search IBNK.online"
                className="h-full min-w-0 flex-1 bg-white pl-3 pr-2 text-sm font-normal text-slate-900 outline-none placeholder:text-slate-500 sm:pl-4 md:text-base"
              />
              <button
                type="submit"
                className="flex h-full w-12 shrink-0 items-center justify-center bg-[#febd69] text-slate-900 transition-colors hover:bg-[#f3a847] sm:w-14"
                aria-label="Search"
              >
                <Search className="h-6 w-6" />
              </button>
            </form>
          </div>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
            <Link
              href="/login"
              className="flex items-center gap-1 rounded-sm px-1 py-2 text-left hover:outline hover:outline-1 hover:outline-white sm:gap-2 sm:px-2"
            >
              <User className="h-5 w-5 shrink-0 text-white sm:hidden" />
              <div className="hidden flex-col text-sm leading-tight sm:flex">
                <span className="text-xs">Hello, sign in</span>
                <span className="flex items-center gap-1 font-bold">
                  Account <ChevronDown className="h-3 w-3" />
                </span>
              </div>
            </Link>

            <Link
              href="/orders"
              className="hidden items-center rounded-sm px-2 py-2 text-sm leading-tight hover:outline hover:outline-1 hover:outline-white xl:flex"
            >
              <span>Returns<br /><strong>&amp; Orders</strong></span>
            </Link>

            <Link
              href="/cart"
              className="relative flex items-center gap-1 rounded-sm px-1 py-2 hover:outline hover:outline-1 hover:outline-white sm:gap-2 sm:px-2"
              aria-label="Cart"
            >
              <div className="relative">
                <ShoppingCart className="h-7 w-7 text-white" />
                <span className="absolute -right-1 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-[#131921] bg-[#febd69] px-1 text-[11px] font-black text-slate-950">
                  {itemCount}
                </span>
              </div>
              <span className="hidden text-sm font-bold text-white xl:inline">
                {formatINRShort(totalPaise)}
              </span>
              <span className="hidden text-sm font-bold text-white sm:inline xl:hidden">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Department navigation */}
      <div className="bg-[#232f3e] px-2 py-1 text-white sm:px-4">
        <div className="mx-auto flex max-w-[1536px] items-center gap-4">
          <button
            onClick={() => setIsDepartmentsOpen(!isDepartmentsOpen)}
            className="flex shrink-0 items-center gap-1.5 rounded-sm px-2 py-1.5 text-sm font-bold hover:outline hover:outline-1 hover:outline-white"
            aria-label="Open all departments"
          >
            <Menu className="h-5 w-5" />
            All
          </button>

          <nav aria-label="Main navigation" className="scrollbar-none flex min-w-0 flex-1 items-center gap-1 overflow-x-auto whitespace-nowrap sm:gap-3 lg:gap-5">
            {subNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex shrink-0 items-center rounded-sm px-2 py-1.5 text-xs font-semibold transition-colors hover:outline hover:outline-1 hover:outline-white sm:text-sm ${
                  link.highlight
                    ? "text-[#FFC220] font-black"
                    : link.isWPlus
                    ? "text-white font-bold"
                    : "text-white/95"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Departments drawer */}
      {isDepartmentsOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex">
          <div className="w-full max-w-sm sm:max-w-md bg-white text-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            <div className="p-4 bg-[#0071DC] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IbnkLogo variant="white" className="h-7 w-auto" width={90} height={28} />
                <span className="font-bold text-lg">All Departments</span>
              </div>
              <button
                onClick={() => setIsDepartmentsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100">
              <div className="py-2">
                <Link
                  href="/deals"
                  onClick={() => setIsDepartmentsOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-amber-50 text-amber-700 font-bold"
                >
                  <span className="flex items-center gap-2">🔥 Flash Deals & Rollbacks</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200">Save up to 65%</span>
                </Link>
              </div>

              <div className="py-2 space-y-1">
                {departments.map((dept) => (
                  <Link
                    key={dept.name}
                    href={dept.href}
                    onClick={() => setIsDepartmentsOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-800"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xl">{dept.icon}</span>
                      <span>{dept.name}</span>
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400 -rotate-90" />
                  </Link>
                ))}
              </div>

              <div className="py-4">
                <Link
                  href="/ibnk-plus"
                  onClick={() => setIsDepartmentsOpen(false)}
                  className="block p-4 rounded-2xl bg-gradient-to-r from-[#004f9a] to-[#0071DC] text-white shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <IbnkLogo variant="white" className="h-6 w-auto" width={80} height={24} />
                    <span className="font-bold text-sm">IBNK+ Membership</span>
                  </div>
                  <p className="text-xs text-white/80">
                    Unlimited free delivery, exclusive member benefits & discounts across all stores.
                  </p>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsDepartmentsOpen(false)} />
        </div>
      )}

      {/* Delivery location and fulfillment modal */}
      {isFulfillmentOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg animate-in fade-in zoom-in-95 rounded-3xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setIsFulfillmentOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full hover:bg-slate-100 text-slate-500"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="mb-1 text-xl font-bold text-slate-900">Deliver to your location</h3>
            <p className="text-xs text-slate-500 mb-5">
              Select a fulfillment option and check whether delivery is available in your area.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                onClick={() => setFulfillmentType("shipping")}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  fulfillmentType === "shipping"
                    ? "border-[#0071DC] bg-[#E6F1FC] text-[#0071DC] font-bold shadow-xs ring-2 ring-[#0071DC]/20"
                    : "border-slate-200 hover:border-slate-300 text-slate-700"
                }`}
              >
                <Truck className="w-6 h-6 mx-auto mb-1.5" />
                <span className="block text-sm">Shipping</span>
                <span className="text-[10px] text-slate-500 font-normal">Enter PIN to check</span>
              </button>

              <button
                onClick={() => setFulfillmentType("pickup")}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  fulfillmentType === "pickup"
                    ? "border-[#0071DC] bg-[#E6F1FC] text-[#0071DC] font-bold shadow-xs ring-2 ring-[#0071DC]/20"
                    : "border-slate-200 hover:border-slate-300 text-slate-700"
                }`}
              >
                <Store className="w-6 h-6 mx-auto mb-1.5" />
                <span className="block text-sm">Pickup</span>
                <span className="text-[10px] text-slate-500 font-normal">Choose a hub</span>
              </button>

              <button
                onClick={() => setFulfillmentType("delivery")}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  fulfillmentType === "delivery"
                    ? "border-[#0071DC] bg-[#E6F1FC] text-[#0071DC] font-bold shadow-xs ring-2 ring-[#0071DC]/20"
                    : "border-slate-200 hover:border-slate-300 text-slate-700"
                }`}
              >
                <Clock className="w-6 h-6 mx-auto mb-1.5" />
                <span className="block text-sm">Delivery</span>
                <span className="text-[10px] text-slate-500 font-normal">Check availability</span>
              </button>
            </div>

            <div className="mb-4 space-y-3">
              <label htmlFor="header-pin-code" className="block text-sm font-semibold text-slate-700">
                Enter delivery PIN code
              </label>
              <div className="flex gap-2">
                <input
                  id="header-pin-code"
                  type="text"
                  value={zipCode}
                  onChange={(e) => {
                    setZipCodeInput(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setLocationMessage("");
                  }}
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm outline-none focus:border-[#0071DC]"
                  placeholder="e.g. 400031"
                />
                <button
                  onClick={checkDeliveryPinCode}
                  disabled={isCheckingLocation}
                  className="shrink-0 rounded-xl bg-[#0071DC] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#004f9a] disabled:cursor-wait disabled:opacity-60"
                >
                  {isCheckingLocation ? "Checking…" : "Check PIN"}
                </button>
              </div>
            </div>

            {(locationMessage || savedLocationError) && (
              <p
                role="status"
                aria-live="polite"
                className={`mb-3 rounded-xl p-3 text-sm ${
                  !locationMessage && savedLocationError
                    ? "bg-rose-50 text-rose-700"
                    : locationMessageType === "success"
                    ? "bg-emerald-50 text-emerald-800"
                    : locationMessageType === "error"
                      ? "bg-rose-50 text-rose-700"
                      : "bg-slate-50 text-slate-700"
                }`}
              >
                {locationMessage || savedLocationError}
              </p>
            )}

            <Link
              href="/checkout"
              onClick={() => setIsFulfillmentOpen(false)}
              className="block rounded-xl border border-[#0071DC] px-4 py-2.5 text-center text-sm font-bold text-[#0071DC] hover:bg-[#E6F1FC]"
            >
              Add full delivery address at checkout
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
