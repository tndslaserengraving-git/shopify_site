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
    next: { revalidate: 3600 },
  } as RequestInit);

  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);

  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(`Shopify GraphQL: ${json.errors[0].message}`);
  return json.data as T;
}

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
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
    url: `/shop/${raw.handle}`,
    priceRange: raw.priceRange,
    featuredImage: raw.featuredImage,
    collections: raw.collections.edges.map((e) => e.node),
  };
}

export async function getProducts(): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<ShopifyProductsResponse>(PRODUCTS_QUERY, { first: 100 });
  return data.products.edges.map((e) => normalizeProduct(e.node));
}

const PRODUCT_QUERY = `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      descriptionHtml
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
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id title availableForSale selectedOptions { name value } price {
              amount
              currencyCode
            }
            image {
              url
              altText
            }
          }
        }
      }
      options {
        name
        optionValues {
          name
          swatch {
            image {
              previewImage {
                url
              }
            }
          }
        }
      }
    }
  }
`;

export interface ShopifyVariant { id: string; title: string; availableForSale: boolean; selectedOptions: { name: string; value: string }[]; price: { amount: string; currencyCode: string };
  image?: { url: string; altText: string | null } | null;
}

export interface ShopifyProductOption {
  name: string;
  optionValues: { name: string; swatchImageUrl: string | null }[];
}

export interface ShopifyProductDetail {
  id: string;
  title: string;
  handle: string;
  descriptionHtml: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  featuredImage: { url: string; altText: string | null } | null;
  images: { url: string; altText: string | null }[];
  variants: ShopifyVariant[];
  options: ShopifyProductOption[];
}

type RawProductDetail = Omit<ShopifyProductDetail, 'images' | 'variants' | 'options'> & {
  images: { edges: { node: { url: string; altText: string | null } }[] };
  variants: { edges: { node: ShopifyVariant }[] };
  options: {
    name: string;
    optionValues: { name: string; swatch: { image: { previewImage: { url: string } | null } | null } | null }[];
  }[];
};

export async function getProduct(handle: string): Promise<ShopifyProductDetail | null> {
  const data = await shopifyFetch<{ product: RawProductDetail | null }>(PRODUCT_QUERY, { handle });
  if (!data.product) return null;
  return {
    ...data.product,
    images: data.product.images.edges.map((e) => e.node),
    variants: data.product.variants.edges.map((e) => e.node),
    options: data.product.options.map((o) => ({
      name: o.name,
      optionValues: o.optionValues.map((v) => ({
        name: v.name,
        swatchImageUrl: v.swatch?.image?.previewImage?.url ?? null,
      })),
    })),
  };
}

const CART_CREATE_MUTATION = `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { checkoutUrl }
      userErrors { field message }
    }
  }
`;

export async function createCart(
  variantId: string,
  quantity: number,
  attributes?: { key: string; value: string }[],
): Promise<string> {
  const line: Record<string, unknown> = { merchandiseId: variantId, quantity };
  if (attributes?.length) line.attributes = attributes;

  const data = await shopifyFetch<{
    cartCreate: {
      cart: { checkoutUrl: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>(CART_CREATE_MUTATION, { lines: [line] });

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }
  if (!data.cartCreate.cart) throw new Error('Cart creation failed');
  return data.cartCreate.cart.checkoutUrl;
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
