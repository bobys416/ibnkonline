"use client";

import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  MapPin,
  ChevronDown,
  X,
  LocateFixed,
  LoaderCircle,
  Menu,
  Sparkles,
  Flame,
  ArrowRight,
  LogOut,
  Package,
  User,
  Check,
} from "lucide-react";
import { IbnkLogo } from "@/components/ibnk/IbnkLogo";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth-context";
import {
  checkDeliveryServiceability,
  getDeliveryLocationSnapshot,
  lookupDeliveryLocation,
  parseDeliveryLocation,
  saveDeliveryLocation,
  subscribeToDeliveryLocation,
  type DeliveryLocation,
} from "@/lib/delivery-location";

// Category options for the Amazon-style "All ▾" search select
const SEARCH_CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "deals", label: "Deals" },
  { id: "electronics", label: "Electronics" },
  { id: "grocery", label: "Grocery & Gourmet" },
  { id: "fashion", label: "Fashion & Apparel" },
  { id: "home", label: "Home & Kitchen" },
  { id: "beauty", label: "Beauty" },
  { id: "toys", label: "Toys & Games" },
  { id: "baby", label: "Baby" },
];

// Subnav links exactly matching the Amazon India reference
const SUB_NAV_ITEMS = [
  { label: "Today's Deals", href: "/deals" },
  { label: "Coupons", href: "/deals" },
  { label: "Hotel Booking", href: "/categories" },
  { label: "Mobiles", href: "/categories/electronics" },
  { label: "Fresh", href: "/categories/grocery" },
  { label: "Grocery & Gourmet Foods", href: "/categories/grocery" },
  { label: "Gift Cards", href: "/deals" },
  { label: "Flights", href: "/categories" },
  { label: "Electronics", href: "/categories/electronics" },
  { label: "Keep Shopping for", href: "/products" },
  { label: "Gift Ideas", href: "/deals" },
  { label: "Bestsellers", href: "/categories/electronics" },
  { label: "Buy Again", href: "/orders" },
  { label: "Sell", href: "/sell" },
];

// Catalog departments for the slide-out drawer
const DEPARTMENTS = [
  { name: "Grocery & Gourmet Foods", icon: "🍎", href: "/categories/grocery" },
  { name: "Electronics & Tech", icon: "📱", href: "/categories/electronics" },
  { name: "Mobiles & Accessories", icon: "📞", href: "/categories/electronics" },
  { name: "Home & Kitchen", icon: "🛋️", href: "/categories/home" },
  { name: "Fashion & Apparel", icon: "👗", href: "/categories/fashion" },
  { name: "Baby & Nursery", icon: "🍼", href: "/categories/baby" },
  { name: "Toys & Games", icon: "🎮", href: "/categories/toys" },
  { name: "Beauty & Grooming", icon: "✨", href: "/categories/beauty" },
  { name: "Sports & Outdoors", icon: "⚽", href: "/categories/sports" },
  { name: "Patio & Garden", icon: "🌱", href: "/categories/patio-garden" },
  { name: "Automotive & Tools", icon: "🚗", href: "/categories/auto" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Flyout and drawer menus
  const [isDepartmentsOpen, setIsDepartmentsOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Delivery Location modal
  const [isFulfillmentOpen, setIsFulfillmentOpen] = useState(false);
  const [zipCodeInput, setZipCodeInput] = useState<string | null>(null);
  const [locationPreview, setLocationPreview] = useState<DeliveryLocation | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [locationMessageType, setLocationMessageType] = useState<"error" | "success" | "info">("info");
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
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

  // Close popups on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Escape key for location modal
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

  // Execute Search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      if (selectedCategory && selectedCategory !== "all") {
        router.push(`/search?q=${encodeURIComponent(q)}&category=${encodeURIComponent(selectedCategory)}`);
      } else {
        router.push(`/search?q=${encodeURIComponent(q)}`);
      }
    } else {
      if (selectedCategory === "deals") {
        router.push("/deals");
      } else if (selectedCategory && selectedCategory !== "all") {
        router.push(`/categories/${selectedCategory}`);
      } else {
        router.push("/products");
      }
    }
  };

  // PIN code verification
  async function checkDeliveryPinCode() {
    if (!/^[1-9]\d{5}$/.test(zipCode)) {
      setLocationMessage("Enter a valid 6-digit Indian PIN code.");
      setLocationMessageType("error");
      return;
    }

    setIsCheckingLocation(true);
    setLocationMessage("Verifying PIN coverage...");
    setLocationMessageType("info");
    try {
      const result = await checkDeliveryServiceability(zipCode);
      const serviceability = result.serviceability;
      const baseLocation =
        locationPreview?.pinCode === zipCode
          ? locationPreview
          : savedLocation?.pinCode === zipCode
            ? savedLocation
            : {
                addressLine1: "",
                addressLine2: "",
                landmark: result.area || "",
                city: result.city || "",
                state: result.state || "",
                pinCode: zipCode,
                displayName: [result.area, result.city, result.state].filter(Boolean).join(", "),
                serviceability,
              };

      const updatedLocation = {
        ...baseLocation,
        pinCode: zipCode,
        serviceability,
        city: baseLocation.city || result.city || "",
        state: baseLocation.state || result.state || "",
        landmark: baseLocation.landmark || result.area || "",
      };

      setLocationPreview(updatedLocation);
      if (serviceability === "unavailable") {
        setLocationMessage(`Delivery is currently limited for PIN ${zipCode}. You may still save it as your address.`);
        setLocationMessageType("error");
      } else {
        const placeName = [updatedLocation.city, updatedLocation.state].filter(Boolean).join(", ");
        setLocationMessage(
          `Delivery confirmed for ${placeName ? placeName + " (" + zipCode + ")" : "PIN " + zipCode}. Click "Use this location" below.`
        );
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

  // Device Geolocation
  function detectMyLocation() {
    if (!window.isSecureContext) {
      setLocationMessage("Location detection requires HTTPS or localhost. Enter PIN code manually.");
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
            error instanceof Error ? error.message : "Could not resolve address from coordinates. Enter PIN code manually."
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
              ? "Your device could not acquire position. Please enter your PIN code manually."
              : "Location detection timed out. Please enter your PIN code manually.";
        setLocationMessage(message);
        setLocationMessageType("info");
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
        error instanceof Error ? error.message : "Could not save location to browser storage."
      );
      setLocationMessageType("error");
    }
  }

  // Display user name or default
  const deliverToName = user?.fullName ? user.fullName.split(" ")[0] : "Rishabh";
  const displayLocation = savedLocation
    ? `${savedLocation.city || "Gorakhpur"} ${savedLocation.pinCode || "273015"}`
    : "Gorakhpur 273015";

  const currentCategoryLabel =
    SEARCH_CATEGORIES.find((c) => c.id === selectedCategory)?.label || "All";

  return (
    <header className="sticky top-0 z-40 w-full select-none shadow-sm">
      {/* ======================================================== */}
      {/* 1. Main Navigation Bar (Clean White & Light Grey Style)  */}
      {/* ======================================================== */}
      <div className="bg-white border-b border-gray-200 text-gray-800 px-2 sm:px-4 py-1.5 flex items-center justify-between gap-1 sm:gap-3 text-xs shadow-2xs">
        {/* Left 1: Authentic iBNK Full Color Logo */}
        <Link
          href="/"
          className="shrink-0 flex items-center px-2 py-1 border border-transparent hover:border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
          title="iBNK Home"
        >
          <IbnkLogo variant="color" className="h-7 sm:h-8 w-auto" width={110} height={40} priority />
        </Link>

        {/* Left 2: Deliver to [Name / Location PIN] */}
        <button
          ref={locationTriggerRef}
          type="button"
          onClick={() => {
            setLocationPreview(savedLocation);
            setZipCodeInput(savedLocation?.pinCode ?? null);
            setLocationMessage("");
            setIsFulfillmentOpen(true);
          }}
          className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 border border-transparent hover:border-gray-300 rounded-sm hover:bg-gray-50 text-left transition-colors cursor-pointer shrink-0"
          title="Change delivery location"
        >
          <MapPin className="w-4 h-4 text-[#FF7900] shrink-0 mt-2" />
          <div className="leading-tight">
            <span className="text-gray-500 text-[11px] block">Deliver to {deliverToName}</span>
            <span className="text-gray-900 text-xs font-black block truncate max-w-[130px]">
              {displayLocation}
            </span>
          </div>
        </button>

        {/* Center: Search Bar with Grey Border & Orange Submit Button */}
        <div className="flex-1 max-w-3xl mx-1 sm:mx-3 relative">
          <form
            onSubmit={handleSearchSubmit}
            className="flex h-10 w-full rounded-md overflow-hidden bg-white border border-gray-300 shadow-2xs focus-within:ring-2 focus-within:ring-[#febd69] focus-within:border-[#febd69]"
          >
            {/* Category Dropdown Pill */}
            <div className="relative shrink-0" ref={categoryDropdownRef}>
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="h-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-2.5 sm:px-3 flex items-center gap-1 border-r border-gray-300 transition-colors cursor-pointer"
              >
                <span className="max-w-[70px] sm:max-w-[100px] truncate">{currentCategoryLabel === "All Categories" ? "All" : currentCategoryLabel}</span>
                <ChevronDown className="w-3 h-3 text-gray-600" />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-300 rounded shadow-xl py-1 z-50 text-xs text-gray-800 animate-in fade-in zoom-in-95 duration-100 max-h-72 overflow-y-auto">
                  {SEARCH_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex items-center justify-between ${
                        selectedCategory === cat.id ? "bg-blue-50 font-bold text-blue-700" : ""
                      }`}
                    >
                      <span>{cat.label}</span>
                      {selectedCategory === cat.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Main Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Amazon.in"
              className="w-full px-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none h-full bg-white min-w-0"
            />

            {/* Search Submit Button */}
            <button
              type="submit"
              className="bg-[#febd69] hover:bg-[#f3a847] text-gray-950 px-4 sm:px-5 h-full flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-900 stroke-[2.5]" />
            </button>
          </form>
        </div>

        {/* Right Section Controls */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          {/* Language Selector: 🇮🇳 EN ▾ */}
          <div className="relative hidden md:block" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1 px-2 py-2 border border-transparent hover:border-gray-300 rounded-sm hover:bg-gray-50 transition-colors cursor-pointer text-gray-800 font-bold"
            >
              <span className="text-base leading-none">🇮🇳</span>
              <span className="text-xs">EN</span>
              <ChevronDown className="w-2.5 h-2.5 text-gray-500 -ml-0.5" />
            </button>
          </div>

          {/* Account & Lists */}
          <div className="relative" ref={accountMenuRef}>
            <button
              type="button"
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="px-2 py-1.5 border border-transparent hover:border-gray-300 rounded-sm hover:bg-gray-50 text-left transition-colors cursor-pointer flex flex-col justify-center leading-tight"
            >
              <span className="text-gray-500 text-[11px] block">
                Hello, {isAuthenticated && user ? user.fullName.split(" ")[0] : "sign in"}
              </span>
              <span className="text-gray-900 text-xs font-bold flex items-center gap-0.5">
                Account &amp; Lists
                <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
              </span>
            </button>

            {/* Account Flyout Dropdown */}
            {isAccountMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded shadow-2xl p-3 z-50 text-xs text-gray-800 animate-in fade-in zoom-in-95 duration-150">
                {!isAuthenticated ? (
                  <div className="text-center pb-3 border-b border-gray-200 space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="block w-full py-2 rounded bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] hover:from-[#f5d78e] hover:to-[#eeb933] border border-[#a88734] text-[#111] font-bold shadow-xs transition-all"
                    >
                      Sign In
                    </Link>
                    <p className="text-[11px] text-gray-600">
                      New customer?{" "}
                      <Link
                        href="/register"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="text-[#007185] hover:text-[#C7511F] hover:underline"
                      >
                        Start here.
                      </Link>
                    </p>
                  </div>
                ) : (
                  <div className="pb-3 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{user?.fullName}</p>
                      <p className="text-[10px] text-gray-500 truncate max-w-[150px]">{user?.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        setIsAccountMenuOpen(false);
                        await logout();
                        router.push("/login");
                      }}
                      className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:underline"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}

                <div className="pt-2 space-y-1.5 text-gray-700">
                  <div className="font-bold text-gray-900 text-[11px] uppercase tracking-wider mb-1">
                    Your Account
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="block py-1 hover:text-[#C7511F] hover:underline"
                  >
                    Your Account
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="block py-1 hover:text-[#C7511F] hover:underline"
                  >
                    Your Orders
                  </Link>
                  <Link
                    href="/deals"
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="block py-1 hover:text-[#C7511F] hover:underline"
                  >
                    Your Wish List &amp; Deals
                  </Link>
                  <Link
                    href="/help"
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="block py-1 hover:text-[#C7511F] hover:underline"
                  >
                    Customer Service
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Returns & Orders */}
          <Link
            href="/orders"
            className="hidden sm:flex flex-col justify-center px-2 py-1.5 border border-transparent hover:border-gray-300 rounded-sm hover:bg-gray-50 leading-tight transition-colors"
          >
            <span className="text-gray-500 text-[11px] block">Returns</span>
            <span className="text-gray-900 text-xs font-bold block">&amp; Orders</span>
          </Link>

          {/* Cart Icon with Orange Badge */}
          <Link
            href="/cart"
            className="flex items-end px-2.5 py-1.5 border border-transparent hover:border-gray-300 rounded-sm hover:bg-gray-50 transition-colors relative cursor-pointer group"
            aria-label={`Cart with ${itemCount} items`}
          >
            <div className="relative">
              {/* Badge counter */}
              <span className="absolute -top-2 left-3 font-black text-xs text-[#f08804] min-w-4 text-center">
                {itemCount}
              </span>
              <ShoppingCart className="w-7 h-7 text-gray-900" />
            </div>
            <span className="text-gray-900 text-sm font-bold hidden sm:inline leading-none mb-0.5 ml-1">
              Cart
            </span>
          </Link>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. Sub Navigation Bar (Light Grey #F3F4F6 Style)          */}
      {/* ======================================================== */}
      <div className="bg-[#F3F4F6] border-b border-gray-200 text-gray-700 px-2 sm:px-4 flex items-center h-[39px] text-[13px] font-medium overflow-x-auto no-scrollbar gap-0.5">
        {/* All Departments Toggle Button */}
        <button
          type="button"
          onClick={() => setIsDepartmentsOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 border border-transparent hover:border-gray-300 hover:bg-white rounded-sm whitespace-nowrap cursor-pointer shrink-0 font-bold text-gray-900 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-800" />
          <span>All</span>
        </button>

        {/* Subnav links */}
        {SUB_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`px-2.5 py-1 border border-transparent hover:border-gray-300 hover:bg-white rounded-sm whitespace-nowrap cursor-pointer shrink-0 transition-colors ${
                isActive ? "text-[#1554D1] font-bold bg-white border-gray-200 shadow-2xs" : "text-gray-700 hover:text-gray-950"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 3. Slide-in Departments Drawer                            */}
      {/* ======================================================== */}
      {isDepartmentsOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDepartmentsOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative z-10 w-full max-w-xs sm:max-w-sm bg-white text-gray-900 h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    Hello, {isAuthenticated && user ? user.fullName : "Sign In"}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDepartmentsOpen(false)}
                className="text-gray-300 hover:text-white p-1 rounded"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm divide-y divide-gray-200">
              {/* Trending */}
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider">
                  Trending
                </h4>
                <ul className="space-y-1.5 text-gray-700">
                  <li>
                    <Link
                      href="/deals"
                      onClick={() => setIsDepartmentsOpen(false)}
                      className="flex items-center justify-between py-1 hover:text-[#C7511F]"
                    >
                      <span>Today&apos;s Deals &amp; Offers</span>
                      <Flame className="w-4 h-4 text-amber-500" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories/electronics"
                      onClick={() => setIsDepartmentsOpen(false)}
                      className="block py-1 hover:text-[#C7511F]"
                    >
                      Bestsellers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products"
                      onClick={() => setIsDepartmentsOpen(false)}
                      className="block py-1 hover:text-[#C7511F]"
                    >
                      New Releases
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Shop by Department */}
              <div className="pt-3 space-y-2">
                <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider">
                  Shop by Department
                </h4>
                <ul className="space-y-1 text-gray-700">
                  {DEPARTMENTS.map((dept) => (
                    <li key={dept.name}>
                      <Link
                        href={dept.href}
                        onClick={() => setIsDepartmentsOpen(false)}
                        className="flex items-center justify-between py-1.5 hover:text-[#C7511F] group"
                      >
                        <span className="flex items-center gap-2">
                          <span>{dept.icon}</span>
                          <span>{dept.name}</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#C7511F] transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Programs & Features */}
              <div className="pt-3 space-y-2">
                <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider">
                  Programs &amp; Features
                </h4>
                <ul className="space-y-1.5 text-gray-700">
                  <li>
                    <Link
                      href="/sell"
                      onClick={() => setIsDepartmentsOpen(false)}
                      className="block py-1 hover:text-[#C7511F]"
                    >
                      Sell on iBNK Marketplace
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin"
                      onClick={() => setIsDepartmentsOpen(false)}
                      className="block py-1 hover:text-[#C7511F]"
                    >
                      Operations Portal
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/master-admin"
                      onClick={() => setIsDepartmentsOpen(false)}
                      className="block py-1 hover:text-[#C7511F]"
                    >
                      Master Admin Hub
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Help & Settings */}
              <div className="pt-3 space-y-2">
                <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider">
                  Help &amp; Settings
                </h4>
                <ul className="space-y-1.5 text-gray-700">
                  <li>
                    <Link
                      href="/account"
                      onClick={() => setIsDepartmentsOpen(false)}
                      className="block py-1 hover:text-[#C7511F]"
                    >
                      Your Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/help"
                      onClick={() => setIsDepartmentsOpen(false)}
                      className="block py-1 hover:text-[#C7511F]"
                    >
                      Customer Service
                    </Link>
                  </li>
                  {!isAuthenticated ? (
                    <li>
                      <Link
                        href="/login"
                        onClick={() => setIsDepartmentsOpen(false)}
                        className="block py-1 font-bold text-blue-600 hover:underline"
                      >
                        Sign in
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <button
                        type="button"
                        onClick={async () => {
                          setIsDepartmentsOpen(false);
                          await logout();
                          router.push("/login");
                        }}
                        className="block py-1 font-bold text-rose-600 hover:underline text-left w-full"
                      >
                        Sign out
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. Delivery Location Selection Modal                      */}
      {/* ======================================================== */}
      {isFulfillmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsFulfillmentOpen(false)}
          />

          <div
            ref={locationModalRef}
            tabIndex={-1}
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-200 space-y-5 text-gray-900 outline-none animate-in zoom-in-95 duration-150"
          >
            <button
              type="button"
              onClick={() => setIsFulfillmentOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              aria-label="Close location modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="text-lg font-black text-gray-900">Choose your location</h3>
              <p className="mt-1 text-xs text-gray-500">
                Select a delivery location to see product availability and delivery options.
              </p>
            </div>

            {/* GPS Detection */}
            <button
              type="button"
              onClick={detectMyLocation}
              disabled={isDetectingLocation || isCheckingLocation}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#febd69] hover:bg-[#f3a847] px-4 py-2.5 text-xs font-bold text-[#111] shadow-xs transition-colors disabled:opacity-60"
            >
              {isDetectingLocation ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <LocateFixed className="h-4 w-4" />
              )}
              <span>{isDetectingLocation ? "Detecting location…" : "Detect My Device Location"}</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-3 text-xs text-gray-400 uppercase font-medium">or enter an Indian pincode</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* PIN Code Input */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  id="header-pin-code"
                  type="text"
                  value={zipCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setZipCodeInput(value);
                    setLocationPreview(null);
                    setLocationMessage("");
                  }}
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="e.g. 273015 or 400031"
                  className="min-h-10 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#e77600] focus:ring-2 focus:ring-[#e77600]/20"
                />
                <button
                  type="button"
                  onClick={checkDeliveryPinCode}
                  disabled={isCheckingLocation || isDetectingLocation}
                  className="min-h-10 shrink-0 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 px-4 py-2 text-xs font-bold text-gray-800 transition-colors disabled:opacity-60"
                >
                  {isCheckingLocation ? "Applying…" : "Apply"}
                </button>
              </div>
            </div>

            {/* Preview Box */}
            {locationPreview && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 space-y-1">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Resolved Address
                </h4>
                <p className="text-xs font-medium text-emerald-950 leading-relaxed">
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
                className={`rounded-xl p-3 text-xs font-medium ${
                  locationMessageType === "success"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                    : locationMessageType === "error"
                      ? "bg-rose-50 border border-rose-200 text-rose-800"
                      : "bg-blue-50 border border-blue-200 text-blue-800"
                }`}
              >
                {locationMessage || savedLocationError}
              </div>
            )}

            <button
              type="button"
              onClick={confirmSelectedLocation}
              disabled={!locationPreview}
              className="w-full rounded-xl bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] py-2.5 text-xs font-bold text-[#0F1111] shadow-xs transition-colors disabled:opacity-40 cursor-pointer"
            >
              Done / Use this location
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
