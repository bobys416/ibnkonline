import { NextRequest, NextResponse } from "next/server";

type GeoapifyAddress = {
  formatted?: string;
  housenumber?: string;
  building?: string;
  street?: string;
  suburb?: string;
  neighbourhood?: string;
  city_district?: string;
  district?: string;
  postcode?: string;
  country_code?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
};

type GeoapifyResponse = {
  results?: unknown;
  features?: unknown;
};

function isGeoapifyAddress(value: unknown): value is GeoapifyAddress {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  const optionalStringFields = [
    "formatted",
    "housenumber",
    "building",
    "street",
    "suburb",
    "neighbourhood",
    "city_district",
    "district",
    "postcode",
    "country_code",
    "city",
    "town",
    "village",
    "county",
    "state",
  ] as const;
  return optionalStringFields.every(
    (field) => !(field in record) || typeof record[field] === "string"
  );
}

function firstAddress(data: unknown): GeoapifyAddress | undefined {
  if (typeof data !== "object" || data === null) return undefined;
  const response = data as GeoapifyResponse;
  if (Array.isArray(response.features)) {
    const properties = response.features[0]?.properties;
    if (isGeoapifyAddress(properties)) return properties;
  }
  if (Array.isArray(response.results) && isGeoapifyAddress(response.results[0])) {
    return response.results[0];
  }
}

function getServiceability(pinCode: string): "available" | "unavailable" | "unknown" {
  const configuredPins = process.env.SERVICEABLE_PIN_CODES?.split(",")
    .map((pin) => pin.trim())
    .filter(Boolean);

  if (!configuredPins?.length) return "unknown";
  if (configuredPins.some((pin) => !/^[1-9]\d{5}$/.test(pin))) {
    throw new Error("SERVICEABLE_PIN_CODES contains an invalid PIN code.");
  }
  return configuredPins.includes(pinCode) ? "available" : "unavailable";
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Location lookup is not configured." },
      { status: 503 }
    );
  }

  const params = request.nextUrl.searchParams;
  const latitude = params.get("lat");
  const longitude = params.get("lon");
  if (latitude === null || longitude === null) {
    return NextResponse.json(
      { error: "Latitude and longitude are required." },
      { status: 400 }
    );
  }

  const lat = Number(latitude);
  const lon = Number(longitude);
  if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180) {
    return NextResponse.json({ error: "Invalid location coordinates." }, { status: 400 });
  }
  const url = new URL("https://api.geoapify.com/v1/geocode/reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("apiKey", apiKey);

  let providerResponse: Response;
  try {
    providerResponse = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the location service. Please try again." },
      { status: 502 }
    );
  }

  if (!providerResponse.ok) {
    return NextResponse.json(
      { error: "The location service could not complete this lookup." },
      { status: 502 }
    );
  }

  let providerData: unknown;
  try {
    providerData = await providerResponse.json();
  } catch {
    return NextResponse.json(
      { error: "The location service returned an invalid response." },
      { status: 502 }
    );
  }

  const result = firstAddress(providerData);
  if (!result) {
    return NextResponse.json(
      { error: "We could not find an address for that location." },
      { status: 404 }
    );
  }

  if (result.country_code && result.country_code.toLowerCase() !== "in") {
    return NextResponse.json(
      { error: "Device location is outside India. Enter an Indian delivery address manually." },
      { status: 422 }
    );
  }

  const resolvedPin = result.postcode ?? "";
  if (!/^[1-9]\d{5}$/.test(resolvedPin)) {
    return NextResponse.json(
      { error: "No Indian 6-digit PIN code was found for that location." },
      { status: 404 }
    );
  }

  let serviceability: "available" | "unavailable" | "unknown";
  try {
    serviceability = getServiceability(resolvedPin);
  } catch {
    return NextResponse.json(
      { error: "Delivery PIN-code coverage is configured incorrectly." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    location: {
      addressLine1: [result.housenumber, result.building]
        .filter(Boolean)
        .join(", "),
      addressLine2: result.street ?? "",
      landmark:
        result.suburb ??
        result.neighbourhood ??
        result.city_district ??
        result.district ??
        "",
      city: result.city ?? result.town ?? result.village ?? result.county ?? "",
      state: result.state ?? "",
      pinCode: resolvedPin,
      displayName: result.formatted ?? "",
      serviceability,
    },
  });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("pinCode" in body) ||
    typeof body.pinCode !== "string" ||
    !/^[1-9]\d{5}$/.test(body.pinCode)
  ) {
    return NextResponse.json(
      { error: "Enter a valid 6-digit Indian PIN code." },
      { status: 400 }
    );
  }

  try {
    return NextResponse.json({
      pinCode: body.pinCode,
      serviceability: getServiceability(body.pinCode),
    });
  } catch {
    return NextResponse.json(
      { error: "Delivery PIN-code coverage is configured incorrectly." },
      { status: 500 }
    );
  }
}
