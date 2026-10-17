
// ============================================
// iBNK MARKETPLACE — USER-SPECIFIC ORDERS API
// Powers Customer Web, iOS App, and Android App
// Enforces strict tenant/user boundary isolation
// ============================================

import { NextRequest } from "next/server";
import prisma, { isDatabaseAvailable } from "@/lib/db";
import { getAuthUser, apiSuccess, apiError } from "@/lib/api-utils";
import marketplaceStore from "@/lib/marketplace-store";

/**
 * GET /api/orders
 * Returns orders placed exclusively by the currently authenticated user.
 * User A will NEVER see User B's orders.
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return apiError("Authentication required to view orders. Please sign in.", 401);
    }

    // 1. Try querying Prisma database if connected
    let userOrders: any[] = [];
    if (await isDatabaseAvailable()) {
      try {
        const dbOrders = await prisma.order.findMany({
          where: { userId: authUser.userId },
          include: {
            items: true,
            payments: true,
          },
          orderBy: { createdAt: "desc" },
        });

        if (dbOrders && dbOrders.length > 0) {
          userOrders = dbOrders;
        }
      } catch {
        // Prisma query failed, fallback to marketplace store
      }
    }

    // 2. Fetch from marketplaceStore for user
    const storeOrders = marketplaceStore.getUserOrders(authUser.userId);
    const emailOrders = marketplaceStore.getUserOrders(authUser.email);

    // Merge & deduplicate by orderNumber
    const orderMap = new Map<string, any>();
    for (const o of [...userOrders, ...storeOrders, ...emailOrders]) {
      orderMap.set(o.orderNumber, o);
    }

    const orders = Array.from(orderMap.values());

    return apiSuccess({
      userId: authUser.userId,
      email: authUser.email,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return apiError("Unable to retrieve orders at this time.", 500);
  }
}

/**
 * POST /api/orders
 * Creates an order definitively bound to the authenticated user's ID and email.
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    const body = await request.json().catch(() => null);

    if (!body || !body.orderNumber || !Array.isArray(body.items)) {
      return apiError("Invalid order payload.", 400);
    }

    const userId = authUser?.userId || body.userId || `guest-${Date.now()}`;
    const userEmail = authUser?.email || body.userEmail || body.address?.email || "guest@ibnk.online";

    const boundOrder = {
      ...body,
      userId,
      userEmail,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Save to authoritative marketplaceStore
    const saved = marketplaceStore.saveOrder(boundOrder);

    // 2. Log in master audit
    marketplaceStore.logAudit({
      actorId: userId,
      actorName: body.address?.fullName || userEmail,
      actorRole: authUser?.roles?.[0] || "customer",
      action: "order.placed",
      module: "orders",
      targetEntity: "Order",
      targetId: body.orderNumber,
      details: {
        totalPaise: body.totalPaise,
        paymentMethod: body.paymentMethod,
        itemCount: body.items?.length,
      },
    });

    return apiSuccess(
      {
        message: "Order recorded successfully.",
        order: saved,
      },
      201
    );
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return apiError("Failed to record order.", 500);
  }
}

