/**
 * Shopify Storefront & Customer Integration Client
 * Powered by Vercel Integration credentials (SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN)
 */

export interface ShopifyStoreConfig {
  domain: string;
  isConfigured: boolean;
  shopId?: string;
  apiVersion: string;
}

export function getShopifyStoreConfig(): ShopifyStoreConfig {
  const domain =
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    "";
  const token =
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    "";
  const shopId =
    process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID ||
    process.env.SHOPIFY_SHOP_ID ||
    "";

  return {
    domain,
    isConfigured: Boolean(domain && token),
    shopId,
    apiVersion: "2024-04",
  };
}

export function isShopifyConfigured(): boolean {
  return getShopifyStoreConfig().isConfigured;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  pricePaise: number;
  currencyCode: string;
  images: string[];
  availableForSale: boolean;
  variants: {
    id: string;
    title: string;
    pricePaise: number;
    availableForSale: boolean;
  }[];
}

export async function shopifyFetch<T>({
  query,
  variables = {},
  cache = "no-store",
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
}): Promise<{ data?: T; errors?: Array<{ message: string }> }> {
  const { domain, isConfigured, apiVersion } = getShopifyStoreConfig();
  const token =
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    "";

  if (!isConfigured) {
    return { errors: [{ message: "Shopify Storefront API credentials are not configured in Vercel or environment." }] };
  }

  const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const endpoint = `https://${cleanDomain}/api/${apiVersion}/graphql.json`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
      cache,
    });

    if (!res.ok) {
      const text = await res.text();
      return { errors: [{ message: `Shopify HTTP ${res.status}: ${text}` }] };
    }

    const json = await res.json();
    return json;
  } catch (error) {
    return {
      errors: [
        {
          message: error instanceof Error ? error.message : "Failed to connect to Shopify API.",
        },
      ],
    };
  }
}

/**
 * Fetch published products from Shopify Storefront
 */
export async function getShopifyProducts(first = 20): Promise<ShopifyProduct[]> {
  const query = `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            availableForSale
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{
    products: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          handle: string;
          description: string;
          availableForSale: boolean;
          images: { edges: Array<{ node: { url: string; altText?: string } }> };
          variants: {
            edges: Array<{
              node: {
                id: string;
                title: string;
                availableForSale: boolean;
                price: { amount: string; currencyCode: string };
              };
            }>;
          };
        };
      }>;
    };
  }>({
    query,
    variables: { first },
  });

  if (!response.data?.products?.edges) {
    return [];
  }

  return response.data.products.edges.map(({ node }) => {
    const firstVariant = node.variants.edges[0]?.node;
    const priceAmount = parseFloat(firstVariant?.price?.amount || "0");
    const currency = firstVariant?.price?.currencyCode || "INR";
    // Convert to paise (e.g. 100 rupees = 10000 paise)
    const pricePaise = Math.round(priceAmount * 100);

    return {
      id: node.id,
      title: node.title,
      handle: node.handle,
      description: node.description,
      availableForSale: node.availableForSale,
      pricePaise,
      currencyCode: currency,
      images: node.images.edges.map((e) => e.node.url),
      variants: node.variants.edges.map((v) => ({
        id: v.node.id,
        title: v.node.title,
        pricePaise: Math.round(parseFloat(v.node.price.amount) * 100),
        availableForSale: v.node.availableForSale,
      })),
    };
  });
}

/**
 * Create a checkout or cart in Shopify from line items
 */
export async function createShopifyCartCheckout(
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<{ checkoutUrl?: string; error?: string }> {
  const query = `
    mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const response = await shopifyFetch<{
    cartCreate: {
      cart?: { id: string; checkoutUrl: string };
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>({
    query,
    variables: {
      input: {
        lines,
      },
    },
  });

  if (response.data?.cartCreate?.cart?.checkoutUrl) {
    return { checkoutUrl: response.data.cartCreate.cart.checkoutUrl };
  }

  const err =
    response.data?.cartCreate?.userErrors?.[0]?.message ||
    response.errors?.[0]?.message ||
    "Failed to create Shopify cart.";
  return { error: err };
}

