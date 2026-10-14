import { NextRequest } from "next/server";
import { requireOperations } from "@/lib/portal-auth";
import marketplaceStore from "@/lib/marketplace-store";
import { apiSuccess, apiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const auth = await requireOperations(request);
  if (!auth.authorized) return auth.response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as any;
  const categorySlug = searchParams.get("categorySlug") || undefined;
  const query = searchParams.get("query") || undefined;

  const products = marketplaceStore.getProducts({ status, categorySlug, query });
  return apiSuccess({ products, total: products.length });
}

export async function POST(request: NextRequest) {
  const auth = await requireOperations(request);
  if (!auth.authorized) return auth.response;

  const body = await request.json().catch(() => null);
  if (!body) return apiError("Invalid request payload", 400);

  const {
    name,
    sku,
    categorySlug,
    categoryName,
    brand,
    mrpPaise,
    sellingPricePaise,
    stockQuantity,
    taxCategory,
    description,
    shortDescription,
    images,
    specs,
    status = "DRAFT",
    isCodEligible = true,
    freeShipping = false,
    returnWindowDays = 7,
    merchantId,
  } = body;

  if (!name || !sku || !categorySlug || !sellingPricePaise || stockQuantity === undefined) {
    return apiError("Missing required product fields: name, sku, categorySlug, sellingPricePaise, stockQuantity.", 400);
  }

  // Safeguard: Check SKU uniqueness
  const existingSku = marketplaceStore.getProductBySku(sku);
  if (existingSku) {
    return apiError(`A product with SKU "${sku}" already exists. SKUs must be globally unique.`, 409);
  }

  // Safeguard: Pricing validation
  if (mrpPaise && sellingPricePaise > mrpPaise) {
    return apiError("Selling price cannot exceed the Maximum Retail Price (MRP).", 400);
  }

  if (stockQuantity < 0) {
    return apiError("Stock quantity cannot be negative.", 400);
  }

  // Operator cannot directly mark a product as PUBLISHED
  const initialStatus = status === "PUBLISHED" ? "PENDING_REVIEW" : status;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const merchant = merchantId ? marketplaceStore.getMerchantById(merchantId) : undefined;

  const product = marketplaceStore.createProduct(
    {
      name,
      slug: `${slug}-${sku.toLowerCase()}`,
      sku,
      categorySlug,
      categoryName: categoryName || categorySlug,
      brand: brand || "iBNK Essentials",
      mrpPaise: mrpPaise || sellingPricePaise,
      sellingPricePaise,
      stockQuantity,
      lowStockThreshold: body.lowStockThreshold || 5,
      taxCategory: taxCategory || "GST_18",
      description: description || name,
      shortDescription: shortDescription || description || name,
      images: Array.isArray(images) && images.length > 0 ? images : ["https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"],
      specs: specs || [],
      variants: body.variants || [
        { id: `var-${Date.now()}`, sku, name: "Standard", stockQuantity, sellingPricePaise, mrpPaise },
      ],
      status: initialStatus,
      isFeatured: Boolean(body.isFeatured),
      isNewArrival: Boolean(body.isNewArrival),
      isBestSeller: Boolean(body.isBestSeller),
      isCodEligible,
      freeShipping,
      returnWindowDays,
      merchantId,
      merchantName: merchant?.businessName,
      createdBy: auth.user.email,
    },
    { id: auth.user.id, name: auth.user.fullName, role: auth.user.roles[0] }
  );

  // If created directly with PENDING_REVIEW, also queue in Approval Requests
  if (initialStatus === "PENDING_REVIEW") {
    marketplaceStore.submitProductForApproval(
      product.id,
      { id: auth.user.id, name: auth.user.fullName, role: auth.user.roles[0] },
      "Submitted during product creation"
    );
  }

  return apiSuccess({ product }, 201);
}

