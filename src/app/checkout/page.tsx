"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { LocateFixed, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/money";
import { PaymentGateway } from "@/components/checkout/PaymentGateway";
import { createOrderNumber, saveOrder, type CheckoutAddress, type PaymentMethodChoice } from "@/lib/orders";
import {
  checkDeliveryServiceability,
  getDeliveryLocationSnapshot,
  lookupDeliveryLocation,
  parseDeliveryLocation,
  saveDeliveryLocation,
  subscribeToDeliveryLocation,
  type DeliveryLocation,
  type DeliveryLookupParams,
} from "@/lib/delivery-location";

type LocationFeedback = {
  kind: "loading" | "success" | "error" | "info";
  message: string;
};

function addressFingerprint(address: CheckoutAddress) {
  return JSON.stringify([
    address.fullName.trim(),
    address.phone.trim(),
    address.addressLine1.trim(),
    address.addressLine2?.trim() ?? "",
    address.landmark?.trim() ?? "",
    address.city.trim(),
    address.state.trim(),
    address.pinCode.trim(),
  ]);
}

const EMPTY_ADDRESS: CheckoutAddress = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  pinCode: "",
};

function toCheckoutAddress(location: DeliveryLocation): CheckoutAddress {
  return {
    fullName: location.fullName ?? "",
    phone: location.phone ?? "",
    addressLine1: location.addressLine1,
    addressLine2: location.addressLine2,
    landmark: location.landmark,
    city: location.city,
    state: location.state,
    pinCode: location.pinCode,
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalPaise, shippingPaise, taxPaise, totalPaise, clear } = useCart();
  const [method, setMethod] = useState<PaymentMethodChoice>("ONLINE");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [locationFeedback, setLocationFeedback] = useState<LocationFeedback | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isCheckingPin, setIsCheckingPin] = useState(false);
  const [gatewayOrderId, setGatewayOrderId] = useState("");
  const [showPay, setShowPay] = useState(false);
  const locationSnapshot = useSyncExternalStore(
    subscribeToDeliveryLocation,
    getDeliveryLocationSnapshot,
    () => null
  );
  const { savedLocation, savedLocationError } = useMemo(() => {
    try {
      return {
        savedLocation: parseDeliveryLocation(locationSnapshot),
        savedLocationError: "",
      };
    } catch {
      return {
        savedLocation: null,
        savedLocationError: "Your saved delivery address could not be loaded. Please enter it again.",
      };
    }
  }, [locationSnapshot]);
  const [addressDraft, setAddressDraft] = useState<CheckoutAddress | null>(null);
  const address = addressDraft ?? (savedLocation ? toCheckoutAddress(savedLocation) : EMPTY_ADDRESS);
  const [checkedLocation, setCheckedLocation] = useState<DeliveryLocation | null>(null);
  const verifiedLocation = checkedLocation ?? savedLocation;
  const [isAddressDirty, setIsAddressDirty] = useState(false);
  const savedAddressFingerprint = isAddressDirty
    ? null
    : savedLocation?.serviceability === "available"
      ? addressFingerprint(toCheckoutAddress(savedLocation))
      : null;

  function update<K extends keyof CheckoutAddress>(key: K, value: CheckoutAddress[K]) {
    setAddressDraft((prev) => ({ ...(prev ?? address), [key]: value }));
    setIsAddressDirty(true);
    if (key === "pinCode" && value !== verifiedLocation?.pinCode) {
      setCheckedLocation(null);
      setLocationFeedback(null);
    }
  }

  function describeServiceability(location: DeliveryLocation): LocationFeedback {
    if (location.serviceability === "available") {
      return {
        kind: "success",
        message: `Delivery is available to ${location.pinCode}. Review the address fields before saving.`,
      };
    }
    if (location.serviceability === "unavailable") {
      return {
        kind: "error",
        message: `Delivery is not available to PIN code ${location.pinCode}. Try another address or PIN code.`,
      };
    }
    return {
      kind: "info",
      message: "We found this location, but delivery coverage is not configured for verification.",
    };
  }

  async function resolveAddress(params: DeliveryLookupParams) {
    const location = await lookupDeliveryLocation(params);
    setCheckedLocation(location);
    setIsAddressDirty(true);
    setAddressDraft((previous) => {
      const base = previous ?? address;
      return {
      ...base,
      addressLine1: location.addressLine1 || base.addressLine1,
      addressLine2: location.addressLine2 || base.addressLine2,
      landmark: location.landmark || base.landmark,
      city: location.city || base.city,
      state: location.state || base.state,
      pinCode: location.pinCode,
      };
    });
    setLocationFeedback(describeServiceability(location));
  }

  async function checkPinCode() {
    if (!/^[1-9]\d{5}$/.test(address.pinCode)) {
      setCheckedLocation(null);
      setLocationFeedback({
        kind: "error",
        message: "Enter a valid 6-digit Indian PIN code.",
      });
      return;
    }

    setIsCheckingPin(true);
    setLocationFeedback({ kind: "loading", message: "Checking the PIN code…" });
    try {
      const serviceability = await checkDeliveryServiceability(address.pinCode);
      const checkedLocation: DeliveryLocation = {
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 ?? "",
        landmark: address.landmark ?? "",
        city: address.city,
        state: address.state,
        pinCode: address.pinCode,
        displayName: "",
        serviceability,
      };
      setCheckedLocation(checkedLocation);
      setIsAddressDirty(true);
      setLocationFeedback(describeServiceability(checkedLocation));
    } catch (lookupError) {
      setCheckedLocation(null);
      setLocationFeedback({
        kind: "error",
        message:
          lookupError instanceof Error
            ? lookupError.message
            : "PIN-code lookup failed. You can still enter the address manually.",
      });
    } finally {
      setIsCheckingPin(false);
    }
  }

  function detectMyLocation() {
    if (!navigator.geolocation) {
      setLocationFeedback({
        kind: "error",
        message: "This browser does not support device location. Enter your address and PIN code manually.",
      });
      return;
    }

    setIsLocating(true);
    setLocationFeedback({
      kind: "loading",
      message: "Requesting your location…",
    });
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocationFeedback({
          kind: "loading",
          message: "Finding the address for your location…",
        });
        try {
          await resolveAddress({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        } catch (lookupError) {
          setCheckedLocation(null);
          setLocationFeedback({
            kind: "error",
            message:
              lookupError instanceof Error
                ? lookupError.message
                : "Address lookup failed. Enter your address and PIN code manually.",
          });
        } finally {
          setIsLocating(false);
        }
      },
      (geolocationError) => {
        const message =
          geolocationError.code === geolocationError.PERMISSION_DENIED
            ? "Location permission was denied. Allow location access in your browser, or enter your address and PIN code manually."
            : geolocationError.code === geolocationError.POSITION_UNAVAILABLE
              ? "Your device could not determine your location. Enter your address and PIN code manually."
              : "Location detection timed out. Try again or enter your address and PIN code manually.";
        setLocationFeedback({ kind: "error", message });
        setIsLocating(false);
      },
      { enableHighAccuracy: false, maximumAge: 300_000, timeout: 15_000 }
    );
  }

  function saveConfirmedAddress() {
    if (verifiedLocation?.pinCode !== address.pinCode) {
      setLocationFeedback({
        kind: "error",
        message: "Check your PIN code before saving the delivery address.",
      });
      return;
    }
    if (verifiedLocation.serviceability !== "available") {
      setLocationFeedback(describeServiceability(verifiedLocation));
      return;
    }
    if (
      !address.fullName.trim() ||
      !/^[6-9]\d{9}$/.test(address.phone) ||
      !address.addressLine1.trim() ||
      !address.landmark?.trim() ||
      !address.city.trim() ||
      !address.state.trim()
    ) {
      setLocationFeedback({
        kind: "error",
        message: "Enter your name, valid mobile number, house/building, locality, city, and state.",
      });
      return;
    }

    const confirmedAddress: DeliveryLocation = {
      ...verifiedLocation,
      addressLine1: address.addressLine1.trim(),
      addressLine2: address.addressLine2?.trim() ?? "",
      landmark: address.landmark.trim(),
      city: address.city.trim(),
      state: address.state.trim(),
      pinCode: address.pinCode,
      fullName: address.fullName.trim(),
      phone: address.phone.trim(),
    };
    try {
      saveDeliveryLocation(confirmedAddress);
      setCheckedLocation(confirmedAddress);
      setIsAddressDirty(false);
      setLocationFeedback({
        kind: "success",
        message: "Delivery address saved for this checkout session.",
      });
    } catch {
      setLocationFeedback({
        kind: "error",
        message: "Could not save your delivery address in this browser. Check storage settings and try again.",
      });
    }
  }

  function persistOrder(opts: {
    paymentMethod: PaymentMethodChoice;
    paymentStatus: "PENDING" | "SUCCESS";
    paymentMethodDetail?: string;
    gatewayOrderId?: string;
    gatewayPaymentId?: string;
  }) {
    const orderNumber = createOrderNumber();
    saveOrder({
      orderNumber,
      createdAt: new Date().toISOString(),
      status: opts.paymentStatus === "SUCCESS" || opts.paymentMethod === "COD" ? "PLACED" : "PLACED",
      paymentMethod: opts.paymentMethod,
      paymentStatus: opts.paymentMethod === "COD" ? "PENDING" : opts.paymentStatus,
      paymentMethodDetail: opts.paymentMethodDetail,
      address,
      items: items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        productName: i.product.name,
        variantName: i.variant.name,
        slug: i.product.slug,
        imageUrl: i.product.images[0],
        quantity: i.quantity,
        unitPricePaise: i.unitPricePaise,
        mrpPaise: i.mrpPaise,
      })),
      subtotalPaise,
      shippingPaise,
      taxPaise,
      totalPaise,
      gatewayOrderId: opts.gatewayOrderId,
      gatewayPaymentId: opts.gatewayPaymentId,
    });
    clear();
    router.push(`/orders/${orderNumber}`);
  }

  async function placeOrder() {
    setError("");
    if (
      !address.fullName.trim() ||
      !/^[6-9]\d{9}$/.test(address.phone) ||
      !/^[1-9]\d{5}$/.test(address.pinCode) ||
      !address.addressLine1.trim() ||
      !address.landmark?.trim() ||
      !address.city.trim() ||
      !address.state.trim()
    ) {
      setError("Complete the required delivery address fields with a valid mobile number and PIN code.");
      return;
    }
    if (
      verifiedLocation?.serviceability !== "available" ||
      verifiedLocation.pinCode !== address.pinCode
    ) {
      setError("Check delivery eligibility for this PIN code before placing your order.");
      return;
    }
    if (savedAddressFingerprint !== addressFingerprint(address)) {
      setError("Save your confirmed delivery address before placing your order.");
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (method === "COD") {
      persistOrder({ paymentMethod: "COD", paymentStatus: "PENDING", paymentMethodDetail: "cash_on_delivery" });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/v1/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountPaise: totalPaise,
          receipt: createOrderNumber().slice(0, 40),
          notes: { city: address.city, pin: address.pinCode },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Could not start payment");
        return;
      }
      setGatewayOrderId(json.data.gatewayOrderId);
      setShowPay(true);
    } catch {
      setError("Payment service unavailable");
    } finally {
      setBusy(false);
    }
  }

  if (items.length === 0 && !showPay) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-3">
        <h1 className="text-3xl font-black">Nothing to checkout</h1>
        <Link href="/products" className="text-[#0071DC] font-bold">Add products first</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 space-y-4">
        <h1 className="text-3xl font-black">Checkout</h1>
        <section className="space-y-4 rounded-3xl border bg-white p-6">
          <div>
            <h2 className="font-black">Delivery address</h2>
            <p className="mt-1 text-sm text-slate-500">
              Detect your location or enter the address and PIN code yourself.
            </p>
          </div>

          <button
            type="button"
            onClick={detectMyLocation}
            disabled={isLocating || isCheckingPin}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#0071DC] px-4 py-3 text-sm font-bold text-[#0071DC] transition-colors hover:bg-[#E6F1FC] disabled:cursor-wait disabled:opacity-60"
          >
            {isLocating ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <LocateFixed className="h-4 w-4" />
            )}
            {isLocating ? "Detecting your location…" : "Detect My Location"}
          </button>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              className="rounded-xl border px-3 py-2 text-sm"
              value={address.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder="Full name"
              autoComplete="name"
            />
            <input
              className="rounded-xl border px-3 py-2 text-sm"
              value={address.phone}
              onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="Mobile number"
              inputMode="numeric"
              autoComplete="tel"
            />
            <input
              className="rounded-xl border px-3 py-2 text-sm sm:col-span-2"
              value={address.addressLine1}
              onChange={(e) => update("addressLine1", e.target.value)}
              placeholder="House / building"
              autoComplete="address-line1"
            />
            <input
              className="rounded-xl border px-3 py-2 text-sm sm:col-span-2"
              value={address.addressLine2 ?? ""}
              onChange={(e) => update("addressLine2", e.target.value)}
              placeholder="Street"
              autoComplete="address-line2"
            />
            <input
              className="rounded-xl border px-3 py-2 text-sm sm:col-span-2"
              value={address.landmark ?? ""}
              onChange={(e) => update("landmark", e.target.value)}
              placeholder="Area / locality"
              autoComplete="address-level3"
            />
            <input
              className="rounded-xl border px-3 py-2 text-sm"
              value={address.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="City"
              autoComplete="address-level2"
            />
            <input
              className="rounded-xl border px-3 py-2 text-sm"
              value={address.state}
              onChange={(e) => update("state", e.target.value)}
              placeholder="State"
              autoComplete="address-level1"
            />
            <label className="flex gap-2 sm:col-span-2">
              <input
                className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm"
                value={address.pinCode}
                onChange={(e) => update("pinCode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit PIN code"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
              />
              <button
                type="button"
                onClick={checkPinCode}
                disabled={isCheckingPin || isLocating}
                className="shrink-0 rounded-xl bg-[#0071DC] px-4 py-2 text-sm font-bold text-white hover:bg-[#004f9a] disabled:cursor-wait disabled:opacity-60"
              >
                {isCheckingPin ? "Checking…" : "Check PIN"}
              </button>
            </label>
          </div>

          {locationFeedback && (
            <p
              role="status"
              aria-live="polite"
              className={`rounded-xl p-3 text-sm ${
                locationFeedback.kind === "success"
                  ? "bg-emerald-50 text-emerald-800"
                  : locationFeedback.kind === "error"
                    ? "bg-rose-50 text-rose-700"
                    : locationFeedback.kind === "loading"
                      ? "bg-blue-50 text-blue-800"
                      : "bg-amber-50 text-amber-800"
              }`}
            >
              {locationFeedback.message}
              {verifiedLocation?.displayName && (
                <span className="mt-1 block text-xs opacity-80">{verifiedLocation.displayName}</span>
              )}
            </p>
          )}
          {!locationFeedback && savedLocationError && (
            <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
              {savedLocationError}
            </p>
          )}

          <button
            type="button"
            onClick={saveConfirmedAddress}
            disabled={verifiedLocation?.serviceability !== "available"}
            className="w-full rounded-xl bg-[#131921] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#232f3e] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {savedAddressFingerprint === addressFingerprint(address)
              ? "Delivery address saved"
              : "Save confirmed delivery address"}
          </button>
          {verifiedLocation?.serviceability !== "available" && (
            <p className="text-xs text-slate-500">
              Save is enabled only after a successful delivery-coverage check.
            </p>
          )}
        </section>
        <div className="bg-white rounded-3xl border p-6 space-y-3">
          <h2 className="font-black">Payment</h2>
          <label className={`flex items-start gap-3 rounded-2xl border p-4 ${method === "ONLINE" ? "border-[#0071DC] bg-[#E6F1FC]" : ""}`}>
            <input type="radio" checked={method === "ONLINE"} onChange={() => setMethod("ONLINE")} />
            <div>
              <p className="font-bold text-sm">UPI / Cards / Netbanking / Wallets</p>
              <p className="text-xs text-slate-500">Razorpay-ready sandbox. Test UPI success@upi</p>
            </div>
          </label>
          <label className={`flex items-start gap-3 rounded-2xl border p-4 ${method === "COD" ? "border-[#0071DC] bg-[#E6F1FC]" : ""}`}>
            <input type="radio" checked={method === "COD"} onChange={() => setMethod("COD")} />
            <div>
              <p className="font-bold text-sm">Cash on Delivery</p>
              <p className="text-xs text-slate-500">Pay the courier in cash or UPI at the door</p>
            </div>
          </label>
        </div>
        {error && <p className="text-sm text-rose-600 font-semibold">{error}</p>}
        <button onClick={placeOrder} disabled={busy} className="w-full py-3 rounded-full bg-[#0071DC] text-white font-black">
          {method === "COD" ? "Place COD order" : "Pay securely"}
        </button>
      </div>
      <aside className="lg:col-span-5">
        <div className="bg-white rounded-3xl border p-6 space-y-3">
          <h2 className="font-black">Your items</h2>
          {items.map((i) => (
            <div key={`${i.productId}-${i.variantId}`} className="flex justify-between text-sm gap-3">
              <span className="line-clamp-1">{i.product.name} × {i.quantity}</span>
              <span className="font-semibold">{formatINR(i.lineTotalPaise)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm pt-2 border-t"><span>Subtotal</span><span>{formatINR(subtotalPaise)}</span></div>
          <div className="flex justify-between text-sm"><span>Shipping</span><span>{shippingPaise ? formatINR(shippingPaise) : "Free"}</span></div>
          <div className="flex justify-between font-black text-lg"><span>Total</span><span>{formatINR(totalPaise)}</span></div>
        </div>
      </aside>
      {showPay && (
        <PaymentGateway
          amountPaise={totalPaise}
          gatewayOrderId={gatewayOrderId}
          onClose={() => setShowPay(false)}
          onSuccess={(result) =>
            persistOrder({
              paymentMethod: "ONLINE",
              paymentStatus: "SUCCESS",
              paymentMethodDetail: result.method,
              gatewayOrderId,
              gatewayPaymentId: result.gatewayPaymentId,
            })
          }
        />
      )}
    </div>
  );
}
