"use client";

import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  User,
  MapPin,
  ChevronDown,
  X,
  LocateFixed,
  LoaderCircle,
  Menu,
  Sparkles,
  Flame,
  Package,
} from "lucide-react";
import { IbnkLogo } from "@/components/ibnk/IbnkLogo";
import { useCart } from "@/lib/cart";
import { formatINRShort } from "@/lib/money";
import { usePathname, useRouter } from "next/navigation";
import {
  checkDeliveryServiceability,
  getDeliveryLocationSnapshot,
  lookupDeliveryLocation,
  parseDeliveryLocation,
  saveDeliveryLocation,
  subscribeToDeliveryLocation,
  type DeliveryLocation,
} from "@/lib/delivery-location";

const subNavLinks = [
  { name: "Deals & Offers", href: "/deals", highlight: true, icon: Flame },
  { name: "Grocery", href: "/categories/grocery" },
  { name: "Electronics", href: "/categories/electronics" },
  { name: "Fashion", href: "/categories/fashion" },
  { name: "Home Essentials", href: "/categories/home" },
  { name: "Spring Savings", href: "/spring-savings", spark: true },
  { name: "Baby", href: "/categories/baby" },
  { name: "Patio & Garden", href: "/categories/patio-garden" },
];

function CategoryNavigationLinks({ pathname }: { pathname: string | null }) {
  return (
    <>
      {subNavLinks.map((link) => {
        const IconComponent = link.icon;
        const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.name}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors hover:bg-white hover:shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1554D1] focus-visible:ring-offset-1 ${
              isActive
                ? "bg-blue-50 font-bold text-[#1554D1]"
                : link.highlight
                  ? "bg-orange-50 font-bold text-[#B54708] hover:bg-orange-100"
                  : link.spark
                    ? "bg-blue-50 font-bold text-[#1554D1] hover:bg-blue-100"
                    : "text-slate-700 hover:text-[#172033]"
            }`}
          >
            {IconComponent && <IconComponent className="h-3 w-3 shrink-0" />}
            {link.spark && <Sparkles className="h-3 w-3 shrink-0 text-[#1554D1]" />}
            <span>{link.name}</span>
          </Link>
        );
      })}
    </>
  );
}

function ActiveCategoryNavigation() {
  const pathname = usePathname();
  return <CategoryNavigationLinks pathname={pathname} />;
}

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount, totalPaise } = useCart();
  const router = useRouter();
  const [isFulfillmentOpen, setIsFulfillmentOpen] = useState(false);
  const [zipCodeInput, setZipCodeInput] = useState<string | null>(null);
  const [locationPreview, setLocationPreview] = useState<DeliveryLocation | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const locationModalRef = useRef<HTMLDivElement>(null);
  const locationTriggerRef = useRef<HTMLButtonElement>(null);
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

  useEffect(() => {
    if (!isFulfillmentOpen) return;
    const locationTrigger = locationTriggerRef.current;
    locationModalRef.current?.focus();
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsFulfillmentOpen(false);
    }
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      locationTrigger?.focus();
    };
  }, [isFulfillmentOpen]);

  const departments = [
    { name: "Grocery & Essentials", icon: "🍎", href: "/categories/grocery" },
    { name: "Electronics & Tech", icon: "📱", href: "/categories/electronics" },
    { name: "Home & Appliances", icon: "🛋️", href: "/categories/home" },
    { name: "Fashion & Apparel", icon: "👗", href: "/categories/fashion" },
    { name: "Baby & Nursery", icon: "🍼", href: "/categories/baby" },
    { name: "Toys & Games", icon: "🎮", href: "/categories/toys" },
    { name: "Beauty & Grooming", icon: "✨", href: "/categories/beauty" },
    { name: "Patio & Garden", icon: "🌱", href: "/categories/patio-garden" },
    { name: "Sports & Outdoors", icon: "⚽", href: "/categories/sports" },
    { name: "Automotive & Tools", icon: "🚗", href: "/categories/auto" },
  ];

  async function checkDeliveryPinCode() {
    if (!/^[1-9]\d{5}$/.test(zipCode)) {
      setLocationMessage("Enter a valid 6-digit Indian PIN code.");
      setLocationMessageType("error");
      return;
    }

    setIsCheckingLocation(true);
    setLocationMessage("Verifying PIN code coverage...");
    setLocationMessageType("info");
    try {
      const serviceability = await checkDeliveryServiceability(zipCode);
      const baseLocation =
        locationPreview?.pinCode === zipCode
          ? locationPreview
          : savedLocation?.pinCode === zipCode
            ? savedLocation
            : {
                addressLine1: "",
                addressLine2: "",
                landmark: "",
                city: "",
                state: "",
                pinCode: zipCode,
                displayName: "",
                serviceability: serviceability,
              };
      setLocationPreview({ ...baseLocation, pinCode: zipCode, serviceability });
      if (serviceability === "unavailable") {
        setLocationMessage(`Delivery is currently unavailable for PIN ${zipCode}. You may still save it as your address.`);
        setLocationMessageType("error");
      } else {
        setLocationMessage(`Delivery coverage confirmed for PIN ${zipCode}. Click "Use this location" to apply.`);
        setLocationMessageType("success");
      }
    } catch (error) {
      setLocationMessage(
        error instanceof Error ? error.message : "Service check failed. You can still save this location."
      );
      setLocationMessageType("error");
    } finally {
      setIsCheckingLocation(false);
    }
  }

  function detectMyLocation() {
    // Objective 3: Explicit insecure-origin detection for local LAN development
    const isLocalLanInsecure =
      !window.isSecureContext &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1";

    if (isLocalLanInsecure) {
      setLocationMessage(
        "Device location requires a secure origin (HTTPS). You are currently connected via an HTTP IP address (" +
          window.location.hostname +
          "). Open http://localhost:3000 on this machine, or enter your PIN code manually below."
      );
      setLocationMessageType("error");
      return;
    }

    if (!window.isSecureContext) {
      setLocationMessage(
        "Location detection requires a secure HTTPS connection or localhost. Please enter your 6-digit PIN code manually."
      );
      setLocationMessageType("error");
      return;
    }

    if (!navigator.geolocation) {
      setLocationMessage("This browser does not support GPS location. Please enter your PIN code manually.");
      setLocationMessageType("error");
      return;
    }

    setIsDetectingLocation(true);
    setLocationPreview(null);
    setLocationMessage("Requesting device coordinates…");
    setLocationMessageType("info");

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        setLocationMessage("Resolving address details from GPS coordinates…");
        try {
          const location = await lookupDeliveryLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
          setLocationPreview(location);
          setZipCodeInput(location.pinCode);
          if (location.serviceability === "unavailable") {
            setLocationMessage(
              `Address resolved: ${[location.city, location.state, location.pinCode].filter(Boolean).join(", ")}. Note: Delivery coverage is limited for this PIN code.`
            );
            setLocationMessageType("error");
          } else {
            setLocationMessage(
              `Location resolved: ${[location.landmark, location.city, location.state, location.pinCode].filter(Boolean).join(", ")}. Review and confirm below.`
            );
            setLocationMessageType("success");
          }
        } catch (error) {
          setLocationMessage(
            error instanceof Error
              ? error.message
              : "Could not resolve address from coordinates. Enter your PIN code manually."
          );
          setLocationMessageType("error");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? "Location permission was denied. You can enter your 6-digit PIN code manually below."
            : error.code === error.POSITION_UNAVAILABLE
              ? "Your device could not acquire satellite/network position. Please enter your PIN code manually."
              : "Location detection timed out. Please try again or enter your PIN code manually.";
        setLocationMessage(message);
        setLocationMessageType("error");
        setIsDetectingLocation(false);
      },
      { enableHighAccuracy: false, maximumAge: 300_000, timeout: 15_000 }
    );
  }

  function confirmSelectedLocation() {
    if (!locationPreview) return;
    try {
      saveDeliveryLocation(locationPreview);
      setIsFulfillmentOpen(false);
    } catch (error) {
      setLocationMessage(
        error instanceof Error
          ? error.message
          : "Could not save location to browser storage. You can continue at checkout."
      );
      setLocationMessageType("error");
    }
  }

  return (
    <header className="sticky top-0 z-40 isolate w-full bg-white">
      {/* The utility row stays opaque so scrolling content cannot show through it. */}
      <div className="border-b border-slate-200 bg-white px-3 py-2.5 sm:px-6">
        <div className="mx-auto flex min-h-[58px] max-w-[1440px] items-center gap-1 sm:gap-4 lg:gap-6">
          {/* Authentic Brand Logo - Unconstrained & Responsive */}
          <Link
            href="/"
            className="group shrink-0 select-none rounded-md py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1554D1] focus-visible:ring-offset-2"
            title="iBNK Home"
          >
            <div className="hidden sm:flex items-center">
              <IbnkLogo variant="color" className="h-9 sm:h-10 w-auto" width={140} height={84} priority />
            </div>
            <div className="flex sm:hidden items-center">
              <IbnkLogo variant="compact" className="h-8 w-auto" width={95} height={48} priority />
            </div>
          </Link>

          {/* Location Selector Pill */}
          <button
            ref={locationTriggerRef}
            onClick={() => {
              setLocationPreview(savedLocation);
              setZipCodeInput(savedLocation?.pinCode ?? null);
              setLocationMessage("");
              setIsFulfillmentOpen(true);
            }}
            className="glass-pill flex shrink-0 items-center gap-2 rounded-full px-2 py-1.5 text-left text-xs text-[#172033] transition-colors hover:border-[#1554D1] sm:px-3"
            aria-label="Select delivery destination"
          >
            <div className="w-6 h-6 rounded-full bg-orange-50 text-[#FF7900] flex items-center justify-center shrink-0">
              <MapPin className="h-3.5 w-3.5" />
            </div>
            <div className="hidden sm:block min-w-0 max-w-[140px]">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#475569]">
                Deliver to
              </span>
              <span className="block truncate text-xs font-bold text-[#172033]">
                {savedLocation
                  ? `${savedLocation.city || savedLocation.state || "India"} ${savedLocation.pinCode}`
                  : "Set Location"}
              </span>
            </div>
          </button>

          {/* Search stays a solid, high-contrast control within the utility row. */}
          <div className="relative min-w-0 flex-1 max-w-2xl">
            <form
              className="relative flex h-10 sm:h-11 items-center overflow-hidden rounded-full border border-[#D1D5DB] bg-white shadow-xs transition-colors focus-within:border-[#1554D1] focus-within:ring-2 focus-within:ring-[#1554D1]/25"
              onSubmit={(e) => {
                e.preventDefault();
                const q = searchQuery.trim();
                router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/products");
              }}
            >
              <Search className="ml-3 h-4 w-4 shrink-0 text-[#475569] sm:ml-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across electronics, fashion, grocery & essentials..."
                className="h-full min-w-0 flex-1 bg-white px-2 text-xs text-[#172033] outline-none placeholder:text-[#475569] sm:px-3 sm:text-sm"
              />
              <button
                type="submit"
                className="flex h-full shrink-0 items-center justify-center bg-[#FF7900] px-2 text-xs font-bold text-[#172033] transition-colors hover:bg-[#E06A00] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#172033] sm:px-4"
                aria-label="Search"
              >
                Search
              </button>
            </form>
          </div>

          {/* Right Header Navigation Icons / Controls */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              href="/login"
              className="hidden items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-[#172033] transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1554D1] sm:flex"
            >
              <div className="w-7 h-7 rounded-full bg-blue-50 text-[#1554D1] flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div className="text-left leading-tight hidden lg:block">
                <span className="block text-[10px] font-medium text-[#475569]">Hello, Sign In</span>
                <span className="font-bold">Account</span>
              </div>
              <ChevronDown className="hidden h-3.5 w-3.5 text-[#475569] lg:block" aria-hidden="true" />
            </Link>

            <Link
              href="/orders"
              className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-[#172033] transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1554D1] md:flex"
            >
              <Package className="h-4 w-4 text-[#475569]" />
              <span>Orders</span>
            </Link>

            {/* Shopping Cart Pill */}
            <Link
              href="/cart"
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#1554D1] px-2.5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#0E44B0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1554D1] focus-visible:ring-offset-2 active:scale-95 sm:gap-2 sm:px-3.5"
              aria-label={`Cart with ${itemCount} items`}
            >
              <div className="relative">
                <ShoppingCart className="h-4 w-4 text-white" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF7900] px-1 text-[10px] font-black text-[#172033] shadow-xs">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                {totalPaise > 0 ? formatINRShort(totalPaise) : "Cart"}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* The category tray gets the subtle glass treatment; the utility controls remain solid. */}
      <div className="glass-surface backdrop-blur-sm border-b border-slate-200 px-3 py-1.5 sm:px-6">
        <div className="mx-auto flex max-w-[1440px] items-center gap-2 sm:gap-3">
          {/* All Departments Toggle Button */}
          <button
            onClick={() => setIsDepartmentsOpen(!isDepartmentsOpen)}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#D1D5DB] bg-white px-2.5 py-1.5 text-xs font-bold text-[#172033] shadow-2xs transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1554D1] focus-visible:ring-offset-1 sm:px-3"
            aria-label={isDepartmentsOpen ? "Close all departments" : "Open all departments"}
            aria-expanded={isDepartmentsOpen}
            aria-controls="ibnk-departments-drawer"
          >
            <Menu className="h-3.5 w-3.5 text-[#1554D1]" />
            <span className="hidden sm:inline">All Departments</span>
            <span className="sm:hidden">Departments</span>
          </button>

          {/* Horizontally Scrollable Dock Pills */}
          <nav aria-label="Product categories" className="scrollbar-none flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto py-0.5">
            <React.Suspense fallback={<CategoryNavigationLinks pathname={null} />}>
              <ActiveCategoryNavigation />
            </React.Suspense>
          </nav>
        </div>
      </div>

      {/* Departments Drawer with Frosted Glass Backdrop */}
      {isDepartmentsOpen && (
        <div id="ibnk-departments-drawer" className="fixed inset-0 z-50 flex bg-[#172033]/40 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-sm flex-col bg-white text-[#172033] shadow-2xl animate-in slide-in-from-left duration-200 sm:max-w-md">
            <div className="p-5 bg-gradient-to-r from-[#172033] to-[#1554D1] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <IbnkLogo variant="white" className="h-7 w-auto" width={95} height={57} />
                <span className="font-bold text-base">All Departments</span>
              </div>
              <button
                onClick={() => setIsDepartmentsOpen(false)}
                className="rounded-full p-1.5 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Close departments menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-1 divide-y divide-slate-100">
              <div className="pb-3">
                <Link
                  href="/deals"
                  onClick={() => setIsDepartmentsOpen(false)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-orange-50 text-[#FF7900] font-bold text-xs"
                >
                  <span className="flex items-center gap-2">🔥 Flash Deals & Discounts</span>
                  <span className="rounded-full bg-[#FF7900] px-2 py-0.5 text-[10px] text-[#172033]">Save up to 60%</span>
                </Link>
              </div>

              <div className="pt-2 space-y-1">
                {departments.map((dept) => (
                  <Link
                    key={dept.name}
                    href={dept.href}
                    onClick={() => setIsDepartmentsOpen(false)}
                    className="flex items-center gap-3 rounded-xl p-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#1554D1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1554D1]"
                  >
                    <span className="text-base">{dept.icon}</span>
                    <span>{dept.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsDepartmentsOpen(false)} />
        </div>
      )}

      {/* Simplified Delivery Location Modal (OBJECTIVE 2 & 3) */}
      {isFulfillmentOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#172033]/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsFulfillmentOpen(false);
          }}
        >
          <div
            ref={locationModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="location-modal-title"
            tabIndex={-1}
            className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 sm:p-7 space-y-5"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsFulfillmentOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-[#475569] transition-colors hover:bg-slate-100 hover:text-[#172033] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1554D1]"
              aria-label="Close location modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Title */}
            <div>
              <h3 id="location-modal-title" className="text-xl font-black text-[#172033]">
                Deliver to your location
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Detect your device location or enter a 6-digit postal PIN code manually.
              </p>
            </div>

            {/* Primary Action: Detect My Location */}
            <button
              type="button"
              onClick={detectMyLocation}
              disabled={isDetectingLocation || isCheckingLocation}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#1554D1] px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#0E44B0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1554D1] focus-visible:ring-offset-2 disabled:cursor-wait disabled:bg-slate-200 disabled:text-slate-600 active:scale-98"
            >
              {isDetectingLocation ? (
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <LocateFixed className="h-4 w-4" aria-hidden="true" />
              )}
              <span>{isDetectingLocation ? "Detecting device location…" : "Detect My Location"}</span>
            </button>

            {/* Secondary Option: Manual PIN Code Input */}
            <div className="space-y-2">
              <label htmlFor="header-pin-code" className="block text-xs font-bold text-slate-700">
                Or enter PIN code manually
              </label>
              <div className="flex gap-2">
                <input
                  id="header-pin-code"
                  type="text"
                  value={zipCode}
                  onChange={(e) => {
                    setZipCodeInput(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setLocationPreview(null);
                    setLocationMessage("");
                  }}
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="e.g. 400031 or 273015"
                  className="min-h-11 flex-1 rounded-xl border border-[#D1D5DB] bg-white px-3.5 py-2 text-sm text-[#172033] outline-none focus:border-[#1554D1] focus:ring-2 focus:ring-[#1554D1]/20"
                />
                <button
                  type="button"
                  onClick={checkDeliveryPinCode}
                  disabled={isCheckingLocation || isDetectingLocation}
                  className="min-h-11 shrink-0 rounded-xl bg-[#FF7900] px-5 py-2 text-xs font-bold text-[#172033] transition-colors hover:bg-[#E06A00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1554D1] focus-visible:ring-offset-2 disabled:cursor-wait disabled:bg-slate-200 disabled:text-slate-600"
                >
                  {isCheckingLocation ? "Checking…" : "Check PIN"}
                </button>
              </div>
            </div>

            {/* Location Review Box */}
            {locationPreview && (
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 space-y-1">
                <h4 className="text-xs font-bold text-[#1554D1] uppercase tracking-wider">
                  Resolved Address
                </h4>
                <p className="text-xs font-semibold text-[#172033] leading-relaxed">
                  {[locationPreview.landmark, locationPreview.city, locationPreview.state, locationPreview.pinCode]
                    .filter(Boolean)
                    .join(", ") || locationPreview.displayName || `PIN Code: ${locationPreview.pinCode}`}
                </p>
              </div>
            )}

            {/* Status / Feedback Message */}
            {(locationMessage || savedLocationError) && (
              <div
                role="status"
                aria-live="polite"
                className={`rounded-2xl p-3.5 text-xs font-medium leading-relaxed ${
                  !locationMessage && savedLocationError
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : locationMessageType === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : locationMessageType === "error"
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-blue-50 text-blue-800 border border-blue-200"
                }`}
              >
                {locationMessage || savedLocationError}
              </div>
            )}

            {/* Modal Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={confirmSelectedLocation}
                disabled={!locationPreview || isDetectingLocation || isCheckingLocation}
                className="min-h-11 rounded-xl bg-[#172033] hover:bg-[#28344B] px-4 py-2.5 text-xs font-bold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                Use this location
              </button>
              <Link
                href="/checkout"
                onClick={() => setIsFulfillmentOpen(false)}
                className="flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-[#1554D1] transition-colors"
              >
                Enter full address at checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
