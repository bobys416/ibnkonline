import { NextRequest } from "next/server";
import { getAllProducts, searchProducts, getProductBySlug, getProductsByCategory } from "@/lib/catalog";
import { apiSuccess } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const slug = searchParams.get("slug");
  const category = searchParams.get("category");

  if (slug) {
    const product = getProductBySlug(slug);
    return apiSuccess({ product: product || null });
  }

  if (category) {
    const products = getProductsByCategory(category);
    return apiSuccess({ products, total: products.length });
  }

  if (q) {
    const products = searchProducts(q);
    return apiSuccess({ products, total: products.length });
  }

  const products = getAllProducts();
  return apiSuccess({ products, total: products.length });
}

