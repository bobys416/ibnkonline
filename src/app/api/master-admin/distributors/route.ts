import { NextRequest } from "next/server";
import { requireMasterAdmin } from "@/lib/portal-auth";
import marketplaceStore from "@/lib/marketplace-store";
import { apiSuccess, apiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const auth = await requireMasterAdmin(request);
  if (!auth.authorized) return auth.response;

  const distributors = marketplaceStore.getDistributors();
  return apiSuccess({ distributors, total: distributors.length });
}

export async function POST(request: NextRequest) {
  const auth = await requireMasterAdmin(request);
  if (!auth.authorized) return auth.response;

  const body = await request.json().catch(() => null);
  if (!body) return apiError("Invalid request payload", 400);

  const {
    distributorCode,
    businessName,
    contactPerson,
    email,
    phone,
    registeredAddress,
    state,
    district,
    pinCode,
    operationalTerritory,
    territoryPinCodes = [],
    commissionRatePercent = 2.5,
    status = "ACTIVE",
  } = body;

  if (!distributorCode || !businessName || !contactPerson || !email || !phone || !registeredAddress || !state || !pinCode || !operationalTerritory) {
    return apiError("Missing required distributor fields (code, name, contact, email, phone, address, state, pin, territory).", 400);
  }

  try {
    const dist = marketplaceStore.createDistributor(
      {
        distributorCode,
        businessName,
        contactPerson,
        email,
        phone,
        registeredAddress,
        state,
        district,
        pinCode,
        operationalTerritory,
        territoryPinCodes,
        commissionRatePercent,
        status,
      },
      { id: auth.user.id, name: auth.user.fullName, role: auth.user.roles[0] }
    );

    return apiSuccess({ message: "Distributor created successfully.", distributor: dist }, 201);
  } catch (err: any) {
    return apiError(err.message || "Failed to create distributor.", 400);
  }
}

