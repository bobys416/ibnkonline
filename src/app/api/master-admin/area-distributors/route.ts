import { NextRequest } from "next/server";
import { requireMasterAdmin } from "@/lib/portal-auth";
import marketplaceStore from "@/lib/marketplace-store";
import { apiSuccess, apiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const auth = await requireMasterAdmin(request);
  if (!auth.authorized) return auth.response;

  const areaDistributors = marketplaceStore.getAreaDistributors();
  return apiSuccess({ areaDistributors, total: areaDistributors.length });
}

export async function POST(request: NextRequest) {
  const auth = await requireMasterAdmin(request);
  if (!auth.authorized) return auth.response;

  const body = await request.json().catch(() => null);
  if (!body) return apiError("Invalid request payload", 400);

  const {
    code,
    businessName,
    contactPerson,
    email,
    phone,
    address,
    state,
    district,
    pinCode,
    territoryPinCodes = [],
    distributorId,
    commissionRatePercent = 1.5,
    status = "ACTIVE",
  } = body;

  if (!code || !businessName || !contactPerson || !email || !phone || !address || !state || !pinCode || !distributorId) {
    return apiError("Missing required Area Distributor fields including parent distributorId.", 400);
  }

  try {
    const areaDist = marketplaceStore.createAreaDistributor(
      {
        code,
        businessName,
        contactPerson,
        email,
        phone,
        address,
        state,
        district,
        pinCode,
        territoryPinCodes,
        distributorId,
        commissionRatePercent,
        status,
      },
      { id: auth.user.id, name: auth.user.fullName, role: auth.user.roles[0] }
    );

    return apiSuccess({ message: "Area Distributor created successfully.", areaDistributor: areaDist }, 201);
  } catch (err: any) {
    return apiError(err.message || "Failed to create Area Distributor.", 400);
  }
}

