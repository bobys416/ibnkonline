import { NextRequest } from "next/server";
import { requireOperations } from "@/lib/portal-auth";
import marketplaceStore from "@/lib/marketplace-store";
import { apiSuccess, apiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const auth = await requireOperations(request);
  if (!auth.authorized) return auth.response;

  const products = marketplaceStore.getProducts();
  const inventoryItems = products.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    categoryName: p.categoryName,
    stockQuantity: p.stockQuantity,
    lowStockThreshold: p.lowStockThreshold,
    isLowStock: p.stockQuantity <= p.lowStockThreshold && p.stockQuantity > 0,
    isOutOfStock: p.stockQuantity === 0,
    status: p.status,
    variants: p.variants,
  }));

  return apiSuccess({ items: inventoryItems });
}

export async function POST(request: NextRequest) {
  const auth = await requireOperations(request);
  if (!auth.authorized) return auth.response;

  const body = await request.json().catch(() => null);
  if (!body) return apiError("Invalid request payload", 400);

  const { productId, newStockQuantity, reason } = body;
  if (!productId || newStockQuantity === undefined) {
    return apiError("productId and newStockQuantity are required.", 400);
  }

  if (newStockQuantity < 0) {
    return apiError("Inventory quantity cannot be negative.", 400);
  }

  const updated = marketplaceStore.updateProduct(
    productId,
    { stockQuantity: Number(newStockQuantity) },
    { id: auth.user.id, name: auth.user.fullName, role: auth.user.roles[0] },
    reason || "Stock quantity adjusted by operations team"
  );

  return apiSuccess({
    message: "Inventory successfully updated.",
    product: {
      id: updated.id,
      sku: updated.sku,
      stockQuantity: updated.stockQuantity,
    },
  });
}

