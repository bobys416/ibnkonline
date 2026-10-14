import { NextRequest } from "next/server";
import { requireMasterAdmin } from "@/lib/portal-auth";
import marketplaceStore from "@/lib/marketplace-store";
import { apiSuccess, apiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const auth = await requireMasterAdmin(request);
  if (!auth.authorized) return auth.response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as any;
  const search = searchParams.get("search") || undefined;

  const merchants = marketplaceStore.getMerchants({ status, search });
  return apiSuccess({ merchants, total: merchants.length });
}

// Approve / Activate merchant application directly
export async function POST(request: NextRequest) {
  const auth = await requireMasterAdmin(request);
  if (!auth.authorized) return auth.response;

  const body = await request.json().catch(() => null);
  if (!body?.applicationId) {
    return apiError("applicationId is required.", 400);
  }

  try {
    const merchant = marketplaceStore.approveMerchantApplication(
      body.applicationId,
      { id: auth.user.id, name: auth.user.fullName, role: auth.user.roles[0] },
      body.commissionRatePercent || 5.0,
      body.distributorId,
      body.areaDistributorId
    );

    return apiSuccess({
      message: "Merchant approved and operational account activated.",
      merchant,
    }, 201);
  } catch (err: any) {
    return apiError(err.message || "Failed to approve merchant.", 400);
  }
}

// Suspend, reactivate, or update commission / distributor assignments
export async function PATCH(request: NextRequest) {
  const auth = await requireMasterAdmin(request);
  if (!auth.authorized) return auth.response;

  const body = await request.json().catch(() => null);
  if (!body?.merchantId) return apiError("merchantId is required.", 400);

  const { merchantId, status, commissionRatePercent, distributorId, areaDistributorId, reason } = body;
  const actor = { id: auth.user.id, name: auth.user.fullName, role: auth.user.roles[0] };

  try {
    const merchant = marketplaceStore.getMerchantById(merchantId);
    if (!merchant) return apiError("Merchant not found.", 404);

    if (status && status !== merchant.status) {
      marketplaceStore.setMerchantStatus(merchantId, status, actor, reason);
    }

    if (commissionRatePercent !== undefined) {
      merchant.commissionRatePercent = Number(commissionRatePercent);
      marketplaceStore.logAudit({
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role,
        action: "merchant.commission_updated",
        module: "merchants",
        targetEntity: "Merchant",
        targetId: merchantId,
        details: { commissionRatePercent },
        reason,
      });
    }

    if (distributorId !== undefined) {
      const dist = distributorId ? marketplaceStore.getDistributors().find((d) => d.id === distributorId) : undefined;
      merchant.distributorId = distributorId || undefined;
      merchant.distributorName = dist?.businessName;
    }

    if (areaDistributorId !== undefined) {
      const ad = areaDistributorId ? marketplaceStore.getAreaDistributors().find((a) => a.id === areaDistributorId) : undefined;
      merchant.areaDistributorId = areaDistributorId || undefined;
      merchant.areaDistributorName = ad?.businessName;
    }

    merchant.updatedAt = new Date().toISOString();

    return apiSuccess({ message: "Merchant updated successfully.", merchant });
  } catch (err: any) {
    return apiError(err.message || "Failed to update merchant.", 400);
  }
}

