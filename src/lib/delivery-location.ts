export const DELIVERY_LOCATION_STORAGE_KEY = "buymecart.delivery-location.v1";
const DELIVERY_LOCATION_CHANGE_EVENT = "buymecart:delivery-location-change";

export type DeliveryLocation = {
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  pinCode: string;
  displayName: string;
  serviceability: "available" | "unavailable" | "unknown";
  fullName?: string;
  phone?: string;
};

export type DeliveryLookupParams =
  { latitude: number; longitude: number };

function isServiceability(value: unknown): value is DeliveryLocation["serviceability"] {
  return value === "available" || value === "unavailable" || value === "unknown";
}

function isDeliveryLocation(value: unknown): value is DeliveryLocation {
  return (
    typeof value === "object" &&
    value !== null &&
    "addressLine1" in value &&
    typeof value.addressLine1 === "string" &&
    "addressLine2" in value &&
    typeof value.addressLine2 === "string" &&
    "landmark" in value &&
    typeof value.landmark === "string" &&
    "city" in value &&
    typeof value.city === "string" &&
    "state" in value &&
    typeof value.state === "string" &&
    "pinCode" in value &&
    typeof value.pinCode === "string" &&
    (value.pinCode === "" || /^[1-9]\d{5}$/.test(value.pinCode)) &&
    "displayName" in value &&
    typeof value.displayName === "string" &&
    "serviceability" in value &&
    isServiceability(value.serviceability) &&
    (!("fullName" in value) || typeof value.fullName === "string") &&
    (!("phone" in value) || typeof value.phone === "string")
  );
}

export function subscribeToDeliveryLocation(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(DELIVERY_LOCATION_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(DELIVERY_LOCATION_CHANGE_EVENT, onChange);
  };
}

export function getDeliveryLocationSnapshot() {
  return localStorage.getItem(DELIVERY_LOCATION_STORAGE_KEY);
}

export function parseDeliveryLocation(stored: string | null): DeliveryLocation | null {
  if (!stored) return null;
  const value: unknown = JSON.parse(stored);
  if (!isDeliveryLocation(value)) {
    throw new Error("Saved delivery location is invalid.");
  }
  return value;
}

export function readDeliveryLocation(): DeliveryLocation | null {
  if (typeof window === "undefined") return null;
  return parseDeliveryLocation(getDeliveryLocationSnapshot());
}

export function saveDeliveryLocation(location: DeliveryLocation) {
  localStorage.setItem(DELIVERY_LOCATION_STORAGE_KEY, JSON.stringify(location));
  window.dispatchEvent(new Event(DELIVERY_LOCATION_CHANGE_EVENT));
}

export async function lookupDeliveryLocation(
  params: DeliveryLookupParams
): Promise<DeliveryLocation> {
  const query = new URLSearchParams({
    lat: String(params.latitude),
    lon: String(params.longitude),
  });
  const response = await fetch(`/api/location?${query.toString()}`);
  const payload: unknown = await response.json();

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof payload.error === "string"
        ? payload.error
        : "Location lookup failed. Please try again.";
    throw new Error(message);
  }

  if (typeof payload !== "object" || payload === null || !("location" in payload)) {
    throw new Error("The location service returned an invalid response.");
  }

  if (!isDeliveryLocation(payload.location)) {
    throw new Error("The location service returned incomplete address details.");
  }
  return payload.location;
}

export async function checkDeliveryServiceability(pinCode: string) {
  const response = await fetch("/api/location", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pinCode }),
  });
  const payload: unknown = await response.json();

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof payload.error === "string"
        ? payload.error
        : "Delivery eligibility check failed. Please try again.";
    throw new Error(message);
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("serviceability" in payload) ||
    !isServiceability(payload.serviceability)
  ) {
    throw new Error("The delivery service returned an invalid response.");
  }

  return payload.serviceability;
}
