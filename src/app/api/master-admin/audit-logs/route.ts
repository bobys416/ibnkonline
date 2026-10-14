import { NextRequest } from "next/server";
import { requireMasterAdmin } from "@/lib/portal-auth";
import marketplaceStore from "@/lib/marketplace-store";
import { apiSuccess } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const auth = await requireMasterAdmin(request);
  if (!auth.authorized) return auth.response;

  const { searchParams } = new URL(request.url);
  const moduleParam = searchParams.get("module") || undefined;
  const query = searchParams.get("query") || undefined;

  const logs = marketplaceStore.getAuditLogs({ module: moduleParam, query });
  return apiSuccess({ logs, total: logs.length });
}

