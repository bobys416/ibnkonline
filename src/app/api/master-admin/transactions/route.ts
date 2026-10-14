import { NextRequest } from "next/server";
import { requireMasterAdmin } from "@/lib/portal-auth";
import marketplaceStore from "@/lib/marketplace-store";
import { apiSuccess } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const auth = await requireMasterAdmin(request);
  if (!auth.authorized) return auth.response;

  const ledger = marketplaceStore.getFinancialLedger();
  return apiSuccess({ transactions: ledger, total: ledger.length });
}

