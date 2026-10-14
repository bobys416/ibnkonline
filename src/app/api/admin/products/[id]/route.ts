import { NextRequest } from "next/server";
import { requireOperations } from "@/lib/portal-auth";
import marketplaceStore from "@/lib/marketplace-store";
import { apiSuccess, apiError } from "@/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireOperations(request);
  if (!auth.authorized) return auth.response;

  const { id } = await params;
  const product = marketplaceStore.getProductById(id);
  if (!product) return apiError("Product not found", 404);

  return apiSuccess({ product });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireOperations(request);
  if (!auth.authorized) return auth.response;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return apiError("Invalid request payload", 400);

  const product = marketplaceStore.getProductById(id);
  if (!product) return apiError("Product not found", 404);

  // If changing SKU, ensure uniqueness
  if (body.sku && body.sku !== product.sku) {
    const existingSku = marketplaceStore.getProductBySku(body.sku);
    if (existingSku && existingSku.id !== id) {
      return apiError(`SKU "${body.sku}" is already assigned to another product.`, 409);
    }
  }

  // Price validation
  if (body.sellingPricePaise !== undefined && body.mrpPaise !== undefined) {
    if (body.sellingPricePaise > body.mrpPaise) {
      return apiError("Selling price cannot exceed MRP.", 400);
    }
  }

  // Operator cannot unilaterally set status to PUBLISHED
  if (body.status === "PUBLISHED" && !auth.user.isMasterAdmin) {
    body.status = "PENDING_REVIEW";
  }

  const updated = marketplaceStore.updateProduct(
    id,
    body,
    { id: auth.user.id, name: auth.user.fullName, role: auth.user.roles[0] },
    body.reason || "Product details updated via Operations Portal"
  );

  return apiSuccess({ product: updated });
}

// Action triggers: submit_for_approval, request_unlist
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireOperations(request);
  if (!auth.authorized) return auth.response;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body?.action) return apiError("Missing action parameter.", 400);

  const actor = { id: auth.user.id, name: auth.user.fullName, role: auth.user.roles[0] };

  if (body.action === "SUBMIT_FOR_APPROVAL") {
    const req = marketplaceStore.submitProductForApproval(id, actor, body.comments);
    return apiSuccess({ message: "Product submitted for Master Admin approval.", approvalRequest: req });
  }

  if (body.action === "REQUEST_UNLIST") {
    if (!body.reason) return apiError("Unlisting reason is required.", 400);
    const req = marketplaceStore.requestProductUnlisting(id, actor, body.reason);
    return apiSuccess({ message: "Unlisting request submitted for Master Admin approval.", approvalRequest: req });
  }

  return apiError(`Unsupported action: ${body.action}`, 400);
}

