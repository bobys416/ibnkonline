// ============================================
// iBNK MARKETPLACE — INDIVIDUAL ORDER API
// GET /api/orders/[orderNumber]
// ============================================

import { NextRequest } from "next/server";
import { getAuthUser, apiSuccess, apiError } from "@/lib/api-utils";
import marketplaceStore from "@/lib/marketplace-store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    const authUser = getAuthUser(request);

    const order = marketplaceStore.getOrder(orderNumber);
    if (!order) {
      return apiError("Order not found.", 404);
    }

    // Enforce ownership: only the user who placed it or an administrator can view
    if (order.userId && authUser) {
      const isOwner =
        order.userId === authUser.userId ||
        order.userEmail?.toLowerCase() === authUser.email.toLowerCase();
      const isAdmin =
        authUser.roles.includes("master_admin") ||
        authUser.roles.includes("super_admin") ||
        authUser.roles.includes("product_operations");

      if (!isOwner && !isAdmin) {
        return apiError("You do not have permission to view this order.", 403);
      }
    }

    return apiSuccess({ order });
  } catch (error) {
    console.error("GET /api/orders/[orderNumber] error:", error);
    return apiError("Failed to fetch order details.", 500);
  }
}

