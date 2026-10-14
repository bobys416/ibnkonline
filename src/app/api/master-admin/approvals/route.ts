import { NextRequest } from "next/server";
import { requireMasterAdmin } from "@/lib/portal-auth";
import marketplaceStore from "@/lib/marketplace-store";
import { apiSuccess, apiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const auth = await requireMasterAdmin(request);
  if (!auth.authorized) return auth.response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as any;
  const type = searchParams.get("type") as any;

  const requests = marketplaceStore.getApprovalRequests({ status, type });
  return apiSuccess({ requests, total: requests.length });
}

export async function POST(request: NextRequest) {
  const auth = await requireMasterAdmin(request);
  if (!auth.authorized) return auth.response;

  const body = await request.json().catch(() => null);
  if (!body?.requestId || !body?.decision) {
    return apiError("requestId and decision ('APPROVE' | 'REJECT' | 'REQUEST_CHANGES') are required.", 400);
  }

  const { requestId, decision, reason } = body;

  if (decision === "REJECT" && !reason) {
    return apiError("A decision reason is mandatory when rejecting requests.", 400);
  }

  try {
    const updated = marketplaceStore.decideApprovalRequest(
      requestId,
      decision,
      { id: auth.user.id, name: auth.user.fullName, role: auth.user.roles[0] },
      reason
    );

    return apiSuccess({
      message: `Approval request ${updated.requestNumber} was successfully ${decision.toLowerCase()}d.`,
      approvalRequest: updated,
    });
  } catch (err: any) {
    return apiError(err.message || "Failed to process approval request.", 400);
  }
}

