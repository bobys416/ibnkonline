import { NextResponse } from "next/server";
import { getShopifyStoreConfig, getShopifyProducts, isShopifyConfigured } from "@/lib/shopify/client";

export async function GET() {
  const config = getShopifyStoreConfig();

  if (!config.isConfigured) {
    return NextResponse.json({
      status: "unconfigured",
      configured: false,
      message: "Shopify Storefront credentials are not set or incomplete in Vercel environment.",
      domain: config.domain || null,
      shopId: config.shopId || null,
    });
  }

  try {
    // Attempt to probe shopify products
    const products = await getShopifyProducts(5);

    return NextResponse.json({
      status: "connected",
      configured: true,
      domain: config.domain,
      shopId: config.shopId,
      apiVersion: config.apiVersion,
      sampleProductCount: products.length,
      sampleProducts: products.map((p) => ({
        id: p.id,
        title: p.title,
        handle: p.handle,
        pricePaise: p.pricePaise,
        imagesCount: p.images.length,
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      configured: true,
      domain: config.domain,
      error: error instanceof Error ? error.message : "Shopify connection failed.",
    });
  }
}

