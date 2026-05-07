import type {
  ShopifyProduct,
  ShopifyCollection,
  ShopifyProductsResponse,
  ShopifyCollectionsResponse,
} from '@/types/shopify';

const API_VERSION = '2024-10';

function endpoint() {
  return `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;
}

function token() {
  return process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
}

async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const res = await fetch(endpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token(),
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  } as RequestInit);

  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(`Shopify GraphQL: ${json.errors[0].message}`);
  return json.data as T;
}

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          onlineStoreUrl
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
          }
          collections(first: 10) {
            edges {
              node {
                id
                title
                handle
              }
            }
          }
        }
      }
    }
  }
`;

const COLLECTIONS_QUERY = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`;

const SYSTEM_COLLECTIONS = new Set(['all', 'frontpage', 'automated-collection']);

function normalizeProduct(
  raw: ShopifyProductsResponse['products']['edges'][number]['node'],
): ShopifyProduct {
  return {
    id: raw.id,
    title: raw.title,
    handle: raw.handle,
    url: raw.onlineStoreUrl ?? `https://${process.env.SHOPIFY_STORE_DOMAIN}/products/${raw.handle}`,
    priceRange: raw.priceRange,
    featuredImage: raw.featuredImage,
    collections: raw.collections.edges.map((e) => e.node),
  };
}

export async function getProducts(): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<ShopifyProductsResponse>(PRODUCTS_QUERY, { first: 100 });
  return data.products.edges.map((e) => normalizeProduct(e.node));
}

export async function getCollections(): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<ShopifyCollectionsResponse>(COLLECTIONS_QUERY, { first: 50 });
  return data.collections.edges
    .map((e) => e.node)
    .filter((c) => !SYSTEM_COLLECTIONS.has(c.handle));
}

export function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}
