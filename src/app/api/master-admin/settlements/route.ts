import { NextRequest } from "next/server";
import { requireMasterAdmin } from "@/lib/portal-auth";
import marketplaceStore from "@/lib/marketplace-store";
import { apiSuccess, apiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const auth = await requireMasterAdmin(request);
  if (!auth.authorized) return auth.response;

  const settlements = marketplaceStore.getSettlements();
  return apiSuccess({ settlements, total: settlements.length });
}

export async function POST(request: NextRequest) {
  const auth = await requireMasterAdmin(request);
  if (!auth.authorized) return auth.response;

  const body = await request.json().catch(() => null);
  if (!body?.settlementId || !body?.action) {
    return apiError("settlementId and action ('PROCESS' | 'HOLD' | 'FAIL') are required.", 400);
  }

  const { settlementId, action, bankRefNumber, notes } = body;
  const settlement = marketplaceStore.getSettlements().find((s) => s.id === settlementId);
  if (!settlement) return apiError("Settlement record not found.", 404);

  const actor = { id: auth.user.id, name: auth.user.fullName, role: auth.user.roles[0] };
  const now = new Date().toISOString();

  if (action === "PROCESS") {
    settlement.status = "COMPLETED";
    settlement.bankRefNumber = bankRefNumber || `NEFT-${Date.now()}`;
    settlement.processedBy = actor.name;
    settlement.processedAt = now;
    settlement.notes = notes || settlement.notes;
  } else if (action === "HOLD") {
    settlement.status = "ON_HOLD";
    settlement.notes = notes || "Placed on hold by Master Admin.";
  } else if (action === "FAIL") {
    settlement.status = "FAILED";
    settlement.notes = notes || "Settlement failed banking payout check.";
  }

  marketplaceStore.logAudit({
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: `settlement.${action.toLowerCase()}`,
    module: "financials",
    targetEntity: "Settlement",
    targetId: settlementId,
    details: { settlementNumber: settlement.settlementNumber, status: settlement.status },
    reason: notes,
  });

  return apiSuccess({ message: `Settlement marked as ${settlement.status}.`, settlement });
}

