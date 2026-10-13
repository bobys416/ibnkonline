"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { LocateFixed, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/money";
import {
  createOrderNumber,
  getOrder,
  readPendingPaymentOrder,
  removePendingPaymentOrder,
  saveOrder,
  savePendingPaymentOrder,
  type CheckoutAddress,
  type PaymentMethodChoice,
  type StoredOrder,
} from "@/lib/orders";
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

function getStripeCheckoutUrl(value?: string) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "checkout.stripe.com"
      ? url.toString()
      : "";
  } catch {
    return "";
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotalPaise,
    shippingPaise,
    taxPaise,
    totalPaise,
    clear,
    isReady: cartIsReady,
  } = useCart();
  const [method, setMethod] = useState<PaymentMethodChoice>("ONLINE");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [paymentReturnSessionId] = useState<string | null>(() =>
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("session_id")
  );
  const [paymentWasCancelled] = useState(
    () =>
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("payment") === "cancelled"
  );
  const [paymentVerificationAttempt, setPaymentVerificationAttempt] = useState(0);
  const [paymentReturnState, setPaymentReturnState] = useState<"idle" | "verifying" | "failed">("idle");
  const [paymentRecoveryUrl, setPaymentRecoveryUrl] = useState("");
  const verificationInFlight = useRef(false);
  const [locationFeedback, setLocationFeedback] = useState<LocationFeedback | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isCheckingPin, setIsCheckingPin] = useState(false);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("payment") === "cancelled") {
      try {
        removePendingPaymentOrder();
      } catch {
        queueMicrotask(() => {
          setError("Payment was cancelled. Your cart is unchanged, but the pending checkout could not be cleared.");
        });
      }
      router.replace("/checkout");
    }
  }, [router]);

  useEffect(() => {
    if (!paymentReturnSessionId || !cartIsReady || verificationInFlight.current) return;
    verificationInFlight.current = true;
    setBusy(true);
    setPaymentReturnState("verifying");
    setError("");

    async function verifyPayment() {
      let recoveryUrl = "";
      try {
        const pendingOrder = readPendingPaymentOrder();
        if (!pendingOrder || pendingOrder.gatewayOrderId !== paymentReturnSessionId) {
          throw new Error("We could not find this pending checkout in this browser. Contact support before paying again.");
        }
        recoveryUrl = getStripeCheckoutUrl(pendingOrder.gatewayCheckoutUrl);

        const existingOrder = getOrder(pendingOrder.orderNumber);
        if (existingOrder?.paymentStatus === "SUCCESS") {
          removePendingPaymentOrder();
          clear();
          router.replace(`/orders/${existingOrder.orderNumber}`);
          return;
        }

        const response = await fetch(
          `/api/v1/payments/verify?session_id=${encodeURIComponent(paymentReturnSessionId)}`,
          { cache: "no-store" }
        );
        const result = (await response.json()) as {
          success?: boolean;
          error?: string;
          data?: {
            verified?: boolean;
            orderNumber?: string | null;
            amountPaise?: number | null;
            gatewayPaymentId?: string | null;
          };
        };

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Unable to verify the Stripe payment.");
        }
        if (
          result.data?.verified !== true ||
          result.data.orderNumber !== pendingOrder.orderNumber ||
          result.data.amountPaise !== pendingOrder.totalPaise ||
          !result.data.gatewayPaymentId
        ) {
          throw new Error("Stripe has not confirmed this payment yet. Retry verification before placing another order.");
        }

        const confirmedOrder: StoredOrder = {
          ...pendingOrder,
          status: "PLACED",
          paymentStatus: "SUCCESS",
          gatewayCheckoutUrl: undefined,
          gatewayPaymentId: result.data.gatewayPaymentId,
        };
        saveOrder(confirmedOrder);
        removePendingPaymentOrder();
        clear();
        router.replace(`/orders/${confirmedOrder.orderNumber}`);
      } catch (verificationError) {
        setPaymentRecoveryUrl(recoveryUrl);
        setPaymentReturnState("failed");
        setError(
          verificationError instanceof Error
            ? verificationError.message
            : "Unable to verify the Stripe payment. Retry before placing another order."
        );
      } finally {
        verificationInFlight.current = false;
        setBusy(false);
      }
    }

    void verifyPayment();
  }, [paymentReturnSessionId, cartIsReady, paymentVerificationAttempt, clear, router]);

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
    : savedLocation && savedLocation.serviceability !== "unavailable"
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
    if (location.serviceability === "unavailable") {
      return {
        kind: "error",
        message: `Delivery is not available to PIN code ${location.pinCode}. Try another address or PIN code.`,
      };
    }
    if (location.serviceability === "unknown") {
      return {
        kind: "info",
        message: location.pinCode
          ? `Address found for PIN code ${location.pinCode}. Delivery availability has not been confirmed.`
          : "Address details found. Add a valid PIN code to check delivery availability.",
      };
    }
    return {
      kind: "success",
      message: `Delivery is available to ${location.pinCode}. Review the address fields before saving.`,
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
    if (!window.isSecureContext) {
      setLocationFeedback({
        kind: "error",
        message: "Device location requires a secure connection. Use http://localhost:3000 on this device or open the site over HTTPS. You can enter your address and PIN code manually.",
      });
      return;
    }
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
    if (verifiedLocation.serviceability === "unavailable") {
      setLocationFeedback(describeServiceability(verifiedLocation));
      return;
    }
    if (
      !address.fullName.trim() ||
      !/^[6-9]\d{9}$/.test(address.phone) ||
      !address.addressLine1.trim() ||
      !address.city.trim() ||
      !address.state.trim()
    ) {
      setLocationFeedback({
        kind: "error",
        message: "Enter your name, valid 10-digit mobile number, house/building, city, and state.",
      });
      return;
    }

    const confirmedAddress: DeliveryLocation = {
      ...verifiedLocation,
      addressLine1: address.addressLine1.trim(),
      addressLine2: address.addressLine2?.trim() ?? "",
      landmark: address.landmark?.trim() ?? "",
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

  function buildOrder(opts: {
    paymentMethod: PaymentMethodChoice;
    paymentStatus: "PENDING" | "SUCCESS";
    paymentMethodDetail?: string;
    gatewayOrderId?: string;
    gatewayPaymentId?: string;
    gatewayCheckoutUrl?: string;
    orderNumber?: string;
  }) {
    const orderNumber = opts.orderNumber ?? createOrderNumber();
    return {
      orderNumber,
      createdAt: new Date().toISOString(),
      status: "PLACED" as const,
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
      gatewayCheckoutUrl: opts.gatewayCheckoutUrl,
      gatewayPaymentId: opts.gatewayPaymentId,
    } satisfies StoredOrder;
  }

  function persistOrder(opts: {
    paymentMethod: PaymentMethodChoice;
    paymentStatus: "PENDING" | "SUCCESS";
    paymentMethodDetail?: string;
    gatewayOrderId?: string;
    gatewayPaymentId?: string;
  }) {
    const order = buildOrder(opts);
    saveOrder(order);
    clear();
    router.push(`/orders/${order.orderNumber}`);
  }

  async function placeOrder() {
    setError("");
    if (
      !address.fullName.trim() ||
      !/^[6-9]\d{9}$/.test(address.phone) ||
      !/^[1-9]\d{5}$/.test(address.pinCode) ||
      !address.addressLine1.trim() ||
      !address.city.trim() ||
      !address.state.trim()
    ) {
      setError("Complete the required delivery address fields with a valid mobile number and PIN code.");
      return;
    }
    if (verifiedLocation?.serviceability === "unavailable") {
      setError("Delivery is not available to this PIN code. Please use an address with confirmed delivery coverage.");
      return;
    }
    if (!verifiedLocation || verifiedLocation.pinCode !== address.pinCode) {
      setError("Check the PIN code before placing your order.");
      return;
    }
    if (verifiedLocation?.serviceability === "unknown") {
      setError("Delivery availability has not been confirmed for this PIN code. Your address is saved, but an order cannot be placed until delivery coverage is configured and verified.");
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
          items: items.map(({ productId, variantId, quantity }) => ({
            productId,
            variantId,
            quantity,
          })),
        }),
      });
      const json = (await res.json()) as {
        success?: boolean;
        error?: string;
        data?: {
          sessionId?: string;
          url?: string;
          orderNumber?: string;
          amountPaise?: number;
        };
      };
      if (!res.ok || !json.success) {
        setError(json.error || "Could not start payment");
        return;
      }
      if (
        !json.data?.sessionId ||
        !json.data.url ||
        !json.data.orderNumber ||
        json.data.amountPaise !== totalPaise
      ) {
        setError("Stripe returned incomplete checkout details. Please try again.");
        return;
      }

      const orderNumber = json.data.orderNumber;
      savePendingPaymentOrder(
        buildOrder({
          paymentMethod: "ONLINE",
          paymentStatus: "PENDING",
          paymentMethodDetail: "Stripe Checkout",
          gatewayOrderId: json.data.sessionId,
          gatewayCheckoutUrl: json.data.url,
          orderNumber,
        })
      );
      window.location.assign(json.data.url);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Payment service unavailable. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  if (items.length === 0 && cartIsReady && !paymentReturnSessionId) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-3">
        <h1 className="text-3xl font-black">Nothing to checkout</h1>
        <Link href="/products" className="font-bold text-[#1554D1]">Add products first</Link>
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
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#1554D1] px-4 py-3 text-sm font-bold text-[#1554D1] transition-colors hover:bg-[#eaf0ff] disabled:cursor-wait disabled:opacity-60"
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
            <div className="flex gap-2 sm:col-span-2">
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
                className="shrink-0 rounded-xl bg-[#1554D1] px-4 py-2 text-sm font-bold text-white hover:bg-[#1044ad] disabled:cursor-wait disabled:opacity-60"
              >
                {isCheckingPin ? "Checking…" : "Check PIN"}
              </button>
            </div>
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
                      ? "bg-[#eaf0ff] text-[#172033]"
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
            disabled={!verifiedLocation || verifiedLocation.serviceability === "unavailable"}
            className="w-full rounded-xl bg-[#172033] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#28344b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {savedAddressFingerprint === addressFingerprint(address)
              ? "Delivery address saved"
              : "Save confirmed delivery address"}
          </button>
          {(!verifiedLocation || verifiedLocation.serviceability === "unavailable") && (
            <p className="text-xs text-slate-500">
              Check the PIN code before saving. A valid address can be saved even when delivery coverage is not configured.
            </p>
          )}
        </section>
        <div className="bg-white rounded-3xl border p-6 space-y-3">
          <h2 className="font-black">Payment</h2>
          <label className={`flex items-start gap-3 rounded-2xl border p-4 transition-all ${method === "ONLINE" ? "border-[#1554D1] bg-blue-50/60 ring-1 ring-[#1554D1]" : "border-slate-200"}`}>
            <input
              type="radio"
              checked={method === "ONLINE"}
              onChange={() => setMethod("ONLINE")}
              disabled={busy || Boolean(paymentReturnSessionId)}
              className="accent-[#1554D1] mt-0.5"
            />
            <div>
              <p className="font-bold text-sm text-[#172033]">Secure online payment with Stripe</p>
              <p className="text-xs text-slate-500">Credit / Debit cards & digital instruments. Redirects to Stripe Checkout.</p>
            </div>
          </label>
          <label className={`flex items-start gap-3 rounded-2xl border p-4 transition-all ${method === "COD" ? "border-[#1554D1] bg-blue-50/60 ring-1 ring-[#1554D1]" : "border-slate-200"}`}>
            <input
              type="radio"
              checked={method === "COD"}
              onChange={() => setMethod("COD")}
              disabled={busy || Boolean(paymentReturnSessionId)}
              className="accent-[#1554D1] mt-0.5"
            />
            <div>
              <p className="font-bold text-sm text-[#172033]">Cash on Delivery (COD)</p>
              <p className="text-xs text-slate-500">Pay the courier executive in cash or via doorstep UPI</p>
            </div>
          </label>
        </div>
        {paymentReturnState === "verifying" && (
          <p role="status" className="text-sm font-semibold text-slate-600">
            Verifying your Stripe payment…
          </p>
        )}
        {cartIsReady && paymentWasCancelled && !paymentReturnSessionId && (
          <p role="status" className="text-sm font-semibold text-amber-700">
            Payment was cancelled. Your cart is unchanged; you can try again.
          </p>
        )}
        {error && <p role="alert" className="text-sm text-rose-600 font-semibold">{error}</p>}
        {paymentReturnState === "failed" && paymentReturnSessionId && (
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => setPaymentVerificationAttempt((attempt) => attempt + 1)}
              disabled={busy}
              className="text-sm font-bold text-[#1554D1] underline disabled:opacity-50"
            >
              Retry payment confirmation
            </button>
            {paymentRecoveryUrl && (
              <button
                type="button"
                onClick={() => window.location.assign(paymentRecoveryUrl)}
                className="text-sm font-bold text-[#1554D1] underline"
              >
                Return to Stripe Checkout
              </button>
            )}
          </div>
        )}
        <button
          onClick={placeOrder}
          disabled={busy || !cartIsReady || items.length === 0 || Boolean(paymentReturnSessionId)}
          className="w-full py-3.5 rounded-full bg-[#FF7900] hover:bg-[#E06A00] text-white font-black text-sm tracking-wide shadow-sm transition-all disabled:opacity-60 active:scale-98"
        >
          {busy
            ? "Please wait…"
            : method === "COD"
              ? "Place COD Order"
              : "Continue to Secure Checkout"}
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
    </div>
  );
}
